import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Icon, Text } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import ErrorMessage from 'components/Message/ErrorMessage';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import AttendanceHeader from '../AttendanceHeader';
import RecordTable from './RecordTable';
import TablePagination from 'components/pagination/TablePagination';
import moment from 'moment-timezone';

const timezone = 'Asia/Karachi';

export default function Records() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchClear, setSearchClear] = useState(false);
	const navigate = useNavigate();
	const searchTermRef = useRef('');

	const [month, setMonth] = useState(() =>
		Number(moment.tz(timezone).format('M'))
	);
	const [year, setYear] = useState(() =>
		Number(moment.tz(timezone).format('YYYY'))
	);

	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [gopageValue, setGopageValue] = useState(1);

	useEffect(() => {
		const page = Math.max(Number(searchParams.get('page')) || 1, 1);
		const pageSize = Math.min(
			Math.max(Number(searchParams.get('pageSize')) || 10, 1),
			100
		);

		const search = searchParams.get('search') || '';
		const agency = searchParams.get('agency') || '';

		setSearchParams(
			(prev) => {
				const newParams = {
					page,
					pageSize,
					month: searchParams.get('month') || month,
					year: searchParams.get('year') || year,
					...(search && { search }),
					...(agency && { agency }),
				};

				return newParams;
			},
			{ replace: true }
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams, setSearchParams]);

	const queryParams = useMemo(() => {
		const search = searchParams.get('search') || '';
		const agency = searchParams.get('agency') || '';

		return {
			page: Number(searchParams.get('page')) || 1,
			limit: Number(searchParams.get('pageSize')) || 10,
			month: searchParams.get('month') || month,
			year: searchParams.get('year') || year,
			...(search && { search }),
			...(agency && { agency }),
		};
	}, [searchParams]);

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
				if (updatedParams.pageSize)
					updatedParams.pageSize = Number(updatedParams.pageSize);

				// Prevent updating if nothing has changed
				if (JSON.stringify(prevParams) === JSON.stringify(updatedParams)) {
					return prevParams;
				}

				return updatedParams;
			},
			{ replace: true }
		);
	};

	const handleGotoPage = (page) => {
		updateFilters({ page: Number(page + 1) });
	};

	const handlePageSizeChange = (size) => {
		updateFilters({ page: 1, pageSize: size });
	};

	useEffect(() => {
		attendanceRefetch();

		setCurrentPage(queryParams.page);
		setPageSize(queryParams.limit);

		setMonth(queryParams.month);
		setYear(queryParams.year);

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
		updateFilters({ page: 1, role: 'All' });

		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);
			newParams.delete('search');
			newParams.delete('agency');
			return newParams;
		});
		setSearchClear(false);
	};

	const onFilterChange = (value) => {
		const newMonth = Number(value.month);
		const newYear = Number(value.year);

		updateFilters({ month: newMonth, year: newYear });
	};

	if (error) {
		return (
			<ErrorMessage message={error?.data.message || 'Something went wrong!'} />
		);
	}

	return (
		<Box p={{ base: 4, md: 6 }} minH='100vh' fontFamily="'DM Sans', sans-serif">
			<Button
				colorScheme='gray'
				borderRadius='5px'
				size={{ base: 'sm', md: 'md' }}
				px={{ base: 4, md: 6 }}
				py={{ base: 2, md: 3 }}
				fontSize={{ base: 'sm', md: 'md' }}
				leftIcon={<Icon as={IoArrowBack} boxSize={4} />}
				onClick={() => navigate('/attendance')}
				mb={4}
			>
				Back
			</Button>

			<Box display='flex' alignItems='center' mb={4} bg='white' p={4}>
				<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold'>
					Attendance Records
				</Text>
			</Box>

			<Box bg='white' p={5} borderRadius='md' shadow='sm'>
				{/* Header */}
				<AttendanceHeader
					title='Attendance Overview'
					totalDocs={data?.totalDocs}
					searchTermRef={searchTermRef}
					queryParams={queryParams}
					handleSearch={handleSearch}
					handleClear={handleClear}
					searchClear={searchClear}
					content={['date']}
					onDateFilterChange={onFilterChange}
				/>

				<RecordTable
					data={data}
					timezone={timezone}
					isLoading={isLoading}
					isFetching={isFetching}
					refetch={attendanceRefetch}
				/>

				{data?.doc && (
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
				)}
			</Box>
		</Box>
	);
}
