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
  FormLabel,
  Select,
  Input,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import AddOutgoingPaymentModal from "./Sub_Component/AddOutgoingPaymentModal";
import { FiFilter, FiDownload } from "react-icons/fi";
import {
  useFetchItemsQuery,
  useCreateItemMutation,
  useDeleteItemMutation,
  useUpdateItemMutation,
} from "api/apiSlice";
import { toast } from "react-toastify";
import moment from "moment";
import Pagination from "../../developers/components/Pagination";
import ExpenseInputModal from "./Sub_Component/ExpenseInputModal";
import TableLoading from "components/loading/TableLoading";
import * as XLSX from "xlsx";

const OutgoingTable = ({ month, year, refetchSummary }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agencyFilterOpen, setAgencyFilterOpen] = useState(false);
  const [tempSelectedAgency, setTempSelectedAgency] = useState("");
  const [selectionAgency, setSelectionAgency] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [agencies, setAgencies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteItemMutation] = useDeleteItemMutation();
  const [isOpenExpenseInputModal, setIsOpenExpenseInputModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [OpenExpenseInputModalData, setOpenExpenseInputModalData] =
    useState(null);
  const {
    isOpen: isDateModalOpen,
    onOpen: onDateModalOpen,
    onClose: onDateModalClose,
  } = useDisclosure();
  const [editingDate, setEditingDate] = useState({
    id: null,
    date: "",
    time: "",
  });
  const columns = [
    "Date",
    "Number",
    "Type",
    "Description",
    "Added By",
    "PRICE",
    "VAT %",
    "TOTAL Amount",
    "Action",
  ];
  const [updateItemMuation] = useUpdateItemMutation();
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize.target.value);
    setCurrentPage(1);
    refetch();
    refetchSummary();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const buildQueryParams = () => {
    const params = {
      page: currentPage,
      limit: pageSize,
    };
    if (selectionAgency) params.agency = selectionAgency;
    if (month && year) {
      params.month = month;
      params.year = year;
    }
    return params;
  };
  const { data, isLoading, isError, refetch, isFetching } = useFetchItemsQuery(
    { path: `/expenses`, params: buildQueryParams() },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  const [createItemMuation] = useCreateItemMutation();
  const handleAddPayment = async (newPayment) => {
    try {
      await createItemMuation({
        path: "/expenses",
        body: newPayment,
      }).unwrap();

      toast.success("Expense added successfully.");
      refetch();
      refetchSummary();
    } catch (error) {
      console.error(error);
      toast.error(error.data.message || "Lead not added");
    }
  };

  const {
    data: agencyData,
    isLoading: agencyLoading,
    error: agencyError,
  } = useFetchItemsQuery(
    { path: `/agencies` },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  useEffect(() => {
    if (agencyData && agencyData.doc) {
      setAgencies(agencyData.doc);
    }
    if (agencyError) {
      console.error("Error fetching agencies:", agencyError);
      setAgencies([]);
    }
  }, [agencyData, agencyError]);

  const handlerAgencyFilter = () => {
    setSelectionAgency(tempSelectedAgency);
    refetch();
    refetchSummary();
    setAgencyFilterOpen(false);
  };
  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages || 0);
      setTotalItems(data.totalDocs || 0);
    }
  }, [data]);

  const HandlerDeletion = async (invoiceId) => {
    try {
      await deleteItemMutation({
        path: `/expenses/${invoiceId}`,
        body: {},
      }).unwrap();
      toast.success("The expense has been deleted successfully.", {
        autoClose: 3000,
      });
      refetch();
      refetchSummary();
    } catch (error) {
      console.error("Failed to delete expense:", error);
      toast.error(
        error.data?.message ||
          "Failed to delete the expense. Please try again.",
        { autoClose: 3000 }
      );
    }
  };

  const handleUpdatedPayment = async (updatedPayment) => {
    try {
      await updateItemMuation({
        path: `/expenses/${OpenExpenseInputModalData._id}`,
        body: updatedPayment,
      }).unwrap();
      setIsOpenExpenseInputModal(false);
      setIsEditable(false);
      setOpenExpenseInputModalData(null);
      refetch();
      refetchSummary();
      toast.success("Expenses updated successfully.");
    } catch (error) {
      console.error("Failed to delete expense:", error);
      toast.error(
        error.data?.message ||
          "Failed to delete the expense. Please try again.",
        { autoClose: 3000 }
      );
    }
  };

  const exportToExcel = () => {
    if (!data || !data.doc || data.doc.length === 0) {
      toast.warning("No data to export");
      return;
    }

    try {
      const exportData = data.doc.map((item) => ({
        Date: item.createdAt
          ? moment(item.createdAt).format("MM/DD/YYYY hh:mmA")
          : "",
        Number: item.expenseNo || "",
        Type: item.type ? item.type.name : "",
        Description: item.description || "",
        "Added By": item.addedBy ? item.addedBy.fullName : "",
        PRICE: item.amount || "0",
        "VAT %": item.vat ? `${item.vat}%` : "0",
        "TOTAL Amount": item.totalAmount || "0",
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, "Payments");
      const fileName = `Payments_${moment().format("YYYY-MM-DD")}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success("Export successful!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };
  const handleDateCellClick = (item) => {
    const dateTime = moment(item.createdAt);
    setEditingDate({
      id: item._id,
      date: dateTime.format("YYYY-MM-DD"),
      time: dateTime.format("HH:mm"),
    });
    onDateModalOpen();
  };

  const updateData = async (id, updatedFields) => {
    try {
      const currentItem = data.doc.find((item) => item._id === id);
      if (!currentItem) {
        throw new Error("Item not found");
      }

      const updatedItem = { ...currentItem, ...updatedFields };
      await updateItemMuation({
        path: `/expenses/${id}`,
        body: updatedItem,
      }).unwrap();

      refetch();
      refetchSummary();
      return true;
    } catch (error) {
      console.error("Failed to update data:", error);
      toast.error(
        error.data?.message || "Failed to update the item. Please try again.",
        { autoClose: 3000 }
      );
      return false;
    }
  };

  const handleDateUpdate = async () => {
    if (!editingDate.id) return;

    try {
      const newDateTime = moment(
        `${editingDate.date} ${editingDate.time}`
      ).toISOString();

      const success = await updateData(editingDate.id, {
        createdAt: newDateTime,
      });

      if (success) {
        onDateModalClose();
        toast.success("Date updated successfully.");
      }
    } catch (error) {
      console.error("Failed to update date:", error);
      toast.error("Failed to update date. Please try again.");
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
    >
      <Flex justifyContent="space-between" alignItems="center" p={3}>
        <Text fontSize="20px" fontWeight="bold" color="black" p={3}>
          Payments
        </Text>
        <Box gap={2} display="flex" alignItems="center">
          <IconButton
            icon={<FiFilter />}
            onClick={() => setAgencyFilterOpen(true)}
            aria-label="Filter Date"
            colorScheme="brand"
            variant="solid"
            size="sm"
            borderRadius="full"
            boxShadow="md"
          />

          <Button
            size="md"
            variant="brand"
            leftIcon={<AddIcon />}
            py={3}
            px={6}
            onClick={() => setIsModalOpen(true)}
          >
            Add New
          </Button>
          <Button
            size="md"
            variant="outline"
            leftIcon={<FiDownload />}
            py={3}
            px={6}
            onClick={exportToExcel}
            colorScheme="green"
            mr={2}
          >
            Export
          </Button>
        </Box>
      </Flex>
      <Box mb={1}>
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
              {data &&
                data.doc.map((row, index) => (
                  <Tr key={index}>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                      onClick={() => handleDateCellClick(row)}
                      cursor={"pointer"}
                    >
                      {row.createdAt
                        ? moment(row.createdAt).format("MM/DD/YYYY hh:mmA")
                        : "no data Found"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {row.expenseNo ? row.expenseNo : "no data Found"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {row.type ? row.type.name : "no data Found"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {row.description ? row.description : "no data Found"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                    >
                      {row.addedBy.fullName
                        ? row.addedBy.fullName
                        : "no data Found"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {row.amount ? row.amount : "no data Found"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {row.vat ? `${row.vat}%` : "no data Found"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {row.totalAmount ? row.totalAmount : "no data Found"}
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
                        onClick={() => {
                          setIsEditable(true);
                          setOpenExpenseInputModalData(row);
                          setIsOpenExpenseInputModal(true);
                        }}
                        color={"#c09f5f"}
                        _hover={{ backgroundColor: "#c09f5f", color: "white" }}
                      />
                      <IconButton
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                        size="sm"
                        color={"#c09f5f"}
                        _hover={{ backgroundColor: "#c09f5f", color: "white" }}
                        onClick={() => HandlerDeletion(row._id)}
                      />
                      <IconButton
                        aria-label="View"
                        icon={<ViewIcon />}
                        size="sm"
                        color={"#c09f5f"}
                        _hover={{ backgroundColor: "#c09f5f", color: "white" }}
                        onClick={() => {
                          setIsEditable(false);
                          setOpenExpenseInputModalData(row);
                          setIsOpenExpenseInputModal(true);
                        }}
                      />
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          )}
        </Table>
        {!isLoading && !isFetching && data?.doc?.length === 0 && (
          <Text textAlign="center" color="gray.500" py={6}>
            No expenses found.
          </Text>
        )}
      </Box>
      <AddOutgoingPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPayment}
      />
      {/* Agency Filter Modal */}
      {agencyFilterOpen && (
        <Modal
          fontFamily="'DM Sans', sans-serif"
          onClose={() => setAgencyFilterOpen(false)}
          isOpen={agencyFilterOpen}
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Agency Filter</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormLabel fontSize="sm" fontWeight="600">
                Select Agency
              </FormLabel>
              <Select
                value={tempSelectedAgency}
                onChange={(e) => setTempSelectedAgency(e.target.value)}
                mb={4}
                focusBorderColor="brand.500"
              >
                <option value="">All</option>
                {agencies.length > 0 ? (
                  agencies.map((agency) => (
                    <option key={agency._id} value={agency._id}>
                      {agency.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No agencies available</option>
                )}
              </Select>
              {agencies.length === 0 && (
                <Text fontSize="sm" color="gray.500">
                  No agencies available at the moment.
                </Text>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                bg="#e2e8f0"
                size="md"
                w="100px"
                borderRadius="3px"
                mr={2}
                onClick={() => setAgencyFilterOpen(false)}
              >
                Close
              </Button>
              <Button
                bg="#d99a36"
                color="white"
                w="100px"
                borderRadius="3px"
                size="md"
                onClick={handlerAgencyFilter}
              >
                Apply
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <Modal isOpen={isDateModalOpen} onClose={onDateModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Date & Time</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Box>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={editingDate.date}
                  onChange={(e) =>
                    setEditingDate({ ...editingDate, date: e.target.value })
                  }
                  focusBorderColor="brand.500"
                />
              </Box>
              <Box>
                <FormLabel>Time</FormLabel>
                <Input
                  type="time"
                  value={editingDate.time}
                  onChange={(e) =>
                    setEditingDate({ ...editingDate, time: e.target.value })
                  }
                  focusBorderColor="brand.500"
                />
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onDateModalClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleDateUpdate}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ExpenseInputModal
        isOpen={isOpenExpenseInputModal}
        onClose={() => setIsOpenExpenseInputModal(false)}
        data={OpenExpenseInputModalData}
        isEditable={isEditable}
        onSubmit={handleUpdatedPayment}
      />
    </Box>
  );
};

export default OutgoingTable;
