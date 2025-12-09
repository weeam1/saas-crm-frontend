import { useSelector, useDispatch } from 'react-redux';
import { Badge, Box, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import WebRTCApp from './WebRTCApp';
import { toggleDialerModal } from '../../redux/webrtc/webrtcSlice';
import { PhoneIcon } from '@chakra-ui/icons';
import useUserSession from 'hooks/useUserSession';
import { useFetchItemsQuery } from 'api/apiSlice';

const MotionBox = motion(Box);

const WebRTCModal = () => {
	const bg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.700');

	const dispatch = useDispatch();
	const webrtc = useSelector((state) => state.webrtc);
	const sipStatus = webrtc.sipStatus;

	const { user } = useUserSession();

	const { data, isLoading } = useFetchItemsQuery(
		{
			path: `/sipSetting/user/${user?._id}`,
		},
		{
			skip: !user?._id,
			refetchOnMountOrArgChange: false,
			refetchOnFocus: true,
		}
	);

	const isOpen = webrtc.isModalOpen;

	const userWSSStatus = data?.doc?.status?.wss || false;

	if (!userWSSStatus) return null;
	console.log({ userWSSStatus });

	const handleToggle = () => dispatch(toggleDialerModal());

	return (
		<>
			{/* Bottom Tab - only when modal is closed */}
			{!isOpen && (
				<MotionBox
					position='fixed'
					bottom='0px'
					right='20px'
					w={{ base: '300px', md: '380px' }}
					zIndex={10000}
					bg='greenish.600'
					color='white'
					px={4}
					py={3}
					cursor='pointer'
					borderTopRadius='md'
					shadow='lg'
					display='flex'
					justifyContent='space-between'
					alignItems='center'
					onClick={handleToggle}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
				>
					<HStack spacing={2} align='center'>
						<PhoneIcon w={5} h={5} />
						<Text fontWeight='bold' fontSize='sm'>
							Weeam Dialer
						</Text>
						<Badge
							colorScheme={sipStatus === 'registered' ? 'green' : 'red'}
							fontSize='0.65rem'
							px={2}
							py={1}
							rounded='full'
						>
							{sipStatus === 'registered' ? 'Online' : 'Offline'}
						</Badge>
					</HStack>

					<FaChevronUp />
				</MotionBox>
			)}

			{/* Modal */}
			<AnimatePresence>
				<MotionBox
					position='fixed'
					bottom={0}
					right='20px'
					w='380px'
					// maxHeight='80vh'
					bg={bg}
					borderTopRadius='xl'
					shadow='2xl'
					overflow='hidden'
					border='1px solid'
					borderColor={borderColor}
					initial={{ y: '100%' }}
					animate={{ y: isOpen ? 0 : '100%' }}
					exit={{ y: '100%' }}
					transition={{ type: 'spring', stiffness: 300, damping: 30 }}
					zIndex={9999}
					display={isOpen ? 'block' : 'none'}
				>
					{/* Tab becomes Modal Header */}
					<MotionBox
						bg='greenish.600'
						color='white'
						px={4}
						py={3}
						display='flex'
						justifyContent='space-between'
						alignItems='center'
						cursor='pointer'
						onClick={handleToggle}
					>
						<HStack spacing={2} align='center'>
							<PhoneIcon w={5} h={5} />
							<Text fontWeight='bold' fontSize='sm'>
								Weeam Dialer
							</Text>
							<Badge
								colorScheme={sipStatus === 'registered' ? 'green' : 'red'}
								fontSize='0.65rem'
								px={2}
								py={1}
								rounded='full'
							>
								{sipStatus === 'registered' ? 'Online' : 'Offline'}
							</Badge>
						</HStack>

						<FaChevronDown />
					</MotionBox>

					{/* Content */}
					<Box>
						<WebRTCApp />
					</Box>
				</MotionBox>
			</AnimatePresence>
		</>
	);
};

export default WebRTCModal;
