import { useState } from 'react';
import {
	Box,
	Text,
	Input,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	Button,
	useDisclosure,
	Textarea,
} from '@chakra-ui/react';
import { buttonStyle } from 'utils/btn';
import { useUpdateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LeaveNote = ({ interviewId, loading }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [reason, setReason] = useState('');

	const [updateItemMutation, { isLoading: updatingInterview }] =
		useUpdateItemMutation();

	const navigate = useNavigate();

	const handleSubmit = async () => {
		try {
			await updateItemMutation({
				path: `/interviews/reject/${interviewId}`,
				body: { reason: reason.trim() },
			}).unwrap();

			toast.success('Candidate rejected successfully');

			navigate('/hiring');
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to update interview data');
		}
		onClose();
	};

	return (
		<Box>
			<Button
				{...buttonStyle}
				py='2'
				mt='2'
				size='md'
				w='full'
				bg='gray.100'
				color='gray.800'
				_active={{ bg: 'gray.200' }}
				onClick={onOpen}
				isDisabled={loading}
			>
				Reject Candidate
			</Button>

			<Modal isOpen={isOpen} onClose={onClose} size='lg' isCentered>
				<ModalOverlay />
				<ModalContent mx='4'>
					<ModalHeader>Reason for Rejection</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Textarea
							placeholder='Enter rejection reason'
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							focusBorderColor='brand.500'
							height='120px'
							resize='none'
							overflowY='auto'
						/>
					</ModalBody>
					<ModalFooter>
						<Button
							{...buttonStyle}
							bg='softGray.100'
							color='gray.700'
							_active='gray.200'
							mr={3}
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button
							{...buttonStyle}
							colorScheme='brand'
							isDisabled={!reason.trim()}
							isLoading={updatingInterview}
							onClick={handleSubmit}
						>
							{updatingInterview ? 'Loading...' : 'Submit'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default LeaveNote;
