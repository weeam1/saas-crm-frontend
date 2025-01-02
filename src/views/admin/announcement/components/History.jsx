import {
	Box,
	CircularProgress,
	Text,
	Flex,
	Badge,
	IconButton,
} from "@chakra-ui/react";
import axios from "axios";
import keys from "config/keys";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import AnnouncementList from "./AnnouncementList";
import useFetchAnnouncements from "hooks/useFetchAnnouncements";

const History = ({ user }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10; // Number of announcements per page

	// const getAnnouncements = async () => {
	// 	setLoading(true);
	// 	try {
	// 		const { data } = await axios.get(
	// 			`${keys.socketUrl}/posted_announcements?user_id=${user._id}&page=${currentPage}&size=${itemsPerPage}`,
	// 			{ maxRedirects: 0 } // Prevent auto-following redirects
	// 		);

	// 		console.log(data);

	// 		if (data?.total_announcements > 0) {
	// 			setList(data.announcements);
	// 			setTotalPages(data.totalPages);
	// 		}
	// 	} catch (error) {
	// 		if (error.response?.status === 307) {
	// 			console.log("Redirected to:", error.response.headers.location);
	// 		} else {
	// 			toast.error("Failed to fetch announcements:", error);
	// 		}
	// 	}
	// 	setLoading(false);
	// };

	// Use the custom hook
	const { list, loading, totalPages } = useFetchAnnouncements(
		user?._id,
		currentPage,
		itemsPerPage
	);

	const handleViewMore = () => {
		setCurrentPage((prevPage) => prevPage + 1);
	};

	const handleCopy = (message) => {
		navigator.clipboard.writeText(message).then(() => {
			toast.success("The message has been copied successfully.");
		});
	};

	return (
		<AnnouncementList
			loading={loading}
			list={list}
			handleCopy={handleCopy}
			handleViewMore={handleViewMore}
		/>
	);
};

export default History;
