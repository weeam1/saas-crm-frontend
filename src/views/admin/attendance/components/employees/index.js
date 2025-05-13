import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import EmployeesList from './EmployeesList';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RoleTabs from './RoleTabs';
import Pagination from './Pagination';
import FilterModal from './FilterModal';
import AttendanceHeader from '../AttendanceHeader';
import EmployeesTable from './EmployeesTable';
import AppButton from 'components/shared/AppButton';
import TopPagination from 'components/pagination/TopPagination';
import { getLocalAttendanceFilter } from '../../constants';

const Employees = () => {
	const PAGE_SIZE = 20;
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchClear, setSearchClear] = useState(false);
	const [view, setView] = useState(() => {
		return localStorage.getItem('employeesView') || 'grid';
	});

	const [viewLoading, setViewLoading] = useState(false);

	const navigate = useNavigate();
	const searchTermRef = useRef('');

	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		const page = Number(searchParams.get('page')) || 1;
		const pageSize = Number(searchParams.get('pageSize')) || PAGE_SIZE;
		const role = searchParams.get('role') || 'All';
		const search = searchParams.get('search') || '';
		const agency =
			searchParams.get('agency') || getLocalAttendanceFilter() || 'All';
		const layout = searchParams.get('layout') || view;

		if (agency || search) {
			setSearchClear(true);
		}

		setSearchParams(
			(prev) => {
				const newParams = {
					page,
					pageSize,
					role,
					layout,
					...(search && { search }),
					...(agency && { agency }),
				};

				return newParams;
			},
			{ replace: true }
		);
	}, [searchParams, setSearchParams]);

	const queryParams = useMemo(() => {
		const search = searchParams.get('search') || '';
		const role = searchParams.get('role') || 'All';
		const agency =
			searchParams.get('agency') || getLocalAttendanceFilter() || 'All';
		const layout = searchParams.get('layout') || view;

		return {
			page: Number(searchParams.get('page')) || 1,
			pageSize: Number(searchParams.get('pageSize')) || PAGE_SIZE,
			role,
			layout,
			...(search && { search }),
			...(agency && { agency }),
		};
	}, [searchParams]);

	const {
		data,
		isLoading,
		isFetching,
		refetch: usersRefetch,
	} = useFetchItemsQuery(
		{ path: '/v2/user/employees', params: queryParams },
		{ refetchOnMountOrArgChange: true }
	);

	const updateFilters = (newFilters) => {
		setSearchParams(
			(prev) => {
				const prevParams = Object.fromEntries(prev.entries());
				const updatedParams = { ...prevParams, ...newFilters };

				if (updatedParams.page) updatedParams.page = Number(updatedParams.page);
				// if (updatedParams.role) updatedParams.role = Number(updatedParams.role);
				if (updatedParams.pageSize)
					updatedParams.pageSize = Number(updatedParams.pageSize);

				// Prevent updating if nothing has changed
				if (JSON.stringify(prevParams) === JSON.stringify(updatedParams)) {
					return prevParams; // No change, avoid state update
				}

				return updatedParams;
			},
			{ replace: true }
		);
	};

	useEffect(() => {
		usersRefetch();

		if (queryParams.agency === 'All' && !queryParams.search) {
			setSearchClear(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams, usersRefetch]);

	const handlePageChange = (page) => {
		updateFilters({ page: Number(page) });
	};

	const handlePageSize = (pageSize) => {
		updateFilters({ pageSize: Number(pageSize), page: 1 });
	};

	const handleSearch = () => {
		const term = searchTermRef.current.trim();
		if (!term) return;

		updateFilters({ search: term, page: 1, role: 'All' });
		setSearchClear(true);
	};

	const handleClear = () => {
		searchTermRef.current = '';
		document.getElementById('searchInput').value = '';
		updateFilters({ page: 1, role: 'All' });

		localStorage.removeItem('attendanceAgencyFilter');

		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);
			newParams.delete('search');
			newParams.delete('agency');
			return newParams;
		});
		setSearchClear(false);
	};

	const handleViewChange = (newView) => {
		updateFilters({ layout: view });
		setView(newView);
		setViewLoading(true);

		setTimeout(() => {
			setViewLoading(false);
		}, 1000);
	};

	const layoutView =
		view === 'grid' ? (
			<EmployeesList
				data={data}
				isLoading={isLoading}
				isFetching={isFetching}
				viewLoading={viewLoading}
				queryParams={queryParams}
			/>
		) : (
			<EmployeesTable
				data={data}
				isLoading={isLoading}
				isFetching={isFetching}
				viewLoading={viewLoading}
				queryParams={queryParams}
			/>
		);

	return (
		<>
			<AppButton
				leftIcon={<IoArrowBack />}
				onClick={() => navigate('/attendance')}
			>
				Back
			</AppButton>

			<Box minH='100vh' py='2' fontFamily="'DM Sans', sans-serif">
				{/* Header */}
				<AttendanceHeader
					title='Employees'
					totalDocs={data?.totalResults}
					searchTermRef={searchTermRef}
					queryParams={queryParams}
					handleSearch={handleSearch}
					handleClear={handleClear}
					searchClear={searchClear}
					filterOpen={onOpen}
					content={['agencyFilter', 'view']}
					view={view}
					handleView={handleViewChange}
				/>

				{/* Role Tab Navigation */}
				<RoleTabs updateFilters={updateFilters} key='employees' />

				<Box
					my='4'
					p='4'
					bg='white'
					shadow='sm'
					rounded='md'
					minH='100px'
					transition='opacity 0.3s ease, transform 0.3s ease'
					opacity={1}
					transform='translateY(0px)'
				>
					{!isLoading && (
						<TopPagination
							currentPage={queryParams.page}
							totalPages={data?.totalPages}
							onPageChange={handlePageChange}
							totalItems={data?.totalResults}
							itemsPerPage={queryParams.pageSize}
							refetching={isFetching}
							loading={isLoading}
							handlePageSize={handlePageSize}
						/>
					)}

					{/* Employees View layout */}
					<Box mt='2'>{layoutView}</Box>

					{/* {data?.totalResults > queryParams.pageSize && (
						<Pagination
							currentPage={queryParams.page}
							totalPages={data.totalPages}
							onPageChange={handlePageChange}
						/>
					)} */}
				</Box>
			</Box>

			{isOpen && (
				<FilterModal
					updateFilters={updateFilters}
					isOpen={isOpen}
					onClose={onClose}
					setSearchClear={setSearchClear}
				/>
			)}
		</>
	);
};

export default Employees;
