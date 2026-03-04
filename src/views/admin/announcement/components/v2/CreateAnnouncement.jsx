// import {
// 	Box,
// 	Button,
// 	FormControl,
// 	FormLabel,
// 	Input,
// 	Select,
// 	Textarea,
// 	RadioGroup,
// 	Radio,
// 	Stack,
// 	HStack,
// 	Text,
// 	Badge,
// 	useToast,
// 	useDisclosure,
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalBody,
// 	ModalFooter,
// } from '@chakra-ui/react';
// import { useState, useMemo } from 'react';
// import { useCreateItemMutation } from 'api/apiSlice';
// import { useTeamStructure } from 'hooks/user/useTeamStructure';
// import { useRoles } from 'hooks/user/userRoles';
// import useUserSession from 'hooks/useUserSession';

// export default function CreateAnnouncement({}) {
// 	const toast = useToast();
// 	const { isOpen, onOpen, onClose } = useDisclosure();

// 	const { team: managers } = useTeamStructure();
// 	const { roles } = useRoles();

// 	const { user: currentUser } = useUserSession();

// 	const [createItemMutation, { isLoading: isCreating }] =
// 		useCreateItemMutation();

// 	const [title, setTitle] = useState('');
// 	const [message, setMessage] = useState('');
// 	const [priority, setPriority] = useState(1);

// 	const [recipientTarget, setRecipientTarget] = useState('ALL');
// 	const [selectedRoleIds, setSelectedRoleIds] = useState([]);
// 	const [selectedManagerId, setSelectedManagerId] = useState('');

// 	const isSubmitDisabled = useMemo(() => {
// 		if (!title.trim() || !message.trim()) return true;

// 		if (recipientTarget === 'ROLE' && selectedRoleIds.length === 0) return true;

// 		if (recipientTarget === 'TEAM' && !selectedManagerId) return true;

// 		return false;
// 	}, [title, message, recipientTarget, selectedRoleIds, selectedManagerId]);

// 	function buildPayload() {
// 		let recipientType = 'ALL';
// 		let receivers = [];

// 		if (recipientTarget === 'ROLE') {
// 			if (selectedRoleIds.includes('ALL_ROLES')) {
// 				recipientType = 'ALL';
// 			} else {
// 				recipientType = 'ROLE';
// 				receivers = selectedRoleIds;
// 			}
// 		}

// 		if (recipientTarget === 'TEAM') {
// 			recipientType = 'INDIVIDUAL';
// 			receivers = selectedManagerId ? [selectedManagerId] : [];
// 		}

// 		return {
// 			priority,
// 			recipientType,
// 			type: 'ANNOUNCEMENT',
// 			sender: currentUser?._id,
// 			title: title.trim(),
// 			message: message.trim(),
// 			metadata: {},
// 			...(receivers.length > 0 && { receivers }),
// 		};
// 	}

// 	async function handleSubmit() {
// 		const payload = buildPayload();

// 		if (payload.recipientType === 'ALL') {
// 			onOpen();
// 			return;
// 		}

// 		await submit(payload);
// 	}

// 	async function submit(payload) {
// 		try {
// 			await createItemMutation({
// 				path: '/notifications',
// 				body: payload,
// 			}).unwrap();

// 			toast({
// 				title: 'Announcement created',
// 				status: 'success',
// 				duration: 3000,
// 				isClosable: true,
// 			});

// 			setTitle('');
// 			setMessage('');
// 			setSelectedRoleIds([]);
// 			setSelectedManagerId('');
// 			setRecipientTarget('ALL');
// 			setPriority(1);

// 			onClose();
// 		} catch (err) {
// 			toast({
// 				title: 'Failed to create announcement',
// 				description: err?.data?.message || 'Something went wrong',
// 				status: 'error',
// 				duration: 4000,
// 				isClosable: true,
// 			});
// 		}
// 	}

// 	const previewLabel = useMemo(() => {
// 		if (recipientTarget === 'ALL') return 'All Users';

// 		if (recipientTarget === 'ROLE') {
// 			if (selectedRoleIds.includes('ALL_ROLES')) return 'All Users';
// 			if (selectedRoleIds.length === 0) return 'No role selected';
// 			return `${selectedRoleIds.length} role(s) selected`;
// 		}

// 		if (recipientTarget === 'TEAM') {
// 			const manager = managers.find((m) => m._id === selectedManagerId);
// 			return manager ? `${manager.fullName} Team` : 'No team selected';
// 		}

// 		return '';
// 	}, [recipientTarget, selectedRoleIds, selectedManagerId, managers]);

// 	return (
// 		<Box p={6} bg='white' rounded='xl' shadow='md' maxW='700px'>
// 			<Text fontSize='xl' fontWeight='bold' mb={4}>
// 				Create Announcement
// 			</Text>

// 			<Stack spacing={5}>
// 				<FormControl isRequired>
// 					<FormLabel>Title</FormLabel>
// 					<Input
// 						placeholder='Enter announcement title'
// 						value={title}
// 						onChange={(e) => setTitle(e.target.value)}
// 					/>
// 				</FormControl>

// 				<FormControl isRequired>
// 					<FormLabel>Message</FormLabel>
// 					<Textarea
// 						placeholder='Write your message...'
// 						rows={5}
// 						value={message}
// 						onChange={(e) => setMessage(e.target.value)}
// 					/>
// 				</FormControl>

// 				<FormControl>
// 					<FormLabel>Priority</FormLabel>
// 					<HStack>
// 						<Button
// 							variant={priority === 1 ? 'solid' : 'outline'}
// 							onClick={() => setPriority(1)}
// 						>
// 							Normal
// 						</Button>
// 						<Button
// 							variant={priority === 2 ? 'solid' : 'outline'}
// 							onClick={() => setPriority(2)}
// 						>
// 							Important
// 						</Button>
// 						<Button
// 							variant={priority === 3 ? 'solid' : 'outline'}
// 							colorScheme='red'
// 							onClick={() => setPriority(3)}
// 						>
// 							Critical
// 						</Button>
// 					</HStack>
// 				</FormControl>

// 				<FormControl>
// 					<FormLabel>Who should receive this?</FormLabel>
// 					<RadioGroup
// 						value={recipientTarget}
// 						onChange={(val) => {
// 							setRecipientTarget(val);
// 							setSelectedRoleIds([]);
// 							setSelectedManagerId('');
// 						}}
// 					>
// 						<Stack direction='row'>
// 							<Radio value='ALL'>All Users</Radio>
// 							<Radio value='ROLE'>By Role</Radio>
// 							<Radio value='TEAM'>By Team</Radio>
// 						</Stack>
// 					</RadioGroup>
// 				</FormControl>

// 				{recipientTarget === 'ROLE' && (
// 					<FormControl>
// 						<FormLabel>Select Role(s)</FormLabel>
// 						<Select
// 							multiple
// 							value={selectedRoleIds}
// 							onChange={(e) => {
// 								const values = Array.from(
// 									e.target.selectedOptions,
// 									(option) => option.value,
// 								);
// 								if (values.includes('ALL_ROLES')) {
// 									setSelectedRoleIds(['ALL_ROLES']);
// 								} else {
// 									setSelectedRoleIds(values);
// 								}
// 							}}
// 						>
// 							<option value='ALL_ROLES'>All Roles</option>
// 							{roles.map((role) => (
// 								<option key={role._id} value={role._id}>
// 									{role.roleName}
// 								</option>
// 							))}
// 						</Select>
// 					</FormControl>
// 				)}

// 				{recipientTarget === 'TEAM' && (
// 					<FormControl>
// 						<FormLabel>Select Team</FormLabel>
// 						<Select
// 							placeholder='Select manager team'
// 							value={selectedManagerId}
// 							onChange={(e) => setSelectedManagerId(e.target.value)}
// 						>
// 							{managers.map((manager) => (
// 								<option key={manager._id} value={manager._id}>
// 									{manager.fullName} Team
// 								</option>
// 							))}
// 						</Select>
// 					</FormControl>
// 				)}

// 				<Box>
// 					<Text fontSize='sm' color='gray.500'>
// 						Preview:
// 					</Text>
// 					<Badge mt={1} colorScheme='brand'>
// 						{previewLabel}
// 					</Badge>
// 				</Box>

// 				<Button
// 					colorScheme='brand'
// 					onClick={handleSubmit}
// 					isLoading={isCreating}
// 					isDisabled={isSubmitDisabled}
// 				>
// 					Create Announcement
// 				</Button>
// 			</Stack>

// 			{/* Confirmation Modal */}
// 			<Modal isOpen={isOpen} onClose={onClose} isCentered>
// 				<ModalOverlay />
// 				<ModalContent>
// 					<ModalHeader>Confirm Global Announcement</ModalHeader>
// 					<ModalBody>
// 						This will notify all users in the system. Are you sure you want to
// 						continue?
// 					</ModalBody>
// 					<ModalFooter>
// 						<Button mr={3} onClick={onClose}>
// 							Cancel
// 						</Button>
// 						<Button
// 							colorScheme='red'
// 							onClick={() => submit(buildPayload())}
// 							isLoading={isCreating}
// 						>
// 							Yes, Send to All
// 						</Button>
// 					</ModalFooter>
// 				</ModalContent>
// 			</Modal>
// 		</Box>
// 	);
// }

import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	RadioGroup,
	Radio,
	Stack,
	HStack,
	Text,
	Badge,
	useToast,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Select,
	VStack,
	Divider,
	Icon,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	CloseButton,
	FormErrorMessage,
	InputGroup,
	InputLeftElement,
	useColorModeValue,
	Heading,
	IconButton,
	Tooltip,
	Wrap,
	WrapItem,
} from '@chakra-ui/react';
import { useState, useMemo, useEffect } from 'react';
import { useCreateItemMutation } from 'api/apiSlice';
import { useTeamStructure } from 'hooks/user/useTeamStructure';
import { useRoles } from 'hooks/user/userRoles';
import useUserSession from 'hooks/useUserSession';
import {
	InfoIcon,
	WarningIcon,
	BellIcon,
	EmailIcon,
	AtSignIcon,
} from '@chakra-ui/icons';
import { FaUsers, FaUserTag, FaUserTie } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function CreateAnnouncement() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [showPreview, setShowPreview] = useState(false);

	const { team: managers } = useTeamStructure();
	const { roles } = useRoles();
	const { user: currentUser } = useUserSession();

	const [createItemMutation, { isLoading: isCreating }] =
		useCreateItemMutation();

	const [formData, setFormData] = useState({
		title: '',
		message: '',
		priority: '1',
		recipientTarget: 'ALL',
		selectedRoleId: '',
		selectedManagerId: '',
	});

	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	// Colors for priority levels
	const priorityColors = {
		1: { bg: 'green.100', color: 'green.700', label: 'Normal' },
		2: { bg: 'orange.100', color: 'orange.700', label: 'Important' },
		3: { bg: 'red.100', color: 'red.700', label: 'Critical' },
	};

	// Validate form
	const validateForm = () => {
		const newErrors = {};

		
		if (!formData.message.trim()) {
			newErrors.message = 'Message is required';
		}
		if (formData.recipientTarget === 'ROLE' && !formData.selectedRoleId) {
			newErrors.recipientTarget = 'Please select a role';
		}
		if (formData.recipientTarget === 'TEAM' && !formData.selectedManagerId) {
			newErrors.recipientTarget = 'Please select a team';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle field changes
	const handleFieldChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setTouched((prev) => ({ ...prev, [field]: true }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: '' }));
		}
	};

	// Handle recipient target change
	const handleRecipientChange = (value) => {
		setFormData((prev) => ({
			...prev,
			recipientTarget: value,
			selectedRoleId: '',
			selectedManagerId: '',
		}));
	};

	// Build payload
	function buildPayload() {
		let recipientType = 'ALL';
		let receivers = [];

		if (formData.recipientTarget === 'ROLE') {
			recipientType = 'ROLE';
			receivers = [formData.selectedRoleId];
		}

		if (formData.recipientTarget === 'TEAM') {
			recipientType = 'TEAM';
			receivers = formData.selectedManagerId
				? [formData.selectedManagerId]
				: [];
		}

		return {
			priority: parseInt(formData.priority),
			recipientType,
			type: 'ANNOUNCEMENT',
			sender: currentUser?._id,
			title: formData.title.trim(),
			message: formData.message.trim(),
			metadata: {},
			...(receivers.length > 0 && { receivers }),
		};
	}

	async function handleSubmit() {
		if (!validateForm()) {
			// Mark all fields as touched
			setTouched({
				title: true,
				message: true,
				recipientTarget: true,
			});
			return;
		}

		const payload = buildPayload();

		if (payload.recipientType === 'ALL') {
			onOpen();
			return;
		}

		await submit(payload);
	}

	async function submit(payload) {
		try {
			await createItemMutation({
				path: '/notifications',
				body: payload,
			}).unwrap();

			toast.success('Your announcement has been sent successfully.');

			// Reset form
			setFormData({
				title: '',
				message: '',
				priority: '1',
				recipientTarget: 'ALL',
				selectedRoleId: '',
				selectedManagerId: '',
			});
			setErrors({});
			setTouched({});
			onClose();
		} catch (err) {
			toast.error(err?.data?.message || 'Failed to create announcement');
		}
	}

	// Get recipient preview
	const recipientPreview = useMemo(() => {
		if (formData.recipientTarget === 'ALL') {
			return {
				label: 'All Users',
				icon: FaUsers,
				color: 'brand',
				count: 'Everyone in the system',
			};
		}

		if (formData.recipientTarget === 'ROLE') {
			if (formData.selectedRoleId === 'ALL_ROLES') {
				return {
					label: 'All Roles',
					icon: FaUserTag,
					color: 'purple',
					count: 'All users with any role',
				};
			}
			if (formData.selectedRoleId) {
				const role = roles.find((r) => r._id === formData.selectedRoleId);
				return {
					label: role?.roleName || 'Selected Role',
					icon: FaUserTag,
					color: 'purple',
					count: 'Specific role group',
				};
			}
		}

		if (formData.recipientTarget === 'TEAM' && formData.selectedManagerId) {
			const manager = managers.find(
				(m) => m._id === formData.selectedManagerId,
			);
			return {
				label: manager ? `${manager.fullName}'s Team` : 'Selected Team',
				icon: FaUserTie,
				color: 'orange',
				count: 'Team members',
			};
		}

		return null;
	}, [
		formData.recipientTarget,
		formData.selectedRoleId,
		formData.selectedManagerId,
		roles,
		managers,
	]);

	// Background colors
	const bgColor = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	return (
		<Box maxW='800px' m='auto' p={{ base: 4, md: 8 }}>
			<Box
				bg={bgColor}
				borderRadius='2xl'
				boxShadow='2xl'
				overflow='hidden'
				border='1px'
				borderColor={borderColor}
			>
				{/* Header */}
				<Box
					bg='linear-gradient(135deg, #a77f35ff 0%, #dba81bff 100%)'
					px={8}
					py={6}
				>
					<Heading
						size='lg'
						color='white'
						display='flex'
						alignItems='center'
						gap={3}
					>
						<BellIcon boxSize={8} />
						Create Announcement
					</Heading>
					<Text color='whiteAlpha.900' mt={2} fontSize='md'>
						Send important updates to your team members and stakeholders
					</Text>
				</Box>

				{/* Form */}
				<Stack spacing={6} p={8}>
					{/* Title */}
					{/* <FormControl isRequired isInvalid={touched.title && !!errors.title}>
						<FormLabel fontWeight='semibold'>Announcement Title</FormLabel>
						<InputGroup size='lg'>
							<InputLeftElement pointerEvents='none'>
								<AtSignIcon color='gray.400' />
							</InputLeftElement>
							<Input
								placeholder='e.g., System Maintenance, Holiday Schedule, etc.'
								value={formData.title}
								onChange={(e) => handleFieldChange('title', e.target.value)}
								onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
								borderRadius='lg'
								focusBorderColor='brand.400'
							/>
						</InputGroup>
						<FormErrorMessage>{errors.title}</FormErrorMessage>
					</FormControl> */}

					{/* Message */}
					<FormControl
						isRequired
						isInvalid={touched.message && !!errors.message}
					>
						<FormLabel fontWeight='semibold'>Message</FormLabel>
						<Textarea
							placeholder='Write your announcement message here...'
							rows={5}
							value={formData.message}
							onChange={(e) => handleFieldChange('message', e.target.value)}
							onBlur={() => setTouched((prev) => ({ ...prev, message: true }))}
							borderRadius='lg'
							focusBorderColor='brand.400'
							resize='vertical'
						/>
						<FormErrorMessage>{errors.message}</FormErrorMessage>
					</FormControl>

					{/* Priority */}
					{/* <FormControl>
						<FormLabel fontWeight='semibold'>Priority Level</FormLabel>
						<Wrap spacing={3}>
							{Object.entries(priorityColors).map(
								([value, { bg, color, label }]) => (
									<WrapItem key={value}>
										<Button
											size='lg'
											bg={formData.priority === value ? bg : 'gray.50'}
											color={formData.priority === value ? color : 'gray.600'}
											border='2px'
											borderColor={
												formData.priority === value ? color : 'gray.200'
											}
											onClick={() => handleFieldChange('priority', value)}
											_hover={{
												bg: bg,
												transform: 'scale(1.02)',
											}}
											_active={{
												transform: 'scale(0.98)',
											}}
											transition='all 0.2s'
											minW='120px'
										>
											{label}
											{value === '3' && <WarningIcon ml={2} />}
										</Button>
									</WrapItem>
								),
							)}
						</Wrap>
					</FormControl> */}

					<Divider />

					{/* Recipient Selection */}
					<FormControl
						isInvalid={touched.recipientTarget && !!errors.recipientTarget}
					>
						<FormLabel fontWeight='semibold'>Send To</FormLabel>
						<RadioGroup
							value={formData.recipientTarget}
							onChange={handleRecipientChange}
						>
							<Wrap spacing={4}>
								<WrapItem>
									<Radio value='ALL' colorScheme='brand' size='lg' spacing={3}>
										<HStack>
											<Icon as={FaUsers} color='brand.500' />
											<Text>All Users</Text>
										</HStack>
									</Radio>
								</WrapItem>
								<WrapItem>
									<Radio
										value='ROLE'
										colorScheme='purple'
										size='lg'
										spacing={3}
									>
										<HStack>
											<Icon as={FaUserTag} color='purple.500' />
											<Text>By Role</Text>
										</HStack>
									</Radio>
								</WrapItem>
								<WrapItem>
									<Radio
										value='TEAM'
										colorScheme='orange'
										size='lg'
										spacing={3}
									>
										<HStack>
											<Icon as={FaUserTie} color='orange.500' />
											<Text>By Team</Text>
										</HStack>
									</Radio>
								</WrapItem>
							</Wrap>
						</RadioGroup>
						<FormErrorMessage>{errors.recipientTarget}</FormErrorMessage>
					</FormControl>

					{/* Role Selection Dropdown */}
					{formData.recipientTarget === 'ROLE' && (
						<FormControl>
							<FormLabel>Select Role</FormLabel>
							<Select
								placeholder='Choose a role'
								size='lg'
								value={formData.selectedRoleId}
								onChange={(e) =>
									handleFieldChange('selectedRoleId', e.target.value)
								}
								borderRadius='lg'
								focusBorderColor='purple.400'
								bg='white'
							>
								{/* <option value='ALL_ROLES' style={{ fontWeight: 'bold' }}>
									👥 All Roles
								</option> */}
								{roles.map((role) => (
									<option key={role._id} value={role._id}>
										{role.roleName}
									</option>
								))}
							</Select>
							<Text fontSize='sm' color='gray.500' mt={2}>
								Select a specific role or choose "All Roles" to target everyone
							</Text>
						</FormControl>
					)}

					{/* Team Selection Dropdown */}
					{formData.recipientTarget === 'TEAM' && (
						<FormControl>
							<FormLabel>Select Team (Manager)</FormLabel>
							<Select
								placeholder='Choose a team'
								size='lg'
								value={formData.selectedManagerId}
								onChange={(e) =>
									handleFieldChange('selectedManagerId', e.target.value)
								}
								borderRadius='lg'
								focusBorderColor='orange.400'
								bg='white'
							>
								{managers.map((manager) => (
									<option key={manager._id} value={manager._id}>
										{manager.fullName}'s Team
									</option>
								))}
							</Select>
							<Text fontSize='sm' color='gray.500' mt={2}>
								Select a team manager to send announcement to their team members
							</Text>
						</FormControl>
					)}

					{/* Preview Section */}
					{recipientPreview && (
						<Box
							mt={4}
							p={4}
							bg='gray.50'
							borderRadius='lg'
							border='1px'
							borderColor='gray.200'
						>
							<HStack justify='space-between' mb={2}>
								<Text fontWeight='bold' fontSize='sm' color='gray.600'>
									RECIPIENT PREVIEW
								</Text>
								<Tooltip label='This shows who will receive the announcement'>
									<InfoIcon color='gray.400' />
								</Tooltip>
							</HStack>
							<HStack spacing={4}>
								<Icon
									as={recipientPreview.icon}
									boxSize={8}
									color={`${recipientPreview.color}.500`}
								/>
								<VStack align='start' spacing={1}>
									<Text fontWeight='bold' fontSize='lg'>
										{recipientPreview.label}
									</Text>
									<Badge colorScheme={recipientPreview.color}>
										{recipientPreview.count}
									</Badge>
								</VStack>
							</HStack>
						</Box>
					)}

					{/* Submit Button */}
					<Button
						size='lg'
						height='60px'
						colorScheme='brand'
						onClick={handleSubmit}
						isLoading={isCreating}
						loadingText='Sending...'
						spinnerPlacement='end'
						isDisabled={!formData.message}
						bgGradient='linear(to-r, brand.400, brand.500)'
						_hover={{
							bgGradient: 'linear(to-r, brand.500, brand.600)',
							transform: 'translateY(-2px)',
							boxShadow: 'xl',
						}}
						_active={{
							transform: 'translateY(0)',
						}}
						transition='all 0.2s'
						fontSize='lg'
						leftIcon={<BellIcon />}
					>
						Send Announcement
					</Button>
				</Stack>
			</Box>

			{/* Confirmation Modal */}
			<Modal isOpen={isOpen} onClose={onClose} isCentered size='lg'>
				<ModalOverlay backdropFilter='blur(10px)' />
				<ModalContent borderRadius='2xl'>
					<ModalHeader borderBottom='1px' borderColor='gray.200'>
						<HStack>
							<WarningIcon color='orange.500' />
							<Text>Confirm Global Announcement</Text>
						</HStack>
					</ModalHeader>
					<ModalBody py={6}>
						<Alert
							status='warning'
							variant='subtle'
							flexDirection='column'
							alignItems='center'
							justifyContent='center'
							textAlign='center'
							borderRadius='lg'
						>
							<AlertIcon boxSize='30px' mr={0} />
							<AlertTitle mt={4} mb={1} fontSize='lg'>
								This will notify all users!
							</AlertTitle>
							<AlertDescription maxWidth='sm'>
								Are you sure you want to send this announcement to everyone in
								the system? This action cannot be undone.
							</AlertDescription>
						</Alert>
					</ModalBody>
					<ModalFooter borderTop='1px' borderColor='gray.200' gap={3}>
						<Button variant='ghost' onClick={onClose} size='lg'>
							Cancel
						</Button>
						<Button
							colorScheme='red'
							onClick={() => submit(buildPayload())}
							isLoading={isCreating}
							loadingText='Sending...'
							size='lg'
							px={8}
						>
							Yes, Send to All
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
}
