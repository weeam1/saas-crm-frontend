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
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon, DownloadIcon } from "@chakra-ui/icons";
import { FiFilter } from "react-icons/fi";
import { useFetchItemsQuery, useDeleteItemMutation } from "api/apiSlice";
import { toast } from "react-toastify";
import moment from "moment";
import Pagination from "../../developers/components/Pagination";
import TableLoading from "components/loading/TableLoading";
import * as XLSX from "xlsx";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import AddEditCashModal from "./Sub_Component/AddEditCashModal";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";

const IncomingCashTable = ({ month, year, refetchSummary }) => {
  const [agencyFilterOpen, setAgencyFilterOpen] = useState(false);
  const [tempSelectedAgency, setTempSelectedAgency] = useState("");
  const [selectionAgency, setSelectionAgency] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [agencies, setAgencies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedCash, setSelectedCash] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [deleteItemMutation] = useDeleteItemMutation();
  const { createUserLog } = useUserActivityLog();

  const columns = [
    "Date",
    "Payment Method",
    "Agency",
    "Amount",
    "Description",
    "Added By",
    "Action",
  ];

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize.target.value);
    setCurrentPage(1);
    refetch();
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
    { path: `expensev2/incoming-cash`, params: buildQueryParams() },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

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

  const handleAddNew = () => {
    setSelectedCash(null);
    onOpen();
  };

  const handleEdit = (cash) => {
    setSelectedCash(cash);
    onOpen();
  };

  const handleDelete = async (cashId) => {
    try {
      await deleteItemMutation({
        path: `expensev2/incoming-cash/${cashId}`,
        body: {},
      }).unwrap();
      toast.success("The cash entry has been deleted successfully.", {
        autoClose: 3000,
      });
      refetch();
      refetchSummary();
      createUserLog({
        userId: user?._id,
        action: "DELETE",
        entity: "Expense",
        entityType: "IncomingCash",
        entityId: cashId,
        status: "success",
        message: `${user?.fullName} deleted incoming cash entry.`,
      });
    } catch (error) {
      console.error("Failed to delete cash entry:", error);
      toast.error(
        error.data?.message ||
          "Failed to delete the cash entry. Please try again.",
        { autoClose: 3000 }
      );
      const errorMsg =
        error?.data?.message ||
        "Failed to delete the incoming cash entry. Please try again.";
      createUserLog({
        userId: user?._id,
        action: "DELETE",
        entity: "Expense",
        entityType: "IncomingCash",
        entityId: cashId || null,
        status: error?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    }
  };

  const exportToExcel = () => {
    if (!data || !data?.balances || data?.balances.length === 0) {
      toast.warning("No data to export");
      return;
    }

    try {
      const exportData = data?.balances.map((item) => ({
        Date: item.createdAt
          ? moment(item.createdAt).format("MM/DD/YYYY hh:mmA")
          : "",
        "Payment Method": item.paymentMethod || "",
        Agency: item.agency ? item.agency.name : "",
        Amount: item.amount || "0",
        Description: item.description || "",
        "Added By": item.addedBy ? item.addedBy.fullName : "",
      }));

      console.log("exportData", exportData);
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, "Incoming Cash");
      const fileName = `Balance_${moment().format("YYYY-MM-DD")}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success("Export successful!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  const handleSuccess = () => {
    refetchSummary();
    refetch();
    onClose();
  };

  return (
    <Box
      overflowY="auto"
      scrollBehavior="smooth"
      boxShadow="sm"
      bg="white"
      px={2}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p={3}
        flexDir={{ base: "column", sm: "column", md: "row" }}
        gap={1}
      >
        <Text fontSize="20px" fontWeight="bold" color="black" p={3}>
          Incoming Cash
        </Text>
        <Box
          gap={2}
          display="flex"
          alignItems="center"
          flexDir={{ base: "column", sm: "column", md: "row" }}
        >
          <IconButton
            icon={<FiFilter />}
            onClick={() => setAgencyFilterOpen(true)}
            aria-label="Filter Agency"
            colorScheme="brand"
            variant="solid"
            size="sm"
            borderRadius="full"
            boxShadow="md"
          />

          <Button
            size="sm"
            borderRadius={"md"}
            variant="brand"
            leftIcon={<AddIcon />}
            py={3}
            px={6}
            onClick={handleAddNew}
          >
            Add New
          </Button>

          <Button
            size="sm"
            borderRadius={"md"}
            leftIcon={<DownloadIcon />}
            py={3}
            px={6}
            onClick={exportToExcel}
            bg={"green.400"}
            _hover={{ bg: "green.500" }}
            mr={2}
            color={"white"}
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
        <Table variant="striped" size="sm" bg="white">
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
          {isLoading || isFetching ? (
            <TableLoading columns={columns} length={8} py="4" />
          ) : (
            <Tbody>
              {data && data?.balances?.length > 0 ? (
                data?.balances?.map((row, index) => (
                  <Tr key={index}>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {row.createdAt
                        ? moment(row.createdAt).format("MM/DD/YYYY hh:mmA")
                        : "-"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                      textTransform="capitalize"
                    >
                      {row.paymentMethod || "-"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {row?.agency?.name ? row.agency.name : "-"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {row.amount ? row.amount.toFixed(2) : "0.00"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {row.description ? row.description : "-"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {row?.addedBy?.fullName ? row.addedBy.fullName : "-"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      display={"flex"}
                      justifyContent={"center"}
                    >
                      <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        size="sm"
                        onClick={() => handleEdit(row)}
                        color={"#c09f5f"}
                        _hover={{ backgroundColor: "#c09f5f", color: "white" }}
                        mr={2}
                      />
                      <IconButton
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                        size="sm"
                        color={"#c09f5f"}
                        onClick={() => handleDelete(row._id)}
                        _hover={{ backgroundColor: "#c09f5f", color: "white" }}
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr borderColor="gray.200" textAlign="center">
                  <Td
                    borderBottom="none"
                    colSpan="13"
                    fontSize={{ base: "12px", md: "15px" }}
                    fontWeight="500"
                    color="gray.500"
                    textAlign="center"
                  >
                    <NoData label="incoming cash" />
                  </Td>
                </Tr>
              )}
            </Tbody>
          )}
        </Table>
      </Box>

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

      {/* Add/Edit Modal */}
      <AddEditCashModal
        isOpen={isOpen}
        onClose={onClose}
        cash={selectedCash}
        agencies={agencies}
        onSuccess={handleSuccess}
      />
    </Box>
  );
};

export default IncomingCashTable;
