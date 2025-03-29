import { Grid, GridItem } from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { HasAccess } from "../../../redux/accessUtils";
import CheckTable from "./components/invoiceChecktable";
import { useSelector } from "react-redux";
import { useFetchItemsQuery } from "api/apiSlice";
import Breadcrumb from "./components/BreadCrumb";
const Index = () => {
  const { id } = useParams();
  const developer_id = id;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [committedSearchTerm, setCommittedSearchTerm] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const tree = useSelector((state) => state.user.tree);
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    developer: developer_id,
  });
  const location = useLocation();

  const [permission, emailAccess, callAccess] = HasAccess([
    "Lead",
    "Email",
    "Call",
  ]);

  const tableColumns = [
    {
      Header: "Date",
      accessor: "createdAt",
      Cell: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      Header: "Invoice Number",
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

    // {
    //   Header: "Total Amount",
    //   accessor: "totalAmount",
    //   Cell: ({ value }) =>
    //     value.toLocaleString("en-US", { minimumFractionDigits: 2 }),
    // },
    { Header: "Action", id: "action", isSortable: false, center: true },
  ];

  const roleColumns = {
    Manager: tableColumns,
    Agent: tableColumns,
  };

  const role = user?.roles?.[0]?.roleName || "Agent";
  const [dynamicColumns, setDynamicColumns] = useState(
    roleColumns[role] || tableColumns
  );
  const [selectedColumns, setSelectedColumns] = useState(
    roleColumns[role] || tableColumns
  );
  const [action, setAction] = useState(false);
  const [dateTime, setDateTime] = useState({ from: "", to: "" });

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const baseQueryArgs = useMemo(
    () => ({
      path: developer_id ? `/invoices` : `/invoices`,
      params: queryParams,
    }),
    [pageIndex, pageSize, developer_id]
  );

  const searchQueryArgs = useMemo(
    () => ({
      path: developer_id ? `/invoices?developer=${developer_id}` : `/invoices`,
      params: {
        search: committedSearchTerm,
        page: pageIndex + 1,
        limit: pageSize,
      },
    }),
    [committedSearchTerm, pageIndex, pageSize, developer_id]
  );

  const queryArgs = committedSearchTerm ? searchQueryArgs : baseQueryArgs;

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
    () =>
      dynamicColumns.filter((item) =>
        selectedColumns.some((col) => col.Header === item.Header)
      ),
    [dynamicColumns, selectedColumns]
  );

  useEffect(() => {
    setIsLoading(queryLoading);
    if (invoiceData?.doc) {
      console.log("API Response:", invoiceData);
      setData(invoiceData.doc);
      if (committedSearchTerm) {
        setSearchedData(invoiceData.doc);
        setDisplaySearchData(true);
      } else {
        setDisplaySearchData(false);
      }
    } else if (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setSearchedData([]);
    }
  }, [invoiceData, queryLoading, error, committedSearchTerm]);

  useEffect(() => {
    if (location.state?.refetch && !isUninitialized && user._id) {
      refetch();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, refetch, isUninitialized, user._id]);

  const fetchData = useMemo(() => {
    return (options = {}) => {
      const {
        pageIndex: newPageIndex,
        pageSize: newPageSize,
        search,
      } = options;
      setPageIndex(newPageIndex ?? pageIndex);
      setPageSize(newPageSize ?? pageSize);
      if (search !== undefined) {
        setCommittedSearchTerm(search);
      }
      if (!isUninitialized && user._id) {
        refetch();
      }
    };
  }, [isUninitialized, user._id, refetch, pageIndex, pageSize]);

  const breadcrumbItems = useMemo(
    () => [
      { label: "Home", path: "/" },
      { label: "Developers List", path: "/dev-list" },
      { label: "Invoice", path: "/invoice" },
    ],
    []
  );

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>
        <GridItem colSpan={6}>
          <CheckTable
            dateTime={dateTime}
            setDateTime={setDateTime}
            isLoading={isLoading} // Fixed typo
            setIsLoading={setIsLoading} // Fixed typo
            columnsData={roleColumns[role] || tableColumns}
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
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </GridItem>
      </Grid>
    </div>
  );
};

export default Index;
