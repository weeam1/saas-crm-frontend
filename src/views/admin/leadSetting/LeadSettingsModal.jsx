// // import {
// // 	Modal,
// // 	ModalOverlay,
// // 	ModalContent,
// // 	ModalHeader,
// // 	ModalBody,
// // 	ModalFooter,
// // 	ModalCloseButton,
// // 	Button,
// // 	Switch,
// // 	FormControl,
// // 	FormLabel,
// // 	FormHelperText,
// // 	Input,
// // 	IconButton,
// // 	VStack,
// // 	HStack,
// // 	Text,
// // 	Spinner,
// // 	useDisclosure,
// // 	useToast,
// // 	Divider,
// // 	Box,
// // } from '@chakra-ui/react';
// // import { SettingsIcon } from '@chakra-ui/icons';
// // import { useEffect, useState } from 'react';
// // import { useCreateItemMutation, useFetchItemsQuery } from 'api/apiSlice';
// // import { toast } from 'react-toastify';

// // const LeadSettingsModal = () => {
// // 	const { isOpen, onOpen, onClose } = useDisclosure();

// // 	// Fetch
// // 	const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
// // 		{ path: '/lead-settings' },
// // 		{ skip: !isOpen },
// // 	);

// // 	// Update
// // 	const [updateSettings, { isLoading: isUpdating }] = useCreateItemMutation();

// // 	const [autoAssign, setAutoAssign] = useState(false);
// // 	const [timeout, setTimeoutValue] = useState(10000);

// // 	// Sync server → form
// // 	useEffect(() => {
// // 		if (data) {
// // 			setAutoAssign(data?.doc?.freshLeadAutoAssign ?? false);
// // 			setTimeoutValue(data?.doc?.freshLeadTierTimeout ?? 10000);
// // 		}
// // 	}, [data]);

// // 	const seconds = Math.floor(timeout / 1000);

// // 	const handleSave = async () => {
// // 		if (timeout < 5000) {
// // 			toast.error('Response window must be at least 5 seconds.');
// // 			return;
// // 		}

// // 		try {
// // 			await updateSettings({
// // 				path: '/lead-settings',
// // 				body: {
// // 					freshLeadAutoAssign: autoAssign,
// // 					freshLeadTierTimeout: Number(timeout),
// // 				},
// // 			}).unwrap();

// // 			toast.success('Lead settings updated.');
// // 			refetch();
// // 			onClose();
// // 		} catch (error) {
// // 			toast.error('Failed to update settings.');
// // 		}
// // 	};

// // 	return (
// // 		<>
// // 			<IconButton
// // 				icon={<SettingsIcon />}
// // 				aria-label='Lead Settings'
// // 				variant='ghost'
// // 				onClick={onOpen}
// // 			/>

// // 			<Modal isOpen={isOpen} onClose={onClose} isCentered size='md'>
// // 				<ModalOverlay />
// // 				<ModalContent borderRadius='xl'>
// // 					<ModalHeader>Lead Settings</ModalHeader>
// // 					<ModalCloseButton />

// // 					<ModalBody>
// // 						{isLoading || isFetching ? (
// // 							<Box textAlign='center' py={10}>
// // 								<Spinner />
// // 							</Box>
// // 						) : (
// // 							<VStack spacing={6} align='stretch'>
// // 								{/* Auto Assign */}
// // 								<FormControl
// // 									display='flex'
// // 									alignItems='center'
// // 									justifyContent='space-between'
// // 								>
// // 									<VStack align='start' spacing={1}>
// // 										<FormLabel mb='0'>Instantly Assign Lead</FormLabel>
// // 										<FormHelperText>
// // 											Automatically assign the lead to the first eligible agent
// // 											without waiting.
// // 										</FormHelperText>
// // 									</VStack>

// // 									<Switch
// // 										colorScheme='brand'
// // 										isChecked={autoAssign}
// // 										onChange={(e) => setAutoAssign(e.target.checked)}
// // 									/>
// // 								</FormControl>

// // 								<Divider />

// // 								{/* Timeout */}
// // 								<FormControl>
// // 									<FormLabel>Agent Response Window</FormLabel>
// // 									<Input
// // 										type='number'
// // 										value={timeout}
// // 										onChange={(e) => setTimeoutValue(Number(e.target.value))}
// // 										placeholder='Enter milliseconds'
// // 									/>
// // 									<FormHelperText>
// // 										Time before moving the lead to the next tier.
// // 										<Text fontWeight='semibold'>{seconds} seconds</Text>
// // 									</FormHelperText>
// // 								</FormControl>
// // 							</VStack>
// // 						)}
// // 					</ModalBody>

// // 					<ModalFooter>
// // 						<HStack spacing={3}>
// // 							<Button variant='ghost' onClick={onClose}>
// // 								Cancel
// // 							</Button>
// // 							<Button
// // 								colorScheme='brand'
// // 								onClick={handleSave}
// // 								isLoading={isUpdating}
// // 							>
// // 								Save Changes
// // 							</Button>
// // 						</HStack>
// // 					</ModalFooter>
// // 				</ModalContent>
// // 			</Modal>
// // 		</>
// // 	);
// // };

// // export default LeadSettingsModal;

// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalBody,
// 	ModalFooter,
// 	ModalCloseButton,
// 	Button,
// 	Switch,
// 	FormControl,
// 	FormLabel,
// 	FormHelperText,
// 	Input,
// 	InputGroup,
// 	InputRightElement,
// 	IconButton,
// 	VStack,
// 	HStack,
// 	Text,
// 	Spinner,
// 	useDisclosure,
// 	Select,
// 	Box,
// 	Badge,
// 	Flex,
// 	Tooltip,
// 	Alert,
// 	AlertIcon,
// 	Divider,
// 	ListItem,
// 	List,
// } from '@chakra-ui/react';
// import { SettingsIcon, InfoIcon } from '@chakra-ui/icons';
// import { useEffect, useState } from 'react';
// import { useCreateItemMutation, useFetchItemsQuery } from 'api/apiSlice';
// import { toast } from 'react-toastify';

// const LeadSettingsModal = () => {
// 	const { isOpen, onOpen, onClose } = useDisclosure();

// 	// Fetch
// 	const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
// 		{ path: '/lead-settings' },
// 		{ skip: !isOpen },
// 	);

// 	// Update
// 	const [updateSettings, { isLoading: isUpdating }] = useCreateItemMutation();

// 	const [autoAssign, setAutoAssign] = useState(false);
// 	const [timeoutValue, setTimeoutValue] = useState(10000);
// 	const [freshLeadNotification, setFreshLeadNotification] = useState(false);
// 	const [timeUnit, setTimeUnit] = useState('seconds');
// 	const [inputValue, setInputValue] = useState(10);

// 	// Time conversion constants
// 	const timeConversions = {
// 		seconds: 1,
// 		minutes: 60,
// 	};

// 	// Sync server → form
// 	useEffect(() => {
// 		if (data) {
// 			const tierTimeout = data?.doc?.freshLeadTierTimeout ?? 10000;
// 			const seconds = Math.floor(tierTimeout / 1000);

// 			// Determine best unit for display
// 			if (seconds >= 60 && seconds % 60 === 0) {
// 				setTimeUnit('minutes');
// 				setInputValue(seconds / 60);
// 			} else {
// 				setTimeUnit('seconds');
// 				setInputValue(seconds);
// 			}

// 			setTimeoutValue(tierTimeout);
// 			setAutoAssign(data?.doc?.freshLeadAutoAssign ?? false);
// 			setFreshLeadNotification(data?.doc?.freshLeadNotification ?? false);
// 		}
// 	}, [data]);

// 	// Convert UI value to milliseconds
// 	const getTimeoutInMs = () => {
// 		const multiplier = timeConversions[timeUnit] * 1000;
// 		return inputValue * multiplier;
// 	};

// 	// Format for display
// 	const getFormattedTime = () => {
// 		const seconds = Math.floor(timeoutValue / 1000);
// 		if (seconds >= 60) {
// 			const mins = Math.floor(seconds / 60);
// 			const remainingSecs = seconds % 60;
// 			return remainingSecs > 0
// 				? `${mins} min ${remainingSecs} sec`
// 				: `${mins} min`;
// 		}
// 		return `${seconds} sec`;
// 	};

// 	const handleTimeUnitChange = (e) => {
// 		const newUnit = e.target.value;
// 		const currentSeconds = inputValue * timeConversions[timeUnit];

// 		// Convert to new unit
// 		if (newUnit === 'minutes') {
// 			setInputValue(currentSeconds / 60);
// 		} else {
// 			setInputValue(currentSeconds);
// 		}

// 		setTimeUnit(newUnit);
// 	};

// 	const handleInputChange = (e) => {
// 		const value = parseInt(e.target.value) || 0;
// 		setInputValue(value);

// 		// Update actual timeout in ms
// 		const multiplier = timeConversions[timeUnit] * 1000;
// 		setTimeoutValue(value * multiplier);
// 	};

// 	const handleSave = async () => {
// 		const timeoutMs = getTimeoutInMs();

// 		if (timeoutMs < 5000) {
// 			toast.error('Response window must be at least 5 seconds');
// 			return;
// 		}

// 		if (timeoutMs > 3600000) {
// 			// 1 hour max
// 			toast.error('⏱Response window cannot exceed 1 hour');
// 			return;
// 		}

// 		try {
// 			await updateSettings({
// 				path: '/lead-settings',
// 				body: {
// 					freshLeadNotification,
// 					freshLeadAutoAssign: autoAssign,
// 					freshLeadTierTimeout: timeoutMs,
// 				},
// 			}).unwrap();

// 			toast.success('Lead settings updated successfully');
// 			// refetch();
// 			onClose();
// 		} catch (error) {
// 			toast.error('Failed to update settings');
// 		}
// 	};

// 	return (
// 		<>
// 			<Tooltip label='Lead Distribution Settings' hasArrow>
// 				<IconButton
// 					icon={<SettingsIcon />}
// 					aria-label='Lead Settings'
// 					variant='ghost'
// 					onClick={onOpen}
// 					size='sm'
// 					_hover={{ bg: 'gray.100' }}
// 				/>
// 			</Tooltip>

// 			<Modal
// 				isOpen={isOpen}
// 				onClose={onClose}
// 				isCentered
// 				size='lg'
// 				scrollBehavior='inside'
// 			>
// 				<ModalOverlay backdropFilter='blur(4px)' />
// 				<ModalContent borderRadius='2xl'>
// 					<ModalHeader borderBottomWidth='1px' py={4}>
// 						<VStack align='start' spacing={1}>
// 							<Text fontSize='xl'>⚙️ Lead Distribution Settings</Text>
// 							<Text fontSize='sm' color='gray.500' fontWeight='normal'>
// 								Configure how leads are assigned to agents
// 							</Text>
// 						</VStack>
// 					</ModalHeader>
// 					<ModalCloseButton top={4} />

// 					<ModalBody py={6}>
// 						{isLoading || isFetching ? (
// 							<Flex
// 								direction='column'
// 								align='center'
// 								justify='center'
// 								py={10}
// 								gap={4}
// 							>
// 								<Spinner size='xl' thickness='3px' color='brand.500' />
// 								<Text color='gray.500'>Loading settings...</Text>
// 							</Flex>
// 						) : (
// 							<VStack spacing={8} align='stretch'>
// 								{/* Fresh lead notifcation */}
// 								<Box p={4} borderWidth='1px' borderRadius='xl' bg='navy.50'>
// 									<FormControl display='flex' alignItems='center'>
// 										<VStack align='start' spacing={0} flex={1}>
// 											<HStack>
// 												<FormLabel mb='0' fontWeight='semibold'>
// 													Fresh Lead Notifications
// 												</FormLabel>
// 												<Tooltip label='Enable to receive notifications whenever a new lead is available'>
// 													<InfoIcon color='gray.400' boxSize={3} />
// 												</Tooltip>
// 											</HStack>
// 											<FormHelperText mt={1}>
// 												Toggle to receive alerts for new leads.
// 											</FormHelperText>
// 										</VStack>

// 										<Switch
// 											size='md'
// 											colorScheme='brand'
// 											isChecked={freshLeadNotification}
// 											onChange={(e) =>
// 												setFreshLeadNotification(e.target.checked)
// 											}
// 										/>
// 									</FormControl>
// 								</Box>

// 								{/* Auto Assign Card */}
// 								<Box p={4} borderWidth='1px' borderRadius='xl' bg='gray.50'>
// 									<FormControl display='flex' alignItems='center'>
// 										<VStack align='start' spacing={0} flex={1}>
// 											<HStack>
// 												<FormLabel mb='0' fontWeight='semibold'>
// 													Instant Lead Assignment
// 												</FormLabel>
// 												<Tooltip label='When enabled, leads are instantly assigned to the first eligible agent'>
// 													<InfoIcon color='gray.400' boxSize={3} />
// 												</Tooltip>
// 											</HStack>
// 											<FormHelperText mt={1}>
// 												Automatically assign without waiting period
// 											</FormHelperText>
// 										</VStack>

// 										<Switch
// 											size='md'
// 											colorScheme='brand'
// 											isChecked={autoAssign}
// 											onChange={(e) => setAutoAssign(e.target.checked)}
// 										/>
// 									</FormControl>
// 								</Box>

// 								{/* Timeout Settings Card */}
// 								<Box p={4} borderWidth='1px' borderRadius='xl'>
// 									<VStack align='stretch' spacing={4}>
// 										<HStack justify='space-between'>
// 											<VStack align='start' spacing={0}>
// 												<Text fontWeight='semibold'>Agent Response Window</Text>
// 												<Text fontSize='sm' color='gray.500'>
// 													Time before moving to next tier
// 												</Text>
// 											</VStack>
// 											{/* <Badge colorScheme='purple' p={2} borderRadius='md'>
// 												Current: {getFormattedTime()}
// 											</Badge> */}
// 										</HStack>

// 										<HStack spacing={3}>
// 											<InputGroup size='md'>
// 												<Input
// 													type='number'
// 													value={inputValue}
// 													onChange={handleInputChange}
// 													placeholder='Enter value'
// 													min={timeUnit === 'seconds' ? 5 : 0.1}
// 													step={timeUnit === 'seconds' ? 1 : 0.5}
// 													borderRightRadius={0}
// 												/>
// 												<InputRightElement width='auto' pr={1}>
// 													<Text color='gray.500' fontSize='sm'>
// 														{timeUnit === 'seconds' ? 'sec' : 'min'}
// 													</Text>
// 												</InputRightElement>
// 											</InputGroup>

// 											<Select
// 												value={timeUnit}
// 												onChange={handleTimeUnitChange}
// 												width='200px'
// 												size='md'
// 											>
// 												<option value='seconds'>Seconds</option>
// 												<option value='minutes'>Minutes</option>
// 											</Select>
// 										</HStack>

// 										{/* Warning for very short timeouts */}
// 										{timeoutValue < 10000 && timeoutValue >= 5000 && (
// 											<Alert status='warning' size='sm' borderRadius='md'>
// 												<AlertIcon />
// 												<Text fontSize='sm'>
// 													Short response window may lead to frequent tier
// 													movements
// 												</Text>
// 											</Alert>
// 										)}

// 										{timeoutValue < 5000 && (
// 											<Alert status='error' size='sm' borderRadius='md'>
// 												<AlertIcon />
// 												<Text fontSize='sm'>
// 													Response window too short! Minimum 5 seconds required
// 												</Text>
// 											</Alert>
// 										)}
// 									</VStack>
// 								</Box>

// 								{/* Info Box */}
// 								<Alert status='info' variant='left-accent' borderRadius='lg'>
// 									{/* <AlertIcon /> */}
// 									<VStack align='start' spacing={2}>
// 										<Text fontWeight='semibold'>How it works:</Text>
// 										<List spacing={1} styleType='decimal' pl={4}>
// 											<ListItem>
// 												Leads are offered to agents based on priority, starting
// 												with the highest-rated group.
// 											</ListItem>
// 											<ListItem>
// 												Each group has <strong>{getFormattedTime()}</strong> to
// 												respond.
// 											</ListItem>
// 											<ListItem>
// 												If no response is received, the lead is automatically
// 												offered to the next group.
// 											</ListItem>
// 										</List>
// 									</VStack>
// 								</Alert>
// 							</VStack>
// 						)}
// 					</ModalBody>

// 					<ModalFooter borderTopWidth='1px' py={4}>
// 						<HStack spacing={3} w='full' justify='flex-end'>
// 							<Button variant='ghost' onClick={onClose} size='lg'>
// 								Cancel
// 							</Button>
// 							<Button
// 								colorScheme='brand'
// 								onClick={handleSave}
// 								isLoading={isUpdating}
// 								loadingText='Saving...'
// 								size='lg'
// 								px={8}
// 								isDisabled={timeoutValue < 5000}
// 								_hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
// 								transition='all 0.2s'
// 							>
// 								Save Changes
// 							</Button>
// 						</HStack>
// 					</ModalFooter>
// 				</ModalContent>
// 			</Modal>
// 		</>
// 	);
// };

// export default LeadSettingsModal;

import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	Button,
	Switch,
	FormControl,
	FormLabel,
	FormHelperText,
	Input,
	InputGroup,
	InputRightElement,
	IconButton,
	VStack,
	HStack,
	Text,
	Spinner,
	useDisclosure,
	Select,
	Flex,
	Box,
	Tooltip,
	Alert,
	AlertIcon,
	Divider,
} from '@chakra-ui/react';
import { SettingsIcon, InfoIcon } from '@chakra-ui/icons';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useCreateItemMutation, useFetchItemsQuery } from 'api/apiSlice';
import { toast } from 'react-toastify';

const LeadSettingsModal = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	// Fetch
	const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
		{ path: '/lead-settings' },
		{ skip: !isOpen },
	);

	// Update
	const [updateSettings, { isLoading: isUpdating }] = useCreateItemMutation();

	const [autoAssign, setAutoAssign] = useState(false);
	const [timeoutValue, setTimeoutValue] = useState(10000);
	const [freshLeadNotification, setFreshLeadNotification] = useState(false);
	const [timeUnit, setTimeUnit] = useState('seconds');
	const [inputValue, setInputValue] = useState(10);

	// Time conversion constants
	const timeConversions = {
		seconds: 1,
		minutes: 60,
	};

	// Format current time for display
	const getFormattedTime = useCallback(() => {
		const seconds = Math.floor(timeoutValue / 1000);
		if (seconds >= 60) {
			const mins = Math.floor(seconds / 60);
			const remainingSecs = seconds % 60;
			return remainingSecs > 0
				? `${mins}m ${remainingSecs}s`
				: `${mins} minute${mins > 1 ? 's' : ''}`;
		}
		return `${seconds} second${seconds !== 1 ? 's' : ''}`;
	}, [timeoutValue]);

	// Sync server → form
	useEffect(() => {
		if (data) {
			const tierTimeout = data?.doc?.freshLeadTierTimeout ?? 10000;
			const seconds = Math.floor(tierTimeout / 1000);

			// Determine best unit for display
			if (seconds >= 60 && seconds % 60 === 0) {
				setTimeUnit('minutes');
				setInputValue(seconds / 60);
			} else {
				setTimeUnit('seconds');
				setInputValue(seconds);
			}

			setTimeoutValue(tierTimeout);
			setAutoAssign(data?.doc?.freshLeadAutoAssign ?? false);
			setFreshLeadNotification(data?.doc?.freshLeadNotification ?? false);
		}
	}, [data]);

	// Convert UI value to milliseconds
	const getTimeoutInMs = useCallback(() => {
		const multiplier = timeConversions[timeUnit] * 1000;
		return inputValue * multiplier;
	}, [timeUnit, inputValue]);

	const handleTimeUnitChange = useCallback(
		(e) => {
			const newUnit = e.target.value;
			const currentSeconds = inputValue * timeConversions[timeUnit];

			if (newUnit === 'minutes') {
				setInputValue(currentSeconds / 60);
			} else {
				setInputValue(currentSeconds);
			}
			setTimeUnit(newUnit);
		},
		[inputValue, timeUnit, timeConversions],
	);

	const handleInputChange = useCallback(
		(e) => {
			const value = parseInt(e.target.value) || 0;
			setInputValue(value);

			const multiplier = timeConversions[timeUnit] * 1000;
			setTimeoutValue(value * multiplier);
		},
		[timeUnit, timeConversions],
	);

	const handleSave = useCallback(async () => {
		const timeoutMs = getTimeoutInMs();

		if (timeoutMs < 5000) {
			toast.error('Response window must be at least 5 seconds');
			return;
		}

		if (timeoutMs > 3600000) {
			toast.error('Response window cannot exceed 1 hour');
			return;
		}

		try {
			await updateSettings({
				path: '/lead-settings',
				body: {
					freshLeadNotification,
					freshLeadAutoAssign: autoAssign,
					freshLeadTierTimeout: timeoutMs,
				},
			}).unwrap();

			toast.success('Lead settings updated successfully');
			refetch();
			onClose();
		} catch (error) {
			toast.error('Failed to update settings');
		}
	}, [
		getTimeoutInMs,
		freshLeadNotification,
		autoAssign,
		updateSettings,
		refetch,
		onClose,
	]);

	const isTimeoutValid = useMemo(() => {
		return timeoutValue >= 5000;
	}, [timeoutValue]);

	return (
		<>
			<Tooltip label='Lead Distribution Settings' placement='top' hasArrow>
				<IconButton
					icon={<SettingsIcon />}
					aria-label='Lead Settings'
					variant='ghost'
					onClick={onOpen}
					size='sm'
					borderRadius='lg'
					color='text.body'
					_hover={{ bg: 'bg.elevated', color: 'gold.primary' }}
				/>
			</Tooltip>

			<Modal
				isOpen={isOpen}
				onClose={onClose}
				isCentered
				size='lg'
				scrollBehavior='inside'
			>
				<ModalOverlay backdropFilter='blur(4px)' />
				<ModalContent
					bg='bg.surface'
					borderRadius='xl'
					border='1px solid'
					borderColor='border.default'
					boxShadow='card'
				>
					<ModalHeader
						borderBottom='1px solid'
						borderBottomColor='border.default'
						py={4}
					>
						<VStack align='start' spacing={1}>
							<HStack spacing={2}>
								{/* <Box w='8px' h='8px' bg='gold.primary' borderRadius='full' /> */}
								<Text fontSize='xl' fontWeight='bold' color='text.heading'>
									Lead Distribution Settings
								</Text>
							</HStack>
							<Text fontSize='sm' color='text.muted' fontWeight='normal'>
								Configure how leads are assigned to agents
							</Text>
						</VStack>
					</ModalHeader>
					<ModalCloseButton
						top={4}
						color='text.muted'
						_hover={{ color: 'gold.primary' }}
					/>

					<ModalBody py={6}>
						{isLoading || isFetching ? (
							<Flex
								direction='column'
								align='center'
								justify='center'
								py={10}
								gap={4}
							>
								<Spinner size='xl' thickness='3px' color='gold.primary' />
								<Text color='text.muted'>Loading settings...</Text>
							</Flex>
						) : (
							<VStack spacing={6} align='stretch'>
								{/* Fresh Lead Notifications */}
								<Box
									p={4}
									borderRadius='lg'
									bg='bg.elevated'
									border='1px solid'
									borderColor='border.subtle'
								>
									<FormControl display='flex' alignItems='center'>
										<VStack align='start' spacing={1} flex={1}>
											<HStack spacing={2}>
												<FormLabel
													mb='0'
													fontWeight='semibold'
													color='text.heading'
												>
													Fresh Lead Notifications
												</FormLabel>
												<Tooltip
													label='Enable to receive notifications whenever a new lead is available'
													placement='top'
													hasArrow
												>
													<InfoIcon color='text.muted' boxSize={3} />
												</Tooltip>
											</HStack>
											<FormHelperText mt={1} color='text.muted' fontSize='xs'>
												Toggle to receive alerts for new leads
											</FormHelperText>
										</VStack>

										<Switch
											size='md'
											colorScheme='brand'
											isChecked={freshLeadNotification}
											onChange={(e) =>
												setFreshLeadNotification(e.target.checked)
											}
										/>
									</FormControl>
								</Box>

								{/* Auto Assign */}
								<Box
									p={4}
									borderRadius='lg'
									bg='bg.elevated'
									border='1px solid'
									borderColor='border.subtle'
								>
									<FormControl display='flex' alignItems='center'>
										<VStack align='start' spacing={1} flex={1}>
											<HStack spacing={2}>
												<FormLabel
													mb='0'
													fontWeight='semibold'
													color='text.heading'
												>
													Instant Lead Assignment
												</FormLabel>
												<Tooltip
													label='When enabled, leads are instantly assigned to the first eligible agent'
													placement='top'
													hasArrow
												>
													<InfoIcon color='text.muted' boxSize={3} />
												</Tooltip>
											</HStack>
											<FormHelperText mt={1} color='text.muted' fontSize='xs'>
												Automatically assign without waiting period
											</FormHelperText>
										</VStack>

										<Switch
											size='md'
											colorScheme='brand'
											isChecked={autoAssign}
											onChange={(e) => setAutoAssign(e.target.checked)}
										/>
									</FormControl>
								</Box>

								{/* Response Window */}
								<Box
									p={4}
									borderRadius='lg'
									bg='bg.elevated'
									border='1px solid'
									borderColor='border.subtle'
								>
									<VStack align='stretch' spacing={4}>
										<HStack justify='space-between'>
											<VStack align='start' spacing={1}>
												<HStack spacing={2}>
													<Text fontWeight='semibold' color='text.heading'>
														Agent Response Window
													</Text>
													<Tooltip
														label='Time before moving lead to next tier group'
														placement='top'
														hasArrow
													>
														<InfoIcon color='text.muted' boxSize={3} />
													</Tooltip>
												</HStack>
												<Text fontSize='xs' color='text.accent'>
													Current: {getFormattedTime()}
												</Text>
											</VStack>
										</HStack>

										<HStack spacing={3}>
											<InputGroup size='md'>
												<Input
													type='number'
													value={inputValue}
													onChange={handleInputChange}
													placeholder='Enter value'
													min={timeUnit === 'seconds' ? 5 : 0.1}
													step={timeUnit === 'seconds' ? 1 : 0.5}
													bg='bg.input'
													borderColor='border.default'
													color='text.heading'
													borderRightRadius={0}
													_focus={{
														borderColor: 'gold.primary',
														boxShadow: '0 0 0 1px #D4AF37',
													}}
												/>
												<InputRightElement width='auto' pr={2}>
													<Text color='text.muted' fontSize='sm'>
														{timeUnit === 'seconds' ? 'sec' : 'min'}
													</Text>
												</InputRightElement>
											</InputGroup>

											<Select
												value={timeUnit}
												onChange={handleTimeUnitChange}
												width='180px'
												size='md'
												bg='bg.input'
												borderColor='border.default'
												color='text.heading'
												_focus={{
													borderColor: 'gold.primary',
													boxShadow: '0 0 0 1px #D4AF37',
												}}
											>
												<option
													style={{ background: '#10273A', color: '#FFFFFF' }}
													value='seconds'
												>
													Seconds
												</option>
												<option
													style={{ background: '#10273A', color: '#FFFFFF' }}
													value='minutes'
												>
													Minutes
												</option>
											</Select>
										</HStack>

										{/* Warning Alerts */}
										{timeoutValue < 10000 && timeoutValue >= 5000 && (
											<Alert
												status='warning'
												size='sm'
												borderRadius='md'
												bg='rgba(245, 158, 11, 0.1)'
												borderColor='orange.400'
											>
												<AlertIcon color='orange.400' />
												<Text fontSize='xs' color='orange.300'>
													Short response window may lead to frequent tier
													movements
												</Text>
											</Alert>
										)}

										{timeoutValue < 5000 && (
											<Alert
												status='error'
												size='sm'
												borderRadius='md'
												bg='rgba(229, 62, 62, 0.1)'
												borderColor='red.400'
											>
												<AlertIcon color='red.400' />
												<Text fontSize='xs' color='red.300'>
													Response window too short! Minimum 5 seconds required
												</Text>
											</Alert>
										)}
									</VStack>
								</Box>

								{/* Info Box */}
								<Alert
									status='info'
									variant='subtle'
									borderRadius='lg'
									bg='rgba(212, 175, 55, 0.05)'
									borderLeft='3px solid'
									borderLeftColor='gold.primary'
								>
									<VStack align='start' spacing={2} w='100%'>
										<Text
											fontSize='xs'
											fontWeight='semibold'
											color='text.accent'
										>
											How it works
										</Text>
										<Divider borderColor='border.subtle' />
										<Text fontSize='12px' color='text.body'>
											Leads are offered to agents based on priority, starting
											with the highest-rated group. Each group has{' '}
											<strong>{getFormattedTime()}</strong> to respond. If no
											response is received, the lead is automatically offered to
											the next group.
										</Text>
									</VStack>
								</Alert>
							</VStack>
						)}
					</ModalBody>

					<ModalFooter
						borderTop='1px solid'
						borderTopColor='border.default'
						py={4}
					>
						<HStack spacing={3} w='full' justify='flex-end'>
							<Button
								variant='ghost'
								onClick={onClose}
								color='text.body'
								_hover={{ bg: 'bg.elevated', color: 'gold.primary' }}
							>
								Cancel
							</Button>
							<Button
								variant='brand'
								onClick={handleSave}
								isLoading={isUpdating}
								loadingText='Saving...'
								px={6}
								isDisabled={!isTimeoutValid}
							>
								Save Changes
							</Button>
						</HStack>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default LeadSettingsModal;
