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
  Button,
  Tooltip,
  useColorModeValue,
  SimpleGrid,
  AvatarGroup,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { FiEdit, FiEye, FiTrash2, FiUsers } from "react-icons/fi";
import { FaUsers } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTeams } from "../hooks/useTeams";
import ViewTeamModal from "./ViewModal";

const Teams = ({ data = [], onEdit }) => {
  const navigate = useNavigate();
  const { deleteTeam, isDeletingTeam } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  const handleView = (team, e) => {
    e.stopPropagation();
    setSelectedTeam(team);
    onViewOpen();
  };

  const handleEdit = (team, e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(team);
    }
  };

  const handleDelete = async (teamId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await deleteTeam(teamId);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const TeamCard = ({ team }) => {
    const totalMembers = team.members?.length || 0;

    return (
      <Box
        bg={useColorModeValue("white", "gray.800")}
        rounded="2xl"
        border="1px solid"
        borderColor={useColorModeValue("gray.200", "gray.700")}
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
      >
        <Box
          position="absolute"
          left={0}
          top={0}
          w="100%"
          h="4px"
          bgGradient="linear(to-r, blue.400, purple.500, blue.400)"
          borderTopRadius="2xl"
        />

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
              <Text
                fontWeight="bold"
                fontSize="lg"
                color={useColorModeValue("gray.800", "whiteAlpha.900")}
              >
                {team.name}
              </Text>
              <Badge colorScheme="blue" rounded="full" px={2} fontSize="xs">
                {totalMembers} members
              </Badge>
            </VStack>
          </Flex>

          <Flex gap={1}>
            <Tooltip label="View">
              <IconButton
                size="sm"
                icon={<FiEye />}
                variant="ghost"
                colorScheme="blue"
                onClick={(e) => handleView(team, e)}
              />
            </Tooltip>
            <Tooltip label="Edit">
              <IconButton
                size="sm"
                icon={<FiEdit />}
                variant="ghost"
                onClick={(e) => handleEdit(team, e)}
              />
            </Tooltip>
            <Tooltip label="Delete">
              <IconButton
                size="sm"
                icon={<FiTrash2 />}
                variant="ghost"
                colorScheme="red"
                isLoading={isDeletingTeam}
                onClick={(e) => handleDelete(team._id, e)}
              />
            </Tooltip>
          </Flex>
        </Flex>

        <Text
          color={useColorModeValue("gray.600", "gray.400")}
          fontSize="sm"
          mb={4}
          noOfLines={2}
        >
          {team.description || "No description provided"}
        </Text>

        <Flex align="center" gap={2} mb={4}>
          <Avatar
            size="sm"
            name={team.leader?.fullName || "Team Leader"}
            src={team.leader?.profileImage}
          />
          <Box>
            <Text
              fontSize="sm"
              fontWeight="500"
              color={useColorModeValue("gray.800", "whiteAlpha.900")}
            >
              {team.leader?.fullName || "No Leader Assigned"}
            </Text>
            <Text
              fontSize="xs"
              color={useColorModeValue("gray.600", "gray.400")}
            >
              Team Leader
            </Text>
          </Box>
        </Flex>

        <Flex justify="space-between" align="center">
          <AvatarGroup size="sm" max={4} spacing="">
            {team.members?.map((member, idx) => (
              <Avatar
                key={idx}
                name={member.fullName || member.username}
                src={member.profileImage}
              />
            ))}
          </AvatarGroup>

          <HStack spacing={3}>
            <Badge colorScheme="green" rounded="full" px={2} fontSize="xs">
              ACTIVE
            </Badge>
          </HStack>
        </Flex>
      </Box>
    );
  };

  return (
    <>
      <Box pt={6}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {data?.map((team) => (
            <TeamCard key={team._id} team={team} />
          ))}
        </SimpleGrid>
      </Box>

      {/* View Team Modal */}
      <ViewTeamModal
        isOpen={isViewOpen}
        onClose={onViewClose}
        team={selectedTeam}
      />
    </>
  );
};

export default Teams;
