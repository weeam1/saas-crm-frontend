import { useNavigate } from 'react-router-dom';
import { Box, SimpleGrid, Text, Icon } from '@chakra-ui/react';
import {
	FaTachometerAlt,
	FaUsers,
	FaClipboardList,
	FaUserCheck,
} from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { usePermissions } from 'hooks/usePermissions';
import { useEffect } from 'react';
import useUserSession from 'hooks/useUserSession';

const NavigationBoxes = () => {
	const navigate = useNavigate();
	const { hasPermission } = usePermissions();

	useEffect(() => {
		if (!hasPermission('attendance')) return navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const { user, userRoleName, isSuperAdmin, isAdmin } = useUserSession();

	const allMenuItems = [
		{
			label: 'Dashboard',
			icon: FaTachometerAlt,
			route: '/attendance/dashboard',
		},
		{ label: 'Employees', icon: FaUsers, route: '/attendance/employees' },
		{ label: 'Records', icon: FaClipboardList, route: '/attendance/record' },
		{
			label: 'My Attendance',
			icon: FaUserCheck,
			route: `/attendance/employees/${user?._id}`,
		},
		// {
		// 	label: 'Office Settings',
		// 	icon: FiSettings,
		// 	route: `/office-settings/${user?.agency?._id}`,
		// },
	];

	// Show all items for superAdmin and HR; otherwise, only show "My Attendance"
	const menuItems =
		isSuperAdmin || isAdmin
			? allMenuItems.filter((item) => item.label !== 'My Attendance')
			: userRoleName === 'HR'
				? allMenuItems
				: allMenuItems.filter((item) => item.label === 'My Attendance');

	return (
		<Box>
			<SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} p={6}>
				{menuItems.map((item) => (
					<Box
						key={item.label}
						p={6}
						bg='white'
						borderRadius='lg'
						textAlign='center'
						cursor='pointer'
						_hover={{ bg: 'brand.400', color: 'white' }}
						onClick={() => navigate(item.route)}
					>
						<Icon as={item.icon} boxSize={8} mb={2} />
						<Text fontSize='md' fontWeight='bold'>
							{item.label}
						</Text>
					</Box>
				))}
			</SimpleGrid>

			{/* <AttendanceQRCode /> */}
		</Box>
	);
};

export default NavigationBoxes;
