// // ========================== SIDEBAR ROUTES ==========================
// // These are the routes shown in the sidebar
// // ====================================================================
// // import { Icon } from '@chakra-ui/react';
// import {
//   MdHome,
//   MdLeaderboard,
//   MdOutlineLaptopMac,
//   MdInsertChartOutlined,
//   MdOutlineAdminPanelSettings,
//   MdPeopleOutline,
//   MdCampaign,
//   MdInsights,
//   MdOutlinePayments,
// } from "react-icons/md";
// import {
//   FaTasks,
//   FaRegCalendarCheck,
//   FaList,
//   FaWhatsapp,
//   FaHandshake,
//   FaPhone,
//   FaRegCopy,
//   FaFileAlt,
//   FaFileInvoiceDollar,
//   FaMoneyCheckAlt,
// } from "react-icons/fa";
// import { HiOutlineDocumentReport, HiUsers } from "react-icons/hi";
// import { FaClipboardUser, FaSquarePlus } from "react-icons/fa6";

// // const sidebarRoutes = [
// // 	// -------- Dashboard --------
// // 	{
// // 		// moduleId: 'dashboard',
// // 		name: 'Dashboard',
// // 		path: '/default',
// // 		icon: <Icon as={MdHome} w='20px' h='20px' />,
// // 	},

// // 	// -------- Leads --------
// // 	{
// // 		moduleId: 'leads',
// // 		name: 'Lead',
// // 		path: '/lead',
// // 		icon: <Icon as={MdLeaderboard} w='20px' h='20px' />,
// // 	},
// // 	{
// // 		moduleId: 'leadpool_admin',
// // 		name: 'Lead Pool',
// // 		path: '/pool',
// // 		icon: <Icon as={MdOutlineAdminPanelSettings} w='20px' h='20px' />,
// // 	},
// // 	{
// // 		moduleId: 'leadpool_agents',
// // 		name: 'Lead Pool',
// // 		path: '/agent_pool',
// // 		icon: <Icon as={MdPeopleOutline} w='20px' h='20px' />,
// // 	},

// // 	// -------- Deals --------
// // 	{
// // 		moduleId: 'deal',
// // 		name: 'Deals',
// // 		path: '/deals',
// // 		icon: <Icon as={FaHandshake} w='20px' h='20px' />,
// // 	},

// // 	// ------- Announcement ------
// // 	{
// // 		moduleId: 'announcement',
// // 		name: 'Announcement',
// // 		path: '/announcements',
// // 		icon: <Icon as={MdCampaign} width='20px' height='20px' color='inherit' />,
// // 	},

// // 	// -------- Hiring --------
// // 	{
// // 		moduleId: 'hiring',
// // 		name: 'Hiring',
// // 		path: '/hiring',
// // 		icon: <Icon as={FaClipboardUser} w='20px' h='20px' />,
// // 	},

// // 	// -------- Attendance --------
// // 	{
// // 		moduleId: 'attendance',
// // 		name: 'Attendance',
// // 		path: '/attendance',
// // 		icon: <Icon as={FaRegCalendarCheck} w='20px' h='20px' />,
// // 	},

// // 	// -------- Invoices --------
// // 	{
// // 		moduleId: 'invoice',
// // 		name: 'Invoice',
// // 		path: '/invoice',
// // 		icon: <Icon as={HiOutlineDocumentReport} w='20px' h='20px' />,
// // 	},

// // 	// -------- Expenses --------

// // 	{
// // 		moduleId: 'expense',
// // 		name: 'Expenses',
// // 		path: '/expenses',
// // 		icon: <Icon as={FaRegCopy} width='20px' height='20px' color='inherit' />,
// // 	},

// // 	// -------- Tasks --------
// // 	{
// // 		moduleId: 'task',
// // 		name: 'Task',
// // 		path: '/task',
// // 		icon: <Icon as={FaTasks} w='20px' h='20px' />,
// // 	},

// // 	// -------- Listing --------
// // 	{
// // 		moduleId: 'listing',
// // 		name: 'Listing',
// // 		path: '/listing',
// // 		icon: <Icon as={FaList} w='20px' h='20px' />,
// // 		children: [
// // 			{
// // 				name: 'All Listings',
// // 				path: '/listing/all-listings',
// // 			},
// // 			{
// // 				name: 'My Listings',
// // 				path: '/listing/my-listings',
// // 			},
// // 			{
// // 				name: 'Pendings Listing',
// // 				path: '/listing/pending-listing',
// // 			},
// // 			{
// // 				name: 'Pending View Request',
// // 				path: '/listing/pending-view-listing',
// // 			},
// // 			{
// // 				name: 'Approved View Request',
// // 				path: '/listing/approved-view-listing',
// // 			},
// // 			{
// // 				name: 'Rejected View Request',
// // 				path: '/listing/reject-view-listing',
// // 			},

// // 			{
// // 				name: 'Listing Setting',
// // 				path: '/listing/settings',
// // 			},
// // 		],
// // 	},

// // 	// -------- Survey --------
// // 	{
// // 		moduleId: 'survey',
// // 		name: 'Survey',
// // 		path: '/survey',
// // 		icon: <Icon as={FaSquarePlus} w='20px' h='20px' />,
// // 	},

// // 	{
// // 		moduleId: 'sip',
// // 		name: 'Call Logs',
// // 		path: '/sip',
// // 		icon: <Icon as={FaPhone} w='20px' h='20px' />,
// // 		children: [
// // 			{
// // 				name: 'Dashboard',
// // 				path: '/sip/dashboard',
// // 			},
// // 			{
// // 				id: 'call_history',
// // 				name: 'Call History',
// // 				path: '/sip/history',
// // 			},
// // 			{
// // 				id: 'user_analytics',
// // 				name: 'User Analytics',
// // 				path: '/sip/user-analytics',
// // 			},
// // 			{
// // 				id: 'user_settings',
// // 				name: 'User Settings',
// // 				path: '/sip/settings',
// // 			},
// // 			{
// // 				id: 'shared_recordings',
// // 				name: 'Shared Recording',
// // 				path: '/sip/shared-recording',
// // 			},
// // 		],
// // 	},

// // 	// -------- Reports --------
// // 	{
// // 		moduleId: 'reports',
// // 		name: 'Reports',
// // 		path: '/reporting-analytics',
// // 		icon: <Icon as={MdInsertChartOutlined} w='20px' h='20px' />,
// // 	},

// // 	{
// // 		moduleId: 'whatsapp',
// // 		name: 'Whatsapp',
// // 		path: '/whatsapp',
// // 		icon: <Icon as={FaWhatsapp} width='20px' height='20px' color='inherit' />,
// // 		children: [
// // 			{
// // 				id: 'whatsapp_chats',
// // 				name: 'Chats',
// // 				path: '/whatsapp/chats',
// // 			},
// // 			{
// // 				id: 'whatsapp_beta',
// // 				name: 'WhatsApp',
// // 				version: 'Beta',
// // 				path: '/whatsapp/instances',
// // 			},
// // 			{
// // 				id: 'whatsapp_campaigns',
// // 				name: 'Whatsapp Campaigns',
// // 				path: '/whatsapp/bulk-messages',
// // 			},
// // 			{
// // 				id: 'whatsapp_settings',
// // 				name: 'Settings',
// // 				path: '/whatsapp/settings',
// // 			},
// // 		],
// // 	},

// // 	// -------- Users --------
// // 	{
// // 		moduleId: 'users',
// // 		name: 'Users',
// // 		path: '/user',
// // 		icon: <Icon as={HiUsers} w='20px' h='20px' />,
// // 	},

// // 	// -------- System Log --------
// // 	{
// // 		moduleId: 'system_log',
// // 		name: 'System Log',
// // 		path: '/system-log',
// // 		icon: <Icon as={MdOutlineLaptopMac} w='20px' h='20px' />,
// // 	},
// // ];

// export const sidebarRoutes = [
//   // -------- Dashboard --------
//   {
//     name: "Dashboard",
//     path: "/default",
//     icon: MdHome,
//     isNested: false,
//     color: "#6366F1", // Indigo
//   },

//   // -------- Leads --------
//   {
//     moduleId: "leads",
//     name: "Lead",
//     path: "/lead",
//     icon: MdLeaderboard,
//     isNested: true,
//     color: "#9333EA", // Emerald
//     children: [
//       {
//         // id: "leads",
//         name: "Leads",
//         path: "/lead",
//       },
//       {
//         id: "lead_analytics",
//         name: "Analytics",
//         path: "/lead_analytics",
//         version: "Beta",
//       },
//       {
//         id: "call_feedbacks",
//         name: "Call Feedback",
//         path: "/call-feedback",
//       },
//       {
//         // id: "leads_setting",
//         name: "Settings",
//         path: "/lead_settings",
//       },
//     ],
//   },
//   {
//     moduleId: "leadpool_admin",
//     name: "Lead Pool",
//     path: "/pool",
//     isNested: false,
//     icon: MdOutlineAdminPanelSettings,
//     color: "#F59E0B", // Amber
//   },
//   {
//     moduleId: "leadpool_agents",
//     name: "Lead Pool",
//     path: "/agent_pool",
//     isNested: false,
//     icon: MdPeopleOutline,
//     color: "#FBBF24", // Yellow
//   },

//   // -------- Deals --------
//   {
//     moduleId: "deal",
//     name: "Deals",
//     path: "/deals",
//     icon: FaHandshake,
//     isNested: true,
//     color: "#22C55E", // Green
//     children: [
//       {
//         id: "closed_deals",
//         name: "Close Deals",
//         path: "/deals/close-deal",
//       },
//       {
//         id: "shared_deals",
//         name: "Shared Deals",
//         path: "/deals/shared-deals",
//       },
//     ],
//   },

//   // ------- Announcement ------
//   {
//     moduleId: "announcement",
//     name: "Announcement",
//     path: "/announcements",
//     icon: MdCampaign,
//     isNested: true,
//     color: "#EC4899", // Pink
//     children: [
//       {
//         id: "create",
//         name: "Announcement",
//         path: "/announcement/create",
//       },
//       {
//         name: "History",
//         path: "/announcement/history",
//       },
//     ],
//   },

//   // -------- Hiring --------
//   {
//     moduleId: "hiring",
//     name: "Hiring",
//     path: "/hiring",
//     isNested: true,
//     icon: FaClipboardUser,
//     color: "#0EA5E9", // Sky
//     children: [
//       {
//         name: "Dashboard",
//         path: "/hiring/dasboard",
//       },
//       {
//         name: "Candidates",
//         path: "/hiring/candidates",
//       },
//       {
//         name: "Short Listed",
//         path: "/hiring/short-listed",
//       },
//       {
//         name: "Multi-Round",
//         path: "/hiring/multi-round",
//       },
//       {
//         name: "Interviewed Candidates",
//         path: "/hiring/interviewed-candidates",
//       },
//       {
//         name: "Settings",
//         path: "/hiring/settings",
//       },
//     ],
//   },

//   // -------- Attendance --------
//   {
//     moduleId: "attendance",
//     name: "Attendance",
//     path: "/attendance",
//     isNested: true,
//     icon: FaRegCalendarCheck,
//     color: "#A855F7", // Violet
//     children: [
//       {
//         id: "dashboard",
//         name: "Dashboard",
//         path: "/attendance/dashboard",
//       },
//       {
//         id: "employees",
//         name: "Employees",
//         path: "/attendance/employees",
//       },
//       {
//         id: "record",
//         name: "Record",
//         path: "/attendance/record",
//       },
//       {
//         id: "my_attendance",
//         name: "My Attendence",
//         path: "/attendance/my_attendance",
//       },
//     ],
//   },

//   // -------- Invoices --------
//   {
//     moduleId: "invoice",
//     name: "Invoice",
//     path: "/invoice",
//     isNested: true,
//     icon: HiOutlineDocumentReport,
//     color: "#3B82F6", // Blue
//     children: [
//       {
//         name: "Bank Accounts",
//         path: "/invoice/bank-account",
//       },
//       {
//         name: "Developer",
//         path: "/invoice/developer",
//       },
//       {
//         name: "Project",
//         path: "/invoice/project",
//       },
//     ],
//   },

//   // -------- Expenses --------
//   // {
//   // 	moduleId: 'expense',
//   // 	name: 'Expenses',
//   // 	path: '/expenses',
//   // 	isNested: true,
//   // 	icon: FaRegCopy,
//   // 	color: '#F97316', // Orange
//   // 	children: [
//   // 		{
//   // 			name: 'Balance',
//   // 			path: '/expenses/balance',
//   // 		},
//   // 		{
//   // 			name: 'Outgoing Cash',
//   // 			path: '/expenses/outgoing-cash',
//   // 		},
//   // 	],
//   // },

//   // -------- Finance --------
//   {
//     moduleId: "expense",
//     name: "Expenses",
//     path: "/finance",
//     isNested: true,
//     icon: FaRegCopy,
//     color: "#F97316", // Orange
//     children: [
//       {
//         id: "incoming_cash",
//         name: "Incomming Cash",
//         path: "/finance/incoming-cash",
//       },
//       {
//         id: "outgoing_cash",
//         name: "Outgoing Cash",
//         path: "/finance/outgoing-cash",
//       },
//       {
//         id: "employee_loans",
//         name: "Employee Loans",
//         path: "/finance/employee-loans",
//       },
//       {
//         id: "settings",
//         name: "Settings",
//         path: "/finance/settings",
//       },
//     ],
//   },

//   // ------- Evaluation ---------
//   {
//     moduleId: "evaluation",
//     name: "Evaluation",
//     path: "/evaluation",
//     icon: FaFileAlt,
//     color: "#86f17dff", // Gray
//     children: [
//       {
//         id: "evaluation_users",
//         name: "Evalute User",
//         path: "/evaluation/user-evaluation",
//       },
//       {
//         id: "my_evaluations",
//         name: "My Evaluation",
//         path: "/evaluation/my-evaluation",
//       },
//       {
//         id: "settings",
//         name: "Settings",
//         path: "/evaluation/settings",
//       },
//     ],
//   },

//   // ---------- Payroll -----------
//   {
//     moduleId: "payroll",
//     name: "Payroll",
//     path: "/payroll",
//     icon: MdOutlinePayments,
//     // icon: FaMoneyCheckAlt,
//     isNested: false,
//     color: "#36ce6dff", // Teal
//     children: [
//       {
//         // id: 'all_users',
//         name: "Salaried Users",
//         path: "/payroll/users",
//       },
//       {
//         // id: 'commission_users',
//         name: "Commission Users",
//         path: "/payroll/commission-users",
//       },
//     ],
//   },

//   // -------- Tasks --------
//   {
//     moduleId: "task",
//     name: "Task",
//     path: "/task",
//     icon: FaTasks,
//     isNested: false,
//     color: "#14B8A6", // Teal
//   },

//   // -------- Listing --------
//   {
//     moduleId: "listing",
//     name: "Listing",
//     path: "/listing",
//     icon: FaList,
//     isNested: true,

//     color: "#64748B", // Slate
//     children: [
//       {
//         id: "client_listing",
//         name: "Client Listings",
//         path: "/listing/client-listings",
//       },
//       {
//         id: "all_listing",
//         name: "All Listings",
//         path: "/listing/all-listings",
//       },
//       {
//         id: "my_listing",
//         name: "My Listings",
//         path: "/listing/my-listings",
//       },
//       {
//         id: "pending_listing",
//         name: "Pendings Listing",
//         path: "/listing/pending-listing",
//       },
//       {
//         id: "view_requests",
//         name: "View Requests",
//         path: "/listing/view-request-listing",
//       },
//       {
//         id: "settings",
//         name: "Listing Setting",
//         path: "/listing/settings",
//       },
//     ],
//   },

//   // -------- Survey --------
//   {
//     moduleId: "survey",
//     name: "Survey",
//     path: "/survey",
//     isNested: true,
//     icon: FaSquarePlus,
//     color: "#8B5CF6", // Violet
//     children: [
//       {
//         name: "Dashboard",
//         path: "/survey/dashboard",
//       },
//       {
//         name: "All Surveys",
//         path: "/survey/all-surveys",
//       },
//       { id: "create", name: "Create Survey", path: "/survey/create" },
//     ],
//   },

//   // -------- Call Logs (SIP) --------
//   {
//     moduleId: "sip",
//     name: "Call Logs",
//     path: "/sip",
//     isNested: true,
//     icon: FaPhone,
//     color: "#06B6D4", // Cyan
//     children: [
//       { name: "Dashboard", path: "/sip/dashboard" },
//       { id: "call_history", name: "Call History", path: "/sip/history" },
//       {
//         id: "user_analytics",
//         name: "User Analytics",
//         path: "/sip/user-analytics",
//       },
//       { id: "user_settings", name: "Call Settings", path: "/sip/settings" },
//       {
//         id: "shared_recordings",
//         name: "Shared Recording",
//         path: "/sip/shared-recording",
//       },
//     ],
//   },

//   // -------- Reports --------
//   {
//     moduleId: "reports",
//     name: "Reports",
//     isNested: false,
//     path: "/reporting-analytics",
//     icon: MdInsertChartOutlined,
//     color: "#2e6f77ff", // Lime
//   },

//   // -------- Whatsapp --------
//   {
//     moduleId: "whatsapp",
//     name: "Whatsapp",
//     path: "/whatsapp",
//     isNested: true,
//     icon: FaWhatsapp,
//     color: "#25D366", // WhatsApp Green
//     children: [
//       {
//         id: "whatsapp_chats",
//         name: "Chats",
//         path: "/whatsapp/chats",
//       },
//       {
//         id: "whatsapp_beta",
//         name: "WhatsApp",
//         version: "Beta",
//         path: "/whatsapp/instances",
//       },
//       {
//         id: "whatsapp_campaigns",
//         name: "Whatsapp Campaigns",
//         path: "/whatsapp/bulk-messages",
//       },
//       {
//         id: "whatsapp_settings",
//         name: "Settings",
//         path: "/whatsapp/settings",
//       },
//     ],
//   },

//   // -------- Users --------
//   // {
//   // 	moduleId: 'users',
//   // 	name: 'Users',
//   // 	isNested: false,
//   // 	path: '/users',
//   // 	icon: HiUsers,
//   // 	color: '#8B5CF6', // Violet
//   // },

//   // -------- Users V2 --------
//   {
//     moduleId: "users",
//     name: "Users",
//     isNested: false,
//     path: "/users-v2",
//     icon: HiUsers,
//     color: "#8B5CF6", // Violet
//   },

//   // -------- System Log --------
//   {
//     moduleId: "system_log",
//     name: "System Log",
//     path: "/system-log",
//     isNested: false,
//     icon: MdOutlineLaptopMac,
//     color: "#c03910ff", // Gray
//   },
// ];

// export default sidebarRoutes;

import {
  MdHome,
  MdLeaderboard,
  MdOutlineLaptopMac,
  MdInsertChartOutlined,
  MdOutlineAdminPanelSettings,
  MdCampaign,
  MdOutlinePayments,
} from "react-icons/md";
import {
  FaTasks,
  FaRegCalendarCheck,
  FaList,
  FaWhatsapp,
  FaHandshake,
  FaPhone,
  FaRegCopy,
  FaChartLine,
  FaBullhorn,
  FaMoneyBillWave,
  FaUserTie,
  FaBuilding,
  FaChartPie,
  FaClock,
  FaFileInvoice,
  FaReceipt,
  FaComments,
  FaMicrophoneAlt,
  FaStar,
  FaShieldAlt,
  FaHistory,
  FaUserCheck,
  FaBriefcase,
  FaLayerGroup,
  FaDatabase,
} from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import { FaClipboardUser, FaSquarePlus } from "react-icons/fa6";
import { FaFileAlt, } from "react-icons/fa";
import {
  GiCommercialAirplane,
  GiPayMoney,
  GiTakeMyMoney,
  GiMoneyStack,
} from "react-icons/gi";
import {
  BsGraphUp,
  BsPeople,
  BsChatDots,
  BsCalendarCheck,
  BsFileText,
  BsBarChart,
  BsClipboardData,
  BsGear,
} from "react-icons/bs";
import {
  RiUserSearchLine,
  RiUserStarLine,
  RiUserSettingsLine,
  RiGroupLine,
  RiBillLine,
  RiBankLine,
  RiMoneyDollarCircleLine,
  RiExchangeLine,
  RiListCheck,
  RiChatHistoryLine,
  RiMegaphoneLine,
  RiSurveyLine,
  RiFeedbackLine,
  RiListCheck2,
  RiSettings4Line,
} from "react-icons/ri";
import { SiGoogleanalytics, SiGooglemeet, SiGooglechat } from "react-icons/si";
import {
  TbReportAnalytics,
  TbBuildingEstate,
  TbFileAnalytics,
  TbCalendarStats,
  TbListDetails,
} from "react-icons/tb";
import { IoPeopleOutline, IoDocumentTextOutline } from "react-icons/io5";
import { GrUserAdmin } from "react-icons/gr";

export const sidebarRoutes = [
  {
    name: "Dashboard",
    path: "/default",
    icon: MdHome,
    color: "#6366F1",
    isNested: false,
  },

  // ========================== CRM (SALES) ==========================
  {
    category: "CRM (SALES)",
    routes: [
      {
        moduleId: "leads",
        name: "Leads",
        path: "/lead",
        icon: RiUserSearchLine,
        color: "#9333EA",
        isNested: true,
        children: [
          { name: "Leads", path: "/lead", icon: RiUserSearchLine },
          {
            id: "lead_analytics",
            name: "Analytics",
            path: "/lead_analytics",
            version: "Beta",
            icon: BsGraphUp,
          },
          {
            id: "call_feedbacks",
            name: "Call Feedback",
            path: "/call-feedback",
            icon: FaMicrophoneAlt,
          },
          {
            // id: "leads_setting",
            name: "Setting",
            path: "/lead_setting",
            name: "Settings",
            path: "/lead_settings",
          },
        ],
      },
      {
        moduleId: "leadpool_admin",
        name: "Lead Pool",
        path: "/pool",
        icon: GrUserAdmin,
        color: "#b7f50bff",
        isNested: false,
      },
      {
        moduleId: "leadpool_agents",
        name: "Lead Pool",
        path: "/agent_pool",
        icon: RiUserStarLine,
        color: "#FBBF24",
        isNested: false,
      },
      {
        moduleId: "deal",
        name: "Deals",
        path: "/deals",
        icon: FaHandshake,
        color: "#1bd15eff",
        isNested: true,
        children: [
          {
            id: "closed_deals",
            name: "Close Deals",
            path: "/deals/close-deal",
            icon: GiPayMoney,
          },
          {
            id: "shared_deals",
            name: "Shared Deals",
            path: "/deals/shared-deals",
            icon: BsPeople,
          },
        ],
      },
    ],
  },

  // ========================== HR MANAGEMENT ==========================
  {
    category: "HR MANAGEMENT",
    routes: [
      {
        moduleId: "hiring",
        name: "Hiring",
        path: "/hiring",
        icon: FaClipboardUser,
        color: "#0EA5E9",
        isNested: true,
        children: [
          { name: "Dashboard", path: "/hiring/dasboard", icon: BsBarChart },
          {
            name: "Candidates",
            path: "/hiring/candidates",
            icon: RiUserSearchLine,
          },
          {
            name: "Short Listed",
            path: "/hiring/short-listed",
            icon: RiUserStarLine,
          },
          {
            name: "Multi Round",
            path: "/hiring/multi-round",
            icon: FaLayerGroup,
          },
          {
            name: "Interviewed Candidates",
            path: "/hiring/interviewed-candidates",
            icon: RiGroupLine,
          },
          { name: "Settings", path: "/hiring/settings", icon: BsGear },
        ],
      },
      {
        moduleId: "attendance",
        name: "Attendance",
        path: "/attendance",
        icon: BsCalendarCheck,
        color: "#A855F7",
        isNested: true,
        children: [
          {
            id: "dashboard",
            name: "Dashboard",
            path: "/attendance/dashboard",
            icon: TbCalendarStats,
          },
          {
            id: "employees",
            name: "Employees",
            path: "/attendance/employees",
            icon: IoPeopleOutline,
          },
          {
            id: "record",
            name: "Record",
            path: "/attendance/record",
            icon: FaClock,
          },
          {
            id: "my_attendance",
            name: "My Attendance",
            path: "/attendance/my_attendance",
            icon: FaUserCheck,
          },
        ],
      },
      {
        moduleId: "payroll",
        name: "Payroll",
        path: "/payroll",
        icon: MdOutlinePayments,
        color: "#36ce6dff",
        isNested: true,
        children: [
          { name: "Salaried Users", path: "/payroll/users", icon: FaUserTie },
          {
            name: "Commission Users",
            path: "/payroll/commission-users",
            icon: GiMoneyStack,
          },
        ],
      },
    ],
  },

  // ========================== FINANCE ==========================
  {
    category: "FINANCE",

    routes: [
      // {
      //        moduleId: "expense", 
      //     id: "employee_loans",
      //     name: "Employee Loans",
      //     path: "/employee-loans",
      //     icon: RiBillLine,
      //   },
      {
        moduleId: "invoice",
        name: "Invoice",
        path: "/invoice",
        icon: FaFileInvoice,
        color: "#3B82F6",
        isNested: true,
        children: [
          {
            name: "Bank Accounts",
            path: "/invoice/bank-account",
            icon: RiBankLine,
          },
          { name: "Developer", path: "/invoice/developer", icon: FaBuilding },
          { name: "Project", path: "/invoice/project", icon: TbBuildingEstate },
        ],
      },
      {
        moduleId: "expense",
        name: "Expenses",
        path: "/finance",
        icon: FaReceipt,
        color: "#c2460cff",
        isNested: true,
        children: [
          {
            id: "incoming_cash",
            name: "Incoming Cash",
            path: "/finance/incoming-cash",
            icon: RiMoneyDollarCircleLine,
          },
          {
            id: "outgoing_cash",
            name: "Outgoing Cash",
            path: "/finance/outgoing-cash",
            icon: GiTakeMyMoney,
          },

          {
            id: "settings",
            name: "Settings",
            path: "/finance/settings",
            icon: BsGear,
          },
        ],
      },
      {
        moduleId: "employee_loans",  // Keep the same moduleId as backend
        name: "Employee Loans",
        path: "/employee-loans",  // New standalone path
        icon: RiBillLine,
        color: "#f8b626ff",
        isNested: false,  // No children
      },
    ],
  },

  // ========================== OPERATIONS ==========================
  {
    category: "OPERATIONS",
    routes: [
      {
        moduleId: "task",
        name: "Task",
        path: "/task",
        icon: FaTasks,
        color: "#14B8A6",
        isNested: false,
      },
      {
        moduleId: "listing",
        name: "Listing",
        path: "/listing",
        icon: TbListDetails,
        color: "#64748B",
        isNested: true,
        children: [
          {
            id: "client_listing",
            name: "Client Listings",
            path: "/listing/client-listings",
            icon: FaBriefcase,
          },
          {
            id: "all_listing",
            name: "All Listings",
            path: "/listing/all-listings",
            icon: FaList,
          },
          {
            id: "my_listing",
            name: "My Listings",
            path: "/listing/my-listings",
            icon: IoDocumentTextOutline,
          },
          {
            id: "pending_listing",
            name: "Pending Listings",
            path: "/listing/pending-listing",
            icon: FaClock,
          },
          {
            id: "view_requests",
            name: "View Requests",
            path: "/listing/view-request-listing",
            icon: RiExchangeLine,
          },
          {
            id: "settings",
            name: "Settings",
            path: "/listing/settings",
            icon: BsGear,
          },
        ],
      },
    ],
  },

  // ========================== COMMUNICATION ==========================
  {
    category: "COMMUNICATION",
    routes: [
      {
        moduleId: "whatsapp",
        name: "WhatsApp",
        path: "/whatsapp",
        icon: FaWhatsapp,
        color: "#25D366",
        isNested: true,
        children: [
          {
            id: "whatsapp_chats",
            name: "Chats",
            path: "/whatsapp/chats",
            icon: BsChatDots,
          },
          {
            id: "whatsapp_beta",
            name: "Instances",
            version: "Beta",
            path: "/whatsapp/instances",
            icon: FaDatabase,
          },
          {
            id: "whatsapp_campaigns",
            name: "Campaigns",
            path: "/whatsapp/bulk-messages",
            icon: RiMegaphoneLine,
          },
          {
            id: "whatsapp_settings",
            name: "Settings",
            path: "/whatsapp/settings",
            icon: RiSettings4Line,
          },
        ],
      },
      {
        moduleId: "sip",
        name: "Call Logs",
        path: "/sip",
        icon: FaPhone,
        color: "#06B6D4",
        isNested: true,
        children: [
          { name: 'Dashboard', path: '/sip/dashboard' },
          {
            //  id: 'leaderboard',
            name: 'Leaderboard', path: '/sip/leaderboard'
          },
          { id: 'call_history', name: 'Call History', path: '/sip/history' },
          {
            id: 'my_recordings',
            name: 'My Recordings',
            path: '/sip/my-recordings',
          },
          {
            id: 'user_analytics',
            name: 'User Analytics',
            path: '/sip/user-analytics',
          },
          { id: 'user_settings', name: 'Call Settings', path: '/sip/settings' },
          {
            id: 'shared_recordings',
            name: 'Shared Recording',
            path: '/sip/shared-recording',
          },
        ],
      },
      {
        moduleId: "announcement",
        name: "Announcement",
        path: "/announcements",
        icon: MdCampaign,
        color: "#EC4899",
        isNested: true,
        children: [
          {
            id: "create",
            name: "Create",
            path: "/announcement/create",
            icon: FaBullhorn,
          },
          { name: "History", path: "/announcement/history", icon: FaHistory },
        ],
      },
    ],
  },

  // ========================== INSIGHTS & FEEDBACK ==========================
  {
    category: "INSIGHTS & FEEDBACK",
    routes: [
      {
        moduleId: "reports",
        name: "Reports",
        path: "/reporting-analytics",
        icon: TbReportAnalytics,
        color: "#0aa9beff",
        isNested: false,
      },
      {
        moduleId: "survey",
        name: "Survey",
        path: "/survey",
        icon: RiSurveyLine,
        color: "#8B5CF6",
        isNested: true,
        children: [
          { name: "Dashboard", path: "/survey/dashboard", icon: BsGraphUp },
          {
            name: "All Surveys",
            path: "/survey/all-surveys",
            icon: RiSurveyLine,
          },
          {
            id: "create",
            name: "Create Survey",
            path: "/survey/create",
            icon: FaSquarePlus,
          },
        ],
      },
      {
        moduleId: 'evaluation',
        name: 'Evaluation',
        path: '/evaluation',
        icon: FaFileAlt,
        color: '#86f17dff', // Gray
        children: [
          {
            id: 'evaluation_users',
            name: 'Evalute User',
            path: '/evaluation/user-evaluation',
          },
          {
            id: 'my_evaluations',
            name: 'My Evaluation',
            path: '/evaluation/my-evaluation',
          },
          {
            id: 'settings',
            name: 'Settings',
            path: '/evaluation/settings',
          },
        ],
      },

    ],
  },

  // ========================== ADMINISTRATION ==========================
  {
    category: "ADMINISTRATION",
    routes: [
      {
        moduleId: "users",
        name: "Users",
        path: "/users-v2",
        icon: HiUsers,
        color: "#8B5CF6",
        isNested: false,
      },
      {
        moduleId: "system_log",
        name: "System Logs",
        path: "/system-log",
        icon: RiListCheck2,
        color: "#059999ff",
        isNested: false,
      },
    ],
  },
];

export default sidebarRoutes;
