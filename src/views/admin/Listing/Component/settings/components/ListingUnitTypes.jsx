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
  Select,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import Pagination from "../../../../developers/components/Pagination";
import TableLoading from "components/loading/TableLoading";
import {
  useFetchItemsQuery,
  useCreateItemMutation,
  useDeleteItemMutation,
  useUpdateItemMutation,
} from "api/apiSlice";

const ListingUnitTypes = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUnitType, setCurrentUnitType] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [formData, setFormData] = useState({
    name: "",
    subType: "",
    status: true,
  });

  const buildQueryParams = () => {
    const params = {
      page: currentPage,
      limit: pageSize,
    };
    return params;
  };

  const { data, isLoading, isError, refetch, isFetching } = useFetchItemsQuery(
    { path: `/listing/secondary/unit-types`, params: buildQueryParams() },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  const [createItemMuation] = useCreateItemMutation();
  const [updateItemMuation] = useUpdateItemMutation();
  const [deleteItemMutation] = useDeleteItemMutation();

  const columns = ["Name", "Sub Type", "Status", "Created At", "Actions"];

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages || 0);
      setTotalItems(data.totalDocs || 0);
    }
  }, [data]);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize.target.value);
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
        await updateItemMuation({
          path: `/listing/secondary/unit-types/${currentUnitType._id}`,
          body: formData,
        }).unwrap();
        toast.success("Unit Type updated successfully");
      } else {
        await createItemMuation({
          path: "/listing/secondary/unit-types",
          body: formData,
        }).unwrap();
        toast.success("Unit Type created successfully");
      }
      resetForm();
      onClose();
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(error.data?.message || "An error occurred");
    }
  };

  const handleEdit = (unitType) => {
    setCurrentUnitType(unitType);
    setFormData({
      name: unitType.name,
      subType: unitType.subType || "",
      status: unitType.status,
    });
    setIsEditMode(true);
    onOpen();
  };

  const handleDelete = async (id) => {
    try {
      await deleteItemMutation({
        path: `/listing/secondary/unit-types/${id}`,
      }).unwrap();
      toast.success("Unit Type deleted successfully");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(error.data?.message || "Failed to delete unit type");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      subType: "",
      status: true,
    });
    setIsEditMode(false);
    setCurrentUnitType(null);
  };

  const handleStatusChange = async (type) => {
    try {
      const newStatus = !type.status;
      await updateItemMuation({
        path: `/listing/secondary/unit-types/${type._id}`,
        body: { status: newStatus },
      }).unwrap();
  
      toast.success(`Listing type status updated successfully`);
      refetch(); 
    } catch (error) {
      console.error(error);
      toast.error(error.data?.message || "Failed to update listing type status");
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
          Listing Unit Types
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

      <Box mx={1} mb={1}>
        <Pagination
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
        borderRadius="lg"
        boxShadow="sm"
        bg="white"
        maxH={"calc(60vh - 100px)"}
        overflowY="auto"
      >
        <Table variant="striped" size="lg" bg="white">
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
              {data?.doc?.map((unitType) => (
                <Tr key={unitType._id}>
                  <Td
                    py={4}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="400"
                    minWidth="100px"
                    textAlign={"center"}
                  >
                    {unitType.name || "N/A"}
                  </Td>
                  <Td
                    py={4}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="400"
                    minWidth="100px"
                    textAlign={"center"}
                  >
                    {unitType.subType || "N/A"}
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
                      isChecked={unitType.status}
                      onChange={() => handleStatusChange(unitType)} 
                    />
                  </Td>
                  <Td
                    py={4}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="400"
                    minWidth="100px"
                    textAlign={"center"}
                  >
                    {new Date(unitType.createdAt).toLocaleDateString()}
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
                      onClick={() => handleEdit(unitType)}
                    />
                    <IconButton
                      aria-label="Delete"
                      icon={<DeleteIcon />}
                      size="sm"
                      color={"#c09f5f"}
                      _hover={{ backgroundColor: "#c09f5f", color: "white" }}
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
            No listing unit types found.
          </Text>
        )}
      </Box>

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditMode ? "Edit Unit Type" : "Add New Unit Type"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Unit Type Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter unit type name"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Sub Type</FormLabel>
              <Input
                name="subType"
                value={formData.subType}
                onChange={handleInputChange}
                placeholder="Enter sub type (optional)"
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
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ListingUnitTypes;