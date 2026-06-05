// ViewTeamModal.js
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  Avatar,
  Badge,
  SimpleGrid,
  Divider,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { format } from "date-fns";
import {
  FaUsers,
  FaUserTie,
  FaCalendarAlt,
  FaUserCircle,
} from "react-icons/fa";
import { useModalColors } from "hooks/useModalColors";

const ViewTeamModal = ({ isOpen, onClose, team }) => {
  const colors = useModalColors();

  const formatDate = (date) => {
    if (!date) return "N/A";
    return format(new Date(date), "MMM dd, yyyy");
  };

  // Early return after all hooks are called
  if (!team) return null;

  // Custom scrollbar styles using theme colors
  const scrollbarStyles = {
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      background: colors.bgInput,
      borderRadius: "full",
    },
    "&::-webkit-scrollbar-thumb": {
      background: colors.borderColor,
      borderRadius: "full",
    },
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(4px)" />
      <ModalContent
        maxW="1000px"
        bg={colors.viewBg}
        borderRadius="2xl"
        boxShadow={colors.modalShadow}
        border="1px solid"
        borderColor={colors.borderColor}
        overflow="hidden"
      >
        <ModalHeader
          bg={colors.viewHeaderBg}
          color={colors.viewHeaderText}
          borderTopRadius="xl"
          py={4}
          borderBottom="1px solid"
          borderColor={colors.viewHeaderBorder}
        >
          <Flex align="center" gap={2}>
            <Icon as={FaUsers} boxSize={5} />
            <Text>Team Details</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton
          color={colors.viewHeaderText}
          _hover={{ bg: colors.closeBtnHoverBg }}
        />

        <ModalBody py={6}>
          <VStack spacing={5} align="stretch">
            {/* Team Name and Team Leader in the same row */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {/* Team Name Section */}
              <Box>
                <Text fontSize="xs" color={colors.mutedText} mb={2}>
                  Team Name
                </Text>
                <Box p={4} bg={colors.bgInput} borderRadius="lg" border="1px solid" borderColor={colors.borderColor}>
                  <Text fontSize="2xl" fontWeight="bold" color={colors.headingText}>
                    {team.name}
                  </Text>
                  <Text fontSize="sm" color={colors.bodyText} mt={2}>
                    {team.description || "No description provided"}
                  </Text>
                </Box>
              </Box>

              {/* Team Leader Section */}
              <Box>
                <Text fontSize="xs" color={colors.mutedText} mb={2}>
                  Team Leader
                </Text>
                {team.leader ? (
                  <Flex
                    align="center"
                    gap={4}
                    p={4}
                    bg={colors.bgInput}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={colors.borderColor}
                  >
                    <Avatar
                      size="lg"
                      name={team.leader.fullName}
                      src={team.leader.profileImage}
                    />
                    <Box flex={1}>
                      <Text fontWeight="600" fontSize="md" color={colors.headingText}>
                        {team.leader.fullName}
                      </Text>
                      <Text fontSize="sm" color={colors.mutedText}>
                        {team.leader.username}
                      </Text>
                      {team.leader.agency && (
                        <Badge
                          bg={colors.badgeInfoBg}
                          color={colors.badgeInfoText}
                          mt={1}
                          px={2}
                          py={1}
                          borderRadius="full"
                        >
                          {team.leader.agency.name}
                        </Badge>
                      )}
                    </Box>
                  </Flex>
                ) : (
                  <Box
                    p={4}
                    bg={colors.bgInput}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={colors.borderColor}
                  >
                    <Text color={colors.mutedText}>No team leader assigned</Text>
                  </Box>
                )}
              </Box>
            </SimpleGrid>

            <Divider borderColor={colors.borderColor} />

            {/* Team Members Section - Full Width */}
            <Box>
              <Flex align="center" justify="space-between" mb={4}>
                <Flex align="center" gap={2}>
                  <Icon as={FaUsers} color={colors.bodyText} />
                  <Text fontWeight="bold" fontSize="lg" color={colors.headingText}>
                    Team Members
                  </Text>
                </Flex>
                <Badge
                  bg={colors.badgeInfoBg}
                  color={colors.badgeInfoText}
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  {team.members?.length || 0} members
                </Badge>
              </Flex>

              {team.members && team.members.length > 0 ? (
                <Box maxH="230px" overflowY="auto" pr={2} sx={scrollbarStyles}>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
                    {team.members.map((member, index) => (
                      <Flex
                        key={member._id || index}
                        align="center"
                        gap={3}
                        p={3}
                        bg={colors.bgInput}
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor={colors.borderColor}
                        _hover={{ bg: colors.bgDeep, borderColor: colors.borderColor }}
                        transition="all 0.2s"
                      >
                        <Avatar
                          size="sm"
                          name={member.fullName}
                          src={member.profileImage}
                        />
                        <Box flex={1} minW={0}>
                          <Text fontWeight="500" fontSize="sm" noOfLines={1} color={colors.headingText}>
                            {member.fullName}
                          </Text>
                          <Text fontSize="xs" color={colors.mutedText} noOfLines={1}>
                            {member.username}
                          </Text>
                        </Box>
                        {member.agency && (
                          <Badge
                            size="sm"
                            bg={colors.badgeSuccessBg}
                            color={colors.badgeSuccessText}
                            whiteSpace="nowrap"
                            fontSize="xs"
                            px={2}
                            py={1}
                            borderRadius="full"
                          >
                            {member.agency.name}
                          </Badge>
                        )}
                      </Flex>
                    ))}
                  </SimpleGrid>
                </Box>
              ) : (
                <Box
                  p={4}
                  bg={colors.bgInput}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={colors.borderColor}
                  textAlign="center"
                >
                  <Text color={colors.mutedText}>No team members assigned</Text>
                </Box>
              )}
            </Box>

            <Divider borderColor={colors.borderColor} />

            {/* Meta Information */}
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
              <Box>
                <Text fontSize="xs" color={colors.mutedText} mb={1}>
                  Created By
                </Text>
                <Flex align="center" gap={2}>
                  <Icon as={FaUserCircle} size="12px" color={colors.mutedText} />
                  <Text fontSize="sm" color={colors.bodyText}>
                    {team.createdBy?.fullName || "Unknown"}
                  </Text>
                </Flex>
              </Box>

              <Box>
                <Text fontSize="xs" color={colors.mutedText} mb={1}>
                  Created At
                </Text>
                <Flex align="center" gap={2}>
                  <Icon as={FaCalendarAlt} size="12px" color={colors.mutedText} />
                  <Text fontSize="sm" color={colors.bodyText}>
                    {formatDate(team.createdAt)}
                  </Text>
                </Flex>
              </Box>

              <Box>
                <Text fontSize="xs" color={colors.mutedText} mb={1}>
                  Last Updated
                </Text>
                <Flex align="center" gap={2}>
                  <Icon as={FaCalendarAlt} size="12px" color={colors.mutedText} />
                  <Text fontSize="sm" color={colors.bodyText}>
                    {formatDate(team.updatedAt)}
                  </Text>
                </Flex>
              </Box>

              <Box>
                <Text fontSize="xs" color={colors.mutedText} mb={1}>
                  Team ID
                </Text>
                <Text fontSize="sm" fontFamily="mono" color={colors.bodyText}>
                  {team._id?.slice(-8)}
                </Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </ModalBody>

        <ModalFooter
          bg={colors.viewFooterBg}
          borderTop="1px solid"
          borderColor={colors.viewFooterBorder}
        >
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewTeamModal;