import CountUpComponent from "components/countUpComponent/countUpComponent";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import TopPagination from "components/pagination/TopPagination";
import OutgoingTable from "./OutgoingTable";
import UpsertExpense from "./UpsertOutgoingExpense";
import DateFilter from "views/admin/attendance/components/DateFilter";
import { FiFilter, FiRefreshCw } from "react-icons/fi";
import AgencyFilterModal from "../components/AgencyFilterModal";
import { buttonStyle } from "utils/btn";
import { BiX } from "react-icons/bi";
import { useCashListing } from "../hooks/useCashListing";
import SummaryCards from "../components/SummaryCards";
import ViewExpense from "./ViewExpense";

const OutgoingExpense = () => {
  const [sortConfig, setSortConfig] = useState([]);

  const {
    isAgenciesAllowed,
    agencies,
    queryParams,
    data,
    month,
    year,
    summary,
    summaryLoading,
    totalPages,
    totalRecords,
    agencyId,
    setAgencyId,
    isLoading,
    isFetching,
    refetch,
    handlePageChange,
    handlePageSize,
    onDateFilterChange,
    setPagination,
    updateData,
    removeItem,
  } = useCashListing({ endpoint: "finance/cash/outgoing", sortConfig });

  const selectedAgency = useMemo(
    () => agencies.find((a) => a._id === agencyId) || null,
    [agencies, agencyId],
  );
  const handleSort = (key) => {
    setSortConfig((prev) => {
      const current = prev[0];

      // first time clicking column → DESC (negative)
      if (!current || current.key !== key) {
        return [{ key, direction: "desc" }];
      }

      // toggle direction
      return [
        {
          key,
          direction: current.direction === "desc" ? "asc" : "desc",
        },
      ];
    });

    setPagination((prev) => ({ ...prev, page: 1 }));
  };
  const [clearFilters, setClearFilters] = useState(false);
  const [viewExpense, setViewExpense] = useState({ modal: false, data: null });

  const {
    isOpen: agencyFilterIsOpen,
    onOpen: agencyFilterOnOpen,
    onClose: agencyFilterOnClose,
  } = useDisclosure();

  const {
    isOpen: expenseIsOpen,
    onClose: expenseOnClose,
    onOpen: expenseOpen,
  } = useDisclosure();

  const [editData, setEditData] = useState(null);

  const handleOpenAdd = () => {
    setEditData(null);
    expenseOpen();
  };

  const handleOpenEdit = (expense) => {
    setEditData(expense);
    expenseOpen();
  };

  const handleAgencyFilter = (value) => {
    setAgencyId(value);

    if (value) {
      setClearFilters(true);
      setPagination((prev) => ({ ...prev, page: 1 }));
    } else setClearFilters(false);
  };

  const handleClear = () => {
    setClearFilters(false);
    setAgencyId(null);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <Box p={6} bg="white" borderRadius="md" boxShadow="sm">
      <Flex
        flexDir={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        mb={4}
      >
        <Flex alignSelf="flex-start" fontSize="lg" fontWeight="bold" gap="2">
          <Text>{selectedAgency?.name || "All "} Outgoing Cash</Text>
          <CountUpComponent key={totalRecords} targetNumber={totalRecords} />
        </Flex>

        <HStack gap="2" alignItems="center">
          <IconButton
            icon={<FiRefreshCw />}
            aria-label="Refresh"
            onClick={() => refetch()}
            isLoading={isLoading || isFetching}
            variant="outline"
            size="sm"
          />
          {isAgenciesAllowed && (
            <IconButton
              icon={<FiFilter />}
              onClick={agencyFilterOnOpen}
              aria-label="Filter agency"
              colorScheme="brand"
              variant="solid"
              size="sm"
              borderRadius="full"
              boxShadow="md"
            />
          )}

          <DateFilter onFilterChange={onDateFilterChange} />

          <Button
            alignSelf="flex-end"
            leftIcon={<FaPlus size="1em" />}
            colorScheme="brand"
            size="sm"
            rounded="md"
            px={4}
            shadow="md"
            onClick={handleOpenAdd}
          >
            Add Expense
          </Button>

          {clearFilters && (
            <Button
              {...buttonStyle}
              variant="solid"
              bg="softGray.100"
              w="fit-content"
              color="gray.800"
              sx={{
                svg: {
                  fill: "gray.800",
                },
              }}
              _active={{ bg: "gray.200" }}
              leftIcon={<BiX />}
              aria-label="Clear"
              onClick={handleClear}
            >
              Clear
            </Button>
          )}
        </HStack>
      </Flex>

      <SummaryCards data={summary || {}} isLoading={summaryLoading} />

      {!isLoading && (
        <TopPagination
          currentPage={queryParams.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalRecords}
          itemsPerPage={queryParams.limit}
          refetching={isFetching}
          loading={isLoading}
          handlePageSize={handlePageSize}
        />
      )}

      <OutgoingTable
        onSort={handleSort}
        sortConfig={sortConfig}
        data={data || []}
        updateData={updateData}
        removeItem={removeItem}
        handleOpenEdit={handleOpenEdit}
        isLoading={isLoading || isFetching}
        setView={setViewExpense}
      />

      {expenseIsOpen && (
        <UpsertExpense
          isOpen={expenseIsOpen}
          onClose={expenseOnClose}
          initialData={editData}
          updateData={updateData}
          mode="Add"
          selectedMonth={month}
          selectedYear={year}
          isAgenciesAllowed={isAgenciesAllowed}
        />
      )}

      {viewExpense?.modal && (
        <ViewExpense
          data={viewExpense.data}
          isOpen={viewExpense.modal}
          onClose={() => setViewExpense({ modal: false, data: null })}
        />
      )}

      {agencyFilterIsOpen && (
        <AgencyFilterModal
          isOpen={agencyFilterIsOpen}
          onClose={agencyFilterOnClose}
          handleFilter={handleAgencyFilter}
          storeKey="outgoingAgency"
        />
      )}
    </Box>
  );
};

export default OutgoingExpense;
