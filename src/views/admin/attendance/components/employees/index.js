import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Flex, Icon, useDisclosure } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import EmployeesList from './EmployeesList';
import ErrorMessage from 'components/Message/ErrorMessage';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useSearchParams } from 'react-router-dom';
import EmployeesHeader from './EmployeesHeader';
import RoleTabs from './RoleTabs';
import Pagination from './Pagination';
import FilterModal from './FilterModal';
import TabButton from 'components/shared/TabButton';

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

		setSearchParams(
			(prev) => {
				const newParams = {
					page,
					pageSize,
					role: search && role === 'manager' ? 'All' : role,
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
			role: 'All' || role,
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
				const updatedParams = {
					...Object.fromEntries(prev.entries()),
					...newFilters,
				};

				console.log(updateFilters);

				if (updatedParams.page) updatedParams.page = Number(updatedParams.page);
				if (updatedParams.pageSize)
					updatedParams.pageSize = Number(updatedParams.pageSize);

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
				<EmployeesHeader
					data={data}
					searchTermRef={searchTermRef}
					queryParams={queryParams}
					handleSearch={handleSearch}
					handleClear={handleClear}
					searchClear={searchClear}
					filterOpen={onOpen}
				/>

				{/* Role Tab Navigation */}
				<RoleTabs updateFilters={updateFilters} />

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
