import { useEffect, useMemo, useState } from 'react';
import { Box, Heading, Input, Icon, Flex, Button } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import EmployeesList from './EmployeesList';
import ErrorMessage from 'components/Message/ErrorMessage';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useSearchParams } from 'react-router-dom';
import EmployeesHeader from './EmployeesHeader';
import RoleTabs from './RoleTabs';
import Pagination from './Pagination';

const Employees = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (
			!searchParams.get('page') ||
			!searchParams.get('pageSize') ||
			!searchParams.get('role')
		) {
			setSearchParams(
				(prev) => ({
					page: Number(prev.get('page')) || 1,
					pageSize: Number(prev.get('pageSize')) || 24,
					role: prev.get('role') || 'All',
				}),
				{ replace: true }
			);
		}
	}, [searchParams, setSearchParams]);

	const queryParams = useMemo(
		() => ({
			page: Number(searchParams.get('page')) || 1,
			pageSize: Number(searchParams.get('pageSize')) || 24,
			role: searchParams.get('role') || 'All',
		}),
		[searchParams]
	);

	const {
		data,
		isLoading,
		isFetching,
		refetch: usersRefetch,
	} = useFetchItemsQuery(
		{ path: '/v2/user/employees', params: queryParams },
		{ refetchOnMountOrArgChange: true }
	);

	// Update search params & trigger refetch automatically
	const updateFilters = (newFilters) => {
		setSearchParams(
			(prev) => {
				const updatedParams = {
					...Object.fromEntries(prev.entries()),
					...newFilters,
				};

				if (updatedParams.page) updatedParams.page = Number(updatedParams.page);
				if (updatedParams.pageSize)
					updatedParams.pageSize = Number(updatedParams.pageSize);

				return updatedParams;
			},
			{ replace: true }
		);
	};

	const handlePageChange = (page) => {
		updateFilters({ page: Number(page) });
	};

	useEffect(() => {
		usersRefetch();
	}, [searchParams, usersRefetch]); // Auto-refetch on param change

	// const handleTabChange = (index) => {
	// 	setActiveTab(index);
	// 	setSearchParams((prev) => {
	// 		const newParams = new URLSearchParams(prev);
	// 		newParams.set('tab', tabData[index].key);
	// 		return newParams;
	// 	});
	// };

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
				{/* Agencies  */}
				{/* <Flex gap='2' px='4' mb='4' width='fit-content'>
					{agencies?.doc?.map((agency) => (
						<TabButton
							key={agency._id}
							isActive={activeAgency === agency.name}
							onClick={() => handleAgencyChange(agency)}
						>
							{agency.name}
						</TabButton>
					))}
				</Flex> */}
				{/* Header */}
				<EmployeesHeader
					data={data}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
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
		</>
	);
};

export default Employees;
