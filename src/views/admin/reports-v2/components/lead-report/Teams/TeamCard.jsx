import {
	Box,
	Text,
	VStack,
	HStack,
	Avatar,
	Badge,
	Collapse,
	Button,
	useColorModeValue,
	Flex,
	Icon,
	Progress,
} from '@chakra-ui/react';
import { constant } from 'constant';
import { FiTarget, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { HiOutlineArrowRightCircle } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const BENCHMARKS = {
	leadTarget: 100, // 100 leads = good performance
	agentTarget: 20, // 10 agents = full capacity
};

// 2. Calculate weighted score
const calculatePerformance = (leads = 0, agents = 0) => {
	const leadScore = Math.min((leads / BENCHMARKS.leadTarget) * 50, 50); // Leads contribute 70%
	const agentScore = Math.min((agents / BENCHMARKS.agentTarget) * 50, 50); // Agents 30%
	return Math.min(leadScore + agentScore, 100);
};

const TeamCard = ({ manager, index }) => {
	const bg = useColorModeValue('white', 'gray.800');
	const textColor = useColorModeValue('gray.700', 'gray.100');

	const score = calculatePerformance(manager?.totalLeads, manager?.totalAgents);

	const navigate = useNavigate();

	return (
		<Box
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

			<Box
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
			</Box>

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
			<HStack spacing={3} mt={4}>
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
			<Box mt={6} mb={2}>
				<Flex justify='space-between' mb={1}>
					<Text
						fontSize='sm'
						fontWeight='semibold'
						color={useColorModeValue('gray.600', 'gray.300')}
					>
						Team Performance
					</Text>
					<Text fontSize='sm' fontWeight='bold' color='brand.500'>
						{score}%
					</Text>
				</Flex>

				<Progress
					value={score}
					width='full'
					height='12px'
					colorScheme='brand'
					borderRadius='full'
					bg={useColorModeValue('gray.100', 'gray.700')}
					sx={{
						'& > div': {
							transition: 'all 0.4s ease-out',
						},
					}}
				/>
			</Box>
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
