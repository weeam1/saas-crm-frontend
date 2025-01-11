import React from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	Button,
	Flex,
	Text,
	Box,
} from "@chakra-ui/react";
import { format } from "date-fns";

const NotificationView = ({ item, isOpen, onClose }) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="2xl"
			motionPreset="slideInBottom"
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Notification Details</ModalHeader>
				<ModalBody>
					<Flex direction="column" gap={4}>
						{/* Notification Message */}
						<Box
							backgroundColor="gray.100"
							p={3}
							rounded="md"
							width="100%"
							m="0"
							background="brand"
							maxH="200px" // Set max height for the modal body
							overflowY="auto" // Enable vertical scrolling when content exceeds max height
							sx={{
								"&::-webkit-scrollbar": {
									width: "6px", // Custom scrollbar width
								},
								"&::-webkit-scrollbar-thumb": {
									background: "gray.200", // Custom brand color (adjust according to your theme)
									borderRadius: "8px",
								},
								"&::-webkit-scrollbar-thumb:hover": {
									background: "gray.300", // Slightly darker on hover
								},
							}}
						>
							<Text fontSize="md" wordBreak="break-word">
								{item.message}
							</Text>
						</Box>

						{/* Created At */}
						<Text fontSize="sm" color="gray.500">
							{format(new Date(item.created_at), "MMM d, yyyy h:mm a")}
						</Text>
					</Flex>
				</ModalBody>

				<ModalFooter>
					<Button onClick={onClose} colorScheme="brand" rounded="md">
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default NotificationView;
