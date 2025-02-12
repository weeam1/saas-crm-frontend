import {
	Box,
	Text,
	Grid,
	FormControl,
	FormLabel,
	Input,
	Button,
	Select,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

const evaluationFields = [
	'Appearance',
	'Intelligence',
	'Experience',
	'Communication',
	'Presentation Skills',
	'Education',
	'Responsibility',
	'Politeness',
	'Stability', // Yes/No field
	'Information', // Yes/No field
];

const validationSchema = Yup.object().shape(
	evaluationFields.reduce((acc, field) => {
		// For numeric fields (1-10)
		acc[field] = Yup.number()
			.min(0, `${field} must be at least 0`)
			.max(10, `${field} must be at most 10`)
			.required(`${field} is required`);
		return acc;
	}, {})
);

const createInitialState = () => {
	return evaluationFields.reduce((acc, field) => {
		acc[field] = '';
		return acc;
	}, {});
};

const EvaluationPoints = ({ isLeadInterviewer, onSubmit }) => {
	const [evaluationData, setLocalEvaluationData] =
		useState(createInitialState());

	return (
		<Box>
			<Text
				fontSize={{ base: 'xl', md: '2xl' }}
				fontWeight='bold'
				mb={4}
				textAlign='center'
			>
				Evaluation Points
			</Text>
			<Formik
				initialValues={evaluationData}
				validationSchema={validationSchema}
				onSubmit={(values) => {
					// Handle form submission
					setLocalEvaluationData(values);
					onSubmit(values);
				}}
			>
				{({ errors, touched }) => (
					<Form>
						<Grid
							templateColumns={{
								base: '1fr',
								md: 'repeat(2, 1fr)',
							}}
							gap={3}
							w='full'
						>
							{/* {evaluationFields.map((field) => (
								<FormControl
									key={field}
									isInvalid={errors[field] && touched[field]}
								>
									<FormLabel>
										{field.replace(/([A-Z])/g, ' $1').trim()}
									</FormLabel>
									<Field name={field}>
										{({ field }) => (
											<Input
												{...field}
												type='number'
												min={1}
												max={10}
												placeholder='1-10'
												bg='gray.100'
												borderColor='gray.300'
												_focus={{
													borderColor: '#D99A36',
													boxShadow: '0 0 0 1px #D99A36',
												}}
											/>
										)}
									</Field>
									{errors[field] && touched[field] ? (
										<Text color='red.500'>{errors[field]}</Text>
									) : null}
								</FormControl>
							))} */}

							{evaluationFields.map((field) => (
								<FormControl
									key={field}
									isInvalid={errors[field] && touched[field]}
								>
									<FormLabel>
										{field.replace(/([A-Z])/g, ' $1').trim()}
									</FormLabel>
									{field === 'Stability' || field === 'Information' ? (
										// Render Select Input for Yes/No fields
										<Field name={field}>
											{({ field }) => (
												<Select
													{...field}
													placeholder={`Select ${field.name}`}
													bg='gray.100'
													borderColor='gray.300'
													_focus={{
														borderColor: '#D99A36',
														boxShadow: '0 0 0 1px #D99A36',
													}}
												>
													<option value={10}>Yes</option>
													<option value={0}>No</option>
												</Select>
											)}
										</Field>
									) : (
										// Render Numeric Input for other fields
										<Field name={field}>
											{({ field }) => (
												<Input
													{...field}
													type='number'
													min={1}
													max={10}
													placeholder='0-10'
													bg='gray.100'
													borderColor='gray.300'
													_focus={{
														borderColor: '#D99A36',
														boxShadow: '0 0 0 1px #D99A36',
													}}
												/>
											)}
										</Field>
									)}
									{errors[field] && touched[field] ? (
										<Text color='red.500'>{errors[field]}</Text>
									) : null}
								</FormControl>
							))}
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
							{isLeadInterviewer ? 'End Interview' : 'Submit Points'}
						</Button>
					</Form>
				)}
			</Formik>
		</Box>
	);
};

export default EvaluationPoints;
