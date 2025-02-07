import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { useCreateItemMutation } from 'api/apiSlice';
import { useUpdateItemMutation } from 'api/apiSlice';

// Validation schema using Yup
const validationSchema = Yup.object({
	name: Yup.string().required('Position name is required'),
});

const PositionForm = ({
	initialData = {},
	mode = 'create',
	setViewForm,
	positionId,
	setMode,
	refetch,
}) => {
	const [createItemMuation, { isLoading: isCreating }] =
		useCreateItemMutation();
	const [updateItemMuation, { isLoading: isUpdating }] =
		useUpdateItemMutation();

	const onSubmit = async (values) => {
		console.log('Form values:', values);

		try {
			if (mode === 'edit') {
				await updateItemMuation({
					path: `/positions/${initialData._id}`,
					body: values,
				}).unwrap();
			} else {
				// Create logic
				await createItemMuation({
					path: '/positions',
					body: values,
				}).unwrap();
			}

			toast.success(
				`Position ${mode === 'create' ? 'created' : 'updated'} successfully.`
			);

			// Reset to create mode after submission
			setMode('create');
		} catch (error) {
			console.log(error);
			toast.error(error.data.message);
		} finally {
			setViewForm(false);
			refetch();
		}
	};

	const formik = useFormik({
		initialValues: {
			name: initialData.name || '',
		},
		validationSchema,
		onSubmit: (values, { resetForm }) => {
			onSubmit(values);
			if (mode === 'create') resetForm();
		},
	});

	return (
		<Box
			maxW='md'
			mx='auto'
			mt={5}
			p={5}
			borderWidth={1}
			borderRadius='md'
			boxShadow='md'
		>
			<form onSubmit={formik.handleSubmit}>
				<FormControl
					isInvalid={formik.errors.name && formik.touched.name}
					mb={4}
				>
					<FormLabel htmlFor='name'>Position Name</FormLabel>
					<Input
						id='name'
						name='name'
						type='text'
						variant='filled'
						placeholder='Enter position name'
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.name}
						borderColor='brand.500'
						focusBorderColor='brand.600'
					/>
					<FormErrorMessage>{formik.errors.name}</FormErrorMessage>
				</FormControl>
				<Flex justifyContent='flex-end' gap='2' alignItems='center'>
					<Button
						colorScheme='gray'
						rounded='md'
						onClick={() => setViewForm(false)}
					>
						Cancel
					</Button>
					<Button type='submit' colorScheme='brand' rounded='md'>
						{isCreating
							? 'Creating...'
							: isUpdating
								? 'Updating...'
								: mode === 'create'
									? 'Create Position'
									: 'Update Position'}
					</Button>
				</Flex>
			</form>
		</Box>
	);
};

export default PositionForm;
