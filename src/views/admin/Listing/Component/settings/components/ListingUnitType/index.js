import { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Text,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Switch,
  Stack,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import TableLoading from "components/loading/TableLoading";
import {
  useFetchItemsQuery,
  useCreateItemMutation,
  useDeleteItemMutation,
  useUpdateItemMutation,
} from "api/apiSlice";
import TopPagination from "components/pagination/TopPagination";
import { useNavigate } from "react-router-dom";
import { useUserActivityLog } from "hooks/useUserActivityLog";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useModalColors } from "hooks/useModalColors";
import { FiRefreshCw } from "react-icons/fi";

const UnitTypeSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .required("Unit type name is required"),
  status: Yup.boolean().required(),
});

const UnitType = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUnitType, setCurrentUnitType] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const { createUserLog } = useUserActivityLog();
  const navigate = useNavigate();

  const { headerBg, headerText, footerBg, borderColor } = useModalColors();

  const { data, isLoading, isError, refetch, isFetching } = useFetchItemsQuery(
    {
      path: `/listing/secondary/unit-types`,
      params: { page: currentPage, limit: pageSize },
    },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  const [createItemMutation] = useCreateItemMutation();
  const [updateItemMutation] = useUpdateItemMutation();
  const [deleteItemMutation] = useDeleteItemMutation();

  const columns = ["Name", "Status", "Created At", "Actions"];

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages || 0);
      setTotalItems(data.totalDocs || 0);
    }
  }, [data]);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    refetch();
  };

  const handleSubmit = async (values) => {
    try {
      if (isEditMode) {
        await updateItemMutation({
          path: `/listing/secondary/unit-types/${currentUnitType._id}`,
          body: values,
        }).unwrap();
        toast.success("Unit Type updated successfully");
        createUserLog({
          userId: user?._id,
          action: "UPDATE",
          entity: "listing_Unit_Type",
          entityType: "SecondaryListingUnitType",
          entityId: currentUnitType._id,
          status: "success",
          message: `"${user?.fullName}" updated the Unit Type "${currentUnitType?.name || "Untitled"}".`,
        });
      } else {
        const response = await createItemMutation({
          path: "/listing/secondary/unit-types",
          body: values,
        }).unwrap();
        toast.success("Unit Type created successfully");
        createUserLog({
          userId: user?._id,
          action: "CREATE",
          entity: "listing_Unit_Type",
          entityType: "SecondaryListingUnitType",
          entityId: response?.doc?._id,
          status: "success",
          message: `"${user?.fullName}" created the Unit Type "${response?.doc?.name || "Untitled"}".`,
        });
      }
      onClose();
      setIsEditMode(false);
      setCurrentUnitType(null);
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "An error occurred");
      const errorMsg =
        error?.data?.message ||
        `Failed to ${isEditMode ? "update" : "create"} the Unit Type. Please try again.`;
      createUserLog({
        userId: user?._id,
        action: isEditMode ? "UPDATE" : "CREATE",
        entity: "listing_Unit_Type",
        entityType: "SecondaryListingUnitType",
        entityId: currentUnitType?._id,
        status: error?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    }
  };

  const handleEdit = (unitType) => {
    setCurrentUnitType(unitType);
    setIsEditMode(true);
    onOpen();
  };

  const handleDelete = async (id) => {
    try {
      await deleteItemMutation({
        path: `/listing/secondary/unit-types/${id}`,
      }).unwrap();
      toast.success("Unit Type deleted successfully");
      createUserLog({
        userId: user?._id,
        action: "DELETE",
        entity: "listing_Unit_Type",
        entityType: "SecondaryListingUnitType",
        entityId: id,
        status: "success",
        message: `"${user?.fullName}" deleted the Unit Type.`,
      });
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete unit type");
      const errorMsg =
        error?.data?.message || "Failed to delete Unit Type. Please try again.";
      createUserLog({
        userId: user?._id,
        action: "DELETE",
        entity: "listing_Unit_Type",
        entityType: "SecondaryListingUnitType",
        entityId: id,
        status: error?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    }
  };

  const handleStatusChange = async (type) => {
    try {
      const newStatus = !type?.status;
      const response = await updateItemMutation({
        path: `/listing/secondary/unit-types/${type._id}`,
        body: { status: newStatus },
      }).unwrap();
      toast.success(`Unit type status updated successfully`);
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "listing_Unit_Type",
        entityType: "SecondaryListingUnitType",
        entityId: response?.doc?._id,
        status: "success",
        message: `"${user?.fullName}" updated the status of Unit Type "${response?.doc?.name || "Untitled"}".`,
      });
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to update unit type status");
      const errorMsg =
        error?.data?.message ||
        "Failed to update Unit Type status. Please try again.";
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "listing_Unit_Type",
        entityType: "SecondaryListingUnitType",
        entityId: type._id,
        status: error?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    }
  };

  return (
    <Box overflowY="auto" bg="white" px={2} marginTop="-16px">
      <Flex
        justifyContent="space-between"
        alignItems={{ base: "flex-start", md: "center" }}
        flexDirection={{ base: "column", md: "row" }}
        p={3}
        gap={{ base: 3, md: 0 }}
      >
        <Text fontSize={"20px"} fontWeight="bold">
          Listing Unit Types
        </Text>
        <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
          <IconButton
            icon={<FiRefreshCw />}
            aria-label="Refresh Analytics"
            onClick={() => refetch()}
            isLoading={isLoading || isFetching}
            variant="outline"
            size="sm"
          />
          <Button
            size="sm"
            borderRadius={"md"}
            variant="brand"
            onClick={() => navigate("/listing/settings/sub-unit-types")}
          >
            Sub Unit type
          </Button>
          <Button
            size="sm"
            borderRadius={"md"}
            variant="brand"
            leftIcon={<AddIcon />}
            onClick={() => {
              setIsEditMode(false);
              setCurrentUnitType(null);
              onOpen();
            }}
          >
            Add New
          </Button>
        </Stack>
      </Flex>

      <Box mx={1} mb={1}>
        <TopPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          setPageSize={setPageSize}
          handlePageSize={handlePageSizeChange}
          refetching={isLoading}
          loading={isLoading}
        />
      </Box>

      <Box borderRadius="4px" boxShadow="sm" borderWidth="1px" mx={1}>
        <Box position="relative" maxH="120vh" overflowY="auto">
          <Table variant="striped" size="lg">
            <Thead position="sticky" top={0} bg="white" zIndex={2}>
              <Tr>
                {columns.map((header, index) => (
                  <Th key={index} bg="brand.200" py={4}>
                    <Text fontSize="14px" fontWeight="600">
                      {header}
                    </Text>
                  </Th>
                ))}
              </Tr>
            </Thead>
            {isLoading || isFetching ? (
              <TableLoading columns={columns} length={20} py="4" />
            ) : (
              <Tbody>
                {data?.doc?.map((unitType) => (
                  <Tr key={unitType._id}>
                    <Td textAlign="center">{unitType.name || "N/A"}</Td>
                    <Td textAlign="center">
                      <Switch
                        colorScheme="green"
                        isChecked={unitType.status}
                        onChange={() => handleStatusChange(unitType)}
                      />
                    </Td>
                    <Td textAlign="center">
                      {new Date(unitType.createdAt).toLocaleDateString()}
                    </Td>
                    <Td textAlign="center">
                      <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        size="sm"
                        color={"#c09f5f"}
                        _hover={{
                          backgroundColor: "#c09f5f",
                          color: "white",
                        }}
                        onClick={() => handleEdit(unitType)}
                      />
                      <IconButton
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                        size="sm"
                        color={"#c09f5f"}
                        _hover={{
                          backgroundColor: "#c09f5f",
                          color: "white",
                        }}
                        onClick={() => handleDelete(unitType._id)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            )}
          </Table>
          {!isLoading && !isFetching && data?.doc?.length === 0 && (
            <Text textAlign="center" color="gray.500" py={6}>
              No unit types found.
            </Text>
          )}
        </Box>
      </Box>

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent w="500px" maxW="95%" borderRadius="2xl" overflow="hidden">
          <ModalHeader
            display="flex"
            align="center"
            justify="space-between"
            bg={headerBg}
            color={headerText}
            px={6}
            py={3}
            borderBottom="1px solid"
            borderColor={borderColor}
            position="sticky"
            top="0"
            zIndex="10"
          >
            <Text fontSize="lg" fontWeight="bold">
              {isEditMode ? "Edit Main Unit Type" : "Add New Main Unit Type"}
            </Text>
            <ModalCloseButton
              position="absolute"
              right="12px"
              top="10px"
              color={headerText}
              _hover={{ bg: "whiteAlpha.200" }}
            />
          </ModalHeader>

          <Formik
            enableReinitialize
            initialValues={{
              name: currentUnitType?.name || "",
              status: currentUnitType?.status ?? true,
            }}
            validationSchema={UnitTypeSchema}
            onSubmit={async (values, { setSubmitting }) => {
              await handleSubmit(values);
              setSubmitting(false);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit}>
                <ModalBody
                  p={5}
                  overflowY="auto"
                  scrollBehavior="smooth"
                  sx={{
                    "&::-webkit-scrollbar": { width: "6px" },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#c1c1c1",
                      borderRadius: "10px",
                    },
                  }}
                >
                  <FormControl isInvalid={touched.name && errors.name}>
                    <FormLabel>Unit Type Name</FormLabel>
                    <Input
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      placeholder="Enter unit type name"
                    />
                    {touched.name && errors.name && (
                      <Text color="red.500" fontSize="sm">
                        {errors.name}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Active Status</FormLabel>
                    <Switch
                      name="status"
                      isChecked={values.status}
                      onChange={handleChange}
                      colorScheme="green"
                    />
                  </FormControl>
                </ModalBody>

                <ModalFooter
                  bg={footerBg}
                  borderTop="1px solid"
                  borderColor={borderColor}
                  position="sticky"
                  bottom="0"
                  zIndex="10"
                  py={3}
                  px={5}
                  justifyContent="flex-end"
                  gap={3}
                >
                  <Button
                    variant="outline"
                    borderRadius="md"
                    size="sm"
                    mr={3}
                    onClick={() => {
                      onClose();
                      setIsEditMode(false);
                      setCurrentUnitType(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    bg="#d99a36"
                    color="white"
                    size="sm"
                    borderRadius="md"
                    isLoading={isSubmitting}
                  >
                    Save
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UnitType;
