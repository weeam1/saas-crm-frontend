import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Ensure you have the react-toastify library
import keys from 'config/keys';
import { useDispatch, useSelector } from 'react-redux';
// import { clearNotifyItem } from './../redux/webSocketReducer';
import { useFetchItemsQuery } from 'api/apiSlice';
import {
	updateNotificationList,
	clearNotifyItem,
} from '../redux/notificationSlice';

// const useNotificationHistory = (userId, currentPage, itemsPerPage) => {
// 	const [list, setList] = useState([]); // Active list
// 	const [loading, setLoading] = useState(true);
// 	const [totalPages, setTotalPages] = useState(0);

// 	const dispatch = useDispatch();

// 	const getHistory = useCallback(async () => {
// 		setLoading(true);
// 		try {
// 			const { data } = await axios.get(
// 				`${keys.socketUrl}/history?user_id=${userId}&page=${currentPage}&size=${itemsPerPage}`,
// 				{ maxRedirects: 0 } // Prevent auto-following redirects
// 			);

// 			if (data?.total_items > 0) {
// 				// if (currentPage === 1) {
// 				// 	setList([]);
// 				// 	setList(data.history);
// 				// } else setList((prevList) => [...prevList, ...data.history]);

// 				// // For backup
// 				// setTotalPages(data.total_pages);

// 				setList((prevList) =>
// 					currentPage === 1 ? [...data.history] : [...prevList, ...data.history]
// 				);

// 				setTotalPages(data.total_pages || 0);
// 			} else {
// 				setList([]); // Clear list if no history
// 				setTotalPages(0);
// 			}
// 		} catch (error) {
// 			if (error.response?.status === 307) {
// 			} else {
// 				toast.error('Failed to fetch history.');
// 			}
// 		} finally {
// 			setLoading(false);
// 			dispatch(clearNotifyItem());
// 		}
// 	}, [userId, currentPage, dispatch]);

// 	useEffect(() => {
// 		if (userId) {
// 			getHistory();
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [userId, currentPage]);

// 	return {
// 		list,
// 		loading,
// 		totalPages,
// 		getHistory,
// 		// resetToBackup,
// 	};
// };

// const useNotificationHistory = (userId, currentPage, itemsPerPage) => {
// 	const dispatch = useDispatch();

// 	const queryParams = useMemo(
// 		() => ({
// 			receiver: userId,
// 			page: currentPage,
// 			limit: itemsPerPage,
// 		}),
// 		[userId, currentPage, itemsPerPage],
// 	);

// 	const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
// 		{ path: '/notifications', params: queryParams },
// 		{
// 			skip: !userId,
// 			refetchOnMountOrArgChange: true,
// 			refetchOnFocus: true,
// 		},
// 	);

// 	const list = data?.history || [];
// 	const totalPages = data?.total_pages || 0;

// 	// clear "new notification" badge after fetch
// 	useEffect(() => {
// 		if (data) {
// 			dispatch(clearNotifyItem());
// 		}
// 	}, [data, dispatch]);

// 	return {
// 		list,
// 		loading: isLoading || isFetching,
// 		totalPages,
// 		refetch,
// 	};
// };

const useNotificationHistory = (userId, currentPage, itemsPerPage) => {
	const dispatch = useDispatch();

	// Read notifications from Redux
	const list = useSelector((state) => state.notifications.list);
	const hasNew = useSelector((state) => state.notifications.hasNew);

	const queryParams = useMemo(
		() => ({
			receiver: userId,
			page: currentPage,
			limit: itemsPerPage,
		}),
		[userId, currentPage, itemsPerPage],
	);

	const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
		{ path: '/notifications', params: queryParams },
		{
			skip: !userId,
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
		},
	);

	useEffect(() => {
		if (!data?.doc) return;

		dispatch(
			updateNotificationList({
				notifications: data.doc,
				append: currentPage > 1,
			}),
		);

		dispatch(clearNotifyItem());
	}, [data, currentPage, dispatch]);

	// auto refetch when new notification flag appears
	useEffect(() => {
		if (hasNew) {
			refetch();
		}
	}, [hasNew, refetch]);

	return {
		list,
		totalPages: data?.total_pages || 0,
		loading: isLoading || isFetching,
		refetch,
	};
};

export default useNotificationHistory;
