import { useState } from 'react';
import {
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
import { useModalColors } from 'hooks/useModalColors';

const LeaveNoteModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
	const [note, setNote] = useState('');
	const [leaveType, setLeaveType] = useState('paid');

	const handleSubmit = async () => {
		onSubmit({ note, leaveType });
		setNote('');
		setLeaveType('paid');
	};

	const { headerBg, headerText } = useModalColors();

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='2xl' isCentered>
			<ModalOverlay backdropFilter='blur(2px)' />
			<ModalContent mx='2' borderRadius='xl' boxShadow='xl'>
				<ModalHeader
					display='flex'
					gap='2'
					bg={headerBg}
					color={headerText}
					borderTopRadius='xl'
					py={4}
					alignItems='center'
					w='100%'
				>
					Leave Note
				</ModalHeader>
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
						<FormLabel>Leave Note (optional)</FormLabel>
						<Textarea
							placeholder='Type Note...'
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
						isLoading={isLoading}
						onClick={handleSubmit}
					>
						{isLoading ? 'Loading...' : 'Submit'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default LeaveNoteModal;
