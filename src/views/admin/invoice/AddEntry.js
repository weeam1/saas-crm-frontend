import React, { useEffect, useMemo, useState } from 'react';
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
	Button,
	HStack,
	useBreakpointValue,
	useColorModeValue,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	IconButton,
	Tooltip,
	Breadcrumb,
} from '@chakra-ui/react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import DeleteIconSvg from '../../../assets/img/bankaccount/Vector.png';
import EditIconSvg from '../../../assets/img/bankaccount/ic_baseline-edit.png';
import { BiError } from 'react-icons/bi';
import { FaEllipsisV, FaTrash, FaEdit } from 'react-icons/fa';
import { useFetchItemsQuery } from 'api/apiSlice';
import Add from './Add';
import Edit from './Edit';
import Delete from './components/DeleteEntry';
import BackImg from '../../../assets/img/Invoice/Vector.svg';
import TableLoading from 'components/loading/TableLoading';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import AppButton from 'components/shared/AppButton';
import { IoArrowBack } from 'react-icons/io5';
import { format } from 'date-fns';
import BreadCrumb from 'components/shared/BreadCrumb';

const AddEntry = ({ props }) => {
	const textColor = useColorModeValue('gray.500', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

	const tableSize = useBreakpointValue({ base: 'sm', md: 'md', lg: 'lg' });
	const fontSizeTh = useBreakpointValue({ base: 'xs', md: 'sm', lg: 'md' });
	const fontSizeTd = useBreakpointValue({ base: 'xs', md: 'sm', lg: 'md' });
	const fontSizeSummaryLabel = useBreakpointValue({ base: '12px', md: '14px' });
	const fontSizeSummaryValue = useBreakpointValue({ base: '14px', md: '16px' });
	const paddingX = useBreakpointValue({ base: 4, md: 6 });

	const navigate = useNavigate();
	const { id } = useParams();
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedId, setSelectedId] = useState(null);

	const columns = [
		'SN',
		'Unit No',
		'Referring Party',
		'Commission %',
		'Unit Price',
		'Commission EXCL. VAT',
		'VAT %',
		'VAT Amount',
		'Commission incl. VAT',
		// 'Total',
		'Created Date',
		'Action',
	];

	const {
		data: entriesData,
		isLoading: entriesLoading,
		error: entriesError,
		refetch,
	} = useFetchItemsQuery(
		{
			path: `/invoices/entries/invoice/${id}`,
		},
		{
			skip: !id,
		}
	);
	const docLength = entriesData?.doc.length;
	const developerId = entriesData?.doc?.[0]?.invoice?.developer?.id;
	const invoiceId = entriesData?.doc?.[0]?.invoice?._id;

	const [tableData, setTableData] = useState([]);
	const [summary, setSummary] = useState({
		totalAmount: 0,
		subTotal: 0,
		totalCommissionExclVat: 0,
		totalVatAmount: 0,
		totalCommissionInclVat: 0,
	});

	useEffect(() => {
		if (entriesData?.doc) {
			setTableData(entriesData.doc);

			const subTotal = entriesData.doc.reduce(
				(sum, entry) => sum + (Number(entry.unit_price) || 0),
				0
			);
			const totalCommissionExclVat = entriesData.doc.reduce(
				(sum, entry) => sum + (Number(entry.total_commission_excl_vat) || 0),
				0
			);
			const totalVatAmount = entriesData.doc.reduce(
				(sum, entry) => sum + (Number(entry.vat_amount) || 0),
				0
			);
			const totalCommissionInclVat = entriesData.doc.reduce(
				(sum, entry) => sum + (Number(entry.total_commission_incl_vat) || 0),
				0
			);
			const totalAmount = subTotal + totalCommissionInclVat;

			setSummary({
				totalAmount,
				subTotal,
				totalCommissionExclVat,
				totalVatAmount,
				totalCommissionInclVat,
			});
		} else if (!entriesLoading) {
			setTableData([]);
			setSummary({
				totalAmount: 0,
				subTotal: 0,
				totalCommissionExclVat: 0,
				totalVatAmount: 0,
				totalCommissionInclVat: 0,
			});
		}
	}, [entriesData, entriesLoading]);

	const goBack = () => {
		navigate(`/invoice/developers/invoices/${developerId}`, {
			state: { refetch: true },
		});
	};

	const breadcrumbItems = useMemo(
		() => [
			{ label: 'Developers', path: '/invoice/developer' },
			{
				label: 'Invoices',
				path: `/invoice/developers/invoices/${developerId}`,
			},
			{
				label: 'Invoice Entry',
				path: `/invoice/developers/invoices/entries/${invoiceId}`,
			},
		],
		[invoiceId, developerId]
	);

	const handleEditClick = (entryId) => {
		setSelectedId(entryId);
		setIsEditModalOpen(true);
	};

	const handleDeleteClick = (entryId) => {
		setSelectedId(entryId);
		setIsDeleteModalOpen(true);
	};

	if (entriesError) {
		return (
			<Box
				minH='700px'
				display='flex'
				alignItems='center'
				justifyContent='center'
				p={paddingX}
				bg='white'
				borderRadius='lg'
				boxShadow='md'
			>
				<HStack spacing={3} color='red.500'>
					<BiError size={25} />
					<Text
						fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
						fontWeight='medium'
					>
						No Entries Found!
					</Text>
				</HStack>
			</Box>
		);
	}

	// Fixed table height constants
	const fixedTableHeight = tableData?.length > 10 ? '700px' : 'fit-content';
	const rowHeight = 48;
	const headerHeight = 48;

	return (
		<Box>
			<BreadCrumb items={breadcrumbItems} />

			<AppButton leftIcon={<IoArrowBack />} onClick={goBack} mb='4'>
				Back
			</AppButton>

			<Box
				bg='white'
				p={paddingX}
				fontFamily="'DM Sans', sans-serif"
				minH='100vh'
				borderRadius='lg'
				shadow='sm'
			>
				{/* Header Section */}
				<Flex
					mb={6}
					justifyContent='space-between'
					alignItems='center'
					flexDir={{ base: 'column', sm: 'row' }}
					p={2}
				>
					<Text
						color={'secondaryGray.900'}
						fontSize='22px'
						fontWeight='700'
						mb={{ base: 2, md: 0 }}
					>
						Invoice Entries{' '}
						{docLength > 0 && (
							<>
								(
								<CountUpComponent targetNumber={docLength} />)
							</>
						)}
					</Text>

					<HStack spacing={3}>
						<Button
							w={{ base: 'full', sm: '100px', md: '110px', lg: '120px' }}
							h={{ base: '36px', sm: '40px', md: '42px', lg: '44px' }}
							fontWeight='medium'
							fontSize={{ base: 'sm', sm: 'sm', md: 'md', lg: 'md' }}
							color='white'
							bg='#B79045'
							onClick={() => setIsAddModalOpen(true)}
							borderRadius='6px'
							_hover={{ bg: '#A47B38' }}
							_active={{ bg: '#946B2E' }}
						>
							Add Entry
						</Button>

						{tableData.length > 0 && (
							<Link
								to={`/invoice/developers/invoices/view/${tableData[0]?.invoice?.invoiceNo}`}
							>
								<Button
									w={{ base: 'full', sm: '100px', md: '110px', lg: '120px' }}
									h={{ base: '36px', sm: '40px', md: '42px', lg: '44px' }}
									fontWeight='medium'
									fontSize={{ base: 'sm', sm: 'sm', md: 'md', lg: 'md' }}
									color='white'
									bg='#B79045'
									borderRadius='6px'
									_hover={{ bg: '#A47B38' }}
									_active={{ bg: '#946B2E' }}
								>
									View Invoice
								</Button>
							</Link>
						)}
					</HStack>
				</Flex>

				{/* Table Section */}
				<Box
					height={tableData.length < 10 ? 'fit-content' : '70vh'}
					overflowY='auto'
					scrollBehavior='smooth'
					borderRadius='md'
					boxShadow='sm'
					bg='white'
				>
					<Table variant='striped' size='sm' bg='white'>
						<Thead
							position='sticky'
							top={0}
							bg='white'
							zIndex={2}
							boxShadow='0px 2px 8px rgba(0, 0, 0, 0.1)'
						>
							<Tr>
								{columns.map((header, index) => (
									<Th
										key={index}
										color='black'
										fontSize={fontSizeTh}
										fontWeight='medium'
										bg='brand.200'
										whiteSpace='nowrap'
										py={4}
									>
										{header}
									</Th>
								))}
							</Tr>
						</Thead>
						<Tbody>
							{entriesLoading ? (
								<TableLoading columns={columns} length='10' />
							) : tableData.length === 0 ? (
								<Tr h={`${rowHeight}px`}>
									<Td
										colSpan={10}
										py={12}
										textAlign='center'
										borderColor='gray.200'
										bg='white'
										h={fixedTableHeight}
									>
										<HStack
											justifyContent='center'
											spacing={4}
											color='gray.500'
										>
											<BiError size={30} />
											<Text
												fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
												fontWeight='semibold'
												color='gray.600'
											>
												No Entry Available
											</Text>
										</HStack>
									</Td>
								</Tr>
							) : (
								tableData.map((entry, index) => (
									<Tr
										key={entry._id}
										bg={index % 2 === 0 ? 'white' : 'gray.50'}
										_hover={{
											bg: 'gray.100',
											transition: 'background-color 0.3s ease',
										}}
										h={`${rowHeight}px`}
										borderBottom='1px solid'
										borderColor='gray.200'
									>
										<Td
											textAlign='center'
											borderColor='gray.200'
											fontSize={fontSizeTd}
											color='gray.800'
											py={4}
											px={6}
											width='60px'
											fontWeight='medium'
										>
											{index + 1}
										</Td>
										<Td
											borderColor='gray.200'
											fontSize={fontSizeTd}
											color='gray.800'
											py={4}
											px={6}
											fontWeight='medium'
										>
											{entry.unit_no || '-'}
										</Td>
										<Td
											borderColor='gray.200'
											fontSize={fontSizeTd}
											color='gray.800'
											py={4}
											px={6}
											fontWeight='medium'
										>
											{entry.name_of_referring_party || '-'}
										</Td>
										<Td
											textAlign='center'
											borderColor='gray.200'
											fontSize={fontSizeTd}
											color='gray.800'
											py={4}
											px={6}
											fontWeight='medium'
										>
											{`${entry.commission_percentage || 0}%`}
										</Td>
										<Td
											textAlign='center'
											borderColor='gray.200'
											fontSize={fontSizeTd}
											color='gray.800'
											py={4}
											px={6}
											fontWeight='medium'
										>
											{(entry.unit_price || 0).toLocaleString('en-US', {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</Td>
										<Td
											textAlign='center'
											borderColor='gray.200'
											fontSize={fontSizeTd}
											color='gray.800'
											py={4}
											px={6}
											fontWeight='medium'
										>
											{(entry.total_commission_excl_vat || 0).toLocaleString(
												'en-US',
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												}
											)}
										</Td>
										<Td
											textAlign='center'
											borderColor='gray.200'
											fontSize={fontSizeTd}
											color='gray.800'
											py={4}
											px={6}
											fontWeight='medium'
										>
											{`${entry.vat_percentage}%`}
										</Td>
										<Td
											textAlign='center'
											borderColor='gray.200'
											fontSize={fontSizeTd}
											color='gray.800'
											py={4}
											px={6}
											fontWeight='medium'
										>
											{(entry.vat_amount || 0).toLocaleString('en-US', {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</Td>
										<Td
											textAlign='center'
											borderColor='gray.200'
											fontSize={fontSizeTd}
											color='gray.800'
											py={4}
											px={6}
											fontWeight='medium'
										>
											{(entry.total_commission_incl_vat || 0).toLocaleString(
												'en-US',
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												}
											)}
										</Td>
										{/* <Td
											textAlign='center'
											borderColor='gray.200'
											fontSize={fontSizeTd}
											color='gray.800'
											py={4}
											px={6}
											fontWeight='medium'
										>
											{(entry.total_amount || 0).toLocaleString('en-US', {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</Td> */}
										<Td
											textAlign='center'
											borderColor='gray.200'
											fontSize={fontSizeTd}
											color='gray.800'
											py={4}
											// px={6}
											minWidth='220px'
											fontWeight='medium'
										>
											{entry?.createdAt
												? format(
														new Date(entry?.createdAt),
														'MMM d, yyyy h:mm a'
													)
												: 'N/A'}
										</Td>
										<Td borderColor='gray.200' width='80px'>
											<HStack spacing={2}>
												<Tooltip label='Edit' placement='top' hasArrow>
													<IconButton
														icon={<FaEdit />}
														aria-label='Edit'
														size='sm'
														variant='ghost'
														color='gray.600'
														_hover={{ color: 'blue.600', bg: 'gray.100' }}
														onClick={() => handleEditClick(entry._id)}
													/>
												</Tooltip>

												<Tooltip label='Delete' placement='top' hasArrow>
													<IconButton
														icon={<FaTrash />}
														aria-label='Delete'
														size='sm'
														variant='ghost'
														color='red.500'
														_hover={{ bg: 'red.50' }}
														onClick={() => handleDeleteClick(entry._id)}
													/>
												</Tooltip>
											</HStack>
										</Td>
									</Tr>
								))
							)}
						</Tbody>
					</Table>
				</Box>

				{/* Summary Table */}
				{tableData.length > 0 && !entriesLoading && (
					<Flex justify={{ base: 'center', md: 'flex-end' }}>
						<Box
							borderRadius='lg'
							p={6}
							maxW={{ base: '100%', md: '500px' }}
							w={{ base: '100%', md: 'auto' }}
						>
							<Table
								variant='simple'
								size={tableSize}
								border='1px solid'
								borderColor='gray.200'
							>
								<Thead bg='#edd199'>
									<Tr>
										<Th
											fontSize={fontSizeSummaryLabel}
											fontWeight='medium'
											color='black'
											textTransform='capitalize'
											colSpan={2}
											py={3}
										>
											Invoice Summary
										</Th>
									</Tr>
								</Thead>
								<Tbody bg='white'>
									<Tr>
										<Td
											fontSize={fontSizeSummaryLabel}
											color='gray.600'
											fontWeight='medium'
											borderColor='gray.200'
											py={3}
										>
											Unit Total
										</Td>
										<Td
											fontSize={fontSizeSummaryValue}
											color='gray.800'
											borderColor='gray.200'
											py={3}
											textAlign='right'
										>
											{summary.subTotal.toLocaleString('en-US', {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</Td>
									</Tr>
									<Tr>
										<Td
											fontSize={fontSizeSummaryLabel}
											color='gray.600'
											fontWeight='medium'
											borderColor='gray.200'
											py={3}
										>
											Total Commission Excl. VAT
										</Td>
										<Td
											fontSize={fontSizeSummaryValue}
											color='gray.800'
											borderColor='gray.200'
											py={3}
											textAlign='right'
										>
											{summary.totalCommissionExclVat.toLocaleString('en-US', {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</Td>
									</Tr>
									<Tr>
										<Td
											fontSize={fontSizeSummaryLabel}
											color='gray.600'
											fontWeight='medium'
											borderColor='gray.200'
											py={3}
										>
											Total VAT Amount
										</Td>
										<Td
											fontSize={fontSizeSummaryValue}
											color='gray.800'
											borderColor='gray.200'
											py={3}
											textAlign='right'
										>
											{summary.totalVatAmount.toLocaleString('en-US', {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</Td>
									</Tr>
									<Tr>
										<Td
											fontSize={fontSizeSummaryLabel}
											color='gray.600'
											fontWeight='medium'
											borderColor='gray.200'
											py={3}
										>
											Total Commission Incl. VAT
										</Td>
										<Td
											fontSize={fontSizeSummaryValue}
											color='gray.800'
											borderColor='gray.200'
											py={3}
											textAlign='right'
										>
											{summary.totalCommissionInclVat.toLocaleString('en-US', {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</Td>
									</Tr>

									{/* <Tr>
										<Td
											fontSize={fontSizeSummaryLabel}
											color='gray.600'
											borderColor='gray.200'
											py={3}
											fontWeight='bold'
										>
											Total Amount
										</Td>
										<Td
											fontSize={fontSizeSummaryValue}
											color='gray.800'
											borderColor='gray.200'
											fontWeight='bold'
											py={3}
											textAlign='right'
										>
											{summary.totalAmount.toLocaleString('en-US', {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</Td>
									</Tr> */}
								</Tbody>
							</Table>
						</Box>
					</Flex>
				)}

				{/* Modals */}
				{isAddModalOpen && (
					<Add
						isOpen={isAddModalOpen}
						onClose={() => setIsAddModalOpen(false)}
						fetchData={refetch}
						setAction={() => {}}
						invoiceId={id}
					/>
				)}

				{isEditModalOpen && (
					<Edit
						isOpen={isEditModalOpen}
						onClose={() => {
							setIsEditModalOpen(false);
							setSelectedId(null);
						}}
						selectedId={selectedId}
						invoiceId={id}
						fetchData={refetch}
						setAction={() => {}}
					/>
				)}

				{isDeleteModalOpen && (
					<Delete
						isOpen={isDeleteModalOpen}
						onClose={() => {
							setIsDeleteModalOpen(false);
							setSelectedId(null);
						}}
						id={selectedId}
						method='one'
						fetchData={refetch}
						setAction={() => {}}
						invoiceId={id}
						developerId={developerId}
						docLength={docLength}
					/>
				)}
			</Box>
		</Box>
	);
};

export default AddEntry;
