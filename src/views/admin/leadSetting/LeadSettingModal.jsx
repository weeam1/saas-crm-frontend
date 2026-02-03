import React, { useState, useEffect } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Input,
	Button,
	FormControl,
	FormLabel,
	Box,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { useCreateItemMutation } from 'api/apiSlice';

const LeadLimitModal = ({
	isOpen,
	onClose,
	defaultLeadLimit = 0,
	onSuccess,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [leadLimit, setLeadLimit] = useState(defaultLeadLimit);

	const [createLeadLimit] = useCreateItemMutation();

	useEffect(() => {
		// Reset input whenever modal opens
		if (isOpen) setLeadLimit(defaultLeadLimit);
	}, [isOpen, defaultLeadLimit]);

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			await createLeadLimit({
				path: 'lead-settings',
				body: {
					agentLeadLimit: leadLimit,
				},
			}).unwrap();

			toast.success('Lead limit updated successfully.');
			onClose();
			onSuccess();
		} catch (error) {
			console.error('Error updating lead limit:', error);
			toast.error('Could not update the lead limit.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (e) => {
		const newValue = e.target.value;
		if (newValue === '' || /^\d+$/.test(newValue)) {
			setLeadLimit(newValue === '' ? '' : Number(newValue));
		} else {
			toast.error('Please enter a valid number.');
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size='md'>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Update Default Lead Limit</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Box>
						<Text fontSize={{ base: 'sm', md: 'md' }} color='gray.600' mb={2}>
							Set the default number of leads assigned to users.
						</Text>

						<form id='lead-limit-form' onSubmit={handleSubmit}>
							<FormControl id='agentLeadLimit' isRequired>
								<FormLabel>Lead Limit</FormLabel>
								<Input
									min='0'
									type='number'
									value={leadLimit}
									onChange={handleInputChange}
									placeholder='Enter lead limit'
									bg='gray.50'
									_focus={{ bg: 'white', borderColor: 'brand.400' }}
									borderColor='gray.300'
								/>
							</FormControl>
						</form>
					</Box>
				</ModalBody>

				<ModalFooter gap={2}>
					<Button onClick={onClose} variant='outline'>
						Cancel
					</Button>
					<Button
						colorScheme='brand'
						type='submit'
						form='lead-limit-form'
						isLoading={isLoading}
					>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default LeadLimitModal;
