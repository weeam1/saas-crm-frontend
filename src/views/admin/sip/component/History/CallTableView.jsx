import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { FiCopy } from "react-icons/fi";
import moment from "moment";
import AudioPlayer from "./Component/AudioPlayer";
import { formatCallDuration } from "utils/helpers";
import Vector from "assets/icons/Vector.png";
import subway_call_2 from "assets/icons/subway_call-2.png";
import subway_call_3 from "assets/icons/subway_call-3.png";
import { FaPhone } from "react-icons/fa6";
import IncomingCallIcon from "assets/icons/incomming-call.png";
import OutgoingCallIcon from "assets/icons/Outgoing-call.png";
import CustomTooltip from "../../../../../components/shared/CustomTooltip";
import TranscribeModal from "./Component/TranscribeModal";
import TableLoading from "components/loading/TableLoading";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";

const StatusBadge = ({ status }) => {
	return (
		<Badge bg={'transparent'} px={2} py={1} color={'black'}>
			{status || 'no data found'}
		</Badge>
	);
};

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
	loading
}) => {
	const columns = [
		'Call id',
		'Call date & time',
		'Call Mode',
		'Call from',
		'Call to',
		'Recording',
		'Status',
		'Type',
		'Call Duration',
		'Talk Duration',
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
		<>
			<Box borderRadius='lg' boxShadow='sm' bg='white' overflowY='auto' mt={3}>
				<Table variant='striped' size='sm' bg='white'>
					<Thead
						position='sticky'
						top={0}
						bg='white'
						zIndex={2}
						boxShadow='0px 2px 8px rgba(0, 0, 0, 0.1)'
						fontSize={'16px'}
						borderRadius='lg'
					>
						<Tr>
							{columns.map((header, index) => (
								<Th key={index} bg='brand.200' whiteSpace='nowrap' py={4}>
									<Box
										display='flex'
										alignItems='center'
										justifyContent='center'
									>
										<Text
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='600'
											color='gray.700'
										>
											{header}
										</Text>
									</Box>
								</Th>
							))}
						</Tr>
					</Thead>
					{loading ? (
						<TableLoading columns={columns} length={10} py="4" />
					) : calls && calls.length > 0 ? (
						<Tbody>
						{calls.map((call, index) => (
							<Tr key={call.id || call.uniqueid || index}>
							<Td
								py={4}
								fontSize={{ base: "12px", md: "14px" }}
								fontWeight="400"
								minWidth="100px"
								textAlign={"center"}
							>
								{call.uniqueid || "no data found"}
							</Td>
							<Td
								py={4}
								fontSize={{ base: "12px", md: "14px" }}
								fontWeight="400"
								minWidth="200px"
								textAlign={"center"}
							>
								{call.calldate
								? moment(call.calldate).format("MMM D, h:mm A")
								: "no data found"}
							</Td>
							<Td
								py={4}
								fontSize={{ base: "12px", md: "14px" }}
								fontWeight="400"
								minWidth="100px"
								textAlign={"center"}
							>
								{call.call_mode ? (
								<CallHelper callMode={call.call_mode} />
								) : (
								"no data found"
								)}
							</Td>
							<Td
								py={4}
								fontSize={{ base: "12px", md: "14px" }}
								fontWeight="400"
								minWidth="100px"
								textAlign={"center"}
							>
								{call.src || "no data found"}
							</Td>
							<Td
								py={4}
								fontSize={{ base: "12px", md: "14px" }}
								fontWeight="400"
								minWidth="100px"
								textAlign={"center"}
								color={"#8247FF"}
							>
								<Flex align="center" justify="center" gap={2}>
								{call.dst || "no data found"}
								{call.dst && (
									<CustomTooltip
									label={copied ? "Copied!" : "Copy"}
									hasArrow
									>
									<IconButton
										icon={<FiCopy />}
										size="xs"
										aria-label="Copy phone number"
										variant="ghost"
										colorScheme="purple"
										onClick={() => handleCopy(call.dst)}
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
							>
								{call.recording ? (
								<VStack>
									<AudioPlayer
									url={`https://webrtc.weeam.info/file/${call.recording}`}
									currentlyPlayingId={currentlyPlayingId}
									setCurrentlyPlayingId={handleSetCurrentlyPlaying}
									playerId={
										call.id || call.uniqueid || `player-${index}`
									}
									timestamp={new Date(call.calldate)}
									duration={call?.duration}
									id={call?.uniqueid}
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
								<Text fontSize="sm" color="gray.500">
									no data found
								</Text>
								)}
							</Td>
							<Td
								py={4}
								fontSize={{ base: "12px", md: "14px" }}
								fontWeight="400"
								minWidth="100px"
								textAlign={"center"}
							>
								<Flex align="center" justify="center" gap={1}>
								<StatusColor status={call.disposition}>
									<Flex alignItems={"center"}>
									<CallStatusIcon status={call.disposition} />
									<StatusBadge status={call.disposition} />
									</Flex>
								</StatusColor>
								</Flex>
							</Td>
							<Td
								py={4}
								fontSize={{ base: "12px", md: "14px" }}
								fontWeight="400"
								minWidth="100px"
								textAlign={"center"}
							>
								{call.lastapp || "no data found"}
							</Td>
							<Td
								py={4}
								fontSize={{ base: "12px", md: "14px" }}
								fontWeight="400"
								minWidth="100px"
								textAlign={"center"}
							>
								{call.duration
								? `${formatCallDuration(call.duration)}`
								: "0 sec"}
							</Td>
							<Td
								py={4}
								fontSize={{ base: "12px", md: "14px" }}
								fontWeight="400"
								minWidth="100px"
								textAlign={"center"}
							>
								{call.billsec
								? `${formatCallDuration(call.billsec)}`
								: "0 sec"}
							</Td>
							</Tr>
						))}
						</Tbody>
					) : (
						<Tr borderColor="gray.200" textAlign="center">
						<Td
							borderBottom="none"
							colSpan="13"
							fontSize={{ base: "12px", md: "15px" }}
							fontWeight="500"
							color="gray.500"
							textAlign="center"
						>
							<NoData label="call records" />
						</Td>
						</Tr>
					)}
				</Table>
			</Box>

			{transcribeModal && (
				<TranscribeModal
					isOpen={transcribeModal}
					onClose={handleTranscribeClose}
					data={currentCall}
				/>
			)}
		</>
	);
};

export default CallTableView;
