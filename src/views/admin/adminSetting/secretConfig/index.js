// import React, { useState, useMemo, useEffect } from 'react';
// import {
// 	Box,
// 	Container,
// 	Heading,
// 	Text,
// 	Button,
// 	Table,
// 	Thead,
// 	Tbody,
// 	Tr,
// 	Th,
// 	Td,
// 	Badge,
// 	IconButton,
// 	useDisclosure,
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalFooter,
// 	ModalBody,
// 	ModalCloseButton,
// 	FormControl,
// 	FormLabel,
// 	Input,
// 	Textarea,
// 	Select,
// 	HStack,
// 	VStack,
// 	Tooltip,
// 	Spinner,
// 	InputGroup,
// 	InputLeftElement,
// 	InputRightElement,
// 	Tag,
// 	TagLabel,
// 	Flex,
// 	Divider,
// 	Accordion,
// 	AccordionItem,
// 	AccordionButton,
// 	AccordionPanel,
// 	AccordionIcon,
// 	Stat,
// 	StatLabel,
// 	StatNumber,
// 	StatHelpText,
// 	SimpleGrid,
// 	Avatar,
// 	AvatarGroup,
// 	Menu,
// 	MenuButton,
// 	MenuList,
// 	MenuItem,
// 	Portal,
// 	Breadcrumb,
// 	BreadcrumbItem,
// 	BreadcrumbLink,
// 	Progress,
// 	Icon,
// 	Switch,
// } from '@chakra-ui/react';
// import {
// 	EditIcon,
// 	SearchIcon,
// 	AddIcon,
// 	ChevronDownIcon,
// 	ViewIcon,
// 	ViewOffIcon,
// 	CopyIcon,
// 	LockIcon,
// 	UnlockIcon,
// 	TimeIcon,
// 	CheckCircleIcon,
// 	WarningIcon,
// 	InfoIcon,
// 	StarIcon,
// 	CloseIcon,
// 	ExternalLinkIcon,
// } from '@chakra-ui/icons';
// import { FiDatabase, FiLayers, FiGlobe, FiActivity } from 'react-icons/fi';

// import { toast } from 'react-toastify';
// import { useFetchItemsQuery, useUpdateItemMutation } from 'api/apiSlice';
// import EditSecretModal from './EditSecretModal';
// import { getEnvironmentBadge, getServiceMeta } from './secretUtils';
// import SecretStatCard from './SecretStatCard';
// import AppButton from 'components/shared/AppButton';
// import { IoArrowBack } from 'react-icons/io5';
// import { Link, useNavigate } from 'react-router-dom';
// import { format } from 'date-fns';

// const SecretManager = () => {
// 	const [searchTerm, setSearchTerm] = useState('');
// 	const [selectedSecret, setSelectedSecret] = useState(null);
// 	const [visibleValues, setVisibleValues] = useState({});
// 	const [expandedServices, setExpandedServices] = useState([]);
// 	const [filterEnvironment, setFilterEnvironment] = useState('all');
// 	const { isOpen, onOpen, onClose } = useDisclosure();

// 	const navigate = useNavigate();

// 	// RTK Query hooks
// 	const {
// 		data: secretsData,
// 		isLoading,
// 		isFetching,
// 		error,
// 		refetch,
// 	} = useFetchItemsQuery(
// 		{
// 			path: '/secrets',
// 			params: {
// 				includeValue: true,
// 			},
// 		},
// 		{
// 			refetchOnMountOrArgChange: true,
// 			refetchOnFocus: true,
// 			refetchOnReconnect: true,
// 		},
// 	);

// 	const [updateSecret, { isLoading: isUpdating }] = useUpdateItemMutation();

// 	const services = secretsData?.doc || [];

// 	// Auto-expand services with content
// 	useEffect(() => {
// 		if (Object.keys(services).length > 0) {
// 			setExpandedServices(Object.keys(services));
// 		}
// 	}, [services]);

// 	const handleEdit = (secret) => {
// 		setSelectedSecret({ ...secret, newValue: secret.value });
// 		onOpen();
// 	};

// 	const handleSave = async () => {
// 		try {
// 			// if (!selectedSecret?.newValue) {
// 			// 	toast.warning('Please enter a value for the secret');
// 			// 	return;
// 			// }

// 			await updateSecret({
// 				path: `/secrets/${selectedSecret._id}`,
// 				body: { value: selectedSecret.newValue },
// 			}).unwrap();

// 			toast.success(
// 				<Box>
// 					<Text fontWeight='bold'>Secret Updated Successfully</Text>
// 					<Text fontSize='sm'>{selectedSecret.key} has been updated</Text>
// 				</Box>,
// 				{
// 					icon: <CheckCircleIcon color='green.500' />,
// 					position: 'top-right',
// 					autoClose: 3000,
// 				},
// 			);

// 			onClose();
// 			refetch();
// 		} catch (error) {
// 			toast.error(
// 				<Box>
// 					<Text fontWeight='bold'>Update Failed</Text>
// 					<Text fontSize='sm'>{error.data?.message || 'Please try again'}</Text>
// 				</Box>,
// 				{
// 					icon: <WarningIcon color='red.500' />,
// 					position: 'top-right',
// 					autoClose: 5000,
// 				},
// 			);
// 		}
// 	};

// 	const handleToggleStatus = async (secret) => {
// 		try {
// 			await updateSecret({
// 				path: `/secrets/${secret._id}`,
// 				body: { isEnabled: !secret.isEnabled },
// 			}).unwrap();

// 			toast.success(
// 				<Box>
// 					<Text fontWeight='bold'>Status Updated</Text>
// 					<Text fontSize='sm'>
// 						{secret.key} is now {secret.isEnabled ? 'Inactive' : 'Active'}
// 					</Text>
// 				</Box>,
// 				{
// 					position: 'top-right',
// 					autoClose: 3000,
// 				},
// 			);

// 			refetch();
// 		} catch (error) {
// 			toast.error(
// 				<Box>
// 					<Text fontWeight='bold'>Update Failed</Text>
// 					<Text fontSize='sm'>{error.data?.message || 'Please try again'}</Text>
// 				</Box>,
// 				{ position: 'top-right' },
// 			);
// 		}
// 	};

// 	const toggleVisibility = (id) => {
// 		setVisibleValues((prev) => ({
// 			...prev,
// 			[id]: !prev[id],
// 		}));
// 	};

// 	const copyToClipboard = async (secret) => {
// 		const value = secret?.value;

// 		if (!value) {
// 			toast.warning('Nothing to copy');
// 			return false;
// 		}

// 		try {
// 			// Modern API (secure context required)
// 			if (navigator.clipboard && window.isSecureContext) {
// 				await navigator.clipboard.writeText(value);
// 			} else {
// 				// Fallback for HTTP / legacy browsers
// 				const textarea = document.createElement('textarea');
// 				textarea.value = value;
// 				textarea.style.position = 'fixed';
// 				textarea.style.left = '-9999px';
// 				document.body.appendChild(textarea);
// 				textarea.focus();
// 				textarea.select();
// 				document.execCommand('copy');
// 				document.body.removeChild(textarea);
// 			}

// 			toast.success('Secret copied to clipboard', {
// 				autoClose: 1500,
// 			});

// 			return true;
// 		} catch (err) {
// 			console.error('Clipboard error:', err);
// 			toast.error('Copy failed');
// 			return false;
// 		}
// 	};

// 	if (error) {
// 		return (
// 			<Container maxW='1400px' py={8}>
// 				<Box
// 					bg='red.50'
// 					p={8}
// 					borderRadius='lg'
// 					textAlign='center'
// 					borderWidth='1px'
// 					borderColor='red.200'
// 				>
// 					<WarningIcon boxSize={12} color='red.500' mb={4} />
// 					<Heading size='md' color='red.700' mb={2}>
// 						Failed to Load Secrets
// 					</Heading>
// 					<Text color='red.600' mb={4}>
// 						{error.data?.message ||
// 							'Please check your connection and try again'}
// 					</Text>
// 					<Button colorScheme='red' onClick={refetch}>
// 						Retry
// 					</Button>
// 				</Box>
// 			</Container>
// 		);
// 	}

// 	return (
// 		<Box bg='white' minH='100vh' py={8} px={2}>
// 			<AppButton
// 				leftIcon={<IoArrowBack />}
// 				onClick={() => navigate('/admin-setting')}
// 			>
// 				Back
// 			</AppButton>
// 			<Box p={8}>
// 				<VStack spacing={2} align='stretch' mb={8}>
// 					<Flex justify='space-between' align='center' wrap='wrap' gap={4}>
// 						<Box>
// 							<Heading size='lg' color='gray.800'>
// 								Secret Configuration Manager
// 							</Heading>
// 							<Text color='gray.600' mt={1}>
// 								Manage and secure your application secrets across all
// 								environments
// 							</Text>
// 						</Box>

// 						<HStack spacing={3}>
// 							<Button
// 								variant='outline'
// 								onClick={refetch}
// 								isLoading={isFetching}
// 								loadingText='Refreshing'
// 							>
// 								Refresh
// 							</Button>
// 						</HStack>
// 					</Flex>

// 					{/* Stats Overview */}
// 					<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
// 						<SecretStatCard
// 							label='Total Secrets'
// 							value={secretsData?.totalKeys}
// 							subtext='Across all services'
// 							icon={FiDatabase}
// 							color='cyan'
// 						/>

// 						<SecretStatCard
// 							label='Services'
// 							value={secretsData?.totalServices}
// 							subtext='With secret management enabled'
// 							icon={FiLayers}
// 							color='green'
// 						/>
// 					</SimpleGrid>
// 					{/* Search and Filters */}
// 					<Box
// 						w='full'
// 						p={{ base: 2, md: 4 }}
// 						bg='gray.50'
// 						borderRadius='2xl'
// 						boxShadow='sm'
// 					>
// 						<VStack spacing={4} align='stretch'>
// 							{/* <Text fontWeight='semibold' fontSize='lg' color='gray.700'>
// 								Filter Secrets
// 							</Text> */}

// 							<Flex
// 								gap={4}
// 								wrap={{ base: 'wrap', md: 'nowrap' }}
// 								align='center'
// 								justify='space-between'
// 							>
// 								{/* Search Input */}
// 								<InputGroup flex={{ base: '1 1 100%', md: '0 0 400px' }}>
// 									<InputLeftElement pointerEvents='none'>
// 										<SearchIcon color='gray.400' />
// 									</InputLeftElement>

// 									<Input
// 										placeholder='Search by key env, or service...'
// 										value={searchTerm}
// 										onChange={(e) => setSearchTerm(e.target.value)}
// 										bg='white'
// 										borderColor='gray.200'
// 										_hover={{ borderColor: 'brand.300' }}
// 										_focus={{
// 											borderColor: 'brand.500',
// 											boxShadow: 'outline',
// 										}}
// 									/>

// 									{searchTerm && (
// 										<InputRightElement>
// 											<IconButton
// 												size='xs'
// 												variant='ghost'
// 												icon={<CloseIcon />}
// 												onClick={() => setSearchTerm('')}
// 												aria-label='Clear search'
// 											/>
// 										</InputRightElement>
// 									)}
// 								</InputGroup>

// 								{/* Filters & Result Badge */}
// 								<HStack
// 									spacing={3}
// 									flex={{ base: '1 1 100%', md: 'auto' }}
// 									justify={{ base: 'space-between', md: 'flex-start' }}
// 								>
// 									{/* <Select
// 										w={{ base: '48%', md: '180px' }}
// 										value={filterEnvironment}
// 										onChange={(e) => setFilterEnvironment(e.target.value)}
// 										bg='white'
// 										borderColor='gray.200'
// 										_hover={{ borderColor: 'brand.300' }}
// 										_focus={{ borderColor: 'brand.500', boxShadow: 'outline' }}
// 									>
// 										{environments.map((env) => (
// 											<option key={env} value={env}>
// 												{env === 'all'
// 													? 'All Environments'
// 													: env.charAt(0).toUpperCase() + env.slice(1)}
// 											</option>
// 										))}
// 									</Select> */}

// 									<Badge
// 										colorScheme='brand'
// 										px={3}
// 										py={1}
// 										borderRadius='full'
// 										ml={{ base: 0, md: 2 }}
// 									>
// 										{secretsData?.total} results
// 									</Badge>
// 								</HStack>
// 							</Flex>
// 						</VStack>
// 					</Box>
// 				</VStack>

// 				{/* Loading State */}
// 				{isLoading ? (
// 					<Box textAlign='center' py={12}>
// 						<Spinner size='xl' thickness='3px' color='brand.500' speed='0.3s' />
// 						<Text mt={4} color='gray.600'>
// 							Loading configuration...
// 						</Text>
// 					</Box>
// 				) : (
// 					/* Grouped Secrets by Service */
// 					<Accordion
// 						allowMultiple
// 						index={expandedServices}
// 						onChange={setExpandedServices}
// 					>
// 						<VStack spacing={4} align='stretch'>
// 							{services?.map((service) => {
// 								const { icon, color } = getServiceMeta(service.service);

// 								return (
// 									<AccordionItem
// 										key={service._id}
// 										border='1px solid'
// 										borderRadius='2xl'
// 										borderColor='blue.100'
// 										bg='white'
// 										boxShadow='sm'
// 										transition='all 0.2s ease'
// 										_hover={{
// 											boxShadow: 'md',
// 											transform: 'translateY(-2px)',
// 										}}
// 										_expanded={{
// 											boxShadow: 'lg',
// 											borderColor: 'blue.400',
// 										}}
// 										overflow='hidden'
// 									>
// 										<Box bg='gray.100' p={0}>
// 											<AccordionButton
// 												p={{ base: 3, md: 4 }}
// 												_hover={{ bg: 'gray.100' }}
// 												transition='background 0.2s'
// 											>
// 												<HStack flex='1' spacing={3} align='flex-start'>
// 													<Icon
// 														as={icon}
// 														boxSize={{ base: 4, md: 5 }}
// 														color={color}
// 														mt={1}
// 														flexShrink={0}
// 													/>

// 													<Box textAlign='left' flex='1' minW={0}>
// 														<Text
// 															fontWeight='semibold'
// 															fontSize={{ base: 'sm', md: 'md' }}
// 															textTransform='capitalize'
// 															isTruncated
// 														>
// 															{service.displayName}
// 														</Text>

// 														<Text
// 															fontSize='xs'
// 															color='gray.500'
// 															mt={0.5}
// 															noOfLines={2}
// 														>
// 															{service.description}
// 														</Text>

// 														{service.documentationUrl && (
// 															<Button
// 																as='a'
// 																href={service.documentationUrl}
// 																target='_blank'
// 																rel='noopener noreferrer'
// 																size='xs'
// 																variant='outline'
// 																colorScheme='brand'
// 																leftIcon={<ExternalLinkIcon />}
// 																mt={1}
// 															>
// 																Check Pricing & Docs
// 															</Button>
// 														)}

// 														<Text fontSize='xs' color='gray.400' mt={1}>
// 															{service.keys.length} secret
// 															{service.keys.length !== 1 ? 's' : ''} • Last
// 															updated{' '}
// 															{new Date(
// 																Math.max(
// 																	...service.keys.map(
// 																		(s) => new Date(s.updatedAt),
// 																	),
// 																),
// 															).toLocaleDateString()}
// 														</Text>
// 													</Box>
// 												</HStack>

// 												<AccordionIcon />
// 											</AccordionButton>
// 											{/* <AccordionButton
// 												p={4}
// 												_hover={{ bg: 'gray.100' }}
// 												transition='background 0.2s'
// 											>
// 												<HStack flex='1' spacing={4}>
// 													<Icon as={icon} boxSize={5} color={color} />
// 													<Box textAlign='left'>
// 														<Text
// 															fontWeight='bold'
// 															fontSize='lg'
// 															textTransform='capitalize'
// 														>
// 															{service.service}
// 														</Text>
// 														<Text fontSize='sm' color='gray.600'>
// 															{service.keys.length} secret
// 															{service.keys.length !== 1 ? 's' : ''} • Last
// 															updated{' '}
// 															{new Date(
// 																Math.max(
// 																	...service.keys.map(
// 																		(s) => new Date(s.updatedAt),
// 																	),
// 																),
// 															).toLocaleDateString()}
// 														</Text>
// 													</Box>
// 												</HStack>
// 												<HStack spacing={4}>
// 													<AccordionIcon />
// 												</HStack>
// 											</AccordionButton> */}
// 										</Box>

// 										<AccordionPanel p={0}>
// 											<Box overflowX='auto'>
// 												<Table variant='simple' size='md'>
// 													<Thead bg='gray.50'>
// 														<Tr>
// 															<Th width='25%'>SECRET KEY</Th>
// 															<Th width='40%'>CURRENT VALUE</Th>
// 															<Th width='10%'>STATUS</Th>
// 															<Th width='30%'>LAST UPDATED</Th>
// 															<Th width='10%'>ACTIONS</Th>
// 														</Tr>
// 													</Thead>
// 													<Tbody>
// 														{service?.keys?.map((secret) => (
// 															<Tr
// 																key={secret._id}
// 																_hover={{ bg: 'gray.50' }}
// 																transition='background 0.2s'
// 															>
// 																<Td>
// 																	<VStack align='start' spacing={1}>
// 																		<Text fontWeight='600' color='gray.800'>
// 																			{secret.key}
// 																		</Text>
// 																		{secret.description && (
// 																			<Text fontSize='xs' color='gray.500'>
// 																				{secret.description}
// 																			</Text>
// 																		)}
// 																	</VStack>
// 																</Td>
// 																{/*
// 																	<Td>
// 																		<Badge
// 																			bg={
// 																				getEnvironmentBadge(secret.environment)
// 																					.bg
// 																			}
// 																			color={
// 																				getEnvironmentBadge(secret.environment)
// 																					.color
// 																			}
// 																			px={3}
// 																			py={1}
// 																			borderRadius='full'
// 																			fontWeight='500'
// 																		>
// 																			{
// 																				getEnvironmentBadge(secret.environment)
// 																					.label
// 																			}
// 																		</Badge>
// 																	</Td> */}
// 																<Td>
// 																	<HStack spacing={3} align='center'>
// 																		<Box
// 																			w='420px'
// 																			minW='420px'
// 																			maxW='420px'
// 																			flexShrink={0}
// 																			bg='gray.100'
// 																			_hover={{ bg: 'white' }}
// 																			p={2}
// 																			borderRadius='md'
// 																			fontFamily='mono'
// 																			fontSize='sm'
// 																			overflowX='auto'
// 																			overflowY='hidden'
// 																			sx={{
// 																				'&::-webkit-scrollbar': {
// 																					height: '6px',
// 																				},
// 																				'&::-webkit-scrollbar-track': {
// 																					background: 'transparent',
// 																				},
// 																				'&::-webkit-scrollbar-thumb': {
// 																					background: '#CBD5E0',
// 																					borderRadius: '8px',
// 																				},
// 																				'&::-webkit-scrollbar-thumb:hover': {
// 																					background: '#A0AEC0',
// 																				},
// 																				scrollbarWidth: 'thin',
// 																			}}
// 																		>
// 																			<Box
// 																				whiteSpace='nowrap'
// 																				minW='100%'
// 																				filter={
// 																					visibleValues[secret._id]
// 																						? 'none'
// 																						: 'blur(6px)'
// 																				}
// 																				cursor={
// 																					visibleValues[secret._id]
// 																						? 'text'
// 																						: 'default'
// 																				}
// 																				userSelect={
// 																					visibleValues[secret._id]
// 																						? 'text'
// 																						: 'none'
// 																				}
// 																				color='gray.700'
// 																			>
// 																				{visibleValues[secret._id]
// 																					? secret?.value || 'N/A'
// 																					: '•••••••••••••••••••••••••••••'}
// 																			</Box>
// 																		</Box>

// 																		<Tooltip
// 																			label={
// 																				visibleValues[secret._id]
// 																					? 'Hide value'
// 																					: 'Reveal value'
// 																			}
// 																			hasArrow
// 																		>
// 																			<IconButton
// 																				size='sm'
// 																				variant='ghost'
// 																				colorScheme='brand'
// 																				icon={
// 																					visibleValues[secret._id] ? (
// 																						<ViewOffIcon />
// 																					) : (
// 																						<ViewIcon />
// 																					)
// 																				}
// 																				onClick={() =>
// 																					toggleVisibility(secret._id)
// 																				}
// 																				aria-label='Toggle visibility'
// 																				borderRadius='full'
// 																			/>
// 																		</Tooltip>
// 																	</HStack>
// 																</Td>
// 																{/*
// 																<Td>
// 																	<HStack spacing={2}>
// 																		<Box
// 																			flex={1}
// 																			bg='gray.100'
// 																			_hover={{ bg: 'white' }}
// 																			p={2}
// 																			borderRadius='md'
// 																			fontFamily='mono'
// 																			fontSize='sm'
// 																			maxW='400px'
// 																			overflowX='auto'
// 																			overflowY='hidden'
// 																		>
// 																			<Box
// 																				whiteSpace='nowrap'
// 																				filter={
// 																					visibleValues[secret._id]
// 																						? 'none'
// 																						: 'blur(5px)'
// 																				}
// 																				cursor={
// 																					visibleValues[secret._id]
// 																						? 'text'
// 																						: 'default'
// 																				}
// 																				userSelect={
// 																					visibleValues[secret._id]
// 																						? 'text'
// 																						: 'none'
// 																				}
// 																				color='gray.700'
// 																			>
// 																				{visibleValues[secret._id]
// 																					? secret.value
// 																					: '••••••••••••••••••••••••'}
// 																			</Box>
// 																		</Box>
// 																		<Tooltip
// 																			label={
// 																				visibleValues[secret._id]
// 																					? 'Hide value'
// 																					: 'Reveal value'
// 																			}
// 																			hasArrow
// 																		>
// 																			<IconButton
// 																				size='sm'
// 																				variant='ghost'
// 																				colorScheme='brand'
// 																				icon={
// 																					visibleValues[secret._id] ? (
// 																						<ViewOffIcon />
// 																					) : (
// 																						<ViewIcon />
// 																					)
// 																				}
// 																				onClick={() =>
// 																					toggleVisibility(secret._id)
// 																				}
// 																				aria-label='Toggle visibility'
// 																				borderRadius='full'
// 																			/>
// 																		</Tooltip>
// 																	</HStack>
// 																</Td> */}

// 																{/* <Td>
// 																	<HStack spacing={1}>
// 																		<Box
// 																			w='8px'
// 																			h='8px'
// 																			borderRadius='full'
// 																			bg={
// 																				secret.isEnabled
// 																					? 'green.500'
// 																					: 'red.500'
// 																			}
// 																		/>
// 																		<Badge
// 																			variant='subtle'
// 																			colorScheme={
// 																				secret.isEnabled ? 'green' : 'red'
// 																			}
// 																			fontSize='xs'
// 																		>
// 																			{secret.isEnabled ? 'Active' : 'Inactive'}
// 																		</Badge>
// 																	</HStack>
// 																</Td> */}

// 																<Td>
// 																	<Switch
// 																		size='md'
// 																		colorScheme='green'
// 																		isChecked={secret.isEnabled}
// 																		onChange={() => handleToggleStatus(secret)}
// 																	/>
// 																</Td>

// 																<Td minW='200px'>
// 																	<Text fontSize='sm' color='gray.600'>
// 																		{format(
// 																			new Date(secret?.updatedAt),
// 																			'MMM d, yyyy',
// 																		)}
// 																	</Text>
// 																</Td>

// 																<Td>
// 																	<HStack spacing={1}>
// 																		<Tooltip label='Edit secret' hasArrow>
// 																			<IconButton
// 																				size='sm'
// 																				variant='ghost'
// 																				colorScheme='brand'
// 																				icon={<EditIcon />}
// 																				onClick={() => handleEdit(secret)}
// 																				aria-label='Edit secret'
// 																				borderRadius='full'
// 																			/>
// 																		</Tooltip>

// 																		<Tooltip label='Copy value' hasArrow>
// 																			<IconButton
// 																				size='sm'
// 																				variant='ghost'
// 																				colorScheme='green'
// 																				icon={<CopyIcon />}
// 																				onClick={() => copyToClipboard(secret)}
// 																				aria-label='Copy value'
// 																				borderRadius='full'
// 																			/>
// 																		</Tooltip>
// 																	</HStack>
// 																</Td>
// 															</Tr>
// 														))}
// 													</Tbody>
// 												</Table>
// 											</Box>
// 										</AccordionPanel>
// 									</AccordionItem>
// 								);
// 							})}
// 						</VStack>
// 					</Accordion>
// 				)}

// 				{/* Empty State */}
// 				{!isLoading && secretsData?.total === 0 && (
// 					<Box bg='white' p={12} textAlign='center'>
// 						<VStack spacing={4}>
// 							<Box bg='brand.50' p={6} borderRadius='full'>
// 								<LockIcon boxSize={8} color='brand.500' />
// 							</Box>
// 							<Heading size='md' color='gray.700'>
// 								No Secrets Found
// 							</Heading>
// 							<Text color='gray.500' maxW='400px'>
// 								{searchTerm || filterEnvironment !== 'all'
// 									? "Try adjusting your search or filter to find what you're looking for."
// 									: 'Get started by creating your first secret to securely store configuration values.'}
// 							</Text>
// 							<Button
// 								variant='outline'
// 								onClick={() => {
// 									setSearchTerm('');
// 									setFilterEnvironment('all');
// 								}}
// 							>
// 								Clear Filters
// 							</Button>
// 						</VStack>
// 					</Box>
// 				)}

// 				{isOpen && (
// 					<EditSecretModal
// 						isOpen={isOpen}
// 						onClose={onClose}
// 						handleSave={handleSave}
// 						isUpdating={isUpdating}
// 						selectedSecret={selectedSecret}
// 						setSelectedSecret={setSelectedSecret}
// 					/>
// 				)}

// 				{/* Auto-refresh indicator */}
// 				{isFetching && !isLoading && (
// 					<Box
// 						position='fixed'
// 						bottom='20px'
// 						left='20px'
// 						bg='white'
// 						px={4}
// 						py={2}
// 						borderRadius='full'
// 						boxShadow='lg'
// 						borderWidth='1px'
// 						borderColor='brand.100'
// 					>
// 						<HStack spacing={2}>
// 							<Spinner size='sm' color='brand.500' />
// 							<Text fontSize='sm' color='gray.600'>
// 								Syncing updates...
// 							</Text>
// 						</HStack>
// 					</Box>
// 				)}
// 			</Box>
// 		</Box>
// 	);
// };

// export default SecretManager;

import React, { useState, useMemo, useEffect } from 'react';
import {
	Box,
	Container,
	Heading,
	Text,
	Button,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Badge,
	IconButton,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Select,
	HStack,
	VStack,
	Tooltip,
	Spinner,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Tag,
	TagLabel,
	Flex,
	Divider,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	SimpleGrid,
	Avatar,
	AvatarGroup,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Portal,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Progress,
	Icon,
	Switch,
} from '@chakra-ui/react';
import {
	EditIcon,
	SearchIcon,
	AddIcon,
	ChevronDownIcon,
	ViewIcon,
	ViewOffIcon,
	CopyIcon,
	LockIcon,
	UnlockIcon,
	TimeIcon,
	CheckCircleIcon,
	WarningIcon,
	InfoIcon,
	StarIcon,
	CloseIcon,
	ExternalLinkIcon,
} from '@chakra-ui/icons';
import { FiDatabase, FiLayers, FiGlobe, FiActivity } from 'react-icons/fi';

import { toast } from 'react-toastify';
import { useFetchItemsQuery, useUpdateItemMutation } from 'api/apiSlice';
import EditSecretModal from './EditSecretModal';
import { getEnvironmentBadge, getServiceMeta } from './secretUtils';
import SecretStatCard from './SecretStatCard';
import AppButton from 'components/shared/AppButton';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const SecretManager = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedSecret, setSelectedSecret] = useState(null);
	const [visibleValues, setVisibleValues] = useState({});
	const [expandedServices, setExpandedServices] = useState([]);
	const [filterEnvironment, setFilterEnvironment] = useState('all');
	const { isOpen, onOpen, onClose } = useDisclosure();

	const navigate = useNavigate();

	// RTK Query hooks (unchanged)
	const {
		data: secretsData,
		isLoading,
		isFetching,
		error,
		refetch,
	} = useFetchItemsQuery(
		{
			path: '/secrets',
			params: {
				includeValue: true,
			},
		},
		{
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
			refetchOnReconnect: true,
		},
	);

	const [updateSecret, { isLoading: isUpdating }] = useUpdateItemMutation();

	const services = secretsData?.doc || [];

	// Auto-expand services with content
	useEffect(() => {
		if (Object.keys(services).length > 0) {
			setExpandedServices(Object.keys(services));
		}
	}, [services]);

	const handleEdit = (secret) => {
		setSelectedSecret({ ...secret, newValue: secret.value });
		onOpen();
	};

	const handleSave = async () => {
		try {
			await updateSecret({
				path: `/secrets/${selectedSecret._id}`,
				body: { value: selectedSecret.newValue },
			}).unwrap();

			toast.success(
				<Box>
					<Text fontWeight='bold'>Secret Updated Successfully</Text>
					<Text fontSize='sm'>{selectedSecret.key} has been updated</Text>
				</Box>,
				{
					icon: <CheckCircleIcon color='green.500' />,
					position: 'top-right',
					autoClose: 3000,
				},
			);

			onClose();
			refetch();
		} catch (error) {
			toast.error(
				<Box>
					<Text fontWeight='bold'>Update Failed</Text>
					<Text fontSize='sm'>{error.data?.message || 'Please try again'}</Text>
				</Box>,
				{
					icon: <WarningIcon color='red.500' />,
					position: 'top-right',
					autoClose: 5000,
				},
			);
		}
	};

	const handleToggleStatus = async (secret) => {
		try {
			await updateSecret({
				path: `/secrets/${secret._id}`,
				body: { isEnabled: !secret.isEnabled },
			}).unwrap();

			toast.success(
				<Box>
					<Text fontWeight='bold'>Status Updated</Text>
					<Text fontSize='sm'>
						{secret.key} is now {secret.isEnabled ? 'Inactive' : 'Active'}
					</Text>
				</Box>,
				{
					position: 'top-right',
					autoClose: 3000,
				},
			);

			refetch();
		} catch (error) {
			toast.error(
				<Box>
					<Text fontWeight='bold'>Update Failed</Text>
					<Text fontSize='sm'>{error.data?.message || 'Please try again'}</Text>
				</Box>,
				{ position: 'top-right' },
			);
		}
	};

	const toggleVisibility = (id) => {
		setVisibleValues((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	const copyToClipboard = async (secret) => {
		const value = secret?.value;

		if (!value) {
			toast.warning('Nothing to copy');
			return false;
		}

		try {
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(value);
			} else {
				const textarea = document.createElement('textarea');
				textarea.value = value;
				textarea.style.position = 'fixed';
				textarea.style.left = '-9999px';
				document.body.appendChild(textarea);
				textarea.focus();
				textarea.select();
				document.execCommand('copy');
				document.body.removeChild(textarea);
			}

			toast.success('Secret copied to clipboard', {
				autoClose: 1500,
			});

			return true;
		} catch (err) {
			console.error('Clipboard error:', err);
			toast.error('Copy failed');
			return false;
		}
	};

	if (error) {
		return (
			<Container maxW='1400px' py={8}>
				<Box
					bg='bg.surface'
					p={8}
					borderRadius='xl'
					textAlign='center'
					borderWidth='1px'
					borderColor='border.default'
				>
					<WarningIcon boxSize={12} color='red.400' mb={4} />
					<Heading size='md' color='text.heading' mb={2}>
						Failed to Load Secrets
					</Heading>
					<Text color='text.body' mb={4}>
						{error.data?.message ||
							'Please check your connection and try again'}
					</Text>
					<Button variant='brand' onClick={refetch}>
						Retry
					</Button>
				</Box>
			</Container>
		);
	}

	return (
		<Box bg='bg.app' minH='100vh' py={8} px={2}>
			<Box maxW='1400px' mx='auto' px={{ base: 4, md: 6 }}>
				<AppButton
					leftIcon={<IoArrowBack />}
					onClick={() => navigate('/admin-setting')}
					variant='ghost'
					mb={4}
				>
					Back
				</AppButton>

				<VStack spacing={6} align='stretch'>
					{/* Header */}
					<Flex justify='space-between' align='center' wrap='wrap' gap={4}>
						<Box>
							<Heading size='lg' color='text.heading'>
								Secret Configuration Manager
							</Heading>
							<Text color='text.muted' mt={1}>
								Manage and secure your application secrets across all
								environments
							</Text>
						</Box>

						<HStack spacing={3}>
							<Button
								variant='outline'
								onClick={refetch}
								isLoading={isFetching}
								loadingText='Refreshing'
								borderColor='border.default'
								color='text.body'
								_hover={{
									bg: 'bg.elevated',
									borderColor: 'gold.primary',
									color: 'gold.primary',
								}}
							>
								Refresh
							</Button>
						</HStack>
					</Flex>

					{/* Stats Overview */}
					<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
						<SecretStatCard
							label='Total Secrets'
							value={secretsData?.totalKeys}
							subtext='Across all services'
							icon={FiDatabase}
							color='cyan'
						/>
						<SecretStatCard
							label='Services'
							value={secretsData?.totalServices}
							subtext='With secret management enabled'
							icon={FiLayers}
							color='green'
						/>
					</SimpleGrid>

					{/* Search and Filters */}
					{/* <Box
						w='full'
						p={{ base: 4, md: 5 }}
						bg='bg.surface'
						borderRadius='xl'
						borderWidth='1px'
						borderColor='border.default'
						boxShadow='card'
					>
						<VStack spacing={4} align='stretch'>
							<Flex
								gap={4}
								wrap={{ base: 'wrap', md: 'nowrap' }}
								align='center'
								justify='space-between'
							>
								<InputGroup flex={{ base: '1 1 100%', md: '0 0 400px' }}>
									<InputLeftElement pointerEvents='none'>
										<SearchIcon color='text.muted' />
									</InputLeftElement>
									<Input
										placeholder='Search by key, env, or service...'
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										bg='bg.input'
										borderColor='border.default'
										color='text.body'
										_hover={{ borderColor: 'gold.dark' }}
										_focus={{
											borderColor: 'gold.primary',
											boxShadow: `0 0 0 1px #D4AF37`,
										}}
									/>
									{searchTerm && (
										<InputRightElement>
											<IconButton
												size='xs'
												variant='ghost'
												icon={<CloseIcon />}
												onClick={() => setSearchTerm('')}
												aria-label='Clear search'
												_hover={{ color: 'gold.primary' }}
											/>
										</InputRightElement>
									)}
								</InputGroup>

								<HStack
									spacing={3}
									flex={{ base: '1 1 100%', md: 'auto' }}
									justify={{ base: 'space-between', md: 'flex-start' }}
								>
									<Badge variant='gold' px={3} py={1} borderRadius='full'>
										{secretsData?.total} results
									</Badge>
								</HStack>
							</Flex>
						</VStack>
					</Box> */}

					{/* Loading State */}
					{isLoading ? (
						<Box textAlign='center' py={12}>
							<Spinner
								size='xl'
								thickness='3px'
								color='gold.primary'
								speed='0.3s'
							/>
							<Text mt={4} color='text.muted'>
								Loading configuration...
							</Text>
						</Box>
					) : (
						/* Grouped Secrets by Service */
						<Accordion
							allowMultiple
							index={expandedServices}
							onChange={setExpandedServices}
						>
							<VStack spacing={4} align='stretch'>
								{services?.map((service) => {
									const { icon, color } = getServiceMeta(service.service);

									return (
										<AccordionItem
											key={service._id}
											border='1px solid'
											borderRadius='xl'
											borderColor='border.gold'
											bg='bg.surface'
											boxShadow='card'
											transition='all 0.2s ease'
											_hover={{
												boxShadow: 'goldGlow',
												borderColor: 'gold.primary',
												transform: 'translateY(-2px)',
											}}
											_expanded={{
												borderColor: 'gold.primary',
												boxShadow: 'goldGlow',
											}}
											overflow='hidden'
										>
											<Box bg='gray.800' p={0}>
												<AccordionButton
													p={{ base: 4, md: 5 }}
													_hover={{ bg: 'gray.700' }}
													transition='background 0.2s'
												>
													<HStack flex='1' spacing={4} align='flex-start'>
														<Icon
															as={icon}
															boxSize={{ base: 5, md: 6 }}
															color={color}
															flexShrink={0}
														/>
														<Box textAlign='left' flex='1'>
															<Text
																fontWeight='semibold'
																fontSize={{ base: 'md', md: 'lg' }}
																textTransform='capitalize'
																color='text.heading'
															>
																{service.displayName}
															</Text>
															<Text fontSize='sm' color='text.muted' mt={0.5}>
																{service.description}
															</Text>
															{service.documentationUrl && (
																<Button
																	as='a'
																	href={service.documentationUrl}
																	target='_blank'
																	rel='noopener noreferrer'
																	size='xs'
																	variant='outline'
																	leftIcon={<ExternalLinkIcon />}
																	mt={2}
																	borderColor='border.default'
																	color='text.accent'
																	_hover={{
																		borderColor: 'gold.primary',
																		color: 'gold.primary',
																	}}
																>
																	Check Pricing & Docs
																</Button>
															)}
															<Text fontSize='xs' color='text.muted' mt={1}>
																{service.keys.length} secret
																{service.keys.length !== 1 ? 's' : ''} • Last
																updated{' '}
																{new Date(
																	Math.max(
																		...service.keys.map(
																			(s) => new Date(s.updatedAt),
																		),
																	),
																).toLocaleDateString()}
															</Text>
														</Box>
													</HStack>
													<AccordionIcon color='text.muted' />
												</AccordionButton>
											</Box>

											<AccordionPanel p={0}>
												<Box overflowX='auto'>
													<Table variant='simple' size='md'>
														<Thead bg='bg.elevated'>
															<Tr>
																<Th
																	color='gold.primary'
																	fontSize='xs'
																	fontWeight='700'
																	letterSpacing='0.08em'
																>
																	SECRET KEY
																</Th>
																<Th
																	color='gold.primary'
																	fontSize='xs'
																	fontWeight='700'
																	letterSpacing='0.08em'
																>
																	CURRENT VALUE
																</Th>
																<Th
																	color='gold.primary'
																	fontSize='xs'
																	fontWeight='700'
																	letterSpacing='0.08em'
																>
																	STATUS
																</Th>
																<Th
																	color='gold.primary'
																	fontSize='xs'
																	fontWeight='700'
																	letterSpacing='0.08em'
																>
																	LAST UPDATED
																</Th>
																<Th
																	color='gold.primary'
																	fontSize='xs'
																	fontWeight='700'
																	letterSpacing='0.08em'
																>
																	ACTIONS
																</Th>
															</Tr>
														</Thead>
														<Tbody>
															{service?.keys?.map((secret) => (
																<Tr
																	key={secret._id}
																	_hover={{ bg: 'bg.elevated' }}
																	transition='background 0.2s'
																>
																	<Td>
																		<VStack align='start' spacing={1}>
																			<Text
																				fontWeight='600'
																				color='text.heading'
																			>
																				{secret.key}
																			</Text>
																			{secret.description && (
																				<Text fontSize='xs' color='text.muted'>
																					{secret.description}
																				</Text>
																			)}
																		</VStack>
																	</Td>
																	<Td>
																		<HStack spacing={3} align='center'>
																			<Box
																				w={{ base: '300px', lg: '420px' }}
																				minW={{ base: '250px', lg: '350px' }}
																				maxW={{ base: '300px', lg: '420px' }}
																				flexShrink={0}
																				bg='bg.input'
																				_hover={{ bg: 'bg.input' }}
																				p={2}
																				borderRadius='md'
																				fontFamily='mono'
																				fontSize='sm'
																				overflowX='auto'
																				overflowY='hidden'
																				sx={{
																					'&::-webkit-scrollbar': {
																						height: '6px',
																					},
																					'&::-webkit-scrollbar-track': {
																						background: 'navy.900',
																					},
																					'&::-webkit-scrollbar-thumb': {
																						background: 'navy.600',
																						borderRadius: '3px',
																					},
																				}}
																			>
																				<Box
																					whiteSpace='nowrap'
																					minW='100%'
																					filter={
																						visibleValues[secret._id]
																							? 'none'
																							: 'blur(6px)'
																					}
																					cursor={
																						visibleValues[secret._id]
																							? 'text'
																							: 'default'
																					}
																					userSelect={
																						visibleValues[secret._id]
																							? 'text'
																							: 'none'
																					}
																					color='white'
																				>
																					{visibleValues[secret._id]
																						? secret?.value || 'N/A'
																						: '•••••••••••••••••••••••••••••'}
																				</Box>
																			</Box>
																			<Tooltip
																				label={
																					visibleValues[secret._id]
																						? 'Hide value'
																						: 'Reveal value'
																				}
																				hasArrow
																			>
																				<IconButton
																					size='sm'
																					variant='ghost'
																					icon={
																						visibleValues[secret._id] ? (
																							<ViewOffIcon />
																						) : (
																							<ViewIcon />
																						)
																					}
																					onClick={() =>
																						toggleVisibility(secret._id)
																					}
																					aria-label='Toggle visibility'
																					borderRadius='full'
																					color='text.muted'
																					_hover={{ color: 'gold.primary' }}
																				/>
																			</Tooltip>
																		</HStack>
																	</Td>
																	<Td>
																		<Switch
																			size='md'
																			colorScheme='brand'
																			isChecked={secret.isEnabled}
																			onChange={() =>
																				handleToggleStatus(secret)
																			}
																		/>
																	</Td>
																	<Td>
																		<Text fontSize='sm' color='text.muted'>
																			{format(
																				new Date(secret?.updatedAt),
																				'MMM d, yyyy',
																			)}
																		</Text>
																	</Td>
																	<Td>
																		<HStack spacing={1}>
																			<Tooltip label='Edit secret' hasArrow>
																				<IconButton
																					size='sm'
																					variant='ghost'
																					icon={<EditIcon />}
																					onClick={() => handleEdit(secret)}
																					aria-label='Edit secret'
																					borderRadius='full'
																					color='text.muted'
																					_hover={{ color: 'gold.primary' }}
																				/>
																			</Tooltip>
																			<Tooltip label='Copy value' hasArrow>
																				<IconButton
																					size='sm'
																					variant='ghost'
																					icon={<CopyIcon />}
																					onClick={() =>
																						copyToClipboard(secret)
																					}
																					aria-label='Copy value'
																					borderRadius='full'
																					color='text.muted'
																					_hover={{ color: 'green.400' }}
																				/>
																			</Tooltip>
																		</HStack>
																	</Td>
																</Tr>
															))}
														</Tbody>
													</Table>
												</Box>
											</AccordionPanel>
										</AccordionItem>
									);
								})}
							</VStack>
						</Accordion>
					)}

					{/* Empty State */}
					{!isLoading && secretsData?.total === 0 && (
						<Box
							bg='bg.surface'
							p={12}
							textAlign='center'
							borderRadius='xl'
							borderWidth='1px'
							borderColor='border.default'
						>
							<VStack spacing={4}>
								<Box bg='rgba(212, 175, 55, 0.1)' p={6} borderRadius='full'>
									<LockIcon boxSize={8} color='gold.primary' />
								</Box>
								<Heading size='md' color='text.heading'>
									No Secrets Found
								</Heading>
								<Text color='text.muted' maxW='400px'>
									{searchTerm || filterEnvironment !== 'all'
										? "Try adjusting your search or filter to find what you're looking for."
										: 'Get started by creating your first secret to securely store configuration values.'}
								</Text>
								<Button
									variant='outline'
									onClick={() => {
										setSearchTerm('');
										setFilterEnvironment('all');
									}}
									borderColor='border.default'
									color='text.body'
									_hover={{
										borderColor: 'gold.primary',
										color: 'gold.primary',
									}}
								>
									Clear Filters
								</Button>
							</VStack>
						</Box>
					)}

					{isOpen && (
						<EditSecretModal
							isOpen={isOpen}
							onClose={onClose}
							handleSave={handleSave}
							isUpdating={isUpdating}
							selectedSecret={selectedSecret}
							setSelectedSecret={setSelectedSecret}
						/>
					)}

					{/* Auto-refresh indicator */}
					{isFetching && !isLoading && (
						<Box
							position='fixed'
							bottom='20px'
							left='20px'
							bg='bg.surface'
							px={4}
							py={2}
							borderRadius='full'
							boxShadow='card'
							borderWidth='1px'
							borderColor='border.default'
						>
							<HStack spacing={2}>
								<Spinner size='sm' color='gold.primary' />
								<Text fontSize='sm' color='text.body'>
									Syncing updates...
								</Text>
							</HStack>
						</Box>
					)}
				</VStack>
			</Box>
		</Box>
	);
};

export default SecretManager;
