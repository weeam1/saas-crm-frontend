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
	Box,
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import { FaCircle } from "react-icons/fa";

const MessageSuccessModal = ({
	isOpen,
	onClose,
	onlineUsers,
	offlineUsers,
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader alignContent="center">
					<Flex align="center" px={4} py={2}>
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
				<ModalBody textAlign="center" p={6}>
					<Text fontSize="lg" color="green.600" mb={4}>
						Announcement successfully sent to all users!
					</Text>
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						gap={4}
					>
						{/* Online Status Box */}
						{onlineUsers > 0 && (
							<Box
								display="flex"
								alignItems="center"
								justifyContent="center"
								p={3}
								borderWidth={1}
								borderRadius="md"
								borderColor="green.300"
								bg="green.50"
								boxShadow="sm"
								minW="120px"
							>
								<FaCircle color="green" size="1em" />
								<Text ml={2} color="green.600" fontWeight="medium">
									{onlineUsers} Online
								</Text>
							</Box>
						)}

						{/* Offline Status Box */}
						{offlineUsers > 0 && (
							<Box
								display="flex"
								alignItems="center"
								justifyContent="center"
								p={3}
								borderWidth={1}
								borderRadius="md"
								borderColor="red.300"
								bg="red.50"
								boxShadow="sm"
								minW="120px"
							>
								<FaCircle color="red" size="1em" />
								<Text ml={2} color="red.600" fontWeight="medium">
									{offlineUsers} Offline
								</Text>
							</Box>
						)}
					</Box>
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
