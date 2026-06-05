import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import {
	Box,
	Heading,
	Text,
	Flex,
	Divider,
	Input,
	Select,
	Button,
	VStack,
	HStack,
	useRadioGroup,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Icon,
} from '@chakra-ui/react';
import RadioCard from './RadioCard';
import useFetchUserHierarchy from 'hooks/useFetchUserHierarchy';
import { IoArrowBack } from 'react-icons/io5';
import AppButton from 'components/shared/AppButton';
import { useCreateItemMutation } from 'api/apiSlice';
import CustomDatePicker from 'components/datetime/CustomDatePicker';
import Breadcrumb from '../../../components/shared/BreadCrumb';
import { toast } from 'react-toastify';
import { getApi } from 'services/api';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import { usePermissions } from 'hooks/usePermissions';
import { SquareActivityIcon } from 'lucide-react';

const inputStyles = {
	fontSize: 'sm',
	bg: '#EAEAEA',
	color: '#6B6B6B',
	border: '1px solid #B9B9B9',
	_placeholder: { color: '#6B6B6B' },
	focusBorderColor: 'brand.500',
	BorderRadius: 'md',
};

const CreateSurvey = () => {
	const navigate = useNavigate();
	const { hasPermission } = usePermissions();
	const [createItemMutation] = useCreateItemMutation();
	const user = JSON.parse(localStorage.getItem('user'));
	const {
		allUsers = [],
		managers = [],
		agents = [],
	} = useFetchUserHierarchy(user);

	useEffect(() => {
		if (!hasPermission('survey', 'create')) return navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Add openCalendar state and toggleCalendar function
	const [openCalendar, setOpenCalendar] = useState(null);
	const toggleCalendar = (calendar) => {
		setOpenCalendar((prev) => (prev === calendar ? null : calendar));
	};

	const { createUserLog } = useUserActivityLog();

	const formik = useFormik({
		initialValues: {
			title: '',
			closesAt: '',
			questions: [
				{
					text: '',
					type: 'text',
					options: [],
				},
			],
			invitedUsers: [],
			selectedRole: '',
			selectedManager: null,
		},
		onSubmit: async (values, { resetForm }) => {
			try {
				// Prepare invitedUsers based on selection
				let invitedUsers = [];
				if (values.selectedRole === 'all') {
					invitedUsers = allUsers
						.filter((u) => u._id !== user._id || user.role !== 'superAdmin')
						.map((user) => user._id);
				} else if (values.selectedRole === 'managers') {
					invitedUsers = managers.map((manager) => manager._id);
				} else if (values.selectedRole === 'agents') {
					invitedUsers = agents.map((agent) => agent._id);
				} else if (values.selectedRole === 'team' && values.selectedManager) {
					invitedUsers = formik.values.invitedUsers;
				}

				const payload = {
					title: values.title,
					questions: values.questions.map((q) => {
						if (q.type === 'text') {
							return { text: q.text, type: q.type };
						} else {
							return {
								text: q.text,
								type: q.type,
								options: q.options.map((opt) => ({ text: opt.text })),
							};
						}
					}),
					closesAt: new Date(values.closesAt).toISOString(),
					invitedUsers,
				};

				const addQuestion = () => {
					formik.setFieldValue('questions', [
						...formik.values.questions,
						{
							text: '',
							type: 'text',
							options: [],
						},
					]);
				};

				const response = await createItemMutation({
					path: '/surveys',
					body: payload,
				}).unwrap();
				toast.success('Survey created successfully!');
				resetForm();
				navigate('/survey/all-surveys');
				createUserLog({
					userId: user?._id,
					action: 'CREATE',
					entity: 'Survey',
					entityType: 'Survey',
					entityId: response._id,
					status: 'success',
					message: `"${user?.fullName}" created survey "${response?.doc?.title || 'Untitled'}".`,
				});
			} catch (error) {
				const errorMsg =
					error?.data?.message ||
					error?.message ||
					'Failed to create survey. Please try again.';
				console.error('Failed to create survey:', errorMsg);
				toast.error(errorMsg);
				createUserLog({
					userId: user?._id,
					action: 'CREATE',
					entity: 'Survey',
					entityType: 'Survey',
					status: error?.status === '500' ? 'error' : 'fail',
					message: errorMsg,
				});
			}
		},
	});

	const addQuestion = () => {
		formik.setFieldValue('questions', [
			...formik.values.questions,
			{
				text: '',
				type: 'text',
				options: [],
			},
		]);
	};

	const removeQuestion = (index) => {
		if (formik.values.questions.length > 1) {
			const newQuestions = [...formik.values.questions];
			newQuestions.splice(index, 1);
			formik.setFieldValue('questions', newQuestions);
		}
	};

	const handleQuestionTypeChange = (index, type) => {
		const newQuestions = [...formik.values.questions];
		newQuestions[index].type = type;

		// Initialize options if switching to radio/checkbox
		if (
			(type === 'radio' || type === 'checkbox') &&
			newQuestions[index].options.length === 0
		) {
			newQuestions[index].options = [{ text: '' }, { text: '' }];
		}

		formik.setFieldValue('questions', newQuestions);
	};

	const addOption = (questionIndex) => {
		const newQuestions = [...formik.values.questions];
		newQuestions[questionIndex].options.push({ text: '' });
		formik.setFieldValue('questions', newQuestions);
	};

	const removeOption = (questionIndex, optionIndex) => {
		const newQuestions = [...formik.values.questions];
		newQuestions[questionIndex].options.splice(optionIndex, 1);
		formik.setFieldValue('questions', newQuestions);
	};

	const handleOptionChange = (questionIndex, optionIndex, value) => {
		const newQuestions = [...formik.values.questions];
		newQuestions[questionIndex].options[optionIndex].text = value;
		formik.setFieldValue('questions', newQuestions);
	};

	// Radio group setup for user selection
	const options = ['all', 'managers', 'agents', 'team'];
	const { getRootProps, getRadioProps } = useRadioGroup({
		name: 'roles',
		value: formik.values.selectedRole,
		onChange: (value) => formik.setFieldValue('selectedRole', value),
	});
	const group = getRootProps();
	const isFormIncomplete = () => {
		return (
			!formik.values.title ||
			!formik.values.closesAt ||
			!formik.values.selectedRole ||
			(formik.values.selectedRole === 'team' && !formik.values.selectedManager)
		);
	};

	const items = [
		{
			path: '/survey/records',
			label: 'Surveys',
		},
		{
			path: '/survey/create',
			label: 'Create Survey',
		},
	];

	const fetchManagerAgents = async (managerId) => {
		try {
			const apiUrl = `api/v2/user/hierarchy?managerId=${managerId}`;
			const { data } = await getApi(apiUrl);

			if (data.results > 0) {
				const managerAgentsList = data?.doc?.map((agent) => agent._id);
				formik.setFieldValue('invitedUsers', managerAgentsList);
			} else {
				formik.setFieldValue('invitedUsers', []);
			}
		} catch (error) {
			formik.setFieldValue('invitedUsers', []);
		}
	};
	const handleManagerChange = async (e) => {
		const managerId = e.target.value;
		formik.setFieldValue('selectedManager', managerId);
		formik.setFieldValue('selectedRole', 'team');
		await fetchManagerAgents(managerId);
	};
	return (
		// <Box p={{ base: 2, md: 2 }}>
		// 	{/* <Breadcrumb items={items} /> */}

		// 	{/* Back Button */}
		// 	{/* <AppButton
		// 		ml='2'
		// 		leftIcon={<IoArrowBack />}
		// 		onClick={() => navigate(-1)}
		// 		mb={4}
		// 	>
		// 		Back
		// 	</AppButton> */}

		// 	<form onSubmit={formik.handleSubmit}>
		// 		<Box bg='white' p={8} boxShadow='sm'>
		// 			<Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
		// 				<Box bg='white' flex='1'>
		// 					<VStack spacing={6} align='stretch'>
		// 						<VStack align='flex-start' mt={2}>
		// 							<Text fontWeight='bold' fontSize='sm'>
		// 								Survey Title
		// 							</Text>
		// 							<FormControl
		// 								isInvalid={formik.errors.title && formik.touched.title}
		// 							>
		// 								<Input
		// 									name='title'
		// 									value={formik.values.title}
		// 									placeholder='Survey name here'
		// 									onChange={formik.handleChange}
		// 									onBlur={formik.handleBlur}
		// 									size='sm'
		// 									{...inputStyles}
		// 								/>
		// 								<FormErrorMessage fontSize='xs'>
		// 									{formik.errors.title}
		// 								</FormErrorMessage>
		// 							</FormControl>
		// 						</VStack>

		// 						<VStack align='flex-start'>
		// 							<Text fontWeight='bold' fontSize='sm'>
		// 								Survey end date
		// 							</Text>
		// 							<FormControl
		// 								isInvalid={
		// 									formik.errors.closesAt && formik.touched.closesAt
		// 								}
		// 							>
		// 								<VStack width='100%' alignItems='flex-start'>
		// 									<CustomDatePicker
		// 										selectedDate={formik.values.closesAt}
		// 										handleDateChange={(date) =>
		// 											formik.setFieldValue('closesAt', date)
		// 										}
		// 										placeholder='Select end date'
		// 										minDate={(() => {
		// 											const tomorrow = new Date();
		// 											tomorrow.setDate(tomorrow.getDate() + 1);
		// 											tomorrow.setHours(0, 0, 0, 0);
		// 											return tomorrow;
		// 										})()}
		// 										isCalendarOpen={openCalendar === 'endDate'}
		// 										toggleCalendar={() => toggleCalendar('endDate')}
		// 										inputStyles={inputStyles}
		// 									/>
		// 								</VStack>
		// 								<FormErrorMessage fontSize='xs'>
		// 									{formik.errors.closesAt}
		// 								</FormErrorMessage>
		// 							</FormControl>
		// 						</VStack>

		// 						<VStack align='flex-start'>
		// 							<Text fontWeight='bold' fontSize='sm'>
		// 								Survey Users
		// 							</Text>
		// 							<FormControl isInvalid={formik.errors.selectedRole}>
		// 								<Flex
		// 									{...group}
		// 									alignItems={"center"}
		// 									mb={{ base: 2, md: 4 }}
		// 									wrap='wrap'
		// 									gap='2'
		// 								>
		// 									{options.map((value) => {
		// 										const radio = getRadioProps({ value });
		// 										return (
		// 											<RadioCard key={value} {...radio}>
		// 												{value === 'radio'
		// 													? 'Radio Button'
		// 													: value === 'checkbox'
		// 														? 'Check Box'
		// 														: value.charAt(0).toUpperCase() +
		// 														value.slice(1)}
		// 											</RadioCard>
		// 										);
		// 									})}
		// 								</Flex>
		// 								<FormErrorMessage fontSize='xs'>
		// 									{formik.errors.selectedRole}
		// 								</FormErrorMessage>
		// 							</FormControl>

		// 							<FormControl
		// 								isInvalid={
		// 									formik.errors.selectedManager &&
		// 									formik.touched.selectedManager
		// 								}
		// 								isDisabled={formik.values.selectedRole !== 'team'}
		// 							>
		// 								<Select
		// 									name='selectedManager'
		// 									placeholder='Select Team'
		// 									value={formik.values.selectedManager || ''}
		// 									onChange={handleManagerChange}
		// 									onBlur={formik.handleBlur}
		// 									size='sm'
		// 									{...inputStyles}
		// 									width={'50%'}
		// 									mt={1}
		// 									isDisabled={formik.values.selectedRole !== 'team'}
		// 								>
		// 									{managers.map((manager) => (
		// 										<option key={manager._id} value={manager._id}>
		// 											{manager.name}
		// 										</option>
		// 									))}
		// 								</Select>
		// 								<FormErrorMessage fontSize='xs'>
		// 									{formik.errors.selectedManager}
		// 								</FormErrorMessage>
		// 							</FormControl>
		// 						</VStack>
		// 					</VStack>
		// 				</Box>

		// 				<Box
		// 					display={{ base: 'none', lg: 'block' }}
		// 					width='1px'
		// 					bg='gray.200'
		// 					mx={4}
		// 				/>

		// 				<Box
		// 					bg='white'
		// 					p={3}
		// 					flex='1'
		// 					overflowY='auto'
		// 					maxH={{ base: 'auto', lg: 'calc(100vh - 200px)' }}
		// 				>
		// 					{formik.values.questions.map((question, index) => (
		// 						<React.Fragment key={index}>
		// 							{index > 0 && <Divider my={6} borderColor='gray.200' />}

		// 							<Flex align='center' mb={4} justify='flex-start'>
		// 								<Heading
		// 									as='h3'
		// 									size='md'
		// 									flex={1}
		// 									color='black'
		// 									fontSize='sm'
		// 								>
		// 									Question {index + 1}
		// 								</Heading>
		// 								{formik.values.questions.length > 1 && (
		// 									<Button
		// 										size='sm'
		// 										variant='ghost'
		// 										colorScheme='red'
		// 										onClick={() => removeQuestion(index)}
		// 										fontSize='sm'
		// 										ml={2}
		// 									>
		// 										Remove
		// 									</Button>
		// 								)}
		// 							</Flex>

		// 							<FormControl
		// 								mb={4}
		// 								isInvalid={
		// 									formik.errors.questions?.[index]?.text &&
		// 									formik.touched.questions?.[index]?.text
		// 								}
		// 							>
		// 								<FormLabel fontSize='sm'>Question Text</FormLabel>
		// 								<Input
		// 									name={`questions[${index}].text`}
		// 									value={question.text}
		// 									onChange={formik.handleChange}
		// 									onBlur={formik.handleBlur}
		// 									placeholder={`Enter question ${index + 1} text`}
		// 									size='sm'
		// 									fontSize='sm'
		// 									{...inputStyles}
		// 								/>
		// 								<FormErrorMessage fontSize='xs'>
		// 									{formik.errors.questions?.[index]?.text}
		// 								</FormErrorMessage>
		// 							</FormControl>

		// 							<FormControl mb={4}>
		// 								<FormLabel fontSize='sm'>Question Type</FormLabel>
		// 								<Select
		// 									value={question.type}
		// 									onChange={(e) =>
		// 										handleQuestionTypeChange(index, e.target.value)
		// 									}
		// 									focusBorderColor='brand.500'
		// 									size='sm'
		// 									fontSize='sm'
		// 									{...inputStyles}
		// 								>
		// 									<option value='text'>Text Box</option>
		// 									<option value='radio'>Radio Button</option>
		// 									<option value='checkbox'>Check Box</option>
		// 								</Select>
		// 							</FormControl>

		// 							{(question.type === 'radio' ||
		// 								question.type === 'checkbox') && (
		// 									<Box mb={4}>
		// 										<FormLabel fontSize='sm'>
		// 											{question.type === 'radio'
		// 												? 'Radio Button Options'
		// 												: 'Check Box Options'}
		// 										</FormLabel>
		// 										<VStack spacing={3} align='stretch'>
		// 											{question.options.map((option, optionIndex) => (
		// 												<HStack key={optionIndex}>
		// 													<FormControl
		// 														isInvalid={
		// 															formik.errors.questions?.[index]?.options?.[
		// 																optionIndex
		// 															]?.text &&
		// 															formik.touched.questions?.[index]?.options?.[
		// 																optionIndex
		// 															]?.text
		// 														}
		// 													>
		// 														<Input
		// 															value={option.text}
		// 															onChange={(e) =>
		// 																handleOptionChange(
		// 																	index,
		// 																	optionIndex,
		// 																	e.target.value
		// 																)
		// 															}
		// 															onBlur={formik.handleBlur}
		// 															placeholder={`Option ${optionIndex + 1}`}
		// 															size='sm'
		// 															fontSize='sm'
		// 															{...inputStyles}
		// 														/>
		// 														<FormErrorMessage fontSize='xs'>
		// 															{
		// 																formik.errors.questions?.[index]?.options?.[
		// 																	optionIndex
		// 																]?.text
		// 															}
		// 														</FormErrorMessage>
		// 													</FormControl>
		// 													{question.options.length > 2 && (
		// 														<Button
		// 															size='sm'
		// 															variant='ghost'
		// 															colorScheme='red'
		// 															onClick={() => removeOption(index, optionIndex)}
		// 															fontSize='sm'
		// 														>
		// 															Remove
		// 														</Button>
		// 													)}
		// 												</HStack>
		// 											))}
		// 											<Button
		// 												size='sm'
		// 												variant='outline'
		// 												colorScheme='brand'
		// 												onClick={() => addOption(index)}
		// 												fontSize='sm'
		// 											>
		// 												Add Option
		// 											</Button>
		// 											{formik.errors.questions?.[index]?.options && (
		// 												<Text color='red.500' fontSize='xs'>
		// 													{formik.errors.questions?.[index]?.options}
		// 												</Text>
		// 											)}
		// 										</VStack>
		// 									</Box>
		// 								)}
		// 						</React.Fragment>
		// 					))}

		// 					<Button
		// 						mt={6}
		// 						colorScheme='brand'
		// 						variant='outline'
		// 						onClick={addQuestion}
		// 						fontSize='sm'
		// 					>
		// 						Add Question
		// 					</Button>
		// 				</Box>
		// 			</Flex>

		// 			<Flex justify='flex-end' mt={8}>
		// 				<Button
		// 					bg={'#EDC270'}
		// 					color='#000000'
		// 					size='md'
		// 					px={8}
		// 					type='submit'
		// 					isLoading={formik.isSubmitting}
		// 					isDisabled={isFormIncomplete() || !formik.isValid}
		// 					fontSize='sm'
		// 					borderRadius={'8px'}
		// 					fontWeight='300'
		// 					_hover={{ bg: 'brand.400' }}
		// 				>
		// 					Create Survey
		// 				</Button>
		// 			</Flex>
		// 		</Box>
		// 	</form>
		// </Box>
		<Box p={{ base: 2, md: 2 }}>
			<AppButton
				leftIcon={<IoArrowBack />}
				onClick={() => navigate(-1)}
				mb={4}
				size='sm'
				variant='ghost'
			>
				Back
			</AppButton>
			<Box
				p={2}
			>

				<Heading
					size='xl'
					fontWeight='bold'
					color='text.heading'
					mb={4}
				>
					Create Survey
				</Heading>
				<Text
					color='text.subtle'
					fontSize='sm'
				>
					Create a new survey to collect feedback from your users.
				</Text>
			</Box>

			<form onSubmit={formik.handleSubmit}>
				<Box bg='bg.surface' p={8} borderRadius='xl' border='1px solid' borderColor='border.default' boxShadow='card'>
					<Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
						{/* Left Column */}
						<Box flex='1'>
							<VStack spacing={6} align='stretch'>
								{/* Survey Title */}
								<VStack align='flex-start'>
									<Text fontWeight='bold' fontSize='sm' color='text.heading'>
										Survey Title
									</Text>
									<FormControl isInvalid={formik.errors.title && formik.touched.title}>
										<Input
											name='title'
											value={formik.values.title}
											placeholder='Survey name here'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											size='sm'
											bg='bg.input'
											borderColor='border.default'
											color='text.body'
											_hover={{ borderColor: 'gold.dark' }}
											_focus={{
												borderColor: 'gold.primary',
												boxShadow: '0 0 0 1px #D4AF37',
											}}
											_placeholder={{ color: 'text.muted' }}
										/>
										<FormErrorMessage fontSize='xs'>{formik.errors.title}</FormErrorMessage>
									</FormControl>
								</VStack>

								{/* Survey End Date */}
								<VStack align='flex-start'>
									<Text fontWeight='bold' fontSize='sm' color='text.heading'>
										Survey end date
									</Text>
									<FormControl isInvalid={formik.errors.closesAt && formik.touched.closesAt}>
										<VStack width='100%' alignItems='flex-start'>
											<CustomDatePicker
												selectedDate={formik.values.closesAt}
												handleDateChange={(date) => formik.setFieldValue('closesAt', date)}
												placeholder='Select end date'
												minDate={(() => {
													const tomorrow = new Date();
													tomorrow.setDate(tomorrow.getDate() + 1);
													tomorrow.setHours(0, 0, 0, 0);
													return tomorrow;
												})()}
												isCalendarOpen={openCalendar === 'endDate'}
												toggleCalendar={() => toggleCalendar('endDate')}
												inputStyles={{
													bg: 'bg.input',
													borderColor: 'border.default',
													color: 'text.body',
													_hover: { borderColor: 'gold.dark' },
													_focus: {
														borderColor: 'gold.primary',
														boxShadow: '0 0 0 1px #D4AF37',
													},
													_placeholder: { color: 'text.muted' },
												}}
											/>
										</VStack>
										<FormErrorMessage fontSize='xs'>{formik.errors.closesAt}</FormErrorMessage>
									</FormControl>
								</VStack>

								{/* Survey Users (Role Selection) */}
								<VStack align='flex-start'>
									<Text fontWeight='bold' fontSize='sm' color='text.heading'>
										Survey Users
									</Text>
									<FormControl isInvalid={formik.errors.selectedRole}>
										<Flex alignItems='center' mb={{ base: 2, md: 4 }} wrap='wrap' gap='2'>
											{options.map((value) => {
												const radio = getRadioProps({ value });
												return (
													<RadioCard key={value} {...radio}>
														{value === 'radio'
															? 'Radio Button'
															: value === 'checkbox'
																? 'Check Box'
																: value.charAt(0).toUpperCase() + value.slice(1)}
													</RadioCard>
												);
											})}
										</Flex>
										<FormErrorMessage fontSize='xs'>{formik.errors.selectedRole}</FormErrorMessage>
									</FormControl>

									{/* Team Selection (only when 'team' is selected) */}
									<FormControl
										isInvalid={formik.errors.selectedManager && formik.touched.selectedManager}
										isDisabled={formik.values.selectedRole !== 'team'}
									>
										<Select
											name='selectedManager'
											placeholder='Select Team'
											value={formik.values.selectedManager || ''}
											onChange={handleManagerChange}
											onBlur={formik.handleBlur}
											size='sm'
											width='50%'
											mt={1}
											isDisabled={formik.values.selectedRole !== 'team'}
											bg='bg.input'
											borderColor='border.default'
											color='text.body'
											_hover={{ borderColor: 'gold.dark' }}
											_focus={{
												borderColor: 'gold.primary',
												boxShadow: '0 0 0 1px #D4AF37',
											}}
											_placeholder={{ color: 'text.muted' }}
										>
											{managers.map((manager) => (
												<option key={manager._id} value={manager._id}>
													{manager.name}
												</option>
											))}
										</Select>
										<FormErrorMessage fontSize='xs'>{formik.errors.selectedManager}</FormErrorMessage>
									</FormControl>
								</VStack>
							</VStack>
						</Box>

						{/* Vertical Divider (Desktop) */}
						<Box display={{ base: 'none', lg: 'block' }} width='1px' bg='border.default' mx={4} />

						{/* Right Column: Questions */}
						<Box
							flex='1'
							overflowY='auto'
							maxH={{ base: 'auto', lg: 'calc(100vh - 200px)' }}
						>
							{formik.values.questions.map((question, index) => (
								<React.Fragment key={index}>
									{index > 0 && <Divider my={6} borderColor='border.subtle' />}

									{/* Question Header */}
									<Flex align='center' mb={4} justify='flex-start'>
										<Heading as='h3' size='md' flex={1} color='text.heading' fontSize='sm'>
											Question {index + 1}
										</Heading>
										{formik.values.questions.length > 1 && (
											<Button
												size='sm'
												variant='ghost'
												color='red.400'
												onClick={() => removeQuestion(index)}
												fontSize='sm'
												_hover={{ bg: 'rgba(245, 101, 101, 0.1)', color: 'red.300' }}
											>
												Remove
											</Button>
										)}
									</Flex>

									{/* Question Text */}
									<FormControl
										mb={4}
										isInvalid={formik.errors.questions?.[index]?.text && formik.touched.questions?.[index]?.text}
									>
										<FormLabel fontSize='sm' color='text.body'>Question Text</FormLabel>
										<Input
											name={`questions[${index}].text`}
											value={question.text}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											placeholder={`Enter question ${index + 1} text`}
											size='sm'
											bg='bg.input'
											borderColor='border.default'
											color='text.body'
											_hover={{ borderColor: 'gold.dark' }}
											_focus={{
												borderColor: 'gold.primary',
												boxShadow: '0 0 0 1px #D4AF37',
											}}
											_placeholder={{ color: 'text.muted' }}
										/>
										<FormErrorMessage fontSize='xs'>
											{formik.errors.questions?.[index]?.text}
										</FormErrorMessage>
									</FormControl>

									{/* Question Type */}
									<FormControl mb={4}>
										<FormLabel fontSize='sm' color='text.body'>Question Type</FormLabel>
										<Select
											value={question.type}
											onChange={(e) => handleQuestionTypeChange(index, e.target.value)}
											size='sm'
											bg='bg.input'
											borderColor='border.default'
											color='text.body'
											_hover={{ borderColor: 'gold.dark' }}
											_focus={{
												borderColor: 'gold.primary',
												boxShadow: '0 0 0 1px #D4AF37',
											}}
										>
											<option value='text'>Text Box</option>
											<option value='radio'>Radio Button</option>
											<option value='checkbox'>Check Box</option>
										</Select>
									</FormControl>

									{/* Options for Radio/Checkbox */}
									{(question.type === 'radio' || question.type === 'checkbox') && (
										<Box mb={4}>
											<FormLabel fontSize='sm' color='text.body'>
												{question.type === 'radio' ? 'Radio Button Options' : 'Check Box Options'}
											</FormLabel>
											<VStack spacing={3} align='stretch'>
												{question.options.map((option, optionIndex) => (
													<HStack key={optionIndex}>
														<FormControl
															isInvalid={
																formik.errors.questions?.[index]?.options?.[optionIndex]?.text &&
																formik.touched.questions?.[index]?.options?.[optionIndex]?.text
															}
														>
															<Input
																value={option.text}
																onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
																onBlur={formik.handleBlur}
																placeholder={`Option ${optionIndex + 1}`}
																size='sm'
																bg='bg.input'
																borderColor='border.default'
																color='text.body'
																_hover={{ borderColor: 'gold.dark' }}
																_focus={{
																	borderColor: 'gold.primary',
																	boxShadow: '0 0 0 1px #D4AF37',
																}}
																_placeholder={{ color: 'text.muted' }}
															/>
															<FormErrorMessage fontSize='xs'>
																{formik.errors.questions?.[index]?.options?.[optionIndex]?.text}
															</FormErrorMessage>
														</FormControl>
														{question.options.length > 2 && (
															<Button
																size='sm'
																variant='ghost'
																color='red.400'
																onClick={() => removeOption(index, optionIndex)}
																fontSize='sm'
																_hover={{ bg: 'rgba(245, 101, 101, 0.1)', color: 'red.300' }}
															>
																Remove
															</Button>
														)}
													</HStack>
												))}
												<Button
													size='sm'
													variant='outline'
													onClick={() => addOption(index)}
													fontSize='sm'
													borderColor='border.default'
													color='text.body'
													_hover={{ bg: 'bg.elevated', borderColor: 'gold.primary', color: 'gold.primary' }}
												>
													Add Option
												</Button>
												{formik.errors.questions?.[index]?.options && (
													<Text color='red.400' fontSize='xs'>
														{formik.errors.questions?.[index]?.options}
													</Text>
												)}
											</VStack>
										</Box>
									)}
								</React.Fragment>
							))}

							<Button
								mt={6}
								variant='outline'
								onClick={addQuestion}
								fontSize='sm'
								borderColor='border.default'
								color='text.body'
								_hover={{ bg: 'bg.elevated', borderColor: 'gold.primary', color: 'gold.primary' }}
							>
								Add Question
							</Button>
						</Box>
					</Flex>

					{/* Submit Button */}
					<Flex justify='flex-end' mt={8}>
						<Button
							variant='brand'
							size='md'
							px={8}
							type='submit'
							isLoading={formik.isSubmitting}
							isDisabled={isFormIncomplete() || !formik.isValid}
						>
							Create Survey
						</Button>
					</Flex>
				</Box>
			</form>
		</Box>
	);
};

export default CreateSurvey;
