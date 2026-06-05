import React, { useState, useCallback } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  IconButton,
  Badge,
  Button,
  VStack,
} from "@chakra-ui/react";
import { FiCopy } from "react-icons/fi";
import moment from "moment";
import { format } from "date-fns";

import { toast } from "react-toastify";

import AudioPlayer from "../RecordingHistory/History/Component/AudioPlayer";
import TranscribeModal from "../RecordingHistory/History/Component/TranscribeModal";
import TableLoading from "components/loading/TableLoading";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";

import { useCreateItemMutation, useFetchItemsQuery } from "api/apiSlice";
import { formatCallDuration } from "utils/helpers";

import Vector from "assets/icons/Vector.png";
import subway_call_2 from "assets/icons/subway_call-2.png";
import subway_call_3 from "assets/icons/subway_call-3.png";
import IncomingCallIcon from "assets/icons/incomming-call.png";
import OutgoingCallIcon from "assets/icons/Outgoing-call.png";
import CustomTooltip from "components/shared/CustomTooltip";
import { FaPhone } from "react-icons/fa6";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import { useModalColors } from "hooks/useModalColors";
import RefreshButton from "components/refresh/RefreshButton";

const StatusBadge = ({ status }) => (
  <Badge bg="transparent" px={2} py={1} color="black">
    {status || "no data"}
  </Badge>
);

const StatusColor = ({ children, status }) => {
  let color;
  switch (status) {
    case "ANSWERED":
      color = "#DEFFF3";
      break;
    case "NO ANSWER":
      color = "#F8E3FF";
      break;
    case "FAILED":
    case "BUSY":
      color = "#FFE0E0";
      break;
    default:
      color = "gray.200";
  }

  return (
    <Badge bg={color} px={2} py={1} borderRadius="15px" color="black">
      {children}
    </Badge>
  );
};

const CallStatusIcon = ({ status }) => {
  switch (status) {
    case "ANSWERED":
      return <img src={Vector} alt="Answered" style={{ width: "1rem" }} />;
    case "NO ANSWER":
      return (
        <img src={subway_call_2} alt="No Answer" style={{ width: "1rem" }} />
      );
    case "FAILED":
    case "BUSY":
      return <img src={subway_call_3} alt="Failed" style={{ width: "1rem" }} />;
    default:
      return <FaPhone color="gray" />;
  }
};

const CallModeIcon = ({ mode }) => {
  switch (mode) {
    case "Outgoing":
      return (
        <img src={OutgoingCallIcon} alt="Outgoing" style={{ width: "1rem" }} />
      );
    case "Incoming":
      return (
        <img src={IncomingCallIcon} alt="Incoming" style={{ width: "1rem" }} />
      );
    default:
      return null;
  }
};

const CallHelper = ({ mode }) => {
  const color = mode === "Outgoing" ? "#E11111" : "#1EB006";
  return (
    <Flex gap={2} align="center" color={color} justify="center">
      <CallModeIcon mode={mode} />
      <Box>{mode}</Box>
    </Flex>
  );
};

const SharedSipRecording = () => {
  const colors = useModalColors();
  const [copied, setCopied] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
  const [transcribeModal, setTranscribeModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);

  const {
    data: calls,
    isLoading,
    refetch,
    isFetching,
  } = useFetchItemsQuery(
    { path: "/sipSetting/sharedSipRecording/active" },
    { refetchOnMountOrArgChange: true },
  );

  const [createItemMutation] = useCreateItemMutation();

  const handleCopy = async (number) => {
    if (!number) return;
    try {
      await navigator.clipboard.writeText(number);
      setCopied(true);
      toast.success(`Copied: ${number}`, { autoClose: 2000 });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy!", { autoClose: 2000 });
    }
  };

  const handleLogPlay = useCallback(
    async (call) => {
      try {
        const payload = { recordingId: call.uniqueid || call.recording };
        await createItemMutation({
          path: "/playHistory/log",
          body: payload,
        }).unwrap();
      } catch (err) {
        console.error("Play log failed:", err);
      }
    },
    [createItemMutation],
  );

  const handleOpenTranscribe = (call) => {
    setSelectedCall(call);
    setTranscribeModal(true);
    setCurrentlyPlayingId(null);
  };

  const columns = [
    "Call ID",
    "Date & Time",
    "Mode",
    "From",
    "To",
    "Recording",
    "Status",
    "Type",
    "Duration",
    "Talk Time",
  ];

  return (
    <>
      <Box borderRadius="lg" boxShadow={colors.cardShadow} bg={colors.bg} mt={3} border="1px solid" borderColor={colors.borderColor}>
        <Flex justify={"space-between"} alignItems='center' m={3} gap={2} p={2}>
          <Flex alignItems="center" gap="2" fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
            <Text textAlign={{ base: "center", md: "left" }} color={colors.headingText}>
              Shared Recording
            </Text>
            <CountUpComponent key={calls?.results} targetNumber={calls?.results} />
          </Flex>
         <RefreshButton
        label="Refresh"
        onClick={refetch}
        isLoading={isLoading}
        isFetching={isFetching}
        size="sm"
       />
        </Flex>

        <Box overflowX="auto"       maxHeight="80vh"
      minH="70vh" overflowY="auto">
          <Table
            variant="simple"
            size="sm"
            bg={colors.bg}
            borderRadius="md"
            fontSize={{ base: "12px", md: "14px" }}
          >
            <Thead position="sticky" top={0} bg={colors.bgDeep} zIndex={2}>
              <Tr>
                {columns.map((header, i) => (
                  <Th key={i} bg={colors.bgDeep} whiteSpace="nowrap" py={4} textAlign="center" borderColor={colors.borderColor}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text
                        fontSize={{ base: "12px", md: "14px" }}
                        fontWeight="600"
                        color={colors.headingText}
                      >
                        {header}
                      </Text>
                    </Box>
                  </Th>
                ))}
              </Tr>
            </Thead>

            {isLoading || isFetching ? (
              <TableLoading columns={columns} length={20} />
            ) : calls && calls?.data.length > 0 ? (
              <Tbody bg={colors.bg}>
                {calls?.data.map((call, index) => (
                  <Tr key={index} borderColor={colors.borderColor}>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                      color={colors.bodyText}
                      borderColor={colors.borderColor}
                    >
                      {call.callData.uniqueid}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="200px"
                      textAlign={"center"}
                      color={colors.bodyText}
                      borderColor={colors.borderColor}
                    >
                      {call?.callData?.calldate
                        ? format(
                            new Date(call?.callData?.calldate + "+04:00"),
                            "MMM d, yyyy h:mm a",
                          )
                        : "N/A"}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                      borderColor={colors.borderColor}
                    >
                      <CallHelper mode={call.callData.call_mode} />
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                      color={colors.bodyText}
                      borderColor={colors.borderColor}
                    >
                      {call.callData.src}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                      color={colors.accentGold}
                      borderColor={colors.borderColor}
                    >
                      <Flex justify="center" gap={2}>
                        {call.callData.dst}
                        {call.callData.dst && (
                          <CustomTooltip
                            label={copied ? "Copied!" : "Copy"}
                            hasArrow
                          >
                            <IconButton
                              icon={<FiCopy />}
                              size="xs"
                              variant="ghost"
                              onClick={() => handleCopy(call.callData.dst)}
                            />
                          </CustomTooltip>
                        )}
                      </Flex>
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "11px", md: "13px" }}
                      fontWeight="400"
                      minWidth="400px"
                      textAlign={"center"}
                      borderColor={colors.borderColor}
                    >
                      {call.callData.recording ? (
                        <VStack>
                          <AudioPlayer
                            url={`https://webrtc.weeam.info/file/${call.callData.recording}`}
                            currentlyPlayingId={currentlyPlayingId}
                            setCurrentlyPlayingId={setCurrentlyPlayingId}
                            playerId={call.callData.uniqueid}
                            onPlayStart={() => handleLogPlay(call.callData)}
                            call={call.callData}
                            billsec={call.callData?.billsec}
                          />
                          <Button
                            variant="link"
                            size="xs"
                            onClick={() => handleOpenTranscribe(call.callData)}
                            color={colors.accentGold}
                            _hover={{ color: colors.goldLight }}
                          >
                            Transcribe
                          </Button>
                        </VStack>
                      ) : (
                        <Text color={colors.mutedText}>no data</Text>
                      )}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                      borderColor={colors.borderColor}
                    >
                      <StatusColor status={call.callData.disposition}>
                        <Flex align="center" justify="center">
                          <CallStatusIcon status={call.callData.disposition} />
                          <StatusBadge status={call.callData.disposition} />
                        </Flex>
                      </StatusColor>
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                      color={colors.bodyText}
                      borderColor={colors.borderColor}
                    >
                      {call.callData.lastapp}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                      color={colors.bodyText}
                      borderColor={colors.borderColor}
                    >
                      {formatCallDuration(call.callData.duration || 0)}
                    </Td>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                      color={colors.bodyText}
                      borderColor={colors.borderColor}
                    >
                      {formatCallDuration(call.callData.billsec || 0)}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            ) : (
              <Tbody bg={colors.bg}>
                <Tr>
                  <Td colSpan={columns.length + 1} textAlign="center" borderColor={colors.borderColor}>
                    <NoData label="shared recordings" />
                  </Td>
                </Tr>
              </Tbody>
            )}
          </Table>
        </Box>

        {/* Modals */}
        {transcribeModal && (
          <TranscribeModal
            isOpen={transcribeModal}
            onClose={() => setTranscribeModal(false)}
            data={selectedCall}
          />
        )}
      </Box>
    </>
  );
};

export default SharedSipRecording;