import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Grid,
	Box,
	Text,
	Heading,
	Flex,
	IconButton,
	Tooltip,
	GridItem,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaEdit, FaRegCalendar } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles
import { useCreateItemMutation, useFetchItemsQuery } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Loader from 'components/loading/Loader';
import { IoArrowBack } from 'react-icons/io5';

// import { format } from 'date-fns';
import CustomSelect from 'components/shared/CustomSelect';
import CustomInput from 'components/shared/CustomInput';
import CustomButton from 'components/shared/CustomButton';
import { formattedDate } from 'utils/helpers';
import OfferLetterEditor from './OfferLetterEditor';
import { jobTypes } from 'utils/options';

// Validation schema for the form
const validationSchema = Yup.object().shape({
	jobType: Yup.string().required('Job type is required'),
	location: Yup.string().required('Location is required'),
	position: Yup.string().required('Position is required'),
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
	joiningDate: Yup.date().required('Joining date is required'),
});
const OfferLetter = () => {
	const [offerDetails, setOfferDetails] = useState({});
	const [emailBody, setEmailBody] = useState('');

	const { id } = useParams();
	const [searchParams] = useSearchParams();
	const offerType = searchParams.get('type');
	const [isEditing, setIsEditing] = useState(false);
	const { data: interview, isLoading } = useFetchItemsQuery(
		{
			path: `/interviews/${id}`,
		},
		{ refetchOnMountOrArgChange: true }
	);

	const { data: positionOptions, isLoading: positionsLoading } =
		useFetchItemsQuery(
			{
				path: `/positions/options`,
			},
			{ refetchOnMountOrArgChange: true }
		);

	useEffect(() => {
		if (interview?.doc) {
			const data = interview?.doc;

			setOfferDetails({
				remarks: data.remarks || '',
				leadInterviewerName: data.leadInterviewer.fullName || '',
				candidateName: data.candidate.name || '',
				jobType: data.jobType || '',
				location: data.location || '',
				position: data.position || '',
				amount: data.amount || '',
				commission: data.commission || '',
				instructions: '',
				joiningDate: data.joiningDate || new Date(),
				offerMail: data.offerMail || '',
			});

			if (offerType) {
				offerType === 'edit' ? setIsEditing(true) : setIsEditing(false);
			}
		}
	}, [interview, offerType]);

	const [createItemMutation, { isLoading: sendingOffer }] =
		useCreateItemMutation();

	const [selectedDate, setSelectedDate] = useState(
		offerDetails.joiningDate ? new Date(offerDetails.joiningDate) : null
	);
	const [showCalendar, setShowCalendar] = useState(false);

	const toggleCalendar = () => setShowCalendar(!showCalendar);

	const handleDateChange = (date) => {
		setSelectedDate(date);
		setShowCalendar(false);
	};

	const onSubmitOffer = async (data) => {
		const offerData = {
			...data,
			joiningDate: selectedDate,
			leadInterviewerName: offerDetails?.leadInterviewerName,
			emailBody,
		};

		if (!selectedDate) {
			toast.error('Joining date is required');
			return;
		}

		try {
			await createItemMutation({
				path: `/hiring/send-offer/${interview?.doc?.candidate?._id}`,
				body: offerData,
			}).unwrap();

			toast.success('Offer sent successfully');
			setOfferDetails(offerData);
			setIsEditing(false);
			navigate('/hiring/interviewed-candidates');
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to send offer');
		}
	};

	const handleFieldChange = (fieldName, value) => {
		setOfferDetails((prev) => ({
			...prev,
			[fieldName]: value,
		}));
	};

	const navigate = useNavigate();

	return isLoading || positionsLoading ? (
		<Loader />
	) : offerDetails && interview?.doc ? (
		<Box>
			<Button
				colorScheme='gray'
				borderRadius='5px'
				size={{ base: 'sm', md: 'md' }}
				px={{ base: 4, md: 6 }}
				py={{ base: 2, md: 3 }}
				fontSize={{ base: 'sm', md: 'md' }}
				leftIcon={<IoArrowBack />}
				onClick={() => navigate('/hiring/interviewed-candidates')}
				mb={4}
			>
				Back
			</Button>
			<Box bg='white' p={8} mb={4} rounded='md' shadow='sm'>
				<Flex justifyContent='space-between' alignItems='center' mb={4}>
					<Heading>Offer Letter</Heading>
					<Tooltip label={isEditing ? 'Stop Editing' : 'Edit Offer'}>
						<IconButton
							icon={<FaEdit />}
							onClick={() => setIsEditing(!isEditing)}
							aria-label='Edit Offer Details'
							colorScheme={isEditing ? 'brand' : 'gray'}
							borderRadius='10px'
						/>
					</Tooltip>
				</Flex>
				<Box>
					<Formik
						enableReinitialize
						initialValues={offerDetails}
						validationSchema={validationSchema}
						onSubmit={onSubmitOffer}
					>
						{({ handleSubmit, setFieldValue, errors, touched, values }) => (
							<Form onSubmit={handleSubmit}>
								<Grid
									templateColumns={{
										base: '1fr',
										md: 'repeat(2, 1fr)',
										lg: 'repeat(3, 1fr)',
									}}
									gap={3}
									w='full'
									mt={2}
								>
									<CustomSelect
										label='Position'
										name='position'
										options={positionOptions?.doc}
										isReadOnly={!isEditing}
										isInvalid={errors.position && touched.position}
										placeholder={offerDetails.position}
										onChange={(e) => {
											setFieldValue('position', e.target.value);
											handleFieldChange('position', e.target.value);
										}}
									/>

									<CustomSelect
										label='Job Type'
										name='jobType'
										options={jobTypes}
										isReadOnly={!isEditing}
										isInvalid={errors.jobType && touched.jobType}
										placeholder={offerDetails.jobType}
										onChange={(e) => {
											setFieldValue('jobType', e.target.value);
											handleFieldChange('jobType', e.target.value);
										}}
									/>

									{values?.jobType !== 'Commission' && (
										<CustomInput
											label='Salary Amount'
											name='amount'
											type='number'
											placeholder={offerDetails.amount}
											isReadOnly={!isEditing}
											isInvalid={errors.amount && touched.amount}
											onChange={(e) => {
												setFieldValue('amount', e.target.value);
												handleFieldChange('amount', e.target.value);
											}}
										/>
									)}
									{values.jobType !== 'Salary' && (
										<CustomInput
											label='Commission %'
											name='commission'
											min={1}
											max={100}
											type='number'
											placeholder={offerDetails.commission}
											isReadOnly={!isEditing}
											isInvalid={errors.commission && touched.commission}
											onChange={(e) => {
												setFieldValue('commission', e.target.value);
												handleFieldChange('commission', e.target.value);
											}}
										/>
									)}

									<FormControl isInvalid={errors?.joiningDate}>
										{!isEditing ? (
											interview?.doc?.joiningDate && (
												<>
													<FormLabel fontSize='sm'>Joining Date</FormLabel>

													<Box
														border='none'
														outline='none'
														bg='#F2F2F2'
														p='3'
														fontSize='sm'
														rounded='md'
														shadow='sm'
													>
														{formattedDate(interview?.doc?.joiningDate)}
													</Box>
												</>
											)
										) : (
											<Box position='relative' width='100%'>
												<FormLabel fontSize='sm'>Joining Date</FormLabel>
												<InputGroup>
													<Input
														value={
															selectedDate
																? selectedDate.toLocaleDateString()
																: ''
														}
														placeholder='Select a date'
														readOnly
														required
														bg='gray.100'
														borderColor={
															errors?.joiningDate ? 'red.500' : 'gray.300'
														}
														borderRadius='md'
														fontSize='sm'
														py={1}
														focusBorderColor={
															errors?.joiningDate ? 'red.500' : '#E0B960'
														}
														isReadOnly
													/>
													<InputRightElement>
														<FaRegCalendar
															size={16}
															cursor='pointer'
															onClick={toggleCalendar}
														/>
													</InputRightElement>
												</InputGroup>
												{showCalendar && (
													<Box
														position='absolute'
														top='50px'
														zIndex='10'
														bg='white'
														border='1px solid #e2e8f0'
														borderRadius='md'
														boxShadow='0px 4px 6px rgba(0, 0, 0, 0.1)'
													>
														<Calendar
															onChange={handleDateChange}
															value={selectedDate}
															minDate={new Date()}
															className='custom-calendar'
														/>
													</Box>
												)}
											</Box>
										)}
										{errors?.joiningDate && (
											<Text color='red.500' fontSize='sm'>
												{errors?.joiningDate}
											</Text>
										)}
									</FormControl>
									<GridItem colSpan={3}>
										<CustomInput
											label='Location'
											name='location'
											placeholder={offerDetails.location}
											isReadOnly={!isEditing}
											isInvalid={errors.location && touched.location}
											onChange={(e) => {
												setFieldValue('location', e.target.value);
												handleFieldChange('location', e.target.value);
											}}
										/>
									</GridItem>

									<GridItem colSpan={3}>
										<CustomInput
											label='Instructions'
											name='instructions'
											type='textarea'
											isReadOnly={!isEditing}
											isInvalid={errors.instructions && touched.instructions}
											placeholder={offerDetails.instructions}
											onChange={(e) => {
												setFieldValue('instructions', e.target.value);
												handleFieldChange('instructions', e.target.value);
											}}
										/>
									</GridItem>

									<GridItem colSpan={3}>
										<FormLabel fontSize='sm'>Remarks</FormLabel>
										<Box
											border='none'
											outline='none'
											bg='#F2F2F2'
											p='3'
											fontSize='sm'
											rounded='md'
											shadow='sm'
										>
											{offerDetails?.remarks}
										</Box>
									</GridItem>
								</Grid>

								<OfferLetterEditor
									onSend={onSubmitOffer}
									offerDetails={offerDetails}
									emailBody={emailBody}
									setEmailBody={setEmailBody}
									setOfferDetails={setOfferDetails}
								/>
								<Flex justifyContent='flex-end'>
									<CustomButton
										isLoading={sendingOffer}
										isDisabled={!isEditing}
									>
										{interview?.doc?.isOffer ? 'Resend Offer' : 'Submit Offer'}
									</CustomButton>
								</Flex>
							</Form>
						)}
					</Formik>
				</Box>
			</Box>
		</Box>
	) : (
		<Text>Offer details not found!</Text>
	);
};

export default OfferLetter;
