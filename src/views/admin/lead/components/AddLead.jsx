import React, { useState } from 'react';
import {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
	Button,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Checkbox,
	Grid,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useCreateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';

const AddLead = ({ isOpen, onClose, refreshData, size }) => {
	// Initial values for Formik
	const initialValues = {
		leadName: '',
		leadWhatsappNumber: '',
		leadPhoneNumber: '',
		nationality: '',
		// timetocall: '',
		budget: '',
		ip: '',
		leadLang: '',
		// lastNote: '',
		leadCountry: '',
		leadSourceDetails: '',
		leadCampaign: '',
		pageUrl: '',
		leadAddress: '',
		leadEmail: '',
		leadSourceMedium: '',
		r_u_in_uae: false,
	};

	// Only "name" is required; others are optional.
	const validationSchema = Yup.object({
		leadName: Yup.string().required('Name is required'),
	});

	// Array of field definitions to avoid repeated code.
	const fields = [
		{ name: 'leadName', label: 'Name', type: 'text', required: true },
		{ name: 'leadEmail', label: 'Email', type: 'email' },
		{ name: 'leadWhatsappNumber', label: 'WhatsApp', type: 'text' },
		{ name: 'leadPhoneNumber', label: 'Phone Number', type: 'text' },
		{ name: 'nationality', label: 'Nationality', type: 'text' },
		// { name: 'timetocall', label: 'Time to Call', type: 'time' },
		{ name: 'budget', label: 'Budget', type: 'text' },
		{ name: 'ip', label: 'Country', type: 'text' },
		{ name: 'leadLang', label: 'Language', type: 'text' },
		// { name: 'lastNote', label: 'Last Note', type: 'textarea' },
		{ name: 'leadSourceDetails', label: 'Source Details', type: 'text' },
		{ name: 'leadCampaign', label: 'Campaign', type: 'text' },
		{ name: 'pageUrl', label: 'Page URL', type: 'url' },
		{ name: 'leadSourceMedium', label: 'Source Medium', type: 'text' },
		{ name: 'leadAddress', label: 'Address', type: 'text' },
		// { name: 'r_u_in_uae', label: 'Are you In UAE ?', type: 'checkbox' },
	];

	const [createItemMuation, { isLoading }] = useCreateItemMutation();

	// The submit handler is similar to your provided AddData function.
	const handleSubmit = async (values, actions) => {
		try {
			console.log({ values });
			// Call the API – adjust the endpoint/path as needed.
			await createItemMuation({
				path: '/lead/add-lead',
				body: values,
			}).unwrap();

			toast.success('Lead added successfully.');
			onClose();
			actions.resetForm();
			refreshData();
		} catch (error) {
			console.error(error);
			toast.error(error.data.message || 'Lead not added');
		}
	};

	// Helper to render each field using Chakra UI and Formik's Field.
	const renderField = (field) => (
		<Field name={field.name} key={field.name}>
			{({ field: formikField, meta }) => (
				<FormControl mb={4} isInvalid={meta.touched && meta.error}>
					{/* For checkboxes, the label is rendered differently */}
					{field.type !== 'checkbox' && (
						<FormLabel htmlFor={field.name}>{field.label}</FormLabel>
					)}
					{field.type === 'textarea' ? (
						<Textarea
							id={field.name}
							{...formikField}
							bg='gray.100'
							borderColor='gray.300'
							_focus={{
								borderColor: '#D99A36',
								boxShadow: '0 0 0 1px #D99A36',
							}}
							placeholder={field.label}
						/>
					) : field.type === 'checkbox' ? (
						<Checkbox
							bg='gray.100'
							borderColor='gray.300'
							_focus={{
								borderColor: '#D99A36',
								boxShadow: '0 0 0 1px #D99A36',
							}}
							id={field.name}
							{...formikField}
							isChecked={formikField.value}
						>
							{field.label}
						</Checkbox>
					) : (
						<Input
							id={field.name}
							type={field.type}
							{...formikField}
							bg='gray.100'
							borderColor='gray.300'
							_focus={{
								borderColor: '#D99A36',
								boxShadow: '0 0 0 1px #D99A36',
							}}
							placeholder={field.label}
						/>
					)}
					{meta.touched && meta.error && (
						<div style={{ color: 'red', fontSize: '0.8em' }}>{meta.error}</div>
					)}
				</FormControl>
			)}
		</Field>
	);

	return (
		<Drawer isOpen={isOpen} placement='right' onClose={onClose} size={size}>
			<DrawerOverlay />
			<DrawerContent
				maxH='full' // Set max height for the modal body
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
				<DrawerCloseButton />
				<DrawerHeader>Add New Lead</DrawerHeader>
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
				>
					{() => (
						<Form>
							<DrawerBody>
								<Grid
									templateColumns={{
										base: '1fr',
										md: 'repeat(2, 1fr)',
									}}
									gap={2}
									w='full'
								>
									{fields.map((field) => renderField(field))}
								</Grid>
							</DrawerBody>
							<DrawerFooter>
								<Button
									sx={{ marginLeft: 2, textTransform: 'capitalize' }}
									variant='outline'
									colorScheme='gray'
									size='sm'
									mr='2'
									onClick={onClose}
								>
									Close
								</Button>
								<Button
									size='sm'
									colorScheme='brand'
									type='submit'
									disabled={isLoading}
								>
									{isLoading ? 'Adding...' : 'Add Lead'}
								</Button>
							</DrawerFooter>
						</Form>
					)}
				</Formik>
			</DrawerContent>
		</Drawer>
	);
};

export default AddLead;
