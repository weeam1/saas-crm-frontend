import { CloseIcon, PhoneIcon } from '@chakra-ui/icons';
import {
	Button,
	FormLabel,
	Grid,
	GridItem,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
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
import React, { useEffect, useState } from 'react';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getApi } from 'services/api';
import * as Yup from 'yup';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useCreateItemMutation } from 'api/apiSlice';
import ImageUpload from './components/ImageUpload';
import { buttonStyle } from 'utils/btn';

const userValidationSchema = Yup.object().shape({
	firstName: Yup.string().required('First name is required'),
	lastName: Yup.string(),
	username: Yup.string()
		.email('Invalid email format')
		.required('Email is required'),
	password: Yup.string()
		.min(6, 'Password must be at least 6 characters')
		.required('Password is required'),
	role: Yup.string().required('Role is required'),
	agency: Yup.string().required('Agency is required'),

	phoneNumber: Yup.string(),
	parent: Yup.string(),
	nationality: Yup.string(),
	dob: Yup.date(),
	educationDegree: Yup.string(),
	passportNum: Yup.string(),
	uaeIdNum: Yup.string(),
	dubaiHomeAddress: Yup.string(),
	drivingLicense: Yup.string(),
	countryHomeAddress: Yup.string(),
	countryPhoneNum: Yup.string(),
	profileImage: Yup.string(),
});

const AddUser = (props) => {
	const { onClose, isOpen, setAction } = props;
	const [roles, setRoles] = useState([]);
	const [uploadImage, setUploadImage] = useState(false);

	const tree = useSelector((state) => state.user);

	const { data: agencies } = useFetchItemsQuery({
		path: '/agencies',
	});

	const [show, setShow] = React.useState(false);
	const showPass = () => setShow(!show);

	const initialValues = {
		firstName: '',
		lastName: '',
		username: '',
		phoneNumber: '',
		profileImage: '',
		password: '',
		role: '',
		parent: '',
		nationality: '',
		agency: '',
		dob: '',
		educationDegree: '',
		passportNum: '',
		uaeIdNum: '',
		dubaiHomeAddress: '',
		drivingLicense: '',
		countryHomeAddress: '',
		countryPhoneNum: '',
	};

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: userValidationSchema,
		onSubmit: (values, { resetForm }) => {
			AddData();
		},
	});

	const {
		errors,
		touched,
		values,
		handleBlur,
		handleChange,
		handleSubmit,
		setFieldValue,
		resetForm,
	} = formik;

	const user = JSON.parse(localStorage.getItem('user'));

	const [createItemMutation, { isLoading }] = useCreateItemMutation();

	const AddData = async () => {
		try {
			const valuesObj = { ...values };

			// Assign 'parent' and 'role' based on user role
			if (user?.roles[0]?.roleName === 'Manager') {
				valuesObj['parent'] = user?._id?.toString();
				valuesObj['role'] = roles
					?.find((role) => role?.roleName === 'Agent')
					?._id?.toString();
			} else if (
				roles.find((role) => role?._id === values.role)?.roleName === 'Agent'
			) {
				if (!values.parent) {
					toast.error('Please select a manager.');
					return;
				}
				valuesObj['parent'] = values.parent;
			}

			// Remove 'parent' if not set
			if (!valuesObj['parent']) {
				delete valuesObj['parent'];
			}

			// Ensure 'roles' is an array
			if (valuesObj['role']) {
				valuesObj['roles'] = [valuesObj.role?.toString()];
			}

			const bodyData = {};

			Object.keys(valuesObj).forEach((key) => {
				if (key === 'profileImage' && valuesObj[key] instanceof File) {
					bodyData[key] = valuesObj[key];
				} else if (key === 'roles' && Array.isArray(valuesObj[key])) {
					bodyData[key] = valuesObj[key].map((role) => role);
				} else {
					bodyData[key] = valuesObj[key];
				}
			});

			let response = await createItemMutation({
				path: '/user/v2/register',
				body: bodyData,
			});

			if (response?.data?.status === 200) {
				props.onClose();
				props.fetchData();
				resetForm();
				setAction((pre) => !pre);
				toast.success('User created successfully.');
			} else {
				toast.error(response.error?.data?.message || 'User not added.');
			}
		} catch (e) {
			console.log(e);
			toast.error('Something went very wrong.');
		}
	};

	const fetchRoles = async () => {
		let result = await getApi('api/role-access');
		setRoles(result.data);
	};

	useEffect(() => {
		fetchRoles();
	}, []);

	return (
		<Modal size='4xl' isOpen={isOpen} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader justifyContent='space-between' display='flex'>
					Add User
					<IconButton
						onClick={onClose}
						isDisabled={uploadImage}
						icon={<CloseIcon />}
					/>
				</ModalHeader>
				<ModalBody>
					<Grid
						h={'60vh'}
						overflow={'scroll'}
						templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2,1fr)' }}
						gap={3}
						p={4}
					>
						<GridItem colSpan={{ base: 1, md: 2 }}>
							<ImageUpload
								profileImage={values?.profileImage}
								formik={formik}
								setUploadImage={setUploadImage}
							/>
						</GridItem>
						<GridItem>
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
								{' '}
								{errors.firstName && touched.firstName && errors.firstName}
							</Text>
						</GridItem>
						<GridItem>
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
								{' '}
								{errors.lastName && touched.lastName && errors.lastName}
							</Text>
						</GridItem>
						<GridItem>
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
								{' '}
								{errors.username && touched.username && errors.username}
							</Text>
						</GridItem>
						<GridItem>
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
						{user?.roles[0]?.roleName !== 'Manager' && (
							<GridItem>
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
									borderColor={errors.role && touched.role ? 'red.300' : null}
									className={errors.role && touched.role ? 'isInvalid' : null}
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
							'Agent' &&
							user?.roles[0]?.roleName !== 'Manager' && (
								<GridItem>
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
										{tree?.tree?.managers?.map((manager) => (
											<option value={manager?._id}>
												{manager?.firstName + ' ' + manager?.lastName}
											</option>
										))}
									</Select>
								</GridItem>
							)}
						<GridItem>
							<FormLabel
								display='flex'
								ms='4px'
								fontSize='sm'
								fontWeight='500'
								mb='8px'
							>
								Password
							</FormLabel>
							<InputGroup size='md'>
								<Input
									isRequired={true}
									fontSize='sm'
									placeholder='Enter Your Password'
									name='password'
									size='lg'
									variant='auth'
									type={show ? 'text' : 'password'}
									value={values.password}
									onChange={handleChange}
									onBlur={handleBlur}
									borderColor={
										errors.password && touched.password ? 'red.300' : null
									}
									className={
										errors.password && touched.password ? 'isInvalid' : null
									}
								/>
								<InputRightElement display='flex' alignItems='center' mt='4px'>
									<Icon
										color={'gray.400'}
										_hover={{ cursor: 'pointer' }}
										as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
										onClick={showPass}
									/>
								</InputRightElement>
							</InputGroup>
							<Text mb='10px' color={'red'}>
								{' '}
								{errors.password && touched.password && errors.password}
							</Text>
						</GridItem>
						<GridItem>
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
								borderColor={errors.agency && touched.agency ? 'red.300' : null}
								className={errors.agency && touched.agency ? 'isInvalid' : null}
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
						<GridItem>
							<FormLabel
								display='flex'
								ms='4px'
								fontSize='sm'
								fontWeight='500'
								mb='8px'
							>
								Nationality
							</FormLabel>
							<Input
								fontSize='sm'
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.nationality}
								name='nationality'
								placeholder='Nationality'
								fontWeight='500'
								borderColor={
									errors.nationality && touched.nationality ? 'red.300' : null
								}
							/>
							<Text mb='10px' color={'red'}>
								{errors.nationality &&
									touched.nationality &&
									errors.nationality}
							</Text>
						</GridItem>
						<GridItem>
							<FormLabel
								display='flex'
								ms='4px'
								fontSize='sm'
								fontWeight='500'
								mb='8px'
							>
								Date of Birth
							</FormLabel>
							<Input
								type='date'
								fontSize='sm'
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.dob}
								name='dob'
								fontWeight='500'
								borderColor={errors.dob && touched.dob ? 'red.300' : null}
							/>
							<Text mb='10px' color={'red'}>
								{errors.dob && touched.dob && errors.dob}
							</Text>
						</GridItem>
						<GridItem>
							<FormLabel
								display='flex'
								ms='4px'
								fontSize='sm'
								fontWeight='500'
								mb='8px'
							>
								Education Degree
							</FormLabel>
							<Input
								fontSize='sm'
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.educationDegree}
								name='educationDegree'
								placeholder='Education Degree'
								fontWeight='500'
								borderColor={
									errors.educationDegree && touched.educationDegree
										? 'red.300'
										: null
								}
							/>
							<Text mb='10px' color={'red'}>
								{errors.educationDegree &&
									touched.educationDegree &&
									errors.educationDegree}
							</Text>
						</GridItem>
						<GridItem>
							<FormLabel
								display='flex'
								ms='4px'
								fontSize='sm'
								fontWeight='500'
								mb='8px'
							>
								PASSPORT NUM
							</FormLabel>
							<Input
								fontSize='sm'
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.passportNum}
								name='passportNum'
								placeholder='PASSPORT NUM'
								fontWeight='500'
								borderColor={
									errors.passportNum && touched.passportNum ? 'red.300' : null
								}
							/>
							<Text mb='10px' color={'red'}>
								{errors.passportNum &&
									touched.passportNum &&
									errors.passportNum}
							</Text>
						</GridItem>
						{/* <GridItem >
    <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
      PASSPORT PHOTO
    </FormLabel>
    <Input
      type="file"
      fontSize="sm"
      onChange={handleChange}
      onBlur={handleBlur}
      name="passportPhoto"
      fontWeight="500"
    />
    <Text mb="10px" color={"red"}>
      {errors.passportPhoto && touched.passportPhoto && errors.passportPhoto}
    </Text>
  </GridItem> */}
						<GridItem>
							<FormLabel
								display='flex'
								ms='4px'
								fontSize='sm'
								fontWeight='500'
								mb='8px'
							>
								UEA ID NUM
							</FormLabel>
							<Input
								fontSize='sm'
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.uaeIdNum}
								name='uaeIdNum'
								placeholder='UEA ID NUM'
								fontWeight='500'
								borderColor={
									errors.uaeIdNum && touched.uaeIdNum ? 'red.300' : null
								}
							/>
							<Text mb='10px' color={'red'}>
								{errors.uaeIdNum && touched.uaeIdNum && errors.uaeIdNum}
							</Text>
						</GridItem>
						{/* <GridItem >
    <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" mb="8px">
      UEA ID PHOTO
    </FormLabel>
    <Input
      type="file"
      fontSize="sm"
      onChange={handleChange}
      onBlur={handleBlur}
      name="uaeIdPhoto"
      fontWeight="500"
    />
    <Text mb="10px" color={"red"}>
      {errors.uaeIdPhoto && touched.uaeIdPhoto && errors.uaeIdPhoto}
    </Text>
  </GridItem> */}

						<GridItem>
							<FormLabel
								display='flex'
								ms='4px'
								fontSize='sm'
								fontWeight='500'
								mb='8px'
							>
								DUBAI HOME Address
							</FormLabel>
							<Input
								fontSize='sm'
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.dubaiHomeAddress}
								name='dubaiHomeAddress'
								placeholder='Dubai Home Address'
								fontWeight='500'
								borderColor={
									errors.dubaiHomeAddress && touched.dubaiHomeAddress
										? 'red.300'
										: null
								}
							/>
							<Text mb='10px' color={'red'}>
								{errors.dubaiHomeAddress &&
									touched.dubaiHomeAddress &&
									errors.dubaiHomeAddress}
							</Text>
						</GridItem>
						<GridItem>
							<FormLabel
								display='flex'
								ms='4px'
								fontSize='sm'
								fontWeight='500'
								mb='8px'
							>
								Driving license
							</FormLabel>
							<Input
								fontSize='sm'
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.drivingLicense}
								name='drivingLicense'
								placeholder='Driving license'
								fontWeight='500'
								borderColor={
									errors.drivingLicense && touched.drivingLicense
										? 'red.300'
										: null
								}
							/>
							<Text mb='10px' color={'red'}>
								{errors.drivingLicense &&
									touched.drivingLicense &&
									errors.drivingLicense}
							</Text>
						</GridItem>
						<GridItem>
							<FormLabel
								display='flex'
								ms='4px'
								fontSize='sm'
								fontWeight='500'
								mb='8px'
							>
								Country home address
							</FormLabel>
							<Input
								fontSize='sm'
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.countryHomeAddress}
								name='countryHomeAddress'
								placeholder='Country Home Address'
								fontWeight='500'
								borderColor={
									errors.countryHomeAddress && touched.countryHomeAddress
										? 'red.300'
										: null
								}
							/>
							<Text mb='10px' color={'red'}>
								{errors.countryHomeAddress &&
									touched.countryHomeAddress &&
									errors.countryHomeAddress}
							</Text>
						</GridItem>
						<GridItem>
							<FormLabel
								display='flex'
								ms='4px'
								fontSize='sm'
								fontWeight='500'
								mb='8px'
							>
								COUNTRY PHONE NUM
							</FormLabel>
							<Input
								type='tel'
								fontSize='sm'
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.countryPhoneNum}
								name='countryPhoneNum'
								placeholder='Country Phone Number'
								fontWeight='500'
								borderColor={
									errors.countryPhoneNum && touched.countryPhoneNum
										? 'red.300'
										: null
								}
							/>
							<Text mb='10px' color={'red'}>
								{errors.countryPhoneNum &&
									touched.countryPhoneNum &&
									errors.countryPhoneNum}
							</Text>
						</GridItem>
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
						onClick={() => {
							formik.resetForm();
							onClose();
						}}
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
						{isLoading ? <Spinner /> : 'Save'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AddUser;
