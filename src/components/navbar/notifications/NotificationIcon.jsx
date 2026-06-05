import { Menu, MenuButton, IconButton, Badge, Box } from '@chakra-ui/react';
import React, { useEffect, useRef, useState, useCallback } from 'react';

import useNotificationHistory from 'hooks/notification/useNotificationHistory';
import NotificationDropDown from './NotificaitonDropDown';
import { BellIcon } from '@chakra-ui/icons';
// import { useSelector } from 'react-redux';
// import { getNotificationCount } from 'api';

const NotificationIcon = React.forwardRef(({ userId }, ref) => {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const [isOpen, setIsOpen] = useState(false);
	// const [notificationCount, setNotificationCount] = useState(0);

	const {
		list: notificationList,
		unreadNotificationCount,
		loading,
		hasMore,
		totalPages,
		getHistory,
	} = useNotificationHistory(userId, currentPage, itemsPerPage);

	// const newNotifyItem = useSelector((state) => state.webSocket.newNotifyItem);

	// Using useCallback to memoize getHistory call
	// const fetchNotifications = useCallback(() => {
	// 	const getCount = async () => {
	// 		const data = await getNotificationCount(userId);
	// 		setNotificationCount(data?.count ?? 0);
	// 	};

	// 	if (newNotifyItem.type !== -1) {
	// 		setCurrentPage(1);
	// 		getHistory();

	// 		getCount();
	// 	}
	// }, [getHistory, newNotifyItem.type, userId]);

	// useEffect(() => {
	// 	fetchNotifications();
	// }, [fetchNotifications]);

	const dropdownRef = useRef(null);

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
		[handleClose],
	);

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [handleClickOutside]);

	return (
		<Menu ref={ref}>
			<Box position='relative' display='inline-block'>
				<MenuButton
					as={IconButton}
					icon={<BellIcon />}
					variant='solid'
					rounded='full'
					colorScheme='brand'
					aria-label='Notifications'
				/>
				{unreadNotificationCount > 0 && (
					<Badge
						bg='red.400'
						color='white'
						rounded='full'
						position='absolute'
						top='-8px'
						right='-8px'
						fontSize='.7em'
						p='2'
					>
						{unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
					</Badge>
				)}
			</Box>

			<NotificationDropDown
				unreadCount={unreadNotificationCount}
				loading={loading}
				notificationList={notificationList}
				notificationCount={unreadNotificationCount}
				loadMoreNotifications={handleLoadMore}
				onClose={handleClose}
				hideLoadMoreBtn={currentPage === totalPages}
				hasMore={hasMore}
			/>
		</Menu>
	);
});

export default NotificationIcon;
