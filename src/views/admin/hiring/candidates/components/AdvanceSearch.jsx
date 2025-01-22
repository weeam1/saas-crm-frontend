import React from 'react';
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
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const AdvancedSearch = ({ isOpen, onClose, fetchAdvancedSearch }) => {
	// Initial form values
	const initialValues = {
		name: '',
		dob: '',
		position: '',
		email: '',
		whatsApp: '',
		phone: '',
		nationality: '',
		experience: '',
		experienceYears: '',
	};

	// Validation schema using Yup
	const validationSchema = Yup.object({
		name: Yup.string(),
		email: Yup.string().email('Invalid email format'),
		phone: Yup.string(),
		// Add other validations as needed
	});

	// Define field configurations
	const fields = [
		{ name: 'name', label: 'Name', placeholder: 'Enter Name' },
		{ name: 'email', label: 'Email', placeholder: 'Enter Email' },
		{
			name: 'phone',
			label: 'Phone Number',
			placeholder: 'Enter Phone Number',
		},
		{
			name: 'whatsApp',
			label: 'WhatsApp Number',
			placeholder: 'Search by WhatsApp Number',
		},
		{
			name: 'nationality',
			label: 'Nationality',
			placeholder: 'Search by Nationality',
		},
		{
			name: 'experience',
			label: 'Experience',
			placeholder: 'Search by Experience',
		},
		{
			name: 'experienceYears',
			label: 'Experience Years',
			placeholder: 'Years of Experience',
		},
	];

	// Utility function for rendering fields
	const renderField = (
		field,
		handleChange,
		handleBlur,
		values,
		errors,
		touched
	) => (
		<GridItem colSpan={{ base: 12, md: 6 }} key={field.name}>
			<FormLabel
				display='flex'
				ms='4px'
				fontSize='sm'
				fontWeight='600'
				color='#000'
				mb='0'
				mt={2}
			>
				{field.label}
			</FormLabel>
			<Input
				fontSize='sm'
				onChange={handleChange}
				onBlur={handleBlur}
				value={values[field.name]}
				name={field.name}
				placeholder={field.placeholder}
				fontWeight='500'
			/>
			<Text mb='10px' color='red'>
				{errors[field.name] && touched[field.name] && errors[field.name]}
			</Text>
		</GridItem>
	);

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='lg'>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Advanced Search</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Formik
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={(values) => {
							fetchAdvancedSearch(values);
							onClose(); // Close modal after submit
						}}
					>
						{({ handleChange, handleBlur, values, errors, touched }) => (
							<Form>
								<Grid templateColumns='repeat(2, 1fr)' gap={6}>
									{fields.map((field) =>
										renderField(
											field,
											handleChange,
											handleBlur,
											values,
											errors,
											touched
										)
									)}
								</Grid>
								<Button mt={4} colorScheme='teal' type='submit'>
									Search
								</Button>
							</Form>
						)}
					</Formik>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default AdvancedSearch;
