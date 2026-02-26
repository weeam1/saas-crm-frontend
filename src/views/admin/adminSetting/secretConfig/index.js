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
} from '@chakra-ui/icons';
import { FiDatabase, FiLayers, FiGlobe, FiActivity } from 'react-icons/fi';

import { toast } from 'react-toastify';
import { useFetchItemsQuery, useUpdateItemMutation } from 'api/apiSlice';
import EditSecretModal from './EditSecretModal';
import { getEnvironmentBadge, getServiceMeta } from './secretUtils';
import SecretStatCard from './SecretStatCard';
import AppButton from 'components/shared/AppButton';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const SecretManager = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedSecret, setSelectedSecret] = useState(null);
	const [visibleValues, setVisibleValues] = useState({});
	const [expandedServices, setExpandedServices] = useState([]);
	const [filterEnvironment, setFilterEnvironment] = useState('all');
	const { isOpen, onOpen, onClose } = useDisclosure();

	const navigate = useNavigate();

	// RTK Query hooks
	const {
		data: secretsData,
		isLoading,
		isFetching,
		error,
		refetch,
	} = useFetchItemsQuery(
		{
			path: '/secrets',
			params: { includeValue: true },
		},
		{
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
			refetchOnReconnect: true,
		},
	);

	const [updateSecret, { isLoading: isUpdating }] = useUpdateItemMutation();

	const secrets = secretsData?.doc || [];

	// Group secrets by service
	const groupedSecrets = useMemo(() => {
		const filtered = secrets.filter((secret) => {
			const matchesSearch =
				secret.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
				secret.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(secret.description || '')
					.toLowerCase()
					.includes(searchTerm.toLowerCase());

			const matchesEnv =
				filterEnvironment === 'all' || secret.environment === filterEnvironment;

			return matchesSearch && matchesEnv;
		});

		return filtered.reduce((groups, secret) => {
			const service = secret.service;
			if (!groups[service]) {
				groups[service] = [];
			}
			groups[service].push(secret);
			return groups;
		}, {});
	}, [secrets, searchTerm, filterEnvironment]);

	// Auto-expand services with content
	useEffect(() => {
		if (Object.keys(groupedSecrets).length > 0) {
			setExpandedServices(Object.keys(groupedSecrets));
		}
	}, [groupedSecrets]);

	const handleEdit = (secret) => {
		setSelectedSecret({ ...secret, newValue: secret.value });
		onOpen();
	};

	const handleSave = async () => {
		try {
			if (!selectedSecret?.newValue) {
				toast.warning('Please enter a value for the secret');
				return;
			}

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

	const toggleVisibility = (id) => {
		console.log({ id });
		setVisibleValues((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	console.log({ visibleValues });

	const copyToClipboard = async (secret) => {
		const value = secret?.value;

		if (!value) {
			toast.warning('Nothing to copy');
			return false;
		}

		try {
			// Modern API (secure context required)
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(value);
			} else {
				// Fallback for HTTP / legacy browsers
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

	const environments = ['all', 'development', 'staging', 'production'];

	if (error) {
		return (
			<Container maxW='1400px' py={8}>
				<Box
					bg='red.50'
					p={8}
					borderRadius='lg'
					textAlign='center'
					borderWidth='1px'
					borderColor='red.200'
				>
					<WarningIcon boxSize={12} color='red.500' mb={4} />
					<Heading size='md' color='red.700' mb={2}>
						Failed to Load Secrets
					</Heading>
					<Text color='red.600' mb={4}>
						{error.data?.message ||
							'Please check your connection and try again'}
					</Text>
					<Button colorScheme='red' onClick={refetch}>
						Retry
					</Button>
				</Box>
			</Container>
		);
	}

	return (
		<Box bg='white' minH='100vh' py={8} px={2}>
			<AppButton
				leftIcon={<IoArrowBack />}
				onClick={() => navigate('/admin-setting')}
			>
				Back
			</AppButton>
			<Container maxW='1400px' px={2}>
				{/* Header with breadcrumb */}
				<VStack spacing={6} align='stretch' mb={8}>
					<Flex justify='space-between' align='center' wrap='wrap' gap={4}>
						<Box>
							<Heading size='lg' color='gray.800'>
								Secret Configuration Manager
							</Heading>
							<Text color='gray.600' mt={1}>
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
							>
								Refresh
							</Button>
						</HStack>
					</Flex>

					{/* Stats Overview */}
					<SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
						<SecretStatCard
							label='Total Secrets'
							value={secrets.length}
							subtext='Across all services'
							icon={FiDatabase}
							color='cyan'
						/>

						<SecretStatCard
							label='Active Services'
							value={Object.keys(groupedSecrets).length}
							subtext='With configured secrets'
							icon={FiLayers}
							color='green'
						/>

						<SecretStatCard
							label='Environments'
							value={new Set(secrets.map((s) => s.environment)).size}
							subtext='Active environments'
							icon={FiGlobe}
							color='orange'
						/>
					</SimpleGrid>
					{/* Search and Filters */}
					<Box
						w='full'
						p={{ base: 2, md: 4 }}
						bg='gray.50'
						borderRadius='2xl'
						boxShadow='sm'
					>
						<VStack spacing={4} align='stretch'>
							{/* <Text fontWeight='semibold' fontSize='lg' color='gray.700'>
								Filter Secrets
							</Text> */}

							<Flex
								gap={4}
								wrap={{ base: 'wrap', md: 'nowrap' }}
								align='center'
								justify='space-between'
							>
								{/* Search Input */}
								<InputGroup flex={{ base: '1 1 100%', md: '0 0 400px' }}>
									<InputLeftElement pointerEvents='none'>
										<SearchIcon color='gray.400' />
									</InputLeftElement>

									<Input
										placeholder='Search by key env, or service...'
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										bg='white'
										borderColor='gray.200'
										_hover={{ borderColor: 'brand.300' }}
										_focus={{
											borderColor: 'brand.500',
											boxShadow: 'outline',
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
											/>
										</InputRightElement>
									)}
								</InputGroup>

								{/* Filters & Result Badge */}
								<HStack
									spacing={3}
									flex={{ base: '1 1 100%', md: 'auto' }}
									justify={{ base: 'space-between', md: 'flex-start' }}
								>
									<Select
										w={{ base: '48%', md: '180px' }}
										value={filterEnvironment}
										onChange={(e) => setFilterEnvironment(e.target.value)}
										bg='white'
										borderColor='gray.200'
										_hover={{ borderColor: 'brand.300' }}
										_focus={{ borderColor: 'brand.500', boxShadow: 'outline' }}
									>
										{environments.map((env) => (
											<option key={env} value={env}>
												{env === 'all'
													? 'All Environments'
													: env.charAt(0).toUpperCase() + env.slice(1)}
											</option>
										))}
									</Select>

									<Badge
										colorScheme='brand'
										px={3}
										py={1}
										borderRadius='full'
										ml={{ base: 0, md: 2 }}
									>
										{Object.values(groupedSecrets).flat().length} results
									</Badge>
								</HStack>
							</Flex>
						</VStack>
					</Box>
				</VStack>

				{/* Loading State */}
				{isLoading ? (
					<Box textAlign='center' py={12}>
						<Spinner size='xl' thickness='3px' color='brand.500' speed='0.3s' />
						<Text mt={4} color='gray.600'>
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
							{Object.entries(groupedSecrets).map(
								([service, serviceSecrets]) => {
									const { icon, color } = getServiceMeta(service);

									return (
										<AccordionItem
											key={service}
											border='1px solid'
											borderRadius='2xl'
											borderColor='blue.100'
											bg='white'
											boxShadow='sm'
											transition='all 0.2s ease'
											_hover={{
												boxShadow: 'md',
												transform: 'translateY(-2px)',
											}}
											_expanded={{
												boxShadow: 'lg',
												borderColor: 'blue.400',
											}}
											overflow='hidden'
										>
											<Box bg='gray.100' p={0}>
												<AccordionButton
													p={4}
													_hover={{ bg: 'gray.100' }}
													transition='background 0.2s'
												>
													<HStack flex='1' spacing={4}>
														<Icon as={icon} boxSize={5} color={color} />
														{/* <Text fontSize='2xl'>
															{getServiceIcon(service)}
														</Text> */}
														<Box textAlign='left'>
															<Text
																fontWeight='bold'
																fontSize='lg'
																textTransform='capitalize'
															>
																{service} Service
															</Text>
															<Text fontSize='sm' color='gray.600'>
																{serviceSecrets.length} secret
																{serviceSecrets.length !== 1 ? 's' : ''} • Last
																updated{' '}
																{new Date(
																	Math.max(
																		...serviceSecrets.map(
																			(s) => new Date(s.updatedAt),
																		),
																	),
																).toLocaleDateString()}
															</Text>
														</Box>
													</HStack>
													<HStack spacing={4}>
														<HStack spacing={1}>
															{['development', 'staging', 'production'].map(
																(env) => {
																	const hasEnv = serviceSecrets.some(
																		(s) => s.environment === env,
																	);
																	return hasEnv ? (
																		<Badge
																			key={env}
																			bg={getEnvironmentBadge(env).bg}
																			color={getEnvironmentBadge(env).color}
																			px={2}
																			borderRadius='full'
																			fontSize='xs'
																		>
																			{env.charAt(0).toUpperCase()}
																		</Badge>
																	) : null;
																},
															)}
														</HStack>
														<AccordionIcon />
													</HStack>
												</AccordionButton>
											</Box>

											<AccordionPanel p={0}>
												<Box overflowX='auto'>
													<Table variant='simple' size='md'>
														<Thead bg='gray.50'>
															<Tr>
																<Th width='25%'>SECRET KEY</Th>
																<Th width='15%'>ENVIRONMENT</Th>
																<Th width='45%'>CURRENT VALUE</Th>
																{/* <Th width='10%'>STATUS</Th> */}
																<Th width='15%'>LAST UPDATED</Th>
																<Th width='10%'>ACTIONS</Th>
															</Tr>
														</Thead>
														<Tbody>
															{serviceSecrets.map((secret) => (
																<Tr
																	key={secret._id}
																	_hover={{ bg: 'gray.50' }}
																	transition='background 0.2s'
																>
																	<Td>
																		<VStack align='start' spacing={1}>
																			<Text fontWeight='600' color='gray.800'>
																				{secret.key}
																			</Text>
																			{secret.description && (
																				<Text fontSize='xs' color='gray.500'>
																					{secret.description}
																				</Text>
																			)}
																		</VStack>
																	</Td>

																	<Td>
																		<Badge
																			bg={
																				getEnvironmentBadge(secret.environment)
																					.bg
																			}
																			color={
																				getEnvironmentBadge(secret.environment)
																					.color
																			}
																			px={3}
																			py={1}
																			borderRadius='full'
																			fontWeight='500'
																		>
																			{
																				getEnvironmentBadge(secret.environment)
																					.label
																			}
																		</Badge>
																	</Td>
																	<Td>
																		<HStack spacing={3} align='center'>
																			<Box
																				w='420px'
																				minW='420px'
																				maxW='420px'
																				flexShrink={0}
																				bg='gray.100'
																				_hover={{ bg: 'white' }}
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
																						background: 'transparent',
																					},
																					'&::-webkit-scrollbar-thumb': {
																						background: '#CBD5E0',
																						borderRadius: '8px',
																					},
																					'&::-webkit-scrollbar-thumb:hover': {
																						background: '#A0AEC0',
																					},
																					scrollbarWidth: 'thin',
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
																					color='gray.700'
																				>
																					{visibleValues[secret._id]
																						? secret.value
																						: '••••••••••••••••••••••••••••••••••'}
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
																					colorScheme='brand'
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
																				/>
																			</Tooltip>
																		</HStack>
																	</Td>
																	{/* 
																<Td>
																	<HStack spacing={2}>
																		<Box
																			flex={1}
																			bg='gray.100'
																			_hover={{ bg: 'white' }}
																			p={2}
																			borderRadius='md'
																			fontFamily='mono'
																			fontSize='sm'
																			maxW='400px'
																			overflowX='auto'
																			overflowY='hidden'
																		>
																			<Box
																				whiteSpace='nowrap'
																				filter={
																					visibleValues[secret._id]
																						? 'none'
																						: 'blur(5px)'
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
																				color='gray.700'
																			>
																				{visibleValues[secret._id]
																					? secret.value
																					: '••••••••••••••••••••••••'}
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
																				colorScheme='brand'
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
																			/>
																		</Tooltip>
																	</HStack>
																</Td> */}

																	{/* <Td>
																	<HStack spacing={1}>
																		<Box
																			w='8px'
																			h='8px'
																			borderRadius='full'
																			bg={
																				secret.isEnabled
																					? 'green.500'
																					: 'red.500'
																			}
																		/>
																		<Badge
																			variant='subtle'
																			colorScheme={
																				secret.isEnabled ? 'green' : 'red'
																			}
																			fontSize='xs'
																		>
																			{secret.isEnabled ? 'Active' : 'Inactive'}
																		</Badge>
																	</HStack>
																</Td> */}

																	<Td>
																		<Tooltip
																			label={new Date(
																				secret.updatedAt,
																			).toLocaleString()}
																			hasArrow
																		>
																			<Text fontSize='sm' color='gray.600'>
																				{new Date(
																					secret.updatedAt,
																				).toLocaleDateString('en-US', {
																					month: 'short',
																					day: 'numeric',
																					hour: '2-digit',
																					minute: '2-digit',
																				})}
																			</Text>
																		</Tooltip>
																	</Td>

																	<Td>
																		<HStack spacing={1}>
																			<Tooltip label='Edit secret' hasArrow>
																				<IconButton
																					size='sm'
																					variant='ghost'
																					colorScheme='brand'
																					icon={<EditIcon />}
																					onClick={() => handleEdit(secret)}
																					aria-label='Edit secret'
																					borderRadius='full'
																				/>
																			</Tooltip>

																			<Tooltip label='Copy value' hasArrow>
																				<IconButton
																					size='sm'
																					variant='ghost'
																					colorScheme='green'
																					icon={<CopyIcon />}
																					onClick={() =>
																						copyToClipboard(secret)
																					}
																					aria-label='Copy value'
																					borderRadius='full'
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
								},
							)}
						</VStack>
					</Accordion>
				)}

				{/* Empty State */}
				{!isLoading && Object.keys(groupedSecrets).length === 0 && (
					<Box bg='white' p={12} textAlign='center'>
						<VStack spacing={4}>
							<Box bg='brand.50' p={6} borderRadius='full'>
								<LockIcon boxSize={8} color='brand.500' />
							</Box>
							<Heading size='md' color='gray.700'>
								No Secrets Found
							</Heading>
							<Text color='gray.500' maxW='400px'>
								{searchTerm || filterEnvironment !== 'all'
									? "Try adjusting your search or filter to find what you're looking for."
									: 'Get started by creating your first secret to securely store configuration values.'}
							</Text>
							{searchTerm || filterEnvironment !== 'all' ? (
								<Button
									variant='outline'
									onClick={() => {
										setSearchTerm('');
										setFilterEnvironment('all');
									}}
								>
									Clear Filters
								</Button>
							) : (
								<Button
									leftIcon={<AddIcon />}
									colorScheme='brand'
									onClick={() => {
										setSelectedSecret(null);
										onOpen();
									}}
								>
									Create First Secret
								</Button>
							)}
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

				{/* Edit Modal */}
				{/* <Modal isOpen={isOpen} onClose={onClose} size='xl'>
					<ModalOverlay backdropFilter='blur(10px)' />
					<ModalContent>
						<ModalHeader borderBottomWidth='1px' pb={3}>
							<HStack spacing={2}>
								<EditIcon color='brand.500' />
								<Text>
									{selectedSecret ? 'Update Secret Value' : 'Create New Secret'}
								</Text>
							</HStack>
						</ModalHeader>
						<ModalCloseButton />

						<ModalBody py={6}>
							{selectedSecret && (
								<VStack spacing={5} align='stretch'>
									<Box
										bg='brand.50'
										p={4}
										borderRadius='md'
										borderLeftWidth='4px'
										borderLeftColor='brand.500'
									>
										<Text
											fontSize='sm'
											color='brand.800'
											fontWeight='500'
											mb={1}
										>
											Updating Secret
										</Text>
										<Text fontWeight='600'>{selectedSecret.key}</Text>
										<HStack spacing={2} mt={2}>
											<Badge colorScheme='purple'>
												{selectedSecret.service}
											</Badge>
											<Badge
												colorScheme={
													getEnvironmentBadge(selectedSecret.environment).color
												}
											>
												{selectedSecret.environment}
											</Badge>
										</HStack>
									</Box>

									<FormControl isRequired>
										<FormLabel fontWeight='600'>Secret Value</FormLabel>
										<Textarea
											placeholder='Enter the secret value...'
											value={selectedSecret.newValue || ''}
											onChange={(e) =>
												setSelectedSecret({
													...selectedSecret,
													newValue: e.target.value,
												})
											}
											minH='120px'
											fontFamily='mono'
											bg='gray.50'
											borderColor='gray.200'
											_hover={{ borderColor: 'brand.300' }}
											_focus={{
												borderColor: 'brand.500',
												boxShadow: 'outline',
											}}
										/>
										<Text fontSize='xs' color='gray.500' mt={1}>
											This value will be encrypted before storage
										</Text>
									</FormControl>

									{selectedSecret.isEnabled !== undefined && (
										<FormControl display='flex' alignItems='center'>
											<FormLabel mb='0' fontWeight='600'>
												Secret Status
											</FormLabel>
											<HStack>
												<Box
													w='10px'
													h='10px'
													borderRadius='full'
													bg={
														selectedSecret.isEnabled ? 'green.500' : 'red.500'
													}
												/>
												<Text>
													{selectedSecret.isEnabled ? 'Active' : 'Inactive'}
												</Text>
											</HStack>
										</FormControl>
									)}
								</VStack>
							)}
						</ModalBody>

						<ModalFooter borderTopWidth='1px'>
							<Button variant='ghost' mr={3} onClick={onClose}>
								Cancel
							</Button>
							<Button
								colorScheme='brand'
								onClick={handleSave}
								isLoading={isUpdating}
								loadingText='Updating...'
								leftIcon={<LockIcon />}
							>
								Update Secret
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal> */}

				{/* Auto-refresh indicator */}
				{isFetching && !isLoading && (
					<Box
						position='fixed'
						bottom='20px'
						left='20px'
						bg='white'
						px={4}
						py={2}
						borderRadius='full'
						boxShadow='lg'
						borderWidth='1px'
						borderColor='brand.100'
					>
						<HStack spacing={2}>
							<Spinner size='sm' color='brand.500' />
							<Text fontSize='sm' color='gray.600'>
								Syncing updates...
							</Text>
						</HStack>
					</Box>
				)}
			</Container>
		</Box>
	);
};

export default SecretManager;
