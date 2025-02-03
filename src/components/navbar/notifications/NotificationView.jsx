import React, { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { constant } from 'constant';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';

const NotificationView = ({ title, item, type, isOpen, onClose }) => {
	const navigate = useNavigate();
	const [info, setInfo] = useState(null);

	// const [interview, setInterview] = useState(null);

	const { data: interview, isLoading } = useFetchItemsQuery(
		{
			path: `/interviews/${item?.interview_id}`,
		},
		{ skip: !item?.interview_id }
	);

	// useEffect(() => {
	// 	// Ensure that the interview_id is available before making the request
	// 	if (item?.interview_id) {
	// 		const fetchInterviewData = async () => {
	// 			try {
	// 				const response = await axios.get(
	// 					`${constant['baseUrl']}api/interviews/${item.interview_id}`,
	// 					{
	// 						headers: {
	// 							'Content-Type': 'application/json',
	// 							Authorization: `Bearer ${localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')}`,
	// 						},
	// 					}
	// 				);
	// 				setInterview(response.data);
	// 			} catch (error) {
	// 				console.error('Error fetching interview data:', error);
	// 			}
	// 		};

	// 		fetchInterviewData(); // Fetch interview data when interview_id is available
	// 	}
	// }, [item?.interview_id]);

	useEffect(() => {
		// Check the interview status only when interview data is available
		if (
			interview?.doc?.status === 'end' ||
			interview?.doc?.status === 'canceled'
		) {
			setInfo('This Interview is ended.');
		}
	}, [interview]);

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
						<Loader />
					) : (
						<>
							<Text fontSize='md' mx='4' color='blue.400'>
								{info}
							</Text>
							<Button onClick={onClose} colorScheme='gray' rounded='md'>
								Close
							</Button>
							{/* is invite */}
							{!info && type === 'invite' && (
								<>
									<Button
										onClick={handleJoinInterview}
										fontSize='md'
										fontWeight='semibold'
										color='softGray.100'
										bg='green.400'
										_hover={{ bg: 'green.600', shadow: 'sm' }}
										transition='0.2 s all'
										width='fit-content'
										py={2}
										px={4}
										ml={2}
										rounded='md'
									>
										Join Interview
									</Button>
								</>
							)}
						</>
					)}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default NotificationView;
