
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
	Box,
	Flex,
	IconButton,
	useBreakpointValue,
	Button,
	Text,
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import {
	fetchCallHistoryData,
	fetchCallHistoryServer2Data,
} from '../../../../../../services/sip/index';
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
import { useTeamStructure } from 'hooks/user/useTeamStructure';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { useSelector } from 'react-redux';
import { useModalColors } from 'hooks/useModalColors';
import RefreshButton from 'components/refresh/RefreshButton';

const CallHistory = () => {
	const colors = useModalColors();
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

	const { team, getTeamLeadsByManager, getAgentsByManager, getAgentsByManagerAndTL, findManagerByTL } = useTeamStructure();
	const user = JSON.parse(localStorage.getItem("user") || "{}");
	const userId = user?._id;
	const userRole = user?.roleName?.toLowerCase();
	const users = useSelector((state) => state.user.users);

	const getUserNameById = useCallback((userId) => {
		if (!userId) return 'Unknown User';
		const user = users?.find(u => u._id === userId || u.id === userId);
		return user?.name || user?.fullName || user?.username || 'Unknown User';
	}, [users]);

	const [userIds, setUserIds] = useState([]);
	const [isTeamDataProcessed, setIsTeamDataProcessed] = useState(false);

	const [isShareOpen, setIsShareOpen] = useState(false);
	const [isLogOpen, setIsLogOpen] = useState(false);
	const [isSharedDetailOpen, setIsSharedDetailOpen] = useState(false);
	const [selectedCallForModal, setSelectedCallForModal] = useState(null);

	const isMobile = useBreakpointValue({ base: true, sm: true, md: false });

	// Ref to store latest userIds without causing re-renders
	const userIdsRef = useRef(userIds);

	// Update ref whenever userIds changes
	useEffect(() => {
		userIdsRef.current = userIds;
	}, [userIds]);

	// Process team data and build userIds array based on role (runs only once)
	useEffect(() => {
		if (!team?.length || isTeamDataProcessed) return;

		let ids = [];

		// Handle different user roles
		if (userRole === "manager") {
			// Manager: sees themselves + all team leads + all agents under those team leads
			const managerId = userId;
			const teamLeads = getTeamLeadsByManager(managerId) || [];

			ids = [
				managerId,
				...teamLeads.map(tl => tl._id),
				...teamLeads.flatMap(tl => getAgentsByManagerAndTL(managerId, tl._id).map(a => a._id))
			];
			console.log(`Manager ${managerId} - Access to ${ids.length} users (includes all team members)`);

		} else if (userRole === "team leader") {
			// Team Leader: sees their manager + themselves + their own agents only
			const managerId = findManagerByTL(userId, team);
			if (managerId) {
				const agents = getAgentsByManagerAndTL(managerId, userId) || [];
				ids = [managerId, userId, ...agents.map(a => a._id)];
				console.log(`Team Leader ${userId} - Access to ${ids.length} users (manager + self + agents)`);
			} else {
				console.log(`Team Leader ${userId} - No manager found`);
				ids = [userId];
			}

		} else if (userRole === "agent") {
			// Regular Agent: only sees their own calls
			ids = [];
			console.log(`Agent ${userId} - Access to own calls only (no user_ids filter)`);

		} else if (userRole === "admin") {
			// Admin: sees all users (don't apply user_ids filter)
			ids = [];
			console.log(`Admin - Access to all users (no user_ids filter applied)`);

		} else {
			// Unknown role - no filter
			ids = [];
			console.log(`Unknown role ${userRole} - No user_ids filter`);
		}

		// Remove duplicates
		ids = [...new Set(ids)];

		setUserIds(ids);
		setIsTeamDataProcessed(true);
		console.log(`Final userIds for role ${userRole}:`, ids);

	}, [team, userId, userRole, isTeamDataProcessed, getTeamLeadsByManager, getAgentsByManager, getAgentsByManagerAndTL, findManagerByTL]);

	// Build query params using ref to avoid dependency issues
	const buildQueryParams = useCallback(() => {
		const params = {
			page: page,
			page_size: pageSize,
		};

		if (userIdsRef.current && userIdsRef.current.length > 0) {
			params.user_ids = userIdsRef.current;
		}

		// Add other filters
		if (filters.call_from) params.call_from = filters.call_from;
		if (filters.call_to) params.call_to = filters.call_to;
		if (filters.clid) params.clid = filters.clid;
		if (filters.user_id) params.user_id = filters.user_id;
		if (filters.start_date) {
			params.start_date = new Date(filters.start_date)
				.toISOString()
				.slice(0, 10);
		}
		if (filters.end_date) {
			params.end_date = new Date(filters.end_date)
				.toISOString()
				.slice(0, 10);
		}
		if (filters.disposition) params.disposition = filters.disposition;

		// Log for debugging
		if (params.user_ids) {
			console.log(`API Request with ${params.user_ids.length} user_ids for role ${userRole}`);
		} else {
			console.log(`API Request with no user_ids filter for role ${userRole}`);
		}

		return params;
	}, [page, pageSize, filters, userRole]);

	// Load calls function
	const loadCalls = useCallback(async () => {
		// Don't load if we haven't processed team data yet
		if (!isTeamDataProcessed) return;

		try {
			setLoading(true);
			const params = buildQueryParams();

			const data = await fetchCallHistoryData(params);
			// const data = await fetchCallHistoryServer2Data(params);

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
	}, [buildQueryParams, pageSize, page, isTeamDataProcessed]);

	useEffect(() => {
		if (isTeamDataProcessed) {
			loadCalls();
		}
	}, [isTeamDataProcessed, page, pageSize, filters]);

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

	// Reset currently playing when page or calls change
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

	// Manual refresh handler
	const handleRefresh = useCallback(() => {
		loadCalls();
	}, [loadCalls]);

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
				<Flex alignItems="center" gap="2" fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
					<Text textAlign={{ base: "center", md: "left" }} color={colors.headingText}>
						Call History
					</Text>
					<CountUpComponent key={totalItems} targetNumber={totalItems} />
				</Flex>

				<Flex align="center" gap={3} p={3}>
					{/* Refresh Button - Ghost variant */}
					<RefreshButton
					label="Refresh"
					onClick={handleRefresh}
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
				</Flex>
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
					getUserNameById={getUserNameById}
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
					getUserNameById={getUserNameById}
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
				allowedUserIds={userIds}
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