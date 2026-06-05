// import {
// 	Box,
// 	Heading,
// 	Image,
// 	Text,
// 	useBreakpointValue,
// 	Button,
// 	Flex,
// } from '@chakra-ui/react';
// // import DashboardHeader from '../../../../assets/img/dashboard-header.jpeg';
// import { useNavigate } from 'react-router-dom';
// import logo from '../../../../assets/img/logo-crm.png';
// import { useFetchItemsQuery } from 'api/apiSlice';
// import { usePermissions } from 'hooks/usePermissions';
// import useUserSession from 'hooks/useUserSession';

// // const Header = () => {
// // 	const { agencyLogo } = useUserSession();
// // 	// Dynamically adjust text alignment based on screen size
// // 	const textAlign = useBreakpointValue({ base: 'center', md: 'left' });
// // 	const navigate = useNavigate();

// // 	const { isSuperAdmin, agencyName } = useUserSession();

// // 	const { hasPermission } = usePermissions();

// // 	const { data: surveysCheck } = useFetchItemsQuery(
// // 		{ path: '/surveys/user_pending' },
// // 		{ refetchOnMountOrArgChange: true },
// // 		{
// // 			skip: isSuperAdmin,
// // 		},
// // 	);

// // 	return (
// // 		<>
// // 			{/* Reminder Bar */}
// // 			{!isSuperAdmin &&
// // 				surveysCheck?.data?.pending &&
// // 				hasPermission('survey') && (
// // 					<Box
// // 						w='100%'
// // 						bg='#EDC270'
// // 						py={2}
// // 						px={{ base: 3, md: 8 }}
// // 						display='flex'
// // 						flexDirection={{ base: 'column', md: 'row' }}
// // 						alignItems={{ base: 'stretch', md: 'center' }}
// // 						justifyContent='space-between'
// // 						rounded='xl'
// // 						mb={8}
// // 						gap={3}
// // 					>
// // 						<Text
// // 							fontWeight='medium'
// // 							fontSize={{ base: 'sm', md: 'lg' }}
// // 							color='#FFFFFF'
// // 							textAlign={{ base: 'center', md: 'left' }}
// // 						>
// // 							🚨 Reminder! You have pending surveys to complete before time runs
// // 							out. Don’t miss your chance!
// // 						</Text>
// // 						<Button
// // 							bg='#FFFFFFC9'
// // 							color='black'
// // 							borderRadius='10px'
// // 							mt={{ base: 2, md: 0 }}
// // 							ml={{ base: 0, md: 4 }}
// // 							onClick={() => navigate('/survey')}
// // 							_hover={{ bg: '#fff' }}
// // 							fontWeight='bold'
// // 							size='md'
// // 							px={{ base: 8, md: 16, lg: 28 }}
// // 							w={{ base: '100%', md: 'auto' }}
// // 						>
// // 							Go
// // 						</Button>
// // 					</Box>
// // 				)}
// // 			<Box
// // 				mb={8}
// // 				mt='-15px'
// // 				// h={{ base: 'auto', md: '270px' }}
// // 				w='100%'
// // 				px={{ base: 6, md: 10 }}
// // 				py={6}
// // 				bg='white'
// // 				// bg='linear-gradient(90deg, #EDD199 0%, rgb(221, 184, 92) 100%)'
// // 				backgroundSize='cover'
// // 				backgroundPosition='center'
// // 				backgroundBlendMode='overlay'
// // 				display='flex'
// // 				rounded={'2xl'}
// // 				flexDir='column'
// // 				justifyContent='center'
// // 				alignItems={{ base: 'center', md: 'flex-start' }}
// // 				textAlign={textAlign} // Apply responsive text alignment
// // 			>
// // 				{/* Logo at the top */}
// // 				<Image
// // 					src={agencyLogo || logo}
// // 					alt='CRM'
// // 					boxSize={{ base: '50px', md: '90px' }}
// // 					objectFit='contain'
// // 					mb={2}
// // 				/>

// // 				{/* Main Heading */}
// // 				<Heading
// // 					fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }}
// // 					// color='gray.800'
// // 					color='brand.500'
// // 					fontWeight='semibold'
// // 				>
// // 					{agencyName ? `${agencyName} CRM` : 'Weam CRM'}
// // 				</Heading>

// // 				<Text
// // 					fontSize={{ base: 'sm', md: 'md' }}
// // 					color='gray.500'
// // 					ml='2'
// // 					fontWeight='normal'
// // 				>
// // 					{agencyName
// // 						? `Welcome to ${agencyName} CRM`
// // 						: 'Welcome to your CRM dashboard'}
// // 				</Text>
// // 			</Box>
// // 		</>
// // 	);
// // };

// const Header = () => {
// 	const { agencyLogo, isSuperAdmin, agencyName } = useUserSession();
// 	const { hasPermission } = usePermissions();
// 	const navigate = useNavigate();

// 	const textAlign = useBreakpointValue({ base: 'center', md: 'left' });

// 	const { data: surveysCheck } = useFetchItemsQuery(
// 		{ path: '/surveys/user_pending' },
// 		{
// 			refetchOnMountOrArgChange: true,
// 			skip: isSuperAdmin, // ✅ fixed placement
// 		},
// 	);

// 	return (
// 		<>
// 			{/* Reminder Bar */}
// 			{!isSuperAdmin &&
// 				surveysCheck?.data?.pending &&
// 				hasPermission('survey') && (
// 					<Box
// 						w='100%'
// 						bg='accent.gold'
// 						py='sm'
// 						px={{ base: 'md', md: 'xl' }}
// 						display='flex'
// 						flexDirection={{ base: 'column', md: 'row' }}
// 						alignItems={{ base: 'stretch', md: 'center' }}
// 						justifyContent='space-between'
// 						rounded='lg'
// 						mb='xl'
// 						gap='sm'
// 					>
// 						<Text
// 							fontWeight='medium'
// 							fontSize={{ base: 'small', md: 'body' }}
// 							color='text.inverse'
// 							textAlign={{ base: 'center', md: 'left' }}
// 						>
// 							🚨 Reminder! You have pending surveys to complete before time runs
// 							out.
// 						</Text>

// 						<Button
// 							variant='outline'
// 							onClick={() => navigate('/survey')}
// 							fontWeight='semibold'
// 							w={{ base: '100%', md: 'auto' }}
// 						>
// 							Go
// 						</Button>
// 					</Box>
// 				)}

// 			{/* Header Card */}
// 			<Box
// 				mb='xl'
// 				mt='-12px'
// 				w='100%'
// 				px={{ base: 'lg', md: 'xl' }}
// 				py='lg'
// 				bg='bg.surface'
// 				display='flex'
// 				rounded='xl'
// 				flexDir='column'
// 				justifyContent='center'
// 				alignItems={{ base: 'center', md: 'flex-start' }}
// 				textAlign={textAlign}
// 				boxShadow='card'
// 			>
// 				{/* Logo */}
// 				<Image
// 					src={agencyLogo || logo}
// 					alt='CRM'
// 					boxSize={{ base: '48px', md: '72px' }}
// 					objectFit='contain'
// 					mb='sm'
// 				/>

// 				{/* Heading */}
// 				<Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }}>
// 					<span className='gold-text'>
// 						{agencyName ? `${agencyName} CRM` : 'Weam CRM'}
// 					</span>
// 				</Heading>

// 				<Text
// 					fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
// 					color='text.body'
// 					mt='xs'
// 				>
// 					{agencyName
// 						? `Welcome to ${agencyName} CRM`
// 						: 'Welcome to your CRM dashboard'}
// 				</Text>
// 			</Box>
// 		</>
// 	);
// };
// export default Header;

import {
	Box,
	Flex,
	Heading,
	Text,
	Image,
	Button,
	useBreakpointValue,
	HStack,
	Badge,
	Icon,
	Avatar,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Divider,
	keyframes,
	Tooltip,
	Skeleton,
	Stat,
	StatNumber,
	StatLabel,
	SimpleGrid,
	IconButton,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
	MdDashboard,
	MdNotifications,
	MdSettings,
	MdHelp,
	MdLogout,
	MdVerified,
	MdStar,
	MdDateRange,
	MdPeople,
	MdBusiness,
} from 'react-icons/md';
import { FaCrown, FaChartLine } from 'react-icons/fa';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useUserSession } from 'hooks/useUserSession';
import { usePermissions } from 'hooks/usePermissions';
import defaultLogo from '../../../../assets/img/logo-crm.png';

import { useState } from 'react';

// Animations
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const glowPulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
  100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
`;

const Header = () => {
	const { agencyLogo, isSuperAdmin, agencyName, user, userRoleName } =
		useUserSession();
	const { hasPermission } = usePermissions();
	const navigate = useNavigate();
	const [isImageError, setIsImageError] = useState(false);

	const textAlign = useBreakpointValue({ base: 'center', md: 'left' });
	const isMobile = useBreakpointValue({ base: true, md: false });
	const logoSize = useBreakpointValue({ base: '56px', sm: '64px', md: '80px' });

	const { data: surveysCheck, isLoading: surveysLoading } = useFetchItemsQuery(
		{ path: '/surveys/user_pending' },
		{
			refetchOnMountOrArgChange: true,
			skip: isSuperAdmin,
		},
	);

	// Get current date/time
	const currentDate = new Date();
	const formattedDate = currentDate.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
	const greeting = getGreeting();
	const timeOfDay = getTimeOfDay();

	function getGreeting() {
		const hour = new Date().getHours();
		if (hour < 12) return 'Good Morning';
		if (hour < 18) return 'Good Afternoon';
		return 'Good Evening';
	}

	function getTimeOfDay() {
		const hour = new Date().getHours();
		if (hour < 12) return '🌅';
		if (hour < 18) return '☀️';
		return '🌙';
	}

	const handleLogoError = () => {
		setIsImageError(true);
	};

	// Logo source with fallback
	const logoSrc = !isImageError && agencyLogo ? agencyLogo : defaultLogo;

	return (
		<Box mb={6} w='100%'>
			{/* Reminder Bar - Enhanced */}
			{!isSuperAdmin &&
				surveysCheck?.data?.pending &&
				hasPermission('survey') && (
					<Box
						w='100%'
						bg='linear-gradient(135deg, #D4AF37 0%, #C9A227 100%)'
						py={3}
						px={{ base: 4, md: 6 }}
						display='flex'
						flexDirection={{ base: 'column', md: 'row' }}
						alignItems={{ base: 'stretch', md: 'center' }}
						justifyContent='space-between'
						rounded='lg'
						mb={5}
						gap={3}
						position='relative'
						overflow='hidden'
					>
						{/* Animated background */}
						<Box
							position='absolute'
							top='0'
							left='0'
							right='0'
							bottom='0'
							bg='linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
							animation={`${shimmer} 2s infinite`}
							backgroundSize='200% 100%'
							pointerEvents='none'
						/>

						<Flex align='center' gap={3}>
							<Box
								w='10px'
								h='10px'
								bg='white'
								borderRadius='full'
								animation={`${glowPulse} 1.5s infinite`}
							/>
							<Text
								fontWeight='semibold'
								fontSize={{ base: 'sm', md: 'md' }}
								color='#000000'
							>
								⚠️ Reminder: You have pending surveys to complete!
							</Text>
						</Flex>

						<Button
							variant='outline'
							onClick={() => navigate('/survey')}
							size='sm'
							borderRadius='full'
							borderColor='rgba(0,0,0,0.3)'
							color='#000000'
							_hover={{
								bg: 'rgba(0,0,0,0.05)',
								borderColor: '#000000',
								transform: 'translateY(-1px)',
							}}
							_active={{ transform: 'translateY(0)' }}
						>
							Complete Now →
						</Button>
					</Box>
				)}

			{/* Main Header Card */}
			<Box
				w='100%'
				px={{ base: 4, sm: 5, md: 6, lg: 8 }}
				py={{ base: 5, sm: 6, md: 7 }}
				bg='bg.surface'
				rounded='xl'
				boxShadow='card'
				borderWidth='1px'
				borderColor='border.default'
				position='relative'
				overflow='hidden'
				transition='all 0.3s ease'
				_hover={{ boxShadow: 'goldGlow', borderColor: 'gold.primary' }}
			>
				{/* Decorative background pattern */}
				<Box
					position='absolute'
					top='-50%'
					right='-20%'
					w='300px'
					h='300px'
					bg='radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 70%)'
					borderRadius='full'
					pointerEvents='none'
				/>
				<Box
					position='absolute'
					bottom='-30%'
					left='-10%'
					w='250px'
					h='250px'
					bg='radial-gradient(circle, rgba(212, 175, 55, 0.02) 0%, transparent 70%)'
					borderRadius='full'
					pointerEvents='none'
				/>

				<Flex
					direction={{ base: 'column', md: 'row' }}
					align={{ base: 'center', md: 'flex-start' }}
					gap={{ base: 4, md: 6 }}
				>
					{/* Logo Section */}
					<Flex
						position='relative'
						align='center'
						justify='center'
						flexShrink={0}
					>
						<Skeleton isLoaded={!surveysLoading} borderRadius='xl'>
							<Box
								position='relative'
								_hover={{
									'& > .logo-ring': {
										opacity: 1,
										transform: 'scale(1.05)',
									},
								}}
							>
								{/* Animated ring effect on hover */}
								<Box
									// className='logo-ring'
									position='absolute'
									top='-8px'
									left='-8px'
									right='-8px'
									bottom='-8px'
									borderRadius='full'
									border='2px solid'
									borderColor='gold.primary'
									opacity='0'
									transition='all 0.3s'
									pointerEvents='none'
								/>
								<Image
									src={logoSrc}
									alt={`${agencyName || 'CRM'} Logo`}
									boxSize={logoSize}
									objectFit='contain'
									borderRadius='lg'
									bg='rgba(0,0,0,0.2)'
									p={1}
									fallbackSrc={defaultLogo}
									onError={handleLogoError}
								/>
							</Box>
						</Skeleton>

						{/* Verified badge for premium */}
						{agencyName && (
							<Tooltip label='Verified Business' placement='top'>
								<Box
									position='absolute'
									bottom='-5px'
									right='-5px'
									bg='gold.primary'
									borderRadius='full'
									p='2px'
								>
									<Icon as={MdVerified} boxSize='12px' color='green.400' />
								</Box>
							</Tooltip>
						)}
					</Flex>

					{/* Text Content */}
					<Box flex='1' textAlign={textAlign} w={{ base: '100%', md: 'auto' }}>
						{/* Greeting with time icon */}
						<Flex
							align={{ base: 'center', md: 'flex-start' }}
							gap={2}
							mb={2}
							direction={{ base: 'column', md: 'row' }}
						>
							<Box>
								<Text
									fontSize={{ base: 'sm', md: 'md' }}
									color='text.accent'
									fontWeight='medium'
								>
									{greeting}, {user?.firstName || 'User'} {timeOfDay}
								</Text>
							</Box>
							<Badge
								variant='gold'
								borderRadius='full'
								px={2}
								py={1}
								fontSize={{ base: '10px', md: 'xs' }}
							>
								<HStack spacing={1}>
									<Icon as={MdDateRange} boxSize='10px' />
									<Text>{formattedDate}</Text>
								</HStack>
							</Badge>
						</Flex>

						{/* Main Title */}
						<Heading
							fontSize={{ base: '2xl', sm: '3xl', md: '4xl', lg: '5xl' }}
							color='text.heading'
							lineHeight='1.2'
							mb={2}
							textTransform='capitalize'
						>
							{agencyName ? (
								<>
									{agencyName}
									<Box as='span' color='text.accent'>
										{' '}
										CRM
									</Box>
								</>
							) : (
								'Weam CRM'
							)}
						</Heading>

						{/* Subtitle with user role */}
						<Text
							fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
							color='text.body'
							mb={3}
						>
							{agencyName
								? `Welcome to your ${agencyName} CRM dashboard`
								: 'Welcome to your CRM dashboard'}
						</Text>
					</Box>
				</Flex>

				{/* Subtle progress bar at bottom */}
				<Box
					position='absolute'
					bottom='0'
					left='0'
					right='0'
					h='2px'
					bg='gold.primary'
					opacity='0.3'
				/>
			</Box>
		</Box>
	);
};

export default Header;
