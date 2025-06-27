import React from "react";
import {
  Box,
  Flex,
  Text,
  Badge,
  IconButton,
  Icon,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import {
  FiCopy,
  FiPhone,
  FiPhoneOff,
  FiPhoneIncoming,
  FiPhoneOutgoing,
} from "react-icons/fi";
import moment from "moment";
import AudioPlayer from "./Component/AudioPlayer";
import { formatCallDuration } from "utils/helpers";

const CallCard = ({
  call,
  currentlyPlayingId,
  handleSetCurrentlyPlaying,
  handleCopy,
  index,
}) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  const getStatusColor = (status) => {
    switch (status) {
      case "ANSWERED":
        return { bg: "#DEFFF3", icon: FiPhone };
      case "NO ANSWER":
        return { bg: "#F8E3FF", icon: FiPhoneOff };
      case "FAILED":
      case "BUSY":
        return { bg: "#FFE0E0", icon: FiPhoneOff };
      default:
        return { bg: "gray.100", icon: FiPhone };
    }
  };

  const getCallModeIcon = (callMode) => {
    switch (callMode) {
      case "Outgoing":
        return { icon: FiPhoneOutgoing, color: "#E11111" };
      case "Incoming":
        return { icon: FiPhoneIncoming, color: "#1EB006" };
      default:
        return { icon: FiPhone, color: "gray.500" };
    }
  };

  const statusData = getStatusColor(call.disposition);
  const callModeData = getCallModeIcon(call.call_mode);

  return (
    <Box
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      mb={4}
      _hover={{ bg: hoverBg, shadow: "sm" }}
      transition="all 0.2s"
      cursor="pointer"
    >
      <Flex justify="space-between" align="center" mb={3}>
        <Badge
          px={2}
          py={1}
          bg={statusData.bg}
          borderRadius="full"
          display="flex"
          alignItems="center"
        >
          <Icon as={statusData.icon} mr={1} />
          <Text fontSize="sm">{call.disposition || "Unknown"}</Text>
        </Badge>

        <Flex align="center">
          <Icon as={callModeData.icon} color={callModeData.color} mr={1} />
          <Text fontSize="sm" color={callModeData.color}>
            {call.call_mode || "Unknown"}
          </Text>
        </Flex>
      </Flex>

      <Divider my={2} />

      <Box mb={3}>
        <Text fontSize="xs" color="gray.500" mb={1}>
          Call ID
        </Text>
        <Text fontSize="sm" fontWeight="medium">
          {call.uniqueid || "N/A"}
        </Text>
      </Box>

      <Flex justify="space-between" mb={3}>
        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>
            From
          </Text>
          <Text fontSize="sm" fontWeight="medium">
            {call.src || "N/A"}
          </Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>
            To
          </Text>
          <Flex align="center">
            <Text fontSize="sm" fontWeight="medium" color="#8247FF" mr={2}>
              {call.dst || "N/A"}
            </Text>
            {call.dst && (
              <IconButton
                icon={<FiCopy size={14} />}
                size="xs"
                aria-label="Copy number"
                variant="ghost"
                onClick={() => handleCopy(call.dst)}
              />
            )}
          </Flex>
        </Box>
      </Flex>

      <Flex justify="space-between" mb={3}>
        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>
            Date
          </Text>
          <Text fontSize="sm">
            {call.calldate
              ? moment(call.calldate).format("MMM D, YYYY h:mm A")
              : "N/A"}
          </Text>
        </Box>
        <Box textAlign="right">
          <Text fontSize="xs" color="gray.500" mb={1}>
            Duration
          </Text>
          <Text fontSize="sm">
            {call.duration ? formatCallDuration(call.duration) : "0 sec"}
          </Text>
        </Box>
      </Flex>

      <Box mt={3}>
        <Text fontSize="xs" color="gray.500" mb={1}>
          Recording
        </Text>
        {call.recording ? (
          <AudioPlayer
            url={`https://webrtc.weeam.info/file/${call.recording}`}
            currentlyPlayingId={currentlyPlayingId}
            setCurrentlyPlayingId={handleSetCurrentlyPlaying}
            playerId={call.id || call.uniqueid || `player-${index}`}
            timestamp={new Date(call.calldate)}
            compact
          />
        ) : (
          <Text fontSize="sm" color="red.500">No recording</Text>
        )}
      </Box>
    </Box>
  );
};

export default CallCard;
