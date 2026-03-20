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
  useColorModeValue,
} from "@chakra-ui/react";
import { format } from "date-fns";
import {
  FaUsers,
  FaUserTie,
  FaCalendarAlt,
  FaUserCircle,
} from "react-icons/fa";

const ViewTeamModal = ({ isOpen, onClose, team }) => {
  // Move all hooks to the top, before any conditional returns
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgHover = useColorModeValue("gray.50", "gray.700");
  const bgSection = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const scrollbarTrackBg = useColorModeValue("gray.100", "gray.700");
  const scrollbarThumbBg = useColorModeValue("gray.400", "gray.500");

  const formatDate = (date) => {
    if (!date) return "N/A";
    return format(new Date(date), "MMM dd, yyyy");
  };

  // Early return after all hooks are called
  if (!team) return null;

  // Custom scrollbar styles
  const scrollbarStyles = {
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      background: scrollbarTrackBg,
      borderRadius: "full",
    },
    "&::-webkit-scrollbar-thumb": {
      background: scrollbarThumbBg,
      borderRadius: "full",
    },
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent maxW="1000px">
        <ModalHeader bg="brand.500" color="white" borderTopRadius="md">
          <Flex align="center" gap={2}>
            <Icon as={FaUsers} boxSize={5} />
            <Text>Team Details</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="white" _hover={{ bg: "brand.600" }} />

        <ModalBody py={6}>
          <VStack spacing={5} align="stretch">
            {/* Team Name and Team Leader in the same row */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {/* Team Name Section */}
              <Box>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  Team Name
                </Text>
                <Box p={4} bg={bgSection} borderRadius="lg">
                  <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                    {team.name}
                  </Text>
                  <Text fontSize="sm" color={textColor} mt={2}>
                    {team.description || "No description provided"}
                  </Text>
                </Box>
              </Box>

              {/* Team Leader Section */}
              <Box>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  Team Leader
                </Text>
                {team.leader ? (
                  <Flex
                    align="center"
                    gap={4}
                    p={4}
                    bg={bgHover}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                  >
                    <Avatar
                      size="lg"
                      name={team.leader.fullName}
                      src={team.leader.profileImage}
                    />
                    <Box flex={1}>
                      <Text fontWeight="600" fontSize="md">
                        {team.leader.fullName}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {team.leader.username}
                      </Text>
                      {team.leader.agency && (
                        <Badge colorScheme="purple" mt={1}>
                          {team.leader.agency.name}
                        </Badge>
                      )}
                    </Box>
                  </Flex>
                ) : (
                  <Box
                    p={4}
                    bg={bgHover}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                  >
                    <Text color="gray.500">No team leader assigned</Text>
                  </Box>
                )}
              </Box>
            </SimpleGrid>

            <Divider />

            {/* Team Members Section - Full Width */}
            <Box>
              <Flex align="center" justify="space-between" mb={4}>
                <Flex align="center" gap={2}>
                  <Icon as={FaUsers} color="green.500" />
                  <Text fontWeight="bold" fontSize="lg">
                    Team Members
                  </Text>
                </Flex>
                <Badge colorScheme="blue" borderRadius="full" px={3} py={1}>
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
                        bg={bgHover}
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor={borderColor}
                        _hover={{ bg: hoverBg }}
                      >
                        <Avatar
                          size="sm"
                          name={member.fullName}
                          src={member.profileImage}
                        />
                        <Box flex={1} minW={0}>
                          <Text fontWeight="500" fontSize="sm" noOfLines={1}>
                            {member.fullName}
                          </Text>
                          <Text fontSize="xs" color="gray.500" noOfLines={1}>
                            {member.username}
                          </Text>
                        </Box>
                        {member.agency && (
                          <Badge
                            size="sm"
                            colorScheme="green"
                            whiteSpace="nowrap"
                            fontSize="xs"
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
                  bg={bgHover}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                  textAlign="center"
                >
                  <Text color="gray.500">No team members assigned</Text>
                </Box>
              )}
            </Box>

            <Divider />

            {/* Meta Information */}
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
              <Box>
                <Text fontSize="xs" color="gray.500" mb={1}>
                  Created By
                </Text>
                <Flex align="center" gap={2}>
                  <Icon as={FaUserCircle} size="12px" color="gray.400" />
                  <Text fontSize="sm">
                    {team.createdBy?.fullName || "Unknown"}
                  </Text>
                </Flex>
              </Box>

              <Box>
                <Text fontSize="xs" color="gray.500" mb={1}>
                  Created At
                </Text>
                <Flex align="center" gap={2}>
                  <Icon as={FaCalendarAlt} size="12px" color="gray.400" />
                  <Text fontSize="sm">{formatDate(team.createdAt)}</Text>
                </Flex>
              </Box>

              <Box>
                <Text fontSize="xs" color="gray.500" mb={1}>
                  Last Updated
                </Text>
                <Flex align="center" gap={2}>
                  <Icon as={FaCalendarAlt} size="12px" color="gray.400" />
                  <Text fontSize="sm">{formatDate(team.updatedAt)}</Text>
                </Flex>
              </Box>

              <Box>
                <Text fontSize="xs" color="gray.500" mb={1}>
                  Team ID
                </Text>
                <Text fontSize="sm" fontFamily="mono">
                  {team._id?.slice(-8)}
                </Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="brand" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewTeamModal;
