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
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { useToast, useDisclosure } from "@chakra-ui/react";
import NoData from "components/Message/NoData";
import TableLoading from "components/loading/TableLoading";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import CustomTooltip from "components/shared/CustomTooltip";
import { useNavigate } from "react-router-dom";
import { useTeams } from "../hooks/useTeams";
import ViewTeamModal from "./ViewModal";
import { useModalColors } from "hooks/useModalColors";

const TeamsTable = ({ data = [], isLoading = false, onEdit, refetch }) => {
  const colors = useModalColors();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const [delayedLoading, setDelayedLoading] = useState(isLoading);
  const navigate = useNavigate();
  const { deleteTeam, isDeletingTeam } = useTeams();

  const columns = [
    { key: "team", label: "Team", width: "280px" },
    { key: "description", label: "Description", width: "250px" },
    { key: "teamLeader", label: "Team Leader", width: "200px" },
    { key: "members", label: "Members", width: "150px" },
    { key: "createdAt", label: "Created", width: "150px" },
    { key: "actions", label: "Actions", width: "120px" },
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

  const formatValue = (key, value, row) => {
    switch (key) {
      case "createdAt":
        return row.createdAt
          ? format(new Date(row.createdAt), "MMM d, yyyy")
          : "N/A";

      case "teamLeader":
        return row.leader ? (
          <Flex align="center" gap={2}>
            <Avatar size="sm" name={row.leader.fullName} />
            <Box>
              <Text fontWeight="500" fontSize="sm" color={colors.headingText}>
                {row.leader.fullName}
              </Text>
              <Text fontSize="xs" color={colors.mutedText}>
                {row.leader.agency?.name || "No Agency"}
              </Text>
            </Box>
          </Flex>
        ) : (
          <Text color={colors.mutedText}>No Leader</Text>
        );

      case "members":
        return (
          <Flex direction="column" gap={2}>
            <AvatarGroup size="sm" max={3} spacing="-2">
              {row.members?.slice(0, 3).map((member, idx) => (
                <Avatar key={member._id || idx} name={member.fullName} />
              ))}
            </AvatarGroup>
            <Text fontSize="xs" color={colors.mutedText}>
              {row.members?.length || 0} total members
            </Text>
          </Flex>
        );

      case "team":
        return (
          <Box>
            <Text fontWeight="600" fontSize="sm" color={colors.headingText}>
              {row.name}
            </Text>
            <Text fontSize="xs" color={colors.mutedText} noOfLines={1}>
              ID: {row._id?.slice(-6)}
            </Text>
            {row.createdBy && (
              <Text fontSize="xs" color={colors.mutedText}>
                Created by: {row.createdBy.fullName}
              </Text>
            )}
          </Box>
        );

      case "description":
        return (
          <Text fontSize="sm" color={colors.bodyText} noOfLines={2}>
            {row.description || "No description"}
          </Text>
        );

      default:
        return value || "N/A";
    }
  };

  return (
    <>
      <Box
        my="2"
        overflowX="auto"
        overflowY="auto"
            maxHeight="80vh"
      minH="70vh"
        borderWidth="1px"
        borderColor={colors.borderColor}
        rounded="xl"
        boxShadow={colors.cardShadow}
        bg={colors.bg}
      >
        <Table variant="simple" size="sm">
          <Thead bg={colors.bgDeep} position="sticky" top={0} zIndex={1}>
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
                  color={colors.headingText}
                  minW={column.width}
                  bg={colors.bgDeep}
                  borderColor={colors.borderColor}
                >
                  {column.label}
                </Th>
              ))}
            </Tr>
          </Thead>

          <Tbody>
            {isLoading || delayedLoading ? (
              <TableLoading columns={columns} length={10} py="4" />
            ) : !data || data.length === 0 ? (
              <Tr>
                <Td colSpan={columns.length} py={10} borderColor={colors.borderColor}>
                  <Center>
                    <NoData label="teams" />
                  </Center>
                </Td>
              </Tr>
            ) : (
              data.map((row, index) => (
                <Tr
                  key={row._id || index}
                  _hover={{ bg: colors.bgDeep }}
                  bg={index % 2 === 0 ? colors.bg : colors.bgInput}
                  borderColor={colors.borderColor}
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
                      color={colors.bodyText}
                      borderColor={colors.borderColor}
                    >
                      {column.key === "actions" ? (
                        <Flex
                          align="center"
                          justifyContent="center"
                          gap={2}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <CustomTooltip label="View Team">
                            <IconButton
                              size="sm"
                              icon={<FiEye />}
                              variant="ghost"
                              onClick={(e) => handleView(row, e)}
                              color={colors.bodyText}
                              _hover={{ color: colors.accentGold, bg: colors.bgDeep }}
                            />
                          </CustomTooltip>

                          <CustomTooltip label="Edit Team">
                            <IconButton
                              aria-label="Edit"
                              icon={<FiEdit />}
                              size="sm"
                              variant="ghost"
                              onClick={(e) => handleEdit(row, e)}
                              color={colors.bodyText}
                              _hover={{ color: colors.accentGold, bg: colors.bgDeep }}
                            />
                          </CustomTooltip>

                          <CustomTooltip label="Delete Team">
                            <IconButton
                              size="sm"
                              icon={<FiTrash2 />}
                              variant="ghost"
                              isLoading={isDeletingTeam}
                              onClick={(e) => handleDelete(row._id, e)}
                              color={colors.badgeErrorText}
                              _hover={{ bg: colors.badgeErrorBg, color: colors.badgeErrorText }}
                            />
                          </CustomTooltip>
                        </Flex>
                      ) : (
                        formatValue(column.key, null, row)
                      )}
                    </Td>
                  ))}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
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

export default TeamsTable;