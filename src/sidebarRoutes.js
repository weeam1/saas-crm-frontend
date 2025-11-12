// ========================== SIDEBAR ROUTES ==========================
// These are the routes shown in the sidebar
// ====================================================================
// import { Icon } from '@chakra-ui/react';
import {
	MdHome,
	MdLeaderboard,
	MdOutlineLaptopMac,
	MdInsertChartOutlined,
	MdOutlineAdminPanelSettings,
	MdPeopleOutline,
	MdCampaign,
	MdInsights,
} from 'react-icons/md';
import {
  FaTasks,
  FaRegCalendarCheck,
  FaList,
  FaWhatsapp,
  FaHandshake,
  FaPhone,
  FaRegCopy,
  FaFileAlt,
} from "react-icons/fa";
import { HiOutlineDocumentReport, HiUsers } from "react-icons/hi";
import { FaClipboardUser, FaSquarePlus } from "react-icons/fa6";

// const sidebarRoutes = [
// 	// -------- Dashboard --------
// 	{
// 		// moduleId: 'dashboard',
// 		name: 'Dashboard',
// 		path: '/default',
// 		icon: <Icon as={MdHome} w='20px' h='20px' />,
// 	},

// 	// -------- Leads --------
// 	{
// 		moduleId: 'leads',
// 		name: 'Lead',
// 		path: '/lead',
// 		icon: <Icon as={MdLeaderboard} w='20px' h='20px' />,
// 	},
// 	{
// 		moduleId: 'leadpool_admin',
// 		name: 'Lead Pool',
// 		path: '/pool',
// 		icon: <Icon as={MdOutlineAdminPanelSettings} w='20px' h='20px' />,
// 	},
// 	{
// 		moduleId: 'leadpool_agents',
// 		name: 'Lead Pool',
// 		path: '/agent_pool',
// 		icon: <Icon as={MdPeopleOutline} w='20px' h='20px' />,
// 	},

// 	// -------- Deals --------
// 	{
// 		moduleId: 'deal',
// 		name: 'Deals',
// 		path: '/deals',
// 		icon: <Icon as={FaHandshake} w='20px' h='20px' />,
// 	},

// 	// ------- Announcement ------
// 	{
// 		moduleId: 'announcement',
// 		name: 'Announcement',
// 		path: '/announcements',
// 		icon: <Icon as={MdCampaign} width='20px' height='20px' color='inherit' />,
// 	},

// 	// -------- Hiring --------
// 	{
// 		moduleId: 'hiring',
// 		name: 'Hiring',
// 		path: '/hiring',
// 		icon: <Icon as={FaClipboardUser} w='20px' h='20px' />,
// 	},

// 	// -------- Attendance --------
// 	{
// 		moduleId: 'attendance',
// 		name: 'Attendance',
// 		path: '/attendance',
// 		icon: <Icon as={FaRegCalendarCheck} w='20px' h='20px' />,
// 	},

// 	// -------- Invoices --------
// 	{
// 		moduleId: 'invoice',
// 		name: 'Invoice',
// 		path: '/invoice',
// 		icon: <Icon as={HiOutlineDocumentReport} w='20px' h='20px' />,
// 	},

// 	// -------- Expenses --------

// 	{
// 		moduleId: 'expense',
// 		name: 'Expenses',
// 		path: '/expenses',
// 		icon: <Icon as={FaRegCopy} width='20px' height='20px' color='inherit' />,
// 	},

// 	// -------- Tasks --------
// 	{
// 		moduleId: 'task',
// 		name: 'Task',
// 		path: '/task',
// 		icon: <Icon as={FaTasks} w='20px' h='20px' />,
// 	},

// 	// -------- Listing --------
// 	{
// 		moduleId: 'listing',
// 		name: 'Listing',
// 		path: '/listing',
// 		icon: <Icon as={FaList} w='20px' h='20px' />,
// 		children: [
// 			{
// 				name: 'All Listings',
// 				path: '/listing/all-listings',
// 			},
// 			{
// 				name: 'My Listings',
// 				path: '/listing/my-listings',
// 			},
// 			{
// 				name: 'Pendings Listing',
// 				path: '/listing/pending-listing',
// 			},
// 			{
// 				name: 'Pending View Request',
// 				path: '/listing/pending-view-listing',
// 			},
// 			{
// 				name: 'Approved View Request',
// 				path: '/listing/approved-view-listing',
// 			},
// 			{
// 				name: 'Rejected View Request',
// 				path: '/listing/reject-view-listing',
// 			},

// 			{
// 				name: 'Listing Setting',
// 				path: '/listing/settings',
// 			},
// 		],
// 	},

// 	// -------- Survey --------
// 	{
// 		moduleId: 'survey',
// 		name: 'Survey',
// 		path: '/survey',
// 		icon: <Icon as={FaSquarePlus} w='20px' h='20px' />,
// 	},

// 	{
// 		moduleId: 'sip',
// 		name: 'Call Logs',
// 		path: '/sip',
// 		icon: <Icon as={FaPhone} w='20px' h='20px' />,
// 		children: [
// 			{
// 				name: 'Dashboard',
// 				path: '/sip/dashboard',
// 			},
// 			{
// 				id: 'call_history',
// 				name: 'Call History',
// 				path: '/sip/history',
// 			},
// 			{
// 				id: 'user_analytics',
// 				name: 'User Analytics',
// 				path: '/sip/user-analytics',
// 			},
// 			{
// 				id: 'user_settings',
// 				name: 'User Settings',
// 				path: '/sip/settings',
// 			},
// 			{
// 				id: 'shared_recordings',
// 				name: 'Shared Recording',
// 				path: '/sip/shared-recording',
// 			},
// 		],
// 	},

// 	// -------- Reports --------
// 	{
// 		moduleId: 'reports',
// 		name: 'Reports',
// 		path: '/reporting-analytics',
// 		icon: <Icon as={MdInsertChartOutlined} w='20px' h='20px' />,
// 	},

// 	{
// 		moduleId: 'whatsapp',
// 		name: 'Whatsapp',
// 		path: '/whatsapp',
// 		icon: <Icon as={FaWhatsapp} width='20px' height='20px' color='inherit' />,
// 		children: [
// 			{
// 				id: 'whatsapp_chats',
// 				name: 'Chats',
// 				path: '/whatsapp/chats',
// 			},
// 			{
// 				id: 'whatsapp_beta',
// 				name: 'WhatsApp',
// 				version: 'Beta',
// 				path: '/whatsapp/instances',
// 			},
// 			{
// 				id: 'whatsapp_campaigns',
// 				name: 'Whatsapp Campaigns',
// 				path: '/whatsapp/bulk-messages',
// 			},
// 			{
// 				id: 'whatsapp_settings',
// 				name: 'Settings',
// 				path: '/whatsapp/settings',
// 			},
// 		],
// 	},

// 	// -------- Users --------
// 	{
// 		moduleId: 'users',
// 		name: 'Users',
// 		path: '/user',
// 		icon: <Icon as={HiUsers} w='20px' h='20px' />,
// 	},

// 	// -------- System Log --------
// 	{
// 		moduleId: 'system_log',
// 		name: 'System Log',
// 		path: '/system-log',
// 		icon: <Icon as={MdOutlineLaptopMac} w='20px' h='20px' />,
// 	},
// ];

export const sidebarRoutes = [
	// -------- Dashboard --------
	{
		name: 'Dashboard',
		path: '/default',
		icon: MdHome,
		isNested: false,
		color: '#6366F1', // Indigo
	},

	// -------- Leads --------
	{
		moduleId: 'leads',
		name: 'Lead',
		path: '/lead',
		icon: MdLeaderboard,
		isNested: true,
		color: '#9333EA', // Emerald
		children: [
			{
				// id: 'leads',
				name: 'Leads',
				path: '/lead',
			},
			{
				id: 'lead_analytics',
				name: 'Analytics',
				path: '/lead_analytics',
				version: 'Beta',
			},
		],
	},
	{
		moduleId: 'leadpool_admin',
		name: 'Lead Pool',
		path: '/pool',
		isNested: false,
		icon: MdOutlineAdminPanelSettings,
		color: '#F59E0B', // Amber
	},
	{
		moduleId: 'leadpool_agents',
		name: 'Lead Pool',
		path: '/agent_pool',
		isNested: false,
		icon: MdPeopleOutline,
		color: '#FBBF24', // Yellow
	},

	// -------- Deals --------
	{
		moduleId: 'deal',
		name: 'Deals',
		path: '/deals',
		icon: FaHandshake,
		isNested: true,
		color: '#22C55E', // Green
		children: [
			{
				id: 'closed_deals',
				name: 'Close Deals',
				path: '/deals/close-deal',
			},
			{
				id: 'shared_deals',
				name: 'Shared Deals',
				path: '/deals/shared-deals',
			},
		],
	},

	// ------- Announcement ------
	{
		moduleId: 'announcement',
		name: 'Announcement',
		path: '/announcements',
		icon: MdCampaign,
		isNested: true,
		color: '#EC4899', // Pink
		children: [
			{
				id: 'create',
				name: 'Announcement',
				path: '/announcement/create',
			},
			{
				name: 'History',
				path: '/announcement/history',
			},
		],
	},

	// -------- Hiring --------
	{
		moduleId: 'hiring',
		name: 'Hiring',
		path: '/hiring',
		isNested: true,
		icon: FaClipboardUser,
		color: '#0EA5E9', // Sky
		children: [
			{
				name: 'Dashboard',
				path: '/hiring/dasboard',
			},
			{
				name: 'Candidates',
				path: '/hiring/candidates',
			},
			{
				name: 'Short Listed',
				path: '/hiring/short-listed',
			},
			{
				name: 'Multi-Round',
				path: '/hiring/multi-round',
			},
			{
				name: 'Interviewed Candidates',
				path: '/hiring/interviewed-candidates',
			},
			{
				name: 'Settings',
				path: '/hiring/settings',
			},
		],
	},

	// -------- Attendance --------
	{
		moduleId: 'attendance',
		name: 'Attendance',
		path: '/attendance',
		isNested: true,
		icon: FaRegCalendarCheck,
		color: '#A855F7', // Violet
		children: [
			{
				id: 'dashboard',
				name: 'Dashboard',
				path: '/attendance/dashboard',
			},
			{
				id: 'employees',
				name: 'Employees',
				path: '/attendance/employees',
			},
			{
				id: 'record',
				name: 'Record',
				path: '/attendance/record',
			},
			{
				id: 'my_attendance',
				name: 'My Attendence',
				path: '/attendance/my_attendance',
			},
		],
	},

	// -------- Invoices --------
	{
		moduleId: 'invoice',
		name: 'Invoice',
		path: '/invoice',
		isNested: true,
		icon: HiOutlineDocumentReport,
		color: '#3B82F6', // Blue
		children: [
			{
				name: 'Bank Accounts',
				path: '/invoice/bank-account',
			},
			{
				name: 'Developer',
				path: '/invoice/developer',
			},
			{
				name: 'Project',
				path: '/invoice/project',
			},
		],
	},

	// -------- Expenses --------
	// {
	// 	moduleId: 'expense',
	// 	name: 'Expenses',
	// 	path: '/expenses',
	// 	isNested: true,
	// 	icon: FaRegCopy,
	// 	color: '#F97316', // Orange
	// 	children: [
	// 		{
	// 			name: 'Balance',
	// 			path: '/expenses/balance',
	// 		},
	// 		{
	// 			name: 'Outgoing Cash',
	// 			path: '/expenses/outgoing-cash',
	// 		},
	// 	],
	// },

	// -------- Finance --------
	{
		moduleId: 'expense',
		name: 'Expenses',
		path: '/finance',
		isNested: true,
		icon: FaRegCopy,
		color: '#F97316', // Orange
		children: [
			{
				id: 'incoming_cash',
				name: 'Incomming Cash',
				path: '/finance/incoming-cash',
			},
			{
				id: 'outgoing_cash',
				name: 'Outgoing Cash',
				path: '/finance/outgoing-cash',
			},
			{
				// id: 'outgoing_cash',
				name: 'Employee Loans',
				path: '/finance/employee-loans',
			},
			{
				id: 'settings',
				name: 'Settings',
				path: '/finance/settings',
			},
		],
	},

	// -------- Tasks --------
	{
		moduleId: 'task',
		name: 'Task',
		path: '/task',
		icon: FaTasks,
		isNested: false,
		color: '#14B8A6', // Teal
	},

	// -------- Listing --------
	{
		moduleId: 'listing',
		name: 'Listing',
		path: '/listing',
		icon: FaList,
		isNested: true,

		color: '#64748B', // Slate
		children: [
			{
				id: 'all_listing',
				name: 'All Listings',
				path: '/listing/all-listings',
			},
			{
				id: 'my_listing',
				name: 'My Listings',
				path: '/listing/my-listings',
			},
			{
				id: 'pending_listing',
				name: 'Pendings Listing',
				path: '/listing/pending-listing',
			},
			{
				id: 'view_requests',
				name: 'View Requests',
				path: '/listing/view-request-listing',
			},
			{
				id: 'settings',
				name: 'Listing Setting',
				path: '/listing/settings',
			},
		],
	},

	// -------- Survey --------
	{
		moduleId: 'survey',
		name: 'Survey',
		path: '/survey',
		isNested: true,
		icon: FaSquarePlus,
		color: '#8B5CF6', // Violet
		children: [
			{
				name: 'Dashboard',
				path: '/survey/dashboard',
			},
			{
				name: 'All Surveys',
				path: '/survey/all-surveys',
			},
			{ id: 'create', name: 'Create Survey', path: '/survey/create' },
		],
	},

	// -------- Call Logs (SIP) --------
	{
		moduleId: 'sip',
		name: 'Call Logs',
		path: '/sip',
		isNested: true,
		icon: FaPhone,
		color: '#06B6D4', // Cyan
		children: [
			{ name: 'Dashboard', path: '/sip/dashboard' },
			{ id: 'call_history', name: 'Call History', path: '/sip/history' },
			{
				id: 'user_analytics',
				name: 'User Analytics',
				path: '/sip/user-analytics',
			},
			{ id: 'user_settings', name: 'User Settings', path: '/sip/settings' },
			{
				id: 'shared_recordings',
				name: 'Shared Recording',
				path: '/sip/shared-recording',
			},
		],
	},

	// -------- Reports --------
	{
		moduleId: 'reports',
		name: 'Reports',
		isNested: false,
		path: '/reporting-analytics',
		icon: MdInsertChartOutlined,
		color: '#2e6f77ff', // Lime
	},

	// -------- Whatsapp --------
	{
		moduleId: 'whatsapp',
		name: 'Whatsapp',
		path: '/whatsapp',
		isNested: true,
		icon: FaWhatsapp,
		color: '#25D366', // WhatsApp Green
		children: [
			{
				id: 'whatsapp_chats',
				name: 'Chats',
				path: '/whatsapp/chats',
			},
			{
				id: 'whatsapp_beta',
				name: 'WhatsApp',
				version: 'Beta',
				path: '/whatsapp/instances',
			},
			{
				id: 'whatsapp_campaigns',
				name: 'Whatsapp Campaigns',
				path: '/whatsapp/bulk-messages',
			},
			{
				id: 'whatsapp_settings',
				name: 'Settings',
				path: '/whatsapp/settings',
			},
		],
	},

	// -------- Users --------
	{
		moduleId: 'users',
		name: 'Users',
		isNested: false,
		path: '/user',
		icon: HiUsers,
		color: '#8B5CF6', // Violet
	},

  // -------- System Log --------
  {
    moduleId: "system_log",
    name: "System Log",
    path: "/system-log",
    isNested: false,
    icon: MdOutlineLaptopMac,
    color: "#c03910ff", // Gray
  },

  // ------- Evaluation ---------
  {
    name: "Evaluation",
    path: "/evaluation",
    icon: FaFileAlt,
    color: "#86f17dff", // Gray
      children: [
      {
        name: "Evalute User",
        path: "/evaluation/user-evaluation",
      },
     {
        name: "Settings",
        path: "/evaluation/settings",
      },
    ]
  },
];

export default sidebarRoutes;
