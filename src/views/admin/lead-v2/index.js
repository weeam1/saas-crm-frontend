import { useFetchItemsQuery } from 'api/apiSlice';
import ErrorMessage from 'components/Message/ErrorMessage';
import { useEffect, useState } from 'react';
import Loader from 'components/loading/Loader';
import useFetchUserHierarchy from 'hooks/useFetchUserHierarchy';
import Leads from './components/Leads';
// import CardsLoading from 'components/loading/CardsLoading';

const LeadScreen = () => {
	const user = JSON.parse(localStorage.getItem('user'));
	const isAdmin = user?.role === 'superAdmin';

	const users = useFetchUserHierarchy();

	const [currentPage, setCurrentPage] = useState(1);
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
		<Leads leads={leads} isLoading={leadsLoading} />
	);
};

export default LeadScreen;
