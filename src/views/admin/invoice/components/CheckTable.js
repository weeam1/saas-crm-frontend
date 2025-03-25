import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Tr,
  Text,
  Th,
  Thead,
  MenuDivider,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { DeleteIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "./Pagination";
import Spinner from "components/spinner/Spinner";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Delete from "../Delete";
import Add from "../Add";
import { AddIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from "react-icons/ci";
import Edit from "../Edit";
import { useFormik } from "formik";
import * as yup from "yup";
import CustomSearchInput from "./Search";
import DataNotFound from "components/notFoundData";
import Breadcrumb from "./BreadCrumb";
import EditIconSvg from "../../../../assets/img/Invoice/ic_baseline-edit.svg";
import DeleteIconSvg from "../../../../assets/img/Invoice/weui_delete-filled.svg";

export default function CheckTable(props) {
  const {
    tableData,
    dataColumn,
    fetchData,
    isLoding,
    allData,
    access,
    setSearchedData,
    setDisplaySearchData,
    displaySearchData,
    selectedColumns,
    setSelectedColumns,
    dynamicColumns,
    setAction,
    action,
    dateTime,
    setDateTime,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    currentPage,
  } = props;

  const textColor = useColorModeValue("gray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const [selectedValues, setSelectedValues] = useState([]);
  const [getTagValues, setGetTagValues] = useState([]);
  const [deleteModel, setDeleteModel] = useState(false);
  const [advaceSearch, setAdvaceSearch] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchbox, setSearchbox] = useState("");
  const [manageColumns, setManageColumns] = useState(false);
  const [tempSelectedColumns, setTempSelectedColumns] =
    useState(selectedColumns);

  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [edit, setEdit] = useState(false);

  const columns = useMemo(() => dataColumn, [dataColumn]);
  const data = useMemo(() => tableData, [tableData]);

  useEffect(() => {
    if (tableData && tableData.length > 0) {
    }
  }, [tableData]);

  const csvColumns = [
    { Header: "Unit Name", accessor: "unit_name" },
    { Header: "Unit Price", accessor: "unit_price" },
    { Header: "Commission", accessor: "commission" },
    { Header: "Claim Type", accessor: "claim_type" },
    { Header: "Developer", accessor: "developer_id" },
    { Header: "Bank Account", accessor: "bank_account_id" },
    { Header: "Total Amount", accessor: "total_amount" },
  ];

  const initialValues = {
    unit_name: "",
    claim_type: "",
    developer_id: "",
    bank_account_id: "",
    total_amount: "",
  };

  const validationSchema = yup.object({
    unit_name: yup.string(),
    claim_type: yup.string(),
    developer_id: yup.string(),
    bank_account_id: yup.string(),
    total_amount: yup.number().typeError("Total Amount must be a number"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const searchResult = allData?.filter(
        (item) =>
          (!values.unit_name ||
            item.unit_name
              ?.toLowerCase()
              .includes(values.unit_name.toLowerCase())) &&
          (!values.claim_type ||
            item.claim_type
              ?.toLowerCase()
              .includes(values.claim_type.toLowerCase())) &&
          (!values.developer_id ||
            item.developer_id?._id === values.developer_id) &&
          (!values.bank_account_id ||
            item.bank_account_id?._id === values.bank_account_id) &&
          (!values.total_amount ||
            item.total_amount
              ?.toString()
              .includes(values.total_amount.toString()))
      );

      const getValue = [
        values.unit_name,
        values.claim_type,
        values.developer_id,
        values.bank_account_id,
        values.total_amount,
      ].filter((value) => value);
      setGetTagValues(getValue);
      setSearchedData(searchResult);
      setDisplaySearchData(true);
      setAdvaceSearch(false);
    },
  });

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = formik;

  const handleCheckboxChange = (event, value) => {
    if (event.target.checked) {
      setSelectedValues((prev) => [...prev, value]);
    } else {
      setSelectedValues((prev) => prev.filter((v) => v !== value));
    }
  };

  const toggleColumnVisibility = (columnKey) => {
    const isColumnSelected = tempSelectedColumns.some(
      (col) => col.accessor === columnKey || col.id === columnKey
    );
    if (isColumnSelected) {
      setTempSelectedColumns((prev) =>
        prev.filter((col) => (col.accessor || col.id) !== columnKey)
      );
    } else {
      const columnToAdd = dynamicColumns.find(
        (col) => (col.accessor || col.id) === columnKey
      );
      setTempSelectedColumns((prev) => [...prev, columnToAdd]);
    }
  };

  const handleExportLeads = (extension) => {
    const dataToExport =
      selectedValues.length > 0
        ? tableData.filter((rec) => selectedValues.includes(rec._id))
        : tableData;

    const formattedData = dataToExport.map((rec) => ({
      unit_name: rec.unit_name || "-",
      unit_price: rec.unit_price || 0,
      commission: rec.commission || 0,
      claim_type: rec.claim_type || "-",
      developer_id: rec.developer_id?.developer_name || "-",
      bank_account_id: rec.bank_account_id?.account_number || "-",
      total_amount: rec.total_amount || 0,
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoices");
    XLSX.writeFile(wb, `invoices.${extension}`);
    setSelectedValues([]);
  };

  const handlePageChange = (page) => {
    fetchData({ pageIndex: page - 1, pageSize });
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    fetchData({ pageIndex: 0, pageSize: newSize });
  };

  useEffect(() => {
    if (fetchData && action) fetchData({ pageIndex, pageSize });
  }, [action, fetchData, pageIndex, pageSize]);

  return (
    <>
      <Breadcrumb />
      <Card
        direction="column"
        w="100%"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Grid templateColumns="repeat(12, 1fr)" gap={2} p={4}>
          <GridItem
            colSpan={{ base: 12, md: 8 }}
            display="flex"
            alignItems="center"
          >
            <Flex
              alignItems={{ base: "flex-start" }}
              flexWrap="wrap"
              direction={{ base: "column", md: "row" }}
              width="100%"
              gap={2}
            >
              <Text
                color={useColorModeValue("secondaryGray.900", "white")}
                fontSize="22px"
                fontWeight="700"
                mb={{ base: 2, md: 0 }}
              >
                Invoices (<CountUpComponent targetNumber={totalItems} />)
              </Text>
              <CustomSearchInput
                setSearchbox={setSearchbox}
                setDisplaySearchData={setDisplaySearchData}
                searchbox={searchbox}
                allData={allData}
                dataColumn={dataColumn}
                onSearch={(results) => setSearchedData(results)}
                width={{ base: "100%", md: "auto" }} // Full width on base, auto on md+
              />
              {displaySearchData && (
                <Button
                  variant="outline"
                  size="sm"
                  colorScheme="red"
                  onClick={() => {
                    setDisplaySearchData(false);
                    setSearchbox("");
                    setGetTagValues([]);
                  }}
                  mt={{ base: 2, md: 0 }} // Margin top on base for spacing
                >
                  Clear
                </Button>
              )}
              {selectedValues.length > 0 && access?.delete && (
                <DeleteIcon
                  cursor="pointer"
                  onClick={() => setDeleteModel(true)}
                  color="red"
                  mt={{ base: 2 }}
                  ms={{ base: 0, md: 2 }}
                />
              )}
            </Flex>
          </GridItem>

          <GridItem
            colSpan={{ base: 12, md: 4 }}
            display="flex"
            justifyContent={{ base: "center", md: "end" }} // Center on base, end on md+
            alignItems="center"
            mt={{ base: 2, md: 0 }} // Margin top on base to separate from above
          >
            {access?.create && (
              <Button
                onClick={onOpen}
                size="sm"
                w="128px"
                borderRadius="6px"
                h="40px"
                bg="#B79045"
                color="white"
                leftIcon={<AddIcon />}
                ml={{ base: 0, md: 2 }} // Margin left only on md+
              >
                Add New
              </Button>
            )}
          </GridItem>
        </Grid>

        <HStack spacing={4} mb={2} px={4}>
          {getTagValues.map((item) => (
            <Tag
              size="md"
              p={2}
              key={item}
              borderRadius="full"
              variant="solid"
              colorScheme="gray"
            >
              <TagLabel>{item}</TagLabel>
            </Tag>
          ))}
        </HStack>
        <Box mb={2}>
          {totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={pageSize}
              handlePageSize={handlePageSizeChange}
              refetching={isLoding}
              loading={isLoding}
            />
          )}
        </Box>
        <Box overflowY="auto">
          <Table variant="simple" color="gray.500" mb="24px">
            <Thead>
              <Tr>
                {columns.map((column, index) => (
                  <Th
                    key={index}
                    pe="10px"
                    borderColor={borderColor}
                    bg="#EBD3A7"
                  >
                    <Flex
                      align="center"
                      justifyContent={column.center ? "center" : "start"}
                      fontSize={{ sm: "14px", lg: "16px" }}
                      color="secondaryGray.900"
                    >
                      <span
                        style={{
                          textTransform: "capitalize",
                          marginRight: "8px",
                        }}
                      >
                        {column.Header}
                      </span>
                    </Flex>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {isLoding ? (
                <Tr>
                  <Td colSpan={columns.length}>
                    <Flex
                      justifyContent="center"
                      alignItems="center"
                      width="100%"
                    >
                      <Spinner />
                    </Flex>
                  </Td>
                </Tr>
              ) : data?.length === 0 ? (
                <Tr>
                  <Td colSpan={columns.length}>
                    <DataNotFound />
                  </Td>
                </Tr>
              ) : (
                data.map((row, i) => (
                  <Tr key={i}>
                    {columns.map((column, index) => {
                      let cellData = "";
                      if (column.Header === "Date") {
                        cellData = (
                          <Flex align="center">
                            <Checkbox
                              colorScheme="brandScheme"
                              isChecked={selectedValues.includes(row._id)}
                              onChange={(e) => handleCheckboxChange(e, row._id)}
                              me="10px"
                            />
                            <Text color="brand.600" fontSize="sm">
                              {new Date(row.created_at)
                                .toISOString()
                                .split("T")[0] || "-"}
                            </Text>
                          </Flex>
                        );
                      } else if (column.Header === "Invoice No") {
                        cellData = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {row.invoice_number || "-"}
                          </Text>
                        );
                      } else if (column.Header === "Unit No") {
                        cellData = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {row.unit_name || "-"}
                          </Text>
                        );
                      } else if (column.Header === "Developer") {
                        cellData = (
                          <Text fontSize="sm" fontWeight="700">
                            {row.developer_id?.developer_name || "-"}
                          </Text>
                        );
                      } else if (column.Header === "Total Amount") {
                        cellData = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {row.total_amount || 0} AED
                          </Text>
                        );
                      } else if (column.id === "action") {
                        cellData = (
                          <Flex alignItems="center" gap={2}>
                            <Link to={`/invoiceView/${row._id}`}>
                              <Button
                                size="sm"
                                bg="#EBD3A7"
                                w="100px"
                                fontSize="12px"
                                borderRadius="3px"
                                py="10px"
                                color="black"
                                px="16px"
                              >
                                View Invoice
                              </Button>
                            </Link>
                            {access?.update && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setEdit(true);
                                  setSelectedId(row._id);
                                }}
                              >
                                <img
                                  src={EditIconSvg}
                                  alt="Edit"
                                  width="16px"
                                  height="16px"
                                />
                              </Button>
                            )}
                            {access?.delete && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedId(row._id);
                                  setDeleteModel(true);
                                }}
                              >
                                <img
                                  src={DeleteIconSvg}
                                  alt="Delete"
                                  width="16px"
                                  height="16px"
                                />
                              </Button>
                            )}
                          </Flex>
                        );
                      }
                      return (
                        <Td
                          key={index}
                          fontSize={{ sm: "14px" }}
                          minW={{ sm: "150px", md: "200px", lg: "auto" }}
                          borderColor="transparent"
                        >
                          {cellData}
                        </Td>
                      );
                    })}
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>

        <Add
          isOpen={isOpen}
          size="xl"
          onClose={onClose}
          fetchData={fetchData}
          setAction={setAction}
        />

        <Edit
          isOpen={edit}
          size="xl"
          onClose={() => setEdit(false)}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          setAction={setAction}
        />
        <Delete
          isOpen={deleteModel}
          onClose={() => setDeleteModel(false)}
          setSelectedValues={setSelectedValues}
          data={selectedValues.length > 1 ? selectedValues : []}
          method={selectedValues.length > 1 ? "many" : "one"}
          id={selectedValues.length === 1 ? selectedValues[0] : selectedId}
          fetchData={fetchData}
          setAction={setAction}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />

        <Modal
          onClose={() => setAdvaceSearch(false)}
          isOpen={advaceSearch}
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Advanced Search</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid templateColumns="repeat(12, 1fr)" gap={2}>
                <GridItem colSpan={{ base: 12, md: 6 }}>
                  <FormLabel fontSize="sm" fontWeight="600">
                    Unit Name
                  </FormLabel>
                  <Input
                    fontSize="sm"
                    name="unit_name"
                    value={values.unit_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Unit Name"
                  />
                  {touched.unit_name && errors.unit_name && (
                    <Text color="red" fontSize="sm">
                      {errors.unit_name}
                    </Text>
                  )}
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 6 }}>
                  <FormLabel fontSize="sm" fontWeight="600">
                    Claim Type
                  </FormLabel>
                  <Select
                    fontSize="sm"
                    name="claim_type"
                    value={values.claim_type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Select Claim Type"
                  >
                    <option value="FULL">FULL</option>
                    <option value="PARTIAL">PARTIAL</option>
                  </Select>
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 6 }}>
                  <FormLabel fontSize="sm" fontWeight="600">
                    Developer
                  </FormLabel>
                  <Input
                    fontSize="sm"
                    name="developer_id"
                    value={values.developer_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Developer ID"
                  />
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 6 }}>
                  <FormLabel fontSize="sm" fontWeight="600">
                    Bank Account
                  </FormLabel>
                  <Input
                    fontSize="sm"
                    name="bank_account_id"
                    value={values.bank_account_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Bank Account ID"
                  />
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 12 }}>
                  <FormLabel fontSize="sm" fontWeight="600">
                    Total Amount
                  </FormLabel>
                  <Input
                    fontSize="sm"
                    name="total_amount"
                    value={values.total_amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Total Amount"
                    type="number"
                  />
                  {touched.total_amount && errors.total_amount && (
                    <Text color="red" fontSize="sm">
                      {errors.total_amount}
                    </Text>
                  )}
                </GridItem>
              </Grid>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="brand"
                size="sm"
                mr={2}
                onClick={handleSubmit}
              >
                Search
              </Button>
              <Button
                colorScheme="red"
                variant="outline"
                size="sm"
                onClick={() => resetForm()}
              >
                Clear
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          onClose={() => setManageColumns(false)}
          isOpen={manageColumns}
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Manage Columns</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {dynamicColumns.map((column) => (
                <Text display="flex" key={column.accessor || column.id} py={2}>
                  <Checkbox
                    isChecked={tempSelectedColumns.some(
                      (c) =>
                        (c.accessor || c.id) === (column.accessor || column.id)
                    )}
                    onChange={() =>
                      toggleColumnVisibility(column.accessor || column.id)
                    }
                    pe={2}
                  />
                  {column.Header || "Actions"}
                </Text>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="brand"
                size="sm"
                mr={2}
                onClick={() => {
                  setSelectedColumns(tempSelectedColumns);
                  setManageColumns(false);
                }}
              >
                Save
              </Button>
              <Button
                variant="outline"
                colorScheme="red"
                size="sm"
                onClick={() => setManageColumns(false)}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
    </>
  );
}
