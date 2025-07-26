import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Box,
	Text,
	Button,
	Flex,
	Badge,
	SimpleGrid,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';

import { useState, useMemo, useEffect } from 'react';
import { validatePhoneNumber } from 'utils/helpers';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import { useCreateItemMutation } from 'api/apiSlice';
import BulkMessageSummary from './BulkMessageSummary';

const BulkWhatsappModal = ({
	isOpen,
	onClose,
	onSuccess,
	selectedLeads = [],
	whatsappAccountId,
}) => {
	const [selectedTemplate, setSelectedTemplate] = useState(null);
	const [messageSummary, setMessageSummary] = useState(null);

	const [summaryModal, setSummaryModal] = useState(false);

	const [sendBulkMessage, { isLoading: isSending }] = useCreateItemMutation();

	const user = JSON.parse(localStorage.getItem('user'));

	const {
		data: templates = [],
		isLoading: isTemplatesLoading,
		isError,
	} = useFetchItemsQuery(
		{
			path: `/whatsapp/templates`,
			params: { accountId: whatsappAccountId },
		},
		{
			skip: !whatsappAccountId || selectedLeads.length > 50,
			refetchOnMountOrArgChange: true,
		}
	);

	useEffect(() => {
		if (Array.isArray(templates?.doc)) {
			const filtered = templates.doc.filter(
				(template) =>
					typeof template.name === 'string' &&
					!template.name.toLowerCase().includes('hello_world')
			);

			if (filtered.length > 0) {
				setSelectedTemplate(filtered[0]);
			} else {
				setSelectedTemplate(null);
			}
		}
	}, [templates?.doc]);

	const filteredTemplates = Array.isArray(templates?.doc)
		? templates.doc.filter(
				(template) =>
					typeof template.name === 'string' &&
					!template.name.toLowerCase().includes('hello_world')
			)
		: [];

	//  Extract template body + footer
	const templateBody =
		selectedTemplate?.components?.find((c) => c.type === 'BODY')?.text || '';
	const templateFooter =
		selectedTemplate?.components?.find((c) => c.type === 'FOOTER')?.text || '';

	// Compute final template text reactively
	const previewText = useMemo(() => {
		let result = templateBody;

		// Replace {{1}} with example value
		result = result.replace(/\{\{1\}\}/g, '[Client Name]');

		// Append footer if exists
		if (templateFooter) {
			result += `\n\n${templateFooter}`;
		}

		return result;
	}, [templateBody, templateFooter]);

	const validLeadsList = useMemo(() => {
		return selectedLeads
			.map((lead) => {
				const whatsappNumber =
					typeof lead.leadWhatsappNumber === 'object'
						? lead.leadWhatsappNumber?.result
						: lead.leadWhatsappNumber;

				return {
					id: lead.lead_id || lead.id,
					name: lead.leadName || '',
					whatsapp: whatsappNumber,
				};
			})
			.filter((lead) => validatePhoneNumber(lead.whatsapp));
	}, [selectedLeads]);

	const handleSend = async () => {
		try {
			if (!user?.whatsappDetails?.phoneNumber) {
				return toast.error('User Whatsapp number is required!');
			}

			const body = {
				type: 'template',
				from: user?.whatsappDetails?.phoneNumber,
				phoneList: validLeadsList,
				body: previewText,
				templateName: selectedTemplate.name,
				languageCode: selectedTemplate.language,
			};

			const res = await sendBulkMessage({
				path: '/whatsapp/bulk/messages',
				body,
			}).unwrap();

			setMessageSummary(res?.summary);
			setSummaryModal(true);
		} catch (err) {
			console.error('Error sending bulk message:', err);
			toast.error(err?.data?.message || 'Failed to sending Message.');
			// optionally show a toast or error UI here
		}
	};

	const closeSummary = () => {
		setSummaryModal(false);
		onSuccess();
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} size='3xl' isCentered>
				<ModalOverlay backdropFilter='blur(2px)' />
				<ModalContent borderRadius='xl' boxShadow='xl' m={2}>
					<ModalHeader
						bg='green.50'
						borderTopRadius='xl'
						py={3}
						fontSize='lg'
						fontWeight='bold'
						color='green.700'
					>
						Bulk WhatsApp Message
					</ModalHeader>
					<ModalCloseButton isDisabled={isSending} />

					<ModalBody py={4}>
						{isTemplatesLoading ? (
							<Loader />
						) : isError ? (
							<Text color='red.500'>
								Failed to load templates. Please try again.
							</Text>
						) : (
							<>
								{/* Status Summary */}
								<Box mb={4}>
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
											✅ Valid: {validLeadsList.length}
										</Badge>
										<Badge
											colorScheme='red'
											fontSize='sm'
											px={3}
											py={1}
											borderRadius='md'
										>
											❌ Invalid: {selectedLeads.length - validLeadsList.length}
										</Badge>
									</Flex>
								</Box>

								<SimpleGrid
									columns={1}
									spacing={1}
									maxHeight='50vh'
									overflowY='auto'
									scrollBehavior='smooth'
									p='2'
								>
									{filteredTemplates?.map((template) => (
										<Box
											key={template.id}
											cursor='pointer'
											p={3}
											mb={3}
											borderRadius='lg'
											borderWidth='1px'
											borderColor={
												selectedTemplate?.id === template.id
													? 'green.300'
													: 'gray.100'
											}
											bg={
												selectedTemplate?.id === template.id
													? 'green.50'
													: 'gray.100'
											}
											_hover={{ borderColor: 'green.200' }}
											transition='all 0.2s ease'
											onClick={() => setSelectedTemplate(template)}
											position='relative'
											pl={10}
										>
											<Flex
												position='absolute'
												left={3}
												top='50%'
												transform='translateY(-50%)'
												w={5}
												h={5}
												borderWidth='2px'
												borderColor={
													selectedTemplate?.id === template.id
														? 'green.400'
														: 'gray.300'
												}
												borderRadius='full'
												align='center'
												justify='center'
											>
												{selectedTemplate?.id === template.id && (
													<Box w={3} h={3} bg='green.400' borderRadius='full' />
												)}
											</Flex>

											<Flex justify='space-between' align='center'>
												<Text
													fontWeight='medium'
													fontSize={{ base: 'sm', md: 'md' }}
													color='gray.700'
												>
													{template.name}
												</Text>
											</Flex>
										</Box>
									))}
								</SimpleGrid>

								{/* Preview Panel */}
								<Box flex='1' minW='300px'>
									<Text fontSize='sm' color='gray.500' mb={2}>
										Template Preview
									</Text>

									{selectedTemplate ? (
										<>
											<Box
												p={4}
												mb='4'
												bg='gray.50'
												rounded='lg'
												borderWidth='1px'
												fontFamily='DM Sans, sans-serif'
												borderColor='gray.200'
												as='pre'
												whiteSpace='pre-wrap'
											>
												<Text fontSize='sm' whiteSpace='pre-line'>
													{previewText}
												</Text>
											</Box>
										</>
									) : (
										<Box
											p={4}
											bg='gray.50'
											rounded='lg'
											borderWidth='1px'
											borderColor='gray.200'
											minH='200px'
											display='flex'
											alignItems='center'
											justifyContent='center'
										>
											<Text color='gray.500'>Select a template to preview</Text>
										</Box>
									)}
								</Box>
							</>
						)}
					</ModalBody>

					<ModalFooter bg='gray.50' borderBottomRadius='xl' px={6} py={3}>
						<Button
							variant='ghost'
							onClick={onClose}
							isDisabled={isSending}
							mr={3}
						>
							Cancel
						</Button>
						<Button
							colorScheme='whatsapp'
							size='sm'
							onClick={handleSend}
							isLoading={isSending}
							isDisabled={!validLeadsList.length || isSending}
						>
							Send Message
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{summaryModal && (
				<BulkMessageSummary
					isOpen={summaryModal}
					onClose={closeSummary}
					summary={messageSummary}
				/>
			)}
		</>
	);
};

export default BulkWhatsappModal;
