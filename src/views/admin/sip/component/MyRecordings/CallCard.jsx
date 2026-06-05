import React from "react";
import {
  Box,
  Flex,
  Text,
  Badge,
  IconButton,
  Icon,
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
import { useModalColors } from "hooks/useModalColors";

const CallCard = ({
  getUserNameById,
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
  const colors = useModalColors();
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
        return { bg: colors.bgInput, icon: FiPhone };
    }
  };

  const getCallModeIcon = (callMode) => {
    switch (callMode) {
      case "Outgoing":
        return { icon: FiPhoneOutgoing, color: "#E11111" };
      case "Incoming":
        return { icon: FiPhoneIncoming, color: "#1EB006" };
      default:
        return { icon: FiPhone, color: colors.mutedText };
    }
  };

  const statusData = getStatusColor(call.disposition);
  const callModeData = getCallModeIcon(call.call_mode);

  return (
    <Box
      bg={colors.bg}
      borderWidth="1px"
      borderColor={colors.borderColor}
      borderRadius="lg"
      p={4}
      mb={4}
      _hover={{ bg: colors.bgDeep, boxShadow: colors.cardShadow }}
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
          <Text fontSize="xs" color="black">{call.disposition || "Unknown"}</Text>
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
          {(hasPermission("sip", "recording_share") ||
            hasPermission("sip", "recording_logs")) && (
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreVertical />}
                size="sm"
                variant="ghost"
                aria-label="Actions"
              />
              <MenuList bg={colors.bg} borderColor={colors.borderColor}>
                {hasPermission("sip", "recording_logs") && (
                  <MenuItem
                    icon={<FiActivity />}
                    onClick={() => openLogModal(call)}
                    color={colors.bodyText}
                    _hover={{ bg: colors.bgDeep, color: colors.accentGold }}
                  >
                    View Log
                  </MenuItem>
                )}
                {hasPermission("sip", "recording_share") && (
                  <MenuItem
                    icon={<FiShare2 />}
                    onClick={() => openShareModal(call)}
                    color={colors.bodyText}
                    _hover={{ bg: colors.bgDeep, color: colors.accentGold }}
                  >
                    Share Recording
                  </MenuItem>
                )}
                {hasPermission("sip", "recording_share") && (
                  <MenuItem
                    icon={<FiUsers />}
                    onClick={() => openSharedDetailModal(call)}
                    color={colors.bodyText}
                    _hover={{ bg: colors.bgDeep, color: colors.accentGold }}
                  >
                    Shared Detail
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>

      <Divider my={1} borderColor={colors.borderColor} />

      <Box mb={3} flex="1">
        <Flex direction="column" height="100%" justify="space-between">
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" gap={3} mb={3}>
            <Box>
              <Text fontSize="2xs" color={colors.mutedText} mb={1}>
                User
              </Text>
              <Text fontSize="xs" fontWeight="medium" isTruncated color={colors.headingText}>
                {call.user_id ? getUserNameById(call.user_id) : "Unknown User"}
              </Text>
            </Box>

            <Box>
              <Text fontSize="2xs" color={colors.mutedText} mb={1}>
                Call ID
              </Text>
              <Text fontSize="xs" fontWeight="medium" isTruncated color={colors.bodyText}>
                {call.uniqueid || "N/A"}
              </Text>
            </Box>
          </Box>

          <Flex justify="space-between" mb={3}>
            <Box width="48%">
              <Text fontSize="2xs" color={colors.mutedText} mb={1}>
                From
              </Text>
              <Text fontSize="xs" fontWeight="medium" isTruncated color={colors.bodyText}>
                {call.src || "N/A"}
              </Text>
            </Box>
            <Box width="48%">
              <Text fontSize="2xs" color={colors.mutedText} mb={1}>
                To
              </Text>
              <Flex align="center">
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  color={colors.accentGold}
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
              <Text fontSize="2xs" color={colors.mutedText} mb={1}>
                Date & Time
              </Text>
              <Text fontSize="xs" isTruncated color={colors.bodyText}>
                {call.calldate
                  ? moment(call.calldate).format("MMM D, h:mm A")
                  : "N/A"}
              </Text>
            </Box>
            <Box width="48%" textAlign="right">
              <Text fontSize="2xs" color={colors.mutedText} mb={1}>
                Duration
              </Text>
              <Text fontSize="xs" color={colors.bodyText}>
                {call.duration ? formatCallDuration(call.duration) : "0 sec"}
              </Text>
            </Box>
          </Flex>

          <Box mt="auto">
            <Text fontSize="2xs" color={colors.mutedText} mb={1}>
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
                  billsec={call?.billsec}
                />
                {call.billsec > 0 && (
                  <Button
                    alignSelf="flex-end"
                    variant="link"
                    fontSize="xs"
                    onClick={() => handleOpenTranscribe(call)}
                    color={colors.accentGold}
                    _hover={{ color: colors.goldLight }}
                  >
                    Transcribe
                  </Button>
                )}
              </VStack>
            ) : (
              <Text fontSize="xs" color={colors.badgeErrorText}>
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