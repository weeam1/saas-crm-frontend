import React, { useEffect, useState } from 'react';
import {
	Box,
	Flex,
	Text,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	VStack,
	Button,
	Skeleton,
	MenuList,
	MenuItem,
	Menu,
	MenuButton,
	Modal,
	Image,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { BiError } from 'react-icons/bi';
import { useFetchItemsQuery, useDownloadInvoiceMutation } from 'api/apiSlice';
import { FaChevronDown } from 'react-icons/fa';
import convertToWords from 'utils/convertToWords';
import EditImg from '../../../assets/img/Invoice/ic_round-edit.svg';
import BackImg from '../../../assets/img/Invoice/Vector.svg';
import Edit from './Edit';
import Weam from '../../../assets/img/Invoice/weam.png';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';
import { IoArrowBack } from 'react-icons/io5';
import AppButton from 'components/shared/AppButton';

const SingleInvoice = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const user = JSON.parse(localStorage.getItem('user')) || {};
	const [edit, setEdit] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const [action, setAction] = useState(null);
	const [downloadInvoiceMutation, { isLoading: isDownloading }] =
		useDownloadInvoiceMutation();
	const {
		data: invoiceData,
		isLoading: invoiceLoading,
		error: invoiceError,
	} = useFetchItemsQuery({
		path: `/invoices/${id}`,
	});

	const invoices = invoiceData?.data?.entries || [];
	const agency = invoiceData?.data?.agency || [];

	const totals = {
		total_commission_excl_vat:
			invoiceData?.data?.total_commission_excl_vat || 0,
		vat_amount: invoiceData?.data?.vatAmount || 0,
		total_commission_incl_vat:
			invoiceData?.data?.total_commission_incl_vat || 0,
		totalAmount: invoiceData?.data?.totalAmount || 0,
		subTotal: invoiceData?.data?.subTotal || 0,
	};

	const invoiceNumber = invoiceData?.data?.invoiceNo || '-';
	const developerData = invoiceData?.data?.developer || {};
	const bankAccountData = invoiceData?.data?.bank_account || {};

	const downloadInvoice = async () => {
		try {
			const response = await downloadInvoiceMutation({
				invoiceNo: id,
			}).unwrap();
			const blob = response;
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', `invoice_${invoiceNumber}.pdf`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error downloading PDF:', error);
			toast.error('Failed to download invoice. Please try again.');
		}
	};
	const printInvoice = async () => {
		try {
			const response = await downloadInvoiceMutation({
				invoiceNo: id,
				action: 'print',
			}).unwrap();
			const blob = response;
			const url = window.URL.createObjectURL(blob);

			const printWindow = window.open(url, '_blank');
			if (printWindow) {
				printWindow.onload = () => {
					printWindow.print();
					printWindow.onafterprint = () => printWindow.close();
				};
			} else {
				console.error('Popup blocked. Please allow popups for printing.');
				toast.error('Please allow popups to print the invoice.');
			}

			setTimeout(() => window.URL.revokeObjectURL(url), 1000);
		} catch (error) {
			console.error('Error printing PDF:', error);
			toast.error('Failed to print invoice. Please try again.');
		}
	};
	const handleExport = (option) => {
		if (option === 'pdf') {
			downloadInvoice();
		} else if (option === 'print') {
			printInvoice();
		}
	};

	if (invoiceError) {
		return (
			<Box
				minH='700px'
				display='flex'
				alignItems='center'
				justifyContent='center'
				p={4}
			>
				<Text
					display='flex'
					alignItems='center'
					color='red'
					fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
				>
					<BiError size={25} style={{ marginRight: 5 }} />
					No Invoice Found!
				</Text>
			</Box>
		);
	}

	const isLoading = invoiceLoading;

	const goBack = () => {
		navigate(`/invoice/developers/invoices/entries/${invoiceData?.data?._id}`, {
			state: { refetch: true },
		});
	};
	const handleEditClick = () => {
		setEdit(true);
		setSelectedId(id);
		setAction('edit');
	};

	return (
		<Box fontFamily="'DM Sans', sans-serif">
			<AppButton leftIcon={<IoArrowBack />} onClick={goBack} mb='4'>
				Back
			</AppButton>
			<Box bg='gray.50' p={{ base: 4, md: 6, lg: 8 }}>
				<Flex
					mb={4}
					justifyContent='space-between'
					alignItems='center'
					flexDir={{ base: 'column', sm: 'row' }}
				>
					<Flex alignItems='center' gap={2}>
						<Text
							fontSize='2xl'
							fontWeight='bold'
							display='flex'
							alignItems='center'
						>
							Invoice :
						</Text>
						<Text fontSize='lg' display='flex' alignItems='center'>
							{invoiceNumber}
						</Text>
					</Flex>

					<Flex gap={2} mt={{ base: 4, sm: 0 }}>
						<Menu>
							<MenuButton
								as={Button}
								w={{ base: 'full', sm: '125px' }}
								h='48px'
								fontWeight='medium'
								fontSize={{ base: 'md', lg: 'xl' }}
								color='white'
								colorScheme='brand'
							>
								Export
							</MenuButton>
							<MenuList>
								<MenuItem onClick={() => handleExport('pdf')}>
									Export as PDF
								</MenuItem>
								<MenuItem onClick={() => handleExport('print')}>
									Print Invoice
								</MenuItem>
							</MenuList>
						</Menu>
					</Flex>
				</Flex>

				<Skeleton isLoaded={!isLoading}>
					<VStack
						id='invoice-pdf'
						bg='white'
						p={{ base: 4, md: 6, lg: 8 }}
						shadow='lg'
						spacing={4}
						align='stretch'
					>
						<Box bg='#B79045' w='full' textAlign='center' p={4} color='white'>
							<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight='bold'>
								Invoice
							</Text>
						</Box>

						<Flex
							justify='space-between'
							w='full'
							mb={4}
							flexDir={{ base: 'column', md: 'row' }}
							align={{ base: 'stretch', md: 'flex-start' }}
							gap={4}
						>
							<Box
								w={{ base: 'full', md: '30%' }}
								display='flex'
								flexDirection='column'
								gap={2}
							>
								<Image
									src={Weam}
									alt='Weam Elnaggar Real Estate'
									width='200px'
								/>

								<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.700'>
									{agency?.location ?? 'N/A'}
								</Text>

								{agency?.contactNumberPrimary && (
									<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.700'>
										<Text as='span' fontWeight='bold'>
											Telephone:
										</Text>{' '}
										{[
											agency?.contactNumberPrimary,
											agency?.contactNumberAlternate,
										]
											.filter(Boolean)
											.join(' / ') || 'N/A'}
									</Text>
								)}

								{agency?.TRN && (
									<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.700'>
										<Text as='span' fontWeight='bold'>
											TRN:
										</Text>{' '}
										{agency.TRN}
									</Text>
								)}
							</Box>

							<Box w={{ base: 'full', md: '30%' }}>
								<Box mb={4}>
									<Text
										fontSize={{ base: 'xs', md: 'sm' }}
										py={1}
										display='flex'
									>
										<Text
											as='span'
											fontWeight='bold'
											w={{ base: '100px', md: '130px' }}
										>
											Invoice Date:
										</Text>
										<Box flex='1'>
											{invoices.length > 0
												? new Date(invoices[0].createdAt).toLocaleDateString()
												: 'N/A'}
										</Box>
									</Text>

									<Text
										fontSize={{ base: 'xs', md: 'sm' }}
										py={1}
										display='flex'
									>
										<Text
											as='span'
											fontWeight='bold'
											w={{ base: '100px', md: '130px' }}
										>
											Invoice No:
										</Text>
										<Box flex='1' textAlign='start'>
											#{invoiceNumber}
										</Box>
									</Text>
								</Box>

								<Box w='full' color='black'>
									<Text
										fontWeight='bold'
										fontSize={{ base: 'sm', md: 'md' }}
										bg='#B79045'
										color='white'
										p={2}
										textAlign='center'
									>
										Invoiced To
									</Text>
									<Box border='1px solid #eee' p={2} mt={2}>
										<Text
											fontSize={{ base: 'xs', md: 'sm' }}
											borderBottom='1px solid #eee'
											py={1}
											textAlign='left'
										>
											{developerData.developer_name || 'N/A'}
										</Text>
										<Text
											fontSize={{ base: 'xs', md: 'sm' }}
											borderBottom='1px solid #eee'
											py={1}
											textAlign='left'
										>
											{developerData.address || '-'}
										</Text>
										<Text
											fontSize={{ base: 'xs', md: 'sm' }}
											py={1}
											textAlign='left'
										>
											{developerData.country || '-'}
										</Text>
									</Box>
									<Text fontSize={{ base: 'xs', md: 'sm' }} m={2}>
										<Text as='span' fontWeight='bold'>
											TRN:
										</Text>{' '}
										{developerData.trn || '-'}
									</Text>
								</Box>
							</Box>
						</Flex>

						<Box
							className='table-container'
							overflowX='auto'
							overflowY='auto'
							maxHeight='700px'
							w='full'
						>
							<Table
								variant='simple'
								size='sm'
								minWidth={{ base: '800px', md: '100%' }}
							>
								<Thead
									bg='#B79045 !important'
									h='50px !important'
									position='sticky'
									top='0'
									zIndex='1'
								>
									<Tr>
										<Th color='white' fontSize={{ base: 'xs', md: 'sm' }}>
											SN
										</Th>
										<Th color='white' fontSize={{ base: 'xs', md: 'sm' }}>
											Unit No
										</Th>
										<Th color='white' fontSize={{ base: 'xs', md: 'sm' }}>
											Name of Referring Party
										</Th>
										{/* <Th color="white" fontSize={{ base: "xs", md: "sm" }}>
                    Claim Type
                  </Th> */}
										<Th color='white' fontSize={{ base: 'xs', md: 'sm' }}>
											Commission %
										</Th>
										<Th color='white' fontSize={{ base: 'xs', md: 'sm' }}>
											Unit Price
										</Th>
										<Th color='white' fontSize={{ base: 'xs', md: 'sm' }}>
											Total Commission EXCL. VAT
										</Th>
										<Th color='white' fontSize={{ base: 'xs', md: 'sm' }}>
											VAT %
										</Th>
										<Th color='white' fontSize={{ base: 'xs', md: 'sm' }}>
											VAT Amount
										</Th>
										<Th color='white' fontSize={{ base: 'xs', md: 'sm' }}>
											Total Commission incl. VAT
										</Th>
									</Tr>
								</Thead>
								<Tbody>
									{invoices.length > 0 ? (
										invoices.map((invoice, index) => (
											<Tr key={invoice._id}>
												<Td
													textAlign='center'
													border='1px solid #CDCDCD'
													py={4}
													fontSize={{ base: 'sm', md: 'md' }}
												>
													{index + 1}
												</Td>
												<Td
													border='1px solid #CDCDCD'
													py={4}
													fontSize={{ base: 'sm', md: 'md' }}
												>
													{invoice.unit_no || '-'}
												</Td>
												<Td
													border='1px solid #CDCDCD'
													py={4}
													fontSize={{ base: 'sm', md: 'md' }}
												>
													{invoice.name_of_referring_party || '-'}
												</Td>
												<Td
													textAlign='center'
													border='1px solid #CDCDCD'
													py={4}
													fontSize={{ base: 'sm', md: 'md' }}
												>
													{`${invoice.commission_percentage || 0}%`}
												</Td>
												<Td
													textAlign='right'
													border='1px solid #CDCDCD'
													py={4}
													fontSize={{ base: 'sm', md: 'md' }}
												>
													{(invoice.unit_price || 0).toLocaleString('en-US', {
														minimumFractionDigits: 2,
														maximumFractionDigits: 2,
													})}
												</Td>
												<Td
													textAlign='right'
													border='1px solid #CDCDCD'
													py={4}
													fontSize={{ base: 'sm', md: 'md' }}
												>
													{(
														invoice.total_commission_excl_vat || 0
													).toLocaleString('en-US', {
														minimumFractionDigits: 2,
														maximumFractionDigits: 2,
													})}
												</Td>
												<Td
													textAlign='center'
													border='1px solid #CDCDCD'
													py={4}
													fontSize={{ base: 'sm', md: 'md' }}
												>
													{`${invoice.vat_percentage || 5}%`}
												</Td>
												<Td
													textAlign='right'
													border='1px solid #CDCDCD'
													py={4}
													fontSize={{ base: 'sm', md: 'md' }}
												>
													{(invoice.vat_amount || 0).toLocaleString('en-US', {
														minimumFractionDigits: 2,
														maximumFractionDigits: 2,
													})}
												</Td>
												<Td
													textAlign='right'
													border='1px solid #CDCDCD'
													py={4}
													fontSize={{ base: 'sm', md: 'md' }}
												>
													{(
														invoice.total_commission_incl_vat || 0
													).toLocaleString('en-US', {
														minimumFractionDigits: 2,
														maximumFractionDigits: 2,
													})}
												</Td>
											</Tr>
										))
									) : (
										<Tr>
											<Td
												colSpan={12}
												textAlign='center'
												border='1px solid #CDCDCD'
												py={4} // Consistent padding for "No data" row
												fontSize={{ base: 'sm', md: 'md' }}
											>
												No data available
											</Td>
										</Tr>
									)}
								</Tbody>
							</Table>
						</Box>

						<Flex
							w='full'
							padding={2}
							mb={4}
							border='1px solid #CDCDCD'
							flexDirection='column'
						>
							<Text fontWeight='bold'>Total Amount :</Text>
							<Text fontSize={{ base: 'sm', md: 'md' }} wordBreak='break-word'>
								{typeof totals.totalAmount === 'number'
									? convertToWords(totals.totalAmount).charAt(0).toUpperCase() +
										convertToWords(totals.totalAmount).slice(1)
									: 'N/A'}
							</Text>
						</Flex>

						<Flex
							w='full'
							justify='space-between'
							gap={4}
							flexDir={{ base: 'column', lg: 'row' }}
						>
							<Box w={{ base: 'full', lg: '35%' }} p={4} color='black'>
								<Text
									fontWeight='bold'
									mb={2}
									bg='#b79045'
									p={2}
									color='white'
									fontSize={{ base: 'sm', md: 'md' }}
								>
									Bank Account Details:
								</Text>
								<Text fontSize={{ base: 'xs', md: 'sm' }}>
									Account Name: {bankAccountData.account_holder_name || '-'}
								</Text>
								<Text fontSize={{ base: 'xs', md: 'sm' }}>
									Account Number: {bankAccountData.account_number || '-'}
								</Text>
								<Text fontSize={{ base: 'xs', md: 'sm' }}>
									IBAN: {bankAccountData.iban || '-'}
								</Text>
								<Text fontSize={{ base: 'xs', md: 'sm' }}>
									Swift Code: {bankAccountData.swift_code || '-'}
								</Text>
								<Text fontSize={{ base: 'xs', md: 'sm' }}>
									Bank: {bankAccountData.bank_name || '-'}
								</Text>
								<Text fontSize={{ base: 'xs', md: 'sm' }}>
									Bank Address: {bankAccountData.branch_address || '-'}
								</Text>
							</Box>

							<Box w={{ base: 'full', lg: '30%' }} p={4}>
								<Table
									variant='simple'
									size='sm'
									w='full'
									border='1px solid #eee'
								>
									<Thead>
										<Tr bg='#B79045' color='white'>
											<Th
												color='white'
												textAlign='left'
												py={3}
												fontSize={{ base: 'xs', md: 'sm' }}
											>
												Invoice Summary
											</Th>
											<Th
												color='white'
												textAlign='right'
												py={3}
												w='40%'
												fontSize={{ base: 'xs', md: 'sm' }}
											>
												{agency?.currency ?? 'AED'}
											</Th>
										</Tr>
									</Thead>
									<Tbody>
										<Tr>
											<Td
												border='1px solid #eee'
												fontSize={{ base: 'xs', md: 'sm' }}
											>
												Subtotal
											</Td>
											<Td
												textAlign='right'
												border='1px solid #eee'
												fontSize={{ base: 'xs', md: 'sm' }}
											>
												{typeof totals.subTotal === 'number'
													? totals.subTotal.toLocaleString('en-US', {
															minimumFractionDigits: 2,
															maximumFractionDigits: 2,
														})
													: 'N/A'}{' '}
											</Td>
										</Tr>

										<Tr>
											<Td
												border='1px solid #eee'
												fontSize={{ base: 'xs', md: 'sm' }}
											>
												Total Commission EXCL. VAT
											</Td>
											<Td
												textAlign='right'
												border='1px solid #eee'
												fontSize={{ base: 'xs', md: 'sm' }}
											>
												{typeof totals.total_commission_excl_vat === 'number'
													? totals.total_commission_excl_vat.toLocaleString(
															'en-US',
															{
																minimumFractionDigits: 2,
																maximumFractionDigits: 2,
															}
														)
													: 'N/A'}{' '}
											</Td>
										</Tr>
										<Tr>
											<Td
												border='1px solid #eee'
												fontSize={{ base: 'xs', md: 'sm' }}
											>
												VAT Amount
											</Td>
											<Td
												textAlign='right'
												border='1px solid #eee'
												fontSize={{ base: 'xs', md: 'sm' }}
											>
												{typeof totals.vat_amount === 'number'
													? totals.vat_amount.toLocaleString('en-US', {
															minimumFractionDigits: 2,
															maximumFractionDigits: 2,
														})
													: 'N/A'}{' '}
											</Td>
										</Tr>
										<Tr>
											<Td
												border='1px solid #eee'
												fontSize={{ base: 'xs', md: 'sm' }}
											>
												Total Commission Include VAT
											</Td>
											<Td
												textAlign='right'
												border='1px solid #eee'
												fontSize={{ base: 'xs', md: 'sm' }}
											>
												{typeof totals.total_commission_incl_vat === 'number'
													? totals.total_commission_incl_vat.toLocaleString(
															'en-US',
															{
																minimumFractionDigits: 2,
																maximumFractionDigits: 2,
															}
														)
													: 'N/A'}{' '}
											</Td>
										</Tr>

										<Tr>
											<Td
												border='1px solid #eee'
												fontSize={{ base: 'xs', md: 'sm' }}
												fontWeight='bold'
											>
												Total Amount
											</Td>
											<Td
												textAlign='right'
												border='1px solid #eee'
												fontSize={{ base: 'xs', md: 'sm' }}
												fontWeight='bold'
											>
												{typeof totals.totalAmount === 'number'
													? totals.totalAmount.toLocaleString('en-US', {
															minimumFractionDigits: 2,
															maximumFractionDigits: 2,
														})
													: 'N/A'}{' '}
											</Td>
										</Tr>
									</Tbody>
								</Table>
							</Box>
						</Flex>
					</VStack>
				</Skeleton>
			</Box>
		</Box>
	);
};

export default SingleInvoice;
