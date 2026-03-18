import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  IconButton,
  Box,
  Text,
  Center,
  Badge,
  Avatar,
  AvatarGroup,
} from "@chakra-ui/react";
import { FiTrash2, FiEdit, FiEye, FiUsers } from "react-icons/fi";
import { usePermissions } from "hooks/usePermissions";
import {
  useToast,
  useDisclosure,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import NoData from "components/Message/NoData";
import TableLoading from "components/loading/TableLoading";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import CustomTooltip from "components/shared/CustomTooltip";
import { useNavigate } from "react-router-dom";
import { getBadgeColors } from "utils/colorUtils";
import { FaPlus } from "react-icons/fa6";
import TeamForm from "./TeamForm";
import { toast } from "react-toastify";

// Mock Data
const teamsData = [
  {
    id: 1,
    name: "Sales Team Alpha",
    description: "Handles enterprise leads and high-value opportunities",
    teamLeader: {
      name: "John Doe",
      avatar: "https://bit.ly/dan-abramov",
      email: "john.doe@example.com",
    },
    members: [
      {
        name: "Sarah Wilson",
        avatar: "https://bit.ly/sage-adebayo",
        role: "SDR",
      },
      { name: "Mike Chen", avatar: "https://bit.ly/prosper-baba", role: "AE" },
      { name: "Emily Davis", avatar: "https://bit.ly/code-beast", role: "SDR" },
      { name: "Alex Kumar", avatar: "https://bit.ly/kent-c-dodds", role: "AE" },
    ],
    totalMembers: 8,
    activeLeads: 24,
    status: "Active",
    department: "Sales",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "SDR Team Bravo",
    description: "Qualifies inbound leads and sets appointments",
    teamLeader: {
      name: "Sarah Smith",
      avatar: "https://bit.ly/ryan-florence",
      email: "sarah.smith@example.com",
    },
    members: [
      {
        name: "James Brown",
        avatar: "https://bit.ly/dan-abramov",
        role: "SDR",
      },
      { name: "Lisa Wang", avatar: "https://bit.ly/sage-adebayo", role: "SDR" },
      {
        name: "Tom Harris",
        avatar: "https://bit.ly/prosper-baba",
        role: "SDR",
      },
    ],
    totalMembers: 6,
    activeLeads: 18,
    status: "Active",
    department: "Sales Development",
    createdAt: "2024-02-01T14:20:00Z",
  },
  {
    id: 3,
    name: "Account Executive Team",
    description: "Closes deals and manages key accounts",
    teamLeader: {
      name: "Mike Johnson",
      avatar: "https://bit.ly/kent-c-dodds",
      email: "mike.johnson@example.com",
    },
    members: [
      { name: "Rachel Green", avatar: "https://bit.ly/code-beast", role: "AE" },
      { name: "David Kim", avatar: "https://bit.ly/ryan-florence", role: "AE" },
      { name: "Nina Patel", avatar: "https://bit.ly/dan-abramov", role: "AE" },
    ],
    totalMembers: 7,
    activeLeads: 32,
    status: "Active",
    department: "Sales",
    createdAt: "2024-01-20T09:15:00Z",
  },
  {
    id: 4,
    name: "Customer Success Team",
    description: "Manages existing client relationships",
    teamLeader: {
      name: "Emily White",
      avatar: "https://bit.ly/sage-adebayo",
      email: "emily.white@example.com",
    },
    members: [
      { name: "Chris Lee", avatar: "https://bit.ly/prosper-baba", role: "CSM" },
      { name: "Anna Kim", avatar: "https://bit.ly/code-beast", role: "CSM" },
    ],
    totalMembers: 5,
    activeLeads: 45,
    status: "On Leave",
    department: "Customer Success",
    createdAt: "2024-02-10T11:45:00Z",
  },
];

// Mock employees for TeamForm
const mockEmployees = [
  {
    value: "emp1",
    label: "John Doe",
    role: "Team Lead",
    avatar: "https://bit.ly/dan-abramov",
  },
  {
    value: "emp2",
    label: "Sarah Wilson",
    role: "SDR",
    avatar: "https://bit.ly/sage-adebayo",
  },
  {
    value: "emp3",
    label: "Mike Chen",
    role: "AE",
    avatar: "https://bit.ly/prosper-baba",
  },
  {
    value: "emp4",
    label: "Emily Davis",
    role: "SDR",
    avatar: "https://bit.ly/code-beast",
  },
];

const TeamsTable = ({ isLoading = false }) => {
  const [teams, setTeams] = useState(teamsData);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [modalType, setModalType] = useState("create");
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();
  const [selectedRow, setSelectedRow] = useState(null);
  const [delayedLoading, setDelayedLoading] = useState(isLoading);
  const navigate = useNavigate();

  const columns = [
    { key: "team", label: "Team", width: "280px" },
    { key: "description", label: "Description", width: "250px" },
    { key: "teamLeader", label: "Team Leader", width: "200px" },
    { key: "members", label: "Members", width: "150px" },
    { key: "stats", label: "Stats", width: "150px" },
    { key: "status", label: "Status", width: "100px" },
    { key: "createdAt", label: "Created", width: "150px" },
    { key: "actions", label: "Actions", width: "100px" },
  ];

  useEffect(() => {
    let timer;
    if (isLoading) {
      setDelayedLoading(true);
    } else {
      timer = setTimeout(() => {
        setDelayedLoading(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleEdit = (row) => {
    // Convert the row data to the format expected by TeamForm
    const teamForForm = {
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      teamLeader: {
        value: `emp${row.teamLeader.name.split(" ")[0]}`,
        label: row.teamLeader.name,
        role: "Team Lead",
        avatar: row.teamLeader.avatar,
      },
      employees: row.members.map((m) => ({
        value: `emp${m.name.split(" ")[0]}`,
        label: m.name,
        role: m.role,
        avatar: m.avatar,
      })),
      totalMembers: row.totalMembers,
      activeLeads: row.activeLeads,
      status: row.status,
    };

    setSelectedTeam(teamForForm);
    setModalType("edit");
    onFormOpen();
  };

  const handleDelete = (row) => {
    setSelectedRow(row);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    setTeams(teams.filter((team) => team.id !== selectedRow.id));
    toast.success("Team deleted successfully!");
    onDeleteClose();
  };

  const handleSubmit = (formData) => {
    if (modalType === "create") {
      // Handle create
      const newTeam = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        teamLeader: {
          name: formData.teamLeader.label,
          avatar: formData.teamLeader.avatar,
          email: `${formData.teamLeader.label.toLowerCase().replace(" ", ".")}@example.com`,
        },
        members: formData.employees.map((emp) => ({
          name: emp.label,
          avatar: emp.avatar,
          role: emp.role,
        })),
        totalMembers: formData.employees.length + 1,
        activeLeads: 0,
        status: "Active",
        department: "Sales",
        createdAt: new Date().toISOString(),
      };
      setTeams([newTeam, ...teams]);
      toast.success("Team created successfully!");
    } else {
      // Handle edit
      const updatedTeams = teams.map((team) =>
        team.id.toString() === selectedTeam.id
          ? {
              ...team,
              name: formData.name,
              description: formData.description,
              teamLeader: {
                name: formData.teamLeader.label,
                avatar: formData.teamLeader.avatar,
                email: `${formData.teamLeader.label.toLowerCase().replace(" ", ".")}@example.com`,
              },
              members: formData.employees.map((emp) => ({
                name: emp.label,
                avatar: emp.avatar,
                role: emp.role,
              })),
              totalMembers: formData.employees.length + 1,
            }
          : team,
      );
      setTeams(updatedTeams);
      toast.success("Team updated successfully!");
    }
    onFormClose();
  };

  const formatValue = (key, value, row) => {
    switch (key) {
      case "createdAt":
        return value ? format(new Date(value), "MMM d, yyyy") : "N/A";

      case "status":
        return (
          <Badge
            colorScheme={
              value === "Active"
                ? "green"
                : value === "On Leave"
                  ? "yellow"
                  : "gray"
            }
            variant="subtle"
            fontSize=".9em"
            px={3}
            py={1}
            borderRadius="full"
          >
            {value}
          </Badge>
        );

      case "teamLeader":
        return (
          <Flex align="center" gap={2}>
            <Avatar size="sm" name={value?.name} src={value?.avatar} />
            <Box>
              <Text fontWeight="500" fontSize="sm">
                {value?.name}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {value?.email}
              </Text>
            </Box>
          </Flex>
        );

      case "members":
        return (
          <Flex direction="column" gap={2}>
            <AvatarGroup size="sm" max={3} spacing="-2">
              {row.members?.map((member, idx) => (
                <Avatar key={idx} name={member.name} src={member.avatar} />
              ))}
            </AvatarGroup>
            <Text fontSize="xs" color="gray.600">
              {row.totalMembers} total members
            </Text>
          </Flex>
        );

      case "stats":
        return (
          <Box>
            <Text fontSize="sm" fontWeight="500">
              {row.activeLeads} Active Leads
            </Text>
            <Text fontSize="xs" color="gray.500">
              {row.department}
            </Text>
          </Box>
        );

      case "team":
        return (
          <Box>
            <Text fontWeight="600" fontSize="sm">
              {row.name}
            </Text>
            <Text fontSize="xs" color="gray.500" noOfLines={1}>
              ID: {row.id}
            </Text>
          </Box>
        );

      default:
        return value || "N/A";
    }
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Team</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete the team{" "}
            <strong>{selectedRow?.name}</strong>? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={confirmDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Team Form Modal */}
      <Modal isOpen={isFormOpen} onClose={onFormClose} size="xl">
        <ModalOverlay />
        <ModalContent maxW="600px">
          <ModalHeader>
            <Text>
              {modalType === "create" ? "Create New Team" : "Edit Team"}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <TeamForm
              onClose={onFormClose}
              onSubmit={handleSubmit}
              initialData={selectedTeam}
              isEditing={modalType === "edit"}
              employees={mockEmployees}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Box
        my="2"
        overflowX="auto"
        overflowY="auto"
        maxH="calc(100vh - 200px)"
        borderWidth="1px"
        borderColor="gray.200"
        rounded="xl"
        boxShadow="sm"
        bg="white"
      >
        <Table variant="striped" size="sm">
          <Thead bg="brand.200" position="sticky" top={0} zIndex={1}>
            <Tr>
              {columns.map((column) => (
                <Th
                  key={column.key}
                  whiteSpace="nowrap"
                  textTransform="capitalize"
                  fontSize="md"
                  py="4"
                  textAlign="left"
                  fontWeight="semibold"
                  color="gray.700"
                  minW={column.width}
                >
                  {column.label}
                </Th>
              ))}
            </Tr>
          </Thead>

          <Tbody>
            {isLoading || delayedLoading ? (
              <TableLoading columns={columns} length={10} py="4" />
            ) : teams.length === 0 ? (
              <Tr>
                <Td colSpan={columns.length} py={10}>
                  <Center>
                    <NoData label="teams" />
                  </Center>
                </Td>
              </Tr>
            ) : (
              teams.map((row, index) => (
                <Tr
                  key={row.id || index}
                  _hover={{ bg: "gray.50", cursor: "pointer" }}
                  bg={index % 2 === 0 ? "white" : "gray.50"}
                  onClick={() => navigate(`/teams/${row.id}`)}
                >
                  {columns.map((column) => (
                    <Td
                      key={column.key}
                      py={3}
                      px={3}
                      wordBreak="break-word"
                      fontSize="sm"
                      minW={column.width}
                      maxW="400px"
                      textAlign="left"
                      color="gray.700"
                    >
                      {column.key === "actions" ? (
                        <Flex
                          align="center"
                          justifyContent="center"
                          gap={2}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* <CustomTooltip label="View Team">
                            <IconButton
                              aria-label="View"
                              icon={<FiEye />}
                              size="sm"
                              colorScheme="blue"
                              variant="ghost"
                              onClick={() => navigate(`/teams/${row.id}`)}
                            />
                          </CustomTooltip> */}

                          <CustomTooltip label="Edit Team">
                            <IconButton
                              aria-label="Edit"
                              icon={<FiEdit />}
                              size="sm"
                              colorScheme="green"
                              variant="ghost"
                              onClick={() => handleEdit(row)}
                            />
                          </CustomTooltip>
                          {/*
                          <CustomTooltip label="Delete Team">
                            <IconButton
                              aria-label="Delete"
                              icon={<FiTrash2 />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => handleDelete(row)}
                            />
                          </CustomTooltip> */}
                        </Flex>
                      ) : (
                        formatValue(column.key, row[column.key], row)
                      )}
                    </Td>
                  ))}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

export default TeamsTable;
