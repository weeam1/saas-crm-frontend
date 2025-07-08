import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	Button,
	Box,
	Text,
} from '@chakra-ui/react';

const MessageViewModal = ({ title, message, isOpen, onClose }) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} size='2xl' isCentered>
			<ModalOverlay />
			<ModalContent mx='2'>
				<ModalHeader>{title}</ModalHeader>
				<ModalBody>
					<Box
						border='none'
						outline='none'
						bg='softGray.100'
						py='2'
						px='3'
						pr='2'
						rounded='md'
						overflowY='auto'
						scrollBehavior='smooth'
						shadow='sm'
						minH='100px'
						maxH='400px'
					>
						<Text
							as='pre'
							fontSize={{ base: 'sm', md: 'md' }}
							whiteSpace='pre-wrap'
							overflowWrap='break-word'
							wordBreak='break-word'
							fontFamily='DM Sans, sans-serif'
						>
							{message}
						</Text>
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
