import {
	Box,
	Button,
	Flex,
	MenuList,
	MenuItem,
	Spinner,
	Text,
} from '@chakra-ui/react';
import NotificationBox from './NotificationBox';
import { useSelector } from 'react-redux';

const NotificationDropDown = ({
	unreadCount,
	loading,
	notificationList,
	loadMoreNotifications,
	hideLoadMoreBtn,
}) => {
	const users = useSelector((state) => state.user.users);

	return (
		<>
			<MenuList
				w={{ base: '80%', md: '350px' }}
				minW='250px'
				maxH='450px'
				overflowY='auto'
				sx={{
					'&::-webkit-scrollbar': {
						width: '8px',
						transition: 'opacity 0.3s',
					},
					'&:hover::-webkit-scrollbar': {
						opacity: 1,
					},
					'&::-webkit-scrollbar-thumb': {
						backgroundColor: 'gray.200',
						borderRadius: '4px',
					},
				}}
			>
				{/* Header */}
				<Box
					fontWeight='bold'
					bg='white'
					color='brand.600'
					p={2}
					borderBottom='1px solid'
					borderColor='gray.200'
				>
					Notifications
				</Box>

				{/* Notification List */}
				<Box>
					{notificationList.length > 0 ? (
						<Flex direction='column' gap='1'>
							{notificationList.map((notification, index) => (
								<MenuItem key={index} rounded='md'>
									<NotificationBox notification={notification} users={users} />
								</MenuItem>
							))}
						</Flex>
					) : (
						<Text color='gray.800' textAlign='center'>
							No notifications
						</Text>
					)}
				</Box>

				{/* Footer */}
				<Box
					p={2}
					textAlign='center'
					borderTop='1px solid'
					borderColor='gray.200'
				>
					{loading ? (
						<Spinner color='brand.400' />
					) : (
						notificationList.length > 0 &&
						!hideLoadMoreBtn && (
							<Button
								size='sm'
								colorScheme='gray'
								onClick={loadMoreNotifications}
							>
								Load More
							</Button>
						)
					)}
				</Box>
			</MenuList>
		</>
	);
};

export default NotificationDropDown;
