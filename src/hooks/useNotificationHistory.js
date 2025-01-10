import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Ensure you have the react-toastify library
import keys from "config/keys";
// import webSocketService from "services/WebSocketService";

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
	const [backupList, setBackupList] = useState([]); // Backup list
	const [loading, setLoading] = useState(true);
	const [totalPages, setTotalPages] = useState(0);
	// const [refreshNotification, setRefreshNotification] = useState(false);

	// webSocketService.socket.onmessage = (event) => {
	// 	try {
	// 		const message = JSON.parse(event.data);

	// 		if (message.type === 1 || message.type === 0) {
	// 			setRefreshNotification(true);
	// 			setList([]);
	// 		}
	// 	} catch (error) {
	// 		console.error("Error handling WebSocket message:", error);
	// 	}
	// };

	const getHistory = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(
				`${keys.socketUrl}/history?user_id=${userId}&page=${currentPage}&size=${itemsPerPage}`,
				{ maxRedirects: 0 } // Prevent auto-following redirects
			);

			if (data?.total_announcements > 0) {
				setList((prevList) => [...prevList, ...data.history]);
				// For backup
				setTotalPages(data.total_pages);
				// if (currentPage === 1) {
				// 	setBackupList(data.history);
				// 	console.log("backup", backupList, data.history);
				// }
			} else {
				setList([]); // Clear list if no history
				setTotalPages(0);
			}
		} catch (error) {
			if (error.response?.status === 307) {
				console.log("Redirected to:", error.response.headers.location);
			} else {
				toast.error("Failed to fetch history.");
			}
		} finally {
			setLoading(false);
		}
	};

	// console.log({ backupList });
	// const resetToBackup = () => {
	// 	setList([]);
	// 	console.log({ backupList, list });
	// 	setList(backupList); // Restore the previous state
	// };

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
