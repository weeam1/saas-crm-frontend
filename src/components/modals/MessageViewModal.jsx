import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	Button,
	Box,
} from '@chakra-ui/react';

const MessageViewModal = ({ title, message, isOpen, onClose }) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} size='2xl' isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{title}</ModalHeader>
				<ModalBody>
					<Box
						border='none'
						outline='none'
						bg='softGray.100'
						py='2'
						px='3'
						rounded='md'
						shadow='sm'
						minH='100px' // Set a maximum height for the box
						overflowY='auto' // Enable vertical scrolling
					>
						{message}
					</Box>
				</ModalBody>

				<ModalFooter>
					<Button onClick={onClose} colorScheme='gray' rounded='md'>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default MessageViewModal;
