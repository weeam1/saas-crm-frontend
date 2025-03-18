import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Flex, Icon, useDisclosure } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import EmployeesList from './EmployeesList';
import ErrorMessage from 'components/Message/ErrorMessage';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RoleTabs from './RoleTabs';
import Pagination from './Pagination';
import FilterModal from './FilterModal';
import AttendanceHeader from '../AttendanceHeader';

const Employees = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchClear, setSearchClear] = useState(false);
	const navigate = useNavigate();
	const searchTermRef = useRef('');

	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		const page = Number(searchParams.get('page')) || 1;
		const pageSize = Number(searchParams.get('pageSize')) || 24;
		const role = searchParams.get('role') || 'All';
		const search = searchParams.get('search') || '';
		const agency = searchParams.get('agency') || '';

		if (agency || search) {
			setSearchClear(true);
		}

		setSearchParams(
			(prev) => {
				const newParams = {
					page,
					pageSize,
					role,
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
		const agency = searchParams.get('agency') || '';

		return {
			page: Number(searchParams.get('page')) || 1,
			pageSize: Number(searchParams.get('pageSize')) || 24,
			role,
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

	const handlePageChange = (page) => {
		updateFilters({ page: Number(page), pageSize: 24 });
	};

	useEffect(() => {
		usersRefetch();
	}, [searchParams, usersRefetch]);

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

		setSearchParams((prev) => {
			const newParams = new URLSearchParams(prev);
			newParams.delete('search');
			newParams.delete('agency');
			return newParams;
		});
		setSearchClear(false);
	};

	return (
		<>
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
			<Box minH='100vh' fontFamily="'DM Sans', sans-serif">
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
					content={['agencyFilter']}
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
					{/* Employees List */}
					<Box mt='4' p='4'>
						{isLoading || isFetching ? (
							<Box h='70vh'>
								<Loader />
							</Box>
						) : data && data?.doc ? (
							<>
								<EmployeesList employees={data?.doc || []} />
							</>
						) : (
							<ErrorMessage message='Something went wrong on the server side.' />
						)}
					</Box>

					{data?.totalResults > queryParams.pageSize && (
						<Pagination
							currentPage={queryParams.page}
							totalPages={data.totalPages}
							onPageChange={handlePageChange}
						/>
					)}
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
