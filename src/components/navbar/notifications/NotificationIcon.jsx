import { Menu, MenuButton, IconButton, Badge } from '@chakra-ui/react';

import React, { useEffect, useRef, useState, useCallback } from 'react';

import useNotificationHistory from 'hooks/useNotificationHistory';
import NotificationDropDown from './NotificaitonDropDown';
import { BellIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';

const NotificationIcon = React.forwardRef(({ userId }, ref) => {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10; // Number of announcements per page
	const [isOpen, setIsOpen] = useState(false);

	const {
		list: notificationList,
		loading,
		totalPages,
		getHistory,
	} = useNotificationHistory(userId, currentPage, itemsPerPage);

	const newNotifyItem = useSelector((state) => state.webSocket.newNotifyItem);

	// Using useCallback to memoize getHistory call
	const fetchNotifications = useCallback(() => {
		if (newNotifyItem.type !== -1) {
			setCurrentPage(1);
			getHistory();
		}
	}, [getHistory, newNotifyItem.type]);

	useEffect(() => {
		fetchNotifications();
	}, [fetchNotifications]);

	const dropdownRef = useRef(null); // Ref for the dropdown component

	// const handleOpen = () => {
	// 	setIsOpen((prev) => !prev);
	// };

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	const handleLoadMore = () => {
		setCurrentPage((prev) => prev + 1);
	};

	const handleClickOutside = useCallback(
		(event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				handleClose(); // Close the dropdown if clicked outside
			}
		},
		[handleClose]
	);

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [handleClickOutside]);

	return (
		<Menu ref={ref}>
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
				// ref={dropdownRef} // Pass ref to NotificationDropDown if needed
			/>
		</Menu>
	);
});

export default NotificationIcon;
