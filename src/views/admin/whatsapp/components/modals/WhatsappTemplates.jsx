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
	Heading,
	Flex,
	Input,
	Icon,
	Badge,
	Divider,
	SimpleGrid,
	Spinner,
} from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useEffect, useMemo, useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';

const WhatsappTemplates = ({
	isOpen,
	onClose,
	onSend,
	businessId,
	isLoading,
}) => {
	const [selectedTemplate, setSelectedTemplate] = useState(null);
	const [placeholderValues, setPlaceholderValues] = useState({});
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	const {
		data: templates = [],
		isLoading: isTemplatesLoading,
		isError,
	} = useFetchItemsQuery(
		{
			path: `/whatsapp/templates`,
			params: { businessId },
		},
		{
			skip: !businessId,
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
	}, [templateBody, templateHeader, templateFooter, placeholderValues]);

	// const hasPlaceholders = useMemo(() => {
	// 	const body = selectedTemplate?.components?.find(
	// 		(c) => c.type === 'BODY'
	// 	)?.text;

	// 	console.log({ body });
	// 	return body ? /\{\{\d+\}\}/.test(body) : false;
	// }, [selectedTemplate]);

	const extractPlaceholders = useMemo(() => {
		const body = selectedTemplate?.components?.find(
			(c) => c.type === 'BODY'
		)?.text;

		const matches = body?.match(/{{(\d+)}}/g);
		const unique = [...new Set(matches?.map((m) => m.match(/\d+/)?.[0]))];
		return unique || [];
	}, [selectedTemplate]);

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

	const handleSendTemplate = () => {
		let placeholderArray = [];
		if (extractPlaceholders?.length > 0) {
			const isValid = validatePlaceholders();
			if (!isValid) return;

			placeholderArray = Object.keys(placeholderValues)
				.sort((a, b) => Number(a) - Number(b))
				.map((key) => placeholderValues[key]?.trim() || '');
		}

		onSend({
			message: previewText,
			templateName: selectedTemplate.name,
			placeholders: placeholderArray,
			languageCode: selectedTemplate.language,
			type: 'template',
		});
	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size='6xl'
				isCentered
				motionPreset='slideInBottom'
				closeOnOverlayClick={false}
			>
				<ModalOverlay bg='blackAlpha.600' backdropFilter='blur(4px)' />
				<ModalContent
					rounded='2xl'
					overflow='hidden'
					borderWidth='1px'
					borderColor='gray.100'
				>
					<ModalHeader bg='green.500' color='white' py={4}>
						<Flex align='center'>
							<Icon as={FiMessageSquare} mr={2} />
							<Heading size='md'>WhatsApp Templates</Heading>
						</Flex>
					</ModalHeader>
					<ModalCloseButton
						disabled={isLoading}
						color='white'
						_hover={{ bg: 'green.600' }}
						_focus={{ outline: 'none' }}
					/>

					<ModalBody p={6}>
						{isTemplatesLoading ? (
							<Flex justify='center' align='center' minH='200px'>
								<Spinner size='xl' color='green.500' />
							</Flex>
						) : isError ? (
							<Text color='red.500'>
								Failed to load templates. Please try again.
							</Text>
						) : (
							<Flex direction={{ base: 'column', lg: 'row' }} gap={4}>
								{/* Template Selection Panel */}
								<Box width='500px'>
									<Text fontSize='sm' color='gray.500' mb={2}>
										Available Templates ({filteredTemplates.length})
									</Text>

									<SimpleGrid
										columns={1}
										spacing={1}
										maxHeight='50vh'
										overflowY='auto'
										scrollBehavior='smooth'
										p='2'
									>
										{filteredTemplates?.map((template) => (
											// <Box
											// 	key={template.id}
											// 	cursor='pointer'
											// 	p={2}
											// 	mb={3}
											// 	borderRadius='lg'
											// 	borderWidth='1px'
											// 	borderColor={
											// 		selectedTemplate?.id === template.id
											// 			? 'green.300'
											// 			: 'gray.200'
											// 	}
											// 	bg={
											// 		selectedTemplate?.id === template.id
											// 			? 'green.50'
											// 			: 'white'
											// 	}
											// 	_hover={{ borderColor: 'green.300', bg: 'green.50' }}
											// 	transition='all 0.2s'
											// 	onClick={() => setSelectedTemplate(template)}
											// >
											// 	<Flex justify='space-between' align='center' mb={2}>
											// 		<Text
											// 			fontWeight='bold'
											// 			fontSize={{ base: 'xs', md: 'sm' }}
											// 		>
											// 			{template.name}
											// 		</Text>
											// 		<Badge
											// 			colorScheme={
											// 				template.status === 'APPROVED'
											// 					? 'green'
											// 					: 'orange'
											// 			}
											// 			fontSize='xs'
											// 		>
											// 			{template.status}
											// 		</Badge>
											// 	</Flex>
											// </Box>
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
												pl={10} // Add padding for the radio circle
											>
												{/* Custom radio circle */}
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
													{/* <Badge
															colorScheme={
																template.status === 'APPROVED'
																	? 'green'
																	: 'orange'
															}
															fontSize='10px'
															px={1.5}
															py={0.5}
															borderRadius='md'
															variant='subtle'
														>
															{template.status}
														</Badge> */}
												</Flex>
											</Box>
										))}
									</SimpleGrid>
								</Box>

								<Box
									maxHeight='50vh'
									p='1'
									overflowY='auto'
									flex='1'
									scrollBehavior='smooth'
								>
									{/* Name Input Field */}
									{/* {selectedTemplate && hasPlaceholders && (
										<Box mb={3}>
											<Text fontSize='sm' fontWeight='medium' mb={1}>
												Name
											</Text>
											<Input
												placeholder='Enter name e.g: Weeam'
												size='sm'
												bg='white'
												value={placeholderValues['1'] || ''}
												onChange={(e) =>
													setPlaceholderValues({
														...placeholderValues,
														1: e.target.value,
													})
												}
											/>
										</Box>
									)} */}

									{selectedTemplate &&
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
										))}

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
													{/* {templateFooter && (
														<Text fontSize='xs' color='gray.500' mt={2}>
															{templateFooter}
														</Text>
													)} */}
												</Box>

												<Box p={3} bg='gray.50' rounded='lg'>
													<Text fontSize='sm' fontWeight='medium' mb={1}>
														Template Details
													</Text>
													<Text fontSize='sm'>
														Language: {selectedTemplate.language}
													</Text>
													<Text fontSize='sm'>
														Status:
														<Badge
															colorScheme={
																selectedTemplate.status === 'APPROVED'
																	? 'green'
																	: 'orange'
															}
															fontSize='x-small'
														>
															{selectedTemplate.status}
														</Badge>
													</Text>
													<Text fontSize='sm'>
														Category: {selectedTemplate.category}
													</Text>
													{/* <Text fontSize='sm'>
													Sub-category: {selectedTemplate.sub_category}
												</Text> */}
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
												<Text color='gray.500'>
													Select a template to preview
												</Text>
											</Box>
										)}
									</Box>
								</Box>
							</Flex>
						)}
					</ModalBody>

					<Divider />

					<ModalFooter bg='gray.50' py={3}>
						<Flex justify='space-between' w='full'>
							<Button
								variant='ghost'
								colorScheme='gray'
								onClick={onClose}
								disabled={isLoading}
							>
								Close
							</Button>
							{selectedTemplate && (
								<Button
									colorScheme='green'
									onClick={handleSendTemplate}
									isLoading={isLoading}
									isDisabled={isLoading}
								>
									Send Template
								</Button>
							)}
						</Flex>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default WhatsappTemplates;
