// import React, { useState, useEffect, useRef } from 'react';
// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalCloseButton,
// 	ModalBody,
// 	ModalFooter,
// 	FormControl,
// 	FormLabel,
// 	Input,
// 	Button,
// 	VStack,
// 	FormErrorMessage,
// 	Flex,
// 	Tabs,
// 	TabList,
// 	Tab,
// 	TabPanels,
// 	TabPanel,
// 	useColorModeValue,
// 	Alert,
// 	AlertIcon,
// 	Text,
// 	Box,
// 	HStack,
// 	InputGroup,
// 	InputRightElement,
// 	IconButton,
// 	Switch,
// } from '@chakra-ui/react';
// import { useFormik } from 'formik';
// import { useDispatch } from 'react-redux';
// import * as Yup from 'yup';
// import { useCreateItemMutation, useUpdateItemMutation } from 'api/apiSlice';
// import { toast } from 'react-toastify';

// import SearchUsers from 'views/admin/whatsapp/WhatsappSettings/SearchUsers';
// import { useUserActivityLog } from 'hooks/useUserActivityLog';
// import {
// 	CheckCircleIcon,
// 	InfoOutlineIcon,
// 	ViewIcon,
// 	ViewOffIcon,
// 	WarningIcon,
// } from '@chakra-ui/icons';
// import useUserSession from 'hooks/useUserSession';
// import {
// 	buildModesPayload,
// 	MODES,
// 	useModeForms,
// 	isModeConfigured,
// 	getSlotNumber,
// 	configuredIndexes,
// } from './useModeForms';
// import { saveUserDialerSettings } from './../../../../../../redux/webrtc/webrtcSlice';
// import CustomTooltip from 'components/shared/CustomTooltip';
// import webrtcSlotService from '../webrtcSlotService';
// // Validation schema for base form (user and SIM number)
// const baseValidationSchema = Yup.object().shape({
// 	user: Yup.string().required('User is required'),
// 	isFeedback: Yup.boolean(),
// 	simNumber: Yup.string()
// 		.matches(/^[A-Z0-9]*$/, 'SIM number can only contain letters and numbers')
// 		.max(20, 'SIM number cannot exceed 20 characters'),
// });

// const ManageCallSetting = ({
// 	isOpen,
// 	onClose,
// 	onSuccess,
// 	usersData,
// 	modeType = 'add', // 'add' or 'edit'
// 	initialData = null, // existing SIP setting for edit
// }) => {
// 	const [createSetting, { isLoading: isCreating }] = useCreateItemMutation();
// 	const [updateSetting, { isLoading: isUpdating }] = useUpdateItemMutation();

// 	const { user } = useUserSession();
// 	const { createUserLog } = useUserActivityLog();
// 	const dispatch = useDispatch();

// 	const [showPassword, setShowPassword] = useState(false);
// 	const [configuredModes, setConfiguredModes] = useState({});

// 	const alreadyConfiguredModes = MODES?.filter((mode) =>
// 		initialData?.modes?.[mode]?.username?.trim(),
// 	);

// 	const safeDefaultTab =
// 		modeType === 'edit' ? (configuredIndexes(initialData)[0] ?? 0) : 0;

// 	const [activeTab, setActiveTab] = useState(safeDefaultTab);
// 	const cachedFormData = useRef({
// 		user: '',
// 		simNumber: '',
// 		isFeedback: false,
// 		modes: { udp: null, tls: null, wss: null },
// 	});

// 	const bgColor = useColorModeValue('white', 'gray.800');
// 	const headerBg = useColorModeValue('brand.300', 'brand.100');
// 	const headerText = useColorModeValue('brand.700', 'brand.900');
// 	const footerBg = useColorModeValue('gray.50', 'gray.700');
// 	const borderColor = useColorModeValue('gray.200', 'gray.600');
// 	const tabBg = useColorModeValue('gray.50', 'gray.700');

// 	// Pre-fill baseFormik
// 	const baseFormik = useFormik({
// 		initialValues: {
// 			user: initialData?.user?._id || '',
// 			simNumber: initialData?.simNumber || '',
// 			isFeedback: initialData?.isFeedback || false,
// 		},
// 		validationSchema: baseValidationSchema,
// 		onSubmit: () => {},
// 	});

// 	// Initialize configuredModes for edit mode
// 	useEffect(() => {
// 		if (modeType === 'edit' && initialData?.modes) {
// 			const configured = {};
// 			Object.keys(initialData.modes).forEach((mode) => {
// 				if (initialData.modes[mode]) configured[mode] = true;
// 			});
// 			setConfiguredModes(configured);
// 			cachedFormData.current = {
// 				user: initialData.user._id,
// 				simNumber: initialData.simNumber,
// 				isFeedback: initialData.isFeedback,
// 				modes: initialData.modes,
// 			};
// 		}
// 	}, [initialData, modeType]);

// 	// const handleModeSave = (mode, values) => {
// 	// 	if (!baseFormik.values.user)
// 	// 		return toast.error('Please select a user first');

// 	// 	// Merge previous data safely
// 	// 	const prevValues = cachedFormData.current.modes?.[mode] || {};

// 	// 	cachedFormData.current = {
// 	// 		...cachedFormData.current,
// 	// 		modes: {
// 	// 			...cachedFormData.current.modes, // spread existing modes
// 	// 			[mode]: {
// 	// 				...prevValues,
// 	// 				...values,
// 	// 				port: parseInt(values.port),
// 	// 			},
// 	// 		},
// 	// 	};

// 	// 	setConfiguredModes((prev) => ({ ...prev, [mode]: true }));
// 	// 	toast.success(`${mode.toUpperCase()} configuration saved`);
// 	// };

// 	// const handleModeSave = (mode, values) => {
// 	// 	if (!baseFormik.values.user)
// 	// 		return toast.error('Please select a user first');

// 	// 	console.log({ cachedFormData, mode, values });

// 	// 	cachedFormData.current.modes[mode] = {
// 	// 		...values,
// 	// 		port: parseInt(values.port),
// 	// 	};

// 	// 	setConfiguredModes((prev) => ({ ...prev, [mode]: true }));
// 	// 	toast.success(`${mode.toUpperCase()} configuration saved`);
// 	// };

// 	// Usage inside component
// 	const modeForms = useModeForms(initialData);

// 	useEffect(() => {
// 		setConfiguredModes({
// 			udp: isModeConfigured(modeForms.udp),
// 			tls: isModeConfigured(modeForms.tls),
// 			wss: isModeConfigured(modeForms.wss),
// 		});
// 	}, [
// 		modeForms.udp.values,
// 		modeForms.udp.errors,
// 		modeForms.tls.values,
// 		modeForms.tls.errors,
// 		modeForms.wss.values,
// 		modeForms.wss.errors,
// 	]);

// 	const isConfigMode = Object.values(configuredModes).some(Boolean);

// 	// const isModeConfigured = (form) => {
// 	// 	const v = form.values;
// 	// 	return (
// 	// 		v.cid &&
// 	// 		v.username &&
// 	// 		v.password &&
// 	// 		v.domain &&
// 	// 		v.port &&
// 	// 		Object.keys(form.errors).length === 0
// 	// 	);
// 	// };

// 	// // --- UDP Watch ---
// 	// useEffect(() => {
// 	// 	setConfiguredModes((prev) => ({
// 	// 		...prev,
// 	// 		udp: isModeConfigured(modeForms.udp),
// 	// 	}));
// 	// }, [modeForms.udp.values, modeForms.udp.errors]);

// 	// // --- TLS Watch ---
// 	// useEffect(() => {
// 	// 	setConfiguredModes((prev) => ({
// 	// 		...prev,
// 	// 		tls: isModeConfigured(modeForms.tls),
// 	// 	}));
// 	// }, [modeForms.tls.values, modeForms.tls.errors]);

// 	// // --- WSS Watch ---
// 	// useEffect(() => {
// 	// 	setConfiguredModes((prev) => ({
// 	// 		...prev,
// 	// 		wss: isModeConfigured(modeForms.wss),
// 	// 	}));
// 	// }, [modeForms.wss.values, modeForms.wss.errors]);

// 	const handleFinalSubmit = async () => {
// 		if (!baseFormik.values.user)
// 			return toast.error('User selection is required');
// 		if (!isConfigMode) return toast.error('Configure at least one mode');

// 		const payload = {
// 			user: baseFormik.values.user,
// 			simNumber: baseFormik.values.simNumber || null,
// 			isFeedback: baseFormik.values.isFeedback || false,
// 			// modes: cachedFormData.current.modes,
// 			modes: buildModesPayload(modeForms),
// 		};

// 		try {
// 			let response;
// 			if (modeType === 'edit' && initialData?._id) {
// 				// Call update API
// 				response = await updateSetting({
// 					path: `/sipSetting/${initialData._id}`,
// 					body: payload,
// 				}).unwrap();
// 			} else {
// 				// Add new
// 				response = await createSetting({
// 					path: '/sipSetting',
// 					body: payload,
// 				}).unwrap();
// 			}

// 			createUserLog({
// 				userId: user?._id,
// 				action: modeType === 'edit' ? 'UPDATE' : 'CREATE',
// 				entity: 'Call_Logs',
// 				entityId: response?._id || null,
// 				entityType: 'SipSetting',
// 				status: 'success',
// 				message: `${user?.fullName} ${modeType === 'edit' ? 'updated' : 'created'} Call setting with modes: ${Object.keys(configuredModes).join(', ')}`,
// 			});

// 			toast.success(
// 				`Call Setting ${modeType === 'edit' ? 'updated' : 'created'} successfully`
// 			);
// 			resetAllForms();
// 			onSuccess();
// 			onClose();

// 			// if current user setting update or added direct reflect the phone dialer
// 			console.log({ response });
// 			if (user?._id === payload.user) {
// 				dispatch(saveUserDialerSettings(response));
// 			}
// 		} catch (error) {
// 			toast.error(
// 				error.data?.message ||
// 					`Error ${modeType === 'edit' ? 'updating' : 'creating'} SIP Setting`
// 			);
// 			createUserLog({
// 				userId: user?._id,
// 				action: modeType === 'edit' ? 'UPDATE' : 'CREATE',
// 				entity: 'Call_Logs',
// 				entityType: 'SipSetting',
// 				status: 'error',
// 				message: error?.data?.message || 'Failed',
// 			});
// 		}
// 	};

// 	const handleSlotUser = (payload) => {
// 		const userId = payload?.user;
// 		const slotNumber = getSlotNumber(payload, initialData);
// 		// payload?.modes?.wss?.username?.trim() ||
// 		// 	initialData?.modes?.wss?.username?.trim(); // prefer cid over username

// 		// Guard clauses (fail fast)
// 		if (!userId || !slotNumber) return;

// 		// Normalize payload once
// 		const body = { user_id: userId };

// 		switch (modeType) {
// 			case 'add':
// 				webrtcSlotService.create({
// 					...body,
// 					slot_number: slotNumber,
// 				});
// 				break;

// 			case 'edit':
// 				webrtcSlotService.update(slotNumber, body);
// 				break;

// 			default:
// 				// silent no-op (intentionally)
// 				break;
// 		}
// 	};
// 	// Check if there are unsaved changes before closing
// 	const handleClose = () => {
// 		// const hasUnsaved = Object.keys(configuredModes).length > 0;

// 		// console.log({ configuredModes });
// 		// if (
// 		// 	modeType === 'add' &&
// 		// 	hasUnsaved &&
// 		// 	!window.confirm('You have unsaved changes. Are you sure?')
// 		// )
// 		// 	return;
// 		resetAllForms();
// 		onClose();
// 	};

// 	// Reset all forms and clear cache
// 	const resetAllForms = () => {
// 		baseFormik.resetForm();
// 		Object.values(modeForms).forEach((form) => form.resetForm());
// 		setConfiguredModes({});
// 		cachedFormData.current = {
// 			user: '',
// 			simNumber: '',
// 			isFeedback: false,
// 			modes: { udp: null, tls: null, wss: null },
// 		};
// 		setActiveTab(0);
// 	};

// 	// Handle user selection
// 	const handleSelectUser = (selectedUser) => {
// 		baseFormik.setFieldValue('user', selectedUser?._id || null);
// 	};

// 	// Check if Save button should be enabled for final submission
// 	const isFinalSaveEnabled = () => {
// 		return baseFormik.values.user && isConfigMode && baseFormik.touched;
// 	};

// 	return (
// 		<Modal
// 			isOpen={isOpen}
// 			onClose={handleClose}
// 			size='lg'
// 			isCentered
// 			closeOnOverlayClick={false}
// 		>
// 			<ModalOverlay />
// 			<ModalContent
// 				bg={bgColor}
// 				borderRadius='2xl'
// 				shadow='2xl'
// 				maxW={{ base: 'full', sm: '90vw', md: '700px' }}
// 				overflow='hidden'
// 				mx={{ base: 3, md: 0 }}
// 			>
// 				<ModalHeader p={0} borderBottom='1px solid' borderColor={borderColor}>
// 					<Flex
// 						align='center'
// 						bg={headerBg}
// 						color={headerText}
// 						px={6}
// 						py={3}
// 						position='sticky'
// 						top='0'
// 						zIndex='10'
// 						boxShadow='md'
// 					>
// 						<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold'>
// 							Add Call Setting
// 						</Text>
// 						<ModalCloseButton
// 							position='absolute'
// 							right='12px'
// 							top='10px'
// 							color={headerText}
// 							_hover={{ bg: 'whiteAlpha.200' }}
// 						/>
// 					</Flex>
// 				</ModalHeader>

// 				<ModalBody
// 					p={5}
// 					overflowY='auto'
// 					maxH='65vh'
// 					borderBottom='1px solid'
// 					borderColor={borderColor}
// 				>
// 					<VStack spacing={5} align='stretch'>
// 						{/* Base Configuration Section */}
// 						<Box mb={4}>
// 							<Text fontSize='md' fontWeight='semibold' mb={3} color='gray.700'>
// 								Basic Configuration
// 							</Text>

// 							<FormControl
// 								isInvalid={baseFormik.errors.user && baseFormik.touched.user}
// 								mb={4}
// 							>
// 								<FormLabel fontWeight='semibold'>User *</FormLabel>
// 								<SearchUsers
// 									selectedUserId={baseFormik.values.user || null}
// 									users={usersData?.doc || []}
// 									onSelectUser={handleSelectUser}
// 								/>
// 								<FormErrorMessage>{baseFormik.errors.user}</FormErrorMessage>
// 							</FormControl>

// 							<FormControl
// 								isInvalid={
// 									baseFormik.errors.simNumber && baseFormik.touched.simNumber
// 								}
// 							>
// 								<FormLabel fontWeight='semibold'>
// 									SIM Number (Optional)
// 								</FormLabel>
// 								<Input
// 									name='simNumber'
// 									placeholder='e.g., SIM123456'
// 									value={baseFormik.values.simNumber}
// 									onChange={baseFormik.handleChange}
// 									onBlur={baseFormik.handleBlur}
// 									focusBorderColor='brand.500'
// 								/>
// 								<FormErrorMessage>
// 									{baseFormik.errors.simNumber}
// 								</FormErrorMessage>
// 							</FormControl>

// 							<FormControl py={4}>
// 								<Flex align='center' justify='space-between'>
// 									<FormLabel fontWeight='semibold'>Call Feedback</FormLabel>

// 									<HStack spacing={2}>
// 										<CustomTooltip label='If enabled, this user can submit call quality feedbacks.'>
// 											<Box color='gray.400' cursor='pointer'>
// 												<InfoOutlineIcon fontSize='14px' />
// 											</Box>
// 										</CustomTooltip>

// 										<Switch
// 											name='isFeedback'
// 											colorScheme='green'
// 											isChecked={baseFormik.values.isFeedback}
// 											onChange={(e) =>
// 												baseFormik.setFieldValue('isFeedback', e.target.checked)
// 											}
// 										/>
// 									</HStack>
// 								</Flex>

// 								<HStack
// 									mt={1}
// 									p={2}
// 									rounded='md'
// 									spacing={2}
// 									bg={baseFormik.values.isFeedback ? 'green.100' : 'orange.100'}
// 								>
// 									{baseFormik.values.isFeedback ? (
// 										<>
// 											<CheckCircleIcon color='green.500' boxSize='14px' />
// 											<Text fontSize='sm' color='green.700' fontWeight='medium'>
// 												Call feedback enabled for this user
// 											</Text>
// 										</>
// 									) : (
// 										<>
// 											<WarningIcon color='orange.500' boxSize='14px' />
// 											<Text
// 												fontSize='sm'
// 												color='orange.600'
// 												fontWeight='medium'
// 											>
// 												Call feedback is disabled for this user
// 											</Text>
// 										</>
// 									)}
// 								</HStack>
// 							</FormControl>
// 						</Box>

// 						{/* Mode Configuration Tabs */}
// 						<Box mt={4}>
// 							<Text fontSize='md' fontWeight='semibold' mb={3} color='gray.700'>
// 								Mode Configuration
// 							</Text>

// 							{!baseFormik.values.user ? (
// 								<Alert status='info' borderRadius='md' mb={4}>
// 									<AlertIcon />
// 									Please select a user to configure modes
// 								</Alert>
// 							) : (
// 								<Alert status='success' borderRadius='md' mb={4}>
// 									<AlertIcon />
// 									User selected. You can now configure Call modes.
// 								</Alert>
// 							)}

// 							<Tabs
// 								index={activeTab}
// 								onChange={setActiveTab}
// 								variant='enclosed'
// 								isLazy
// 							>
// 								<TabList bg={tabBg} borderRadius='md' p={1}>
// 									{MODES.map((mode) => {
// 										const isConfigured = alreadyConfiguredModes.includes(mode);

// 										const isDisabled = modeType === 'edit' && !isConfigured;

// 										return (
// 											<Tab
// 												key={mode}
// 												_selected={{
// 													bg: 'white',
// 													color: 'brand.500',
// 													shadow: 'sm',
// 												}}
// 												opacity={isDisabled ? 0.4 : 1}
// 												color={isDisabled ? 'gray.400' : 'gray.700'}
// 												isDisabled={!baseFormik.values.user || isDisabled}
// 												position='relative'
// 											>
// 												{mode.toUpperCase()}
// 												{configuredModes[mode] && (
// 													<Box
// 														as='span'
// 														position='absolute'
// 														top='2px'
// 														right='2px'
// 														w='8px'
// 														h='8px'
// 														bg='green.500'
// 														borderRadius='full'
// 													/>
// 												)}
// 											</Tab>
// 										);
// 									})}
// 								</TabList>

// 								<TabPanels mt={4}>
// 									{MODES.map((mode) => {
// 										const form = modeForms[mode];

// 										const existingUsername =
// 											initialData?.modes?.[mode]?.username?.trim();
// 										const isConfigured = !!existingUsername;

// 										const canEditUsername =
// 											modeType === 'add' ||
// 											(modeType === 'edit' && !isConfigured);

// 										return (
// 											<TabPanel key={mode} p={0}>
// 												<form onSubmit={form.handleSubmit}>
// 													<VStack spacing={4} align='stretch'>
// 														<HStack
// 															flexDir={{ base: 'column', lg: 'row' }}
// 															gap={{ base: 0, lg: 2 }}
// 															align='flex-start'
// 														>
// 															<FormControl
// 																isInvalid={form.errors.cid && form.touched.cid}
// 															>
// 																<FormLabel fontWeight='medium'>
// 																	Caller ID
// 																</FormLabel>
// 																<Input
// 																	name='cid'
// 																	placeholder='e.g., 1001'
// 																	value={form.values.cid}
// 																	onChange={form.handleChange}
// 																	onBlur={form.handleBlur}
// 																	isDisabled={!baseFormik.values.user}
// 																	focusBorderColor='brand.500'
// 																/>
// 																<FormErrorMessage>
// 																	{form.errors.cid}
// 																</FormErrorMessage>
// 															</FormControl>

// 															{canEditUsername && (
// 																<FormControl
// 																	isInvalid={
// 																		form.errors.username &&
// 																		form.touched.username
// 																	}
// 																>
// 																	<FormLabel fontWeight='medium'>
// 																		Username
// 																	</FormLabel>
// 																	<Input
// 																		name='username'
// 																		placeholder='e.g., user1001'
// 																		value={form.values.username}
// 																		onChange={form.handleChange}
// 																		onBlur={form.handleBlur}
// 																		isDisabled={!baseFormik.values.user}
// 																		focusBorderColor='brand.500'
// 																		autoComplete='new-username'
// 																	/>
// 																	<FormErrorMessage>
// 																		{form.errors.username}
// 																	</FormErrorMessage>
// 																</FormControl>
// 															)}
// 														</HStack>

// 														<HStack
// 															flexDir={{ base: 'column', lg: 'row' }}
// 															gap={{ base: 0, lg: 2 }}
// 															align='flex-start'
// 														>
// 															<FormControl
// 																isInvalid={
// 																	form.errors.domain && form.touched.domain
// 																}
// 															>
// 																<FormLabel fontWeight='medium'>
// 																	Domain
// 																</FormLabel>
// 																<Input
// 																	name='domain'
// 																	placeholder='e.g., call.weam.info'
// 																	value={form.values.domain}
// 																	onChange={form.handleChange}
// 																	onBlur={form.handleBlur}
// 																	isDisabled={!baseFormik.values.user}
// 																	focusBorderColor='brand.500'
// 																/>
// 																<FormErrorMessage>
// 																	{form.errors.domain}
// 																</FormErrorMessage>
// 															</FormControl>

// 															<FormControl
// 																isInvalid={
// 																	form.errors.port && form.touched.port
// 																}
// 															>
// 																<FormLabel fontWeight='medium'>Port</FormLabel>
// 																<Input
// 																	name='port'
// 																	placeholder='e.g., 5060'
// 																	value={form.values.port}
// 																	onChange={form.handleChange}
// 																	onBlur={form.handleBlur}
// 																	isDisabled={!baseFormik.values.user}
// 																	focusBorderColor='brand.500'
// 																/>
// 																<FormErrorMessage>
// 																	{form.errors.port}
// 																</FormErrorMessage>
// 															</FormControl>
// 														</HStack>

// 														{/* <FormControl
// 															isInvalid={
// 																form.errors.password && form.touched.password
// 															}
// 														>
// 															<FormLabel fontWeight='medium'>
// 																Password
// 															</FormLabel>
// 															<Input
// 																name='password'
// 																type='password'
// 																placeholder='Password'
// 																value={form.values.password}
// 																onChange={form.handleChange}
// 																onBlur={form.handleBlur}
// 																isDisabled={!baseFormik.values.user}
// 																focusBorderColor='brand.500'
// 															/>
// 															<FormErrorMessage>
// 																{form.errors.password}
// 															</FormErrorMessage>
// 														</FormControl> */}
// 														<FormControl
// 															isInvalid={
// 																form.errors.password && form.touched.password
// 															}
// 														>
// 															<FormLabel fontWeight='medium'>
// 																Password
// 															</FormLabel>
// 															<InputGroup isDisabled={!baseFormik.values.user}>
// 																<Input
// 																	name='password'
// 																	type={showPassword ? 'text' : 'password'}
// 																	placeholder='Password'
// 																	value={form.values.password}
// 																	onChange={form.handleChange}
// 																	onBlur={form.handleBlur}
// 																	isDisabled={!baseFormik.values.user}
// 																	focusBorderColor='brand.500'
// 																	autoComplete='new-password'
// 																/>
// 																<InputRightElement width='3rem'>
// 																	<IconButton
// 																		h='1.75rem'
// 																		size='sm'
// 																		onClick={() =>
// 																			setShowPassword(!showPassword)
// 																		}
// 																		variant='ghost'
// 																		icon={
// 																			showPassword ? (
// 																				<ViewOffIcon />
// 																			) : (
// 																				<ViewIcon />
// 																			)
// 																		}
// 																		aria-label={
// 																			showPassword
// 																				? 'Hide password'
// 																				: 'Show password'
// 																		}
// 																	/>
// 																</InputRightElement>
// 															</InputGroup>
// 															<FormErrorMessage>
// 																{form.errors.password}
// 															</FormErrorMessage>
// 														</FormControl>
// 														{/* <Button
// 															type='submit'
// 															colorScheme='brand'
// 															mt={2}
// 															isDisabled={
// 																!baseFormik.values.user || !form.isValid
// 															}
// 														>
// 															{configuredModes[mode]
// 																? 'Update Configuration'
// 																: 'Save Configuration'}
// 														</Button> */}
// 													</VStack>
// 												</form>
// 											</TabPanel>
// 										);
// 									})}
// 								</TabPanels>
// 							</Tabs>
// 						</Box>
// 					</VStack>
// 				</ModalBody>

// 				<ModalFooter
// 					position='sticky'
// 					bottom='0'
// 					bg={footerBg}
// 					borderTop='1px solid'
// 					borderColor={borderColor}
// 					py={3}
// 					px={5}
// 					zIndex='10'
// 					justifyContent='flex-end'
// 				>
// 					<Flex gap={3}>
// 						<Button
// 							variant='outline'
// 							colorScheme='gray'
// 							onClick={handleClose}
// 							isDisabled={isCreating || isUpdating}
// 							borderRadius='md'
// 							fontSize={{ base: 'xs', md: 'md' }}
// 						>
// 							Cancel
// 						</Button>
// 						<Button
// 							colorScheme='brand'
// 							onClick={handleFinalSubmit}
// 							isDisabled={!isFinalSaveEnabled()}
// 							isLoading={isCreating || isUpdating}
// 							borderRadius='md'
// 							fontSize={{ base: 'xs', md: 'md' }}
// 						>
// 							Save All
// 						</Button>
// 					</Flex>
// 				</ModalFooter>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

// export default ManageCallSetting;

import React, { useState, useEffect, useRef } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	FormControl,
	FormLabel,
	Input,
	Button,
	VStack,
	FormErrorMessage,
	Flex,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Alert,
	AlertIcon,
	Text,
	Box,
	HStack,
	InputGroup,
	InputRightElement,
	IconButton,
	Switch,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useCreateItemMutation, useUpdateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';

import SearchUsers from 'views/admin/whatsapp/WhatsappSettings/SearchUsers';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import {
	CheckCircleIcon,
	InfoOutlineIcon,
	ViewIcon,
	ViewOffIcon,
	WarningIcon,
} from '@chakra-ui/icons';
import useUserSession from 'hooks/useUserSession';
import {
	buildModesPayload,
	MODES,
	useModeForms,
	isModeConfigured,
	getSlotNumber,
	configuredIndexes,
} from './useModeForms';
import { saveUserDialerSettings } from './../../../../../../redux/webrtc/webrtcSlice';
import CustomTooltip from 'components/shared/CustomTooltip';
import webrtcSlotService from '../webrtcSlotService';
import { useModalColors } from 'hooks/useModalColors';

// Validation schema for base form (user and SIM number)
const baseValidationSchema = Yup.object().shape({
	user: Yup.string().required('User is required'),
	isFeedback: Yup.boolean(),
	simNumber: Yup.string()
		.matches(/^[A-Z0-9]*$/, 'SIM number can only contain letters and numbers')
		.max(20, 'SIM number cannot exceed 20 characters'),
});

const ManageCallSetting = ({
	isOpen,
	onClose,
	onSuccess,
	usersData,
	modeType = 'add',
	initialData = null,
}) => {
	const colors = useModalColors();
	const [createSetting, { isLoading: isCreating }] = useCreateItemMutation();
	const [updateSetting, { isLoading: isUpdating }] = useUpdateItemMutation();

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();
	const dispatch = useDispatch();

	const [showPassword, setShowPassword] = useState(false);
	const [configuredModes, setConfiguredModes] = useState({});

	const alreadyConfiguredModes = MODES?.filter((mode) =>
		initialData?.modes?.[mode]?.username?.trim(),
	);

	const safeDefaultTab =
		modeType === 'edit' ? (configuredIndexes(initialData)[0] ?? 0) : 0;

	const [activeTab, setActiveTab] = useState(safeDefaultTab);
	const cachedFormData = useRef({
		user: '',
		simNumber: '',
		isFeedback: false,
		modes: { udp: null, tls: null, wss: null },
	});

	// Pre-fill baseFormik
	const baseFormik = useFormik({
		initialValues: {
			user: initialData?.user?._id || '',
			simNumber: initialData?.simNumber || '',
			isFeedback: initialData?.isFeedback || false,
		},
		validationSchema: baseValidationSchema,
		onSubmit: () => {},
	});

	// Initialize configuredModes for edit mode
	useEffect(() => {
		if (modeType === 'edit' && initialData?.modes) {
			const configured = {};
			Object.keys(initialData.modes).forEach((mode) => {
				if (initialData.modes[mode]) configured[mode] = true;
			});
			setConfiguredModes(configured);
			cachedFormData.current = {
				user: initialData.user._id,
				simNumber: initialData.simNumber,
				isFeedback: initialData.isFeedback,
				modes: initialData.modes,
			};
		}
	}, [initialData, modeType]);

	const modeForms = useModeForms(initialData);

	useEffect(() => {
		setConfiguredModes({
			udp: isModeConfigured(modeForms.udp),
			tls: isModeConfigured(modeForms.tls),
			wss: isModeConfigured(modeForms.wss),
		});
	}, [
		modeForms.udp.values,
		modeForms.udp.errors,
		modeForms.tls.values,
		modeForms.tls.errors,
		modeForms.wss.values,
		modeForms.wss.errors,
	]);

	const isConfigMode = Object.values(configuredModes).some(Boolean);

	const handleFinalSubmit = async () => {
		if (!baseFormik.values.user)
			return toast.error('User selection is required');
		if (!isConfigMode) return toast.error('Configure at least one mode');

		const payload = {
			user: baseFormik.values.user,
			simNumber: baseFormik.values.simNumber || null,
			isFeedback: baseFormik.values.isFeedback || false,
			modes: buildModesPayload(modeForms),
		};

		try {
			let response;
			if (modeType === 'edit' && initialData?._id) {
				response = await updateSetting({
					path: `/sipSetting/${initialData._id}`,
					body: payload,
				}).unwrap();
			} else {
				response = await createSetting({
					path: '/sipSetting',
					body: payload,
				}).unwrap();
			}

			createUserLog({
				userId: user?._id,
				action: modeType === 'edit' ? 'UPDATE' : 'CREATE',
				entity: 'Call_Logs',
				entityId: response?._id || null,
				entityType: 'SipSetting',
				status: 'success',
				message: `${user?.fullName} ${modeType === 'edit' ? 'updated' : 'created'} Call setting with modes: ${Object.keys(configuredModes).join(', ')}`,
			});

			toast.success(
				`Call Setting ${modeType === 'edit' ? 'updated' : 'created'} successfully`
			);
			resetAllForms();
			onSuccess();
			onClose();

			if (user?._id === payload.user) {
				dispatch(saveUserDialerSettings(response));
			}
		} catch (error) {
			toast.error(
				error.data?.message ||
					`Error ${modeType === 'edit' ? 'updating' : 'creating'} SIP Setting`
			);
			createUserLog({
				userId: user?._id,
				action: modeType === 'edit' ? 'UPDATE' : 'CREATE',
				entity: 'Call_Logs',
				entityType: 'SipSetting',
				status: 'error',
				message: error?.data?.message || 'Failed',
			});
		}
	};

	const handleSlotUser = (payload) => {
		const userId = payload?.user;
		const slotNumber = getSlotNumber(payload, initialData);

		if (!userId || !slotNumber) return;

		const body = { user_id: userId };

		switch (modeType) {
			case 'add':
				webrtcSlotService.create({
					...body,
					slot_number: slotNumber,
				});
				break;
			case 'edit':
				webrtcSlotService.update(slotNumber, body);
				break;
			default:
				break;
		}
	};

	const handleClose = () => {
		resetAllForms();
		onClose();
	};

	const resetAllForms = () => {
		baseFormik.resetForm();
		Object.values(modeForms).forEach((form) => form.resetForm());
		setConfiguredModes({});
		cachedFormData.current = {
			user: '',
			simNumber: '',
			isFeedback: false,
			modes: { udp: null, tls: null, wss: null },
		};
		setActiveTab(0);
	};

	const handleSelectUser = (selectedUser) => {
		baseFormik.setFieldValue('user', selectedUser?._id || null);
	};

	const isFinalSaveEnabled = () => {
		return baseFormik.values.user && isConfigMode && baseFormik.touched;
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size='lg'
			isCentered
			closeOnOverlayClick={false}
		>
			<ModalOverlay bg={colors.overlayBg} backdropFilter="blur(4px)" />
			<ModalContent
				bg={colors.bg}
				borderRadius='2xl'
				boxShadow={colors.modalShadow}
				maxW={{ base: 'full', sm: '90vw', md: '700px' }}
				overflow='hidden'
				mx={{ base: 3, md: 0 }}
			>
				<ModalHeader p={0} borderBottom='1px solid' borderColor={colors.borderColor}>
					<Flex
						align='center'
						bg={colors.headerBg}
						color={colors.headerText}
						px={6}
						py={3}
						position='sticky'
						top='0'
						zIndex='10'
						boxShadow='sm'
					>
						<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold' color={colors.headerText}>
							{modeType === 'add' ? 'Add Call Setting' : 'Edit Call Setting'}
						</Text>
						<ModalCloseButton
							position='absolute'
							right='12px'
							top='10px'
							color={colors.headerText}
							_hover={{ bg: colors.closeBtnHoverBg }}
						/>
					</Flex>
				</ModalHeader>

				<ModalBody
					p={5}
					overflowY='auto'
					maxH='65vh'
					borderBottom='1px solid'
					borderColor={colors.borderColor}
					bg={colors.bg}
				>
					<VStack spacing={5} align='stretch'>
						{/* Base Configuration Section */}
						<Box mb={4}>
							<Text fontSize='md' fontWeight='semibold' mb={3} color={colors.headingText}>
								Basic Configuration
							</Text>

							<FormControl
								isInvalid={baseFormik.errors.user && baseFormik.touched.user}
								mb={4}
							>
								<FormLabel fontWeight='semibold' color={colors.labelColor}>User *</FormLabel>
								<SearchUsers
									selectedUserId={baseFormik.values.user || null}
									users={usersData?.doc || []}
									onSelectUser={handleSelectUser}
								/>
								<FormErrorMessage color={colors.badgeErrorText}>{baseFormik.errors.user}</FormErrorMessage>
							</FormControl>

							<FormControl
								isInvalid={
									baseFormik.errors.simNumber && baseFormik.touched.simNumber
								}
							>
								<FormLabel fontWeight='semibold' color={colors.labelColor}>
									SIM Number (Optional)
								</FormLabel>
								<Input
									name='simNumber'
									placeholder='e.g., SIM123456'
									value={baseFormik.values.simNumber}
									onChange={baseFormik.handleChange}
									onBlur={baseFormik.handleBlur}
									bg={colors.bgInput}
									borderColor={colors.borderColor}
									color={colors.headingText}
									_placeholder={{ color: colors.mutedText }}
									_focus={{
										borderColor: colors.accentGold,
										boxShadow: `0 0 0 1px ${colors.accentGold}`,
									}}
									_hover={{ borderColor: colors.accentGold }}
								/>
								<FormErrorMessage color={colors.badgeErrorText}>
									{baseFormik.errors.simNumber}
								</FormErrorMessage>
							</FormControl>

							<FormControl py={4}>
								<Flex align='center' justify='space-between'>
									<FormLabel fontWeight='semibold' color={colors.labelColor}>Call Feedback</FormLabel>

									<HStack spacing={2}>
										<CustomTooltip label='If enabled, this user can submit call quality feedbacks.'>
											<Box color={colors.mutedText} cursor='pointer'>
												<InfoOutlineIcon fontSize='14px' />
											</Box>
										</CustomTooltip>

										<Switch
											name='isFeedback'
											colorScheme='green'
											isChecked={baseFormik.values.isFeedback}
											onChange={(e) =>
												baseFormik.setFieldValue('isFeedback', e.target.checked)
											}
										/>
									</HStack>
								</Flex>

								<HStack
									mt={1}
									p={2}
									rounded='md'
									spacing={2}
									bg={baseFormik.values.isFeedback ? colors.badgeSuccessBg : colors.badgeWarningBg}
								>
									{baseFormik.values.isFeedback ? (
										<>
											<CheckCircleIcon color={colors.badgeSuccessText} boxSize='14px' />
											<Text fontSize='sm' color={colors.badgeSuccessText} fontWeight='medium'>
												Call feedback enabled for this user
											</Text>
										</>
									) : (
										<>
											<WarningIcon color={colors.badgeWarningText} boxSize='14px' />
											<Text
												fontSize='sm'
												color={colors.badgeWarningText}
												fontWeight='medium'
											>
												Call feedback is disabled for this user
											</Text>
										</>
									)}
								</HStack>
							</FormControl>
						</Box>

						{/* Mode Configuration Tabs */}
						<Box mt={4}>
							<Text fontSize='md' fontWeight='semibold' mb={3} color={colors.headingText}>
								Mode Configuration
							</Text>

							{!baseFormik.values.user ? (
								<Alert status='info' borderRadius='md' mb={4} bg={colors.badgeInfoBg}>
									<AlertIcon color={colors.badgeInfoText} />
									<Text color={colors.badgeInfoText}>Please select a user to configure modes</Text>
								</Alert>
							) : (
								<Alert status='success' borderRadius='md' mb={4} bg={colors.badgeSuccessBg}>
									<AlertIcon color={colors.badgeSuccessText} />
									<Text color={colors.badgeSuccessText}>User selected. You can now configure Call modes.</Text>
								</Alert>
							)}

							<Tabs
								index={activeTab}
								onChange={setActiveTab}
								variant='enclosed'
								isLazy
							>
								<TabList bg={colors.bgInput} borderRadius='md' p={1} borderColor={colors.borderColor}>
									{MODES.map((mode) => {
										const isConfigured = alreadyConfiguredModes.includes(mode);

										const isDisabled = modeType === 'edit' && !isConfigured;

										return (
											<Tab
												key={mode}
												_selected={{
													bg: colors.bg,
													color: colors.accentGold,
													borderColor: colors.accentGold,
													shadow: 'sm',
												}}
												opacity={isDisabled ? 0.4 : 1}
												color={isDisabled ? colors.mutedText : colors.bodyText}
												isDisabled={!baseFormik.values.user || isDisabled}
												position='relative'
												borderColor={colors.borderColor}
											>
												{mode.toUpperCase()}
												{configuredModes[mode] && (
													<Box
														as='span'
														position='absolute'
														top='2px'
														right='2px'
														w='8px'
														h='8px'
														bg={colors.badgeSuccessText}
														borderRadius='full'
													/>
												)}
											</Tab>
										);
									})}
								</TabList>

								<TabPanels mt={4}>
									{MODES.map((mode) => {
										const form = modeForms[mode];

										const existingUsername =
											initialData?.modes?.[mode]?.username?.trim();
										const isConfigured = !!existingUsername;

										const canEditUsername =
											modeType === 'add' ||
											(modeType === 'edit' && !isConfigured);

										return (
											<TabPanel key={mode} p={0}>
												<form onSubmit={form.handleSubmit}>
													<VStack spacing={4} align='stretch'>
														<HStack
															flexDir={{ base: 'column', lg: 'row' }}
															gap={{ base: 0, lg: 2 }}
															align='flex-start'
														>
															<FormControl
																isInvalid={form.errors.cid && form.touched.cid}
															>
																<FormLabel fontWeight='medium' color={colors.labelColor}>Caller ID</FormLabel>
																<Input
																	name='cid'
																	placeholder='e.g., 1001'
																	value={form.values.cid}
																	onChange={form.handleChange}
																	onBlur={form.handleBlur}
																	isDisabled={!baseFormik.values.user}
																	bg={colors.bgInput}
																	borderColor={colors.borderColor}
																	color={colors.headingText}
																	_placeholder={{ color: colors.mutedText }}
																	_focus={{
																		borderColor: colors.accentGold,
																		boxShadow: `0 0 0 1px ${colors.accentGold}`,
																	}}
																	_hover={{ borderColor: colors.accentGold }}
																/>
																<FormErrorMessage color={colors.badgeErrorText}>
																	{form.errors.cid}
																</FormErrorMessage>
															</FormControl>

															{canEditUsername && (
																<FormControl
																	isInvalid={
																		form.errors.username &&
																		form.touched.username
																	}
																>
																	<FormLabel fontWeight='medium' color={colors.labelColor}>Username</FormLabel>
																	<Input
																		name='username'
																		placeholder='e.g., user1001'
																		value={form.values.username}
																		onChange={form.handleChange}
																		onBlur={form.handleBlur}
																		isDisabled={!baseFormik.values.user}
																		bg={colors.bgInput}
																		borderColor={colors.borderColor}
																		color={colors.headingText}
																		_placeholder={{ color: colors.mutedText }}
																		_focus={{
																			borderColor: colors.accentGold,
																			boxShadow: `0 0 0 1px ${colors.accentGold}`,
																		}}
																		_hover={{ borderColor: colors.accentGold }}
																		autoComplete='new-username'
																	/>
																	<FormErrorMessage color={colors.badgeErrorText}>
																		{form.errors.username}
																	</FormErrorMessage>
																</FormControl>
															)}
														</HStack>

														<HStack
															flexDir={{ base: 'column', lg: 'row' }}
															gap={{ base: 0, lg: 2 }}
															align='flex-start'
														>
															<FormControl
																isInvalid={
																	form.errors.domain && form.touched.domain
																}
															>
																<FormLabel fontWeight='medium' color={colors.labelColor}>Domain</FormLabel>
																<Input
																	name='domain'
																	placeholder='e.g., call.weam.info'
																	value={form.values.domain}
																	onChange={form.handleChange}
																	onBlur={form.handleBlur}
																	isDisabled={!baseFormik.values.user}
																	bg={colors.bgInput}
																	borderColor={colors.borderColor}
																	color={colors.headingText}
																	_placeholder={{ color: colors.mutedText }}
																	_focus={{
																		borderColor: colors.accentGold,
																		boxShadow: `0 0 0 1px ${colors.accentGold}`,
																	}}
																	_hover={{ borderColor: colors.accentGold }}
																/>
																<FormErrorMessage color={colors.badgeErrorText}>
																	{form.errors.domain}
																</FormErrorMessage>
															</FormControl>

															<FormControl
																isInvalid={
																	form.errors.port && form.touched.port
																}
															>
																<FormLabel fontWeight='medium' color={colors.labelColor}>Port</FormLabel>
																<Input
																	name='port'
																	placeholder='e.g., 5060'
																	value={form.values.port}
																	onChange={form.handleChange}
																	onBlur={form.handleBlur}
																	isDisabled={!baseFormik.values.user}
																	bg={colors.bgInput}
																	borderColor={colors.borderColor}
																	color={colors.headingText}
																	_placeholder={{ color: colors.mutedText }}
																	_focus={{
																		borderColor: colors.accentGold,
																		boxShadow: `0 0 0 1px ${colors.accentGold}`,
																	}}
																	_hover={{ borderColor: colors.accentGold }}
																/>
																<FormErrorMessage color={colors.badgeErrorText}>
																	{form.errors.port}
																</FormErrorMessage>
															</FormControl>
														</HStack>

														<FormControl
															isInvalid={
																form.errors.password && form.touched.password
															}
														>
															<FormLabel fontWeight='medium' color={colors.labelColor}>Password</FormLabel>
															<InputGroup isDisabled={!baseFormik.values.user}>
																<Input
																	name='password'
																	type={showPassword ? 'text' : 'password'}
																	placeholder='Password'
																	value={form.values.password}
																	onChange={form.handleChange}
																	onBlur={form.handleBlur}
																	isDisabled={!baseFormik.values.user}
																	bg={colors.bgInput}
																	borderColor={colors.borderColor}
																	color={colors.headingText}
																	_placeholder={{ color: colors.mutedText }}
																	_focus={{
																		borderColor: colors.accentGold,
																		boxShadow: `0 0 0 1px ${colors.accentGold}`,
																	}}
																	_hover={{ borderColor: colors.accentGold }}
																	autoComplete='new-password'
																/>
																<InputRightElement width='3rem'>
																	<IconButton
																		h='1.75rem'
																		size='sm'
																		onClick={() =>
																			setShowPassword(!showPassword)
																		}
																		variant='ghost'
																		icon={
																			showPassword ? (
																				<ViewOffIcon />
																			) : (
																				<ViewIcon />
																			)
																		}
																		aria-label={
																			showPassword
																				? 'Hide password'
																				: 'Show password'
																		}
																		color={colors.bodyText}
																		_hover={{ color: colors.accentGold }}
																	/>
																</InputRightElement>
															</InputGroup>
															<FormErrorMessage color={colors.badgeErrorText}>
																{form.errors.password}
															</FormErrorMessage>
														</FormControl>
													</VStack>
												</form>
											</TabPanel>
										);
									})}
								</TabPanels>
							</Tabs>
						</Box>
					</VStack>
				</ModalBody>

				<ModalFooter
					position='sticky'
					bottom='0'
					bg={colors.footerBg}
					borderTop='1px solid'
					borderColor={colors.borderColor}
					py={3}
					px={5}
					zIndex='10'
					justifyContent='flex-end'
				>
					<Flex gap={3}>
						<Button
							variant='outline'
							onClick={handleClose}
							isDisabled={isCreating || isUpdating}
							borderRadius='md'
							fontSize={{ base: 'xs', md: 'md' }}
						>
							Cancel
						</Button>
						<Button
							variant='brand'
							onClick={handleFinalSubmit}
							isDisabled={!isFinalSaveEnabled()}
							isLoading={isCreating || isUpdating}
							borderRadius='md'
							fontSize={{ base: 'xs', md: 'md' }}
						>
							Save All
						</Button>
					</Flex>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ManageCallSetting;