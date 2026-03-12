import { toast } from 'react-toastify';
import {
	VStack,
	HStack,
	Badge,
	Progress,
	Button,
	Box,
	Icon,
	Heading,
	Text,
	Tooltip,
	SimpleGrid,
} from '@chakra-ui/react';
import {
	FiClock,
	FiAward,
	FiDollarSign,
	FiTarget,
	FiGlobe,
	FiX,
	FiZap,
	FiPhone,
} from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCoins, FaStar, FaUser } from 'react-icons/fa';
import { removeApprovalLead } from '../../../../redux/freshLeadSlice';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

const FreshApprovedLeadCard = ({ lead, handleCall, isDialerEnabled }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleSkip = useCallback(() => {
		dispatch(removeApprovalLead(lead?._id));
	}, [dispatch, lead?._id]);

	// const handleDetails = useCallback(() => {
	// 	dispatch(removeApprovalLead(lead?._id));

	// 	navigate('/admin/leads/details');
	// }, [dispatch, lead?._id]);

	const handleDetails = useCallback(() => {
		if (!lead?._id || !lead?.intID) return;

		dispatch(removeApprovalLead(lead?._id));

		const query = new URLSearchParams({
			page: 1,
			pageSize: 40,
			data: JSON.stringify({ intID: lead.intID }),
		}).toString();

		navigate(`/lead?${query}`);
	}, [dispatch, navigate, lead]);

	// Format long text with truncation
	const formatLongText = (text, maxLength = 25) => {
		if (!text) return 'N/A';
		return text.length > maxLength
			? `${text.substring(0, maxLength)}...`
			: text;
	};

	return (
		<MotionVStack
			spacing={3}
			align='stretch'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			mb={4}
		>
			<Box
				p={4}
				bg='white'
				borderRadius='xl'
				borderWidth='1px'
				borderColor='purple.100'
				boxShadow='sm'
				position='relative'
				overflow='hidden'
				_hover={{ borderColor: 'purple.200', boxShadow: 'md' }}
				transition='all 0.2s'
				sx={{
					'&::-webkit-scrollbar': {
						display: 'none',
					},
					scrollbarWidth: 'none',
				}}
			>
				<VStack spacing={3} align='stretch'>
					{/* Header with Lead Name and Quick Actions */}
					<HStack justify='space-between' align='center'>
						<VStack align='start' spacing={0.5}>
							<Heading size='xs' noOfLines={1} color='gray.800'>
								{lead?.doc?.leadName || 'New Lead'}
							</Heading>
						</VStack>
					</HStack>

					{/* Lead Details - Compact Grid */}
					<SimpleGrid columns={1} spacing={2}>
						<CompactInfoItem
							icon={FiDollarSign}
							label='Budget'
							value={formatLongText(lead?.doc?.budget, 30)}
							color='green.500'
						/>
						<CompactInfoItem
							icon={FiTarget}
							label='Campaign'
							value={formatLongText(lead?.doc?.leadCampaign, 25)}
							tooltip={lead?.doc?.leadCampaign}
							color='blue.500'
						/>
						<CompactInfoItem
							icon={FiGlobe}
							label='Ad Name'
							value={formatLongText(lead?.leadSourceDetails, 25)}
							tooltip={lead?.doc?.leadSourceDetails}
							color='purple.500'
						/>
						<CompactInfoItem
							icon={FaStar}
							label='Interest'
							value={formatLongText(lead?.interest, 25)}
							tooltip={lead?.doc?.interest}
							color='orange.500'
						/>
					</SimpleGrid>

					{/* Action Buttons - Compact */}
					<AnimatePresence>
						<VStack
							gap='1'
							w='full'
							justifyContent='stretch'
							alignItems='stretch'
						>
							{isDialerEnabled && (
								<Button
									// h='36px'
									w='full'
									fontSize='sm'
									borderRadius='lg'
									bg='green.600'
									color='white'
									leftIcon={<Icon as={FiPhone} size={16} />}
									_hover={{ bg: 'green.700' }}
									onClick={() => handleCall(lead)}
									size='sm'
								>
									Direct Call
								</Button>
							)}
							<Button
								w='full'
								fontSize='sm'
								borderRadius='lg'
								variant='outline'
								colorScheme='brand'
								leftIcon={<Icon as={FiZap} size={16} />}
								onClick={handleDetails}
								size='sm'
							>
								More Details
							</Button>
							<Button
								w='full'
								fontSize='sm'
								borderRadius='lg'
								variant='outline'
								colorScheme='gray'
								leftIcon={<Icon as={FiX} size={16} />}
								onClick={handleSkip}
								size='sm'
							>
								Skip
							</Button>
						</VStack>
					</AnimatePresence>
				</VStack>
			</Box>
		</MotionVStack>
	);
};

// Compact Info Item Component
const CompactInfoItem = ({ icon, label, value, tooltip, color }) => (
	<HStack spacing={1.5} align='center' bg='gray.50' p={1.5} borderRadius='md'>
		<Icon as={icon} boxSize={3} color={color} />
		<VStack spacing={0} align='start' flex={1}>
			<Text fontSize='xs' color='gray.500' lineHeight='1'>
				{label}
			</Text>
			<Tooltip label={tooltip} hasArrow placement='top' openDelay={300}>
				<Text fontSize='sm' fontWeight='medium' noOfLines={1} color='gray.700'>
					{value || 'N/A'}
				</Text>
			</Tooltip>
		</VStack>
	</HStack>
);

export default FreshApprovedLeadCard;
