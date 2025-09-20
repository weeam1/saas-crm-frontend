import { useForm } from 'react-hook-form';
import { buttonStyle } from 'utils/btn';
import { templatesLanguages } from '../../components/helpers';

import React, { useState, useEffect, useMemo } from 'react';
import {
	Box,
	Button,
	Input,
	Textarea,
	Select,
	FormLabel,
	Heading,
	Text,
	Flex,
	Stack,
	FormControl,
	FormErrorMessage,
	Alert,
	AlertIcon,
	Tag,
	TagLabel,
	TagCloseButton,
	Icon,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { MdCampaign } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useCreateItemMutation } from 'api/apiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import AppButton from 'components/shared/AppButton';
import { FaChevronLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const VARIABLE_LIMIT = 2;

const CharacterCounter = ({ current, max }) => {
	const percentage = (current / max) * 100;
	let color = 'gray.500';

	if (percentage > 80) color = 'yellow.500';
	if (percentage > 90) color = 'red.500';

	return (
		<Text fontSize='xs' color={color} textAlign='right'>
			{current}/{max}
		</Text>
	);
};

const TemplatePreview = ({ header, body, footer, variables }) => {
	// Replace variables with sample values in preview
	let previewBody = body;
	variables?.forEach((varObj, index) => {
		previewBody = previewBody.replace(
			new RegExp(`\\{\\{${index + 1}\\}\\}`, 'g'),
			varObj.example || `[Sample ${index + 1}]`
		);
	});

	return (
		<Box w={{ base: '100%', md: '400px' }} bg='#f0f2f5' borderRadius='lg' p={4}>
			<Box
				bg='#D9FDD3'
				borderRadius='lg'
				p={3}
				mb={2}
				maxW='90%'
				borderTopLeftRadius='none'
			>
				{header && (
					<Text fontWeight='bold' color='gray.800' fontSize='sm' mb={2}>
						{header}
					</Text>
				)}
				<Text color='gray.800' fontSize='sm' whiteSpace='pre-wrap' mb={2}>
					{previewBody || 'Your message template will appear here.'}
				</Text>
				{footer && (
					<Text fontSize='xs' color='gray.600' pt={2}>
						{footer}
					</Text>
				)}
				<Text fontSize='xs' color='gray.500' textAlign='right' mt={1}>
					10:30 AM
				</Text>
			</Box>
		</Box>
	);
};

const VariableInput = ({ index, register, removeVariable, exampleValue }) => {
	return (
		<Flex align='center' mb={2}>
			<Tag mr={2} p='2' colorScheme='brand' minWidth='100px'>
				<TagLabel>{`{{${index}}}`}</TagLabel>
				<TagCloseButton onClick={() => removeVariable(index)} />
			</Tag>
			<Input
				placeholder={`Example for {{${index}}}`}
				size='sm'
				{...register(`variables.${index}`, {
					required: 'Example is required',
				})}
				defaultValue={exampleValue}
				borderColor='gray.300'
				_hover={{ borderColor: 'gray.400' }}
				focusBorderColor='brand.500'
			/>
		</Flex>
	);
};

const CreateWhatsappTemplate = () => {
	const { businessId } = useParams();
	const navigate = useNavigate();

	const userTemplates = useSelector((state) => state.whatsapp.templates || []);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		getValues,
		formState: { errors },
	} = useForm({
		defaultValues: {
			components: [
				{ type: 'HEADER', format: 'TEXT', text: '' },
				{ type: 'BODY', text: 'Hello', example: { body_text: [[]] } },
				{ type: 'FOOTER', text: '' },
			],
		},
	});

	const watchedFields = watch();
	const [variables, setVariables] = useState([]);
	const [nextVarIndex, setNextVarIndex] = useState(1);

	// Extract variables from body content
	useEffect(() => {
		const matches = [
			...new Set(watchedFields.body?.match(/\{\{\d+\}\}/g) || []),
		];
		const currentVars = matches.map((v) => parseInt(v.match(/\d+/)[0]));
		setVariables(Array.from(new Set(currentVars)).sort((a, b) => a - b));
		setNextVarIndex(currentVars.length > 0 ? Math.max(...currentVars) + 1 : 1);
	}, [watchedFields.body]);

	const addVariable = () => {
		const currentBody = getValues('body') || '';
		const newBody = `${currentBody} {{${nextVarIndex}}}`;
		setValue('body', newBody);
		setNextVarIndex(nextVarIndex + 1);
	};

	const removeVariable = (index) => {
		const currentBody = getValues('body') || '';
		const newBody = currentBody.replace(
			new RegExp(`\\{\\{${index}\\}\\}`, 'g'),
			''
		);
		setValue('body', newBody);
	};

	// Format template name to lowercase with underscores
	const formatTemplateName = (name) => {
		if (!name) return '';
		return name
			.toLowerCase()
			.replace(/\s+/g, '_') // Replace spaces with underscores
			.replace(/[^a-z0-9_]/g, ''); // Remove any non-alphanumeric/underscore characters
	};

	const templateName = watch('templateName') || '';

	const formattedName = useMemo(
		() => formatTemplateName(templateName),
		[templateName]
	);

	//  Immediately update input value if formatting changes
	useEffect(() => {
		if (templateName !== formattedName) {
			setValue('templateName', formattedName, { shouldValidate: true });
		}
	}, [formattedName, templateName, setValue]);

	const isDuplicateTemplateName = (name) => {
		const formatted = formatTemplateName(name);
		return userTemplates.some((t) => formatTemplateName(t.name) === formatted);
	};

	const [createTemplate, { isLoading: isCreating }] = useCreateItemMutation();

	const onSubmit = async (data) => {
		try {
			const requestBody = {
				businessId,
				name: data.templateName,
				language: data.language,
				category: 'MARKETING',
				components: [
					data.header
						? { type: 'HEADER', format: 'TEXT', text: data.header }
						: null,
					{
						type: 'BODY',
						text: data.body,
						...(variables?.length > 0 && {
							example: {
								body_text: [
									variables.map((v) => data.variables?.[v] || `Sample ${v}`),
								],
							},
						}),
					},
					data.footer ? { type: 'FOOTER', text: data.footer } : null,
				].filter(Boolean),
			};

			await createTemplate({
				path: '/whatsapp/templates',
				body: requestBody,
			}).unwrap();

			toast.success('Template submitted for review');
			navigate(`/settings/whatsapp_manager/message_templates/${businessId}`);
		} catch (error) {
			console.error(error);
			toast.error(error?.data?.message || 'Failed to create template!');
		}
	};

	return (
		<>
			<AppButton
				leftIcon={<FaChevronLeft />}
				onClick={() =>
					navigate(`/whatsapp/settings/message_templates/${businessId}`)
				}
			>
				Back
			</AppButton>

			<Flex direction={{ base: 'column', lg: 'row' }} p={6} gap={8}>
				<Box flex={1} bg='white' p={6} borderRadius='lg' boxShadow='sm'>
					<Flex align='center' gap={4} mb={6}>
						<Box
							bg='brand.400'
							p={3}
							borderRadius='full'
							display='flex'
							alignItems='center'
							justifyContent='center'
						>
							<Icon as={MdCampaign} boxSize={8} color='white' />
						</Box>
						<Box>
							<Heading size='lg' color='gray.800'>
								Create WhatsApp Template
							</Heading>
							<Text fontSize='sm' color='gray.500' mt={1}>
								Marketing Template Setup
							</Text>
						</Box>
					</Flex>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Stack spacing={6}>
							<Flex direction={{ base: 'column', md: 'row' }} gap='8'>
								{/* Template Name */}
								<FormControl isInvalid={errors.templateName}>
									<FormLabel fontSize='sm' fontWeight='medium' color='gray.700'>
										Template Name
									</FormLabel>

									<Input
										placeholder='e.g. seasonal_promotion'
										// value={templateName}
										{...register('templateName', {
											required: 'Template name is required',
											maxLength: {
												value: 512,
												message: 'Template name cannot exceed 512 characters',
											},
											pattern: {
												value: /^[a-z0-9_]+$/,
												message:
													'Only lowercase letters, numbers and underscores allowed',
											},
											validate: (value) =>
												!isDuplicateTemplateName(value) ||
												'Template name already exists. Please choose another.',
										})}
										borderColor='gray.300'
										_hover={{ borderColor: 'gray.400' }}
										focusBorderColor='brand.500'
									/>
									<Flex justify='space-between'>
										<FormErrorMessage>
											{errors.templateName?.message}
										</FormErrorMessage>
										<Text fontSize='sm' color='gray.500'>
											{templateName.length}/512
										</Text>
									</Flex>
									<Text fontSize='xs' color='gray.500' mb={1}>
										Only lowercase letters, numbers and underscores allowed
									</Text>
								</FormControl>

								{/* Language */}
								<FormControl maxW={{ base: 'full', md: '250px' }}>
									<FormLabel fontSize='sm' fontWeight='medium' color='gray.700'>
										Language
									</FormLabel>
									<Select
										{...register('language')}
										defaultValue='en'
										borderColor='gray.300'
										_hover={{ borderColor: 'gray.400' }}
										focusBorderColor='brand.500'
									>
										{templatesLanguages?.map((lang) => (
											<option key={lang.value} value={lang.value}>
												{lang.label}
											</option>
										))}
									</Select>
								</FormControl>
							</Flex>

							{/* Category */}
							{/* <FormControl>
							<FormLabel fontSize='sm' fontWeight='medium' color='gray.700'>
								Category
							</FormLabel>
							<Select
								{...register('category')}
								defaultValue='MARKETING'
								borderColor='gray.300'
								_hover={{ borderColor: 'gray.400' }}
								focusBorderColor='brand.500'
							>
								<option value='MARKETING'>Marketing</option>
								<option value='UTILITY'>Utility</option>
								<option value='AUTHENTICATION'>Authentication</option>
							</Select>
						</FormControl> */}

							{/* Header */}
							<FormControl isInvalid={errors.header}>
								<FormLabel fontSize='sm' fontWeight='medium' color='gray.700'>
									Header (optional)
								</FormLabel>
								<Input
									placeholder='Enter header text'
									{...register('header', {
										maxLength: {
											value: 60,
											message: 'Header cannot exceed 60 characters',
										},
									})}
									borderColor='gray.300'
									_hover={{ borderColor: 'gray.400' }}
									focusBorderColor='brand.500'
								/>
								<Flex justify='space-between'>
									<FormErrorMessage>{errors.header?.message}</FormErrorMessage>
									<CharacterCounter
										current={watchedFields.header?.length || 0}
										max={60}
									/>
								</Flex>
							</FormControl>

							{/* Body */}
							<FormControl isInvalid={errors.body}>
								<FormLabel fontSize='sm' fontWeight='medium' color='gray.700'>
									Body
								</FormLabel>
								<Textarea
									placeholder='Enter your message content. Use {{1}}, {{2}} for variables'
									rows={6}
									{...register('body', {
										required: 'Body content is required',
										maxLength: {
											value: 1024,
											message: 'Body cannot exceed 1024 characters',
										},
									})}
									borderColor='gray.300'
									_hover={{ borderColor: 'gray.400' }}
									focusBorderColor='brand.500'
									resize='vertical'
								/>
								<Flex justify='space-between'>
									<FormErrorMessage>{errors.body?.message}</FormErrorMessage>
									<CharacterCounter
										current={watchedFields.body?.length || 0}
										max={1024}
									/>
								</Flex>

								{variables.length < VARIABLE_LIMIT && (
									<Button
										leftIcon={<AddIcon />}
										size='sm'
										mt={2}
										onClick={addVariable}
										variant='outline'
									>
										Add Variable
									</Button>
								)}
							</FormControl>

							{/* Variable Examples */}
							{variables.length > 0 && (
								<Box>
									<Text fontWeight='medium' mb={2} fontSize='sm'>
										Variable Examples
									</Text>
									<Box bg='gray.50' p={3} borderRadius='md'>
										{variables.map((varIndex) => (
											<VariableInput
												key={varIndex}
												index={varIndex}
												register={register}
												removeVariable={removeVariable}
											/>
										))}
									</Box>
									{variables.length >= VARIABLE_LIMIT && (
										<Alert status='info' mt={2} fontSize='sm'>
											<AlertIcon />
											Maximum {VARIABLE_LIMIT} variables allowed
										</Alert>
									)}
								</Box>
							)}

							{/* Footer */}
							<FormControl isInvalid={errors.footer}>
								<FormLabel fontSize='sm' fontWeight='medium' color='gray.700'>
									Footer (optional)
								</FormLabel>
								<Input
									placeholder='Enter footer text'
									{...register('footer', {
										maxLength: {
											value: 60,
											message: 'Footer cannot exceed 60 characters',
										},
									})}
									borderColor='gray.300'
									_hover={{ borderColor: 'gray.400' }}
									focusBorderColor='brand.500'
								/>
								<Flex justify='space-between'>
									<FormErrorMessage>{errors.footer?.message}</FormErrorMessage>
									<CharacterCounter
										current={watchedFields.footer?.length || 0}
										max={60}
									/>
								</Flex>
							</FormControl>

							<Button
								{...buttonStyle}
								type='submit'
								alignSelf={'flex-end'}
								colorScheme='brand'
								maxWidth='fit-content'
								px='10'
								fontSize='lg'
								py='5'
								mt={4}
								isDisabled={isCreating}
								isLoading={isCreating}
							>
								Submit for review
							</Button>
						</Stack>
					</form>
				</Box>

				<Box flexShrink={0} w={{ base: '100%', md: '400px' }}>
					<Heading size='md' mb={4} color='gray.800'>
						Preview
					</Heading>
					<TemplatePreview
						header={watchedFields.header}
						body={watchedFields.body}
						footer={watchedFields.footer}
						variables={variables.map((v) => ({
							index: v,
							example: watchedFields.variables?.[v] || `Sample ${v}`,
						}))}
					/>

					<Box
						mt={6}
						p={4}
						bg='brand.50'
						borderRadius='md'
						border='1px solid'
						borderColor='brand.100'
					>
						<Heading size='sm' mb={2} color='gray.700'>
							Best Practices
						</Heading>
						<Text fontSize='sm' color='gray.600' mb={2}>
							• Use clear, concise language
						</Text>
						{/* <Text fontSize='sm' color='gray.600' mb={2}>
           `• Place variables strategically (e.g., {{1}} for names, {{2}} for dates)`
          </Text> */}
						<Text fontSize='sm' color='gray.600'>
							• Keep marketing templates under 2 variables
						</Text>
					</Box>
				</Box>
			</Flex>
		</>
	);
};

export default CreateWhatsappTemplate;
