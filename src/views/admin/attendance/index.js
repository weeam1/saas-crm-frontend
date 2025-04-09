import { useNavigate } from 'react-router-dom';
import { Box, SimpleGrid, Text, Icon } from '@chakra-ui/react';
import {
	FaTachometerAlt,
	FaUsers,
	FaClipboardList,
	FaUserCheck,
} from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';

const NavigationBoxes = () => {
	const navigate = useNavigate();

	const user = JSON.parse(localStorage.getItem('user'));
	const role =
		user?.role === 'superAdmin' ? 'superAdmin' : user?.roles[0]?.roleName;

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
		{
			label: 'Office Settings',
			icon: FiSettings,
			route: `/office-settings/${user?.agency?._id}`,
		},
	];

	// Show all items for superAdmin and HR; otherwise, only show "My Attendance"
	const menuItems =
		role === 'superAdmin'
			? allMenuItems.filter(
					(item) =>
						item.label !== 'My Attendance' && item.label !== 'Office Settings'
				)
			: role === 'HR'
				? allMenuItems
				: allMenuItems.filter((item) => item.label === 'My Attendance');

	return (
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
	);
};

export default NavigationBoxes;
