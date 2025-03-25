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

  const [permission, emailAccess, callAccess] = HasAccess([
    "Lead",
    "Email",
    "Call",
  ]);

  const tableColumns = [
    {
      Header: "Date",
      accessor: "created_at",
      Cell: ({ row, value }) => ({
        row,
        value,
        checkbox: true,
      }),
    },
    { Header: "Invoice No", accessor: "invoice_number" },
    { Header: "Unit No", accessor: "unit_name" },
    { Header: "Developer", accessor: "developer_id" },
    { Header: "Total Amount", accessor: "total_amount" },
    { Header: "", id: "action", isSortable: false, center: true },
  ];

  const tableColumnsManager = [
    {
      Header: "Date",
      accessor: "created_at",
      Cell: ({ row, value }) => ({
        row,
        value,
        checkbox: true,
      }),
    },
    { Header: "Invoice No", accessor: "invoice_number" },
    { Header: "Unit No", accessor: "unit_name" },
    { Header: "Developer", accessor: "developer_id" },
    { Header: "Total Amount", accessor: "total_amount" },
    { Header: "", id: "action", isSortable: false, center: true },
  ];

  const tableColumnsAgent = [
    {
      Header: "Date",
      accessor: "created_at",
      Cell: ({ row, value }) => ({
        row,
        value,
        checkbox: true,
      }),
    },
    { Header: "Invoice No", accessor: "invoice_number" },
    { Header: "Unit No", accessor: "unit_name" },
    { Header: "Developer", accessor: "developer_id" },
    { Header: "Total Amount", accessor: "total_amount" },
    { Header: "", id: "action", isSortable: false, center: true },
  ];

  const roleColumns = {
    Manager: tableColumnsManager,
    Agent: tableColumnsAgent,
  };

  const role = user?.roles?.[0]?.roleName;

  const [dynamicColumns, setDynamicColumns] = useState(
    roleColumns[role] || tableColumns
  );
  const [selectedColumns, setSelectedColumns] = useState(
    roleColumns[role] || tableColumns
  );
  const [action, setAction] = useState(false);
  const [dateTime, setDateTime] = useState({ from: "", to: "" });
  const [columns, setColumns] = useState(roleColumns[role] || tableColumns);
  const { isOpen } = useDisclosure();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const queryArgs = useMemo(
    () => ({
      path: `/invoice/get?user=${user._id}&page=${pageIndex + 1}&pageSize=${pageSize}`,
    }),
    [user._id, pageIndex, pageSize]
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

  const dataColumn = dynamicColumns?.filter((item) =>
    selectedColumns?.find((colum) => colum?.Header === item.Header)
  );

  useEffect(() => {
    if (queryLoading) {
      setIsLoading(true);
    } else if (invoiceData) {
      setData(invoiceData.data || []);
      setIsLoading(false);
    } else if (error) {
      console.error("Error fetching invoices:", error);
      setData([]);
      setIsLoading(false);
    }
  }, [invoiceData, queryLoading, error]);

  useEffect(() => {
    setColumns(tableColumns);
  }, [action]);
  useEffect(() => {
    if (location.state?.refetch && !isUninitialized && user._id) {
      refetch();
      // Clear the state to prevent repeated refetching
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
      } else {
        console.warn("Cannot refetch: Query not started or user ID missing");
      }
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
            totalItems={invoiceData?.totalItems || 0}
            totalPages={invoiceData?.totalPages || 1}
            currentPage={invoiceData?.currentPage || 1}
          />
        </GridItem>
      </Grid>
    </div>
  );
};

export default Index;
