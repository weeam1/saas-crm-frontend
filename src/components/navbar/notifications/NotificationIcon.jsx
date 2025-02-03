import { Menu, MenuButton, IconButton, Badge } from '@chakra-ui/react';

import React, { useEffect, useRef, useState } from 'react';

import useNotificationHistory from 'hooks/useNotificationHistory';
import NotificationDropDown from './NotificaitonDropDown';
import { BellIcon } from '@chakra-ui/icons';
// import webSocketService from 'services/WebSocketService';
import { useSelector } from 'react-redux';
// import { MdNotificationsNone } from "react-icons/md";

const NotificationIcon = ({ userId }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10; // Number of announcements per page
	const [isOpen, setIsOpen] = useState(false);

	const {
		list: notificationList,
		loading,
		totalPages,
		getHistory,
	} = useNotificationHistory(userId, currentPage, itemsPerPage);

	// const newNotification = useSelector(
	// 	(state) => state.webSocket.newNotification
	// );

	// useEffect(() => {
	// 	if (newNotification.status === true) {
	// 		setCurrentPage(1);
	// 		getHistory();
	// 	}
	// }, [getHistory, newNotification.status]);

	const dropdownRef = useRef(null); // Ref for the dropdown component

	const handleOpen = () => {
		console.log({ isOpen });
		setIsOpen((prev) => !prev);
	};

	const handleClose = () => {
		console.log({ isOpen });
		setIsOpen(false);
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

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<Menu>
			<MenuButton
				as={IconButton}
				icon={<BellIcon />}
				variant='solid'
				rounded='full'
				colorScheme='brand'
				aria-label='Notifications'
				position='relative' // Ensures badge is positioned correctly
			>
				{/* Red Badge */}
				<Badge
					colorScheme='red'
					borderRadius='full'
					position='absolute'
					top='-2px' // Adjust based on icon size
					right='-2px' // Adjust based on icon size
					boxSize='8px' // Smaller dot for a clean look
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

// const NotificationIcon = ({ userId }) => {
// 	const [currentPage, setCurrentPage] = useState(1);
// 	const itemsPerPage = 10;
// 	const [isOpen, setIsOpen] = useState(false);

// 	const { list, loading, totalPages, getHistory } = useNotificationHistory(
// 		userId,
// 		currentPage,
// 		itemsPerPage
// 	);

// 	useEffect(() => {
// 		webSocketService.socket.onmessage = (event) => {
// 			try {
// 				const message = JSON.parse(event.data);
// 				if (message.data.message) {
// 					setCurrentPage(1);
// 					getHistory();
// 				}
// 			} catch (error) {
// 				console.error('Error handling WebSocket message:', error);
// 			}
// 		};
// 	}, [getHistory]);

// 	const dropdownRef = useRef(null);

// 	const handleOpen = () => {
// 		setIsOpen((prev) => !prev);

// 		// Fetch notifications when opening
// 		// if (!isOpen) {
// 		// 	getHistory();
// 		// }
// 	};

// 	const handleClose = () => setIsOpen(false);

// 	const handleLoadMore = () => {
// 		setCurrentPage((prev) => prev + 1);
// 		getHistory();
// 	};

// 	useEffect(() => {
// 		const handleClickOutside = (event) => {
// 			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
// 				handleClose();
// 			}
// 		};

// 		document.addEventListener('mousedown', handleClickOutside);
// 		return () => document.removeEventListener('mousedown', handleClickOutside);
// 	}, []);

// 	return (
// 		<Menu>
// 			<MenuButton
// 				as={IconButton}
// 				icon={<BellIcon />}
// 				variant='solid'
// 				rounded='full'
// 				colorScheme='brand'
// 				aria-label='Notifications'
// 				position='relative'
// 				// onClick={handleOpen}
// 			>
// 				<Badge
// 					colorScheme='red'
// 					borderRadius='full'
// 					position='absolute'
// 					top='-2px'
// 					right='-2px'
// 					boxSize='8px'
// 				/>
// 			</MenuButton>

// 			{isOpen && (
// 				<NotificationDropDown
// 					unreadCount={list.length}
// 					loading={loading}
// 					notificationList={list}
// 					loadMoreNotifications={handleLoadMore}
// 					onClose={handleClose}
// 					hideLoadMoreBtn={currentPage === totalPages}
// 				/>
// 			)}
// 		</Menu>
// 	);
// };

export default NotificationIcon;
