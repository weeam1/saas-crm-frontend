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
} from '@chakra-ui/react';
import DisplayField from 'components/displays/DisplayField';
import Loader from 'components/loading/Loader';
import { FaSyncAlt } from 'react-icons/fa';

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
	if (remarks) setRemarks(remarks);
	// Destructure safely with default values
	const totalInterviewers = interview.totalInterviewers || 0;
	const pendingEvaluations = interview.pendingEvaluations || 0;
	const percentageScore = interview.percentageScore || 0;

	const totalInterviewersPointsSubmited =
		totalInterviewers - pendingEvaluations;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='lg'
			rounded='md'
			shadow='md'
			p='10'
			isCentered
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Finish Interview</ModalHeader>
				<ModalCloseButton />
				{isLoading ? (
					<Loader />
				) : (
					interview?.doc && (
						<>
							<ModalBody>
								{pendingEvaluations > 0 && (
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
										value={totalInterviewers}
									/>
									{pendingEvaluations > 0 && (
										<DisplayField
											label={`Interviewer ${pendingEvaluations} Points`}
											value={'Pending'}
										/>
									)}
									<DisplayField
										label={
											pendingEvaluations > 0
												? `Interviewer ${totalInterviewersPointsSubmited} Points`
												: `Total Points`
										}
										value={`${percentageScore}%`}
									/>

									<FormControl>
										<FormLabel>Remarks</FormLabel>
										<Textarea
											value={remarks}
											name='jobRole'
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
								>
									{isUpdating ? <Spinner /> : 'Submit Result'}
								</Button>
							</ModalFooter>
						</>
					)
				)}
			</ModalContent>
		</Modal>
	);
};

export default InterviewResultModal;
