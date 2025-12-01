import {
	Box,
	Button,
	Flex,
	HStack,
	IconButton,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { FiFilter } from 'react-icons/fi';

import TopPagination from 'components/pagination/TopPagination';
import DateFilter from 'views/admin/attendance/components/DateFilter';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import AgencyFilterModal from '../components/AgencyFilterModal';
import UserEvaluationTable from './UserEvalutionTable';
import { useUserEvalution } from '../hooks/useUserEvaluation';
import ViewEvaluation from './components/ViewEvaluation';
import AdvancedSearchModal from './components/AdvancedSearchModal';
import ActiveFiltersDisplay from 'views/admin/payroll/components/ActiveFiltersDisplay';
import useUserSession from 'hooks/useUserSession';
import SearchBox from 'views/admin/payroll/components/SearchBox';
import { BsArrowRepeat } from 'react-icons/bs';
import { MdRefresh } from 'react-icons/md';
import CustomTooltip from 'components/shared/CustomTooltip';
import RefreshButton from 'components/refresh/RefreshButton';

const UserEvaluation = () => {
	const {
		month,
		year,
		refetchEvaluations,
		isAgenciesAllowed,
		agencies,
		queryParams,
		data,
		totalPages,
		totalRecords,
		agencyId,
		setAgencyId,
		isLoading,
		isFetching,
		handlePageChange,
		handlePageSize,
		onDateFilterChange,
		filters,
		setFilters,
	} = useUserEvalution();

	const { userRoleName } = useUserSession();

	const selectedAgency = useMemo(
		() => agencies.find((a) => a._id === agencyId) || null,
		[agencies, agencyId]
	);

	const [clearFilters, setClearFilters] = useState(false);
	const [viewEvaluation, setViewEvaluation] = useState({
		modal: false,
		data: null,
	});

	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	const {
		isOpen: agencyFilterIsOpen,
		onOpen: agencyFilterOnOpen,
		onClose: agencyFilterOnClose,
	} = useDisclosure();

	const handleAgencyFilter = (value) => {
		setAgencyId(value);

		// if (value) {
		// 	setClearFilters(true);
		// } else setClearFilters(false);
	};

	const handleApplyFilters = (newFilters) => {
		const cleanedFilters = Object.fromEntries(
			Object.entries(newFilters).filter(
				([_, value]) => value !== '' && value !== undefined && value !== null
			)
		);

		setFilters(cleanedFilters);
	};

	const handleClearFilters = (filterKey) => {
		if (filterKey) {
			const newFilters = { ...filters };
			delete newFilters[filterKey];
			setFilters(newFilters);
		} else {
			setFilters({});
		}
		setClearFilters(false);
	};

	const handleSearchTermChange = (searchQuery) => {
		const trimmed = searchQuery?.trim() || '';

		if (trimmed !== '') {
			setFilters((prev) => ({
				...prev,
				search: trimmed,
			}));
			setClearFilters(true);
		} else {
			// remove search key from filters
			setFilters((prev) => {
				const updated = { ...prev };
				delete updated.search;
				return updated;
			});
			setClearFilters(false);
		}
	};

	return (
		<Box p={6} bg='white' minH='80vh' borderRadius='md' boxShadow='sm'>
			<Flex
				flexDir={{ base: 'column', md: 'row' }}
				justify='space-between'
				align='center'
				mb={4}
			>
				<Flex alignSelf='flex-start' fontSize='lg' fontWeight='bold' gap='2'>
					<Text>{selectedAgency?.name} User Evaluations</Text>

					<CountUpComponent key={totalRecords} targetNumber={totalRecords} />
				</Flex>

				<HStack gap='2' alignItems='center'>
					<RefreshButton
						aria-label='Refresh evaluations'
						isLoading={isLoading}
						isFetching={isFetching}
						onClick={refetchEvaluations}
					/>

					<Box w={{ base: '100%', sm: 'auto' }} flexShrink={1}>
						<SearchBox
							onSearchTermChange={handleSearchTermChange}
							setSearchTerm={setSearchTerm}
							searchTerm={searchTerm}
						/>
					</Box>

					{isAgenciesAllowed && (
						<IconButton
							icon={<FiFilter />}
							onClick={agencyFilterOnOpen}
							aria-label='Filter agency'
							colorScheme='brand'
							variant='solid'
							size='sm'
							borderRadius='full'
							boxShadow='md'
						/>
					)}

					<DateFilter onFilterChange={onDateFilterChange} />

					{!['Team Leader', 'Agent'].includes(userRoleName) && (
						<Button
							colorScheme='brand'
							size='sm'
							borderRadius={'md'}
							py={4}
							px={6}
							onClick={() => setIsFilterOpen(true)}
						>
							Advanced Search
						</Button>
					)}

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

			<ActiveFiltersDisplay
				filters={filters}
				onClearFilters={handleClearFilters}
			/>

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

			<UserEvaluationTable
				data={data || []}
				isLoading={isLoading || isFetching}
				setView={setViewEvaluation}
			/>

			{viewEvaluation?.modal && (
				<ViewEvaluation
					isOpen={viewEvaluation?.modal}
					onClose={() => setViewEvaluation({ modal: false, data: null })}
					data={viewEvaluation?.data}
					selectedMonth={month}
					selectedYear={year}
				/>
			)}

			{agencyFilterIsOpen && (
				<AgencyFilterModal
					isOpen={agencyFilterIsOpen}
					onClose={agencyFilterOnClose}
					handleFilter={handleAgencyFilter}
				/>
			)}

			{isFilterOpen && (
				<AdvancedSearchModal
					isOpen={isFilterOpen}
					onClose={() => setIsFilterOpen(false)}
					onApplyFilters={handleApplyFilters}
					initialFilters={filters}
				/>
			)}
		</Box>
	);
};

export default UserEvaluation;
