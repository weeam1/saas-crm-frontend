import { Avatar } from '@chakra-ui/react';
import { constant } from 'constant';

const UserAvatar = ({ src, name, size = 'md', fallbackSrc = '', ...props }) => {
	const avatarSrc = src ? `${constant.baseUrl}${src}` : fallbackSrc;

	return (
		<Avatar
			src={avatarSrc}
			name={name}
			size={size}
			shadow='sm'
			bg={avatarSrc ? 'gray.100' : 'brand.500'}
			color={avatarSrc ? '#333' : 'white'}
			{...props}
		/>
	);
};

export default UserAvatar;
