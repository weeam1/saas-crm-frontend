import React, { useState, useEffect, useMemo } from 'react';
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
	useDisclosure,
} from '@chakra-ui/react';
import { FaUser, FaDollarSign, FaPercent, FaAward } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { HiOfficeBuilding, HiIdentification } from 'react-icons/hi';
import { AiOutlineFieldNumber } from 'react-icons/ai';
import { BsCalendarDate } from 'react-icons/bs';
import { toast } from 'react-toastify';

// Import reusable components
import { useCreateItemMutation, useUpdateItemMutation } from 'api/apiSlice';
import { userSchema } from 'schema';
import FormField from './FormField';
import SalarySection from './SalarySection';
import RoleStructureSection from './RoleStructureSection';
import ReplaceManager from 'views/admin/users/components/ReplaceManager';
import ReplaceTeamLead from 'views/admin/users/components/ReplaceTeamLead';
import SecurityPasswordPermission from 'views/admin/users/components/PasswordPermission';
import { useRoles } from 'hooks/user/userRoles';
import { useTeamStructure } from 'hooks/user/useTeamStructure';
import { useSelector } from 'react-redux';
import { salaryTypes } from 'utils/options';
import useUserSession from 'hooks/useUserSession';

const getInitialValues = (userData = {}) => ({
	firstName: userData?.firstName ?? '',
	lastName: userData?.lastName ?? '',
	password: '',
	username: userData?.username ?? '',
	// profileImage: userData?.profileImage ?? '',
	phoneNumber: userData?.phoneNumber ?? '',
	nationality: userData?.nationality ?? '',
	dob: userData?.dob ? new Date(userData.dob).toISOString().split('T')[0] : '',
	passportNum: userData?.passportNum ?? '',
	uaeIdNum: userData?.uaeIdNum ?? '',
	drivingLicense: userData?.drivingLicense ?? '',
	educationDegree: userData?.educationDegree ?? '',
	dubaiHomeAddress: userData?.dubaiHomeAddress ?? '',
	countryHomeAddress: userData?.countryHomeAddress ?? '',
	countryPhoneNum: userData?.countryPhoneNum ?? '',
	salaryType: userData?.salaryType ?? salaryTypes?.[0]?.value ?? '',
	salary: userData?.salary ?? '',
	commission: userData?.commission ?? '',
	incentive: userData?.incentive ?? '',

	roles: userData?.roles?._id || userData?.roles?.[0]?._id || '',
	agency: userData?.agency?._id ?? '',
	parent: userData?.parent?._id || userData?.parent || null,
	teamLead: userData?.teamLead?._id || userData?.teamLead || null,
	target: userData?.target ?? '',
});

const UserModal = ({
	isOpen,
	onClose,
	mode = 'add',
	userData = null,
	updateData,
	refetchUser,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const agencies = useSelector((s) => (s.util && s.util.agencies) || []);

	const [replacementManager, setReplacementManager] = useState(null);
	const [replacementTeamLead, setReplacementTeamLead] = useState(null);
	const [securityPassword, setSecurityPassword] = useState('');

	const { roles: allRoles } = useRoles();
	const { isSuperAdmin, userRoleName } = useUserSession();
	const {
		team: managers,
		getTeamLeadsByManager,
		refreshTeam,
	} = useTeamStructure();

	const {
		isOpen: replaceIsOpen,
		onOpen: replaceOnOpen,
		onClose: replaceOnClose,
	} = useDisclosure();

	const {
		isOpen: replaceLeadIsOpen,
		onOpen: replaceLeadOnOpen,
		onClose: replaceLeadOnClose,
	} = useDisclosure();

	const {
		isOpen: passwordIsOpen,
		onOpen: passwordOnOpen,
		onClose: passwordOnClose,
	} = useDisclosure();

	const formik = useFormik({
		initialValues: getInitialValues(userData),
		enableReinitialize: true,
		validationSchema: userSchema,
		validate: (values) => {
			const errors = {};

			const newRole = allRoles?.find((role) => role?._id === values?.roles);

			if (
				!values.parent &&
				['Team Leader', 'Agent'].includes(newRole?.roleName)
			) {
				errors.parent = 'Manager is requried';
			}

			if (!values.teamLead && newRole?.roleName === 'Agent') {
				errors.teamLead = 'Team Leader is requried';
			}

			// Only trigger in non-edit mode
			if (mode !== 'edit') {
				if (!values.password || values.password.length < 6) {
					errors.password =
						'Password is required and must be at least 6 characters';
				}
			}

			return errors; // Formik will merge with schema validation
		},
		onSubmit: async (values) => {
			setIsSubmitting(true);
			// final submit tthe form
			handleSubmitUser(values);
		},
	});

	const [createUser, { isLoading: isCreating }] = useCreateItemMutation();
	const [updateUser, { isLoading: isUpdating }] = useUpdateItemMutation();

	const handleSubmitUser = async (values) => {
		try {
			const userRole = userData?.roles ?? null;
			const newRole = allRoles?.find((role) => role?._id === values?.roles);

			const isAgentOrTeamLeadRole = ['Team Leader', 'Agent'].includes(
				newRole?.roleName
			);

			const valuesObj = { ...values };

			// when team lead role change to other role
			if (
				userRole?.roleName === 'Team Leader' &&
				userRole?._id !== newRole._id &&
				!replacementTeamLead &&
				managerTeamLeaders?.length
			) {
				replaceLeadOnOpen();
				return;
			} else if (replacementTeamLead) {
				valuesObj['replacementTeamLead'] = replacementTeamLead;
			} else valuesObj['replacementTeamLead'] = null;

			if (
				userRole?.roleName === 'Manager' &&
				userRole?._id !== newRole?._id &&
				!replacementManager &&
				newRole?.roleName !== 'Agent'
			) {
				replaceOnOpen();
				return;
			} else if (replacementManager) {
				valuesObj['replacementManager'] = replacementManager;
			}

			if (isAgentOrTeamLeadRole) {
				if (!valuesObj?.parent) {
					toast.error('Please select a manager.');
					return;
				}

				valuesObj['parent'] = values.parent;
				valuesObj['replacementManager'] = values.parent;

				setReplacementManager(values.parent);
			}

			if (
				!securityPassword &&
				(userRole?._id !== newRole?._id || valuesObj?.password)
			) {
				passwordOnOpen();
				return;
			}

			if (securityPassword)
				valuesObj['securityPassword'] = securityPassword?.trim();

			const formData =
				mode === 'edit'
					? Object.keys(valuesObj).reduce((acc, key) => {
							if (valuesObj[key] !== formik.initialValues[key]) {
								acc[key] = valuesObj[key];
							}
							return acc;
						}, {})
					: Object.fromEntries(
							Object.entries(valuesObj).filter(
								([_, value]) => value != null && value !== ''
							)
						);

			let res = null;

			if (mode === 'edit') {
				res = await updateUser({
					path: `/v3/users/${userData._id}`,
					body: formData,
				}).unwrap();
			} else {
				res = await createUser({ path: '/v3/users', body: formData }).unwrap();
			}

			const msg =
				mode === 'add'
					? 'User has been successfully created.'
					: 'User details have been updated.';

			toast.success(msg);

			// update data list
			if (res?.doc && updateData) {
				let modeValue = mode === 'edit' ? 'update' : 'add';

				updateData(res?.doc?._id, res?.doc, modeValue);
			} else refetchUser();

			setReplacementManager(null);
			setReplacementTeamLead(null);
			setSecurityPassword('');
			// refresh the team strcuture
			refreshTeam();
			onClose();
		} catch (error) {
			toast.error(
				error?.data?.message || 'Failed to save user. Please try again.'
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const managerTeamLeaders = useMemo(() => {
		return getTeamLeadsByManager(formik.values.parent)?.filter(
			(tl) => tl?._id !== userData?._id
		);
	}, [formik.values?.parent, userData?._id]);

	const isFieldsAllowed = isSuperAdmin ? true : mode === 'add';

	return (
		<>
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
					boxShadow='xl'
					overflow='hidden'
					m={{ base: 2, md: 6, lg: 10 }}
				>
					<ModalHeader
						bg='brand.300'
						borderTopRadius='xl'
						py={3}
						fontSize='md'
						fontWeight='bold'
						color='brand.700'
						borderBottom='1px'
						borderColor='gray.100'
					>
						<Flex align='center' justify='space-between'>
							<Heading size='md' color='gray.800'>
								{mode === 'add' ? 'Add New User' : 'Edit User'}
							</Heading>
							<ModalCloseButton
								position='static'
								isDisabled={isSubmitting || isCreating || isUpdating}
							/>
						</Flex>
					</ModalHeader>

					<ModalBody p={0}>
						<form onSubmit={formik.handleSubmit}>
							<Flex direction={{ base: 'column', lg: 'row' }} gap={6} p={6}>
								{/* Left Column - Avatar & Basic Info */}
								<Box flex='1'>
									{/* Personal Information */}
									<Box bg='gray.50' borderRadius='lg' p={5} mb={6}>
										<Flex align='center' gap={2} mb={4}>
											<FaUser color='#B79045' />
											<Heading size='sm' color='gray.700'>
												Personal Information
											</Heading>
										</Flex>

										<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
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
												name='phoneNumber'
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
										<FormField
											label='Password'
											name='password'
											formik={formik}
										/>
									</Box>

									{/* Salary Section */}
									{isFieldsAllowed && <SalarySection formik={formik} />}
								</Box>

								{/* Right Column - Detailed Info */}
								<Box flex='1'>
									{isFieldsAllowed && <RoleStructureSection formik={formik} />}

									{/* Identification */}
									<Box bg='gray.50' borderRadius='lg' p={5} mb={6}>
										<Flex align='center' gap={2} mb={4}>
											<HiIdentification color='#B79045' />
											<Heading size='sm' color='gray.700'>
												Identification
											</Heading>
										</Flex>

										<SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
											{isFieldsAllowed && (
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
											)}

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

										<SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
											<FormField
												label='UAE Address'
												name='dubaiHomeAddress'
												icon={<MdLocationOn size={14} />}
												formik={formik}
												as='textarea'
												rows={1}
											/>
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

					<ModalFooter
						borderTop='1px'
						borderColor='gray.200'
						bg='gray.100'
						py={4}
					>
						<Flex w='full' justify='space-between' gap={3}>
							<Button
								variant='outline'
								colorScheme='gray'
								onClick={onClose}
								isDisabled={isSubmitting || isCreating || isUpdating}
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
								isLoading={isSubmitting || isCreating || isUpdating}
								isDisabled={!formik.dirty}
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

			{replaceIsOpen && (
				<ReplaceManager
					isOpen={replaceIsOpen}
					onClose={() => {
						replaceOnClose();
						setSecurityPassword('');
					}}
					managers={managers}
					replacementManager={replacementManager}
					handleProceed={() => {
						replaceOnClose();
						handleSubmitUser(formik.values);
					}}
					setReplacementManager={setReplacementManager}
				/>
			)}

			{replaceLeadIsOpen && (
				<ReplaceTeamLead
					isOpen={replaceLeadIsOpen}
					onClose={() => {
						replaceLeadOnClose();
						setSecurityPassword('');
					}}
					teamLeaders={managerTeamLeaders}
					replacementTeamLead={replacementTeamLead}
					handleProceed={() => {
						replaceLeadOnClose();
						handleSubmitUser(formik.values);
					}}
					setReplacementTeamLead={setReplacementTeamLead}
				/>
			)}

			{passwordIsOpen && (
				<SecurityPasswordPermission
					isOpen={passwordIsOpen}
					onClose={passwordOnClose}
					securityPassword={securityPassword}
					setSecurityPassword={setSecurityPassword}
					handleProceed={() => {
						passwordOnClose();
						handleSubmitUser(formik.values);
					}}
				/>
			)}
		</>
	);
};

export default UserModal;
