import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Textarea } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { updateLeadField } from '../../../../../redux/leadsSlice';
import { useUpdateItemMutation } from 'api/apiSlice';
import { buttonStyle } from 'utils/btn';

const EditNote = ({
	onClose,
	isOpen,
	leadNote,
	latestNote,
	leadId,
	refreshNotes,
	allNotes,
	setAllNotes,
}) => {
	const [noteValue, setNoteValue] = useState(leadNote.note ?? '');

	const dispatch = useDispatch();

	const updateLeadLastNote = () => {
		// Step 1: Clone and update the specific note
		const updatedNotes = allNotes.map((note) =>
			note._id === leadNote._id ? { ...note, note: noteValue } : note
		);

		// Step 2: Update all notes state
		setAllNotes(updatedNotes);

		// Step 3: Update lastNote field in lead
		const latestNoteText = updatedNotes[0]?.note || '';

		if (latestNote) {
			console.log('latest note');
			dispatch(
				updateLeadField({
					id: leadId,
					key: 'lastNote',
					value: latestNoteText,
				})
			);
		}
	};

	const [updateItemMutation, { isLoading: isUpdating }] =
		useUpdateItemMutation();

	const handleEditNote = async () => {
		try {
			await updateItemMutation({
				path: `/leadnote/${leadNote._id}`,
				body: { note: noteValue, latestNote: latestNote ? true : false },
			}).unwrap();

			updateLeadLastNote();
			toast.success('Note Edited successfuly');
			setNoteValue('');
			onClose();
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong!');
		}
	};

	return (
		<div>
			<Modal size='2xl' onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent fontFamily="'DM Sans', sans-serif">
					<ModalHeader>Edit Lead Note</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Textarea
							style={{
								whiteSpace: 'pre-wrap',
							}}
							size={'md'}
							rows={5}
							value={noteValue}
							borderWidth='1px'
							focusBorderColor='brand.500'
							onInput={(e) => setNoteValue(e.target.value)}
							mr={3}
							placeholder='Type here'
							maxHeight='150px'
							overflowY='auto'
						/>
					</ModalBody>
					<ModalFooter>
						<Button
							{...buttonStyle}
							variant='solid'
							bg='gray.200'
							color='gray.800'
							_active={{ bg: 'gray.300' }}
							py='4'
							px='6'
							mr='3'
							fontSize='lg'
							aria-label='close'
							onClick={onClose}
						>
							Close
						</Button>
						<Button
							{...buttonStyle}
							variant='solid'
							bg='brand.400'
							py='4'
							px='6'
							fontSize='lg'
							aria-label='update'
							onClick={handleEditNote}
							disabled={isUpdating || !noteValue.trim() ? true : false}
						>
							{isUpdating ? 'Updating...' : 'Update'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
};

export default EditNote;
