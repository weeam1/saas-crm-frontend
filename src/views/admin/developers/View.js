import {
  AddIcon,
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { HSeparator } from "components/separator/Separator";
import Spinner from "components/spinner/Spinner";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import { getApi } from "services/api";
import Add from "./Add";
import Delete from "./Delete";
import Edit from "./Edit";
import RoleTable from "./components/roleTable";
import { LiaCriticalRole } from "react-icons/lia";
import RoleModal from "./components/roleModal";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/localSlice";

const View = () => {
  const RoleColumn = [
    { Header: "#", accessor: "_id", width: 10, display: false },
    { Header: "Role Name", accessor: "roleName" },
    { Header: "Description", accessor: "description" },
  ];
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.user);

  const param = useParams();

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [roleData, setRoleData] = useState([]);
  const [action, setAction] = useState(false);

  const size = "lg";

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getApi(`api/user/view/${param.id}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoleData = async () => {
    try {
      setIsLoading(true);
      const response = await getApi("api/role-access");
      setRoleData(response.data);
    } catch (error) {
      console.error("Error fetching role data:", error);
      toast.error("Failed to load role data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (param.id) {
      fetchData();
    }
  }, [param.id, action]);

  useEffect(() => {
    fetchRoleData();
  }, []);

  const handleOpenEdit = () => {
    setIsEditOpen(true);
    // No need to dispatch setUser if Edit receives data directly
  };

  const handleOpenDelete = () => {
    setIsDeleteOpen(true);
  };

  const handleOpenRoleModal = () => {
    setIsRoleModalOpen(true);
  };

  return (
    <>
      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" width="100%">
          <Spinner />
        </Flex>
      ) : (
        <>
          <Add isOpen={isAddOpen} size={size} onClose={onAddClose} />
          <Edit
            isOpen={isEditOpen}
            size={size}
            onClose={() => setIsEditOpen(false)}
            fetchData={fetchData}
            data={data}
            selectedId={param.id}
            setAction={setAction}
          />
          <Delete
            fetchData={fetchData}
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            method="one"
            data={param.id} // Pass developer ID correctly
          />
          <RoleModal
            fetchData={fetchData}
            isOpen={isRoleModalOpen}
            onClose={() => setIsRoleModalOpen(false)}
            columnsData={RoleColumn}
            id={param.id}
            tableData={roleData}
            interestRoles={data?.roles?.map((item) => item._id) || []}
          />

          <Card>
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Heading size="md" mb={3} textTransform="capitalize">
                  {data?.firstName || data?.lastName
                    ? `${data?.firstName} ${data?.lastName}`
                    : "User"}{" "}
                  Information
                </Heading>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <Flex
                  justifyContent={{ base: "start", sm: "start", md: "end" }}
                >
                  {data?.role === "superAdmin" && (
                    <Menu>
                      <MenuButton
                        variant="outline"
                        colorScheme="blackAlpha"
                        size="sm"
                        mr={2.5}
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                      >
                        Actions
                      </MenuButton>
                      <MenuList minWidth="13rem">
                        <MenuItem
                          alignItems="start"
                          onClick={onAddOpen}
                          icon={<AddIcon />}
                        >
                          Add
                        </MenuItem>
                        <MenuItem
                          alignItems="start"
                          onClick={handleOpenEdit}
                          icon={<EditIcon />}
                          color="green"
                        >
                          Edit
                        </MenuItem>
                        {data?.role !== "superAdmin" &&
                          JSON.parse(localStorage.getItem("user"))?.role ===
                            "superAdmin" && (
                            <>
                              <MenuDivider />
                              <MenuItem
                                alignItems="start"
                                onClick={handleOpenDelete}
                                icon={<DeleteIcon />}
                              >
                                Delete
                              </MenuItem>
                            </>
                          )}
                      </MenuList>
                    </Menu>
                  )}
                  <Link to="/user">
                    <Button
                      leftIcon={<IoIosArrowBack />}
                      variant="brand"
                      size="sm"
                    >
                      Back
                    </Button>
                  </Link>
                </Flex>
              </GridItem>
            </Grid>
            <HSeparator />
            <Grid templateColumns="repeat(2, 1fr)" gap={4} mt="5">
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <Text fontSize="sm" fontWeight="bold" color="blackAlpha.900">
                  First Name
                </Text>
                <Text>{data?.firstName || "-"}</Text>
              </GridItem>
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <Text fontSize="sm" fontWeight="bold" color="blackAlpha.900">
                  Last Name
                </Text>
                <Text>{data?.lastName || "-"}</Text>
              </GridItem>
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <Text fontSize="sm" fontWeight="bold" color="blackAlpha.900">
                  Phone Number
                </Text>
                <Text>{data?.phoneNumber || "-"}</Text>
              </GridItem>
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <Text fontSize="sm" fontWeight="bold" color="blackAlpha.900">
                  User Email
                </Text>
                <Text>{data?.username || "-"}</Text>
              </GridItem>
            </Grid>
          </Card>

          {data?.role !== "superAdmin" && (
            <Card mt={3}>
              <RoleTable
                fetchData={fetchData}
                columnsData={RoleColumn}
                roleModal={isRoleModalOpen}
                setRoleModal={setIsRoleModalOpen}
                tableData={data?.roles || []}
                title="Role"
              />
            </Card>
          )}

          <Card mt={3}>
            <Grid templateColumns="repeat(6, 1fr)" gap={1}>
              <GridItem colStart={6}>
                <Flex justifyContent="right">
                  <Button
                    onClick={handleOpenEdit}
                    leftIcon={<EditIcon />}
                    mr={2.5}
                    variant="outline"
                    size="sm"
                    colorScheme="green"
                  >
                    Edit
                  </Button>
                  {data?.role !== "superAdmin" &&
                    JSON.parse(localStorage.getItem("user"))?.role ===
                      "superAdmin" && (
                      <Button
                        size="sm"
                        style={{ background: "red.800" }}
                        onClick={handleOpenDelete}
                        leftIcon={<DeleteIcon />}
                        colorScheme="red"
                      >
                        Delete
                      </Button>
                    )}
                </Flex>
              </GridItem>
            </Grid>
          </Card>
        </>
      )}
    </>
  );
};

export default View;
