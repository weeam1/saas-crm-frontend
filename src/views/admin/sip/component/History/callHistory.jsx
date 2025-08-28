import React, { useEffect, useState, useCallback } from 'react';
import {
	Box,
	Flex,
	IconButton,
	useColorModeValue,
	useBreakpointValue,
	Button,
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { fetchCallHistoryData } from '../../../../../services/sip/index';
import moment from 'moment';
import Pagination from '../../../developers/components/Pagination';
import TableLoading from 'components/loading/TableLoading';
import NoData from 'views/admin/lead-v2/components/subComponents/NoData';
import ActiveFiltersDisplay from './Component/ActiveFiltersDisplay';
import AdvancedSearchModal from './Component/AdvancedSearchModal';
import { toast } from 'react-toastify';
import { formatCallDuration } from 'utils/helpers';
import ViewToggle from "components/toggle/ViewToggle";
import CallTableView from './CallTableView';
import CallGrid from './CallGrid';
import TopPagination from 'components/pagination/TopPagination';

const CallHistory = ({ setTotalCallRecord }) => {
	const [calls, setCalls] = useState([]);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(12);
	const [totalItems, setTotalItems] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filters, setFilters] = useState({});
	const [filterChanged, setFilterChanged] = useState(false);
	const [copied, setCopied] = useState(false);
	const [view, setView] = useState(() => {
		return localStorage.getItem('callHistoryView') || 'table';
	});

	const isMobile = useBreakpointValue({ base: true, sm: true, md: false });

	const buildQueryParams = useCallback(() => {
		const params = {
			page: page,
			page_size: pageSize,
		};

		if (filters.call_from) params.call_from = filters.call_from;
		if (filters.call_to) params.call_to = filters.call_to;
		if (filters.clid) params.clid = filters.clid;
		if (filters.start_date)
			params.start_date = new Date(filters.start_date)
				.toISOString()
				.slice(0, 10);
		if (filters.end_date)
			params.end_date = new Date(filters.end_date).toISOString().slice(0, 10);
		if (filters.disposition) params.disposition = filters.disposition;

		return params;
	}, [page, pageSize, filters]);

	const loadCalls = useCallback(async () => {
		try {
			setLoading(true);
			const params = buildQueryParams();
			const data = await fetchCallHistoryData(params);

			setCalls(data.data || []);
			setTotalItems(data.total_records || 0);
			setTotalCallRecord(data.total_records || 0);
			setTotalPages(data.total_pages || 1);
			if (data.page) setPage(data.page);

			if (data.page_size && pageSize === 10 && page === 1) {
				setPageSize(data.page_size);
			}
		} catch (err) {
			setError('Failed to fetch call history');
		} finally {
			setLoading(false);
		}
	}, [buildQueryParams, pageSize, page]);

	useEffect(() => {
		loadCalls();
	}, [loadCalls]);

	const handlePageChange = useCallback((newPage) => {
		setPage(newPage);
	}, []);

	const handlePageSizeChange = useCallback((value) => {
		setPageSize(value);
		setPage(1);
	}, []);

	const handleSetCurrentlyPlaying = useCallback((playerId) => {
		setCurrentlyPlayingId(playerId);
	}, []);

	const handleClearFilters = useCallback((filterKey) => {
		if (filterKey) {
			setFilters((prev) => {
				const newFilters = { ...prev };
				delete newFilters[filterKey];
				return newFilters;
			});
		} else {
			setFilters({});
		}
		setPage(1);
		setFilterChanged((prev) => !prev);
	}, []);

	const handleApplyFilters = useCallback((newFilters) => {
		const cleanedFilters = Object.fromEntries(
			Object.entries(newFilters).filter(
				([_, value]) => value !== '' && value !== undefined && value !== null
			)
		);

		setFilters(cleanedFilters);
		setPage(1);
		setFilterChanged((prev) => !prev);
	}, []);

	const handleViewChange = (newView) => {
		setView(newView);
		localStorage.setItem('callHistoryView', newView);
	};

	const handleCopy = async (number) => {
		if (!number) return;

		try {
			await navigator.clipboard.writeText(number);
			setCopied(true);
			toast.success(`Copied: ${number}`, { autoClose: 2000 });
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			toast.error('Failed to copy!', { autoClose: 2000 });
		}
	};

	useEffect(() => {
		setCurrentlyPlayingId(null);
	}, [page, calls]);

	return (
		<Box
			overflowX='auto'
			borderWidth='1px'
			borderColor={useColorModeValue('gray.200', 'gray.700')}
			borderRadius='0px'
			bg='white'
			p={3}
			marginTop={'-16px'}
		>
			<Flex justifyContent='flex-end' alignItems='center' m={3} gap={2} flexWrap={"wrap"}>
				{isMobile ? (
					<IconButton
						icon={<FiSearch />}
						onClick={() => setIsFilterOpen(true)}
						aria-label='Search Listings'
						colorScheme='brand'
						variant='solid'
						size='sm'
						borderRadius='full'
						boxShadow='md'
					/>
				) : (
					<Button
						colorScheme='brand'
						size='md'
						borderRadius='full'
						py={3}
						px={6}
						onClick={() => setIsFilterOpen(true)}
					>
						Advanced Search
					</Button>
				)}
				<ViewToggle view={view} handleView={handleViewChange}  moduleView="callHistoryView"/>
			</Flex>

			<Box m={3}>
				<ActiveFiltersDisplay
					filters={filters}
					onClearFilters={handleClearFilters}
				/>
			</Box>

			<TopPagination
				currentPage={page}
				totalPages={totalPages}
				onPageChange={handlePageChange}
				totalItems={totalItems}
				itemsPerPage={pageSize}
				setPageSize={setPageSize}
				handlePageSize={handlePageSizeChange}
				refetching={loading}
				loading={loading}
			/>
			{loading ? (
				view === 'table' ? (
					<TableLoading
						columns={[
							'Call id',
							'Call date',
							'Call Mode',
							'Call from',
							'Call to',
							'Recording',
							'Status',
							'Type',
							'Call Duration',
							'Talk Duration',
						]}
						length={10}
						py='4'
					/>
				) : (
					<CallGrid loading={loading} pageSize={pageSize} />
				)
			) : calls && calls.length > 0 ? (
				view === 'table' ? (
					<CallTableView
						calls={calls}
						currentlyPlayingId={currentlyPlayingId}
						handleSetCurrentlyPlaying={handleSetCurrentlyPlaying}
						setCurrentlyPlayingId={setCurrentlyPlayingId}
						handleCopy={handleCopy}
						copied={copied}
					/>
				) : (
					<CallGrid
						calls={calls}
						currentlyPlayingId={currentlyPlayingId}
						handleSetCurrentlyPlaying={handleSetCurrentlyPlaying}
						setCurrentlyPlayingId={setCurrentlyPlayingId}
						handleCopy={handleCopy}
					/>
				)
			) : (
				<Box w='full' p='4' textAlign='center'>
					<NoData label='call records' />
				</Box>
			)}

			<AdvancedSearchModal
				isOpen={isFilterOpen}
				onClose={() => setIsFilterOpen(false)}
				onApplyFilters={handleApplyFilters}
				initialFilters={filters}
				clearFilter={filterChanged}
			/>
		</Box>
	);
};

export default CallHistory;
