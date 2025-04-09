import { useState } from 'react';
import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Text,
} from '@chakra-ui/react';

const ConfirmationModal = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent fontFamily="'DM Sans', sans-serif">
				<ModalHeader>{title || 'Are you sure?'}</ModalHeader>
				<ModalBody>
					<Text>{message || 'This action cannot be undone.'}</Text>
				</ModalBody>
				<ModalFooter>
					<Button rounded='md' onClick={onClose} mr={3}>
						{cancelText}
					</Button>
					<Button colorScheme='red' rounded='md' onClick={onConfirm}>
						{confirmText}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ConfirmationModal;
