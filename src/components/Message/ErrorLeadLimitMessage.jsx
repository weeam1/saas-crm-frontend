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
	Divider,
	Flex,
	Table,
	Tr,
	Thead,
	Th,
	Tbody,
	Td,
} from "@chakra-ui/react";

const ErrorLeadLimitMessage = ({ isOpen, onClose, errorLeadData }) => {
	const {
		assignedLeads: agentLeads,
		pendingApprovals: pendingLeads,
		totalLeads,
		maxLeadLimit,
	} = errorLeadData;

	if (!isOpen) return null;

	const user = JSON.parse(localStorage.getItem("user"));

	const superAdmin = user?.role === "superAdmin";
	const role = user?.roles[0]?.roleName;

	const target = role === "Agent" ? "You" : "Agent";

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
							<AlertDescription fontSize="1rem">
								{`${target} have reached the maximum lead limit of ${maxLeadLimit}`}
							</AlertDescription>
						</Box>
					</Alert>
				</ModalHeader>
				<ModalBody>
					<Stack spacing={4}>
						<Table variant="unstyled" size="sm">
							<Thead>
								<Tr>
									<Th
										textAlign="left"
										fontSize="lg"
										fontWeight="bold"
										color="gray.800"
										pb={4}
									>
										Leads Status
									</Th>
								</Tr>
							</Thead>
							<Tbody>
								<Tr>
									<Td fontWeight="semibold" color="gray.600">
										Assigned Leads
									</Td>
									<Td textAlign="right" color="gray.700">
										{agentLeads}
									</Td>
								</Tr>
								<Tr>
									<Td fontWeight="semibold" color="gray.600">
										Pending Leads
									</Td>
									<Td textAlign="right" color="gray.700">
										{pendingLeads}
									</Td>
								</Tr>
								<Tr>
									<Td fontWeight="semibold" color="gray.600">
										Total Leads
									</Td>
									<Td textAlign="right" color="gray.700">
										{totalLeads}
									</Td>
								</Tr>
							</Tbody>
						</Table>

						<Divider />
						<Box>
							<Text fontWeight="bold" fontSize="md" mb={2}>
								To continue, you can:
							</Text>
							<List spacing={2} styleType="disc" pl={6}>
								{target === "Agent" ? (
									<ListItem>
										<Text>
											{`The agent has no remaining lead capacity. Please reassign
											some leads ${
												superAdmin &&
												` or adjust the agent's lead limit in the
											settings.`
											} `}
										</Text>
									</ListItem>
								) : (
									<>
										{pendingLeads > 0 && (
											<ListItem>
												<Text>
													Cancel some pending leads to free up your limit.
												</Text>
											</ListItem>
										)}
										<ListItem>
											<Text>
												Release some assigned leads that are no longer required.
											</Text>
										</ListItem>
									</>
								)}
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
