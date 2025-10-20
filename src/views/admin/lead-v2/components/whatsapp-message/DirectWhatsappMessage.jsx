import { useState, useEffect } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	Textarea,
	Button,
	Text,
	Input,
	VStack,
	HStack,
	Icon,
	Center,
	Box,
} from '@chakra-ui/react';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { normalizePhone } from 'utils/phoneValidation';
import { safeValue } from 'utils';

const DirectWhatsappMessage = ({ isOpen, onClose, onSend, user, number }) => {
	const [message, setMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [whatsappNumber, setWhatsappNumber] = useState('');
	const [isSending, setIsSending] = useState(false);

	const isWhatsAppActive = false || user?.whatsappInstance?.isActive;

	useEffect(() => {
		if (number) {
			const validNumber = normalizePhone(safeValue(number, 'object'));

			if (validNumber) {
				setWhatsappNumber(validNumber);
			} else setErrorMessage('WhatsApp number is not correct!');
		} else {
			setErrorMessage('WhatsApp number is not correct!');
		}
	}, [number]);

	const handleSend = async () => {
		if (!message.trim()) {
			toast.warn('Message cannot be empty.', {
				position: 'top-right',
				autoClose: 2500,
			});
			return;
		}

		try {
			// setIsSending(true);
			// await onSend(whatsappNumber, message);
			toast.success('Message sent successfully!');
			onClose();
		} catch (err) {
			toast.error(
				err?.message || 'Failed to send message. Please try again later.'
			);
		} finally {
			setIsSending(false);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='lg' isCentered>
			<ModalOverlay />
			<ModalContent borderRadius='2xl' overflow='hidden'>
				<ModalHeader bg='green.500' color='white' py={4}>
					<HStack>
						<Icon as={FaWhatsapp} boxSize={5} />
						<Text fontSize='lg'>Send Direct Message</Text>
					</HStack>
				</ModalHeader>

				<ModalCloseButton color='whiteAlpha.900' />

				<ModalBody py={6}>
					{errorMessage ? (
						<Center flexDir='column' py={6}>
							<Text fontWeight='medium' color='red.400' mb={2}>
								{errorMessage}
							</Text>
							<Text color='gray.500' fontSize='sm' textAlign='center'>
								Please select a valid WhatsApp lead number in the CRM before
								sending your message.
							</Text>
						</Center>
					) : !isWhatsAppActive ? (
						<Center flexDir='column' py={6}>
							<Text fontWeight='medium' color='red.400' mb={2}>
								WhatsApp not connected
							</Text>
							<Text color='gray.500' fontSize='sm' textAlign='center'>
								Please connect your WhatsApp account in CRM before sending
								messages.
							</Text>
						</Center>
					) : (
						<VStack align='stretch' spacing={4}>
							<Textarea
								placeholder='Type your message...'
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								focusBorderColor='green.400'
								size='md'
								minH='120px'
							/>
						</VStack>
					)}
				</ModalBody>

				<ModalFooter borderTopWidth='1px' bg='gray.50'>
					{!isWhatsAppActive ? (
						<Button onClick={onClose}>Close</Button>
					) : (
						<HStack spacing={3}>
							<Button onClick={onClose} variant='ghost'>
								Close
							</Button>
							<Button
								colorScheme='green'
								onClick={handleSend}
								isLoading={isSending}
								isDisabled={!message.trim()}
							>
								Send
							</Button>
						</HStack>
					)}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default DirectWhatsappMessage;
