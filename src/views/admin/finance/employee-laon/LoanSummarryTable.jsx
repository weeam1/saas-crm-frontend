// import {
// 	Table,
// 	Thead,
// 	Tbody,
// 	Tr,
// 	Th,
// 	Td,
// 	Flex,
// 	IconButton,
// 	Box,
// 	Text,
// 	Center,
// 	Badge,
// 	Avatar,
// } from '@chakra-ui/react';
// import { FiEdit2, FiEye, FiTrash2 } from 'react-icons/fi';
// import NoData from 'components/Message/NoData';
// import TableLoading from 'components/loading/TableLoading';
// import { useEffect, useState } from 'react';
// import { format } from 'date-fns';
// import { toast } from 'react-toastify';
// import { formatCurrency } from 'utils/helpers';
// import { getAvatarColor, getInitials, paymentColors } from '../helpers';
// import CustomTooltip from 'components/shared/CustomTooltip';
// import { constant } from 'constant';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaExternalLinkAlt } from 'react-icons/fa';

// const LoanSummaryTable = ({
// 	data = [],
// 	isLoading,
// 	handleOpenEdit,
// 	removeItem,
// 	setView,
// }) => {
// 	const columns = [
// 		{ key: 'user', label: 'Employee', width: '300px' },
// 		{ key: 'totalLoans', label: 'Loans', width: '80px' },
// 		{ key: 'activeLoans', label: 'Active', width: '80px' },
// 		{ key: 'closedLoans', label: 'Closed', width: '80px' },
// 		{ key: 'totalTenureMonths', label: 'Total Months', width: '80px' },
// 		{ key: 'totalBorrowedAmount', label: 'Borrowed', width: '150px' },
// 		{ key: 'totalRemainingAmount', label: 'Remaining', width: '150px' },
// 		{ key: 'monthlyInstallment', label: 'Installment', width: '150px' },
// 		{ key: 'status', label: 'Status', width: '80px' },
// 		{ key: 'updatedAt', label: 'Last Update', width: '200px' },
// 		{ key: 'details', label: 'Details', width: '50px' },
// 	];

// 	const [delayedLoading, setDelayedLoading] = useState(isLoading);

// 	const navigate = useNavigate();

// 	useEffect(() => {
// 		let timer;
// 		if (isLoading) {
// 			setDelayedLoading(true);
// 		} else {
// 			timer = setTimeout(() => {
// 				setDelayedLoading(false);
// 			}, 1000);
// 		}
// 		return () => clearTimeout(timer);
// 	}, [isLoading]);

// 	const formatValue = (key, value) => {
// 		switch (key) {
// 			case 'active': {
// 				const color = paymentColors[value] || 'gray';
// 				return (
// 					<Badge
// 						colorScheme={color}
// 						variant='subtle'
// 						fontSize='.9em'
// 						px={4}
// 						py={2}
// 						borderRadius='full'
// 						textTransform='capitalize'
// 					>
// 						{value || 'N/A'}
// 					</Badge>
// 				);
// 			}

// 			case 'agency':
// 				return value?.name || 'N/A';
// 			case 'createdBy':
// 			case 'user':
// 				return (
// 					<Box
// 						as={Link}
// 						to={`/finance/employee-loans/${value?._id}`}
// 						display='flex'
// 						alignItems='center'
// 						_hover={{ bg: 'gray.100', transition: 'background 0.2s ease' }}
// 						cursor='pointer'
// 					>
// 						<Avatar
// 							src={
// 								value?.profileImage
// 									? ` ${constant.baseUrl}${value?.profileImage}`
// 									: undefined
// 							}
// 							name={value?.fullName || value?.username || undefined}
// 							bg={getAvatarColor(value?.fullName || value?.username || '')}
// 							boxSize='40px'
// 							mr={3}
// 						>
// 							{/* Avatar will show initials automatically from `name` prop,
//             but in case you want to override: */}
// 							{!value?.profileImage && !value?.fullName && (
// 								<Text fontSize='sm' fontWeight='600'>
// 									{getInitials(value?.username || '')}
// 								</Text>
// 							)}
// 						</Avatar>

// 						<Box>
// 							<Text fontWeight='600' fontSize='sm'>
// 								{value?.fullName || value?.username || '-'}
// 							</Text>
// 							{value?.username && (
// 								<Text fontSize='xs' color='gray.500'>
// 									{value.username}
// 								</Text>
// 							)}
// 						</Box>
// 					</Box>
// 				);
// 			case 'createdAt':
// 			case 'updatedAt':
// 				return value ? format(new Date(value), 'MMM d, yyyy h:mm a') : 'N/A';
// 			case 'activeLoans':
// 			case 'totalLoans':
// 			case 'closedLoans':
// 				return value || 0;
// 			default:
// 				return value || '-';
// 		}
// 	};

// 	return (
// 		<Box
// 			my='2'
// 			overflowX='auto'
// 			overflowY='auto'
// 			maxH='calc(100vh - 200px)'
// 			borderWidth='1px'
// 			borderColor='gray.200'
// 			rounded='xl'
// 			boxShadow='sm'
// 			bg='white'
// 		>
// 			<Table variant='striped' size='sm'>
// 				<Thead bg='brand.200' position='sticky' top={0} zIndex={1}>
// 					<Tr>
// 						{columns.map((column) => (
// 							<Th
// 								key={column.key}
// 								whiteSpace='nowrap'
// 								textTransform='capitalize'
// 								fontSize='md'
// 								py='6'
// 								textAlign={['user'].includes(column.key) ? 'left' : 'center'}
// 								fontWeight='semibold'
// 								color='gray.700'
// 								minW={column.width}
// 							>
// 								{column.label}
// 							</Th>
// 						))}
// 					</Tr>
// 				</Thead>

// 				<Tbody>
// 					{isLoading || delayedLoading ? (
// 						<TableLoading columns={columns} length={10} py='4' />
// 					) : data.length === 0 ? (
// 						<Tr>
// 							<Td colSpan={columns.length} py={10}>
// 								<Center>
// 									<NoData label='employee loans' />
// 								</Center>
// 							</Td>
// 						</Tr>
// 					) : (
// 						data.map((row, index) => (
// 							<Tr
// 								key={row._id || index}
// 								_hover={{ bg: 'gray.50' }}
// 								bg={index % 2 === 0 ? 'white' : 'gray.25'}
// 								transition='background-color 0.2s ease-in-out'
// 							>
// 								{columns.map((column) => (
// 									<Td
// 										key={column.key}
// 										py={4}
// 										px={3}
// 										wordBreak='break-word'
// 										isTruncated={true}
// 										fontSize='sm'
// 										minW={column.width}
// 										maxW='400px'
// 										textAlign={
// 											['user'].includes(column.key) ? 'left' : 'center'
// 										}
// 										fontWeight={column.key === 'user' ? 'semibold' : 'medium'}
// 										color='gray.700'
// 									>
// 										{column.key === 'details' ? (
// 											<CustomTooltip label='Loan details'>
// 												<IconButton
// 													aria-label='Loan details'
// 													icon={<FaExternalLinkAlt />}
// 													size='sm'
// 													colorScheme='teal'
// 													variant='ghost'
// 													onClick={() =>
// 														navigate(`/employee-loans/${row['user']?._id}`)
// 													}
// 												/>
// 											</CustomTooltip>
// 										) : [
// 												'totalBorrowedAmount',
// 												'totalRemainingAmount',
// 												'monthlyInstallment',
// 										  ].includes(column.key) ? (
// 											<Text>
// 												{formatCurrency(
// 													row[column.key],
// 													row?.agency?.currency || 'AED',
// 												)}
// 											</Text>
// 										) : column.key === 'status' ? (
// 											<Badge
// 												colorScheme={
// 													row['activeLoans'] === 0 ? 'green' : 'yellow'
// 												}
// 												variant='subtle'
// 												fontSize='.9em'
// 												px={4}
// 												py={2}
// 												borderRadius='full'
// 												textTransform='uppercase'
// 											>
// 												{row['activeLoans'] === 0 ? 'Completed' : 'Pending'}
// 											</Badge>
// 										) : (
// 											formatValue(column.key, row[column.key])
// 										)}
// 									</Td>
// 								))}
// 							</Tr>
// 						))
// 					)}
// 				</Tbody>
// 			</Table>
// 		</Box>
// 	);
// };

// export default LoanSummaryTable;

import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Flex,
	IconButton,
	Box,
	Text,
	Center,
	Badge,
	Avatar,
} from '@chakra-ui/react';
import { FiEdit2, FiEye, FiTrash2 } from 'react-icons/fi';
import NoData from 'components/Message/NoData';
import TableLoading from 'components/loading/TableLoading';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { formatCurrency } from 'utils/helpers';
import { getAvatarColor, getInitials, paymentColors } from '../helpers';
import CustomTooltip from 'components/shared/CustomTooltip';
import { constant } from 'constant';
import { Link, useNavigate } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';

const LoanSummaryTable = ({
	data = [],
	isLoading,
	handleOpenEdit,
	removeItem,
	setView,
}) => {
	const columns = [
		{ key: 'user', label: 'Employee', width: '300px' },
		{ key: 'totalLoans', label: 'Loans', width: '80px' },
		{ key: 'activeLoans', label: 'Active', width: '80px' },
		{ key: 'closedLoans', label: 'Closed', width: '80px' },
		{ key: 'totalTenureMonths', label: 'Total Months', width: '80px' },
		{ key: 'totalBorrowedAmount', label: 'Borrowed', width: '150px' },
		{ key: 'totalRemainingAmount', label: 'Remaining', width: '150px' },
		{ key: 'monthlyInstallment', label: 'Installment', width: '150px' },
		{ key: 'status', label: 'Status', width: '80px' },
		{ key: 'updatedAt', label: 'Last Update', width: '200px' },
		{ key: 'details', label: 'Details', width: '50px' },
	];

	const [delayedLoading, setDelayedLoading] = useState(isLoading);
	const navigate = useNavigate();

	useEffect(() => {
		let timer;
		if (isLoading) {
			setDelayedLoading(true);
		} else {
			timer = setTimeout(() => setDelayedLoading(false), 500);
		}
		return () => clearTimeout(timer);
	}, [isLoading]);

	const formatValue = (key, value) => {
		switch (key) {
			case 'agency':
				return value?.name || 'N/A';
			case 'createdBy':
			case 'user':
				return (
					<Box
						as={Link}
						to={`/finance/employee-loans/${value?._id}`}
						display='flex'
						alignItems='center'
						_hover={{ bg: 'bg.elevated', transition: 'background 0.2s ease' }}
						cursor='pointer'
						borderRadius='lg'
						p={1}
					>
						<Avatar
							src={
								value?.profileImage
									? `${constant.baseUrl}${value?.profileImage}`
									: undefined
							}
							name={value?.fullName || value?.username || undefined}
							bg='navy.600'
							boxSize='40px'
							mr={3}
							border='1px solid'
							borderColor='border.default'
						>
							{!value?.profileImage && !value?.fullName && (
								<Text fontSize='sm' fontWeight='600' color='text.body'>
									{getInitials(value?.username || '')}
								</Text>
							)}
						</Avatar>
						<Box>
							<Text fontWeight='600' fontSize='sm' color='text.heading'>
								{value?.fullName || value?.username || '-'}
							</Text>
							{value?.username && (
								<Text fontSize='xs' color='text.muted'>
									{value.username}
								</Text>
							)}
						</Box>
					</Box>
				);
			case 'createdAt':
			case 'updatedAt':
				return value ? format(new Date(value), 'MMM d, yyyy h:mm a') : 'N/A';
			case 'activeLoans':
			case 'totalLoans':
			case 'closedLoans':
				return value || 0;
			default:
				return value || '-';
		}
	};

	return (
		<Box
			my='2'
			overflowX='auto'
			overflowY='auto'
			minH='60vh'
			maxH='calc(100vh - 200px)'
			borderWidth='1px'
			borderColor='border.default'
			borderRadius='xl'
			boxShadow='card'
			bg='bg.surface'
		>
			<Table variant='simple' size='md'>
				<Thead bg='bg.elevated' position='sticky' top={0} zIndex={1}>
					<Tr>
						{columns.map((column) => (
							<Th
								key={column.key}
								whiteSpace='nowrap'
								textTransform='uppercase'
								fontSize='11px'
								fontWeight='700'
								letterSpacing='0.08em'
								py='4'
								px='4'
								textAlign={['user'].includes(column.key) ? 'left' : 'center'}
								color='gold.primary'
								minW={column.width}
							>
								{column.label}
							</Th>
						))}
					</Tr>
				</Thead>

				<Tbody>
					{isLoading || delayedLoading ? (
						<TableLoading columns={columns} length={10} py='4' />
					) : data.length === 0 ? (
						<Tr>
							<Td colSpan={columns.length} py={12}>
								<Center>
									<NoData label='employee loans' />
								</Center>
							</Td>
						</Tr>
					) : (
						data.map((row, index) => (
							<Tr
								key={row._id || index}
								_hover={{ bg: 'bg.elevated' }}
								transition='background 0.15s'
							>
								{columns.map((column) => (
									<Td
										key={column.key}
										py={4}
										px={4}
										wordBreak='break-word'
										fontSize='13px'
										minW={column.width}
										maxW='400px'
										textAlign={
											['user'].includes(column.key) ? 'left' : 'center'
										}
										fontWeight={column.key === 'user' ? 'semibold' : 'medium'}
										color='text.body'
										borderBottom='1px solid'
										borderBottomColor='border.subtle'
									>
										{column.key === 'details' ? (
											<CustomTooltip
												label='Loan details'
												hasArrow
												placement='top'
											>
												<IconButton
													aria-label='Loan details'
													icon={<FaExternalLinkAlt />}
													size='sm'
													variant='ghost'
													color='gold.primary'
													onClick={() =>
														navigate(`/employee-loans/${row['user']?._id}`)
													}
													_hover={{
														bg: 'rgba(212, 175, 55, 0.1)',
														transform: 'scale(1.05)',
													}}
													transition='all 0.15s'
												/>
											</CustomTooltip>
										) : [
												'totalBorrowedAmount',
												'totalRemainingAmount',
												'monthlyInstallment',
										  ].includes(column.key) ? (
											<Text
												fontWeight='600'
												color='gold.primary'
												fontFamily='mono'
											>
												{formatCurrency(
													row[column.key],
													row?.agency?.currency || 'AED',
												)}
											</Text>
										) : column.key === 'status' ? (
											<Badge
												variant={row['activeLoans'] === 0 ? 'gold' : 'stuble'}
												bg={
													row['activeLoans'] === 0
														? 'rgba(212, 175, 55, 0.1)'
														: 'rgba(238, 212, 67, 0.2)'
												}
												color={
													row['activeLoans'] === 0
														? 'gold.primary'
														: 'orange.400'
												}
												fontSize='11px'
												fontWeight='500'
												px={4}
												py={1.5}
												borderRadius='full'
												textTransform='uppercase'
											>
												{row['activeLoans'] === 0 ? 'Completed' : 'Pending'}
											</Badge>
										) : (
											formatValue(column.key, row[column.key])
										)}
									</Td>
								))}
							</Tr>
						))
					)}
				</Tbody>
			</Table>
		</Box>
	);
};

export default LoanSummaryTable;
