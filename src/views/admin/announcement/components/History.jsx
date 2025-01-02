import React, { useState } from "react";

import { toast } from "react-toastify";
import AnnouncementList from "./AnnouncementList";
import useFetchAnnouncements from "hooks/useFetchAnnouncements";

const History = ({ user }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10; // Number of announcements per page

	// Use the custom hook
	const { list, loading } = useFetchAnnouncements(
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
