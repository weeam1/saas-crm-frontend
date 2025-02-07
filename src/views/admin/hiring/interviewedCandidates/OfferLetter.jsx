import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Select,
	Grid,
	Box,
	Text,
	Spinner,
	FormErrorMessage,
	Heading,
	Flex,
	Icon,
	IconButton,
	Tooltip,
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaEdit, FaRegCalendar } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles
import { positions, jobTypes } from '../helpers';
import { useCreateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Loader from 'components/loading/Loader';
import { IoArrowBack } from 'react-icons/io5';

// import { format } from 'date-fns';
import CustomSelect from 'components/shared/CustomSelect';
import CustomInput from 'components/shared/CustomInput';
import CustomButton from 'components/shared/CustomButton';
import { formattedDate } from 'utils/helpers';
import { useSelector } from 'react-redux';

// Validation schema for the form
const validationSchema = Yup.object().shape({
	jobType: Yup.string().required('Job type is required'),
	location: Yup.string().required('Location is required'),
	position: Yup.string().required('Position is required'),
	amount: Yup.number()
		.required('Amount is required')
		.positive('Must be a positive number'),
	joiningDate: Yup.date().required('Joining date is required'),
});
const OfferLetter = () => {
	const [offerDetails, setOfferDetails] = useState({});
	const { id } = useParams();
	const [searchParams] = useSearchParams();
	const offerType = searchParams.get('type');
	const [isEditing, setIsEditing] = useState(false);
	const { data: interview, isLoading } = useFetchItemsQuery({
		path: `/interviews/${id}`,
	});

	const positionOptions = useSelector((state) => state.positions.options);

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
				joiningDate: data.joiningDate || new Date(),
			});

			if (offerType) {
				offerType === 'resend' ? setIsEditing(true) : setIsEditing(false);
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

	const offerMessage = useMemo(() => {
		return `
      Hello ${offerDetails.candidateName},

      We are delighted to offer you the position of ${offerDetails.position} at WEAM ELNAGGAR. 
      We believe your skills and experience will be a valuable addition to our team.

      Offer Details:
      Job Role: ${offerDetails.position}
      Job Type: ${offerDetails.jobType}
      Reporting To: ${offerDetails?.leadInterviewerName || 'N/A'}
      Salary: ${offerDetails.amount}
      Joining Date: ${formattedDate(offerDetails.joiningDate)}
      Location: ${offerDetails.location}

      If you have any questions, feel free to reach out.
      Looking forward to welcoming you to our team!

      Best Regards,
      WEAM ELNAGGAR HR Team
    `;
	}, [offerDetails]);

	const navigate = useNavigate();

	return isLoading ? (
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
					{/* <DisplayField label='Remarks' value={offerDetails?.remarks} /> */}
					<Formik
						enableReinitialize
						initialValues={offerDetails}
						validationSchema={validationSchema}
						onSubmit={onSubmitOffer}
					>
						{({ handleSubmit, setFieldValue, errors, touched }) => (
							<Form onSubmit={handleSubmit}>
								<Grid
									templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
									gap={3}
									w='full'
									mt={2}
								>
									<CustomSelect
										label='Position'
										name='position'
										options={positionOptions}
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

									<CustomInput
										label='Salary Amount'
										name='amount'
										type='number'
										placeholder='Enter Amount'
										isReadOnly={!isEditing}
										isInvalid={errors.amount && touched.amount}
										onChange={(e) => {
											setFieldValue('amount', e.target.value);
											handleFieldChange('amount', e.target.value);
										}}
									/>

									<FormControl mb={4} isInvalid={errors?.joiningDate}>
										<FormLabel fontSize='sm'>
											{isEditing && 'Joining Date'}
										</FormLabel>
										{!isEditing ? (
											interview?.doc?.joiningDate && (
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
											)
										) : (
											<Box position='relative' width='100%'>
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
								</Grid>

								<CustomInput
									label='Location'
									name='location'
									placeholder='Enter Location'
									isReadOnly={!isEditing}
									isInvalid={errors.location && touched.location}
									onChange={(e) => {
										setFieldValue('location', e.target.value);
										handleFieldChange('location', e.target.value);
									}}
								/>

								<FormLabel fontSize='sm' my='2'>
									Remarks
								</FormLabel>
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

								<Flex justifyContent='flex-end'>
									<CustomButton
										isLoading={sendingOffer}
										isDisabled={!isEditing}
									>
										{offerDetails.joiningDate ? 'Resend Offer' : 'Submit Offer'}
									</CustomButton>
								</Flex>
								<Box
									width='full'
									maxHeight='300px'
									overflowY='auto'
									borderWidth='1px'
									borderColor='gray.300'
									borderRadius='md'
									p={4}
									mt='4'
									bg='softGray.100'
								>
									<Text whiteSpace='pre-line' fontSize='sm'>
										{offerMessage}
									</Text>
								</Box>
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

// const OfferLetter = () => {
// 	const [offerDetails, setOfferDetails] = useState({});
// 	const [isEditing, setIsEditing] = useState(false);
// 	const { id } = useParams();
// 	const { data: interview, isLoading } = useFetchItemsQuery({
// 		path: `/interviews/${id}`,
// 	});

// 	const navigate = useNavigate();

// 	useEffect(() => {
// 		if (interview?.doc) {
// 			const data = interview?.doc;
// 			setOfferDetails({
// 				remarks: data.remarks || '',
// 				leadInterviewerName: data.leadInterviewer.fullName || '',
// 				candidateName: data.candidate.name || '',
// 				jobType: data.jobType || '',
// 				location: data.location || '',
// 				position: data.position || '',
// 				amount: data.amount || '',
// 				joiningDate: data.joiningDate || '',
// 			});
// 		}
// 	}, [interview]);

// 	const [createItemMutation, { isLoading: sendingOffer }] =
// 		useCreateItemMutation();

// 	const [selectedDate, setSelectedDate] = useState(
// 		offerDetails.joiningDate ? new Date(offerDetails.joiningDate) : null
// 	);
// 	const [showCalendar, setShowCalendar] = useState(false);

// 	const toggleCalendar = () => setShowCalendar(!showCalendar);

// 	const handleDateChange = (date) => {
// 		setSelectedDate(date);
// 		setShowCalendar(false);
// 	};

// 	const onSubmitOffer = async (data) => {
// 		console.log({ data });
// 		const offerData = {
// 			...data,
// 			joiningDate: selectedDate,
// 			leadInterviewerName: offerDetails?.leadInterviewerName,
// 		};

// 		try {
// 			await createItemMutation({
// 				path: `/hiring/send-offer/${interview?.doc?.candidate?._id}`,
// 				body: offerData,
// 			}).unwrap();

// 			toast.success('Offer sent successfully');
// 			setOfferDetails(offerData);
// 			setIsEditing(false);
// 			navigate('/hiring/interviewed-candidates');
// 		} catch (error) {
// 			toast.error(error?.data?.message || 'Failed to send offer');
// 		}
// 	};

// 	const handleFieldChange = (fieldName, value) => {
// 		setOfferDetails((prev) => ({
// 			...prev,
// 			[fieldName]: value,
// 		}));
// 	};

// 	const offerMessage = `
//     Hello ${offerDetails.candidateName},

//     We are delighted to offer you the position of ${offerDetails.position} at WEAM ELNAGGAR.
//     We believe your skills and experience will be a valuable addition to our team.

//     Offer Details:
//     Job Role: ${offerDetails.position}
//     Job Type: ${offerDetails.jobType}
//     Reporting To: ${offerDetails?.leadInterviewerName || 'N/A'}
//     Salary: ${offerDetails.amount}
//     Joining Date: ${offerDetails.joiningDate}
//     Location: ${offerDetails.location}

//     If you have any questions, feel free to reach out.
//     Looking forward to welcoming you to our team!

//     Best Regards,
//     WEAM ELNAGGAR HR Team
//   `;

// 	return isLoading ? (
// 		<Loader />
// 	) : offerDetails && interview?.doc ? (
// 		<Box>
// 			<Button
// 				colorScheme='gray'
// 				borderRadius='5px'
// 				size={{ base: 'sm', md: 'md' }}
// 				px={{ base: 4, md: 6 }}
// 				py={{ base: 2, md: 3 }}
// 				fontSize={{ base: 'sm', md: 'md' }}
// 				leftIcon={<Icon as={IoArrowBack} boxSize={4} />}
// 				onClick={() => navigate('/hiring/interviewed-candidates')}
// 				mb={4}
// 			>
// 				Back
// 			</Button>
// 			<Box bg='white' p={8} mb={4} rounded='md' shadow='sm'>
// 				<Flex justifyContent='space-between' alignItems='center' mb={4}>
// 					<Heading>Offer Letter</Heading>
// 					<Tooltip label={isEditing ? 'Stop Editing' : 'Edit Offer'}>
// 						<IconButton
// 							icon={<FaEdit />}
// 							onClick={() => setIsEditing(!isEditing)}
// 							aria-label='Edit Offer Details'
// 							colorScheme={isEditing ? 'brand' : 'gray'}
// 							borderRadius='10px'
// 						/>
// 					</Tooltip>
// 				</Flex>
// 				<Box>
// 					<Formik
// 						enableReinitialize
// 						initialValues={offerDetails}
// 						validationSchema={validationSchema}
// 						onSubmit={onSubmitOffer}
// 					>
// 						{({ handleSubmit, setFieldValue, errors, touched }) => (
// 							<Form onSubmit={handleSubmit}>
// 								<Grid
// 									templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
// 									gap={3}
// 									w='full'
// 									mt={2}
// 								>
// 									<FormControl isInvalid={errors.position && touched.position}>
// 										<FormLabel fontSize='sm'>Position</FormLabel>
// 										{!isEditing ? (
// 											<Box
// 												border='none'
// 												outline='none'
// 												bg='#F2F2F2'
// 												p='3'
// 												fontSize='sm'
// 												rounded='md'
// 												shadow='sm'
// 											>
// 												{offerDetails.position}
// 											</Box>
// 										) : (
// 											<Field
// 												as={Select}
// 												name='position'
// 												bg='gray.100'
// 												borderColor='gray.300'
// 												fontSize='sm'
// 												py={1}
// 												_focus={{
// 													borderColor: '#D99A36',
// 													boxShadow: '0 0 0 1px #D99A36',
// 												}}
// 												onChange={(e) => {
// 													setFieldValue('position', e.target.value);
// 													handleFieldChange('position', e.target.value);
// 												}}
// 											>
// 												{positions.map((role) => (
// 													<option key={role.value} value={role.value}>
// 														{role.label}
// 													</option>
// 												))}
// 											</Field>
// 										)}
// 										<FormErrorMessage>{errors.position}</FormErrorMessage>
// 									</FormControl>

// 									<FormControl isInvalid={errors.jobType && touched.jobType}>
// 										<FormLabel fontSize='sm'>Job Type</FormLabel>
// 										{!isEditing ? (
// 											<Box
// 												border='none'
// 												outline='none'
// 												bg='#F2F2F2'
// 												p='3'
// 												fontSize='sm'
// 												rounded='md'
// 												shadow='sm'
// 											>
// 												{offerDetails.jobType}
// 											</Box>
// 										) : (
// 											<Field
// 												as={Select}
// 												name='jobType'
// 												bg='gray.100'
// 												borderColor='gray.300'
// 												fontSize='sm'
// 												py={1}
// 												_focus={{
// 													borderColor: '#D99A36',
// 													boxShadow: '0 0 0 1px #D99A36',
// 												}}
// 												onChange={(e) => {
// 													setFieldValue('jobType', e.target.value);
// 													handleFieldChange('jobType', e.target.value);
// 												}}
// 											>
// 												{jobTypes.map((type) => (
// 													<option key={type.value} value={type.value}>
// 														{type.label}
// 													</option>
// 												))}
// 											</Field>
// 										)}
// 										<FormErrorMessage>{errors.jobType}</FormErrorMessage>
// 									</FormControl>

// 									<FormControl isInvalid={errors.amount && touched.amount}>
// 										<FormLabel fontSize='sm'>Salary Amount</FormLabel>
// 										<Field
// 											as={Input}
// 											type='number'
// 											name='amount'
// 											placeholder='Enter Amount'
// 											bg='gray.100'
// 											borderColor='gray.300'
// 											fontSize='sm'
// 											py={1}
// 											_focus={{
// 												borderColor: '#D99A36',
// 												boxShadow: '0 0 0 1px #D99A36',
// 											}}
// 											isReadOnly={!isEditing}
// 											onChange={(e) => {
// 												setFieldValue('amount', e.target.value);
// 												handleFieldChange('amount', e.target.value);
// 											}}
// 										/>
// 										<FormErrorMessage>{errors.amount}</FormErrorMessage>
// 									</FormControl>

// 									<FormControl mb={4} isInvalid={errors?.selectedDate}>
// 										<FormLabel fontSize='sm'>Joining Date</FormLabel>
// 										<Box position='relative' width='100%'>
// 											<InputGroup>
// 												<Input
// 													value={
// 														selectedDate
// 															? selectedDate.toLocaleDateString()
// 															: ''
// 													}
// 													placeholder='Select a date'
// 													readOnly
// 													required
// 													bg='gray.100'
// 													borderColor={
// 														errors?.selectedDate ? 'red.500' : 'gray.300'
// 													}
// 													borderRadius='md'
// 													fontSize='sm'
// 													py={1}
// 													focusBorderColor={
// 														errors?.selectedDate ? 'red.500' : '#E0B960'
// 													}
// 													isReadOnly
// 												/>
// 												<InputRightElement>
// 													<FaRegCalendar
// 														size={16}
// 														cursor='pointer'
// 														onClick={toggleCalendar}
// 													/>
// 												</InputRightElement>
// 											</InputGroup>
// 											{showCalendar && (
// 												<Box
// 													position='absolute'
// 													top='50px'
// 													zIndex='10'
// 													bg='white'
// 													border='1px solid #e2e8f0'
// 													borderRadius='md'
// 													boxShadow='0px 4px 6px rgba(0, 0, 0, 0.1)'
// 												>
// 													<Calendar
// 														onChange={handleDateChange}
// 														value={selectedDate}
// 														minDate={new Date()}
// 														className='custom-calendar'
// 													/>
// 												</Box>
// 											)}
// 										</Box>
// 										{errors?.selectedDate && (
// 											<Text color='red.500' fontSize='sm'>
// 												{errors?.selectedDate}
// 											</Text>
// 										)}
// 									</FormControl>
// 								</Grid>

// 								<FormControl isInvalid={errors.location && touched.location}>
// 									<FormLabel fontSize='sm'>Location</FormLabel>
// 									<Field
// 										as={Input}
// 										name='location'
// 										bg='gray.100'
// 										borderColor='gray.300'
// 										fontSize='sm'
// 										py={1}
// 										_focus={{
// 											borderColor: '#D99A36',
// 											boxShadow: '0 0 0 1px #D99A36',
// 										}}
// 										placeholder='Enter Location'
// 										isReadOnly={!isEditing}
// 										onChange={(e) => {
// 											setFieldValue('location', e.target.value);
// 											handleFieldChange('location', e.target.value);
// 										}}
// 									/>
// 									<FormErrorMessage>{errors.location}</FormErrorMessage>
// 								</FormControl>

// 								<FormLabel fontSize='sm' my='2'>
// 									Remarks
// 								</FormLabel>
// 								<Box
// 									border='none'
// 									outline='none'
// 									bg='#F2F2F2'
// 									p='3'
// 									fontSize='sm'
// 									rounded='md'
// 									shadow='sm'
// 								>
// 									{offerDetails?.remarks}
// 								</Box>

// 								<Flex justifyContent='flex-end'>
// 									<Button
// 										bg='brand.500'
// 										color='white'
// 										_hover={{
// 											bg: 'brand.600',
// 											color: 'white',
// 										}}
// 										_active={{
// 											bg: 'brand.600',
// 										}}
// 										size='sm'
// 										rounded='md'
// 										type='submit'
// 										mt={4}
// 										isDisabled={!isEditing}
// 									>
// 										{sendingOffer ? (
// 											<Spinner />
// 										) : offerDetails.joiningDate ? (
// 											'Resend Offer'
// 										) : (
// 											'Submit Offer'
// 										)}
// 									</Button>
// 								</Flex>
// 								<Box
// 									width='full'
// 									maxHeight='300px'
// 									overflowY='auto'
// 									borderWidth='1px'
// 									borderColor='gray.300'
// 									borderRadius='md'
// 									p={4}
// 									mt='4'
// 									bg='softGray.100'
// 								>
// 									<Text whiteSpace='pre-line' fontSize='sm'>
// 										{offerMessage}
// 									</Text>
// 								</Box>
// 							</Form>
// 						)}
// 					</Formik>
// 				</Box>
// 			</Box>
// 		</Box>
// 	) : (
// 		<Text>Offer details not found!</Text>
// 	);
// };

export default OfferLetter;
