import React, { useMemo } from 'react';
import {
	Box,
	Heading,
	SimpleGrid,
	Text,
	VStack,
	Button,
	Flex,
} from '@chakra-ui/react';
import { usePermissions } from 'hooks/usePermissions';
import { useNavigate } from 'react-router-dom';
import sidebarRoutes from 'sidebarRoutes';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import useUserSession from 'hooks/useUserSession';
import { moduleIcons } from 'views/admin/userPermission/moduleIcons';
import { FiLayers } from 'react-icons/fi';

const gradientThemes = [
	{
		accent: 'linear(to-r, cyan.400, blue.500)',
		cardBg: 'linear-gradient(135deg, rgba(6,182,212,0.14), rgba(37,99,235,0.08))',
		iconBg: 'rgba(6,182,212,0.14)',
		glow: '0 10px 30px rgba(6,182,212,0.18)',
		border: 'rgba(6,182,212,0.22)',
	},
	{
		accent: 'linear(to-r, purple.400, pink.500)',
		cardBg: 'linear-gradient(135deg, rgba(168,85,247,0.14), rgba(236,72,153,0.08))',
		iconBg: 'rgba(168,85,247,0.14)',
		glow: '0 10px 30px rgba(168,85,247,0.18)',
		border: 'rgba(168,85,247,0.22)',
	},
	{
		accent: 'linear(to-r, orange.400, red.500)',
		cardBg: 'linear-gradient(135deg, rgba(251,146,60,0.14), rgba(239,68,68,0.08))',
		iconBg: 'rgba(251,146,60,0.14)',
		glow: '0 10px 30px rgba(251,146,60,0.18)',
		border: 'rgba(251,146,60,0.22)',
	},
	{
		accent: 'linear(to-r, green.400, teal.500)',
		cardBg: 'linear-gradient(135deg, rgba(34,197,94,0.14), rgba(20,184,166,0.08))',
		iconBg: 'rgba(34,197,94,0.14)',
		glow: '0 10px 30px rgba(34,197,94,0.18)',
		border: 'rgba(34,197,94,0.22)',
	},
	{
		accent: 'linear(to-r, yellow.400, orange.500)',
		cardBg: 'linear-gradient(135deg, rgba(250,204,21,0.14), rgba(249,115,22,0.08))',
		iconBg: 'rgba(250,204,21,0.14)',
		glow: '0 10px 30px rgba(250,204,21,0.18)',
		border: 'rgba(250,204,21,0.22)',
	},
	{
		accent: 'linear(to-r, pink.400, rose.500)',
		cardBg: 'linear-gradient(135deg, rgba(244,114,182,0.14), rgba(244,63,94,0.08))',
		iconBg: 'rgba(244,114,182,0.14)',
		glow: '0 10px 30px rgba(244,114,182,0.18)',
		border: 'rgba(244,114,182,0.22)',
	},
];

// descriptions for each module
const moduleDescriptions = {
	leads: 'Manage and track leads efficiently.',
	leadpool_admin: 'Central pool of shared leads.',
	deal: 'Handle client deals and progress.',
	announcement: 'Post and manage announcements.',
	hiring: 'Track hiring and candidates.',
	attendance: 'Monitor employee attendance.',
	invoice: 'Create and manage invoices.',
	expense: 'Record and control expenses.',
	task: 'Assign and track tasks.',
	listing: 'Manage property or item listings.',
	survey: 'Collect insights through surveys.',
	sip: 'Log and monitor call activities.',
	reports: 'Analytics and reporting dashboard.',
	users: 'Manage user accounts and roles.',
	system_log: 'Track system activities and logs.',
};

// lighter gradients for a softer look
const gradients = [
	'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', // light blue → sky
	'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', // pink → lavender
	'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', // peach → soft orange
	'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)', // lime → mint
	'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', // light gold → coral
	'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', // mint → sky blue
	'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)', // soft gray → light blue
	'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', // lavender → baby blue
	'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', // soft pink blend
	'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)', // warm cream → aqua
];

const PermissionSection = () => {
	const navigate = useNavigate();
	const { hasPermission } = usePermissions();
	const { user } = useUserSession();

	// filter by permissions
	const visibleRoutes = useMemo(() => {
		const allRoutes = [];

		for (const category of sidebarRoutes) {
			if (!category.routes) continue;

			// Filter routes based on permissions
			const filteredRoutes = category.routes.filter(route => {
				// Skip Dashboard
				if (route.name === 'Dashboard') return false;

				// Check permission only if route has moduleId
				if (route.moduleId) {
					// Special check for WhatsApp
					if (route.moduleId === 'whatsapp') {
						return user?.whatsappDetails?.isActive && user?.whatsappDetails?.phoneNumber;
					}
					return hasPermission(route.moduleId);
				}

				// Include routes without moduleId
				return true;
			});

			// Add filtered routes to result
			allRoutes.push(...filteredRoutes);
		}

		return allRoutes;
	}, [hasPermission]);

	console.log({ visibleRoutes })

	return (
		// <Box my={8} px={[2, 4, 6]}>
		// 	{/* Heading */}
		// 	<Heading size='lg' mb={8} color='gray.700' fontWeight='bold'>
		// 		Modules
		// 	</Heading>

		// 	<SimpleGrid columns={[1, 2, 3, 4]} spacing={8}>
		// 		{visibleRoutes.map((route, index) => {
		// 			const bgColor = gradients[index % gradients.length];
		// 			return (
		// 				<Box
		// 					key={`${route.path}-${index}`}
		// 					bg={bgColor}
		// 					p={6}
		// 					borderRadius='xl'
		// 					shadow='md'
		// 					position='relative'
		// 					overflow='hidden'
		// 					transition='all 0.3s ease'
		// 					_hover={{
		// 						transform: 'translateY(-4px)',
		// 						shadow: 'xl',
		// 					}}
		// 					cursor='pointer'
		// 					onClick={() => navigate(route.path)}
		// 					backdropFilter='blur(6px) saturate(140%)'
		// 				>
		// 					{/* Icon */}
		// 					<Flex justify='space-between' align='center' mb={4}>
		// 						<Box
		// 							bg='whiteAlpha.700'
		// 							p={3}
		// 							borderRadius='lg'
		// 							display='flex'
		// 							alignItems='center'
		// 							justifyContent='center'
		// 							color='gray.700'
		// 						>
		// 							{route.icon}
		// 						</Box>
		// 					</Flex>

		// 					{/* Texts */}
		// 					<VStack align='flex-start' spacing={2}>
		// 						<Text fontWeight='bold' fontSize='md' color='gray.800'>
		// 							{route.name}
		// 						</Text>
		// 						{/* <Text fontSize='xs' color='gray.600'>
		// 							{moduleDescriptions[route.moduleId] ||
		// 								'Module functionality.'}
		// 						</Text> */}

		// 						{/* Action button */}
		// 						<Button
		// 							size='sm'
		// 							variant='solid'
		// 							bg='white'
		// 							color='gray.800'
		// 							width='100%'
		// 							boxShadow='sm'
		// 							_hover={{ boxShadow: 'md', transform: 'scale(1.02)' }}
		// 							backdropFilter='blur(8px) saturate(150%)'
		// 							onClick={(e) => {
		// 								e.stopPropagation();
		// 								navigate(route.path);
		// 							}}
		// 							rightIcon={<ExternalLinkIcon />}
		// 						>
		// 							Go To
		// 						</Button>
		// 					</VStack>
		// 				</Box>
		// 			);
		// 		})}
		// 	</SimpleGrid>
		// </Box>

		<Box bg='bg.surface' boxShadow='card' borderRadius='lg' p={[2, 4, 6]} mb={4}>
			<Heading size='lg' mb={8} color='text.heading' fontWeight='bold'>
				Modules
			</Heading>

			<SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 5 }} spacing={6}>
				{
					visibleRoutes.map((route, index) => {
						const theme = gradientThemes[index % gradientThemes.length];

						return (
							<Box
								key={`${route.path}-${index}`}
								role='group'
								position='relative'
								overflow='hidden'
								cursor='pointer'
								borderRadius='2xl'
								bg={theme.cardBg}
								backdropFilter='blur(14px)'
								border='1px solid'
								borderColor={theme.border}
								boxShadow='0 6px 24px rgba(0,0,0,0.08)'
								transition='all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
								_hover={{
									transform: 'translateY(-8px)',
									boxShadow: theme.glow,
									borderColor: 'whiteAlpha.300',
								}}
								onClick={() => navigate(route.path)}
							>
								{/* Animated Glow */}
								<Box
									position='absolute'
									top='-40%'
									right='-20%'
									w='140px'
									h='140px'
									bgGradient={theme.accent}
									opacity={0.12}
									filter='blur(60px)'
									borderRadius='full'
									transition='all 0.4s ease'
									_groupHover={{
										transform: 'scale(1.2)',
										opacity: 0.2,
									}}
								/>

								{/* Top Gradient Bar */}
								<Box h='4px' bgGradient={theme.accent} />

								<Box p={5} position='relative' zIndex={2}>
									<Flex justify='space-between' align='flex-start' mb={5}>
										<Box
											w='48px'
											h='48px'
											display='flex'
											alignItems='center'
											justifyContent='center'
											borderRadius='18px'
											bg={theme.iconBg}
											color='white'
											fontSize='24px'
											backdropFilter='blur(12px)'
											border='1px solid rgba(255,255,255,0.08)'
											transition='all 0.3s ease'
											_groupHover={{
												transform: 'scale(1.08) rotate(-4deg)',
											}}
										>
											{moduleIcons[route.moduleId] || <FiLayers size={20} />}
										</Box>

										{/* <Box
											fontSize='11px'
											fontWeight='700'
											px={3}
											py={1}
											borderRadius='full'
											bg='whiteAlpha.100'
											color='gray.300'
											backdropFilter='blur(10px)'
										>
											Module
										</Box> */}
									</Flex>

									<Text
										fontSize='lg'
										fontWeight='800'
										color='white'
										// letterSpacing='-0.3px'
										mb={2}
										noOfLines={1}
									>
										{route.name}
									</Text>

									<Text
										fontSize='sm'
										color='gray.400'
										mb={5}
										noOfLines={2}
										lineHeight='1.6'
									>
										Access and manage {route.name.toLowerCase()} module settings
										and operations.
									</Text>

									<Button
										size='sm'
										w='full'
										borderRadius='xl'
										bg='whiteAlpha.100'
										color='white'
										fontWeight='600'
										rightIcon={<ExternalLinkIcon />}
										backdropFilter='blur(10px)'
										border='1px solid rgba(255,255,255,0.08)'
										transition='all 0.25s ease'
										_hover={{
											bg: 'whiteAlpha.200',
											transform: 'translateX(3px)',
										}}
										_active={{
											transform: 'scale(0.98)',
										}}
										onClick={(e) => {
											e.stopPropagation();
											navigate(route.path);
										}}
									>
										Open Module
									</Button>
								</Box>
							</Box>
						);
					})
				}
			</SimpleGrid>
		</Box>
	);
};

export default PermissionSection;
