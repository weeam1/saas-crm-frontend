/* eslint-disable react-hooks/exhaustive-deps */
import { CloseIcon, PhoneIcon } from '@chakra-ui/icons';
import {
	Button,
	FormLabel,
	Grid,
	GridItem,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Text,
	useDisclosure,
	useColorModeValue,
	Flex,
	Box,
} from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { userSchema } from 'schema';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../redux/localSlice';
import { useFetchItemsQuery } from 'api/apiSlice';
import { salaryTypes } from 'utils/options';
import ImageUpload from './components/ImageUpload';
import { useUpdateItemMutation } from 'api/apiSlice';
import ReplaceManager from './components/ReplaceManager';
import { buttonStyle } from 'utils/btn';
import PasswordPermission from './components/PasswordPermission';
import { currencyOptions } from 'utils/options';
import useUserSession from 'hooks/useUserSession';
import { useRoles } from 'hooks/user/userRoles';
import Loader from 'components/loading/Loader';
import { getSalaryType } from 'schema/userSchema';
import ReplaceTeamLead from './components/ReplaceTeamLead';

const Edit = (props) => {
	const { isOpen, fetchData, data, userData, setEdit } = props;

	const { roles } = useRoles();

	const bgColor = useColorModeValue('white', 'gray.800');
	const headerBg = useColorModeValue('brand.300', 'brand.100');
	const headerText = useColorModeValue('brand.700', 'brand.900');
	const footerBg = useColorModeValue('gray.50', 'gray.700');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

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

	const [replacementManager, setReplacementManager] = useState('');
	const [replacementTeamLead, setReplacementTeamLead] = useState(null);
	const [securityPassword, setSecurityPassword] = useState('');

	const controller = new AbortController();

	const [uploadImage, setUploadImage] = useState(false);

	const { data: agencies } = useFetchItemsQuery({
		path: '/agencies',
	});

	const { data: tree, isLoading: teamLoading } = useFetchItemsQuery({
		path: '/v2/user/team-structure',
	});

	const initialValues = {
		firstName: data?.firstName ?? '',
		lastName: data?.lastName ?? '',
		username: data?.username ?? '',
		agency: data?.agency?._id ?? '',
		salary: data?.salary ?? '',
		commission: data?.commission ?? '',
		incentive: data?.incentive ?? '',
		salaryType: data?.salaryType ?? '',
		phoneNumber: data?.phoneNumber ?? '',
		profileImage: data?.profileImage ?? '',
		parent: data?.parent ?? '',
		target: data?.target ?? '',
		roles: data?.roles ?? [],
		role: data?.roles[0]?._id ?? '',
		currency: data?.currency || 'AED',
		teamLead: data?.teamLead || null,
	};

	const { user, isSuperAdmin } = useUserSession();

	// const [filteredAgents, setFilteredAgents] = useState([]);

	const managers = useMemo(() => tree?.data || [], [tree?.data]);

	// const handleManagerChange = (e) => {
	// 	const selectedManagerId = e.target.value;
	// 	handleChange(e); // Update form values
	// 	if (selectedManagerId) {
	// 		const agentsKey = `manager-${selectedManagerId}`;
	// 		const agentsList = tree?.agents[agentsKey] || [];

	// 		// filter only agents they have teamLeader is null
	// 		const filtered = agentsList?.filter((agent) => !agent?.teamLeader);
	// 		setFilteredAgents(filtered);
	// 	} else {
	// 		setFilteredAgents([]);
	// 	}
	// };

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: userSchema,
		enableReinitialize: true,
		onSubmit: (values, { resetForm }) => {
			EditData();
		},
	});

	useEffect(() => {
		if (props.edit) {
			// Replace initial Data with your actual initial values
			formik.setValues(initialValues);
		}
	}, [props.edit]);

	const dispatch = useDispatch();

	const handleCloseModal = () => {
		setEdit(false);
		formik.resetForm();
	};

	const {
		errors,
		touched,
		values,
		handleBlur,
		handleChange,
		handleSubmit,
		setFieldValue,
	} = formik;

	const [updateItemMutation, { isLoading }] = useUpdateItemMutation();

	const EditData = async () => {
		try {
			const role = roles?.find((role) => role?._id === values.role);
			const isAgentOrTeamLeadRole = ['Team Leader', 'Agent'].includes(
				role?.roleName
			);

			const valuesObj = { ...values };

			// when team lead role change to other role
			if (
				data?.roles[0]?.roleName === 'Team Leader' &&
				data?.roles[0]?.roleName !== role?.roleName &&
				!replacementTeamLead &&
				managerTeamLeaders?.length
			) {
				replaceLeadOnOpen();
				return;
			} else if (replacementTeamLead) {
				valuesObj['replacementTeamLead'] = replacementTeamLead;
			} else valuesObj['replacementTeamLead'] = null;

			if (
				data?.roles[0]?.roleName === 'Manager' &&
				data?.roles[0]?.roleName !== role?.roleName &&
				!replacementManager &&
				role?.roleName !== 'Agent'
			) {
				replaceOnOpen();
				return;
			} else if (replacementManager) {
				valuesObj['replacementManager'] = replacementManager;
			}

			if (isAgentOrTeamLeadRole) {
				if (!values.parent) {
					toast.error('Please select a manager.');
					return;
				}
				// // check agent team lead
				// if (!values.teamLead) {
				// 	toast.error('Please select a team leader.');
				// 	return;
				// }
				valuesObj['parent'] = values.parent;
				valuesObj['replacementManager'] = values.parent;

				setReplacementManager(values.parent);
			} else if (role?.roleName === 'Manager') {
				delete valuesObj['parent'];
			} else {
				delete valuesObj['parent'];
			}

			if (role?.roleName !== 'Agent') {
				delete valuesObj['teamLead'];
			}

			if (
				!securityPassword &&
				(data?.roles[0]?.roleName !== role?.roleName || values?.password)
			) {
				passwordOnOpen();
				return;
			}

			if (securityPassword)
				valuesObj['securityPassword'] = securityPassword?.trim();

			const bodyData = Object.entries(valuesObj).reduce((acc, [key, value]) => {
				if (value !== undefined && value !== null) {
					acc[key] =
						key === 'roles' && Array.isArray(value)
							? value.map((role) => role.roleName).filter(Boolean)
							: value;
				}
				return acc;
			}, {});

			let response = await updateItemMutation({
				path: `/user/v2/edit/${props.selectedId}`,
				body: bodyData,
			}).unwrap();

			if (response?.status) {
				setEdit(false);
				let updatedUserData = userData;
				if (user?._id === props.selectedId) {
					if (updatedUserData && typeof updatedUserData === 'object') {
						// Create a new object with the updated firstName
						updatedUserData = {
							...updatedUserData,
							firstName: values?.firstName,
							lastName: values?.lastName,
						};
					}

					// const updatedDataString = JSON.stringify(updatedUserData);

					dispatch(setUser(updatedUserData));
				}

				if (user?._id === props.selectedId && bodyData?.password) {
					console.warn('reeload the pagee');
					window.location.reload();
					localStorage.removeItem('token');
					localStorage.removeItem('user');
					localStorage.removeItem('accessToken');
				}

				if (props?.refrence === 'table') {
					props.updateUsers(response?.user);
				} else fetchData();

				// formik.resetForm();
				props.setAction((pre) => !pre);

				// get updated users data
				// fetchActiveTree(dispatch);
				// fetchTree(dispatch);

				if (!controller.signal.aborted) {
					toast.success('User update successfully');
					setReplacementManager('');
					setSecurityPassword('');
					handleCloseModal();
				}
			}
		} catch (e) {
			console.log(e);
			if (!controller.signal.aborted) {
				toast.error(e?.data?.message || 'User is not updated!');
				setReplacementManager('');
				setSecurityPassword('');
			}
		}
	};

	const managerTeamLeaders = useMemo(() => {
		return (
			managers
				?.find((m) => m?.managerId === values?.parent)
				?.teamLeaders?.filter((lead) => lead?._id !== props.selectedId) || []
		);
	}, [managers, values?.parent, props.selectedId]);

	return (
		<>
			<Modal
				size='5xl'
				isOpen={isOpen}
				isCentered
				scrollBehavior='inside'
				motionPreset='slideInBottom'
			>
				<ModalOverlay />
				<ModalContent
					bg={bgColor}
					borderRadius='2xl'
					shadow='2xl'
					overflow='hidden'
					mx={{ base: 3, md: 0 }}
				>
					<ModalHeader p={0} borderBottom='1px solid' borderColor={borderColor}>
						<Flex
							bg={headerBg}
							color={headerText}
							px={6}
							py={3}
							position='sticky'
							top='0'
							zIndex='10'
							boxShadow='md'
						>
							<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold'>
								Edit User
							</Text>
							<IconButton
								position='absolute'
								right='12px'
								top='10px'
								color={headerText}
								bg='whiteAlpha.200'
								size='sm'
								borderRadius={'md'}
								_hover={{ bg: 'whiteAlpha.300' }}
								onClick={handleCloseModal}
								isDisabled={uploadImage}
								icon={<CloseIcon />}
							/>
						</Flex>
					</ModalHeader>

					<ModalBody
						p={5}
						overflowY='auto'
						maxH='65vh'
						borderBottom='1px solid'
						borderColor={borderColor}
					>
						{teamLoading ? (
							<Box p={4} h={isSuperAdmin ? '60vh' : '50vh'}>
								<Loader />
							</Box>
						) : (
							<Grid
								h={isSuperAdmin ? '60vh' : '50vh'}
								overflow={'scroll'}
								templateColumns='repeat(12, 1fr)'
								gap={3}
								p={4}
							>
								<GridItem colSpan={12}>
									<ImageUpload
										profileImage={values?.profileImage}
										formik={formik}
										user={data}
										setUploadImage={setUploadImage}
									/>
								</GridItem>
								<GridItem colSpan={{ base: 6 }}>
									<FormLabel
										display='flex'
										ms='4px'
										fontSize='sm'
										fontWeight='500'
										mb='8px'
									>
										First Name
									</FormLabel>
									<Input
										fontSize='sm'
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.firstName}
										name='firstName'
										placeholder='firstName'
										fontWeight='500'
										borderColor={
											errors.firstName && touched.firstName ? 'red.300' : null
										}
									/>
									<Text mb='10px' color={'red'}>
										{errors.firstName && touched.firstName && errors.firstName}
									</Text>
								</GridItem>
								<GridItem colSpan={{ base: 6 }}>
									<FormLabel
										display='flex'
										ms='4px'
										fontSize='sm'
										fontWeight='500'
										mb='8px'
									>
										Last Name
									</FormLabel>
									<Input
										fontSize='sm'
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.lastName}
										name='lastName'
										placeholder='Last Name'
										fontWeight='500'
										borderColor={
											errors.lastName && touched.lastName ? 'red.300' : null
										}
									/>
									<Text mb='10px' color={'red'}>
										{errors.lastName && touched.lastName && errors.lastName}
									</Text>
								</GridItem>
								<GridItem colSpan={{ base: 6 }}>
									<FormLabel
										display='flex'
										ms='4px'
										fontSize='sm'
										fontWeight='500'
										mb='8px'
									>
										Phone Number<Text color={'red'}>*</Text>
									</FormLabel>
									<InputGroup>
										<InputLeftElement
											pointerEvents='none'
											children={
												<PhoneIcon color='gray.300' borderRadius='16px' />
											}
										/>
										<Input
											type='tel'
											fontSize='sm'
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.phoneNumber}
											name='phoneNumber'
											fontWeight='500'
											borderColor={
												errors.phoneNumber && touched.phoneNumber
													? 'red.300'
													: null
											}
											placeholder='Phone number'
											borderRadius='16px'
										/>
									</InputGroup>
									<Text mb='10px' color={'red'}>
										{errors.phoneNumber &&
											touched.phoneNumber &&
											errors.phoneNumber}
									</Text>
								</GridItem>
								{isSuperAdmin && (
									<>
										<GridItem colSpan={{ base: 6 }}>
											<FormLabel
												display='flex'
												ms='4px'
												fontSize='sm'
												fontWeight='500'
												mb='8px'
											>
												Email
											</FormLabel>
											<Input
												fontSize='sm'
												type='email'
												onChange={handleChange}
												onBlur={handleBlur}
												value={values.username}
												name='username'
												placeholder='Email Address'
												fontWeight='500'
												borderColor={
													errors.username && touched.username ? 'red.300' : null
												}
											/>
											<Text mb='10px' color={'red'}>
												{errors.username && touched.username && errors.username}
											</Text>
										</GridItem>
										<GridItem colSpan={{ base: 6 }}>
											<FormLabel
												display='flex'
												ms='4px'
												fontSize='sm'
												fontWeight='500'
												mb='8px'
											>
												Salary Type
											</FormLabel>
											<Select
												name='salaryType'
												value={values.salaryType}
												onChange={handleChange}
												onBlur={handleBlur}
												placeholder='Select salary type'
												borderColor={
													errors.salaryType && touched.salaryType
														? 'red.300'
														: null
												}
											>
												{salaryTypes?.map((job) => (
													<option key={job.value} value={job.value}>
														{job.label}
													</option>
												))}
											</Select>

											<Text mb='10px' color={'red'}>
												{errors.salaryType &&
													touched.salaryType &&
													errors.salaryType}
											</Text>
										</GridItem>
										<GridItem colSpan={{ base: 6 }}>
											<FormLabel
												display='flex'
												ms='4px'
												fontSize='sm'
												fontWeight='500'
												mb='8px'
											>
												Salary
											</FormLabel>
											<Input
												fontSize='sm'
												type='number'
												min={0}
												onChange={handleChange}
												onBlur={handleBlur}
												value={values.salary}
												name='salary'
												fontWeight='500'
												borderColor={
													errors.salary && touched.salary ? 'red.300' : null
												}
											/>
											<Text mb='10px' color={'red'}>
												{errors.salary && touched.salary && errors.salary}
											</Text>
										</GridItem>

										{getSalaryType(values.salaryType)?.hasCommission && (
											<GridItem colSpan={{ base: 6 }}>
												<FormLabel
													display='flex'
													ms='4px'
													fontSize='sm'
													fontWeight='500'
													mb='8px'
												>
													Commission
												</FormLabel>
												<Input
													fontSize='sm'
													type='number'
													onChange={handleChange}
													onBlur={handleBlur}
													value={values.commission}
													name='commission'
													fontWeight='500'
													borderColor={
														errors.commission && touched.commission
															? 'red.300'
															: null
													}
												/>
												<Text mb='10px' color={'red'}>
													{errors.commission &&
														touched.commission &&
														errors.commission}
												</Text>
											</GridItem>
										)}
										{getSalaryType(values.salaryType)?.hasIncentive && (
											<GridItem colSpan={{ base: 6 }}>
												<FormLabel
													display='flex'
													ms='4px'
													fontSize='sm'
													fontWeight='500'
													mb='8px'
												>
													Incentive
												</FormLabel>
												<Input
													fontSize='sm'
													type='number'
													min={0}
													onChange={handleChange}
													onBlur={handleBlur}
													value={values.incentive}
													name='incentive'
													fontWeight='500'
													borderColor={
														errors.incentive && touched.incentive
															? 'red.300'
															: null
													}
												/>
												<Text mb='10px' color={'red'}>
													{errors.incentive &&
														touched.incentive &&
														errors.incentive}
												</Text>
											</GridItem>
										)}

										<GridItem colSpan={{ base: 6 }}>
											<FormLabel
												display='flex'
												ms='4px'
												fontSize='sm'
												fontWeight='500'
												mb='8px'
											>
												Select Role <Text color={'red'}>*</Text>
											</FormLabel>
											<Select
												name='role'
												value={values.role}
												onChange={handleChange}
												onBlur={handleBlur}
												placeholder='Select Role'
												borderColor={
													errors.role && touched.role ? 'red.300' : null
												}
												className={
													errors.role && touched.role ? 'isInvalid' : null
												}
											>
												{roles?.map((role) => (
													<option key={role?._id} value={role?._id}>
														{role?.roleName}
													</option>
												))}
											</Select>
											<Text mb='10px' color='red'>
												{errors.role && touched.role && errors.role}
											</Text>
										</GridItem>
										{['Agent', 'Team Leader']?.includes(
											roles?.find((role) => role?._id === values.role)?.roleName
										) && (
											<GridItem colSpan={{ base: 6 }}>
												<FormLabel
													display='flex'
													ms='4px'
													fontSize='sm'
													fontWeight='500'
													mb='8px'
												>
													Manager <Text color={'red'}>*</Text>
												</FormLabel>
												<Select
													name='parent'
													value={values.parent}
													onChange={handleChange}
													onBlur={handleBlur}
													placeholder='Select Manager'
												>
													{/* <option
															value=''
															disabled
															style={{color: '#444'}}
													>
														Select Manager
													</option> */}
													{managers?.map((manager) => (
														<option
															key={manager?.managerId}
															value={manager?.managerId}
														>
															{manager?.managerName}
														</option>
													))}
												</Select>
											</GridItem>
										)}
										{['Agent']?.includes(
											roles?.find((role) => role?._id === values.role)?.roleName
										) && (
											<GridItem colSpan={{ base: 6 }}>
												<FormLabel
													display='flex'
													ms='4px'
													fontSize='sm'
													fontWeight='500'
													mb='8px'
												>
													Team Leader
												</FormLabel>
												<Select
													name='teamLead'
													value={values.teamLead}
													onChange={handleChange}
													onBlur={handleBlur}
													placeholder='Select Team Leader'
												>
													{managerTeamLeaders?.length ? (
														managerTeamLeaders?.map((tl) => (
															<option key={tl._id} value={tl._id}>
																{tl.fullName}
															</option>
														))
													) : (
														<option value='' disabled>
															Team leaders not available
														</option>
													)}
												</Select>
											</GridItem>
										)}

										<GridItem colSpan={{ base: 6 }}>
											<FormLabel
												display='flex'
												ms='4px'
												fontSize='sm'
												fontWeight='500'
												mb='8px'
											>
												Select agency <Text color={'red'}>*</Text>
											</FormLabel>
											<Select
												name='agency'
												value={values.agency}
												onChange={handleChange}
												onBlur={handleBlur}
												placeholder='Select agency'
												borderColor={
													errors.agency && touched.agency ? 'red.300' : null
												}
											>
												{agencies?.doc?.map((agency) => (
													<option key={agency._id} value={agency._id}>
														{agency.name}
													</option>
												))}
											</Select>

											<Text mb='10px' color={'red'}>
												{errors.agency && touched.agency && errors.agency}
											</Text>
										</GridItem>
									</>
								)}

								{(isSuperAdmin ||
									(user?.roles[0]?.roleName === 'Manager' &&
										user._id !== data._id)) && (
									<>
										<GridItem colSpan={{ base: 6 }}>
											<FormLabel
												display='flex'
												ms='4px'
												fontSize='sm'
												fontWeight='500'
												mb='8px'
											>
												Currency
											</FormLabel>
											<Select
												name='currency'
												value={values.currency}
												onChange={handleChange}
												onBlur={handleBlur}
												isDisabled
												placeholder='Select currency'
												borderColor={
													errors.currency && touched.currency ? 'red.300' : null
												}
											>
												{currencyOptions?.map((item) => (
													<option key={item.value} value={item.value}>
														{item.label}
													</option>
												))}
											</Select>

											<Text mb='10px' color={'red'}>
												{errors.currency && touched.currency && errors.currency}
											</Text>
										</GridItem>
										<GridItem colSpan={{ base: 6 }}>
											<FormLabel
												display='flex'
												ms='4px'
												fontSize='sm'
												fontWeight='500'
												mb='8px'
											>
												Target
											</FormLabel>
											<InputGroup>
												<Input
													type='number'
													fontSize='sm'
													onChange={handleChange}
													onBlur={handleBlur}
													value={values.target}
													name='target'
													fontWeight='500'
													placeholder='Target'
												/>
											</InputGroup>
										</GridItem>
									</>
								)}

								{isSuperAdmin && (
									<GridItem colSpan={{ base: 6 }}>
										<FormLabel
											display='flex'
											ms='4px'
											fontSize='sm'
											fontWeight='500'
											mb='8px'
										>
											New Password
										</FormLabel>
										<InputGroup>
											<Input
												type='text'
												fontSize='sm'
												onChange={handleChange}
												onBlur={handleBlur}
												value={values.password}
												name='password'
												fontWeight='500'
												placeholder='New Password'
												borderRadius='16px'
											/>
										</InputGroup>
									</GridItem>
								)}
							</Grid>
						)}
					</ModalBody>
					<ModalFooter
						position='sticky'
						bottom='0'
						bg={footerBg}
						borderTop='1px solid'
						borderColor={borderColor}
						py={3}
						px={5}
						zIndex='10'
						justifyContent='flex-end'
						gap={3}
					>
						<Button
							variant='outline'
							colorScheme='gray'
							size='sm'
							borderRadius='md'
							isDisabled={uploadImage}
							onClick={() => handleCloseModal()}
						>
							Close
						</Button>
						<Button
							{...buttonStyle}
							variant='solid'
							bg='brand.400'
							fontSize='md'
							aria-label='update'
							disabled={isLoading ? true : false}
							onClick={handleSubmit}
						>
							{isLoading ? <Spinner /> : 'Update'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{replaceIsOpen && (
				<ReplaceManager
					isOpen={replaceIsOpen}
					onClose={replaceOnClose}
					managers={managers}
					replacementManager={replacementManager}
					handleProceed={() => {
						replaceOnClose();
						EditData();
					}}
					setReplacementManager={setReplacementManager}
				/>
			)}

			{replaceLeadIsOpen && (
				<ReplaceTeamLead
					isOpen={replaceLeadIsOpen}
					onClose={replaceLeadOnClose}
					teamLeaders={managerTeamLeaders}
					replacementTeamLead={replacementTeamLead}
					handleProceed={() => {
						replaceLeadOnClose();
						EditData();
					}}
					setReplacementTeamLead={setReplacementTeamLead}
				/>
			)}

			{passwordIsOpen && (
				<PasswordPermission
					isOpen={passwordIsOpen}
					onClose={passwordOnClose}
					securityPassword={securityPassword}
					setSecurityPassword={setSecurityPassword}
					handleProceed={() => {
						passwordOnClose();
						EditData();
					}}
				/>
			)}
		</>
	);
};

export default Edit;
