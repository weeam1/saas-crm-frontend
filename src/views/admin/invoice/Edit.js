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
	Flex,
	Text,
	ModalHeader,
	ModalCloseButton,
	ModalFooter,
	ModalBody,
	useBreakpointValue,
	Icon,
} from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useFetchItemsQuery, useUpdateItemMutation } from 'api/apiSlice';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import DropdownImg from '../../../assets/img/Invoice/mdi_menu-down.svg';
import Loader from 'components/loading/Loader';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import { FiEdit3 } from 'react-icons/fi';
import { useModalColors } from 'hooks/useModalColors';

// Validation schema aligned with Add component
const invoiceSchema = yup.object().shape({
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

// Function to calculate commission, VAT, and total amount
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

const Edit = ({ isOpen, onClose, selectedId, fetchData, setAction }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [updateItem, { isLoading: mutationLoading }] = useUpdateItemMutation();
	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();
	const mc = useModalColors();

	// Fetch existing entry data
	const {
		data: entryData,
		isFetching: entryFetching,
		error: entryError,
		refetch: refetchEntry,
	} = useFetchItemsQuery(
		{
			path: `/invoices/entries/${selectedId}`,
		},
		{
			skip: !isOpen || !selectedId, // Only fetch when modal is open and ID is provided
		},
	);

	const initialValues = {
		invoice: '',
		unit_no: '',
		total_amount: 0,
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
		initialValues: initialValues,
		validationSchema: invoiceSchema,
		onSubmit: (values, { resetForm }) => {
			EditData(values);
		},
		enableReinitialize: true, // Ensures form reinitializes when initialValues change
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

	// Refetch data and update form values when modal opens or selectedId changes
	useEffect(() => {
		if (isOpen && selectedId) {
			refetchEntry(); // Force refetch data when modal opens
		}
	}, [isOpen, selectedId, refetchEntry]);

	// Update form values when entryData changes
	useEffect(() => {
		if (isOpen && entryData?.data && !entryFetching && selectedId) {
			const editData = entryData.data;
			const updatedValues = {
				invoice: editData.invoice || '',
				unit_no: editData.unit_no || '',
				total_amount: editData.total_amount || 0,
				name_of_referring_party: editData.name_of_referring_party || '',
				commission_percentage: editData.commission_percentage?.toString() || '',
				unit_price: editData.unit_price?.toString() || '',
				vat_percentage: editData.vat_percentage?.toString() || '',
				total_commission_excl_vat: editData.total_commission_excl_vat || 0,
				vat_amount: editData.vat_amount || 0,
				total_commission_incl_vat: editData.total_commission_incl_vat || 0,
				totalAmount: editData.total_amount || 0,
			};
			setValues(updatedValues);
		}
	}, [entryData, entryFetching, selectedId, setValues, isOpen]);

	// Recalculate totals when inputs change
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
				total_amount: totalAmount,
				totalAmount: totalAmount,
			});
		}
	}, [
		values.unit_price,
		values.commission_percentage,
		values.vat_percentage,
		setValues,
	]);

	// Reset form when modal closes
	useEffect(() => {
		if (!isOpen) {
			resetForm({ values: initialValues });
		}
	}, [isOpen, resetForm]);

	const EditData = async (formValues) => {
		try {
			setIsLoading(true);
			const payload = {
				invoice: formValues.invoice,
				unit_no: formValues.unit_no,
				total_amount: formValues.totalAmount,
				name_of_referring_party: formValues.name_of_referring_party,
				commission_percentage: Number(formValues.commission_percentage),
				unit_price: Number(formValues.unit_price),
				total_commission_excl_vat: formValues.total_commission_excl_vat,
				vat_percentage: Number(formValues.vat_percentage),
				vat_amount: formValues.vat_amount,
				total_commission_incl_vat: formValues.total_commission_incl_vat,
			};

			const response = await updateItem({
				path: `/invoices/entries/${selectedId}`,
				method: 'PUT',
				body: payload,
			}).unwrap();
			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Invoice',
				entityType: 'InvoiceEntry',
				entityId: response?.data?._id || null,
				status: 'success',
				message: `${user?.fullName} updated invoice entry.`,
			});
			if (response) {
				toast.success('Entry updated successfully!');
				if (fetchData) fetchData(); // Trigger parent data refresh
				if (setAction) setAction((prev) => !prev);
				resetForm({ values: initialValues }); // Reset form after success
				onClose();
			} else {
				throw new Error('Unexpected response format');
			}
		} catch (e) {
			const errorMsg =
				e?.data?.message || 'Failed to update invoice entry. Please try again.';
			console.error('Error updating entry:', e);
			toast.error(e?.data?.message || e.message || 'Something went wrong!');
			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Invoice',
				entityType: 'InvoiceEntry',
				status: e?.status === 500 ? 'error' : 'fail',
				message: errorMsg,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		resetForm({ values: initialValues });
		onClose();
	};

	const modalSize = useBreakpointValue({
		base: { width: '90%', height: 'auto' },
		md: { width: '602px', height: 'auto', maxHeight: '80vh' },
	});

	const customDropdownIcon = (
		<Icon as={() => <img src={DropdownImg} alt='dropdown' />} boxSize={6} />
	);

	if (entryError) {
		return (
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Error</ModalHeader>
					<ModalBody>Failed to load entry data. Please try again.</ModalBody>
					<ModalFooter>
						<Button onClick={onClose}>Close</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	}

	return (
		<div>
			{/* <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="custom"
        motionPreset="slideInBottom"
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          width={modalSize.width}
          height={modalSize.height}
          fontFamily="DM Sans, sans-serif"
          maxW="100vw"
          mx="auto"
          borderRadius="10px"
          boxShadow="lg"
        >
          <ModalHeader
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            fontSize={{ base: "20px", md: "24px" }}
            fontWeight="bold"
            fontFamily="DM Sans, sans-serif"
            px={6}
            py={4}
            borderBottom="1px solid #E2E8F0"
          >
            Edit Entry
            <IconButton
              onClick={handleClose}
              icon={<CloseIcon />}
              aria-label="Close"
              size="sm"
              variant="ghost"
              color="gray.600"
              _hover={{ color: "gray.800", bg: "gray.100" }}
            />
          </ModalHeader>
          <ModalBody overflowY="auto" px={6} py={4}>
            {entryFetching ? (
              <Loader />
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                  <GridItem colSpan={{ base: 12, md: 6 }}>
                    <FormLabel
                      fontSize="14px"
                      fontWeight="medium"
                      color="gray.700"
                      mb={1}
                    >
                      Unit No
                    </FormLabel>
                    <Input
                      fontSize="14px"
                      name="unit_no"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.unit_no}
                      placeholder="Enter Unit No (e.g., A-101)"
                      borderColor={
                        errors.unit_no && touched.unit_no
                          ? "red.300"
                          : "gray.300"
                      }
                      borderRadius="6px"
                      height="40px"
                      _focus={{
                        borderColor: "#B79045",
                        boxShadow: "0 0 0 1px #B79045",
                      }}
                    />
                    {errors.unit_no && touched.unit_no && (
                      <FormLabel color="red.500" fontSize="12px" mt={1}>
                        {errors.unit_no}
                      </FormLabel>
                    )}
                  </GridItem>
                  <GridItem colSpan={{ base: 12, md: 6 }}>
                    <FormLabel
                      fontSize="14px"
                      fontWeight="medium"
                      color="gray.700"
                      mb={1}
                    >
                      Name of Referring Party
                    </FormLabel>
                    <Input
                      fontSize="14px"
                      name="name_of_referring_party"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name_of_referring_party}
                      placeholder="Enter Referring Party"
                      borderColor={
                        errors.name_of_referring_party &&
                        touched.name_of_referring_party
                          ? "red.300"
                          : "gray.300"
                      }
                      borderRadius="6px"
                      height="40px"
                      _focus={{
                        borderColor: "#B79045",
                        boxShadow: "0 0 0 1px #B79045",
                      }}
                    />
                    {errors.name_of_referring_party &&
                      touched.name_of_referring_party && (
                        <FormLabel color="red.500" fontSize="12px" mt={1}>
                          {errors.name_of_referring_party}
                        </FormLabel>
                      )}
                  </GridItem>
                  <GridItem colSpan={{ base: 12, md: 6 }}>
                    <FormLabel
                      fontSize="14px"
                      fontWeight="medium"
                      color="gray.700"
                      mb={1}
                    >
                      Unit Price
                    </FormLabel>
                    <Input
                      fontSize="14px"
                      type="number"
                      name="unit_price"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.unit_price}
                      placeholder="Enter Unit Price"
                      borderColor={
                        errors.unit_price && touched.unit_price
                          ? "red.300"
                          : "gray.300"
                      }
                      borderRadius="6px"
                      height="40px"
                      _focus={{
                        borderColor: "#B79045",
                        boxShadow: "0 0 0 1px #B79045",
                      }}
                    />
                    {errors.unit_price && touched.unit_price && (
                      <FormLabel color="red.500" fontSize="12px" mt={1}>
                        {errors.unit_price}
                      </FormLabel>
                    )}
                  </GridItem>
                  <GridItem colSpan={{ base: 12, md: 6 }}>
                    <FormLabel
                      fontSize="14px"
                      fontWeight="medium"
                      color="gray.700"
                      mb={1}
                    >
                      Commission Percentage (%)
                    </FormLabel>
                    <Input
                      fontSize="14px"
                      type="number"
                      name="commission_percentage"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.commission_percentage}
                      placeholder="Enter Commission %"
                      borderColor={
                        errors.commission_percentage &&
                        touched.commission_percentage
                          ? "red.300"
                          : "gray.300"
                      }
                      borderRadius="6px"
                      height="40px"
                      _focus={{
                        borderColor: "#B79045",
                        boxShadow: "0 0 0 1px #B79045",
                      }}
                    />
                    {errors.commission_percentage &&
                      touched.commission_percentage && (
                        <FormLabel color="red.500" fontSize="12px" mt={1}>
                          {errors.commission_percentage}
                        </FormLabel>
                      )}
                  </GridItem>
                  <GridItem colSpan={{ base: 12, md: 6 }}>
                    <FormLabel
                      fontSize="14px"
                      fontWeight="medium"
                      color="gray.700"
                      mb={1}
                    >
                      VAT Percentage (%)
                    </FormLabel>
                    <Input
                      fontSize="14px"
                      type="number"
                      name="vat_percentage"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.vat_percentage}
                      placeholder="Enter VAT %"
                      borderColor={
                        errors.vat_percentage && touched.vat_percentage
                          ? "red.300"
                          : "gray.300"
                      }
                      borderRadius="6px"
                      height="40px"
                      _focus={{
                        borderColor: "#B79045",
                        boxShadow: "0 0 0 1px #B79045",
                      }}
                    />
                    {errors.vat_percentage && touched.vat_percentage && (
                      <FormLabel color="red.500" fontSize="12px" mt={1}>
                        {errors.vat_percentage}
                      </FormLabel>
                    )}
                  </GridItem>
                  <GridItem colSpan={{ base: 12, md: 6 }}>
                    <FormLabel
                      fontSize="14px"
                      fontWeight="medium"
                      color="gray.700"
                      mb={1}
                    >
                      Total Commission Excl. VAT
                    </FormLabel>
                    <Input
                      fontSize="14px"
                      type="text"
                      value={values.total_commission_excl_vat.toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}
                      isReadOnly
                      borderColor="gray.300"
                      borderRadius="6px"
                      height="40px"
                    />
                  </GridItem>
                  <GridItem colSpan={{ base: 12, md: 6 }}>
                    <FormLabel
                      fontSize="14px"
                      fontWeight="medium"
                      color="gray.700"
                      mb={1}
                    >
                      VAT Amount
                    </FormLabel>
                    <Input
                      fontSize="14px"
                      type="text"
                      value={values.vat_amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      isReadOnly
                      borderColor="gray.300"
                      borderRadius="6px"
                      height="40px"
                    />
                  </GridItem>
                  <GridItem colSpan={{ base: 12, md: 6 }}>
                    <FormLabel
                      fontSize="14px"
                      fontWeight="medium"
                      color="gray.700"
                      mb={1}
                    >
                      Total Commission Incl. VAT
                    </FormLabel>
                    <Input
                      fontSize="14px"
                      type="text"
                      value={values.total_commission_incl_vat.toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}
                      isReadOnly
                      borderColor="gray.300"
                      borderRadius="6px"
                      height="40px"
                    />
                  </GridItem>
               
                </Grid>
              </form>
            )}
          </ModalBody>
          <ModalFooter
            justifyContent="flex-end"
            px={6}
            py={4}
            borderTop="1px solid #E2E8F0"
          >
            <Button
              bg="#CCCACA"
              color="black"
              width={{ base: "80px", md: "100px" }}
              height="40px"
              fontSize="14px"
              borderRadius="6px"
              fontFamily="DM Sans, sans-serif"
              sx={{ textTransform: "capitalize" }}
              onClick={handleClose}
              mr={3}
              _hover={{ bg: "#B0AEAE" }}
            >
              Cancel
            </Button>
            <Button
              bg="#B79045"
              color="white"
              width={{ base: "80px", md: "100px" }}
              height="40px"
              fontSize="14px"
              fontFamily="DM Sans, sans-serif"
              borderRadius="6px"
              sx={{ textTransform: "capitalize" }}
              disabled={
                isLoading ||
                mutationLoading ||
                !isValid ||
                !dirty ||
                entryFetching
              }
              type="submit"
              onClick={handleSubmit}
              _hover={{ bg: "#A47B38" }}
              _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
            >
              {isLoading || mutationLoading ? <Spinner /> : "Save"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}

			<Modal
				isOpen={isOpen}
				onClose={handleClose}
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
						<Icon as={FiEdit3} boxSize={5} mr={3} />
						<Text
							fontSize={{ base: 'lg', md: 'xl' }}
							color='inherit'
							fontWeight='bold'
						>
							Edit Entry
						</Text>
						<ModalCloseButton
							onClick={handleClose}
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
						{entryFetching ? (
							<Flex align='center' justify='center' py={12}>
								<Loader />
							</Flex>
						) : (
							<form onSubmit={handleSubmit}>
								<Grid templateColumns='repeat(12, 1fr)' gap={5}>
									{/* Unit No */}
									<GridItem colSpan={{ base: 12, md: 6 }}>
										<FormLabel
											fontWeight='semibold'
											color={mc.labelColor}
											mb={1}
										>
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
										<FormLabel
											fontWeight='semibold'
											color={mc.labelColor}
											mb={1}
										>
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
										<FormLabel
											fontWeight='semibold'
											color={mc.labelColor}
											mb={1}
										>
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
										<FormLabel
											fontWeight='semibold'
											color={mc.labelColor}
											mb={1}
										>
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
										<FormLabel
											fontWeight='semibold'
											color={mc.labelColor}
											mb={1}
										>
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
										<FormLabel
											fontWeight='semibold'
											color={mc.labelColor}
											mb={1}
										>
											Total Commission Excl. VAT
										</FormLabel>
										<Input
											fontSize='sm'
											type='text'
											value={values.total_commission_excl_vat.toLocaleString(
												'en-US',
												{ minimumFractionDigits: 2, maximumFractionDigits: 2 },
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
										<FormLabel
											fontWeight='semibold'
											color={mc.labelColor}
											mb={1}
										>
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
										<FormLabel
											fontWeight='semibold'
											color={mc.labelColor}
											mb={1}
										>
											Total Commission Incl. VAT
										</FormLabel>
										<Input
											fontSize='sm'
											type='text'
											value={values.total_commission_incl_vat.toLocaleString(
												'en-US',
												{ minimumFractionDigits: 2, maximumFractionDigits: 2 },
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
						)}
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
							borderRadius='md'
							size='sm'
							onClick={handleClose}
							color={mc.secondaryBtnText}
							_hover={{
								bg: mc.secondaryBtnHoverBg,
								color: mc.secondaryBtnHoverText,
							}}
						>
							Cancel
						</Button>
						<Button
							borderRadius='md'
							size='sm'
							disabled={
								isLoading ||
								mutationLoading ||
								!isValid ||
								!dirty ||
								entryFetching
							}
							type='submit'
							onClick={handleSubmit}
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
		</div>
	);
};

export default Edit;
