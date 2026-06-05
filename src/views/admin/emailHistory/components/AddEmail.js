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
import axios from 'axios';
import DisplayField from 'components/displays/DisplayField';
import Loader from 'components/loading/Loader';
import keys from 'config/keys';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { BsFillSendFill } from 'react-icons/bs';
import { FiCheck, FiPaperclip } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { emailSchema } from 'schema';
import { getApi, postApi } from 'services/api';
import { emailText } from './emailText';

const AddEmailHistory = (props) => {
	const { onClose, isOpen, fetchData, leadDetails, setAction } = props;
	const user = JSON.parse(localStorage.getItem('user'));
	const [isLoading, setIsLoading] = useState(false);
	const [leadLoading, setLeadLoading] = useState(false);
	const [filesLoading, setFilesLoading] = useState(false);

	const [files, setFiles] = useState(null);

	const handleInvite = async () => {
		try {
			if (files) return;

			setFilesLoading(true);
			const QRCodeUrl = `${keys.clientUrl}lead?page=1&pageSize=1&invite=${leadDetails?._id}`;

			const inviteData = {
				name: leadDetails?.leadName,
				url: QRCodeUrl,
			};

			const { data } = await axios.post(
				`${keys.socketUrl}/pdf/generate_invite`,
				inviteData
			);

			if (data?.download_url) {
				setFiles(data.download_url);
			}
		} catch (err) {
			console.log(err);
			toast.error(err.message || 'Failed to generate invite.');
		} finally {
			setFilesLoading(false);
		}
	};

	const initialValues = {
		sender: user?._id,
		recipient: '',
		subject:
			'Invitation to Attend – Abu Dhabi Real Estate Exhibition (November 14–17, 2025)',
		title: 'Abu Dhabi Real Estate Exhibition – You’re Invited!',
		message: '',
		createBy: '',
		createByLead: '',
		files: '',
		// startDate: '',
		// endDate: '',
	};

	const formik = useFormik({
		initialValues,
		validationSchema: emailSchema,
		onSubmit: async (values, { resetForm }) => {
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
			let url = '';
			if (files) {
				url = 'api/email/add?topic=attend_show';
				values.files = files;
			} else if (props.topic === 'attend_show') {
				url = 'api/email/add?topic=attend_show';
				values.files = props.files;
			} else url = 'api/email/add';

			let response = await postApi(url, formValues);
			if (response.status === 200) {
				toast.success('Email sent successfully.');

				onClose();
				// fetchData();
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

	const defaultTemplate = emailText(leadDetails?.leadName);

	// 	const defaultTemplate = `Dear ${leadDetails?.leadName ?? 'Sir'},

	// We are delighted to invite you to Weam Elnaggar Real Estate’s Exclusive Property Exhibition in Abu Dhabi—an unmissable opportunity to explore the finest real estate offerings and gain valuable market insights.

	// What to Expect:

	// Premium Residential & Commercial Properties from top-tier developers

	// Exclusive Investment Offers & Flexible Financing Options

	// Personalized Guidance from real estate experts to match your goals

	// Event Details:
	// Dates: April 11–13, 2025
	// Time: 10:00 AM – 10:00 PM (Daily)
	// Venue: Beach Rotana Hotel, Abu Dhabi

	// Whether you're a seasoned investor or looking for your dream home, this event is tailored to help you make informed and rewarding real estate decisions.

	// We look forward to welcoming you and supporting your journey in property investment and ownership.

	// Warm regards,
	// Weam Elnaggar Real Estate`;

	useEffect(() => {
		if (isOpen) {
			setFieldValue('message', defaultTemplate);
			fetchRecipientData();
		}
	}, [props.id, isOpen]);

	return (
		<Modal onClose={onClose} size='2xl' isOpen={isOpen} isCentered>
			<ModalOverlay bg='bg.overlay' backdropFilter='blur(2px)' />
			<ModalContent
				bg='bg.surface'
				borderRadius='xl'
				boxShadow='deep'
				mx='2'
				overflow='hidden'
			>
				<ModalHeader
					bg='accent.gold'
					color='text.inverse'
					borderTopRadius='xl'
					py={4}
					px={6}
					borderBottom='1px solid'
					borderColor='border.default'
				>
					Send Email
				</ModalHeader>
				<ModalCloseButton
					color='text.inverse'
					_focus={{ outline: 'none' }}
					_hover={{ bg: 'rgba(0,0,0,0.1)' }}
				/>
				<ModalBody bg='bg.app'>
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

								<GridItem colSpan={{ base: 12 }}>
									<FormLabel ms='4px' fontSize='sm' fontWeight='500' mb='8px' color='text.body'>
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
										bg='bg.input'
										borderColor={
											errors.subject && touched.subject ? 'red.500' : 'border.default'
										}
										_placeholder={{ color: 'text.muted' }}
										color='text.body'
										_focus={{
											borderColor: errors.subject && touched.subject ? 'red.500' : 'border.focus',
											boxShadow: errors.subject && touched.subject ? '0 0 0 1px red.500' : 'goldGlow',
										}}
									/>
									{errors.subject && touched.subject && (
										<Text mb='10px' color='red.500' fontSize='xs'>
											{errors.subject}
										</Text>
									)}
								</GridItem>
								<GridItem colSpan={{ base: 12 }}>
									<FormLabel ms='4px' fontSize='sm' fontWeight='500' mb='8px' color='text.body'>
										Title
									</FormLabel>
									<Input
										fontSize='sm'
										placeholder='e.g: Expo Invite'
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.title}
										name='title'
										fontWeight='500'
										bg='bg.input'
										borderColor={
											errors.title && touched.title ? 'red.500' : 'border.default'
										}
										_placeholder={{ color: 'text.muted' }}
										color='text.body'
										_focus={{
											borderColor: errors.title && touched.title ? 'red.500' : 'border.focus',
											boxShadow: errors.title && touched.title ? '0 0 0 1px red.500' : 'goldGlow',
										}}
									/>
									{errors.title && touched.title && (
										<Text mb='10px' color='red.500' fontSize='xs'>
											{errors.title}
										</Text>
									)}
								</GridItem>

								{props.topic !== 'attend_show' && (
									<GridItem colSpan={{ base: 12 }}>
										<Button
											onClick={handleInvite}
											isLoading={filesLoading}
											leftIcon={
												files ? (
													<FiCheck size={14} />
												) : (
													<FiPaperclip size={14} />
												)
											}
											variant={files ? 'brand' : 'outline'}
											size='sm'
										>
											{files ? 'File Attached' : 'Attach Invite Files'}
										</Button>
									</GridItem>
								)}

								<GridItem colSpan={{ base: 12 }}>
									<FormLabel ms='4px' fontSize='sm' fontWeight='500' mb='8px' color='text.body'>
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
										bg='bg.input'
										borderColor={
											errors.message && touched.message ? 'red.500' : 'border.default'
										}
										color='text.body'
										_placeholder={{ color: 'text.muted' }}
										_focus={{
											borderColor: errors.message && touched.message ? 'red.500' : 'border.focus',
											boxShadow: errors.message && touched.message ? '0 0 0 1px red.500' : 'goldGlow',
										}}
									/>
									{errors.message && touched.message && (
										<Text mb='10px' color='red.500' fontSize='xs'>
											{errors.message}
										</Text>
									)}
								</GridItem>
							</Grid>

							<HStack py='4' justifyContent='flex-end' gap='2'>
								<Button
									sx={{ marginLeft: 2, textTransform: 'capitalize' }}
									variant='outline'
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
									variant='brand'
									type='submit'
									isDisabled={isLoading}
									isLoading={isLoading}
									loadingText='Sending...'
								>
									Send Email
								</Button>
							</HStack>
						</form>
					) : (
						<Text p='4' mb='4' color='text.body'>
							There is no email address available for this lead.
						</Text>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default AddEmailHistory;