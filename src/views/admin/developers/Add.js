import { CloseIcon } from '@chakra-ui/icons';
import {
	Button,
	FormLabel,
	Grid,
	GridItem,
	IconButton,
	Input,
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
import { useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useCreateItemMutation, useFetchItemsQuery } from 'api/apiSlice';

const userSchema = Yup.object().shape({
	trn: Yup.string().required('TRN is required'),
	developer_name: Yup.string().required('Developer Name is required'),
	email: Yup.string()
		.email('Invalid email format')
		.required('Email is required'),
	address: Yup.string().required('Address is required'),
	country: Yup.string().required('Country is required'),
	agency: Yup.string(),
});

const AddUser = (props) => {
	const {
		onClose,
		isOpen,
		setAction,
		fetchData,
		pageIndex,
		pageSize,
		refetch,
	} = props;
	const [isLoading, setIsLoading] = useState(false);
	const [createItemMutation, { isLoading: mutationLoading }] =
		useCreateItemMutation();

	const user = JSON.parse(localStorage.getItem('user')) || {};
	const role =
		user?.role === 'superAdmin' ? 'superAdmin' : user?.roles?.[0]?.roleName;

	const {
		data: agenciesResponse,
		isLoading: isAgenciesLoading,
		isError: isAgenciesError,
	} = useFetchItemsQuery({ path: '/agencies' });

	const agencies = agenciesResponse?.doc || [];
	const initialValues = {
		trn: '',
		developer_name: '',
		address: '',
		email: '',
		country: '',
		agency: '',
	};

	const formik = useFormik({
		initialValues,
		validationSchema: userSchema,
		onSubmit: (values, { resetForm }) => {
			AddData(values, resetForm);
		},
		validateOnChange: true,
		validateOnBlur: true,
	});

	const {
		errors,
		touched,
		values,
		handleBlur,
		handleChange,
		handleSubmit,
		setFieldError,
		isValid,
		dirty,
		resetForm,
	} = formik;

	const AddData = async (values, resetForm) => {
		try {
			// if (role === 'superAdmin' && !values.agency) {
			// 	setFieldError('agency', 'Agency is required');
			// 	return;
			// }

			setIsLoading(true);
			const formValues = { ...values };
			const response = await createItemMutation({
				path: '/developer/add',
				body: formValues,
			}).unwrap();

			if (response.status === 'success') {
				fetchData({ pageIndex, pageSize });
				setAction((prev) => !prev);
				toast.success('Developer Added successfully!');
				resetForm();
				onClose();
			} else {
				if (response?.message) {
					const errorMsg = response.message.toLowerCase();
					if (errorMsg.includes('trn')) {
						setFieldError('trn', 'Developer with this TRN already exists');
					} else if (errorMsg.includes('email')) {
						setFieldError('email', 'Developer with this email already exists');
					} else {
						toast.error(response.message);
					}
				} else {
					toast.error('Failed to add developer');
				}
			}
		} catch (e) {
			console.error('Add Error:', e);
			if (e?.data?.message) {
				const errorMsg = e.data.message.toLowerCase();
				if (errorMsg.includes('trn')) {
					setFieldError('trn', 'Developer with this TRN already exists');
				} else if (errorMsg.includes('email')) {
					setFieldError('email', 'Developer with this email already exists');
				} else {
					toast.error(e.data.message);
				}
			} else {
				toast.error('Something went wrong!');
			}
		} finally {
			setIsLoading(false);
		}
	};

	const isFormComplete = () => {
		return (
			values.trn.trim() !== '' &&
			values.developer_name.trim() !== '' &&
			values.email.trim() !== '' &&
			values.address.trim() !== '' &&
			(role !== 'superAdmin' || values.agency.trim() !== '') &&
			isValid
		);
	};

	return (
		<Modal size='2xl' isOpen={isOpen} isCentered>
			<ModalOverlay />
			<ModalContent w='550px' fontFamily="'DM Sans', sans-serif">
				<ModalHeader justifyContent='space-between' display='flex'>
					Add Developer
					<IconButton onClick={onClose} icon={<CloseIcon />} />
				</ModalHeader>
				<form onSubmit={handleSubmit}>
					<ModalBody>
						<Grid templateColumns='1fr' gap={3}>
							<GridItem>
								<FormLabel fontSize='sm' fontWeight='500' mb='8px'>
									TRN
								</FormLabel>
								<Input
									fontSize='sm'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.trn}
									name='trn'
									placeholder='TRN'
									fontWeight='500'
									borderColor={errors.trn && touched.trn ? 'red.300' : null}
								/>
								{errors.trn && touched.trn && (
									<Text mb='10px' color='red' fontSize='sm'>
										{errors.trn}
									</Text>
								)}
							</GridItem>

							<GridItem>
								<FormLabel fontSize='sm' fontWeight='500' mb='8px'>
									Developer Name
								</FormLabel>
								<Input
									fontSize='sm'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.developer_name}
									name='developer_name'
									placeholder='Developer Name'
									fontWeight='500'
									borderColor={
										errors.developer_name && touched.developer_name
											? 'red.300'
											: null
									}
								/>
								{errors.developer_name && touched.developer_name && (
									<Text mb='10px' color='red' fontSize='sm'>
										{errors.developer_name}
									</Text>
								)}
							</GridItem>

							<GridItem>
								<FormLabel fontSize='sm' fontWeight='500' mb='8px'>
									Email
								</FormLabel>
								<Input
									fontSize='sm'
									type='email'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.email}
									name='email'
									placeholder='Email Address'
									fontWeight='500'
									borderColor={errors.email && touched.email ? 'red.300' : null}
								/>
								{errors.email && touched.email && (
									<Text mb='10px' color='red' fontSize='sm'>
										{errors.email}
									</Text>
								)}
							</GridItem>

							<GridItem>
								<FormLabel fontSize='sm' fontWeight='500' mb='8px'>
									Address
								</FormLabel>
								<Input
									fontSize='sm'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.address}
									name='address'
									placeholder='Address'
									fontWeight='500'
									borderColor={
										errors.address && touched.address ? 'red.300' : null
									}
								/>
								{errors.address && touched.address && (
									<Text mb='10px' color='red' fontSize='sm'>
										{errors.address}
									</Text>
								)}
							</GridItem>

							<GridItem>
								<FormLabel fontSize='sm' fontWeight='500' mb='8px'>
									Country
								</FormLabel>
								<Input
									fontSize='sm'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.country}
									name='country'
									placeholder='Country'
									fontWeight='500'
									borderColor={
										errors.country && touched.country ? 'red.300' : null
									}
								/>
								{errors.country && touched.country && (
									<Text mb='10px' color='red' fontSize='sm'>
										{errors.country}
									</Text>
								)}
							</GridItem>

							{role === 'superAdmin' && (
								<GridItem>
									<FormLabel fontSize='sm' fontWeight='500' mb='8px'>
										Agency
									</FormLabel>
									<Select
										fontSize='sm'
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.agency}
										name='agency'
										placeholder='Select Agency'
										fontWeight='500'
										borderColor={
											errors.agency && touched.agency ? 'red.300' : null
										}
										isDisabled={isAgenciesLoading || isAgenciesError}
									>
										{agencies.map((agency) => (
											<option key={agency._id} value={agency._id}>
												{agency.name}
											</option>
										))}
									</Select>
									{isAgenciesLoading && (
										<Text fontSize='sm'>Loading agencies...</Text>
									)}
									{isAgenciesError && (
										<Text mb='10px' color='red' fontSize='sm'>
											Failed to load agencies
										</Text>
									)}
									{errors.agency && touched.agency && (
										<Text mb='10px' color='red' fontSize='sm'>
											{errors.agency}
										</Text>
									)}
								</GridItem>
							)}
						</Grid>
					</ModalBody>
					<ModalFooter justifyContent='flex-end' pt={8} pb={6}>
						<Button
							bg='#CCCACA'
							color='black'
							size='sm'
							borderRadius='5px'
							onClick={() => {
								resetForm();
								onClose();
							}}
							_hover={{ bg: '#B5B3B3' }}
							fontFamily="'DM Sans', sans-serif"
							minWidth='100px'
							mr={3}
						>
							Cancel
						</Button>
						<Button
							type='submit'
							bg='#B79045'
							color='white'
							size='sm'
							borderRadius='5px'
							disabled={isLoading || mutationLoading || !isFormComplete()}
							_hover={{ bg: '#A77F3A' }}
							fontFamily="'DM Sans', sans-serif"
							minWidth='100px'
						>
							{isLoading || mutationLoading ? <Spinner /> : 'Save'}
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
};

export default AddUser;
