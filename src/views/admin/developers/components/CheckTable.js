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
import EditIconSvg from "../../../../assets/img/bankaccount/ic_baseline-edit.png";
import DeleteIconSvg from "../../../../assets/img/bankaccount/Vector.png";
import { AddIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "./Pagination";
import Spinner from "components/spinner/Spinner";
import { useNavigate } from "react-router-dom";
import Delete from "../Delete";
import AddUser from "../Add";
import { useFormik } from "formik";
import * as yup from "yup";
import { BsColumnsGap } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import Edit from "../Edit";
import DataNotFound from "components/notFoundData";
import CustomSearchInput from "./search";

export default function CheckTable(props) {
  const {
    columnsData,
    tableData,
    fetchData,
    dataColumn,
    isLoading: isLoding,
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
    pageIndex,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    currentPage,
  } = props;

  const textColor = "black";
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const columns = useMemo(() => dataColumn, [dataColumn]);
  const data = useMemo(
    () => (Array.isArray(tableData) ? tableData : []),
    [tableData]
  );

  const [selectedValues, setSelectedValues] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [deleteModel, setDelete] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [advaceSearch, setAdvaceSearch] = useState(false);
  const [searchbox, setSearchbox] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Actual search term for API
  const [manageColumns, setManageColumns] = useState(false);
  const [tempSelectedColumns, setTempSelectedColumns] = useState(dataColumn);
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
      // Advanced search can remain frontend-based or be adapted to API if needed
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

      setSearchedData(searchResult);
      setDisplaySearchData(true);
      setAdvaceSearch(false);
      resetForm();
    },
  });

  const handleFetchSearch = (term, field) => {
    setSearchTerm(term);
    if (term) {
      fetchData({ pageIndex: 0, pageSize, search: term, field }); // Pass field
    } else {
      fetchData({ pageIndex: 0, pageSize });
    }
    setDisplaySearchData(!!term);
  };

  const handleClear = () => {
    setSearchbox("");
    setSearchTerm("");
    setDisplaySearchData(false);
    fetchData({ pageIndex: 0, pageSize }); 
  };

  useEffect(() => {
    setSearchedData && setSearchedData(data);
  }, [data, setSearchedData]);

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
    dirty,
  } = formik;

  const handleClick = () => {
    onOpen();
  };

  const handleCheckboxChange = (event, value) => {
    if (event.target.checked) {
      setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
    } else {
      setSelectedValues((prevSelectedValues) =>
        prevSelectedValues.filter((selectedValue) => selectedValue !== value)
      );
    }
  };

  const handlePageChange = (page) => {
    fetchData({ pageIndex: page - 1, pageSize, search: searchTerm });
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    if (!newSize || newSize <= 0) {
      console.warn("Invalid pageSize in handlePageSizeChange:", newSize);
      return;
    }
    setPageSize(newSize);
    fetchData({ pageIndex: 0, pageSize: newSize, search: searchTerm });
  };

  const handleDeleteClose = () => {
    setDelete(false);
    setSelectedValues([]);
  };

  const handleAddClose = () => {
    onClose();
  };

  const handleEditClose = () => {
    setEdit(false);
    setSelectedId(null);
    setEditData({});
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
                <CountUpComponent key={totalItems} targetNumber={totalItems} />)
              </Text>
              <CustomSearchInput
                searchbox={searchbox}
                setSearchbox={setSearchbox}
                fetchSearch={handleFetchSearch}
                isLoading={isLoding}
              />
              {displaySearchData && (
                <Button
                  variant="outline"
                  size="sm"
                  colorScheme="red"
                  ms={2}
                  onClick={handleClear}
                >
                  Clear
                </Button>
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
            {/* <Menu isLazy>
              <MenuButton p={4} zIndex={10000}>
                <BsColumnsGap />
              </MenuButton>
              <MenuList minW={"fit-content"} zIndex={10000}>
                <MenuItem
                  onClick={() => setManageColumns(true)}
                  width={"165px"}
                >
                  Manage Columns
                </MenuItem>
              </MenuList>
            </Menu> */}
            <Button
              onClick={() => handleClick()}
              bg="#B79045"
              color="white"
              size="sm"
              w="118px"
              h="40px"
              leftIcon={<AddIcon />}
              borderRadius="6px"
              _hover={{ bg: "#A77F3A" }}
            >
              Add New
            </Button>

            <Button
              onClick={() => navigate("/admin-setting")}
              bg="#B79045"
              color="white"
              size="sm"
              w="84px"
              h="40px"
              ml={2}
              borderRadius="6px"
              _hover={{ bg: "#A77F3A" }}
            >
              Back
            </Button>
          </GridItem>
        </Grid>

        <Delete
          isOpen={deleteModel}
          onClose={handleDeleteClose}
          id={selectedValues.length === 1 ? selectedValues[0] : null}
          method={selectedValues.length > 1 ? "many" : "one"}
          data={selectedValues}
          fetchData={fetchData}
          setAction={setAction}
          setSelectedValues={setSelectedValues}
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalItems={totalItems}
          currentPage={currentPage}
        />
        <Box mb={2}>
          {totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={pageSize}
              setPageSize={setPageSize}
              handlePageSize={handlePageSizeChange}
              refetching={isLoding}
              loading={isLoding}
            />
          )}
        </Box>
        <Box
          overflowY={"auto"}
          className="table-fix-container"
          position="relative"
          zIndex={0}
        >
          <Table
            variant="simple"
            color="black"
            mb="24px"
            fontFamily="'DM Sans', sans-serif"
          >
            <Thead
              sx={{
                "& th": {
                  bg: "#EDD199 !important",
                  paddingY: "15px",
                  fontWeight: "500 !important",
                },
              }}
              zIndex={0}
            >
              {columns.map((column, index) => (
                <Th
                  key={index}
                  pe="10px"
                  borderColor={borderColor}
                  color="black"
                  minW={column.Header === "#" ? "30px" : undefined}
                  maxW={column.Header === "#" ? "30px" : undefined}
                  w={column.Header === "#" ? "30px" : undefined}
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
                          column.Header === "#" || column.Header === "Action"
                            ? "hidden"
                            : "visible",
                      }}
                    >
                      {column.Header}
                    </span>
                  </Flex>
                </Th>
              ))}
            </Thead>
            <Tbody>
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
                data?.map((row, i) => (
                  <Tr key={i}>
                    {columns.map((column, index) => {
                      let cellValue = row[column.accessor];
                      let data = "";
                      if (column.Header === "#") {
                        data = (
                          <Flex align="center">
                            <Checkbox
                              colorScheme="brandScheme"
                              isChecked={selectedValues.includes(row._id)}
                              onChange={(e) => handleCheckboxChange(e, row._id)}
                              me="4px"
                            />
                          </Flex>
                        );
                      } else if (column.Header === "TRN") {
                        data = <Text>{cellValue || "-"}</Text>;
                      } else if (column.Header === "Developer Name") {
                        data = (
                          <Flex align="center" gap={2}>
                            <Text fontSize="sm">{cellValue || "-"}</Text>
                          </Flex>
                        );
                      } else if (column.Header === "Address") {
                        data = (
                          <Flex align="center" gap={2}>
                            <Text fontSize="sm">{cellValue || "-"}</Text>
                          </Flex>
                        );
                      } else if (column.Header === "Email ID") {
                        data = <Text color="#8247FF">{cellValue || "-"}</Text>;
                      } else if (column.Header === "Action") {
                        data = (
                          <Flex justifyContent="center" gap={2}>
                            <IconButton
                              icon={
                                <img
                                  src={EditIconSvg}
                                  alt="Edit"
                                  style={{ width: "17px", height: "17px" }}
                                />
                              }
                              size="xs"
                              onClick={() => {
                                setEdit(true);
                                setSelectedId(row._id);
                                setEditData(row);
                              }}
                            />
                            {row?.role !== "superAdmin" && (
                              <IconButton
                                icon={
                                  <img
                                    src={DeleteIconSvg}
                                    alt="Delete"
                                    style={{ width: "17px", height: "17px" }}
                                  />
                                }
                                size="xs"
                                onClick={() => {
                                  setSelectedValues([row._id]);
                                  setDelete(true);
                                }}
                              />
                            )}
                            {row?.role !== "superAdmin" && (
                              <IconButton
                                icon={
                                  <ViewIcon color="#B79045" boxSize="17px" />
                                }
                                size="xs"
                                onClick={() => {
                                  navigate(`/developer/${row._id}`);
                                }}
                              />
                            )}
                          </Flex>
                        );
                      }
                      return (
                        <Td
                          key={index}
                          fontSize={{ sm: "14px" }}
                          minW={
                            column.Header === "#"
                              ? "30px"
                              : { sm: "150px", md: "200px", lg: "auto" }
                          }
                          maxW={column.Header === "#" ? "30px" : undefined}
                          w={column.Header === "#" ? "30px" : undefined}
                          borderColor="transparent"
                          color="black"
                        >
                          {data}
                        </Td>
                      );
                    })}
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      </Card>
      <AddUser
        fetchData={fetchData}
        isOpen={isOpen}
        setAction={setAction}
        onClose={handleAddClose}
        pageIndex={pageIndex}
        pageSize={pageSize}
      />
      <Edit
        isOpen={edit}
        setAction={setAction}
        onClose={handleEditClose}
        fetchData={fetchData}
        data={editData}
        setEdit={setEdit}
        selectedId={selectedId}
        pageIndex={pageIndex}
        pageSize={pageSize}
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
