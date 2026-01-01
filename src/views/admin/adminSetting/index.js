import {
	Icon,
	SimpleGrid,
	Box,
	useColorModeValue,
	Text,
	Flex,
} from '@chakra-ui/react';
import { FaCreativeCommonsBy, FaWpforms, FaWhatsapp } from 'react-icons/fa';
import { HiOfficeBuilding, HiUsers } from 'react-icons/hi';
import { TbExchange, TbTableColumn } from 'react-icons/tb';
import { MdSettings } from 'react-icons/md';
import { GrValidate } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';

const Index = () => {
	const navigate = useNavigate();
	// const { hasPermission } = usePermissions();

	const iconBg = useColorModeValue(
		'linear-gradient(135deg, #FFF7D6, #FDE9A9)',
		'linear-gradient(135deg, #FAD87A, #E8C46A)'
	);
	const iconColor = useColorModeValue('#A67C00', '#F6E27F');
	const cardBg = useColorModeValue('white', 'gray.800');
	const hoverBg = 'gray.100';

	const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
	const shadowColor = useColorModeValue(
		'rgba(0, 0, 0, 0.05)',
		'rgba(255, 255, 255, 0.06)'
	);

	const menuItems = [
		{ name: 'Users', icon: HiUsers, route: '/admin-setting/users' },
		{ name: 'Roles & Permissions', icon: FaCreativeCommonsBy, route: '/role' },
		// { name: "Change Images", icon: TbExchange, route: "/change-images" },
		// { name: "Custom Fields", icon: FaWpforms, route: "/custom-Fields" },
		// { name: "Validations", icon: GrValidate, route: "/validations" },
		// { name: "Table Fields", icon: TbTableColumn, route: "/table-field" },
		{ name: 'Lead Settings', icon: MdSettings, route: '/lead-settings' },
		{ name: 'Agencies', icon: HiOfficeBuilding, route: '/agencies' },
		{
			name: 'WhatsApp Manager',
			icon: FaWhatsapp,
			route: '/admin-setting/whatsapp/settings',
		},
	];

	return (
		<Box w='100%' px={{ base: 2, md: 4 }} py={4}>
			<SimpleGrid
				templateColumns='repeat(auto-fit, minmax(clamp(180px, 22vw, 240px), 1fr))'
				spacing={{ base: 3, md: 5 }}
				justifyItems='center'
				alignItems='stretch'
			>
				{menuItems.map((item, i) => (
					<Box
						key={i}
						onClick={() => navigate(item.route)}
						bg={cardBg}
						borderRadius='2xl'
						p={{ base: 4, md: 5 }}
						w='100%'
						cursor='pointer'
						boxShadow={`0 1px 3px ${shadowColor}`}
						transition='all 0.25s ease-in-out'
						_hover={{
							transform: 'translateY(-4px)',
							boxShadow: `0 6px 12px ${shadowColor}`,
							bg: hoverBg,
						}}
					>
						<Flex direction='column' align='center' justify='center' gap={3}>
							<Box
								bg={iconBg}
								w='58px'
								h='58px'
								display='flex'
								alignItems='center'
								justifyContent='center'
								borderRadius='full'
								shadow='sm'
								transition='all 0.2s ease-in-out'
								_hover={{ transform: 'scale(1.08)' }}
							>
								<Icon as={item.icon} boxSize='24px' color={iconColor} />
							</Box>

							<Text
								fontSize='clamp(0.9rem, 2vw, 1rem)'
								fontWeight='600'
								color={textColor}
								textAlign='center'
							>
								{item.name}
							</Text>
						</Flex>
					</Box>
				))}

				{/* <MiniStatistics
					fontsize='md'
					onClick={() => navigate('/developers')}
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
							icon={
								<Icon w='28px' h='28px' as={MdConstruction} color='white' />
							}
						/>
					}
					name='Developers'
				/>
				<MiniStatistics
					fontsize='md'
					onClick={() => navigate('/bank-accounts')}
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
							icon={
								<Icon
									w='28px'
									h='28px'
									as={MdAccountBalanceWallet}
									color='white'
								/>
							}
						/>
					}
					name='Bank Accounts'
				/> */}
				{/* <MiniStatistics
					fontsize="md"
					onClick={() => navigate("/announcements")}
					startContent={
						<IconBox
							w="56px"
							h="56px"
							bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
							icon={<Icon w="28px" h="28px" as={MdCampaign} color="white" />}
						/>
					}
					name="Announcement"
				/> */}
			</SimpleGrid>
		</Box>
	);
};

export default Index;
