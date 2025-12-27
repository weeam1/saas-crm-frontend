import { Box, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaEye } from 'react-icons/fa';

const MotionBox = motion(Box);

const ViewOverlayAction = () => {
	return (
		<MotionBox
			position='absolute'
			top='3'
			left='3'
			zIndex='50'
			w='36px'
			h='36px'
			display='flex'
			alignItems='center'
			justifyContent='center'
			borderRadius='full'
			backdropFilter='blur(6px)'
			bg='blackAlpha.600'
			color='white'
			cursor='pointer'
			opacity={0}
			pointerEvents='none'
			_groupHover={{
				opacity: 1,
				pointerEvents: 'auto',
			}}
			initial={{ opacity: 0, y: -6 }}
			whileHover={{ scale: 1.1 }}
			transition={{ duration: 0.25, ease: 'easeOut' }}
		>
			<Icon as={FaEye} boxSize={4} /> View
		</MotionBox>
	);
};

export default ViewOverlayAction;
