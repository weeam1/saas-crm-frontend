import {
	CircularProgress,
	CircularProgressLabel,
	Box,
	Text,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const MediaLoader = ({ uploadProgress }) => {
	return (
		<CircularProgress
			value={uploadProgress}
			size='80px'
			thickness='8px'
			color='green.400'
			trackColor='rgba(255,255,255,0.2)'
			isIndeterminate={uploadProgress === 0}
		>
			<CircularProgressLabel>
				<Text
					color='white'
					fontWeight='bold'
					fontSize='md'
					textShadow='0 0 4px rgba(0,0,0,0.6)'
				>
					{Math.floor(uploadProgress)}%
				</Text>
			</CircularProgressLabel>
		</CircularProgress>
	);
};

export default MediaLoader;
