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
import DeleteConfirmationModal from "./components/DeleteConfrimationModal";
import { useModalColors } from "hooks/useModalColors";

const Teams = ({ data = [], onEdit, onDelete }) => {
  const colors = useModalColors();
  const navigate = useNavigate();
  const { deleteTeam, isDeletingTeam } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState(null);

  // State for delete confirmation modal
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    teamId: null,
    teamName: "",
    team: null,
  });

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

  // Updated handleDelete to open modal instead of using window.confirm
  const handleDelete = (team, e) => {
    e.stopPropagation();
    setDeleteConfirmation({
      isOpen: true,
      teamId: team._id,
      teamName: team.name,
      team: team,
    });
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirmation.teamId) return;

    try {
      // If onDelete prop is provided (from parent), use it
      if (onDelete) {
        await onDelete(deleteConfirmation.teamId, deleteConfirmation.teamName);
      } else {
        // Otherwise use the hook directly
        await deleteTeam(deleteConfirmation.teamId);
      }

      // Close modal after successful deletion
      setDeleteConfirmation({
        isOpen: false,
        teamId: null,
        teamName: "",
        team: null,
      });
    } catch (error) {
      console.error("Delete error:", error);
      // Error is already handled in the hook with toast
    }
  };

  const TeamCard = ({ team }) => {
    const totalMembers = team.members?.length || 0;

    return (
      <Box
        bg={colors.bg}
        rounded="2xl"
        border="1px solid"
        borderColor={colors.borderColor}
        p={4}
        boxShadow={colors.cardShadow}
        transition="transform .2s, box-shadow .2s"
        overflow="hidden"
        _hover={{
          transform: "translateY(-3px)",
          boxShadow: colors.modalShadow,
          borderColor: colors.accentGold,
        }}
        position="relative"
      >
        <Box
          position="absolute"
          left={0}
          top={0}
          w="100%"
          h="4px"
          bgGradient={`linear(to-r, ${colors.accentGold}, ${colors.goldLight}, ${colors.accentGold})`}
          borderTopRadius="2xl"
        />

        <Box
          position="absolute"
          top="4px"
          right={0}
          w="140px"
          h="140px"
          bgGradient={`linear(45deg, transparent 30%, ${colors.accentGold}15 100%)`}
          opacity={0.6}
          borderRadius="0 0 0 100%"
        />

        <Flex justify="space-between" align="flex-start" mb={4}>
          <Flex gap={3}>
            <Center
              bg={colors.badgeInfoBg}
              w="50px"
              h="50px"
              borderRadius="lg"
              color={colors.accentGold}
            >
              <Icon as={FaUsers} boxSize={6} />
            </Center>
            <VStack align="start" spacing={1}>
              <Text
                fontWeight="bold"
                fontSize="lg"
                color={colors.headingText}
              >
                {team.name}
              </Text>
              <Badge
                bg={colors.badgeInfoBg}
                color={colors.badgeInfoText}
                rounded="full"
                px={2}
                fontSize="xs"
              >
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
                onClick={(e) => handleView(team, e)}
                color={colors.bodyText}
                _hover={{ color: colors.accentGold, bg: colors.bgDeep }}
              />
            </Tooltip>
            <Tooltip label="Edit">
              <IconButton
                size="sm"
                icon={<FiEdit />}
                variant="ghost"
                onClick={(e) => handleEdit(team, e)}
                color={colors.bodyText}
                _hover={{ color: colors.accentGold, bg: colors.bgDeep }}
              />
            </Tooltip>
            <Tooltip label="Delete">
              <IconButton
                size="sm"
                icon={<FiTrash2 />}
                variant="ghost"
                isLoading={isDeletingTeam}
                onClick={(e) => handleDelete(team, e)}
                color={colors.badgeErrorText}
                _hover={{ bg: colors.badgeErrorBg, color: colors.badgeErrorText }}
              />
            </Tooltip>
          </Flex>
        </Flex>

        <Text
          color={colors.bodyText}
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
              color={colors.headingText}
            >
              {team.leader?.fullName || "No Leader Assigned"}
            </Text>
            <Text
              fontSize="xs"
              color={colors.mutedText}
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
            <Badge
              bg={colors.badgeSuccessBg}
              color={colors.badgeSuccessText}
              rounded="full"
              px={2}
              fontSize="xs"
            >
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() =>
          setDeleteConfirmation({
            isOpen: false,
            teamId: null,
            teamName: "",
            team: null,
          })
        }
        onConfirm={handleConfirmDelete}
        team={deleteConfirmation.team}
        isLoading={isDeletingTeam}
      />
    </>
  );
};

export default Teams;