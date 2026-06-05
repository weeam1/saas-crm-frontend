// import React, { useState } from 'react';

// import { toast } from 'react-toastify';
// import AnnouncementList from './AnnouncementList';
// import useFetchAnnouncements from 'hooks/useFetchAnnouncements';
// import useUserSession from "hooks/useUserSession";

// const History = () => {
// 	const { user } = useUserSession();
// 	const [currentPage, setCurrentPage] = useState(1);
// 	const itemsPerPage = 10; // Number of announcements per page

// 	// Use the custom hook
// 	const { list, loading, totalPages, totalResults } = useFetchAnnouncements(
// 		user?._id,
// 		currentPage,
// 		itemsPerPage
// 	);

// 	const handleViewMore = () => {
// 		setCurrentPage((prevPage) => prevPage + 1);
// 	};

// 	const handleCopy = (message) => {
// 		navigator.clipboard.writeText(message).then(() => {
// 			toast.success('The message has been copied successfully.');
// 		});
// 	};

// 	return (
// 		<AnnouncementList
// 			loading={loading}
// 			list={list}
// 			currentPage={currentPage}
// 			totalPages={totalPages}
// 			totalResults={totalResults}
// 			handleCopy={handleCopy}
// 			handleViewMore={handleViewMore}
// 		/>
// 	);
// };

// export default History;

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import AnnouncementList from './AnnouncementList';
import useFetchAnnouncements from 'hooks/useFetchAnnouncements';
import useUserSession from "hooks/useUserSession";

const History = () => {
	const { user } = useUserSession();
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10); // Number of announcements per page

	// Use the custom hook
	const { 
		list, 
		loading, 
		totalPages, 
		totalResults,
		refetch,
		isFetching 
	} = useFetchAnnouncements(
		user?._id,
		currentPage,
		pageSize
	);

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const handlePageSizeChange = (newSize) => {
		setPageSize(newSize);
		setCurrentPage(1); // Reset to first page when changing page size
	};

	const handleCopy = (message) => {
		navigator.clipboard.writeText(message).then(() => {
			toast.success('The message has been copied successfully.');
		});
	};

	return (
		<AnnouncementList
			loading={loading}
			list={list}
			currentPage={currentPage}
			totalPages={totalPages}
			totalResults={totalResults}
			pageSize={pageSize}
			handleCopy={handleCopy}
			handlePageChange={handlePageChange}
			handlePageSizeChange={handlePageSizeChange}
			refetch={refetch}
			isRefetching={isFetching}
		/>
	);
};

export default History;