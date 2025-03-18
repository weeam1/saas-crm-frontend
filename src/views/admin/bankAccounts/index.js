
import { useDisclosure } from "@chakra-ui/react";
import CheckTable from "./components/CheckTable";
import { useEffect, useState } from "react";
import { useFetchItemsQuery } from "api/apiSlice";

const Index = () => {
  const tableColumns = [
    { Header: "#", accessor: "_id", isSortable: false, width: 10 },
    { Header: "Account Name", accessor: "account_holder_name" },
    { Header: "Account Number", accessor: "account_number" },
    { Header: "IBAN", accessor: "iban", isSortable: false },
    { Header: "Swift Code", accessor: "swift_code" },
    { Header: "Bank Name", accessor: "bank_name" },
    { Header: "Bank Address", accessor: "branch_address" },
    { Header: "Action", isSortable: false, center: true },
  ];

  const {
    data = [],
    isLoading,
    refetch,
    isSuccess,
  } = useFetchItemsQuery({
    path: "/bankAccount/get",
  });

  const [action, setAction] = useState(false);
  const [dynamicColumns, setDynamicColumns] = useState([...tableColumns]);
  const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
  const [columns, setColumns] = useState([]);
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const { isOpen } = useDisclosure();

  useEffect(() => {
    setColumns(tableColumns);
  }, [action]);

  // ✅ Only refetch if the query is successfully initialized
  const handleRefetch = () => {
    if (isSuccess) {
      refetch();
    }
  };

  const dataColumn = dynamicColumns?.filter((item) =>
    selectedColumns?.find((column) => column?.Header === item.Header)
  );

  return (
    <div>
      <CheckTable
        isLoding={isLoading}
        columnsData={columns}
        isOpen={isOpen}
        setAction={setAction}
        action={action}
        setSearchedData={setSearchedData}
        displaySearchData={displaySearchData}
        tableData={
          Array.isArray(displaySearchData ? searchedData : data)
            ? displaySearchData
              ? searchedData
              : data
            : []
        }
        allData={data}
        fetchData={handleRefetch}
        dataColumn={dataColumn}
        setDisplaySearchData={setDisplaySearchData}
        setDynamicColumns={setDynamicColumns}
        dynamicColumns={dynamicColumns}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
      />
    </div>
  );
};

export default Index;
