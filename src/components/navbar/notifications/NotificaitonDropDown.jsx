import {
	Box,
	Button,
	Flex,
	MenuList,
	MenuItem,
	Spinner,
	Badge,
	Text,
} from '@chakra-ui/react';
import NotificationBox from './NotificationBox';
import { useSelector } from 'react-redux';

// const NotificationDropDown = ({
// 	unreadCount,
// 	loading,
// 	notificationList,
// 	loadMoreNotifications,
// 	hideLoadMoreBtn,
// 	notificationCount,
// 	hasMore,
// }) => {
// 	const users = useSelector((state) => state.user.users);

// 	return (
// 		<>
// 			<MenuList
// 				w={{ base: '90vw', sm: '80vw', md: '350px', lg: '400px' }}
// 				minW={{ base: '250px', sm: '280px' }}
// 				maxH={{ base: '60vh', md: '450px' }}
// 				overflowY='auto'
// 				sx={{
// 					'&::-webkit-scrollbar': {
// 						width: '8px',
// 						transition: 'opacity 0.3s',
// 					},
// 					'&:hover::-webkit-scrollbar': {
// 						opacity: 1,
// 					},
// 					'&::-webkit-scrollbar-thumb': {
// 						backgroundColor: 'gray.200',
// 						borderRadius: '4px',
// 					},
// 					'&::-webkit-scrollbar-thumb:hover': {
// 						backgroundColor: 'gray.300',
// 					},
// 				}}
// 			>
// 				{/* Header */}
// 				<Box
// 					fontWeight='bold'
// 					// bg='brand.500'
// 					color='gold.400'
// 					p={2}
// 					borderBottom='1px solid'
// 					borderColor='gold.400'
// 					fontSize={{ base: 'md', md: 'lg' }}
// 				>
// 					Notifications
// 				</Box>

// 				{/* Notification List */}
// 				<Box px={{ base: 1, md: 0 }}>
// 					{notificationList.length > 0 ? (
// 						<Flex direction='column' gap={{ base: '1', md: '2' }}>
// 							{notificationList.map((item) => {
// 								if (!item?.notification) return null;

// 								return (
// 									<MenuItem
// 										key={item._id || item.notification?._id}
// 										rounded='md'
// 										p={{ base: 2, md: 2 }}
// 										_hover={{ bg: 'gray.50' }}
// 										_focus={{ bg: 'gray.100' }}
// 									>
// 										<NotificationBox
// 											data={item}
// 											users={users}
// 											fontSize={{ base: 'sm', md: 'md' }}
// 										/>
// 									</MenuItem>
// 								);
// 							})}
// 						</Flex>
// 					) : (
// 						<Text
// 							color='gray.600'
// 							textAlign='center'
// 							py={{ base: 4, md: 6 }}
// 							fontSize={{ base: 'sm', md: 'md' }}
// 						>
// 							No notifications
// 						</Text>
// 					)}
// 				</Box>

// 				{/* Footer */}
// 				<Box
// 					p={{ base: 2, md: 3 }}
// 					textAlign='center'
// 					borderTop='1px solid'
// 					borderColor='gray.200'
// 				>
// 					{loading ? (
// 						<Spinner color='brand.400' />
// 					) : (
// 						hasMore && (
// 							<Button
// 								size='sm'
// 								colorScheme='gray'
// 								onClick={loadMoreNotifications}
// 							>
// 								Load More
// 							</Button>
// 						)
// 					)}
// 				</Box>
// 			</MenuList>
// 		</>
// 	);
// };

// export default NotificationDropDown;

const NotificationDropDown = ({
	unreadCount,
	loading,
	notificationList,
	loadMoreNotifications,
	hasMore,
}) => {
	const users = useSelector((state) => state.user.users);

	return (
		<MenuList
			// border='1px solid'
			// borderColor='brand.400'
			borderRadius='20px'
			bg='bg.surface'
			boxShadow='card'
			p='0'
			overflow='hidden'
			w={{ base: '95vw', sm: '380px', md: '420px' }}
			maxW='420px'
			maxH='75vh'
			zIndex={999}
		>
			{/* HEADER */}
			<Flex
				align='center'
				justify='space-between'
				px={5}
				py={4}
				borderBottom='1px solid'
				borderColor='border.subtle'
				bg='rgba(212, 175, 55, 0.03)'
				backdropFilter='blur(12px)'
				position='sticky'
				top='0'
				zIndex='1'
			>
				<Box>
					<Text
						fontSize='lg'
						fontWeight='bold'
						color='text.heading'
						letterSpacing='tight'
					>
						Notifications
					</Text>

					<Text fontSize='xs' color='text.muted' mt='0.5'>
						{unreadCount || 0} unread notifications
					</Text>
				</Box>

				{unreadCount > 0 && (
					<Badge
						variant='gold'
						px={2.5}
						py={1}
						fontSize='11px'
						borderRadius='full'
					>
						{unreadCount}
					</Badge>
				)}
			</Flex>

			{/* NOTIFICATIONS */}
			<Box
				maxH='calc(75vh - 140px)'
				overflowY='auto'
				sx={{
					'&::-webkit-scrollbar': {
						width: '6px',
					},
					'&::-webkit-scrollbar-track': {
						background: 'transparent',
					},
					'&::-webkit-scrollbar-thumb': {
						background: '#1E3D5C',
						borderRadius: '10px',
					},
					'&::-webkit-scrollbar-thumb:hover': {
						background: '#2E5C87',
					},
				}}
			>
				{notificationList?.length > 0 ? (
					<Flex direction='column' p={2} gap={2}>
						{notificationList.map((item, index) => {
							if (!item?.notification) return null;

							const isUnread = !item?.isRead;

							return (
								<Box
									key={item?._id || item?.notification?._id || index}
									position='relative'
									borderRadius='xl'
									bg={isUnread ? 'rgba(212, 175, 55, 0.05)' : 'transparent'}
									border='1px solid'
									borderColor={
										isUnread ? 'rgba(212,175,55,0.15)' : 'transparent'
									}
									transition='all .25s ease'
									_hover={{
										bg: 'bg.elevated',
										transform: 'translateY(-1px)',
										borderColor: 'border.default',
									}}
									cursor='pointer'
								>
									{/* unread dot */}
									{isUnread && (
										<Box
											position='absolute'
											top='18px'
											left='12px'
											w='8px'
											h='8px'
											borderRadius='full'
											bg='gold.primary'
											boxShadow='0 0 10px rgba(212,175,55,0.7)'
										/>
									)}

									<Box pl={isUnread ? 6 : 2} pr={2} py={2}>
										<NotificationBox data={item} users={users} />
									</Box>
								</Box>
							);
						})}
					</Flex>
				) : (
					<Flex
						direction='column'
						align='center'
						justify='center'
						py={14}
						px={6}
						textAlign='center'
					>
						<Box
							w='70px'
							h='70px'
							borderRadius='full'
							bg='rgba(212, 175, 55, 0.08)'
							display='flex'
							alignItems='center'
							justifyContent='center'
							mb={4}
							fontSize='28px'
						>
							🔔
						</Box>

						<Text fontSize='md' fontWeight='semibold' color='text.heading'>
							No notifications yet
						</Text>

						<Text
							fontSize='sm'
							color='text.muted'
							mt={1}
							maxW='240px'
							lineHeight='1.6'
						>
							New updates, activities, and alerts will appear here.
						</Text>
					</Flex>
				)}
			</Box>

			{/* FOOTER */}
			<Box
				borderTop='1px solid'
				borderColor='border.subtle'
				p={3}
				bg='rgba(255,255,255,0.01)'
				backdropFilter='blur(10px)'
			>
				{loading ? (
					<Flex align='center' justify='center' py={2}>
						<Spinner
							thickness='3px'
							speed='0.65s'
							emptyColor='navy.600'
							color='gold.primary'
							size='md'
						/>
					</Flex>
				) : (
					hasMore && (
						<Button
							w='100%'
							variant='outline'
							size='sm'
							onClick={loadMoreNotifications}
							fontWeight='semibold'
							_hover={{
								bg: 'rgba(212, 175, 55, 0.08)',
							}}
						>
							Load More Notifications
						</Button>
					)
				)}
			</Box>
		</MenuList>
	);
};

export default NotificationDropDown;
