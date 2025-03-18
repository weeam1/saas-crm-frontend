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
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { jobTypes } from 'utils/options';

// const HiringInfo = ({
// 	interview,
// 	onSubmit,
// 	setHiringData,
// 	positionOptions,
// }) => {
// 	const initialValues = {
// 		position: interview?.candidate?.position._id || '',
// 		jobType: '',
// 		amount: '',
// 	};

// 	return (
// 		<Box w='full'>
// 			<Text
// 				fontSize={{ base: 'xl', md: '2xl' }}
// 				fontWeight='bold'
// 				mb={4}
// 				textAlign='center'
// 			>
// 				Hiring Information
// 			</Text>

// 			<Formik
// 				initialValues={initialValues}
// 				validationSchema={validationSchema}
// 				onSubmit={(values) => {
// 					onSubmit(values); // Proceed to the next step
// 					setHiringData(values);
// 				}}
// 			>
// 				{({ errors, touched, handleChange, handleBlur }) => {
// 					return (
// 						<Form>
// 							<Grid
// 								templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
// 								gap={3}
// 								w='full'
// 							>
// 								{/* Job Role */}
// 								<FormControl isInvalid={errors.position && touched.position}>
// 									<FormLabel>Job Position</FormLabel>
// 									<Field
// 										as={Select}
// 										name='position'
// 										placeholder='Select Position'
// 										bg='gray.100'
// 										borderColor='gray.300'
// 										_focus={{
// 											borderColor: '#D99A36',
// 											boxShadow: '0 0 0 1px #D99A36',
// 										}}
// 										onChange={handleChange}
// 										onBlur={handleBlur}
// 									>
// 										{positionOptions.map((role) => (
// 											<option key={role._id} value={role._id}>
// 												{role.label}
// 											</option>
// 										))}
// 									</Field>
// 									<FormErrorMessage>{errors.position}</FormErrorMessage>
// 								</FormControl>

// 								{/* Job Type */}
// 								<FormControl isInvalid={errors.jobType && touched.jobType}>
// 									<FormLabel>Job Type</FormLabel>
// 									<Field
// 										as={Select}
// 										name='jobType'
// 										placeholder='Select Contract Type'
// 										onChange={handleChange}
// 										bg='gray.100'
// 										borderColor='gray.300'
// 										_focus={{
// 											borderColor: '#D99A36',
// 											boxShadow: '0 0 0 1px #D99A36',
// 										}}
// 										onBlur={handleBlur}
// 									>
// 										{jobTypes.map((type) => (
// 											<option key={type.value} value={type.value}>
// 												{type.label}
// 											</option>
// 										))}
// 									</Field>
// 									<FormErrorMessage>{errors.jobType}</FormErrorMessage>
// 								</FormControl>

// 								{/* Amount */}
// 								<FormControl isInvalid={errors.amount && touched.amount}>
// 									<FormLabel>Amount</FormLabel>
// 									<Field
// 										as={Input}
// 										type='number'
// 										name='amount'
// 										placeholder='Enter Amount'
// 										bg='gray.100'
// 										borderColor='gray.300'
// 										_focus={{
// 											borderColor: '#D99A36',
// 											boxShadow: '0 0 0 1px #D99A36',
// 										}}
// 										onChange={handleChange}
// 										onBlur={handleBlur}
// 									/>
// 									<FormErrorMessage>{errors.amount}</FormErrorMessage>
// 								</FormControl>
// 							</Grid>

// 							<Button
// 								bg='#EDC270'
// 								color='gray.800'
// 								fontSize={{ base: 'sm', md: 'md' }}
// 								fontWeight='normal'
// 								shadow='sm'
// 								rounded='md'
// 								_hover={{ bg: '#E0B960' }}
// 								_active={{ bg: '#D4AC50' }}
// 								w='full'
// 								mt={6}
// 								type='submit'
// 							>
// 								Next
// 							</Button>
// 						</Form>
// 					);
// 				}}
// 			</Formik>
// 		</Box>
// 	);
// };

const HiringInfo = ({
	interview,
	onSubmit,
	setHiringData,
	positionOptions,
	updatingInterview,
}) => {
	const initialValues = {
		position: interview?.candidate?.position._id || '',
		jobType: '',
		amount: '',
		commission: '',
	};

	// Validation Schema
	const validationSchema = Yup.object().shape({
		position: Yup.string().required('Job position is required'),
		jobType: Yup.string().required('Job type is required'),
		amount: Yup.number().when('jobType', {
			is: (jobType) => jobType === 'Salary',
			then: (schema) =>
				schema
					.typeError('Amount must be a number')
					.required('Amount is required')
					.min(1, 'Amount must be at least 1'),
			otherwise: (schema) => schema.notRequired(), // Not required if jobType is only "Salary"
		}),

		commission: Yup.number().when('jobType', {
			is: (jobType) => ['Commission', 'SalaryPlusCommission'].includes(jobType),
			then: (schema) =>
				schema
					.typeError('Commission must be a number')
					.required('Commission is required')
					.min(1, 'Commission must be at least 1')
					.max(100, 'Commission must be between 1 to 100'),
			otherwise: (schema) => schema.notRequired(), // Not required if jobType is only "Salary"
		}),
	});

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			onSubmit(values); // Proceed to the next step
			setHiringData(values);
		},
	});

	// Update setHiringData whenever form values change
	useEffect(() => {
		setHiringData(formik.values);
	}, [formik.values, setHiringData]);

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

			<form onSubmit={formik.handleSubmit}>
				<Grid
					templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
					gap={3}
					w='full'
				>
					{/* Job Role */}
					<FormControl
						isInvalid={formik.touched.position && formik.errors.position}
					>
						<FormLabel>Job Position</FormLabel>
						<Select
							name='position'
							bg='gray.100'
							borderColor='gray.300'
							_focus={{
								borderColor: '#D99A36',
								boxShadow: '0 0 0 1px #D99A36',
							}}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.position}
						>
							<option disabled style={{ color: '#444' }} value=''>
								Select Position
							</option>
							{positionOptions.map((role) => (
								<option key={role._id} value={role._id}>
									{role.label}
								</option>
							))}
						</Select>
						<FormErrorMessage>{formik.errors.position}</FormErrorMessage>
					</FormControl>
					{/* Job Type */}
					<FormControl
						isInvalid={formik.touched.jobType && formik.errors.jobType}
					>
						<FormLabel>Job Type</FormLabel>
						<Select
							name='jobType'
							bg='gray.100'
							borderColor='gray.300'
							_focus={{
								borderColor: '#D99A36',
								boxShadow: '0 0 0 1px #D99A36',
							}}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.jobType}
						>
							<option disabled style={{ color: '#444' }} value=''>
								Select Job Type
							</option>
							{jobTypes.map((type) => (
								<option key={type.value} value={type.value}>
									{type.label}
								</option>
							))}
						</Select>
						<FormErrorMessage>{formik.errors.jobType}</FormErrorMessage>
					</FormControl>
					{/* Amount */}
					{formik.values.jobType !== 'Commission' && (
						<FormControl
							isInvalid={formik.touched.amount && formik.errors.amount}
						>
							<FormLabel>Amount</FormLabel>
							<Input
								type='number'
								name='amount'
								placeholder='Enter Amount'
								bg='gray.100'
								borderColor='gray.300'
								_focus={{
									borderColor: '#D99A36',
									boxShadow: '0 0 0 1px #D99A36',
								}}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.amount}
							/>
							<FormErrorMessage>{formik.errors.amount}</FormErrorMessage>
						</FormControl>
					)}

					{/* Commission (Show when jobType is Commission OR SalaryPlusCommission) */}
					{['Commission', 'SalaryPlusCommission'].includes(
						formik.values.jobType
					) && (
						<FormControl
							isInvalid={formik.touched.commission && formik.errors.commission}
						>
							<FormLabel>Commission %</FormLabel>
							<Input
								type='number'
								name='commission'
								min={1}
								max={100}
								placeholder='Enter Commission'
								bg='gray.100'
								borderColor='gray.300'
								_focus={{
									borderColor: '#D99A36',
									boxShadow: '0 0 0 1px #D99A36',
								}}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.commission}
							/>
							<FormErrorMessage>{formik.errors.commission}</FormErrorMessage>
						</FormControl>
					)}
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
					{updatingInterview ? 'Loading...' : 'End Interview'}
				</Button>
			</form>
		</Box>
	);
};

export default HiringInfo;
