import { useState, useEffect, useCallback } from 'react';
import {
	Box,
	Grid,
	GridItem,
	Text,
	VStack,
	useColorModeValue,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Flex,
	Button,
} from '@chakra-ui/react';
import { getApi } from 'services/api';
import { toast } from 'react-toastify';
import DataNotFound from 'components/notFoundData';
import AddNewNote from './AddNewNote';
import { buttonStyle } from '../constants';
import Loader from 'components/loading/Loader';
import NoteCard from './NoteCard';
import EditNote from './EditNote';
import { useDeleteItemMutation } from 'api/apiSlice';
import { useDispatch } from 'react-redux';
import { updateLeadField } from '../../../../../redux/leadsSlice';

const LeadNotesModal = ({ leadId, isOpen, onClose }) => {
	const [notesLoading, setNotesLoading] = useState(false);
	const [allNotes, setAllNotes] = useState([]);
	const textColor = useColorModeValue('gray.500', 'white');

	const [addNote, setAddNote] = useState(false);
	const [editNote, setEditNote] = useState(false);
	const [leadNote, setLeadNote] = useState(null);
	const [latestNote, setLatestNote] = useState(null);

	const [deleteItemMutation] = useDeleteItemMutation();

	const fetchLeadNotes = useCallback(async () => {
		if (!leadId) return;
		setNotesLoading(true);
		try {
			const leadNotes = await getApi(`api/leadnote/${leadId}`);
			setAllNotes(leadNotes.data || []);
		} catch (err) {
			console.error(err);
			toast.error("Couldn't fetch lead notes");
		} finally {
			setNotesLoading(false);
		}
	}, [leadId]);

	useEffect(() => {
		fetchLeadNotes();
	}, [fetchLeadNotes]);

	const handleEditNote = (note) => {
		// Implement logic to open edit modal or form with `note` data
		console.log('Edit note:', note);

		const latestNote = allNotes[0]?._id === note._id;

		latestNote && setLatestNote(latestNote);

		setLeadNote(note);
		setEditNote(true);
	};

	const dispatch = useDispatch();

	const handleDeleteNote = async (note) => {
		try {
			await deleteItemMutation({
				path: `/leadnote/${note._id}`,
			}).unwrap();

			const updatedNotes = allNotes.filter((n) => n._id !== note._id);

			setAllNotes(updatedNotes);

			// Step 3: Update lastNote field in lead
			const latestNoteText = updatedNotes[0]?.note || '';

			dispatch(
				updateLeadField({
					id: leadId,
					key: 'lastNote',
					value: latestNoteText,
				})
			);
			toast.success('Note Deleted successfuly');
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong!');
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='5xl'>
			<ModalOverlay />
			<ModalContent fontFamily="'DM Sans', sans-serif">
				<ModalHeader>
					<Flex justify='space-between' align='center' pt='8'>
						<Text>Lead Notes</Text>
						<Button
							{...buttonStyle}
							variant='solid'
							bg='brand.400'
							py='2'
							px='5'
							aria-label='add new note'
							size='sm'
							onClick={() => setAddNote(true)}
						>
							Add New Note
						</Button>
					</Flex>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					{notesLoading ? (
						<Box
							display='flex'
							justifyContent='center'
							alignItems='center'
							p='4'
							height='60vh'
						>
							<Loader />
						</Box>
					) : (
						<VStack
							height='60vh'
							overflow='scroll'
							mt={4}
							alignItems='flex-start'
						>
							{allNotes.length > 0 ? (
								<Grid
									width='100%'
									templateColumns='repeat(12, 1fr)'
									gap={4}
									mb={2}
								>
									{allNotes.map((note, id) => (
										<NoteCard
											id={id}
											note={note}
											onDelete={handleDeleteNote}
											onEdit={handleEditNote}
										/>
									))}
								</Grid>
							) : (
								<Text
									textAlign='center'
									width='100%'
									color={textColor}
									fontSize='sm'
									fontWeight='700'
								>
									<DataNotFound />
								</Text>
							)}
						</VStack>
					)}

					{addNote && (
						<AddNewNote
							isOpen={addNote}
							onClose={() => setAddNote(false)}
							paramId={leadId}
							setNoteAdded={setAddNote}
							setAllNotes={setAllNotes}
							refreshNotes={fetchLeadNotes}
						/>
					)}

					{editNote && (
						<EditNote
							isOpen={editNote}
							onClose={() => setEditNote(false)}
							leadNote={leadNote}
							leadId={leadId}
							refreshNotes={fetchLeadNotes}
							setAllNotes={setAllNotes}
							allNotes={allNotes}
							latestNote={latestNote}
						/>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default LeadNotesModal;
