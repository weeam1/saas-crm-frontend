import { Box } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

import useNotificationHistory from "hooks/useNotificationHistory";
import NotificationDropDown from "./NotificaitonDropDown";
import { BellIcon } from "@chakra-ui/icons";
// import { MdNotificationsNone } from "react-icons/md";

const NotificationIcon = ({ userId }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10; // Number of announcements per page
	// notificaiton drop down
	const [isOpen, setIsOpen] = useState(false);

	const {
		list: notificationList,
		loading,
		totalPages,
		// resetToBackup,
	} = useNotificationHistory(userId, currentPage, itemsPerPage);

	const dropdownRef = useRef(null); // Create a ref to the dropdown component

	const handleOpen = () => {
		setIsOpen(true);
	};

	const handleClose = () => {
		setIsOpen(false);
		// resetToBackup(); // Reset to backup on close
	};

	const handleLoadMore = () => {
		setCurrentPage((prev) => prev + 1);
	};

	useEffect(() => {
		// Function to handle clicks outside of the dropdown
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				handleClose(); // Close the dropdown if clicked outside
			}
		};

		// Add event listener
		document.addEventListener("mousedown", handleClickOutside);

		// Cleanup event listener on component unmount
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Box position="relative">
			{/* <Box position="relative"> */}
			<Box
				boxSize={10}
				bg="brand.500"
				pb={2}
				pt={1}
				pl={2}
				pr={2}
				mx={1}
				sx={{ clipPath: "circle()" }}
				cursor="pointer"
				onClick={handleOpen} // Open dropdown
			>
				<BellIcon boxSize={6} color="white" />
			</Box>
			{/* Red Badge */}
			<Box
				position="absolute"
				top="0"
				right="2"
				boxSize="12px" // Smaller size for a simple red dot
				bg="red.500"
				borderRadius="full"
				zIndex={5}
			/>

			{/* Notification Dropdown */}
			{isOpen && (
				<Box ref={dropdownRef}>
					<NotificationDropDown
						unreadCount={20}
						loading={loading}
						notificationList={notificationList}
						loadMoreNotifications={handleLoadMore}
						onClose={handleClose} // Pass onClose to close dropdown
						hideLoadMoreBtn={currentPage === totalPages}
					/>
				</Box>
			)}
		</Box>
	);
};

export default NotificationIcon;
