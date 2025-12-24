import {
	Badge,
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	Icon,
	IconButton,
	Text,
} from '@chakra-ui/react';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';
import { BiX } from 'react-icons/bi';
import { useCallback, useEffect, useMemo, useState } from 'react';

import TopPagination from 'components/pagination/TopPagination';
import { buttonStyle } from 'utils/btn';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import RefreshButton from 'components/refresh/RefreshButton';

import SearchBox from 'views/admin/payroll/components/SearchBox';
import { useClientListing } from './useClientListing';
import { motion } from 'framer-motion';
import { FaBuilding } from 'react-icons/fa';
import PropertyListingsGrid from './_component/PropertyListingsGrid';
import FilterDrawer from './_component/FiltersDrawer';
import ActiveFilters from './_component/ActiveFilters';

const MotionContainer = motion(Box);

const Payroll = () => {
	const {
		queryParams,
		refreshData,
		data,
		listingTypes,
		unitTypes,
		totalPages,
		totalRecords,
		error,
		isError,
		isLoading,
		isFetching,
		handlePageChange,
		handlePageSize,
		onDateFilterChange,
		filters,
		setPagination,
		setFilters,
		refetch,
	} = useClientListing();

	const [searchTerm, setSearchTerm] = useState('');
	const [activeFilters, setActiveFilters] = useState({});

	useEffect(() => {
		if (filters?.length > 0) {
			setActiveFilters(filters);
		}
	}, []);

	const handleSearchTermChange = (searchQuery) => {
		const trimmed = searchQuery?.trim() || '';

		if (trimmed !== '') {
			setFilters((prev) => ({
				...prev,
				search: trimmed,
			}));
			setPagination((prev) => ({ ...prev, page: 1 }));
		} else {
			// remove search key from filters
			setFilters((prev) => {
				const updated = { ...prev };
				delete updated.search;
				return updated;
			});
			setPagination((prev) => ({ ...prev, page: 1 }));
		}
	};

	const handleApplyFilters = useCallback((newFilters) => {
		setFilters(newFilters);
		setSearchTerm('');
		setPagination((prev) => ({ ...prev, page: 1 }));
	}, []);

	const handleReset = () => {
		setFilters({});
		setActiveFilters({});
		setPagination((prev) => ({ ...prev, page: 1 }));
		setSearchTerm('');
	};

	return (
		<Box p={6} bg='white' borderRadius='md' boxShadow='sm'>
			<Flex
				direction={{ base: 'column', md: 'row' }}
				justify='space-between'
				align={{ base: 'stretch', md: 'center' }}
				gap={{ base: 4, md: 2 }}
				mb={4}
			>
				{/* LEFT: Title + Count */}
				<Flex
					align='center'
					gap={3}
					justify={{ base: 'left', md: 'flex-start' }}
				>
					<Text
						fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
						fontWeight='bold'
						display='flex'
						alignItems='center'
						gap={3}
					>
						<Icon as={FaBuilding} color='cyan.600' boxSize={5} />
						Client Listings
					</Text>

					<Badge
						bg='cyan.100'
						color='cyan.800'
						rounded='full'
						fontSize='sm'
						fontWeight='bold'
						px={3}
						py={1}
					>
						<CountUpComponent key={totalRecords} targetNumber={totalRecords} />
					</Badge>
				</Flex>

				{/* RIGHT: Search + Actions */}
				<Flex
					direction={{ base: 'column', sm: 'column', md: 'row' }}
					align='center'
					gap={2}
					w={{ base: '100%', md: 'auto' }}
				>
					{/* Search – full width on small screens */}
					<Box w={{ base: '100%', md: 'auto' }}>
						<SearchBox
							onSearchTermChange={handleSearchTermChange}
							setSearchTerm={setSearchTerm}
							searchTerm={searchTerm}
						/>
					</Box>

					{/* Actions */}
					<HStack spacing={2} justify='flex-end'>
						<FilterDrawer
							filters={filters}
							onFilterChange={handleApplyFilters}
							onReset={handleReset}
							listingTypes={listingTypes}
							unitTypes={unitTypes}
							setActiveFilters={setActiveFilters}
						/>

						<RefreshButton
							aria-label='Refresh payroll'
							isLoading={isLoading}
							isFetching={isFetching}
							onClick={refreshData}
						/>
					</HStack>
				</Flex>
			</Flex>

			{!isLoading && (
				<TopPagination
					currentPage={queryParams.page}
					totalPages={totalPages}
					onPageChange={handlePageChange}
					totalItems={totalRecords}
					itemsPerPage={queryParams.limit}
					refetching={isFetching}
					loading={isLoading}
					handlePageSize={handlePageSize}
				/>
			)}

			<ActiveFilters activeFilters={activeFilters} handleReset={handleReset} />

			{/* Main Content */}
			<MotionContainer
				maxW='full'
				p={2}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				<PropertyListingsGrid
					data={data}
					isLoading={isLoading}
					isFetching={isFetching}
					isError={isError}
					error={error}
					refetch={refetch}
					queryParams={queryParams}
					onPageChange={handlePageChange}
					// onSortChange={handleSortChange}
				/>
			</MotionContainer>
		</Box>
	);
};

export default Payroll;
