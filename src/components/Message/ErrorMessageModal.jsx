import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	Text,
} from "@chakra-ui/react";

const ErrorMessageModal = ({ isOpen, onClose, message }) => {
	console.log("message modal: ", message);

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Error</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Text mt={2} fontStyle="italic" color="gray.600">
						{message}
					</Text>
				</ModalBody>
				<ModalFooter>
					<Button colorScheme="gray" onClick={onClose}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ErrorMessageModal;
