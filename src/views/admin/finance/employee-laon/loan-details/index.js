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
import { FaChevronLeft, FaPlus } from 'react-icons/fa';
import TopPagination from 'components/pagination/TopPagination';
import DateFilter from 'views/admin/attendance/components/DateFilter';
import { buttonStyle } from 'utils/btn';
import { BiX } from 'react-icons/bi';
// import SummaryCards from '../components/SummaryCards';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { useEmployeeLoans } from '../../hooks/useEmployeeLoan';
import UpsertLoan from '../UpsertLoan';
import LoansTable from './LoansTable';
import { useNavigate, useParams } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import AppButton from 'components/shared/AppButton';
import ViewLoanDetails from '../ViewLoanDetails';

const EmployeeLoans = () => {
	const { id: userId } = useParams();

	const {
		summary,
		// refetchSummary,
		// month,
		// year,
		queryParams,
		data,
		totalPages,
		totalRecords,
		isLoading,
		isFetching,
		handlePageChange,
		handlePageSize,
		// onDateFilterChange,
		updateData,
		removeItem,
	} = useEmployeeLoans({ userId });

	const [clearFilters, setClearFilters] = useState(false);

	const navigate = useNavigate();

	const [viewLoan, setViewLoan] = useState({ modal: false, data: null });
	const [editData, setEditData] = useState(null);

	const {
		isOpen: expenseIsOpen,
		onClose: expenseOnClose,
		onOpen: expenseOpen,
	} = useDisclosure();

	const handleOpenAdd = () => {
		setEditData({ user: userId });
		expenseOpen();
	};

	const handleOpenEdit = (expense) => {
		console.log({ expense });
		setEditData(expense);
		expenseOpen();
	};

	console.log({ editData });

	const handleClear = () => {
		setClearFilters(false);
	};

	return (
		<Box p={6} bg='bg.surface' minH='80vh' borderRadius='lg' boxShadow='card'>
			{/* Back Button */}
			<AppButton
				leftIcon={<FaChevronLeft />}
				size='sm'
				onClick={() => navigate(-1)}
				mb={4}
				variant='ghost'
			>
				Back
			</AppButton>

			<Flex
				flexDir={{ base: 'column', md: 'row' }}
				justify='space-between'
				align='center'
				mb={4}
			>
				<Flex alignSelf='flex-start' fontSize='lg' fontWeight='bold' gap='2'>
					<Text color='white'>{summary?.user?.fullName ?? ' '} Loans</Text>
					<CountUpComponent key={totalRecords} targetNumber={totalRecords} />
				</Flex>

				<HStack gap='2' alignItems='center'>
					{/* <DateFilter onFilterChange={onDateFilterChange} /> */}

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

			<LoansTable
				data={data || []}
				updateData={updateData}
				removeItem={removeItem}
				handleOpenEdit={handleOpenEdit}
				isLoading={isLoading || isFetching}
				setView={setViewLoan}
			/>

			{viewLoan?.modal && (
				<ViewLoanDetails
					data={viewLoan.data}
					isOpen={viewLoan.modal}
					onClose={() => setViewLoan({ modal: false, data: null })}
				/>
			)}

			{expenseIsOpen && editData && (
				<UpsertLoan
					isOpen={expenseIsOpen}
					onClose={expenseOnClose}
					initialData={editData}
					// refetchSummary={refetchSummary}
					updateData={updateData}
					// selectedMonth={month}
					// selectedYear={year}
				/>
			)}
		</Box>
	);
};

export default EmployeeLoans;
