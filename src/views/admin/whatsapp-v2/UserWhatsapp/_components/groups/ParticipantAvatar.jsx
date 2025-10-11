import { Avatar, Box, Text } from '@chakra-ui/react';
import { getAvatarColor } from 'views/admin/whatsapp-v2/utils/getAvatarColor';

const ParticipantAvatar = ({ name, number }) => {
	const identifier = name || number;
	const color = getAvatarColor(identifier);
	const initial = identifier.charAt(1).toUpperCase();

	return (
		<Avatar
			// name={identifier}
			bg={color}
			color='white'
			size='sm'
			shadow='sm'
			// showBorder={true}
			// borderColor='white'
		>
			{/* +{initial} */}
		</Avatar>
	);
};

export default ParticipantAvatar;
