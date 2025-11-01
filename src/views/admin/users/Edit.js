/* eslint-disable react-hooks/exhaustive-deps */
import { CloseIcon, PhoneIcon } from "@chakra-ui/icons";
import {
  Button,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { userSchema } from "schema";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/localSlice";
import { useFetchItemsQuery } from "api/apiSlice";
import { jobTypes } from "utils/options";
import ImageUpload from "./components/ImageUpload";
import { useUpdateItemMutation } from "api/apiSlice";
import { getApi } from "services/api";
import ReplaceManager from "./components/ReplaceManager";
import { buttonStyle } from "utils/btn";
import PasswordPermission from "./components/PasswordPermission";
import { fetchActiveTree, fetchTree } from "./userApis";
import { currencyOptions } from "utils/options";
import useUserSession from "hooks/useUserSession";

const Edit = (props) => {
  const { onClose, isOpen, fetchData, data, userData, setEdit } = props;

  const [roles, setRoles] = useState([]);

  const bgColor = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("brand.300", "brand.100");
  const headerText = useColorModeValue("brand.700", "brand.900");
  const footerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const {
    isOpen: replaceIsOpen,
    onOpen: replaceOnOpen,
    onClose: replaceOnClose,
  } = useDisclosure();

  const {
    isOpen: passwordIsOpen,
    onOpen: passwordOnOpen,
    onClose: passwordOnClose,
  } = useDisclosure();

  const [replacementManager, setReplacementManager] = useState("");
  const [securityPassword, setSecurityPassword] = useState("");

  const controller = new AbortController();

  const [uploadImage, setUploadImage] = useState(false);

  const { data: agencies } = useFetchItemsQuery({
    path: "/agencies",
  });

  const initialValues = {
    firstName: data?.firstName ?? "",
    lastName: data?.lastName ?? "",
    username: data?.username ?? "",
    agency: data?.agency?._id ?? "",
    salary: data?.salary ?? "",
    salaryType: data?.salaryType ?? "",
    phoneNumber: data?.phoneNumber ?? "",
    profileImage: data?.profileImage ?? "",
    parent: data?.parent ?? "",
    target: data?.target ?? "",
    roles: data?.roles ?? [],
    role: data?.roles[0]?._id ?? "",
    currency: data?.currency ?? "AED",
  };

  const { user, isSuperAdmin } = useUserSession();

  const tree = useSelector((state) => state.user.activeTree);

  const filteredManagers = tree?.managers?.filter(
    (item) => item._id !== data?._id
  );

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: userSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      EditData();
    },
  });

  useEffect(() => {
    if (props.edit) {
      // Replace initial Data with your actual initial values
      formik.setValues(initialValues);
    }
  }, [props.edit]);

  const dispatch = useDispatch();

  const handleCloseModal = () => {
    setEdit(false);
    formik.resetForm();
  };

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = formik;

  const [updateItemMutation, { isLoading }] = useUpdateItemMutation();

  const EditData = async () => {
    try {
      const role = roles.find((role) => role?._id === values.role);

      const valuesObj = { ...values };

      if (
        data?.roles[0]?.roleName === "Manager" &&
        data?.roles[0]?.roleName !== role?.roleName &&
        !replacementManager &&
        role?.roleName !== "Agent"
      ) {
        replaceOnOpen();
        return;
      } else if (replacementManager) {
        valuesObj["replacementManager"] = replacementManager;
      }

      if (role?.roleName === "Agent") {
        if (!values.parent) {
          toast.error("Please select a manager.");
          return;
        }
        valuesObj["parent"] = values.parent;
        valuesObj["replacementManager"] = values.parent;

        setReplacementManager(values.parent);
      } else if (role?.roleName === "Manager") {
        delete valuesObj["parent"];
      } else {
        delete valuesObj["parent"];
      }

      if (
        !securityPassword &&
        (data?.roles[0]?.roleName !== role?.roleName || values?.password)
      ) {
        passwordOnOpen();
        return;
      }

      if (securityPassword)
        valuesObj["securityPassword"] = securityPassword?.trim();

      const bodyData = Object.entries(valuesObj).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] =
            key === "roles" && Array.isArray(value)
              ? value.map((role) => role.roleName).filter(Boolean)
              : value;
        }
        return acc;
      }, {});

      let response = await updateItemMutation({
        path: `/user/v2/edit/${props.selectedId}`,
        body: bodyData,
      }).unwrap();

      if (response?.status) {
        setEdit(false);
        let updatedUserData = userData;
        if (user?._id === props.selectedId) {
          if (updatedUserData && typeof updatedUserData === "object") {
            // Create a new object with the updated firstName
            updatedUserData = {
              ...updatedUserData,
              firstName: values?.firstName,
              lastName: values?.lastName,
            };
          }

          // const updatedDataString = JSON.stringify(updatedUserData);

          dispatch(setUser(updatedUserData));
        }

        console.log({ bodyData, values });

        if (user?._id === props.selectedId && bodyData?.password) {
          console.warn("reeload the pagee");
          window.location.reload();
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
        }

        if (props?.refrence === "table") {
          props.updateUsers(response?.user);
        } else fetchData();

        // formik.resetForm();
        props.setAction((pre) => !pre);

        // get updated users data
        // fetchActiveTree(dispatch);
        // fetchTree(dispatch);

        if (!controller.signal.aborted) {
          toast.success("User update successfully");
          setReplacementManager("");
          setSecurityPassword("");
          handleCloseModal();
        }
      }
    } catch (e) {
      console.log(e);
      if (!controller.signal.aborted) {
        toast.error(e?.data?.error || "User is not updated!");
        setReplacementManager("");
        setSecurityPassword("");
      }
    }
  };

  const fetchRoles = async () => {
    let result = await getApi("api/role-access");
    setRoles(result.data);
  };

  useEffect(() => {
    fetchRoles();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <Modal
        size="4xl"
        isOpen={isOpen}
        isCentered
        scrollBehavior="inside"
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent
          bg={bgColor}
          borderRadius="2xl"
          shadow="2xl"
          overflow="hidden"
          mx={{ base: 3, md: 0 }}
        >
          <ModalHeader p={0} borderBottom="1px solid" borderColor={borderColor}>
            <Flex
              bg={headerBg}
              color={headerText}
              px={6}
              py={3}
              position="sticky"
              top="0"
              zIndex="10"
              boxShadow="md"
            >
              <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
                Edit User
              </Text>
              <IconButton
                position="absolute"
                right="12px"
                top="10px"
                color={headerText}
                bg="whiteAlpha.200"
                size="sm"
                borderRadius={"md"}
                _hover={{ bg: "whiteAlpha.300" }}
                onClick={handleCloseModal}
                isDisabled={uploadImage}
                icon={<CloseIcon />}
              />
            </Flex>
          </ModalHeader>

          <ModalBody
            p={5}
            overflowY="auto"
            maxH="65vh"
            borderBottom="1px solid"
            borderColor={borderColor}
          >
            <Grid
              h={isSuperAdmin ? "60vh" : "50vh"}
              overflow={"scroll"}
              templateColumns="repeat(12, 1fr)"
              gap={3}
              p={4}
            >
              <GridItem colSpan={12}>
                <ImageUpload
                  profileImage={values?.profileImage}
                  formik={formik}
                  user={data}
                  setUploadImage={setUploadImage}
                />
              </GridItem>
              <GridItem colSpan={{ base: 6 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  First Name
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.firstName}
                  name="firstName"
                  placeholder="firstName"
                  fontWeight="500"
                  borderColor={
                    errors.firstName && touched.firstName ? "red.300" : null
                  }
                />
                <Text mb="10px" color={"red"}>
                  {errors.firstName && touched.firstName && errors.firstName}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 6 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Last Name
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.lastName}
                  name="lastName"
                  placeholder="Last Name"
                  fontWeight="500"
                  borderColor={
                    errors.lastName && touched.lastName ? "red.300" : null
                  }
                />
                <Text mb="10px" color={"red"}>
                  {errors.lastName && touched.lastName && errors.lastName}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 6 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Phone Number<Text color={"red"}>*</Text>
                </FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={
                      <PhoneIcon color="gray.300" borderRadius="16px" />
                    }
                  />
                  <Input
                    type="tel"
                    fontSize="sm"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phoneNumber}
                    name="phoneNumber"
                    fontWeight="500"
                    borderColor={
                      errors.phoneNumber && touched.phoneNumber
                        ? "red.300"
                        : null
                    }
                    placeholder="Phone number"
                    borderRadius="16px"
                  />
                </InputGroup>
                <Text mb="10px" color={"red"}>
                  {errors.phoneNumber &&
                    touched.phoneNumber &&
                    errors.phoneNumber}
                </Text>
              </GridItem>
              {isSuperAdmin && (
                <>
                  <GridItem colSpan={{ base: 6 }}>
                    <FormLabel
                      display="flex"
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      mb="8px"
                    >
                      Email
                    </FormLabel>
                    <Input
                      fontSize="sm"
                      type="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.username}
                      name="username"
                      placeholder="Email Address"
                      fontWeight="500"
                      borderColor={
                        errors.username && touched.username ? "red.300" : null
                      }
                    />
                    <Text mb="10px" color={"red"}>
                      {errors.username && touched.username && errors.username}
                    </Text>
                  </GridItem>
                  <GridItem colSpan={{ base: 6 }}>
                    <FormLabel
                      display="flex"
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      mb="8px"
                    >
                      Salary Type
                    </FormLabel>
                    <Select
                      name="salaryType"
                      value={values.salaryType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Select salary type"
                      borderColor={
                        errors.salaryType && touched.salaryType
                          ? "red.300"
                          : null
                      }
                    >
                      {jobTypes?.map((job) => (
                        <option key={job.value} value={job.value}>
                          {job.label}
                        </option>
                      ))}
                    </Select>

                    <Text mb="10px" color={"red"}>
                      {errors.salaryType &&
                        touched.salaryType &&
                        errors.salaryType}
                    </Text>
                  </GridItem>
                  <GridItem colSpan={{ base: 6 }}>
                    <FormLabel
                      display="flex"
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      mb="8px"
                    >
                      Salary
                    </FormLabel>
                    <Input
                      fontSize="sm"
                      type="number"
                      min={0}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.salary}
                      name="salary"
                      fontWeight="500"
                      borderColor={
                        errors.salary && touched.salary ? "red.300" : null
                      }
                    />
                    <Text mb="10px" color={"red"}>
                      {errors.salary && touched.salary && errors.salary}
                    </Text>
                  </GridItem>

                  {user?.roles[0]?.roleName !== "Manager" && (
                    <GridItem colSpan={{ base: 6 }}>
                      <FormLabel
                        display="flex"
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        mb="8px"
                      >
                        Select Role <Text color={"red"}>*</Text>
                      </FormLabel>
                      <Select
                        name="role"
                        value={values.role}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Select Role"
                        borderColor={
                          errors.role && touched.role ? "red.300" : null
                        }
                        className={
                          errors.role && touched.role ? "isInvalid" : null
                        }
                      >
                        {roles
                          ?.filter((role) => role.roleName !== "sadmin")
                          ?.map((role) => (
                            <option key={role?._id} value={role?._id}>
                              {role?.roleName}
                            </option>
                          ))}
                      </Select>
                      <Text mb="10px" color="red">
                        {errors.role && touched.role && errors.role}
                      </Text>
                    </GridItem>
                  )}
                  {roles.find((role) => role?._id === values.role)?.roleName ===
                    "Agent" && (
                    <GridItem colSpan={{ base: 6 }}>
                      <FormLabel
                        display="flex"
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        mb="8px"
                      >
                        Select Manager <Text color={"red"}>*</Text>
                      </FormLabel>
                      <Select
                        name="parent"
                        value={values.parent}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Select Manager"
                      >
                        {filteredManagers?.map((manager) => (
                          <option value={manager?._id}>
                            {manager?.firstName + " " + manager?.lastName}
                          </option>
                        ))}
                      </Select>
                    </GridItem>
                  )}

                  <GridItem colSpan={{ base: 6 }}>
                    <FormLabel
                      display="flex"
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      mb="8px"
                    >
                      Select agency <Text color={"red"}>*</Text>
                    </FormLabel>
                    <Select
                      name="agency"
                      value={values.agency}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Select agency"
                      borderColor={
                        errors.agency && touched.agency ? "red.300" : null
                      }
                    >
                      {agencies?.doc?.map((agency) => (
                        <option key={agency._id} value={agency._id}>
                          {agency.name}
                        </option>
                      ))}
                    </Select>

                    <Text mb="10px" color={"red"}>
                      {errors.agency && touched.agency && errors.agency}
                    </Text>
                  </GridItem>
                </>
              )}

              {(isSuperAdmin ||
                (user?.roles[0]?.roleName === "Manager" &&
                  user._id !== data._id)) && (
                <>
                  <GridItem colSpan={{ base: 6 }}>
                    <FormLabel
                      display="flex"
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      mb="8px"
                    >
                      Currency
                    </FormLabel>
                    <Select
                      name="currency"
                      value={values.currency}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isDisabled
                      placeholder="Select currency"
                      borderColor={
                        errors.currency && touched.currency ? "red.300" : null
                      }
                    >
                      {currencyOptions?.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </Select>

                    <Text mb="10px" color={"red"}>
                      {errors.currency && touched.currency && errors.currency}
                    </Text>
                  </GridItem>
                  <GridItem colSpan={{ base: 6 }}>
                    <FormLabel
                      display="flex"
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      mb="8px"
                    >
                      Target
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type="number"
                        fontSize="sm"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.target}
                        name="target"
                        fontWeight="500"
                        placeholder="Target"
                      />
                    </InputGroup>
                  </GridItem>
                </>
              )}

              {isSuperAdmin && (
                <GridItem colSpan={{ base: 6 }}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                  >
                    New Password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type="text"
                      fontSize="sm"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      name="password"
                      fontWeight="500"
                      placeholder="New Password"
                      borderRadius="16px"
                    />
                  </InputGroup>
                </GridItem>
              )}
            </Grid>
          </ModalBody>
          <ModalFooter
            position="sticky"
            bottom="0"
            bg={footerBg}
            borderTop="1px solid"
            borderColor={borderColor}
            py={3}
            px={5}
            zIndex="10"
            justifyContent="flex-end"
            gap={3}
          >
            <Button
              variant="outline"
              colorScheme="gray"
              size="sm"
              borderRadius="md"
              isDisabled={uploadImage}
              onClick={() => handleCloseModal()}
            >
              Close
            </Button>
            <Button
              {...buttonStyle}
              variant="solid"
              bg="brand.400"
              fontSize="md"
              aria-label="update"
              disabled={isLoading ? true : false}
              onClick={handleSubmit}
            >
              {isLoading ? <Spinner /> : "Update"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {replaceIsOpen && (
        <ReplaceManager
          isOpen={replaceIsOpen}
          onClose={replaceOnClose}
          managers={filteredManagers}
          replacementManager={replacementManager}
          handleProceed={() => {
            replaceOnClose();
            EditData();
          }}
          setReplacementManager={setReplacementManager}
        />
      )}

      {passwordIsOpen && (
        <PasswordPermission
          isOpen={passwordIsOpen}
          onClose={passwordOnClose}
          securityPassword={securityPassword}
          setSecurityPassword={setSecurityPassword}
          handleProceed={() => {
            passwordOnClose();
            EditData();
          }}
        />
      )}
    </>
  );
};

export default Edit;
