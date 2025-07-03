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
import { useCallback, useMemo, useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';

const WhatsappTemplates = ({ isOpen, onClose, onSend, accountId }) => {
	const [selectedTemplate, setSelectedTemplate] = useState(null);
	const [placeholderValues, setPlaceholderValues] = useState({});

	const {
		data: templates = [],
		isLoading,
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

	// console.log({ previewText, placeholderValues });

	const handleSendTemplate = () => {
		onSend({
			message: previewText,
			templateName: selectedTemplate.name,
			palceholder: placeholderValues[1],
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
						color='white'
						_hover={{ bg: 'green.600' }}
						_focus={{ outline: 'none' }}
					/>

					<ModalBody p={6}>
						{isLoading ? (
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
										Available Templates ({templates.results})
									</Text>

									<SimpleGrid
										columns={1}
										spacing={3}
										maxHeight='50vh'
										overflowY='auto'
										scrollBehavior='smooth'
										p='2'
									>
										{templates?.doc?.map((template) => (
											<Box
												key={template.id}
												cursor='pointer'
												p={2}
												mb={3}
												borderRadius='lg'
												borderWidth='1px'
												borderColor={
													selectedTemplate?.id === template.id
														? 'green.300'
														: 'gray.200'
												}
												bg={
													selectedTemplate?.id === template.id
														? 'green.50'
														: 'white'
												}
												_hover={{ borderColor: 'green.300', bg: 'green.50' }}
												transition='all 0.2s'
												onClick={() => setSelectedTemplate(template)}
											>
												<Flex justify='space-between' align='center' mb={2}>
													<Text
														fontWeight='bold'
														fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}
													>
														{template.name}
													</Text>
													<Badge
														colorScheme={
															template.status === 'APPROVED'
																? 'green'
																: 'orange'
														}
														fontSize='xs'
													>
														{template.status}
													</Badge>
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
													{/* <Text fontSize='sm'>
													Status:{' '}
													<Badge
														colorScheme={
															selectedTemplate.status === 'APPROVED'
																? 'green'
																: 'orange'
														}
													>
														{selectedTemplate.status}
													</Badge>
												</Text> */}
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
							<Button variant='ghost' colorScheme='gray' onClick={onClose}>
								Close
							</Button>
							{selectedTemplate && (
								<Button colorScheme='green' onClick={handleSendTemplate}>
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
