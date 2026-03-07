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
	notificationCount,
	hasMore,
}) => {
	const users = useSelector((state) => state.user.users);

	return (
		<>
			<MenuList
				w={{ base: '90vw', sm: '80vw', md: '350px', lg: '400px' }}
				minW={{ base: '250px', sm: '280px' }}
				maxH={{ base: '60vh', md: '450px' }}
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
					'&::-webkit-scrollbar-thumb:hover': {
						backgroundColor: 'gray.300',
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
					fontSize={{ base: 'md', md: 'lg' }}
				>
					Notifications
				</Box>

				{/* Notification List */}
				<Box px={{ base: 1, md: 0 }}>
					{notificationList.length > 0 ? (
						<Flex direction='column' gap={{ base: '1', md: '2' }}>
							{notificationList.map((item) => {
								if (!item?.notification) return null;

								return (
									<MenuItem
										key={item._id || item.notification?._id}
										rounded='md'
										p={{ base: 2, md: 2 }}
										_hover={{ bg: 'gray.50' }}
										_focus={{ bg: 'gray.100' }}
									>
										<NotificationBox
											data={item}
											users={users}
											fontSize={{ base: 'sm', md: 'md' }}
										/>
									</MenuItem>
								);
							})}
						</Flex>
					) : (
						<Text
							color='gray.600'
							textAlign='center'
							py={{ base: 4, md: 6 }}
							fontSize={{ base: 'sm', md: 'md' }}
						>
							No notifications
						</Text>
					)}
				</Box>

				{/* Footer */}
				<Box
					p={{ base: 2, md: 3 }}
					textAlign='center'
					borderTop='1px solid'
					borderColor='gray.200'
				>
					{loading ? (
						<Spinner color='brand.400' />
					) : (
						hasMore && (
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
