/* eslint-disable react-hooks/exhaustive-deps */
import { CloseIcon, PhoneIcon } from '@chakra-ui/icons';
import {
	Button,
	FormLabel,
	Box,
	Icon,
	Grid,
	GridItem,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Text,
	useDisclosure,
	useColorModeValue,
	Flex,
} from '@chakra-ui/react';
import {
	FaUserEdit,
	FaUser,
	FaPhone,
	FaEnvelope,
	FaMoneyBill,
	FaDollarSign,
	FaUserShield,
	FaUsers,
	FaBuilding,
	FaGlobe,
	FaLock,
	FaBullseye,
	FaExclamationCircle,
} from 'react-icons/fa';
// import { FaTarget } from 'react-icons/fa';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { userSchema } from 'schema';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../redux/localSlice';
import { useFetchItemsQuery } from 'api/apiSlice';
import { jobTypes } from 'utils/options';
import ImageUpload from './components/ImageUpload';
import { useUpdateItemMutation } from 'api/apiSlice';
import { getApi } from 'services/api';
import ReplaceManager from './components/ReplaceManager';
import { buttonStyle } from 'utils/btn';
import PasswordPermission from './components/PasswordPermission';
import { fetchActiveTree, fetchTree } from './userApis';
import { currencyOptions } from 'utils/options';
import useUserSession from 'hooks/useUserSession';

const Edit = (props) => {
	const { onClose, isOpen, fetchData, data, userData, setEdit } = props;

	const [roles, setRoles] = useState([]);

	const bgColor = useColorModeValue('white', 'gray.800');
	const headerBg = useColorModeValue('brand.300', 'brand.100');
	const headerText = useColorModeValue('brand.700', 'brand.900');
	const footerBg = useColorModeValue('gray.50', 'gray.700');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	const {
		isOpen: replaceIsOpen,
		onOpen: replaceOnOpen,
		onClose: replaceOnClose,
	} = useDisclosure();

	const {
		isOpen: passwordIsOpen,
		onOpen: passwordOnOpen,
		onClose: passwordOnClose,
	} = useDisclosure();

	const [replacementManager, setReplacementManager] = useState('');
	const [securityPassword, setSecurityPassword] = useState('');

	const controller = new AbortController();

	const [uploadImage, setUploadImage] = useState(false);

	const { data: agencies } = useFetchItemsQuery({
		path: '/agencies',
	});

	const initialValues = {
		firstName: data?.firstName ?? '',
		lastName: data?.lastName ?? '',
		username: data?.username ?? '',
		agency: data?.agency?._id ?? '',
		salary: data?.salary ?? '',
		salaryType: data?.salaryType ?? '',
		phoneNumber: data?.phoneNumber ?? '',
		profileImage: data?.profileImage ?? '',
		parent: data?.parent ?? '',
		target: data?.target ?? '',
		roles: data?.roles ?? [],
		role: data?.roles[0]?._id ?? '',
		currency: data?.currency ?? 'AED',
	};

	const { user, isSuperAdmin } = useUserSession();

	const tree = useSelector((state) => state.user.activeTree);

	const filteredManagers = tree?.managers?.filter(
		(item) => item._id !== data?._id
	);

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: userSchema,
		enableReinitialize: true,
		onSubmit: (values, { resetForm }) => {
			EditData();
		},
	});

	useEffect(() => {
		if (props.edit) {
			// Replace initial Data with your actual initial values
			formik.setValues(initialValues);
		}
	}, [props.edit]);

	const dispatch = useDispatch();

	const handleCloseModal = () => {
		setEdit(false);
		formik.resetForm();
	};

	const {
		errors,
		touched,
		values,
		handleBlur,
		handleChange,
		handleSubmit,
		setFieldValue,
	} = formik;

	const [updateItemMutation, { isLoading }] = useUpdateItemMutation();

	const EditData = async () => {
		try {
			const role = roles.find((role) => role?._id === values.role);

			const valuesObj = { ...values };

			if (
				data?.roles[0]?.roleName === 'Manager' &&
				data?.roles[0]?.roleName !== role?.roleName &&
				!replacementManager &&
				role?.roleName !== 'Agent'
			) {
				replaceOnOpen();
				return;
			} else if (replacementManager) {
				valuesObj['replacementManager'] = replacementManager;
			}

			if (role?.roleName === 'Agent') {
				if (!values.parent) {
					toast.error('Please select a manager.');
					return;
				}
				valuesObj['parent'] = values.parent;
				valuesObj['replacementManager'] = values.parent;

				setReplacementManager(values.parent);
			} else if (role?.roleName === 'Manager') {
				delete valuesObj['parent'];
			} else {
				delete valuesObj['parent'];
			}

			if (
				!securityPassword &&
				(data?.roles[0]?.roleName !== role?.roleName || values?.password)
			) {
				passwordOnOpen();
				return;
			}

			if (securityPassword)
				valuesObj['securityPassword'] = securityPassword?.trim();

			const bodyData = Object.entries(valuesObj).reduce((acc, [key, value]) => {
				if (value !== undefined && value !== null) {
					acc[key] =
						key === 'roles' && Array.isArray(value)
							? value.map((role) => role.roleName).filter(Boolean)
							: value;
				}
				return acc;
			}, {});

			let response = await updateItemMutation({
				path: `/user/v2/edit/${props.selectedId}`,
				body: bodyData,
			}).unwrap();

			if (response?.status) {
				setEdit(false);
				let updatedUserData = userData;
				if (user?._id === props.selectedId) {
					if (updatedUserData && typeof updatedUserData === 'object') {
						// Create a new object with the updated firstName
						updatedUserData = {
							...updatedUserData,
							firstName: values?.firstName,
							lastName: values?.lastName,
						};
					}

					// const updatedDataString = JSON.stringify(updatedUserData);

					dispatch(setUser(updatedUserData));
				}

				console.log({ bodyData, values });

				if (user?._id === props.selectedId && bodyData?.password) {
					console.warn('reeload the pagee');
					window.location.reload();
					localStorage.removeItem('token');
					localStorage.removeItem('user');
					localStorage.removeItem('accessToken');
				}

				if (props?.refrence === 'table') {
					props.updateUsers(response?.user);
				} else fetchData();

				// formik.resetForm();
				props.setAction((pre) => !pre);

				// get updated users data
				// fetchActiveTree(dispatch);
				// fetchTree(dispatch);

				if (!controller.signal.aborted) {
					toast.success('User update successfully');
					setReplacementManager('');
					setSecurityPassword('');
					handleCloseModal();
				}
			}
		} catch (e) {
			console.log(e);
			if (!controller.signal.aborted) {
				toast.error(e?.data?.error || 'User is not updated!');
				setReplacementManager('');
				setSecurityPassword('');
			}
		}
	};

	const fetchRoles = async () => {
		let result = await getApi('api/role-access');
		setRoles(result.data);
	};

	useEffect(() => {
		fetchRoles();

		return () => {
			controller.abort();
		};
	}, []);

	return (
		<>
			<Modal
				size='4xl'
				isOpen={isOpen}
				isCentered
				scrollBehavior='inside'
				motionPreset='scale'
			>
				<ModalOverlay backdropFilter='blur(4px)' bg='blackAlpha.600' />
				<ModalContent
					bg={bgColor}
					borderRadius='2xl'
					shadow='2xl'
					overflow='hidden'
					mx={{ base: 3, md: 0 }}
					maxH='90vh'
				>
					<ModalHeader p={0} borderBottom='1px solid' borderColor={borderColor}>
						<Flex
							bg={headerBg}
							color={headerText}
							px={6}
							py={4}
							position='sticky'
							top='0'
							zIndex='10'
							boxShadow='sm'
							align='center'
							justify='space-between'
						>
							<Flex align='center' gap={3}>
								<Icon as={FaUserEdit} boxSize={5} color='whiteAlpha.900' />
								<Box>
									<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight='bold'>
										Edit User Profile
									</Text>
									<Text fontSize='xs' opacity={0.9} fontWeight='normal'>
										Update user information and permissions
									</Text>
								</Box>
							</Flex>
							<IconButton
								color={headerText}
								bg='whiteAlpha.200'
								size='sm'
								borderRadius='full'
								_hover={{ bg: 'whiteAlpha.300', transform: 'scale(1.05)' }}
								onClick={handleCloseModal}
								isDisabled={uploadImage}
								icon={<CloseIcon />}
								aria-label='Close modal'
							/>
						</Flex>
					</ModalHeader>

					<ModalBody p={6} overflowY='auto' maxH='calc(90vh - 140px)'>
						{/* Profile Image Upload */}
						<Box
							bg='white'
							borderRadius='xl'
							p={6}
							mb={6}
							border='1px solid'
							borderColor='gray.200'
							shadow='sm'
						>
							<Text fontSize='lg' fontWeight='semibold' color='gray.700' mb={4}>
								Profile Picture
							</Text>
							<ImageUpload
								profileImage={values?.profileImage}
								formik={formik}
								user={data}
								setUploadImage={setUploadImage}
							/>
						</Box>

						<Grid templateColumns='repeat(12, 1fr)' gap={4} p={2}>
							{/* Personal Information Section */}
							<GridItem colSpan={12}>
								<Text
									fontSize='lg'
									fontWeight='semibold'
									color='gray.700'
									mb={4}
								>
									Personal Information
								</Text>
							</GridItem>

							<GridItem colSpan={{ base: 12, md: 6 }}>
								<Box
									bg='white'
									p={4}
									borderRadius='lg'
									border='1px solid'
									borderColor='gray.100'
									shadow='xs'
								>
									<FormLabel
										display='flex'
										alignItems='center'
										gap={2}
										fontSize='sm'
										fontWeight='600'
										mb={3}
										color='gray.700'
									>
										<Icon as={FaUser} boxSize={3} color='gray.500' />
										First Name
									</FormLabel>
									<Input
										fontSize='sm'
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.firstName}
										name='firstName'
										placeholder='Enter first name'
										fontWeight='500'
										size='lg'
										borderColor={
											errors.firstName && touched.firstName
												? 'red.300'
												: 'gray.200'
										}
										_focus={{
											borderColor: 'blue.500',
											boxShadow: '0 0 0 1px blue.500',
										}}
									/>
									{errors.firstName && touched.firstName && (
										<Flex align='center' gap={1} mt={2}>
											<Icon
												as={FaExclamationCircle}
												color='red.500'
												boxSize={3}
											/>
											<Text fontSize='xs' color='red.500' fontWeight='500'>
												{errors.firstName}
											</Text>
										</Flex>
									)}
								</Box>
							</GridItem>

							<GridItem colSpan={{ base: 12, md: 6 }}>
								<Box
									bg='white'
									p={4}
									borderRadius='lg'
									border='1px solid'
									borderColor='gray.100'
									shadow='xs'
								>
									<FormLabel
										display='flex'
										alignItems='center'
										gap={2}
										fontSize='sm'
										fontWeight='600'
										mb={3}
										color='gray.700'
									>
										<Icon as={FaUser} boxSize={3} color='gray.500' />
										Last Name
									</FormLabel>
									<Input
										fontSize='sm'
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.lastName}
										name='lastName'
										placeholder='Enter last name'
										fontWeight='500'
										size='lg'
										borderColor={
											errors.lastName && touched.lastName
												? 'red.300'
												: 'gray.200'
										}
										_focus={{
											borderColor: 'blue.500',
											boxShadow: '0 0 0 1px blue.500',
										}}
									/>
									{errors.lastName && touched.lastName && (
										<Flex align='center' gap={1} mt={2}>
											<Icon
												as={FaExclamationCircle}
												color='red.500'
												boxSize={3}
											/>
											<Text fontSize='xs' color='red.500' fontWeight='500'>
												{errors.lastName}
											</Text>
										</Flex>
									)}
								</Box>
							</GridItem>

							<GridItem colSpan={{ base: 12, md: 6 }}>
								<Box
									bg='white'
									p={4}
									borderRadius='lg'
									border='1px solid'
									borderColor='gray.100'
									shadow='xs'
								>
									<FormLabel
										display='flex'
										alignItems='center'
										gap={2}
										fontSize='sm'
										fontWeight='600'
										mb={3}
										color='gray.700'
									>
										<Icon as={FaPhone} boxSize={3} color='gray.500' />
										Phone Number
										<Text color='red.500'>*</Text>
									</FormLabel>
									<InputGroup>
										<InputLeftElement pointerEvents='none'>
											<PhoneIcon color='gray.400' />
										</InputLeftElement>
										<Input
											type='tel'
											fontSize='sm'
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.phoneNumber}
											name='phoneNumber'
											fontWeight='500'
											size='lg'
											placeholder='Enter phone number'
											borderColor={
												errors.phoneNumber && touched.phoneNumber
													? 'red.300'
													: 'gray.200'
											}
											_focus={{
												borderColor: 'blue.500',
												boxShadow: '0 0 0 1px blue.500',
											}}
										/>
									</InputGroup>
									{errors.phoneNumber && touched.phoneNumber && (
										<Flex align='center' gap={1} mt={2}>
											<Icon
												as={FaExclamationCircle}
												color='red.500'
												boxSize={3}
											/>
											<Text fontSize='xs' color='red.500' fontWeight='500'>
												{errors.phoneNumber}
											</Text>
										</Flex>
									)}
								</Box>
							</GridItem>

							{isSuperAdmin && (
								<>
									{/* Professional Information Section */}
									<GridItem colSpan={12} mt={4}>
										<Text
											fontSize='lg'
											fontWeight='semibold'
											color='gray.700'
											mb={4}
										>
											Professional Information
										</Text>
									</GridItem>

									<GridItem colSpan={{ base: 12, md: 6 }}>
										<Box
											bg='white'
											p={4}
											borderRadius='lg'
											border='1px solid'
											borderColor='gray.100'
											shadow='xs'
										>
											<FormLabel
												display='flex'
												alignItems='center'
												gap={2}
												fontSize='sm'
												fontWeight='600'
												mb={3}
												color='gray.700'
											>
												<Icon as={FaEnvelope} boxSize={3} color='gray.500' />
												Email Address
											</FormLabel>
											<Input
												fontSize='sm'
												type='email'
												onChange={handleChange}
												onBlur={handleBlur}
												value={values.username}
												name='username'
												placeholder='Enter email address'
												fontWeight='500'
												size='lg'
												borderColor={
													errors.username && touched.username
														? 'red.300'
														: 'gray.200'
												}
												_focus={{
													borderColor: 'blue.500',
													boxShadow: '0 0 0 1px blue.500',
												}}
											/>
											{errors.username && touched.username && (
												<Flex align='center' gap={1} mt={2}>
													<Icon
														as={FaExclamationCircle}
														color='red.500'
														boxSize={3}
													/>
													<Text fontSize='xs' color='red.500' fontWeight='500'>
														{errors.username}
													</Text>
												</Flex>
											)}
										</Box>
									</GridItem>

									<GridItem colSpan={{ base: 12, md: 6 }}>
										<Box
											bg='white'
											p={4}
											borderRadius='lg'
											border='1px solid'
											borderColor='gray.100'
											shadow='xs'
										>
											<FormLabel
												display='flex'
												alignItems='center'
												gap={2}
												fontSize='sm'
												fontWeight='600'
												mb={3}
												color='gray.700'
											>
												<Icon as={FaMoneyBill} boxSize={3} color='gray.500' />
												Salary Type
											</FormLabel>
											<Select
												name='salaryType'
												value={values.salaryType}
												onChange={handleChange}
												onBlur={handleBlur}
												placeholder='Select salary type'
												size='lg'
												borderColor={
													errors.salaryType && touched.salaryType
														? 'red.300'
														: 'gray.200'
												}
												_focus={{
													borderColor: 'blue.500',
													boxShadow: '0 0 0 1px blue.500',
												}}
											>
												{jobTypes?.map((job) => (
													<option key={job.value} value={job.value}>
														{job.label}
													</option>
												))}
											</Select>
											{errors.salaryType && touched.salaryType && (
												<Flex align='center' gap={1} mt={2}>
													<Icon
														as={FaExclamationCircle}
														color='red.500'
														boxSize={3}
													/>
													<Text fontSize='xs' color='red.500' fontWeight='500'>
														{errors.salaryType}
													</Text>
												</Flex>
											)}
										</Box>
									</GridItem>

									<GridItem colSpan={{ base: 12, md: 6 }}>
										<Box
											bg='white'
											p={4}
											borderRadius='lg'
											border='1px solid'
											borderColor='gray.100'
											shadow='xs'
										>
											<FormLabel
												display='flex'
												alignItems='center'
												gap={2}
												fontSize='sm'
												fontWeight='600'
												mb={3}
												color='gray.700'
											>
												<Icon as={FaDollarSign} boxSize={3} color='gray.500' />
												Salary Amount
											</FormLabel>
											<Input
												fontSize='sm'
												type='number'
												min={0}
												onChange={handleChange}
												onBlur={handleBlur}
												value={values.salary}
												name='salary'
												placeholder='Enter salary amount'
												fontWeight='500'
												size='lg'
												borderColor={
													errors.salary && touched.salary
														? 'red.300'
														: 'gray.200'
												}
												_focus={{
													borderColor: 'blue.500',
													boxShadow: '0 0 0 1px blue.500',
												}}
											/>
											{errors.salary && touched.salary && (
												<Flex align='center' gap={1} mt={2}>
													<Icon
														as={FaExclamationCircle}
														color='red.500'
														boxSize={3}
													/>
													<Text fontSize='xs' color='red.500' fontWeight='500'>
														{errors.salary}
													</Text>
												</Flex>
											)}
										</Box>
									</GridItem>

									{/* Role and Permissions Section */}
									<GridItem colSpan={12} mt={4}>
										<Text
											fontSize='lg'
											fontWeight='semibold'
											color='gray.700'
											mb={4}
										>
											Role & Permissions
										</Text>
									</GridItem>

									{user?.roles[0]?.roleName !== 'Manager' && (
										<GridItem colSpan={{ base: 12, md: 6 }}>
											<Box
												bg='white'
												p={4}
												borderRadius='lg'
												border='1px solid'
												borderColor='gray.100'
												shadow='xs'
											>
												<FormLabel
													display='flex'
													alignItems='center'
													gap={2}
													fontSize='sm'
													fontWeight='600'
													mb={3}
													color='gray.700'
												>
													<Icon
														as={FaUserShield}
														boxSize={3}
														color='gray.500'
													/>
													User Role
													<Text color='red.500'>*</Text>
												</FormLabel>
												<Select
													name='role'
													value={values.role}
													onChange={handleChange}
													onBlur={handleBlur}
													placeholder='Select user role'
													size='lg'
													borderColor={
														errors.role && touched.role ? 'red.300' : 'gray.200'
													}
													_focus={{
														borderColor: 'blue.500',
														boxShadow: '0 0 0 1px blue.500',
													}}
												>
													{roles
														?.filter((role) => role.roleName !== 'sadmin')
														?.map((role) => (
															<option key={role?._id} value={role?._id}>
																{role?.roleName}
															</option>
														))}
												</Select>
												{errors.role && touched.role && (
													<Flex align='center' gap={1} mt={2}>
														<Icon
															as={FaExclamationCircle}
															color='red.500'
															boxSize={3}
														/>
														<Text
															fontSize='xs'
															color='red.500'
															fontWeight='500'
														>
															{errors.role}
														</Text>
													</Flex>
												)}
											</Box>
										</GridItem>
									)}

									{roles.find((role) => role?._id === values.role)?.roleName ===
										'Agent' && (
										<GridItem colSpan={{ base: 12, md: 6 }}>
											<Box
												bg='white'
												p={4}
												borderRadius='lg'
												border='1px solid'
												borderColor='gray.100'
												shadow='xs'
											>
												<FormLabel
													display='flex'
													alignItems='center'
													gap={2}
													fontSize='sm'
													fontWeight='600'
													mb={3}
													color='gray.700'
												>
													<Icon as={FaUsers} boxSize={3} color='gray.500' />
													Assign Manager
													<Text color='red.500'>*</Text>
												</FormLabel>
												<Select
													name='parent'
													value={values.parent}
													onChange={handleChange}
													onBlur={handleBlur}
													placeholder='Select manager'
													size='lg'
												>
													{filteredManagers?.map((manager) => (
														<option key={manager?._id} value={manager?._id}>
															{manager?.firstName + ' ' + manager?.lastName}
														</option>
													))}
												</Select>
											</Box>
										</GridItem>
									)}

									<GridItem colSpan={{ base: 12, md: 6 }}>
										<Box
											bg='white'
											p={4}
											borderRadius='lg'
											border='1px solid'
											borderColor='gray.100'
											shadow='xs'
										>
											<FormLabel
												display='flex'
												alignItems='center'
												gap={2}
												fontSize='sm'
												fontWeight='600'
												mb={3}
												color='gray.700'
											>
												<Icon as={FaBuilding} boxSize={3} color='gray.500' />
												Agency
												<Text color='red.500'>*</Text>
											</FormLabel>
											<Select
												name='agency'
												value={values.agency}
												onChange={handleChange}
												onBlur={handleBlur}
												placeholder='Select agency'
												size='lg'
												borderColor={
													errors.agency && touched.agency
														? 'red.300'
														: 'gray.200'
												}
												_focus={{
													borderColor: 'blue.500',
													boxShadow: '0 0 0 1px blue.500',
												}}
											>
												{agencies?.doc?.map((agency) => (
													<option key={agency._id} value={agency._id}>
														{agency.name}
													</option>
												))}
											</Select>
											{errors.agency && touched.agency && (
												<Flex align='center' gap={1} mt={2}>
													<Icon
														as={FaExclamationCircle}
														color='red.500'
														boxSize={3}
													/>
													<Text fontSize='xs' color='red.500' fontWeight='500'>
														{errors.agency}
													</Text>
												</Flex>
											)}
										</Box>
									</GridItem>

									{/* Additional Settings */}
									{(isSuperAdmin ||
										(user?.roles[0]?.roleName === 'Manager' &&
											user._id !== data._id)) && (
										<>
											<GridItem colSpan={12} mt={4}>
												<Text
													fontSize='lg'
													fontWeight='semibold'
													color='gray.700'
													mb={4}
												>
													Additional Settings
												</Text>
											</GridItem>

											<GridItem colSpan={{ base: 12, md: 6 }}>
												<Box
													bg='white'
													p={4}
													borderRadius='lg'
													border='1px solid'
													borderColor='gray.100'
													shadow='xs'
												>
													<FormLabel
														display='flex'
														alignItems='center'
														gap={2}
														fontSize='sm'
														fontWeight='600'
														mb={3}
														color='gray.700'
													>
														<Icon as={FaGlobe} boxSize={3} color='gray.500' />
														Currency
													</FormLabel>
													<Select
														name='currency'
														value={values.currency}
														onChange={handleChange}
														onBlur={handleBlur}
														isDisabled
														placeholder='Select currency'
														size='lg'
														borderColor={
															errors.currency && touched.currency
																? 'red.300'
																: 'gray.200'
														}
													>
														{currencyOptions?.map((item) => (
															<option key={item.value} value={item.value}>
																{item.label}
															</option>
														))}
													</Select>
												</Box>
											</GridItem>

											<GridItem colSpan={{ base: 12, md: 6 }}>
												<Box
													bg='white'
													p={4}
													borderRadius='lg'
													border='1px solid'
													borderColor='gray.100'
													shadow='xs'
												>
													<FormLabel
														display='flex'
														alignItems='center'
														gap={2}
														fontSize='sm'
														fontWeight='600'
														mb={3}
														color='gray.700'
													>
														<Icon
															as={FaBullseye}
															boxSize={3}
															color='gray.500'
														/>
														Monthly Target
													</FormLabel>
													<InputGroup>
														<Input
															type='number'
															fontSize='sm'
															onChange={handleChange}
															onBlur={handleBlur}
															value={values.target}
															name='target'
															placeholder='Enter target amount'
															fontWeight='500'
															size='lg'
														/>
													</InputGroup>
												</Box>
											</GridItem>
										</>
									)}

									{/* Security Section */}
									<GridItem colSpan={12} mt={4}>
										<Text
											fontSize='lg'
											fontWeight='semibold'
											color='gray.700'
											mb={4}
										>
											Security
										</Text>
									</GridItem>

									<GridItem colSpan={{ base: 12, md: 6 }}>
										<Box
											bg='white'
											p={4}
											borderRadius='lg'
											border='1px solid'
											borderColor='gray.100'
											shadow='xs'
										>
											<FormLabel
												display='flex'
												alignItems='center'
												gap={2}
												fontSize='sm'
												fontWeight='600'
												mb={3}
												color='gray.700'
											>
												<Icon as={FaLock} boxSize={3} color='gray.500' />
												New Password
											</FormLabel>
											<InputGroup>
												<Input
													type='text'
													fontSize='sm'
													onChange={handleChange}
													onBlur={handleBlur}
													value={values.password}
													name='password'
													placeholder='Enter new password'
													fontWeight='500'
													size='lg'
													_focus={{
														borderColor: 'blue.500',
														boxShadow: '0 0 0 1px blue.500',
													}}
												/>
											</InputGroup>
											<Text fontSize='xs' color='gray.500' mt={2}>
												Leave blank to keep current password
											</Text>
										</Box>
									</GridItem>
								</>
							)}
						</Grid>
					</ModalBody>

					<ModalFooter
						position='sticky'
						bottom='0'
						bg={footerBg}
						borderTop='1px solid'
						borderColor={borderColor}
						py={4}
						px={6}
						zIndex='10'
						justifyContent='flex-end'
						gap={3}
						boxShadow='0 -2px 10px rgba(0,0,0,0.05)'
					>
						<Button
							variant='outline'
							colorScheme='gray'
							size='lg'
							borderRadius='lg'
							isDisabled={uploadImage}
							onClick={handleCloseModal}
							minW='100px'
							_hover={{ transform: 'translateY(-1px)' }}
							transition='all 0.2s'
						>
							Cancel
						</Button>
						<Button
							{...buttonStyle}
							variant='solid'
							bg='blue.500'
							color='white'
							fontSize='md'
							size='lg'
							borderRadius='lg'
							aria-label='Update user'
							disabled={isLoading ? true : false}
							onClick={handleSubmit}
							minW='120px'
							_hover={{
								bg: 'blue.600',
								transform: 'translateY(-1px)',
								boxShadow: 'lg',
							}}
							transition='all 0.2s'
						>
							{isLoading ? <Spinner size='sm' /> : 'Update User'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{replaceIsOpen && (
				<ReplaceManager
					isOpen={replaceIsOpen}
					onClose={replaceOnClose}
					managers={filteredManagers}
					replacementManager={replacementManager}
					handleProceed={() => {
						replaceOnClose();
						EditData();
					}}
					setReplacementManager={setReplacementManager}
				/>
			)}

			{passwordIsOpen && (
				<PasswordPermission
					isOpen={passwordIsOpen}
					onClose={passwordOnClose}
					securityPassword={securityPassword}
					setSecurityPassword={setSecurityPassword}
					handleProceed={() => {
						passwordOnClose();
						EditData();
					}}
				/>
			)}
		</>
	);
};

export default Edit;
