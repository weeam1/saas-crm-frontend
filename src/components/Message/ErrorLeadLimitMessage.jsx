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
	Divider,
	Stack,
} from "@chakra-ui/react";

const ErrorLeadLimitMessage = ({ isOpen, onClose, errorLeadData }) => {
	const {
		assignedLeads: agentLeads,
		pendingApprovals: pendingLeads,
		totalLeads,
		maxLeadLimit,
	} = errorLeadData;

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
			<ModalOverlay />
			<ModalContent borderRadius="md" boxShadow="lg">
				<ModalHeader
					bg="red.100"
					color="red.600"
					fontSize="lg"
					fontWeight="bold"
				>
					<Alert status="error" mb={4}>
						<AlertIcon boxSize="20px" color="red.600" />
						<Box>
							<AlertTitle fontSize="lg" mb={1}>
								Limit Reached
							</AlertTitle>
							<AlertDescription>
								{`You’ve reached the maximum lead limit of 
								${maxLeadLimit}`}
							</AlertDescription>
						</Box>
					</Alert>
				</ModalHeader>
				<ModalBody>
					<Stack spacing={3}>
						<Box>
							<strong>Summary of Your Leads:</strong>
							<ul style={{ paddingLeft: "1.5rem", listStyleType: "disc" }}>
								<li>
									<strong>Total Leads:</strong> {totalLeads}
								</li>
								<li>
									<strong>Assigned Leads:</strong> {agentLeads}
								</li>
								<li>
									<strong>Pending Leads:</strong> {pendingLeads}
								</li>
							</ul>
						</Box>
						<Box>
							To continue, you can:
							<ul style={{ paddingLeft: "1.5rem", listStyleType: "disc" }}>
								<li>Cancel some pending leads to free up your limit.</li>
								<li>
									Release some assigned leads that are no longer required.
								</li>
								<li>
									Contact your administrator to request an increase in your lead
									limit.
								</li>
							</ul>
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
