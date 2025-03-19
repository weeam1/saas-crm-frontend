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
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import * as XLSX from "xlsx";
import { DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getApi } from "services/api";
import Delete from "../Delete";
import Add from "../Add";
import { AddIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from "react-icons/ci";
import Edit from "../Edit";
import { useFormik } from "formik";
import * as yup from "yup";
import CustomSearchInput from "components/search/search";
import DataNotFound from "components/notFoundData";

export default function CheckTable(props) {
  const {
    tableData,
    dataColumn,
    fetchData,
    isLoding, // Consider renaming to isLoading
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
  } = props;

  const textColor = useColorModeValue("gray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const [selectedValues, setSelectedValues] = useState([]);
  const [getTagValues, setGetTagValues] = useState([]);
  const [gopageValue, setGopageValue] = useState();
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

  // Invoice-specific CSV columns
  const csvColumns = [
    { Header: "Unit Name", accessor: "unit_name" },
    { Header: "Unit Price", accessor: "unit_price" },
    { Header: "Commission", accessor: "commission" },
    { Header: "Claim Type", accessor: "claim_type" },
    { Header: "Developer", accessor: "developer_id" },
    { Header: "Bank Account", accessor: "bank_account_id" },
    { Header: "Total Amount", accessor: "total_amount" },
  ];

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  // Formik for advanced search (invoice-specific)
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
      (col) => col.accessor === columnKey
    );
    if (isColumnSelected) {
      setTempSelectedColumns((prev) =>
        prev.filter((col) => col.accessor !== columnKey)
      );
    } else {
      const columnToAdd = dynamicColumns.find(
        (col) => col.accessor === columnKey
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

  // useEffect(() => {
  //   if (fetchData) fetchData();
  // }, [action, dateTime]);

  useEffect(() => {
    if (fetchData && action) fetchData(); // Only call after an action
  }, [action, fetchData]);
  return (
    <>
      <Card
        direction="column"
        w="100%"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Grid templateColumns="repeat(12, 1fr)" gap={2} p={4}>
          <GridItem colSpan={{ base: 8 }} display="flex" alignItems="center">
            <Flex alignItems="center" flexWrap="wrap">
              <Text
                color={useColorModeValue("secondaryGray.900", "white")}
                fontSize="22px"
                fontWeight="700"
              >
                Invoices (<CountUpComponent targetNumber={data?.length} />)
              </Text>
              <CustomSearchInput
                setSearchbox={setSearchbox}
                setDisplaySearchData={setDisplaySearchData}
                searchbox={searchbox}
                allData={allData}
                dataColumn={dataColumn}
                onSearch={(results) => setSearchedData(results)}
              />
              <Button
                variant="outline"
                colorScheme="brand"
                leftIcon={<SearchIcon />}
                onClick={() => setAdvaceSearch(true)}
                mt={{ sm: "5px", md: "0" }}
                size="sm"
              >
                Advanced Search
              </Button>
              {displaySearchData && (
                <Button
                  variant="outline"
                  size="sm"
                  colorScheme="red"
                  ms={2}
                  onClick={() => {
                    setDisplaySearchData(false);
                    setSearchbox("");
                    setGetTagValues([]);
                  }}
                >
                  Clear
                </Button>
              )}
              {selectedValues.length > 0 && access?.delete && (
                <DeleteIcon
                  cursor="pointer"
                  onClick={() => setDeleteModel(true)}
                  color="red"
                  ms={2}
                />
              )}
            </Flex>
          </GridItem>

          <GridItem
            colSpan={{ base: 4 }}
            display="flex"
            justifyContent="end"
            alignItems="center"
          >
            <Menu>
              <MenuButton p={4}>
                <CiMenuKebab />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => setManageColumns(true)}>
                  Manage Columns
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => handleExportLeads("csv")}>
                  {selectedValues.length > 0
                    ? "Export Selected as CSV"
                    : "Export as CSV"}
                </MenuItem>
                <MenuItem onClick={() => handleExportLeads("xlsx")}>
                  {selectedValues.length > 0
                    ? "Export Selected as Excel"
                    : "Export as Excel"}
                </MenuItem>
              </MenuList>
            </Menu>
            {access?.create && (
              <Button
                onClick={onOpen}
                size="sm"
                variant="brand"
                leftIcon={<AddIcon />}
                ml={2}
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

        <Box overflowY="auto">
          <Table
            {...getTableProps()}
            variant="simple"
            color="gray.500"
            mb="24px"
          >
            <Thead>
              {headerGroups.map((headerGroup, index) => (
                <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column, index) => (
                    <Th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      pe="10px"
                      key={index}
                      borderColor={borderColor}
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
                          {column.render("Header")}
                        </span>
                        {column.isSortable !== false && (
                          <span>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <FaSortDown />
                              ) : (
                                <FaSortUp />
                              )
                            ) : (
                              <FaSort />
                            )}
                          </span>
                        )}
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
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
                page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <Tr {...row.getRowProps()} key={i}>
                      {row.cells.map((cell, index) => {
                        let data = "";
                        if (cell.column.Header === "#") {
                          data = (
                            <Flex align="center">
                              <Checkbox
                                colorScheme="brandScheme"
                                isChecked={selectedValues.includes(cell.value)}
                                onChange={(e) =>
                                  handleCheckboxChange(e, cell.value)
                                }
                                me="10px"
                              />
                              <Text
                                color={textColor}
                                fontSize="sm"
                                fontWeight="700"
                              >
                                {cell.row.index + 1}
                              </Text>
                            </Flex>
                          );
                        } else if (cell.column.Header === "Date") {
                          data = (
                            <Text color="brand.600" fontSize="sm">
                              {new Date(cell.value).toLocaleString() || "-"}
                            </Text>
                          );
                        } else if (cell.column.Header === "Developer") {
                          data = (
                            <Text fontSize="sm" fontWeight="700">
                              {cell.value?.developer_name || "-"}
                            </Text>
                          );
                        } else if (cell.column.Header === "Bank Account") {
                          data = (
                            <Text fontSize="sm">
                              {cell.value?.account_number
                                ? `${cell.value.account_number} (${cell.value.bank_name || "N/A"})`
                                : "-"}
                            </Text>
                          );
                        } else if (cell.column.Header === "Total Amount") {
                          data = (
                            <Text
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell.value || 0} AED
                            </Text>
                          );
                        } else if (cell.column.Header === "Action") {
                          data = (
                            <Flex alignItems="center">
                              <Link to={`/invoiceView/${row.original._id}`}>
                                <Button size="sm" colorScheme="brand" mr={2}>
                                  View Invoice
                                </Button>
                              </Link>
                              <Menu>
                                <MenuButton>
                                  <CiMenuKebab />
                                </MenuButton>
                                <MenuList>
                                  {access?.update && (
                                    <MenuItem
                                      onClick={() => {
                                        setEdit(true);
                                        setSelectedId(row.original._id);
                                      }}
                                      icon={<EditIcon />}
                                    >
                                      Edit
                                    </MenuItem>
                                  )}
                                  {access?.delete && (
                                    <MenuItem
                                      color="red"
                                      onClick={() => {
                                        setSelectedId(row.original._id);
                                        setDeleteModel(true);
                                      }}
                                      icon={<DeleteIcon />}
                                    >
                                      Delete
                                    </MenuItem>
                                  )}
                                </MenuList>
                              </Menu>
                            </Flex>
                          );
                        }
                        return (
                          <Td
                            {...cell.getCellProps()}
                            key={index}
                            fontSize={{ sm: "14px" }}
                            minW={{ sm: "150px", md: "200px", lg: "auto" }}
                            borderColor="transparent"
                          >
                            {data}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })
              )}
            </Tbody>
          </Table>
        </Box>

        {data?.length > 5 && (
          <Pagination
            gotoPage={gotoPage}
            gopageValue={gopageValue}
            setGopageValue={setGopageValue}
            pageCount={pageCount}
            canPreviousPage={canPreviousPage}
            previousPage={previousPage}
            canNextPage={canNextPage}
            pageOptions={pageOptions}
            setPageSize={setPageSize}
            nextPage={nextPage}
            pageSize={pageSize}
            pageIndex={pageIndex}
          />
        )}

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
        />

        {/* Advanced Search Modal */}
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

        {/* Manage Columns Modal */}
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
                <Text display="flex" key={column.accessor} py={2}>
                  <Checkbox
                    isChecked={tempSelectedColumns.some(
                      (c) => c.accessor === column.accessor
                    )}
                    onChange={() => toggleColumnVisibility(column.accessor)}
                    pe={2}
                  />
                  {column.Header}
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
