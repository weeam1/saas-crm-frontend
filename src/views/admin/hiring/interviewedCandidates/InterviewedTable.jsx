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
	Tooltip,
} from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import TableLoading from 'components/loading/TableLoading';
import FlagBadge from '../_components/FlagBadge';
import OfferLetterIcon from './OfferLetterIcon';
import FeedbackView from './FeedbackView';
import { useState } from 'react';
import { MdOutlineNoteAlt, MdVisibility } from 'react-icons/md';
import InterviewStatusBadge from './InterviewStatusBadge';
import { RiUserForbidLine } from 'react-icons/ri';
import NextRoundConfirmModal from '../_components/NextRoundConfirmModal';
import { FaClockRotateLeft } from 'react-icons/fa6';
import CandidateStatusHistory from '../_components/CandidateStatusHistory';
import InterviewNoteView from './InterviewNoteView';
import { useModalColors } from 'hooks/useModalColors';

const InterviewedTable = ({
	headers,
	data,
	loading,
	handleSort,
	sortConfig,
	handleViewCandidate,
	handleViewResult,
	handleSendOffer,
	isRefetching,
	interviewRefetch,
}) => {
	const colors = useModalColors();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		isOpen: isNoteOpen,
		onOpen: onNoteOpen,
		onClose: onNoteClose,
	} = useDisclosure();

	const [feedback, setFeedback] = useState({
		title: 'Message',
		message: 'N/A',
		interviewId: null,
	});

	const [selectedInterview, setSelectedInterview] = useState(null);

	const {
		isOpen: isNextRoundModalOpen,
		onOpen: onNextRoundModalOpen,
		onClose: onNextRoundModalClose,
	} = useDisclosure();

	const handleNextInterview = (interview) => {
		setSelectedInterview(interview);
		onNextRoundModalOpen();
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
						{loading || isRefetching ? (
							<TableLoading columns={headers} length={10} py="4" />
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
										{item?.agency?.name ?? 'N/A'}
									</Td>
									<Td
										py={3}
										px={3}
										borderBottom="1px solid"
										borderColor={colors.borderColor}
										color={colors.bodyText}
									>
										{item.position ?? 'N/A'}
									</Td>
									<Td
										py={3}
										px={3}
										borderBottom="1px solid"
										borderColor={colors.borderColor}
										color={colors.bodyText}
									>
										{item.candidate?.phone ?? 'N/A'}
									</Td>
									<Td
										py={3}
										px={3}
										borderBottom="1px solid"
										borderColor={colors.borderColor}
										color={colors.bodyText}
									>
										{item.candidate?.whatsApp ?? 'N/A'}
									</Td>
									<Td
										py={3}
										px={3}
										borderBottom="1px solid"
										borderColor={colors.borderColor}
										color={colors.bodyText}
									>
										{item.jobType ?? 'N/A'}
									</Td>
									<Td
										py={3}
										px={3}
										borderBottom="1px solid"
										borderColor={colors.borderColor}
									>
										<InterviewStatusBadge interview={item} />
									</Td>
									<Td
										py={3}
										px={3}
										borderBottom="1px solid"
										borderColor={colors.borderColor}
										color={colors.bodyText}
									>
										{item.candidate?.interviewCount || 1}
									</Td>
									<Td
										py={3}
										px={3}
										borderBottom="1px solid"
										borderColor={colors.borderColor}
										color={colors.bodyText}
									>
										{!item.remarks ? 'No Result' : `${item.percentageScore}%`}
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
												flexGrow={
													item?.status === 'rejected' ? '1' : 'initial'
												}
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

											{item?.status === 'rejected' ? null : (
												<>
													{item.isOffer ? (
														<>
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
																	handleSendOffer(item._id, 'edit')
																}
															>
																Resend Offer
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
																	handleSendOffer(item._id, 'view')
																}
															>
																View Offer
															</Button>

															<OfferLetterIcon
																status={item.offerStatus}
																onClick={() => {
																	setFeedback({
																		title: 'Feedback',
																		message: item?.feedback?.message,
																	});
																	onOpen();
																}}
															/>
														</>
													) : (
														<>
															{!item.isMultiRound && (
																<Button
																	bg="green.500"
																	color="white"
																	h="6"
																	py="2"
																	px="4"
																	fontSize="xs"
																	fontWeight="normal"
																	flexGrow={
																		item?.status === 'rejected'
																			? '1'
																			: 'initial'
																	}
																	shadow="sm"
																	rounded="md"
																	_hover={{ bg: "green.400" }}
																	_active={{ bg: "green.400" }}
																	onClick={() => handleNextInterview(item)}
																>
																	Next Round
																</Button>
															)}

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
																onClick={
																	item.status === 'end'
																		? () => handleSendOffer(item._id, 'edit')
																		: () => handleViewResult(item)
																}
															>
																{item.status === 'end'
																	? 'Send Offer'
																	: 'Submit Result'}
															</Button>
														</>
													)}
												</>
											)}

											{item?.status === 'rejected' && (
												<Tooltip
													label='Rejection Reason'
													hasArrow
													placement='top'
												>
													<IconButton
														aria-label='Rejected Reason'
														icon={<RiUserForbidLine />}
														size="xs"
														variant="solid"
														onClick={() => {
															setFeedback({
																message: item.rejectionReason,
																title: 'Rejection Reason',
																interviewId: item._id,
															});
															onOpen();
														}}
														bg={colors.badgeErrorBg}
														color={colors.badgeErrorText}
														_hover={{
															bg: colors.badgeErrorText,
															color: 'white',
														}}
													/>
												</Tooltip>
											)}
											{item?.interviewNote ? (
												<Tooltip
													label='Interview Note'
													hasArrow
													placement='top'
												>
													<IconButton
														aria-label='Interview note'
														icon={<MdOutlineNoteAlt />}
														size="xs"
														variant="solid"
														onClick={() => {
															setFeedback({
																message: item.interviewNote,
																title: 'Interview Note',
																interviewId: item._id,
															});
															onNoteOpen();
														}}
														bg="green.500"
														color="white"
														_hover={{ bg: "green.400" }}
													/>
												</Tooltip>
											) : (
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
														setFeedback({
															message: '',
															title: 'Add Interview Note',
															interviewId: item._id,
														});
														onNoteOpen();
													}}
												>
													Add Note
												</Button>
											)}

											{item.status === 'end' && (
												<IconButton
													aria-label='View Results'
													icon={<MdVisibility />}
													size="xs"
													variant="outline"
													onClick={() => handleViewResult(item)}
													color={colors.accentGold}
													_hover={{
														color: colors.goldLight,
														bg: colors.secondaryBtnHoverBg,
													}}
												/>
											)}
										</HStack>
									</Td>
								</Tr>
							))
						) : (
							<Tr>
								<Td colSpan={headers.length} py={10} textAlign="center" borderColor={colors.borderColor}>
									<Text
										textAlign={"center"}
										width="100%"
										color={colors.mutedText}
										fontSize="sm"
										fontWeight="600"
									>
										No data found
									</Text>
								</Td>
							</Tr>
						)}
					</Tbody>
				</Table>
			</Box>

			{isOpen && (
				<FeedbackView
					title={feedback?.title}
					isOpen={isOpen}
					onClose={onClose}
					message={feedback?.message}
				/>
			)}

			{isNoteOpen && (
				<InterviewNoteView
					title={feedback?.title}
					isOpen={isNoteOpen}
					onClose={onNoteClose}
					message={feedback?.message}
					mode={feedback?.message ? 'view' : 'add'}
					interviewId={feedback?.interviewId}
					interviewRefetch={interviewRefetch}
				/>
			)}

			{isNextRoundModalOpen && (
				<NextRoundConfirmModal
					isOpen={isNextRoundModalOpen}
					onClose={() => {
						onNextRoundModalClose();
						setSelectedInterview(null);
					}}
					interview={selectedInterview}
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

export default InterviewedTable;