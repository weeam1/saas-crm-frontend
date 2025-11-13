// // /* eslint-disable react-hooks/exhaustive-deps */
// // // 	Button,
// // // 	FormLabel,
// // // 	Grid,
// // // 	GridItem,
// // // 	IconButton,
// // // 	Input,
// // // 	InputGroup,
// // // 	InputLeftElement,
// // // 	Modal,
// // // 	ModalBody,
// // // 	ModalContent,
// // // 	ModalFooter,
// // // 	ModalHeader,
// // // 	ModalOverlay,
// // // 	Select,
// // // 	Text,
// // // 	useDisclosure,
// // // 	useColorModeValue,
// // // 	Flex,
// // // 	Box,
// // // } from '@chakra-ui/react';
// // import Spinner from 'components/spinner/Spinner';
// // import { useFormik } from 'formik';
// // import { useEffect, useState } from 'react';
// // import { useSelector } from 'react-redux';
// // import { toast } from 'react-toastify';
// // import { userSchema } from 'schema';
// // import { useDispatch } from 'react-redux';
// // import { setUser } from '../../../redux/localSlice';
// import { useFetchItemsQuery } from 'api/apiSlice';
// // import ImageUpload from './components/ImageUpload';
// // import { useUpdateItemMutation } from 'api/apiSlice';
// // import { getApi } from 'services/api';
// // import ReplaceManager from './components/ReplaceManager';
// // import { buttonStyle } from 'utils/btn';
// // import PasswordPermission from './components/PasswordPermission';
// // import { fetchActiveTree, fetchTree } from './userApis';
// import { currencyOptions, jobTypes } from 'utils/options';
// import useUserSession from 'hooks/useUserSession';
// // import { useParams } from 'react-router-dom';
// import Loader from 'components/loading/Loader';

// import {
// 	Box,
// 	Flex,
// 	Text,
// 	Grid,
// 	GridItem,
// 	FormControl,
// 	FormLabel,
// 	Input,
// 	Select,
// 	Button,
// 	InputGroup,
// 	InputLeftElement,
// 	Textarea,
// 	useColorModeValue,
// 	VStack,
// 	HStack,
// 	Badge,
// 	Icon,
// 	Tooltip,
// 	Alert,
// 	AlertIcon,
// 	useToast,
// 	FormErrorMessage,
// 	Avatar,
// } from '@chakra-ui/react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { PhoneIcon, WarningIcon, InfoIcon } from '@chakra-ui/icons';
// import {
// 	FiUser,
// 	FiMail,
// 	FiDollarSign,
// 	FiTarget,
// 	FiShield,
// 	FiBriefcase,
// 	FiCamera,
// 	FiSave,
// } from 'react-icons/fi';

// // Validation Schema
// const userProfileSchema = yup.object().shape({
// 	firstName: yup
// 		.string()
// 		.required('First name is required')
// 		.min(2, 'First name must be at least 2 characters')
// 		.max(50, 'First name cannot exceed 50 characters'),
// 	lastName: yup
// 		.string()
// 		.required('Last name is required')
// 		.min(2, 'Last name must be at least 2 characters')
// 		.max(50, 'Last name cannot exceed 50 characters'),
// 	phoneNumber: yup
// 		.string()
// 		.required('Phone number is required')
// 		.matches(/^\+?[\d\s-()]+$/, 'Please enter a valid phone number'),
// 	username: yup
// 		.string()
// 		.email('Please enter a valid email address')
// 		.required('Email is required'),
// 	salaryType: yup.string().optional(),
// 	salary: yup
// 		.number()
// 		.typeError('Salary must be a number')
// 		.positive('Salary must be positive')
// 		.optional(),
// 	role: yup.string().required('Role is required'),
// 	agency: yup.string().required('Agency is required'),
// 	currency: yup.string().optional(),
// 	target: yup
// 		.number()
// 		.typeError('Target must be a number')
// 		.min(0, 'Target cannot be negative')
// 		.optional(),
// 	password: yup
// 		.string()
// 		.min(8, 'Password must be at least 8 characters')
// 		.matches(
// 			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
// 			'Password must contain uppercase, lowercase, and numbers'
// 		)
// 		.optional(),
// 	teamLead: yup.string().optional(),
// 	parent: yup.string().when('role', {
// 		is: 'Agent',
// 		then: (schema) => schema.required('Manager is required for agents'),
// 		otherwise: (schema) => schema.optional(),
// 	}),
// });

// const UserProfileEdit = ({ isSuperAdmin = true }) => {
// 	const toast = useToast();
// 	const { id } = useParam();

// 	const { user } = useUserSession();

// 	// Color values
// 	const borderColor = useColorModeValue('gray.200', 'gray.600');
// 	const focusColor = useColorModeValue('brand.500', 'brand.300');
// 	const subtleBg = useColorModeValue('gray.50', 'gray.700');
// 	const errorColor = useColorModeValue('red.500', 'red.300');

// 	const { data: agencies } = useFetchItemsQuery({
// 		path: '/agencies',
// 	});
// 	const { data: roles } = useFetchItemsQuery({ path: '/role-access/v2' });

// 	const {
// 		data: userData,
// 		isLoading: userLoading,
// 		refetch,
// 		isFetching,
// 	} = useFetchItemsQuery(
// 		{
// 			path: `/user/v2/view/${id}`,
// 		},
// 		{
// 			skip: !id,
// 			refetchOnMountOrArgChange: true,
// 		}
// 	);

// 	// Mock data - replace with your actual data
// 	const jobTypes = [
// 		{ value: 'monthly', label: 'Monthly' },
// 		{ value: 'hourly', label: 'Hourly' },
// 		{ value: 'project', label: 'Project Based' },
// 	];

// 	const filteredManagers = [
// 		{ _id: '1', firstName: 'John', lastName: 'Smith' },
// 		{ _id: '2', firstName: 'Sarah', lastName: 'Johnson' },
// 	];

// 	// Form setup
// 	const {
// 		register,
// 		handleSubmit,
// 		reset,
// 		watch,
// 		setValue,
// 		formState: { errors, isDirty, isValid, isSubmitting },
// 	} = useForm({
// 		mode: 'onChange',
// 		resolver: yupResolver(userProfileSchema),
// 		defaultValues: {
// 			firstName: userData?.firstName || '',
// 			lastName: userData?.lastName || '',
// 			phoneNumber: userData?.phoneNumber || '',
// 			username: userData?.username || '',
// 			salaryType: userData?.salaryType || '',
// 			salary: userData?.salary || '',
// 			role: userData?.role?._id || userData?.role || '',
// 			agency: userData?.agency?._id || userData?.agency || '',
// 			currency: userData?.currency || 'USD',
// 			target: userData?.target || '',
// 			password: '',
// 			teamLead: userData?.teamLead || '',
// 			parent: userData?.parent?._id || userData?.parent || '',
// 		},
// 	});

// 	// Watch role for conditional fields
// 	const selectedRole = watch('role');
// 	const selectedRoleName = roles.find(
// 		(role) => role._id === selectedRole
// 	)?.roleName;
// 	const descriptionLength = watch('description')?.length || 0;

// 	// Submit handler
// 	const onSubmit = async (data) => {
// 		try {
// 			const payload = {
// 				firstName: data.firstName.trim(),
// 				lastName: data.lastName.trim(),
// 				phoneNumber: data.phoneNumber,
// 				username: data.username,
// 				...(isSuperAdmin && {
// 					salaryType: data.salaryType,
// 					salary: data.salary ? parseFloat(data.salary) : undefined,
// 					role: data.role,
// 					agency: data.agency,
// 					...(data.password && { password: data.password }),
// 				}),
// 				...(data.teamLead && { teamLead: data.teamLead }),
// 				...(data.parent && { parent: data.parent }),
// 				currency: data.currency,
// 				target: data.target ? parseFloat(data.target) : undefined,
// 			};

// 			await onUpdate(payload);

// 			toast({
// 				title: 'Profile updated successfully',
// 				status: 'success',
// 				duration: 3000,
// 				isClosable: true,
// 				position: 'top-right',
// 			});
// 		} catch (error) {
// 			toast({
// 				title: 'Failed to update profile',
// 				description: error.message || 'Please try again',
// 				status: 'error',
// 				duration: 5000,
// 				isClosable: true,
// 				position: 'top-right',
// 			});
// 		}
// 	};

// 	const handleCancel = () => {
// 		reset();
// 		toast({
// 			title: 'Changes discarded',
// 			status: 'info',
// 			duration: 2000,
// 			isClosable: true,
// 		});
// 	};

// 	const RequiredStar = () => (
// 		<Text as='span' color='red.500' ml={1}>
// 			*
// 		</Text>
// 	);

// 	const FieldWrapper = ({
// 		children,
// 		label,
// 		isRequired = false,
// 		error,
// 		helperText,
// 	}) => (
// 		<FormControl isInvalid={!!error}>
// 			<FormLabel
// 				display='flex'
// 				alignItems='center'
// 				fontSize='sm'
// 				fontWeight='600'
// 				color='gray.700'
// 				mb={2}
// 			>
// 				{label}
// 				{isRequired && <RequiredStar />}
// 				{helperText && (
// 					<Tooltip label={helperText} hasArrow>
// 						<Icon as={InfoIcon} w={3} h={3} color='gray.400' ml={1} />
// 					</Tooltip>
// 				)}
// 			</FormLabel>
// 			{children}
// 			{error && (
// 				<FormErrorMessage display='flex' alignItems='center' gap={1}>
// 					<WarningIcon w={3} h={3} />
// 					{error.message}
// 				</FormErrorMessage>
// 			)}
// 		</FormControl>
// 	);

// 	return (
// 		<Box bg='gray.50' minH='100vh' p={6}>
// 			<Box
// 				borderRadius='2xl'
// 				boxShadow='xl'
// 				border='1px'
// 				borderColor={borderColor}
// 				overflow='hidden'
// 				maxW='6xl'
// 				mx='auto'
// 			>
// 				{/* Header */}
// 				<Flex
// 					bg='white'
// 					color='gray.800'
// 					px={8}
// 					py={6}
// 					borderBottom='1px'
// 					borderColor={borderColor}
// 					alignItems='center'
// 					gap={4}
// 				>
// 					<Avatar
// 						size='lg'
// 						name={`${userData?.firstName} ${userData?.lastName}`}
// 						src={userData?.profileImage}
// 						bg='brand.500'
// 					/>
// 					<Box>
// 						<Text fontSize='2xl' fontWeight='bold'>
// 							Edit User Profile
// 						</Text>
// 						<Text color='gray.600' fontSize='sm'>
// 							Update user information and settings
// 						</Text>
// 					</Box>
// 					<Badge
// 						colorScheme='blue'
// 						variant='subtle'
// 						ml='auto'
// 						fontSize='sm'
// 						px={3}
// 						py={1}
// 						borderRadius='full'
// 					>
// 						{selectedRoleName || userData?.role?.roleName || 'User'}
// 					</Badge>
// 				</Flex>

// 				<Box p={0}>
// 					<form onSubmit={handleSubmit(onSubmit)}>
// 						<VStack spacing={0} align='stretch'>
// 							{/* Profile Image Section */}
// 							<Box p={8} borderBottom='1px solid' borderColor={borderColor}>
// 								<Text fontSize='lg' fontWeight='600' color='gray.700' mb={4}>
// 									Profile Picture
// 								</Text>
// 								<Flex gap={6} alignItems='flex-start'>
// 									<Avatar
// 										size='2xl'
// 										name={`${watch('firstName')} ${watch('lastName')}`}
// 										src={userData?.profileImage}
// 										bg='brand.500'
// 									/>
// 									<Box>
// 										<Text fontSize='sm' color='gray.600' mb={3}>
// 											Upload a new profile picture. Recommended size: 256x256
// 											pixels.
// 										</Text>
// 										<Button leftIcon={<FiCamera />} variant='outline' size='sm'>
// 											Change Photo
// 										</Button>
// 									</Box>
// 								</Flex>
// 							</Box>

// 							{/* Personal Information */}
// 							<Box p={8} borderBottom='1px solid' borderColor={borderColor}>
// 								<Text fontSize='lg' fontWeight='600' color='gray.700' mb={6}>
// 									Personal Information
// 								</Text>

// 								<Grid templateColumns='repeat(12, 1fr)' gap={6}>
// 									<GridItem colSpan={{ base: 12, md: 6 }}>
// 										<FieldWrapper
// 											label='First Name'
// 											isRequired
// 											error={errors.firstName}
// 										>
// 											<Input
// 												size='lg'
// 												{...register('firstName')}
// 												placeholder='Enter first name'
// 												focusBorderColor={focusColor}
// 												borderColor={borderColor}
// 												bg='white'
// 											/>
// 										</FieldWrapper>
// 									</GridItem>

// 									<GridItem colSpan={{ base: 12, md: 6 }}>
// 										<FieldWrapper
// 											label='Last Name'
// 											isRequired
// 											error={errors.lastName}
// 										>
// 											<Input
// 												size='lg'
// 												{...register('lastName')}
// 												placeholder='Enter last name'
// 												focusBorderColor={focusColor}
// 												borderColor={borderColor}
// 												bg='white'
// 											/>
// 										</FieldWrapper>
// 									</GridItem>

// 									<GridItem colSpan={{ base: 12, md: 6 }}>
// 										<FieldWrapper
// 											label='Phone Number'
// 											isRequired
// 											error={errors.phoneNumber}
// 											helperText='Include country code'
// 										>
// 											<InputGroup>
// 												<InputLeftElement pointerEvents='none'>
// 													<PhoneIcon color='gray.400' />
// 												</InputLeftElement>
// 												<Input
// 													size='lg'
// 													type='tel'
// 													{...register('phoneNumber')}
// 													placeholder='+1 (555) 123-4567'
// 													focusBorderColor={focusColor}
// 													borderColor={borderColor}
// 													bg='white'
// 													pl={10}
// 												/>
// 											</InputGroup>
// 										</FieldWrapper>
// 									</GridItem>

// 									<GridItem colSpan={{ base: 12, md: 6 }}>
// 										<FieldWrapper
// 											label='Email Address'
// 											isRequired
// 											error={errors.username}
// 										>
// 											<InputGroup>
// 												<InputLeftElement pointerEvents='none'>
// 													<Icon as={FiMail} color='gray.400' />
// 												</InputLeftElement>
// 												<Input
// 													size='lg'
// 													type='email'
// 													{...register('username')}
// 													placeholder='user@company.com'
// 													focusBorderColor={focusColor}
// 													borderColor={borderColor}
// 													bg='white'
// 													pl={10}
// 												/>
// 											</InputGroup>
// 										</FieldWrapper>
// 									</GridItem>
// 								</Grid>
// 							</Box>

// 							{/* Employment Details - Super Admin Only */}
// 							{isSuperAdmin && (
// 								<Box p={8} borderBottom='1px solid' borderColor={borderColor}>
// 									<Text fontSize='lg' fontWeight='600' color='gray.700' mb={6}>
// 										Employment Details
// 									</Text>

// 									<Grid templateColumns='repeat(12, 1fr)' gap={6}>
// 										<GridItem colSpan={{ base: 12, md: 6 }}>
// 											<FieldWrapper
// 												label='Salary Type'
// 												error={errors.salaryType}
// 											>
// 												<Select
// 													size='lg'
// 													{...register('salaryType')}
// 													placeholder='Select salary type'
// 													focusBorderColor={focusColor}
// 													borderColor={borderColor}
// 													bg='white'
// 												>
// 													{jobTypes?.map((job) => (
// 														<option key={job.value} value={job.value}>
// 															{job.label}
// 														</option>
// 													))}
// 												</Select>
// 											</FieldWrapper>
// 										</GridItem>

// 										<GridItem colSpan={{ base: 12, md: 6 }}>
// 											<FieldWrapper
// 												label='Salary'
// 												error={errors.salary}
// 												helperText='Gross annual amount'
// 											>
// 												<InputGroup>
// 													<InputLeftElement pointerEvents='none'>
// 														<Icon as={FiDollarSign} color='gray.400' />
// 													</InputLeftElement>
// 													<Input
// 														size='lg'
// 														type='number'
// 														min={0}
// 														step='0.01'
// 														{...register('salary')}
// 														placeholder='0.00'
// 														focusBorderColor={focusColor}
// 														borderColor={borderColor}
// 														bg='white'
// 														pl={10}
// 													/>
// 												</InputGroup>
// 											</FieldWrapper>
// 										</GridItem>

// 										<GridItem colSpan={{ base: 12, md: 6 }}>
// 											<FieldWrapper label='Role' isRequired error={errors.role}>
// 												<Select
// 													size='lg'
// 													{...register('role')}
// 													placeholder='Select user role'
// 													focusBorderColor={focusColor}
// 													borderColor={borderColor}
// 													bg='white'
// 												>
// 													{roles
// 														?.filter((role) => role.roleName !== 'sadmin')
// 														?.map((role) => (
// 															<option key={role?._id} value={role?._id}>
// 																{role?.roleName}
// 															</option>
// 														))}
// 												</Select>
// 											</FieldWrapper>
// 										</GridItem>

// 										<GridItem colSpan={{ base: 12, md: 6 }}>
// 											<FieldWrapper
// 												label='Team Lead'
// 												helperText='Select team lead for reporting'
// 											>
// 												<Select
// 													size='lg'
// 													{...register('teamLead')}
// 													placeholder='Select team lead'
// 													focusBorderColor={focusColor}
// 													borderColor={borderColor}
// 													bg='white'
// 												>
// 													<option value='lead1'>John Smith</option>
// 													<option value='lead2'>Sarah Johnson</option>
// 													<option value='lead3'>Mike Chen</option>
// 												</Select>
// 											</FieldWrapper>
// 										</GridItem>

// 										{selectedRoleName === 'Agent' && (
// 											<GridItem colSpan={{ base: 12, md: 6 }}>
// 												<FieldWrapper
// 													label='Manager'
// 													isRequired
// 													error={errors.parent}
// 													helperText='Direct reporting manager'
// 												>
// 													<Select
// 														size='lg'
// 														{...register('parent')}
// 														placeholder='Select manager'
// 														focusBorderColor={focusColor}
// 														borderColor={borderColor}
// 														bg='white'
// 													>
// 														{filteredManagers?.map((manager) => (
// 															<option key={manager?._id} value={manager?._id}>
// 																{manager?.firstName + ' ' + manager?.lastName}
// 															</option>
// 														))}
// 													</Select>
// 												</FieldWrapper>
// 											</GridItem>
// 										)}

// 										<GridItem colSpan={{ base: 12, md: 6 }}>
// 											<FieldWrapper
// 												label='Agency'
// 												isRequired
// 												error={errors.agency}
// 											>
// 												<Select
// 													size='lg'
// 													{...register('agency')}
// 													placeholder='Select agency'
// 													focusBorderColor={focusColor}
// 													borderColor={borderColor}
// 													bg='white'
// 												>
// 													{agencies?.doc?.map((agency) => (
// 														<option key={agency._id} value={agency._id}>
// 															{agency.name}
// 														</option>
// 													))}
// 												</Select>
// 											</FieldWrapper>
// 										</GridItem>
// 									</Grid>
// 								</Box>
// 							)}

// 							{/* Performance Settings */}
// 							{(isSuperAdmin || user?.roles[0]?.roleName === 'Manager') && (
// 								<Box p={8} borderBottom='1px solid' borderColor={borderColor}>
// 									<Text fontSize='lg' fontWeight='600' color='gray.700' mb={6}>
// 										Performance Settings
// 									</Text>

// 									<Grid templateColumns='repeat(12, 1fr)' gap={6}>
// 										<GridItem colSpan={{ base: 12, md: 6 }}>
// 											<FieldWrapper
// 												label='Currency'
// 												helperText='Default currency for transactions'
// 											>
// 												<Select
// 													size='lg'
// 													{...register('currency')}
// 													placeholder='Select currency'
// 													focusBorderColor={focusColor}
// 													borderColor={borderColor}
// 													bg='white'
// 												>
// 													{currencyOptions?.map((item) => (
// 														<option key={item.value} value={item.value}>
// 															{item.label}
// 														</option>
// 													))}
// 												</Select>
// 											</FieldWrapper>
// 										</GridItem>

// 										<GridItem colSpan={{ base: 12, md: 6 }}>
// 											<FieldWrapper
// 												label='Target'
// 												error={errors.target}
// 												helperText='Performance target for this period'
// 											>
// 												<InputGroup>
// 													<InputLeftElement pointerEvents='none'>
// 														<Icon as={FiTarget} color='gray.400' />
// 													</InputLeftElement>
// 													<Input
// 														size='lg'
// 														type='number'
// 														min={0}
// 														{...register('target')}
// 														placeholder='Enter target amount'
// 														focusBorderColor={focusColor}
// 														borderColor={borderColor}
// 														bg='white'
// 														pl={10}
// 													/>
// 												</InputGroup>
// 											</FieldWrapper>
// 										</GridItem>
// 									</Grid>
// 								</Box>
// 							)}

// 							{/* Security Section */}
// 							{isSuperAdmin && (
// 								<Box p={8}>
// 									<Text fontSize='lg' fontWeight='600' color='gray.700' mb={6}>
// 										Security Settings
// 									</Text>

// 									<Grid templateColumns='repeat(12, 1fr)' gap={6}>
// 										<GridItem colSpan={{ base: 12, md: 6 }}>
// 											<FieldWrapper
// 												label='New Password'
// 												error={errors.password}
// 												helperText='Leave blank to keep current password'
// 											>
// 												<InputGroup>
// 													<InputLeftElement pointerEvents='none'>
// 														<Icon as={FiShield} color='gray.400' />
// 													</InputLeftElement>
// 													<Input
// 														size='lg'
// 														type='password'
// 														{...register('password')}
// 														placeholder='Enter new password'
// 														focusBorderColor={focusColor}
// 														borderColor={borderColor}
// 														bg='white'
// 														pl={10}
// 													/>
// 												</InputGroup>
// 											</FieldWrapper>
// 										</GridItem>
// 									</Grid>

// 									<Alert status='info' borderRadius='md' mt={4}>
// 										<AlertIcon />
// 										Password must be at least 8 characters with uppercase,
// 										lowercase, and numbers.
// 									</Alert>
// 								</Box>
// 							)}
// 						</VStack>

// 						{/* Footer Actions */}
// 						<Flex
// 							borderTop='1px solid'
// 							borderColor={borderColor}
// 							py={6}
// 							px={8}
// 							justifyContent='flex-end'
// 							gap={4}
// 							bg={subtleBg}
// 						>
// 							<Button
// 								size='lg'
// 								variant='outline'
// 								onClick={handleCancel}
// 								isDisabled={isSubmitting || !isDirty}
// 								minW='120px'
// 							>
// 								Cancel
// 							</Button>
// 							<Button
// 								size='lg'
// 								colorScheme='brand'
// 								type='submit'
// 								isLoading={isSubmitting}
// 								loadingText='Updating...'
// 								leftIcon={<FiSave />}
// 								isDisabled={!isDirty || !isValid}
// 								minW='140px'
// 								fontWeight='semibold'
// 							>
// 								Save Changes
// 							</Button>
// 						</Flex>
// 					</form>
// 				</Box>
// 			</Box>
// 		</Box>
// 	);
// };

// export default UserProfileEdit;

// // import {
// // 	Box,
// // 	Flex,
// // 	Text,
// // 	Grid,
// // 	GridItem,
// // 	FormLabel,
// // 	Input,
// // 	Select,
// // 	Button,
// // 	InputGroup,
// // 	InputLeftElement,
// // 	useColorModeValue,
// // 	VStack,
// // 	HStack,
// // 	Badge,
// // 	Icon,
// // 	Tooltip,
// // 	Alert,
// // 	AlertIcon,
// // 	Divider,
// // 	useToast,
// // 	useDisclosure,
// // } from '@chakra-ui/react';
// // import { PhoneIcon, StarIcon, WarningIcon, InfoIcon } from '@chakra-ui/icons';
// // import {
// // 	FiUser,
// // 	FiMail,
// // 	FiDollarSign,
// // 	FiTarget,
// // 	FiShield,
// // 	FiUsers,
// // 	FiBriefcase,
// // } from 'react-icons/fi';

// // const EditUser = (props) => {
// // 	const { fetchData, data, userData, setEdit } = props;

// // 	const { id } = useParams();

// // 	const headerBg = useColorModeValue('brand.300', 'brand.100');
// // 	const headerText = useColorModeValue('brand.700', 'brand.900');

// // 	// Enhanced color scheme
// // 	const borderColor = useColorModeValue('gray.200', 'gray.600');
// // 	const focusColor = useColorModeValue('brand.500', 'brand.300');
// // 	const subtleBg = useColorModeValue('gray.50', 'gray.700');
// // 	const errorColor = useColorModeValue('red.500', 'red.300');
// // 	const successColor = useColorModeValue('green.500', 'green.300');
// // 	const warningColor = useColorModeValue('orange.500', 'orange.300');

// // 	const { data: agencies } = useFetchItemsQuery({
// // 		path: '/agencies',
// // 	});
// // 	const { data: roles } = useFetchItemsQuery({ path: '/role-access/v2' });

// // 	const {
// // 		data: userDetails,
// // 		isLoading: userLoading,
// // 		refetch,
// // 		isFetching,
// // 	} = useFetchItemsQuery(
// // 		{
// // 			path: `/user/v2/view/${id}`,
// // 		},
// // 		{
// // 			skip: !id,
// // 			refetchOnMountOrArgChange: true,
// // 		}
// // 	);

// // 	const {
// // 		isOpen: replaceIsOpen,
// // 		onOpen: replaceOnOpen,
// // 		onClose: replaceOnClose,
// // 	} = useDisclosure();

// // 	const {
// // 		isOpen: passwordIsOpen,
// // 		onOpen: passwordOnOpen,
// // 		onClose: passwordOnClose,
// // 	} = useDisclosure();

// // 	const [replacementManager, setReplacementManager] = useState('');
// // 	const [securityPassword, setSecurityPassword] = useState('');

// // 	const controller = new AbortController();

// // 	const [uploadImage, setUploadImage] = useState(false);

// // 	const initialValues = {
// // 		firstName: data?.firstName ?? '',
// // 		lastName: data?.lastName ?? '',
// // 		username: data?.username ?? '',
// // 		agency: data?.agency?._id ?? '',
// // 		salary: data?.salary ?? '',
// // 		salaryType: data?.salaryType ?? '',
// // 		phoneNumber: data?.phoneNumber ?? '',
// // 		profileImage: data?.profileImage ?? '',
// // 		parent: data?.parent ?? '',
// // 		target: data?.target ?? '',
// // 		roles: data?.roles ?? [],
// // 		role: data?.roles[0]?._id ?? '',
// // 		currency: data?.currency ?? 'AED',
// // 	};

// // 	const { user, isSuperAdmin } = useUserSession();

// // 	const tree = useSelector((state) => state.user.activeTree);

// // 	const filteredManagers = tree?.managers?.filter(
// // 		(item) => item._id !== data?._id
// // 	);

// // 	const [filteredAgents, setFilteredAgents] = useState([]);

// // 	// const getAllAgents = (tree) => {
// // 	// 	const agentsList = Object.values(tree?.agents || {}).flat();
// // 	// 	return agentsList;
// // 	// };

// // 	// const allAgents = getAllAgents(tree);

// // 	const handleManagerChange = (e) => {
// // 		const selectedManagerId = e.target.value;
// // 		handleChange(e); // Update form values
// // 		if (selectedManagerId) {
// // 			const agentsKey = `manager-${selectedManagerId}`;
// // 			const agentsList = tree?.agents[agentsKey] || [];

// // 			// filter only agents they have teamLeader is null
// // 			const filtered = agentsList?.filter((agent) => !agent?.teamLeader);
// // 			setFilteredAgents(filtered);
// // 		} else {
// // 			setFilteredAgents([]);
// // 		}
// // 	};

// // 	const formik = useFormik({
// // 		initialValues: initialValues,
// // 		validationSchema: userSchema,
// // 		enableReinitialize: true,
// // 		onSubmit: (values, { resetForm }) => {
// // 			EditData();
// // 		},
// // 	});

// // 	useEffect(() => {
// // 		if (props.edit) {
// // 			// Replace initial Data with your actual initial values
// // 			formik.setValues(initialValues);
// // 		}
// // 	}, [props.edit]);

// // 	const dispatch = useDispatch();

// // 	const handleCloseModal = () => {
// // 		setEdit(false);
// // 		formik.resetForm();
// // 	};

// // 	const {
// // 		errors,
// // 		touched,
// // 		values,
// // 		handleBlur,
// // 		handleChange,
// // 		handleSubmit,
// // 		setFieldValue,
// // 	} = formik;

// // 	const [updateItemMutation, { isLoading }] = useUpdateItemMutation();

// // 	const EditData = async () => {
// // 		try {
// // 			const role = roles.find((role) => role?._id === values.role);

// // 			const valuesObj = { ...values };

// // 			if (
// // 				data?.roles[0]?.roleName === 'Manager' &&
// // 				data?.roles[0]?.roleName !== role?.roleName &&
// // 				!replacementManager &&
// // 				role?.roleName !== 'Agent'
// // 			) {
// // 				replaceOnOpen();
// // 				return;
// // 			} else if (replacementManager) {
// // 				valuesObj['replacementManager'] = replacementManager;
// // 			}

// // 			if (role?.roleName === 'Agent') {
// // 				if (!values.parent) {
// // 					toast.error('Please select a manager.');
// // 					return;
// // 				}
// // 				valuesObj['parent'] = values.parent;
// // 				valuesObj['replacementManager'] = values.parent;

// // 				setReplacementManager(values.parent);
// // 			} else if (role?.roleName === 'Manager') {
// // 				delete valuesObj['parent'];
// // 			} else {
// // 				delete valuesObj['parent'];
// // 			}

// // 			if (
// // 				!securityPassword &&
// // 				(data?.roles[0]?.roleName !== role?.roleName || values?.password)
// // 			) {
// // 				passwordOnOpen();
// // 				return;
// // 			}

// // 			if (securityPassword)
// // 				valuesObj['securityPassword'] = securityPassword?.trim();

// // 			const bodyData = Object.entries(valuesObj).reduce((acc, [key, value]) => {
// // 				if (value !== undefined && value !== null) {
// // 					acc[key] =
// // 						key === 'roles' && Array.isArray(value)
// // 							? value.map((role) => role.roleName).filter(Boolean)
// // 							: value;
// // 				}
// // 				return acc;
// // 			}, {});

// // 			let response = await updateItemMutation({
// // 				path: `/user/v2/edit/${props.selectedId}`,
// // 				body: bodyData,
// // 			}).unwrap();

// // 			if (response?.status) {
// // 				setEdit(false);
// // 				let updatedUserData = userData;
// // 				if (user?._id === props.selectedId) {
// // 					if (updatedUserData && typeof updatedUserData === 'object') {
// // 						// Create a new object with the updated firstName
// // 						updatedUserData = {
// // 							...updatedUserData,
// // 							firstName: values?.firstName,
// // 							lastName: values?.lastName,
// // 						};
// // 					}

// // 					// const updatedDataString = JSON.stringify(updatedUserData);

// // 					dispatch(setUser(updatedUserData));
// // 				}

// // 				console.log({ bodyData, values });

// // 				if (user?._id === props.selectedId && bodyData?.password) {
// // 					console.warn('reeload the pagee');
// // 					window.location.reload();
// // 					localStorage.removeItem('token');
// // 					localStorage.removeItem('user');
// // 					localStorage.removeItem('accessToken');
// // 				}

// // 				if (props?.refrence === 'table') {
// // 					props.updateUsers(response?.user);
// // 				} else fetchData();

// // 				// formik.resetForm();
// // 				props.setAction((pre) => !pre);

// // 				// get updated users data
// // 				// fetchActiveTree(dispatch);
// // 				// fetchTree(dispatch);

// // 				if (!controller.signal.aborted) {
// // 					toast.success('User update successfully');
// // 					setReplacementManager('');
// // 					setSecurityPassword('');
// // 					handleCloseModal();
// // 				}
// // 			}
// // 		} catch (e) {
// // 			console.log(e);
// // 			if (!controller.signal.aborted) {
// // 				toast.error(e?.data?.error || 'User is not updated!');
// // 				setReplacementManager('');
// // 				setSecurityPassword('');
// // 			}
// // 		}
// // 	};

// // 	const RequiredStar = () => (
// // 		<Text as='span' color='red.500' ml={1}>
// // 			*
// // 		</Text>
// // 	);

// // 	const FieldWrapper = ({
// // 		children,
// // 		label,
// // 		isRequired,
// // 		error,
// // 		touched,
// // 		helperText,
// // 	}) => (
// // 		<VStack align='stretch' spacing={2}>
// // 			<FormLabel
// // 				display='flex'
// // 				alignItems='center'
// // 				fontSize='sm'
// // 				fontWeight='600'
// // 				color='gray.700'
// // 				mb={1}
// // 			>
// // 				{label}
// // 				{isRequired && <RequiredStar />}
// // 				{helperText && (
// // 					<Tooltip label={helperText} hasArrow>
// // 						<Icon as={InfoIcon} w={3} h={3} color='gray.400' ml={1} />
// // 					</Tooltip>
// // 				)}
// // 			</FormLabel>
// // 			{children}
// // 			{error && touched && (
// // 				<Text
// // 					fontSize='xs'
// // 					color={errorColor}
// // 					display='flex'
// // 					alignItems='center'
// // 					gap={1}
// // 				>
// // 					<WarningIcon w={3} h={3} />
// // 					{error}
// // 				</Text>
// // 			)}
// // 		</VStack>
// // 	);

// // 	if (userLoading) {
// // 		return (
// // 			<Flex justify='center' align='center' minH='400px'>
// // 				<Loader size='xl' />
// // 			</Flex>
// // 		);
// // 	}

// // 	return (
// // 		// <Box bg='gray.100' p='4'>
// // 		// 	{userLoading ? (
// // 		// 		<Loader />
// // 		// 	) : (
// // 		// 		<>
// // 		// 			<Flex
// // 		// 				bg={headerBg}
// // 		// 				color={headerText}
// // 		// 				px={6}
// // 		// 				py={3}
// // 		// 				position='sticky'
// // 		// 				top='0'
// // 		// 				zIndex='10'
// // 		// 				boxShadow='md'
// // 		// 			>
// // 		// 				<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold'>
// // 		// 					Edit User
// // 		// 				</Text>
// // 		// 			</Flex>

// // 		// 			<Box p={5} borderBottom='1px solid' borderColor={borderColor}>
// // 		// 				<Grid templateColumns='repeat(12, 1fr)' gap={3} p={4}>
// // 		// 					<GridItem colSpan={12}>
// // 		// 						<ImageUpload
// // 		// 							profileImage={values?.profileImage}
// // 		// 							formik={formik}
// // 		// 							user={data}
// // 		// 							setUploadImage={setUploadImage}
// // 		// 						/>
// // 		// 					</GridItem>
// // 		// 					<GridItem colSpan={{ base: 6 }}>
// // 		// 						<FormLabel
// // 		// 							display='flex'
// // 		// 							ms='4px'
// // 		// 							fontSize='sm'
// // 		// 							fontWeight='500'
// // 		// 							mb='8px'
// // 		// 						>
// // 		// 							First Name
// // 		// 						</FormLabel>
// // 		// 						<Input
// // 		// 							fontSize='sm'
// // 		// 							onChange={handleChange}
// // 		// 							onBlur={handleBlur}
// // 		// 							value={values.firstName}
// // 		// 							name='firstName'
// // 		// 							placeholder='firstName'
// // 		// 							fontWeight='500'
// // 		// 							borderColor={
// // 		// 								errors.firstName && touched.firstName ? 'red.300' : null
// // 		// 							}
// // 		// 						/>
// // 		// 						<Text mb='10px' color={'red'}>
// // 		// 							{errors.firstName && touched.firstName && errors.firstName}
// // 		// 						</Text>
// // 		// 					</GridItem>
// // 		// 					<GridItem colSpan={{ base: 6 }}>
// // 		// 						<FormLabel
// // 		// 							display='flex'
// // 		// 							ms='4px'
// // 		// 							fontSize='sm'
// // 		// 							fontWeight='500'
// // 		// 							mb='8px'
// // 		// 						>
// // 		// 							Last Name
// // 		// 						</FormLabel>
// // 		// 						<Input
// // 		// 							fontSize='sm'
// // 		// 							onChange={handleChange}
// // 		// 							onBlur={handleBlur}
// // 		// 							value={values.lastName}
// // 		// 							name='lastName'
// // 		// 							placeholder='Last Name'
// // 		// 							fontWeight='500'
// // 		// 							borderColor={
// // 		// 								errors.lastName && touched.lastName ? 'red.300' : null
// // 		// 							}
// // 		// 						/>
// // 		// 						<Text mb='10px' color={'red'}>
// // 		// 							{errors.lastName && touched.lastName && errors.lastName}
// // 		// 						</Text>
// // 		// 					</GridItem>
// // 		// 					<GridItem colSpan={{ base: 6 }}>
// // 		// 						<FormLabel
// // 		// 							display='flex'
// // 		// 							ms='4px'
// // 		// 							fontSize='sm'
// // 		// 							fontWeight='500'
// // 		// 							mb='8px'
// // 		// 						>
// // 		// 							Phone Number<Text color={'red'}>*</Text>
// // 		// 						</FormLabel>
// // 		// 						<InputGroup>
// // 		// 							<InputLeftElement
// // 		// 								pointerEvents='none'
// // 		// 								children={
// // 		// 									<PhoneIcon color='gray.300' borderRadius='16px' />
// // 		// 								}
// // 		// 							/>
// // 		// 							<Input
// // 		// 								type='tel'
// // 		// 								fontSize='sm'
// // 		// 								onChange={handleChange}
// // 		// 								onBlur={handleBlur}
// // 		// 								value={values.phoneNumber}
// // 		// 								name='phoneNumber'
// // 		// 								fontWeight='500'
// // 		// 								borderColor={
// // 		// 									errors.phoneNumber && touched.phoneNumber
// // 		// 										? 'red.300'
// // 		// 										: null
// // 		// 								}
// // 		// 								placeholder='Phone number'
// // 		// 								borderRadius='16px'
// // 		// 							/>
// // 		// 						</InputGroup>
// // 		// 						<Text mb='10px' color={'red'}>
// // 		// 							{errors.phoneNumber &&
// // 		// 								touched.phoneNumber &&
// // 		// 								errors.phoneNumber}
// // 		// 						</Text>
// // 		// 					</GridItem>
// // 		// 					{isSuperAdmin && (
// // 		// 						<>
// // 		// 							<GridItem colSpan={{ base: 6 }}>
// // 		// 								<FormLabel
// // 		// 									display='flex'
// // 		// 									ms='4px'
// // 		// 									fontSize='sm'
// // 		// 									fontWeight='500'
// // 		// 									mb='8px'
// // 		// 								>
// // 		// 									Email
// // 		// 								</FormLabel>
// // 		// 								<Input
// // 		// 									fontSize='sm'
// // 		// 									type='email'
// // 		// 									onChange={handleChange}
// // 		// 									onBlur={handleBlur}
// // 		// 									value={values.username}
// // 		// 									name='username'
// // 		// 									placeholder='Email Address'
// // 		// 									fontWeight='500'
// // 		// 									borderColor={
// // 		// 										errors.username && touched.username ? 'red.300' : null
// // 		// 									}
// // 		// 								/>
// // 		// 								<Text mb='10px' color={'red'}>
// // 		// 									{errors.username && touched.username && errors.username}
// // 		// 								</Text>
// // 		// 							</GridItem>
// // 		// 							<GridItem colSpan={{ base: 6 }}>
// // 		// 								<FormLabel
// // 		// 									display='flex'
// // 		// 									ms='4px'
// // 		// 									fontSize='sm'
// // 		// 									fontWeight='500'
// // 		// 									mb='8px'
// // 		// 								>
// // 		// 									Salary Type
// // 		// 								</FormLabel>
// // 		// 								<Select
// // 		// 									name='salaryType'
// // 		// 									value={values.salaryType}
// // 		// 									onChange={handleChange}
// // 		// 									onBlur={handleBlur}
// // 		// 									placeholder='Select salary type'
// // 		// 									borderColor={
// // 		// 										errors.salaryType && touched.salaryType
// // 		// 											? 'red.300'
// // 		// 											: null
// // 		// 									}
// // 		// 								>
// // 		// 									{jobTypes?.map((job) => (
// // 		// 										<option key={job.value} value={job.value}>
// // 		// 											{job.label}
// // 		// 										</option>
// // 		// 									))}
// // 		// 								</Select>

// // 		// 								<Text mb='10px' color={'red'}>
// // 		// 									{errors.salaryType &&
// // 		// 										touched.salaryType &&
// // 		// 										errors.salaryType}
// // 		// 								</Text>
// // 		// 							</GridItem>
// // 		// 							<GridItem colSpan={{ base: 6 }}>
// // 		// 								<FormLabel
// // 		// 									display='flex'
// // 		// 									ms='4px'
// // 		// 									fontSize='sm'
// // 		// 									fontWeight='500'
// // 		// 									mb='8px'
// // 		// 								>
// // 		// 									Salary
// // 		// 								</FormLabel>
// // 		// 								<Input
// // 		// 									fontSize='sm'
// // 		// 									type='number'
// // 		// 									min={0}
// // 		// 									onChange={handleChange}
// // 		// 									onBlur={handleBlur}
// // 		// 									value={values.salary}
// // 		// 									name='salary'
// // 		// 									fontWeight='500'
// // 		// 									borderColor={
// // 		// 										errors.salary && touched.salary ? 'red.300' : null
// // 		// 									}
// // 		// 								/>
// // 		// 								<Text mb='10px' color={'red'}>
// // 		// 									{errors.salary && touched.salary && errors.salary}
// // 		// 								</Text>
// // 		// 							</GridItem>

// // 		// 							<GridItem colSpan={{ base: 6 }}>
// // 		// 								<FormLabel
// // 		// 									display='flex'
// // 		// 									ms='4px'
// // 		// 									fontSize='sm'
// // 		// 									fontWeight='500'
// // 		// 									mb='8px'
// // 		// 								>
// // 		// 									Select Role <Text color={'red'}>*</Text>
// // 		// 								</FormLabel>
// // 		// 								<Select
// // 		// 									name='role'
// // 		// 									value={values.role}
// // 		// 									onChange={handleChange}
// // 		// 									onBlur={handleBlur}
// // 		// 									placeholder='Select Role'
// // 		// 									borderColor={
// // 		// 										errors.role && touched.role ? 'red.300' : null
// // 		// 									}
// // 		// 									className={
// // 		// 										errors.role && touched.role ? 'isInvalid' : null
// // 		// 									}
// // 		// 								>
// // 		// 									{roles
// // 		// 										?.filter((role) => role.roleName !== 'sadmin')
// // 		// 										?.map((role) => (
// // 		// 											<option key={role?._id} value={role?._id}>
// // 		// 												{role?.roleName}
// // 		// 											</option>
// // 		// 										))}
// // 		// 								</Select>
// // 		// 								<Text mb='10px' color='red'>
// // 		// 									{errors.role && touched.role && errors.role}
// // 		// 								</Text>
// // 		// 							</GridItem>
// // 		// 							{roles.find((role) => role?._id === values.role)?.roleName ===
// // 		// 								'Agent' && (
// // 		// 								<GridItem colSpan={{ base: 6 }}>
// // 		// 									<FormLabel
// // 		// 										display='flex'
// // 		// 										ms='4px'
// // 		// 										fontSize='sm'
// // 		// 										fontWeight='500'
// // 		// 										mb='8px'
// // 		// 									>
// // 		// 										Select Manager <Text color={'red'}>*</Text>
// // 		// 									</FormLabel>
// // 		// 									<Select
// // 		// 										name='parent'
// // 		// 										value={values.parent}
// // 		// 										onChange={handleChange}
// // 		// 										onBlur={handleBlur}
// // 		// 										placeholder='Select Manager'
// // 		// 									>
// // 		// 										{filteredManagers?.map((manager) => (
// // 		// 											<option value={manager?._id}>
// // 		// 												{manager?.firstName + ' ' + manager?.lastName}
// // 		// 											</option>
// // 		// 										))}
// // 		// 									</Select>
// // 		// 								</GridItem>
// // 		// 							)}

// // 		// 							<GridItem colSpan={{ base: 6 }}>
// // 		// 								<FormLabel
// // 		// 									display='flex'
// // 		// 									ms='4px'
// // 		// 									fontSize='sm'
// // 		// 									fontWeight='500'
// // 		// 									mb='8px'
// // 		// 								>
// // 		// 									Select agency <Text color={'red'}>*</Text>
// // 		// 								</FormLabel>
// // 		// 								<Select
// // 		// 									name='agency'
// // 		// 									value={values.agency}
// // 		// 									onChange={handleChange}
// // 		// 									onBlur={handleBlur}
// // 		// 									placeholder='Select agency'
// // 		// 									borderColor={
// // 		// 										errors.agency && touched.agency ? 'red.300' : null
// // 		// 									}
// // 		// 								>
// // 		// 									{agencies?.doc?.map((agency) => (
// // 		// 										<option key={agency._id} value={agency._id}>
// // 		// 											{agency.name}
// // 		// 										</option>
// // 		// 									))}
// // 		// 								</Select>

// // 		// 								<Text mb='10px' color={'red'}>
// // 		// 									{errors.agency && touched.agency && errors.agency}
// // 		// 								</Text>
// // 		// 							</GridItem>
// // 		// 						</>
// // 		// 					)}

// // 		// 					{(isSuperAdmin ||
// // 		// 						(user?.roles[0]?.roleName === 'Manager' &&
// // 		// 							user._id !== data._id)) && (
// // 		// 						<>
// // 		// 							<GridItem colSpan={{ base: 6 }}>
// // 		// 								<FormLabel
// // 		// 									display='flex'
// // 		// 									ms='4px'
// // 		// 									fontSize='sm'
// // 		// 									fontWeight='500'
// // 		// 									mb='8px'
// // 		// 								>
// // 		// 									Currency
// // 		// 								</FormLabel>
// // 		// 								<Select
// // 		// 									name='currency'
// // 		// 									value={values.currency}
// // 		// 									onChange={handleChange}
// // 		// 									onBlur={handleBlur}
// // 		// 									isDisabled
// // 		// 									placeholder='Select currency'
// // 		// 									borderColor={
// // 		// 										errors.currency && touched.currency ? 'red.300' : null
// // 		// 									}
// // 		// 								>
// // 		// 									{currencyOptions?.map((item) => (
// // 		// 										<option key={item.value} value={item.value}>
// // 		// 											{item.label}
// // 		// 										</option>
// // 		// 									))}
// // 		// 								</Select>

// // 		// 								<Text mb='10px' color={'red'}>
// // 		// 									{errors.currency && touched.currency && errors.currency}
// // 		// 								</Text>
// // 		// 							</GridItem>
// // 		// 							<GridItem colSpan={{ base: 6 }}>
// // 		// 								<FormLabel
// // 		// 									display='flex'
// // 		// 									ms='4px'
// // 		// 									fontSize='sm'
// // 		// 									fontWeight='500'
// // 		// 									mb='8px'
// // 		// 								>
// // 		// 									Target
// // 		// 								</FormLabel>
// // 		// 								<InputGroup>
// // 		// 									<Input
// // 		// 										type='number'
// // 		// 										fontSize='sm'
// // 		// 										onChange={handleChange}
// // 		// 										onBlur={handleBlur}
// // 		// 										value={values.target}
// // 		// 										name='target'
// // 		// 										fontWeight='500'
// // 		// 										placeholder='Target'
// // 		// 									/>
// // 		// 								</InputGroup>
// // 		// 							</GridItem>
// // 		// 						</>
// // 		// 					)}

// // 		// 					{isSuperAdmin && (
// // 		// 						<GridItem colSpan={{ base: 6 }}>
// // 		// 							<FormLabel
// // 		// 								display='flex'
// // 		// 								ms='4px'
// // 		// 								fontSize='sm'
// // 		// 								fontWeight='500'
// // 		// 								mb='8px'
// // 		// 							>
// // 		// 								New Password
// // 		// 							</FormLabel>
// // 		// 							<InputGroup>
// // 		// 								<Input
// // 		// 									type='text'
// // 		// 									fontSize='sm'
// // 		// 									onChange={handleChange}
// // 		// 									onBlur={handleBlur}
// // 		// 									value={values.password}
// // 		// 									name='password'
// // 		// 									fontWeight='500'
// // 		// 									placeholder='New Password'
// // 		// 									borderRadius='16px'
// // 		// 								/>
// // 		// 							</InputGroup>
// // 		// 						</GridItem>
// // 		// 					)}
// // 		// 				</Grid>
// // 		// 			</Box>
// // 		// 			<Box
// // 		// 				borderTop='1px solid'
// // 		// 				borderColor={borderColor}
// // 		// 				py={3}
// // 		// 				px={5}
// // 		// 				display='flex'
// // 		// 				justifyContent='flex-end'
// // 		// 				gap={3}
// // 		// 			>
// // 		// 				<Button
// // 		// 					{...buttonStyle}
// // 		// 					variant='solid'
// // 		// 					bg='brand.400'
// // 		// 					fontSize='lg'
// // 		// 					aria-label='update'
// // 		// 					disabled={isLoading ? true : false}
// // 		// 					onClick={handleSubmit}
// // 		// 				>
// // 		// 					{isLoading ? <Spinner /> : 'Update'}
// // 		// 				</Button>
// // 		// 			</Box>
// // 		// 		</>
// // 		// 	)}

// // 		// 	{replaceIsOpen && (
// // 		// 		<ReplaceManager
// // 		// 			isOpen={replaceIsOpen}
// // 		// 			onClose={replaceOnClose}
// // 		// 			managers={filteredManagers}
// // 		// 			replacementManager={replacementManager}
// // 		// 			handleProceed={() => {
// // 		// 				replaceOnClose();
// // 		// 				EditData();
// // 		// 			}}
// // 		// 			setReplacementManager={setReplacementManager}
// // 		// 		/>
// // 		// 	)}

// // 		// 	{passwordIsOpen && (
// // 		// 		<PasswordPermission
// // 		// 			isOpen={passwordIsOpen}
// // 		// 			onClose={passwordOnClose}
// // 		// 			securityPassword={securityPassword}
// // 		// 			setSecurityPassword={setSecurityPassword}
// // 		// 			handleProceed={() => {
// // 		// 				passwordOnClose();
// // 		// 				EditData();
// // 		// 			}}
// // 		// 		/>
// // 		// 	)}
// // 		// </Box>

// // 		<Box bg='gray.50' minH='100vh' p={6}>
// // 			<Box
// // 				borderRadius='2xl'
// // 				boxShadow='xl'
// // 				border='1px'
// // 				borderColor={borderColor}
// // 				overflow='hidden'
// // 			>
// // 				{/* Header */}
// // 				<Flex
// // 					bg={headerBg}
// // 					color={headerText}
// // 					px={8}
// // 					py={4}
// // 					position='sticky'
// // 					top='0'
// // 					zIndex='10'
// // 					boxShadow='sm'
// // 					alignItems='center'
// // 					gap={3}
// // 				>
// // 					<Icon as={FiUser} boxSize={5} />
// // 					<Text fontSize='xl' fontWeight='bold'>
// // 						Edit User Profile
// // 					</Text>
// // 				</Flex>

// // 				<Box p={0}>
// // 					{/* Profile Image Section */}
// // 					<Box p={6} borderBottom='1px solid' borderColor={borderColor}>
// // 						<Text fontSize='lg' fontWeight='600' color='gray.700' mb={4}>
// // 							Profile Picture
// // 						</Text>
// // 						<ImageUpload
// // 							profileImage={values?.profileImage}
// // 							formik={formik}
// // 							user={data}
// // 							setUploadImage={setUploadImage}
// // 						/>
// // 					</Box>

// // 					{/* Personal Information Section */}
// // 					<Box p={6} borderBottom='1px solid' borderColor={borderColor}>
// // 						<Text fontSize='lg' fontWeight='600' color='gray.700' mb={6}>
// // 							Personal Information
// // 						</Text>

// // 						<Grid templateColumns='repeat(12, 1fr)' gap={6}>
// // 							<GridItem colSpan={{ base: 12, md: 6 }}>
// // 								<FieldWrapper
// // 									label='First Name'
// // 									isRequired
// // 									error={errors.firstName}
// // 									touched={touched.firstName}
// // 								>
// // 									<Input
// // 										size='lg'
// // 										onChange={handleChange}
// // 										onBlur={handleBlur}
// // 										value={values.firstName}
// // 										name='firstName'
// // 										placeholder='Enter first name'
// // 										focusBorderColor={focusColor}
// // 										borderColor={
// // 											errors.firstName && touched.firstName
// // 												? errorColor
// // 												: borderColor
// // 										}
// // 										bg='white'
// // 									/>
// // 								</FieldWrapper>
// // 							</GridItem>

// // 							<GridItem colSpan={{ base: 12, md: 6 }}>
// // 								<FieldWrapper
// // 									label='Last Name'
// // 									isRequired
// // 									error={errors.lastName}
// // 									touched={touched.lastName}
// // 								>
// // 									<Input
// // 										size='lg'
// // 										onChange={handleChange}
// // 										onBlur={handleBlur}
// // 										value={values.lastName}
// // 										name='lastName'
// // 										placeholder='Enter last name'
// // 										focusBorderColor={focusColor}
// // 										borderColor={
// // 											errors.lastName && touched.lastName
// // 												? errorColor
// // 												: borderColor
// // 										}
// // 										bg='white'
// // 									/>
// // 								</FieldWrapper>
// // 							</GridItem>

// // 							<GridItem colSpan={{ base: 12, md: 6 }}>
// // 								<FieldWrapper
// // 									label='Phone Number'
// // 									isRequired
// // 									error={errors.phoneNumber}
// // 									touched={touched.phoneNumber}
// // 									helperText='Include country code if international'
// // 								>
// // 									<InputGroup>
// // 										<Input
// // 											size='lg'
// // 											type='tel'
// // 											onChange={handleChange}
// // 											onBlur={handleBlur}
// // 											value={values.phoneNumber}
// // 											name='phoneNumber'
// // 											placeholder='+1 (555) 123-4567'
// // 											focusBorderColor={focusColor}
// // 											borderColor={
// // 												errors.phoneNumber && touched.phoneNumber
// // 													? errorColor
// // 													: borderColor
// // 											}
// // 											bg='white'
// // 										/>
// // 									</InputGroup>
// // 								</FieldWrapper>
// // 							</GridItem>
// // 						</Grid>
// // 					</Box>

// // 					{/* Employment Details - Super Admin Only */}
// // 					{isSuperAdmin && (
// // 						<Box p={6} borderBottom='1px solid' borderColor={borderColor}>
// // 							<Text fontSize='lg' fontWeight='600' color='gray.700' mb={6}>
// // 								Employment Details
// // 							</Text>

// // 							<Grid templateColumns='repeat(12, 1fr)' gap={6}>
// // 								<GridItem colSpan={{ base: 12, md: 6 }}>
// // 									<FieldWrapper
// // 										label='Email Address'
// // 										isRequired
// // 										error={errors.username}
// // 										touched={touched.username}
// // 									>
// // 										<InputGroup>
// // 											<InputGroup
// // 												size='lg'
// // 												type='email'
// // 												onChange={handleChange}
// // 												onBlur={handleBlur}
// // 												value={values.username}
// // 												name='username'
// // 												placeholder='user@company.com'
// // 												focusBorderColor={focusColor}
// // 												borderColor={
// // 													errors.username && touched.username
// // 														? errorColor
// // 														: borderColor
// // 												}
// // 												bg='white'
// // 											/>
// // 										</InputGroup>
// // 									</FieldWrapper>
// // 								</GridItem>

// // 								<GridItem colSpan={{ base: 12, md: 6 }}>
// // 									<FieldWrapper
// // 										label='Salary Type'
// // 										error={errors.salaryType}
// // 										touched={touched.salaryType}
// // 									>
// // 										<Select
// // 											size='lg'
// // 											name='salaryType'
// // 											value={values.salaryType}
// // 											onChange={handleChange}
// // 											onBlur={handleBlur}
// // 											placeholder='Select salary type'
// // 											focusBorderColor={focusColor}
// // 											borderColor={
// // 												errors.salaryType && touched.salaryType
// // 													? errorColor
// // 													: borderColor
// // 											}
// // 											bg='white'
// // 										>
// // 											{jobTypes?.map((job) => (
// // 												<option key={job.value} value={job.value}>
// // 													{job.label}
// // 												</option>
// // 											))}
// // 										</Select>
// // 									</FieldWrapper>
// // 								</GridItem>

// // 								<GridItem colSpan={{ base: 12, md: 6 }}>
// // 									<FieldWrapper label='Salary' helperText='Gross annual salary'>
// // 										<InputGroup>
// // 											<Input
// // 												size='lg'
// // 												type='number'
// // 												min={0}
// // 												onChange={handleChange}
// // 												onBlur={handleBlur}
// // 												value={values.salary}
// // 												name='salary'
// // 												placeholder='0.00'
// // 												focusBorderColor={focusColor}
// // 												borderColor={
// // 													errors.salary && touched.salary
// // 														? errorColor
// // 														: borderColor
// // 												}
// // 												bg='white'
// // 											/>
// // 										</InputGroup>
// // 									</FieldWrapper>
// // 								</GridItem>

// // 								<GridItem colSpan={{ base: 12, md: 6 }}>
// // 									<FieldWrapper
// // 										label='Role'
// // 										isRequired
// // 										error={errors.role}
// // 										touched={touched.role}
// // 									>
// // 										<Select
// // 											size='lg'
// // 											name='role'
// // 											value={values.role}
// // 											onChange={handleChange}
// // 											onBlur={handleBlur}
// // 											placeholder='Select user role'
// // 											focusBorderColor={focusColor}
// // 											borderColor={
// // 												errors.role && touched.role ? errorColor : borderColor
// // 											}
// // 											bg='white'
// // 										>
// // 											{roles
// // 												?.filter((role) => role.roleName !== 'sadmin')
// // 												?.map((role) => (
// // 													<option key={role?._id} value={role?._id}>
// // 														{role?.roleName}
// // 													</option>
// // 												))}
// // 										</Select>
// // 									</FieldWrapper>
// // 								</GridItem>

// // 								{/* Team Lead Selection */}
// // 								<GridItem colSpan={{ base: 12, md: 6 }}>
// // 									<FieldWrapper
// // 										label='Team Lead'
// // 										helperText='Select team lead for reporting structure'
// // 									>
// // 										<Select
// // 											size='lg'
// // 											name='teamLead'
// // 											value={values.teamLead}
// // 											onChange={handleChange}
// // 											onBlur={handleBlur}
// // 											placeholder='Select team lead'
// // 											focusBorderColor={focusColor}
// // 											borderColor={borderColor}
// // 											bg='white'
// // 										>
// // 											<option value='lead1'>John Smith</option>
// // 											<option value='lead2'>Sarah Johnson</option>
// // 											<option value='lead3'>Mike Chen</option>
// // 											{/* Add your team lead options here */}
// // 										</Select>
// // 									</FieldWrapper>
// // 								</GridItem>

// // 								{roles.find((role) => role?._id === values.role)?.roleName ===
// // 									'Agent' && (
// // 									<GridItem colSpan={{ base: 12, md: 6 }}>
// // 										<FieldWrapper
// // 											label='Manager'
// // 											isRequired
// // 											helperText='Direct reporting manager'
// // 										>
// // 											<Select
// // 												size='lg'
// // 												name='parent'
// // 												value={values.parent}
// // 												onChange={handleChange}
// // 												onBlur={handleBlur}
// // 												placeholder='Select manager'
// // 												focusBorderColor={focusColor}
// // 												borderColor={borderColor}
// // 												bg='white'
// // 											>
// // 												{filteredManagers?.map((manager) => (
// // 													<option key={manager?._id} value={manager?._id}>
// // 														{manager?.firstName + ' ' + manager?.lastName}
// // 													</option>
// // 												))}
// // 											</Select>
// // 										</FieldWrapper>
// // 									</GridItem>
// // 								)}

// // 								<GridItem colSpan={{ base: 12, md: 6 }}>
// // 									<FieldWrapper
// // 										label='Agency'
// // 										isRequired
// // 										error={errors.agency}
// // 										touched={touched.agency}
// // 									>
// // 										<Select
// // 											size='lg'
// // 											name='agency'
// // 											value={values.agency}
// // 											onChange={handleChange}
// // 											onBlur={handleBlur}
// // 											placeholder='Select agency'
// // 											focusBorderColor={focusColor}
// // 											borderColor={
// // 												errors.agency && touched.agency
// // 													? errorColor
// // 													: borderColor
// // 											}
// // 											bg='white'
// // 										>
// // 											{agencies?.doc?.map((agency) => (
// // 												<option key={agency._id} value={agency._id}>
// // 													{agency.name}
// // 												</option>
// // 											))}
// // 										</Select>
// // 									</FieldWrapper>
// // 								</GridItem>
// // 							</Grid>
// // 						</Box>
// // 					)}

// // 					{/* Performance Settings */}
// // 					{(isSuperAdmin ||
// // 						(user?.roles[0]?.roleName === 'Manager' &&
// // 							user._id !== data._id)) && (
// // 						<Box p={6} borderBottom='1px solid' borderColor={borderColor}>
// // 							<Text fontSize='lg' fontWeight='600' color='gray.700' mb={6}>
// // 								Performance Settings
// // 							</Text>

// // 							<Grid templateColumns='repeat(12, 1fr)' gap={6}>
// // 								<GridItem colSpan={{ base: 12, md: 6 }}>
// // 									<FieldWrapper
// // 										label='Currency'
// // 										helperText='Default currency for transactions'
// // 									>
// // 										<Select
// // 											size='lg'
// // 											name='currency'
// // 											value={values.currency}
// // 											onChange={handleChange}
// // 											onBlur={handleBlur}
// // 											isDisabled
// // 											placeholder='Select currency'
// // 											focusBorderColor={focusColor}
// // 											borderColor={
// // 												errors.currency && touched.currency
// // 													? errorColor
// // 													: borderColor
// // 											}
// // 											bg='white'
// // 										>
// // 											{currencyOptions?.map((item) => (
// // 												<option key={item.value} value={item.value}>
// // 													{item.label}
// // 												</option>
// // 											))}
// // 										</Select>
// // 									</FieldWrapper>
// // 								</GridItem>

// // 								<GridItem colSpan={{ base: 12, md: 6 }}>
// // 									<FieldWrapper
// // 										label='Target'
// // 										helperText='Performance target for this period'
// // 									>
// // 										<InputGroup>
// // 											<Input
// // 												size='lg'
// // 												type='number'
// // 												onChange={handleChange}
// // 												onBlur={handleBlur}
// // 												value={values.target}
// // 												name='target'
// // 												placeholder='Enter target amount'
// // 												focusBorderColor={focusColor}
// // 												borderColor={borderColor}
// // 												bg='white'
// // 											/>
// // 										</InputGroup>
// // 									</FieldWrapper>
// // 								</GridItem>
// // 							</Grid>
// // 						</Box>
// // 					)}

// // 					{/* Security Section */}
// // 					{isSuperAdmin && (
// // 						<Box p={6}>
// // 							<Text fontSize='lg' fontWeight='600' color='gray.700' mb={6}>
// // 								Security Settings
// // 							</Text>

// // 							<Grid templateColumns='repeat(12, 1fr)' gap={6}>
// // 								<GridItem colSpan={{ base: 12, md: 6 }}>
// // 									<FieldWrapper
// // 										label='New Password'
// // 										helperText='Leave blank to keep current password'
// // 									>
// // 										<InputGroup>
// // 											<Input
// // 												size='lg'
// // 												type='text'
// // 												onChange={handleChange}
// // 												onBlur={handleBlur}
// // 												value={values.password}
// // 												name='password'
// // 												placeholder='Enter new password'
// // 												focusBorderColor={focusColor}
// // 												borderColor={borderColor}
// // 												bg='white'
// // 											/>
// // 										</InputGroup>
// // 									</FieldWrapper>
// // 								</GridItem>
// // 							</Grid>

// // 							<Alert status='info' borderRadius='md' mt={4}>
// // 								<AlertIcon />
// // 								Password must be at least 8 characters with uppercase,
// // 								lowercase, and numbers.
// // 							</Alert>
// // 						</Box>
// // 					)}
// // 				</Box>

// // 				{/* Footer Actions */}
// // 				<Flex
// // 					borderTop='1px solid'
// // 					borderColor={borderColor}
// // 					py={6}
// // 					px={8}
// // 					justifyContent='flex-end'
// // 					gap={4}
// // 					bg='gray.100'
// // 				>
// // 					<Button
// // 						size='lg'
// // 						variant='outline'
// // 						onClick={() =>
// // 							toast({
// // 								title: 'Changes discarded',
// // 								status: 'info',
// // 								duration: 3000,
// // 								isClosable: true,
// // 							})
// // 						}
// // 						isDisabled={isLoading}
// // 						minW='120px'
// // 					>
// // 						Cancel
// // 					</Button>
// // 					<Button
// // 						size='lg'
// // 						colorScheme='brand'
// // 						onClick={handleSubmit}
// // 						isLoading={isLoading}
// // 						loadingText='Updating...'
// // 						leftIcon={<FiUser />}
// // 						minW='140px'
// // 						fontWeight='semibold'
// // 					>
// // 						Update Profile
// // 					</Button>
// // 				</Flex>
// // 			</Box>

// // 			{/* Modals */}
// // 			{replaceIsOpen && (
// // 				<ReplaceManager
// // 					isOpen={replaceIsOpen}
// // 					onClose={replaceOnClose}
// // 					managers={filteredManagers}
// // 					replacementManager={replacementManager}
// // 					handleProceed={() => {
// // 						replaceOnClose();
// // 						EditData();
// // 					}}
// // 					setReplacementManager={setReplacementManager}
// // 				/>
// // 			)}

// // 			{passwordIsOpen && (
// // 				<PasswordPermission
// // 					isOpen={passwordIsOpen}
// // 					onClose={passwordOnClose}
// // 					securityPassword={securityPassword}
// // 					setSecurityPassword={setSecurityPassword}
// // 					handleProceed={() => {
// // 						passwordOnClose();
// // 						EditData();
// // 					}}
// // 				/>
// // 			)}
// // 		</Box>
// // 	);
// // };

// // export default EditUser;
