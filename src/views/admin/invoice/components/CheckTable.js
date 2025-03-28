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
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { DeleteIcon, AddIcon, CopyIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "./Pagination";
import Spinner from "components/spinner/Spinner";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Delete from "../Delete";
import Add from "../AddInvoiceModal";
import Edit from "../EditInvoice";
import { useFormik } from "formik";
import * as yup from "yup";
import CustomSearchInput from "./Search";
import DataNotFound from "components/notFoundData";
import Breadcrumb from "./BreadCrumb";
import DeleteIconSvg from "../../../../assets/img/bankaccount/Vector.png";
import EditIconSvg from "../../../../assets/img/bankaccount/ic_baseline-edit.png";
import TableLoading from "components/loading/TableLoading";
import { FaEllipsisV } from "react-icons/fa";

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
    searchTerm,
    setSearchTerm,
  } = props;

  const textColor = useColorModeValue("gray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const [selectedValues, setSelectedValues] = useState([]);
  const [getTagValues, setGetTagValues] = useState([]);
  const [deleteModel, setDeleteModel] = useState(false);
  const [advaceSearch, setAdvaceSearch] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [manageColumns, setManageColumns] = useState(false);
  const [tempSelectedColumns, setTempSelectedColumns] =
    useState(selectedColumns);
  const [copiedPosition, setCopiedPosition] = useState(null);

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
    { Header: "Developer", accessor: "developer_id" },
    { Header: "Bank Account", accessor: "bank_account_id" },
    { Header: "Total Amount", accessor: "total_amount" },
  ];

  const initialValues = {
    developer_id: "",
    bank_account_id: "",
    total_amount: "",
  };

  const validationSchema = yup.object({
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

  const copyToClipboard = (text, event) => {
    navigator.clipboard.writeText(text);
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    setCopiedPosition({ x: mouseX, y: mouseY - 20 });
    setTimeout(() => {
      setCopiedPosition(null);
    }, 2000);
  };
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
                fetchData={fetchData}
                setDisplaySearchData={setDisplaySearchData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                pageIndex={pageIndex}
                pageSize={pageSize}
                width={{ base: "100%", md: "auto" }}
              />
              {displaySearchData && searchTerm && (
                <Button
                  variant="outline"
                  size="sm"
                  colorScheme="red"
                  onClick={() => {
                    setSearchTerm("");
                    setDisplaySearchData(false);
                    fetchData({ pageIndex: 0, pageSize, search: "" });
                  }}
                  mt={{ base: 2, md: 0 }}
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
            justifyContent={{ base: "center", md: "end" }}
            alignItems="center"
            mt={{ base: 2, md: 0 }}
          >
            {access?.create && (
              <Button
                onClick={onOpen}
                size="sm"
                w={{ base: "100%", sm: "140px", md: "128px" }}
                borderRadius="6px"
                h={{ base: "36px", md: "40px" }}
                bg="#B79045"
                color="white"
                leftIcon={<AddIcon />}
                ml={{ base: 0, md: 2 }}
                fontSize={{ base: "12px", md: "14px" }}
                py={{ base: "8px", md: "10px" }}
                _hover={{ bg: "#996F30" }}
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
          {searchTerm && (
            <Tag
              size="md"
              p={2}
              borderRadius="full"
              variant="solid"
              colorScheme="gray"
            >
              <TagLabel>{searchTerm}</TagLabel>
            </Tag>
          )}
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
                    bg="#EDD199"
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
                <TableLoading columns={columns} length="8" />
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
                        const date = row.createdAt
                          ? new Date(row.createdAt)
                          : null;
                        cellData = (
                          <Flex align="center">
                            <Checkbox
                              colorScheme="brandScheme"
                              isChecked={selectedValues.includes(row._id)}
                              onChange={(e) => handleCheckboxChange(e, row._id)}
                              me="10px"
                            />
                            <Text color="brand.600" fontSize="sm">
                              {date && !isNaN(date)
                                ? date.toISOString().split("T")[0]
                                : "-"}
                            </Text>
                          </Flex>
                        );
                      } else if (column.Header === "Claim Type") {
                        cellData = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {row.claimType ? `${row.claimType}` : "Pending"}
                          </Text>
                        );
                      } else if (column.Header === "Developer") {
                        cellData = (
                          <Text fontSize="sm" fontWeight="700">
                            {row.developer?.developer_name || "-"}
                          </Text>
                        );
                      } else if (column.Header === "Bank Account") {
                        cellData = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {row.bank_account?.account_holder_name || "-"}
                          </Text>
                        );
                      } else if (column.Header === "Invoice Number") {
                        cellData = (
                          <Text fontSize="sm">
                            <Flex alignItems="center">
                              {row.invoiceNo || "-"}
                              <IconButton
                                aria-label="Copy invoice number"
                                icon={<CopyIcon />}
                                size="sm"
                                ml={2}
                                onClick={(e) =>
                                  copyToClipboard(row.invoiceNo || "-", e)
                                }
                                variant="ghost"
                                colorScheme="blue"
                              />
                            </Flex>
                          </Text>
                        );
                      } else if (column.Header === "Total Amount") {
                        cellData = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {row.totalAmount
                              ? `${row.totalAmount} AED`
                              : "Pending"}
                          </Text>
                        );
                      } else if (column.id === "action") {
                        cellData = (
                          <Flex alignItems="center" gap={2}>
                            <Link to={`/add-entry/${row?._id}`}>
                              <Button
                                size="sm"
                                bg="#B79045"
                                w="100px"
                                _hover={{ bg: "#996F30" }}
                                fontSize="12px"
                                borderRadius="3px"
                                py="10px"
                                color="white"
                                px="16px"
                              >
                                Add Entry
                              </Button>
                            </Link>

                            {/* Three-dot menu for Edit and Delete with SVG images */}
                            {(access?.update || access?.delete) && (
                              <Menu width="200px">
                                <MenuButton
                                  as={IconButton}
                                  aria-label="Options"
                                  icon={<FaEllipsisV />}
                                  variant="ghost"
                                  size="sm"
                                />
                                <MenuList minWidth="fit-content" width="auto">
                                  {access?.update && (
                                    <MenuItem
                                      fontSize="lg"
                                      fontFamily="DM sans"
                                      onClick={() => {
                                        setEdit(true);
                                        setSelectedId(row._id);
                                      }}
                                      icon={
                                        <img
                                          src={EditIconSvg}
                                          alt="Edit"
                                          width="16px"
                                          height="16px"
                                        />
                                      }
                                    >
                                      Edit
                                    </MenuItem>
                                  )}
                                  {access?.delete && (
                                    <MenuItem
                                      fontSize="lg"
                                      fontFamily="DM sans"
                                      onClick={() => {
                                        setSelectedId(row._id);
                                        setDeleteModel(true);
                                      }}
                                      icon={
                                        <img
                                          src={DeleteIconSvg}
                                          alt="Delete"
                                          width="16px"
                                          height="16px"
                                        />
                                      }
                                      color="red.500"
                                    >
                                      Delete
                                    </MenuItem>
                                  )}
                                </MenuList>
                              </Menu>
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
          {copiedPosition && (
            <Box
              position="fixed"
              top={`${copiedPosition.y}px`}
              left={`${copiedPosition.x}px`}
              transform="translate(-50%,-50%)"
              bg="green.500"
              color="white"
              px={3}
              py={1}
              borderRadius="md"
              fontSize="sm"
              zIndex={9999}
            >
              Copied
            </Box>
          )}
        </Box>

        <Add
          isOpen={isOpen}
          size="xl"
          onClose={onClose}
          fetchData={fetchData}
          setAction={setAction}
        />

        <Edit
          data={data}
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
