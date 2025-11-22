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
import { FiFilter } from 'react-icons/fi';
import { BiX } from 'react-icons/bi';

import TopPagination from 'components/pagination/TopPagination';
import DateFilter from 'views/admin/attendance/components/DateFilter';
import { buttonStyle } from 'utils/btn';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import AgencyFilterModal from '../components/AgencyFilterModal';
import UserEvaluationTable from './UserEvalutionTable';
import { useUserEvalution } from '../hooks/useUserEvaluation';
import ViewEvaluation from './components/ViewEvaluation';

const UserEvaluation = () => {
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
		updateData,
		removeItem,
	} = useUserEvalution();

	const selectedAgency = useMemo(
		() => agencies.find((a) => a._id === agencyId) || null,
		[agencies, agencyId]
	);

	const [clearFilters, setClearFilters] = useState(false);
	const [viewEvaluation, setViewEvaluation] = useState({
		modal: false,
		data: null,
	});

	const {
		isOpen: agencyFilterIsOpen,
		onOpen: agencyFilterOnOpen,
		onClose: agencyFilterOnClose,
	} = useDisclosure();

	const {
		isOpen: evaluationIsOpen,
		onClose: evaluationOnClose,
		onOpen: evaluationOpen,
	} = useDisclosure();

	const [evaluationData, setEvaluationData] = useState(null);

	const handleOpenAdd = () => {
		setEvaluationData(null);
		evaluationOpen();
	};

	const handleOpenEdit = (evaluation) => {
		setEvaluationData(evaluation);
		evaluationOpen();
	};

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

					{/* <Button
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
					</Button> */}

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

			<UserEvaluationTable
				data={data || []}
				updateData={updateData}
				removeItem={removeItem}
				handleOpenEdit={handleOpenEdit}
				isLoading={isLoading || isFetching}
				setView={setViewEvaluation}
			/>

			{/* {viewBalance?.modal && (
        <ViewLoanDetails
          data={viewBalance.data}
          isOpen={viewBalance.modal}
          onClose={() => setViewBalance({ modal: false, data: null })}
        />
      )} */}

			{/* {evaluationIsOpen && (
				<UpsertLoan
					isOpen={evaluationIsOpen}
					onClose={evaluationOnClose}
					initialData={editData}
					refetchSummary={refetchSummary}
					isEmployeeLoans={true}
					selectedMonth={month}
					selectedYear={year}
					isAgenciesAllowed={isAgenciesAllowed}
				/>
			)} */}

			{viewEvaluation?.modal && (
				<ViewEvaluation
					isOpen={viewEvaluation?.modal}
					onClose={() => setViewEvaluation({ modal: false, data: null })}
					data={viewEvaluation?.data}
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

export default UserEvaluation;
