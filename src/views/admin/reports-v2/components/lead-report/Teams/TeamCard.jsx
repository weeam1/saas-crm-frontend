import {
	Box,
	Text,
	VStack,
	HStack,
	Avatar,
	Flex,
	Icon,
	Button,
} from '@chakra-ui/react';
import { constant } from 'constant';
import { FiTrendingUp, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { buttonStyle } from 'utils/btn';
import { useModalColors } from 'hooks/useModalColors';

const TeamCard = ({ manager, index }) => {
	const colors = useModalColors();
	const navigate = useNavigate();

	return (
		<Box
			key={manager._id}
			position='relative'
			bg={colors.bg}
			borderRadius='2xl'
			boxShadow={colors.cardShadow}
			p={6}
			overflow='hidden'
			transition='all 0.2s ease-in-out'
			_hover={{
				transform: 'translateY(-4px)',
				boxShadow: colors.modalShadow,
				borderColor: colors.accentGold,
			}}
			border='1px solid'
			borderColor={colors.borderColor}
		>
			{/* Gradient Accent */}
			<Box
				position='absolute'
				top={0}
				left={0}
				w='4px'
				h='full'
				bg={colors.accentGold}
			/>

			<Flex align='center' gap={2} mb={4}>
				<Avatar
					src={
						manager?.profileImage
							? `${constant.baseUrl}${manager.profileImage}`
							: ''
					}
					name={manager?.fullName}
					size='md'
				/>

				<VStack align='start' spacing={0}>
					<Text
						fontSize={{ base: 'xs', md: 'sm' }}
						fontWeight='bold'
						color={colors.headingText}
						maxWidth={{ base: '200px', md: '200px' }}
						isTruncated
					>
						{manager?.fullName}
					</Text>
					<Text
						fontSize={{ base: 'xs', md: 'sm' }}
						color={colors.mutedText}
						maxWidth={{ base: '250px', md: '250px' }}
						isTruncated
					>
						{manager?.username}
					</Text>
				</VStack>
			</Flex>

			{/* Stats with Icons */}
			<HStack spacing={3} mt={4} mb='4'>
				<StatBadge
					icon={FiUsers}
					label='Leaders'
					value={manager?.totalTeamLeaders || 0}
					colors={colors}
				/>
				<StatBadge
					icon={FiUsers}
					label='Agents'
					value={manager?.totalAgents || 0}
					colors={colors}
				/>
				<StatBadge
					icon={FiTrendingUp}
					label='Leads'
					value={manager?.totalLeads || 0}
					colors={colors}
				/>
			</HStack>

			<Button
				{...buttonStyle}
				width='full'
				leftIcon={<FiUsers />}
				size='sm'
				variant='ghost'
				color={colors.bodyText}
				_active={{ bg: colors.bgInput }}
				_hover={{ bg: colors.secondaryBtnHoverBg, color: colors.accentGold }}
				onClick={() =>
					navigate(`/reporting-analytics/team-details/${manager._id}`)
				}
				transition='all 0.2s ease'
			>
				View Team
			</Button>
		</Box>
	);
};

const StatBadge = ({ icon, label, value, colors }) => (
	<Flex
		align='center'
		bg={colors.bgInput}
		borderRadius='lg'
		px={3}
		py={1}
		gap={2}
		border="1px solid"
		borderColor={colors.borderColor}
	>
		<Icon as={icon} color={colors.accentGold} boxSize={3} />
		<VStack spacing={0} align='start'>
			<Text fontSize={{ base: 'x-small' }} color={colors.mutedText}>
				{label}
			</Text>
			<Text fontWeight='bold' fontSize={{ base: 'x-small', md: 'xs' }} color={colors.headingText}>
				{value}
			</Text>
		</VStack>
	</Flex>
);

export default TeamCard;