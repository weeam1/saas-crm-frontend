import { Box, Avatar, Text, Tooltip } from '@chakra-ui/react';
import { constant } from 'constant';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAvatarColor, getInitials } from 'utils/colorUtils';

const UserAvatarWithStatus = ({ user, onClick, linkTo, cursor = true }) => {
	const Wrapper = linkTo ? Link : Box;

	const onlineUsers = useSelector((state) => state.onlineUsers);

	const status = onlineUsers?.users?.includes(user?._id?.toString())
		? 'online'
		: 'offline';

	const name = user?.fullName || user?.username || '';
	const imgSrc = user?.profileImage
		? `${constant.baseUrl}${user.profileImage}`
		: undefined;

	// Online status configuration
	const getStatusConfig = (status) => {
		const statusMap = {
			online: {
				color: 'green.500',
				tooltip: 'Online',
				ringColor: 'green.500',
			},
			offline: {
				color: 'gray.400',
				tooltip: 'Offline',
				ringColor: 'gray.400',
			},
		};

		return statusMap[status] || statusMap.offline;
	};

	const statusConfig = getStatusConfig(status);

	// Handle avatar click
	const handleAvatarClick = (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (linkTo) {
			// Navigate to user profile page
			window.location.href = linkTo;
		}

		if (onClick) {
			onClick(e);
		}
	};

	return (
		<Wrapper to={linkTo} onClick={onClick} style={{ textDecoration: 'none' }}>
			<Box
				display='flex'
				alignItems='center'
				cursor={cursor ? 'pointer' : undefined}
				_hover={{ bg: 'gray.100', transition: '0.2s' }}
				p={1}
				borderRadius='md'
				borderColor={status === 'online' ? 'green' : 'gray'}
				position='relative'
			>
				{/* Avatar Container with Click Handler */}
				<Box
					position='relative'
					onClick={handleAvatarClick}
					cursor='pointer'
					mr={3}
				>
					<Avatar
						src={imgSrc}
						name={name}
						bg={getAvatarColor(name)}
						boxSize={{ base: '30px', md: '40px', lg: '45px' }}
						border={
							status !== 'offline'
								? `2px solid ${statusConfig.ringColor}`
								: 'none'
						}
						opacity={status === 'invisible' ? 0.7 : 1}
					>
						{!imgSrc && !user?.fullName && (
							<Text fontSize='sm' fontWeight='600'>
								{getInitials(user?.username || '')}
							</Text>
						)}
					</Avatar>

					{/* Online Status Indicator */}
					{status !== 'offline' && (
						<Tooltip
							label={statusConfig.tooltip}
							placement='top'
							hasArrow
							bg='gray.800'
							color='white'
							fontSize='xs'
							px={2}
							py={1}
						>
							<Box
								position='absolute'
								bottom='0'
								right='0'
								width={{ base: '8px', md: '10px', lg: '12px' }}
								height={{ base: '8px', md: '10px', lg: '12px' }}
								bg={statusConfig.color}
								borderRadius='full'
								border='2px solid white'
								boxShadow='sm'
								transition='all 0.2s'
								_hover={{
									transform: 'scale(1.2)',
									boxShadow: 'md',
								}}
							/>
						</Tooltip>
					)}

					{/* Offline Status with Tooltip */}
					{status === 'offline' && (
						<Tooltip
							label={statusConfig.tooltip}
							placement='top'
							hasArrow
							bg='gray.800'
							color='white'
							fontSize='xs'
							px={2}
							py={1}
						>
							<Box
								position='absolute'
								bottom='0'
								right='0'
								width={{ base: '8px', md: '10px', lg: '12px' }}
								height={{ base: '8px', md: '10px', lg: '12px' }}
								bg={statusConfig.color}
								borderRadius='full'
								border='2px solid white'
								opacity={0.7}
							/>
						</Tooltip>
					)}
				</Box>

				{/* User Info */}
				<Box flex='1'>
					<Text fontWeight='600' fontSize='sm'>
						{user?.fullName || user?.username || '-'}
						{/* {status !== 'offline' && (
							<Text
								as='span'
								ml={2}
								fontSize='xs'
								color={statusConfig.color}
								fontWeight='500'
							>
								• {status.charAt(0).toUpperCase() + status.slice(1)}
							</Text>
						)} */}
					</Text>

					{user?.username && (
						<Text fontSize='xs' color='gray.500'>
							{user.username}
						</Text>
					)}
				</Box>
			</Box>
		</Wrapper>
	);
};

export default UserAvatarWithStatus;
