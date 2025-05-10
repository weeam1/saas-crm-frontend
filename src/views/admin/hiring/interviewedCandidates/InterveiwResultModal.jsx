import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Flex,
	IconButton,
	Spinner,
	FormControl,
	FormLabel,
	Textarea,
} from '@chakra-ui/react';
import DisplayField from 'components/displays/DisplayField';
import Loader from 'components/loading/Loader';
import { useState } from 'react';
import { FaSyncAlt } from 'react-icons/fa';

// const InterviewResultModal = ({
// 	isOpen,
// 	onClose,
// 	interview,
// 	interviewRefetch,
// 	isLoading,
// 	handleSubmitResult,
// 	isUpdating,
// 	remarks,
// 	setRemarks,
// }) => {
// 	if (remarks) setRemarks(remarks);
// 	// Destructure safely with default values
// 	const totalInterviewers = interview.totalInterviewers || 0;
// 	const pendingEvaluations = interview.pendingEvaluations || 0;
// 	const percentageScore = interview.percentageScore || 0;

// 	const totalInterviewersPointsSubmited =
// 		totalInterviewers - pendingEvaluations;

// 	return (
// 		<Modal
// 			isOpen={isOpen}
// 			onClose={onClose}
// 			size='lg'
// 			rounded='md'
// 			shadow='md'
// 			p='10'
// 			isCentered
// 		>
// 			<ModalOverlay />
// 			<ModalContent>
// 				<ModalHeader>Finish Interview</ModalHeader>
// 				<ModalCloseButton />
// 				{isLoading ? (
// 					<Loader />
// 				) : (
// 					interview?.doc && (
// 						<>
// 							<ModalBody overflow='scroll' height='60vh' p='2'>
// 								{pendingEvaluations > 0 && (
// 									<IconButton
// 										aria-label='Refetch'
// 										icon={<FaSyncAlt />}
// 										colorScheme='brand'
// 										variant='ghost'
// 										size='sm'
// 										mb='4'
// 										_hover={{
// 											bg: 'brand.600',
// 											color: 'white',
// 										}}
// 										_active={{
// 											bg: 'brand.600',
// 										}}
// 										onClick={() => interviewRefetch()}
// 									/>
// 								)}
// 								<Flex direction='column' gap='4'>
// 									<DisplayField
// 										label={`Total Interviewers`}
// 										value={totalInterviewers}
// 									/>
// 									{pendingEvaluations > 0 && (
// 										<DisplayField
// 											label={`Interviewer ${pendingEvaluations} Points`}
// 											value={'Pending'}
// 										/>
// 									)}
// 									<DisplayField
// 										label={
// 											pendingEvaluations > 0
// 												? `Interviewer ${totalInterviewersPointsSubmited} Points`
// 												: `Total Points`
// 										}
// 										value={`${percentageScore}%`}
// 									/>

// 									<FormControl>
// 										<FormLabel>Remarks</FormLabel>
// 										<Textarea
// 											value={remarks}
// 											name='remarks'
// 											bg='gray.100'
// 											borderColor='gray.300'
// 											_focus={{
// 												borderColor: '#D99A36',
// 												boxShadow: '0 0 0 1px #D99A36',
// 											}}
// 											onChange={(e) => setRemarks(e.target.value)}
// 											placeholder='Enter the remarks'
// 										/>
// 									</FormControl>
// 								</Flex>
// 							</ModalBody>
// 							<ModalFooter>
// 								<Button
// 									colorScheme='gray'
// 									onClick={onClose}
// 									variant='outline'
// 									size='sm'
// 									mr={2}
// 								>
// 									Cancel
// 								</Button>
// 								<Button
// 									bg='brand.500'
// 									color='white'
// 									_hover={{
// 										bg: 'brand.600',
// 										color: 'white',
// 									}}
// 									_active={{
// 										bg: 'brand.600',
// 									}}
// 									size='sm'
// 									onClick={handleSubmitResult}
// 								>
// 									{isUpdating ? <Spinner /> : 'Submit Result'}
// 								</Button>
// 							</ModalFooter>
// 						</>
// 					)
// 				)}
// 			</ModalContent>
// 		</Modal>
// 	);
// };

const InterviewResultModal = ({
	isOpen,
	onClose,
	interview,
	interviewRefetch,
	isLoading,
	handleSubmitResult,
	isUpdating,
	remarks,
	setRemarks,
}) => {
	const [activeRound, setActiveRound] = useState('initial');

	const getRoundData = (roundKey) => {
		if (roundKey === 'initial') return interview;
		if (roundKey === 'final') return interview?.nextRound;
		return {};
	};

	const roundKeys = ['initial'];
	if (interview?.isMultiRound && interview?.nextRound) roundKeys.push('final');

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='lg' isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Finish Interview</ModalHeader>
				<ModalCloseButton />
				{isLoading ? (
					<Loader />
				) : (
					<Tabs
						isFitted
						variant='enclosed'
						onChange={(index) => setActiveRound(roundKeys[index])}
					>
						<TabList>
							{roundKeys.map((key) => (
								<Tab key={key} textTransform='capitalize'>
									{key} Round
								</Tab>
							))}
						</TabList>

						<TabPanels>
							{roundKeys.map((key) => {
								const data = getRoundData(key);
								const totalInterviewers = data?.totalInterviewers || 0;
								const pendingEvaluations = data?.pendingEvaluations || 0;
								const percentageScore = data?.percentageScore || 0;
								const totalSubmitted = totalInterviewers - pendingEvaluations;

								return (
									<TabPanel key={key}>
										<Flex
											direction='column'
											gap='4'
											overflow='auto'
											maxH='60vh'
										>
											{pendingEvaluations > 0 && (
												<IconButton
													aria-label='Refetch'
													icon={<FaSyncAlt />}
													colorScheme='brand'
													variant='ghost'
													size='sm'
													alignSelf='flex-start'
													onClick={() => interviewRefetch()}
												/>
											)}
											<DisplayField
												label='Total Interviewers'
												value={totalInterviewers}
											/>
											{pendingEvaluations > 0 && (
												<DisplayField
													label={`Interviewer ${pendingEvaluations} Points`}
													value='Pending'
												/>
											)}
											<DisplayField
												label={
													pendingEvaluations > 0
														? `Interviewer ${totalSubmitted} Points`
														: 'Total Points'
												}
												value={`${percentageScore}%`}
											/>

											<FormControl>
												<FormLabel>Remarks</FormLabel>
												<Textarea
													value={remarks[key] || ''}
													name={`remarks-${key}`}
													bg='gray.100'
													borderColor='gray.300'
													_focus={{
														borderColor: '#D99A36',
														boxShadow: '0 0 0 1px #D99A36',
													}}
													onChange={(e) =>
														setRemarks((prev) => ({
															...prev,
															[key]: e.target.value,
														}))
													}
													placeholder='Enter remarks'
												/>
											</FormControl>
										</Flex>
									</TabPanel>
								);
							})}
						</TabPanels>
					</Tabs>
				)}
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
						_hover={{ bg: 'brand.600', color: 'white' }}
						_active={{ bg: 'brand.600' }}
						size='sm'
						onClick={() => handleSubmitResult(activeRound)}
					>
						{isUpdating ? <Spinner /> : 'Submit Result'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default InterviewResultModal;
