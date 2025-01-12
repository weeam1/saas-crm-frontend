import React from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Text,
} from "@chakra-ui/react";

const ReleaseLeadModal = ({ isOpen, onClose, onConfirm }) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Confirm Release</ModalHeader>
				<ModalBody>
					<Text>Are you sure you want to release this lead?</Text>
				</ModalBody>
				<ModalFooter>
					<Button variant="ghost" onClick={onClose}>
						Cancel
					</Button>
					<Button colorScheme="green" onClick={onConfirm} ml={3}>
						Confirm
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ReleaseLeadModal;
