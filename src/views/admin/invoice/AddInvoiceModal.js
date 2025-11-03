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
	Text,
	ModalCloseButton,
} from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchItemsQuery } from 'api/apiSlice';
import * as yup from 'yup';
import DropdownImg from '../../../assets/img/Invoice/mdi_menu-down.svg';
import { useParams, useNavigate } from 'react-router-dom';
import AddEntryModal from './AddInvoiceEntry';
import Loader from 'components/loading/Loader';
import { useModalColors } from 'hooks/useModalColors';

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

	const { bg, headerBg, headerText, footerBg, borderColor } = useModalColors();

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
		navigate('/invoice/bank-account');
	};

	const modalSize = useBreakpointValue({
		base: { width: '90%', height: 'auto' },
		md: { width: '602px', height: '45vh' },
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
					boxShadow='lg'
					m='2'
					borderRadius='2xl'
					bg={bg}
					shadow='2xl'
					overflow='hidden'
					maxH='85vh'
					display='flex'
					flexDirection='column'
				>
					<ModalHeader
						display='flex'
						align='center'
						justify='space-between'
						bg={headerBg}
						color={headerText}
						px={6}
						py={3}
						borderBottom='1px solid'
						borderColor={borderColor}
						position='sticky'
						top='0'
						zIndex='10'
					>
						<Text fontSize='lg' fontWeight='bold'>
							Add Invoice
						</Text>
						<ModalCloseButton
							onClick={props.onClose}
							aria-label='Close'
							position='static'
						/>
					</ModalHeader>
					<ModalBody
						maxH='40vh'
						p={5}
						overflowY='auto'
						scrollBehavior='smooth'
						sx={{
							'&::-webkit-scrollbar': { width: '6px' },
							'&::-webkit-scrollbar-thumb': {
								background: '#c1c1c1',
								borderRadius: '10px',
							},
						}}
					>
						{projectsLoading || bankAccountsLoading ? (
							<Loader />
						) : (
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
												<MenuItem
													onClick={() =>
														formik.setFieldValue('claimType', 'Full')
													}
												>
													Full
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
						)}
					</ModalBody>
					<ModalFooter
						bg={footerBg}
						borderTop='1px solid'
						borderColor={borderColor}
						position='sticky'
						bottom='0'
						zIndex='10'
						py={3}
						px={5}
						justifyContent='flex-end'
						gap={3}
					>
						<Button
							variant='outline'
							bg='#CCCACA'
							color='black'
							borderRadius='md'
							size='sm'
							mr={3}
							onClick={handleCancel}
						>
							Cancel
						</Button>
						<Button
							bg='#B79045'
							color='white'
							borderRadius='md'
							size='sm'
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
