import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Box,
	Text,
	Flex,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	Divider,
} from '@chakra-ui/react';

const BulkMessageSummary = ({ isOpen, onClose, summary = {} }) => {
	const total = summary?.success + summary?.failed || 0;
	// const successRate = total ? Math.round((summary.success / total) * 100) : 0;
	// const failureRate = total ? 100 - successRate : 0;

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='lg' isCentered>
			<ModalOverlay backdropFilter='blur(2px)' />
			<ModalContent borderRadius='xl' boxShadow='2xl' m={2}>
				<ModalHeader
					bg='green.50'
					borderTopRadius='xl'
					py={3}
					fontSize='xl'
					fontWeight='bold'
					color='gray.700'
				>
					Bulk WhatsApp Message Summary
				</ModalHeader>
				<ModalCloseButton />

				<ModalBody py={6} px={5}>
					{!summary || total === 0 ? (
						<Text fontWeight='semibold' fontSize='lg' color='green.600'>
							WhatsApp bulk message sent successfully ✅
						</Text>
					) : (
						<Box mb={6}>
							<Text fontWeight='semibold' fontSize='md' color='gray.700' mb={3}>
								Delivery Overview
							</Text>

							<Flex gap={6} wrap='wrap'>
								<Stat>
									<StatLabel>Total Leads</StatLabel>
									<StatNumber>{total}</StatNumber>
								</Stat>

								<Stat>
									<StatLabel>Success ✅</StatLabel>
									<StatNumber color='green.500'>{summary.success}</StatNumber>
									{/* <StatHelpText>{successRate}% delivered</StatHelpText> */}
								</Stat>

								<Stat>
									<StatLabel>Failed ❌</StatLabel>
									<StatNumber color='red.500'>{summary.failed}</StatNumber>
									{/* <StatHelpText>{failureRate}% failed</StatHelpText> */}
								</Stat>
							</Flex>
						</Box>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default BulkMessageSummary;
