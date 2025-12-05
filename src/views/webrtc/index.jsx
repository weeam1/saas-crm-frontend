import { useSelector, useDispatch } from 'react-redux';
import { Box, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import WebRTCApp from './WebRTCApp';
import { toggleWebRTCModal } from '../../redux/webrtc/webrtcSlice';
import { PhoneIcon } from '@chakra-ui/icons';

const MotionBox = motion(Box);

// const WebRTCModal = () => {
// 	const dispatch = useDispatch();
// 	const isOpen = useSelector((state) => state.webrtc.modal);

// 	const handleToggle = () => dispatch(toggleWebRTCModal());

// 	// Better theme-based styling
// 	const bg = useColorModeValue('white', 'gray.800');
// 	const shadow = useColorModeValue('xl', 'dark-lg');

// 	return (
// 		<>
// 			{/* Floating Action Button */}
// 			<IconButton
// 				icon={<FaPhone />}
// 				aria-label='Open call panel'
// 				onClick={handleToggle}
// 				position='fixed'
// 				bottom='10px'
// 				right='24px'
// 				zIndex='10000'
// 				colorScheme='teal'
// 				size='lg'
// 				borderRadius='full'
// 				boxShadow='0 8px 20px rgba(0, 0, 0, 0.3)'
// 				transition='all 0.25s ease'
// 				transform='scaleX(-1)'
// 				_hover={{
// 					bg: 'greenish',
// 					boxShadow: '0 12px 26px rgba(0,0,0,0.35)',
// 				}}
// 				_active={{
// 					bg: 'greenish',
// 				}}
// 			/>

// 			{/* Animated Modal */}
// 			<AnimatePresence>
// 				{isOpen && (
// 					<MotionBox
// 						key='webrtc-modal'
// 						position='fixed'
// 						bottom='65px'
// 						right='24px'
// 						width='380px'
// 						bg={bg}
// 						boxShadow={shadow}
// 						borderRadius='lg'
// 						overflow='hidden'
// 						zIndex='10001'
// 						initial={{ opacity: 0, scale: 0.8, y: 40 }}
// 						animate={{ opacity: 1, scale: 1, y: 0 }}
// 						exit={{ opacity: 0, scale: 0.85, y: 40 }}
// 						transition={{
// 							type: 'spring',
// 							stiffness: 260,
// 							damping: 20,
// 						}}
// 					>
// 						{/* Body */}
// 						<WebRTCApp />
// 					</MotionBox>
// 				)}
// 			</AnimatePresence>
// 		</>
// 	);
// };

const WebRTCModal = () => {
	const dispatch = useDispatch();
	const isOpen = useSelector((state) => state.webrtc.modal);

	const handleToggle = () => dispatch(toggleWebRTCModal());

	const bg = useColorModeValue('white', 'gray.800');
	const shadow = useColorModeValue('xl', 'dark-lg');

	return (
		<>
			{/* Persistent Tab in bottom-right */}
			<Box
				position='fixed'
				bottom='0px'
				right='10px'
				w='380px'
				zIndex={10000}
				cursor='pointer'
				borderTopRadius='md'
				shadow='lg'
				// bg={bg}
				bg='greenish.600'
				color='softGray.100'
				px={4}
				py={2}
				display='flex'
				justifyContent='space-between'
				onClick={handleToggle}
			>
				<HStack justify='space-between' gap='2'>
					<PhoneIcon />
					<Text fontWeight='bold' fontSize='sm'>
						Call Panel
					</Text>
				</HStack>
				<Box>{isOpen ? <FaChevronDown /> : <FaChevronUp />}</Box>
			</Box>

			{/* Animated Modal Body */}
			<AnimatePresence>
				<MotionBox
					position='fixed'
					bottom='37px'
					right='10px'
					width='380px'
					bg={bg}
					// boxShadow={shadow}
					shadow='lg'
					borderRadius='lg'
					border='1px solid'
					borderColor='greenish.500'
					overflow='hidden'
					zIndex={10001}
					initial={{ opacity: 0, scale: 0.8, y: 40 }}
					animate={{
						opacity: isOpen ? 1 : 0,
						scale: isOpen ? 1 : 0.85,
						y: isOpen ? 0 : 40,
					}}
					transition={{ type: 'spring', stiffness: 260, damping: 20 }}
					pointerEvents={isOpen ? 'auto' : 'none'} // Prevent interaction when collapsed
				>
					{/* Keep content mounted to preserve WebRTC state */}
					<Box display={isOpen ? 'block' : 'none'}>
						<WebRTCApp />
					</Box>
				</MotionBox>
			</AnimatePresence>
		</>
	);
};

export default WebRTCModal;
