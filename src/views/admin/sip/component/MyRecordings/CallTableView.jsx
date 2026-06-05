import React, { useState, useCallback } from 'react';
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
  Icon,
  Button,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {
  FiCopy,
  FiMoreVertical,
  FiShare2,
  FiActivity,
  FiUsers,
} from 'react-icons/fi';
import moment from 'moment';
import AudioPlayer from './Component/AudioPlayer';
import { formatCallDuration } from 'utils/helpers';
import Vector from 'assets/icons/Vector.png';
import subway_call_2 from 'assets/icons/subway_call-2.png';
import subway_call_3 from 'assets/icons/subway_call-3.png';
import { FaPhone } from 'react-icons/fa6';
import IncomingCallIcon from 'assets/icons/incomming-call.png';
import OutgoingCallIcon from 'assets/icons/Outgoing-call.png';
import CustomTooltip from 'components/shared/CustomTooltip';
import TranscribeModal from './Component/TranscribeModal';
import TableLoading from 'components/loading/TableLoading';
import NoData from 'views/admin/lead-v2/components/subComponents/NoData';
import { usePermissions } from 'hooks/usePermissions';
import { useModalColors } from 'hooks/useModalColors';

const StatusBadge = ({ status }) => (
  <Badge bg={'transparent'} px={2} py={1} color={'black'}>
    {status || 'no data found'}
  </Badge>
);

const StatusColor = ({ children, status }) => {
  let color;
  switch (status) {
    case 'ANSWERED':
      color = '#DEFFF3';
      break;
    case 'NO ANSWER':
      color = '#F8E3FF';
      break;
    case 'FAILED':
      color = '#FFE0E0';
      break;
    case 'BUSY':
      color = '#FFE0E0';
      break;
    default:
      color = 'gray.500';
  }

  return (
    <Badge bg={color} px={2} py={1} borderRadius={'15px'} color={'black'}>
      {children}
    </Badge>
  );
};

const CallStatusIcon = ({ status }) => {
  switch (status) {
    case 'ANSWERED':
      return (
        <img
          src={Vector}
          alt='icon'
          style={{ width: '1rem', height: '1rem' }}
          color='#DEFFF3'
        />
      );
    case 'NO ANSWER':
      return (
        <img
          src={subway_call_2}
          alt='icon'
          style={{ width: '1rem', height: '1rem' }}
          color='##F8E3FF'
        />
      );
    case 'FAILED':
    case 'BUSY':
      return (
        <img
          src={subway_call_3}
          alt='icon'
          style={{ width: '1rem', height: '1rem' }}
          color='#DEFFF3'
        />
      );
    default:
      return <Icon as={FaPhone} color='gray.500' h={'1rem'} w={'1rem'} />;
  }
};

const CallModeIcon = ({ callMode }) => {
  switch (callMode) {
    case 'Outgoing':
      return (
        <img
          src={OutgoingCallIcon}
          alt='icon'
          style={{ width: '1rem', height: '1rem' }}
          color='#E11111'
        />
      );
    case 'Incoming':
      return (
        <img
          src={IncomingCallIcon}
          alt='icon'
          style={{ width: '1rem', height: '1rem' }}
          color='#1EB006'
        />
      );
    default:
      return null;
  }
};

const CallHelper = ({ callMode }) => {
  let color = '';
  switch (callMode) {
    case 'Outgoing':
      color = '#E11111';
      break;
    case 'Incoming':
      color = '#1EB006';
      break;
    default:
      color = 'black';
  }
  return (
    <Flex gap={2} alignItems={'center'} color={color}>
      <Box>
        <CallModeIcon callMode={callMode} />
      </Box>
      <Box>{callMode}</Box>
    </Flex>
  );
};

const CallTableView = ({
  calls,
  currentlyPlayingId,
  handleSetCurrentlyPlaying,
  setCurrentlyPlayingId,
  handleCopy,
  copied,
  loading,
  openLogModal,
  openShareModal,
  openSharedDetailModal,
}) => {
  const colors = useModalColors();
  const { hasPermission } = usePermissions();
  const canShareRecording =
    hasPermission('sip', 'recording_share') ||
    hasPermission('sip', 'recording_logs');

  const columns = [
    { Header: 'Call id', accessor: 'uniqueid', width: 100 },
    { Header: 'Call date & time', accessor: 'calldate', width: 200 },
    { Header: 'Call Mode', accessor: 'call_mode', width: 100 },
    { Header: 'Call from', accessor: 'src', width: 100 },
    { Header: 'Call to', accessor: 'dst', width: 100 },
    { Header: 'Recording', accessor: 'recording', width: 400 },
    { Header: 'Status', accessor: 'disposition', width: 100 },
    { Header: 'Type', accessor: 'lastapp', width: 100 },
    { Header: 'Call Duration', accessor: 'duration', width: 100 },
    { Header: 'Talk Duration', accessor: 'billsec', width: 100 },
    ...(canShareRecording ? [{ Header: 'Actions', accessor: 'actions', width: 50 }] : []),
  ];

  const [transcribeModal, setTranscribeModal] = useState(false);
  const [currentCall, setCurrentCall] = useState(false);

  const handleOpenTranscribe = (data) => {
    setCurrentCall(data);
    setTranscribeModal(true);
    setCurrentlyPlayingId(null);
  };

  const handleTranscribeClose = () => {
    setTranscribeModal(false);
    setCurrentCall(null);
  };

  return (
    <Box
           maxHeight="80vh"
      minH="70vh"
      overflowY="auto"
      scrollBehavior="smooth"
      borderRadius="xl"
      boxShadow={colors.cardShadow}
      bg={colors.bg}
      border="1px solid"
      borderColor={colors.borderColor}
      mt={3}
    >
      <Table variant="simple" size="sm">
        <Thead
          position="sticky"
          top={0}
          bg={colors.bgDeep}
          color={colors.headingText}
          zIndex={1}
        >
          <Tr>
            {columns.map((col) => (
              <Th
                key={col.accessor}
                minW={col?.width ? `${col.width}px` : "100px"}
                textAlign="center"
                py="4"
                px={3}
                fontSize="xs"
                fontWeight="semibold"
                letterSpacing="wider"
                color={colors.headingText}
                textTransform="none"
                borderColor={colors.borderColor}
              >
                {col.Header}
              </Th>
            ))}
          </Tr>
        </Thead>

        <Tbody>
          {loading ? (
            <TableLoading columns={columns} length={10} py="4" />
          ) : calls && calls.length > 0 ? (
            calls.map((call, index) => (
              <Tr
                key={call.id || call.uniqueid || index}
                _hover={{ bg: colors.bgDeep }}
                bg={colors.bg}
                transition="background-color 0.2s ease-in-out"
              >
                {/* Call ID */}
                <Td
                  py={3}
                  px={3}
                  textAlign="center"
                  color={colors.bodyText}
                  borderBottom="1px solid"
                  borderColor={colors.borderColor}
                >
                  {call.uniqueid || '—'}
                </Td>

                {/* Call Date & Time */}
                <Td
                  py={3}
                  px={3}
                  textAlign="center"
                  color={colors.bodyText}
                  borderBottom="1px solid"
                  borderColor={colors.borderColor}
                >
                  {call.calldate
                    ? moment(call.calldate).format('MMM D, h:mm A')
                    : '—'}
                </Td>

                {/* Call Mode */}
                <Td
                  py={3}
                  px={3}
                  textAlign="center"
                  borderBottom="1px solid"
                  borderColor={colors.borderColor}
                >
                  {call.call_mode ? (
                    <CallHelper callMode={call.call_mode} />
                  ) : (
                    '—'
                  )}
                </Td>

                {/* Call From */}
                <Td
                  py={3}
                  px={3}
                  textAlign="center"
                  color={colors.bodyText}
                  borderBottom="1px solid"
                  borderColor={colors.borderColor}
                >
                  {call.src || '—'}
                </Td>

                {/* Call To */}
                <Td
                  py={3}
                  px={3}
                  textAlign="center"
                  color={colors.accentGold}
                  borderBottom="1px solid"
                  borderColor={colors.borderColor}
                >
                  <Flex align='center' justify='center' gap={2}>
                    {call.dst || '—'}
                    {call.dst && (
                      <CustomTooltip
                        label={copied ? 'Copied!' : 'Copy'}
                        hasArrow
                      >
                        <IconButton
                          icon={<FiCopy />}
                          size='xs'
                          aria-label='Copy phone number'
                          variant="ghost"
                          onClick={() => handleCopy(call.dst)}
                        />
                      </CustomTooltip>
                    )}
                  </Flex>
                </Td>

                {/* Recording */}
                <Td
                  py={3}
                  px={3}
                  textAlign="center"
                  borderBottom="1px solid"
                  borderColor={colors.borderColor}
                >
                  {call.recording ? (
                    <VStack spacing={2}>
                      <AudioPlayer
                        url={`https://webrtc.weeam.info/file/${call.recording}`}
                        currentlyPlayingId={currentlyPlayingId}
                        setCurrentlyPlayingId={handleSetCurrentlyPlaying}
                        playerId={call.id || call.uniqueid || `player-${index}`}
                        timestamp={new Date(call.calldate)}
                        billsec={call?.billsec}
                        id={call?.uniqueid}
                        call={call}
                      />
                      {call.billsec > 0 && (
                        <Button
                          variant="link"
                          size="xs"
                          onClick={() => handleOpenTranscribe(call)}
                          color={colors.accentGold}
                          _hover={{ color: colors.goldLight }}
                        >
                          Transcribe
                        </Button>
                      )}
                    </VStack>
                  ) : (
                    <Text fontSize="sm" color={colors.mutedText}>
                      —
                    </Text>
                  )}
                </Td>

                {/* Status */}
                <Td
                  py={3}
                  px={3}
                  textAlign="center"
                  borderBottom="1px solid"
                  borderColor={colors.borderColor}
                >
                  <Flex align='center' justify='center' gap={1}>
                    <StatusColor status={call.disposition}>
                      <Flex alignItems={'center'}>
                        <CallStatusIcon status={call.disposition} />
                        <StatusBadge status={call.disposition} />
                      </Flex>
                    </StatusColor>
                  </Flex>
                </Td>

                {/* Type */}
                <Td
                  py={3}
                  px={3}
                  textAlign="center"
                  color={colors.bodyText}
                  borderBottom="1px solid"
                  borderColor={colors.borderColor}
                >
                  {call.lastapp || '—'}
                </Td>

                {/* Call Duration */}
                <Td
                  py={3}
                  px={3}
                  textAlign="center"
                  color={colors.bodyText}
                  borderBottom="1px solid"
                  borderColor={colors.borderColor}
                >
                  {call.duration ? `${formatCallDuration(call.duration)}` : '0 sec'}
                </Td>

                {/* Talk Duration */}
                <Td
                  py={3}
                  px={3}
                  textAlign="center"
                  color={colors.bodyText}
                  borderBottom="1px solid"
                  borderColor={colors.borderColor}
                >
                  {call.billsec ? `${formatCallDuration(call.billsec)}` : '0 sec'}
                </Td>

                {/* Actions */}
                {canShareRecording && (
                  <Td
                    py={3}
                    px={3}
                    textAlign="center"
                    borderBottom="1px solid"
                    borderColor={colors.borderColor}
                  >
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FiMoreVertical />}
                        size='sm'
                        variant="ghost"
                        aria-label='Actions'
                      />
                      <MenuList bg={colors.bg} borderColor={colors.borderColor}>
                        {hasPermission('sip', 'recording_logs') && (
                          <MenuItem
                            icon={<FiActivity />}
                            onClick={() => openLogModal(call)}
                            color={colors.bodyText}
                            _hover={{ bg: colors.bgDeep, color: colors.accentGold }}
                          >
                            View Log
                          </MenuItem>
                        )}
                        {hasPermission('sip', 'recording_share') && (
                          <MenuItem
                            icon={<FiShare2 />}
                            onClick={() => openShareModal(call)}
                            color={colors.bodyText}
                            _hover={{ bg: colors.bgDeep, color: colors.accentGold }}
                          >
                            Share Recording
                          </MenuItem>
                        )}
                        {hasPermission('sip', 'recording_share') && (
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
                  </Td>
                )}
              </Tr>
            ))
          ) : (
            <Tr>
              <Td py={10} colSpan={columns.length} textAlign="center" borderColor={colors.borderColor}>
                <NoData label="call records" />
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      {/* Modals */}
      {transcribeModal && (
        <TranscribeModal
          isOpen={transcribeModal}
          onClose={handleTranscribeClose}
          data={currentCall}
        />
      )}
    </Box>
  );
};

export default CallTableView;