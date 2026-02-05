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
} from '@chakra-ui/react';
import useUserSession from 'hooks/useUserSession';

const ErrorLeadLimitMessage = ({
	isOpen,
	onClose,
	errorLeadData,
	type = 'assigned',
}) => {
	const {
		assignedLeads,
		pendingApprovals: pendingLeads,
		totalLeads,
		maxLeadLimit,
		role = 'Agent',
	} = errorLeadData || {};

	const { isSuperAdmin, userRoleName } = useUserSession();

	const isPurchase = type === 'purchase';

	if (!isOpen) return null;

	const target = userRoleName === role ? 'You' : role;

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='lg' isCentered>
			<ModalOverlay />
			<ModalContent borderRadius='md' boxShadow='lg'>
				<ModalHeader p={0} color='brand.600'>
					<Alert status='error' bg='brand.100' borderRadius='md'>
						<AlertIcon boxSize='20px' color='brand.600' />
						<Box>
							<AlertTitle fontSize='lg' mb={1}>
								Limit Reached
							</AlertTitle>
							<AlertDescription fontSize='1rem'>
								{`${target} have reached the maximum lead limit of ${maxLeadLimit}`}
							</AlertDescription>
						</Box>
					</Alert>
				</ModalHeader>
				<ModalBody>
					<Stack spacing={4}>
						<Table variant='unstyled' size='sm'>
							<Thead>
								<Tr>
									<Th
										textAlign='left'
										fontSize='lg'
										fontWeight='bold'
										color='gray.800'
										pb={4}
									>
										Leads Status
									</Th>
								</Tr>
							</Thead>
							<Tbody>
								<Tr>
									<Td fontWeight='semibold' color='gray.600'>
										Assigned Leads
									</Td>
									<Td textAlign='right' color='gray.700'>
										{assignedLeads}
									</Td>
								</Tr>
								<Tr>
									<Td fontWeight='semibold' color='gray.600'>
										Pending Leads
									</Td>
									<Td textAlign='right' color='gray.700'>
										{pendingLeads}
									</Td>
								</Tr>
								<Tr>
									<Td fontWeight='semibold' color='gray.600'>
										Total Leads
									</Td>
									<Td textAlign='right' color='gray.700'>
										{totalLeads}
									</Td>
								</Tr>
								{errorLeadData?.remainingLeads > 0 && (
									<>
										<Tr>
											<Td fontWeight='semibold' color='gray.600'>
												Remaining Leads
											</Td>
											<Td textAlign='right' color='gray.700'>
												{errorLeadData?.remainingLeads}
											</Td>
										</Tr>
										<Tr>
											<Td fontWeight='semibold' color='gray.600'>
												Selected Bulk Leads
											</Td>
											<Td textAlign='right' color='gray.700'>
												{errorLeadData?.selectedLeads}
											</Td>
										</Tr>
									</>
								)}
							</Tbody>
						</Table>

						<Divider />
						<Box>
							<Text fontWeight='bold' fontSize='md' mb={2}>
								To continue, you can:
							</Text>
							<List spacing={2} styleType='disc' pl={6}>
								{isPurchase ? (
									<ListItem>
										<Text>
											{`Your ${role === 'Manager' ? 'manager' : role === 'Team Leader' ? 'team leader' : 'personal'} lead allocation is full. Please contact your admin to increase your limit.`}
										</Text>
									</ListItem>
								) : target !== 'You' ? (
									<ListItem>
										<Text>
											{`The ${role} has no remaining lead capacity. Please reassign
											some leads ${
												isSuperAdmin
													? ` or adjust the ${role}'s lead limit in the
											settings.`
													: ''
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
						colorScheme='gray'
						variant='solid'
						borderRadius='full'
					>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ErrorLeadLimitMessage;
