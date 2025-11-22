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
import TopPagination from 'components/pagination/TopPagination';
import DateFilter from 'views/admin/attendance/components/DateFilter';
import { FiFilter } from 'react-icons/fi';
import { buttonStyle } from 'utils/btn';
import { BiX } from 'react-icons/bi';
import { useEmployeePayroll } from './hooks/usePayroll';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import AgencyFilterModal from '../finance/components/AgencyFilterModal';
import EmployeePayrollTable from './components/EmployeePayrollTable';

const Payroll = () => {
	const {
		month,
		year,
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
	} = useEmployeePayroll();

	const selectedAgency = useMemo(
		() => agencies.find((a) => a._id === agencyId) || null,
		[agencies, agencyId]
	);

	const [clearFilters, setClearFilters] = useState(false);

	const {
		isOpen: agencyFilterIsOpen,
		onOpen: agencyFilterOnOpen,
		onClose: agencyFilterOnClose,
	} = useDisclosure();

	const handleAgencyFilter = (value) => {
		setAgencyId(value);

		if (value) {
			setClearFilters(true);
		} else setClearFilters(false);
	};

	const handleClear = () => {
		setClearFilters(false);
		setAgencyId(null);
	};

	return (
		<Box p={6} bg='white' borderRadius='md' boxShadow='sm'>
			<Flex
				flexDir={{ base: 'column', md: 'row' }}
				justify='space-between'
				align='center'
				mb={4}
			>
				<Flex alignSelf='flex-start' fontSize='lg' fontWeight='bold' gap='2'>
					<Text>{selectedAgency?.name || 'All '} Employee Payroll</Text>

					<CountUpComponent key={totalRecords} targetNumber={totalRecords} />
				</Flex>

				<HStack gap='2' alignItems='center'>
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

			{/* <SummaryCards data={summary || {}} isLoading={summaryLoading} /> */}

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
					pageLimit={false}
				/>
			)}

			<EmployeePayrollTable
				data={data || []}
				isLoading={isLoading || isFetching}
			/>

			{agencyFilterIsOpen && (
				<AgencyFilterModal
					isOpen={agencyFilterIsOpen}
					onClose={agencyFilterOnClose}
					handleFilter={handleAgencyFilter}
					storeKey='payrollAgency'
				/>
			)}
		</Box>
	);
};

export default Payroll;
