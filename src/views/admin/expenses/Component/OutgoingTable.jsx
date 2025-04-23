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
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import AddOutgoingPaymentModal from "./Sub_Component/AddOutgoingPaymentModal";
import { FiFilter } from "react-icons/fi";
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
import Loader from "components/loading/Loader";

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
  return (
    <Box
      overflowY="auto"
      scrollBehavior="smooth"
      borderRadius="md"
      boxShadow="sm"
      bg="white"
      px={2}
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
        </Box>
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
              <Th
                bg="brand.200"
                whiteSpace="nowrap"
                py={4}
                fontSize={{ base: "12px", md: "14px" }}
                fontWeight="500"
                color="gray.700"
                textTransform={"capitalize"}
              >
                Date
              </Th>
              <Th
                bg="brand.200"
                whiteSpace="nowrap"
                py={4}
                fontSize={{ base: "12px", md: "14px" }}
                fontWeight="500"
                color="gray.700"
                textTransform={"capitalize"}
              >
                Number
              </Th>
              <Th
                bg="brand.200"
                whiteSpace="nowrap"
                py={4}
                fontSize={{ base: "12px", md: "14px" }}
                fontWeight="500"
                color="gray.700"
                textTransform={"capitalize"}
              >
                Type
              </Th>
              <Th
                bg="brand.200"
                whiteSpace="nowrap"
                py={4}
                fontSize={{ base: "12px", md: "14px" }}
                fontWeight="500"
                color="gray.700"
                textTransform={"capitalize"}
              >
                Description
              </Th>
              <Th
                bg="brand.200"
                whiteSpace="nowrap"
                py={4}
                fontSize={{ base: "12px", md: "14px" }}
                fontWeight="500"
                color="gray.700"
                textTransform={"capitalize"}
              >
                Added By
              </Th>
              <Th
                bg="brand.200"
                whiteSpace="nowrap"
                py={4}
                fontSize={{ base: "12px", md: "14px" }}
                fontWeight="500"
                color="gray.700"
                textTransform={"capitalize"}
              >
                Amount
              </Th>
              <Th
                bg="brand.200"
                whiteSpace="nowrap"
                py={4}
                fontSize={{ base: "12px", md: "14px" }}
                fontWeight="500"
                color="gray.700"
                textTransform={"capitalize"}
              >
                Action
              </Th>
            </Tr>
          </Thead>
          {(!isLoading && !isFetching) && (
            <Tbody>
              {data &&
                data.doc.map((row, index) => (
                  <Tr key={index}>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
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
                    >
                      {row.expenseNo ? row.expenseNo : "no data Found"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                    >
                      {row.type ? row.type : "no data Found"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
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
                    >
                      {row.amount ? row.amount : "no data Found"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      display={"flex"}
                      gap={2}
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
        {(!isLoading && !isFetching) && data?.doc?.length === 0 && (
          <Text textAlign="center" color="gray.500" py={6}>
            No expenses found.
          </Text>
        )}
        {(isLoading || isFetching) && (
          <Box
            display={"flex"}
            justifyContent={"center"}
            justifyItems={"center"}
            py={4}
          >
            <Loader />
          </Box>
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
