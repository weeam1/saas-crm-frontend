import { Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { HasAccess } from "../../../redux/accessUtils";
import CheckTable from "./components/CheckTable";
import { useSelector } from "react-redux";
import { useFetchItemsQuery } from "api/apiSlice";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const tree = useSelector((state) => state.user.tree);

  const [permission, emailAccess, callAccess] = HasAccess([
    "Lead",
    "Email",
    "Call",
  ]);
  const tableColumns = [
  { Header: "#", accessor: "_id", isSortable: false, width: 10 },
  { Header: "Date", accessor: "created_at" },
  { Header: "Developer", accessor: "developer_id" }, // Use the raw ID
  { Header: "Bank Account", accessor: "bank_account_id" }, // Use the raw ID
  { Header: "Total Amount", accessor: "total_amount" },
  { Header: "Action", isSortable: false, center: true },
];

const tableColumnsManager = [
  { Header: "#", accessor: "_id", isSortable: false, width: 10 },
  { Header: "Date", accessor: "created_at" },
  { Header: "Developer", accessor: "developer_id" },
  { Header: "Bank Account", accessor: "bank_account_id" },
  { Header: "Total Amount", accessor: "total_amount" },
  { Header: "Action", isSortable: false, center: true },
];

const tableColumnsAgent = [
  { Header: "#", accessor: "_id", isSortable: false, width: 10 },
  { Header: "Date", accessor: "created_at" },
  { Header: "Developer", accessor: "developer_id" },
  { Header: "Bank Account", accessor: "bank_account_id" },
  { Header: "Total Amount", accessor: "total_amount" },
  { Header: "Action", isSortable: false, center: true },
];

  const roleColumns = {
    Manager: tableColumnsManager,
    Agent: tableColumnsAgent,
  };

  const role = user?.roles[0]?.roleName;

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

  // Use the RTK Query hook at the top level of the component
  const {
    data: invoiceData,
    isLoading: queryLoading,
    error,
  } = useFetchItemsQuery({
    path: `/invoice/get?user=${user._id}`,
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
            fetchData={() => {}}
            setDisplaySearchData={setDisplaySearchData}
            setDynamicColumns={setDynamicColumns}
            dynamicColumns={dynamicColumns}
            selectedColumns={selectedColumns}
            access={permission}
            setSelectedColumns={setSelectedColumns}
            emailAccess={emailAccess}
            callAccess={callAccess}
          />
        </GridItem>
      </Grid>
    </div>
  );
};

export default Index;
