import { CloseIcon } from '@chakra-ui/icons';
import {
	Button,
	FormLabel,
	Grid,
	GridItem,
	IconButton,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	useBreakpointValue,
	Icon,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
} from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useFetchItemsQuery } from 'api/apiSlice';
import * as yup from 'yup';
import DropdownImg from '../../../assets/img/Invoice/mdi_menu-down.svg';
import { setBankAccounts } from '../../../redux/invoiceSlice';
import { useParams, useNavigate } from 'react-router-dom';
import AddEntryModal from './AddInvoiceEntry';

// Validation schema for invoice
const invoiceSchema = yup.object().shape({
	developer_id: yup.string().required('Developer is required'),
	bank_account_id: yup.string().required('Bank account is required'),
	claimType: yup.string().required('Claim type is required'),
	projectId: yup.string().required('Project is required'),
});

const AddInvoice = (props) => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);
	const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
	const [invoiceData, setInvoiceData] = useState(null);
	const dispatch = useDispatch();

	// const { developers, bankAccounts, isDevelopersLoaded, isBankAccountsLoaded } =
	// 	useSelector((state) => state.invoiceModalData);

	const { data: projects, isLoading: projectsLoading } = useFetchItemsQuery({
		path: `/developer/projects`,
		params: { developer: id },
	});

	const {
		data: bankAccounts,
		isLoading: bankAccountsLoading,
		error: bankAccountsError,
	} = useFetchItemsQuery({ path: `/bankAccount/get` });

	// useEffect(() => {
	// 	if (bankAccountsData && bankAccountsData.data) {
	// 		dispatch(setBankAccounts(bankAccountsData.data.bankAccounts || []));
	// 	}
	// 	if (bankAccountsError) {
	// 		console.error('Error fetching bank accounts:', bankAccountsError);
	// 		dispatch(setBankAccounts([]));
	// 		toast.error('Failed to load bank accounts.');
	// 	}
	// }, [bankAccountsData, bankAccountsError, dispatch]);

	const initialValues = {
		developer_id: id || '',
		bank_account_id: '',
		claimType: '',
		projectId: '',
	};

	const formik = useFormik({
		initialValues,
		validationSchema: invoiceSchema,
		onSubmit: (values) => {
			handleNext(values);
		},
		enableReinitialize: true,
	});

	const {
		errors,
		touched,
		values,
		handleBlur,
		handleChange,
		handleSubmit,
		resetForm,
		setFieldValue,
		isValid,
		dirty,
	} = formik;

	const handleNext = (formValues) => {
		setInvoiceData(formValues);
		setIsEntryModalOpen(true);
	};

	const handleCancel = () => {
		resetForm();
		props.onClose();
	};

	const handleAddBankAccount = () => {
		navigate('/invoice?tab=bank-accounts');
	};

	const modalSize = useBreakpointValue({
		base: { width: '90%', height: 'auto' },
		md: { width: '602px', height: '35vh' },
	});

	const customDropdownIcon = (
		<Icon as={() => <img src={DropdownImg} alt='dropdown' />} boxSize={6} />
	);

	// Custom dropdown for bank accounts using Menu
	const selectedBankAccount = bankAccounts?.data?.find(
		(bank) => (bank._id || bank.account_number) === values.bank_account_id
	);

	const selectedProject = projects?.doc?.find(
		(item) => item._id === values.projectId
	);

	return (
		<div>
			<Modal
				isOpen={props.isOpen}
				onClose={props.onClose}
				size='custom'
				motionPreset='slideInBottom'
				isCentered
			>
				<ModalOverlay />
				<ModalContent
					width={modalSize.width}
					height={modalSize.height}
					fontFamily='DM Sans, sans-serif'
					maxW='100vw'
					mx='auto'
					borderRadius='10px'
					boxShadow='lg'
				>
					<ModalHeader
						display='flex'
						justifyContent='space-between'
						alignItems='center'
						fontSize={{ base: '20px', md: '24px' }}
						fontWeight='bold'
						fontFamily='DM Sans, sans-serif'
						px={6}
						py={4}
						borderBottom='1px solid #E2E8F0'
					>
						Add Invoice
						<IconButton
							onClick={props.onClose}
							icon={<CloseIcon />}
							aria-label='Close'
							size='sm'
							variant='ghost'
							color='gray.600'
							_hover={{ color: 'gray.800', bg: 'gray.100' }}
						/>
					</ModalHeader>
					<ModalBody overflowY='auto' px={6} py={4}>
						<form onSubmit={handleSubmit}>
							<Grid templateColumns='repeat(12, 1fr)' gap={3}>
								<GridItem colSpan={{ base: 12, md: 6 }}>
									<FormLabel fontSize='16px' fontFamily='DM Sans, sans-serif'>
										Project
									</FormLabel>
									<Menu>
										<MenuButton
											as={Button}
											rightIcon={customDropdownIcon}
											fontSize='12px'
											fontFamily='DM Sans, sans-serif'
											borderRadius='6px'
											height='40px'
											width='100%'
											textAlign='left'
											borderColor={
												errors.projectId && touched.projectId
													? 'red.300'
													: 'gray.300'
											}
											borderWidth='1px'
											bg='white'
											_hover={{ borderColor: '#B79045' }}
											_disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
											isDisabled={projectsLoading}
										>
											{projectsLoading
												? 'Loading...'
												: selectedProject
													? `${selectedProject.name}`
													: projects?.doc?.length > 0
														? 'Choose Project'
														: 'No projects available'}
										</MenuButton>
										<MenuList
											maxH='200px'
											overflowY='auto'
											fontFamily='DM Sans, sans-serif'
											fontSize='16px'
										>
											{projects?.doc.length > 0 ? (
												projects?.doc?.map((item) => (
													<MenuItem
														key={item._id}
														onClick={() => {
															setFieldValue('projectId', item._id);
														}}
													>
														{item.name}
													</MenuItem>
												))
											) : (
												<MenuItem isDisabled>No projects available</MenuItem>
											)}
											<MenuItem
												onClick={() => navigate('/invoice?tab=projects')}
												fontWeight='bold'
												borderTop='1px solid'
												borderColor='gray.200'
											>
												Add Project
											</MenuItem>
										</MenuList>
									</Menu>
									{errors.projectId && touched.projectId && (
										<FormLabel color='red.500' fontSize='14px'>
											{errors.projectId}
										</FormLabel>
									)}
								</GridItem>

								<GridItem colSpan={{ base: 12, md: 6 }}>
									<FormLabel fontSize='16px' fontFamily='DM Sans, sans-serif'>
										Bank Account
									</FormLabel>
									<Menu>
										<MenuButton
											as={Button}
											rightIcon={customDropdownIcon}
											fontSize='12px'
											fontFamily='DM Sans, sans-serif'
											borderRadius='6px'
											height='40px'
											width='100%'
											textAlign='left'
											borderColor={
												errors.bank_account_id && touched.bank_account_id
													? 'red.300'
													: 'gray.300'
											}
											borderWidth='1px'
											bg='white'
											_hover={{ borderColor: '#B79045' }}
											_disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
											isDisabled={bankAccountsLoading || bankAccountsError}
										>
											{bankAccountsLoading
												? 'Loading bank accounts...'
												: selectedBankAccount
													? `${selectedBankAccount.account_holder_name}`
													: bankAccounts.length > 0
														? 'Choose Bank Account'
														: 'No bank accounts available'}
										</MenuButton>
										<MenuList
											maxH='200px'
											overflowY='auto'
											fontFamily='DM Sans, sans-serif'
											fontSize='16px'
										>
											{bankAccounts?.data?.length > 0 ? (
												bankAccounts?.data?.map((bank) => (
													<MenuItem
														key={bank._id || bank.account_number}
														onClick={() => {
															setFieldValue(
																'bank_account_id',
																bank._id || bank.account_number
															);
														}}
													>
														{`${bank.account_holder_name} (${bank.account_number})`}
													</MenuItem>
												))
											) : (
												<MenuItem isDisabled>
													No bank accounts available
												</MenuItem>
											)}
											<MenuItem
												onClick={handleAddBankAccount}
												fontWeight='bold'
												borderTop='1px solid'
												borderColor='gray.200'
											>
												Add Bank Account
											</MenuItem>
										</MenuList>
									</Menu>
									{errors.bank_account_id && touched.bank_account_id && (
										<FormLabel color='red.500' fontSize='14px'>
											{errors.bank_account_id}
										</FormLabel>
									)}
								</GridItem>
								<GridItem colSpan={{ base: 12, md: 6 }}>
									<FormLabel fontSize='16px' fontFamily='DM Sans, sans-serif'>
										Claim Type
									</FormLabel>

									<Menu>
										<MenuButton
											as={Button}
											rightIcon={
												<Icon
													as={() => <img src={DropdownImg} alt='dropdown' />}
												/>
											}
											width='100%'
											fontSize='16px'
											fontFamily='DM Sans, sans-serif'
											borderRadius='6px'
											height='40px'
											border='1px solid'
											borderColor={
												errors.claimType && touched.claimType
													? 'red.300'
													: 'gray.300'
											}
											textAlign='left'
											_hover={{ bg: 'gray.100' }}
										>
											{values.claimType || 'Select Claim Type'}
										</MenuButton>

										<MenuList>
											<MenuItem
												onClick={() =>
													formik.setFieldValue('claimType', 'Full')
												}
											>
												Full
											</MenuItem>
											<MenuItem
												onClick={() =>
													formik.setFieldValue('claimType', '1st Claim')
												}
											>
												1st Claim
											</MenuItem>
											<MenuItem
												onClick={() =>
													formik.setFieldValue('claimType', '2nd Claim')
												}
											>
												2nd Claim
											</MenuItem>
										</MenuList>
									</Menu>

									{errors.claimType && touched.claimType && (
										<FormLabel color='red.500' fontSize='14px'>
											{errors.claimType}
										</FormLabel>
									)}
								</GridItem>
							</Grid>
						</form>
					</ModalBody>
					<ModalFooter
						justifyContent='flex-end'
						px={6}
						py={4}
						borderTop='1px solid #E2E8F0'
					>
						<Button
							bg='#CCCACA'
							color='black'
							width={{ base: '80px', md: '83px' }}
							height='46px'
							fontSize='16px'
							borderRadius='6px'
							fontFamily='DM Sans, sans-serif'
							sx={{ textTransform: 'capitalize' }}
							onClick={handleCancel}
							mr={2}
							_hover={{ bg: '#B0AEAE' }}
						>
							Cancel
						</Button>
						<Button
							bg='#B79045'
							color='white'
							width={{ base: '80px', md: '83px' }}
							height='46px'
							fontSize='16px'
							fontFamily='DM Sans, sans-serif'
							borderRadius='6px'
							sx={{ textTransform: 'capitalize' }}
							disabled={isLoading || !isValid || !dirty}
							onClick={handleSubmit}
							_hover={{ bg: '#A17C3A' }}
							_disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
						>
							{isLoading ? <Spinner /> : 'Next'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{isEntryModalOpen && (
				<AddEntryModal
					isOpen={isEntryModalOpen}
					onClose={() => setIsEntryModalOpen(false)}
					invoiceData={invoiceData}
					fetchData={props.fetchData}
					setAction={props.setAction}
					onInvoiceClose={props.onClose}
				/>
			)}
		</div>
	);
};

export default AddInvoice;
