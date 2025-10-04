import {
	AlertDialog,
	AlertDialogOverlay,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogBody,
	AlertDialogFooter,
	Button,
	Icon,
	Text,
} from '@chakra-ui/react';
import { FiArrowRightCircle } from 'react-icons/fi';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import { useCreateItemMutation } from 'api/apiSlice';
import { useNavigate } from 'react-router-dom';

const NextRoundConfirmModal = ({ isOpen, onClose, interview }) => {
	const cancelRef = useRef();

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	const [createItemMutation, { isLoading }] = useCreateItemMutation();
	const navigate = useNavigate();

	const handleCreateNextRound = async () => {
		try {
			const data = await createItemMutation({
				path: `/interviews/create-next-round`,
				body: {
					interviewId: interview._id,
				},
			}).unwrap();

			if (data?.status === 'success' && data?.doc?._id) {
				navigate('/hiring?tab=multi-round-interviewed');
				toast.success('Interview next round created');

				onClose();

				createUserLog({
					userId: user?._id,
					action: 'UPDATE',
					entity: 'Hiring',
					entityType: 'Interview',
					entityId: interview._id,
					status: 'success',
					message: `${user?.fullName} scheduled the next interview round for ${interview?.candidate?.name}.`,
				});
			} else {
				toast.error('Invalid response from server.');
			}
		} catch (error) {
			const errorMsg =
				error?.data?.message ||
				'Interview round is not created, please try again.';
			toast.error(errorMsg);

			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Hiring',
				entityType: 'Interview',
				entityId: interview._id,
				status: error?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		}
	};

	return (
		<AlertDialog
			isOpen={isOpen}
			leastDestructiveRef={cancelRef}
			onClose={onClose}
			isCentered
			size='2xl'
		>
			<AlertDialogOverlay>
				<AlertDialogContent borderRadius='lg' p={2} m='2'>
					<AlertDialogHeader
						fontSize='xl'
						fontWeight='bold'
						display='flex'
						alignItems='center'
						gap={2}
					>
						<Icon as={FiArrowRightCircle} boxSize={6} color='green.500' />
						Proceed to Next Interview Round
					</AlertDialogHeader>

					<AlertDialogBody>
						<Text fontSize='md' color='gray.600'>
							Are you sure you want to create the <b>next round</b> for this
							candidate? <br />
							Once confirmed, a new round will be scheduled and tracked.
						</Text>
					</AlertDialogBody>

					<AlertDialogFooter gap={2}>
						<Button ref={cancelRef} isDisabled={isLoading} onClick={onClose}>
							Cancel
						</Button>
						<Button
							colorScheme='green'
							onClick={handleCreateNextRound}
							isLoading={isLoading}
						>
							Yes, Create Next Round
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
};

export default NextRoundConfirmModal;
