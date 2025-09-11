// StepLeadSelect.jsx
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
	Tag,
	TagLabel,
	TagCloseButton,
} from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight, FiRefreshCw } from 'react-icons/fi';
import { useFetchItemsQuery } from 'api/apiSlice'; // adjust path
import { safeValue } from 'utils';
import TableLoading from 'components/loading/TableLoading';
import { toast } from 'react-toastify';
import { buttonStyle } from 'utils/btn';
import AdvancedSearchModal from './filters/AdvancedSearch';
import { BiX } from 'react-icons/bi';
import SearchTags from 'components/search/SearchTags';
import NoData from 'components/Message/NoData';

const DEFAULT_LIMIT = 25;
const PAGE_SIZES = [25, 50, 100, 150, 200];

export function StepLeadSelect({
	queryParams = {}, // base params (passed from parent) — merged with local filters
	onBack,
	onConfirm, // receives selectedLeadObjects array
	selectedLeadsMap,
	setSelectedLeadsMap,
}) {
	// local pagination & filters
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(DEFAULT_LIMIT);
	const [search, setSearch] = useState('');
	const [leadStatus, setLeadStatus] = useState(''); // example filter
	const [mainLeadStatus, setMainLeadStatus] = useState(''); // example filter

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
		// If selectAllMatching is active and user toggles an individual, we must switch off selectAllMatching
		if (selectAllMatching) {
			setSelectAllMatching(false);
			// keep previously selectedLeadsMap empty (we'll selectively add current row)
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
		// Simple UX: mark selectAllMatching true and clear selectedLeadsMap (we treat as all selected)
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
			// send a special payload — here we pass { selectAll: true, filters: params }
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
		setIsFormReset(true); // resets form fields
	};

	const removeFilter = (key) => {
		const updatedFilters = { ...appliedFilters };
		delete updatedFilters[key];
		setAppliedFilters(updatedFilters);

		setGetTagValues((prev) => prev.filter((tag) => tag.key !== key));
	};

	// When page or filters change, we want to keep selectedLeadsMap intact (persistence across pages).
	// Optionally: clear selectAllMatching when filters change
	useEffect(() => {
		setSelectAllMatching(false);
	}, [limit]);

	const columns = ['checkbox', 'Lead Name', 'Phone', 'WhatsApp'];

	console.log({ getTagValues });

	return (
		<Box>
			<Box mb='2'>
				<Heading size='md'>Leads</Heading>
				<Text fontSize='sm' color='gray.600'>
					Select leads for this bulk message.
				</Text>
			</Box>

			{/* Controls */}
			<HStack spacing={3} wrap='wrap'>
				<Button
					border='1px solid'
					borderColor='softGray.600'
					bg='white'
					borderRadius='md'
					px={4}
					fontSize='xs'
					w='auto'
					minW='max-content'
					height='2.2rem'
					_hover={{ bg: 'gray.50' }}
					_active={{ bg: 'gray.100' }}
					onClick={() => setAdvanceSearch(true)}
				>
					Advance Search
				</Button>

				{/* Clear and Delete button  */}
				{getTagValues.length > 0 && (
					<Button
						{...buttonStyle}
						variant='solid'
						bg='softGray.100'
						w='fit-content'
						color='gray.800'
						sx={{
							svg: {
								fill: 'gray.800',
							},
						}}
						_active={{ bg: 'gray.100' }}
						leftIcon={<BiX />}
						aria-label='Clear'
						onClick={handleClear}
					>
						Clear
					</Button>
				)}

				<Spacer />

				<Badge colorScheme='purple'>
					{selectedCount} selected {selectAllMatching ? ' (all matching)' : ''}
				</Badge>
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
			<Box height='2px' my={3} bg='softGray.50' />

			{/* Table */}
			<Box
				maxH={'60vh'}
				overflowY='auto'
				borderRadius='md'
				boxShadow='sm'
				bg='white'
				my='2'
			>
				<Table variant='simple' size='sm'>
					<Thead position='sticky' top={0} bg='white' zIndex={1}>
						<Tr bg='brand.200' color='gray.800'>
							<Th py={4} w='48px'>
								<Checkbox
									colorScheme='brand'
									isChecked={currentPageAllChecked}
									isIndeterminate={currentPageSomeChecked}
									onChange={(e) => toggleSelectAllCurrentPage(e.target.checked)}
								/>
							</Th>
							<Th>Lead Name</Th>
							<Th>Phone</Th>
							<Th>Whatsapp</Th>
						</Tr>
					</Thead>

					<Tbody>
						{isLoading || isFetching ? (
							<TableLoading columns={columns} length='20' />
						) : leads.length === 0 ? (
							<Tr>
								<Td colSpan={4}>
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
										bg={selected ? 'blue.100' : undefined}
										_hover={{ bg: selected ? 'blue.100' : 'gray.50' }}
										onClick={() => toggleRow(lead)}
									>
										<Td>
											<Checkbox
												isChecked={selected}
												onChange={() => toggleRow(lead)}
												colorScheme='brand'
											/>
										</Td>
										<Td fontWeight={selected ? 'semibold' : 'normal'}>
											{lead.leadName || '—'}
										</Td>
										<Td>{safeValue(lead?.leadPhoneNumber) || '—'}</Td>
										<Td>{safeValue(lead?.leadWhatsappNumber) || '-'}</Td>
										{/* <Td>
											<Badge
												colorScheme={
													lead.leadStatus === 'new' ? 'green' : 'gray'
												}
											>
												{lead.leadStatus || '—'}
											</Badge>
										</Td> */}
									</Tr>
								);
							})
						)}
					</Tbody>
				</Table>
			</Box>

			{/* Pagination */}
			<Flex align='center' gap={2} py='2'>
				<Button
					size='sm'
					leftIcon={<FiChevronLeft />}
					onClick={() => setPage((p) => Math.max(1, p - 1))}
					isDisabled={page <= 1 || isFetching}
				>
					Prev
				</Button>

				<Text fontSize='sm'>
					Page {page} / {totalPages}
				</Text>

				<Button
					size='sm'
					rightIcon={<FiChevronRight />}
					onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
					isDisabled={page >= totalPages || isFetching}
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
				>
					{PAGE_SIZES.map((s) => (
						<option key={s} value={s}>
							{s}
						</option>
					))}
				</Select>

				<Spacer />
				<Text fontSize='sm' color='gray.500'>
					{isFetching ? 'Updating…' : `${totalResults} results`}
				</Text>
			</Flex>

			{/* Actions */}
			<Flex justify='space-between' w='full'>
				<Button
					{...buttonStyle}
					px='10'
					py='5'
					bg='gray.100'
					color='gray.800'
					_active={{ bg: 'gray.200' }}
					fontSize={{ base: 'sm', md: 'lg' }}
					variant='outline'
					onClick={onBack}
				>
					Back
				</Button>

				<HStack>
					{/* <Button
						variant='ghost'
						onClick={() => {
							setPage(1);
							setSearch('');
							setLeadStatus('');
							setMainLeadStatus('');
						}}
					>
						Reset Filters
					</Button> */}
					<Button
						{...buttonStyle}
						px='10'
						py='5'
						fontSize={{ base: 'sm', md: 'lg' }}
						colorScheme='whatsapp'
						onClick={handleConfirm}
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
