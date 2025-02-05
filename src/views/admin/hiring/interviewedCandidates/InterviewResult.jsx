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
} from '@chakra-ui/react';
import { useUpdateItemMutation } from 'api/apiSlice';
import DisplayField from 'components/displays/DisplayField';
import { useState } from 'react';
import { FaCheckCircle, FaInfo, FaSyncAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const InterviewResult = ({ isOpen, onClose, data, refetch }) => {
	const [remarks, setRemarks] = useState(data?.remarks || '');
	const { totalInterviewers, percentageScore, pendingEvaluations } = data;
	const totalInterviewersPointsSubmited =
		totalInterviewers - pendingEvaluations;

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

	console.log({ data });

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
							onClick={() => refetch()}
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
						{data.evaluations.length > 0 &&
							data.evaluations?.map((item) => (
								<DisplayField
									label={`${item.interviewer.firstName} Points`}
									value={`${item.points}%`}
								/>
							))}

						<DisplayField
							label={
								pendingEvaluations > 0
									? `Interviewer ${totalInterviewersPointsSubmited} Points`
									: `Total Points`
							}
							value={`${percentageScore}%`}
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
						{isLoading ? <Spinner /> : 'Submit Result'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default InterviewResult;
