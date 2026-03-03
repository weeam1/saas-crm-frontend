import {
	Box,
	Flex,
	Text,
	Icon,
	Badge,
	Spinner,
	Tooltip,
	useColorModeValue,
} from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setOnlineUsers } from './../../../../redux/onlineUsersSlice';
import { useSelector } from 'react-redux';

import { FaUsers, FaCircle, FaRegClock } from 'react-icons/fa';

const OnlineUsersCard = () => {
	const dispatch = useDispatch();

	const onlineUsers = useSelector((state) => state.onlineUsers);
	const allUsers = useSelector((state) => state.user.users || []);

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

	const onlineCount = useMemo(
		() => onlineUsers?.count || 0,
		[onlineUsers?.count],
	);

	const bg = useColorModeValue('white', 'gray.800');

	// Color values for light/dark mode compatibility
	const cardBg = useColorModeValue('white', 'gray.800');
	const textColor = useColorModeValue('gray.600', 'gray.300');
	const countColor = useColorModeValue('green.600', 'green.300');
	const iconBg = useColorModeValue('green.50', 'green.900');
	const iconColor = useColorModeValue('green.500', 'green.300');
	const badgeBg = useColorModeValue('green.100', 'green.800');
	const badgeColor = useColorModeValue('green.700', 'green.200');

	return (
		<Box
			bg={bg || cardBg}
			p={3}
			my={4}
			rounded='2xl'
			shadow='sm'
			borderWidth='1px'
			borderColor='gray.100'
			position='relative'
			overflow='hidden'
			_before={{
				content: '""',
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				height: '4px',
				bg: 'green.400',
				opacity: 0.8,
			}}
			transition='transform 0.2s, shadow 0.2s'
			_hover={{
				transform: 'translateY(-2px)',
				shadow: 'md',
			}}
		>
			<Flex align='center' justify='space-between'>
				<Flex align='center' gap={4}>
					<Box
						p={2}
						rounded='xl'
						bg={iconBg}
						color={iconColor}
						display='flex'
						alignItems='center'
						justifyContent='center'
						boxShadow='md'
						position='relative'
					>
						<Icon as={FaUsers} boxSize={6} />
						<Box
							position='absolute'
							top={-2}
							right={-2}
							w={4}
							h={4}
							rounded='full'
							bg='green.400'
							borderWidth='2px'
							borderColor='white'
						/>
					</Box>
					<Box>
						<Text fontSize='md' color={textColor} fontWeight='medium'>
							Online Users
						</Text>
						{isLoading ? (
							<Spinner size='sm' color='green.500' thickness='3px' mt={1} />
						) : (
							<Text fontSize='3xl' fontWeight='bold' color={countColor}>
								{onlineCount}
							</Text>
						)}
					</Box>
				</Flex>

				<Tooltip
					label='Users currently active in the system'
					aria-label='Online users tooltip'
					hasArrow
					placement='top'
				>
					<Badge
						colorScheme='green'
						py={1.5}
						px={3}
						borderRadius='full'
						bg={badgeBg}
						color={badgeColor}
						display='flex'
						alignItems='center'
						gap={2}
						fontSize='xs'
						fontWeight='bold'
						textTransform='uppercase'
						letterSpacing='wide'
					>
						<Box
							as={FaCircle}
							size='8px'
							color='green.500'
							className='pulse-dot'
						/>
						Live
					</Badge>
				</Tooltip>
			</Flex>

			<style>
				{`
          .pulse-dot {
            animation: pulse-animation 2s infinite;
          }
          
          @keyframes pulse-animation {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.4;
            }
            100% {
              opacity: 1;
            }
          }
        `}
			</style>
		</Box>
	);
};

export default OnlineUsersCard;
