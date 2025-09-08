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
import { AddIcon, DeleteIcon, EditIcon, ViewIcon, DownloadIcon } from "@chakra-ui/icons";
import { FiFilter } from "react-icons/fi";
import { useFetchItemsQuery, useDeleteItemMutation } from "api/apiSlice";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Pagination from "../../developers/components/Pagination";
import TableLoading from "components/loading/TableLoading";
import * as XLSX from "xlsx";
import { useUserActivityLog } from "hooks/useUserActivityLog";

const IncomingTable = ({ month, year, refetchSummary }) => {
  const [agencyFilterOpen, setAgencyFilterOpen] = useState(false);
  const [tempSelectedAgency, setTempSelectedAgency] = useState("");
  const [selectionAgency, setSelectionAgency] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [agencies, setAgencies] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [deleteItemMutation] = useDeleteItemMutation();
  const { createUserLog } = useUserActivityLog();

  const columns = [
    "Date",
    "developer",
    "Email",
    "TRN",
    "Agency",
    "country",
    "Amount",
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
    { path: `/invoices/monthly`, params: buildQueryParams() },
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

  const handlerIncomingPaymentAddition = () => {
    navigate(`/invoice?tab=developers`);
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
        path: `/invoices/${invoiceId}`,
        body: {},
      }).unwrap();
      toast.success("The expenses has been deleted successfully.", {
        autoClose: 3000,
      });
      refetch();
      createUserLog({
        userId: user?._id,
        action: "DELETE",
        entity: "Invoice",
        entityId: invoiceId,
        entityType: "Invoice",
        status: "success",
        message: `${user?.fullName} deleted incoming expense.`,
      });
    } catch (error) {
      console.error("Failed to delete expenses:", error);
      toast.error(
        error.data?.message ||
          "Failed to delete the expenses. Please try again.",
        { autoClose: 3000 }
      );
      const errorMsg =
        error?.data?.message ||
        "Failed to delete the incoming expense. Please try again.";
      createUserLog({
        userId: user?._id,
        action: "DELETE",
        entity: "Invoice",
        entityType: "Invoice",
        entityId: invoiceId || null,
        status: error?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
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
  return (
    <Box
      overflowY="auto"
      scrollBehavior="smooth"
      boxShadow="sm"
      bg="white"
      px={2}
      marginTop={"-16px"}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p={3}
        flexDir={{ base: "column", sm: "column", md: "row" }}
        gap={1}
      >
        <Text fontSize="20px" fontWeight="bold" color="black" p={3}>
          Payments
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
            onClick={handlerIncomingPaymentAddition}
          >
            Add New
          </Button>

          <Button
            size="md"
            leftIcon={<DownloadIcon />}
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
          {isLoading && isFetching ? (
            <TableLoading columns={columns} length={8} py="4" />
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
                      {row?.developer?.developer_name
                        ? row.developer.developer_name
                        : "no data Found"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {row?.developer?.email
                        ? row.developer.email
                        : "no data Found"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {row?.developer?.trn
                        ? row.developer.trn
                        : "no data Found"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {row?.agency?.name ? row.agency.name : "no data Found"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {row?.developer?.country
                        ? row.developer.country
                        : "no data Found"}
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
                      justifyContent={"center"}
                    >
                      <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/invoice/developers/invoices/${row?.developer?._id}`
                          )
                        }
                        color={"#c09f5f"}
                        _hover={{ backgroundColor: "#c09f5f", color: "white" }}
                      />
                      <IconButton
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                        size="sm"
                        color={"#c09f5f"}
                        onClick={() => HandlerDeletion(row._id)}
                        _hover={{ backgroundColor: "#c09f5f", color: "white" }}
                      />
                      <IconButton
                        aria-label="View"
                        icon={<ViewIcon />}
                        size="sm"
                        color={"#c09f5f"}
                        onClick={() =>
                          navigate(
                            `/invoice/developers/invoices/view/${row.invoiceNo}`
                          )
                        }
                        _hover={{ backgroundColor: "#c09f5f", color: "white" }}
                      />
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          )}
        </Table>

        {!isLoading && !isFetching && data?.doc?.length === 0 && (
          <Text textAlign="center" color="gray.500" py={6} my={6}>
            No expenses found.
          </Text>
        )}
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
    </Box>
  );
};

export default IncomingTable;
