// import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';
// import {
// 	Button,
// 	FormControl,
// 	FormLabel,
// 	Input,
// 	InputGroup,
// 	InputRightElement,
// 	Grid,
// 	Box,
// 	Text,
// 	Heading,
// 	Flex,
// 	IconButton,
// 	Tooltip,
// 	GridItem,
// } from '@chakra-ui/react';
// import { useEffect, useState } from 'react';
// import { FaEdit, FaRegCalendar } from 'react-icons/fa';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css'; // Import calendar styles
// import { useCreateItemMutation, useFetchItemsQuery } from 'api/apiSlice';
// import { toast } from 'react-toastify';
// import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
// import Loader from 'components/loading/Loader';
// import { IoArrowBack } from 'react-icons/io5';

// // import { format } from 'date-fns';
// import CustomSelect from 'components/shared/CustomSelect';
// import CustomInput from 'components/shared/CustomInput';
// import CustomButton from 'components/shared/CustomButton';
// import { formattedDate } from 'utils/helpers';
// import OfferLetterEditor from './OfferLetterEditor';
// import { jobTypes } from 'utils/options';
// import { toUTCString } from 'utils/helpers';
// import { buttonStyle } from 'utils/btn';
// import EditableSelect from 'components/shared/EditableSelect';
// import useUserSession from 'hooks/useUserSession';
// import { useUserActivityLog } from 'hooks/useUserActivityLog';

// // Validation schema for the form
// const validationSchema = Yup.object().shape({
// 	jobType: Yup.string().required('Job type is required'),
// 	location: Yup.string()
// 		.nullable()
// 		.min(1, 'Location is required')
// 		.required('Location is required'),
// 	position: Yup.string().required('Position is required'),
// 		locationLink: Yup.string().nullable(), 

// 	amount: Yup.number().when('jobType', {
// 		is: (jobType) => ['SalaryPlusCommission'].includes(jobType),
// 		then: (schema) =>
// 			schema
// 				.nullable()
// 				.typeError('Amount must be a number')
// 				.required('Amount is required')
// 				.min(1, 'Amount must be at least 1'),
// 		otherwise: (schema) => schema.notRequired(), // Not required if jobType is only "Salary"
// 	}),

// 	incentive: Yup.number()
// 		.transform((value, originalValue) =>
// 			originalValue === '' ? undefined : value
// 		)
// 		.nullable()
// 		.notRequired()
// 		.typeError('Incentive must be a number')
// 		.min(0, 'Incentive must be at least 0'),

// 	commission: Yup.number().when('jobType', {
// 		is: (jobType) => ['Commission', 'SalaryPlusCommission'].includes(jobType),
// 		then: (schema) =>
// 			schema
// 				.typeError('Commission must be a number')
// 				.required('Commission is required')
// 				.min(0, 'Commission must be at least 0')
// 				.max(100, 'Commission must be between 0 to 100'),
// 		otherwise: (schema) => schema.notRequired(), // Not required if jobType is only "Salary"
// 	}),
// 	joiningDate: Yup.date().required('Joining date is required'),
// });

// const OfferLetter = () => {
// 	const [offerDetails, setOfferDetails] = useState({});
// 	const [emailBody, setEmailBody] = useState('');
// console.log(offerDetails, 'offerDetails in main component');
// 	const { id: interviewId } = useParams();

// 	const [selectedDate, setSelectedDate] = useState(
// 		offerDetails.joiningDate ? new Date(offerDetails.joiningDate) : null
// 	);
// 	const [showCalendar, setShowCalendar] = useState(false);
// const [agenciesData, setAgenciesData] = useState([]);
// 	const { id } = useParams();
// 	const [searchParams] = useSearchParams();
// 	const offerType = searchParams.get('type');
// 	const [isEditing, setIsEditing] = useState(false);
// 	const { data: interview, isLoading } = useFetchItemsQuery(
// 		{
// 			path: `/interviews/${id}`,
// 		},
// 		{ refetchOnMountOrArgChange: true }
// 	);

// 	const { data: positionOptions, isLoading: positionsLoading } =
// 		useFetchItemsQuery(
// 			{
// 				path: `/positions/options`,
// 			},
// 			{ refetchOnMountOrArgChange: true }
// 		);

// 	const { data: agencies, isLoading: agencyLoading } = useFetchItemsQuery(
// 		{
// 			path: `/agencies`,
// 		},
// 		{ refetchOnMountOrArgChange: true }
// 	);

// // useEffect(() => {
// // 	if (interview?.doc && agencies?.doc) {
// // 		const data = interview?.doc;
		
// // 		// Find the agency that matches the interview's location
// // 		const matchedAgency = agencies.doc.find(
// // 			agency => agency.location === data.location
// // 		);
		
// // 		// Get locationLink from matched agency or first agency
// // 		const locationLinkValue = matchedAgency?.locationLink || agencies.doc[0]?.locationLink || '';

// // 		setOfferDetails({
// // 			remarks: data.remarks || '',
// // 			leadInterviewerName: data.leadInterviewer?.fullName || '',
// // 			candidateName: data.candidate?.name || '',
// // 			jobType: data.jobType || '',
// // 			location: data.location || agencies.doc[0]?.location || '',
// // 			locationLink: locationLinkValue,
// // 			position: data.position || '',
// // 			amount: data?.amount || 0,
// // 			incentive: data?.incentive || '',
// // 			commission: data?.commission || '',
// // 			instructions: data?.instructions || '',
// // 			joiningDate: data.joiningDate || new Date(),
// // 			offerMail: data.offerMail || '',
// // 		});

// // 		if (offerType) {
// // 			offerType === 'edit' || !data?.isOffer
// // 				? setIsEditing(true)
// // 				: setIsEditing(false);
// // 		}
// // 	}
// // }, [interview, offerType, agencies]); // Added agencies to dependency array

// useEffect(() => {
//   if (interview?.doc && agenciesData.length) {
//     const data = interview.doc;

//     const selectedAgency = agenciesData.find(
//   (a) => a.location === data.location
// );

// setOfferDetails({
//   remarks: data.remarks || '',
//   leadInterviewerName: data.leadInterviewer?.fullName || '',
//   candidateName: data.candidate?.name || '',
//   jobType: data.jobType || '',
//   location: selectedAgency?.location || data.location || '',
//   locationLink: selectedAgency?.locationLink || data.locationLink || '',
//   position: data.position || '',
//   amount: data?.amount || 0,
//   incentive: data?.incentive || '',
//   commission: data?.commission || '',
//   instructions: data?.instructions || '',
//   joiningDate: data.joiningDate || new Date(),
//   offerMail: data.offerMail || '',
// });

//     if (offerType) {
//       setIsEditing(offerType === 'edit' || !data?.isOffer);
//     }
//   }
// }, [interview, offerType, agenciesData]); // ✅ use agenciesData

// useEffect(() => {
// 	if (agencies?.doc) {
// 		const processedAgencies = agencies.doc.map(agency => ({
// 			location: agency.location,
// 			locationLink: agency.locationLink || ''
// 		}));
// 		setAgenciesData(processedAgencies);
// 	}
// }, [agencies]);
// 	const [createItemMutation, { isLoading: sendingOffer }] =
// 		useCreateItemMutation();

// 	const { user } = useUserSession();
// 	const { createUserLog } = useUserActivityLog();

// 	const toggleCalendar = () => setShowCalendar(!showCalendar);

// 	const handleDateChange = (date) => {
// 		setSelectedDate(date);
// 		setShowCalendar(false);
// 		setOfferDetails((prevDetails) => ({
// 			...prevDetails,
// 			joiningDate: date,
// 		}));
// 	};
// console.log(offerDetails, 'offerDetails before submit');
// 	const onSubmitOffer = async (data) => {
// 		const offerData = {
// 			...data,
// 			joiningDate: toUTCString(selectedDate),
// 			leadInterviewerName: offerDetails?.leadInterviewerName,
// 			emailBody,
// 			interviewId,
// 		};

// 		if (!selectedDate) {
// 			toast.error('Joining date is required');
// 			return;
// 		}

// 		try {
// 			await createItemMutation({
// 				path: `/hiring/send-offer/${interview?.doc?.candidate?._id}`,
// 				body: offerData,
// 			}).unwrap();
// console.log('Submitting offer with locationLink:', offerData.locationLink);
// 			toast.success('Offer sent successfully');
// 			setOfferDetails(offerData);
// 			setIsEditing(false);
// 			createUserLog({
// 				userId: user?._id,
// 				action: 'UPDATE',
// 				entity: 'Hiring',
// 				entityType: 'Interview',
// 				entityId: interviewId,
// 				status: 'success',
// 				message: `Offer sent to ${interview?.doc?.candidate?.name} by ${user?.fullName}.`,
// 			});
// 			navigate('/hiring/interviewed-candidates');
// 		} catch (error) {
// 			const errorMsg = error?.data?.message || 'Failed to send offer';
// 			toast.error(errorMsg);
// 			createUserLog({
// 				userId: user?._id,
// 				action: 'UPDATE',
// 				entity: 'Hiring',
// 				entityType: 'Interview',
// 				entityId: interviewId,
// 				status: error?.status === '500' ? 'error' : 'fail',
// 				message: errorMsg,
// 			});
// 		}
// 	};

	
// 	const navigate = useNavigate();

// 	return isLoading || positionsLoading || agencyLoading ? (
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
// 				leftIcon={<IoArrowBack />}
// 				onClick={() => navigate(-1)}
// 				mb={4}
// 			>
// 				Back
// 			</Button>
// 			<Box bg='white' p={8} mb={4} rounded='md' shadow='sm'>
// 				<Flex justifyContent='space-between' alignItems='center' mb={4}>
// 					<Heading>Offer Letter</Heading>
// 					{interview?.doc?.isOffer && (
// 						<Tooltip label={isEditing ? 'Stop Editing' : 'Edit Offer'}>
// 							<IconButton
// 								icon={<FaEdit />}
// 								onClick={() => setIsEditing(!isEditing)}
// 								aria-label='Edit Offer Details'
// 								colorScheme={isEditing ? 'brand' : 'gray'}
// 								borderRadius='10px'
// 							/>
// 						</Tooltip>
// 					)}
// 				</Flex>
// 				<Box>
// 					<Formik
// 						enableReinitialize
// 						initialValues={offerDetails}
// 						validationSchema={validationSchema}
// 						onSubmit={(values) => {
// 							onSubmitOffer(values);
// 						}}
// 					>
// 						{({ handleSubmit, setFieldValue, errors, touched, values }) => {
// 							console.log('Current Form Values:', values);
// 							// console.log('Formik Errors:', errors);
// 							// console.log('Formik Touched:', touched);
// 							return (
// 								<Form onSubmit={handleSubmit}>
// 									<Grid
// 										templateColumns={{
// 											base: '1fr',
// 											md: 'repeat(2, 1fr)',
// 										}}
// 										gap={3}
// 										w='full'
// 										p={{ base: 2, md: 4 }}
// 										mt={2}
// 									>
// 										<CustomSelect
// 											label='Position'
// 											name='position'
// 											options={positionOptions?.doc}
// 											isReadOnly={!isEditing}
// 											isInvalid={errors.position && touched.position}
// 											placeholder={offerDetails.position}
// 											onChange={(e) => {
// 												setFieldValue('position', e.target.value);
// 											}}
// 										/>

// 										<CustomSelect
// 											label='Job Type'
// 											name='jobType'
// 											options={jobTypes}
// 											isReadOnly={!isEditing}
// 											isInvalid={errors.jobType && touched.jobType}
// 											placeholder={offerDetails.jobType}
// 											onChange={(e) => {
// 												setFieldValue('jobType', e.target.value);
// 											}}
// 										/>

// 										{values?.jobType !== 'Commission' && (
// 											<CustomInput
// 												label='Salary Amount'
// 												name='amount'
// 												type='number'
// 												placeholder={offerDetails.amount}
// 												isReadOnly={!isEditing}
// 												isInvalid={errors.amount && touched.amount}
// 												onChange={(e) => {
// 													setFieldValue('amount', e.target.value);
// 												}}
// 											/>
// 										)}
// 										{values.jobType !== 'Salary' && (
// 											<CustomInput
// 												label='Commission %'
// 												name='commission'
// 												min={0}
// 												max={100}
// 												type='number'
// 												step='any'
// 												placeholder={offerDetails.commission}
// 												isReadOnly={!isEditing}
// 												isInvalid={errors.commission && touched.commission}
// 												onChange={(e) => {
// 													setFieldValue('commission', e.target.value);
// 												}}
// 											/>
// 										)}

// 										<CustomInput
// 											label='Incentive (optional)'
// 											name='incentive'
// 											type='number'
// 											placeholder={offerDetails.incentive}
// 											isReadOnly={!isEditing}
// 											isInvalid={errors.incentive && touched.incentive}
// 											onChange={(e) => {
// 												setFieldValue('incentive', e.target.value);
// 											}}
// 										/>

// 										<FormControl isInvalid={errors?.joiningDate}>
// 											{!isEditing ? (
// 												interview?.doc?.joiningDate && (
// 													<>
// 														<FormLabel fontSize='sm'>Joining Date</FormLabel>
// 														<Field
// 															as={Input}
// 															bg='gray.100'
// 															borderColor='gray.300'
// 															fontSize='sm'
// 															py={1}
// 															value={formattedDate(interview?.doc?.joiningDate)}
// 															_focus={{ outline: 'none' }}
// 															isReadOnly={true}
// 														/>
// 													</>
// 												)
// 											) : (
// 												<Box position='relative' width='100%'>
// 													<FormLabel fontSize='sm'>Joining Date</FormLabel>
// 													<InputGroup>
// 														<Input
// 															value={
// 																selectedDate
// 																	? selectedDate.toLocaleDateString()
// 																	: ''
// 															}
// 															placeholder='Select a date'
// 															readOnly
// 															required
// 															bg='gray.100'
// 															borderColor={
// 																errors?.joiningDate ? 'red.500' : 'gray.300'
// 															}
// 															borderRadius='md'
// 															fontSize='sm'
// 															py={1}
// 															focusBorderColor={
// 																errors?.joiningDate ? 'red.500' : '#E0B960'
// 															}
// 															isReadOnly
// 														/>
// 														<InputRightElement>
// 															<FaRegCalendar
// 																size={16}
// 																cursor='pointer'
// 																onClick={toggleCalendar}
// 															/>
// 														</InputRightElement>
// 													</InputGroup>
// 													{showCalendar && (
// 														<Box
// 															position='absolute'
// 															top='50px'
// 															zIndex='10'
// 															bg='white'
// 															border='1px solid #e2e8f0'
// 															borderRadius='md'
// 															boxShadow='0px 4px 6px rgba(0, 0, 0, 0.1)'
// 														>
// 															<Calendar
// 																onChange={handleDateChange}
// 																value={selectedDate}
// 																// minDate={new Date()}
// 																className='custom-calendar'
// 															/>
// 														</Box>
// 													)}
// 												</Box>
// 											)}
// 											{errors?.joiningDate && (
// 												<Text color='red.500' fontSize='sm'>
// 													{errors?.joiningDate}
// 												</Text>
// 											)}
// 										</FormControl>

// <GridItem colSpan={{ base: 1, md: 2 }}>
// <EditableSelect
//   label="Location"
//   name="location"
//   value={values.location}
//   isInvalid={errors.location && touched.location}
//   placeholder="Select or enter location"
//   onChange={(e) => {
//     const selectedLocation = e.target.value;

//     setFieldValue('location', selectedLocation);

//     const selectedAgency = agenciesData.find(
//       (agency) => agency.location === selectedLocation
//     );

//     const locationLinkValue = selectedAgency?.locationLink || '';

//     setFieldValue('locationLink', locationLinkValue);

//     setOfferDetails((prev) => ({
//       ...prev,
//       location: selectedLocation,
//       locationLink: locationLinkValue,
//     }));
//   }}
//   options={
//     agenciesData.map((a) => ({
//       label: a.location,
//       value: a.location,
//     }))
//   }
// />
// </GridItem>

// 										<GridItem colSpan={{ base: 1, md: 2 }}>
// 											<CustomInput
// 												label='Instructions'
// 												name='instructions'
// 												type='textarea'
// 												isReadOnly={!isEditing}
// 												isInvalid={errors.instructions && touched.instructions}
// 												placeholder={offerDetails.instructions}
// 												onChange={(e) => {
// 													setFieldValue('instructions', e.target.value);
// 												}}
// 											/>
// 										</GridItem>

// 										<GridItem colSpan={{ base: 1, md: 2 }}>
// 											<FormLabel fontSize='sm'>Remarks</FormLabel>
// 											<Box
// 												border='none'
// 												outline='none'
// 												bg='#F2F2F2'
// 												p='3'
// 												fontSize='sm'
// 												rounded='md'
// 												shadow='sm'
// 											>
// 												{offerDetails?.remarks}
// 											</Box>
// 										</GridItem>
// 									</Grid>

// 									<OfferLetterEditor
// 										onSend={onSubmitOffer}
// 										offerDetails={values}
// 										emailBody={emailBody}
// 										interview={interview?.doc}
// 										setEmailBody={setEmailBody}
// 										setOfferDetails={setOfferDetails}
// 									/>
// 									<Flex justifyContent='flex-end'>
// 										<Button
// 											{...buttonStyle}
// 											colorScheme='brand'
// 											isLoading={sendingOffer}
// 											// isDisabled={!isEditing}
// 											type='submit'
// 											py='3'
// 											px='6'
// 										>
// 											{interview?.doc?.isOffer
// 												? 'Resend Offer'
// 												: 'Submit Offer'}
// 										</Button>
// 									</Flex>
// 								</Form>
// 							);
// 						}}
// 					</Formik>
// 				</Box>
// 			</Box>
// 		</Box>
// 	) : (
// 		<Text>Offer details not found!</Text>
// 	);
// };

// export default OfferLetter;


import { Formik, Form, Field } from 'formik';
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
import 'react-calendar/dist/Calendar.css';
import { useCreateItemMutation, useFetchItemsQuery } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Loader from 'components/loading/Loader';
import { IoArrowBack } from 'react-icons/io5';
import CustomSelect from 'components/shared/CustomSelect';
import CustomInput from 'components/shared/CustomInput';
import { formattedDate } from 'utils/helpers';
import OfferLetterEditor from './OfferLetterEditor';
import { jobTypes } from 'utils/options';
import { toUTCString } from 'utils/helpers';
import { buttonStyle } from 'utils/btn';
import EditableSelect from 'components/shared/EditableSelect';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';

// Validation schema for the form
const validationSchema = Yup.object().shape({
	jobType: Yup.string().required('Job type is required'),
	location: Yup.string()
		.nullable()
		.min(1, 'Location is required')
		.required('Location is required'),
	position: Yup.string().required('Position is required'),
	locationLink: Yup.string().nullable(),
	amount: Yup.number().when('jobType', {
		is: (jobType) => ['SalaryPlusCommission'].includes(jobType),
		then: (schema) =>
			schema
				.nullable()
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
	joiningDate: Yup.date().required('Joining date is required'),
});

const OfferLetter = () => {
	const [offerDetails, setOfferDetails] = useState({});
	const [emailBody, setEmailBody] = useState('');
	const { id: interviewId } = useParams();
	const [selectedDate, setSelectedDate] = useState(null);
	const [showCalendar, setShowCalendar] = useState(false);
	const [agenciesData, setAgenciesData] = useState([]);
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

	const { data: agencies, isLoading: agencyLoading } = useFetchItemsQuery(
		{
			path: `/agencies`,
		},
		{ refetchOnMountOrArgChange: true }
	);

	// Process agencies data
	useEffect(() => {
		if (agencies?.doc) {
			const processedAgencies = agencies.doc.map(agency => ({
				location: agency.location,
				locationLink: agency.locationLink || ''
			}));
			console.log('🔍 LOCATION_DEBUG - Processed Agencies:', processedAgencies);
			setAgenciesData(processedAgencies);
		}
	}, [agencies]);

	// Initialize form data when interview data is loaded
	useEffect(() => {
		console.log('🔍 LOCATION_DEBUG - Interview Data:', interview?.doc);
		console.log('🔍 LOCATION_DEBUG - Agencies Data Length:', agenciesData.length);
		
		if (interview?.doc && agenciesData.length > 0) {
			const data = interview.doc;
			console.log('🔍 LOCATION_DEBUG - Interview Location from API:', data.location);
			
			// Find matching agency
			const matchedAgency = agenciesData.find(
				agency => agency.location === data.location
			);
			console.log('🔍 LOCATION_DEBUG - Matched Agency:', matchedAgency);
			
			// Set joining date
			const joiningDate = data.joiningDate ? new Date(data.joiningDate) : new Date();
			setSelectedDate(joiningDate);
			
			const newOfferDetails = {
				remarks: data.remarks || '',
				leadInterviewerName: data.leadInterviewer?.fullName || '',
				candidateName: data.candidate?.name || '',
				jobType: data.jobType || '',
				location: matchedAgency?.location || data.location || '',
				locationLink: matchedAgency?.locationLink || data.locationLink || '',
				position: data.position || '',
				amount: data?.amount || 0,
				incentive: data?.incentive || '',
				commission: data?.commission || '',
				instructions: data?.instructions || '',
				joiningDate: joiningDate,
				offerMail: data.offerMail || '',
			};
			
			console.log('🔍 LOCATION_DEBUG - New Offer Details Location:', newOfferDetails.location);
			console.log('🔍 LOCATION_DEBUG - New Offer Details LocationLink:', newOfferDetails.locationLink);
			
			setOfferDetails(newOfferDetails);

			// Set editing mode
			if (offerType) {
				setIsEditing(offerType === 'edit' || !data?.isOffer);
			}
		}
	}, [interview, agenciesData, offerType]);

	const [createItemMutation, { isLoading: sendingOffer }] = useCreateItemMutation();
	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();
	const navigate = useNavigate();

	const toggleCalendar = () => setShowCalendar(!showCalendar);

	const handleDateChange = (date) => {
		setSelectedDate(date);
		setShowCalendar(false);
		setOfferDetails((prevDetails) => ({
			...prevDetails,
			joiningDate: date,
		}));
	};

	const onSubmitOffer = async (data) => {
		console.log('🔍 LOCATION_DEBUG - Submit Offer Data Location:', data.location);
		console.log('🔍 LOCATION_DEBUG - Submit Offer Data LocationLink:', data.locationLink);
		
		if (!selectedDate) {
			toast.error('Joining date is required');
			return;
		}

		const offerData = {
			...data,
			joiningDate: toUTCString(selectedDate),
			leadInterviewerName: offerDetails?.leadInterviewerName,
			emailBody,
			interviewId,
		};

		try {
			await createItemMutation({
				path: `/hiring/send-offer/${interview?.doc?.candidate?._id}`,
				body: offerData,
			}).unwrap();
			
			toast.success('Offer sent successfully');
			setOfferDetails(offerData);
			setIsEditing(false);
			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Hiring',
				entityType: 'Interview',
				entityId: interviewId,
				status: 'success',
				message: `Offer sent to ${interview?.doc?.candidate?.name} by ${user?.fullName}.`,
			});
			navigate('/hiring/interviewed-candidates');
		} catch (error) {
			const errorMsg = error?.data?.message || 'Failed to send offer';
			toast.error(errorMsg);
			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Hiring',
				entityType: 'Interview',
				entityId: interviewId,
				status: error?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		}
	};

	// Handle location change
	const handleLocationChange = (setFieldValue, selectedLocation) => {
		console.log('🔍 LOCATION_DEBUG - Location Changed to:', selectedLocation);
		
		const selectedAgency = agenciesData.find(
			agency => agency.location === selectedLocation
		);
		console.log('🔍 LOCATION_DEBUG - Selected Agency:', selectedAgency);
		
		const locationLinkValue = selectedAgency?.locationLink || '';
		console.log('🔍 LOCATION_DEBUG - Location Link Value:', locationLinkValue);
		
		setFieldValue('location', selectedLocation);
		setFieldValue('locationLink', locationLinkValue);
		
		setOfferDetails((prev) => ({
			...prev,
			location: selectedLocation,
			locationLink: locationLinkValue,
		}));
	};

	if (isLoading || positionsLoading || agencyLoading) {
		return <Loader />;
	}

	if (!offerDetails || !interview?.doc) {
		return <Text>Offer details not found!</Text>;
	}

	return (
		<Box>
			<Button
				colorScheme='gray'
				borderRadius='5px'
				size={{ base: 'sm', md: 'md' }}
				px={{ base: 4, md: 6 }}
				py={{ base: 2, md: 3 }}
				fontSize={{ base: 'sm', md: 'md' }}
				leftIcon={<IoArrowBack />}
				onClick={() => navigate(-1)}
				mb={4}
			>
				Back
			</Button>
			
			<Box bg='white' p={8} mb={4} rounded='md' shadow='sm'>
				<Flex justifyContent='space-between' alignItems='center' mb={4}>
					<Heading>Offer Letter</Heading>
					{interview?.doc?.isOffer && (
						<Tooltip label={isEditing ? 'Stop Editing' : 'Edit Offer'}>
							<IconButton
								icon={<FaEdit />}
								onClick={() => setIsEditing(!isEditing)}
								aria-label='Edit Offer Details'
								colorScheme={isEditing ? 'brand' : 'gray'}
								borderRadius='10px'
							/>
						</Tooltip>
					)}
				</Flex>
				
				<Box>
					<Formik
						enableReinitialize
						initialValues={offerDetails}
						validationSchema={validationSchema}
						onSubmit={onSubmitOffer}
					>
						{({ handleSubmit, setFieldValue, errors, touched, values }) => {
							console.log('🔍 LOCATION_DEBUG - Formik Current Values:', values);
							console.log('🔍 LOCATION_DEBUG - Formik Values Location:', values.location);
							
							return (
								<Form onSubmit={handleSubmit}>
									<Grid
										templateColumns={{
											base: '1fr',
											md: 'repeat(2, 1fr)',
										}}
										gap={3}
										w='full'
										p={{ base: 2, md: 4 }}
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
											}}
										/>
									)}
									
									{values.jobType !== 'Salary' && (
										<CustomInput
											label='Commission %'
											name='commission'
											min={0}
											max={100}
											type='number'
											step='any'
											placeholder={offerDetails.commission}
											isReadOnly={!isEditing}
											isInvalid={errors.commission && touched.commission}
											onChange={(e) => {
												setFieldValue('commission', e.target.value);
											}}
										/>
									)}

									<CustomInput
										label='Incentive (optional)'
										name='incentive'
										type='number'
										placeholder={offerDetails.incentive}
										isReadOnly={!isEditing}
										isInvalid={errors.incentive && touched.incentive}
										onChange={(e) => {
											setFieldValue('incentive', e.target.value);
										}}
									/>

									<FormControl isInvalid={errors?.joiningDate}>
										{!isEditing ? (
											interview?.doc?.joiningDate && (
												<>
													<FormLabel fontSize='sm'>Joining Date</FormLabel>
													<Field
														as={Input}
														bg='gray.100'
														borderColor='gray.300'
														fontSize='sm'
														py={1}
														value={formattedDate(interview?.doc?.joiningDate)}
														_focus={{ outline: 'none' }}
														isReadOnly={true}
													/>
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

									<GridItem colSpan={{ base: 1, md: 2 }}>
									<EditableSelect
  label="Location"
  name="location"
  defaultValue={values.location || ''}
  isInvalid={errors.location && touched.location}
  placeholder="Select or enter location"
  isReadOnly={!isEditing}
  onChange={(e) => {
    console.log('🔍 LOCATION_DEBUG - EditableSelect onChange Event:', e.target.value);
    handleLocationChange(setFieldValue, e.target.value);
  }}
  options={
    agenciesData.map((a) => ({
      label: a.location,
      value: a.location,
    }))
  }
/>
									</GridItem>

									<GridItem colSpan={{ base: 1, md: 2 }}>
										<CustomInput
											label='Instructions'
											name='instructions'
											type='textarea'
											isReadOnly={!isEditing}
											isInvalid={errors.instructions && touched.instructions}
											placeholder={offerDetails.instructions}
											onChange={(e) => {
												setFieldValue('instructions', e.target.value);
											}}
										/>
									</GridItem>

									<GridItem colSpan={{ base: 1, md: 2 }}>
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
									offerDetails={values}
									emailBody={emailBody}
									interview={interview?.doc}
									setEmailBody={setEmailBody}
									setOfferDetails={setOfferDetails}
								/>
								
								<Flex justifyContent='flex-end'>
									<Button
										{...buttonStyle}
										colorScheme='brand'
										isLoading={sendingOffer}
										type='submit'
										py='3'
										px='6'
									>
										{interview?.doc?.isOffer
											? 'Resend Offer'
											: 'Submit Offer'}
									</Button>
								</Flex>
							</Form>
						);
					}}
					</Formik>
				</Box>
			</Box>
		</Box>
	);
};

export default OfferLetter;