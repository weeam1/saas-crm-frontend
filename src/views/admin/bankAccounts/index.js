import { useDisclosure } from "@chakra-ui/react";
import CheckTable from "./components/CheckTable";
import { useEffect, useState } from "react";
import { getApi } from "services/api";

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

  const [action, setAction] = useState(false);
  const [dynamicColumns, setDynamicColumns] = useState([...tableColumns]);
  const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
  const [columns, setColumns] = useState([...tableColumns]);
  const [isLoding, setIsLoding] = useState(false);
  const [data, setData] = useState([]);
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [searchedData, setSearchedData] = useState([]);

  const { isOpen } = useDisclosure();

  // Fetch Data only once on component mount
  const fetchData = async () => {
    try {
      setIsLoding(true);
      let result = await getApi(`api/bankAccount/get`);
      setData(result.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoding(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // ✅ Runs only once

  // Ensure columns update only when `action` changes
  useEffect(() => {
    if (action) {
      setColumns(tableColumns);
    }
  }, [action]);

  // Filter dynamic columns
  const dataColumn = dynamicColumns?.filter((item) =>
    selectedColumns?.find((colum) => colum?.Header === item.Header)
  );

  return (
    <div>
      <CheckTable
        isLoding={isLoding}
        columnsData={columns}
        isOpen={isOpen}
        setAction={setAction}
        action={action}
        setSearchedData={setSearchedData}
        allData={data}
        displaySearchData={displaySearchData}
        tableData={displaySearchData ? searchedData : data}
        fetchData={fetchData}
        dataColumn={dataColumn}
        setDisplaySearchData={setDisplaySearchData}
        setDynamicColumns={setDynamicColumns}
        dynamicColumns={dynamicColumns}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
      />
      {/* Add Form */}
    </div>
  );
};

export default Index;
