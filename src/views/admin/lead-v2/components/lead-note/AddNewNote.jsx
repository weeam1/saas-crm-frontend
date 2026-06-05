import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Textarea,
} from '@chakra-ui/react';
import { useState } from 'react';
import { postApi } from 'services/api';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { updateMultipleLeadFields } from '../../../../../redux/leadsSlice';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import useUserSession from 'hooks/useUserSession';
import CallFeedbackModal from './CallFeedbackModal';
import { useCreateItemMutation } from 'api/apiSlice';

export const getUsernameByPriority = (modes = {}) => {
	return (
		modes?.udp?.username ?? modes?.wss?.username ?? modes?.tls?.username ?? null
	);
};

const AddNewNote = ({
	setNoteAdded,
	onClose,
	isOpen,
	paramId,
	refreshNotes,
}) => {
	const [noteValue, setNoteValue] = useState('');
	const [isLoding, setIsLoding] = useState(false);
	const [callFeedbackOpen, setCallFeedbackOpen] = useState(false);

	const webrtc = useSelector((state) => state.webrtc);
	const userSettings = webrtc?.userSettings;
	const isFeedbackStatus = Boolean(userSettings?.isFeedback || false);

	const userExtensionId = userSettings
		? getUsernameByPriority(userSettings?.modes)
		: null;

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	const [createItemMutation] = useCreateItemMutation();

	const dispatch = useDispatch();

	const handleSubmitNote = async () => {
		if (noteValue.trim()) {
			try {
				setIsLoding(true);
				const res = await postApi('api/leadnote', {
					leadID: paramId,
					note: noteValue,
				});

				toast.success('Note added successfully');
				setNoteAdded((noteAdded) => (noteAdded === 0 ? 1 : 0));
				setNoteValue('');

				if (res?.data?.doc) {
					const updates = [
						{
							id: paramId,
							lastNote: noteValue,
							latestNote: {
								createdAt: new Date().toISOString(),
								addedBy: res?.data?.doc?.addedBy,
							},
						},
					];

					dispatch(updateMultipleLeadFields({ updates }));
				}

				onClose();

				createUserLog({
					userId: user?._id,
					action: 'CREATE',
					entity: 'Lead',
					entityId: paramId || null,
					status: 'success',
					message: `${user?.fullName} added a new note to lead.`,
				});
			} catch (error) {
				console.log(error);
				toast.error(error?.data?.message || 'Something went wrong!');

				createUserLog({
					userId: user?._id,
					action: 'CREATE',
					entity: 'Lead',
					entityId: paramId || null,
					status: error?.status === 500 ? 'error' : 'fail',
					message: `${user?.fullName} failed to add a new note.`,
				});
			} finally {
				setIsLoding(false);
				refreshNotes();
			}
		}
	};

	const handleAddNote = () => {
		if (isFeedbackStatus) {
			setCallFeedbackOpen(true);
		} else handleSubmitNote();
	};

	const handleSubmitFeedback = async (data) => {
		try {
			if (!userExtensionId) {
				return toast.error('User extension id is required to proceed!');
			}

			const payload = {
				...data,
				leadId: paramId,
				userExtensionId,
			};

			await createItemMutation({
				path: '/sipSetting/feedback',
				body: payload,
			}).unwrap();

			toast.success('Feedback submitted successfully');

			handleSubmitNote();
		} catch (error) {
			toast.error(error?.data?.message || 'Feedback submission failed!');
		} finally {
			setCallFeedbackOpen(false);
		}
	};

	return (
		<>
			<Modal size='3xl' onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay bg='bg.overlay' backdropFilter='blur(2px)' />
				<ModalContent
					bg='bg.surface'
					borderRadius='xl'
					boxShadow='deep'
					mx='2'
					overflow='hidden'
				>
					<ModalHeader
						bg='accent.gold'
						color='#000000'
						borderTopRadius='xl'
						py={4}
						px={6}
						borderBottom='1px solid'
						borderColor='border.default'
					>
						Add Note
					</ModalHeader>

					<ModalCloseButton
						color='#000000'
						_focus={{ outline: 'none' }}
						_hover={{ bg: 'rgba(0,0,0,0.1)' }}
					/>

					<ModalBody py={6}>
						<Textarea
							whiteSpace='pre-wrap'
							size='md'
							rows={5}
							value={noteValue}
							bg='bg.input'
							borderColor='border.default'
							color='text.body'
							_placeholder={{ color: 'text.muted' }}
							_focus={{
								borderColor: 'border.focus',
								boxShadow: 'goldGlow',
							}}
							_hover={{ borderColor: 'border.focus' }}
							onChange={(e) => setNoteValue(e.target.value)}
							placeholder='Type here'
							maxHeight='150px'
							overflowY='auto'
						/>
					</ModalBody>

					<ModalFooter
						borderTop='1px solid'
						borderColor='border.default'
						gap={3}
					>
						<Button
							variant='outline'
							onClick={onClose}
						>
							Close
						</Button>
						<Button
							variant='brand'
							onClick={handleAddNote}
							isDisabled={isLoding || !noteValue.trim()}
							isLoading={isLoding}
						>
							{isLoding ? 'Loading...' : 'Add'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{callFeedbackOpen && (
				<CallFeedbackModal
					isOpen={callFeedbackOpen}
					onClose={() => setCallFeedbackOpen(false)}
					onSubmit={handleSubmitFeedback}
				/>
			)}
		</>
	);
};

export default AddNewNote;