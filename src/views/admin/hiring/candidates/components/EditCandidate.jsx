import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Button,
	Grid,
	Spinner,
	FormControl,
	FormLabel,
	Input,
	Select,
	VStack,
	Switch,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	Box,
	HStack,
	FormErrorMessage,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FiSave } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import { useUpdateItemMutation } from 'api/apiSlice';
import { visaOptions } from 'utils/options';
import { engLangLevelOptions } from 'utils/options';
import { experienceYearsOptions } from 'utils/options';
import { yesOrNoOptions } from 'utils/options';
import CustomDatePicker from 'components/datetime/CustomDatePicker';
import CustomSelect from 'components/shared/CustomSelect';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import CustomInput from 'components/shared/CustomInput';
import { useSelector } from 'react-redux';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';
import { buttonStyle } from 'utils/btn';

// Validation Schema
const candidateSchema = Yup.object().shape({
	name: Yup.string().required('Full name is required'),
	email: Yup.string().email('Invalid email').required('Email is required'),
	phone: Yup.string().required('Phone number is required'),
	dob: Yup.date().required('Date of birth is required'),
	gender: Yup.string().required('Gender is required'),
	position: Yup.string().required('Position is required'),
	visaType: Yup.string().required('Visa type is required'),
	whatsApp: Yup.string(),
	experience: Yup.string(),
	nationality: Yup.string().required('Nationality is required'),
	drivingLicense: Yup.boolean(),
	experienceYears: Yup.number()
		.required('Experience years is required')
		.min(0, 'Must be at least 0')
		.max(50, 'Must be less than 50'),
	engLangLevel: Yup.string(),
});

const EditCandidate = ({ isOpen, onClose, candidate, refetch }) => {
	const [updateCandidate, { isLoading }] = useUpdateItemMutation();

	const countries = useSelector((state) => state.countries.countryNames);

	const { data: positionOptions, isLoading: positionsLoading } =
		useFetchItemsQuery({
			path: `/positions/options`,
		});

	const initialValues = {
		name: candidate?.name || '',
		email: candidate?.email || '',
		phone: candidate?.phone || '',
		position: candidate?.position?._id || '',
		dob: candidate?.dob
			? new Date(candidate.dob).toISOString().split('T')[0]
			: '',
		gender: candidate?.gender || '',
		visaType: candidate?.visaType || '',
		whatsApp: candidate?.whatsApp || '',
		nationality: candidate?.nationality?.toLowerCase() || '',
		drivingLicense: candidate?.drivingLicense || false,
		experienceYears: candidate?.experienceYears || 0,
		experience: candidate?.experience || 0,
		engLangLevel: candidate?.engLangLevel || '',
	};

	const handleSubmit = async (values) => {
		try {
			await updateCandidate({
				path: `/applications/${candidate._id}`,
				body: values,
			}).unwrap();

			refetch();
			onClose();
			toast.success('Candidate information has been updated successfully');
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to update candidate');
		}
	};

	const twentyYearsAgo = new Date();
	twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);
	const maxDate = twentyYearsAgo.toISOString().split('T')[0];

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size='4xl'>
			<ModalOverlay />
			<ModalContent mx='2'>
				<ModalHeader>Edit Candidate Information</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					{positionsLoading ? (
						<Loader />
					) : (
						<Formik
							initialValues={initialValues}
							validationSchema={candidateSchema}
							onSubmit={handleSubmit}
						>
							{({
								values,
								errors,
								touched,
								handleChange,
								setFieldValue,
								handleBlur,
							}) => (
								<Form>
									<VStack spacing={4} p='2' overflow='scroll' height='62vh'>
										<Grid
											templateColumns={{
												base: '1fr',
												md: 'repeat(2, 1fr)',
												lg: 'repeat(3, 1fr)',
											}}
											gap={4}
											w='full'
										>
											{/* Personal Information */}
											<CustomInput
												label='Full Name'
												name='name'
												placeholder='Full name'
												isInvalid={errors.name && touched.name}
												errorMessage={errors.name}
												onChange={(e) => {
													setFieldValue('name', e.target.value);
												}}
											/>

											<FormControl
												isInvalid={errors.position && touched.position}
											>
												<FormLabel fontSize='sm'>Position</FormLabel>
												<Select
													name='position'
													value={values.position}
													onChange={handleChange}
													onBlur={handleBlur}
													// placeholder='Select position'
													bg='gray.100'
													borderColor='gray.300'
													fontSize='sm'
													borderRadius='md'
													_focus={{
														borderColor: '#D99A36',
														boxShadow: '0 0 0 1px #D99A36',
													}}
													textTransform='capitalize'
													icon={<ChevronDownIcon color='gray.500' />}
													sx={{
														appearance: 'none',
														WebkitAppearance: 'none',
														MozAppearance: 'none',
													}}
												>
													{positionOptions?.doc?.map((option, index) => (
														<option
															key={`${option}-${index}`}
															value={option._id}
														>
															{option.label}
														</option>
													))}
												</Select>
												<FormErrorMessage>
													{errors.position && touched.position}
												</FormErrorMessage>
											</FormControl>

											<CustomInput
												label='Date of Birth'
												name='dob'
												type='date'
												max={maxDate}
												isInvalid={errors.dob && touched.dob}
												errorMessage={errors.dob}
												onChange={(e) => {
													setFieldValue('dob', e.target.value);
												}}
											/>

											<CustomInput
												label='Email'
												name='email'
												type='email'
												placeholder='Email'
												isInvalid={errors.email && touched.email}
												errorMessage={errors.email}
												onChange={(e) => {
													setFieldValue('email', e.target.value);
												}}
											/>

											<CustomInput
												label='Phone'
												name='phone'
												placeholder='Phone'
												isInvalid={errors.phone && touched.phone}
												errorMessage={errors.phone}
												onChange={(e) => {
													setFieldValue('phone', e.target.value);
												}}
											/>

											<CustomInput
												label='WhatsApp'
												name='whatsApp'
												placeholder='WhatsApp number'
												onChange={(e) => {
													setFieldValue('whatsApp', e.target.value);
												}}
											/>

											<CustomSelect
												label='Gender'
												name='gender'
												options={[
													{ value: 'Male', label: 'Male' },
													{ value: 'Female', label: 'Female' },
												]}
												placeholder='Select gender'
												isInvalid={errors.gender && touched.gender}
												errorMessage={errors.gender}
												onChange={(e) => {
													setFieldValue('gender', e.target.value);
												}}
											/>

											<FormControl
												isInvalid={errors.nationality && touched.nationality}
											>
												<FormLabel fontSize='sm'>Nationality</FormLabel>
												<Select
													name='nationality'
													value={values.nationality}
													onChange={handleChange}
													onBlur={handleBlur}
													// placeholder='Nationality'
													bg='gray.100'
													borderColor='gray.300'
													fontSize='sm'
													borderRadius='md'
													_focus={{
														borderColor: '#D99A36',
														boxShadow: '0 0 0 1px #D99A36',
													}}
													textTransform='capitalize'
													icon={<ChevronDownIcon color='gray.500' />}
													sx={{
														appearance: 'none',
														WebkitAppearance: 'none',
														MozAppearance: 'none',
													}}
												>
													{countries?.map((option, index) => (
														<option key={`${option}-${index}`} value={option}>
															{option}
														</option>
													))}
												</Select>
												<FormErrorMessage>
													{errors.nationality && touched.nationality}
												</FormErrorMessage>
											</FormControl>

											<CustomSelect
												label='Visa Type'
												name='visaType'
												options={visaOptions}
												placeholder='Select visa type'
												isInvalid={errors.visaType && touched.visaType}
												errorMessage={errors.visaType}
												onChange={(e) => {
													setFieldValue('visaType', e.target.value);
												}}
											/>

											<CustomSelect
												label='Driving License?'
												name='drivingLicense'
												options={yesOrNoOptions}
												placeholder='Select Driving License'
												onChange={(e) => {
													setFieldValue('drivingLicense', e.target.value);
												}}
											/>

											<CustomSelect
												label='Experience (Years)'
												name='experienceYears'
												options={experienceYearsOptions}
												placeholder='Select experience'
												isInvalid={
													errors.experienceYears && touched.experienceYears
												}
												errorMessage={errors.experienceYears}
												onChange={(e) => {
													setFieldValue('experienceYears', e.target.value);
												}}
											/>

											<CustomSelect
												label='English Level'
												name='engLangLevel'
												options={engLangLevelOptions}
												placeholder='Select English level'
												onChange={(e) => {
													setFieldValue('engLangLevel', e.target.value);
												}}
											/>
										</Grid>

										<CustomInput
											label='Experience'
											name='experience'
											type='textarea'
											h='15vh'
											resize='none'
											isInvalid={errors.experience && touched.experience}
											placeholder={'Enter experience'}
											onChange={(e) => {
												setFieldValue('experience', e.target.value);
											}}
										/>
									</VStack>

									<HStack w='full' justify='flex-end' pt={4}>
										<Button
											{...buttonStyle}
											bg='gray.200'
											color='gray.800'
											py='2'
											px='4'
											onClick={onClose}
											mr={3}
										>
											Cancel
										</Button>
										<Button
											{...buttonStyle}
											colorScheme='brand'
											py='2'
											px='4'
											type='submit'
											leftIcon={<FiSave />}
											isLoading={isLoading}
										>
											Save Changes
										</Button>
									</HStack>
								</Form>
							)}
						</Formik>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default EditCandidate;
