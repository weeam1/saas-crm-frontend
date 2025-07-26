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
	accountId,
	isLoading,
}) => {
	const [selectedTemplate, setSelectedTemplate] = useState(null);
	const [placeholderValues, setPlaceholderValues] = useState({});

	const {
		data: templates = [],
		isLoading: isTemplatesLoading,
		isError,
	} = useFetchItemsQuery(
		{
			path: `/whatsapp/templates`,
			params: { accountId },
		},
		{
			skip: !accountId,
			refetchOnMountOrArgChange: true,
		}
	);

	// useEffect(() => {
	// 	if (templates?.doc?.length > 0) {
	// 		setSelectedTemplate(templates.doc[0]);
	// 	}
	// }, [templates?.doc]);

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

		Object.entries(placeholderValues).forEach(([key, value]) => {
			result = result.replace(
				new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
				value || `{{${key}}}`
			);
		});

		return result + (templateFooter ? `\n\n${templateFooter}` : '');
	}, [templateBody, templateFooter, placeholderValues]);

	const hasPlaceholders = useMemo(() => {
		const body = selectedTemplate?.components?.find(
			(c) => c.type === 'BODY'
		)?.text;
		return body ? /\{\{\d+\}\}/.test(body) : false;
	}, [selectedTemplate]);

	const handleSendTemplate = () => {
		// if (!placeholderValues[1]) {
		// 	return toast.error('Please enter the name placeholder value.');
		// }

		onSend({
			message: previewText,
			templateName: selectedTemplate.name,
			palceholder: placeholderValues[1] || '',
			languageCode: selectedTemplate.language,
			type: 'template',
		});
	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size='5xl'
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
							<Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
								{/* Template Selection Panel */}
								<Box flex='1' minW='400px'>
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
									scrollBehavior='smooth'
								>
									{/* Name Input Field */}
									{selectedTemplate && hasPlaceholders && (
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
									)}

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
