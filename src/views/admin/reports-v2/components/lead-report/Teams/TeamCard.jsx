import {
	Box,
	Text,
	VStack,
	HStack,
	Avatar,
	useColorModeValue,
	Flex,
	Icon,
	Button,
} from '@chakra-ui/react';
import Rating from 'components/shared/Rating';
import { constant } from 'constant';
import { FiTrendingUp, FiUsers } from 'react-icons/fi';
import { HiOutlineArrowRightCircle } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { calculatePerformance } from 'views/admin/reports-v2/helpers';
import TeamProgress from './TeamProgress';
import { buttonStyle } from 'utils/btn';

const TeamCard = ({ manager, index }) => {
	const bg = useColorModeValue('white', 'gray.800');
	const textColor = useColorModeValue('gray.700', 'gray.100');

	// const { score, rating } = calculatePerformance(
	// 	manager?.totalLeads,
	// 	manager?.totalAgents,
	// 	manager?.assignedLeads
	// );

	const navigate = useNavigate();

	return (
		<Box
			key={manager._id}
			position='relative'
			bg={bg}
			borderRadius='2xl'
			boxShadow='md'
			p={6}
			overflow='hidden'
			transition='all 0.2s ease-in-out'
			_hover={{
				transform: 'translateY(-4px)',
				boxShadow: 'lg',
				borderColor: useColorModeValue('brand.200', 'brand.600'),
			}}
			border='1px solid'
			borderColor={useColorModeValue('gray.200', 'gray.700')}
		>
			{/* Gradient Accent */}
			<Box
				position='absolute'
				top={0}
				left={0}
				w='4px'
				h='full'
				bgGradient='linear(to-b, brand.400, brand.600)'
			/>

			{/* <Box
				position='absolute'
				top={2}
				right={3}
				display='flex'
				alignItems='center'
				gap={2}
				onClick={() =>
					navigate(`/reporting-analytics/team-details/${manager._id}`)
				}
				_hover={{
					bg: 'gray.100',
				}}
				p='2'
				rounded='full'
				cursor='pointer'
			>
				<Icon as={HiOutlineArrowRightCircle} boxSize='24px' color='green.500' />
			</Box> */}

			<Flex align='center' gap={4} mb={4}>
				<Avatar
					src={
						manager?.profileImage
							? `${constant.baseUrl}${manager.profileImage}`
							: ''
					}
					name={manager?.fullName}
					size='lg'
				/>

				<VStack align='start' spacing={0}>
					<Text
						fontSize={{ base: 'sm', md: 'md' }}
						fontWeight='bold'
						color={textColor}
						maxWidth={{ base: 'full', md: '250px' }}
						isTruncated
					>
						{manager?.fullName}
					</Text>
					<Text
						fontSize={{ base: 'xs', md: 'sm' }}
						color={useColorModeValue('gray.500', 'gray.400')}
						maxWidth={{ base: 'full', md: '250px' }}
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
					label='Agents'
					value={manager?.totalAgents || 0}
				/>
				<StatBadge
					icon={FiTrendingUp}
					label='Leads'
					value={manager?.totalLeads || 0}
				/>
			</HStack>

			<Button
				{...buttonStyle}
				width='full'
				leftIcon={<FiUsers />}
				size='sm'
				bg='softGray.100'
				color='gray.800'
				_active={{ bg: 'gray.200' }}
				onClick={() =>
					navigate(`/reporting-analytics/team-details/${manager._id}`)
				}
			>
				View Team
			</Button>

			{/* <Box>
				<Text fontSize='xs' color='gray.500' fontWeight='medium'>
					Perfomance
				</Text>
				<Rating value={rating || 0} />

				<TeamProgress score={score} />
			</Box> */}
		</Box>
	);
};

const StatBadge = ({ icon, label, value }) => (
	<Flex
		align='center'
		bg={useColorModeValue('blackAlpha.50', 'whiteAlpha.100')}
		borderRadius='lg'
		px={3}
		py={1}
		gap={2}
	>
		<Icon as={icon} color='brand.500' boxSize={4} />
		<VStack spacing={0} align='start'>
			<Text fontSize='xs' color={useColorModeValue('gray.500', 'gray.400')}>
				{label}
			</Text>
			<Text fontWeight='bold' fontSize='sm'>
				{value}
			</Text>
		</VStack>
	</Flex>
);

export default TeamCard;
