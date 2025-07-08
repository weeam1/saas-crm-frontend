import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Text,
  IconButton,
  Select,
  useBreakpointValue,
  Badge,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { FiSearch } from "react-icons/fi";
import {
  useFetchItemsQuery,
  useDeleteItemMutation,
  useUpdateItemMutation,
} from "api/apiSlice";
import { toast } from "react-toastify";
import TopPagination from "components/pagination/TopPagination";
import AdvancedSearchModal from "./components/AdvancedSearchModal";
import ActiveFiltersDisplay from "./components/ActiveFiltersDisplay";
import { format } from "date-fns";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";
import useFetchUserHierarchy from "hooks/useFetchUserHierarchy";
import TableLoading from "components/loading/TableLoading";
import AddTaskModal from "./components/AddTaskModal";
import EditTaskModal from "./components/EditTaskModal";
import TaskDetailsModal from "./components/TaskDetailsModal";

const TaskV2 = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteTaskMutation] = useDeleteItemMutation();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const [updateStatus] = useUpdateItemMutation();
  const [filters, setFilters] = useState({});
  const [filterChanged, setFilterChanged] = useState(false);
  const [tableData, setTableData] = useState([]);
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });

  const {
    allUsers = [],
    managers = [],
    agents = [],
  } = useFetchUserHierarchy(user);

  const columns = [
    "SR.No",
    "Title",
    "Assigned To",
    "Due Date",
    "Priority",
    "Type",
    "Status",
    "Created At",
    "Actions",
  ];

  const priorityColors = {
    Low: "green",
    Medium: "yellow",
    High: "orange",
    Urgent: "red",
  };

  const statusColors = {
    Pending: "yellow",
    "In Progress": "blue",
    Completed: "green",
    Overdue: "red",
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    refetch();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const buildQueryParams = () => {
    const params = {
      page: currentPage,
      limit: pageSize,
    };

    if (Object.keys(filters).length > 0) {
      if (filters.title) params.title = filters.title;
      if (filters.assignedTo) params.assigned_to = filters.assignedTo;
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (filters.dueDateFrom)
        params.dueDateFrom = format(
          new Date(filters.dueDateFrom),
          "yyyy-MM-dd"
        );
      if (filters.dueDateTo)
        params.dueDateTo = format(new Date(filters.dueDateTo), "yyyy-MM-dd");
      if (filters.overdue) params.overdue = true;
      if (filters.todays) params.todays = true;
    }

    return params;
  };

  const { data, isLoading, refetch, isFetching } = useFetchItemsQuery(
    { path: "taskV2", params: buildQueryParams() },
    { refetchOnMountOrArgChange: true }
  );

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTaskMutation({
        path: `/taskV2/${taskId}`,
        body: {},
      }).unwrap();
      toast.success("The task has been deleted successfully.", {
        autoClose: 3000,
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error(
        error.data?.message || "Failed to delete the task. Please try again.",
        { autoClose: 3000 }
      );
    }
  };

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages || 0);
      setTotalItems(data.totalDocs || 0);
      setTableData(data.doc || []);
    }
  }, [data]);

  const handleStatusChange = async (taskId, status, previousStatus) => {
    if (status === previousStatus) return;
    await updateTaskStatus(taskId, status);
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await updateStatus({
        path: `/taskV2/${taskId}/status`,
        body: { status },
      }).unwrap();

      toast.success("Status updated successfully");
      setTableData((prevData) =>
        prevData.map((task) =>
          task._id === taskId ? { ...task, status } : task
        )
      );
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  const handleApplyFilters = (newFilters) => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(
        ([_, value]) => value !== "" && value !== undefined && value !== null
      )
    );

    setFilters(cleanedFilters);
    setCurrentPage(1);
    setFilterChanged(true);
    refetch();
  };

  useEffect(() => {
    if (filterChanged) {
      setFilterChanged(false);
    }
  }, [filterChanged]);

  const handleClearFilters = (filterKey) => {
    if (filterKey) {
      const newFilters = { ...filters };
      delete newFilters[filterKey];
      setFilters(newFilters);
    } else {
      setFilters({});
    }
    setCurrentPage(1);
    setFilterChanged(true);
    refetch();
  };

  return (
    <Box
      overflowY="auto"
      scrollBehavior="smooth"
      boxShadow="sm"
      bg="white"
      px={2}
    >
      <Flex
        justifyContent="space-between"
        alignItems={{ base: "normal", sm: "normal", md: "center" }}
        p={3}
        flexDir={{ base: "column", sm: "column", md: "row" }}
      >
        <Text fontSize="20px" fontWeight="bold" color="black" p={3}>
          Task Management
        </Text>
        <Box
          gap={2}
          display="flex"
          alignItems="center"
          flexDir={{ base: "column", sm: "column", md: "row" }}
          justifyContent={{ base: "center", sm: "center", md: "normal" }}
        >
          {(user?.role === "superAdmin" ||
            user?.roles[0]?.roleName === "Manager") && (
            <Button
              size="md"
              colorScheme="brand"
              leftIcon={<AddIcon />}
              py={3}
              px={6}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add New
            </Button>
          )}
          {isMobile ? (
            <IconButton
              icon={<FiSearch />}
              onClick={() => setIsFilterOpen(true)}
              aria-label="Search Tasks"
              colorScheme="brand"
              variant="solid"
              size="sm"
              borderRadius="full"
              boxShadow="md"
            />
          ) : (
            <Button
              colorScheme="brand"
              size="md"
              borderRadius="full"
              py={3}
              px={6}
              onClick={() => setIsFilterOpen(true)}
            >
              Advanced Search
            </Button>
          )}
        </Box>
      </Flex>

      <ActiveFiltersDisplay
        filters={filters}
        onClearFilters={handleClearFilters}
      />

      <Box mb={1}>
        <TopPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          setPageSize={setPageSize}
          handlePageSize={handlePageSizeChange}
          refetching={isLoading}
          loading={isLoading}
        />
      </Box>

      <Box
        borderRadius="lg"
        boxShadow="sm"
        bg="white"
        maxH={"85vh"}
        overflowY="auto"
      >
        <Table variant="striped" size="lg" bg="white">
          <Thead
            position="sticky"
            top={0}
            bg="white"
            zIndex={2}
            boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
            fontSize={"16px"}
            borderRadius="lg"
          >
            <Tr>
              {columns.map((header, index) => (
                <Th key={index} bg="brand.200" whiteSpace="nowrap" py={4}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="600"
                      color="gray.700"
                      textTransform="capitalize"
                    >
                      {header}
                    </Text>
                  </Box>
                </Th>
              ))}
            </Tr>
          </Thead>
          {isLoading || isFetching ? (
            <TableLoading columns={columns} length={7} py="4" />
          ) : (
            <Tbody>
              {tableData && tableData.length > 0 ? (
                tableData.map((task, index) => (
                  <Tr key={index}>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {index + 1}
                    </Td>
                    <Td
                      textAlign="center"
                      whiteSpace="nowrap"
                      minWidth="200px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {task.title}
                    </Td>
                    <Td
                      textAlign="center"
                      whiteSpace="nowrap"
                      minWidth="100px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {task.assigned_to?.fullName || "N/A"}
                    </Td>
                    <Td textAlign="center" minWidth="150px">
                      {format(new Date(task.due_date), "MMM d, yyyy")}
                    </Td>
                    <Td textAlign="center">
                      <Badge colorScheme={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                    </Td>
                    <Td
                      textAlign="center"
                      whiteSpace="nowrap"
                      minWidth="100px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {task.type}
                    </Td>
                    <Td textAlign="center">
                      <Select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(
                            task._id,
                            e.target.value,
                            task.status
                          )
                        }
                        size="sm"
                        width="150px"
                        focusBorderColor="brand.500"
                        bg={statusColors[task.status] + ".100"}
                        color={statusColors[task.status] + ".800"}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Overdue">Overdue</option>
                      </Select>
                    </Td>
                    <Td textAlign="center" minWidth="150px">
                      {format(new Date(task.created_at), "MMM d, yyyy")}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                    >
                      <Box
                        display="flex"
                        gap={2}
                        justifyContent="center"
                        alignItems={"center"}
                      >
                        <IconButton
                          aria-label="Edit"
                          icon={<EditIcon />}
                          size="sm"
                          onClick={() => {
                            setSelectedTaskForEdit(task);
                            setIsEditModalOpen(true);
                          }}
                          color={"#c09f5f"}
                          _hover={{
                            backgroundColor: "#c09f5f",
                            color: "white",
                          }}
                        />
                        <IconButton
                          aria-label="Delete"
                          icon={<DeleteIcon />}
                          size="sm"
                          color={"#c09f5f"}
                          _hover={{
                            backgroundColor: "#c09f5f",
                            color: "white",
                          }}
                          onClick={() => handleDeleteTask(task._id)}
                        />

                        <IconButton
                          aria-label="View"
                          icon={<ViewIcon />}
                          size="sm"
                          color={"#c09f5f"}
                          _hover={{
                            backgroundColor: "#c09f5f",
                            color: "white",
                          }}
                          onClick={() => setSelectedTask(task)}
                        />
                      </Box>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr borderColor="gray.200" textAlign="center">
                  <Td
                    borderBottom="none"
                    colSpan={columns.length}
                    fontSize={{ base: "12px", md: "15px" }}
                    fontWeight="500"
                    color="gray.500"
                    textAlign="center"
                  >
                    <NoData label="tasks" />
                  </Td>
                </Tr>
              )}
            </Tbody>
          )}
        </Table>
      </Box>

      <TaskDetailsModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
      />

      <AdvancedSearchModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={filters}
        clearFilter={filterChanged}
        users={allUsers}
      />

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          refetch();
        }}
        managers={managers}
        agents={
          user.role === "superAdmin"
            ? agents
            : agents.filter((a) => a.manager === user._id)
        }
        user={user}
      />

      {selectedTaskForEdit && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTaskForEdit(null);
          }}
          onSuccess={() => {
            refetch();
          }}
          task={selectedTaskForEdit}
          managers={managers}
          agents={
            user.role === "superAdmin"
              ? agents
              : agents.filter((a) => a.manager === user._id)
          }
          user={user}
        />
      )}
    </Box>
  );
};

export default TaskV2;
