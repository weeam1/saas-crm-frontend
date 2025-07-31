import {
  Box,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Menu,
  Button,
  Tab,
  TabList,
  Table,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  TabPanels,
  TabPanel,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getApi } from "services/api";
import ChangeAccess from "../changeAccess";
import RoleModal from "./roleModal";
import AddRole from "../Add";
import { IoIosArrowBack } from "react-icons/io";
import DataNotFound from "components/notFoundData";

export default function CheckTable(props) {
  const {
    columnsData,
    name,
    tableData,
    handleClick,
    fetchData,
    isLoding,
    setAction,
    _id,
    action,
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue("gray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const columns = useMemo(() => columnsData, [columnsData]);
  const [selectedValues, setSelectedValues] = useState([]);

  const [roleModal, setRoleModal] = useState(false);
  const [access, setAccess] = useState([]);
  const [accessRole, setAccessRole] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [roleId, setRoleId] = useState("");
  const [gopageValue, setGopageValue] = useState();
  // const [data, setData] = useState([])
  const data = useMemo(() => tableData, [tableData]);
  const [addRoleModal, setAddRoleModal] = useState(false);
  const navigate = useNavigate();
  // const fetchData = async () => {
  //   let result = await getApi('api/contact/');
  //   setData(result.data);
  // }
  const user = JSON.parse(localStorage.getItem("user"));

  const rowColumns = [
    {
      Header: "#",
      accessor: "_id",
      isSortable: false,
      width: 10,
      display: false,
    },

    { Header: "title", accessor: "title" },
    { Header: "create", accessor: "create", width: "20px" },
    { Header: "view", accessor: "view", width: "20px" },
    { Header: "update", accessor: "update", width: "20px" },
    { Header: "delete", accessor: "delete", width: "20px" },
  ];

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }, 
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

  if (pageOptions.length < gopageValue) {
    setGopageValue(pageOptions.length);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Card
        direction="column"
        w="100%"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Flex
         justifyContent={{base:"center", sm: "center" , md: "space-between"}}
          mb={3}
          flexWrap="wrap"
          alignItems={"center"}
          mx={{ base: 2, md: 4 }}
        >
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <Flex alignItems="center" flexWrap="wrap" gap={2}>
              <Text
                color={useColorModeValue("secondaryGray.900", "white")}
                fontSize={{ base: "lg", md: "22px" }}
                fontWeight="700"
                lineHeight="100%"
              >
                Roles (
                <CountUpComponent
                  key={data?.length}
                  targetNumber={data?.length}
                />
                )
              </Text>
            </Flex>
          </GridItem>
            <Button
              onClick={() => setAddRoleModal(true)}
              variant="brand"
              size="sm"
              leftIcon={<AddIcon />}
              mb={{ base: 2, md: 0 }}
              borderRadius={"md"}
            >
              Add New
            </Button>
            {/* <Button
              onClick={() => navigate("/admin-setting")}
              variant="brand"
              size="sm"
              leftIcon={<IoIosArrowBack />}
            >
              Back
            </Button> */}
  
        </Flex>
     

        <Box
          borderRadius="4px"
          boxShadow="sm"
          borderWidth="1px"
          overflow="hidden"
        >
          <Box
            position="relative"
            maxH="120vh"
            overflowY="auto"
            className="table-fix-container"
          >
            <Table variant="striped" size="lg" {...getTableProps()}>
              <Thead
                position="sticky"
                top={0}
                bg="white"
                zIndex={2}
                boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
                fontSize={"16px"}
                borderRadius="lg"
              >
                {headerGroups?.map((headerGroup, index) => (
                  <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                    {headerGroup.headers?.map((column, index) => (
                      <Th
                        {...column.getHeaderProps(
                          column.isSortable !== false &&
                            column.getSortByToggleProps()
                        )}
                        key={index}
                        bg="brand.200"
                        whiteSpace="nowrap"
                        py={4}
                        borderColor="transparent"
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent={"center"}
                        >
                          <Text
                            fontSize={{ base: "12px", md: "14px" }}
                            fontWeight="600"
                            color="gray.700"
                            textTransform="capitalize"
                          >
                            {column.render("Header")}
                          </Text>
                        </Box>
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
                  <Tr borderColor="gray.200" textAlign="center">
                    <Td
                      borderBottom="none"
                      colSpan={columns.length}
                      fontSize={{ base: "12px", md: "15px" }}
                      fontWeight="500"
                      color="gray.500"
                      textAlign="center"
                    >
                      <DataNotFound />
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
                              <Text
                                fontSize={{ base: "12px", md: "14px" }}
                                fontWeight="400"
                                minWidth="100px"
                                textAlign={"center"}
                              >
                                {cell?.row?.index + 1 + pageIndex * pageSize}
                              </Text>
                            );
                          } else if (cell?.column.Header === "Role Name") {
                            data = (
                              <Text
                                me="10px"
                                onClick={() => {
                                  setRoleModal(true);
                                  setRoleName(cell?.value);
                                  setRoleId(cell?.row?.original?._id);
                                  setAccess(cell?.row?.original?.access);
                                  setAccessRole(cell?.row?.original?.access);
                                }}
                                color="brand.600"
                                sx={{
                                  "&:hover": {
                                    color: "blue.500",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                  },
                                }}
                                fontSize={{ base: "12px", md: "14px" }}
                                fontWeight="400"
                                textAlign="center"
                                whiteSpace="nowrap"
                              >
                                {cell?.value}
                              </Text>
                            );
                          } else if (cell?.column.Header === "Description") {
                            data = (
                              <Text
                                fontSize={{ base: "12px", md: "14px" }}
                                fontWeight="400"
                                textAlign="center"
                              >
                                {cell?.value}
                              </Text>
                            );
                          }
                          return (
                            <Td
                              {...cell?.getCellProps()}
                              key={index}
                              py={4}
                              fontSize={{ base: "12px", md: "14px" }}
                              fontWeight="400"
                              borderColor="transparent"
                              textAlign="center"
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
        </Box>

        {/* Add pagination component */}
        {data?.length > 10 && (
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

        {access && (
          <RoleModal
            isOpen={roleModal}
            setRoleModal={setRoleModal}
            onOpen={onOpen}
            isLoding={isLoding}
            columnsData={rowColumns}
            name={roleName}
            _id={roleId}
            tableData={access}
            accessRole={accessRole}
            setAccessRole={setAccessRole}
            setAccess={setAccess}
            fetchData={fetchData}
            setAction={setAction}
          />
        )}
      </Card>

      <AddRole
        isOpen={addRoleModal}
        size={"sm"}
        setAction={setAction}
        onClose={setAddRoleModal}
      />
    </>
  );
}
