import {
	Box,
	Text,
	Grid,
	FormControl,
	FormLabel,
	Input,
	Button,
	HStack,
} from '@chakra-ui/react';
import { useUpdateItemMutation } from 'api/apiSlice';
import { Formik, Form, Field } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import InterviewResult from '../../interviewedCandidates/InterviewResult';
import { useModalColors } from 'hooks/useModalColors';

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

const createInitialState = () => {
	return evaluationFields.reduce((acc, field) => {
		acc[field] = '';
		return acc;
	}, {});
};

const EvaluationPoints = ({
	isLeadInterviewer,
	handleTabChange,
	interview,
	interviewRefetch,
	isInterviewerSubmittedPoints,
}) => {
	const colors = useModalColors();
	const [evaluationData, setLocalEvaluationData] =
		useState(createInitialState());

	const [resultModalOpen, setResultModalOpen] = useState(false);

	const [searchParams] = useSearchParams();

	const [updateItemMutation, { isLoading: pointsUpdating }] =
		useUpdateItemMutation();

	const navigate = useNavigate();

	useEffect(() => {
		if (isInterviewerSubmittedPoints) {
			const target = isLeadInterviewer
				? `/hiring/interview/${interview?._id}?phase=hiring-info`
				: '/hiring';
			navigate(target);
		}
	}, [
		interview?._id,
		isInterviewerSubmittedPoints,
		navigate,
		isLeadInterviewer,
	]);

	const handleSubmit = async (data) => {
		try {
			const points = Object.values(data).reduce(
				(acc, val) => acc + Number(val),
				0
			);

			const interviewData = { evaluationData: data, points };

			await updateItemMutation({
				path: `/interviews/${interview?._id}`,
				body: interviewData,
			}).unwrap();

			toast.success('Interview data updated successfully');

			if (isLeadInterviewer) {
				handleTabChange(2);
				interviewRefetch();
			} else navigate('/hiring');
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to update interview data');
		}
	};

	return (
		<Box>
			<HStack
				flexDir={{ base: 'column', md: 'row' }}
				alignItems='center'
				justifyContent='space-between'
				mb={4}
				borderBottom='2px solid'
				borderColor={colors.borderColor}
				py='2'
			>
				<Text
					fontSize={{ base: 'xl', md: '2xl' }}
					fontWeight='bold'
					textAlign='center'
					color={colors.headingText}
				>
					Evaluation Points
				</Text>

				{interview?.isMultiRound && (
					<Button
						bg={colors.accentGold}
						color={colors.headerText}
						fontSize={{ base: 'xs', md: 'sm' }}
						fontWeight='normal'
						shadow='sm'
						h='2rem'
						rounded='md'
						_hover={{ bg: colors.goldLight }}
						_active={{ bg: colors.goldDark }}
						onClick={() => setResultModalOpen(true)}
					>
						Previous Result
					</Button>
				)}
			</HStack>

			<Formik
				initialValues={evaluationData}
				validationSchema={validationSchema}
				onSubmit={(values) => {
					setLocalEvaluationData(values);
					handleSubmit(values);
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
							{evaluationFields.map((field) => (
								<FormControl
									key={field}
									isInvalid={errors[field] && touched[field]}
								>
									<FormLabel color={colors.labelColor}>
										{field.replace(/([A-Z])/g, ' $1').trim()}
									</FormLabel>
									<Field name={field}>
										{({ field }) => (
											<Input
												{...field}
												type='number'
												min={0}
												max={10}
												placeholder='0-10'
												bg={colors.bgInput}
												borderColor={colors.borderColor}
												color={colors.headingText}
												_hover={{ borderColor: colors.accentGold }}
												_focus={{
													borderColor: colors.accentGold,
													boxShadow: `0 0 0 1px ${colors.accentGold}`,
												}}
												_placeholder={{ color: colors.mutedText }}
											/>
										)}
									</Field>
									{errors[field] && touched[field] ? (
										<Text fontSize='sm' mt='1' color={colors.badgeErrorText}>
											{errors[field]}
										</Text>
									) : null}
								</FormControl>
							))}
						</Grid>
						<Button
							bg={colors.accentGold}
							color={colors.headerText}
							fontSize={{ base: 'sm', md: 'md' }}
							fontWeight='normal'
							shadow='sm'
							rounded='md'
							_hover={{ bg: colors.goldLight }}
							_active={{ bg: colors.goldDark }}
							w='full'
							mt={6}
							type='submit'
							isLoading={pointsUpdating}
							loadingText='Loading...'
						>
							{isLeadInterviewer ? 'Next' : 'Submit Points'}
						</Button>
					</Form>
				)}
			</Formik>

			{resultModalOpen && (
				<InterviewResult
					onClose={() => setResultModalOpen(false)}
					isOpen={resultModalOpen}
					interviewId={interview?._id}
					mode='running'
					title='Previous Result'
				/>
			)}
		</Box>
	);
};

export default EvaluationPoints;