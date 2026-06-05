// import {
// 	Icon,
// 	SimpleGrid,
// 	Box,
// 	useColorModeValue,
// 	Text,
// 	Flex,
// } from '@chakra-ui/react';
// import { FaCreativeCommonsBy, FaWpforms, FaWhatsapp } from 'react-icons/fa';
// import { HiOfficeBuilding, HiUsers } from 'react-icons/hi';
// import { TbExchange, TbTableColumn } from 'react-icons/tb';
// import { MdSettings } from 'react-icons/md';
// import { GrValidate } from 'react-icons/gr';
// import { useNavigate } from 'react-router-dom';
// import { RiPlugLine } from 'react-icons/ri';

// const Index = () => {
// 	const navigate = useNavigate();
// 	// const { hasPermission } = usePermissions();

// 	const iconBg = useColorModeValue(
// 		'linear-gradient(135deg, #FFF7D6, #FDE9A9)',
// 		'linear-gradient(135deg, #FAD87A, #E8C46A)',
// 	);
// 	const iconColor = useColorModeValue('#A67C00', '#F6E27F');
// 	const cardBg = useColorModeValue('white', 'gray.800');
// 	const hoverBg = 'gray.100';

// 	const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
// 	const shadowColor = useColorModeValue(
// 		'rgba(0, 0, 0, 0.05)',
// 		'rgba(255, 255, 255, 0.06)',
// 	);

// 	const menuItems = [
// 		{ name: 'Users', icon: HiUsers, route: '/admin-setting/users' },
// 		{ name: 'Roles & Permissions', icon: FaCreativeCommonsBy, route: '/role' },
// 		// { name: "Change Images", icon: TbExchange, route: "/change-images" },
// 		// { name: "Custom Fields", icon: FaWpforms, route: "/custom-Fields" },
// 		// { name: "Validations", icon: GrValidate, route: "/validations" },
// 		// { name: "Table Fields", icon: TbTableColumn, route: "/table-field" },
// 		{ name: 'Lead Settings', icon: MdSettings, route: '/lead-settings' },
// 		{ name: 'Agencies', icon: HiOfficeBuilding, route: '/agencies' },
// 		{
// 			name: 'WhatsApp Manager',
// 			icon: FaWhatsapp,
// 			route: '/admin-setting/whatsapp/settings',
// 		},
// 		{
// 			name: 'Configuration',
// 			icon: MdSettings,
// 			route: '/admin-setting/configuration',
// 		},
// 		{
// 			name: 'Integrations',
// 			icon: RiPlugLine,
// 			route: '/admin-setting/integrations',
// 		},
// 	];

// 	return (
// 		<Box w='100%' px={{ base: 2, md: 4 }} py={4}>
// 			<SimpleGrid
// 				columns={{ base: 1, md: 2, lg: 3 }}
// 				spacing={{ base: 3, md: 4, lg: 6 }}
// 				justifyItems='center'
// 				alignItems='stretch'
// 			>
// 				{menuItems.map((item, i) => (
// 					<Box
// 						key={i}
// 						onClick={() => navigate(item.route)}
// 						bg={cardBg}
// 						borderRadius='2xl'
// 						p={{ base: 4, md: 5 }}
// 						w='100%'
// 						cursor='pointer'
// 						boxShadow={`0 1px 3px ${shadowColor}`}
// 						transition='all 0.25s ease-in-out'
// 						_hover={{
// 							transform: 'translateY(-4px)',
// 							boxShadow: `0 6px 12px ${shadowColor}`,
// 							bg: hoverBg,
// 						}}
// 					>
// 						<Flex direction='column' align='center' justify='center' gap={3}>
// 							<Box
// 								bg={iconBg}
// 								w='58px'
// 								h='58px'
// 								display='flex'
// 								alignItems='center'
// 								justifyContent='center'
// 								borderRadius='full'
// 								shadow='sm'
// 								transition='all 0.2s ease-in-out'
// 								_hover={{ transform: 'scale(1.08)' }}
// 							>
// 								<Icon as={item.icon} boxSize='24px' color={iconColor} />
// 							</Box>

// 							<Text
// 								fontSize='clamp(0.9rem, 2vw, 1rem)'
// 								fontWeight='600'
// 								color={textColor}
// 								textAlign='center'
// 							>
// 								{item.name}
// 							</Text>
// 						</Flex>
// 					</Box>
// 				))}
// 			</SimpleGrid>
// 		</Box>
// 	);
// };

// export default Index;
import {
	Icon,
	SimpleGrid,
	Box,
	Text,
	Flex,
	Badge,
	useBreakpointValue,
} from '@chakra-ui/react';
import { FaCreativeCommonsBy, FaWhatsapp } from 'react-icons/fa';
import { HiOfficeBuilding, HiUsers } from 'react-icons/hi';
import { MdSettings } from 'react-icons/md';
import { RiPlugLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const Index = () => {
	const navigate = useNavigate();

	const columns = useBreakpointValue({
		base: 1,
		sm: 2,
		lg: 3,
		xl: 4,
	});
	const menuItems = [
		{
			name: 'Users',
			icon: HiUsers,
			route: '/admin-setting/users',
			description: 'Manage users, teams & access',
			iconColor: '#3B82F6',
			iconBg: 'rgba(59, 130, 246, 0.12)',
		},
		{
			name: 'Roles & Permissions',
			icon: FaCreativeCommonsBy,
			route: '/role',
			description: 'Control permissions & visibility',
			iconColor: '#8B5CF6',
			iconBg: 'rgba(139, 92, 246, 0.12)',
		},
		{
			name: 'Lead Settings',
			icon: MdSettings,
			route: '/lead-settings',
			description: 'Customize lead workflows',
			iconColor: '#F59E0B',
			iconBg: 'rgba(245, 158, 11, 0.12)',
		},
		{
			name: 'Agencies',
			icon: HiOfficeBuilding,
			route: '/agencies',
			description: 'Manage agencies & workspaces',
			iconColor: '#10B981',
			iconBg: 'rgba(16, 185, 129, 0.12)',
		},
		{
			name: 'WhatsApp Manager',
			icon: FaWhatsapp,
			route: '/admin-setting/whatsapp/settings',
			description: 'Connect and manage WhatsApp',
			iconColor: '#25D366',
			iconBg: 'rgba(37, 211, 102, 0.12)',
			isPopular: true,
		},
		{
			name: 'Configuration',
			icon: MdSettings,
			route: '/admin-setting/configuration',
			description: 'Global CRM configurations',
			iconColor: '#EF4444',
			iconBg: 'rgba(239, 68, 68, 0.12)',
		},
		{
			name: 'Integrations',
			icon: RiPlugLine,
			route: '/admin-setting/integrations',
			description: 'Third-party apps & APIs',
			iconColor: '#06B6D4',
			iconBg: 'rgba(6, 182, 212, 0.12)',
		},
	];

	return (
		<Box w='100%' py={{ base: 2, md: 4 }}>
			{/* Header */}
			<Flex
				mb={{ base: 5, md: 8 }}
				direction={{ base: 'column', md: 'row' }}
				align={{ base: 'flex-start', md: 'center' }}
				justify='space-between'
				gap={3}
			>
				<Box>
					<Text
						fontSize={{ base: '2xl', md: '3xl' }}
						fontWeight='bold'
						color='text.heading'
						letterSpacing='tight'
					>
						Admin Settings
					</Text>

					<Text fontSize={{ base: 'sm', md: 'md' }} color='text.muted' mt={1}>
						Manage CRM settings, permissions, integrations and platform tools.
					</Text>
				</Box>
			</Flex>

			{/* Grid */}
			<SimpleGrid
				columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
				spacing={{ base: 2, md: 4 }}
			>
				{menuItems.map((item, i) => (
					<Box
						key={i}
						onClick={() => navigate(item.route)}
						position='relative'
						role='group'
						cursor='pointer'
						bg='bg.surface'
						border='1px solid'
						borderColor='border.default'
						borderRadius='2xl'
						p={{ base: 5, md: 6 }}
						overflow='hidden'
						transition='all .3s cubic-bezier(0.4, 0, 0.2, 1)'
						boxShadow='soft'
						_hover={{
							transform: 'translateY(-6px)',
							borderColor: 'gold.primary',
							boxShadow: 'goldGlow',
							bg: 'bg.elevated',
						}}
					>
						{/* Glow Effect */}
						<Box
							position='absolute'
							top='-40px'
							right='-40px'
							w='120px'
							h='120px'
							bg='radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)'
							opacity='0'
							transition='all .3s ease'
							_groupHover={{
								opacity: 1,
								transform: 'scale(1.1)',
							}}
						/>

						{/* Top Accent */}
						<Box
							position='absolute'
							top='0'
							left='0'
							right='0'
							h='2px'
							bgGradient='linear-gradient(90deg, transparent, #D4AF37, transparent)'
							opacity='0'
							transition='opacity .3s'
							_groupHover={{ opacity: 1 }}
						/>

						<Flex
							direction='column'
							align='flex-start'
							justify='space-between'
							h='100%'
							position='relative'
							zIndex={1}
						>
							{/* Icon + badge */}
							<Flex w='100%' align='flex-start' justify='space-between' mb={5}>
								<Box
									w='64px'
									h='64px'
									borderRadius='2xl'
									bg={item.iconBg}
									border='1px solid'
									borderColor={item.iconBg}
									display='flex'
									alignItems='center'
									justifyContent='center'
									transition='all .25s ease'
									_groupHover={{
										transform: 'scale(1.06) rotate(-4deg)',
										boxShadow: `0 0 20px ${item.iconBg}`,
									}}
								>
									<Icon as={item.icon} boxSize={7} color={item.iconColor} />
								</Box>
								{item.isPopular && (
									<Badge
										variant='gold'
										borderRadius='full'
										px={2.5}
										py={1}
										fontSize='10px'
									>
										Popular
									</Badge>
								)}
							</Flex>

							{/* Content */}
							<Box flex='1'>
								<Text
									fontSize={{ base: 'lg', md: 'xl' }}
									fontWeight='700'
									color='text.heading'
									mb={2}
									lineHeight='1.3'
								>
									{item.name}
								</Text>

								<Text fontSize='sm' color='text.muted' lineHeight='1.7'>
									{item.description}
								</Text>
							</Box>

							{/* Footer */}
							{/* <Flex
								mt={6}
								align='center'
								gap={2}
								color='gold.primary'
								fontSize='sm'
								fontWeight='semibold'
								transition='all .25s'
								_groupHover={{
									transform: 'translateX(4px)',
								}}
							>
								<Text>Open Module</Text>
								<Text fontSize='md'>→</Text>
							</Flex> */}
						</Flex>
					</Box>
				))}
			</SimpleGrid>
		</Box>
	);
};

export default Index;
