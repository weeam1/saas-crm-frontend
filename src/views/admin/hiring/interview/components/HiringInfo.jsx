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
	Checkbox,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { jobTypes } from 'utils/options';
import RejectedCandidate from './RejectedCandidate';

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
		isNextRound: false,
	};

	const isFinalRound = interview.currentRound === 'final';

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
					.min(0, 'Commission must be at least 0')
					.max(100, 'Commission must be between 0 to 100'),
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

	useEffect(() => {
		setHiringData(formik.values);
	}, [formik.values, setHiringData]);

	console.log('HIRING INFO');
	return (
		<Box w='full'>
			<Box>
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
								isInvalid={
									formik.touched.commission && formik.errors.commission
								}
							>
								<FormLabel>Commission %</FormLabel>
								<Input
									type='number'
									name='commission'
									min={0}
									max={100}
									step='any'
									placeholder='Enter Commission'
									bg='gray.100'
									borderColor='gray.300'
									_focus={{
										borderColor: '#D99A36',
										boxShadow: '0 0 0 1px #D99A36',
									}}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									onKeyDown={(e) => {
										// Block keys: e, E, +, -
										if (['e', 'E', '+', '-'].includes(e.key)) {
											e.preventDefault();
										}
									}}
									value={formik.values.commission}
								/>
								<FormErrorMessage>{formik.errors.commission}</FormErrorMessage>
							</FormControl>
						)}
					</Grid>

					{!isFinalRound && (
						<Box bg='white' rounded='md' p={4} my='4'>
							<Text
								fontSize={{ base: 'sm', md: 'md' }}
								fontWeight='semibold'
								mb={4}
							>
								This Candidate need to next interview?
							</Text>
							<Checkbox
								isChecked={formik.values.isNextRound}
								onChange={() =>
									formik.setFieldValue(
										'isNextRound',
										!formik.values.isNextRound
									)
								}
								colorScheme='brand'
								size='lg'
								_focus={{
									boxShadow: 'none',
								}}
							>
								Yes
							</Checkbox>
						</Box>
					)}

					<RejectedCandidate
						interviewId={interview?._id}
						loading={updatingInterview}
					/>

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
		</Box>
	);
};

export default HiringInfo;
