import { useFetchItemsQuery } from 'api/apiSlice';
import ErrorMessage from 'components/Message/ErrorMessage';
import { useEffect, useState } from 'react';
import LeadCard from './components/LeadCard';
import { Flex, Grid } from '@chakra-ui/react';
import Loader from 'components/loading/Loader';

const LeadScreen = () => {
	const user = JSON.parse(localStorage.getItem('user'));
	const isAdmin = user?.role === 'superAdmin';

	const [currentPage, setCurrentPage] = useState(13);
	const [pageSize, setPageSize] = useState(12);
	const [queryParams, setQueryParams] = useState({
		page: currentPage,
		pageSize,
	});

	const {
		data: leads,
		isLoading: leadsLoading,
		error: leadsError,
		refetch: leadsRefetch,
	} = useFetchItemsQuery(
		{
			path: '/lead/v2',
			params: queryParams,
		},
		{ refetchOnMountOrArgChange: true }
	);

	// Update queryParams only when necessary
	useEffect(() => {
		setQueryParams((prev) => ({
			...prev,
			page: currentPage, // Keep page in sync
		}));
	}, [currentPage]);

	useEffect(() => {
		setQueryParams((prev) => ({
			...prev,
			pageSize, // Update limit when pageSize changes
		}));
	}, [pageSize]);

	// Automatically refetch when queryParams change
	useEffect(() => {
		leadsRefetch({
			path: '/lead/v2',
			params: queryParams,
		});
	}, [queryParams, leadsRefetch]);

	// Handle page changes
	// const handlePageChange = (page) => {
	// 	setCurrentPage(page);
	// };

	if (leadsError) {
		return (
			<ErrorMessage
				message={leadsError?.data?.message || 'Something went wrong!'}
			/>
		);
	}

	return leadsLoading ? (
		<Loader />
	) : (
		<Flex wrap='wrap' width='fit-content' gap='1'>
			{leads?.doc?.map((lead) => (
				<LeadCard lead={lead} />
			))}
		</Flex>
	);
};

export default LeadScreen;
