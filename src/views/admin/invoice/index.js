import { Grid, GridItem } from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HasAccess } from "../../../redux/accessUtils";
import CheckTable from "./components/CheckTable";
import { useSelector } from "react-redux";
import { useFetchItemsQuery } from "api/apiSlice";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState("");
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [committedSearchTerm, setCommittedSearchTerm] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role =
    user?.role === "superAdmin" ? "superAdmin" : user?.roles?.[0]?.roleName;
  const tree = useSelector((state) => state.user.tree);
  const location = useLocation();
  const navigate = useNavigate();

  const [permission, emailAccess, callAccess] = HasAccess([
    "Lead",
    "Email",
    "Call",
  ]);

  const tableColumns = useMemo(
    () => [
      { Header: "Date", accessor: "createdAt" },
      { Header: "Developer", accessor: "developer_name" },
      { Header: "Developer Email", accessor: "email" },
      { Header: "Trn", accessor: "trn" },
      // { Header: "Status", accessor: "status" },
    ],
    []
  );

  const roleColumns = {
    Manager: tableColumns,
    Agent: tableColumns,
  };

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

  const [queryArgs, setQueryArgs] = useState({
    path: `/developer/get`,
    params: {
      page: 1,
      limit: 25,
    },
    refetchOnMountOrArgChange: true,
  });

  const {
    data: agencyData,
    isLoading: agencyLoading,
    error: agencyError,
  } = useFetchItemsQuery(
    { path: `/agencies` },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  const {
    data: invoiceData,
    isLoading: queryLoading,
    error,
    isUninitialized,
  } = useFetchItemsQuery(queryArgs, {
    skip: !user._id,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (agencyData && agencyData.doc) {
      setAgencies(agencyData.doc);
    }
    if (agencyError) {
      console.error("Error fetching agencies:", agencyError);
      setAgencies([]);
    }
  }, [agencyData, agencyError]);

  useEffect(() => {
    setIsLoading(queryLoading || agencyLoading);
    if (invoiceData?.doc) {
      setData(invoiceData.doc);
      if (committedSearchTerm || selectedAgency) {
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
  }, [
    invoiceData,
    queryLoading,
    error,
    committedSearchTerm,
    selectedAgency,
    agencyLoading,
  ]);

  useEffect(() => {
    if (location.state?.refetch && !isUninitialized && user._id) {
      setQueryArgs((prev) => ({ ...prev }));
      window.history.replaceState({}, document.title);
    }
  }, [location.state, isUninitialized, user._id]);

  const dataColumn = useMemo(
    () =>
      dynamicColumns.filter((item) =>
        selectedColumns.some((col) => col.Header === item.Header)
      ),
    [dynamicColumns, selectedColumns]
  );

  const fetchData = ({
    pageIndex: newPageIndex,
    pageSize: newPageSize,
    search,
  }) => {
    const updatedPageIndex =
      newPageIndex !== undefined ? newPageIndex : pageIndex;
    const updatedPageSize = newPageSize !== undefined ? newPageSize : pageSize;
    const updatedSearch = search !== undefined ? search : committedSearchTerm;

    setPageIndex(updatedPageIndex);
    setPageSize(updatedPageSize);
    setCommittedSearchTerm(updatedSearch);

    const newQueryArgs = {
      path: `/developer/get`,
      params: {
        page: updatedPageIndex + 1,
        limit: updatedPageSize,
        ...(updatedSearch && { search: updatedSearch }),
        ...(selectedAgency &&
          selectedAgency !== "All" && { agency: selectedAgency }),
      },
    };

    setQueryArgs(newQueryArgs);
  };

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
            navigate={navigate}
            agencies={agencies}
            selectedAgency={selectedAgency}
            setSelectedAgency={setSelectedAgency}
            role={role}
          />
        </GridItem>
      </Grid>
    </div>
  );
};

export default Index;
