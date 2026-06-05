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
import { useUserSession } from 'hooks/useUserSession';
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
import { useUserActivityLog } from 'hooks/useUserActivityLog';

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
	const { agencyName, agencyLogo } = useUserSession();

	const { createUserLog } = useUserActivityLog();

	const invoices = invoiceData?.data?.entries || [];
	const invoiceSetting = invoiceData?.invoiceSetting || {};

	const totals = {
		total_commission_excl_vat:
			invoiceData?.data?.total_commission_excl_vat || 0,
		vat_amount: invoiceData?.data?.total_vat_amount || 0,
		total_commission_incl_vat:
			invoiceData?.data?.total_commission_incl_vat || 0,
		totalAmount: invoiceData?.data?.totalAmount || 0,
		subTotal: invoiceData?.data?.subTotal || 0,
	};

	const invoiceNumber = invoiceData?.data?.invoiceNo || '-';
	const developerData = invoiceData?.data?.developer || {};
	const bankAccountData = invoiceData?.data?.bank_account || {};

	useEffect(() => {
		if (invoiceData?.data) {
			createUserLog({
				userId: user?._id,
				action: 'VIEW',
				entity: 'Invoice',
				entityType: 'Invoice',
				entityId: invoiceData?.data?._id || null,
				status: 'success',
				message: `${user?.fullName} viewed invoice.`,
			});
		}
		if (!invoiceData?.data && !invoiceLoading && invoiceError) {
			createUserLog({
				userId: user?._id,
				action: 'VIEW',
				entity: 'Invoice',
				entityType: 'Invoice',
				entityId: invoiceData?.data?._id || null,
				status: 'error',
				message: `${user?.fullName} attempted to view Invoice, but it was not found.`,
			});
		}
	}, [invoiceData]);

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
		// <Box>
		// 	<AppButton
		// 		leftIcon={<IoArrowBack />}
		// 		variant='ghost'
		// 		onClick={goBack}
		// 		mb='4'
		// 	>
		// 		Back
		// 	</AppButton>
		// 	<Box bg='gray.50' p={{ base: 4, md: 6, lg: 8 }}>
		// 		<Flex
		// 			mb={4}
		// 			justifyContent='space-between'
		// 			alignItems='center'
		// 			flexDir={{ base: 'column', sm: 'row' }}
		// 		>
		// 			<Flex alignItems='center' gap={2}>
		// 				<Text
		// 					fontSize='2xl'
		// 					fontWeight='bold'
		// 					display='flex'
		// 					alignItems='center'
		// 				>
		// 					Invoice :
		// 				</Text>
		// 				<Text fontSize='lg' display='flex' alignItems='center'>
		// 					{invoiceNumber}
		// 				</Text>
		// 			</Flex>

		// 			<Flex gap={2} mt={{ base: 4, sm: 0 }}>
		// 				<Menu>
		// 					<MenuButton
		// 						as={Button}
		// 						w={{ base: 'full', sm: '125px' }}
		// 						h='48px'
		// 						fontWeight='medium'
		// 						fontSize={{ base: 'md', lg: 'xl' }}
		// 						color='white'
		// 						colorScheme='brand'
		// 					>
		// 						Export
		// 					</MenuButton>
		// 					<MenuList>
		// 						<MenuItem onClick={() => handleExport('pdf')}>
		// 							Export as PDF
		// 						</MenuItem>
		// 						<MenuItem onClick={() => handleExport('print')}>
		// 							Print Invoice
		// 						</MenuItem>
		// 					</MenuList>
		// 				</Menu>
		// 			</Flex>
		// 		</Flex>

		// 		<Skeleton isLoaded={!isLoading}>
		// 			<VStack
		// 				id='invoice-pdf'
		// 				bg='white'
		// 				p={{ base: 4, md: 6, lg: 8 }}
		// 				shadow='lg'
		// 				spacing={4}
		// 				align='stretch'
		// 			>
		// 				<Box bg='#B79045' w='full' textAlign='center' p={4} color='white'>
		// 					<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight='bold'>
		// 						Invoice
		// 					</Text>
		// 				</Box>

		// 				<Flex
		// 					justify='space-between'
		// 					w='full'
		// 					mb={4}
		// 					flexDir={{ base: 'column', md: 'row' }}
		// 					align={{ base: 'stretch', md: 'flex-start' }}
		// 					gap={4}
		// 				>
		// 					<Box
		// 						w={{ base: 'full', md: '30%' }}
		// 						display='flex'
		// 						flexDirection='column'
		// 						gap={2}
		// 					>
		// 						<Image
		// 							src={agencyLogo}
		// 							alt={agencyName ? `${agencyName}` : 'Weam Elnaggar'}
		// 							width='200px'
		// 						/>

		// 						<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.700'>
		// 							{invoiceSetting?.location ?? 'N/A'}
		// 						</Text>

		// 						{invoiceSetting?.contactNumberPrimary && (
		// 							<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.700'>
		// 								<Text as='span' fontWeight='bold'>
		// 									Telephone:
		// 								</Text>{' '}
		// 								{[
		// 									invoiceSetting?.contactNumberPrimary,
		// 									invoiceSetting?.contactNumberAlternate,
		// 								]
		// 									.filter(Boolean)
		// 									.join(' / ') || 'N/A'}
		// 							</Text>
		// 						)}

		// 						{invoiceSetting?.TRN && (
		// 							<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.700'>
		// 								<Text as='span' fontWeight='bold'>
		// 									TRN:
		// 								</Text>{' '}
		// 								{invoiceSetting?.TRN}
		// 							</Text>
		// 						)}
		// 					</Box>

		// 					<Box w={{ base: 'full', md: '30%' }}>
		// 						<Box mb={4}>
		// 							<Text
		// 								fontSize={{ base: 'xs', md: 'sm' }}
		// 								py={1}
		// 								display='flex'
		// 							>
		// 								<Text
		// 									as='span'
		// 									fontWeight='bold'
		// 									w={{ base: '100px', md: '130px' }}
		// 								>
		// 									Invoice Date:
		// 								</Text>
		// 								<Box flex='1'>
		// 									{invoices.length > 0
		// 										? new Date(invoices[0].createdAt).toLocaleDateString()
		// 										: 'N/A'}
		// 								</Box>
		// 							</Text>

		// 							<Text
		// 								fontSize={{ base: 'xs', md: 'sm' }}
		// 								py={1}
		// 								display='flex'
		// 							>
		// 								<Text
		// 									as='span'
		// 									fontWeight='bold'
		// 									w={{ base: '100px', md: '130px' }}
		// 								>
		// 									Invoice No:
		// 								</Text>
		// 								<Box flex='1' textAlign='start'>
		// 									#{invoiceNumber}
		// 								</Box>
		// 							</Text>
		// 						</Box>

		// 						<Box w='full' color='black'>
		// 							<Text
		// 								fontWeight='bold'
		// 								fontSize={{ base: 'sm', md: 'md' }}
		// 								bg='#B79045'
		// 								color='white'
		// 								p={2}
		// 								textAlign='center'
		// 							>
		// 								Invoiced To
		// 							</Text>
		// 							<Box border='1px solid #eee' p={2} mt={2}>
		// 								<Text
		// 									fontSize={{ base: 'xs', md: 'sm' }}
		// 									borderBottom='1px solid #eee'
		// 									py={1}
		// 									textAlign='left'
		// 								>
		// 									{developerData.developer_name || 'N/A'}
		// 								</Text>
		// 								<Text
		// 									fontSize={{ base: 'xs', md: 'sm' }}
		// 									borderBottom='1px solid #eee'
		// 									py={1}
		// 									textAlign='left'
		// 								>
		// 									{developerData.address || '-'}
		// 								</Text>
		// 								<Text
		// 									fontSize={{ base: 'xs', md: 'sm' }}
		// 									py={1}
		// 									textAlign='left'
		// 								>
		// 									{developerData.country || '-'}
		// 								</Text>
		// 							</Box>
		// 							<Text fontSize={{ base: 'xs', md: 'sm' }} m={2}>
		// 								<Text as='span' fontWeight='bold'>
		// 									TRN:
		// 								</Text>{' '}
		// 								{developerData.trn || '-'}
		// 							</Text>
		// 						</Box>
		// 					</Box>
		// 				</Flex>

		// 				<Box
		// 					className='table-container'
		// 					overflowX='auto'
		// 					overflowY='auto'
		// 					maxHeight='700px'
		// 					w='full'
		// 				>
		// 					<Table
		// 						variant='simple'
		// 						size='sm'
		// 						minWidth={{ base: '800px', md: '100%' }}
		// 					>
		// 						<Thead
		// 							bg='#B79045 !important'
		// 							h='50px !important'
		// 							position='sticky'
		// 							top='0'
		// 							zIndex='1'
		// 						>
		// 							<Tr>
		// 								<Th color='white' fontSize={{ base: 'xs', md: 'sm' }}>
		// 									SN
		// 								</Th>
		// 								<Th color='white' fontSize={{ base: 'xs', md: 'sm' }}>
		// 									Unit No
		// 								</Th>
		// 								<Th color='white' fontSize={{ base: 'xs', md: 'sm' }}>
		// 									Name of Referring Party
		// 								</Th>
		// 								{/* <Th color="white" fontSize={{ base: "xs", md: "sm" }}>
		//                 Claim Type
		//               </Th> */}
		// 								<Th color='white' fontSize={{ base: 'xs', md: 'sm' }}>
		// 									Commission %
		// 								</Th>
		// 								<Th color='white' fontSize={{ base: 'xs', md: 'sm' }}>
		// 									Unit Price
		// 								</Th>
		// 								<Th color='white' fontSize={{ base: 'xs', md: 'sm' }}>
		// 									Total Commission EXCL. VAT
		// 								</Th>
		// 								<Th color='white' fontSize={{ base: 'xs', md: 'sm' }}>
		// 									VAT %
		// 								</Th>
		// 								<Th color='white' fontSize={{ base: 'xs', md: 'sm' }}>
		// 									VAT Amount
		// 								</Th>
		// 								<Th color='white' fontSize={{ base: 'xs', md: 'sm' }}>
		// 									Total Commission incl. VAT
		// 								</Th>
		// 							</Tr>
		// 						</Thead>
		// 						<Tbody>
		// 							{invoices.length > 0 ? (
		// 								invoices.map((invoice, index) => (
		// 									<Tr key={invoice._id}>
		// 										<Td
		// 											textAlign='center'
		// 											border='1px solid #CDCDCD'
		// 											py={4}
		// 											fontSize={{ base: 'sm', md: 'md' }}
		// 										>
		// 											{index + 1}
		// 										</Td>
		// 										<Td
		// 											border='1px solid #CDCDCD'
		// 											py={4}
		// 											fontSize={{ base: 'sm', md: 'md' }}
		// 										>
		// 											{invoice.unit_no || '-'}
		// 										</Td>
		// 										<Td
		// 											border='1px solid #CDCDCD'
		// 											py={4}
		// 											fontSize={{ base: 'sm', md: 'md' }}
		// 										>
		// 											{invoice.name_of_referring_party || '-'}
		// 										</Td>
		// 										<Td
		// 											textAlign='center'
		// 											border='1px solid #CDCDCD'
		// 											py={4}
		// 											fontSize={{ base: 'sm', md: 'md' }}
		// 										>
		// 											{`${invoice.commission_percentage || 0}%`}
		// 										</Td>
		// 										<Td
		// 											textAlign='right'
		// 											border='1px solid #CDCDCD'
		// 											py={4}
		// 											fontSize={{ base: 'sm', md: 'md' }}
		// 										>
		// 											{(invoice.unit_price || 0).toLocaleString('en-US', {
		// 												minimumFractionDigits: 2,
		// 												maximumFractionDigits: 2,
		// 											})}
		// 										</Td>
		// 										<Td
		// 											textAlign='right'
		// 											border='1px solid #CDCDCD'
		// 											py={4}
		// 											fontSize={{ base: 'sm', md: 'md' }}
		// 										>
		// 											{(
		// 												invoice.total_commission_excl_vat || 0
		// 											).toLocaleString('en-US', {
		// 												minimumFractionDigits: 2,
		// 												maximumFractionDigits: 2,
		// 											})}
		// 										</Td>
		// 										<Td
		// 											textAlign='center'
		// 											border='1px solid #CDCDCD'
		// 											py={4}
		// 											fontSize={{ base: 'sm', md: 'md' }}
		// 										>
		// 											{`${invoice.vat_percentage || 5}%`}
		// 										</Td>
		// 										<Td
		// 											textAlign='right'
		// 											border='1px solid #CDCDCD'
		// 											py={4}
		// 											fontSize={{ base: 'sm', md: 'md' }}
		// 										>
		// 											{(invoice.vat_amount || 0).toLocaleString('en-US', {
		// 												minimumFractionDigits: 2,
		// 												maximumFractionDigits: 2,
		// 											})}
		// 										</Td>
		// 										<Td
		// 											textAlign='right'
		// 											border='1px solid #CDCDCD'
		// 											py={4}
		// 											fontSize={{ base: 'sm', md: 'md' }}
		// 										>
		// 											{(
		// 												invoice.total_commission_incl_vat || 0
		// 											).toLocaleString('en-US', {
		// 												minimumFractionDigits: 2,
		// 												maximumFractionDigits: 2,
		// 											})}
		// 										</Td>
		// 									</Tr>
		// 								))
		// 							) : (
		// 								<Tr>
		// 									<Td
		// 										colSpan={12}
		// 										textAlign='center'
		// 										border='1px solid #CDCDCD'
		// 										py={4} // Consistent padding for "No data" row
		// 										fontSize={{ base: 'sm', md: 'md' }}
		// 									>
		// 										No data available
		// 									</Td>
		// 								</Tr>
		// 							)}
		// 						</Tbody>
		// 					</Table>
		// 				</Box>

		// 				<Flex
		// 					w='full'
		// 					padding={2}
		// 					mb={4}
		// 					border='1px solid #CDCDCD'
		// 					flexDirection='column'
		// 				>
		// 					<Text fontWeight='bold'>Total :</Text>
		// 					<Text fontSize={{ base: 'sm', md: 'md' }} wordBreak='break-word'>
		// 						{typeof totals.subTotal === 'number'
		// 							? convertToWords(totals.subTotal).charAt(0).toUpperCase() +
		// 								convertToWords(totals.subTotal).slice(1)
		// 							: 'N/A'}
		// 					</Text>
		// 				</Flex>

		// 				<Flex
		// 					w='full'
		// 					justify='space-between'
		// 					gap={4}
		// 					flexDir={{ base: 'column', lg: 'row' }}
		// 				>
		// 					<Box w={{ base: 'full', lg: '35%' }} p={4} color='black'>
		// 						<Text
		// 							fontWeight='bold'
		// 							mb={2}
		// 							bg='#b79045'
		// 							p={2}
		// 							color='white'
		// 							fontSize={{ base: 'sm', md: 'md' }}
		// 						>
		// 							Bank Account Details:
		// 						</Text>
		// 						<Text fontSize={{ base: 'xs', md: 'sm' }}>
		// 							Account Name: {bankAccountData.account_holder_name || '-'}
		// 						</Text>
		// 						<Text fontSize={{ base: 'xs', md: 'sm' }}>
		// 							Account Number: {bankAccountData.account_number || '-'}
		// 						</Text>
		// 						<Text fontSize={{ base: 'xs', md: 'sm' }}>
		// 							IBAN: {bankAccountData.iban || '-'}
		// 						</Text>
		// 						<Text fontSize={{ base: 'xs', md: 'sm' }}>
		// 							Swift Code: {bankAccountData.swift_code || '-'}
		// 						</Text>
		// 						<Text fontSize={{ base: 'xs', md: 'sm' }}>
		// 							Bank: {bankAccountData.bank_name || '-'}
		// 						</Text>
		// 						<Text fontSize={{ base: 'xs', md: 'sm' }}>
		// 							Bank Address: {bankAccountData.branch_address || '-'}
		// 						</Text>
		// 					</Box>

		// 					<Box w={{ base: 'full', lg: '30%' }} p={4}>
		// 						<Table
		// 							variant='simple'
		// 							size='sm'
		// 							w='full'
		// 							border='1px solid #eee'
		// 						>
		// 							<Thead>
		// 								<Tr bg='#B79045' color='white'>
		// 									<Th
		// 										color='white'
		// 										textAlign='left'
		// 										py={3}
		// 										fontSize={{ base: 'xs', md: 'sm' }}
		// 									>
		// 										Invoice Summary
		// 									</Th>
		// 									<Th
		// 										color='white'
		// 										textAlign='right'
		// 										py={3}
		// 										w='40%'
		// 										fontSize={{ base: 'xs', md: 'sm' }}
		// 									>
		// 										{invoiceSetting?.currency ?? 'AED'}
		// 									</Th>
		// 								</Tr>
		// 							</Thead>
		// 							<Tbody>
		// 								<Tr>
		// 									<Td
		// 										border='1px solid #eee'
		// 										fontSize={{ base: 'xs', md: 'sm' }}
		// 									>
		// 										Unit Total
		// 									</Td>
		// 									<Td
		// 										textAlign='right'
		// 										border='1px solid #eee'
		// 										fontSize={{ base: 'xs', md: 'sm' }}
		// 									>
		// 										{typeof totals.subTotal === 'number'
		// 											? totals.subTotal.toLocaleString('en-US', {
		// 													minimumFractionDigits: 2,
		// 													maximumFractionDigits: 2,
		// 												})
		// 											: 'N/A'}{' '}
		// 									</Td>
		// 								</Tr>

		// 								<Tr>
		// 									<Td
		// 										border='1px solid #eee'
		// 										fontSize={{ base: 'xs', md: 'sm' }}
		// 									>
		// 										Total Commission EXCL. VAT
		// 									</Td>
		// 									<Td
		// 										textAlign='right'
		// 										border='1px solid #eee'
		// 										fontSize={{ base: 'xs', md: 'sm' }}
		// 									>
		// 										{typeof totals.total_commission_excl_vat === 'number'
		// 											? totals.total_commission_excl_vat.toLocaleString(
		// 													'en-US',
		// 													{
		// 														minimumFractionDigits: 2,
		// 														maximumFractionDigits: 2,
		// 													},
		// 												)
		// 											: 'N/A'}{' '}
		// 									</Td>
		// 								</Tr>
		// 								<Tr>
		// 									<Td
		// 										border='1px solid #eee'
		// 										fontSize={{ base: 'xs', md: 'sm' }}
		// 									>
		// 										VAT Amount
		// 									</Td>
		// 									<Td
		// 										textAlign='right'
		// 										border='1px solid #eee'
		// 										fontSize={{ base: 'xs', md: 'sm' }}
		// 									>
		// 										{typeof totals.vat_amount === 'number'
		// 											? totals.vat_amount.toLocaleString('en-US', {
		// 													minimumFractionDigits: 2,
		// 													maximumFractionDigits: 2,
		// 												})
		// 											: 'N/A'}{' '}
		// 									</Td>
		// 								</Tr>
		// 								<Tr>
		// 									<Td
		// 										border='1px solid #eee'
		// 										fontSize={{ base: 'xs', md: 'sm' }}
		// 									>
		// 										Total Commission Include VAT
		// 									</Td>
		// 									<Td
		// 										textAlign='right'
		// 										border='1px solid #eee'
		// 										fontSize={{ base: 'xs', md: 'sm' }}
		// 									>
		// 										{typeof totals.total_commission_incl_vat === 'number'
		// 											? totals.total_commission_incl_vat.toLocaleString(
		// 													'en-US',
		// 													{
		// 														minimumFractionDigits: 2,
		// 														maximumFractionDigits: 2,
		// 													},
		// 												)
		// 											: 'N/A'}{' '}
		// 									</Td>
		// 								</Tr>

		// 								{/* <Tr>
		// 									<Td
		// 										border='1px solid #eee'
		// 										fontSize={{ base: 'xs', md: 'sm' }}
		// 										fontWeight='bold'
		// 									>
		// 										Total Amount
		// 									</Td>
		// 									<Td
		// 										textAlign='right'
		// 										border='1px solid #eee'
		// 										fontSize={{ base: 'xs', md: 'sm' }}
		// 										fontWeight='bold'
		// 									>
		// 										{typeof totals.totalAmount === 'number'
		// 											? totals.totalAmount.toLocaleString('en-US', {
		// 													minimumFractionDigits: 2,
		// 													maximumFractionDigits: 2,
		// 												})
		// 											: 'N/A'}{' '}
		// 									</Td>
		// 								</Tr> */}
		// 							</Tbody>
		// 						</Table>
		// 					</Box>
		// 				</Flex>
		// 			</VStack>
		// 		</Skeleton>
		// 	</Box>
		// </Box>

		<Box>
			<AppButton
				leftIcon={<IoArrowBack />}
				variant='ghost'
				onClick={goBack}
				mb='4'
			>
				Back
			</AppButton>

			<Box bg='bg.app' p={{ base: 4, md: 6, lg: 8 }} borderRadius='xl'>
				<Flex
					mb={6}
					justifyContent='space-between'
					alignItems='center'
					flexDir={{ base: 'column', sm: 'row' }}
					gap={4}
				>
					<Flex alignItems='center' gap={3}>
						<Text fontSize='2xl' fontWeight='bold' color='text.heading'>
							Invoice:
						</Text>
						<Text
							fontSize='lg'
							color='text.accent'
							fontWeight='semibold'
							fontFamily='mono'
						>
							{invoiceNumber}
						</Text>
					</Flex>

					<Flex gap={3}>
						<Menu>
							<MenuButton as={Button} variant='brand' px={6}>
								Export
							</MenuButton>
							<MenuList bg='bg.surface' borderColor='border.default'>
								<MenuItem
									onClick={() => handleExport('pdf')}
									_hover={{ bg: 'bg.elevated', color: 'gold.primary' }}
								>
									Export as PDF
								</MenuItem>
								<MenuItem
									onClick={() => handleExport('print')}
									_hover={{ bg: 'bg.elevated', color: 'gold.primary' }}
								>
									Print Invoice
								</MenuItem>
							</MenuList>
						</Menu>
					</Flex>
				</Flex>

				<Skeleton
					isLoaded={!isLoading}
					startColor='rgba(212, 175, 55, 0.1)'
					endColor='rgba(26, 53, 80, 0.2)'
					borderRadius='xl'
				>
					<VStack
						id='invoice-pdf'
						bg='bg.surface'
						p={{ base: 5, md: 8 }}
						borderRadius='xl'
						border='1px solid'
						borderColor='border.default'
						boxShadow='card'
						spacing={6}
						align='stretch'
					>
						{/* Invoice Header */}
						<Box
							bgGradient='linear-gradient(135deg, #D4AF37 0%, #C9A227 100%)'
							w='full'
							textAlign='center'
							p={4}
							borderRadius='lg'
						>
							<Text
								fontSize={{ base: 'lg', md: 'xl' }}
								fontWeight='bold'
								color='#000000'
							>
								Invoice
							</Text>
						</Box>

						{/* Company & Invoice Details */}
						<Flex
							justify='space-between'
							w='full'
							flexDir={{ base: 'column', md: 'row' }}
							align={{ base: 'stretch', md: 'flex-start' }}
							gap={6}
						>
							{/* Company Info */}
							<Box
								w={{ base: 'full', md: '35%' }}
								display='flex'
								flexDirection='column'
								gap={3}
							>
								<Image
									src={agencyLogo}
									alt={agencyName ? `${agencyName}` : 'Weam Elnaggar'}
									width='180px'
								/>

								<Text fontSize='sm' color='text.body'>
									{invoiceSetting?.location ?? 'N/A'}
								</Text>

								{invoiceSetting?.contactNumberPrimary && (
									<Text fontSize='sm' color='text.body'>
										<Text as='span' fontWeight='semibold'>
											Telephone:
										</Text>{' '}
										{[
											invoiceSetting?.contactNumberPrimary,
											invoiceSetting?.contactNumberAlternate,
										]
											.filter(Boolean)
											.join(' / ') || 'N/A'}
									</Text>
								)}

								{invoiceSetting?.TRN && (
									<Text fontSize='sm' color='text.body'>
										<Text as='span' fontWeight='semibold'>
											TRN:
										</Text>{' '}
										{invoiceSetting?.TRN}
									</Text>
								)}
							</Box>

							{/* Invoice & Customer Info */}
							<Box w={{ base: 'full', md: '35%' }}>
								<Box mb={4}>
									<Flex py={2} align='center'>
										<Text
											as='span'
											fontWeight='semibold'
											w='110px'
											color='text.muted'
										>
											Invoice Date:
										</Text>
										<Text color='text.body'>
											{invoices.length > 0
												? new Date(invoices[0].createdAt).toLocaleDateString()
												: 'N/A'}
										</Text>
									</Flex>

									<Flex py={2} align='center'>
										<Text
											as='span'
											fontWeight='semibold'
											w='110px'
											color='text.muted'
										>
											Invoice No:
										</Text>
										<Text
											color='text.accent'
											fontWeight='semibold'
											fontFamily='mono'
										>
											#{invoiceNumber}
										</Text>
									</Flex>
								</Box>

								<Box w='full'>
									<Text
										fontWeight='bold'
										fontSize='md'
										bg='rgba(212, 175, 55, 0.15)'
										color='gold.primary'
										p={2}
										textAlign='center'
										borderRadius='lg'
									>
										Invoiced To
									</Text>
									<Box
										border='1px solid'
										borderColor='border.default'
										borderRadius='lg'
										p={3}
										mt={2}
									>
										<Text
											fontSize='sm'
											borderBottom='1px solid'
											borderBottomColor='border.subtle'
											py={2}
											color='text.heading'
											fontWeight='500'
										>
											{developerData.developer_name || 'N/A'}
										</Text>
										<Text
											fontSize='sm'
											borderBottom='1px solid'
											borderBottomColor='border.subtle'
											py={2}
											color='text.body'
										>
											{developerData.address || '-'}
										</Text>
										<Text fontSize='sm' py={2} color='text.body'>
											{developerData.country || '-'}
										</Text>
									</Box>
									<Text fontSize='sm' m={2}>
										<Text as='span' fontWeight='semibold'>
											TRN:
										</Text>{' '}
										{developerData.trn || '-'}
									</Text>
								</Box>
							</Box>
						</Flex>

						{/* Invoice Items Table */}
						<Box
							overflowX='auto'
							overflowY='auto'
							maxHeight='500px'
							w='full'
							borderRadius='lg'
							border='1px solid'
							borderColor='border.default'
						>
							<Table variant='simple' size='sm' minWidth='800px'>
								<Thead position='sticky' top='0' zIndex='1' bg='bg.elevated'>
									<Tr>
										<Th
											color='gold.primary'
											fontSize='11px'
											fontWeight='700'
											letterSpacing='0.08em'
										>
											SN
										</Th>
										<Th
											color='gold.primary'
											fontSize='11px'
											fontWeight='700'
											letterSpacing='0.08em'
										>
											Unit No
										</Th>
										<Th
											color='gold.primary'
											fontSize='11px'
											fontWeight='700'
											letterSpacing='0.08em'
										>
											Name of Referring Party
										</Th>
										<Th
											color='gold.primary'
											fontSize='11px'
											fontWeight='700'
											letterSpacing='0.08em'
										>
											Commission %
										</Th>
										<Th
											color='gold.primary'
											fontSize='11px'
											fontWeight='700'
											letterSpacing='0.08em'
										>
											Unit Price
										</Th>
										<Th
											color='gold.primary'
											fontSize='11px'
											fontWeight='700'
											letterSpacing='0.08em'
										>
											Total Commission EXCL. VAT
										</Th>
										<Th
											color='gold.primary'
											fontSize='11px'
											fontWeight='700'
											letterSpacing='0.08em'
										>
											VAT %
										</Th>
										<Th
											color='gold.primary'
											fontSize='11px'
											fontWeight='700'
											letterSpacing='0.08em'
										>
											VAT Amount
										</Th>
										<Th
											color='gold.primary'
											fontSize='11px'
											fontWeight='700'
											letterSpacing='0.08em'
										>
											Total Commission incl. VAT
										</Th>
									</Tr>
								</Thead>
								<Tbody>
									{invoices.length > 0 ? (
										invoices.map((invoice, index) => (
											<Tr key={invoice._id} _hover={{ bg: 'bg.elevated' }}>
												<Td
													textAlign='center'
													borderBottom='1px solid'
													borderBottomColor='border.subtle'
													py={3}
													fontSize='13px'
													color='text.muted'
												>
													{index + 1}
												</Td>
												<Td
													borderBottom='1px solid'
													borderBottomColor='border.subtle'
													py={3}
													fontSize='13px'
													color='text.body'
												>
													{invoice.unit_no || '-'}
												</Td>
												<Td
													borderBottom='1px solid'
													borderBottomColor='border.subtle'
													py={3}
													fontSize='13px'
													color='text.body'
												>
													{invoice.name_of_referring_party || '-'}
												</Td>
												<Td
													textAlign='center'
													borderBottom='1px solid'
													borderBottomColor='border.subtle'
													py={3}
													fontSize='13px'
													color='text.body'
												>
													{`${invoice.commission_percentage || 0}%`}
												</Td>
												<Td
													textAlign='right'
													borderBottom='1px solid'
													borderBottomColor='border.subtle'
													py={3}
													fontSize='13px'
													color='text.body'
													fontFamily='mono'
												>
													{(invoice.unit_price || 0).toLocaleString('en-US', {
														minimumFractionDigits: 2,
														maximumFractionDigits: 2,
													})}
												</Td>
												<Td
													textAlign='right'
													borderBottom='1px solid'
													borderBottomColor='border.subtle'
													py={3}
													fontSize='13px'
													color='gold.primary'
													fontWeight='500'
													fontFamily='mono'
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
													borderBottom='1px solid'
													borderBottomColor='border.subtle'
													py={3}
													fontSize='13px'
													color='text.body'
												>
													{`${invoice.vat_percentage || 5}%`}
												</Td>
												<Td
													textAlign='right'
													borderBottom='1px solid'
													borderBottomColor='border.subtle'
													py={3}
													fontSize='13px'
													color='text.body'
													fontFamily='mono'
												>
													{(invoice.vat_amount || 0).toLocaleString('en-US', {
														minimumFractionDigits: 2,
														maximumFractionDigits: 2,
													})}
												</Td>
												<Td
													textAlign='right'
													borderBottom='1px solid'
													borderBottomColor='border.subtle'
													py={3}
													fontSize='13px'
													color='gold.primary'
													fontWeight='600'
													fontFamily='mono'
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
												borderBottom='1px solid'
												borderBottomColor='border.subtle'
												py={8}
												color='text.muted'
											>
												No data available
											</Td>
										</Tr>
									)}
								</Tbody>
							</Table>
						</Box>

						{/* Amount in Words */}
						<Box
							w='full'
							p={3}
							borderRadius='lg'
							border='1px solid'
							borderColor='border.default'
							bg='bg.elevated'
						>
							<Text fontWeight='semibold' color='text.muted' mb={1}>
								Total :
							</Text>
							<Text fontSize='sm' color='text.accent' fontStyle='italic'>
								{typeof totals.subTotal === 'number'
									? convertToWords(totals.subTotal).charAt(0).toUpperCase() +
										convertToWords(totals.subTotal).slice(1)
									: 'N/A'}
							</Text>
						</Box>

						{/* Bank Details & Summary */}
						<Flex
							w='full'
							justify='space-between'
							gap={6}
							flexDir={{ base: 'column', lg: 'row' }}
						>
							{/* Bank Account Details */}
							<Box
								w={{ base: 'full', lg: '40%' }}
								p={4}
								borderRadius='lg'
								border='1px solid'
								borderColor='border.default'
							>
								<Text
									fontWeight='bold'
									mb={3}
									bg='rgba(212, 175, 55, 0.15)'
									p={2}
									color='gold.primary'
									fontSize='sm'
									textAlign='center'
									borderRadius='lg'
								>
									Bank Account Details
								</Text>
								<VStack spacing={2} align='stretch'>
									<Text fontSize='sm'>
										<Text as='span' fontWeight='semibold' color='text.muted'>
											Account Name:
										</Text>{' '}
										{bankAccountData.account_holder_name || '-'}
									</Text>
									<Text fontSize='sm'>
										<Text as='span' fontWeight='semibold' color='text.muted'>
											Account Number:
										</Text>{' '}
										{bankAccountData.account_number || '-'}
									</Text>
									<Text fontSize='sm'>
										<Text as='span' fontWeight='semibold' color='text.muted'>
											IBAN:
										</Text>{' '}
										<Text as='span' fontFamily='mono'>
											{bankAccountData.iban || '-'}
										</Text>
									</Text>
									<Text fontSize='sm'>
										<Text as='span' fontWeight='semibold' color='text.muted'>
											Swift Code:
										</Text>{' '}
										{bankAccountData.swift_code || '-'}
									</Text>
									<Text fontSize='sm'>
										<Text as='span' fontWeight='semibold' color='text.muted'>
											Bank:
										</Text>{' '}
										{bankAccountData.bank_name || '-'}
									</Text>
									<Text fontSize='sm'>
										<Text as='span' fontWeight='semibold' color='text.muted'>
											Bank Address:
										</Text>{' '}
										{bankAccountData.branch_address || '-'}
									</Text>
								</VStack>
							</Box>

							{/* Invoice Summary */}
							<Box
								w={{ base: 'full', lg: '35%' }}
								borderRadius='lg'
								border='1px solid'
								borderColor='border.default'
								overflow='hidden'
							>
								<Table variant='simple' size='sm'>
									<Thead bg='bg.elevated'>
										<Tr>
											<Th
												color='gold.primary'
												fontSize='12px'
												fontWeight='700'
												py={3}
											>
												Invoice Summary
											</Th>
											<Th
												color='gold.primary'
												fontSize='12px'
												fontWeight='700'
												textAlign='right'
												py={3}
											>
												{invoiceSetting?.currency ?? 'AED'}
											</Th>
										</Tr>
									</Thead>
									<Tbody>
										<Tr
											borderBottom='1px solid'
											borderBottomColor='border.subtle'
										>
											<Td fontSize='13px' color='text.muted' py={2}>
												Unit Total
											</Td>
											<Td
												textAlign='right'
												fontSize='13px'
												color='text.body'
												fontFamily='mono'
												py={2}
											>
												{typeof totals.subTotal === 'number'
													? totals.subTotal.toLocaleString('en-US', {
															minimumFractionDigits: 2,
															maximumFractionDigits: 2,
														})
													: 'N/A'}
											</Td>
										</Tr>
										<Tr
											borderBottom='1px solid'
											borderBottomColor='border.subtle'
										>
											<Td fontSize='13px' color='text.muted' py={2}>
												Total Commission EXCL. VAT
											</Td>
											<Td
												textAlign='right'
												fontSize='13px'
												color='gold.primary'
												fontFamily='mono'
												py={2}
											>
												{typeof totals.total_commission_excl_vat === 'number'
													? totals.total_commission_excl_vat.toLocaleString(
															'en-US',
															{
																minimumFractionDigits: 2,
																maximumFractionDigits: 2,
															},
														)
													: 'N/A'}
											</Td>
										</Tr>
										<Tr
											borderBottom='1px solid'
											borderBottomColor='border.subtle'
										>
											<Td fontSize='13px' color='text.muted' py={2}>
												VAT Amount
											</Td>
											<Td
												textAlign='right'
												fontSize='13px'
												color='text.body'
												fontFamily='mono'
												py={2}
											>
												{typeof totals.vat_amount === 'number'
													? totals.vat_amount.toLocaleString('en-US', {
															minimumFractionDigits: 2,
															maximumFractionDigits: 2,
														})
													: 'N/A'}
											</Td>
										</Tr>
										<Tr bg='rgba(212, 175, 55, 0.05)'>
											<Td
												fontSize='14px'
												fontWeight='bold'
												color='text.heading'
												py={3}
											>
												Total Commission incl. VAT
											</Td>
											<Td
												textAlign='right'
												fontSize='14px'
												fontWeight='bold'
												color='gold.primary'
												fontFamily='mono'
												py={3}
											>
												{typeof totals.total_commission_incl_vat === 'number'
													? totals.total_commission_incl_vat.toLocaleString(
															'en-US',
															{
																minimumFractionDigits: 2,
																maximumFractionDigits: 2,
															},
														)
													: 'N/A'}
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
