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
import { useMemo, useState } from 'react';

import TopPagination from 'components/pagination/TopPagination';
import { buttonStyle } from 'utils/btn';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import RefreshButton from 'components/refresh/RefreshButton';

import SearchBox from 'views/admin/payroll/components/SearchBox';
import { useClientListing } from './useClientListing';
import { motion } from 'framer-motion';
import { FaBuilding } from 'react-icons/fa';
import PropertyListingsGrid from './_component/PropertyListingsGrid';

const MotionContainer = motion(Box);

const Payroll = () => {
	const {
		queryParams,
		data,
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

	const [clearFilters, setClearFilters] = useState(false);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filterChanged, setFilterChanged] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	const handleClear = () => {
		setClearFilters(false);
		setPagination((prev) => ({ ...prev, page: 1 }));
	};

	const handleSearchTermChange = (searchQuery) => {
		const trimmed = searchQuery?.trim() || '';

		if (trimmed !== '') {
			setFilters((prev) => ({
				...prev,
				search: trimmed,
			}));
			setClearFilters(true);
			setPagination((prev) => ({ ...prev, page: 1 }));
		} else {
			// remove search key from filters
			setFilters((prev) => {
				const updated = { ...prev };
				delete updated.search;
				return updated;
			});
			setPagination((prev) => ({ ...prev, page: 1 }));
			setClearFilters(false);
		}
	};

	const handleApplyFilters = (newFilters) => {
		const cleanedFilters = Object.fromEntries(
			Object.entries(newFilters).filter(
				([_, value]) => value !== '' && value !== undefined && value !== null
			)
		);

		setFilters(cleanedFilters);
		setFilterChanged(true);
		setSearchTerm('');
		setPagination((prev) => ({ ...prev, page: 1 }));
	};

	const handleClearFilters = (filterKey) => {
		if (filterKey) {
			const newFilters = { ...filters };
			delete newFilters[filterKey];
			setFilters(newFilters);
			setPagination((prev) => ({ ...prev, page: 1 }));
		} else {
			setFilters({});
			setPagination((prev) => ({ ...prev, page: 1 }));
		}
		setFilterChanged(true);
		setSearchTerm('');
	};

	return (
		<Box p={6} bg='white' borderRadius='md' boxShadow='sm'>
			<Flex
				flexDir={{ base: 'column', md: 'row' }}
				justify='space-between'
				align={{ base: 'stretch', md: 'center' }}
				gap={{ base: 3, md: 0 }}
				mb={4}
				w='100%'
			>
				<Flex
					// alignSelf={{ base: 'center', md: 'flex-start' }}
					fontSize={{ base: 'md', md: 'lg' }}
					fontWeight='bold'
					gap='2'
					textAlign={{ base: 'center', md: 'left' }}
					align='center'
					order={{ base: 1, md: 1 }}
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
						borderRadius='md'
						rounded='full'
						fontSize='sm'
						fontWeight='bold'
						shadow='sm'
					>
						<CountUpComponent key={totalRecords} targetNumber={totalRecords} />
					</Badge>
				</Flex>

				<HStack
					gap={{ base: 1, sm: 2 }}
					alignItems='center'
					flexWrap='wrap'
					justify={{ base: 'center', md: 'flex-end' }}
					w={{ base: '100%', md: 'auto' }}
					order={{ base: 2, md: 2 }}
				>
					<RefreshButton
						aria-label='Refresh payroll'
						isLoading={isLoading}
						isFetching={isFetching}
						onClick={refetch}
					/>
					<Box w={{ base: '100%', sm: 'auto' }} flexShrink={1}>
						<SearchBox
							onSearchTermChange={handleSearchTermChange}
							setSearchTerm={setSearchTerm}
							searchTerm={searchTerm}
						/>
					</Box>
					<Button
						colorScheme='brand'
						size='sm'
						borderRadius={'md'}
						py={3}
						px={6}
						onClick={() => setIsFilterOpen(true)}
					>
						Advanced Search
					</Button>
					{/* {clearFilters && (
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
              _active={{ bg: 'gray.200' }}
              leftIcon={<BiX />}
              aria-label='Clear'
              onClick={handleClear}
            >
              Clear
            </Button>
          )} */}
				</HStack>
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
