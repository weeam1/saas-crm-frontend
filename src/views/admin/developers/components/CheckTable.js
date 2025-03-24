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
  Table,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useGlobalFilter, usePagination, useTable } from "react-table";
import EditIconSvg from "../../../../assets/img/Invoice/ic_baseline-edit.svg";
import DeleteIconSvg from "../../../../assets/img/Invoice/weui_delete-filled.svg";
// Custom components
import { AddIcon, DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import { Link, useNavigate } from "react-router-dom";
import Delete from "../Delete";
import AddUser from "../Add";
import { useFormik } from "formik";
import * as yup from "yup";
import { BsColumnsGap } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import Edit from "../Edit";
import DataNotFound from "components/notFoundData";
import CustomSearchInput from "components/search/search";

export default function CheckTable(props) {
  const {
    columnsData,
    tableData,
    fetchData,
    dataColumn,
    isLoding,
    allData,
    setSearchedData,
    setDisplaySearchData,
    displaySearchData,
    selectedColumns,
    setSelectedColumns,
    dynamicColumns,
    setDynamicColumns,
    setAction,
    action,
  } = props;

  const textColor = "black"; // Set text color to black
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => dataColumn, [dataColumn]);
  const data = useMemo(
    () => (Array.isArray(tableData) ? tableData : []),
    [tableData]
  );
  const [selectedValues, setSelectedValues] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [deleteModel, setDelete] = useState(false);
  const [gopageValue, setGopageValue] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [advaceSearch, setAdvaceSearch] = useState(false);
  const [searchClear, setSearchClear] = useState(false);
  const [searchbox, setSearchbox] = useState("");
  const [manageColumns, setManageColumns] = useState(false);
  const [tempSelectedColumns, setTempSelectedColumns] = useState(dataColumn);
  const [getTagValues, setGetTagValues] = useState([]);
  const [edit, setEdit] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();
  const [column, setColumn] = useState("");

  let isColumnSelected;
  const toggleColumnVisibility = (columnKey) => {
    setColumn(columnKey);

    isColumnSelected = tempSelectedColumns?.some(
      (column) => column?.accessor === columnKey
    );

    if (isColumnSelected) {
      const updatedColumns = tempSelectedColumns?.filter(
        (column) => column?.accessor !== columnKey
      );
      setTempSelectedColumns(updatedColumns);
    } else {
      const columnToAdd = dynamicColumns?.find(
        (column) => column?.accessor === columnKey
      );
      setTempSelectedColumns([...tempSelectedColumns, columnToAdd]);
    }
  };

  const clearSearch = () => {
    setSearchbox("");
    setDisplaySearchData(false);
    setSearchedData(allData);
    setGetTagValues([]);
  };

  const handleColumnClear = () => {
    isColumnSelected = selectedColumns?.some(
      (selectedColumn) => selectedColumn?.accessor === column?.accessor
    );
    setTempSelectedColumns(dynamicColumns);
    setManageColumns(!manageColumns ? !manageColumns : false);
  };

  const initialValues = {
    developer_name: "",
    email: "",
    trn: "",
  };

  const validationSchema = yup.object({
    developer_name: yup.string(),
    email: yup.string().email("Invalid email format"),
    trn: yup.string(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const searchResult = allData?.filter(
        (item) =>
          (!values?.developer_name ||
            (item?.developer_name &&
              item?.developer_name
                .toLowerCase()
                .includes(values?.developer_name?.toLowerCase()))) &&
          (!values?.email ||
            (item?.email &&
              item?.email
                .toLowerCase()
                .includes(values?.email?.toLowerCase()))) &&
          (!values?.trn ||
            (item?.trn &&
              item?.trn.toLowerCase().includes(values?.trn?.toLowerCase())))
      );

      const getValue = [
        values.developer_name,
        values?.email,
        values?.trn,
      ].filter((value) => value);
      setGetTagValues(getValue);
      setSearchedData(searchResult);
      setDisplaySearchData(true);
      setAdvaceSearch(false);
      setSearchClear(true);
      resetForm();
    },
  });

  const handleClear = () => {
    setDisplaySearchData(false);
  };

  useEffect(() => {
    setSearchedData && setSearchedData(data);
  }, []);

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
    dirty,
  } = formik;

  const handleClick = () => {
    onOpen();
  };

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
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

  if (pageOptions.length < gopageValue) {
    setGopageValue(pageOptions.length);
  }

  const handleCheckboxChange = (event, value) => {
    if (event.target.checked) {
      setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
    } else {
      setSelectedValues((prevSelectedValues) =>
        prevSelectedValues.filter((selectedValue) => selectedValue !== value)
      );
    }
  };

  const handleSearch = (results) => {
    setSearchedData(results);
  };

  return (
    <>
      <Card
        direction="column"
        w="100%"
        py={3}
        px={2}
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={4} mx={4}>
          <GridItem
            colSpan={{ base: 12, md: 8 }}
            display={"flex"}
            alignItems={"center"}
          >
            <Flex alignItems={"center"} flexWrap={"wrap"}>
              <Text
                color="black"
                fontSize="22px"
                fontWeight="700"
                lineHeight="100%"
              >
                Developers (
                <CountUpComponent
                  key={data?.length}
                  targetNumber={data?.length}
                />
                )
              </Text>
              <CustomSearchInput
                setSearchbox={setSearchbox}
                setDisplaySearchData={setDisplaySearchData}
                searchbox={searchbox}
                allData={allData}
                dataColumn={dataColumn}
                onSearch={handleSearch}
              />
              {displaySearchData === true ? (
                <Button
                  variant="outline"
                  size="sm"
                  colorScheme="red"
                  ms={2}
                  onClick={() => {
                    handleClear();
                    setSearchbox("");
                    setGetTagValues([]);
                  }}
                >
                  clear
                </Button>
              ) : (
                ""
              )}
              {selectedValues.length > 0 && (
                <DeleteIcon
                  onClick={() => setDelete(true)}
                  color={"red"}
                  ms={2}
                />
              )}
            </Flex>
          </GridItem>
          <GridItem
            colSpan={{ base: 12, md: 4 }}
            display={"flex"}
            justifyContent={"end"}
            alignItems={"center"}
            textAlign={"right"}
          >
            <Menu isLazy>
              <MenuButton p={4} zIndex={10000}>
                {" "}
                {/* Ensure the button is above other elements */}
                <BsColumnsGap />
              </MenuButton>
              <MenuList minW={"fit-content"} zIndex={10000}>
                {" "}
                {/* Increased zIndex significantly */}
                <MenuItem
                  onClick={() => setManageColumns(true)}
                  width={"165px"}
                >
                  Manage Columns
                </MenuItem>
              </MenuList>
            </Menu>
            <Button
              onClick={() => handleClick()}
              bg="#B79045"
              color="white"
              size="sm"
              w="168px"
              h="50px"
              leftIcon={<AddIcon />}
            >
              Add New
            </Button>
            <Button
              onClick={() => navigate("/admin-setting")}
              bg="#B79045"
              color="white"
              size="sm"
              w="104px"
              h="50px"
              ml={2}
              leftIcon={<IoIosArrowBack />}
            >
              Back
            </Button>
          </GridItem>
          <HStack spacing={4}>
            {getTagValues &&
              getTagValues.map((item) => (
                <Tag
                  size={"md"}
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
        </Grid>

        <Delete
          isOpen={deleteModel}
          onClose={() => setDelete(false)}
          setAction={setAction}
          setSelectedValues={setSelectedValues}
          url="api/user/deleteMany"
          data={selectedValues}
          method="many"
          fetchData={fetchData}
          clearSearch={clearSearch}
        />

        <Box
          overflowY={"auto"}
          className="table-fix-container"
          position="relative"
          zIndex={0}
        >
          <Table {...getTableProps()} variant="simple" color="black" mb="24px">
            <Thead bg="#EBD3A7" zIndex={0}>
              {" "}
              {/* Explicitly low zIndex */}
              {headerGroups?.map((headerGroup, index) => (
                <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers?.map((column, index) => (
                    <Th
                      {...column.getHeaderProps()}
                      pe="10px"
                      key={index}
                      borderColor={borderColor}
                      color="black"
                      minW={column.Header === "#" ? "30px" : undefined} // Set min width for "#" column
                      maxW={column.Header === "#" ? "30px" : undefined} // Set max width for "#" column
                      w={column.Header === "#" ? "30px" : undefined} // Enforce exact width
                    >
                      <Flex
                        align="center"
                        justifyContent={column.center ? "center" : "start"}
                        fontSize={{ sm: "14px", lg: "16px" }}
                        color="black"
                      >
                        <span
                          style={{
                            textTransform: "capitalize",
                            marginRight: "8px",
                            visibility:
                              column.Header === "#" ||
                              column.Header === "Action"
                                ? "hidden"
                                : "visible",
                          }}
                        >
                          {column.render("Header")}
                        </span>
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {isLoding ? (
                <Tr>
                  <Td colSpan={columns?.length}>
                    <Flex
                      justifyContent={"center"}
                      alignItems={"center"}
                      width="100%"
                      color={textColor}
                      fontSize="sm"
                      fontWeight="700"
                    >
                      <Spinner />
                    </Flex>
                  </Td>
                </Tr>
              ) : data?.length === 0 ? (
                <Tr>
                  <Td colSpan={columns.length}>
                    <Text
                      textAlign={"center"}
                      width="100%"
                      color={textColor}
                      fontSize="sm"
                      fontWeight="700"
                    >
                      <DataNotFound />
                    </Text>
                  </Td>
                </Tr>
              ) : (
                page?.map((row, i) => {
                  prepareRow(row);
                  return (
                    <Tr {...row?.getRowProps()} key={i}>
                      {row?.cells?.map((cell, index) => {
                        let data = "";
                        if (cell?.column.Header === "#") {
                          data = (
                            <Flex align="center">
                              <Checkbox
                                colorScheme="brandScheme"
                                isChecked={selectedValues.includes(cell.value)}
                                onChange={(e) =>
                                  handleCheckboxChange(e, cell.value)
                                }
                                me="4px"
                              />
                            </Flex>
                          );
                        } else if (cell?.column.Header === "TRN") {
                          data = <Text>{cell?.value || "-"}</Text>;
                        } else if (cell?.column.Header === "Developer Name") {
                          data = (
                            <Flex align="center" gap={2}>
                              <Text fontSize="sm" fontWeight="700">
                                {cell?.value || "-"}
                              </Text>
                            </Flex>
                          );
                        } else if (cell?.column.Header === "Email ID") {
                          data = (
                            <Text color="#8247FF">{cell?.value || "-"}</Text>
                          );
                        } else if (cell?.column.Header === "Action") {
                          data = (
                            <Flex justifyContent="center" gap={2}>
                              <IconButton
                                icon={<img src={EditIconSvg} alt="Edit" />}
                                size="sm"
                                onClick={() => {
                                  setEdit(true);
                                  setSelectedId(cell?.row?.original._id);
                                  setEditData(cell?.row?.original);
                                }}
                              />
                              {cell?.row?.original?.role !== "superAdmin" && (
                                <IconButton
                                  icon={
                                    <img src={DeleteIconSvg} alt="Delete" />
                                  }
                                  size="sm"
                                  onClick={() => {
                                    setSelectedValues([
                                      cell?.row?.original._id,
                                    ]);
                                    setDelete(true);
                                  }}
                                />
                              )}
                            </Flex>
                          );
                        }
                        return (
                          <Td
                            {...cell?.getCellProps()}
                            key={index}
                            fontSize={{ sm: "14px" }}
                            minW={{ sm: "150px", md: "200px", lg: "auto" }}
                            borderColor="transparent"
                            color="black"
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
      </Card>
      <AddUser
        fetchData={fetchData}
        isOpen={isOpen}
        size={"lg"}
        setAction={setAction}
        onClose={onClose}
      />
      <Edit
        isOpen={edit}
        size={"sm"}
        setAction={setAction}
        onClose={onClose}
        fetchData={fetchData}
        data={editData}
        setEdit={setEdit}
        selectedId={selectedId}
      />
      <Modal
        onClose={() => {
          setAdvaceSearch(false);
          resetForm();
        }}
        isOpen={advaceSearch}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Advance Search</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              setAdvaceSearch(false);
              resetForm();
            }}
          />
          <ModalBody>
            <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={2}>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="600"
                  color={"#000"}
                  mb="0"
                  mt={2}
                >
                  Developer Name
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.developer_name}
                  name="developer_name"
                  placeholder="Enter Developer Name"
                  fontWeight="500"
                />
                <Text mb="10px" color={"red"}>
                  {errors.developer_name &&
                    touched.developer_name &&
                    errors.developer_name}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="600"
                  color={"#000"}
                  mb="0"
                  mt={2}
                >
                  Email ID
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.email}
                  name="email"
                  placeholder="Enter Email ID"
                  fontWeight="500"
                />
                <Text mb="10px" color={"red"}>
                  {errors.email && touched.email && errors.email}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="600"
                  color={"#000"}
                  mb="0"
                  mt={2}
                >
                  TRN
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.trn}
                  name="trn"
                  placeholder="Enter TRN"
                  fontWeight="500"
                />
                <Text mb="10px" color={"red"}>
                  {errors.trn && touched.trn && errors.trn}
                </Text>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              variant="brand"
              mr={2}
              onClick={handleSubmit}
              disabled={isLoding || !dirty ? true : false}
            >
              {isLoding ? <Spinner /> : "Search"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              onClick={() => resetForm()}
            >
              Clear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        onClose={() => {
          setManageColumns(false);
          resetForm();
        }}
        isOpen={manageColumns}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage Columns</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              setManageColumns(false);
              resetForm();
            }}
          />
          <ModalBody>
            <div>
              {dynamicColumns.map((column) => (
                <Text display={"flex"} key={column.accessor} py={2}>
                  <Checkbox
                    defaultChecked={selectedColumns.some(
                      (selectedColumn) =>
                        selectedColumn.accessor === column.accessor
                    )}
                    onChange={() => toggleColumnVisibility(column.accessor)}
                    pe={4}
                  />
                  {column.Header}
                </Text>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              variant="brand"
              colorScheme="green"
              mr={2}
              onClick={() => {
                setSelectedColumns(tempSelectedColumns);
                setManageColumns(false);
                resetForm();
              }}
              disabled={isLoding ? true : false}
            >
              {isLoding ? <Spinner /> : "Save"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              onClick={() => handleColumnClear()}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
