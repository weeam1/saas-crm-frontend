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
	FormControl,
	FormLabel,
} from '@chakra-ui/react';
import { buttonStyle } from 'utils/btn';
import { useCreateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';

const AddShortListedNote = ({ applicationId, isOpen, onClose }) => {
	const [note, setNote] = useState('');

	const [createNote, { isLoading }] = useCreateItemMutation();

	const handleSubmit = async () => {
		try {
			await createNote({
				path: `/applications/short-listed/notes/${applicationId}`,
				body: { note },
			}).unwrap();

			toast.success('Feedback note added successfully.');
			setNote('');
			onClose();
		} catch (error) {
			console.error('Error adding note:', error);
			toast.error(
				error?.data?.message || 'Failed to add note. Please try again.'
			);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='2xl' isCentered>
			<ModalOverlay />
			<ModalContent mx='4'>
				<ModalHeader>Candidate Feedback Note</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<FormControl>
						<FormLabel>Note</FormLabel>
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
						disabled={note.trim() === ''}
					>
						{isLoading ? 'Loading...' : 'Add'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AddShortListedNote;
