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
	Input,
	Select,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';

import { useState, useMemo, useEffect } from 'react';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import { useCreateItemMutation } from 'api/apiSlice';
import BulkMessageSummary from './BulkMessageSummary';
import useUserSession from 'hooks/useUserSession';
import { normalizePhone } from 'utils/phoneValidation';
import { useSelector } from 'react-redux';
// import { useUserActivityLog } from 'hooks/useUserActivityLog';

const BulkWhatsappModal = ({
	isOpen,
	onClose,
	onSuccess,
	selectedLeads = [],
	whatsappAccountId,
}) => {
	const [selectedTemplate, setSelectedTemplate] = useState(null);
	const [messageSummary, setMessageSummary] = useState(null);
	const [placeholderValues, setPlaceholderValues] = useState({});
	const [placeholderModes, setPlaceholderModes] = useState({});

	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	const { user } = useUserSession();
	// const { createUserLog } = useUserActivityLog();

	const [summaryModal, setSummaryModal] = useState(false);

	const [sendBulkMessage, { isLoading: isSending }] = useCreateItemMutation();

	const {
		data: templates = [],
		isLoading: isTemplatesLoading,
		isError,
	} = useFetchItemsQuery(
		{
			path: `/whatsapp/templates`,
			params: { userId: user._id },
		},
		{
			skip: !user?._id,
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
	const templateHeader =
		selectedTemplate?.components?.find((c) => c.type === 'HEADER')?.text || '';
	const templateBody =
		selectedTemplate?.components?.find((c) => c.type === 'BODY')?.text || '';
	const templateFooter =
		selectedTemplate?.components?.find((c) => c.type === 'FOOTER')?.text || '';

	// Compute final template text reactively
	const previewText = useMemo(() => {
		let result = templateBody;

		Object.entries(placeholderValues).forEach(([key, value]) => {
			result = result.replace(
				new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
				value || `{{${key}}}`
			);
		});

		const finalBody =
			(templateHeader ? `${templateHeader}\n\n` : '') +
			result +
			(templateFooter ? `\n\n${templateFooter}` : '');

		return finalBody;
	}, [templateBody, placeholderValues, templateHeader, templateFooter]);

	const extractPlaceholders = useMemo(() => {
		const body = selectedTemplate?.components?.find(
			(c) => c.type === 'BODY'
		)?.text;

		const matches = body?.match(/{{(\d+)}}/g);
		const unique = [...new Set(matches?.map((m) => m.match(/\d+/)?.[0]))];

		setPlaceholderValues({});
		setPlaceholderModes({});
		return unique || [];
	}, [selectedTemplate]);

	// const validatePlaceholders = () => {
	// 	const newErrors = {};
	// 	const updatedValues = { ...placeholderValues };

	// 	extractPlaceholders?.forEach((key) => {
	// 		const mode = placeholderModes[key] || 'custom';

	// 		if (mode === 'client') {
	// 			updatedValues[key] = 'client_name'; // auto-fill client name placeholder
	// 		}

	// 		if (!updatedValues[key]?.trim()) {
	// 			newErrors[key] = 'This field is required';
	// 		}
	// 	});

	// 	setErrors(newErrors);
	// 	setPlaceholderValues(updatedValues);

	// 	return updatedValues;
	// };

	const validatePlaceholders = () => {
		const newErrors = {};
		extractPlaceholders?.forEach((key) => {
			if (!placeholderValues[key]?.trim()) {
				newErrors[key] = 'This field is required';
			}
		});
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validLeadsList = useMemo(() => {
		return selectedLeads
			.map((lead) => {
				const whatsappNumber =
					typeof lead.leadWhatsappNumber === 'object'
						? lead.leadWhatsappNumber?.result
						: lead.leadWhatsappNumber;

				// const { country } = extractLocationData(lead?.ip, countries);
				const whatsapp = normalizePhone(whatsappNumber);
				// lead?.country || 'United Arab Emirates'

				return {
					id: lead.lead_id || lead.id,
					name: lead.leadName || '',
					whatsapp,
					// country,
				};
			})
			.filter((lead) => lead?.whatsapp);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedLeads]);

	console.log({ validLeadsList });

	const handleSend = async () => {
		try {
			if (!templates?.whatsappDetails?.phoneNumber) {
				return toast.error('User Whatsapp number is required!');
			}

			let placeholderArray = [];

			if (extractPlaceholders?.length > 0) {
				const isValid = validatePlaceholders();
				if (!isValid) return;

				placeholderArray = Object.keys(placeholderValues)
					.sort((a, b) => Number(a) - Number(b))
					.map((key) => placeholderValues[key]?.trim() || '');
			}

			const body = {
				type: 'template',
				from: templates?.whatsappDetails?.phoneNumber,
				phoneList: validLeadsList,
				body: previewText,
				templateName: selectedTemplate.name,
				languageCode: selectedTemplate.language,
				placeholders: placeholderArray,
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
		}
	};

	const closeSummary = () => {
		setSummaryModal(false);
		onSuccess();
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} size='6xl' isCentered>
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

					<ModalBody
						py={4}
						maxHeight={{ base: '50vh', md: '60vh', lg: '70vh' }}
						overflowY='auto'
						scrollBehavior='smooth'
					>
						{isTemplatesLoading ? (
							<Loader />
						) : isError ? (
							<Text color='red.500'>
								Failed to load templates. Please try again.
							</Text>
						) : (
							<>
								{/* Status Summary */}
								<Box mb={6}>
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

								<Box>
									<Text fontSize='md' mb='2' fontWeight='bold'>
										Select a template
									</Text>

									<SimpleGrid
										columns={1}
										spacing={1}
										maxHeight={{ base: '20vh', md: '30vh', lg: '40vh' }}
										overflowY='auto'
										scrollBehavior='smooth'
										bg='softGray.100'
										rounded='md'
										p='4'
										mb='4'
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
														<Box
															w={3}
															h={3}
															bg='green.400'
															borderRadius='full'
														/>
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
								</Box>

								{/* Preview Panel */}
								<Box flex='1'>
									{/* {selectedTemplate &&
										extractPlaceholders?.length > 0 &&
										extractPlaceholders?.map((key) => (
											<Box key={key} mb={3}>
												<Text fontSize='sm' fontWeight='medium' mb={1}>
													Placeholder {key}
												</Text>
												<Input
													placeholder={`Enter value for {{${key}}}`}
													size='sm'
													bg='white'
													required
													borderColor={errors[key] ? 'red.500' : 'gray.300'}
													_hover={{
														borderColor: errors[key] ? 'red.600' : 'gray.400',
													}}
													focusBorderColor={
														errors[key] ? 'red.500' : 'brand.500'
													}
													value={placeholderValues[key] || ''}
													onChange={(e) => {
														setPlaceholderValues({
															...placeholderValues,
															[key]: e.target.value,
														});
														if (touched[key]) {
															setErrors((prev) => ({ ...prev, [key]: '' }));
														}
													}}
													onBlur={() => setTouched({ ...touched, [key]: true })}
												/>
												{errors[key] && (
													<Text color='red.500' fontSize='xs' mt={1}>
														{errors[key]}
													</Text>
												)}
											</Box>
										))} */}

									{selectedTemplate &&
										extractPlaceholders?.length > 0 &&
										extractPlaceholders.map((key) => {
											const isClientSelected = Object.entries(
												placeholderModes
											).some(([k, v]) => v === 'client' && k !== key);
											const mode = placeholderModes[key] || 'custom';

											return (
												<Box key={key} mb={4}>
													<Text fontSize='sm' fontWeight='medium' mb={1}>
														Field for <b>{key}</b>
													</Text>

													<Flex gap={2}>
														<Select
															size='sm'
															bg='white'
															width='40%'
															value={mode}
															borderColor={'gray.300'}
															_hover={{
																borderColor: 'gray.400',
															}}
															focusBorderColor={'brand.500'}
															onChange={(e) => {
																const value = e.target.value;
																setPlaceholderModes((prev) => ({
																	...prev,
																	[key]: value,
																}));

																// Clear value if switching back to custom
																if (value === 'custom') {
																	setPlaceholderValues((prev) => ({
																		...prev,
																		[key]: '',
																	}));
																} else
																	setPlaceholderValues((prev) => ({
																		...prev,
																		[key]: 'client_name',
																	}));
															}}
															isDisabled={mode !== 'client' && isClientSelected}
														>
															<option value='custom'>Custom</option>
															<option value='client'>Client Name</option>
														</Select>

														<Input
															placeholder={
																mode === 'client'
																	? 'Client Name (auto-filled)'
																	: `Enter value for {{${key}}}`
															}
															size='sm'
															bg='white'
															isDisabled={mode === 'client'}
															borderColor={errors[key] ? 'red.500' : 'gray.300'}
															_hover={{
																borderColor: errors[key]
																	? 'red.600'
																	: 'gray.400',
															}}
															focusBorderColor={
																errors[key] ? 'red.500' : 'brand.500'
															}
															value={placeholderValues[key] || ''}
															onChange={(e) =>
																setPlaceholderValues((prev) => ({
																	...prev,
																	[key]: e.target.value,
																}))
															}
															onBlur={() =>
																setTouched({ ...touched, [key]: true })
															}
														/>
													</Flex>

													{errors[key] && (
														<Text color='red.500' fontSize='xs' mt={1}>
															{errors[key]}
														</Text>
													)}
												</Box>
											);
										})}

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
