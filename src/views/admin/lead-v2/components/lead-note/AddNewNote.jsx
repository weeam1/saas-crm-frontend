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
import { updateLeadField } from '../../../../../redux/leadsSlice';
import { buttonStyle } from 'utils/btn';

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
			<Modal size='3xl' onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent m='2'>
					<ModalHeader>Add a new note</ModalHeader>
					<ModalCloseButton _focus={{ outline: 'none' }} />
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
							aria-label='add'
							onClick={handleAddNote}
							disabled={isLoding || !noteValue.trim() ? true : false}
						>
							{isLoding ? 'Loading...' : 'Add'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
};

export default AddNewNote;
