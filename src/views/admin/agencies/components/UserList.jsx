import { Box, Flex, Text, IconButton, Tooltip } from '@chakra-ui/react';
import { useUpdateItemMutation } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import ConfirmationModal from 'components/Message/ConfirmationModal';
import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import NoData from 'views/admin/lead-v2/components/subComponents/NoData';

const UserList = ({
	agencyId,
	users,
	usersLoading,
	usersFetching,
	specialUsers,
	setSelectedUser,
	setCheckinTime,
	setCheckoutTime,
	setSpecialUsers,
}) => {
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [userId, setUserId] = useState(null);

	const handleEditClick = (user) => {
		setSelectedUser(user);
		const specialUser = specialUsers.find((su) => su.user === user._id);

		setCheckinTime(specialUser?.specialTiming.checkinTime || '10:00 AM');
		setCheckoutTime(specialUser?.specialTiming.checkoutTime || '07:00 PM');
	};

	const [updateItemMutation] = useUpdateItemMutation();

	const handleRemove = async () => {
		if (!userId) return;

		// Update state and get the latest specialUsers
		let updatedSpecialUsers;
		setSpecialUsers((prev) => {
			updatedSpecialUsers = prev.filter((su) => su.user !== userId);
			return updatedSpecialUsers;
		});

		try {
			await updateItemMutation({
				path: `/attendance/office-settings/${agencyId}`,
				body: { specialUsers: updatedSpecialUsers },
			}).unwrap();

			toast.success('Special Users updated successfully');
		} catch (error) {
			console.error(error);
			toast.error(error?.data?.message || 'Special Users not updated!');
		} finally {
			setDeleteModalOpen(false);
			setSelectedUser(null);
		}
	};

	const handleDelete = (id) => {
		setDeleteModalOpen(true);
		setUserId(id);
	};

	return (
		<>
			<Box
				overflowY='scroll'
				maxH={{ base: '400px', md: '400px' }}
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
									<Text
										fontWeight='400'
										fontSize={{ base: '14px', md: '12px' }}
									>
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
												onClick={() => handleDelete(item._id)}
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

			<ConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setDeleteModalOpen(false);
					setUserId(null);
				}}
				onConfirm={handleRemove}
				title='Remove Special User'
				message='Are you sure you want to remove this user from the special users list?'
				confirmText='Yes, Remove'
				cancelText='Cancel'
			/>
		</>
	);
};

export default UserList;
