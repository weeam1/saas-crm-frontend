import React, { useEffect, useState, useCallback } from 'react';
import {
	Box,
	Flex,
	IconButton,
	useBreakpointValue,
	Text,
	Button,
} from '@chakra-ui/react';
import { FiSearch} from 'react-icons/fi';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import ActiveFiltersDisplay from './Component/ActiveFiltersDisplay';
import AdvancedSearchModal from './Component/AdvancedSearchModal';
import { toast } from 'react-toastify';

import ViewToggle from 'components/toggle/ViewToggle';
import CallTableView from './CallTableView';
import CallGrid from './CallGrid';
import TopPagination from 'components/pagination/TopPagination';
import ShareRecordingModal from './Component/ShareRecordingModal';
import LogModal from './Component/LogModal';
import SharedDetailModal from './Component/SharedDetailModal';
import { fetchCallHistoryData } from 'services/sip';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { useModalColors } from 'hooks/useModalColors';
import RefreshButton from 'components/refresh/RefreshButton';

const CallHistory = () => {
	const colors = useModalColors();
	const { id } = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const userName = location.state?.userName;
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
	const loggedInUserId = JSON.parse(localStorage.getItem('user'))?._id;
	const [isShareOpen, setIsShareOpen] = useState(false);
	const [isLogOpen, setIsLogOpen] = useState(false);
	const [isSharedDetailOpen, setIsSharedDetailOpen] = useState(false);
	const [selectedCallForModal, setSelectedCallForModal] = useState(null);

	const isMobile = useBreakpointValue({ base: true, sm: true, md: false });

	const buildQueryParams = useCallback(() => {
		const params = {
			page: page,
			page_size: pageSize,
		};
		if (id) {
			params.user_id = id;
		} else {
			params.user_id = loggedInUserId;
		}
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
	}, [page, pageSize, filters, loggedInUserId, id]);

	const loadCalls = useCallback(async () => {
		try {
			setLoading(true);
			const params = buildQueryParams();

			const data = await fetchCallHistoryData(params);

			setCalls(data.data || []);
			setTotalItems(data.total_records || 0);
			setTotalPages(data.total_pages || 1);
			if (data.page) setPage(data.page);

			if (data.page_size && pageSize === 10 && page === 1) {
				setPageSize(data.page_size);
			}
		} catch (err) {
			setError('Failed to fetch call history');
			toast.error('Failed to fetch call history');
		} finally {
			setLoading(false);
		}
	}, [buildQueryParams, pageSize, page]);

	useEffect(() => {
		if (!id) {
			setFilters({});
		}
	}, [id]);

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

	const openShareModal = (call) => {
		setSelectedCallForModal(call);
		setIsShareOpen(true);
	};

	const openLogModal = (call) => {
		setSelectedCallForModal(call);
		setIsLogOpen(true);
	};

	const openSharedDetailModal = (call) => {
		setSelectedCallForModal(call);
		setIsSharedDetailOpen(true);
	};

	return (
		<Box
			overflowX='auto'
			borderWidth='1px'
			borderColor={colors.borderColor}
			borderRadius='lg'
			bg={colors.bg}
			p={3}
			marginTop={'-16px'}
			boxShadow={colors.cardShadow}
		>
			<Flex
				justifyContent='space-between'
				alignItems='center'
				m={3}
				gap={2}
				flexWrap={'wrap'}
			>
				<Flex align="center" gap={3} p={3}>
					{id && (
						<IconButton
							icon={<FiArrowLeft />}
							onClick={() => navigate(-1)}
							variant="ghost"
							size="sm"
							aria-label="Go back"
						/>
					)}
					<Flex alignItems="center" gap="2" fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
						<Text textAlign={{ base: "center", md: "left" }} color={colors.headingText}>
							{id ? `${userName || 'User'}'s Recordings` : 'My Recordings'}
						</Text>
						<CountUpComponent key={totalItems} targetNumber={totalItems} />
					</Flex>
				</Flex>

				<Box
					gap={2}
					display='flex'
					alignItems='center'
					flexDir={{ base: 'column', sm: 'column', md: 'row' }}
					justifyContent={{ base: 'center', sm: 'center', md: 'normal' }}
				>
					{/* Refresh Button - Ghost variant */}
						<RefreshButton
										label="Refresh"
										onClick={loadCalls}
										isLoading={loading}
										isFetching={loading}
										size="sm"
									/>

					{isMobile ? (
						<IconButton
							icon={<FiSearch />}
							onClick={() => setIsFilterOpen(true)}
							aria-label='Search Listings'
							variant="ghost"
							size="sm"
						/>
					) : (
						<Button
							variant="outline"
							size="sm"
							borderRadius="lg"
							py={3}
							px={6}
							onClick={() => setIsFilterOpen(true)}
						>
							Advanced Search
						</Button>
					)}
					<ViewToggle
						view={view}
						handleView={handleViewChange}
						moduleView='callHistoryView'
					/>
				</Box>
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

			{view === 'table' ? (
				<CallTableView
					calls={calls}
					currentlyPlayingId={currentlyPlayingId}
					handleSetCurrentlyPlaying={handleSetCurrentlyPlaying}
					setCurrentlyPlayingId={setCurrentlyPlayingId}
					handleCopy={handleCopy}
					copied={copied}
					loading={loading}
					openLogModal={openLogModal}
					openShareModal={openShareModal}
					openSharedDetailModal={openSharedDetailModal}
				/>
			) : (
				<CallGrid
					calls={calls}
					currentlyPlayingId={currentlyPlayingId}
					handleSetCurrentlyPlaying={handleSetCurrentlyPlaying}
					setCurrentlyPlayingId={setCurrentlyPlayingId}
					handleCopy={handleCopy}
					pageSize={pageSize}
					loading={loading}
					openLogModal={openLogModal}
					openShareModal={openShareModal}
					openSharedDetailModal={openSharedDetailModal}
				/>
			)}

			<AdvancedSearchModal
				isOpen={isFilterOpen}
				onClose={() => setIsFilterOpen(false)}
				onApplyFilters={handleApplyFilters}
				initialFilters={filters}
				clearFilter={filterChanged}
			/>

			<ShareRecordingModal
				isOpen={isShareOpen}
				onClose={() => setIsShareOpen(false)}
				call={selectedCallForModal}
			/>

			<LogModal
				isOpen={isLogOpen}
				onClose={() => setIsLogOpen(false)}
				call={selectedCallForModal}
			/>

			<SharedDetailModal
				isOpen={isSharedDetailOpen}
				onClose={() => setIsSharedDetailOpen(false)}
				call={selectedCallForModal}
			/>
		</Box>
	);
};

export default CallHistory;