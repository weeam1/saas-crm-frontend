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
} from '@chakra-ui/react';
import { FiEye } from 'react-icons/fi';
import NoData from 'components/Message/NoData';
import TableLoading from 'components/loading/TableLoading';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { formatCurrency } from 'utils/helpers';
import CustomTooltip from 'components/shared/CustomTooltip';
import UserProfileCell from './UserProfileCell';
import { formatValue } from '../formatUtils';

const EmployeePayrollTable = ({ data = [], isLoading }) => {
	// Most important columns for payroll overview
	const COLUMNS = [
		{ key: 'user', label: 'Employee', width: '220px' },
		{
			key: 'attendanceSummary.netSalary',
			label: 'Attendance Salary',
			width: '150px',
		},
		{
			key: 'payrollSummary.commissionEarned',
			label: 'Commission',
			width: '130px',
		},
		{
			key: 'payrollSummary.incentiveEarned',
			label: 'Incentive',
			width: '120px',
		},
		{
			key: 'loanSummary.monthlyInstallment',
			label: 'Loan Deduction',
			width: '140px',
		},
		{ key: 'payrollSummary.netSalary', label: 'Net Salary', width: '140px' },
		{
			key: 'evaluationScore',
			label: 'Performance',
			width: '120px',
		},
		{ key: 'createdAt', label: 'Joining Date', width: '100px' },
		{ key: 'actions', label: 'Actions', width: '100px' },
	];

	const [delayedLoading, setDelayedLoading] = useState(isLoading);

	useEffect(() => {
		let timer;
		if (isLoading) {
			setDelayedLoading(true);
		} else {
			timer = setTimeout(() => {
				setDelayedLoading(false);
			}, 1000);
		}
		return () => clearTimeout(timer);
	}, [isLoading]);

	const getNestedValue = (obj, path) => {
		return path.split('.').reduce((current, key) => current?.[key], obj);
	};

	const renderCellContent = (column, row) => {
		if (column.key === 'user') {
			return <UserProfileCell user={row} />;
		}

		if (column.key === 'actions') {
			return (
				<Flex align='center' justify='center'>
					<CustomTooltip label='View Details'>
						<IconButton
							aria-label='View employee details'
							icon={<FiEye />}
							size='sm'
							colorScheme='teal'
							variant='ghost'
							// onClick={() => onView(row)}
						/>
					</CustomTooltip>
				</Flex>
			);
		}

		// Handle nested keys for financial data
		if (column.key.includes('.')) {
			const value = getNestedValue(row, column.key);
			const currency = row.agency?.currency || 'AED';

			if (typeof value === 'number') {
				return (
					<Text fontWeight='medium' textAlign='center'>
						{formatCurrency(value, currency)}
					</Text>
				);
			}
			return formatValue(column.key, value, row);
		}

		// Handle direct keys
		const value = row[column.key];
		if (typeof value === 'number' && column.key !== 'evaluationScore') {
			return (
				<Text fontWeight='medium' textAlign='center'>
					{formatCurrency(value, row.agency?.currency || 'AED')}
				</Text>
			);
		}

		return formatValue(column.key, value, row);
	};

	return (
		<Box
			my='2'
			overflowX='auto'
			overflowY='auto'
			maxH='calc(100vh - 200px)'
			borderWidth='1px'
			borderColor='gray.200'
			rounded='xl'
			boxShadow='sm'
			bg='white'
		>
			<Table variant='striped' size='sm'>
				<Thead bg='brand.200' position='sticky' top={0} zIndex={1}>
					<Tr>
						{COLUMNS.map((column) => (
							<Th
								key={column.key}
								whiteSpace='nowrap'
								textTransform='capitalize'
								fontSize='md'
								py='4'
								textAlign={['name'].includes(column.key) ? 'left' : 'center'}
								fontWeight='semibold'
								color='gray.700'
								minW={column.width}
							>
								{column.label}
							</Th>
						))}
					</Tr>
				</Thead>

				<Tbody>
					{isLoading || delayedLoading ? (
						<TableLoading columns={COLUMNS} length={10} py='4' />
					) : data.length === 0 ? (
						<Tr>
							<Td colSpan={COLUMNS.length} py={10}>
								<Center>
									<NoData label='incoming balance' />
								</Center>
							</Td>
						</Tr>
					) : (
						data.map((row, index) => (
							<Tr
								key={row._id || index}
								_hover={{ bg: 'gray.50' }}
								bg={index % 2 === 0 ? 'white' : 'gray.25'}
								transition='background-color 0.2s'
							>
								{COLUMNS.map((column) => (
									<Td
										key={column.key}
										px={3}
										py={3}
										fontSize='sm'
										color='gray.700'
										minW={column.width}
										textAlign={column.key === 'user' ? 'left' : 'center'}
									>
										{renderCellContent(column, row)}
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

export default EmployeePayrollTable;
