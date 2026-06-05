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
	Flex,
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
import { FiPlus, FiTag, FiFileText } from 'react-icons/fi';

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

	const mc = useModalColors();

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
		(bank) => (bank._id || bank.account_number) === values.bank_account_id,
	);

	const selectedProject = projects?.doc?.find(
		(item) => item._id === values.projectId,
	);

	return (
		<div>
			{/* <Modal
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
										<FormLabel fontSize='16px'>Project</FormLabel>
										<Menu>
											<MenuButton
												as={Button}
												rightIcon={customDropdownIcon}
												fontSize='12px'
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
											<MenuList maxH='200px' overflowY='auto' fontSize='16px'>
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
													onClick={() => navigate('/invoice/project')}
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
										<FormLabel fontSize='16px'>Bank Account</FormLabel>
										<Menu>
											<MenuButton
												as={Button}
												rightIcon={customDropdownIcon}
												fontSize='12px'
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
											<MenuList maxH='200px' overflowY='auto' fontSize='16px'>
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
										<FormLabel fontSize='16px'>Claim Type</FormLabel>

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
			</Modal> */}

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
					m='2'
					borderRadius='2xl'
					bg={mc.bg}
					boxShadow={mc.modalShadow}
					border='1px solid'
					borderColor={mc.borderColor}
					overflow='hidden'
					maxH='85vh'
					display='flex'
					flexDirection='column'
				>
					{/* Header — Gold Gradient */}
					<ModalHeader
						display='flex'
						align='center'
						background={mc.headerBg}
						color={mc.headerText}
						px={6}
						py={4}
						boxShadow='0 2px 10px rgba(0,0,0,0.15)'
						position='sticky'
						top='0'
						zIndex='10'
					>
						<Icon as={FiFileText} boxSize={5} mr={3} />
						<Text fontSize='lg' color='inherit' fontWeight='bold'>
							Add Invoice
						</Text>
						<ModalCloseButton
							onClick={props.onClose}
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
						maxH='40vh'
						p={6}
						overflowY='auto'
						scrollBehavior='smooth'
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
						{projectsLoading || bankAccountsLoading ? (
							<Flex align='center' justify='center' py={12}>
								<Loader />
							</Flex>
						) : (
							<form onSubmit={handleSubmit}>
								<Grid templateColumns='repeat(12, 1fr)' gap={5}>
									{/* Project Selection */}
									<GridItem colSpan={{ base: 12, md: 6 }}>
										<FormLabel fontWeight='semibold' color={mc.labelColor}>
											Project
										</FormLabel>
										<Menu>
											<MenuButton
												as={Button}
												rightIcon={customDropdownIcon}
												fontSize='sm'
												borderRadius='md'
												height='40px'
												width='100%'
												textAlign='left'
												fontWeight='normal'
												borderColor={
													errors.projectId && touched.projectId
														? 'red.300'
														: mc.borderColor
												}
												borderWidth='1px'
												bg={mc.bgInput}
												color={selectedProject ? mc.headingText : mc.mutedText}
												_hover={{
													borderColor:
														errors.projectId && touched.projectId
															? 'red.300'
															: mc.borderFocus,
												}}
												_active={{ bg: mc.bgInput }}
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
												fontSize='sm'
												bg={mc.bg}
												z={20}
												borderColor={mc.borderColor}
											>
												{projects?.doc.length > 0 ? (
													projects?.doc?.map((item) => (
														<MenuItem
															key={item._id}
															onClick={() => {
																setFieldValue('projectId', item._id);
															}}
															bg='transparent'
															color={mc.headingText}
															_hover={{
																bg: mc.secondaryBtnHoverBg,
																color: mc.secondaryBtnHoverText,
															}}
														>
															{item.name}
														</MenuItem>
													))
												) : (
													<MenuItem isDisabled color={mc.mutedText}>
														No projects available
													</MenuItem>
												)}
												<MenuItem
													onClick={() => navigate('/invoice/project')}
													fontWeight='bold'
													borderTop='1px solid'
													borderColor={mc.divider}
													color={mc.borderFocus}
													_hover={{ bg: 'rgba(212, 175, 55, 0.08)' }}
												>
													<Icon as={FiPlus} mr={2} />
													Add Project
												</MenuItem>
											</MenuList>
										</Menu>
										{errors.projectId && touched.projectId && (
											<Text color='red.300' fontSize='xs' mt={1}>
												{errors.projectId}
											</Text>
										)}
									</GridItem>

									{/* Bank Account Selection */}
									<GridItem colSpan={{ base: 12, md: 6 }}>
										<FormLabel fontWeight='semibold' color={mc.labelColor}>
											Bank Account
										</FormLabel>
										<Menu>
											<MenuButton
												as={Button}
												rightIcon={customDropdownIcon}
												fontSize='sm'
												borderRadius='md'
												height='40px'
												width='100%'
												textAlign='left'
												fontWeight='normal'
												borderColor={
													errors.bank_account_id && touched.bank_account_id
														? 'red.300'
														: mc.borderColor
												}
												borderWidth='1px'
												bg={mc.bgInput}
												color={
													selectedBankAccount ? mc.headingText : mc.mutedText
												}
												_hover={{
													borderColor:
														errors.bank_account_id && touched.bank_account_id
															? 'red.300'
															: mc.borderFocus,
												}}
												_active={{ bg: mc.bgInput }}
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
												fontSize='sm'
												bg={mc.bg}
												z={20}
												borderColor={mc.borderColor}
											>
												{bankAccounts?.data?.length > 0 ? (
													bankAccounts?.data?.map((bank) => (
														<MenuItem
															key={bank._id || bank.account_number}
															onClick={() => {
																setFieldValue(
																	'bank_account_id',
																	bank._id || bank.account_number,
																);
															}}
															bg='transparent'
															color={mc.headingText}
															_hover={{
																bg: mc.secondaryBtnHoverBg,
																color: mc.secondaryBtnHoverText,
															}}
														>
															{`${bank.account_holder_name} (${bank.account_number})`}
														</MenuItem>
													))
												) : (
													<MenuItem isDisabled color={mc.mutedText}>
														No bank accounts available
													</MenuItem>
												)}
												<MenuItem
													onClick={handleAddBankAccount}
													fontWeight='bold'
													borderTop='1px solid'
													borderColor={mc.divider}
													color={mc.borderFocus}
													_hover={{ bg: 'rgba(212, 175, 55, 0.08)' }}
												>
													<Icon as={FiPlus} mr={2} />
													Add Bank Account
												</MenuItem>
											</MenuList>
										</Menu>
										{errors.bank_account_id && touched.bank_account_id && (
											<Text color='red.300' fontSize='xs' mt={1}>
												{errors.bank_account_id}
											</Text>
										)}
									</GridItem>

									{/* Claim Type Selection */}
									<GridItem colSpan={{ base: 12, md: 6 }}>
										<FormLabel fontWeight='semibold' color={mc.labelColor}>
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
												fontSize='sm'
												borderRadius='md'
												height='40px'
												borderColor={
													errors.claimType && touched.claimType
														? 'red.300'
														: mc.borderColor
												}
												borderWidth='1px'
												textAlign='left'
												fontWeight='normal'
												bg={mc.bgInput}
												color={values.claimType ? mc.headingText : mc.mutedText}
												_hover={{
													borderColor:
														errors.claimType && touched.claimType
															? 'red.300'
															: mc.borderFocus,
												}}
												_active={{ bg: mc.bgInput }}
											>
												{values.claimType || 'Select Claim Type'}
											</MenuButton>

											<MenuList z={20} bg={mc.bg} borderColor={mc.borderColor}>
												<MenuItem
													onClick={() =>
														formik.setFieldValue('claimType', '1st Claim')
													}
													bg='transparent'
													color={mc.headingText}
													_hover={{
														bg: mc.secondaryBtnHoverBg,
														color: mc.secondaryBtnHoverText,
													}}
												>
													1st Claim
												</MenuItem>
												<MenuItem
													onClick={() =>
														formik.setFieldValue('claimType', '2nd Claim')
													}
													bg='transparent'
													color={mc.headingText}
													_hover={{
														bg: mc.secondaryBtnHoverBg,
														color: mc.secondaryBtnHoverText,
													}}
												>
													2nd Claim
												</MenuItem>
												<MenuItem
													onClick={() =>
														formik.setFieldValue('claimType', 'Full')
													}
													bg='transparent'
													color={mc.headingText}
													_hover={{
														bg: mc.secondaryBtnHoverBg,
														color: mc.secondaryBtnHoverText,
													}}
												>
													Full
												</MenuItem>
											</MenuList>
										</Menu>

										{errors.claimType && touched.claimType && (
											<Text color='red.300' fontSize='xs' mt={1}>
												{errors.claimType}
											</Text>
										)}
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
						position='sticky'
						bottom='0'
						py={4}
						px={6}
						gap={3}
					>
						<Button
							variant='ghost'
							borderRadius='md'
							size='sm'
							onClick={handleCancel}
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
							disabled={isLoading || !isValid || !dirty}
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
							isLoading={isLoading}
							loadingText='Loading...'
						>
							Next
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
