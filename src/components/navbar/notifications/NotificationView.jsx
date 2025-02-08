import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	Button,
	Flex,
	Text,
	Box,
	Spinner,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useFetchItemsQuery } from 'api/apiSlice';

const NotificationView = ({ title, item, type, isOpen, onClose }) => {
	const navigate = useNavigate();
	// const [interview, setInterview] = useState(null);

	const { data: interview, isLoading } = useFetchItemsQuery(
		{
			path: `/interviews/${item?.interview_id}`,
		},
		{ skip: !item?.interview_id }
	);

	const isInterviewCancel =
		interview?.doc?.status === 'end' || interview?.doc?.status === 'canceled';

	const handleJoinInterview = () => {
		navigate(`/hiring/interview/${item.interview_id}?phase=evaluation-points`);
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='2xl'
			motionPreset='slideInBottom'
			isCentered
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{title}</ModalHeader>
				<ModalBody>
					<Flex direction='column' gap={4}>
						{/* Notification Message */}
						<Box
							backgroundColor='softGray.100'
							p={3}
							rounded='md'
							width='100%'
							m='0'
							maxH='200px' // Set max height for the modal body
							overflowY='auto' // Enable vertical scrolling when content exceeds max height
							sx={{
								'&::-webkit-scrollbar': {
									width: '6px', // Custom scrollbar width
								},
								'&::-webkit-scrollbar-thumb': {
									background: 'gray.200', // Custom brand color (adjust according to your theme)
									borderRadius: '8px',
								},
								'&::-webkit-scrollbar-thumb:hover': {
									background: 'gray.300', // Slightly darker on hover
								},
							}}
						>
							<Text fontSize='md' wordBreak='break-word'>
								{item.message}
							</Text>
						</Box>

						{/* Created At */}
						<Text fontSize='sm' color='gray.500'>
							{format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}
						</Text>
					</Flex>
				</ModalBody>

				<ModalFooter>
					{isLoading ? (
						<Spinner px='2' />
					) : interview && interview?.doc && isInterviewCancel ? (
						<Text fontSize='md' mx='4' color='blue.400'>
							This invitaion is expired
						</Text>
					) : (
						!isInterviewCancel &&
						type === 'invite' && (
							<Button
								onClick={handleJoinInterview}
								fontSize='md'
								fontWeight='semibold'
								color='softGray.100'
								bg='green.400'
								_hover={{ bg: 'green.600', shadow: 'sm' }}
								_active={{ bg: 'green.700' }}
								transition='0.2 s all'
								width='fit-content'
								py={2}
								px={4}
								mr={2}
								rounded='md'
							>
								Join Interview
							</Button>
						)
					)}
					<Button onClick={onClose} colorScheme='gray' rounded='md'>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default NotificationView;
