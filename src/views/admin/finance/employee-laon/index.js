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
import { FaPlus } from 'react-icons/fa';
import TopPagination from 'components/pagination/TopPagination';
import LoanSummaryTable from './LoanSummarryTable';

import AgencyFilterModal from '../components/AgencyFilterModal';
import { buttonStyle } from 'utils/btn';
import { BiX } from 'react-icons/bi';
// import SummaryCards from '../components/SummaryCards';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { useEmployeeLoanSummary } from '../hooks/useEmployeeLoan';
import UpsertLoan from './UpsertLoan';
import CustomTooltip from 'components/shared/CustomTooltip';
import RefreshButton from 'components/refresh/RefreshButton';
import FilterButton from 'components/base/FilterButton';

const EmployeeLoan = () => {
	const {
		refetchSummary,
		month,
		year,
		isAgenciesAllowed,
		agencies,
		queryParams,
		data,
		totalPages,
		totalRecords,
		refetch,
		agencyId,
		setAgencyId,
		isLoading,
		isFetching,
		handlePageChange,
		handlePageSize,
		onDateFilterChange,
		setPagination,
		updateData,
		removeItem,
	} = useEmployeeLoanSummary();

	const selectedAgency = useMemo(
		() => agencies.find((a) => a._id === agencyId) || null,
		[agencies, agencyId],
	);

	const [clearFilters, setClearFilters] = useState(false);
	const [viewBalance, setViewBalance] = useState({ modal: false, data: null });

	const {
		isOpen: agencyFilterIsOpen,
		onOpen: agencyFilterOnOpen,
		onClose: agencyFilterOnClose,
	} = useDisclosure();

	const {
		isOpen: expenseIsOpen,
		onClose: expenseOnClose,
		onOpen: expenseOpen,
	} = useDisclosure();

	const [editData, setEditData] = useState(null);

	const handleOpenAdd = () => {
		setEditData(null);
		expenseOpen();
	};

	const handleOpenEdit = (expense) => {
		setEditData(expense);
		expenseOpen();
	};

	const handleAgencyFilter = (value) => {
		setAgencyId(value);

		if (value) {
			setClearFilters(true);
			setPagination((prev) => ({ ...prev, page: 1 }));
		} else setClearFilters(false);
	};

	const handleClear = () => {
		setClearFilters(false);
		setAgencyId(null);
		setPagination((prev) => ({ ...prev, page: 1 }));
	};

	return (
		<Box p={6} bg='bg.surface' minH='80vh' borderRadius='lg' boxShadow='card'>
			<Flex
				flexDir={{ base: 'column', md: 'row' }}
				justify='space-between'
				align='center'
				mb={4}
			>
				<Flex alignSelf='flex-start' fontSize='lg' fontWeight='bold' gap='2'>
					<Text color='white'>
						{selectedAgency?.name} Employee Loan Records
					</Text>

					<CountUpComponent key={totalRecords} targetNumber={totalRecords} />
				</Flex>

				<HStack gap='2' alignItems='center'>
					<Button
						alignSelf='flex-end'
						leftIcon={<FaPlus size='1em' />}
						colorScheme='brand'
						size='sm'
						rounded='md'
						px={4}
						shadow='md'
						onClick={handleOpenAdd}
					>
						Add Loan
					</Button>

					{isAgenciesAllowed && (
						<FilterButton
	label="Filter agency"
	onClick={agencyFilterOnOpen}
	size="sm"
/>
					)}
					<RefreshButton
						label="Refresh"
						onClick={() => refetch()}
						isLoading={isLoading}
						isFetching={isFetching}
						size="sm"
					/>

					{/* <DateFilter onFilterChange={onDateFilterChange} /> */}

					{clearFilters && (
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
					)}
				</HStack>
			</Flex>

			{/* <SummaryCards data={summary || {}} isLoading={} /> */}

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

			<LoanSummaryTable
				data={data || []}
				updateData={updateData}
				removeItem={removeItem}
				handleOpenEdit={handleOpenEdit}
				isLoading={isLoading || isFetching}
				setView={setViewBalance}
			/>

			{/* {viewBalance?.modal && (
				<ViewLoanDetails
					data={viewBalance.data}
					isOpen={viewBalance.modal}
					onClose={() => setViewBalance({ modal: false, data: null })}
				/>
			)} */}

			{expenseIsOpen && (
				<UpsertLoan
					isOpen={expenseIsOpen}
					onClose={expenseOnClose}
					initialData={editData}
					refetchSummary={refetchSummary}
					isEmployeeLoans={true}
					selectedMonth={month}
					selectedYear={year}
					isAgenciesAllowed={isAgenciesAllowed}
				/>
			)}

			{agencyFilterIsOpen && (
				<AgencyFilterModal
					isOpen={agencyFilterIsOpen}
					onClose={agencyFilterOnClose}
					handleFilter={handleAgencyFilter}
				/>
			)}
		</Box>
	);
};

export default EmployeeLoan;
