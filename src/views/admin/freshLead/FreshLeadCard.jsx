import { removeFreshLead } from '../../../redux/freshLeadSlice';
import { useTierCountdown } from './useTierCountdown';
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
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from '@chakra-ui/react';
import {
	FiClock,
	FiAward,
	FiDollarSign,
	FiTarget,
	FiGlobe,
	FiX,
	FiZap,
} from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCoins, FaStar } from 'react-icons/fa';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

const FreshLeadCard = ({ lead, user, handleBuy, onClose, isDialerEnabled }) => {
	const dispatch = useDispatch();

	const coins = user?.coins || 0;

	const userIsEligible = Boolean(coins >= 300);

	const handleExpire = useCallback(() => {
		dispatch(removeFreshLead(lead._id));
		toast.info('Lead offer expired! New leads coming soon...');
	}, [dispatch]);

	const { remaining, percentage } = useTierCountdown(
		lead?.expiresAt,
		handleExpire,
		lead?._id,
	);

	const handleSkip = useCallback(() => {
		dispatch(removeFreshLead(lead._id));
		toast.info('Lead skipped');
	}, [dispatch, lead?._id]);

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
			{/* Compact Progress Bar */}
			<Progress
				value={percentage}
				size='xs'
				w='full'
				borderRadius='full'
				bg='gray.100'
				sx={{
					'& > div': {
						transition: 'width 0.1s linear',
					},
				}}
				colorScheme={remaining <= 5 ? 'red' : 'green'}
			/>

			{/* Main Lead Card - Compact */}
			{lead?.isClaimed ? (
				<Box>
					<Alert
						status='error'
						variant='left-accent'
						borderRadius='md'
						fontSize='sm'
					>
						<AlertIcon />
						<Box>
							<AlertTitle>Lead Unavailable</AlertTitle>
							<AlertDescription>
								This lead has already been claimed and is no longer available.
							</AlertDescription>
						</Box>
					</Alert>
				</Box>
			) : (
				<>
					{/* Premium Badge - New Lead Alert */}
					<HStack spacing={2} justify='flex-end'>
						<Badge
							colorScheme='green'
							variant='subtle'
							fontSize='2xs'
							px={2}
							py={0.5}
							borderRadius='full'
							startElement={<Icon as={FiZap} size={12} />}
						>
							🔥 Fresh Lead • Available now
						</Badge>
					</HStack>

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
										{lead?.leadName || 'New Lead'}
									</Heading>
									<HStack spacing={1.5}>
										<Badge
											colorScheme='brand'
											fontSize='2xs'
											px={1.5}
											borderRadius='sm'
										>
											⚡ Premium
										</Badge>
									</HStack>
								</VStack>

								{/* Time Indicator */}
								<HStack
									spacing={1}
									bg='gray.50'
									px={2}
									py={1}
									borderRadius='full'
								>
									<Icon as={FiClock} size={12} color='gray.500' />
									<Text fontSize='2xs' fontWeight='medium' color='gray.600'>
										{remaining > 0 ? `${remaining}s left` : 'Expired'}
									</Text>
								</HStack>
							</HStack>

							{/* Lead Details - Compact Grid */}
							<SimpleGrid columns={1} spacing={2}>
								<CompactInfoItem
									icon={FiDollarSign}
									label='Budget'
									value={formatLongText(lead?.budget, 25)}
									color='green.500'
								/>
								<CompactInfoItem
									icon={FiTarget}
									label='Campaign'
									value={formatLongText(lead?.leadCampaign, 25)}
									tooltip={lead?.leadCampaign}
									color='blue.500'
								/>
								<CompactInfoItem
									icon={FiGlobe}
									label='Ad Name'
									value={formatLongText(lead?.leadSourceDetails, 25)}
									tooltip={lead?.leadSourceDetails}
									color='purple.500'
								/>
								<CompactInfoItem
									icon={FaStar}
									label='Interest'
									value={formatLongText(lead?.interest, 25)}
									tooltip={lead?.interest}
									color='orange.500'
								/>
							</SimpleGrid>

							{/* Action Buttons - Compact */}
							<AnimatePresence>
								{!userIsEligible && (
									<Box
										flex={2}
										p={3}
										bg='yellow.50'
										border='1px solid'
										borderColor='yellow.200'
										borderRadius='lg'
										fontSize='sm'
										color='yellow.800'
									>
										You don’t have enough coins to buy this lead. Get more coins
										to unlock the latest premium leads.
									</Box>
								)}

								{remaining > 0 ? (
									<HStack spacing={2} w='full'>
										{userIsEligible && (
											<Button
												flex={2}
												h='36px'
												fontSize='sm'
												borderRadius='lg'
												leftIcon={<Icon as={FiAward} size={16} />}
												bg='green.600'
												color='white'
												_hover={{ bg: 'green.700' }}
												onClick={() => handleBuy(lead._id)}
												size='sm'
											>
												{isDialerEnabled ? 'Buy & Call for 300' : 'Buy for 300'}
											</Button>
										)}

										<Button
											flex={1}
											h='36px'
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
									</HStack>
								) : (
									<MotionBox
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										w='full'
									>
										<Button
											w='full'
											h='36px'
											fontSize='sm'
											borderRadius='lg'
											isDisabled
											bg='gray.100'
											color='gray.500'
											leftIcon={<Icon as={FiClock} size={16} />}
											size='sm'
										>
											Lead Expired
										</Button>
									</MotionBox>
								)}
							</AnimatePresence>

							{/* Agent Tip - Small Hint */}
							{remaining > 0 && remaining < 10 && (
								<Text fontSize='2xs' color='red.500' textAlign='center'>
									⚡ Hurry! Only {remaining} seconds left to grab this new lead
								</Text>
							)}
						</VStack>
					</Box>
				</>
			)}
		</MotionVStack>
	);
};

// Compact Info Item Component
const CompactInfoItem = ({ icon, label, value, tooltip, color }) => (
	<HStack spacing={1.5} align='center' bg='gray.50' p={1.5} borderRadius='md'>
		<Icon as={icon} boxSize={3} color={color} />
		<VStack spacing={0} align='start' flex={1}>
			<Text fontSize='2xs' color='gray.500' lineHeight='1'>
				{label}
			</Text>
			<Tooltip label={tooltip} hasArrow placement='top' openDelay={300}>
				<Text fontSize='xs' fontWeight='medium' noOfLines={1} color='gray.700'>
					{value || 'N/A'}
				</Text>
			</Tooltip>
		</VStack>
	</HStack>
);

export default FreshLeadCard;
