import {
	Box,
	Text,
	Grid,
	FormControl,
	FormLabel,
	Select,
	Input,
	FormErrorMessage,
	Button,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { jobRoles, jobTypes } from '../../helpers';

// Validation Schema
const validationSchema = Yup.object().shape({
	jobRole: Yup.string().required('Job role is required'),
	jobType: Yup.string().required('Job type is required'),
	amount: Yup.number()
		.typeError('Amount must be a number')
		.required('Amount is required')
		.min(1, 'Amount must be at least 1'),
});

const HiringInfo = ({ interview, onSubmit }) => {
	const initialValues = {
		jobRole: interview?.candidate?.position || '',
		jobType: '',
		amount: '',
	};

	return (
		<Box w='full'>
			<Text
				fontSize={{ base: 'xl', md: '2xl' }}
				fontWeight='bold'
				mb={4}
				textAlign='center'
			>
				Hiring Information
			</Text>

			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={(values) => {
					onSubmit(values); // Proceed to the next step
				}}
			>
				{({ errors, touched, handleChange, handleBlur }) => (
					<Form>
						<Grid
							templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
							gap={3}
							w='full'
						>
							{/* Job Role */}
							<FormControl isInvalid={errors.jobRole && touched.jobRole}>
								<FormLabel>Job Role</FormLabel>
								<Field
									as={Select}
									name='jobRole'
									placeholder='Select Role'
									bg='gray.100'
									borderColor='gray.300'
									_focus={{
										borderColor: '#D99A36',
										boxShadow: '0 0 0 1px #D99A36',
									}}
									onChange={handleChange}
									onBlur={handleBlur}
								>
									{jobRoles.map((role) => (
										<option key={role.value} value={role.value}>
											{role.label}
										</option>
									))}
								</Field>
								<FormErrorMessage>{errors.jobRole}</FormErrorMessage>
							</FormControl>

							{/* Job Type */}
							<FormControl isInvalid={errors.jobType && touched.jobType}>
								<FormLabel>Job Type</FormLabel>
								<Field
									as={Select}
									name='jobType'
									placeholder='Select Contract Type'
									onChange={handleChange}
									bg='gray.100'
									borderColor='gray.300'
									_focus={{
										borderColor: '#D99A36',
										boxShadow: '0 0 0 1px #D99A36',
									}}
									onBlur={handleBlur}
								>
									{jobTypes.map((type) => (
										<option key={type.value} value={type.value}>
											{type.label}
										</option>
									))}
								</Field>
								<FormErrorMessage>{errors.jobType}</FormErrorMessage>
							</FormControl>

							{/* Amount */}
							<FormControl isInvalid={errors.amount && touched.amount}>
								<FormLabel>Amount</FormLabel>
								<Field
									as={Input}
									type='number'
									name='amount'
									placeholder='Enter Amount'
									bg='gray.100'
									borderColor='gray.300'
									_focus={{
										borderColor: '#D99A36',
										boxShadow: '0 0 0 1px #D99A36',
									}}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<FormErrorMessage>{errors.amount}</FormErrorMessage>
							</FormControl>
						</Grid>

						<Button
							bg='#EDC270'
							color='gray.800'
							fontSize={{ base: 'sm', md: 'md' }}
							fontWeight='normal'
							shadow='sm'
							rounded='md'
							_hover={{ bg: '#E0B960' }}
							_active={{ bg: '#D4AC50' }}
							w='full'
							mt={6}
							type='submit'
						>
							Next
						</Button>
					</Form>
				)}
			</Formik>
		</Box>
	);
};

export default HiringInfo;
