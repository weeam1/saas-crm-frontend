import {
	Button,
	FormLabel,
	Grid,
	GridItem,
	HStack,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Text,
	Textarea,
	VStack,
} from '@chakra-ui/react';
import DisplayField from 'components/displays/DisplayField';
import Loader from 'components/loading/Loader';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { BsFillSendFill } from 'react-icons/bs';
import { emailSchema } from 'schema';
import { getApi, postApi } from 'services/api';

// const AddEmailHistory = (props) => {
// 	const { onClose, isOpen, fetchData, leadDetails, setAction } = props;
// 	const user = JSON.parse(localStorage.getItem('user'));
// 	const [isLoding, setIsLoding] = useState(false);
// 	const [contactModelOpen, setContactModel] = useState(false);
// 	const [leadModelOpen, setLeadModel] = useState(false);

// 	console.log({ leadDetails });

// 	const initialValues = {
// 		sender: user?._id,
// 		recipient: '',
// 		subject: '',
// 		message: '',
// 		createBy: '',
// 		createByLead: '',
// 		startDate: '',
// 		endDate: '',
// 	};
// 	const formik = useFormik({
// 		initialValues: initialValues,
// 		validationSchema: emailSchema,
// 		onSubmit: (values, { resetForm }) => {
// 			console.log('Form submitted with values:', values);
// 			AddData(values);
// 			resetForm();
// 		},
// 	});
// 	const {
// 		errors,
// 		touched,
// 		values,
// 		handleBlur,
// 		handleChange,
// 		handleSubmit,
// 		setFieldValue,
// 	} = formik;

// 	const AddData = async () => {
// 		try {
// 			setIsLoding(true);
// 			console.log('add data');
// 			let response = await postApi('api/email/add', values);
// 			if (response.status === 200) {
// 				props.onClose();
// 				fetchData();
// 				setAction((pre) => !pre);
// 			}
// 		} catch (e) {
// 			console.log(e);
// 		} finally {
// 			setIsLoding(false);
// 		}
// 	};

// 	const fetchRecipientData = async () => {
// 		console.log({ id: props.id, lead: props.lead });
// 		if (props.id && props.lead !== 'true') {
// 			let response = await getApi('api/contact/view/', props.id);
// 			if (response?.status === 200) {
// 				setFieldValue('recipient', response?.data?.contact?.email);
// 				setFieldValue('createBy', props.id);
// 				values.recipient = response?.data?.contact?.email;
// 			}
// 		} else if (props.id && props.lead === 'true') {
// 			console.log('lead true data fetch ');
// 			let response = await getApi('api/lead/view/', props.id);
// 			if (response?.status === 200) {
// 				setFieldValue('recipient', response?.data?.lead?.leadEmail);
// 				setFieldValue('createByLead', props.id);
// 				values.recipient = response?.data?.lead?.leadEmail;
// 			}
// 		}
// 	};

// 	useEffect(() => {
// 		if (isOpen) {
// 			console.log('data fetched');
// 			fetchRecipientData();
// 		}
// 	}, [props.id, isOpen]);

// 	return (
// 		<Modal onClose={onClose} isOpen={isOpen} isCentered>
// 			<ModalOverlay />
// 			<ModalContent>
// 				<ModalHeader>Send Email </ModalHeader>
// 				<ModalCloseButton />
// 				<ModalBody>
// 					<form onSubmit={handleSubmit}>
// 						<Grid templateColumns='repeat(12, 1fr)' gap={3}>
// 							<GridItem colSpan={{ base: 12 }}>
// 								<FormLabel
// 									display='flex'
// 									ms='4px'
// 									fontSize='sm'
// 									fontWeight='500'
// 									mb='8px'
// 								>
// 									Subject
// 								</FormLabel>
// 								<Input
// 									fontSize='sm'
// 									placeholder='Enter subject'
// 									onChange={handleChange}
// 									onBlur={handleBlur}
// 									value={values.subject}
// 									name='subject'
// 									fontWeight='500'
// 									borderColor={
// 										errors.subject && touched.subject ? 'red.300' : null
// 									}
// 								/>
// 								<Text mb='10px' color={'red'}>
// 									{' '}
// 									{errors.subject && touched.subject && errors.subject}
// 								</Text>
// 							</GridItem>
// 							<GridItem colSpan={{ base: 12, md: 6 }}>
// 								<FormLabel
// 									display='flex'
// 									ms='4px'
// 									fontSize='sm'
// 									fontWeight='500'
// 									mb='8px'
// 								>
// 									Start Date<Text color={'red'}>*</Text>
// 								</FormLabel>
// 								<Input
// 									type='datetime-local'
// 									fontSize='sm'
// 									onChange={handleChange}
// 									onBlur={handleBlur}
// 									value={values.startDate}
// 									name='startDate'
// 									fontWeight='500'
// 									borderColor={
// 										errors?.startDate && touched?.startDate ? 'red.300' : null
// 									}
// 								/>
// 								<Text mb='10px' color={'red'}>
// 									{' '}
// 									{errors.startDate && touched.startDate && errors.startDate}
// 								</Text>
// 							</GridItem>
// 							<GridItem colSpan={{ base: 12, md: 6 }}>
// 								<FormLabel
// 									display='flex'
// 									ms='4px'
// 									fontSize='sm'
// 									fontWeight='500'
// 									mb='8px'
// 								>
// 									End Date
// 								</FormLabel>
// 								<Input
// 									type='datetime-local'
// 									fontSize='sm'
// 									min={values.startDate}
// 									onChange={handleChange}
// 									onBlur={handleBlur}
// 									value={values.endDate}
// 									name='endDate'
// 									fontWeight='500'
// 									borderColor={
// 										errors?.endDate && touched?.endDate ? 'red.300' : null
// 									}
// 								/>
// 								<Text mb='10px' color={'red'}>
// 									{' '}
// 									{errors.endDate && touched.endDate && errors.endDate}
// 								</Text>
// 							</GridItem>
// 							<GridItem colSpan={{ base: 12 }}>
// 								<FormLabel
// 									display='flex'
// 									ms='4px'
// 									fontSize='sm'
// 									fontWeight='500'
// 									mb='8px'
// 								>
// 									Message
// 								</FormLabel>
// 								<Textarea
// 									fontSize='sm'
// 									placeholder='Here Type message'
// 									resize={'none'}
// 									onChange={handleChange}
// 									onBlur={handleBlur}
// 									value={values.message}
// 									name='message'
// 									fontWeight='500'
// 									borderColor={
// 										errors.message && touched.message ? 'red.300' : null
// 									}
// 								/>
// 								<Text mb='10px' color={'red'}>
// 									{' '}
// 									{errors.message && touched.message && errors.message}
// 								</Text>
// 							</GridItem>
// 						</Grid>

// 						<Button
// 							size='sm'
// 							variant='brand'
// 							// onClick={handleSubmit}
// 							type='submit'
// 							disabled={isLoding ? true : false}
// 						>
// 							{isLoding ? <Spinner /> : 'Save'}
// 						</Button>
// 						<Button
// 							sx={{
// 								marginLeft: 2,
// 								textTransform: 'capitalize',
// 							}}
// 							variant='outline'
// 							colorScheme='red'
// 							size='sm'
// 							onClick={() => {
// 								formik.resetForm();
// 								onClose();
// 							}}
// 						>
// 							Close
// 						</Button>
// 					</form>
// 				</ModalBody>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

const AddEmailHistory = (props) => {
	const { onClose, isOpen, fetchData, leadDetails, setAction } = props;
	const user = JSON.parse(localStorage.getItem('user'));
	const [isLoading, setIsLoading] = useState(false);
	const [leadLoading, setLeadLoading] = useState(false);

	const initialValues = {
		sender: user?._id,
		recipient: '',
		subject: '',
		message: '',
		createBy: '',
		createByLead: '',
		// startDate: '',
		// endDate: '',
	};

	const formik = useFormik({
		initialValues,
		validationSchema: emailSchema,
		onSubmit: async (values, { resetForm }) => {
			console.log('Form submitted with values:', values);
			await AddData(values);
			resetForm();
		},
	});

	const {
		errors,
		touched,
		values,
		handleBlur,
		handleChange,
		handleSubmit,
		setFieldValue,
	} = formik;

	const AddData = async (formValues) => {
		try {
			setIsLoading(true);
			let response = await postApi('api/email/add', formValues);
			if (response.status === 200) {
				onClose();
				fetchData();
				setAction((prev) => !prev);
			}
		} catch (e) {
			console.log(e);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchRecipientData = async () => {
		setLeadLoading(true);
		if (props.id && props.lead !== 'true') {
			let response = await getApi('api/contact/view/', props.id);
			if (response?.status === 200) {
				setFieldValue('recipient', response?.data?.contact?.email);
				setFieldValue('createBy', props.id);
			}
		} else if (props.id && props.lead === 'true') {
			let response = await getApi('api/lead/view/', props.id);
			if (response?.status === 200) {
				setFieldValue('recipient', response?.data?.lead?.leadEmail);
				setFieldValue('createByLead', props.id);
			}
		}

		setLeadLoading(false);
	};

	const defaultTemplate = `Hello,

Mark your calendar! Weeam Real Estate invites you to our exclusive Property Expo.  

✨ Explore:
✅ Premier residential & commercial properties  
✅ Expert market insights  
✅ Exclusive deals & financing options
	
Event Details:
📅 Dates: February 21–23, 2025
⏰ Time: 10:00 AM – 6:00 PM daily
📍 Venue: Weam Elnaggar Real Estate Office, 203 API World Tower, Dubai

Don’t miss this chance to connect with industry leaders and find your perfect property. Let’s build your future together!  

Thanks,  
Weeam Real Estate
	`;

	useEffect(() => {
		if (isOpen) {
			setFieldValue('message', defaultTemplate);
			fetchRecipientData();
		}
	}, [props.id, isOpen]);

	return (
		<Modal onClose={onClose} size='2xl' isOpen={isOpen} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Send Email</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					{leadLoading ? (
						<VStack p='4' height='full'>
							<Loader />
						</VStack>
					) : values?.recipient ? (
						<form onSubmit={handleSubmit}>
							<Grid
								overflow='scroll'
								height='65vh'
								p='4'
								templateColumns='repeat(12, 1fr)'
								gap={3}
							>
								<GridItem colSpan={{ base: 12 }}>
									<DisplayField label='Recipient' value={values.recipient} />
								</GridItem>
								{/* <GridItem colSpan={{ base: 12 }}>
								<FormLabel
									display='flex'
									ms='4px'
									fontSize='sm'
									fontWeight='500'
									mb='8px'
								>
									Recipient
								</FormLabel>
								<Input
									fontSize='sm'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.recipient}
									name='recipient'
									disabled
									placeholder='Recipient'
									fontWeight='500'
									borderColor={
										errors.recipient && touched.recipient ? 'red.300' : null
									}
								/>
								<Text mb='10px' color={'red'}>
									{errors.recipient && touched.recipient && errors.recipient}
								</Text>
							</GridItem> */}
								<GridItem colSpan={{ base: 12 }}>
									<FormLabel ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
										Subject
									</FormLabel>
									<Input
										fontSize='sm'
										placeholder='Enter subject'
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.subject}
										name='subject'
										fontWeight='500'
										borderColor={
											errors.subject && touched.subject ? 'red.300' : undefined
										}
									/>
									{errors.subject && touched.subject && (
										<Text mb='10px' color='red'>
											{errors.subject}
										</Text>
									)}
								</GridItem>
								{/* <GridItem colSpan={{ base: 12, md: 6 }}>
									<FormLabel ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
										Start Date
									</FormLabel>
									<Input
										type='datetime-local'
										fontSize='sm'
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.startDate}
										name='startDate'
										fontWeight='500'
										borderColor={
											errors.startDate && touched.startDate
												? 'red.300'
												: undefined
										}
									/>
									{errors.startDate && touched.startDate && (
										<Text mb='10px' color='red'>
											{errors.startDate}
										</Text>
									)}
								</GridItem>
								<GridItem colSpan={{ base: 12, md: 6 }}>
									<FormLabel ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
										End Date
									</FormLabel>
									<Input
										type='datetime-local'
										fontSize='sm'
										min={values.startDate}
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.endDate}
										name='endDate'
										fontWeight='500'
										borderColor={
											errors.endDate && touched.endDate ? 'red.300' : undefined
										}
									/>
									{errors.endDate && touched.endDate && (
										<Text mb='10px' color='red'>
											{errors.endDate}
										</Text>
									)}
								</GridItem> */}
								<GridItem colSpan={{ base: 12 }}>
									<FormLabel ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
										Message
									</FormLabel>
									<Textarea
										fontSize='sm'
										placeholder='Here Type message'
										resize='none'
										height='35vh'
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.message}
										name='message'
										fontWeight='500'
										borderColor={
											errors.message && touched.message ? 'red.300' : undefined
										}
									/>
									{errors.message && touched.message && (
										<Text mb='10px' color='red'>
											{errors.message}
										</Text>
									)}
								</GridItem>
							</Grid>

							<HStack py='4' justifyContent='flex-end' gap='2'>
								<Button
									sx={{ marginLeft: 2, textTransform: 'capitalize' }}
									variant='outline'
									colorScheme='gray'
									size='sm'
									onClick={() => {
										formik.resetForm();
										onClose();
									}}
								>
									Close
								</Button>
								<Button
									size='sm'
									colorScheme='brand'
									type='submit'
									disabled={isLoading}
								>
									{isLoading ? 'Sending...' : 'Send Email'}
								</Button>
							</HStack>
						</form>
					) : (
						<Text p='4' mb='4'>
							There is no email address available for this lead.
						</Text>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default AddEmailHistory;
