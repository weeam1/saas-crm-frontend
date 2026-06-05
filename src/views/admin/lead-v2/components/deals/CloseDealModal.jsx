import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	VStack,
	Stack,
	Text,
	Box,
	Checkbox,
	Input,
	Icon,
	FormControl,
	FormLabel,
	HStack,
	SimpleGrid,
	Grid,
	useDisclosure,
} from '@chakra-ui/react';
import { useForm, useWatch } from 'react-hook-form';
import { FormInput } from 'components/fields/FormFields';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	useCreateItemMutation,
	useFetchItemsQuery,
	useUpdateItemMutation,
} from 'api/apiSlice';
import { toast } from 'react-toastify';
import {
	ALLOWED_FILE_TYPES,
	commissionStatuses,
	dealSchema,
	roundTo2,
} from './../../../deals/dealUtils';
import { FormSelect } from 'components/fields/FormFields';
import { FiRefreshCw, FiUploadCloud } from 'react-icons/fi';
import useUserSession from 'hooks/useUserSession';
import SearchUsers from './SearchUsers';
import { InfoIcon } from '@chakra-ui/icons';
import { currencies } from 'constants/currencies';
import { getSharedUsersData } from './dealUtils';
import CommissionSummary from './CommissionSummary';
import CurrencyConverterModal from './CurrencyConverter';
import { useModalColors } from 'hooks/useModalColors';

const CloseDealModal = React.memo(
	({
		isOpen,
		onClose,
		lead,
		initialData,
		onSuccess,
		mode = 'add',
	}) => {
		const colors = useModalColors();

		const {
			_id: leadId,
			leadName,
			leadPhoneNumber,
			leadWhatsappNumber,
			agentDetails,
			managerDetails,
			teamLeadDetails,
		} = lead || {};

		const { user, userRoleName, isSuperAdmin, isAdmin } = useUserSession();

		const [selectedType, setSelectedType] = useState('amount');

		const {
			isOpen: isCurrencyConverterOpen,
			onOpen: onCurrencyConverterOpen,
			onClose: onCurrencyConverterClose,
		} = useDisclosure();

		const { data: usersData } = useFetchItemsQuery(
			{
				path: '/v2/user/search_users',
			},
			{ refetchOnMountOrArgChange: true },
		);

		const phoneNumber =
			typeof leadPhoneNumber === 'object'
				? leadPhoneNumber?.result
				: leadPhoneNumber;
		const whatsappNumber =
			typeof leadWhatsappNumber === 'object'
				? leadWhatsappNumber?.result
				: leadWhatsappNumber;

		const defaultValues = useMemo(
			() => ({
				clientName: leadName || '',
				clientNumber: phoneNumber || '',
				clientWhatsapp: whatsappNumber || '',
				agentName: agentDetails?.fullName || 'Unassigned',
				teamLeadName: teamLeadDetails?.fullName || 'Unassigned',
				managerName: managerDetails?.fullName || 'Unassigned',
				closedBy: user?.fullName || '',

				developer: '',
				salesPerson: '',
				projectName: '',
				unitNumber: '',
				unitType: '',
				unitPrice: '',
				downpaymentPaid: 0,
				downpaymentPercent: 0,
				companyCommissionAmount: 0,
				companyCommissionPercent: 0,
				bookingAmountPaid: '',
				bookingPercent: '',
				spaDone: false,
				invoiceSent: false,
				file: null,
				commissionStatus: '',
				currency: 'AED',
				shareUser: null,
				sharePercent: '',
			}),
			[
				agentDetails?.fullName,
				managerDetails?.fullName,
				teamLeadDetails?.fullName,
				leadName,
				phoneNumber,
				user?.fullName,
				whatsappNumber,
			],
		);

		const {
			register,
			handleSubmit,
			formState: { errors, isValid, isDirty },
			reset,
			watch,
			setValue,
			control,
			trigger,
		} = useForm({
			resolver: yupResolver(dealSchema),
			defaultValues,
			mode: 'onChange',
			reValidateMode: 'onChange',
		});

		useEffect(() => {
			if (mode === 'edit' && initialData) {
				reset({
					...defaultValues,

					developer: initialData?.developer || '',
					salesPerson: initialData?.salesPerson || '',
					projectName: initialData?.projectName || '',
					unitNumber: initialData?.unitNumber || '',
					unitType: initialData?.unitType || '',
					unitPrice: initialData?.unitPrice || '',
					lead: initialData?.lead?._id || '',

					downpaymentPaid: initialData?.downpaymentPaid || 0,
					bookingAmountPaid: initialData?.bookingAmountPaid || 0,

					companyCommissionAmount: initialData?.companyCommissionAmount || 0,
					companyCommissionPercent: initialData?.companyCommissionPercent || 0,

					commissionStatus: initialData?.commissionStatus || '',
					spaDone: initialData?.spaDone || false,
					invoiceSent: initialData?.invoiceSent || false,

					shareUser: initialData?.shareUser?._id || null,
					sharePercent: initialData?.sharePercent || '',
				});

				setSelectedType(
					initialData?.companyCommissionPercent ? 'percent' : 'amount',
				);
			}
		}, [initialData, mode, reset, defaultValues]);

		const handleCommissionTypeChange = (e) => {
			const value = e.target.value;
			setSelectedType(value);

			if (value === 'percent') {
				setValue('companyCommissionAmount', 0);
			}

			if (value === 'amount') {
				setValue('companyCommissionPercent', 0);
			}
		};

		const unitPrice = watch('unitPrice');
		const downpaymentPaid = useWatch({ control, name: 'downpaymentPaid' });
		const bookingAmountPaid = useWatch({ control, name: 'bookingAmountPaid' });
		const companyCommissionAmount = useWatch({
			control,
			name: 'companyCommissionAmount',
		});
		const companyCommissionPercent = useWatch({
			control,
			name: 'companyCommissionPercent',
		});
		const shareUser = useWatch({ control, name: 'shareUser' });
		const sharePercent = useWatch({ control, name: 'sharePercent' });

		const sharedUsers = useMemo(() => {
			if (!lead || !unitPrice) return [];

			return getSharedUsersData({
				lead,
				user,
				unitPrice,
				companyCommissionAmount,
				companyCommissionPercent,
				shareUserId: shareUser,
				sharePercent,
				users: usersData?.doc || [],
			});
		}, [
			lead,
			user,
			unitPrice,
			companyCommissionAmount,
			companyCommissionPercent,
			shareUser,
			sharePercent,
			usersData?.doc,
		]);

		const downpaymentPercent = unitPrice
			? roundTo2(((parseFloat(downpaymentPaid) || 0) / unitPrice) * 100)
			: 0;

		const bookingPercent = unitPrice
			? roundTo2(((parseFloat(bookingAmountPaid) || 0) / unitPrice) * 100)
			: 0;

		const [createDeal, { isLoading: isCreating }] = useCreateItemMutation();
		const [updateDeal, { isLoading: isUpdating }] = useUpdateItemMutation();

		const handleClose = () => {
			reset();
			onClose();
		};

		const handleCreateDeal = async (data) => {
			try {
				await createDeal({ path: '/deals', body: data }).unwrap();
				toast.success('Deal was closed successfully');
				reset();
				onSuccess?.();
				handleClose();
			} catch (error) {
				console.log(error);
				toast.error(error?.data?.message || 'Deal is not created!');
			}
		};

		const handleEditDeal = async (data) => {
			try {
				const res = await updateDeal({
					path: `/deals/${initialData?._id}`,
					body: data,
				}).unwrap();

				toast.success('Deal was updated successfully');
				reset();
				onSuccess?.(res?.doc);
				handleClose();
			} catch (error) {
				console.log(error);
				toast.error(error?.data?.message || 'Deal is not updated!');
			}
		};

		const handleSelectUser = (selectedUser) => {
			if (selectedUser?._id) {
				setValue('shareUser', selectedUser._id);
				trigger('sharePercent');
			} else {
				setValue('shareUser', null);
				setValue('sharePercent', null);
			}
		};

		const handleFormSubmit = (data) => {
			const formData = new FormData();

			formData.append('developer', data.developer);
			formData.append('salesPerson', data.salesPerson);
			formData.append('projectName', data.projectName);
			formData.append('unitNumber', data.unitNumber);
			formData.append('unitType', data.unitType);
			formData.append('unitPrice', data.unitPrice);
			formData.append('downpaymentPaid', data.downpaymentPaid);
			formData.append('bookingAmountPaid', data.bookingAmountPaid);
			formData.append('spaDone', data.spaDone);
			formData.append('invoiceSent', data.invoiceSent);
			formData.append('commissionStatus', data.commissionStatus);
			formData.append('downpaymentPercent', downpaymentPercent);
			formData.append(
				'companyCommissionPercent',
				data.companyCommissionPercent || 0,
			);
			formData.append(
				'companyCommissionAmount',
				data.companyCommissionAmount || 0,
			);
			formData.append('bookingPercent', bookingPercent);
			formData.append('manager', lead?.managerAssigned || '');
			formData.append('teamLead', lead?.teamLeadAssigned || '');
			formData.append('agent', lead?.agentAssigned || '');
			formData.append('lead', leadId);

			if (data.shareUser) {
				formData.append('shareUser', data.shareUser);
				formData.append('sharePercent', data.sharePercent);
				formData.append('sharedUsers', JSON.stringify(sharedUsers));
			}

			if (data.file && data.invoiceSent) {
				formData.append('file', data.file);
			} else if (!data?.file && data.invoiceSent && mode === 'add') {
				return toast.error('Invoice document not uploaded!');
			}

			if (mode === 'add') {
				handleCreateDeal(formData);
			} else {
				handleEditDeal(formData);
			}
		};

		const fileInputRef = useRef(null);
		const [fileName, setFileName] = useState('');

		const filteredSearchUsers = (usersData?.doc || []).filter((u) => {
			const role = u?.roles?.[0]?.roleName;

			if (!role) return false;

			const allowedRoles = ['Manager', 'Agent', 'Team Leader'];

			const excludedIds = new Set([
				user._id,
				lead?.agentAssigned,
				lead?.managerAssigned,
				lead?.teamLeadAssigned,
			]);

			return allowedRoles.includes(role) && !excludedIds.has(u._id);
		});

		const handleFileSelect = (event) => {
			const file = event.target.files[0];

			if (!file) return;

			const isValidType = ALLOWED_FILE_TYPES.includes(file.type);
			const isValidSize = file.size <= 5 * 1024 * 1024;

			if (!isValidType) {
				toast.error('Only PDF, DOC, DOCX files are allowed.');
				return (event.target.value = null);
			}

			if (!isValidSize) {
				toast.error('Maximum allowed size is 5MB.');
				return (event.target.value = null);
			}

			setValue('file', file);
			setFileName(file.name);
			event.target.value = null;
		};

		return (
			<Modal isOpen={isOpen} onClose={handleClose} size='6xl' isCentered>
				<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(2px)' />
				<ModalContent
					borderRadius='xl'
					boxShadow={colors.modalShadow}
					m='2'
					bg={colors.bg}
				>
					<ModalHeader
						bg={colors.headerBg}
						borderTopRadius='xl'
						py={4}
						fontSize='md'
						fontWeight='bold'
						color={colors.headerText}
						borderBottom='1px solid'
						borderColor={colors.borderColor}
					>
						{mode === 'add' ? 'Close Deal' : 'Edit Deal'}
					</ModalHeader>
					<ModalCloseButton
						color={colors.closeBtnColor}
						_hover={{ bg: colors.closeBtnHoverBg }}
					/>

					<ModalBody
						py={6}
						px={6}
						overflowY='auto'
						maxH={{ base: '50vh', md: '70vh' }}
						bg={colors.bg}
					>
						<VStack spacing={6} align='stretch'>
							{/* Lead Information */}
							{mode === 'add' && (
								<Box
									p={4}
									bg={colors.bgDeep}
									borderRadius='xl'
									border='1px solid'
									borderColor={colors.borderColor}
								>
									<Text
										fontSize='md'
										fontWeight='bold'
										color={colors.accentGold}
										mb={3}
									>
										Lead Information
									</Text>
									<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
										<FormInput
											label='Client Name'
											name='clientName'
											register={register}
											errors={errors}
											isRequired
											isDisabled
											inputProps={{
												bg: colors.bgInput,
												borderColor: colors.borderColor,
												color: colors.headingText,
												_hover: { borderColor: colors.accentGold },
												_focus: {
													borderColor: colors.accentGold,
													boxShadow: `0 0 0 1px ${colors.accentGold}`,
												},
											}}
											labelColor={colors.labelColor}
										/>

										{userRoleName !== 'Manager' && (
											<FormInput
												label='Client Contact'
												name='clientNumber'
												register={register}
												errors={errors}
												isRequired
												isDisabled
												inputProps={{
													bg: colors.bgInput,
													borderColor: colors.borderColor,
													color: colors.headingText,
												}}
												labelColor={colors.labelColor}
											/>
										)}

										<FormInput
											label='Manager'
											name='managerName'
											register={register}
											errors={errors}
											isDisabled
											isRequired
											inputProps={{
												bg: colors.bgInput,
												borderColor: colors.borderColor,
												color: colors.headingText,
											}}
											labelColor={colors.labelColor}
										/>
										<FormInput
											label='Team Lead'
											name='teamLeadName'
											register={register}
											errors={errors}
											isDisabled
											isRequired
											inputProps={{
												bg: colors.bgInput,
												borderColor: colors.borderColor,
												color: colors.headingText,
											}}
											labelColor={colors.labelColor}
										/>
										<FormInput
											label='Agent'
											name='agentName'
											register={register}
											errors={errors}
											isDisabled
											isRequired
											inputProps={{
												bg: colors.bgInput,
												borderColor: colors.borderColor,
												color: colors.headingText,
											}}
											labelColor={colors.labelColor}
										/>
									</SimpleGrid>
								</Box>
							)}

							{/* Property Information */}
							<Box
								p={4}
								bg={colors.bgDeep}
								borderRadius='xl'
								border='1px solid'
								borderColor={colors.borderColor}
							>
								<Text
									fontSize='md'
									fontWeight='bold'
									color={colors.accentGold}
									mb={3}
								>
									Property Information
								</Text>
								<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
									<FormInput
										label='Developer'
										name='developer'
										register={register}
										errors={errors}
										isRequired
										inputProps={{
											bg: colors.bgInput,
											borderColor: colors.borderColor,
											color: colors.headingText,
											_hover: { borderColor: colors.accentGold },
											_focus: {
												borderColor: colors.accentGold,
												boxShadow: `0 0 0 1px ${colors.accentGold}`,
											},
										}}
										labelColor={colors.labelColor}
									/>
									<FormInput
										label='Sales Person'
										name='salesPerson'
										register={register}
										errors={errors}
										isRequired
										inputProps={{
											bg: colors.bgInput,
											borderColor: colors.borderColor,
											color: colors.headingText,
											_hover: { borderColor: colors.accentGold },
											_focus: {
												borderColor: colors.accentGold,
												boxShadow: `0 0 0 1px ${colors.accentGold}`,
											},
										}}
										labelColor={colors.labelColor}
									/>
									<FormInput
										label='Project Name'
										name='projectName'
										register={register}
										errors={errors}
										isRequired
										inputProps={{
											bg: colors.bgInput,
											borderColor: colors.borderColor,
											color: colors.headingText,
											_hover: { borderColor: colors.accentGold },
											_focus: {
												borderColor: colors.accentGold,
												boxShadow: `0 0 0 1px ${colors.accentGold}`,
											},
										}}
										labelColor={colors.labelColor}
									/>
									<FormInput
										label='Unit Number'
										name='unitNumber'
										register={register}
										errors={errors}
										isRequired
										inputProps={{
											bg: colors.bgInput,
											borderColor: colors.borderColor,
											color: colors.headingText,
											_hover: { borderColor: colors.accentGold },
											_focus: {
												borderColor: colors.accentGold,
												boxShadow: `0 0 0 1px ${colors.accentGold}`,
											},
										}}
										labelColor={colors.labelColor}
									/>
									<FormInput
										label='Unit Type'
										name='unitType'
										register={register}
										errors={errors}
										isRequired
										inputProps={{
											bg: colors.bgInput,
											borderColor: colors.borderColor,
											color: colors.headingText,
											_hover: { borderColor: colors.accentGold },
											_focus: {
												borderColor: colors.accentGold,
												boxShadow: `0 0 0 1px ${colors.accentGold}`,
											},
										}}
										labelColor={colors.labelColor}
									/>
									<FormInput
										label='Unit Price'
										name='unitPrice'
										register={register}
										errors={errors}
										type='number'
										step='0.01'
										isRequired
										inputProps={{
											bg: colors.bgInput,
											borderColor: colors.borderColor,
											color: colors.headingText,
											_hover: { borderColor: colors.accentGold },
											_focus: {
												borderColor: colors.accentGold,
												boxShadow: `0 0 0 1px ${colors.accentGold}`,
											},
										}}
										labelColor={colors.labelColor}
									/>
								</SimpleGrid>
							</Box>

							{watch('unitPrice') !== defaultValues.unitPrice && (
								<HStack
									spacing={2}
									bg={colors.badgeInfoBg}
									p={3}
									borderRadius='md'
									align='start'
									border='1px solid'
									borderColor={colors.badgeInfoBorder}
								>
									<InfoIcon color={colors.badgeInfoText} mt={1} />
									<Text fontSize='sm' color={colors.bodyText}>
										Changing <b>Unit Price</b> will recalculate and affect{' '}
										<b>Downpayment Paid</b>, <b>Booking Amount Paid</b>, and{' '}
										<b>Company Commission</b>. Please ensure all values remain
										correct after adjustment.
									</Text>
								</HStack>
							)}

							{/* Commission Details */}
							<Box
								p={4}
								bg={colors.bgDeep}
								borderRadius='xl'
								border='1px solid'
								borderColor={colors.borderColor}
							>
								<Text
									fontSize='md'
									fontWeight='bold'
									color={colors.accentGold}
									mb={3}
								>
									Commission Details
								</Text>
								<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
									<FormSelect
										label='Commission Type'
										name='commissionType'
										value={selectedType}
										isRequired
										options={[
											{ label: 'Percent', value: 'percent' },
											{ label: 'Flat Amount', value: 'amount' },
										]}
										onChange={handleCommissionTypeChange}
										selectProps={{
											bg: colors.bgInput,
											borderColor: colors.borderColor,
											color: colors.headingText,
											_hover: { borderColor: colors.accentGold },
										}}
										labelColor={colors.labelColor}
									/>

									{selectedType === 'percent' && (
										<FormInput
											label='Company Commission (%)'
											name='companyCommissionPercent'
											register={register}
											errors={errors}
											type='number'
											step='0.01'
											isRequired
											inputProps={{
												bg: colors.bgInput,
												borderColor: colors.borderColor,
												color: colors.headingText,
												_hover: { borderColor: colors.accentGold },
												_focus: {
													borderColor: colors.accentGold,
													boxShadow: `0 0 0 1px ${colors.accentGold}`,
												},
											}}
											labelColor={colors.labelColor}
										/>
									)}

									{selectedType === 'amount' && (
										<FormInput
											label='Company Commission'
											name='companyCommissionAmount'
											register={register}
											errors={errors}
											type='number'
											step='0.01'
											isRequired
											inputProps={{
												bg: colors.bgInput,
												borderColor: colors.borderColor,
												color: colors.headingText,
												_hover: { borderColor: colors.accentGold },
												_focus: {
													borderColor: colors.accentGold,
													boxShadow: `0 0 0 1px ${colors.accentGold}`,
												},
											}}
											labelColor={colors.labelColor}
										/>
									)}

									<FormSelect
										label='Commission Status'
										name='commissionStatus'
										register={register}
										errors={errors}
										options={commissionStatuses}
										placeholder='Select status'
										selectProps={{
											bg: colors.bgInput,
											borderColor: colors.borderColor,
											color: colors.headingText,
											_hover: { borderColor: colors.accentGold },
										}}
										labelColor={colors.labelColor}
									/>
								</SimpleGrid>
							</Box>

							{/* Shared Deal Section */}
							<Box
								p={4}
								bg={colors.bgDeep}
								borderRadius='xl'
								border='1px solid'
								borderColor={colors.borderColor}
							>
								<Text
									fontSize='md'
									fontWeight='bold'
									color={colors.accentGold}
									mb={3}
								>
									Is Shared Deal ?
								</Text>
								<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
									<Box>
										<FormLabel
											fontSize='sm'
											fontWeight='semibold'
											color={colors.labelColor}
										>
											Share With User
										</FormLabel>
										<SearchUsers
											selectedUserId={shareUser}
											users={filteredSearchUsers}
											onSelectUser={handleSelectUser}
											isMobile={false}
											size='sm'
										/>
									</Box>
									{shareUser && (
										<FormInput
											label='Share Percentage'
											name='sharePercent'
											register={register}
											errors={errors}
											type='number'
											step='0.01'
											min='0.01'
											max='100.00'
											isRequired
											inputProps={{
												bg: colors.bgInput,
												borderColor: colors.borderColor,
												color: colors.headingText,
												_hover: { borderColor: colors.accentGold },
												_focus: {
													borderColor: colors.accentGold,
													boxShadow: `0 0 0 1px ${colors.accentGold}`,
												},
											}}
											labelColor={colors.labelColor}
										/>
									)}
								</SimpleGrid>
							</Box>

							<CommissionSummary sharedUsers={sharedUsers} />

							{/* Payment Details */}
							<Box
								p={4}
								bg={colors.bgDeep}
								borderRadius='xl'
								border='1px solid'
								borderColor={colors.borderColor}
							>
								<Text
									fontSize='md'
									fontWeight='bold'
									color={colors.accentGold}
									mb={3}
								>
									Payment Details
								</Text>
								<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
									<FormInput
										label='Downpayment Paid'
										name='downpaymentPaid'
										register={register}
										errors={errors}
										type='number'
										step='0.01'
										inputProps={{
											bg: colors.bgInput,
											borderColor: colors.borderColor,
											color: colors.headingText,
											_hover: { borderColor: colors.accentGold },
											_focus: {
												borderColor: colors.accentGold,
												boxShadow: `0 0 0 1px ${colors.accentGold}`,
											},
										}}
										labelColor={colors.labelColor}
									/>
									<VStack align='start' spacing={1} minW='180px'>
										<Text fontWeight='semibold' fontSize='sm' color={colors.labelColor}>
											Downpayment %
										</Text>
										<Text
											fontSize='sm'
											p={2}
											w='full'
											bg={colors.bgInput}
											borderRadius='md'
											color={colors.bodyText}
										>
											{downpaymentPercent.toFixed(2)}%
										</Text>
									</VStack>
									<FormInput
										label='Booking Amount Paid'
										name='bookingAmountPaid'
										register={register}
										errors={errors}
										type='number'
										step='0.01'
										isRequired
										inputProps={{
											bg: colors.bgInput,
											borderColor: colors.borderColor,
											color: colors.headingText,
											_hover: { borderColor: colors.accentGold },
											_focus: {
												borderColor: colors.accentGold,
												boxShadow: `0 0 0 1px ${colors.accentGold}`,
											},
										}}
										labelColor={colors.labelColor}
									/>
									<VStack align='start' spacing={1} minW='180px'>
										<Text fontWeight='semibold' fontSize='sm' color={colors.labelColor}>
											Booking %
										</Text>
										<Text
											p={2}
											w='full'
											bg={colors.bgInput}
											borderRadius='md'
											color={colors.bodyText}
											fontSize='sm'
										>
											{bookingPercent.toFixed(2)}%
										</Text>
									</VStack>
								</SimpleGrid>

								<SimpleGrid
									columns={{ base: 1, md: 2 }}
									alignItems='flex-end'
									spacing={4}
									mb={4}
								>
									<FormSelect
										label='Currency'
										name='currency'
										register={register}
										errors={errors}
										isDisabled
										isRequired
										options={currencies}
										selectProps={{
											bg: colors.bgInput,
											borderColor: colors.borderColor,
											color: colors.headingText,
										}}
										labelColor={colors.labelColor}
									/>

									<Button
										leftIcon={<FiRefreshCw />}
										size='sm'
										variant='outline'
										maxW='250px'
										onClick={onCurrencyConverterOpen}
										borderColor={colors.borderColor}
										color={colors.bodyText}
										_hover={{
											borderColor: colors.accentGold,
											color: colors.accentGold,
											bg: colors.secondaryBtnHoverBg,
										}}
									>
										Convert
									</Button>
								</SimpleGrid>

								{/* Extra Info & Upload */}
								<Box>
									<HStack spacing={6} align='start' mb={4}>
										<Checkbox
											{...register('invoiceSent')}
											colorScheme='yellow'
											size='md'
											iconColor={colors.headerText}
											sx={{
												'.chakra-checkbox__control': {
													borderColor: colors.borderColor,
													_hover: { borderColor: colors.accentGold },
												},
											}}
										>
											<Text color={colors.bodyText}>Invoice Sent</Text>
										</Checkbox>
										<Checkbox
											{...register('spaDone')}
											colorScheme='yellow'
											size='md'
											iconColor={colors.headerText}
											sx={{
												'.chakra-checkbox__control': {
													borderColor: colors.borderColor,
													_hover: { borderColor: colors.accentGold },
												},
											}}
										>
											<Text color={colors.bodyText}>SPA Document Signed</Text>
										</Checkbox>
									</HStack>

									{useWatch({ control, name: 'invoiceSent' }) && (
										<FormControl mt={4}>
											<FormLabel
												fontSize='sm'
												fontWeight='medium'
												color={colors.labelColor}
											>
												Upload Invoice
											</FormLabel>
											<Box
												as='button'
												onClick={() => fileInputRef.current?.click()}
												border='2px dashed'
												borderColor={colors.borderColor}
												p={5}
												rounded='md'
												textAlign='center'
												bg={colors.bgInput}
												w='100%'
												_hover={{
													borderColor: colors.accentGold,
													bg: colors.bgInputHover
												}}
												transition='all 0.2s ease'
											>
												<VStack spacing={1}>
													<Icon
														as={FiUploadCloud}
														boxSize={6}
														color={colors.accentGold}
													/>
													<Text fontSize='sm' color={colors.bodyText}>
														Click to upload
													</Text>
													<Text fontSize='xs' color={colors.mutedText}>
														Only PDF, DOC, DOCX — Max 5MB
													</Text>
													{fileName && (
														<Text
															fontSize='sm'
															maxW='200px'
															isTruncated
															color={colors.accentGold}
															mt={1}
														>
															📄 {fileName}
														</Text>
													)}
												</VStack>
											</Box>
											<Input
												type='file'
												hidden
												accept='.pdf,.doc,.docx'
												ref={fileInputRef}
												onChange={handleFileSelect}
											/>
										</FormControl>
									)}
								</Box>
							</Box>
						</VStack>
					</ModalBody>

					<ModalFooter
						bg={colors.footerBg}
						borderBottomRadius='xl'
						px={6}
						py={4}
						borderTop='1px solid'
						borderColor={colors.borderColor}
					>
						<Button
							onClick={handleClose}
							variant='ghost'
							size='md'
							mr={3}
							color={colors.bodyText}
							_hover={{
								bg: colors.secondaryBtnHoverBg,
								color: colors.headingText
							}}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit(handleFormSubmit)}
							variant='brand'
							size='md'
							isLoading={isCreating || isUpdating}
							isDisabled={!isValid || !isDirty}
						>
							{mode === 'add' ? 'Create Deal' : 'Save Changes'}
						</Button>
					</ModalFooter>
				</ModalContent>

				<CurrencyConverterModal
					isOpen={isCurrencyConverterOpen}
					onClose={onCurrencyConverterClose}
				/>
			</Modal>
		);
	},
);

CloseDealModal.displayName = 'CloseDealModal';

export default CloseDealModal;