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
import { usePermissions } from 'hooks/usePermissions';
import MessageSuccessModal from '../MessageSuccessModal';

export default function CreateAnnouncement() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [showPreview, setShowPreview] = useState(false);
	const [isSuccessOpen, setIsSuccessOpen] = useState(false);
	const [successMessage, setSuccessMessage] = useState({
		onlineUsers: 0,
		offlineUsers: 0,
	});

	const { team: managers } = useTeamStructure();
	const { roles } = useRoles();
	const { user: currentUser, userRoleName } = useUserSession();
	const { hasPermission } = usePermissions();

	const [createItemMutation, { isLoading: isCreating }] =
		useCreateItemMutation();

	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	const isManager = userRoleName === 'Manager';

	const [formData, setFormData] = useState({
		title: '',
		message: '',
		priority: '1',
		recipientTarget: 'ALL',
		selectedRoleId: '',
		selectedManagerId: '',
	});

	// Handle field changes
	const handleFieldChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setTouched((prev) => ({ ...prev, [field]: true }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: '' }));
		}
	};

	useEffect(() => {
		if (isManager) {
			setFormData((prev) => ({
				...prev,
				recipientTarget: 'TEAM',
				selectedManagerId: currentUser?._id,
			}));
		}
	}, [isManager]);

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
			const res = await createItemMutation({
				path: '/notifications',
				body: payload,
			}).unwrap();

			toast.success('Your announcement has been sent successfully.');

			console.log(res);

			setSuccessMessage({
				totalReceivers: res?.doc?.stats?.totalReceivers,
				onlineUsers: res?.doc?.stats?.online,
				offlineUsers: res?.doc?.stats?.disconnected,
			});

			// Reset form
			setIsSuccessOpen(true);

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
		<Box maxW='1000px' m='auto' p={{ base: 2, md: 4 }}>
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
					{hasPermission('announcement', 'all_users') && (
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
										<Radio
											value='ALL'
											colorScheme='brand'
											size='lg'
											spacing={3}
										>
											<HStack>
												<Icon as={FaUsers} color='brand.500' />
												<Text fontSize={{ base: 'xs', md: 'sm' }}>
													All Users
												</Text>
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
												<Text fontSize={{ base: 'xs', md: 'sm' }}>By Role</Text>
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
												<Text fontSize={{ base: 'xs', md: 'sm' }}>By Team</Text>
											</HStack>
										</Radio>
									</WrapItem>
								</Wrap>
							</RadioGroup>
							<FormErrorMessage>{errors.recipientTarget}</FormErrorMessage>
						</FormControl>
					)}

					{/* Role Selection Dropdown */}
					{formData.recipientTarget === 'ROLE' && (
						<FormControl>
							<FormLabel
								fontSize={{ base: 'xs', md: 'sm' }}
								fontWeight='semibold'
							>
								Select Role
							</FormLabel>
							<Select
								placeholder='Choose a role'
								size='md'
								value={formData.selectedRoleId}
								onChange={(e) =>
									handleFieldChange('selectedRoleId', e.target.value)
								}
								borderRadius='lg'
								focusBorderColor='brand.400'
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
							<Text fontSize='xs' color='gray.500' mt={2}>
								Select a specific role or choose "All Roles" to target everyone
							</Text>
						</FormControl>
					)}

					{/* Team Selection Dropdown */}
					{formData.recipientTarget === 'TEAM' && (
						<FormControl>
							<FormLabel
								fontSize={{ base: 'xs', md: 'sm' }}
								fontWeight='semibold'
							>
								Select Team (Manager)
							</FormLabel>
							<Select
								placeholder='Choose a team'
								size='md'
								value={formData.selectedManagerId}
								onChange={(e) =>
									handleFieldChange('selectedManagerId', e.target.value)
								}
								borderRadius='lg'
								focusBorderColor='brand.400'
								bg='white'
							>
								{managers.map((manager) => (
									<option key={manager._id} value={manager._id}>
										{manager.fullName}'s Team
									</option>
								))}
							</Select>
							<Text fontSize='xs' color='gray.500' mt={2}>
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
								<Text
									fontWeight='bold'
									fontSize={{ base: 'xs', md: 'sm' }}
									color='gray.600'
								>
									RECIPIENT PREVIEW
								</Text>
								<Tooltip label='This shows who will receive the announcement'>
									<InfoIcon color='gray.400' />
								</Tooltip>
							</HStack>
							<HStack spacing={4}>
								<Icon
									as={recipientPreview.icon}
									boxSize={{ base: 4, md: 6 }}
									color={`${recipientPreview.color}.500`}
								/>
								<VStack align='start' spacing={1}>
									<Text fontWeight='bold' fontSize={{ base: 'xs', md: 'sm' }}>
										{recipientPreview.label}
									</Text>
									<Badge
										colorScheme={recipientPreview.color}
										fontSize={{ base: 'xs', md: 'sm' }}
									>
										{recipientPreview.count}
									</Badge>
								</VStack>
							</HStack>
						</Box>
					)}

					{/* Submit Button */}
					<Button
						size='md'
						height={{ base: '30px', md: '40px' }}
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
						fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
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

			{/* Success Modal */}
			{isSuccessOpen && successMessage && (
				<MessageSuccessModal
					isOpen={isSuccessOpen}
					onClose={() => setIsSuccessOpen(false)}
					onlineUsers={successMessage?.onlineUsers}
					offlineUsers={successMessage?.offlineUsers}
					totalReceivers={successMessage?.totalReceivers}
				/>
			)}
		</Box>
	);
}
