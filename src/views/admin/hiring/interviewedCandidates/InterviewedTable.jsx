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
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [feedback, setFeedback] = useState({
		title: 'Message',
		message: 'N/A',
	});

	return (
		<>
			{/* Box:  transform='translate(-10px, -10px)' */}
			<Box rounded='md' overflow='hidden'>
				<TableContainer
					maxHeight='800px' // Set a custom height for the container
					overflowY='auto' // Enable vertical scrolling
					overflowX='auto' // Optional: Enable horizontal scrolling
				>
					<Table variant='striped' size='md'>
						<Thead position='sticky' top={0} bg='brand.200' zIndex={1} p='4'>
							<Tr>
								{headers?.map((header) => (
									<Th
										key={header.key}
										textAlign='center'
										color='gray.800'
										width={header.width || '150px'}
									>
										<Flex align='center' justify='space-evenly' gap='4'>
											<Text textTransform='capitalize'>{header.label}</Text>
											{header.key !== 'action' && (
												<IconButton
													aria-label='Sort'
													size='xs'
													icon={
														sortConfig.key === header.key &&
														sortConfig.direction === 'asc' ? (
															<TriangleUpIcon />
														) : (
															<TriangleDownIcon />
														)
													}
													onClick={() => handleSort(header.key)}
													variant='ghost'
												/>
											)}
										</Flex>
									</Th>
								))}
							</Tr>
						</Thead>
						<Tbody>
							{loading || isRefetching ? (
								<TableLoading columns={headers} length={10} py='4' />
							) : data && data?.length ? (
								data?.map((item, index) => (
									<Tr key={index} fontSize='sm'>
										<Td minWidth='300px'>
											<HStack gap='1'>
												<span>{item.candidate.name}</span>
												<FlagBadge item={item.candidate} />
											</HStack>
										</Td>
										<Td minWidth='250px'>{item.candidate.email}</Td>
										<Td>{item?.agency?.name ?? 'N/A'}</Td>

										<Td>{item.position ?? 'N/A'}</Td>
										<Td>{item.candidate.phone ?? 'N/A'}</Td>
										<Td>{item.candidate.whatsApp ?? 'N/A'}</Td>
										<Td>{item.jobType ?? 'N/A'}</Td>

										<Td>
											<InterviewStatusBadge interview={item} />
										</Td>

										<Td>{item.candidate.interviewCount || 1}</Td>

										<Td>
											{!item.remarks ? 'No Result' : `${item.percentageScore}%`}
										</Td>
										<Td>
											<HStack alignItems='center'>
												<Button
													bg='#EDC270'
													color='gray.800'
													h='6'
													py='2'
													px='4'
													fontSize='xs'
													fontWeight='normal'
													flexGrow={
														item?.status === 'rejected' ? '1' : 'initial'
													}
													shadow='sm'
													rounded='md'
													_hover={{ bg: '#E0B960' }}
													_active={{ bg: '#D4AC50' }}
													onClick={() =>
														handleViewCandidate(item.candidate._id)
													}
												>
													View
												</Button>
												{item?.status === 'rejected' ? null : (
													<>
														{item.isOffer ? (
															<>
																<Button
																	bg='#EDC270'
																	color='gray.800'
																	h='6'
																	py='2'
																	px='4'
																	fontSize='xs'
																	fontWeight='normal'
																	shadow='sm'
																	rounded='md'
																	_hover={{ bg: '#E0B960' }}
																	_active={{ bg: '#D4AC50' }}
																	onClick={() =>
																		handleSendOffer(item._id, 'edit')
																	}
																>
																	Resend Offer
																</Button>
																<Button
																	bg='#EDC270'
																	color='gray.800'
																	h='6'
																	py='2'
																	px='4'
																	fontSize='xs'
																	fontWeight='normal'
																	shadow='sm'
																	rounded='md'
																	_hover={{ bg: '#E0B960' }}
																	_active={{ bg: '#D4AC50' }}
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
															<Button
																bg='#EDC270'
																color='gray.800'
																h='6'
																py='2'
																px='4'
																flex={1}
																fontSize='xs'
																fontWeight='normal'
																shadow='sm'
																rounded='md'
																_hover={{ bg: '#E0B960' }}
																_active={{ bg: '#D4AC50' }}
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
															size='xs'
															colorScheme='red'
															variant='solid'
															onClick={() => {
																setFeedback({
																	message: item.rejectionReason,
																	title: 'Rejection Reason',
																});
																onOpen();
															}}
														/>
													</Tooltip>
												)}
												{item?.interviewNote && (
													<Tooltip
														label='Interview Note'
														hasArrow
														placement='top'
													>
														<IconButton
															aria-label='Interview note'
															icon={<MdOutlineNoteAlt />}
															size='xs'
															colorScheme='green'
															variant='solid'
															onClick={() => {
																setFeedback({
																	message: item.interviewNote,
																	title: 'Interview Note',
																});
																onOpen();
															}}
														/>
													</Tooltip>
												)}

												{item.status === 'end' && (
													<IconButton
														aria-label='View Results'
														icon={<MdVisibility />}
														size='xs'
														colorScheme='green'
														variant='outline'
														onClick={() => handleViewResult(item)}
													/>
												)}
											</HStack>
										</Td>
									</Tr>
								))
							) : (
								<Tr>
									<Td colSpan={headers.length}>
										<Text
											textAlign={'center'}
											width='100%'
											color='gray.500'
											fontSize='sm'
											fontWeight='600'
										>
											No data found
										</Text>
									</Td>
								</Tr>
							)}
						</Tbody>
					</Table>
				</TableContainer>
			</Box>

			{isOpen && (
				<FeedbackView
					title={feedback?.title}
					isOpen={isOpen}
					onClose={onClose}
					message={feedback?.message}
				/>
			)}
		</>
	);
};

export default InterviewedTable;
