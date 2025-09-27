import React from 'react';
import { Box, Flex, Text, Divider, VStack } from '@chakra-ui/react';

import { useDispatch, useSelector } from 'react-redux';
import UserAvatar from 'components/shared/UserAvatar';
import { setActiveChat } from '../../../../redux/whatsappSlice';
import { formatLastMessageTime } from 'utils/helpers';

const UserList = ({ contacts, isMobile, onClose, sidebarBg }) => {
	const activeChat = useSelector((state) => state.whatsapp.activeChat || null);

	const dispatch = useDispatch();

	const handleActiveChat = (user) => {
		dispatch(setActiveChat(user));
		if (isMobile) onClose();
	};

	return (
		<Box overflowY='auto' h='calc(100% - 120px)' bg={sidebarBg}>
			{contacts?.length > 0 ? (
				contacts?.map((user, i) => (
					<React.Fragment key={i || user.roomId}>
						<Flex
							p={3}
							align='center'
							cursor='pointer'
							bg={
								activeChat?.phoneNumber === user?.phoneNumber
									? 'rgba(0, 0, 0, 0.08)'
									: 'transparent'
							}
							_hover={{ bg: 'rgba(0, 0, 0, 0.05)' }}
							onClick={() => {
								handleActiveChat(user);
							}}
							transition='background 0.2s ease'
						>
							<Box position='relative'>
								<UserAvatar
									name={user?.name}
									src={user?.avatar}
									size='md'
									mr={3}
								/>
								{/* {user.status === 'online' && (
									<Box
										position='absolute'
										bottom='0'
										right='3'
										w='12px'
										h='12px'
										bg='green.500'
										borderRadius='full'
										border='2px solid'
										borderColor={sidebarBg}
									/>
								)} */}
							</Box>
							<Box flex='1' overflow='hidden'>
								<Flex
									fontSize={{ base: 'sm', md: 'md' }}
									justify='space-between'
								>
									<Text
										fontWeight='bold'
										isTruncated
										maxW='50%'
										color='#111B21'
									>
										{user?.name === 'Unknown' || !user?.name
											? user.phoneNumber
											: user.name}
									</Text>
									<Text
										fontSize='xs'
										color={user.unreadCount > 0 ? 'whatsapp.600' : '#667781'}
									>
										{formatLastMessageTime(user.lastMessageAt)}
									</Text>
								</Flex>
								<Flex justify='space-between' mt={1}>
									<Text fontSize='sm' color='#667781' isTruncated maxW='80%'>
										{user.lastMessage}
									</Text>
									{user.unreadCount > 0 && (
										<Box
											bg='whatsapp.600'
											color='white'
											minW='22px'
											h='22px'
											fontSize={{ base: 'xs', md: 'sm' }}
											px='6px'
											display='flex'
											alignItems='center'
											justifyContent='center'
											borderRadius='full'
										>
											{user.unreadCount}
										</Box>
									)}
								</Flex>
							</Box>
						</Flex>
						<Divider borderColor='gray.300' />
					</React.Fragment>
				))
			) : (
				<VStack
					spacing={4}
					justifyContent='center'
					alignItems='center'
					p={6}
					h='30vh'
				>
					<Text fontSize='lg' fontWeight='medium' color='gray.600'>
						No contacts found
					</Text>

					{/* <Button
						colorScheme='whatsapp'
						size='md'
						px={6}
						py={4}
						onClick={handleAddContact}
					>
						Add Contact
					</Button> */}
				</VStack>
			)}
		</Box>
	);
};

export default UserList;
