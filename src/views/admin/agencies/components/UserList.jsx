import { Box, Flex, Text, IconButton } from '@chakra-ui/react';
import Loader from 'components/loading/Loader';
import { BiX } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa';

const UserList = ({
	users,
	usersLoading,
	usersFetching,
	specialUsers,
	setSpecialUsers,
}) => {
	const handleEditClick = (id, action) => {
		setSpecialUsers((prev) => {
			if (action === 'add') {
				// Add the ID only if it doesn't exist
				return prev.includes(id) ? prev : [...prev, id];
			} else if (action === 'remove') {
				// Remove the ID if it exists
				return prev.filter((userId) => userId !== id);
			}
			return prev;
		});
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
					const isSpecialUser = specialUsers.includes(item._id);

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
								{isSpecialUser ? (
									<IconButton
										aria-label='Remove User'
										icon={<BiX size='24' />}
										size='sm'
										color='white'
										variant='ghost'
										borderRadius='100%'
										bg='red.400'
										_hover={{ bg: 'red.500' }}
										onClick={() => handleEditClick(item._id, 'remove')}
									/>
								) : (
									<IconButton
										aria-label='Add User'
										icon={<FaPlus />}
										size='sm'
										color='white'
										variant='ghost'
										borderRadius='100%'
										bg='green.400'
										_hover={{ bg: 'green.500' }}
										onClick={() => handleEditClick(item._id, 'add')}
									/>
								)}
							</Flex>
						</Flex>
					);
				})
			) : (
				<Text>Employees not found!</Text>
			)}
		</Box>
	);
};

export default UserList;
