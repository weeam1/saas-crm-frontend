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
	Flex,
	IconButton,
} from '@chakra-ui/react';
import { useForm, useWatch } from 'react-hook-form';
import { FormInput } from 'components/fields/FormFields';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import {
	ALLOWED_FILE_TYPES,
	commissionStatuses,
	dealSchema,
	// currencies,
	roundTo2,
} from '../dealUtils';
import { FormSelect } from 'components/fields/FormFields';
import { FiUploadCloud } from 'react-icons/fi';
import { useUpdateItemMutation } from 'api/apiSlice';
import { CloseIcon } from '@chakra-ui/icons';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import { currencies } from 'constants/currencies';

const EditDealModal = React.memo(
	({ isOpen, onClose, initialData, onSuccess }) => {
		const [updateDeal, { isLoading: isUpdating }] = useUpdateItemMutation();

		const defaultValues = useMemo(
			() => ({
				developer: '',
				salesPerson: '',
				projectName: '',
				unitNumber: '',
				unitType: '',
				unitPrice: '',
				downpaymentPaid: '',
				downpaymentPercent: '',
				bookingAmountPaid: '',
				bookingPercent: '',
				spaDone: false,
				invoiceSent: false,
				file: null,
				commissionStatus: '',
				currency: 'AED',
			}),
			[]
		);

		const {
			register,
			handleSubmit,
			formState: { errors, isValid, isDirty },
			reset,
			watch,
			setValue,
			control,
		} = useForm({
			resolver: yupResolver(dealSchema),
			defaultValues,
			mode: 'onChange',
		});

		useEffect(() => {
			if (initialData) {
				const { invoiceUrl, ...rest } = initialData;

				reset({
					...rest,
					file: invoiceUrl ?? null,
				});
			}
		}, [initialData, reset]);

		const { user } = useUserSession();
		const { createUserLog } = useUserActivityLog();

		const dealId = initialData._id;
		const fileInputRef = useRef(null);

		const invoiceSent = useWatch({ control, name: 'invoiceSent' });
		const file = useWatch({ control, name: 'file' });

		const fileName = useMemo(() => {
			if (typeof file === 'string') {
				try {
					return decodeURIComponent(file.split('/').pop());
				} catch {
					return file;
				}
			}
			if (file instanceof File) {
				return file.name;
			}
			return null;
		}, [file]);

		// Calculate derived values
		const unitPrice = watch('unitPrice');
		const downpaymentPaid = useWatch({ control, name: 'downpaymentPaid' });
		const bookingAmountPaid = useWatch({ control, name: 'bookingAmountPaid' });

		const downpaymentPercent = unitPrice
			? roundTo2(((parseFloat(downpaymentPaid) || 0) / unitPrice) * 100)
			: 0;

		const bookingPercent = unitPrice
			? roundTo2(((parseFloat(bookingAmountPaid) || 0) / unitPrice) * 100)
			: 0;

		// Handle modal close
		const handleClose = () => {
			reset();
			onClose();
		};

		const handleEditDeal = async (data) => {
			try {
				const res = await updateDeal({
					path: `/deals/${dealId}`,
					body: data,
				}).unwrap();

				toast.success('Deal updated successfully');

				handleClose();

				if (res?.doc) {
					onSuccess(res.doc);

					createUserLog({
						userId: user?._id,
						action: 'UPDATE',
						entity: 'Deals',
						enityType: 'CloseDeal',
						entityId: dealId || null,
						status: 'success',
						message: `${res?.doc?.lead?.leadName || ''} Deal updated by ${user?.fullName}`,
					});
				}
			} catch (error) {
				console.log(error);
				const errorMsg = error?.data?.message || 'Error: Deal is not updated!';
				toast.error(errorMsg);

				createUserLog({
					userId: user?._id,
					action: 'UPDATE',
					entity: 'Deals',
					enityType: 'CloseDeal',
					entityId: dealId || null,
					status: error?.status === 500 ? 'error' : 'fail',
					message: errorMsg,
				});
			}
		};

		// Form submission
		const handleFormSubmit = (data) => {
			const formData = new FormData();

			// Define fields to exclude
			const excludedFields = ['lead', 'agent', 'manager', 'closedBy'];

			// Compare submitted data with initial data to find changed fields
			const changedFields = {};
			Object.keys(data).forEach((key) => {
				// Skip excluded fields and file field for comparison
				if (
					!excludedFields.includes(key) &&
					key !== 'file' &&
					data[key] !== initialData[key]
				) {
					changedFields[key] = data[key];
				}
			});

			// Append only changed fields to FormData
			Object.keys(changedFields).forEach((key) => {
				formData.append(key, changedFields[key]);
			});

			// Append computed percentages (if they are always required)
			formData.append('downpaymentPercent', downpaymentPercent);
			formData.append('bookingPercent', bookingPercent);

			// Handle file field
			if (data.file instanceof File && data.invoiceSent) {
				formData.append('file', data.file);
			} else if (!data.file && data.invoiceSent) {
				return toast.error('Invoice document not uploaded!');
			}

			// Submission
			handleEditDeal(formData);
		};

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
			// setFileName(file.name);

			// finally clear the event
			event.target.value = null;
		};

		return (
			<Modal isOpen={isOpen} onClose={handleClose} size='6xl' isCentered>
				<ModalOverlay backdropFilter='blur(2px)' />
				<ModalContent borderRadius='xl' boxShadow='xl' m='2'>
					<ModalHeader
						bg='brand.50'
						borderTopRadius='xl'
						py={3}
						fontSize='md'
						fontWeight='bold'
						color='brand.700'
					>
						Edit Closed Deal
					</ModalHeader>
					<ModalCloseButton />

					<ModalBody py={4}>
						<Grid
							templateColumns={{ base: '1fr', lg: '1fr 500px' }}
							gap={4}
							p={4}
							overflowY='auto'
							maxH={{ base: '50vh', md: '60vh' }}
						>
							{/* Left Column */}
							<Box>
								{/* Property Information */}
								<Box mb={6}>
									<Text fontSize='md' fontWeight='bold' color='gray.600' mb={3}>
										Property Information
									</Text>
									<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
										<FormInput
											label='Developer'
											name='developer'
											register={register}
											errors={errors}
											isRequired
										/>
										<FormInput
											label='Sales Person'
											name='salesPerson'
											register={register}
											errors={errors}
											isRequired
										/>
										<FormInput
											label='Project Name'
											name='projectName'
											register={register}
											errors={errors}
											isRequired
										/>
										<FormInput
											label='Unit Number'
											name='unitNumber'
											register={register}
											errors={errors}
											isRequired
										/>
										<FormInput
											label='Unit Type'
											name='unitType'
											register={register}
											errors={errors}
											isRequired
										/>
										{/* <FormInput
											label='Unit Price'
											name='unitPrice'
											register={register}
											errors={errors}
											type='number'
											step='0.01'
											isRequired
										/> */}
									</SimpleGrid>
								</Box>
							</Box>

							{/* Right Column */}
							<Box>
								{/* Payment Details */}
								<Box mb={6}>
									<Text fontSize='md' fontWeight='bold' color='gray.600' mb={3}>
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
											isRequired
										/>
										<VStack align='start' spacing={1} minW='180px'>
											<Text
												fontWeight='semibold'
												fontSize='sm'
												color='gray.600'
											>
												Downpayment %
											</Text>
											<Text fontSize='sm' p={2} w='full' bg='gray.100'>
												{downpaymentPercent.toFixed(2)}%
											</Text>
										</VStack>
										{/* <FormInput
											label='Booking Amount Paid'
											name='bookingAmountPaid'
											register={register}
											errors={errors}
											type='number'
											step='0.01'
											isRequired
										/> */}
										{/* <VStack align='start' spacing={1} minW='180px'>
											<Text
												fontWeight='semibold'
												fontSize='sm'
												color='gray.600'
											>
												Booking %
											</Text>
											<Text p={2} w='full' bg='gray.100' fontSize='sm'>
												{bookingPercent.toFixed(2)}%
											</Text>
										</VStack> */}
									</SimpleGrid>

									<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
										<FormSelect
											label='Currency'
											name='currency'
											register={register}
											errors={errors}
											isDisabled
											isRequired
											options={currencies}
										/>
										<FormSelect
											label='Commission Status'
											name='commissionStatus'
											register={register}
											errors={errors}
											isRequired
											options={commissionStatuses}
											placeholder='Select status'
										/>
									</SimpleGrid>
								</Box>

								{/* Extra Info & Upload */}
								<Box>
									<HStack spacing={6} align='start' mb={4}>
										<Checkbox
											{...register('invoiceSent')}
											colorScheme='brand'
											size='md'
										>
											Invoice Sent
										</Checkbox>
										<Checkbox
											{...register('spaDone')}
											colorScheme='brand'
											size='md'
										>
											SPA Document Signed
										</Checkbox>
									</HStack>

									{invoiceSent && (
										<FormControl mt={4}>
											<FormLabel
												fontSize='sm'
												fontWeight='medium'
												color='gray.600'
											>
												Upload Invoice
											</FormLabel>
											<Box
												as='button'
												onClick={() => {
													if (file === null) fileInputRef.current?.click();
												}}
												// onClick={() => fileInputRef.current?.click()}
												border='2px dashed'
												borderColor='gray.300'
												p={5}
												rounded='md'
												textAlign='center'
												bg='gray.50'
												w='100%'
												_hover={{ borderColor: 'brand.500', bg: 'gray.100' }}
											>
												<VStack spacing={1}>
													<Icon
														as={FiUploadCloud}
														boxSize={6}
														color='brand.500'
													/>
													<Text fontSize='sm' color='gray.600'>
														Click to upload
													</Text>
													{!file && (
														<Text fontSize='xs' color='gray.400'>
															Only PDF, DOC, DOCX — Max 5MB
														</Text>
													)}

													{fileName && (
														<Flex align='center' mt={2} gap={2}>
															<Text
																fontSize='sm'
																color='gray.700'
																maxW='300px'
																noOfLines={2}
																isTruncated
															>
																📄 {fileName}
															</Text>
															<IconButton
																size='xs'
																icon={<CloseIcon boxSize={2.5} />}
																onClick={() => {
																	setValue('file', null);
																	if (fileInputRef.current) {
																		fileInputRef.current.value = '';
																	}
																}}
																aria-label='Remove file'
															/>
														</Flex>
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
						</Grid>
					</ModalBody>

					<ModalFooter bg='gray.50' borderBottomRadius='xl' px={6} py={3}>
						<Button
							onClick={handleClose}
							variant='outline'
							colorScheme='gray'
							size='sm'
							mr={3}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit(handleFormSubmit)}
							colorScheme='brand'
							size='sm'
							isLoading={isUpdating}
							isDisabled={!isValid || !isDirty}
						>
							Save Changes
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	}
);

EditDealModal.displayName = 'EditDealModal';

export default EditDealModal;
