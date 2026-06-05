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
	useDisclosure,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { jobTypes } from 'utils/options';
import RejectedCandidate from './RejectedCandidate';
import InterviewNoteModal from './InterviewNoteModal';
import { toast } from 'react-toastify';
import { useModalColors } from 'hooks/useModalColors';

const HiringInfo = ({
	interview,
	onSubmit,
	setHiringData,
	positionOptions,
	updatingInterview,
}) => {
	const colors = useModalColors();
	const {
		isOpen: isInterviewNoteOpen,
		onOpen: onInterviewNoteOpen,
		onClose: onInterviewNoteClose,
	} = useDisclosure();

	const initialValues = {
		position: interview?.candidate?.position._id || '',
		jobType: interview?.jobType || '',
		amount: interview?.amount || '',
		commission: interview?.commission || '',
		incentive: interview?.incentive || '',
		isNextRound: false,
		interviewNote: '',
	};

	const isFinalRound = interview?.currentRound === 'final';

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
			otherwise: (schema) => schema.notRequired(),
		}),
		incentive: Yup.number()
			.transform((value, originalValue) =>
				originalValue === '' ? undefined : value
			)
			.nullable()
			.notRequired()
			.typeError('Incentive must be a number')
			.min(0, 'Incentive must be at least 0'),

		commission: Yup.number().when('jobType', {
			is: (jobType) => ['Commission', 'SalaryPlusCommission'].includes(jobType),
			then: (schema) =>
				schema
					.typeError('Commission must be a number')
					.required('Commission is required')
					.min(0, 'Commission must be at least 0')
					.max(100, 'Commission must be between 0 to 100'),
			otherwise: (schema) => schema.notRequired(),
		}),
	});

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			onSubmit(values);
			setHiringData(values);
		},
	});

	useEffect(() => {
		setHiringData(formik.values);
	}, [formik.values, setHiringData]);

	const handleEndInterview = async () => {
		const isValid = await formik
			.validateForm()
			.then((errors) => Object.keys(errors).length === 0);

		if (isValid) {
			onInterviewNoteOpen();
		} else
			toast.warning(
				'Please complete all required fields before ending the interview.'
			);
	};

	const submitInterview = ({ note }) => {
		if (note && note.trim() !== '') {
			setHiringData((values) => ({
				...values,
				interviewNote: note.trim(),
			}));
		}
		formik.handleSubmit();
		onInterviewNoteClose();
	};

	return (
		<Box w='full'>
			<Box>
				<Text
					fontSize={{ base: 'xl', md: '2xl' }}
					fontWeight='bold'
					mb={4}
					textAlign='center'
					color={colors.headingText}
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
							<FormLabel color={colors.labelColor}>Job Position</FormLabel>
							<Select
								name='position'
								bg={colors.bgInput}
								borderColor={colors.borderColor}
								color={colors.headingText}
								_hover={{ borderColor: colors.accentGold }}
								_focus={{
									borderColor: colors.accentGold,
									boxShadow: `0 0 0 1px ${colors.accentGold}`,
								}}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.position}
							>
								<option disabled value='' style={{ background: colors.bg, color: colors.mutedText }}>
									Select Position
								</option>
								{positionOptions?.map((role) => (
									<option key={role._id} value={role._id} style={{ background: colors.bg, color: colors.headingText }}>
										{role.label}
									</option>
								))}
							</Select>
							<FormErrorMessage color={colors.badgeErrorText}>
								{formik.errors.position}
							</FormErrorMessage>
						</FormControl>

						{/* Job Type */}
						<FormControl
							isInvalid={formik.touched.jobType && formik.errors.jobType}
						>
							<FormLabel color={colors.labelColor}>Job Type</FormLabel>
							<Select
								name='jobType'
								bg={colors.bgInput}
								borderColor={colors.borderColor}
								color={colors.headingText}
								_hover={{ borderColor: colors.accentGold }}
								_focus={{
									borderColor: colors.accentGold,
									boxShadow: `0 0 0 1px ${colors.accentGold}`,
								}}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.jobType}
							>
								<option disabled value='' style={{ background: colors.bg, color: colors.mutedText }}>
									Select Job Type
								</option>
								{jobTypes.map((type) => (
									<option key={type.value} value={type.value} style={{ background: colors.bg, color: colors.headingText }}>
										{type.label}
									</option>
								))}
							</Select>
							<FormErrorMessage color={colors.badgeErrorText}>
								{formik.errors.jobType}
							</FormErrorMessage>
						</FormControl>

						{/* Amount */}
						{formik.values.jobType !== 'Commission' && (
							<FormControl
								isInvalid={formik.touched.amount && formik.errors.amount}
							>
								<FormLabel color={colors.labelColor}>Amount</FormLabel>
								<Input
									type='number'
									name='amount'
									placeholder='Enter Amount'
									bg={colors.bgInput}
									borderColor={colors.borderColor}
									color={colors.headingText}
									_hover={{ borderColor: colors.accentGold }}
									_focus={{
										borderColor: colors.accentGold,
										boxShadow: `0 0 0 1px ${colors.accentGold}`,
									}}
									_placeholder={{ color: colors.mutedText }}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.amount}
								/>
								<FormErrorMessage color={colors.badgeErrorText}>
									{formik.errors.amount}
								</FormErrorMessage>
							</FormControl>
						)}

						{/* Commission */}
						{['Commission', 'SalaryPlusCommission'].includes(
							formik.values.jobType
						) && (
							<FormControl
								isInvalid={
									formik.touched.commission && formik.errors.commission
								}
							>
								<FormLabel color={colors.labelColor}>Commission %</FormLabel>
								<Input
									type='number'
									name='commission'
									min={0}
									max={100}
									step='any'
									placeholder='Enter Commission'
									bg={colors.bgInput}
									borderColor={colors.borderColor}
									color={colors.headingText}
									_hover={{ borderColor: colors.accentGold }}
									_focus={{
										borderColor: colors.accentGold,
										boxShadow: `0 0 0 1px ${colors.accentGold}`,
									}}
									_placeholder={{ color: colors.mutedText }}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									onKeyDown={(e) => {
										if (['e', 'E', '+', '-'].includes(e.key)) {
											e.preventDefault();
										}
									}}
									value={formik.values.commission}
								/>
								<FormErrorMessage color={colors.badgeErrorText}>
									{formik.errors.commission}
								</FormErrorMessage>
							</FormControl>
						)}

						{/* Incentive */}
						<FormControl
							isInvalid={formik.touched.incentive && formik.errors.incentive}
						>
							<FormLabel color={colors.labelColor}>Incentive (Optional)</FormLabel>
							<Input
								type='number'
								name='incentive'
								placeholder='Enter Incentive'
								bg={colors.bgInput}
								borderColor={colors.borderColor}
								color={colors.headingText}
								_hover={{ borderColor: colors.accentGold }}
								_focus={{
									borderColor: colors.accentGold,
									boxShadow: `0 0 0 1px ${colors.accentGold}`,
								}}
								_placeholder={{ color: colors.mutedText }}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.incentive}
							/>
							<FormErrorMessage color={colors.badgeErrorText}>
								{formik.errors.incentive}
							</FormErrorMessage>
						</FormControl>
					</Grid>

					{!isFinalRound && (
						<Box bg={colors.bgInput} rounded='md' p={4} my='4' border="1px solid" borderColor={colors.borderColor}>
							<Text
								fontSize={{ base: 'sm', md: 'md' }}
								fontWeight='semibold'
								mb={4}
								color={colors.headingText}
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
								colorScheme='yellow'
								size='lg'
								_focus={{
									boxShadow: 'none',
								}}
							>
								<Text color={colors.bodyText}>Yes</Text>
							</Checkbox>
						</Box>
					)}

					<RejectedCandidate
						interviewId={interview?._id}
						loading={updatingInterview}
					/>

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
						onClick={handleEndInterview}
						isLoading={updatingInterview}
						loadingText='Loading...'
					>
						End Interview
					</Button>
				</form>
			</Box>

			{isInterviewNoteOpen && (
				<InterviewNoteModal
					isOpen={isInterviewNoteOpen}
					onClose={onInterviewNoteClose}
					onSubmit={submitInterview}
				/>
			)}
		</Box>
	);
};

export default HiringInfo;