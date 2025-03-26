import { Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { HasAccess } from "../../../redux/accessUtils";
import CheckTable from "./components/CheckTable";
import { useSelector } from "react-redux";
import { useFetchItemsQuery } from "api/apiSlice";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const tree = useSelector((state) => state.user.tree);
  const location = useLocation();

  const [permission, emailAccess, callAccess] = HasAccess(["Lead", "Email", "Call"]);

  // Updated table columns to match JSON structure
  const tableColumns = [
    {
      Header: "Date",
      accessor: "createdAt",
      Cell: ({ value }) => new Date(value).toLocaleDateString(), 
    },
    {
      Header: "Invoice No",
      accessor: "invoiceNo", 
    },
    {
      Header: "Developer",
      accessor: "developer.developer_name", 
    },
    {
      Header: "Bank Account",
      accessor: "bank_account.account_holder_name",
    },
    {
      Header: "Total Amount",
      accessor: "totalAmount",
    },
    { Header: "", id: "action", isSortable: false, center: true },
  ];

  const roleColumns = {
    Manager: tableColumns,
    Agent: tableColumns,
  };

  const role = user?.roles?.[0]?.roleName || "Agent";
  const [dynamicColumns, setDynamicColumns] = useState(roleColumns[role] || tableColumns);
  const [selectedColumns, setSelectedColumns] = useState(roleColumns[role] || tableColumns);
  const [action, setAction] = useState(false);
  const [dateTime, setDateTime] = useState({ from: "", to: "" });
  const { isOpen } = useDisclosure();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const queryArgs = useMemo(
    () => ({
      path: `/invoices`,
      params: { page: pageIndex + 1, limit: pageSize }, 
    }),
    [pageIndex, pageSize]
  );

  const {
    data: invoiceData,
    isLoading: queryLoading,
    error,
    refetch,
    isUninitialized,
  } = useFetchItemsQuery(queryArgs, {
    skip: !user._id,
    refetchOnMountOrArgChange: false,
    refetchOnReconnect: false,
  });

  const dataColumn = useMemo(
    () => dynamicColumns.filter((item) => selectedColumns.some((col) => col.Header === item.Header)),
    [dynamicColumns, selectedColumns]
  );

  useEffect(() => {
    setIsLoading(queryLoading);
    if (invoiceData?.doc) {
      console.log("API Response:", invoiceData);
      setData(invoiceData.doc);
    } else if (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  }, [invoiceData, queryLoading, error]);

  useEffect(() => {
    if (location.state?.refetch && !isUninitialized && user._id) {
      refetch();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, refetch, isUninitialized, user._id]);

  const fetchData = useMemo(() => {
    let timeoutId;
    return ({ pageIndex: newPageIndex, pageSize: newPageSize }) => {
      setPageIndex(newPageIndex);
      setPageSize(newPageSize);
      if (!isUninitialized && user._id) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          refetch();
        }, 500);
      }
      return () => clearTimeout(timeoutId); 
    };
  }, [isUninitialized, user._id, refetch]);

  return (
    <div>
      <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>
        <GridItem colSpan={6}>
          <CheckTable
            dateTime={dateTime}
            setDateTime={setDateTime}
            isLoding={isLoading}
            setIsLoding={setIsLoading}
            columnsData={roleColumns[role] || tableColumns}
            isOpen={isOpen}
            setAction={setAction}
            dataColumn={dataColumn}
            action={action}
            setSearchedData={setSearchedData}
            allData={data}
            displaySearchData={displaySearchData}
            tableData={displaySearchData ? searchedData : data}
            fetchData={fetchData}
            setDisplaySearchData={setDisplaySearchData}
            setDynamicColumns={setDynamicColumns}
            dynamicColumns={dynamicColumns}
            selectedColumns={selectedColumns}
            access={permission}
            setSelectedColumns={setSelectedColumns}
            emailAccess={emailAccess}
            callAccess={callAccess}
            pageIndex={pageIndex}
            pageSize={pageSize}
            totalItems={invoiceData?.totalDocs || 0}
            totalPages={invoiceData?.totalPages || 1}
            currentPage={invoiceData?.currentPage || 1}
          />
        </GridItem>
      </Grid>
    </div>
  );
};

export default Index;