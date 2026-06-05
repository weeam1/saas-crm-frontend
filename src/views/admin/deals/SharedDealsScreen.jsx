import { useEffect, useMemo, useState, useCallback } from 'react';
import {
	Box,
	Button,
	Flex,
	HStack,
	Text,
	useDisclosure,
	IconButton,
} from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';

import { buttonStyle } from 'utils/btn';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import DataView from './DataView';
import DealFilterModal from './components/DealFilterModal';
import SearchTags from 'components/shared/SearchTags'; // Changed to shared/SearchTags
import { BiX } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import TopPagination from 'components/pagination/TopPagination';
import ErrorMessage from 'components/Message/ErrorMessage';
import { dealsLabels } from 'utils/searchLabels';
import DateFilterButton from '../lead-v2/components/DateFilterButton';
import DateRangeFilter from './components/DateRangeFilter';
import { format } from 'date-fns';
import ViewToggle from 'components/toggle/ViewToggle';
import { usePermissions } from 'hooks/usePermissions';
import { useNavigate } from 'react-router-dom';
import CustomTooltip from 'components/shared/CustomTooltip';
import RefreshButton from 'components/refresh/RefreshButton';

const LIMIT = 20;

const SharedDealsScreen = () => {
	const [deals, setDeals] = useState([]);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [searchClear, setSearchClear] = useState(false);
	const [searchTags, setSearchTags] = useState([]);
	const [filters, setFilters] = useState([]);
	const [refetchLoading, setRefetchLoading] = useState(false);

	const [view, setView] = useState(() => {
		return localStorage.getItem('dealsView') || 'table';
	});
	const { hasPermission } = usePermissions();
	const navigate = useNavigate();

	useEffect(() => {
		if (!hasPermission('deal')) return navigate('/default');
	}, []);

	const {
		isOpen: dateTimeIsOpen,
		onOpen: dateTimeOnOpen,
		onClose: dateTimeOnClose,
	} = useDisclosure();

	const tree = useSelector((state) => state.user.tree);

	const [queryParams, setQueryParams] = useState({ page: 1, limit: LIMIT });

	const {
		data,
		isLoading,
		isFetching,
		refetch,
		error: dealsError,
	} = useFetchItemsQuery(
		{ path: 'deals/shared', params: queryParams },
		{ refetchOnMountOrArgChange: true },
	);

	// Handle refetch loading state
	useEffect(() => {
		if (isFetching && !isLoading) {
			setRefetchLoading(true);
		} else {
			const timer = setTimeout(() => setRefetchLoading(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [isFetching, isLoading]);

	// Refetch on queryParams change
	useEffect(() => {
		refetch({ path: '/deals/shared', params: queryParams });
	}, [queryParams]);

	// Update deals when data is fetched
	useEffect(() => {
		if (data?.doc) {
			setDeals(data.doc);
		}
	}, [data?.doc]);

	// Helper function to generate search tags from filters
	const generateSearchTags = useCallback(
		(filterObj) => {
			const tags = [];

			Object.entries(filterObj).forEach(([key, value]) => {
				let displayValue = value;
				let displayLabel =
					dealsLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
				let originalValue = value;

				// Handle manager
				if (key === 'manager') {
					const manager = tree.managers.find(
						(user) => user?._id?.toString() === value,
					);
					displayValue = manager
						? `${manager.firstName} ${manager.lastName}`
						: value === '-1'
							? 'No Manager'
							: value;
					displayLabel = 'Manager';
					originalValue = value;
				}

				// Handle agent
				if (key === 'agent') {
					const agentsArray = Object.values(tree.agents).flatMap(
						(agentList) => agentList,
					);
					const agent = agentsArray.find(
						(user) => user?._id?.toString() === value,
					);
					displayValue = agent
						? `${agent.firstName} ${agent.lastName}`
						: value === '-1'
							? 'No Agent'
							: value;
					displayLabel = 'Agent';
					originalValue = value;
				}

				if (key === 'spaDone') {
					displayValue = value === 'true' ? 'Signed' : 'Pending';
					displayLabel = 'SPA Done';
					originalValue = value;
				}

				if (key === 'invoiceSent') {
					displayValue = value === 'true' ? 'Yes' : 'No';
					displayLabel = 'Invoice Sent';
					originalValue = value;
				}

				if (key === 'closedBy') {
					if (typeof value === 'object' && value !== null) {
						displayValue = value.fullName;
						displayLabel = 'Closed By';
						originalValue = value._id;
					}
				}

				tags.push({
					key: `${key}-${originalValue}`, // Unique key for React
					label: displayLabel, // Display label (shown before colon)
					value: displayValue, // Display value (shown after colon)
					originalKey: key,
					originalValue: originalValue,
				});
			});

			return tags;
		},
		[tree.managers, tree.agents],
	);

	// Remove individual tag
	const removeTag = useCallback(
		(key) => {
			const removedTag = searchTags.find((tag) => tag.key === key);
			if (!removedTag) return;

			const updatedTags = searchTags.filter((tag) => tag.key !== key);
			setSearchTags(updatedTags);

			// Rebuild filters from remaining tags
			const updatedFilters = updatedTags.reduce((acc, tag) => {
				acc[tag.originalKey] = tag.originalValue;
				return acc;
			}, {});

			// Remove the specific filter from query params
			const newQueryParams = {
				page: 1,
				limit: LIMIT,
				...updatedFilters,
			};

			// Clean up undefined values
			Object.keys(newQueryParams).forEach((key) => {
				if (newQueryParams[key] === undefined) {
					delete newQueryParams[key];
				}
			});

			setQueryParams(newQueryParams);
			setFilters(updatedFilters);
			setRefetchLoading(true);
			setSearchClear(updatedTags.length > 0);
		},
		[searchTags],
	);

	// Clear all tags
	const clearAllTags = useCallback(() => {
		setSearchTags([]);
		setFilters([]);
		setQueryParams({ page: 1, limit: LIMIT });
		setRefetchLoading(true);
		setSearchClear(false);
	}, []);

	const handleDealFilters = useCallback(
		(filters) => {
			// Clean filters: remove keys with undefined, null, empty string
			const cleanObject = (obj) =>
				Object.fromEntries(
					Object.entries(obj).filter(
						([_, v]) => v !== undefined && v !== null && v !== '',
					),
				);

			const cleaned = cleanObject(filters);
			setFilters(cleaned);

			// Generate tags for the new filters
			const newTags = generateSearchTags(cleaned);

			// Preserve date filter tags if they exist
			setSearchTags((prev) => {
				const startTag = prev.find((t) => t.originalKey === 'from');
				const endTag = prev.find((t) => t.originalKey === 'to');
				const preserved = [startTag, endTag].filter(Boolean);

				return [...preserved, ...newTags];
			});

			let searchFilters = { ...cleaned };

			// Extract `closedBy._id`
			if (cleaned.closedBy && typeof cleaned.closedBy === 'object') {
				searchFilters.closedBy = cleaned.closedBy._id;
			}

			setSearchClear(true);
			setRefetchLoading(true);
			setQueryParams((prev) => ({ ...prev, ...searchFilters, page: 1 }));
		},
		[generateSearchTags],
	);

	const handleDateFilter = useCallback(
		(dateFilter) => {
			dateTimeOnClose();
			const { from, to } = dateFilter;

			setRefetchLoading(true);
			setQueryParams((prev) => ({ ...prev, page: 1, from, to }));

			const dateTags = [
				{
					key: `from-${from}`,
					label: 'Start',
					value: format(new Date(from), 'd MMM, yyyy'),
					originalKey: 'from',
					originalValue: from,
				},
				{
					key: `to-${to}`,
					label: 'End',
					value: format(new Date(to), 'd MMM, yyyy'),
					originalKey: 'to',
					originalValue: to,
				},
			];

			setSearchTags((prev) => {
				// Remove existing date tags
				const filteredTags = prev.filter(
					(t) => t.originalKey !== 'from' && t.originalKey !== 'to',
				);
				return [...filteredTags, ...dateTags];
			});

			setSearchClear(true);
		},
		[dateTimeOnClose],
	);

	const handlePageChange = useCallback((page) => {
		setRefetchLoading(true);
		setQueryParams((prev) => ({ ...prev, page: Number(page) }));
	}, []);

	const handlePageSize = useCallback((limit) => {
		setRefetchLoading(true);
		setQueryParams((prev) => ({
			...prev,
			page: 1,
			limit: Number(limit),
		}));
	}, []);

	const handleClear = useCallback(() => {
		setQueryParams({ page: 1, limit: LIMIT });
		setSearchTags([]);
		setFilters([]);
		setSearchClear(false);
		setRefetchLoading(true);
	}, []);

	const handleViewChange = useCallback((newView) => {
		setView(newView);
	}, []);

	const handleRefresh = useCallback(() => {
		setRefetchLoading(true);
		refetch();
	}, [refetch]);

	return (
		// <Box p={6} bg='white' borderRadius='md' boxShadow='sm'>
		// 	<Flex
		// 		justify='space-between'
		// 		align='center'
		// 		mb={4}
		// 		flexDir={{ base: 'column', sm: 'column', md: 'row' }}
		// 		gap={2}
		// 	>
		// 		<HStack gap='1' fontWeight='bold'>
		// 			<Text fontSize='20px' fontWeight={'bold'}>
		// 				Shared Deals
		// 			</Text>
		// 			<CountUpComponent
		// 				key={data?.meta?.total}
		// 				targetNumber={data?.meta?.total}
		// 			/>
		// 		</HStack>

		// 		<HStack
		// 			gap='2'
		// 			display={'flex'}
		// 			flexDir={{ base: 'column', sm: 'column', md: 'row' }}
		// 			align='center'
		// 		>
		// 			<Button
		// 				onClick={() => setIsFilterOpen(true)}
		// 				colorScheme='brand'
		// 				borderRadius={'md'}
		// 				size='sm'
		// 			>
		// 				Advanced Search
		// 			</Button>
		// 			<DateFilterButton onClick={dateTimeOnOpen} />
		//
		// 			<ViewToggle
		// 				moduleView='dealsView'
		// 				view={view}
		// 				handleView={handleViewChange}
		// 			/>
		// 		</HStack>
		// 	</Flex>

		// 	{/* Search tags - Using enhanced SearchTags component */}
		// 	{searchTags && searchTags.length > 0 && (
		// 		<SearchTags
		// 			searchTags={searchTags}
		// 			removeTag={removeTag}
		// 			clearAllTags={clearAllTags}
		// 		/>
		// 	)}

		// 	{/* Top Pagination */}
		// 	{!isLoading && (
		// 		<TopPagination
		// 			currentPage={queryParams.page}
		// 			totalPages={data?.meta?.totalPages}
		// 			onPageChange={handlePageChange}
		// 			totalItems={data?.meta?.total}
		// 			itemsPerPage={queryParams.limit}
		// 			refetching={isFetching}
		// 			loading={isLoading}
		// 			handlePageSize={handlePageSize}
		// 		/>
		// 	)}

		// 	{/* Data View */}
		// 	{dealsError ? (
		// 		<ErrorMessage
		// 			message={dealsError?.data?.message || 'Something went wrong!'}
		// 		/>
		// 	) : (
		// 		<DataView
		// 			deals={deals}
		// 			view={view}
		// 			setDeals={setDeals}
		// 			isLoading={isLoading}
		// 			isRefetching={refetchLoading}
		// 			refetch={refetch}
		// 		/>
		// 	)}

		// 	{/* Modals */}
		// 	{isFilterOpen && (
		// 		<DealFilterModal
		// 			isOpen={isFilterOpen}
		// 			onClose={() => setIsFilterOpen(false)}
		// 			onFilterApply={handleDealFilters}
		// 			initialFilters={filters}
		// 			tree={tree}
		// 		/>
		// 	)}

		// 	{dateTimeIsOpen && (
		// 		<DateRangeFilter
		// 			isOpen={dateTimeIsOpen}
		// 			onClose={dateTimeOnClose}
		// 			handleDateFilter={handleDateFilter}
		// 		/>
		// 	)}
		// </Box>
		<Box
			bg='bg.surface'
			borderRadius='xl'
			borderWidth='1px'
			borderColor='border.default'
			boxShadow='card'
			p={{ base: 4, md: 6 }}
		>
			<Flex
				justify='space-between'
				align='center'
				mb={4}
				flexDir={{ base: 'column', sm: 'row' }}
				gap={4}
			>
				<HStack gap='2' fontWeight='bold'>
					<Text
						fontSize={{ base: 'lg', md: 'xl' }}
						fontWeight='bold'
						color='text.heading'
					>
						Shared Deals
					</Text>
					<CountUpComponent
						key={data?.meta?.total}
						targetNumber={data?.meta?.total}
					/>
				</HStack>

				<HStack
					gap='2'
					flexWrap='wrap'
					justify={{ base: 'flex-start', sm: 'flex-end' }}
				>
					<Button
						onClick={() => setIsFilterOpen(true)}
						variant='outline'
						size='sm'
						borderRadius='lg'
						borderColor='border.default'
						_hover={{
							bg: 'bg.elevated',
							borderColor: 'gold.primary',
							color: 'gold.primary',
						}}
					>
						Advanced Search
					</Button>

					<DateFilterButton onClick={dateTimeOnOpen} />

	<RefreshButton
														label="Refresh Shared Deals"
														onClick={() => handleRefresh()}
														isLoading={isLoading}
														isFetching={isFetching}
														size="sm"
													/>

					<ViewToggle
						moduleView='dealsView'
						view={view}
						handleView={handleViewChange}
					/>
				</HStack>
			</Flex>

			{/* Search tags */}
			{searchTags && searchTags.length > 0 && (
				<SearchTags
					searchTags={searchTags}
					removeTag={removeTag}
					clearAllTags={clearAllTags}
				/>
			)}

			{/* Top Pagination */}
			{!isLoading && (
				<TopPagination
					currentPage={queryParams.page}
					totalPages={data?.meta?.totalPages}
					onPageChange={handlePageChange}
					totalItems={data?.meta?.total}
					itemsPerPage={queryParams.limit}
					refetching={isFetching}
					loading={isLoading}
					handlePageSize={handlePageSize}
				/>
			)}

			{/* Data View */}
			{dealsError ? (
				<ErrorMessage
					message={dealsError?.data?.message || 'Something went wrong!'}
				/>
			) : (
				<DataView
					deals={deals}
					view={view}
					setDeals={setDeals}
					isLoading={isLoading}
					isRefetching={refetchLoading}
					refetch={refetch}
				/>
			)}

			{/* Modals */}
			{isFilterOpen && (
				<DealFilterModal
					isOpen={isFilterOpen}
					onClose={() => setIsFilterOpen(false)}
					onFilterApply={handleDealFilters}
					initialFilters={filters}
					tree={tree}
				/>
			)}

			{dateTimeIsOpen && (
				<DateRangeFilter
					isOpen={dateTimeIsOpen}
					onClose={dateTimeOnClose}
					handleDateFilter={handleDateFilter}
				/>
			)}
		</Box>
	);
};

export default SharedDealsScreen;
