import { Box, Avatar, Text } from '@chakra-ui/react';
import { constant } from 'constant';
import { Link } from 'react-router-dom';
import { getAvatarColor, getInitials } from 'utils/colorUtils';

const UserProfileItem = ({ user, onClick, linkTo }) => {
	const Wrapper = linkTo ? Link : Box;

	const name = user?.fullName || user?.username || '';
	const imgSrc = user?.profileImage
		? `${constant.baseUrl}${user.profileImage}`
		: undefined;

	return (
		<Wrapper to={linkTo} onClick={onClick} style={{ textDecoration: 'none' }}>
			<Box
				display='flex'
				alignItems='center'
				cursor='pointer'
				_hover={{ bg: 'gray.100', transition: '0.2s' }}
				p={1}
				borderRadius='md'
			>
				<Avatar
					src={imgSrc}
					name={name}
					bg={getAvatarColor(name)}
					boxSize='40px'
					mr={3}
				>
					{/* Only show initials when no profile image AND no fullName */}
					{!imgSrc && !user?.fullName && (
						<Text fontSize='sm' fontWeight='600'>
							{getInitials(user?.username || '')}
						</Text>
					)}
				</Avatar>

				<Box>
					<Text fontWeight='600' fontSize='sm'>
						{user?.fullName || user?.username || '-'}
					</Text>

					{user?.username && (
						<Text fontSize='xs' color='gray.500'>
							@{user.username}
						</Text>
					)}
				</Box>
			</Box>
		</Wrapper>
	);
};

export default UserProfileItem;
