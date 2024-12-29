import React from "react";
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
	Icon,
	Flex,
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";

const MessageSuccessModal = ({ isOpen, onClose, messageResponse }) => {
	const disconnectedUsers = messageResponse?.disconnected_users?.length;
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader alignContent="center">
					<Flex align="center" px={4} py={4}>
						<Icon
							as={MdCheckCircle}
							width="10"
							height="10"
							color="green.500"
							mr={2}
						/>
						<Text fontSize="2xl" fontWeight="bold">
							Announcement Sent
						</Text>
					</Flex>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody textAlign="center">
					<Text>
						The announcement message has been successfully sent to all users.
					</Text>
					{disconnectedUsers > 0 && (
						<Text>
							Note: {disconnectedUsers} users may be offline and will receive
							the message when they reconnect.
						</Text>
					)}
				</ModalBody>
				<ModalFooter>
					<Button colorScheme="green" width="100px" onClick={onClose}>
						OK
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default MessageSuccessModal;
