import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, HStack, Text, useDisclosure } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import ErrorMessage from 'components/Message/ErrorMessage';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import AttendanceHeader from '../AttendanceHeader';
import RecordTable from './RecordTable';
// import TablePagination from 'components/pagination/TablePagination';
import FilterModal from '../employees/FilterModal';
import AppButton from 'components/shared/AppButton';
import ExportAttendanceReport from '../ExportAttendanceReport';
import AttendanceStatusFilter from '../AttendanceStatusFilter';
import TopPagination from 'components/pagination/TopPagination';

export default function Records() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchClear, setSearchClear] = useState(false);
	const [initialLoad, setInitialLoad] = useState(true);
	const currentStatus = searchParams.get('status') || '';
	const [status, setStatus] = useState(currentStatus);

	const navigate = useNavigate();
	const searchTermRef = useRef('');
	const hasTabParam = searchParams.has('tab');
	const {
		isOpen: filterIsOpen,
		onOpen: filterOnOpen,
		onClose: filterOnClose,
	} = useDisclosure();

	const user = JSON.parse(localStorage.getItem('user'));
	const role =
		user?.role === 'superAdmin' ? 'superAdmin' : user?.roles[0]?.roleName;

	const currentDate = new Date();
	const [month, setMonth] = useState(currentDate.getMonth() + 1);
	const [year, setYear] = useState(currentDate.getFullYear());

	// const [pageSize, setPageSize] = useState(10);
	// const [currentPage, setCurrentPage] = useState(1);
	// const [gopageValue, setGopageValue] = useState(1);

	useEffect(() => {
		if (initialLoad) {
			const currentParams = Object.fromEntries(searchParams.entries());

			// Only set default params if no params exist
			if (Object.keys(currentParams).length === 0) {
				setSearchParams(
					{
						page: '1',
						limit: '10',
						month: month.toString(),
						year: year.toString(),
						agency: 'All',
					},
					{ replace: true }
				);
			}

			setInitialLoad(false);
		}
	}, [initialLoad, searchParams, setSearchParams, month, year]);

	const queryParams = useMemo(() => {
		const currentParams = Object.fromEntries(searchParams.entries());

		return {
			page: Number(currentParams.page) || 1,
			limit: Number(currentParams.limit) || 10,
			month: currentParams.month || month,
			year: currentParams.year || year,
			...(currentParams.search && { search: currentParams.search }),
			...(currentParams.agency && { agency: currentParams.agency }),
			...((currentParams.status || currentParams.status === 0) && {
				status: currentParams.status,
			}),
		};
	}, [searchParams, month, year]);

	const {
		data,
		isLoading,
		isFetching,
		error,
		refetch: attendanceRefetch,
	} = useFetchItemsQuery(
		{ path: '/attendance', params: queryParams },
		{ refetchOnMountOrArgChange: true }
	);

	const updateFilters = (newFilters) => {
		setSearchParams(
			(prev) => {
				const prevParams = Object.fromEntries(prev.entries());
				const updatedParams = { ...prevParams, ...newFilters };

				if (updatedParams.page) updatedParams.page = Number(updatedParams.page);
				if (updatedParams.limit)
					updatedParams.limit = Number(updatedParams.limit);

				return updatedParams;
			},
			{ replace: true }
		);
	};

	// const handleGotoPage = (page) => {
	// 	updateFilters({ page: Number(page + 1) });
	// };

	const handlePageSize = (size) => {
		updateFilters({ page: 1, limit: Number(size) });
	};

	const handlePageChange = (page) => {
		updateFilters({ page: Number(page) });
	};

	useEffect(() => {
		if (!initialLoad) {
			attendanceRefetch();
		}
		// setCurrentPage(queryParams.page);
		// setPageSize(queryParams.limit);

		setMonth(queryParams.month);
		setYear(queryParams.year);

		if (queryParams.agency === 'All' && !queryParams.search) {
			setSearchClear(false);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams, attendanceRefetch]);

	const handleSearch = () => {
		const term = searchTermRef.current.trim();
		if (!term) return;

		updateFilters({ search: term, page: 1 });
		setSearchClear(true);
	};

	const handleClear = () => {
		searchTermRef.current = '';
		document.getElementById('searchInput').value = '';
		updateFilters({
			page: 1,
		});
		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);
			newParams.delete('search');
			newParams.delete('agency');
			newParams.delete('status');
			return newParams;
		});
		setSearchClear(false);
		setStatus('');
	};

	const onFilterChange = (value) => {
		const newMonth = Number(value.month);
		const newYear = Number(value.year);

		updateFilters({ month: newMonth, year: newYear });
	};

	const onStatusChange = (value) => {
		setStatus(value);
		updateFilters({ status: value, page: 1 });
	};

	if (error) {
		return (
			<ErrorMessage message={error?.data.message || 'Something went wrong!'} />
		);
	}

	return (
		<Box minH='100vh' fontFamily="'DM Sans', sans-serif">
			{/* {!hasTabParam && (
        <AppButton
          leftIcon={<IoArrowBack />}
          onClick={() => navigate("/attendance")}
        >
          Back
        </AppButton>
      )} */}

			<Box
				display='flex'
				justifyContent='space-between'
				alignItems='center'
				flexDir={{ base: 'column', md: 'row' }}
				gap='2'
				mb={4}
				bg='white'
				mt='2'
				p={4}
			>
				<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold'>
					Attendance Records
				</Text>
				<HStack gap='2'>
					<AttendanceStatusFilter status={status} onChange={onStatusChange} />
					{['superAdmin', 'HR'].includes(role) && (
						<ExportAttendanceReport month={month} year={year} />
					)}
				</HStack>
			</Box>
			<Box Box bg='white' p={5} borderRadius='md' shadow='sm'>
				{/* Header */}
				<AttendanceHeader
					title='Attendance Overview'
					totalDocs={data?.totalDocs}
					searchTermRef={searchTermRef}
					queryParams={queryParams}
					handleSearch={handleSearch}
					handleClear={handleClear}
					searchClear={searchClear}
					content={['date', 'agencyFilter', 'report']}
					filterOpen={filterOnOpen}
					onDateFilterChange={onFilterChange}
					isLoading={isLoading || isFetching}
					refetch={attendanceRefetch}
				/>

				{!isLoading && (
					<TopPagination
						currentPage={queryParams.page}
						totalPages={data?.totalPages}
						onPageChange={handlePageChange}
						totalItems={data?.totalDocs}
						itemsPerPage={queryParams.limit}
						refetching={isFetching}
						loading={isLoading}
						handlePageSize={handlePageSize}
					/>
				)}

				<RecordTable
					records={data}
					// timezone={timezone}
					isLoading={isLoading}
					isFetching={isFetching}
					refetch={attendanceRefetch}
					role={role}
				/>

				{/* {data?.doc && (
					<TablePagination
						gotoPage={handleGotoPage}
						gopageValue={gopageValue}
						setGopageValue={setGopageValue}
						pageCount={data?.totalPages}
						canPreviousPage={currentPage > 1}
						previousPage={() => handleGotoPage(currentPage - 2)}
						canNextPage={currentPage < data?.totalPages}
						nextPage={() => handleGotoPage(currentPage)}
						pageOptions={Array.from({ length: data?.totalPages })}
						setPageSize={handlePageSizeChange}
						pageSize={pageSize}
						pageIndex={currentPage - 1}
						totalDocs={data?.totalDocs}
					/>
				)} */}

				{filterIsOpen && (
					<FilterModal
						updateFilters={updateFilters}
						isOpen={filterIsOpen}
						onClose={filterOnClose}
						setSearchClear={setSearchClear}
					/>
				)}
			</Box>
		</Box>
	);
}
