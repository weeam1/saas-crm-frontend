import { useCreateItemMutation } from 'api/apiSlice';

import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
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
	useToast,
	FormErrorMessage,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaRegCalendar } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { jobRoles, jobTypes } from '../helpers';
import DisplayField from 'components/displays/DisplayField';
import { useNavigate, useParams } from 'react-router-dom';

const validationSchema = Yup.object().shape({
	jobType: Yup.string().required('Job type is required'),
	location: Yup.string().required('Location is required'),
	position: Yup.string().required('Position is required'),
	amount: Yup.number()
		.required('Amount is required')
		.positive('Must be a positive number'),
	joiningDate: Yup.date().required('Joining date is required'),
});

const OfferView = ({ isOpen, onClose, offerDetails, setOfferDetails }) => {
	const {
		remarks,
		candidateId,
		jobType,
		location,
		position,
		amount,
		joiningDate,
		leadInterviewerName,
	} = offerDetails;

	const params = useParams();

	const { interviewId } = params || {};

	console.log(interviewId);

	const navigate = useNavigate();

	const [createItemMutation, { isLoading: sendingOffer }] =
		useCreateItemMutation();
	const toast = useToast();

	const [selectedDate, setSelectedDate] = useState(
		offerDetails.joiningDate ? new Date(offerDetails.joiningDate) : null
	);
	const [showCalendar, setShowCalendar] = useState(false);

	const toggleCalendar = () => setShowCalendar(!showCalendar);

	if (!interviewId) {
		return navigate('/default');
	}

	const handleDateChange = (date) => {
		setSelectedDate(date);
		setShowCalendar(false);
	};

	const onSubmitOffer = async (data) => {
		data.joiningDate = selectedDate;

		try {
			await createItemMutation({
				path: `/hiring/send-offer/${interviewId}/candidate/${candidateId}/`,
				body: data,
			}).unwrap();

			toast.success('Offer sent successfully');
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to send offer');
		} finally {
			setOfferDetails(data);
			onClose();
		}
	};

	const handleFieldChange = (fieldName, value) => {
		setOfferDetails((prev) => ({
			...prev,
			[fieldName]: value,
		}));
	};

	const offerMessage = `
    Hello ${offerDetails.candidateName},

    We are delighted to offer you the position of ${position} at WEAM ELNAGGAR. 
    We believe your skills and experience will be a valuable addition to our team.

    Offer Details:
    Job Role: ${position}
    Job Type: ${jobType}
    Reporting To: ${leadInterviewerName || 'N/A'}
    Salary: ${amount}
    Joining Date: ${joiningDate}
    Location: ${location}

    If you have any questions, feel free to reach out.
    Looking forward to welcoming you to our team!

    Best Regards,
    WEAM ELNAGGAR HR Team
  `;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='4xl'
			isCentered
			scrollBehavior='smooth'
		>
			<ModalOverlay />
			<ModalContent
				width='100%'
				maxH='700px'
				overflowY='auto'
				sx={{
					'&::-webkit-scrollbar': {
						width: '6px',
					},
					'&::-webkit-scrollbar-thumb': {
						background: 'brand.500',
						borderRadius: '8px',
					},
					'&::-webkit-scrollbar-thumb:hover': {
						background: 'brand.600',
					},
				}}
			>
				<ModalHeader>Offer Details</ModalHeader>
				<ModalBody>
					<DisplayField label='Remakrs' value={remarks} />
					<Formik
						initialValues={{
							jobType: offerDetails.jobType || '',
							location: offerDetails.location || '',
							position: offerDetails.position || '',
							amount: offerDetails.amount || '',
							joiningDate: offerDetails.joiningDate || '',
						}}
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
									<FormControl isInvalid={errors.position && touched.position}>
										<FormLabel fontSize='sm'>Position</FormLabel>
										<Field
											as={Select}
											name='position'
											bg='gray.100'
											borderColor='gray.300'
											fontSize='sm'
											py={1}
											_focus={{
												borderColor: '#D99A36',
												boxShadow: '0 0 0 1px #D99A36',
											}}
											onChange={(e) => {
												setFieldValue('position', e.target.value);
												handleFieldChange('position', e.target.value);
											}}
										>
											{jobRoles.map((role) => (
												<option key={role.value} value={role.value}>
													{role.label}
												</option>
											))}
										</Field>
										<FormErrorMessage>{errors.position}</FormErrorMessage>
									</FormControl>

									<FormControl isInvalid={errors.jobType && touched.jobType}>
										<FormLabel fontSize='sm'>Job Type</FormLabel>
										<Field
											as={Select}
											name='jobType'
											bg='gray.100'
											borderColor='gray.300'
											fontSize='sm'
											py={1}
											_focus={{
												borderColor: '#D99A36',
												boxShadow: '0 0 0 1px #D99A36',
											}}
											onChange={(e) => {
												setFieldValue('jobType', e.target.value);
												handleFieldChange('jobType', e.target.value);
											}}
										>
											{jobTypes.map((type) => (
												<option key={type.value} value={type.value}>
													{type.label}
												</option>
											))}
										</Field>
										<FormErrorMessage>{errors.jobType}</FormErrorMessage>
									</FormControl>

									<FormControl isInvalid={errors.amount && touched.amount}>
										<FormLabel fontSize='sm'>Salary Amount</FormLabel>
										<Field
											as={Input}
											type='number'
											name='amount'
											placeholder='Enter Amount'
											bg='gray.100'
											borderColor='gray.300'
											fontSize='sm'
											py={1}
											_focus={{
												borderColor: '#D99A36',
												boxShadow: '0 0 0 1px #D99A36',
											}}
											onChange={(e) => {
												setFieldValue('amount', e.target.value);
												handleFieldChange('amount', e.target.value);
											}}
										/>
										<FormErrorMessage>{errors.amount}</FormErrorMessage>
									</FormControl>

									<FormControl mb={4} isInvalid={errors?.selectedDate}>
										<FormLabel fontSize='sm'>Select Date</FormLabel>
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
														errors?.selectedDate ? 'red.500' : 'gray.300'
													}
													borderRadius='md'
													fontSize='sm'
													py={1}
													focusBorderColor={
														errors?.selectedDate ? 'red.500' : '#E0B960'
													}
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
										{errors?.selectedDate && (
											<Text color='red.500' fontSize='sm'>
												{errors?.selectedDate}
											</Text>
										)}
									</FormControl>
								</Grid>

								<FormControl isInvalid={errors.location && touched.location}>
									<FormLabel fontSize='sm'>Location</FormLabel>
									<Field
										as={Input}
										name='location'
										bg='gray.100'
										borderColor='gray.300'
										fontSize='sm'
										py={1}
										_focus={{
											borderColor: '#D99A36',
											boxShadow: '0 0 0 1px #D99A36',
										}}
										placeholder='Enter Location'
										onChange={(e) => {
											setFieldValue('location', e.target.value);
											handleFieldChange('location', e.target.value);
										}}
									/>
									<FormErrorMessage>{errors.location}</FormErrorMessage>
								</FormControl>

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

								<ModalFooter>
									<Button
										colorScheme='gray'
										onClick={onClose}
										variant='outline'
										size='sm'
										mr={2}
									>
										Cancel
									</Button>
									<Button
										bg='brand.500'
										color='white'
										_hover={{
											bg: 'brand.600',
											color: 'white',
										}}
										_active={{
											bg: 'brand.600',
										}}
										size='sm'
										type='submit'
									>
										{sendingOffer ? <Spinner /> : 'Submit Offer'}
									</Button>
								</ModalFooter>
							</Form>
						)}
					</Formik>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default OfferView;
