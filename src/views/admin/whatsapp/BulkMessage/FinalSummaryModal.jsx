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
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { validatePhoneNumber } from 'utils/helpers';

const FinalSummaryModal = ({
	isOpen,
	onClose,
	onConfirm,
	selectedLeadsMap,
	setValidLeadsList,
}) => {
	const { validLeadsList, invalidLeadsList } = useMemo(() => {
		const valid = [];
		const invalid = [];

		for (const lead of selectedLeadsMap.values()) {
			const whatsappNumber =
				typeof lead.leadWhatsappNumber === 'object'
					? lead.leadWhatsappNumber?.result
					: lead.leadWhatsappNumber;

			const normalizedLead = {
				id: lead.lead_id || lead.id,
				name: lead.leadName || '',
				whatsapp: whatsappNumber,
			};

			if (validatePhoneNumber(whatsappNumber)) {
				valid.push(normalizedLead);
			} else {
				invalid.push(normalizedLead);
			}
		}

		setValidLeadsList(valid);
		return { validLeadsList: valid, invalidLeadsList: invalid };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedLeadsMap]);

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size='md'>
			<ModalOverlay />
			<ModalContent rounded='lg' shadow='xl'>
				<ModalHeader>Confirm Bulk Message</ModalHeader>
				<ModalCloseButton />

				<ModalBody>
					{/* Validation Summary */}
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
				</ModalBody>

				<ModalFooter>
					<Button variant='ghost' onClick={onClose}>
						Cancel
					</Button>
					<Button colorScheme='green' ml={3} onClick={onConfirm}>
						Send Now
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default FinalSummaryModal;
