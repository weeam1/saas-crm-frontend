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
import Spinner from 'components/spinner/Spinner';
import { getApi } from 'services/api';
import { toast } from 'react-toastify';
import DataNotFound from 'components/notFoundData';
import AddNewNote from './AddNewNote';
import { buttonStyle } from './constants';
import Loader from 'components/loading/Loader';
import { format } from 'date-fns';

const LeadNotesModal = ({ leadId, isOpen, onClose }) => {
	const user = JSON.parse(localStorage.getItem('user'));
	const [notesLoading, setNotesLoading] = useState(false);
	const [allNotes, setAllNotes] = useState([]);
	const textColor = useColorModeValue('gray.500', 'white');

	const [addNote, setAddNote] = useState(false);

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
										<GridItem key={id} colSpan={{ base: 12, md: 6, lg: 6 }}>
											<Box
												backgroundColor='whitesmoke'
												borderRadius='10px'
												p={4}
												m={1}
												height='100%'
											>
												<Box
													display='flex'
													justifyContent='space-between'
													alignItems='center'
													color='black'
												>
													<Text>
														{note.addedBy?.firstName +
															' ' +
															note.addedBy?.lastName}
													</Text>
													<Text fontSize={13}>
														{format(
															new Date(note?.createdAt),
															'MMM d, yyyy h:mm a'
														)}
													</Text>
												</Box>
												<Box overflowY='auto' height={200}>
													<Text
														as='pre'
														fontWeight='semibold'
														whiteSpace='pre-wrap'
														overflowWrap='break-word'
														wordBreak='break-word'
													>
														{note?.note}
													</Text>
												</Box>
											</Box>
										</GridItem>
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
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default LeadNotesModal;
