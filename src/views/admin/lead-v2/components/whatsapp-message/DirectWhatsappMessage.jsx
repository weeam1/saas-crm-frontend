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
import { normalizePhone, formatToWhatsappId } from 'utils/phoneValidation';
import { safeValue } from 'utils';
import { useWhatsapp } from 'hooks/whatsapp/useWhatsapp';
import Loader from 'components/loading/Loader';
import { useFetchItemsQuery } from 'api/apiSlice';

const DirectWhatsappMessage = ({ isOpen, onClose, onSend, user, number }) => {
	const [message, setMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [whatsappNumber, setWhatsappNumber] = useState('');
	const [isSending, setIsSending] = useState(false);

	const { data: instanceData, isLoading: instanceLoading } = useFetchItemsQuery(
		{
			path: `/whatsapp/instances/user/${user?._id}`,
		},
		{
			refetchOnMountOrArgChange: true,
			skip: !user?._id,
		}
	);

	const isWhatsAppActive =
		(instanceData?.doc?.isActive && instanceData?.doc?.isWhatsapp) || false;

	const sessionId = instanceData?.doc?.sessionId || null;

	const { sendMessage, isReady } = useWhatsapp();

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let timeout;

		const startReconnect = async () => {
			setLoading(true);

			if (isReady) {
				// If already ready → show only 2s loading
				timeout = setTimeout(() => {
					setLoading(false);
				}, 1000);
			} else {
				// If not ready → wait longer (5s)
				timeout = setTimeout(() => {
					setLoading(false);
				}, 5000);
			}
		};

		startReconnect();

		return () => clearTimeout(timeout);
	}, [isReady]);

	useEffect(() => {
		if (number) {
			const validNumber = normalizePhone(safeValue(number));

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
			const whatsappId = formatToWhatsappId(whatsappNumber);

			// console.log({ sessionId, to: whatsappId, message });

			sendMessage({ sessionId, to: whatsappId, message });
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
				<ModalHeader bg='whatsapp.500' color='white' py={4}>
					<HStack>
						<Icon as={FaWhatsapp} boxSize={5} />
						<Text fontSize='lg'>Send Direct Message</Text>
					</HStack>
				</ModalHeader>

				<ModalCloseButton color='whiteAlpha.900' />

				<ModalBody py={6}>
					{loading || instanceLoading ? (
						<Loader />
					) : errorMessage ? (
						<Center flexDir='column' py={6}>
							<Text fontWeight='medium' color='red.400' mb={2}>
								{errorMessage}
							</Text>
							<Text color='gray.500' fontSize='sm' textAlign='center'>
								Please select a valid WhatsApp lead number in the CRM before
								sending your message.
							</Text>
						</Center>
					) : !isWhatsAppActive || !sessionId ? (
						<Center flexDir='column' py={6}>
							<Text fontWeight='medium' color='red.400' mb={2}>
								WhatsApp account not found!
							</Text>
							<Text color='gray.500' fontSize='sm' textAlign='center'>
								Please add your WhatsApp account in CRM before sending messages.
							</Text>
						</Center>
					) : sessionId && !isReady ? (
						<Center flexDir='column' py={6}>
							<Text fontWeight='medium' color='red.400' mb={2}>
								WhatsApp not connected
							</Text>
							<Text color='gray.500' fontSize='sm' textAlign='center'>
								Reload the page and try again once your WhatsApp account is
								connected.
							</Text>
						</Center>
					) : (
						<VStack align='stretch' spacing={4}>
							<Textarea
								placeholder='Type your message...'
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								focusBorderColor='whatsapp.400'
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
								colorScheme='whatsapp'
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
