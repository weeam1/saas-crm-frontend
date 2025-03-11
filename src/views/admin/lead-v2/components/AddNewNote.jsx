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
import { postApi } from 'services/api';
import { toast } from 'react-toastify';
import { Textarea } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { updateLeadField } from './../../../../redux/leadsSlice';

const AddNewNote = ({
	setNoteAdded,
	onClose,
	isOpen,
	paramId,
	refreshNotes,
}) => {
	const [noteValue, setNoteValue] = useState('');
	const [isLoding, setIsLoding] = useState(false);

	const dispatch = useDispatch();

	const handleAddNote = async () => {
		if (noteValue.trim()) {
			try {
				setIsLoding(true);
				await postApi('api/leadnote', {
					leadID: paramId,
					note: noteValue,
				});
				toast.success('Note added successfuly');
				setNoteAdded((noteAdded) => (noteAdded === 0 ? 1 : 0));
				setNoteValue('');

				dispatch(
					updateLeadField({
						id: paramId,
						key: 'lastNote',
						value: noteValue,
					})
				);
				onClose();
			} catch (error) {
				console.log(error);
				toast.error('Something went wrong!');
			} finally {
				setIsLoding(false);
				refreshNotes();
			}
		}
	};

	return (
		<div>
			<Modal size='2xl' onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent fontFamily="'DM Sans', sans-serif">
					<ModalHeader>Add a new note</ModalHeader>
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
							colorScheme='brand'
							size='sm'
							mr={2}
							onClick={handleAddNote}
							disabled={isLoding ? true : false}
						>
							{isLoding ? <Spinner /> : 'Add'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
};

export default AddNewNote;
