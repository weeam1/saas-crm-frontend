import { useState, useEffect, useMemo } from 'react';
import { useFetchItemsQuery } from 'api/apiSlice';
import axios from 'axios';
import { toast } from 'react-toastify'; // Ensure you have the react-toastify library
import keys from 'config/keys';

// const useFetchAnnouncements = (userId, currentPage, itemsPerPage) => {
// 	const [list, setList] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const [totalPages, setTotalPages] = useState(0);
// 	const [totalResults, setTotalResults] = useState(0);

// 	const getAnnouncements = async () => {
// 		setLoading(true);
// 		try {
// 			const { data } = await axios.get(
// 				`${keys.socketUrl}/posted_announcements?user_id=${userId}&page=${currentPage}&size=${itemsPerPage}`,
// 				{ maxRedirects: 0 } // Prevent auto-following redirects
// 			);

// 			if (data?.total_announcements > 0) {
// 				// setList(data.announcements);
// 				// Append new announcements to the existing list
// 				setList((prevList) => [...prevList, ...data.announcements]);
// 				setTotalPages(data.total_pages);
// 				setTotalResults(data?.total_announcements);
// 			} else {
// 				setList([]); // Clear list if no announcements
// 				setTotalPages(0);
// 			}
// 		} catch (error) {
// 			if (error.response?.status === 307) {
// 				console.log('Redirected to:', error.response.headers.location);
// 			} else {
// 				toast.error('Failed to fetch announcements.');
// 			}
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	useEffect(() => {
// 		if (userId) {
// 			getAnnouncements();
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [userId, currentPage]);

// 	return { list, loading, totalPages, totalResults };
// };

const useFetchAnnouncements = (userId, currentPage, itemsPerPage) => {
	const [list, setList] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const [totalResults, setTotalResults] = useState(0);

	const queryParams = useMemo(
		() => ({
			// receiver: userId,
			page: currentPage,
			limit: itemsPerPage,
		}),
		[userId, currentPage, itemsPerPage],
	);

	const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
		{
			path: '/notifications/announcements',
			params: queryParams,
		},
		{
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
		},
	);

	// useEffect(() => {
	// 	if (!data?.doc) return;

	// 	setList((prev) => (currentPage === 1 ? data.doc : [...prev, ...data.doc]));

	// 	setTotalPages(data.totalPages || 0);
	// 	setTotalResults(data.total || 0);
	// }, [data, currentPage]);

	useEffect(() => {
	if (!data?.doc) return;

	// Replace the list instead of appending
	setList(data.doc);

	setTotalPages(data.totalPages || 0);
	setTotalResults(data.total || 0);
}, [data]); // Remove currentPage from dependency array

	return {
		list,
		totalPages,
		totalResults,
		loading: isLoading || isFetching,
		hasMore: data?.hasMore || false,
		refetch,
	};
};

export default useFetchAnnouncements;
