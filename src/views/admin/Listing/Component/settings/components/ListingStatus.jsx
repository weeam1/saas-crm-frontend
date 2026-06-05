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
import Pagination from "../../../../developers/components/Pagination";
import TableLoading from "components/loading/TableLoading";
import {
  useFetchItemsQuery,
  useCreateItemMutation,
  useDeleteItemMutation,
  useUpdateItemMutation,
} from "api/apiSlice";
import { useModalColors } from "hooks/useModalColors";
import RefreshButton from "components/refresh/RefreshButton";
import CustomTooltip from "components/shared/CustomTooltip";

const ListingStatus = () => {
  const colors = useModalColors();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [formData, setFormData] = useState({
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
    { path: `/listing/secondary/statuses`, params: buildQueryParams() },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  const [createItemMuation] = useCreateItemMutation();
  const [updateItemMuation] = useUpdateItemMutation();
  const [deleteItemMutation] = useDeleteItemMutation();

  const columns = ["Name", "Status", "Created At", "Actions"];

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
          path: `/listing/secondary/statuses/${currentStatus._id}`,
          body: formData,
        }).unwrap();
        toast.success("Status updated successfully");
      } else {
        await createItemMuation({
          path: "/listing/secondary/statuses",
          body: formData,
        }).unwrap();
        toast.success("Status created successfully");
      }
      resetForm();
      onClose();
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(error.data?.message || "An error occurred");
    }
  };

  const handleEdit = (status) => {
    setCurrentStatus(status);
    setFormData({
      name: status.name,
      status: status.status,
    });
    setIsEditMode(true);
    onOpen();
  };

  const handleDelete = async (id) => {
    try {
      await deleteItemMutation({
        path: `/listing/secondary/statuses/${id}`,
      }).unwrap();
      toast.success("Status deleted successfully");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(error.data?.message || "Failed to delete status");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      status: true,
    });
    setIsEditMode(false);
    setCurrentStatus(null);
  };

  const handleStatusChange = async (type) => {
    try {
      const newStatus = !type.status;
      await updateItemMuation({
        path: `/listing/secondary/statuses/${type._id}`,
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

  return (
    <Box
      boxShadow={colors.cardShadow}
      bg={colors.bg}
      px={2}
      marginTop={"-16px"}
      marginLeft={"-4px"}
      borderRadius="lg"
      border="1px solid"
      borderColor={colors.borderColor}
    >
      <Flex justifyContent="space-between" alignItems="center" p={3}>
        <Text fontSize="20px" fontWeight="bold" color={colors.headingText} p={3}>
          Listing Statuses
        </Text>
        <Flex alignItems={"center"} gap={2}>
          <Button
            size="sm"
            borderRadius={"md"}
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
          <RefreshButton
	label="Refresh"
	onClick={() => refetch()}
	isLoading={isLoading || isFetching}
	isFetching={isLoading || isFetching}
	size="sm"
/>
        </Flex>
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
        boxShadow={colors.cardShadow}
        borderWidth="1px"
        borderColor={colors.borderColor}
        overflow="hidden"
      >
        <Box position="relative" maxH="120vh" overflowY="auto">
          <Table variant="simple" size="lg">
            <Thead
              position="sticky"
              top={0}
              bg={colors.bgDeep}
              zIndex={2}
              boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
              fontSize={"16px"}
              borderRadius="lg"
            >
              <Tr>
                {columns.map((header, index) => (
                  <Th key={index} bg={colors.bgDeep} whiteSpace="nowrap" py={4} borderColor={colors.borderColor}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="600"
                        color={colors.headingText}
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
                {data?.doc?.map((status) => (
                  <Tr key={status._id} borderColor={colors.borderColor}>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                      color={colors.bodyText}
                      borderColor={colors.borderColor}
                    >
                      {status.name || "N/A"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                      borderColor={colors.borderColor}
                    >
                      <Switch
                        colorScheme="yellow"
                        isChecked={status.status}
                        onChange={() => handleStatusChange(status)}
                      />
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                      color={colors.bodyText}
                      borderColor={colors.borderColor}
                    >
                      {new Date(status.createdAt).toLocaleDateString()}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      display={"flex"}
                      gap={2}
                      justifyContent={"center"}
                      borderColor={colors.borderColor}
                    >
                      <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        size="sm"
                        variant="ghost"
                        color={colors.accentGold}
                        _hover={{ bg: colors.bgDeep, color: colors.goldLight }}
                        onClick={() => handleEdit(status)}
                      />
                      <IconButton
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                        size="sm"
                        variant="ghost"
                        color={colors.badgeErrorText}
                        _hover={{ bg: colors.badgeErrorBg, color: colors.badgeErrorText }}
                        onClick={() => handleDelete(status._id)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            )}
          </Table>
          {!isLoading && !isFetching && data?.doc?.length === 0 && (
            <Text textAlign="center" color={colors.mutedText} py={6}>
              No listing statuses found.
            </Text>
          )}
        </Box>
      </Box>

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(4px)" />
        <ModalContent bg={colors.bg} borderRadius="2xl" boxShadow={colors.modalShadow} border="1px solid" borderColor={colors.borderColor}>
          <ModalHeader bg={colors.headerBg} color={colors.headerText} borderTopRadius="2xl">
            {isEditMode ? "Edit Status" : "Add New Status"}
          </ModalHeader>
          <ModalCloseButton color={colors.headerText} _hover={{ bg: colors.closeBtnHoverBg }} />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel color={colors.labelColor}>Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter status name"
                bg={colors.bgInput}
                borderColor={colors.borderColor}
                color={colors.headingText}
                _placeholder={{ color: colors.mutedText }}
                _hover={{ borderColor: colors.accentGold }}
                _focus={{
                  borderColor: colors.accentGold,
                  boxShadow: `0 0 0 1px ${colors.accentGold}`,
                }}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel color={colors.labelColor}>Active Status</FormLabel>
              <Switch
                name="status"
                isChecked={formData.status}
                onChange={handleInputChange}
                colorScheme="yellow"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter bg={colors.footerBg} borderTop="1px solid" borderColor={colors.borderColor}>
            <Button
              variant="outline"
              size="md"
              w="100px"
              borderRadius="md"
              mr={2}
              onClick={() => {
                onClose();
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="brand"
              w="100px"
              borderRadius="md"
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

export default ListingStatus;