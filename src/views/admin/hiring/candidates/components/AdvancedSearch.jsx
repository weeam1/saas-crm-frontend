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
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const AdvancedSearch = ({ isOpen, onClose, onSearch }) => {
	const initialValues = {
		name: '',
		position: '',
		email: '',
		whatsApp: '',
		phone: '',
		nationality: '',
		experienceYears: '',
		status: '',
	};

	const [formValues, setFormValues] = useState(initialValues);

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
		email: Yup.string().email('Invalid email format'),
		phone: Yup.string(),
		whatsApp: Yup.string(),
		nationality: Yup.string(),
		experienceYears: Yup.number().typeError(
			'Experience must be a valid number'
		),
		position: Yup.string(),
	});

	const fields = [
		{ name: 'name', label: 'Name', placeholder: 'Enter Name' },
		{ name: 'email', label: 'Email', placeholder: 'Enter Email' },
		{ name: 'phone', label: 'Phone No', placeholder: 'Enter Phone Number' },
		{ name: 'whatsApp', label: 'WhatsApp No', placeholder: 'WhatsApp Number' },
		{
			name: 'nationality',
			label: 'Nationality',
			placeholder: 'Search by Nationality',
		},
		{
			name: 'experienceYears',
			label: 'Experience in Years',
			placeholder: 'Years of Experience',
		},
		{
			name: 'position',
			label: 'Applied For',
			placeholder: 'Enter the role',
		},
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
					maxH='500px' // Set max height for the modal body
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
											<FormLabel>{field.label}</FormLabel>
											<Input
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
												<Text color='red'>{errors[field.name]}</Text>
											)}
										</GridItem>
									))}
									<GridItem>
										<FormLabel>Status</FormLabel>
										<Select
											fontSize='sm'
											name='status'
											fontWeight='500'
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
