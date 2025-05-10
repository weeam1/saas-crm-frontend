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

	const {
		data: interview,
		isLoading,
		error,
	} = useFetchItemsQuery(
		{
			path: `/interviews/${item?.interview_id}`,
		},
		{ skip: !item?.interview_id }
	);

	const isInterviewCancel =
		interview?.doc?.status === 'end' ||
		interview?.doc?.status === 'canceled' ||
		error?.status === 404;

	const handleJoinInterview = () => {
		navigate(`/hiring/interview/${item.interview_id}`);

		// window.location.href = `/hiring/interview/${item.interview_id}?phase=evaluation-points`;

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
							bg='softGray.100'
							maxH='30vh'
							overflowY='auto'
							p={3}
							rounded='md'
						>
							<Text fontSize='md' wordBreak='break-word' whiteSpace='pre-wrap'>
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
					) : isInterviewCancel ? (
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
