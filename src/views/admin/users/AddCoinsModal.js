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
  useColorModeValue,
  Flex,
  ModalCloseButton,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { userSchema } from "schema";
import { putApi } from "services/api";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/localSlice";
import { postApi } from "services/api";

const AddCoinsModal = (props) => {
  const {
    onClose,
    isOpen,
    fetchData,
    selectedUser,
    setDisplaySearchData,
    updateUsers,
  } = props;

  const user = JSON.parse(window.localStorage.getItem("user"));
  const tree = useSelector((state) => state.user);

  const bgColor = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("brand.300", "brand.100");
  const headerText = useColorModeValue("brand.700", "brand.900");
  const footerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const initialValues = {
    coins: "",
  };
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      AddCoins();
      resetForm();
    },
  });

  const dispatch = useDispatch();

  const handleCloseModal = () => {
    onClose();
    // Dispatch setUser action to set user data
  };
  const { errors, touched, values, handleBlur, handleChange, handleSubmit } =
    formik;

  const [isLoding, setIsLoding] = useState(false);

  const AddCoins = async () => {
    try {
      setIsLoding(true);

      let response = await postApi(`api/user/addCoins/${selectedUser._id}`, {
        coins: values.coins,
      });

      if (response && response.status === 200) {
        toast.success("Coins gifted to the user!");
        handleCloseModal();
        setDisplaySearchData(false);
        fetchData();

        // selectedUser.coins += values.coins;

        // updateUsers(selectedUser);

        // props?.setAction((pre) => !pre);
      } else {
        toast.error(response.response.data?.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };

  return (
    <Modal
      size="2xl"
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
        maxW={{ base: "full", sm: "90vw", md: "500px" }}
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
              Add Coins
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
              onClick={() => handleCloseModal()}
              icon={<CloseIcon />}
            />
          </Flex>
        </ModalHeader>
        <ModalBody>
          <Grid templateColumns="repeat(12, 1fr)" gap={3}>
            <GridItem colSpan={{ base: 12 }}>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Number of Coins
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.coins}
                name="coins"
                type="number"
                placeholder="No. of coins"
                fontWeight="500"
                borderColor={errors.coins && touched.coins ? "red.300" : null}
              />
              <Text mb="10px" color={"red"}>
                {" "}
                {errors.coins && touched.coins && errors.coins}
              </Text>
            </GridItem>
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
            onClick={() => handleCloseModal()}
          >
            close
          </Button>
          <Button
            size="sm"
            variant="solid"
            bg="brand.400"
            borderRadius={"md"}
            disabled={isLoding ? true : !values.coins}
            onClick={handleSubmit}
          >
            {isLoding ? <Spinner /> : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddCoinsModal;
