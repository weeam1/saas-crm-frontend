/* eslint-disable react-hooks/exhaustive-deps */
import { CloseIcon, PhoneIcon } from '@chakra-ui/icons';
import {
	Button,
	FormLabel,
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
} from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { userSchema } from 'schema';
import { useDispatch } from 'react-redux';
import { setActiveTree, setUser } from '../../../redux/localSlice';
import { useFetchItemsQuery } from 'api/apiSlice';
import { jobTypes } from 'utils/options';
import ImageUpload from './components/ImageUpload';
import { useUpdateItemMutation } from 'api/apiSlice';
import { getApi } from 'services/api';
import ReplaceManager from './components/ReplaceManager';
import { buttonStyle } from 'utils/btn';

const Edit = (props) => {
	const { onClose, isOpen, fetchData, data, userData, setEdit } = props;

	const [roles, setRoles] = useState([]);

	const {
		isOpen: replaceIsOpen,
		onOpen: replaceOnOpen,
		onClose: replaceOnClose,
	} = useDisclosure();

	const [replacementManager, setReplacementManager] = useState('');

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
		replacementManager: '',
	};

	console.log('initialValues', initialValues);

	const user = JSON.parse(window.localStorage.getItem('user'));
	const isAdmin = user?.role === 'superAdmin';

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

	const fetchActiveTree = async () => {
		const response = await getApi('api/v2/user/active_tree');
		const data = response.data || null;

		dispatch(setActiveTree(data));
	};

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

			console.log(role, values?.parent);

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
			});

			if (response) {
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

					const updatedDataString = JSON.stringify(updatedUserData);

					dispatch(setUser(updatedDataString));
				}

				if (user?._id === props.selectedId && values.password) {
					window.location.reload();
					localStorage.removeItem('token');
					localStorage.removeItem('user');
					localStorage.removeItem('accessToken');
				}

				handleCloseModal();

				if (props?.refrence === 'table') {
					props.updateUsers(response?.data?.user);
				} else fetchData();
				formik.resetForm();
				props.setAction((pre) => !pre);
			}
		} catch (e) {
			console.log(e);
			toast.error(e.data?.message);
		}
	};

	const fetchRoles = async () => {
		let result = await getApi('api/role-access');
		setRoles(result.data);
	};

	useEffect(() => {
		fetchRoles();
		fetchActiveTree();
	}, []);

	return (
		<>
			<Modal size='4xl' isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader justifyContent='space-between' display='flex'>
						Edit User
						<IconButton
							onClick={handleCloseModal}
							isDisabled={uploadImage}
							icon={<CloseIcon />}
						/>
					</ModalHeader>
					<ModalBody>
						<Grid
							h={isAdmin ? '60vh' : '50vh'}
							overflow={'scroll'}
							templateColumns='repeat(12, 1fr)'
							gap={3}
							p={4}
						>
							<GridItem colSpan={12}>
								<ImageUpload
									profileImage={values?.profileImage}
									formik={formik}
									user={data}
									setUploadImage={setUploadImage}
								/>
							</GridItem>
							<GridItem colSpan={{ base: 6 }}>
								<FormLabel
									display='flex'
									ms='4px'
									fontSize='sm'
									fontWeight='500'
									mb='8px'
								>
									First Name
								</FormLabel>
								<Input
									fontSize='sm'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.firstName}
									name='firstName'
									placeholder='firstName'
									fontWeight='500'
									borderColor={
										errors.firstName && touched.firstName ? 'red.300' : null
									}
								/>
								<Text mb='10px' color={'red'}>
									{errors.firstName && touched.firstName && errors.firstName}
								</Text>
							</GridItem>
							<GridItem colSpan={{ base: 6 }}>
								<FormLabel
									display='flex'
									ms='4px'
									fontSize='sm'
									fontWeight='500'
									mb='8px'
								>
									Last Name
								</FormLabel>
								<Input
									fontSize='sm'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.lastName}
									name='lastName'
									placeholder='Last Name'
									fontWeight='500'
									borderColor={
										errors.lastName && touched.lastName ? 'red.300' : null
									}
								/>
								<Text mb='10px' color={'red'}>
									{errors.lastName && touched.lastName && errors.lastName}
								</Text>
							</GridItem>
							<GridItem colSpan={{ base: 6 }}>
								<FormLabel
									display='flex'
									ms='4px'
									fontSize='sm'
									fontWeight='500'
									mb='8px'
								>
									Phone Number<Text color={'red'}>*</Text>
								</FormLabel>
								<InputGroup>
									<InputLeftElement
										pointerEvents='none'
										children={
											<PhoneIcon color='gray.300' borderRadius='16px' />
										}
									/>
									<Input
										type='tel'
										fontSize='sm'
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.phoneNumber}
										name='phoneNumber'
										fontWeight='500'
										borderColor={
											errors.phoneNumber && touched.phoneNumber
												? 'red.300'
												: null
										}
										placeholder='Phone number'
										borderRadius='16px'
									/>
								</InputGroup>
								<Text mb='10px' color={'red'}>
									{errors.phoneNumber &&
										touched.phoneNumber &&
										errors.phoneNumber}
								</Text>
							</GridItem>
							{isAdmin && (
								<>
									<GridItem colSpan={{ base: 6 }}>
										<FormLabel
											display='flex'
											ms='4px'
											fontSize='sm'
											fontWeight='500'
											mb='8px'
										>
											Email
										</FormLabel>
										<Input
											fontSize='sm'
											type='email'
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.username}
											name='username'
											placeholder='Email Address'
											fontWeight='500'
											borderColor={
												errors.username && touched.username ? 'red.300' : null
											}
										/>
										<Text mb='10px' color={'red'}>
											{errors.username && touched.username && errors.username}
										</Text>
									</GridItem>
									<GridItem colSpan={{ base: 6 }}>
										<FormLabel
											display='flex'
											ms='4px'
											fontSize='sm'
											fontWeight='500'
											mb='8px'
										>
											Salary Type
										</FormLabel>
										<Select
											name='salaryType'
											value={values.salaryType}
											onChange={handleChange}
											onBlur={handleBlur}
											placeholder='Select salary type'
											borderColor={
												errors.salaryType && touched.salaryType
													? 'red.300'
													: null
											}
										>
											{jobTypes?.map((job) => (
												<option key={job.value} value={job.value}>
													{job.label}
												</option>
											))}
										</Select>

										<Text mb='10px' color={'red'}>
											{errors.salaryType &&
												touched.salaryType &&
												errors.salaryType}
										</Text>
									</GridItem>
									<GridItem colSpan={{ base: 6 }}>
										<FormLabel
											display='flex'
											ms='4px'
											fontSize='sm'
											fontWeight='500'
											mb='8px'
										>
											Salary
										</FormLabel>
										<Input
											fontSize='sm'
											type='number'
											min={0}
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.salary}
											name='salary'
											fontWeight='500'
											borderColor={
												errors.salary && touched.salary ? 'red.300' : null
											}
										/>
										<Text mb='10px' color={'red'}>
											{errors.salary && touched.salary && errors.salary}
										</Text>
									</GridItem>

									{user?.roles[0]?.roleName !== 'Manager' && (
										<GridItem colSpan={{ base: 6 }}>
											<FormLabel
												display='flex'
												ms='4px'
												fontSize='sm'
												fontWeight='500'
												mb='8px'
											>
												Select Role <Text color={'red'}>*</Text>
											</FormLabel>
											<Select
												name='role'
												value={values.role}
												onChange={handleChange}
												onBlur={handleBlur}
												placeholder='Select Role'
												borderColor={
													errors.role && touched.role ? 'red.300' : null
												}
												className={
													errors.role && touched.role ? 'isInvalid' : null
												}
											>
												{roles
													?.filter((role) => role.roleName !== 'sadmin')
													?.map((role) => (
														<option key={role?._id} value={role?._id}>
															{role?.roleName}
														</option>
													))}
											</Select>
											<Text mb='10px' color='red'>
												{errors.role && touched.role && errors.role}
											</Text>
										</GridItem>
									)}
									{roles.find((role) => role?._id === values.role)?.roleName ===
										'Agent' && (
										<GridItem colSpan={{ base: 6 }}>
											<FormLabel
												display='flex'
												ms='4px'
												fontSize='sm'
												fontWeight='500'
												mb='8px'
											>
												Select Manager <Text color={'red'}>*</Text>
											</FormLabel>
											<Select
												name='parent'
												value={values.parent}
												onChange={handleChange}
												onBlur={handleBlur}
												placeholder='Select Manager'
											>
												{filteredManagers?.map((manager) => (
													<option value={manager?._id}>
														{manager?.firstName + ' ' + manager?.lastName}
													</option>
												))}
											</Select>
										</GridItem>
									)}

									<GridItem colSpan={{ base: 6 }}>
										<FormLabel
											display='flex'
											ms='4px'
											fontSize='sm'
											fontWeight='500'
											mb='8px'
										>
											Select agency <Text color={'red'}>*</Text>
										</FormLabel>
										<Select
											name='agency'
											value={values.agency}
											onChange={handleChange}
											onBlur={handleBlur}
											placeholder='Select agency'
											borderColor={
												errors.agency && touched.agency ? 'red.300' : null
											}
										>
											{agencies?.doc?.map((agency) => (
												<option key={agency._id} value={agency._id}>
													{agency.name}
												</option>
											))}
										</Select>

										<Text mb='10px' color={'red'}>
											{errors.agency && touched.agency && errors.agency}
										</Text>
									</GridItem>

									<GridItem colSpan={{ base: 6 }}>
										<FormLabel
											display='flex'
											ms='4px'
											fontSize='sm'
											fontWeight='500'
											mb='8px'
										>
											Revenue Target
										</FormLabel>
										<InputGroup>
											<Input
												type='number'
												fontSize='sm'
												onChange={handleChange}
												onBlur={handleBlur}
												value={values.target}
												name='target'
												fontWeight='500'
												placeholder='Revenue Target'
												borderRadius='16px'
											/>
										</InputGroup>
									</GridItem>
								</>
							)}

							{isAdmin && (
								<GridItem colSpan={{ base: 6 }}>
									<FormLabel
										display='flex'
										ms='4px'
										fontSize='sm'
										fontWeight='500'
										mb='8px'
									>
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
											fontWeight='500'
											placeholder='New Password'
											borderRadius='16px'
										/>
									</InputGroup>
								</GridItem>
							)}
						</Grid>
					</ModalBody>
					<ModalFooter>
						<Button
							{...buttonStyle}
							variant='solid'
							bg='gray.200'
							color='gray.800'
							_active={{ bg: 'gray.300' }}
							mr='3'
							fontSize='md'
							aria-label='close'
							isDisabled={uploadImage}
							onClick={() => handleCloseModal()}
						>
							Close
						</Button>
						<Button
							{...buttonStyle}
							variant='solid'
							bg='brand.400'
							fontSize='md'
							aria-label='update'
							disabled={isLoading ? true : false}
							onClick={handleSubmit}
						>
							{isLoading ? <Spinner /> : 'Update'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<ReplaceManager
				isOpen={replaceIsOpen}
				onClose={replaceOnClose}
				managers={filteredManagers}
				replacementManager={replacementManager}
				setReplacementManager={setReplacementManager}
			/>
		</>
	);
};

export default Edit;
