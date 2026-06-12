/**
 * ReportTable
 * -----------
 * Reusable, responsive, server-paginated table with sortable headers and
 * built-in loading / empty / error states. Generic over a `columns` config.
 *
 * Sorting is server-driven (the backend by-owner report sorts desc on the
 * chosen field); clicking a sortable header calls `onSort(accessor)`.
 */

import {
	Box,
	Button,
	Flex,
	Icon,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import { FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useModalColors } from 'hooks/useModalColors';
import { EmptyState, ErrorState, LoadingState } from './StateViews';

/**
 * @typedef {Object} Column
 * @property {string} accessor
 * @property {string} header
 * @property {boolean} [sortable]
 * @property {boolean} [isNumeric]
 * @property {(row:any)=>React.ReactNode} [render]
 */

/**
 * @param {Object} props
 * @param {Column[]} props.columns
 * @param {any[]} props.rows
 * @param {boolean} [props.isLoading]
 * @param {boolean} [props.isError]
 * @param {() => void} [props.onRetry]
 * @param {string} [props.sortBy]
 * @param {(accessor:string)=>void} [props.onSort]
 * @param {import('../types').Pagination} [props.pagination]
 * @param {(page:number)=>void} [props.onPageChange]
 * @param {string} [props.rowKey]   accessor used as React key (default 'ownerId')
 */
export const ReportTable = ({
	columns,
	rows = [],
	isLoading = false,
	isError = false,
	onRetry,
	sortBy,
	onSort,
	pagination,
	onPageChange,
	rowKey = 'ownerId',
}) => {
	const colors = useModalColors();

	const body = () => {
		if (isError) return <ErrorState minH='240px' onRetry={onRetry} />;
		if (isLoading) return <LoadingState minH='240px' />;
		if (!rows.length) return <EmptyState minH='240px' />;

		return (
			<Box overflowX='auto'>
				<Table variant='unstyled' size='sm' minW='640px'>
					<Thead>
						<Tr>
							{columns.map((col) => {
								const isActive = sortBy === col.accessor;
								return (
									<Th
										key={col.accessor}
										isNumeric={col.isNumeric}
										py={3}
										color={colors.labelColor}
										borderBottomWidth='1px'
										borderColor={colors.borderColor}
										textTransform='uppercase'
										fontSize='xs'
										letterSpacing='wider'
										cursor={col.sortable && onSort ? 'pointer' : 'default'}
										onClick={() => col.sortable && onSort && onSort(col.accessor)}
										userSelect='none'
										aria-sort={isActive ? 'descending' : undefined}
									>
										<Flex
											align='center'
											gap={1}
											justify={col.isNumeric ? 'flex-end' : 'flex-start'}
										>
											{col.header}
											{col.sortable && (
												<Icon
													as={FiChevronDown}
													boxSize={3.5}
													opacity={isActive ? 1 : 0.3}
													color={isActive ? colors.accentGold : colors.mutedText}
													aria-hidden
												/>
											)}
										</Flex>
									</Th>
								);
							})}
						</Tr>
					</Thead>
					<Tbody>
						{rows.map((row, idx) => (
							<Tr
								key={row[rowKey] ?? idx}
								_hover={{ bg: colors.bgInput }}
								transition='background 0.15s ease'
							>
								{columns.map((col) => (
									<Td
										key={col.accessor}
										isNumeric={col.isNumeric}
										py={3}
										color={colors.bodyText}
										borderBottomWidth='1px'
										borderColor={colors.divider}
									>
										{col.render ? col.render(row) : row[col.accessor]}
									</Td>
								))}
							</Tr>
						))}
					</Tbody>
				</Table>
			</Box>
		);
	};

	return (
		<Box>
			{body()}

			{pagination && pagination.totalPages > 1 && !isLoading && !isError && (
				<Flex
					justify='space-between'
					align='center'
					mt={4}
					pt={3}
					borderTopWidth='1px'
					borderColor={colors.divider}
					direction={{ base: 'column', sm: 'row' }}
					gap={2}
				>
					<Text fontSize='xs' color={colors.mutedText}>
						Page {pagination.page} of {pagination.totalPages} · {pagination.total} total
					</Text>
					<Flex gap={2}>
						<Button
							size='xs'
							leftIcon={<FiChevronLeft />}
							onClick={() => onPageChange?.(pagination.page - 1)}
							isDisabled={!pagination.hasPrevPage}
							bg={colors.bgInput}
							color={colors.headingText}
							borderWidth='1px'
							borderColor={colors.borderColor}
							_hover={{ bg: colors.bgInputHover, borderColor: colors.accentGold }}
							aria-label='Previous page'
						>
							Prev
						</Button>
						<Button
							size='xs'
							rightIcon={<FiChevronRight />}
							onClick={() => onPageChange?.(pagination.page + 1)}
							isDisabled={!pagination.hasNextPage}
							bg={colors.bgInput}
							color={colors.headingText}
							borderWidth='1px'
							borderColor={colors.borderColor}
							_hover={{ bg: colors.bgInputHover, borderColor: colors.accentGold }}
							aria-label='Next page'
						>
							Next
						</Button>
					</Flex>
				</Flex>
			)}
		</Box>
	);
};

export default ReportTable;
