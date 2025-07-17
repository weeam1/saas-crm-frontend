import { useEffect, useState } from 'react';
import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';

import { buttonStyle } from 'utils/btn';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import DataView from './DataView';
import DealFilterModal from './components/DealFilterModal';
import SearchTags from 'components/search/SearchTags';
import { BiX } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import TopPagination from 'components/pagination/TopPagination';
import ErrorMessage from 'components/Message/ErrorMessage';
import { dealsLabels } from 'utils/searchLabels';

const LIMIT = 10;

const DealsScreen = () => {
	const [deals, setDeals] = useState([]);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [searchClear, setSearchClear] = useState(false);
	const [searchTags, setSearchTags] = useState([]);
	const [filters, setFilters] = useState([]);

	const [isRefetching, setIsRefetching] = useState(false);

	const tree = useSelector((state) => state.user.tree);

	const [queryParams, setQueryParams] = useState({ page: 1, limit: LIMIT });

	const {
		data,
		isLoading,
		isFetching,
		refetch,
		error: dealsError,
	} = useFetchItemsQuery(
		{ path: 'deals', params: queryParams },
		{ refetchOnMountOrArgChange: true }
	);

	useEffect(() => {
		let showTimer;

		const isBackgroundRefetch = isFetching && !isLoading;

		if (isBackgroundRefetch) {
			// Delay showing the refetching state
			setIsRefetching(true);

			showTimer = setTimeout(() => {
				setIsRefetching(false);
			}, 2000);
		} else {
			setIsRefetching(false);
		}

		return () => {
			clearTimeout(showTimer);
		};
	}, [isFetching, isLoading]);

	// Refetch on queryParams change
	useEffect(() => {
		refetch({ path: '/deals', params: queryParams });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryParams]);

	// Update deals when data is fetched
	useEffect(() => {
		if (data?.doc) {
			setDeals(data.doc);
		}
	}, [data?.doc]);

	// Clean filters: remove keys with undefined, null, empty string
	const cleanObject = (obj) =>
		Object.fromEntries(
			Object.entries(obj).filter(
				([_, v]) => v !== undefined && v !== null && v !== ''
			)
		);

	const handleDealFilters = (filters) => {
		const cleaned = cleanObject(filters);

		console.log({ cleaned });

		let tags = [];

		Object.entries(cleaned).forEach(([key, value]) => {
			let displayValue = value;

			// Handle manager
			if (key === 'manager') {
				const manager = tree.managers.find(
					(user) => user?._id?.toString() === value
				);
				displayValue = manager
					? `${manager.firstName} ${manager.lastName}`
					: value === '-1'
						? 'No Manager'
						: value;
			}

			// Handle agent
			if (key === 'agent') {
				const agentsArray = Object.values(tree.agents).flatMap(
					(agentList) => agentList
				);
				const agent = agentsArray.find(
					(user) => user?._id?.toString() === value
				);
				displayValue = agent
					? `${agent.firstName} ${agent.lastName}`
					: value === '-1'
						? 'No Agent'
						: value;
			}

			if (key === 'spaDone') {
				displayValue = value ? 'Signed' : 'Pending';
			}

			if (key === 'invoiceSent') {
				displayValue = value ? 'Yes' : 'No';
			}

			if (key === 'closedBy') {
				const closedByValue = filters.closedBy;

				if (typeof closedByValue === 'object' && closedByValue !== null) {
					displayValue = closedByValue.fullName;
				}
			}

			tags.push(`${dealsLabels[key]}: ${displayValue}`);
		});

		setFilters(cleaned);

		// Extract `closedBy._id`
		if (cleaned.closedBy && typeof cleaned.closedBy === 'object') {
			cleaned.closedBy = cleaned.closedBy._id;
		}

		setSearchTags(tags);
		setSearchClear(true);
		setQueryParams((prev) => ({ ...prev, ...cleaned, page: 1 }));
	};

	const handlePageChange = (page) => {
		setQueryParams((prev) => ({ ...prev, page: Number(page) }));
	};

	const handlePageSize = (limit) => {
		setQueryParams({ page: 1, limit: Number(limit) });
	};

	const handleClear = () => {
		setQueryParams({ page: 1, limit: LIMIT });
		setSearchTags([]);
		setFilters([]);
		setSearchClear(false);
	};

	console.log({ filters });

	return (
		<Box p={6} bg='white' borderRadius='md' boxShadow='sm'>
			<Flex justify='space-between' align='center' mb={4}>
				<HStack gap='1' fontWeight='bold'>
					<Text fontSize='lg'>Close Deals</Text>
					<CountUpComponent
						key={data?.meta?.total}
						targetNumber={data?.meta?.total}
					/>
				</HStack>

				<Button
					onClick={() => setIsFilterOpen(true)}
					colorScheme='brand'
					variant='solid'
					size='sm'
				>
					Advanced Search
				</Button>
			</Flex>
			{/* Search tags */}
			{searchClear && searchTags && (
				<Flex
					flexDirection={{ base: 'row', lg: 'row' }}
					justifyContent='space-between'
					alignItems='center'
					flexWrap='wrap'
					py='2'
				>
					<SearchTags searchTags={searchTags} />

					{searchClear && (
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
							leftIcon={<BiX />}
							aria-label='Clear'
							onClick={handleClear}
						>
							Clear
						</Button>
					)}
				</Flex>
			)}
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
			{/* <DealCards
				deals={deals}
				isLoading={isLoading}
				isFetching={isFetching}
				handleNext={handleNext}
				handlePrev={handlePrev}
				refetch={refetch}
			/> */}
			{dealsError ? (
				<ErrorMessage
					message={dealsError?.data?.message || 'Something went wrong!'}
				/>
			) : (
				<DataView
					deals={deals}
					setDeals={setDeals}
					isLoading={isLoading}
					isRefetching={isRefetching}
					refetch={refetch}
				/>
			)}
			{isFilterOpen && (
				<DealFilterModal
					isOpen={isFilterOpen}
					onClose={() => setIsFilterOpen(false)}
					onFilterApply={handleDealFilters}
					initialFilters={filters}
					tree={tree}
				/>
			)}
		</Box>
	);
};

export default DealsScreen;
