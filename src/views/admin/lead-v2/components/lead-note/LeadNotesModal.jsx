import { useState, useEffect, useCallback } from 'react';
import {
	Box,
	Grid,
	GridItem,
	Text,
	VStack,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Flex,
	Button,
	HStack,
} from '@chakra-ui/react';
import { getApi } from 'services/api';
import { toast } from 'react-toastify';
import AddNewNote from './AddNewNote';
import NoteCard from './NoteCard';
import EditNote from './EditNote';
import { useDeleteItemMutation } from 'api/apiSlice';
import { useDispatch } from 'react-redux';
import { updateLeadField } from '../../../../../redux/leadsSlice';
import CardShimmer from 'components/loading/CardShimmer';
import NoData from 'components/Message/NoData';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';

const LeadNotesModal = ({ leadId, isOpen, onClose, isInLeadPool = false }) => {
	const [notesLoading, setNotesLoading] = useState(false);
	const [allNotes, setAllNotes] = useState([]);

	const [addNote, setAddNote] = useState(false);
	const [editNote, setEditNote] = useState(false);
	const [leadNote, setLeadNote] = useState(null);
	const [latestNote, setLatestNote] = useState(null);

	const [deleteItemMutation] = useDeleteItemMutation();

	const { user, userRoleName } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	const addNoteAllowed = userRoleName !== 'Agent' ? true : !isInLeadPool;

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
		const latestNoteFlag = allNotes[0]?._id === note._id;
		latestNoteFlag && setLatestNote(latestNoteFlag);
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

			const latestNoteText = updatedNotes[0]?.note || '';
			dispatch(
				updateLeadField({
					id: leadId,
					key: 'lastNote',
					value: latestNoteText,
				})
			);

			createUserLog({
				userId: user?._id,
				action: 'DELETE',
				entity: 'Lead',
				entityId: note._id || null,
				status: 'success',
				message: `${user?.fullName} deleted the note.`,
			});
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong!');

			createUserLog({
				userId: user?._id,
				action: 'DELETE',
				entity: 'Lead',
				entityId: note._id || null,
				status: error?.status === 500 ? 'error' : 'fail',
				message: `Failed to delete the note.`,
			});
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='5xl' isCentered>
			<ModalOverlay bg='bg.overlay' backdropFilter='blur(2px)' />
			<ModalContent
				bg='bg.surface'
				borderRadius='xl'
				boxShadow='deep'
				mx='2'
				overflow='hidden'
			>
				<ModalHeader
					bg='bg.elevated'
					color='text.heading'
					borderTopRadius='xl'
					px={{ base: 4, md: 6 }}
					py={{ base: 3, md: 4 }}
					w='100%'
					borderBottom='1px solid'
					borderColor='border.default'
				>
					<Flex
						justify='space-between'
						align='center'
						flexWrap='wrap'
						gap={{ base: 3, md: 0 }}
					>
						<HStack
							spacing='2'
							align='center'
							fontWeight='600'
							mb={{ base: 1, md: 0 }}
							fontSize={{ base: 'md', md: 'lg' }}
						>
							<Text lineHeight='short' fontWeight='600' color='text.heading'>
								Lead Notes
							</Text>
							<CountUpComponent targetNumber={allNotes?.length || 0} />
						</HStack>

						<HStack spacing='3' align='center' gap={2}>
							{addNoteAllowed && (
								<Button
									variant='outline'
									size={{ base: 'xs', md: 'sm' }}
									px={'4'}
									py={'2'}
									fontSize='clamp(0.75rem, 1.8vw, 0.875rem)'
									onClick={() => setAddNote(true)}
									aria-label='add new note'
									borderRadius='md'
								>
									Add Note
								</Button>
							)}

							<ModalCloseButton
								position='relative'
								top='0'
								right='0'
								color='text.muted'
								_focus={{ outline: 'none' }}
								_hover={{ bg: 'bg.elevated' }}
							/>
						</HStack>
					</Flex>
				</ModalHeader>

				<ModalBody p={0}>
					<Box
						h={{ base: '50vh', md: '60vh', lg: '70vh' }}
						overflow='scroll'
						scrollBehavior='smooth'
						p={4}
						bg='bg.app'
					>
						{notesLoading ? (
							<CardShimmer
								count={5}
								height='100px'
								columns={{ base: 1, sm: 1, md: 1, lg: 1, xl: 1, '2xl': 1 }}
							/>
						) : (
							<VStack alignItems='flex-start'>
								{allNotes.length > 0 ? (
									<Grid width='100%' templateColumns='1fr' gap={4} mb={2}>
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
									<Box mx='auto' h='full'>
										<NoData label='notes' />
									</Box>
								)}
							</VStack>
						)}
					</Box>

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