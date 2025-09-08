// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalCloseButton,
// 	ModalBody,
// 	ModalFooter,
// 	Button,
// 	FormControl,
// 	FormLabel,
// 	Textarea,
// 	Flex,
// 	Spinner,
// 	IconButton,
// 	Box,
// 	Text,
// 	Icon,
// 	Grid,
// 	HStack,
// 	Tooltip,
// } from '@chakra-ui/react';
// import { useFetchItemsQuery } from 'api/apiSlice';
// import { useUpdateItemMutation } from 'api/apiSlice';
// import DisplayField from 'components/displays/DisplayField';
// import Loader from 'components/loading/Loader';
// import { useEffect, useMemo, useState } from 'react';
// import { FaClipboardList, FaInfo, FaSyncAlt } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import InterviewerPoints from './InterviewerPoints';

// const getInterviewerPoints = (id, evaluations) => {
// 	const points = evaluations?.find((item) => item.interviewer._id === id);

// 	return points;
// };

// const InterviewResult = ({ isOpen, onClose, data, interviewId, refetch }) => {
// 	const [remarks, setRemarks] = useState('');
// 	const [evaluation, setEvaluation] = useState([]);
// 	const [pointsModal, setPointsModal] = useState(false);

// 	const [
// 		totalInterviewersPointsSubmitted,
// 		setTotalInterviewersPointsSubmitted,
// 	] = useState(0);

// 	// Fetch interview data
// 	const {
// 		data: interview,
// 		isLoading: interviewLoading,
// 		isFetching,
// 		refetch: interviewRefetch,
// 	} = useFetchItemsQuery(
// 		{ path: `/interviews/${interviewId}` },
// 		{ refetchOnMountOrArgChange: true }
// 	);

// 	// Memoized interview document data
// 	const interviewDoc = useMemo(() => interview?.doc || {}, [interview]);
// 	// const points =
// 	// 	interviewDoc.totalInterviewers - interviewDoc.pendingEvaluations;
// 	// console.log({ points });

// 	// Update remarks when interviewDoc changes
// 	useEffect(() => {
// 		if (interviewDoc) {
// 			setRemarks(interviewDoc.remarks);
// 			setTotalInterviewersPointsSubmitted(
// 				interviewDoc.totalInterviewers - interviewDoc.pendingEvaluations
// 			);
// 		}
// 	}, [interviewDoc]);

// 	// Mutation function
// 	const [updateItemMutation, { isLoading }] = useUpdateItemMutation();

// 	const handleSubmitResult = async () => {
// 		try {
// 			await updateItemMutation({
// 				path: `/interviews/${data._id}`,
// 				body: { remarks },
// 			}).unwrap();

// 			toast.success('Interview submit result successfully');
// 		} catch (error) {
// 			toast.error(error?.data?.message || 'Failed to update interview data');
// 		} finally {
// 			onClose();
// 			refetch();
// 		}
// 	};

// 	const handlePointsDetails = (interviewerId) => {
// 		const interviwerEvaluations = getInterviewerPoints(
// 			interviewerId,
// 			interview?.doc?.evaluations
// 		);

// 		console.log({ interviewId, interviwerEvaluations });

// 		setEvaluation(interviwerEvaluations);
// 		setPointsModal(true);
// 	};

// 	return (
// 		<>
// 			<Modal
// 				isOpen={isOpen}
// 				onClose={onClose}
// 				size='lg'
// 				rounded='md'
// 				shadow='md'
// 				p='10'
// 				isCentered
// 				scrollBehavior='smooth'
// 			>
// 				<ModalOverlay />
// 				<ModalContent>
// 					<ModalHeader>Finish Interview</ModalHeader>
// 					<ModalCloseButton />
// 					<ModalBody width='100%'>
// 						<Box overflow='scroll' bg='gray.100' height='55vh' p='4'>
// 							{interviewLoading || isFetching ? (
// 								<Box height='full'>
// 									<Loader />
// 								</Box>
// 							) : interview?.doc ? (
// 								<>
// 									{interviewDoc.pendingEvaluations > 0 && (
// 										<IconButton
// 											aria-label='Refetch'
// 											icon={<FaSyncAlt />}
// 											colorScheme='brand'
// 											variant='ghost'
// 											size='sm'
// 											mb='4'
// 											_hover={{
// 												bg: 'brand.600',
// 												color: 'white',
// 											}}
// 											_active={{
// 												bg: 'brand.600',
// 											}}
// 											onClick={() => interviewRefetch()}
// 										/>
// 									)}

// 									<Flex direction='column' gap='4'>
// 										<DisplayField
// 											label={`Total Interviewers`}
// 											value={interviewDoc.totalInterviewers}
// 										/>
// 										{/* {pendingEvaluations > 0 && (
// 							<DisplayField
// 								label={`Interviewer ${pendingEvaluations} Points`}
// 								value={'Pending'}
// 							/>
// 						)} */}
// 										<Grid
// 											templateColumns={{
// 												base: '1fr',
// 												md: 'repeat(2, 1fr)',
// 											}}
// 											gap={3}
// 										>
// 											{interviewDoc.evaluations.length > 0 &&
// 												interviewDoc.evaluations?.map((item) => (
// 													<Box color='gray.800' fontSize='sm'>
// 														<Box
// 															display='flex'
// 															alignItems='center'
// 															gap='2'
// 															fontWeight='500'
// 															fontSize='md'
// 															mb={1}
// 														>
// 															{`${item.interviewer.fullName} Points`}

// 															{item.status === true && (
// 																<Icon
// 																	onClick={() =>
// 																		handlePointsDetails(item?.interviewer?._id)
// 																	}
// 																	as={FaClipboardList}
// 																	color='brand.500'
// 																	cursor='pointer'
// 																	mr={2}
// 																/>
// 															)}
// 														</Box>

// 														<Box
// 															border='none'
// 															outline='none'
// 															bg='#F2F2F2'
// 															py='2'
// 															px='3'
// 															rounded='md'
// 															shadow='sm'
// 															maxH='200px' // Set a maximum height for the box
// 															overflowY='auto' // Enable vertical scrolling
// 														>
// 															{item.status === false
// 																? 'Pending'
// 																: `${item.points}`}
// 														</Box>
// 													</Box>
// 												))}
// 										</Grid>

// 										<DisplayField
// 											label={
// 												// interviewDoc.pendingEvaluations > 0
// 												// 	? `Interviewer ${totalInterviewersPointsSubmitted} Percentage`
// 												// 	: `Total Percentage (%)`
// 												`${totalInterviewersPointsSubmitted} Interviewer Percentage`
// 											}
// 											value={`${interviewDoc.percentageScore}%`}
// 										/>
// 										<Box
// 											p={1}
// 											bg='blue.50'
// 											borderRadius='md'
// 											display='flex'
// 											alignItems='center'
// 										>
// 											<Icon as={FaInfo} color='blue.500' mr={2} />
// 											<Text color='gray.700' fontSize='xs'>
// 												total interviewers points / total interviewers
// 											</Text>
// 										</Box>
// 										<FormControl>
// 											<FormLabel>Remarks</FormLabel>
// 											<Textarea
// 												value={remarks}
// 												name='remarks'
// 												bg='gray.100'
// 												borderColor='gray.300'
// 												_focus={{
// 													borderColor: '#D99A36',
// 													boxShadow: '0 0 0 1px #D99A36',
// 												}}
// 												onChange={(e) => setRemarks(e.target.value)}
// 												placeholder='Enter the remarks'
// 											/>
// 										</FormControl>
// 									</Flex>
// 								</>
// 							) : (
// 								<Text>Interview data not found!</Text>
// 							)}
// 						</Box>
// 					</ModalBody>
// 					<ModalFooter>
// 						<Button
// 							colorScheme='gray'
// 							onClick={onClose}
// 							variant='outline'
// 							size='sm'
// 							mr={2}
// 						>
// 							Cancel
// 						</Button>
// 						<Button
// 							bg='brand.500'
// 							color='white'
// 							_hover={{
// 								bg: 'brand.600',
// 								color: 'white',
// 							}}
// 							_active={{
// 								bg: 'brand.600',
// 							}}
// 							size='sm'
// 							onClick={handleSubmitResult}
// 							isDisabled={!remarks}
// 						>
// 							{isLoading ? <Spinner /> : 'Submit Result'}
// 						</Button>
// 					</ModalFooter>
// 				</ModalContent>
// 			</Modal>

// 			{pointsModal && evaluation && (
// 				<InterviewerPoints
// 					onClose={() => setPointsModal(false)}
// 					isOpen={pointsModal}
// 					evaluation={evaluation}
// 				/>
// 			)}
// 		</>
// 	);
// };

// export default InterviewResult;

import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	FormControl,
	FormLabel,
	Textarea,
	Box,
	Icon,
	Grid,
	Spinner,
	Tab,
	Tabs,
	TabList,
	TabPanels,
	TabPanel,
	Flex,
	Text,
	IconButton,
} from '@chakra-ui/react';
import { FaInfo, FaClipboardList, FaSyncAlt } from 'react-icons/fa';
import { useFetchItemsQuery, useUpdateItemMutation } from 'api/apiSlice';
import DisplayField from 'components/displays/DisplayField';
import Loader from 'components/loading/Loader';
import InterviewerPoints from './InterviewerPoints';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';

const getInterviewerPoints = (id, evaluations) =>
	evaluations?.find((item) => item.interviewer._id === id);

const InterviewResult = ({
	isOpen,
	onClose,
	interviewId,
	refetch,
	mode,
	title,
}) => {
	const [remarks, setRemarks] = useState({ initial: '', final: '' });
	const [evaluation, setEvaluation] = useState(null);
	const [pointsModal, setPointsModal] = useState(false);

	const {
		data: interview,
		isLoading,
		isFetching,
		refetch: interviewRefetch,
	} = useFetchItemsQuery(
		{ path: `/interviews/${interviewId}` },
		{ refetchOnMountOrArgChange: true }
	);

	const interviewDoc = useMemo(() => interview?.doc || {}, [interview]);
	const nextRoundDoc = useMemo(
		() => interviewDoc.nextRound || {},
		[interviewDoc]
	);

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	const totalPoints = (doc) => doc.totalInterviewers - doc.pendingEvaluations;

	useEffect(() => {
		if (interviewDoc) {
			setRemarks((prev) => ({
				...prev,
				initial: interviewDoc.remarks || '',
			}));
		}
		if (nextRoundDoc) {
			setRemarks((prev) => ({
				...prev,
				final: nextRoundDoc.remarks || '',
			}));
		}
	}, [interviewDoc, nextRoundDoc]);

	const [updateItemMutation, { isLoading: isUpdating }] =
		useUpdateItemMutation();

	const handleSubmitResult = async (roundKey) => {
		const body = { remarks: remarks[roundKey], roundKey };
		const path = `/interviews/${interviewId}`;
		try {
			await updateItemMutation({ path, body }).unwrap();
			toast.success(`Interview result submitted for ${roundKey} round`);
			onClose();
			if (refetch) refetch();

			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Hiring',
				entityType: 'Interview',
				entityId: interviewId,
				status: 'success',
				message: `${user?.fullName} submitted the ${roundKey} interview results for ${interview?.doc?.candidate?.name}.`,
			});
		} catch (err) {
			const errorMsg = err?.data?.message || 'Failed to update interview data';
			toast.error(errorMsg);

			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Hiring',
				entityType: 'Interview',
				entityId: interviewId,
				status: err?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		}
	};

	const handlePointsDetails = (interviewerId, evaluations) => {
		const points = getInterviewerPoints(interviewerId, evaluations);
		setEvaluation(points);
		setPointsModal(true);
	};

	const renderRoundPanel = (doc, roundKey) => (
		<Flex direction='column' gap={4}>
			{doc.pendingEvaluations > 0 && (
				<Box width='fit-content'>
					<IconButton
						aria-label='Refetch'
						icon={<FaSyncAlt />}
						colorScheme='brand'
						variant='ghost'
						size='sm'
						mb='2'
						onClick={() => interviewRefetch()}
					/>
				</Box>
			)}
			<DisplayField label='Total Interviewers' value={doc.totalInterviewers} />

			<Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={3}>
				{doc.evaluations?.map((item, index) => (
					<Box key={index}>
						<Box display='flex' alignItems='center' gap='2' fontWeight='500'>
							{`${item.interviewer.fullName} Points`}
							{item.status && (
								<Icon
									as={FaClipboardList}
									color='brand.500'
									cursor='pointer'
									onClick={() =>
										handlePointsDetails(item.interviewer._id, doc.evaluations)
									}
								/>
							)}
						</Box>
						<Box
							bg='#F2F2F2'
							py='2'
							px='3'
							rounded='md'
							shadow='sm'
							maxH='150px'
							overflowY='auto'
						>
							{item.status ? item.points : 'Pending'}
						</Box>
					</Box>
				))}
			</Grid>

			<DisplayField
				label={`Total Percentage`}
				value={`${doc.percentageScore}%`}
			/>
			<Box p={1} bg='blue.50' rounded='md' display='flex' alignItems='center'>
				<Icon as={FaInfo} color='blue.500' mr={2} />
				<Text fontSize='xs'>
					total interviewers points / total interviewers
				</Text>
			</Box>

			<FormControl>
				<FormLabel>Remarks</FormLabel>
				{doc?.remarks ? (
					<Box
						p={3}
						bg='gray.50'
						border='1px solid'
						borderColor='gray.200'
						borderRadius='md'
						color='gray.800'
						fontSize='md'
						height='120px'
						overflowY='scroll'
					>
						{remarks[roundKey] || 'No remarks provided.'}
					</Box>
				) : (
					<Textarea
						value={remarks[roundKey]}
						height='120px'
						resize='none'
						overflowY='auto'
						onChange={(e) =>
							setRemarks({ ...remarks, [roundKey]: e.target.value })
						}
						placeholder={`Enter remarks for ${roundKey} round`}
						bg='gray.100'
						borderColor='gray.300'
						_focus={{
							borderColor: '#D99A36',
							boxShadow: '0 0 0 1px #D99A36',
						}}
					/>
				)}
			</FormControl>
			{!doc?.remarks && (
				<Button
					bg='#EDC270'
					color='gray.800'
					fontSize={{ base: 'sm', md: 'md' }}
					fontWeight='normal'
					shadow='sm'
					rounded='md'
					_hover={{ bg: '#E0B960' }}
					_active={{ bg: '#D4AC50' }}
					isLoading={isUpdating}
					isDisabled={!remarks[roundKey]?.trim() || isUpdating}
					onClick={() => handleSubmitResult(roundKey)}
				>
					Submit Result
				</Button>
			)}
		</Flex>
	);

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size='xl'
				isCentered
				scrollBehavior='inside'
			>
				<ModalOverlay />
				<ModalContent mx='2'>
					<ModalHeader>{title}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{isLoading || isFetching ? (
							<Loader />
						) : interviewDoc ? (
							<Tabs>
								<TabList mb='1'>
									<Tab
										size='sm'
										_selected={{
											borderTop: '4px solid #B79045',
											bg: 'gray.100',
											fontWeight: 'semi-bold',
											color: 'black',
											outline: 'none',
										}}
										outline='none'
										bg='softGray.50'
										color='gray.500'
										_focus={{ outline: 'none' }}
										borderTop={'4px solid transparent'}
										_selectedAfter={{
											opacity: 1,
										}}
									>
										1st Round
									</Tab>
									{interviewDoc.isMultiRound &&
										interviewDoc.nextRound &&
										mode !== 'running' && (
											<Tab
												size='sm'
												_selected={{
													borderTop: '4px solid #B79045',
													bg: 'gray.100',
													fontWeight: 'semi-bold',
													color: 'black',
													outline: 'none',
												}}
												outline='none'
												bg='softGray.50'
												color='gray.500'
												_focus={{ outline: 'none' }}
												borderTop={'4px solid transparent'}
												_selectedAfter={{
													opacity: 1,
												}}
											>
												2nd Round
											</Tab>
										)}
								</TabList>
								<TabPanels>
									<TabPanel>
										{renderRoundPanel(interviewDoc, 'initial')}
									</TabPanel>
									{interviewDoc.isMultiRound && interviewDoc.nextRound && (
										<TabPanel>
											{renderRoundPanel(nextRoundDoc, 'final')}
										</TabPanel>
									)}
								</TabPanels>
							</Tabs>
						) : (
							<Text>No interview data found!</Text>
						)}
					</ModalBody>
				</ModalContent>
			</Modal>

			{pointsModal && evaluation && (
				<InterviewerPoints
					isOpen={pointsModal}
					onClose={() => setPointsModal(false)}
					evaluation={evaluation}
				/>
			)}
		</>
	);
};

export default InterviewResult;
