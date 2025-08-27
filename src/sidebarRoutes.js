// ========================== SIDEBAR ROUTES ==========================
// These are the routes shown in the sidebar
// ====================================================================
import { Icon } from '@chakra-ui/react';
import {
	MdHome,
	MdLeaderboard,
	MdOutlineLaptopMac,
	MdInsertChartOutlined,
	MdOutlineAdminPanelSettings,
	MdPeopleOutline,
	MdCampaign,
} from 'react-icons/md';
import {
	FaTasks,
	FaRegCalendarCheck,
	FaList,
	FaWhatsapp,
	FaHandshake,
	FaPhone,
	FaRegCopy,
} from 'react-icons/fa';
import { HiOutlineDocumentReport, HiUsers } from 'react-icons/hi';
import { FaClipboardUser, FaSquarePlus } from 'react-icons/fa6';

const sidebarRoutes = [
	// -------- Dashboard --------
	{
		// moduleId: 'dashboard',
		name: 'Dashboard',
		path: '/default',
		icon: <Icon as={MdHome} w='20px' h='20px' />,
	},

	// -------- Leads --------
	{
		moduleId: 'leads',
		name: 'Lead',
		path: '/lead',
		icon: <Icon as={MdLeaderboard} w='20px' h='20px' />,
	},
	{
		moduleId: 'leadpool_admin',
		name: 'Lead Pool',
		path: '/pool',
		icon: <Icon as={MdOutlineAdminPanelSettings} w='20px' h='20px' />,
	},
	{
		moduleId: 'leadpool_agents',
		name: 'Lead Pool',
		path: '/agent_pool',
		icon: <Icon as={MdPeopleOutline} w='20px' h='20px' />,
	},

	// -------- Deals --------
	{
		moduleId: 'deal',
		name: 'Deals',
		path: '/deals',
		icon: <Icon as={FaHandshake} w='20px' h='20px' />,
	},

	// ------- Announcement ------
	{
		moduleId: 'announcement',
		name: 'Announcement',
		path: '/announcements',
		icon: <Icon as={MdCampaign} width='20px' height='20px' color='inherit' />,
	},

	// -------- Hiring --------
	{
		moduleId: 'hiring',
		name: 'Hiring',
		path: '/hiring',
		icon: <Icon as={FaClipboardUser} w='20px' h='20px' />,
	},

	// -------- Attendance --------
	{
		moduleId: 'attendance',
		name: 'Attendance',
		path: '/attendance',
		icon: <Icon as={FaRegCalendarCheck} w='20px' h='20px' />,
	},

	// -------- Invoices --------
	{
		moduleId: 'invoice',
		name: 'Invoice',
		path: '/invoice',
		icon: <Icon as={HiOutlineDocumentReport} w='20px' h='20px' />,
	},

	// -------- Expenses --------

	{
		moduleId: 'expense',
		name: 'Expenses',
		path: '/expenses',
		icon: <Icon as={FaRegCopy} width='20px' height='20px' color='inherit' />,
	},

	// -------- Tasks --------
	{
		moduleId: 'task',
		name: 'Task',
		path: '/task',
		icon: <Icon as={FaTasks} w='20px' h='20px' />,
	},

	// -------- Listing --------
	{
		moduleId: 'listing',
		name: 'Listing',
		path: '/listing',
		icon: <Icon as={FaList} w='20px' h='20px' />,
	},

	// -------- Survey --------
	{
		moduleId: 'survey',
		name: 'Survey',
		path: '/survey',
		icon: <Icon as={FaSquarePlus} w='20px' h='20px' />,
	},

	{
		moduleId: 'sip',
		name: 'Call Logs',
		path: '/sip',
		icon: <Icon as={FaPhone} w='20px' h='20px' />,
	},

	// -------- Reports --------
	{
		moduleId: 'reports',
		name: 'Reports',
		path: '/reporting-analytics',
		icon: <Icon as={MdInsertChartOutlined} w='20px' h='20px' />,
	},

	// -------- Users --------
	{
		moduleId: 'users',
		name: 'Users',
		path: '/user',
		icon: <Icon as={HiUsers} w='20px' h='20px' />,
	},

	// -------- System Log --------
	{
		moduleId: 'system_log',
		name: 'System Log',
		path: '/system-log',
		icon: <Icon as={MdOutlineLaptopMac} w='20px' h='20px' />,
	},
];

export default sidebarRoutes;
