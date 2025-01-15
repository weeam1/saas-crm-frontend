import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Box,
	Alert,
	AlertIcon,
	AlertDescription,
	AlertTitle,
	Text,
} from "@chakra-ui/react";

const BulkLeadLimitMessage = ({ isOpen, onClose, errorData }) => {
	const { message, hint } = errorData;

	console.log({ errorData, isOpen, onClose });

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
			<ModalOverlay />
			<ModalContent borderRadius="md" boxShadow="lg">
				<ModalHeader p={0} color="brand.600">
					<Alert status="error" bg="brand.100" borderRadius="md">
						<AlertIcon boxSize="20px" color="brand.600" />
						<Box>
							<AlertTitle fontSize="lg" mb={1}>
								Limit Reached
							</AlertTitle>
							<AlertDescription>{message}</AlertDescription>
						</Box>
					</Alert>
				</ModalHeader>
				<ModalBody>
					<Text fontWeight="bold" fontSize="lg">
						{hint}
					</Text>
				</ModalBody>
				<ModalFooter>
					<Button
						onClick={onClose}
						colorScheme="gray"
						variant="solid"
						borderRadius="full"
					>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default BulkLeadLimitMessage;
