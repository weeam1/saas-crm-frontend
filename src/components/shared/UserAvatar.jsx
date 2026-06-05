import { Avatar } from '@chakra-ui/react';
import { constant } from 'constant';
import { useModalColors } from 'hooks/useModalColors';

const UserAvatar = ({
	src,
	name,
	size = 'md',
	bg,
	color,
	fallbackBg,
	fallbackColor,
	fallbackSrc = '',
	borderColor,
	...props
}) => {
	const colors = useModalColors();

	const avatarSrc = src?.includes(constant.baseUrl)
		? `${constant.baseUrl}${src}`
		: fallbackSrc;

	// Use theme colors with fallbacks
	const avatarBg = bg || colors.bgInput;
	const avatarColor = color || colors.bodyText;
	const avatarFallbackBg = fallbackBg || colors.bgDeep;
	const avatarFallbackColor = fallbackColor || colors.mutedText;
	const avatarBorderColor = borderColor || colors.accentGold;

	return (
		<Avatar
			src={avatarSrc}
			name={name}
			size={size}
			boxShadow={colors.cardShadow}
			bg={avatarSrc ? avatarFallbackBg : avatarBg}
			color={avatarSrc ? avatarFallbackColor : avatarColor}
			border={`2px solid ${avatarBorderColor}`}
			{...props}
		/>
	);
};

export default UserAvatar;