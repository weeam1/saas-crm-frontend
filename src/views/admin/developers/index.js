import { useEffect, useState } from "react";
import { Box, Alert, AlertIcon, Spinner, Text } from "@chakra-ui/react";
import CheckTable from "./components/CheckTable";
import { useFetchItemsQuery } from "api/apiSlice";

const Index = () => {
  const tableColumns = [
    {
      Header: "#",
      accessor: "_id",
      isSortable: false,
      width: 5,
    },
    { Header: "Developer Name", accessor: "developer_name" },
    { Header: "Address", accessor: "address" },
    { Header: "TRN", accessor: "trn" },
    { Header: "Email ID", accessor: "email" },
    { Header: "Action", isSortable: false, center: true },
  ];

  const [action, setAction] = useState(false);
  const [dynamicColumns, setDynamicColumns] = useState([...tableColumns]);
  const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: developerResponse,
    isLoading,
    error,
    refetch,
  } = useFetchItemsQuery({
    path: "/developer/get", // Base path without query params
    pageIndex,
    pageSize,
  });

  const fetchData = ({ pageIndex: newPageIndex, pageSize: newPageSize }) => {
    // Validate newPageIndex and newPageSize
    if (newPageIndex < 0) {
      console.warn("Invalid pageIndex in fetchData:", newPageIndex);
      return;
    }
    if (!newPageSize || newPageSize <= 0) {
      console.warn("Invalid pageSize in fetchData:", newPageSize);
      return;
    }

    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
    refetch(); // Force refetch to ensure data is fresh
  };

  useEffect(() => {
    setDynamicColumns([...tableColumns]);
  }, [action]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching developers:", error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="200px">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Error</Text>
            <Text>
              {error?.data?.message ||
                "Failed to load developers. Please try again."}
            </Text>
          </Box>
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <CheckTable
        isLoading={isLoading}
        columnsData={tableColumns}
        setAction={setAction}
        action={action}
        setSearchedData={setSearchedData}
        allData={developerResponse?.developers || []}
        displaySearchData={displaySearchData}
        tableData={
          displaySearchData ? searchedData : developerResponse?.developers || []
        }
        fetchData={fetchData}
        dataColumn={dynamicColumns.filter((item) =>
          selectedColumns.some((column) => column.Header === item.Header)
        )}
        setDisplaySearchData={setDisplaySearchData}
        setDynamicColumns={setDynamicColumns}
        dynamicColumns={dynamicColumns}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalItems={developerResponse?.totalDevelopers || 0}
        totalPages={developerResponse?.totalPages || 1}
        currentPage={developerResponse?.currentPage || 1}
        refetch={refetch}
      />
    </Box>
  );
};

export default Index;
