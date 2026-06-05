import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Flex,
	Icon,
	Box,
	Text,
	Center,
	Tooltip,
} from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import NoData from 'components/Message/NoData';
import TableLoading from 'components/loading/TableLoading';
import { leadStatus, mainLeadStatus } from 'utils/options';
import { analyticsColumnDescriptions } from '../helpers';
import { useEffect, useState } from 'react';

const SortableHeader = ({ column, children, sortConfig, onSort, category }) => {
	const isActive = sortConfig.key === column;
	const direction = isActive ? sortConfig.direction : null;

	// Tooltip message — dynamic based on column or category
	const tooltipLabel = (
		<Box>
			<Text fontWeight='semibold' color='text.heading' mb={1}>
				Column: {children}
			</Text>
			<Text fontSize='sm' color='text.muted' whiteSpace='pre-line'>
				{analyticsColumnDescriptions[column] ||
					'No description available for this column.'}
			</Text>

			{category && (
				<Box mt={2}>
					<Text fontWeight='semibold' color='text.heading'>
						Current Category:
					</Text>
					<Text color='text.accent' fontSize='sm'>
						{category}
					</Text>
				</Box>
			)}

			{isActive && (
				<Box mt={2}>
					<Text fontWeight='semibold' color='text.heading'>
						Sorted:
					</Text>
					<Text color='text.muted' fontSize='sm'>
						{direction === 'asc'
							? 'Ascending (Low → High)'
							: 'Descending (High → Low)'}
					</Text>
				</Box>
			)}
		</Box>
	);

	return (
		<Tooltip
			label={tooltipLabel}
			hasArrow
			bg='bg.surface'
			color='text.body'
			borderRadius='lg'
			p={3}
			placement='top'
			openDelay={150}
			closeDelay={100}
			border='1px solid'
			borderColor='border.default'
		>
			<Th
				onClick={() => onSort(column)}
				cursor='pointer'
				userSelect='none'
				whiteSpace='nowrap'
			textTransform='none'
				fontSize='xs'
				py='4'
				px={3}
				fontWeight='semibold'
				letterSpacing='wider'

				bg='bg.app'
				borderBottom='1px solid'
				borderColor='border.default'
				_hover={{
					color: 'text.accent',
					bg: 'bg.elevated'
				}}
				transition='all 0.2s ease-in-out'
				minW={column === 'name' ? '200px' : '100px'}
			>
				<Flex align='center' justify='space-between' gap={2}>
					<Text color={'text.heading'}>{children}</Text>
					{isActive && (
						<Icon
							as={direction === 'asc' ? ChevronUpIcon : ChevronDownIcon}
							boxSize={3}
							color='text.accent'
						/>
					)}
				</Flex>
			</Th>
		</Tooltip>
	);
};

export const LeadAnalyticsTable = ({
	selectedCategoryLabel,
	data,
	sortConfig,
	onSort,
	isLoading,
}) => {
	const columns = [
		{ key: 'name', label: selectedCategoryLabel || 'Category' },
		{ key: 'leadCount', label: 'Leads' },
		{ key: 'deals', label: 'Deals' },
		{ key: 'notesCount', label: 'Notes' },
		{ key: 'interestedLeads', label: 'Interested' },
		{ key: 'notInterestedLeads', label: 'Not Int.' },
		{ key: 'dealConversionRate', label: 'Deal %' },
		{ key: 'avgNotesPerLead', label: 'Avg Notes' },
		{ key: 'newLeadsToday', label: 'Fresh Today' },
		{ key: 'newLeadsThisWeek', label: 'Fresh Week' },
		{ key: 'newLeadsThisMonth', label: 'Fresh Month' },
		{ key: 'todayLeads', label: 'Today\'s Leads' },
		{ key: 'currentWeekLeads', label: 'This Week' },
		{ key: 'currentMonthLeads', label: 'This Month' },
		{ key: 'prevMonthLeads', label: 'Last Month' },
		{ key: 'leadsAssignedToManagers', label: 'Managers' },
		{ key: 'leadsAssignedToAgents', label: 'Agents' },
		{ key: 'unassignedLeads', label: 'Unassigned' },
		{ key: 'releasedLeads', label: 'Released' },
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

	const currentCategoryLeadStatus =
		selectedCategoryLabel === 'Main Status'
			? mainLeadStatus
			: selectedCategoryLabel === 'Lead Status'
			? leadStatus
			: null;

	const formatValue = (key, value) => {
		if (['dealConversionRate', 'leadGrowthRate'].includes(key)) {
			return `${value}%`;
		}
		return value;
	};

	return (
		<Box
			overflowX='auto'
			overflowY='auto'
			      maxHeight="70vh"
      minH="70vh"
			borderRadius='xl'
			bg='bg.app'
		>
			<Table variant='simple' size='md' borderWidth='1px' borderColor='border.default'>
				<Thead position='sticky' top={0} zIndex={1}>
					<Tr>
						{columns.map((column) => (
							<SortableHeader
								key={column.key}
								column={column.key}
								sortConfig={sortConfig}
								onSort={onSort}
								category={selectedCategoryLabel}
							>
								{column.label}
							</SortableHeader>
						))}
					</Tr>
				</Thead>

				<Tbody>
					{isLoading || delayedLoading ? (
						<TableLoading columns={columns} length={10} py='4' />
					) : data.length === 0 ? (
						<Tr>
							<Td colSpan={columns.length} py={10}>
								<Center>
									<NoData label='data' />
								</Center>
							</Td>
						</Tr>
					) : (
						data.map((row, index) => (
							<Tr
								key={index}
								_hover={{ bg: 'bg.elevated' }}
								bg={'bg.surface' }
								transition='background-color 0.2s ease-in-out'
							>
								{columns.map((column, i) => {
									const matchedStatus = currentCategoryLeadStatus?.find(
										(item) => item.value === row[column.key]
									);
									const displayValue =
										matchedStatus?.label ||
										(row[column.key] === 'others'
											? 'Others'
											: formatValue(column.key, row[column.key]));

									return (
										<Td
											key={column.key}
											py={3}
											px={3}
											maxW='300px'
											wordBreak='break-word'
											overflowWrap='break-word'
											whiteSpace='normal'
											fontSize='sm'
											textAlign={i === 0 ? 'left' : 'center'}
											borderBottom='1px solid'
											borderColor='border.subtle'
											fontWeight={column.key === 'name' ? 'semibold' : 'normal'}
											color='text.body'
										>
											{displayValue}
										</Td>
									);
								})}
							</Tr>
						))
					)}
				</Tbody>
			</Table>
		</Box>
	);
};

export default LeadAnalyticsTable;