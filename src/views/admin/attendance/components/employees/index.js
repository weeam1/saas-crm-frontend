import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import EmployeesList from './EmployeesList';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RoleTabs from './RoleTabs';
import FilterModal from './FilterModal';
import AttendanceHeader from '../AttendanceHeader';
import EmployeesTable from './EmployeesTable';
import AppButton from 'components/shared/AppButton';
import TopPagination from 'components/pagination/TopPagination';
import { getLocalAttendanceFilter } from '../../constants';
import useUserSession from 'hooks/useUserSession';

const Employees = () => {
	const PAGE_SIZE = 20;
	const [searchParams, setSearchParams] = useSearchParams();

	const searchQuery = searchParams.get('search') || '';

	const [searchClear, setSearchClear] = useState(false);
	const [view, setView] = useState(() => {
		return localStorage.getItem('employeesView') || 'grid';
	});
	const [initialLoad, setInitialLoad] = useState(true);

	const { userRoleName } = useUserSession();

	const [viewLoading, setViewLoading] = useState(false);

	const searchTermRef = useRef();
	// const hasTabParam = searchParams.has('tab');
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		if (searchParams.get('search') || searchParams.get('role') !== 'All') {
			setSearchClear(true);

			searchTermRef.current = searchParams.get('search') || '';

			console.log({
				query: searchParams.get('search'),
				search: searchTermRef.current,
			});
		}
	}, [searchParams]);

	// Only set initial params if they don't exist
	useEffect(() => {
		if (initialLoad) {
			const currentParams = Object.fromEntries(searchParams.entries());

			// Only set default params if no params exist
			if (Object.keys(currentParams).length === 0) {
				setSearchParams(
					{
						page: '1',
						pageSize: PAGE_SIZE.toString(),
						role: 'All',
						layout: view,
						agency: getLocalAttendanceFilter() || 'All',
					},
					{ replace: true }
				);
			}

			setInitialLoad(false);
		}
	}, [initialLoad, searchParams, setSearchParams, view]);

	const queryParams = useMemo(() => {
		const currentParams = Object.fromEntries(searchParams.entries());

		return {
			page: Number(currentParams.page) || 1,
			pageSize: Number(currentParams.pageSize) || PAGE_SIZE,
			role: currentParams.role || 'All',
			layout: currentParams.layout || view,
			...(currentParams.search && { search: currentParams.search }),
			...(currentParams.agency && { agency: currentParams.agency }),
		};
	}, [searchParams, view]);

	const {
		data,
		isLoading,
		isFetching,
		refetch: usersRefetch,
	} = useFetchItemsQuery(
		{ path: '/v2/user/employees', params: queryParams },
		{
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
			refetchOnReconnect: true,
		}
	);

	const updateFilters = useCallback(
		(newFilters) => {
			setSearchParams(
				(prev) => {
					const prevParams = Object.fromEntries(prev.entries());
					const updatedParams = { ...prevParams, ...newFilters };

					if (updatedParams.page)
						updatedParams.page = Number(updatedParams.page);
					// if (updatedParams.role) updatedParams.role = Number(updatedParams.role);
					if (updatedParams.pageSize)
						updatedParams.pageSize = Number(updatedParams.pageSize);

					return updatedParams;
				},
				{ replace: true }
			);
		},
		[setSearchParams]
	);

	useEffect(() => {
		if (!initialLoad) {
			usersRefetch();
		}

		if (queryParams.agency === 'All' && !queryParams.search) {
			setSearchClear(false);
		}
	}, [queryParams, usersRefetch, initialLoad]);

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
		// setSearchClear(true);

		console.log({ searchClear });
	};

	const handleClear = () => {
		searchTermRef.current = '';
		document.getElementById('searchInput').value = '';
		updateFilters({
			page: 1,
			role: 'All',
		});
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
		updateFilters({ layout: newView });
		setView(newView);
		setViewLoading(true);
		localStorage.setItem('employeesView', newView);

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
				loginRole={userRoleName}
			/>
		) : (
			<EmployeesTable
				data={data}
				isLoading={isLoading}
				isFetching={isFetching}
				viewLoading={viewLoading}
				queryParams={queryParams}
				loginRole={userRoleName}
			/>
		);

	return (
		<>
			{/* {!hasTabParam && (
				<AppButton leftIcon={<IoArrowBack />} onClick={() => navigate(-1)}>
					Back
				</AppButton>
			)} */}

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
