import {
	Box,
	Flex,
	Text,
	Icon,
	Badge,
	Spinner,
	Avatar,
	Tooltip,
	useColorModeValue,
	SimpleGrid,
} from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineUsers } from './../../../../redux/onlineUsersSlice';
import { FaUsers, FaCircle } from 'react-icons/fa';
import useUserSession from 'hooks/useUserSession';
import UserAvatarWithStatus from 'components/table/UserAvatarWithStatus';

const OnlineUsers = () => {
	const dispatch = useDispatch();

	const onlineUsers = useSelector((state) => state.onlineUsers);
	const allUsers = useSelector((state) => state.user.users || []);

	const { user: currentUser } = useUserSession();

	const { data, isLoading } = useFetchItemsQuery(
		{ path: '/v2/user/online-users' },
		{
			refetchOnMountOrArgChange: true,
			refetchOnReconnect: true,
			refetchOnFocus: true,
		},
	);

	useEffect(() => {
		if (data) {
			dispatch(setOnlineUsers(data));
		}
	}, [data, dispatch]);

	const onlineUserList = useMemo(() => {
		if (!onlineUsers?.users?.length || !allUsers?.length) return [];

		const onlineIdSet = new Set(onlineUsers.users);

		return allUsers
			.filter((user) => onlineIdSet.has(String(user._id)))
			.sort((a, b) => a.fullName.localeCompare(b.fullName));
	}, [onlineUsers?.users, allUsers]);

	const onlineCount = onlineUserList.length;

	const cardBg = useColorModeValue('white', 'gray.800');
	const hoverBg = useColorModeValue('gray.50', 'gray.700');
	const borderColor = useColorModeValue('gray.200', 'gray.700');
	const mutedText = useColorModeValue('gray.500', 'gray.400');
	const liveBg = useColorModeValue('green.100', 'green.800');
	const liveColor = useColorModeValue('green.700', 'green.200');

	return (
		<Box
			bg={cardBg}
			p={4}
			rounded='2xl'
			shadow='sm'
			borderWidth='1px'
			borderColor={borderColor}
			mb={4}
		>
			{/* Header */}
			<Flex align='center' justify='space-between' mb={4}>
				<Flex align='center' gap={3}>
					<Icon as={FaUsers} boxSize={5} />
					<Text fontWeight='semibold'>Online Users</Text>
				</Flex>

				<Badge
					bg={liveBg}
					color={liveColor}
					borderRadius='full'
					px={3}
					py={1}
					fontSize='xs'
					display='flex'
					alignItems='center'
					gap={2}
				>
					<Box
						as={FaCircle}
						boxSize='8px'
						color='green.400'
						className='pulse-dot'
					/>
					{isLoading ? <Spinner size='xs' /> : `${onlineCount} Live`}
				</Badge>
			</Flex>

			{/* Scrollable List */}
			<Box
				maxH='320px'
				overflowY='auto'
				pr={1}
				css={{
					'&::-webkit-scrollbar': { width: '6px' },
					'&::-webkit-scrollbar-thumb': {
						background: '#CBD5E0',
						borderRadius: '24px',
					},
				}}
			>
				{!isLoading && onlineUserList.length === 0 && (
					<Text fontSize='sm' color={mutedText}>
						No users online
					</Text>
				)}

				<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={2}>
					{onlineUserList.map((user) => (
						<Box
							key={user._id}
							p={2}
							rounded='xl'
							transition='all 0.2s'
							_hover={{ transform: 'translateY(-2px)' }}
						>
							<UserAvatarWithStatus
								user={user}
								linkTo={`/users-v2/${user._id}`}
							/>
						</Box>
					))}
				</SimpleGrid>
			</Box>

			<style>
				{`
          .pulse-dot {
            animation: pulse-animation 2s infinite;
          }
          @keyframes pulse-animation {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
        `}
			</style>
		</Box>
	);
};

export default OnlineUsers;
