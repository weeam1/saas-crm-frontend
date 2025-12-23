import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Box,
	Flex,
	Button,
	SimpleGrid,
	Heading,
	useToast,
} from '@chakra-ui/react';
import { FaUser, FaDollarSign, FaPercent, FaAward } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { HiOfficeBuilding, HiIdentification } from 'react-icons/hi';
import { AiOutlineFieldNumber } from 'react-icons/ai';
import { BsCalendarDate } from 'react-icons/bs';

// Import reusable components
import AvatarUpload from './AvatarUpload';
import FormField from './FormField';
import SalarySection from './SalarySection';
import { salaryTypes } from 'utils/options';
import { userSchema } from 'schema';
import { useSelector } from 'react-redux';
import { toCapitalCase } from 'utils/helpers';
import RoleStructureSection from './RoleStructureSection';

const getSalaryType = (value) =>
	salaryTypes.find((type) => type.value === value);

const UserModal = ({
	isOpen,
	onClose,
	mode = 'add',
	userData = null,
	agencies,
}) => {
	const toast = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [profileImage, setProfileImage] = useState(
		userData?.profileImage || ''
	);
	const [profileFile, setProfileFile] = useState(null);

	const countries = useSelector((state) => state.countries.countryNames);

	const formik = useFormik({
		initialValues: {
			firstName: '',
			lastName: '',
			agency: '',
			username: '',
			salaryType: '',
			salary: '',
			commission: '',
			incentive: '',
			phone: '',
			nationality: '',
			dob: '',
			passportNum: '',
			uaeIdNum: '',
			drivingLicense: '',
			educationDegree: '',
			dubaiHomeAddress: '',
			countryHomeAddress: '',
			countryPhoneNum: '',
			...userData, // Override with existing data in edit mode
		},
		validationSchema: userSchema,
		onSubmit: async (values) => {
			setIsSubmitting(true);
			// final submit tthe form
			handleSubmitUser(values);
		},
	});

	const handleSubmitUser = async (values) => {
		try {
			const formData = new FormData();

			// Append form values
			Object.keys(values).forEach((key) => {
				if (values[key] !== null && values[key] !== undefined) {
					formData.append(key, values[key]);
				}
			});

			if (profileFile) {
				formData.append('profile_image', profileFile);
			}

			const endpoint =
				mode === 'add' ? '/v3/users' : `/v3/users/${userData.id}`;
			const method = mode === 'add' ? 'POST' : 'PUT';

			const response = await fetch(endpoint, {
				method,
				body: formData,
			});

			if (!response.ok) throw new Error('Failed to save user');

			toast({
				title: mode === 'add' ? 'User Created' : 'User Updated',
				description:
					mode === 'add'
						? 'User has been successfully created.'
						: 'User details have been updated.',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});

			onClose();
		} catch (error) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to save user. Please try again.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleImageUpload = (file) => {
		setProfileFile(file);
		setProfileImage(URL.createObjectURL(file));
	};

	const handleImageRemove = () => {
		setProfileFile(null);
		setProfileImage('');
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size={{ base: 'full', md: '4xl', lg: '3xl' }}
			scrollBehavior='inside'
			closeOnOverlayClick={false}
		>
			<ModalOverlay backdropFilter='blur(2px)' />
			<ModalContent
				borderRadius='xl'
				overflow='hidden'
				m={{ base: 2, md: 6, lg: 10 }}
			>
				<ModalHeader
					bg='white'
					borderBottom='1px'
					borderColor='gray.100'
					py={4}
				>
					<Flex align='center' justify='space-between'>
						<Heading size='md' color='gray.800'>
							{mode === 'add' ? 'Add New User' : 'Edit User'}
						</Heading>
						<ModalCloseButton position='static' />
					</Flex>
				</ModalHeader>

				<ModalBody p={0}>
					<form onSubmit={formik.handleSubmit}>
						<Flex direction={{ base: 'column', lg: 'row' }} gap={6} p={6}>
							{/* Left Column - Avatar & Basic Info */}
							<Box flex='1'>
								{/* Avatar Upload Section */}
								<Box mb={6}>
									<AvatarUpload
										image={profileImage}
										onUpload={handleImageUpload}
										onRemove={handleImageRemove}
										name={`${formik.values.firstName} ${formik.values.lastName}`}
									/>
								</Box>

								{/* Personal Information */}
								<Box bg='gray.50' borderRadius='lg' p={5} mb={6}>
									<Flex align='center' gap={2} mb={4}>
										<FaUser color='#B79045' />
										<Heading size='sm' color='gray.700'>
											Personal Information
										</Heading>
									</Flex>

									<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
										<FormField
											label='First Name'
											name='firstName'
											icon={<FaUser size={14} />}
											formik={formik}
											isRequired
										/>

										<FormField
											label='Last Name'
											name='lastName'
											icon={<FaUser size={14} />}
											formik={formik}
										/>

										<FormField
											label='Email'
											name='username'
											type='email'
											icon={<MdEmail size={14} />}
											formik={formik}
											isRequired
										/>

										<FormField
											label='Phone'
											name='phone'
											type='tel'
											icon={<MdPhone size={14} />}
											formik={formik}
										/>

										<FormField
											label='Nationality'
											name='nationality'
											formik={formik}
										/>

										<FormField
											label='Date of Birth'
											name='dob'
											type='date'
											icon={<BsCalendarDate size={14} />}
											formik={formik}
										/>
									</SimpleGrid>
								</Box>

								{/* Salary Section */}
								<SalarySection formik={formik} />
							</Box>

							{/* Right Column - Detailed Info */}
							<Box flex='1'>
								<RoleStructureSection formik={formik} />

								{/* Identification */}
								<Box bg='gray.50' borderRadius='lg' p={5} mb={6}>
									<Flex align='center' gap={2} mb={4}>
										<HiIdentification color='#B79045' />
										<Heading size='sm' color='gray.700'>
											Identification
										</Heading>
									</Flex>

									<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
										<FormField
											label='Agency'
											name='agency'
											icon={<HiOfficeBuilding size={14} />}
											formik={formik}
											isRequired
											as='select'
											placeholder='Select agency'
											options={agencies?.map((item) => {
												return {
													label: item?.name,
													value: item?._id,
												};
											})}
										/>

										<FormField
											label='Passport ID'
											name='passportNum'
											icon={<AiOutlineFieldNumber size={14} />}
											formik={formik}
										/>

										<FormField
											label='UAE ID'
											name='uaeIdNum'
											icon={<AiOutlineFieldNumber size={14} />}
											formik={formik}
										/>

										<FormField
											label='Driving License'
											name='drivingLicense'
											icon={<AiOutlineFieldNumber size={14} />}
											formik={formik}
										/>

										<FormField
											label='Education'
											name='educationDegree'
											icon={<FaUser size={14} />}
											formik={formik}
										/>
									</SimpleGrid>
								</Box>

								{/* Address & Contact */}
								<Box bg='gray.50' borderRadius='lg' p={5}>
									<Flex align='center' gap={2} mb={4}>
										<MdLocationOn color='#B79045' />
										<Heading size='sm' color='gray.700'>
											Address & Contact
										</Heading>
									</Flex>

									<SimpleGrid columns={1} spacing={4}>
										<FormField
											label='UAE Address'
											name='dubaiHomeAddress'
											icon={<MdLocationOn size={14} />}
											formik={formik}
											as='textarea'
											rows={1}
										/>

										{/* <FormField
											label='Home Country'
											name='homeCountry'
											icon={<MdLocationOn size={14} />}
											formik={formik}
											// as='select'
											// options={countries?.map((name) => {
											// 	const countryName = toCapitalCase(name);

											// 	return {
											// 		label: countryName,
											// 		value: countryName,
											// 	};
											// })}
										/> */}

										<FormField
											label='Home Country Address'
											name='countryHomeAddress'
											icon={<MdLocationOn size={14} />}
											formik={formik}
											as='textarea'
											rows={1}
										/>

										<FormField
											label='International Phone'
											name='countryPhoneNum'
											type='tel'
											icon={<MdPhone size={14} />}
											formik={formik}
										/>
									</SimpleGrid>
								</Box>
							</Box>
						</Flex>
					</form>
				</ModalBody>

				<ModalFooter borderTop='1px' borderColor='gray.100' bg='white' py={4}>
					<Flex w='full' justify='space-between' gap={3}>
						<Button
							variant='outline'
							colorScheme='gray'
							onClick={onClose}
							flex='1'
							maxW='150px'
						>
							Cancel
						</Button>

						<Button
							bg='#B79045'
							color='white'
							_hover={{ bg: '#A87F3B' }}
							onClick={() => formik.handleSubmit()}
							isLoading={isSubmitting}
							loadingText='Saving...'
							flex='1'
							maxW='150px'
						>
							{mode === 'add' ? 'Create User' : 'Save Changes'}
						</Button>
					</Flex>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default UserModal;
