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

const PermissionModal = ({ isOpen, onClose }) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Allow Notifications and Sound</ModalHeader>
				<ModalBody>
					<Text>
						To stay updated with announcements and notifications, please allow
						notifications and sound permissions.
					</Text>
				</ModalBody>
				<ModalFooter>
					<Button variant="ghost" onClick={onClose} ml={3}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default PermissionModal;
