import {
	Box,
	Text,
	Grid,
	FormControl,
	FormLabel,
	Input,
	Button,
	SimpleGrid,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
} from '@chakra-ui/react';
import { useUpdateItemMutation } from 'api/apiSlice';
import { Formik, Form, Field } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
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
	'Stability',
	'Information',
];

const validationSchema = Yup.object().shape(
	evaluationFields.reduce((acc, field) => {
		acc[field] = Yup.number()
			.min(0, `${field} must be at least 0`)
			.max(10, `${field} must be at most 10`)
			.required(`${field} is required`);
		return acc;
	}, {})
);

const createInitialState = (criteria = []) => {
	// Convert criteria array to object with field scores
	const criteriaObj = criteria.reduce((acc, item) => {
		acc[item.key] = item.score.toString();
		return acc;
	}, {});

	return evaluationFields.reduce((acc, field) => {
		// Use existing score if available, otherwise empty string
		acc[field] = criteriaObj[field] || '';
		return acc;
	}, {});
};

const EvaluationForm = ({
	initialValues,
	onSubmit,
	isSubmitting,
	isLeadInterviewer,
}) => {
	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
			enableReinitialize
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
						{evaluationFields.map((field) => (
							<FormControl
								key={field}
								isInvalid={errors[field] && touched[field]}
							>
								<FormLabel>{field.replace(/([A-Z])/g, ' $1').trim()}</FormLabel>
								<Field name={field}>
									{({ field }) => (
										<Input
											{...field}
											type='number'
											min={0}
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
								{errors[field] && touched[field] ? (
									<Text fontSize='sm' mt='1' color='red.500'>
										{errors[field]}
									</Text>
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
						isLoading={isSubmitting}
					>
						{isLeadInterviewer ? 'Next' : 'Submit Points'}
					</Button>
				</Form>
			)}
		</Formik>
	);
};

const EvaluationPoints = ({
	isLeadInterviewer,
	handleTabChange,
	interview,
	interviewRefetch,
	isInterviewerSubmittedPoints,
	roundNumber = 1, // Default to first round
	previousRoundCriteria = [], // Criteria from previous round
}) => {
	const [searchParams] = useSearchParams();
	const [updateItemMutation, { isLoading: pointsUpdating }] =
		useUpdateItemMutation();
	const navigate = useNavigate();

	// Get evaluation data for the current round
	const currentEvaluationData = interview?.evaluations || {};
	const isSubmitted =
		isInterviewerSubmittedPoints || currentEvaluationData.submitted;

	useEffect(() => {
		if (isSubmitted) {
			const target = isLeadInterviewer
				? `/hiring/interview/${interview?._id}?phase=hiring-info`
				: '/hiring';
			navigate(target);
		}
	}, [interview?._id, isSubmitted, navigate, isLeadInterviewer]);

	const handleSubmit = async (data) => {
		try {
			const points = Object.values(data).reduce(
				(acc, val) => acc + Number(val),
				0
			);

			const interviewData = {
				evaluations: {
					criteria: Object.entries(data).map(([key, value]) => ({
						key,
						score: Number(value),
					})),
					points,
					submitted: true,
				},
			};

			await updateItemMutation({
				path: `/interviews/${interview?._id}`,
				body: interviewData,
			}).unwrap();

			toast.success('Evaluation submitted successfully');

			if (isLeadInterviewer) {
				handleTabChange(2);
				interviewRefetch();
			} else {
				navigate('/');
			}
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to submit evaluation');
		}
	};

	return (
		<Box>
			<Text
				fontSize={{ base: 'xl', md: '2xl' }}
				fontWeight='bold'
				mb={4}
				textAlign='center'
			>
				Evaluation Points - Round {roundNumber}
			</Text>

			{roundNumber > 1 && previousRoundCriteria.length > 0 && (
				<Box mb={6}>
					<Text fontWeight='semibold' mb={2}>
						Previous Round Scores:
					</Text>
					<SimpleGrid columns={{ base: 2, md: 5 }} spacing={2}>
						{previousRoundCriteria.map((item) => (
							<Box key={item.key} bg='gray.50' p={2} borderRadius='md'>
								<Text fontSize='sm'>{item.key}:</Text>
								<Text fontWeight='bold'>{item.score}/10</Text>
							</Box>
						))}
					</SimpleGrid>
				</Box>
			)}

			<EvaluationForm
				initialValues={createInitialState(currentEvaluationData.criteria)}
				onSubmit={handleSubmit}
				isSubmitting={pointsUpdating}
				isLeadInterviewer={isLeadInterviewer}
			/>
		</Box>
	);
};

// Parent component that handles the tabs
const InterviewEvaluationTabs = ({
	interviewDoc,
	nextRoundDoc,
	isLeadInterviewer,
	handleTabChange,
	interview,
	interviewRefetch,
	isInterviewerSubmittedPoints,
}) => {
	const [activeTab, setActiveTab] = useState(0);

	return (
		<Tabs index={activeTab} onChange={setActiveTab}>
			<TabList mb='1'>
				<Tab
					size='sm'
					_selected={{
						borderTop: '4px solid #B79045',
						bg: 'gray.100',
						fontWeight: 'semi-bold',
						color: 'black',
						outline: 'none',
					}}
					outline='none'
					bg='softGray.50'
					color='gray.500'
					_focus={{ outline: 'none' }}
					borderTop={'4px solid transparent'}
				>
					1st Round
				</Tab>
				{interviewDoc.isMultiRound && interviewDoc.nextRound && (
					<Tab
						size='sm'
						_selected={{
							borderTop: '4px solid #B79045',
							bg: 'gray.100',
							fontWeight: 'semi-bold',
							color: 'black',
							outline: 'none',
						}}
						outline='none'
						bg='softGray.50'
						color='gray.500'
						_focus={{ outline: 'none' }}
						borderTop={'4px solid transparent'}
					>
						2nd Round
					</Tab>
				)}
			</TabList>
			<TabPanels>
				<TabPanel>
					<EvaluationPoints
						interview={interviewDoc}
						roundNumber={1}
						isLeadInterviewer={isLeadInterviewer}
						handleTabChange={handleTabChange}
						interviewRefetch={interviewRefetch}
						isInterviewerSubmittedPoints={isInterviewerSubmittedPoints}
					/>
				</TabPanel>
				{interviewDoc.isMultiRound && interviewDoc.nextRound && (
					<TabPanel>
						<EvaluationPoints
							interview={nextRoundDoc}
							roundNumber={2}
							previousRoundCriteria={
								interviewDoc.evaluations?.round1?.criteria || []
							}
							isLeadInterviewer={isLeadInterviewer}
							handleTabChange={handleTabChange}
							interviewRefetch={interviewRefetch}
							isInterviewerSubmittedPoints={isInterviewerSubmittedPoints}
						/>
					</TabPanel>
				)}
			</TabPanels>
		</Tabs>
	);
};

export default InterviewEvaluationTabs;
