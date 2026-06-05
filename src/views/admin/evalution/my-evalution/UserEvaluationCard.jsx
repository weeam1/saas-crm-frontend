import {
  Box,
  Flex,
  Avatar,
  Text,
  Badge,
  IconButton,
  Center,
  Tooltip,
  SimpleGrid,
  CircularProgress,
  Stack,
  Skeleton,
  Icon,
  useDisclosure,
  Modal,
  HStack,
  ModalOverlay,
  VStack,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { constant } from "constant";
import {
  FiEye,
  FiClock,
  FiCheck,
  FiCalendar,
  FiTrash2,
  FiUsers,
  FiBarChart2,
} from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NoData from "components/Message/NoData";
import { getBadgeColors } from "utils/colorUtils";
import useUserSession from "hooks/useUserSession";
import { format } from "date-fns";
import { useModalColors } from "hooks/useModalColors";

// Skeleton card while loading
const CardSkeleton = () => {
  const colors = useModalColors();
  return (
    <Box
      bg={colors.bg}
      rounded="2xl"
      border="1px solid"
      borderColor={colors.borderColor}
      p={4}
      overflow="hidden"
      boxShadow={colors.cardShadow}
      position="relative"
      minH="240px"
    >
      <Skeleton height="4px" borderTopRadius="2xl" mb={4} />
      <Box
        position="absolute"
        top="4px"
        right={0}
        w="140px"
        h="140px"
        bg={colors.bgInput}
        opacity={0.3}
        borderRadius="0 0 0 100%"
      />
      <Flex justify="space-between" align="flex-start" mb={4}>
        <Flex gap={3}>
          <Skeleton circle size="64px" />
          <Stack spacing={2}>
            <Skeleton height="18px" width="140px" />
            <Skeleton height="16px" width="90px" />
            <Skeleton height="16px" width="110px" />
          </Stack>
        </Flex>
        <Stack spacing={3}>
          <Skeleton height="32px" width="32px" />
          <Skeleton height="32px" width="32px" />
        </Stack>
      </Flex>
      <Flex gap={6} align="center">
        <Stack spacing={2} flexShrink={0}>
          <Skeleton height="16px" width="90px" />
          <Skeleton height="16px" width="90px" />
          <Skeleton height="20px" width="110px" />
        </Stack>
        <Skeleton circle size="90px" />
      </Flex>
    </Box>
  );
};

const UserEvaluationCards = ({
  data = [],
  isLoading,
  confirmDelete,
  setView,
  month,
  year,
}) => {
  const colors = useModalColors();
  const navigate = useNavigate();
  const { user: loggedInUser } = useUserSession();
  const [delayedLoading, setDelayedLoading] = useState(isLoading);

  // Delete modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    let timer;
    if (isLoading) setDelayedLoading(true);
    else timer = setTimeout(() => setDelayedLoading(false), 400);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Helper function to format month-year
  const formatMonthYear = (row) => {
    if (row?.month && row?.year) {
      return format(new Date(row.year, row.month - 1), "MMM yyyy");
    }
    return "N/A";
  };

  return (
    <>
      <Box my={4}>
        {delayedLoading ? (
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 2, xl: 3, "2xl": 4 }}
            spacing={4}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </SimpleGrid>
        ) : data.length === 0 ? (
          <Center py={10}>
            <NoData label="user evaluation" />
          </Center>
        ) : (
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 2, xl: 3, "2xl": 4 }}
            spacing={4}
          >
            {data.map((user) => {
              // Get aggregated evaluation data
              const evaluations = user?.evaluations || [];
              const finalEvaluation = {
                totalEvaluators: user.totalEvaluators ?? 0,
                finalAvg: user.finalAvg ?? 0,
                finalPercentage: user.finalPercentage ?? 0,
              };
              const hasEvaluated = evaluations.length > 0;

              // Role & agency
              const roleName = user?.user?.roles?.[0]?.roleName || "Unknown";
              const agencyName = user?.agency?.name || "No Agency";

              const { bg: roleBg, text: roleText } = getBadgeColors(roleName);
              const { bg: agencyBg, text: agencyText } =
                getBadgeColors(agencyName);

              // Performance bar color
              const getPerfColor = (percentage = 0) => {
                if (percentage >= 70) return "green";
                if (percentage >= 50) return "yellow";
                return "red";
              };
              const perfColor = getPerfColor(finalEvaluation.finalPercentage);

              const imgSrc = user?.user?.profileImage
                ? `${constant.baseUrl}${user.user.profileImage}`
                : undefined;

              // Format month-year
              const monthYear = formatMonthYear(user);

              return (
                <Box
                  key={user?._id}
                  bg={colors.bg}
                  rounded="2xl"
                  border="1px solid"
                  borderColor={colors.borderColor}
                  p={3}
                  overflow="hidden"
                  boxShadow={colors.cardShadow}
                  transition="transform .2s, box-shadow .2s"
                  _hover={{ transform: "translateY(-3px)", boxShadow: colors.modalShadow }}
                  position="relative"
                >
                  {/* Top bar */}
                  <Box
                    position="absolute"
                    left={0}
                    top={0}
                    w="100%"
                    h="4px"
                    bgGradient={`linear(to-r, ${perfColor}.400, ${perfColor}.600, ${perfColor}.400)`}
                    borderTopRadius="2xl"
                  />

                  {/* Glow */}
                   <Box
                                position='absolute'
                                top='4px'
                                right={0}
                                w='140px'
                                h='140px'
                                // bgGradient={`linear(45deg, transparent 30%, ${perfColor}.50 100%)`}
                 bgGradient={`linear(135deg, transparent 30%, ${perfColor}.200 100%)`}

                                opacity={0.1}
                                borderRadius='0 0 0 100%'
                                transition='all 0.3s ease'
                              />

                  {/* Header: Avatar + Name + Badges + Actions */}
                  <Flex justify="space-between" align="flex-start" mb={4}>
                    <Flex gap={3}>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" fontSize="md" noOfLines={1} color={colors.headingText}>
                          {monthYear}
                        </Text>
                      </VStack>
                    </Flex>

                    {/* Actions */}
                    <Flex gap={1}>
                      {hasEvaluated && (
                        <Tooltip label="View">
                          <IconButton
                            alignItems="flex-start"
                            mt={1}
                            size="sm"
                            icon={<FiEye />}
                            variant="ghost"
                            onClick={() => setView({ modal: true, data: user })}
                            color={colors.bodyText}
                            _hover={{ color: colors.accentGold, bg: colors.bgDeep }}
                          />
                        </Tooltip>
                      )}
                    </Flex>
                  </Flex>

                  {/* Stats + Circular Progress */}
                  <Flex justify="space-between" align="center" mb={4} gap={4}>
                    {/* Left Stats Section */}
                    <VStack
                      spacing={3}
                      align="stretch"
                      flex="1"
                      minW="100px"
                      maxW="170px"
                    >
                      <HStack justify="space-between">
                        <HStack spacing={2}>
                          <Icon as={FiUsers} boxSize={4} color={colors.mutedText} />
                          <Text fontSize="sm" color={colors.mutedText}>
                            Evaluators
                          </Text>
                        </HStack>
                        <Badge
                          px={2}
                          py={1}
                          fontSize="sm"
                          rounded="full"
                          bg={colors.badgeInfoBg}
                          color={colors.badgeInfoText}
                        >
                          {finalEvaluation.totalEvaluators}
                        </Badge>
                      </HStack>

                      <HStack justify="space-between">
                        <HStack spacing={2}>
                          <Icon
                            as={FiBarChart2}
                            boxSize={4}
                            color={colors.mutedText}
                          />
                          <Text fontSize="sm" color={colors.mutedText}>
                            Average
                          </Text>
                        </HStack>
                        <Badge
                          px={2}
                          py={1}
                          fontSize="sm"
                          rounded="full"
                          bg={colors.badgeInfoBg}
                          color={colors.badgeInfoText}
                        >
                          {finalEvaluation.finalAvg}/10
                        </Badge>
                      </HStack>
                    </VStack>

                    {/* Right Circular Progress Section */}
                    <Flex direction="column" align="center" gap={2}>
                      <Box position="relative">
                        <CircularProgress
                          value={finalEvaluation.finalPercentage}
                          color={
                            finalEvaluation.finalPercentage > 70
                              ? "green.500"
                              : finalEvaluation.finalPercentage >= 50
                                ? "yellow.500"
                                : "red.500"
                          }
                          size={{ base: "70px", lg: "90px" }}
                          thickness="7px"
                        />
                        <Center position="absolute" inset={0}>
                          <VStack spacing={0}>
                            <Text fontWeight="bold" fontSize="lg" color={colors.headingText}>
                              {Math.round(finalEvaluation.finalPercentage)}%
                            </Text>
                            <Text fontSize="xs" color={colors.mutedText}>
                              Score
                            </Text>
                          </VStack>
                        </Center>
                      </Box>
                      <Text fontWeight="bold" fontSize="11px" color={colors.mutedText}>
                        Performance
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              );
            })}
          </SimpleGrid>
        )}
      </Box>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        closeOnOverlayClick={false}
        blockScrollOnMount={false}
      >
        <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(4px)" />
        <ModalContent bg={colors.bg} borderRadius="2xl" boxShadow={colors.modalShadow}>
          <ModalHeader bg={colors.headerBg} color={colors.headerText} borderTopRadius="xl">
            Delete Evaluation
          </ModalHeader>
          <ModalCloseButton color={colors.headerText} _hover={{ bg: colors.closeBtnHoverBg }} />
          <ModalBody color={colors.bodyText}>
            Are you sure you want to delete {selectedRow?.user?.fullName}'s
            evaluation for{" "}
            {selectedRow ? formatMonthYear(selectedRow) : "this month"}?
          </ModalBody>

          <ModalFooter bg={colors.footerBg} borderTop="1px solid" borderColor={colors.borderColor}>
            <Button variant="ghost" mr={3} onClick={onClose} color={colors.bodyText}>
              Cancel
            </Button>
            <Button
              variant="brand"
              onClick={() => {
                if (selectedRow) {
                  confirmDelete(
                    selectedRow.user._id,
                    selectedRow.month,
                    selectedRow.year,
                    onClose,
                    "MYEVAL",
                  );
                }
              }}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserEvaluationCards;