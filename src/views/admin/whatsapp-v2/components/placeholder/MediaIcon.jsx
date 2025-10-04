import { Box } from '@chakra-ui/react';
import { FiFile, FiFileText, FiImage, FiMusic, FiVideo } from 'react-icons/fi';

const MediaIcon = ({ type, size = 24 }) => {
	const styleConfig = {
		image: { icon: FiImage, bg: 'blue.50', color: 'blue.500' },
		video: { icon: FiVideo, bg: 'purple.50', color: 'purple.500' },
		audio: { icon: FiMusic, bg: 'green.50', color: 'green.500' },
		document: { icon: FiFileText, bg: 'orange.50', color: 'orange.500' },
		default: { icon: FiFile, bg: 'gray.50', color: 'gray.500' },
	};

	const { icon: Icon, bg, color } = styleConfig[type] || styleConfig.default;

	return (
		<Box
			as='span'
			display='inline-flex'
			alignItems='center'
			justifyContent='center'
			borderRadius='md'
			bg={bg}
			w={`calc(${size}px + 16px)`}
			h={`calc(${size}px + 16px)`}
		>
			<Icon size={size} color={color} />
		</Box>
	);
};

export default MediaIcon;
