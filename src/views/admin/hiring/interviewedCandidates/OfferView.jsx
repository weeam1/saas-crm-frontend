import { Formik, Form, Field } from 'formik';
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
	Spinner,
	Grid,
	Select,
	FormErrorMessage,
	Box,
	Text,
	GridItem,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { jobRoles, jobTypes } from '../helpers';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useCreateItemMutation } from 'api/apiSlice';

const validationSchema = Yup.object().shape({
	position: Yup.string().required('Job position is required'),
	jobType: Yup.string().required('Job type is required'),
	amount: Yup.number()
		.typeError('Amount must be a number')
		.required('Amount is required')
		.min(1, 'Amount must be at least 1'),
	location: Yup.string().required('Location is required'),
	joiningDate: Yup.date().required('Joining date is required').nullable(),
});

// const OfferView = ({ isOpen, onClose, offerDetails, setOfferDetails }) => {
// 	const {
// 		jobType,
// 		location,
// 		position,
// 		amount,
// 		joiningDate,
// 		leadInterviewerName,
// 	} = offerDetails;

// 	const onSubmitOffer = async (data) => {
// 		console.log(data);
// 	};

// 	useEffect(() => {
// 		// Update offerDetails when the values change
// 		setOfferDetails((prev) => ({
// 			...prev,
// 			jobType,
// 			location,
// 			position,
// 			amount,
// 			joiningDate,
// 		}));

// 		console.log({ offerDetails });
// 	}, [jobType, location, position, amount, joiningDate, setOfferDetails]);

// 	const offerMessage = `
//         Hello ${offerDetails.candidateName},

//         We are delighted to offer you the position of ${position} at WEAM ELNAGGAR.
//         We believe your skills and experience will be a valuable addition to our team.

//         Offer Details:
//         Job Role: ${position}
//         Job Type: ${jobType}
//         Location: ${location}
//         Joining Date: ${joiningDate}
//         Reporting To: ${leadInterviewerName || 'N/A'}
//         Salary: ${amount} per month

//         If you have any questions, feel free to reach out.
//         Looking forward to welcoming you to our team!

//         Best Regards,
//         WEAM ELNAGGAR HR Team
//     `;

// 	return (
// 		<Modal isOpen={isOpen} onClose={onClose} size='3xl' isCentered>
// 			<ModalOverlay />
// 			<ModalContent>
// 				<ModalHeader>Offer Details</ModalHeader>
// 				<ModalBody>
// 					{/* Offer Message Display */}
// 					<Box
// 						width='full'
// 						maxHeight='400px'
// 						overflowY='auto'
// 						borderWidth='1px'
// 						borderColor='gray.300'
// 						borderRadius='md'
// 						p={4}
// 						bg='white'
// 					>
// 						<Text whiteSpace='pre-line'>{offerMessage}</Text>
// 					</Box>
// 					<Formik
// 						initialValues={{
// 							jobType: offerDetails.jobType || '',
// 							location: offerDetails.location || '',
// 							position: offerDetails.position || '',
// 							amount: offerDetails.amount || '',
// 							joiningDate: offerDetails.joiningDate || '',
// 						}}
// 						validationSchema={validationSchema}
// 						onSubmit={(values) => {
// 							setOfferDetails(values);
// 							onSubmitOffer(values);
// 						}}
// 					>
// 						{({ handleSubmit, errors, touched }) => (
// 							<Form onSubmit={handleSubmit}>
// 								<Grid
// 									templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
// 									gap={3}
// 									w='full'
// 								>
// 									{/* Job Role */}
// 									<FormControl isInvalid={errors.position && touched.position}>
// 										<FormLabel fontSize='sm'>Position</FormLabel>
// 										<Field
// 											as={Select}
// 											name='position'
// 											bg='gray.100'
// 											borderColor='gray.300'
// 											_focus={{
// 												borderColor: '#D99A36',
// 												boxShadow: '0 0 0 1px #D99A36',
// 											}}
// 										>
// 											{jobRoles.map((role) => (
// 												<option key={role.value} value={role.value}>
// 													{role.label}
// 												</option>
// 											))}
// 										</Field>
// 										<FormErrorMessage>{errors.position}</FormErrorMessage>
// 									</FormControl>

// 									{/* Job Type */}
// 									<FormControl isInvalid={errors.jobType && touched.jobType}>
// 										<FormLabel fontSize='sm'>Job Type</FormLabel>
// 										<Field
// 											as={Select}
// 											name='jobType'
// 											bg='gray.100'
// 											borderColor='gray.300'
// 											_focus={{
// 												borderColor: '#D99A36',
// 												boxShadow: '0 0 0 1px #D99A36',
// 											}}
// 										>
// 											{jobTypes.map((type) => (
// 												<option key={type.value} value={type.value}>
// 													{type.label}
// 												</option>
// 											))}
// 										</Field>
// 										<FormErrorMessage>{errors.jobType}</FormErrorMessage>
// 									</FormControl>

// 									{/* Amount */}
// 									<FormControl isInvalid={errors.amount && touched.amount}>
// 										<FormLabel fontSize='sm'>Salary Amount</FormLabel>
// 										<Field
// 											as={Input}
// 											type='number'
// 											name='amount'
// 											placeholder='Enter Amount'
// 											bg='gray.100'
// 											borderColor='gray.300'
// 											_focus={{
// 												borderColor: '#D99A36',
// 												boxShadow: '0 0 0 1px #D99A36',
// 											}}
// 										/>
// 										<FormErrorMessage>{errors.amount}</FormErrorMessage>
// 									</FormControl>

// 									{/* Location */}
// 									<FormControl isInvalid={errors.location && touched.location}>
// 										<FormLabel fontSize='sm'>Location</FormLabel>
// 										<Field
// 											as={Input}
// 											name='location'
// 											placeholder='Enter Location'
// 											bg='gray.100'
// 											borderColor='gray.300'
// 											_focus={{
// 												borderColor: '#D99A36',
// 												boxShadow: '0 0 0 1px #D99A36',
// 											}}
// 										/>
// 										<FormErrorMessage>{errors.location}</FormErrorMessage>
// 									</FormControl>

// 									{/* Joining Date */}
// 									<FormControl
// 										isInvalid={errors.joiningDate && touched.joiningDate}
// 									>
// 										<FormLabel fontSize='sm'>Joining Date</FormLabel>
// 										<Field
// 											as={Input}
// 											type='date'
// 											name='joiningDate'
// 											placeholder='Select Joining Date'
// 											bg='gray.100'
// 											borderColor='gray.300'
// 											_focus={{
// 												borderColor: '#D99A36',
// 												boxShadow: '0 0 0 1px #D99A36',
// 											}}
// 										/>
// 										<FormErrorMessage>{errors.joiningDate}</FormErrorMessage>
// 									</FormControl>
// 								</Grid>

// 								<ModalFooter>
// 									<Button
// 										colorScheme='gray'
// 										onClick={onClose}
// 										variant='outline'
// 										size='sm'
// 										mr={2}
// 									>
// 										Cancel
// 									</Button>
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
// 										type='submit'
// 									>
// 										{/* Uncomment this when loading state is implemented */}
// 										{/* {isLoading ? <Spinner /> : 'Submit Offer'} */}
// 										Submit Offer
// 									</Button>
// 								</ModalFooter>
// 							</Form>
// 						)}
// 					</Formik>
// 				</ModalBody>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

// const OfferView = ({ isOpen, onClose, offerDetails, setOfferDetails }) => {
// 	const {
// 		jobType,
// 		location,
// 		position,
// 		amount,
// 		joiningDate,
// 		leadInterviewerName,
// 	} = offerDetails;

// 	const onSubmitOffer = async (data) => {
// 		console.log(data);
// 	};

// 	useEffect(() => {
// 		// Update offerDetails when the values change
// 		setOfferDetails((prev) => ({
// 			...prev,
// 			jobType,
// 			location,
// 			position,
// 			amount,
// 			joiningDate,
// 		}));
// 	}, [jobType, location, position, amount, joiningDate, setOfferDetails]);

// 	// Create offerMessage using useMemo to recalculate when offerDetails change
// 	let offerMessage = useMemo(() => {
// 		return `
//         Hello ${offerDetails.candidateName || 'Candidate'},

//         We are delighted to offer you the position of ${position} at WEAM ELNAGGAR.
//         We believe your skills and experience will be a valuable addition to our team.

//         Offer Details:
//         Job Role: ${position}
//         Job Type: ${jobType}
//         Location: ${location}
//         Joining Date: ${joiningDate}
//         Reporting To: ${leadInterviewerName || 'N/A'}
//         Salary: ${amount} per month

//         If you have any questions, feel free to reach out.
//         Looking forward to welcoming you to our team!

//         Best Regards,
//         WEAM ELNAGGAR HR Team
//         `;
// 	}, [
// 		amount,
// 		jobType,
// 		joiningDate,
// 		leadInterviewerName,
// 		location,
// 		offerDetails.candidateName,
// 		position,
// 	]);

// 	return (
// 		<Modal isOpen={isOpen} onClose={onClose} size='3xl' isCentered>
// 			<ModalOverlay />
// 			<ModalContent>
// 				<ModalHeader>Offer Details</ModalHeader>
// 				<ModalBody>
// 					{/* Offer Message Display */}
// 					<Box
// 						width='full'
// 						maxHeight='400px'
// 						overflowY='auto'
// 						borderWidth='1px'
// 						borderColor='gray.300'
// 						borderRadius='md'
// 						p={4}
// 						bg='white'
// 					>
// 						<Text whiteSpace='pre-line'>{offerMessage}</Text>
// 					</Box>
// 					<Formik
// 						initialValues={{
// 							jobType: offerDetails.jobType || '',
// 							location: offerDetails.location || '',
// 							position: offerDetails.position || '',
// 							amount: offerDetails.amount || '',
// 							joiningDate: offerDetails.joiningDate || '',
// 						}}
// 						validationSchema={validationSchema}
// 						onSubmit={(values) => {
// 							setOfferDetails(values);
// 							onSubmitOffer(values);
// 						}}
// 					>
// 						{({ handleSubmit, errors, touched }) => (
// 							<Form onSubmit={handleSubmit}>
// 								<Grid
// 									templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
// 									gap={3}
// 									w='full'
// 								>
// 									{/* Job Role */}
// 									<FormControl isInvalid={errors.position && touched.position}>
// 										<FormLabel fontSize='sm'>Position</FormLabel>
// 										<Field
// 											as={Select}
// 											name='position'
// 											bg='gray.100'
// 											borderColor='gray.300'
// 											_focus={{
// 												borderColor: '#D99A36',
// 												boxShadow: '0 0 0 1px #D99A36',
// 											}}
// 										>
// 											{jobRoles.map((role) => (
// 												<option key={role.value} value={role.value}>
// 													{role.label}
// 												</option>
// 											))}
// 										</Field>
// 										<FormErrorMessage>{errors.position}</FormErrorMessage>
// 									</FormControl>

// 									{/* Job Type */}
// 									<FormControl isInvalid={errors.jobType && touched.jobType}>
// 										<FormLabel fontSize='sm'>Job Type</FormLabel>
// 										<Field
// 											as={Select}
// 											name='jobType'
// 											bg='gray.100'
// 											borderColor='gray.300'
// 											_focus={{
// 												borderColor: '#D99A36',
// 												boxShadow: '0 0 0 1px #D99A36',
// 											}}
// 										>
// 											{jobTypes.map((type) => (
// 												<option key={type.value} value={type.value}>
// 													{type.label}
// 												</option>
// 											))}
// 										</Field>
// 										<FormErrorMessage>{errors.jobType}</FormErrorMessage>
// 									</FormControl>

// 									{/* Amount */}
// 									<FormControl isInvalid={errors.amount && touched.amount}>
// 										<FormLabel fontSize='sm'>Salary Amount</FormLabel>
// 										<Field
// 											as={Input}
// 											type='number'
// 											name='amount'
// 											placeholder='Enter Amount'
// 											bg='gray.100'
// 											borderColor='gray.300'
// 											_focus={{
// 												borderColor: '#D99A36',
// 												boxShadow: '0 0 0 1px #D99A36',
// 											}}
// 										/>
// 										<FormErrorMessage>{errors.amount}</FormErrorMessage>
// 									</FormControl>

// 									{/* Location */}
// 									<FormControl isInvalid={errors.location && touched.location}>
// 										<FormLabel fontSize='sm'>Location</FormLabel>
// 										<Field
// 											as={Input}
// 											name='location'
// 											placeholder='Enter Location'
// 											bg='gray.100'
// 											borderColor='gray.300'
// 											_focus={{
// 												borderColor: '#D99A36',
// 												boxShadow: '0 0 0 1px #D99A36',
// 											}}
// 										/>
// 										<FormErrorMessage>{errors.location}</FormErrorMessage>
// 									</FormControl>

// 									{/* Joining Date */}
// 									<FormControl
// 										isInvalid={errors.joiningDate && touched.joiningDate}
// 									>
// 										<FormLabel fontSize='sm'>Joining Date</FormLabel>
// 										<Field
// 											as={Input}
// 											type='date'
// 											name='joiningDate'
// 											placeholder='Select Joining Date'
// 											bg='gray.100'
// 											borderColor='gray.300'
// 											_focus={{
// 												borderColor: '#D99A36',
// 												boxShadow: '0 0 0 1px #D99A36',
// 											}}
// 										/>
// 										<FormErrorMessage>{errors.joiningDate}</FormErrorMessage>
// 									</FormControl>
// 								</Grid>

// 								<ModalFooter>
// 									<Button
// 										colorScheme='gray'
// 										onClick={onClose}
// 										variant='outline'
// 										size='sm'
// 										mr={2}
// 									>
// 										Cancel
// 									</Button>
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
// 										type='submit'
// 									>
// 										Submit Offer
// 									</Button>
// 								</ModalFooter>
// 							</Form>
// 						)}
// 					</Formik>
// 				</ModalBody>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

const OfferView = ({ isOpen, onClose, offerDetails, setOfferDetails }) => {
	const {
		candidateId,
		jobType,
		location,
		position,
		amount,
		joiningDate,
		leadInterviewerName,
	} = offerDetails;

	const [createItemMutation, { isLoading: sendingOffer }] =
		useCreateItemMutation();

	const onSubmitOffer = async (data) => {
		console.log(data);
		try {
			await createItemMutation({
				path: `/hiring/send-offer/${candidateId}`,
				body: data,
			}).unwrap();

			toast.success('Offer send successfully');
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to update interview data');
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
				maxH='600px' // Set max height for the modal body
				overflowY='auto' // Enable vertical scrolling when content exceeds max height
				sx={{
					'&::-webkit-scrollbar': {
						width: '6px', // Custom scrollbar width
					},
					'&::-webkit-scrollbar-thumb': {
						background: 'brand.500', // Custom brand color (adjust according to your theme)
						borderRadius: '8px',
					},
					'&::-webkit-scrollbar-thumb:hover': {
						background: 'brand.600', // Slightly darker on hover
					},
				}}
			>
				<ModalHeader>Offer Details</ModalHeader>
				<ModalBody>
					{/* Offer Message Display */}
					<Box
						width='full'
						maxHeight='300px'
						overflowY='auto'
						borderWidth='1px'
						borderColor='gray.300'
						borderRadius='md'
						p={4}
						mb='4'
						bg='softGray.100'
					>
						<Text whiteSpace='pre-line' fontSize='sm'>
							{offerMessage}
						</Text>
					</Box>
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
								>
									{/* Position */}
									<FormControl isInvalid={errors.position && touched.position}>
										<FormLabel fontSize='sm'>Position</FormLabel>
										<Field
											as={Select}
											name='position'
											bg='gray.100'
											borderColor='gray.300'
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

									{/* Job Type */}
									<FormControl isInvalid={errors.jobType && touched.jobType}>
										<FormLabel fontSize='sm'>Job Type</FormLabel>
										<Field
											as={Select}
											name='jobType'
											bg='gray.100'
											borderColor='gray.300'
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

									{/* Amount */}
									<FormControl isInvalid={errors.amount && touched.amount}>
										<FormLabel fontSize='sm'>Salary Amount</FormLabel>
										<Field
											as={Input}
											type='number'
											name='amount'
											placeholder='Enter Amount'
											bg='gray.100'
											borderColor='gray.300'
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

									{/* Joining Date */}
									<FormControl
										isInvalid={errors.joiningDate && touched.joiningDate}
									>
										<FormLabel fontSize='sm'>Joining Date</FormLabel>
										<Field
											as={Input}
											type='date'
											name='joiningDate'
											bg='gray.100'
											borderColor='gray.300'
											_focus={{
												borderColor: '#D99A36',
												boxShadow: '0 0 0 1px #D99A36',
											}}
											onChange={(e) => {
												setFieldValue('joiningDate', e.target.value);
												handleFieldChange('joiningDate', e.target.value);
											}}
										/>
										<FormErrorMessage>{errors.joiningDate}</FormErrorMessage>
									</FormControl>
								</Grid>

								{/* Location */}
								<FormControl isInvalid={errors.location && touched.location}>
									<FormLabel fontSize='sm'>Location</FormLabel>
									<Field
										as={Input}
										name='location'
										bg='gray.100'
										borderColor='gray.300'
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
										// onClick={onSubmitOffer}
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
