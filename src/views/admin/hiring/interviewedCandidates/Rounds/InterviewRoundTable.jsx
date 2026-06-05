import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Box,
  Flex,
  Text,
  Button,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import TableLoading from "components/loading/TableLoading";
import FlagBadge from "../../_components/FlagBadge";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCreateItemMutation } from "api/apiSlice";
import { useUpdateItemMutation } from "api/apiSlice";
import { useState } from "react";
import { toUTCString } from "utils/helpers";
import ArrangeInterview from "../../shortListedCandidates/components/ArrangeInterview";
import MailIcon from "../../shortListedCandidates/components/MailIcon";
import useUserSession from "hooks/useUserSession";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import { FaClockRotateLeft } from "react-icons/fa6";
import CandidateStatusHistory from "../../_components/CandidateStatusHistory";
import { useModalColors } from "hooks/useModalColors";

const InterviewedRoundTable = ({
  headers,
  data,
  loading,
  handleSort,
  sortConfig,
  handleViewCandidate,
  handleViewResult,
  refetch,
  isFetching,
}) => {
  const colors = useModalColors();
  const [arrangeInterviewOpen, setArrangeInterviewOpen] = useState(false);
  const [candidate, setCandidate] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  const navigate = useNavigate();

  const [createItemMutation, { isLoading: startingInterview }] =
    useCreateItemMutation();

  const { user } = useUserSession();
  const { createUserLog } = useUserActivityLog();

  const [updateItemMutation, { isLoading: isInviting }] =
    useUpdateItemMutation();

  const handleStartInterview = async (interview) => {
    try {
      const data = await createItemMutation({
        path: `/interviews/start-next-round`,
        body: {
          candidateId: interview?.candidate?._id,
          interviewId: interview?._id,
        },
      }).unwrap();

      if (data?.status === "success" && data?.doc?._id) {
        window.location.href = `/hiring/interview/${data.doc._id}`;
        toast.success("Interview started...");

        createUserLog({
          userId: user?._id,
          action: "UPDATE",
          entity: "Hiring",
          entityId: interview?.candidate?._id,
          status: "success",
          message: `${user?.fullName} started the interview with ${interview?.candidate?.name}.`,
        });
      } else {
        toast.error("Invalid response from server.");
      }
    } catch (error) {
      console.log(error);

      const errorMsg =
        error?.data?.message || "Interview not started, please try again.";
      toast.error(errorMsg);

      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Hiring",
        entityId: interview?.candidate?._id,
        status: error?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    }
  };

  const handleScheduleInterview = async () => {
    try {
      await updateItemMutation({
        path: `/applications/schedule-interview/${candidate?._id}`,
        body: {
          interviewDate: toUTCString(selectedDate),
          interviewTime: selectedTime,
        },
      }).unwrap();

      toast.success("Invite succesfully sended");
      refetch();
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Hiring",
        entityType: "Application",
        entityId: candidate._id,
        status: "success",
        message: `Interview invitation sent to ${candidate.name} by ${user?.fullName}.`,
      });
    } catch (err) {
      console.log(err);
      const errorMsg =
        err?.data?.message || "Interview is not arranged, please try again.";
      toast.error(errorMsg);
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Hiring",
        entityType: "Application",
        entityId: candidate._id,
        status: err?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    } finally {
      setArrangeInterviewOpen(false);
    }
  };

  const handleArrangeInterview = async (candidate) => {
    setCandidate(candidate);
    setArrangeInterviewOpen(true);
  };
  const {
    isOpen: isHistoryOpen,
    onOpen: onHistoryOpen,
    onClose: onHistoryClose,
  } = useDisclosure();

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  return (
    <>
      <Box
              maxHeight="70vh"
      minH="70vh"
        overflowY="auto"
        scrollBehavior="smooth"
        borderRadius="xl"
        boxShadow={colors.cardShadow}
        bg={colors.bg}
        border="1px solid"
        borderColor={colors.borderColor}
      >
        <Table variant="simple" size="md">
          <Thead position="sticky" top={0} bg={colors.bgDeep} zIndex={1}>
            <Tr>
              {headers?.map((header) => (
                <Th
                  key={header.key}
                  textAlign="center"
                  color={colors.headingText}
                  width={header.width || "150px"}
                  py={4}
                  px={3}
                  fontSize="xs"
                  fontWeight="semibold"
                  letterSpacing="wider"
                  textTransform="capitalize"
                  borderBottom={`2px solid ${colors.borderColor}`}
                    whiteSpace="nowrap"
                >
                  <Flex align="center" justify="space-evenly" gap="4">
                    <Text>{header.label}</Text>
                    {header.key !== "action" && (
                      <IconButton
                        aria-label="Sort"
                        size="xs"
                        icon={
                          sortConfig.key === header.key &&
                          sortConfig.direction === "asc" ? (
                            <TriangleUpIcon />
                          ) : (
                            <TriangleDownIcon />
                          )
                        }
                        onClick={() => handleSort(header.key)}
                        variant="ghost"
                        color={colors.bodyText}
                        _hover={{
                          color: colors.accentGold,
                          bg: colors.secondaryBtnHoverBg,
                        }}
                      />
                    )}
                  </Flex>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {loading || isFetching ? (
              <TableLoading columns={headers} length={8} />
            ) : data && data?.length ? (
              data?.map((item, index) => (
                <Tr
                  key={index}
                  fontSize="sm"
                  _hover={{ bg: colors.bgInputHover }}
                  bg={colors.bg}
                  transition="background-color 0.2s ease-in-out"
                >
                  <Td
                    minWidth="300px"
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                  >
                    <HStack gap="1">
                      <span>{item.candidate?.name}</span>
                      <FlagBadge item={item.candidate} />
                    </HStack>
                  </Td>
                  <Td
                    minWidth="250px"
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                    color={colors.bodyText}
                  >
                    {item.candidate?.email}
                  </Td>
                  <Td
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                    color={colors.bodyText}
                  >
                    {item?.agency?.name ?? "N/A"}
                  </Td>
                  <Td
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                    color={colors.bodyText}
                  >
                    {item.position}
                  </Td>
                  <Td
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                    color={colors.bodyText}
                  >
                    {item.candidate?.phone}
                  </Td>
                  <Td
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                    color={colors.bodyText}
                  >
                    {item.candidate?.whatsApp}
                  </Td>
                  <Td
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                    color={colors.bodyText}
                  >
                    {item.jobType}
                  </Td>
                  <Td
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                    color={colors.bodyText}
                  >
                    {!item.remarks ? "No Result" : `${item.percentageScore}%`}
                  </Td>
                  <Td
                    py={3}
                    px={3}
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                  >
                    <HStack alignItems="center">
                      <Button
                        bg={colors.accentGold}
                        color={colors.headerText}
                        h="6"
                        py="2"
                        px="4"
                        fontSize="xs"
                        fontWeight="normal"
                        shadow="sm"
                        rounded="md"
                        _hover={{ bg: colors.goldLight }}
                        _active={{ bg: colors.goldDark }}
                        onClick={() => {
                          setSelectedCandidate(item.candidate);
                          onHistoryOpen();
                        }}
                      >
                        <FaClockRotateLeft />
                      </Button>
                      <Button
                        bg={colors.accentGold}
                        color={colors.headerText}
                        h="6"
                        py="2"
                        px="4"
                        fontSize="xs"
                        fontWeight="normal"
                        shadow="sm"
                        rounded="md"
                        _hover={{ bg: colors.goldLight }}
                        _active={{ bg: colors.goldDark }}
                        onClick={() =>
                          handleViewCandidate(item.candidate?._id)
                        }
                      >
                        View
                      </Button>

                      <Button
                        bg={colors.accentGold}
                        color={colors.headerText}
                        h="6"
                        py="2"
                        px="4"
                        flex={1}
                        fontSize="xs"
                        fontWeight="normal"
                        shadow="sm"
                        rounded="md"
                        _hover={{ bg: colors.goldLight }}
                        _active={{ bg: colors.goldDark }}
                        onClick={() => handleViewResult(item)}
                      >
                        {item?.remarks ? "Previous Result" : "Submit Result"}
                      </Button>

                      {item?.remarks && (
                        <Button
                          bg={colors.accentGold}
                          color={colors.headerText}
                          h="6"
                          py="2"
                          px="4"
                          fontSize="xs"
                          fontWeight="normal"
                          shadow="sm"
                          rounded="md"
                          _hover={{ bg: colors.goldLight }}
                          _active={{ bg: colors.goldDark }}
                          onClick={() =>
                            handleArrangeInterview(item.candidate)
                          }
                        >
                          {item?.candidate?.invited
                            ? "Reschedule"
                            : "Arrange Interview"}
                        </Button>
                      )}

                      {item?.remarks && item?.candidate?.invited && (
                        <Button
                          bg={colors.accentGold}
                          color={colors.headerText}
                          h="6"
                          py="2"
                          px="4"
                          flex={1}
                          fontSize="xs"
                          fontWeight="normal"
                          shadow="sm"
                          rounded="md"
                          _hover={{ bg: colors.goldLight }}
                          _active={{ bg: colors.goldDark }}
                          onClick={() => handleStartInterview(item)}
                        >
                          Start Interview
                        </Button>
                      )}

                      {item?.candidate?.invited && (
                        <MailIcon isRead={item?.candidate?.inviteAccepted} />
                      )}
                    </HStack>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={headers.length} py={10} textAlign="center" borderColor={colors.borderColor}>
                  <Text color={colors.mutedText} fontSize="sm" fontWeight="600">
                    No data found
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      {arrangeInterviewOpen && (
        <ArrangeInterview
          isOpen={arrangeInterviewOpen}
          onClose={() => setArrangeInterviewOpen(false)}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          isLoading={isInviting}
          handleScheduleInterview={handleScheduleInterview}
        />
      )}
      {isHistoryOpen && selectedCandidate && (
        <CandidateStatusHistory
          isOpen={isHistoryOpen}
          onClose={() => {
            onHistoryClose();
            setSelectedCandidate(null);
          }}
          candidate={selectedCandidate}
        />
      )}
    </>
  );
};

export default InterviewedRoundTable;