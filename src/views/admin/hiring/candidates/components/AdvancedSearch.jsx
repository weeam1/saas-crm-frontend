import React, { useEffect, useRef, useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Button,
	Grid,
	GridItem,
	FormLabel,
	Input,
	Text,
	Flex,
	Select,
	Icon,
	Box,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useFetchItemsQuery } from 'api/apiSlice';
import { FiInfo } from 'react-icons/fi';
import { useSelector } from 'react-redux';

// const positionOptions = [
// 	{ label: 'Manager', value: 'Manager' },
// 	{ label: 'HR', value: 'HR' },
// 	{ label: 'Secretary', value: 'Secretary' },
// 	{ label: 'Team Leader', value: 'Team Leader' },
// 	{ label: 'Sales', value: 'Sales' },
// 	{ label: 'Tele Sales', value: 'Tele Sales' },
// ];

const AdvancedSearch = ({ isOpen, onClose, onSearch, type }) => {
	const initialValues = {
		name: '',
		position: '',
		email: '',
		whatsApp: '',
		phone: '',
		nationality: '',
		experienceYears: '',
		status: '',
		inviteAccepted: '',
	};

	const [formValues, setFormValues] = useState(initialValues);

	const { data: countries } = useFetchItemsQuery({
		path: '/countries',
	});

	const { data: positionOptions, isLoading: positionsLoading } =
		useFetchItemsQuery(
			{
				path: `/positions/options`,
			},
			{ refetchOnMountOrArgChange: true }
		);

	const isMounted = useRef(true);

	useEffect(() => {
		// Set mounted to true on component mount
		isMounted.current = true;

		// Cleanup function sets mounted to false on component unmount
		return () => {
			isMounted.current = false;
		};
	}, []);

	const validationSchema = Yup.object({
		name: Yup.string(),
		dob: Yup.date(),
		email: Yup.string(),
		phone: Yup.string().matches(
			/^\+?[0-9\s]+$/,
			'Phone number must only contain digits'
		),
		whatsApp: Yup.string().matches(
			/^\+?[0-9\s]+$/,
			'WhatsApp number must only contain digits'
		),
		nationality: Yup.string(),
		experienceYears: Yup.string()
			.matches(/^\d+$/, 'Experience must be a valid integer') // Only allows whole numbers (no decimals)
			.typeError('Experience must be a valid number'), // Handles invalid type input
		position: Yup.string(),
	});

	const fields = [
		{ name: 'name', label: 'Name', placeholder: 'Enter Name' },
		{ name: 'email', label: 'Email', placeholder: 'Enter Email' },
		{ name: 'phone', label: 'Phone No', placeholder: 'Enter Phone Number' },
		{ name: 'whatsApp', label: 'WhatsApp No', placeholder: 'WhatsApp Number' },
		{
			name: 'experienceYears',
			label: 'Experience in Years',
			placeholder: 'Years of Experience',
		},
		// {
		// 	name: 'position',
		// 	label: 'Applied For',
		// 	placeholder: 'Enter the role',
		// },
	];

	const handleSubmit = (values) => {
		onSearch(values); // Trigger search with form values
		onClose(); // Close modal

		// Only update state if the component is still mounted
		if (isMounted.current) {
			setFormValues(values);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size='2xl'>
			<ModalOverlay />
			<ModalContent p='2'>
				<ModalHeader>Advanced Search</ModalHeader>
				<ModalCloseButton />
				<ModalBody
					width='100%'
					maxH='540px' // Set max height for the modal body
					overflowY='auto' // Enable vertical scrolling when content exceeds max height
					sx={{
						'&::-webkit-scrollbar': {
							width: '6px', // Custom scrollbar width
						},
						'&::-webkit-scrollbar-thumb': {
							background: 'brand.500', // Custom brand color (adjust according to your theme)
							borderRadius: '8px',
						},
						'&::-webkit-scrollbar-thumb:hover': {
							background: 'brand.600', // Slightly darker on hover
						},
					}}
				>
					<Formik
						initialValues={formValues}
						validationSchema={validationSchema}
						onSubmit={handleSubmit}
					>
						{({
							handleChange,
							handleBlur,
							values,
							errors,
							touched,
							resetForm,
						}) => (
							<Form>
								<Grid
									templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
									gap={{ base: 3, md: 6 }}
								>
									{fields.map((field) => (
										<GridItem key={field.name}>
											<FormLabel
												display='flex'
												ms='4px'
												fontSize='md'
												fontWeight='400'
												color='gray.800'
												mt={2}
												mb='1'
											>
												{field.label}
											</FormLabel>
											<Input
												fontWeight='500'
												fontSize='sm'
												type={field.type}
												name={field.name}
												placeholder={field.placeholder}
												onChange={handleChange}
												onBlur={handleBlur}
												value={values[field.name]}
												borderColor='gray.300'
												_focus={{
													borderColor: 'brand.500', // Apply brand color on focus
													boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)', // Highlight with brand color
												}}
											/>
											{errors[field.name] && touched[field.name] && (
												<Text color='red' fontSize='xs'>
													{errors[field.name]}
												</Text>
											)}
										</GridItem>
									))}
									<GridItem>
										<FormLabel
											display='flex'
											ms='4px'
											fontSize='md'
											fontWeight='500'
											color='gray.800'
											mt={2}
											mb='1'
										>
											Apply For
										</FormLabel>
										<Select
											fontSize='sm'
											name='position'
											fontWeight='400'
											defaultValue={''}
											rounded='md'
											shadow='sm'
											onChange={handleChange}
											onBlur={handleBlur}
											value={values['position']}
											borderColor='gray.300'
											_focus={{
												borderColor: 'brand.500', // Apply brand color on focus
												boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)', // Highlight with brand color
											}}
											placeholder='Search by role'
										>
											{positionOptions?.doc?.map((item) => (
												<option value={item._id} key={item._id}>
													{item.value}
												</option>
											))}
										</Select>
									</GridItem>
									<GridItem>
										<FormLabel
											display='flex'
											ms='4px'
											fontSize='md'
											fontWeight='400'
											color='gray.800'
											mt={2}
											mb='1'
										>
											Nationality
										</FormLabel>
										<Select
											fontSize='sm'
											name='nationality'
											fontWeight='500'
											defaultValue={''}
											rounded='md'
											shadow='sm'
											onChange={handleChange}
											onBlur={handleBlur}
											value={values['nationality']}
											borderColor='gray.300'
											_focus={{
												borderColor: 'brand.500', // Apply brand color on focus
												boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)', // Highlight with brand color
											}}
											placeholder='Search by nationality'
										>
											{countries?.doc?.map((country) => (
												<option value={country.name} key={country.code}>
													{country.name}
												</option>
											))}
										</Select>
									</GridItem>
									<GridItem>
										<FormLabel
											display='flex'
											ms='4px'
											fontSize='md'
											fontWeight='400'
											color='gray.800'
											mt={2}
											mb='1'
										>
											Status
										</FormLabel>
										<Select
											fontSize='sm'
											name='status'
											fontWeight='400'
											defaultValue={''}
											rounded='md'
											shadow='sm'
											onChange={handleChange}
											onBlur={handleBlur}
											value={values['status']}
											borderColor='gray.300'
											_focus={{
												borderColor: 'brand.500', // Apply brand color on focus
												boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)', // Highlight with brand color
											}}
											placeholder='Search by status'
										>
											{/* <option value=''>Search by status</option> */}
											<option value='Pending'>Pending</option>
											<option value='Eligible'>Eligible</option>
											<option value='Not Eligible'>Not Eligible</option>
										</Select>
									</GridItem>
									{(type === 'short-listed' || type === 'invited') && (
										<GridItem>
											<FormLabel
												display='flex'
												ms='4px'
												fontSize='md'
												fontWeight='400'
												color='gray.800'
												mt={2}
												mb='1'
											>
												Invite Status
											</FormLabel>
											<Select
												fontSize='sm'
												name='inviteAccepted'
												fontWeight='400'
												defaultValue={''}
												rounded='md'
												shadow='sm'
												onChange={handleChange}
												onBlur={handleBlur}
												value={values['inviteAccepted']}
												borderColor='gray.300'
												_focus={{
													borderColor: 'brand.500', // Apply brand color on focus
													boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)', // Highlight with brand color
												}}
												placeholder='Search by invite status'
											>
												<option value='true'>Accepted</option>
												<option value='false'>Not Accepted</option>
											</Select>
										</GridItem>
									)}
								</Grid>

								<Flex mt={4} justifyContent='flex-end'>
									<Button
										mr={3}
										colorScheme='gray'
										onClick={() => resetForm()}
										variant='outline'
										size='sm'
									>
										Clear
									</Button>
									<Button
										bg='brand.500'
										color='white'
										_hover={{
											bg: 'brand.600',
											color: 'white',
										}}
										_active={{
											bg: 'brand.600',
										}}
										size='sm'
										type='submit'
									>
										Search
									</Button>
								</Flex>
							</Form>
						)}
					</Formik>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default AdvancedSearch;
