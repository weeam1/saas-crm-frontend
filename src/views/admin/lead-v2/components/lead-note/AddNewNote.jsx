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
import { useState } from 'react';
import { postApi } from 'services/api';
import { toast } from 'react-toastify';
import { Textarea } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { updateMultipleLeadFields } from '../../../../../redux/leadsSlice';
import { buttonStyle } from 'utils/btn';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import useUserSession from 'hooks/useUserSession';
import { useModalColors } from 'hooks/useModalColors';
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
	const { headerBg, headerText } = useModalColors();

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

				toast.success('Note added successfuly');
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
				return toast.error('User extension id is must required to procced!');
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
			toast.error(error?.data?.message || 'Feedback submittion failed!');
		} finally {
			setCallFeedbackOpen(false);
		}
	};

	return (
		<div>
			<Modal size='3xl' onClose={onClose} isOpen={isOpen} isCentered>
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
						Add Note
					</ModalHeader>
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

			{callFeedbackOpen && (
				<CallFeedbackModal
					isOpen={callFeedbackOpen}
					onClose={() => setCallFeedbackOpen(false)}
					onSubmit={handleSubmitFeedback}
				/>
			)}
		</div>
	);
};

export default AddNewNote;
