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
	Textarea,
	Select,
	FormControl,
	FormLabel,
} from '@chakra-ui/react';
import { buttonStyle } from 'utils/btn';
import { toast } from 'react-toastify';

const LeaveNoteModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
	const [note, setNote] = useState('');
	const [leaveType, setLeaveType] = useState('paid');

	const handleSubmit = () => {
		if (!note.trim()) {
			toast.error('Please enter a leave note');
			return;
		}
		onSubmit({ note, leaveType });
		setNote('');
		setLeaveType('paid');
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='2xl' isCentered>
			<ModalOverlay />
			<ModalContent mx='4'>
				<ModalHeader>Leave Details</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<FormControl mb={4}>
						<FormLabel>Leave Type</FormLabel>
						<Select
							value={leaveType}
							onChange={(e) => setLeaveType(e.target.value)}
							focusBorderColor='brand.500'
						>
							<option value='paid'>Paid Leave</option>
							<option value='unpaid'>Unpaid Leave</option>
						</Select>
					</FormControl>

					<FormControl>
						<FormLabel>Leave Note</FormLabel>
						<Textarea
							placeholder='Enter leave details...'
							value={note}
							onChange={(e) => setNote(e.target.value)}
							focusBorderColor='brand.500'
							height='160px'
							resize='none'
							overflowY='auto'
						/>
					</FormControl>
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
						isDisabled={!note.trim()}
						isLoading={isLoading}
						onClick={handleSubmit}
					>
						{isLoading ? 'Submitting...' : 'Submit Leave'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default LeaveNoteModal;
