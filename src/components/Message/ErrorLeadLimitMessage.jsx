import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	Box,
	Alert,
	AlertIcon,
	AlertDescription,
	AlertTitle,
	Stack,
	List,
	ListItem,
	Text,
} from "@chakra-ui/react";

const ErrorLeadLimitMessage = ({ isOpen, onClose, errorLeadData }) => {
	const {
		assignedLeads: agentLeads,
		pendingApprovals: pendingLeads,
		totalLeads,
		maxLeadLimit,
	} = errorLeadData;

	console.log({ errorLeadData });

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
							<AlertDescription>
								{`You’ve reached the maximum lead limit of ${maxLeadLimit}`}
							</AlertDescription>
						</Box>
					</Alert>
				</ModalHeader>
				<ModalBody>
					<Stack spacing={4}>
						<Box>
							<Text fontWeight="bold" fontSize="lg">
								Summary of Your Leads:
							</Text>
							<List spacing={2} styleType="disc" pl={5}>
								<ListItem>
									<Text as="span" fontWeight="semibold">
										Assigned Leads:
									</Text>{" "}
									{agentLeads}
								</ListItem>
								<ListItem>
									<Text as="span" fontWeight="semibold">
										Pending Leads:
									</Text>{" "}
									{pendingLeads}
								</ListItem>
								<ListItem>
									<Text as="span" fontWeight="semibold">
										Total Leads:
									</Text>{" "}
									{totalLeads}
								</ListItem>
							</List>
						</Box>
						<Box>
							<Text fontSize="md">To continue, you can:</Text>
							<List spacing={2} styleType="disc" pl={5}>
								<ListItem>
									Cancel some pending leads to free up your limit.
								</ListItem>
								<ListItem>
									Release some assigned leads that are no longer required.
								</ListItem>
							</List>
						</Box>
					</Stack>
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

export default ErrorLeadLimitMessage;
