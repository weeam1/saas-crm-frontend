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
	Flex,
	Spinner,
	IconButton,
	Box,
	Text,
	Icon,
	Grid,
	HStack,
	Tooltip,
} from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useUpdateItemMutation } from 'api/apiSlice';
import DisplayField from 'components/displays/DisplayField';
import Loader from 'components/loading/Loader';
import { useEffect, useMemo, useState } from 'react';
import { FaClipboardList, FaInfo, FaSyncAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import InterviewerPoints from './InterviewerPoints';

const getInterviewerPoints = (id, evaluations) => {
	const points = evaluations?.find((item) => item.interviewer._id === id);

	return points;
};

const InterviewResult = ({ isOpen, onClose, data, interviewId, refetch }) => {
	const [remarks, setRemarks] = useState('');
	const [evaluation, setEvaluation] = useState([]);
	const [pointsModal, setPointsModal] = useState(false);

	const [
		totalInterviewersPointsSubmitted,
		setTotalInterviewersPointsSubmitted,
	] = useState(0);

	// Fetch interview data
	const {
		data: interview,
		isLoading: interviewLoading,
		isFetching,
		refetch: interviewRefetch,
	} = useFetchItemsQuery(
		{ path: `/interviews/${interviewId}` },
		{ refetchOnMountOrArgChange: true }
	);

	// Memoized interview document data
	const interviewDoc = useMemo(() => interview?.doc || {}, [interview]);
	// const points =
	// 	interviewDoc.totalInterviewers - interviewDoc.pendingEvaluations;
	// console.log({ points });

	// Update remarks when interviewDoc changes
	useEffect(() => {
		if (interviewDoc) {
			setRemarks(interviewDoc.remarks);
			setTotalInterviewersPointsSubmitted(
				interviewDoc.totalInterviewers - interviewDoc.pendingEvaluations
			);
		}
	}, [interviewDoc]);

	// Mutation function
	const [updateItemMutation, { isLoading }] = useUpdateItemMutation();

	const handleSubmitResult = async () => {
		try {
			await updateItemMutation({
				path: `/interviews/${data._id}`,
				body: { remarks },
			}).unwrap();

			toast.success('Interview submit result successfully');
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to update interview data');
		} finally {
			onClose();
			refetch();
		}
	};

	const handlePointsDetails = (interviewerId) => {
		const interviwerEvaluations = getInterviewerPoints(
			interviewerId,
			interview?.doc?.evaluations
		);

		console.log({ interviewId, interviwerEvaluations });

		setEvaluation(interviwerEvaluations);
		setPointsModal(true);
	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size='lg'
				rounded='md'
				shadow='md'
				p='10'
				isCentered
				scrollBehavior='smooth'
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Finish Interview</ModalHeader>
					<ModalCloseButton />
					<ModalBody width='100%'>
						<Box overflow='scroll' bg='gray.100' height='55vh' p='4'>
							{interviewLoading || isFetching ? (
								<Box height='full'>
									<Loader />
								</Box>
							) : interview?.doc ? (
								<>
									{interviewDoc.pendingEvaluations > 0 && (
										<IconButton
											aria-label='Refetch'
											icon={<FaSyncAlt />}
											colorScheme='brand'
											variant='ghost'
											size='sm'
											mb='4'
											_hover={{
												bg: 'brand.600',
												color: 'white',
											}}
											_active={{
												bg: 'brand.600',
											}}
											onClick={() => interviewRefetch()}
										/>
									)}

									<Flex direction='column' gap='4'>
										<DisplayField
											label={`Total Interviewers`}
											value={interviewDoc.totalInterviewers}
										/>
										{/* {pendingEvaluations > 0 && (
							<DisplayField
								label={`Interviewer ${pendingEvaluations} Points`}
								value={'Pending'}
							/>
						)} */}
										<Grid
											templateColumns={{
												base: '1fr',
												md: 'repeat(2, 1fr)',
											}}
											gap={3}
										>
											{interviewDoc.evaluations.length > 0 &&
												interviewDoc.evaluations?.map((item) => (
													<Box color='gray.800' fontSize='sm'>
														<Box
															display='flex'
															alignItems='center'
															gap='2'
															fontWeight='500'
															fontSize='md'
															mb={1}
														>
															{`${item.interviewer.fullName} Points`}

															{item.status === true && (
																<Icon
																	onClick={() =>
																		handlePointsDetails(item?.interviewer?._id)
																	}
																	as={FaClipboardList}
																	color='brand.500'
																	cursor='pointer'
																	mr={2}
																/>
															)}
														</Box>

														<Box
															border='none'
															outline='none'
															bg='#F2F2F2'
															py='2'
															px='3'
															rounded='md'
															shadow='sm'
															maxH='200px' // Set a maximum height for the box
															overflowY='auto' // Enable vertical scrolling
														>
															{item.status === false
																? 'Pending'
																: `${item.points}`}
														</Box>
													</Box>
												))}
										</Grid>

										<DisplayField
											label={
												// interviewDoc.pendingEvaluations > 0
												// 	? `Interviewer ${totalInterviewersPointsSubmitted} Percentage`
												// 	: `Total Percentage (%)`
												`${totalInterviewersPointsSubmitted} Interviewer Percentage`
											}
											value={`${interviewDoc.percentageScore}%`}
										/>
										<Box
											p={1}
											bg='blue.50'
											borderRadius='md'
											display='flex'
											alignItems='center'
										>
											<Icon as={FaInfo} color='blue.500' mr={2} />
											<Text color='gray.700' fontSize='xs'>
												total interviewers points / total interviewers
											</Text>
										</Box>
										<FormControl>
											<FormLabel>Remarks</FormLabel>
											<Textarea
												value={remarks}
												name='remarks'
												bg='gray.100'
												borderColor='gray.300'
												_focus={{
													borderColor: '#D99A36',
													boxShadow: '0 0 0 1px #D99A36',
												}}
												onChange={(e) => setRemarks(e.target.value)}
												placeholder='Enter the remarks'
											/>
										</FormControl>
									</Flex>
								</>
							) : (
								<Text>Interview data not found!</Text>
							)}
						</Box>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme='gray'
							onClick={onClose}
							variant='outline'
							size='sm'
							mr={2}
						>
							Cancel
						</Button>
						<Button
							bg='brand.500'
							color='white'
							_hover={{
								bg: 'brand.600',
								color: 'white',
							}}
							_active={{
								bg: 'brand.600',
							}}
							size='sm'
							onClick={handleSubmitResult}
							isDisabled={!remarks}
						>
							{isLoading ? <Spinner /> : 'Submit Result'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{pointsModal && evaluation && (
				<InterviewerPoints
					onClose={() => setPointsModal(false)}
					isOpen={pointsModal}
					evaluation={evaluation}
				/>
			)}
		</>
	);
};

export default InterviewResult;
