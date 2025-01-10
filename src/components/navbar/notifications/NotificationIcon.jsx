import {
	MenuItem,
	Menu,
	MenuButton,
	MenuList,
	IconButton,
	Badge,
} from "@chakra-ui/react";

import React, { useEffect, useRef, useState } from "react";

import useNotificationHistory from "hooks/useNotificationHistory";
import NotificationDropDown from "./NotificaitonDropDown";
import { BellIcon } from "@chakra-ui/icons";
// import { MdNotificationsNone } from "react-icons/md";

const NotificationIcon = ({ userId }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10; // Number of announcements per page
	const [isOpen, setIsOpen] = useState(false);

	const {
		list: notificationList,
		loading,
		totalPages,
	} = useNotificationHistory(userId, currentPage, itemsPerPage);

	const dropdownRef = useRef(null); // Ref for the dropdown component

	const handleOpen = () => {
		console.log({ isOpen });
		setIsOpen((prev) => !prev);
	};

	const handleClose = () => {
		console.log({ isOpen });
		setIsOpen(false);

		// resetToBackup(); // Uncomment if you need to reset state on close
	};

	const handleLoadMore = () => {
		setCurrentPage((prev) => prev + 1);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				handleClose(); // Close the dropdown if clicked outside
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		// <Box position="relative">
		// 	<Box
		// 		boxSize={10}
		// 		bg="brand.500"
		// 		pb={2}
		// 		pt={1}
		// 		pl={2}
		// 		pr={2}
		// 		mx={1}
		// 		sx={{ clipPath: "circle()" }}
		// 		cursor="pointer"
		// 		onClick={handleOpen} // Open dropdown
		// 	>
		// 		<BellIcon boxSize={6} color="white" />
		// 	</Box>
		// 	{/* Red Badge */}
		// 	<Box
		// 		position="absolute"
		// 		top="0"
		// 		right="2"
		// 		boxSize="12px" // Smaller size for a simple red dot
		// 		bg="red.500"
		// 		borderRadius="full"
		// 		zIndex={5}
		// 	/>

		// 	{/* Notification Dropdown */}
		// 	{isOpen && (
		// 		<Box ref={dropdownRef}>
		// 			<NotificationDropDown
		// 				unreadCount={20} // Adjust as needed
		// 				loading={loading}
		// 				notificationList={notificationList}
		// 				loadMoreNotifications={handleLoadMore}
		// 				onClose={handleClose} // Pass onClose to close dropdown
		// 				hideLoadMoreBtn={currentPage === totalPages}
		// 			/>
		// 		</Box>
		// 	)}
		// </Box>
		<Menu>
			<MenuButton
				as={IconButton}
				icon={<BellIcon />}
				variant="solid"
				rounded="full"
				colorScheme="brand"
				aria-label="Notifications"
				position="relative" // Ensures badge is positioned correctly
			>
				{/* Red Badge */}
				<Badge
					colorScheme="red"
					borderRadius="full"
					position="absolute"
					top="-2px" // Adjust based on icon size
					right="-2px" // Adjust based on icon size
					boxSize="8px" // Smaller dot for a clean look
				/>
			</MenuButton>

			<NotificationDropDown
				unreadCount={20}
				loading={loading}
				notificationList={notificationList}
				loadMoreNotifications={handleLoadMore}
				onClose={handleClose}
				hideLoadMoreBtn={currentPage === totalPages}
			/>
		</Menu>
	);
};

export default NotificationIcon;
