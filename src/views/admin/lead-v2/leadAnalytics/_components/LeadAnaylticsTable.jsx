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
	useDisclosure,
} from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import NoData from 'components/Message/NoData';
import TableLoading from 'components/loading/TableLoading';
import { leadStatus, mainLeadStatus } from 'utils/options';
import { analyticsColumnDescriptions } from '../helpers';

// const SortableHeader = ({ column, children, sortConfig, onSort }) => {
// 	const isActive = sortConfig.key === column;
// 	const direction = isActive ? sortConfig.direction : null;

// 	return (
// 		<Th
// 			onClick={() => onSort(column)}
// 			cursor='pointer'
// 			userSelect='none'
// 			whiteSpace='nowrap'
// 			textTransform='capitalize'
// 			fontSize='md'
// 			py='4'
// 			fontWeight='semibold'
// 			color={isActive ? 'blue.600' : 'gray.700'}
// 			_hover={{ color: 'blue.500', bg: 'gray.100' }}
// 			transition='all 0.2s ease-in-out'
// 		>
// 			<Flex align='center' justify='space-between' gap={2}>
// 				<Text>{children}</Text>
// 				{isActive && (
// 					<Icon
// 						as={direction === 'asc' ? ChevronUpIcon : ChevronDownIcon}
// 						boxSize={4}
// 					/>
// 				)}
// 			</Flex>
// 		</Th>
// 	);
// };

const SortableHeader = ({ column, children, sortConfig, onSort, category }) => {
	const isActive = sortConfig.key === column;
	const direction = isActive ? sortConfig.direction : null;

	// Tooltip message — dynamic based on column or category
	const tooltipLabel = (
		<Box>
			<Text fontWeight='semibold' color='gray.200' mb={1}>
				Column: {children}
			</Text>
			<Text
				fontSize='sm'
				color='gray.300'
				whiteSpace='pre-line'
				// whiteSpace='normal'
			>
				{analyticsColumnDescriptions[column] ||
					'No description available for this column.'}
			</Text>

			{category && (
				<Box mt={2}>
					<Text fontWeight='semibold' color='gray.200'>
						Current Category:
					</Text>
					<Text color='blue.300' fontSize='sm'>
						{category}
					</Text>
				</Box>
			)}

			{isActive && (
				<Box mt={2}>
					<Text fontWeight='semibold' color='gray.200'>
						Sorted:
					</Text>
					<Text color='gray.300' fontSize='sm'>
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
			bg='gray.800'
			color='white'
			borderRadius='md'
			p={3}
			placement='top'
			openDelay={150}
			closeDelay={100}
		>
			<Th
				onClick={() => onSort(column)}
				cursor='pointer'
				userSelect='none'
				whiteSpace='nowrap'
				textTransform='capitalize'
				fontSize='md'
				py='4'
				fontWeight='semibold'
				color={isActive ? 'blue.600' : 'gray.700'}
				_hover={{ color: 'blue.500', bg: 'gray.100' }}
				transition='all 0.2s ease-in-out'
				minW={column === 'category' ? '200px' : '50px'}
			>
				<Flex align='center' justify='space-between' gap={2}>
					<Text>{children}</Text>
					{isActive && (
						<Icon
							as={direction === 'asc' ? ChevronUpIcon : ChevronDownIcon}
							boxSize={4}
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
		{ key: 'category', label: selectedCategoryLabel || 'Category' },
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
		{ key: 'todayLeads', label: 'Today’s Leads' },
		{ key: 'currentWeekLeads', label: 'This Week' },
		{ key: 'currentMonthLeads', label: 'This Month' },
		{ key: 'prevMonthLeads', label: 'Last Month' },
		// { key: 'leadGrowthRate', label: 'Growth %' },
		{ key: 'leadsAssignedToManagers', label: 'Managers' },
		{ key: 'leadsAssignedToAgents', label: 'Agents' },
		{ key: 'unassignedLeads', label: 'Unassigned' },
		{ key: 'releasedLeads', label: 'Released' },
	];

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

		// if (key === 'avgNotesPerLead') {
		// 	return Math.round(value);
		// }

		return value;
	};

	return (
		<Box
			overflowX='auto'
			overflowY='auto'
			maxH='calc(100vh - 200px)'
			borderWidth='1px'
			borderColor='gray.200'
			rounded='xl'
			boxShadow='sm'
			bg='white'
		>
			<Table variant='simple' size='md'>
				<Thead bg='gray.100' position='sticky' top={0} zIndex={1}>
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
					{isLoading ? (
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
								_hover={{ bg: 'gray.50' }}
								bg={index % 2 === 0 ? 'white' : 'gray.25'}
								transition='background-color 0.2s ease-in-out'
							>
								{columns.map((column, i) => {
									const matchedStatus = currentCategoryLeadStatus?.find(
										(i) => i.value === row[column.key]
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
											borderColor='gray.200'
											fontWeight={
												column.key === 'category' ? 'semibold' : 'medium'
											}
											color='gray.700'
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
