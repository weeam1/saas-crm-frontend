import { Avatar } from '@chakra-ui/react';
import { constant } from 'constant';

const UserAvatar = ({
	src,
	name,
	size = 'md',
	bg = 'brand.700',
	color = 'brand.300',
	fallbackBg = 'gray.100',
	fallbackColor = 'white',
	fallbackSrc = '',

	...props
}) => {
	const avatarSrc = src ? `${constant.baseUrl}${src}` : fallbackSrc;

	return (
		<Avatar
			src={avatarSrc}
			name={name}
			size={size}
			shadow='sm'
			bg={avatarSrc ? fallbackBg : bg}
			color={avatarSrc ? fallbackColor : color}
			{...props}
		/>
	);
};

export default UserAvatar;
