import {
  Box,
  Flex,
  Avatar,
  Text,
  Badge,
  IconButton,
  Center,
  HStack,
  VStack,
  Tooltip,
  useColorModeValue,
  SimpleGrid,
  AvatarGroup,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
} from "@chakra-ui/react";
import { FiEdit, FiTrash2, FiUsers, FiPlus } from "react-icons/fi";
import { FaUsers } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import TeamForm from "./TeamForm"; // Import the TeamForm component
import { useNavigate } from "react-router-dom";
// Mock Data for Teams
const initialTeamsData = [
  {
    id: "1",
    name: "Sales Team Alpha",
    description: "Handles enterprise leads and high-value opportunities",
    teamLeader: {
      value: "emp1",
      label: "John Doe",
      role: "Team Lead",
      avatar: "https://bit.ly/dan-abramov",
    },
    employees: [
      {
        value: "emp2",
        label: "Sarah Wilson",
        avatar: "https://bit.ly/sage-adebayo",
        role: "SDR",
      },
      {
        value: "emp3",
        label: "Mike Chen",
        avatar: "https://bit.ly/prosper-baba",
        role: "AE",
      },
      {
        value: "emp4",
        label: "Emily Davis",
        avatar: "https://bit.ly/code-beast",
        role: "SDR",
      },
    ],
    totalMembers: 8,
    activeLeads: 24,
    status: "Active",
  },
  {
    id: "2",
    name: "SDR Team Bravo",
    description: "Qualifies inbound leads and sets appointments",
    teamLeader: {
      value: "emp6",
      label: "Sarah Smith",
      avatar: "https://bit.ly/ryan-florence",
      role: "Team Lead",
    },
    employees: [
      {
        value: "emp7",
        label: "James Brown",
        avatar: "https://bit.ly/dan-abramov",
        role: "SDR",
      },
      {
        value: "emp8",
        label: "Lisa Wang",
        avatar: "https://bit.ly/sage-adebayo",
        role: "SDR",
      },
    ],
    totalMembers: 6,
    activeLeads: 18,
    status: "Active",
  },
  {
    id: "3",
    name: "Account Executive Team",
    description: "Closes deals and manages key accounts",
    teamLeader: {
      value: "emp10",
      label: "Mike Johnson",
      avatar: "https://bit.ly/kent-c-dodds",
      role: "Team Lead",
    },
    employees: [
      {
        value: "emp11",
        label: "Rachel Green",
        avatar: "https://bit.ly/code-beast",
        role: "AE",
      },
      {
        value: "emp12",
        label: "David Kim",
        avatar: "https://bit.ly/ryan-florence",
        role: "AE",
      },
    ],
    totalMembers: 7,
    activeLeads: 32,
    status: "Active",
  },
];

const Teams = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState(initialTeamsData);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [modalType, setModalType] = useState("create"); // "create" or "edit"

  // Single modal for both create and edit
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const subTextColor = useColorModeValue("gray.600", "gray.400");

  const handleEdit = (team) => {
    setSelectedTeam(team);
    setModalType("edit");
    onOpen();
  };

  const handleCreate = () => {
    setSelectedTeam(null);
    setModalType("create");
    onOpen();
  };

  const handleDelete = (teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      setTeams(teams.filter((team) => team.id !== teamId));
      toast.success("Team deleted successfully!");
    }
  };

  const handleSubmit = (formData) => {
    if (modalType === "create") {
      // Create new team
      const newTeam = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        teamLeader: formData.teamLeader,
        employees: formData.employees,
        totalMembers: formData.employees.length + 1,
        activeLeads: 0,
        status: "Active",
      };
      setTeams([...teams, newTeam]);
      toast.success("Team created successfully!");
    } else {
      // Edit existing team
      const updatedTeams = teams.map((team) =>
        team.id === selectedTeam.id
          ? {
              ...team,
              name: formData.name,
              description: formData.description,
              teamLeader: formData.teamLeader,
              employees: formData.employees,
              totalMembers: formData.employees.length + 1,
            }
          : team,
      );
      setTeams(updatedTeams);
      toast.success("Team updated successfully!");
    }
    onClose();
  };

  // Teams Card Component
  const TeamCard = ({ team }) => (
    <Box
      bg={cardBg}
      rounded="2xl"
      border="1px solid"
      borderColor={borderColor}
      p={4}
      boxShadow="md"
      transition="transform .2s, box-shadow .2s"
      overflow="hidden"
      _hover={{
        transform: "translateY(-3px)",
        boxShadow: "lg",
        borderColor: "blue.300",
      }}
      position="relative"
      cursor="pointer"
      onClick={() => navigate(`/teams/${team.id}`)}
    >
      {/* Top bar */}
      <Box
        position="absolute"
        left={0}
        top={0}
        w="100%"
        h="4px"
        bgGradient="linear(to-r, blue.400, purple.500, blue.400)"
        borderTopRadius="2xl"
      />

      {/* Glow effect */}
      <Box
        position="absolute"
        top="4px"
        right={0}
        w="140px"
        h="140px"
        bgGradient="linear(45deg, transparent 30%, blue.50 100%)"
        opacity={0.6}
        borderRadius="0 0 0 100%"
      />

      {/* Header */}
      <Flex justify="space-between" align="flex-start" mb={4}>
        <Flex gap={3}>
          <Center
            bg="blue.50"
            w="50px"
            h="50px"
            borderRadius="lg"
            color="blue.500"
          >
            <Icon as={FaUsers} boxSize={6} />
          </Center>
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold" fontSize="lg" color={textColor}>
              {team.name}
            </Text>
            <Badge colorScheme="blue" rounded="full" px={2} fontSize="xs">
              {team.totalMembers} members
            </Badge>
          </VStack>
        </Flex>

        {/* Actions */}
        <Flex gap={1}>
          <Tooltip label="Edit">
            <IconButton
              size="sm"
              icon={<FiEdit />}
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(team);
              }}
            />
          </Tooltip>
          {/* <Tooltip label="Delete">
            <IconButton
              size="sm"
              icon={<FiTrash2 />}
              variant="ghost"
              colorScheme="red"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(team.id);
              }}
            />
          </Tooltip> */}
        </Flex>
      </Flex>

      {/* Description */}
      <Text color={subTextColor} fontSize="sm" mb={4} noOfLines={2}>
        {team.description}
      </Text>

      {/* Team Leader */}
      <Flex align="center" gap={2} mb={4}>
        <Avatar
          size="sm"
          name={team.teamLeader.label}
          src={team.teamLeader.avatar}
        />
        <Box>
          <Text fontSize="sm" fontWeight="500" color={textColor}>
            {team.teamLeader.label}
          </Text>
          <Text fontSize="xs" color={subTextColor}>
            {team.teamLeader.role}
          </Text>
        </Box>
      </Flex>

      {/* Team Members and Stats */}
      <Flex justify="space-between" align="center">
        <AvatarGroup size="sm" max={4} spacing="-2">
          {team.employees.map((emp, idx) => (
            <Avatar key={idx} name={emp.label} src={emp.avatar} />
          ))}
        </AvatarGroup>

        <HStack spacing={3}>
          <HStack spacing={1}>
            <Icon as={FiUsers} color={subTextColor} />
            <Text fontSize="sm" color={subTextColor}>
              {team.activeLeads} leads
            </Text>
          </HStack>
          <Badge colorScheme="green" rounded="full" px={2} fontSize="xs">
            {team.status}
          </Badge>
        </HStack>
      </Flex>
    </Box>
  );

  return (
    <Box p={6}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
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
              onClose={onClose}
              onSubmit={handleSubmit}
              initialData={selectedTeam}
              isEditing={modalType === "edit"}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Teams;
