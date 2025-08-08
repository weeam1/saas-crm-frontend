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
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import TopPagination from "components/pagination/TopPagination";
import TableLoading from "components/loading/TableLoading";
import {
  useFetchItemsQuery,
  useCreateItemMutation,
  useDeleteItemMutation,
  useUpdateItemMutation,
} from "api/apiSlice";
import { useUserActivityLog } from "hooks/useUserActivityLog";

const ListingTypes = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentType, setCurrentType] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const { createUserLog } = useUserActivityLog();

  const [formData, setFormData] = useState({
    name: "",
    status: true,
  });

  const buildQueryParams = () => ({
    page: currentPage,
    limit: pageSize,
  });

  const { data, isLoading, isError, refetch, isFetching } = useFetchItemsQuery(
    { path: `/listing/secondary/types`, params: buildQueryParams() },
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await updateItemMutation({
          path: `/listing/secondary/types/${currentType._id}`,
          body: formData,
        }).unwrap();
        toast.success("Listing type updated successfully");
        createUserLog({
          userId: user?._id,
          action: "UPDATE",
          entity: "listing_Type",
          entityType: "SecondaryListingType",
          entityId: currentType._id,
          status: "success",
          message: `"${user?.fullName}" update the listing type "${currentType?.name || "Untitled"}".`,
        });
      } else {
        const response = await createItemMutation({
          path: "/listing/secondary/types",
          body: formData,
        }).unwrap();
        createUserLog({
          userId: user?._id,
          action: "CREATE",
          entity: "listing_Type",
          entityType: "SecondaryListingType",
          entityId: response?.doc._id,
          status: "success",
          message: `"${user?.fullName}" created the listing type "${response?.doc.name || "Untitled"}".`,
        });
        toast.success("Listing type created successfully");
      }
      resetForm();
      onClose();
      refetch();
    } catch (error) {
      console.error(error);
      const errorMsg =
        error?.data?.message ||
        "Failed to update the listing type. Please try again.";
      toast.error(error.data?.message || "An error occurred");
      isEditMode &&
        createUserLog({
          userId: user?._id,
          action: "UPDATE",
          entity: "listing_Type",
          entityType: "SecondaryListingType",
          entityId: currentType._id,
          status: error?.status === "500" ? "error" : "fail",
          message: errorMsg,
        });
    }
  };

  const handleEdit = (type) => {
    setCurrentType(type);
    setFormData({
      name: type.name,
      status: type.status,
    });
    setIsEditMode(true);
    onOpen();
  };

  const handleDelete = async (id) => {
    try {
      await deleteItemMutation({
        path: `/listing/secondary/types/${id}`,
      }).unwrap();
      toast.success("Listing type deleted successfully");
      createUserLog({
        userId: user?._id,
        action: "DELETE",
        entity: "listing_Type",
        entityType: "SecondaryListingType",
        entityId: id,
        status: "success",
        message: `"${user?.fullName}" deleted the listing type.`,
      });
      refetch();
    } catch (error) {
      const errorMsg =
        error?.data?.message ||
        "Failed to delete the listing type. Please try again.";
      console.error(error);
      toast.error(error.data?.message || "Failed to delete listing type");
      createUserLog({
        userId: user?._id,
        action: "DELETE",
        entity: "listing_Type",
        entityType: "SecondaryListingType",
        entityId: id,
        status: error?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      status: true,
    });
    setIsEditMode(false);
    setCurrentType(null);
  };

  const handleStatusChange = async (type) => {
    try {
      const newStatus = !type.status;
      const response = await updateItemMutation({
        path: `/listing/secondary/types/${type._id}`,
        body: { status: newStatus },
      }).unwrap();
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "listing_Type",
        entityType: "SecondaryListingType",
        entityId: response?.doc?._id,
        status: "success",
        message: `"${user?.fullName}" update the status of listing  Type "${response?.doc?.name || "Untitled"}".`,
      });
      toast.success(`Listing type status updated successfully`);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(
        error.data?.message || "Failed to update listing type status"
      );
      const errorMsg =
        error?.data?.message ||
        "Failed to delete the status of  listing type. Please try again.";
      createUserLog({
        userId: user?._id,
        action: "DELETE",
        entity: "listing_Type",
        entityType: "SecondaryListingType",
        entityId: type._id,
        status: error?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    }
  };
  return (
    <Box
      overflowY="auto"
      scrollBehavior="smooth"
      boxShadow="sm"
      bg="white"
      px={2}
      marginTop={"-16px"}
      marginLeft={"0px"}
    >
      <Flex justifyContent="space-between" alignItems="center" p={3}>
        <Text fontSize="20px" fontWeight="bold" color="black" p={3}>
          Listing Types
        </Text>
        <Button
          size="md"
          variant="brand"
          leftIcon={<AddIcon />}
          py={3}
          px={6}
          onClick={() => {
            resetForm();
            onOpen();
          }}
        >
          Add New
        </Button>
      </Flex>

      {/* Pagination Controls */}
      <Box mx={1} mb={1}>
        <TopPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          setPageSize={setPageSize}
          handlePageSize={handlePageSizeChange}
          refetching={isLoading}
          loading={isLoading}
        />
      </Box>

      <Box
        borderRadius="4px"
        boxShadow="sm"
        borderWidth="1px"
        overflow="hidden"
        mx={1}
      >
        <Box position="relative" maxH="120vh" overflowY="auto">
          <Table variant="striped" size="lg">
            <Thead
              position="sticky"
              top={0}
              bg="white"
              zIndex={2}
              boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
              fontSize={"16px"}
              borderRadius="lg"
            >
              <Tr>
                {columns.map((header, index) => (
                  <Th key={index} bg="brand.200" whiteSpace="nowrap" py={4}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="600"
                        color="gray.700"
                      >
                        {header}
                      </Text>
                    </Box>
                  </Th>
                ))}
              </Tr>
            </Thead>
            {isLoading && isFetching ? (
              <TableLoading columns={columns} length={7} py="4" />
            ) : (
              <Tbody>
                {data?.doc?.map((type) => (
                  <Tr key={type._id}>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {type.name || "N/A"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      <Switch
                        colorScheme="green"
                        isChecked={type.status}
                        onChange={() => handleStatusChange(type)}
                      />
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {new Date(type.createdAt).toLocaleDateString()}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      display={"flex"}
                      gap={2}
                      justifyContent={"center"}
                    >
                      <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        size="sm"
                        color={"#c09f5f"}
                        _hover={{ backgroundColor: "#c09f5f", color: "white" }}
                        onClick={() => handleEdit(type)}
                      />
                      <IconButton
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                        size="sm"
                        color={"#c09f5f"}
                        _hover={{ backgroundColor: "#c09f5f", color: "white" }}
                        onClick={() => handleDelete(type._id)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            )}
          </Table>
          {!isLoading && !isFetching && data?.doc?.length === 0 && (
            <Text textAlign="center" color="gray.500" py={6}>
              No listing types found.
            </Text>
          )}
        </Box>
      </Box>

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditMode ? "Edit Listing Type" : "Add New Listing Type"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Listing Type</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter listing type name"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Active Status</FormLabel>
              <Switch
                name="status"
                isChecked={formData.status}
                onChange={handleInputChange}
                colorScheme="green"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="outline"
              bg="#e2e8f0"
              size="md"
              w="100px"
              borderRadius="3px"
              mr={2}
              onClick={() => {
                onClose();
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              bg="#d99a36"
              color="white"
              w="100px"
              borderRadius="3px"
              size="md"
              onClick={handleSubmit}
              _hover={{ bg: "brand.400", color: "white" }}
              _active={{
                bg: "brand.300",
              }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ListingTypes;
