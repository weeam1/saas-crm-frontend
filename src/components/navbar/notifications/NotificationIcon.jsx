import { Menu, MenuButton, IconButton, Badge, Box } from '@chakra-ui/react';

import React, { useEffect, useRef, useState, useCallback } from 'react';

import useNotificationHistory from 'hooks/useNotificationHistory';
import NotificationDropDown from './NotificaitonDropDown';
import { BellIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import { getNotificationCount } from 'api';

const NotificationIcon = React.forwardRef(({ userId }, ref) => {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10; // Number of announcements per page
	const [isOpen, setIsOpen] = useState(false);
	const [notificationCount, setNotificationCount] = useState(0);

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
		[handleClose]
	);

	useEffect(() => {
		const getCount = async () => {
			const data = await getNotificationCount(userId);
			setNotificationCount(data?.count ?? 0);
		};

		getCount();
	}, [userId, newNotifyItem.type]);

	console.log({ notificationCount });

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [handleClickOutside]);

	return (
		<Menu ref={ref}>
			{/* <MenuButton
				as={IconButton}
				icon={<BellIcon />}
				variant='solid'
				rounded='full'
				colorScheme='brand'
				aria-label='Notifications'
				position='relative' // Ensures badge is positioned correctly
			>
				{notificationCount > 0 && (
					<Badge
						colorScheme='red'
						borderRadius='full'
						position='absolute'
						top='2px'
						right='2px'
						fontSize='0.8em'
						px='2'
						py='0.5'
					>
						{notificationCount}
					</Badge>
				)}
			</MenuButton> */}

			<Box position='relative' display='inline-block'>
				<MenuButton
					as={IconButton}
					icon={<BellIcon />}
					variant='solid'
					rounded='full'
					colorScheme='brand'
					aria-label='Notifications'
				/>
				{notificationCount > 0 && (
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
						{notificationCount}
					</Badge>
				)}
			</Box>

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
});

export default NotificationIcon;
