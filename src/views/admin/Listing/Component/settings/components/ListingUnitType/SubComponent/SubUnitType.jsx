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
import AppButton from "components/shared/AppButton";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const SubUnitType = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUnitType, setCurrentUnitType] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    unitType: "",
    name: "",
    status: true,
  });

  const [isUnitTypeModalOpen, setIsUnitTypeModalOpen] = useState(false);
  const [unitTypeForm, setUnitTypeForm] = useState({
    name: "",
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
    {
      path: `/listing/secondary/unit-types/sub-category/`,
      params: buildQueryParams(),
    },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  const { data: unitTypeData, refetch: refetchingUnitType } =
    useFetchItemsQuery(
      { path: `/listing/secondary/unit-types`, params: buildQueryParams() },
      { refetchOnMountOrArgChange: true, skip: !user._id }
    );

  const [createItemMuation] = useCreateItemMutation();
  const [updateItemMuation] = useUpdateItemMutation();
  const [deleteItemMutation] = useDeleteItemMutation();

  const columns = ["Main Type", "Sub Type", "Status", "Created At", "Actions"];

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUnitTypeInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUnitTypeForm({
      ...unitTypeForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await updateItemMuation({
          path: `/listing/secondary/unit-types/sub-category/${currentUnitType._id}`,
          body: formData,
        }).unwrap();
        toast.success("Unit Type updated successfully");
      } else {
        await createItemMuation({
          path: "/listing/secondary/unit-types/sub-category",
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

  const handleUnitTypeSave = async () => {
    try {
      await createItemMuation({
        path: "/listing/secondary/unit-types",
        body: unitTypeForm,
      }).unwrap();
      toast.success("Unit Type created successfully");
      setIsUnitTypeModalOpen(false);
      setUnitTypeForm({ name: "", status: true });
      refetchingUnitType();
      onOpen();
    } catch (error) {
      toast.error(error.data?.message || "Failed to create unit type");
    }
  };

  const handleEdit = (unitType) => {
    setCurrentUnitType(unitType);
    setFormData({
      unitType: unitType.unitType?._id || unitType.unitType || "",
      name: unitType.name || "",
      status: unitType.status,
    });
    setIsEditMode(true);
    onOpen();
  };

  const handleDelete = async (id) => {
    try {
      await deleteItemMutation({
        path: `/listing/secondary/unit-types/sub-category/${id}`,
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
      unitType: "",
      name: "",
      status: true,
    });
    setIsEditMode(false);
    setCurrentUnitType(null);
  };

  const handleStatusChange = async (type) => {
    try {
      const newStatus = !type.status;
      await updateItemMuation({
        path: `/listing/secondary/unit-types/sub-category/status/${type._id}`,
        body: { status: newStatus },
      }).unwrap();

      toast.success(`Listing type status updated successfully`);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(
        error.data?.message || "Failed to update listing type status"
      );
    }
  };

  console.log("Unit Type Data:", data);
  return (
    <Box overflowY="auto" scrollBehavior="smooth" boxShadow="sm" px={2}>
      <AppButton
        ml="2"
        leftIcon={<IoArrowBack />}
        onClick={() => navigate(-1)}
        mb={4}
      >
        Back
      </AppButton>
      <Box
        overflowY="auto"
        scrollBehavior="smooth"
        boxShadow="sm"
        bg="white"
        px={2}
      >
        <Flex
          justifyContent="space-between"
          alignItems={{ base: "flex-start", md: "center" }}
          flexDirection={{ base: "column", md: "row" }}
          p={3}
          gap={{ base: 3, md: 0 }}
        >
          <Text
            fontSize={{ base: "16px", md: "20px" }}
            fontWeight="bold"
            color="black"
            p={{ base: 1, md: 3 }}
            textAlign={{ base: "left", md: "inherit" }}
            w="100%"
          >
            Listing Sub Unit Types
          </Text>
          <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={{ base: 2, md: 5 }}
            w={{ base: "100%", md: "auto" }}
            align={{ base: "stretch", md: "center" }}
          >
            <Button
              size="md"
              variant="brand"
              leftIcon={<AddIcon />}
              py={3}
              px={6}
              w={{ base: "100%", md: "auto" }}
              onClick={() => {
                resetForm();
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
                  {data?.doc?.map((unitType) => (
                    <Tr key={unitType._id}>
                      <Td
                        py={4}
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="400"
                        minWidth="100px"
                        textAlign={"center"}
                      >
                        {unitType?.unitType?.name || "N/A"}
                      </Td>
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
                No listing unit types found.
              </Text>
            )}
          </Box>
        </Box>
        {/* Add/Edit Modal */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent
            mx={{ base: 2, sm: 4, md: 8 }}
            w={{ base: "95vw", sm: "90vw", md: "500px" }}
            maxW="100vw"
          >
            <ModalHeader>
              {isEditMode ? "Edit Unit Types" : "Add New Unit Types"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>
                  <Flex alignItems="center" justifyContent="space-between">
                    <span>Unit Type</span>
                    <IconButton
                      aria-label="Add Unit Type"
                      icon={<AddIcon />}
                      size="xs"
                      ml={2}
                      onClick={() => {
                        setIsUnitTypeModalOpen(true);
                        onClose();
                      }}
                    />
                  </Flex>
                </FormLabel>
                <Select
                  name="unitType"
                  value={formData.unitType}
                  onChange={handleInputChange}
                  placeholder="Select unit type"
                >
                  {unitTypeData?.doc?.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Sub Type</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter sub type"
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

        {/* Unit Type Modal */}
        <Modal
          isOpen={isUnitTypeModalOpen}
          onClose={() => {
            setIsUnitTypeModalOpen(false);
            onOpen();
          }}
          isCentered
        >
          <ModalOverlay />
          <ModalContent
            mx={{ base: 2, sm: 4, md: 8 }} // Responsive horizontal margin
            w={{ base: "95vw", sm: "90vw", md: "500px" }} // Responsive width
            maxW="100vw"
          >
            <ModalHeader>Create New Unit Type</ModalHeader>
            <ModalCloseButton
              onClick={() => {
                setIsUnitTypeModalOpen(false);
                onOpen();
              }}
            />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Unit Type Name</FormLabel>
                <Input
                  name="name"
                  value={unitTypeForm.name}
                  onChange={handleUnitTypeInputChange}
                  placeholder="Enter unit type name"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Active Status</FormLabel>
                <Switch
                  name="status"
                  isChecked={unitTypeForm.status}
                  onChange={handleUnitTypeInputChange}
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
                  setIsUnitTypeModalOpen(false);
                  onOpen();
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
                onClick={handleUnitTypeSave}
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
    </Box>
  );
};

export default SubUnitType;
