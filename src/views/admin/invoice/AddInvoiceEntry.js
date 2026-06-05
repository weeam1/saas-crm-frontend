import { CloseIcon } from '@chakra-ui/icons';
import {
	Button,
	FormLabel,
	Grid,
	GridItem,
	IconButton,
	Input,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	Text,
	Icon,
	ModalBody,
	ModalCloseButton,
	useBreakpointValue,
} from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useCreateItemMutation } from 'api/apiSlice';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import useUserSession from 'hooks/useUserSession';
import { useModalColors } from 'hooks/useModalColors';

import { FiFilePlus } from 'react-icons/fi';

// Validation schema for entry
const entrySchema = yup.object().shape({
	unit_no: yup.string().required('Unit No is required'),
	name_of_referring_party: yup.string().required('Referring party is required'),
	commission_percentage: yup
		.number()
		.typeError('Commission percentage must be a valid number')
		.required('Commission percentage is required')
		.min(0, 'Commission must be positive value.')
		.max(99, 'Commission must be less than 100'),
	unit_price: yup
		.number()
		.typeError('Unit price must be a valid number')
		.required('Unit price is required')
		.min(1, 'Unit price cannot be negative or zero'),
	vat_percentage: yup
		.number()
		.typeError('VAT percentage must be a valid number')
		.required('VAT percentage is required')
		.min(0, 'VAT percentage cannot be negative')
		.lessThan(100, 'VAT percentage must be less than 100'),
});

function calculateTotal(unitPrice, commissionPercentage, vatPercentage) {
	const totalCommissionExclVat = (commissionPercentage / 100) * unitPrice;
	const vatAmount = (vatPercentage / 100) * totalCommissionExclVat;
	const totalCommissionInclVat = totalCommissionExclVat + vatAmount;
	const totalAmount = unitPrice + totalCommissionInclVat;

	return {
		total_commission_excl_vat: totalCommissionExclVat,
		vat_amount: vatAmount,
		total_commission_incl_vat: totalCommissionInclVat,
		totalAmount: totalAmount,
	};
}

const AddEntryModal = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [showAddEntryModal, setShowAddEntryModal] = useState(false);
	const [createItemMutation, { isLoading: mutationLoading }] =
		useCreateItemMutation();
	const cancelRef = useRef();
	const navigate = useNavigate();

	// const user = JSON.parse(localStorage.getItem("user")) || {};

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	const mc = useModalColors();

	const initialValues = {
		unit_no: '',
		name_of_referring_party: '',
		commission_percentage: '',
		unit_price: '',
		vat_percentage: '',
		total_commission_excl_vat: 0,
		vat_amount: 0,
		total_commission_incl_vat: 0,
		totalAmount: 0,
	};

	const formik = useFormik({
		initialValues,
		validationSchema: entrySchema,
		onSubmit: (values, { resetForm }) => {
			AddData(values, resetForm);
		},
		enableReinitialize: true,
		validateOnChange: true,
		validateOnBlur: true,
	});

	const {
		errors,
		touched,
		values,
		handleBlur,
		handleChange,
		handleSubmit,
		setValues,
		resetForm,
		isValid,
		dirty,
	} = formik;

	useEffect(() => {
		if (
			values.unit_price ||
			values.commission_percentage ||
			values.vat_percentage
		) {
			const {
				total_commission_excl_vat,
				vat_amount,
				total_commission_incl_vat,
				totalAmount,
			} = calculateTotal(
				Number(values.unit_price ?? 1),
				Number(values.commission_percentage ?? 0),
				Number(values.vat_percentage ?? 0),
			);
			setValues({
				...values,
				total_commission_excl_vat,
				vat_amount,
				total_commission_incl_vat,
				totalAmount,
			});
		}
	}, [
		values.unit_price,
		values.commission_percentage,
		values.vat_percentage,
		setValues,
	]);

	const AddData = async (entryValues, resetForm) => {
		try {
			setIsLoading(true);

			const payload = {
				projectId: props.invoiceData.projectId,
				developer_id: props.invoiceData.developer_id,
				bank_account_id: props.invoiceData.bank_account_id,
				claimType: props.invoiceData.claimType,
				entryData: {
					unit_no: entryValues.unit_no,
					name_of_referring_party: entryValues.name_of_referring_party,
					commission_percentage: Number(entryValues.commission_percentage),
					unit_price: Number(entryValues.unit_price),
					total_commission_excl_vat: Number(
						entryValues.total_commission_excl_vat,
					),
					vat_percentage: Number(entryValues.vat_percentage),
					vat_amount: Number(entryValues.vat_amount),
					total_amount: Number(entryValues.totalAmount),
					total_commission_incl_vat: Number(
						entryValues.total_commission_incl_vat,
					),
				},
			};

			const response = await createItemMutation({
				path: '/invoices/entries/with-entry',
				body: payload,
			}).unwrap();

			if (!response?.data) {
				throw new Error('Failed to create invoice and entry');
			}

			const invoiceId = response.data.invoice._id;

			toast.success('Invoice and entry added successfully!');

			if (props.setAction) props.setAction((prev) => !prev);
			if (props.fetchData) props.fetchData();

			resetForm();
			props.onClose();
			props.onInvoiceClose();
			if (props.onSuccess) props.onSuccess(invoiceId);

			setShowConfirmation(true);
			createUserLog({
				userId: user?._id,
				action: 'CREATE',
				entity: 'Invoice',
				entityType: 'Invoice',
				entityId: response?.data?.invoice._id,
				status: 'success',
				message: `"${user?.fullName}" created the invoice "${response?.data?.invoice?.invoiceNo || 'Untitled'}".`,
			});
			navigate(`/invoice/developers/invoices/entries/${invoiceId}`);
		} catch (e) {
			console.error('Error:', e);

			const errorMsg =
				e?.data?.message || e.message || 'Operation failed to created invoice.';
			toast.error(errorMsg);

			createUserLog({
				userId: user?._id,
				action: 'CREATE',
				entity: 'Invioce',
				entityType: 'Invoice',
				status: e?.status === 500 ? 'error' : 'fail',
				message: errorMsg,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		resetForm();
		props.onClose();
		props.onInvoiceClose();
	};

	const modalSize = useBreakpointValue({
		base: { width: '90%', height: 'auto' },
		md: { width: '602px', height: 'auto', maxHeight: '80vh' },
	});

	return (
		// <Modal
		// 	isOpen={props.isOpen}
		// 	onClose={props.onClose}
		// 	size='custom'
		// 	motionPreset='slideInBottom'
		// 	isCentered
		// >
		// 	<ModalOverlay />
		// 	<ModalContent
		// 		width={modalSize.width}
		// 		height={modalSize.height}
		// 		maxW='100vw'
		// 		mx='auto'
		// 		borderRadius='10px'
		// 		boxShadow='lg'
		// 	>
		// 		<ModalHeader
		// 			display='flex'
		// 			justifyContent='space-between'
		// 			alignItems='center'
		// 			fontSize={{ base: '20px', md: '24px' }}
		// 			fontWeight='bold'
		// 			px={6}
		// 			py={4}
		// 			borderBottom='1px solid #E2E8F0'
		// 		>
		// 			Add Invoice Entry
		// 			<IconButton
		// 				onClick={handleCancel}
		// 				icon={<CloseIcon />}
		// 				aria-label='Close'
		// 				size='sm'
		// 				variant='ghost'
		// 				color='gray.600'
		// 				_hover={{ color: 'gray.800', bg: 'gray.100' }}
		// 			/>
		// 		</ModalHeader>
		// 		<ModalBody overflowY='auto' px={6} py={4}>
		// 			<form onSubmit={handleSubmit}>
		// 				<Grid templateColumns='repeat(12, 1fr)' gap={4}>
		// 					<GridItem colSpan={{ base: 12, md: 6 }}>
		// 						<FormLabel
		// 							fontSize='14px'
		// 							fontWeight='medium'
		// 							color='gray.700'
		// 							mb={1}
		// 						>
		// 							Unit No
		// 						</FormLabel>
		// 						<Input
		// 							fontSize='14px'
		// 							name='unit_no'
		// 							onChange={handleChange}
		// 							onBlur={handleBlur}
		// 							value={values.unit_no}
		// 							placeholder='Enter Unit No (e.g., A-101)'
		// 							borderColor={
		// 								errors.unit_no && touched.unit_no ? 'red.300' : 'gray.300'
		// 							}
		// 							borderRadius='6px'
		// 							height='40px'
		// 							_focus={{
		// 								borderColor: '#B79045',
		// 								boxShadow: '0 0 0 1px #B79045',
		// 							}}
		// 						/>
		// 						{errors.unit_no && touched.unit_no && (
		// 							<FormLabel color='red.500' fontSize='12px' mt={1}>
		// 								{errors.unit_no}
		// 							</FormLabel>
		// 						)}
		// 					</GridItem>
		// 					<GridItem colSpan={{ base: 12, md: 6 }}>
		// 						<FormLabel
		// 							fontSize='14px'
		// 							fontWeight='medium'
		// 							color='gray.700'
		// 							mb={1}
		// 						>
		// 							Name of Referring Party
		// 						</FormLabel>
		// 						<Input
		// 							fontSize='14px'
		// 							name='name_of_referring_party'
		// 							onChange={handleChange}
		// 							onBlur={handleBlur}
		// 							value={values.name_of_referring_party}
		// 							placeholder='Enter Referring Party'
		// 							borderColor={
		// 								errors.name_of_referring_party &&
		// 								touched.name_of_referring_party
		// 									? 'red.300'
		// 									: 'gray.300'
		// 							}
		// 							borderRadius='6px'
		// 							height='40px'
		// 							_focus={{
		// 								borderColor: '#B79045',
		// 								boxShadow: '0 0 0 1px #B79045',
		// 							}}
		// 						/>
		// 						{errors.name_of_referring_party &&
		// 							touched.name_of_referring_party && (
		// 								<FormLabel color='red.500' fontSize='12px' mt={1}>
		// 									{errors.name_of_referring_party}
		// 								</FormLabel>
		// 							)}
		// 					</GridItem>
		// 					<GridItem colSpan={{ base: 12, md: 6 }}>
		// 						<FormLabel
		// 							fontSize='14px'
		// 							fontWeight='medium'
		// 							color='gray.700'
		// 							mb={1}
		// 						>
		// 							Unit Price
		// 						</FormLabel>
		// 						<Input
		// 							fontSize='14px'
		// 							type='number'
		// 							name='unit_price'
		// 							onChange={handleChange}
		// 							onBlur={handleBlur}
		// 							value={values.unit_price}
		// 							placeholder='Enter Unit Price'
		// 							borderColor={
		// 								errors.unit_price && touched.unit_price
		// 									? 'red.300'
		// 									: 'gray.300'
		// 							}
		// 							borderRadius='6px'
		// 							height='40px'
		// 							_focus={{
		// 								borderColor: '#B79045',
		// 								boxShadow: '0 0 0 1px #B79045',
		// 							}}
		// 						/>
		// 						{errors.unit_price && touched.unit_price && (
		// 							<FormLabel color='red.500' fontSize='12px' mt={1}>
		// 								{errors.unit_price}
		// 							</FormLabel>
		// 						)}
		// 					</GridItem>
		// 					<GridItem colSpan={{ base: 12, md: 6 }}>
		// 						<FormLabel
		// 							fontSize='14px'
		// 							fontWeight='medium'
		// 							color='gray.700'
		// 							mb={1}
		// 						>
		// 							Commission Percentage (%)
		// 						</FormLabel>
		// 						<Input
		// 							fontSize='14px'
		// 							type='number'
		// 							name='commission_percentage'
		// 							onChange={handleChange}
		// 							onBlur={handleBlur}
		// 							value={values.commission_percentage}
		// 							placeholder='Enter Commission %'
		// 							borderColor={
		// 								errors.commission_percentage &&
		// 								touched.commission_percentage
		// 									? 'red.300'
		// 									: 'gray.300'
		// 							}
		// 							borderRadius='6px'
		// 							height='40px'
		// 							_focus={{
		// 								borderColor: '#B79045',
		// 								boxShadow: '0 0 0 1px #B79045',
		// 							}}
		// 						/>
		// 						{errors.commission_percentage &&
		// 							touched.commission_percentage && (
		// 								<FormLabel color='red.500' fontSize='12px' mt={1}>
		// 									{errors.commission_percentage}
		// 								</FormLabel>
		// 							)}
		// 					</GridItem>
		// 					<GridItem colSpan={{ base: 12, md: 6 }}>
		// 						<FormLabel
		// 							fontSize='14px'
		// 							fontWeight='medium'
		// 							color='gray.700'
		// 							mb={1}
		// 						>
		// 							VAT Percentage (%)
		// 						</FormLabel>
		// 						<Input
		// 							fontSize='14px'
		// 							type='number'
		// 							name='vat_percentage'
		// 							onChange={handleChange}
		// 							onBlur={handleBlur}
		// 							value={values.vat_percentage}
		// 							placeholder='Enter VAT %'
		// 							borderColor={
		// 								errors.vat_percentage && touched.vat_percentage
		// 									? 'red.300'
		// 									: 'gray.300'
		// 							}
		// 							borderRadius='6px'
		// 							height='40px'
		// 							_focus={{
		// 								borderColor: '#B79045',
		// 								boxShadow: '0 0 0 1px #B79045',
		// 							}}
		// 						/>
		// 						{errors.vat_percentage && touched.vat_percentage && (
		// 							<FormLabel color='red.500' fontSize='12px' mt={1}>
		// 								{errors.vat_percentage}
		// 							</FormLabel>
		// 						)}
		// 					</GridItem>
		// 					<GridItem colSpan={{ base: 12, md: 6 }}>
		// 						<FormLabel
		// 							fontSize='14px'
		// 							fontWeight='medium'
		// 							color='gray.700'
		// 							mb={1}
		// 						>
		// 							Total Commission Excl. VAT
		// 						</FormLabel>
		// 						<Input
		// 							fontSize='14px'
		// 							type='text'
		// 							value={values.total_commission_excl_vat.toLocaleString(
		// 								'en-US',
		// 								{
		// 									minimumFractionDigits: 2,
		// 									maximumFractionDigits: 2,
		// 								},
		// 							)}
		// 							isReadOnly
		// 							borderColor='gray.300'
		// 							borderRadius='6px'
		// 							height='40px'
		// 						/>
		// 					</GridItem>
		// 					<GridItem colSpan={{ base: 12, md: 6 }}>
		// 						<FormLabel
		// 							fontSize='14px'
		// 							fontWeight='medium'
		// 							color='gray.700'
		// 							mb={1}
		// 						>
		// 							VAT Amount
		// 						</FormLabel>
		// 						<Input
		// 							fontSize='14px'
		// 							type='text'
		// 							value={values.vat_amount.toLocaleString('en-US', {
		// 								minimumFractionDigits: 2,
		// 								maximumFractionDigits: 2,
		// 							})}
		// 							isReadOnly
		// 							borderColor='gray.300'
		// 							borderRadius='6px'
		// 							height='40px'
		// 						/>
		// 					</GridItem>
		// 					<GridItem colSpan={{ base: 12, md: 6 }}>
		// 						<FormLabel
		// 							fontSize='14px'
		// 							fontWeight='medium'
		// 							color='gray.700'
		// 							mb={1}
		// 						>
		// 							Total Commission Incl. VAT
		// 						</FormLabel>
		// 						<Input
		// 							fontSize='14px'
		// 							type='text'
		// 							value={values.total_commission_incl_vat.toLocaleString(
		// 								'en-US',
		// 								{
		// 									minimumFractionDigits: 2,
		// 									maximumFractionDigits: 2,
		// 								},
		// 							)}
		// 							isReadOnly
		// 							borderColor='gray.300'
		// 							borderRadius='6px'
		// 							height='40px'
		// 						/>
		// 					</GridItem>
		// 					{/* <GridItem colSpan={{ base: 12, md: 6 }}>
		// 						<FormLabel
		// 							fontSize='14px'
		// 							fontWeight='medium'
		// 							color='gray.700'
		// 							mb={1}
		// 						>
		// 							Total Amount
		// 						</FormLabel>
		// 						<Input
		// 							fontSize='14px'
		// 							type='text'
		// 							value={values.totalAmount.toLocaleString('en-US', {
		// 								minimumFractionDigits: 2,
		// 								maximumFractionDigits: 2,
		// 							})}
		// 							isReadOnly
		// 							borderColor='gray.300'
		// 							borderRadius='6px'
		// 							height='40px'
		// 						/>
		// 					</GridItem> */}
		// 				</Grid>
		// 			</form>
		// 		</ModalBody>
		// 		<ModalFooter
		// 			justifyContent='flex-end'
		// 			px={6}
		// 			py={4}
		// 			borderTop='1px solid #E2E8F0'
		// 		>
		// 			<Button
		// 				bg='#CCCACA'
		// 				color='black'
		// 				width={{ base: '80px', md: '100px' }}
		// 				height='40px'
		// 				fontSize='14px'
		// 				borderRadius='6px'
		// 				fontFamily='DM Sans, sans-serif'
		// 				sx={{ textTransform: 'capitalize' }}
		// 				onClick={handleCancel}
		// 				mr={3}
		// 				_hover={{ bg: '#B0AEAE' }}
		// 			>
		// 				Cancel
		// 			</Button>
		// 			<Button
		// 				bg='#B79045'
		// 				color='white'
		// 				width={{ base: '80px', md: '100px' }}
		// 				height='40px'
		// 				fontSize='14px'
		// 				fontFamily='DM Sans, sans-serif'
		// 				borderRadius='6px'
		// 				sx={{ textTransform: 'capitalize' }}
		// 				disabled={isLoading || mutationLoading || !isValid || !dirty}
		// 				type='submit'
		// 				onClick={handleSubmit}
		// 				_hover={{ bg: '#A47B38' }}
		// 				_disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
		// 			>
		// 				{isLoading || mutationLoading ? <Spinner /> : 'Save'}
		// 			</Button>
		// 		</ModalFooter>
		// 	</ModalContent>
		// </Modal>
		<Modal
			isOpen={props.isOpen}
			onClose={props.onClose}
			size='custom'
			motionPreset='slideInBottom'
			isCentered
		>
			<ModalOverlay backdropFilter='blur(3px)' bg={mc.overlayBg} />
			<ModalContent
				width={modalSize.width}
				height={modalSize.height}
				maxW='100vw'
				mx='auto'
				borderRadius='2xl'
				boxShadow={mc.modalShadow}
				bg={mc.bg}
				border='1px solid'
				borderColor={mc.borderColor}
				overflow='hidden'
			>
				{/* Header — Gold Gradient */}
				<ModalHeader
					display='flex'
					alignItems='center'
					background={mc.headerBg}
					color={mc.headerText}
					px={6}
					py={4}
					boxShadow='0 2px 10px rgba(0,0,0,0.15)'
				>
					<Icon as={FiFilePlus} boxSize={5} mr={3} />
					<Text
						fontSize={{ base: 'lg', md: 'xl' }}
						color='inherit'
						fontWeight='bold'
					>
						Add Invoice Entry
					</Text>
					<ModalCloseButton
						onClick={handleCancel}
						aria-label='Close'
						position='absolute'
						right='14px'
						top='14px'
						bg={mc.closeBtnBg}
						color={mc.closeBtnColor}
						borderRadius='full'
						_hover={{ bg: mc.closeBtnHoverBg }}
						_focus={{ boxShadow: 'none' }}
					/>
				</ModalHeader>

				<ModalBody
					overflowY='auto'
					px={6}
					py={6}
					sx={{
						'&::-webkit-scrollbar': {
							width: '6px',
						},
						'&::-webkit-scrollbar-track': {
							background: mc.bgDeep,
							borderRadius: '3px',
						},
						'&::-webkit-scrollbar-thumb': {
							background: mc.borderColor,
							borderRadius: '3px',
							_hover: { background: mc.borderFocus },
						},
					}}
				>
					<form onSubmit={handleSubmit}>
						<Grid templateColumns='repeat(12, 1fr)' gap={5}>
							{/* Unit No */}
							<GridItem colSpan={{ base: 12, md: 6 }}>
								<FormLabel fontWeight='semibold' color={mc.labelColor} mb={1}>
									Unit No
								</FormLabel>
								<Input
									fontSize='sm'
									name='unit_no'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.unit_no}
									placeholder='Enter Unit No (e.g., A-101)'
									bg={mc.bgInput}
									borderColor={
										errors.unit_no && touched.unit_no
											? 'red.300'
											: mc.borderColor
									}
									color={mc.headingText}
									_hover={{
										borderColor:
											errors.unit_no && touched.unit_no
												? 'red.300'
												: mc.borderFocus,
									}}
									_focus={{
										borderColor:
											errors.unit_no && touched.unit_no
												? 'red.300'
												: mc.borderFocus,
										boxShadow: `0 0 0 1px ${errors.unit_no && touched.unit_no ? 'red.300' : mc.borderFocus}`,
									}}
									_placeholder={{ color: mc.mutedText }}
									borderRadius='md'
									height='40px'
								/>
								{errors.unit_no && touched.unit_no && (
									<Text color='red.300' fontSize='xs' mt={1}>
										{errors.unit_no}
									</Text>
								)}
							</GridItem>

							{/* Name of Referring Party */}
							<GridItem colSpan={{ base: 12, md: 6 }}>
								<FormLabel fontWeight='semibold' color={mc.labelColor} mb={1}>
									Name of Referring Party
								</FormLabel>
								<Input
									fontSize='sm'
									name='name_of_referring_party'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.name_of_referring_party}
									placeholder='Enter Referring Party'
									bg={mc.bgInput}
									borderColor={
										errors.name_of_referring_party &&
										touched.name_of_referring_party
											? 'red.300'
											: mc.borderColor
									}
									color={mc.headingText}
									_hover={{
										borderColor:
											errors.name_of_referring_party &&
											touched.name_of_referring_party
												? 'red.300'
												: mc.borderFocus,
									}}
									_focus={{
										borderColor:
											errors.name_of_referring_party &&
											touched.name_of_referring_party
												? 'red.300'
												: mc.borderFocus,
										boxShadow: `0 0 0 1px ${errors.name_of_referring_party && touched.name_of_referring_party ? 'red.300' : mc.borderFocus}`,
									}}
									_placeholder={{ color: mc.mutedText }}
									borderRadius='md'
									height='40px'
								/>
								{errors.name_of_referring_party &&
									touched.name_of_referring_party && (
										<Text color='red.300' fontSize='xs' mt={1}>
											{errors.name_of_referring_party}
										</Text>
									)}
							</GridItem>

							{/* Unit Price */}
							<GridItem colSpan={{ base: 12, md: 6 }}>
								<FormLabel fontWeight='semibold' color={mc.labelColor} mb={1}>
									Unit Price
								</FormLabel>
								<Input
									fontSize='sm'
									type='number'
									name='unit_price'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.unit_price}
									placeholder='Enter Unit Price'
									bg={mc.bgInput}
									borderColor={
										errors.unit_price && touched.unit_price
											? 'red.300'
											: mc.borderColor
									}
									color={mc.headingText}
									_hover={{
										borderColor:
											errors.unit_price && touched.unit_price
												? 'red.300'
												: mc.borderFocus,
									}}
									_focus={{
										borderColor:
											errors.unit_price && touched.unit_price
												? 'red.300'
												: mc.borderFocus,
										boxShadow: `0 0 0 1px ${errors.unit_price && touched.unit_price ? 'red.300' : mc.borderFocus}`,
									}}
									_placeholder={{ color: mc.mutedText }}
									borderRadius='md'
									height='40px'
								/>
								{errors.unit_price && touched.unit_price && (
									<Text color='red.300' fontSize='xs' mt={1}>
										{errors.unit_price}
									</Text>
								)}
							</GridItem>

							{/* Commission Percentage */}
							<GridItem colSpan={{ base: 12, md: 6 }}>
								<FormLabel fontWeight='semibold' color={mc.labelColor} mb={1}>
									Commission Percentage (%)
								</FormLabel>
								<Input
									fontSize='sm'
									type='number'
									name='commission_percentage'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.commission_percentage}
									placeholder='Enter Commission %'
									bg={mc.bgInput}
									borderColor={
										errors.commission_percentage &&
										touched.commission_percentage
											? 'red.300'
											: mc.borderColor
									}
									color={mc.headingText}
									_hover={{
										borderColor:
											errors.commission_percentage &&
											touched.commission_percentage
												? 'red.300'
												: mc.borderFocus,
									}}
									_focus={{
										borderColor:
											errors.commission_percentage &&
											touched.commission_percentage
												? 'red.300'
												: mc.borderFocus,
										boxShadow: `0 0 0 1px ${errors.commission_percentage && touched.commission_percentage ? 'red.300' : mc.borderFocus}`,
									}}
									_placeholder={{ color: mc.mutedText }}
									borderRadius='md'
									height='40px'
								/>
								{errors.commission_percentage &&
									touched.commission_percentage && (
										<Text color='red.300' fontSize='xs' mt={1}>
											{errors.commission_percentage}
										</Text>
									)}
							</GridItem>

							{/* VAT Percentage */}
							<GridItem colSpan={{ base: 12, md: 6 }}>
								<FormLabel fontWeight='semibold' color={mc.labelColor} mb={1}>
									VAT Percentage (%)
								</FormLabel>
								<Input
									fontSize='sm'
									type='number'
									name='vat_percentage'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.vat_percentage}
									placeholder='Enter VAT %'
									bg={mc.bgInput}
									borderColor={
										errors.vat_percentage && touched.vat_percentage
											? 'red.300'
											: mc.borderColor
									}
									color={mc.headingText}
									_hover={{
										borderColor:
											errors.vat_percentage && touched.vat_percentage
												? 'red.300'
												: mc.borderFocus,
									}}
									_focus={{
										borderColor:
											errors.vat_percentage && touched.vat_percentage
												? 'red.300'
												: mc.borderFocus,
										boxShadow: `0 0 0 1px ${errors.vat_percentage && touched.vat_percentage ? 'red.300' : mc.borderFocus}`,
									}}
									_placeholder={{ color: mc.mutedText }}
									borderRadius='md'
									height='40px'
								/>
								{errors.vat_percentage && touched.vat_percentage && (
									<Text color='red.300' fontSize='xs' mt={1}>
										{errors.vat_percentage}
									</Text>
								)}
							</GridItem>

							{/* Total Commission Excl. VAT (Read-only) */}
							<GridItem colSpan={{ base: 12, md: 6 }}>
								<FormLabel fontWeight='semibold' color={mc.labelColor} mb={1}>
									Total Commission Excl. VAT
								</FormLabel>
								<Input
									fontSize='sm'
									type='text'
									value={values.total_commission_excl_vat.toLocaleString(
										'en-US',
										{
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										},
									)}
									isReadOnly
									bg={mc.bgDeep}
									borderColor={mc.borderColor}
									color={mc.headingText}
									fontWeight='medium'
									borderRadius='md'
									height='40px'
									_readOnly={{ cursor: 'default' }}
								/>
							</GridItem>

							{/* VAT Amount (Read-only) */}
							<GridItem colSpan={{ base: 12, md: 6 }}>
								<FormLabel fontWeight='semibold' color={mc.labelColor} mb={1}>
									VAT Amount
								</FormLabel>
								<Input
									fontSize='sm'
									type='text'
									value={values.vat_amount.toLocaleString('en-US', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
									isReadOnly
									bg={mc.bgDeep}
									borderColor={mc.borderColor}
									color={mc.headingText}
									fontWeight='medium'
									borderRadius='md'
									height='40px'
									_readOnly={{ cursor: 'default' }}
								/>
							</GridItem>

							{/* Total Commission Incl. VAT (Read-only) */}
							<GridItem colSpan={{ base: 12, md: 6 }}>
								<FormLabel fontWeight='semibold' color={mc.labelColor} mb={1}>
									Total Commission Incl. VAT
								</FormLabel>
								<Input
									fontSize='sm'
									type='text'
									value={values.total_commission_incl_vat.toLocaleString(
										'en-US',
										{
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										},
									)}
									isReadOnly
									bg={mc.bgDeep}
									borderColor={mc.borderColor}
									color={mc.headingText}
									fontWeight='medium'
									borderRadius='md'
									height='40px'
									_readOnly={{ cursor: 'default' }}
								/>
							</GridItem>
						</Grid>
					</form>
				</ModalBody>

				{/* Footer — Navy with gold accent */}
				<ModalFooter
					bg={mc.footerBg}
					borderTop='2px solid'
					borderColor={mc.headerBg}
					py={4}
					px={6}
					gap={3}
				>
					<Button
						variant='ghost'
						onClick={handleCancel}
						borderRadius='md'
						size='sm'
						color={mc.secondaryBtnText}
						_hover={{
							bg: mc.secondaryBtnHoverBg,
							color: mc.secondaryBtnHoverText,
						}}
					>
						Cancel
					</Button>
					<Button
						type='submit'
						onClick={handleSubmit}
						borderRadius='md'
						size='sm'
						disabled={isLoading || mutationLoading || !isValid || !dirty}
						background={mc.primaryBtnBg}
						color={mc.primaryBtnText}
						fontWeight='bold'
						px={6}
						_hover={{
							background: mc.primaryBtnHoverBg,
							boxShadow: mc.primaryBtnShadow,
							transform: 'translateY(-1px)',
						}}
						_active={{
							background: mc.primaryBtnActiveBg,
							transform: 'translateY(0)',
						}}
						_disabled={{
							opacity: 0.5,
							cursor: 'not-allowed',
							transform: 'none',
							boxShadow: 'none',
						}}
						isLoading={isLoading || mutationLoading}
						loadingText='Saving...'
					>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AddEntryModal;
