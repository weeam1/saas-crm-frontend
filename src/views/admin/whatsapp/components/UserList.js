import React from 'react';
import { Box, Flex, Text, Divider, VStack } from '@chakra-ui/react';

import { useDispatch, useSelector } from 'react-redux';
import UserAvatar from 'components/shared/UserAvatar';
import { setActiveChat } from '../../../../redux/whatsappSlice';
import { formatLastMessageTime } from 'utils/helpers';
import { useModalColors } from 'hooks/useModalColors';

const UserList = ({ contacts, isMobile, onClose, sidebarBg }) => {
	const colors = useModalColors();
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
									? colors.bgDeep
									: 'transparent'
							}
							_hover={{ bg: colors.bgInput }}
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
										color={colors.headingText}
									>
										{user?.name === 'Unknown' || !user?.name
											? user.phoneNumber
											: user.name}
									</Text>
									<Text
										fontSize='xs'
										color={user.unreadCount > 0 ? colors.accentGold : colors.mutedText}
									>
										{formatLastMessageTime(user.lastMessageAt)}
									</Text>
								</Flex>
								<Flex justify='space-between' mt={1}>
									<Text fontSize='sm' color={colors.mutedText} isTruncated maxW='80%'>
										{user.lastMessage}
									</Text>
									{user.unreadCount > 0 && (
										<Box
											bg={colors.accentGold}
											color={colors.headerText}
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
						<Divider borderColor={colors.borderColor} />
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
					<Text fontSize='lg' fontWeight='medium' color={colors.mutedText}>
						No contacts found
					</Text>
				</VStack>
			)}
		</Box>
	);
};

export default UserList;