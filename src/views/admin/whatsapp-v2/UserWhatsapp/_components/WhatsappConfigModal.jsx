import { useUpdateItemMutation } from 'api/apiSlice';
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
	FormControl,
	FormLabel,
	Input,
	VStack,
	IconButton,
} from '@chakra-ui/react';
import { FaCog } from 'react-icons/fa';
import { toast } from 'react-toastify';

const WhatsappConfigModal = () => {
	const [isOpen, setIsOpen] = useState(false);

	const [apiKey, setApiKey] = useState('');
	// const [businessPhone, setBusinessPhone] = useState('');

	const [updateTokenAPI, { isLoading: tokenUpdating }] =
		useUpdateItemMutation();

	const handleSaveToken = async () => {
		try {
			if (!apiKey.trim()) {
				toast.error('Access token is required!');
				return;
			}

			const res = await updateTokenAPI({
				path: `/whatsapp/config`,
				body: {
					token: apiKey,
					// phoneNumber: businessPhone
				},
			}).unwrap();

			toast.success('WhatsApp configured successfully');
			onClose();
		} catch (error) {
			console.log(error);
			toast.error(error?.data?.message || 'Token are not save!');
		}
	};

	const onClose = () => {
		setIsOpen(false);
	};

	return (
		<>
			<IconButton
				aria-label='Configure WhatsApp'
				icon={<FaCog />}
				onClick={() => setIsOpen(true)}
				colorScheme='gray'
			/>

			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>WhatsApp Configuration</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack spacing={4}>
							<FormControl mb={4}>
								<FormLabel htmlFor='api-key'>Access Token</FormLabel>
								<Input
									id='api-key'
									placeholder='Enter your WhatsApp token'
									value={apiKey}
									onChange={(e) => setApiKey(e.target.value)}
									bg='gray.50'
									required
								/>
							</FormControl>
							{/* 
							<FormControl>
								<FormLabel htmlFor='business-phone'>Business Phone</FormLabel>
								<Input
									id='business-phone'
									placeholder='Enter your business phone number'
									value={businessPhone}
									onChange={(e) => setBusinessPhone(e.target.value)}
									bg='gray.50'
									required
								/>
							</FormControl> */}
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme='whatsapp'
							onClick={handleSaveToken}
							isLoading={tokenUpdating}
							loadingText='Saving...'
						>
							Save Configuration
						</Button>
						<Button
							variant='ghost'
							ml={3}
							onClick={() => {
								onClose();
								setApiKey('');
								// setBusinessPhone('');
							}}
							isDisabled={tokenUpdating}
						>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default WhatsappConfigModal;
