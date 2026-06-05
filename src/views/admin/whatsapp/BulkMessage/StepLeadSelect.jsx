
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	VStack,
	Heading,
	Text,
	HStack,
	Button,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Checkbox,
	Select,
	Flex,
	IconButton,
	Spacer,
	Badge,
	Box,
} from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight} from 'react-icons/fi';
import { useFetchItemsQuery } from 'api/apiSlice';
import { safeValue } from 'utils';
import TableLoading from 'components/loading/TableLoading';
import { toast } from 'react-toastify';
import AdvancedSearchModal from './filters/AdvancedSearch';
import { BiX } from 'react-icons/bi';
import SearchTags from 'components/search/SearchTags';
import NoData from 'components/Message/NoData';
import Leads from './../../lead-v2/components/Leads';
import { useModalColors } from 'hooks/useModalColors';

const DEFAULT_LIMIT = 25;
const PAGE_SIZES = [25, 50, 100, 150, 200];

export function StepLeadSelect({
	queryParams = {},
	onBack,
	onConfirm,
	selectedLeadsMap,
	setSelectedLeadsMap,
}) {
	const colors = useModalColors();
	// local pagination & filters
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(DEFAULT_LIMIT);

	// selection state
	const selectedCount = selectedLeadsMap.size;

	// whether user asked to select all matching results across pages
	const [selectAllMatching, setSelectAllMatching] = useState(false);
	const [appliedFilters, setAppliedFilters] = useState(null);
	const [getTagValues, setGetTagValues] = useState([]);
	const [isFormReset, setIsFormReset] = useState(null);
	const [advanceSearch, setAdvanceSearch] = useState(false);

	// Compose params for API
	const params = useMemo(() => {
		return {
			page,
			pageSize: limit,
			...(appliedFilters && { data: appliedFilters }),
		};
	}, [appliedFilters, page, limit]);

	const {
		data,
		isLoading,
		isFetching,
		error,
		refetch: leadsRefetch,
		isFetching: leadsRefetching,
	} = useFetchItemsQuery(
		{
			path: '/lead/v2',
			params,
		},
		{
			skip: !params,
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
			refetchOnReconnect: true,
		}
	);

	// expected response shape: { doc: [...], totalDocs or total, totalPages }
	const leads = data?.doc || [];
	const totalResults = data?.totalLeads;
	const totalPages =
		data?.totalPages ?? Math.max(1, Math.ceil((totalResults || 0) / limit));

	// Helpers for selection
	const isRowSelected = useCallback(
		(id) => selectedLeadsMap.has(id) || selectAllMatching,
		[selectedLeadsMap, selectAllMatching]
	);

	const toggleRow = (lead) => {
		if (selectAllMatching) {
			setSelectAllMatching(false);
		}

		setSelectedLeadsMap((prev) => {
			const next = new Map(prev);
			if (next.has(lead._id)) {
				next.delete(lead._id);
			} else {
				next.set(lead._id, lead);
			}
			return next;
		});
	};

	const selectAllOnPage = () => {
		setSelectedLeadsMap((prev) => {
			const next = new Map(prev);
			leads.forEach((l) => {
				next.set(l._id, l);
			});
			return next;
		});
		setSelectAllMatching(false);
	};

	const unselectAllOnPage = () => {
		setSelectedLeadsMap((prev) => {
			const next = new Map(prev);
			leads.forEach((l) => {
				next.delete(l._id);
			});
			return next;
		});
		setSelectAllMatching(false);
	};

	const toggleSelectAllCurrentPage = (checked) => {
		if (checked) selectAllOnPage();
		else unselectAllOnPage();
	};

	// "Select all matching results across pages" UX
	const selectAllResultsAcrossPages = async () => {
		setSelectAllMatching(true);
		setSelectedLeadsMap(new Map());
		toast.success('All results selected');
	};

	const clearAllSelection = () => {
		setSelectAllMatching(false);
		setSelectedLeadsMap(new Map());
	};

	// header checkbox state for current page
	const currentPageAllChecked =
		leads.length > 0 &&
		leads.every((l) => selectedLeadsMap.has(l._id) || selectAllMatching);
	const currentPageSomeChecked =
		leads.some((l) => selectedLeadsMap.has(l._id) || selectAllMatching) &&
		!currentPageAllChecked;

	// Confirm action: if selectAllMatching is true we return a special payload indicating "all" so backend can handle server-side
	const handleConfirm = () => {
		if (selectAllMatching) {
			onConfirm?.({
				selectAll: true,
				filters: params,
			});
		} else {
			const selectedObjects = Array.from(selectedLeadsMap.values());
			if (selectedObjects.length === 0) {
				toast.warning('No leads selected');
				return;
			}
			onConfirm?.({
				selectAll: false,
				leads: selectedObjects,
			});
		}
	};

	const handleClear = () => {
		setAppliedFilters(null);
		setGetTagValues([]);
		setIsFormReset(true);
	};

	const removeFilter = (key) => {
		const updatedFilters = { ...appliedFilters };
		delete updatedFilters[key];
		setAppliedFilters(updatedFilters);

		setGetTagValues((prev) => prev.filter((tag) => tag.key !== key));
	};

	// When page or filters change, we want to keep selectedLeadsMap intact (persistence across pages).
	useEffect(() => {
		setSelectAllMatching(false);
	}, [limit]);

	const columns = ['checkbox', 'Lead Name', 'Phone', 'WhatsApp'];

	return (
		<Box>
			<Box mb='2'>
				<Heading size='md' color={colors.headingText}>Leads</Heading>
				<Text fontSize='sm' color={colors.mutedText}>
					Select leads for this bulk message.
				</Text>
			</Box>

			{/* Controls */}
			<HStack spacing={3} wrap='wrap'>
				<Button
					border='1px solid'
					borderColor={colors.borderColor}
					bg={colors.bg}
					borderRadius='md'
					px={4}
					fontSize='xs'
					w='auto'
					minW='max-content'
					height='2.2rem'
					color={colors.bodyText}
					_hover={{ bg: colors.bgDeep, borderColor: colors.accentGold, color: colors.accentGold }}
					_active={{ bg: colors.bgDeep }}
					onClick={() => setAdvanceSearch(true)}
				>
					Advance Search
				</Button>

				{/* Clear and Delete button  */}
				{getTagValues.length > 0 && (
					<Button
						variant='ghost'
						w='fit-content'
						color={colors.badgeErrorText}
						leftIcon={<BiX />}
						aria-label='Clear'
						onClick={handleClear}
						_hover={{ bg: colors.badgeErrorBg, color: colors.badgeErrorText }}
					>
						Clear
					</Button>
				)}

				<Spacer />
			</HStack>

			{/* Search tags */}
			{getTagValues?.length > 0 && (
				<Flex
					flexDirection={{ base: 'row', lg: 'row' }}
					justifyContent='space-between'
					alignItems='center'
					flexWrap='wrap'
					py='1'
				>
					<SearchTags searchTags={getTagValues} />
				</Flex>
			)}

			{/* divider  */}
			<Box height='2px' my={3} bg={colors.bgInput} />

			{/* Table */}
			<Box
				      maxHeight="60vh"
      minH="60vh"
				overflowY='auto'
				borderRadius='md'
				boxShadow={colors.cardShadow}
				bg={colors.bg}
				my='2'
				border='1px solid'
				borderColor={colors.borderColor}
			>
				<Table variant='simple' size='sm'>
					<Thead position='sticky' top={0} bg={colors.bgDeep} zIndex={1}>
						<Tr>
							<Th py={4} w='48px' bg={colors.bgDeep} borderColor={colors.borderColor}>
								<Checkbox
									colorScheme='yellow'
									isChecked={currentPageAllChecked}
									isIndeterminate={currentPageSomeChecked}
									onChange={(e) => toggleSelectAllCurrentPage(e.target.checked)}
								/>
							</Th>
							<Th bg={colors.bgDeep} borderColor={colors.borderColor} color={colors.headingText}>Lead Name</Th>
							<Th bg={colors.bgDeep} borderColor={colors.borderColor} color={colors.headingText}>Phone</Th>
							<Th bg={colors.bgDeep} borderColor={colors.borderColor} color={colors.headingText}>Whatsapp</Th>
						</Tr>
					</Thead>

					<Tbody>
						{isLoading || isFetching ? (
							<TableLoading columns={columns} length='20' />
						) : leads.length === 0 ? (
							<Tr>
								<Td colSpan={4} borderColor={colors.borderColor}>
									<NoData label='leads' />
								</Td>
							</Tr>
						) : (
							leads.map((lead) => {
								const selected =
									selectedLeadsMap.has(lead._id) || selectAllMatching;
								return (
									<Tr
										key={lead._id}
										cursor='pointer'
										bg={selected ? colors.badgeInfoBg : undefined}
										_hover={{ bg: selected ? colors.badgeInfoBg : colors.bgDeep }}
										onClick={() => toggleRow(lead)}
										borderColor={colors.borderColor}
									>
										<Td borderColor={colors.borderColor}>
											<Checkbox
												isChecked={selected}
												onChange={() => toggleRow(lead)}
												colorScheme='yellow'
											/>
										</Td>
										<Td fontWeight={selected ? 'semibold' : 'normal'} color={colors.bodyText} borderColor={colors.borderColor}>
											{lead.leadName || '—'}
										</Td>
										<Td color={colors.bodyText} borderColor={colors.borderColor}>
											{safeValue(lead?.leadPhoneNumber) || '—'}
										</Td>
										<Td color={colors.bodyText} borderColor={colors.borderColor}>
											{safeValue(lead?.leadWhatsappNumber) || '-'}
										</Td>
									</Tr>
								);
							})
						)}
					</Tbody>
				</Table>
			</Box>

			{/* Bulk selection banner */}
			{selectedCount > 0 && !selectAllMatching && (
				<Flex
					p={3}
					flexDir={{ base: 'column', md: 'row' }}
					bg={colors.bgInput}
					rounded='md'
					align='center'
					gap={3}
					border='1px solid'
					borderColor={colors.borderColor}
				>
					<Text fontSize='sm' color={colors.bodyText}>
						{selectedCount} lead(s) selected on current pages.
					</Text>

					<Button size='sm' variant='link' onClick={clearAllSelection} color={colors.accentGold}>
						Clear all selected leads
					</Button>
					<Spacer />
					<Text fontSize='sm' color={colors.mutedText}>
						Showing {leads.length} / {totalResults}
					</Text>
				</Flex>
			)}

			{/* Pagination */}
			<Flex align='center' gap={2} py='2'>
				<Button
					size='sm'
					leftIcon={<FiChevronLeft />}
					onClick={() => setPage((p) => Math.max(1, p - 1))}
					isDisabled={page <= 1 || isFetching}
					variant='outline'
				>
					Prev
				</Button>

				<Text fontSize='sm' color={colors.bodyText}>
					Page {page} / {totalPages}
				</Text>

				<Button
					size='sm'
					rightIcon={<FiChevronRight />}
					onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
					isDisabled={page >= totalPages || isFetching}
					variant='outline'
				>
					Next
				</Button>

				<Select
					value={limit}
					onChange={(e) => {
						setLimit(Number(e.target.value));
						setPage(1);
					}}
					w='80px'
					size='sm'
					fontSize='sm'
					outline='none'
					bg={colors.bgInput}
					borderColor={colors.borderColor}
					color={colors.headingText}
					_hover={{ borderColor: colors.accentGold }}
					_focus={{
						borderColor: colors.accentGold,
						boxShadow: `0 0 0 1px ${colors.accentGold}`,
					}}
				>
					{PAGE_SIZES.map((s) => (
						<option key={s} value={s} style={{ background: colors.bg, color: colors.headingText }}>
							{s}
						</option>
					))}
				</Select>
			</Flex>

			{/* Actions */}
			<Flex justify='space-between' w='full'>
				<Button
					px='10'
					py='5'
					fontSize={{ base: 'sm', md: 'lg' }}
					variant='outline'
					onClick={onBack}
				>
					Back
				</Button>

				<HStack>
					<Button
						px='10'
						py='5'
						fontSize={{ base: 'sm', md: 'lg' }}
						variant='brand'
						onClick={handleConfirm}
						isDisabled={selectedCount < 1}
					>
						Continue
					</Button>
				</HStack>
			</Flex>

			{advanceSearch && (
				<AdvancedSearchModal
					advanceSearch={advanceSearch}
					setAdvanceSearch={setAdvanceSearch}
					isFormReset={isFormReset}
					setIsFormReset={setIsFormReset}
					setGetTagValues={setGetTagValues}
					setAppliedFilters={setAppliedFilters}
					appliedFilters={appliedFilters}
					handleClear={handleClear}
				/>
			)}
		</Box>
	);
}

export default StepLeadSelect;