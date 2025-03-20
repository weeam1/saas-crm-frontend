import { Box, Flex, Text, IconButton, Tooltip } from '@chakra-ui/react';
import Loader from 'components/loading/Loader';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import NoData from 'views/admin/lead-v2/components/subComponents/NoData';

const UserList = ({
	users,
	usersLoading,
	usersFetching,
	specialUsers,
	setSelectedUser,
	setCheckinTime,
	setCheckoutTime,
	setSpecialUsers,
}) => {
	const handleEditClick = (user) => {
		setSelectedUser(user);
		const specialUser = specialUsers.find((su) => su.user === user._id);

		setCheckinTime(specialUser?.specialTiming.checkinTime || '10:00 AM');
		setCheckoutTime(specialUser?.specialTiming.checkoutTime || '07:00 PM');
	};

	const handleRemove = (user) => {
		if (!user) return;

		setSpecialUsers((prev) => {
			const exists = prev.some((su) => su.user === user._id);
			return exists ? prev.filter((su) => su.user !== user._id) : prev;
		});

		setSelectedUser(null);
	};

	return (
		<Box
			overflowY='scroll'
			maxH={{ base: '200px', md: '400px' }}
			w='100%'
			p={2}
			borderRadius='md'
		>
			{usersLoading || usersFetching ? (
				<Loader />
			) : users?.results > 0 ? (
				users?.doc?.map((item, index) => {
					const isSpecialUser = specialUsers.find((u) => u.user === item._id);

					return (
						<Flex
							key={index}
							align='center'
							justify='space-between'
							p={2}
							borderRadius='md'
							mb={2}
							bg='white'
							boxShadow={{ base: 'none', md: 'sm' }}
							flexDirection={{ base: 'column', sm: 'row' }}
							gap={{ base: 2, sm: 0 }}
						>
							<Box textAlign={{ base: 'center', sm: 'left' }}>
								<Text fontWeight='400' fontSize={{ base: '14px', md: '12px' }}>
									{item.fullName}
								</Text>
								<Text
									fontWeight='400'
									fontSize={{ base: '12px', md: '12px' }}
									color='#666666'
								>
									{item.username}
								</Text>
							</Box>
							<Flex gap={2}>
								{isSpecialUser && (
									<Tooltip label='Remove User' hasArrow>
										<IconButton
											aria-label='Remove User'
											icon={<MdDelete />}
											size='sm'
											color='white'
											variant='ghost'
											borderRadius='100%'
											bg='red.400'
											_hover={{ bg: 'red.500' }}
											onClick={() => handleRemove(item)}
										/>
									</Tooltip>
								)}

								<Tooltip label='Edit User' hasArrow>
									<IconButton
										aria-label='Edit User'
										icon={<FaEdit />}
										size='sm'
										color='white'
										variant='ghost'
										borderRadius='100%'
										bg='brand.200'
										_hover={{ bg: 'brand.300' }}
										onClick={() => handleEditClick(item)}
									/>
								</Tooltip>
							</Flex>
						</Flex>
					);
				})
			) : (
				<NoData label='employees' />
			)}
		</Box>
	);
};

export default UserList;
