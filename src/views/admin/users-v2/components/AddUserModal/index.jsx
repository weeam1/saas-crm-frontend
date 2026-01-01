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
import ProfilePictureModal from './ProfilePicModal';

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
	const [isSuccess, setIsSuccess] = useState(false);
const [currentUser, setCurrentUser] = useState(null);


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
if (!values.roles) {
			errors.roles = 'Role is required';
		}
if (!values.password) {
			errors.password = 'Password is required';
		}

			if (
				!values.parent &&
				['Team Leader', 'Agent'].includes(newRole?.roleName)
			) {
				errors.parent = 'Manager is requried';
			}

			if (!values.teamLead && newRole?.roleName === 'Agent') {
				errors.teamLead = 'Team Leader is requried';
			}

		

			return errors; // Formik will merge with schema validation
		},
		onSubmit: async (values) => {
			setIsSubmitting(true);
			// final submit tthe form
			handleSubmitUser(values);
		},
	});
const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
		if (res?.doc) {
  setCurrentUser({ ...res.doc });
  setIsSuccess(true); // optional, if you still want it
  setIsProfileModalOpen(true); // <-- open profile picture modal
} else if (userData) {
  setCurrentUser({ ...userData });
  setIsSuccess(true);
  setIsProfileModalOpen(true); // <-- open profile picture modal
}


// Don't call onClose()

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
const [step, setStep] = useState(1);
const totalSteps = 3;

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				scrollBehavior='inside'
				closeOnOverlayClick={false}
			>
				<Box px={6} pt={4}>
 

  <Flex justify="space-between" mt={2}>
    <Heading size="xs" color="gray.600">
      Step {step} of {totalSteps}
    </Heading>

<Heading size="xs" color="gray.700">
  {step === 1 && "Personal Information"}
  {step === 2 && "Identification & Address"} 
  {step === 3 && "Salary & Role Structure"} 
</Heading>


  </Flex>
</Box>

				<ModalOverlay backdropFilter='blur(2px)' />
				<ModalContent
  maxW={{ base: "95%", md: "900px" }} // optional bigger max width
  w="100%"                           // fill parent
  borderRadius="xl"
  boxShadow="xl"
  overflow="hidden"
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
 <Box h="6px" bg="gray.200" borderRadius="full">
    <Box
      h="6px"
      bg="#B79045"
      borderRadius="full"
      width={`${(step / totalSteps) * 100}%`}
      transition="0.3s"
    />
  </Box>
					<ModalBody p={0}>
						<form onSubmit={formik.handleSubmit}>
							<Flex direction={{ base: 'column', lg: 'row' }} gap={6} p={6}>
								{/* Left Column - Avatar & Basic Info */}
								
									{/* Personal Information */}
									{step === 1 && (
									<Box bg='gray.50' borderRadius='lg' p={5} mb={6} w="100%">
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
												<FormField
										flex="1"
											label='Password'
											name='password'
											isRequired
											formik={formik}
										/>
										</SimpleGrid>
									
									</Box>)}

									{/* Salary Section */}

								{/* Right Column - Detailed Info */}
								


									{/* Identification */}
								
									{step === 2 && (
									
										<Flex direction={"column"} w="100%">
											<Box bg='gray.50' borderRadius='lg' p={5} mb={6} w="100%">
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
									<Box bg='gray.50' borderRadius='lg' p={5} w="100%">
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
										</Flex>

								)}
		
									{step === 3 && isFieldsAllowed && (
  <Flex direction={"column"} w={"100%"}>
	<SalarySection formik={formik} />
  <RoleStructureSection formik={formik} />
  
  </Flex>
)}
						
									{/* Address & Contact */}
								

							</Flex>
						</form>
					</ModalBody>

				<ModalFooter
  borderTop='1px'
  borderColor='gray.200'
  bg='gray.100'
  py={4}
  flexDirection="column"
  gap={2}
>
  {/* Buttons */}
  <Flex w="full" justify="space-between" gap={3}>
    <Button
      variant="outline"
      onClick={() => (step === 1 ? onClose() : setStep(step - 1))}
    >
      {step === 1 ? "Cancel" : "Back"}
    </Button>
 <Flex align="center" mt={1} gap={2}>
    {Array.from({ length: totalSteps }, (_, i) => (
      <Box
        key={i}
        w={4}
        h={4}
        borderRadius="full"
        bg={step === i + 1 ? "#B79045" : "gray.300"}
      />
    ))}
  </Flex>
    {step < totalSteps ? (
      <Button
        bg="#B79045"
        color="white"
        _hover={{ bg: "#A87F3B" }}
        onClick={async () => {
          const errors = await formik.validateForm();

          const stepFields = {
            1: ["firstName", "username", "password"], // Personal Info
            2: ["agency", "passportNum", "dubaiHomeAddress", "countryHomeAddress", "countryPhoneNum"], // Identification & Address
            3: ["salaryType", "salary", "roles", "parent", "teamLead"], // Salary + Role Structure
          };

          const hasErrors = Object.keys(errors).some((key) =>
            stepFields[step]?.includes(key)
          );

          if (hasErrors) {
            formik.setTouched(
              stepFields[step].reduce((acc, cur) => ({ ...acc, [cur]: true }), {}),
              true
            );
            return;
          }

          setStep(step + 1);
        }}
      >
        Next
      </Button>
    ) : (
      <Button
        bg="#B79045"
        color="white"
        _hover={{ bg: "#A87F3B" }}
        onClick={formik.handleSubmit}
        isLoading={isSubmitting || isCreating || isUpdating}
      >
        {mode === "add" ? "Create User" : "Save Changes"}
      </Button>
    )}
  </Flex>

  {/* Step count text */}
  {/* <Box textAlign="center" mt={2} color="gray.600" fontSize="sm">
    Step {step} of {totalSteps}
  </Box> */}

  {/* Step indicators */}
 
</ModalFooter>

				</ModalContent>
			</Modal>
{currentUser && (
  <ProfilePictureModal
    isOpen={isProfileModalOpen}
	 onClose={() => {
    setIsProfileModalOpen(false);
    onClose(); // close the main UserModal as well
  }}
    user={currentUser}
    previewUrl={currentUser?.profileImage || null}
    refetchUser={refetchUser}
    mode={mode === 'add' ? 'add' : 'edit'}
  />
)}

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
