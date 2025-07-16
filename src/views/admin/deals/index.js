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

const LIMIT = 10;

const DealsScreen = () => {
	const [deals, setDeals] = useState([]);
	const [page, setPage] = useState(1);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [searchClear, setSearchClear] = useState(false);
	const [searchTags, setSearchTags] = useState([]);
	const [filters, setFilters] = useState([]);

	const [isRefetching, setIsRefetching] = useState(false);

	const tree = useSelector((state) => state.user.tree);

	const [queryParams, setQueryParams] = useState({ page: 1, limit: LIMIT });

	const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
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
	}, [isFetching, isLoading, page]);

	// Sync page change into queryParams
	useEffect(() => {
		setQueryParams((prev) => ({ ...prev, page }));
	}, [page]);

	// Refetch on queryParams change
	useEffect(() => {
		refetch({ path: '/deals', params: queryParams });
		// setIsRefetching(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryParams]);

	// Update deals when data is fetched
	useEffect(() => {
		if (data?.doc) {
			setDeals(data.doc);
		}
	}, [data?.doc]);

	const totalPages = data?.meta?.totalPages || 1;

	// Clean filters: remove keys with undefined, null, empty string
	const cleanObject = (obj) =>
		Object.fromEntries(
			Object.entries(obj).filter(
				([_, v]) => v !== undefined && v !== null && v !== ''
			)
		);

	const handleDealFilters = (filters) => {
		const cleaned = cleanObject(filters);

		let tags = [];

		Object.entries(cleaned).forEach(([key, value]) => {
			let displayValue = value;
			let displayKey = key;

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
				displayKey = 'SPA';
			}

			if (key === 'invoiceSent') {
				displayValue = value ? 'Yes' : 'No';
				displayKey = 'Invoice Sent';
			}

			if (key === 'commissionStatus') displayKey = 'Commission Status';

			// Default
			tags.push(`${displayKey}: ${displayValue}`);
		});

		// setIsRefetching(true);
		setSearchTags(tags);
		setSearchClear(true);
		setQueryParams((prev) => ({ ...prev, ...cleaned, page: 1 }));
		setPage(1);
		setFilters(cleaned);
	};

	const handleNext = () => {
		if (page < totalPages) setPage((prev) => prev + 1);
	};

	const handlePrev = () => {
		if (page > 1) setPage((prev) => prev - 1);
	};

	const handleClear = () => {
		setPage(1);
		setQueryParams({ page: 1, limit: LIMIT });
		setSearchTags([]);
		setFilters([]);
		setSearchClear(false);
	};

	return (
		<Box p={6} bg='white' borderRadius='md' boxShadow='sm'>
			<Flex justify='space-between' align='center' mb={4}>
				<HStack gap='1' fontWeight='bold'>
					<Text fontSize='lg'>Close Deals</Text>
					<CountUpComponent
						key={data?.meta?.results}
						targetNumber={data?.meta?.results}
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
							bg='red.400'
							w='fit-content'
							color='white'
							sx={{
								svg: {
									fill: 'white',
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

			{/* <DealCards
				deals={deals}
				isLoading={isLoading}
				isFetching={isFetching}
				handleNext={handleNext}
				handlePrev={handlePrev}
				refetch={refetch}
			/> */}

			<DataView
				deals={deals}
				isLoading={isLoading}
				isRefetching={isRefetching}
				handleNext={handleNext}
				handlePrev={handlePrev}
				refetch={refetch}
			/>

			{isFilterOpen && (
				<DealFilterModal
					isOpen={isFilterOpen}
					onClose={() => setIsFilterOpen(false)}
					onFilterApply={handleDealFilters}
					initialFilters={filters}
					tree={tree}
				/>
			)}

			<Flex
				justify='center'
				align='center'
				mt={6}
				maxWidth={{ base: 'full', md: '50%', lg: '25%', xl: '20%' }}
				mx='auto'
			>
				<Button
					{...buttonStyle}
					bg='softGray.100'
					color='gray.800'
					_active={{ bg: 'gray.200' }}
					onClick={handlePrev}
					px={{ base: 2, md: 4, lg: 6 }}
					isDisabled={page === 1 || isFetching}
				>
					Previous
				</Button>
				<Text
					px={{ base: 2, md: 4, lg: 6 }}
					align='center'
					fontSize='sm'
					flex={1}
				>
					Page {page} of {totalPages}
				</Text>
				<Button
					{...buttonStyle}
					bg='softGray.100'
					color='gray.800'
					_active={{ bg: 'gray.200' }}
					shadow='sm'
					px={{ base: 2, md: 4, lg: 6 }}
					onClick={handleNext}
					isDisabled={page === totalPages || isFetching}
				>
					Next
				</Button>
			</Flex>
		</Box>
	);
};

export default DealsScreen;
