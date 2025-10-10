import React, { useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	Input,
	FormControl,
	FormLabel,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { generateRoomId } from '../helpers';
import { setActiveChat } from '../../../../../redux/whatsappSlice';
import { toast } from 'react-toastify';
import { normalizePhone } from 'utils/phoneValidation';

const WhatsappDirectChatModal = ({ isOpen, onClose, businessPhone }) => {
	const [phoneNumber, setPhoneNumber] = useState('');
	const dispatch = useDispatch();

	const handleOpenChat = async () => {
		const validNum = normalizePhone(phoneNumber);

		if (!validNum) return toast.error('Please enter a valid WhatsApp number!');

		const roomId = generateRoomId(validNum, businessPhone);

		const newContact = {
			phoneNumber: validNum,
			roomId,
			ownerId: businessPhone,
			type: '',
			lastMessage: '',
			lastMessageAt: '',
			unreadCount: 0,
		};

		dispatch(setActiveChat(newContact));
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent m='4'>
				<ModalHeader>Start WhatsApp Conversation</ModalHeader>
				<ModalCloseButton />

				<ModalBody pb={6}>
					<FormControl mb={4}>
						<FormLabel>Phone Number</FormLabel>
						<Input
							placeholder='e.g. 15551234567'
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
							autoFocus
						/>
					</FormControl>
				</ModalBody>

				<ModalFooter>
					<Button colorScheme='gray' mr={3} onClick={onClose}>
						Cancel
					</Button>

					<Button
						colorScheme='whatsapp'
						isDisabled={!phoneNumber}
						onClick={handleOpenChat}
					>
						Open Chat
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default WhatsappDirectChatModal;
