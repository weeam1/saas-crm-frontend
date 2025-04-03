// import { Grid, GridItem } from "@chakra-ui/react";
// import { useEffect, useState, useMemo } from "react";
// import { useLocation } from "react-router-dom";
// import { HasAccess } from "../../../redux/accessUtils";
// import CheckTable from "./components/CheckTable";
// import { useSelector } from "react-redux";
// import { useFetchItemsQuery } from "api/apiSlice";
// import { useNavigate } from "react-router-dom";
// const Index = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [data, setData] = useState([]);
//   const [displaySearchData, setDisplaySearchData] = useState(false);
//   const [searchedData, setSearchedData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [committedSearchTerm, setCommittedSearchTerm] = useState("");
//   const user = JSON.parse(localStorage.getItem("user")) || {};
//   const tree = useSelector((state) => state.user.tree);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [permission, emailAccess, callAccess] = HasAccess([
//     "Lead",
//     "Email",
//     "Call",
//   ]);

//   const tableColumns = useMemo(
//     () => [
//       {
//         Header: "Date",
//         accessor: "createdAt",
//         Cell: ({ value }) => new Date(value).toLocaleDateString(),
//       },
//       {
//         Header: "Developer",
//         accessor: "developer.developer_name",
//       },
//       {
//         Header: "Developer Email",
//         accessor: "developer.email",
//       },
//       {
//         Header: "Trn",
//         accessor: "developer.trn",
//       },

//       {
//         Header: "Status",
//         accessor: "status",
//       },
//     ],
//     []
//   );

//   const roleColumns = {
//     Manager: tableColumns,
//     Agent: tableColumns,
//   };

//   const role = user?.roles?.[0]?.roleName || "Agent";
//   const [dynamicColumns, setDynamicColumns] = useState(
//     roleColumns[role] || tableColumns
//   );
//   const [selectedColumns, setSelectedColumns] = useState(
//     roleColumns[role] || tableColumns
//   );
//   const [action, setAction] = useState(false);
//   const [dateTime, setDateTime] = useState({ from: "", to: "" });

//   const [pageIndex, setPageIndex] = useState(0);
//   const [pageSize, setPageSize] = useState(25);

//   const baseQueryArgs = useMemo(
//     () => ({
//       path: `/developer/get`,
//       params: { page: pageIndex + 1, limit: pageSize },
//     }),
//     [pageIndex, pageSize]
//   );

//   const searchQueryArgs = useMemo(
//     () => ({
//       path: `/developer`,
//       params: {
//         search: committedSearchTerm,
//         page: pageIndex + 1,
//         limit: pageSize,
//       },
//     }),
//     [committedSearchTerm, pageIndex, pageSize]
//   );

//   const queryArgs = committedSearchTerm ? searchQueryArgs : baseQueryArgs;

//   const {
//     data: invoiceData,
//     isLoading: queryLoading,
//     error,
//     refetch,
//     isUninitialized,
//   } = useFetchItemsQuery(queryArgs, {
//     skip: !user._id,
//     refetchOnMountOrArgChange: false,
//     refetchOnReconnect: false,
//   });

//   const dataColumn = useMemo(
//     () =>
//       dynamicColumns.filter((item) =>
//         selectedColumns.some((col) => col.Header === item.Header)
//       ),
//     [dynamicColumns, selectedColumns]
//   );

//   useEffect(() => {
//     setIsLoading(queryLoading);
//     if (invoiceData?.developers) {
//       setData(invoiceData.developers);
//       if (committedSearchTerm) {
//         setSearchedData(invoiceData.developers);
//         setDisplaySearchData(true);
//       } else {
//         setDisplaySearchData(false);
//       }
//     } else if (error) {
//       console.error("Error fetching data:", error);
//       setData([]);
//       setSearchedData([]);
//     }
//   }, [invoiceData, queryLoading, error, committedSearchTerm]);

//   useEffect(() => {
//     if (location.state?.refetch && !isUninitialized && user._id) {
//       refetch();
//       window.history.replaceState({}, document.title);
//     }
//   }, [location.state, refetch, isUninitialized, user._id]);

//   const fetchData = useMemo(() => {
//     return ({ pageIndex: newPageIndex, pageSize: newPageSize, search }) => {
//       setPageIndex(newPageIndex);
//       setPageSize(newPageSize);
//       if (search !== undefined) {
//         setCommittedSearchTerm(search);
//       }
//       if (!isUninitialized && user._id) {
//         refetch();
//       }
//     };
//   }, [isUninitialized, user._id, refetch]);

//   return (
//     <div>
//       <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>
//         <GridItem colSpan={6}>
//           <CheckTable
//             dateTime={dateTime}
//             setDateTime={setDateTime}
//             isLoding={isLoading}
//             setIsLoding={setIsLoading}
//             columnsData={roleColumns[role] || tableColumns}
//             setAction={setAction}
//             dataColumn={dataColumn}
//             action={action}
//             setSearchedData={setSearchedData}
//             allData={data}
//             displaySearchData={displaySearchData}
//             tableData={displaySearchData ? searchedData : data}
//             fetchData={fetchData}
//             setDisplaySearchData={setDisplaySearchData}
//             setDynamicColumns={setDynamicColumns}
//             dynamicColumns={dynamicColumns}
//             selectedColumns={selectedColumns}
//             access={permission}
//             setSelectedColumns={setSelectedColumns}
//             emailAccess={emailAccess}
//             callAccess={callAccess}
//             pageIndex={pageIndex}
//             pageSize={pageSize}
//             totalItems={invoiceData?.totalDevelopers || 0}
//             totalPages={invoiceData?.totalPages || 1}
//             currentPage={invoiceData?.currentPage || 1}
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             navigate={navigate}
//           />
//         </GridItem>
//       </Grid>
//     </div>
//   );
// };

// export default Index;
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
  const [agencies, setAgencies] = useState([]); // State for agencies
  const [selectedAgency, setSelectedAgency] = useState(""); // State for selected agency
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [committedSearchTerm, setCommittedSearchTerm] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || {};
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
      { Header: "Developer", accessor: "developer.developer_name" },
      { Header: "Developer Email", accessor: "developer.email" },
      { Header: "Trn", accessor: "developer.trn" },
      { Header: "Status", accessor: "status" },
    ],
    []
  );

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

  // Fetch agencies using useFetchItemsQuery
  const {
    data: agencyData,
    isLoading: agencyLoading,
    error: agencyError,
  } = useFetchItemsQuery(
    { path: `/agencies` }, // Replace with your actual endpoint for fetching agencies
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  // Base query for fetching developers
  const baseQueryArgs = useMemo(
    () => ({
      path: `/developer/get`,
      params: { page: pageIndex + 1, limit: pageSize, agency: selectedAgency },
    }),
    [pageIndex, pageSize, selectedAgency]
  );

  const searchQueryArgs = useMemo(
    () => ({
      path: `/developer`,
      params: {
        search: committedSearchTerm,
        page: pageIndex + 1,
        limit: pageSize,
        agency: selectedAgency,
      },
    }),
    [committedSearchTerm, pageIndex, pageSize, selectedAgency]
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

  // Update agencies state when agencyData is fetched
  useEffect(() => {
    if (agencyData && agencyData.doc) {
      setAgencies(agencyData.doc); // Extract the 'doc' array from agencyData
    }
    if (agencyError) {
      console.error("Error fetching agencies:", agencyError);
      setAgencies([]);
    }
  }, [agencyData, agencyError]);

  const dataColumn = useMemo(
    () =>
      dynamicColumns.filter((item) =>
        selectedColumns.some((col) => col.Header === item.Header)
      ),
    [dynamicColumns, selectedColumns]
  );

  useEffect(() => {
    setIsLoading(queryLoading || agencyLoading);
    if (invoiceData?.developers) {
      setData(invoiceData.developers);
      if (committedSearchTerm || selectedAgency) {
        setSearchedData(invoiceData.developers);
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
      refetch();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, refetch, isUninitialized, user._id]);

  const fetchData = useMemo(() => {
    return ({ pageIndex: newPageIndex, pageSize: newPageSize, search }) => {
      setPageIndex(newPageIndex);
      setPageSize(newPageSize);
      if (search !== undefined) {
        setCommittedSearchTerm(search);
      }
      if (!isUninitialized && user._id) {
        refetch();
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
            totalItems={invoiceData?.totalDevelopers || 0}
            totalPages={invoiceData?.totalPages || 1}
            currentPage={invoiceData?.currentPage || 1}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            navigate={navigate}
            agencies={agencies} // Pass agencies to CheckTable
            selectedAgency={selectedAgency} // Pass selected agency
            setSelectedAgency={setSelectedAgency} // Pass setter for selected agency
          />
        </GridItem>
      </Grid>
    </div>
  );
};

export default Index;