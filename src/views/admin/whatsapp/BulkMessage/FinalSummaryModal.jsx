import { InfoIcon } from '@chakra-ui/icons';
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
	Text,
	Flex,
	Badge,
	Divider,
	AlertIcon,
	Alert,
	AlertDescription,
	AlertTitle,
	Progress,
	Tooltip,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { normalizePhone } from 'utils/phoneValidation';

const FinalSummaryModal = ({
	isOpen,
	onClose,
	onConfirm,
	selectedLeadsMap,
	setValidLeadsList,
	isLoading,
}) => {
	const { validLeadsList, invalidLeadsList } = useMemo(() => {
		const valid = [];
		const invalid = [];

		for (const lead of selectedLeadsMap.values()) {
			const whatsappNumber =
				typeof lead.leadWhatsappNumber === 'object'
					? lead.leadWhatsappNumber?.result
					: lead.leadWhatsappNumber;

			// const { country } = extractLocationData(lead?.ip, countries);

			const normalizedLead = {
				id: lead.lead_id || lead.id,
				name: lead.leadName || '',
				whatsapp: whatsappNumber,
				// country,
			};

			// console.log({ normalizedLead });

			const validPhone = normalizePhone(normalizedLead?.whatsapp);
			// normalizedLead?.country || 'United Arab Emirates'

			// console.log({ validPhone });

			if (validPhone) {
				valid.push(normalizedLead);
			} else {
				invalid.push(normalizedLead);
			}
		}

		setValidLeadsList(valid);
		return { validLeadsList: valid, invalidLeadsList: invalid };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedLeadsMap]);

	const totalLeads = validLeadsList.length + invalidLeadsList.length;
	const validPercentage =
		totalLeads > 0 ? (validLeadsList.length / totalLeads) * 100 : 0;

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size='xl'>
			<ModalOverlay />
			<ModalContent rounded='lg' shadow='xl' m='4'>
				<ModalHeader>Confirm Bulk Message</ModalHeader>
				<ModalCloseButton isDisabled={isLoading} />

				{/* <ModalBody>
					<Text fontWeight='semibold' color='gray.700' mb={2}>
						Number Validation Summary:
					</Text>
					<Flex gap={4}>
						<Badge
							colorScheme='green'
							fontSize='sm'
							px={3}
							py={1}
							borderRadius='md'
						>
							✅ Valid: {validLeadsList?.length}
						</Badge>
						<Badge
							colorScheme='red'
							fontSize='sm'
							px={3}
							py={1}
							borderRadius='md'
						>
							❌ Invalid: {invalidLeadsList?.length}
						</Badge>
					</Flex>
			</ModalBody> */}

				<ModalBody py={4}>
					{/* Header */}
					<Text fontWeight='bold' color='gray.800' mb={3} fontSize='lg'>
						WhatsApp Number Validation Summary
					</Text>

					{/* Progress Bar */}
					{totalLeads > 0 && (
						<Box mb={4} width='full'>
							<Flex justify='space-between' mb={1}>
								<Text fontSize='sm' color='gray.600'>
									Validation Progress
								</Text>
								<Text fontSize='sm' fontWeight='medium' color='gray.600'>
									{Math.round(validPercentage)}% Valid
								</Text>
							</Flex>
							<Progress
								value={validPercentage}
								colorScheme={
									validPercentage >= 70
										? 'green'
										: validPercentage >= 30
											? 'yellow'
											: 'red'
								}
								size='sm'
								width='full'
								borderRadius='md'
								hasStripe
							/>
						</Box>
					)}

					{/* Validation Stats */}
					<Flex gap={3} mb={4} flexWrap='wrap'>
						<Badge
							colorScheme='green'
							fontSize='sm'
							px={3}
							py={1}
							borderRadius='md'
							display='flex'
							alignItems='center'
							gap={1}
						>
							<Box as='span' fontSize='md'>
								✅
							</Box>
							Valid: {validLeadsList.length}
							<Tooltip
								label='Numbers that are correctly formatted and ready to use'
								fontSize='md'
							>
								<InfoIcon ml={1} boxSize={3} />
							</Tooltip>
						</Badge>
						<Badge
							colorScheme='red'
							fontSize='sm'
							px={3}
							py={1}
							borderRadius='md'
							display='flex'
							alignItems='center'
							gap={1}
						>
							<Box as='span' fontSize='md'>
								❌
							</Box>
							Invalid: {invalidLeadsList.length}
							<Tooltip
								label='Numbers with formatting issues or incorrect patterns'
								fontSize='md'
							>
								<InfoIcon ml={1} boxSize={3} />
							</Tooltip>
						</Badge>
						<Badge
							colorScheme='blue'
							fontSize='sm'
							px={3}
							py={1}
							borderRadius='md'
							display='flex'
							alignItems='center'
						>
							Total: {totalLeads}
						</Badge>
					</Flex>

					{/* Warning for insufficient valid leads */}
					{validLeadsList.length < 1 && totalLeads > 0 && (
						<Alert
							status='warning'
							variant='left-accent'
							borderRadius='md'
							mb={3}
						>
							<AlertIcon />
							<Box>
								<AlertTitle>No Valid Leads Selected</AlertTitle>
								<AlertDescription>
									You need at least one valid whatsapp number to proceed. Please
									check your input or select different leads.
								</AlertDescription>
							</Box>
						</Alert>
					)}

					{/* Information when no validation performed yet */}
					{totalLeads === 0 && (
						<Alert status='info' variant='subtle' borderRadius='md'>
							<AlertIcon />
							<Box>
								<AlertTitle>No Data Validated Yet</AlertTitle>
								<AlertDescription>
									Upload a file or enter phone numbers to begin validation.
								</AlertDescription>
							</Box>
						</Alert>
					)}

					{/* Success message when good validation rate */}
					{validLeadsList.length >= 1 && validPercentage >= 70 && (
						<Alert
							status='success'
							variant='subtle'
							borderRadius='md'
							fontSize='sm'
						>
							<AlertIcon />
							Excellent! Most of your numbers are valid and ready to use.
						</Alert>
					)}
				</ModalBody>

				<ModalFooter>
					<Button variant='ghost' onClick={onClose} isDisabled={isLoading}>
						Cancel
					</Button>
					<Button
						colorScheme='green'
						ml={3}
						isLoading={isLoading}
						onClick={onConfirm}
						isDisabled={validLeadsList < 1}
					>
						Send
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default FinalSummaryModal;
