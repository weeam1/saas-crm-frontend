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
  Button,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
import { FiMoreVertical, FiShare2, FiActivity, FiUsers } from "react-icons/fi";
import { usePermissions } from "hooks/usePermissions";

const CallCard = ({
  call,
  currentlyPlayingId,
  handleSetCurrentlyPlaying,
  handleCopy,
  handleOpenTranscribe,
  index,
  openLogModal,
  openShareModal,
  openSharedDetailModal,
}) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  const { hasPermission } = usePermissions();
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
      height="370px"
      display="flex"
      flexDirection="column"
    >
      <Flex justify="space-between" align="center" mb={3}>
        <Badge
          px={2}
          py={1}
          bg={statusData.bg}
          borderRadius="full"
          display="flex"
          alignItems="center"
          minWidth="110px"
        >
          <Icon as={statusData.icon} mr={1} boxSize={3} />
          <Text fontSize="xs">{call.disposition || "Unknown"}</Text>
        </Badge>

        <Flex align="center" justify="flex-end">
          <Flex align="center">
            <Icon
              as={callModeData.icon}
              color={callModeData.color}
              mr={1}
              boxSize={3}
            />
            <Text fontSize="xs" color={callModeData.color}>
              {call.call_mode || "Unknown"}
            </Text>
          </Flex>
				  {(hasPermission("sip", "recording_share") || hasPermission("sip", "recording_logs") ) && (
					  <Menu>
						<MenuButton
						  as={IconButton}
						  icon={<FiMoreVertical />}
						  size="sm"
						  variant="ghost"
						  aria-label="Actions"
						/>
						<MenuList>
						  {hasPermission("sip", "recording_logs") && (
							<MenuItem
							  icon={<FiActivity />}
							  onClick={() => openLogModal(call)}
							>
							  View Log
							</MenuItem>
						  )}
						  {hasPermission("sip", "recording_share") && (
							<MenuItem
							  icon={<FiShare2 />}
							  onClick={() => openShareModal(call)}
							>
							  Share Recording
							</MenuItem>
						  )}
						  {hasPermission("sip", "recording_share") && (
							<MenuItem
							  icon={<FiUsers />}
							  onClick={() => openSharedDetailModal(call)}
							>
							  Shared Detail
							</MenuItem>
						  )}
						</MenuList>
					  </Menu>
				  )}
        </Flex>
      </Flex>

      <Divider my={1} />

      <Box mb={3} flex="1">
        <Flex direction="column" height="100%" justify="space-between">
          <Box>
            <Text fontSize="2xs" color="gray.500" mb={1}>
              Call ID
            </Text>
            <Text fontSize="xs" fontWeight="medium" isTruncated>
              {call.uniqueid || "N/A"}
            </Text>
          </Box>

          <Flex justify="space-between" mb={3}>
            <Box width="48%">
              <Text fontSize="2xs" color="gray.500" mb={1}>
                From
              </Text>
              <Text fontSize="xs" fontWeight="medium" isTruncated>
                {call.src || "N/A"}
              </Text>
            </Box>
            <Box width="48%">
              <Text fontSize="2xs" color="gray.500" mb={1}>
                To
              </Text>
              <Flex align="center">
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  color="#8247FF"
                  isTruncated
                  mr={2}
                >
                  {call.dst || "N/A"}
                </Text>
                {call.dst && (
                  <IconButton
                    icon={<FiCopy size={12} />}
                    size="2xs"
                    aria-label="Copy number"
                    variant="ghost"
                    onClick={() => handleCopy(call.dst)}
                  />
                )}
              </Flex>
            </Box>
          </Flex>

          <Flex justify="space-between" mb={3}>
            <Box width="48%">
              <Text fontSize="2xs" color="gray.500" mb={1}>
                Date & Time
              </Text>
              <Text fontSize="xs" isTruncated>
                {call.calldate
                  ? moment(call.calldate).format("MMM D, h:mm A")
                  : "N/A"}
              </Text>
            </Box>
            <Box width="48%" textAlign="right">
              <Text fontSize="2xs" color="gray.500" mb={1}>
                Duration
              </Text>
              <Text fontSize="xs">
                {call.duration ? formatCallDuration(call.duration) : "0 sec"}
              </Text>
            </Box>
          </Flex>

          <Box mt="auto">
            <Text fontSize="2xs" color="gray.500" mb={1}>
              Recording
            </Text>
            {call.recording ? (
              <VStack mb="2">
                <AudioPlayer
                  url={`https://webrtc.weeam.info/file/${call.recording}`}
                  currentlyPlayingId={currentlyPlayingId}
                  setCurrentlyPlayingId={handleSetCurrentlyPlaying}
                  playerId={call.id || call.uniqueid || `player-${index}`}
                  timestamp={new Date(call.calldate)}
                  duration={call?.duration}
                  compact
                  id={call?.uniqueid}
                  call={call}
                />
                {call.billsec > 0 && (
                  <Button
                    alignSelf="flex-end"
                    variant="link"
                    colorScheme="brand"
                    fontSize="xs"
                    onClick={() => handleOpenTranscribe(call)}
                  >
                    Transcribe
                  </Button>
                )}
              </VStack>
            ) : (
              <Text fontSize="xs" color="red.500">
                No recording
              </Text>
            )}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default CallCard;
