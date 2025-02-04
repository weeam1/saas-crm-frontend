import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Ensure you have the react-toastify library
import keys from 'config/keys';
import { useDispatch } from 'react-redux';
import { clearNotifyItem } from './../redux/webSocketReducer';

// const useNotificationHistory = (userId, currentPage, itemsPerPage) => {
// 	const [list, setList] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const [totalPages, setTotalPages] = useState(0);

// 	console.log({ user: userId });

// 	const getHistory = async () => {
// 		setLoading(true);
// 		try {
// 			const { data } = await axios.get(
// 				`${keys.socketUrl}/history?user_id=${userId}&page=${currentPage}&size=${itemsPerPage}`,
// 				{ maxRedirects: 0 } // Prevent auto-following redirects
// 			);

// 			if (data?.total_announcements > 0) {
// 				setList((prevList) => [...prevList, ...data.history]);
// 				setTotalPages(data.total_pages);
// 			} else {
// 				setList([]); // Clear list if no history
// 				setTotalPages(0);
// 			}
// 		} catch (error) {
// 			if (error.response?.status === 307) {
// 				console.log("Redirected to:", error.response.headers.location);
// 			} else {
// 				toast.error("Failed to fetch history.");
// 			}
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	useEffect(() => {
// 		if (userId) {
// 			getHistory();
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [userId, currentPage]);

// 	return { list, loading, totalPages };
// };

const useNotificationHistory = (userId, currentPage, itemsPerPage) => {
	const [list, setList] = useState([]); // Active list
	const [loading, setLoading] = useState(true);
	const [totalPages, setTotalPages] = useState(0);

	const dispatch = useDispatch();

	const getHistory = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(
				`${keys.socketUrl}/history?user_id=${userId}&page=${currentPage}&size=${itemsPerPage}`,
				{ maxRedirects: 0 } // Prevent auto-following redirects
			);

			if (data?.total_items > 0) {
				if (currentPage === 1) {
					setList([]);
					setList(data.history);
				} else setList((prevList) => [...prevList, ...data.history]);

				// For backup
				setTotalPages(data.total_pages);
			} else {
				setList([]); // Clear list if no history
				setTotalPages(0);
			}
		} catch (error) {
			if (error.response?.status === 307) {
				console.log('Redirected to:', error.response.headers.location);
			} else {
				toast.error('Failed to fetch history.');
			}
		} finally {
			setLoading(false);
			dispatch(clearNotifyItem());
		}
	};

	useEffect(() => {
		if (userId) {
			getHistory();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId, currentPage]);

	return {
		list,
		loading,
		totalPages,
		getHistory,
		// resetToBackup,
	};
};

export default useNotificationHistory;
