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
} from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { userSchema } from 'schema';
import { putApi } from 'services/api';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../redux/localSlice';
import { useFetchItemsQuery } from 'api/apiSlice';
import { jobTypes } from 'utils/options';
import ImageUpload from './components/ImageUpload';
import { useUpdateItemMutation } from 'api/apiSlice';

const Edit = (props) => {
	const { onClose, isOpen, fetchData, data, userData, setEdit } = props;

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
	};

	const user = JSON.parse(window.localStorage.getItem('user'));
	const isAdmin = user?.role === 'superAdmin';

	const tree = useSelector((state) => state.user);

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: userSchema,
		enableReinitialize: true,
		onSubmit: (values, { resetForm }) => {
			console.log(values);
			EditData();
			resetForm();
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

	const [isLoding, setIsLoding] = useState(false);

	const [updateItemMutation, { isLoading }] = useUpdateItemMutation();

	const EditData = async () => {
		try {
			setIsLoding(true);

			const valuesObj = { ...values };
			if (data?.roles[0]?.roleName === 'Manager') {
				delete valuesObj['parent'];
			}

			const formData = new FormData();

			Object.keys(valuesObj).forEach((key) => {
				const value = valuesObj[key];

				if (value === undefined || value === null || value === '') return;

				if (key === 'profileImage' && value instanceof File) {
					formData.append(key, value);
				} else if (key === 'roles' && Array.isArray(value)) {
					value.forEach((role, index) => {
						if (role.roleName) {
							formData.append(`roles[${index}]`, role.roleName);
						}
					});
				} else {
					formData.append(key, value);
				}
			});

			// let response = await putApi(
			// 	`api/user/edit/${props.selectedId}`,
			// 	valuesObj
			// );

			console.log({ formData });

			let response = await updateItemMutation({
				path: `/user/v2/edit/${props.selectedId}`,
				body: formData,
				formData: true,
			});

			if (response && response.data.modifiedCount) {
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
				fetchData();
				props.setAction((pre) => !pre);
			}
		} catch (e) {
			console.log(e);
			toast.error(e.data?.message);
		} finally {
			setIsLoding(false);
		}
	};

	return (
		<Modal size='4xl' isOpen={isOpen} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader justifyContent='space-between' display='flex'>
					Edit User
					<IconButton onClick={handleCloseModal} icon={<CloseIcon />} />
				</ModalHeader>
				<ModalBody>
					<Grid
						h={isAdmin ? '60vh' : '45vh'}
						overflow={'scroll'}
						templateColumns='repeat(12, 1fr)'
						gap={3}
						p={4}
					>
						<GridItem colSpan={12}>
							<ImageUpload
								profileImage={values?.profileImage}
								formik={formik}
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
									children={<PhoneIcon color='gray.300' borderRadius='16px' />}
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
										errors.phoneNumber && touched.phoneNumber ? 'red.300' : null
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
											errors.salaryType && touched.salaryType ? 'red.300' : null
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
										Select Manager
									</FormLabel>
									<Select
										name='parent'
										value={values.parent}
										onChange={handleChange}
										onBlur={handleBlur}
										placeholder='Select Manager'
									>
										{tree?.tree?.managers?.map((manager) => (
											<option key={manager?._id} value={manager?._id}>
												{manager?.firstName + ' ' + manager?.lastName}
											</option>
										))}
									</Select>
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
						size='sm'
						variant='brand'
						disabled={isLoding ? true : false}
						onClick={handleSubmit}
					>
						{isLoding ? <Spinner /> : 'Update'}
					</Button>
					<Button
						variant='outline'
						colorScheme='red'
						size='sm'
						sx={{
							marginLeft: 2,
							textTransform: 'capitalize',
						}}
						onClick={() => handleCloseModal()}
					>
						close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default Edit;
