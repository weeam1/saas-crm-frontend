// ========================== SIDEBAR ROUTES ==========================
// These are the routes shown in the sidebar
// ====================================================================
import { Icon } from "@chakra-ui/react";
import {
  MdHome,
  MdLeaderboard,
  MdOutlineLaptopMac,
  MdInsertChartOutlined,
  MdOutlineAdminPanelSettings,
  MdPeopleOutline,
  MdCampaign,
} from "react-icons/md";
import {
  FaTasks,
  FaRegCalendarCheck,
  FaList,
  FaWhatsapp,
  FaHandshake,
  FaPhone,
  FaRegCopy,
  FaListAlt 
} from "react-icons/fa";
import { HiOutlineDocumentReport, HiUsers } from "react-icons/hi";
import { FaClipboardUser, FaSquarePlus } from "react-icons/fa6";

const sidebarRoutes = [
  // -------- Dashboard --------
  {
    // moduleId: 'dashboard',
    name: "Dashboard",
    path: "/default",
    icon: <Icon as={MdHome} w="20px" h="20px" />,
  },

  // -------- Leads --------
  {
    moduleId: "leads",
    name: "Lead",
    path: "/lead",
    icon: <Icon as={MdLeaderboard} w="20px" h="20px" />,
  },
  {
    moduleId: "leadpool_admin",
    name: "Lead Pool",
    path: "/pool",
    icon: <Icon as={MdOutlineAdminPanelSettings} w="20px" h="20px" />,
  },
  {
    moduleId: "leadpool_agents",
    name: "Lead Pool",
    path: "/agent_pool",
    icon: <Icon as={MdPeopleOutline} w="20px" h="20px" />,
  },

  // -------- Deals --------
  {
    moduleId: "deal",
    name: "Deals",
    path: "/deals",
    icon: <Icon as={FaHandshake} w="20px" h="20px" />,
  },

  // ------- Announcement ------
  {
    moduleId: "announcement",
    name: "Announcement",
    path: "/announcements",
    icon: <Icon as={MdCampaign} width="20px" height="20px" color="inherit" />,
  },

  // -------- Hiring --------
  {
    moduleId: "hiring",
    name: "Hiring",
    path: "/hiring",
    icon: <Icon as={FaClipboardUser} w="20px" h="20px" />,
  },

  // -------- Attendance --------
  {
    moduleId: "attendance",
    name: "Attendance",
    path: "/attendance",
    icon: <Icon as={FaRegCalendarCheck} w="20px" h="20px" />,
  },

  // -------- Invoices --------
  {
    moduleId: "invoice",
    name: "Invoice",
    path: "/invoice",
    icon: <Icon as={HiOutlineDocumentReport} w="20px" h="20px" />,
  },

  // -------- Expenses --------

  {
    moduleId: "expense",
    name: "Expenses",
    path: "/expenses",
    icon: <Icon as={FaRegCopy} width="20px" height="20px" color="inherit" />,
  },

  // -------- Tasks --------
  {
    moduleId: "task",
    name: "Task",
    path: "/task",
    icon: <Icon as={FaTasks} w="20px" h="20px" />,
  },

  // -------- Listing --------
  {
    moduleId: "listing",
    name: "Listing",
    path: "/listing",
    icon: <Icon as={FaList} w="20px" h="20px" />,
    children: [
      {
		id: "all_listing",
        name: "All Listings",
        path: "/listing/all-listings",
      },
      {
		id: "my_listing",
        name: "My Listings",
        path: "/listing/my-listings",
      },
      {
		id: "pending_listing",
        name: "Pendings Listing",
        path: "/listing/pending-listing",
      },
      {
		id: "view_requests",
        name: "View Requests",
        path:  "/view-request-listing",
      },
    
      {
		id: "settings",
        name: "Listing Setting",
        path: "/listing/settings",
      },
    ],
  },


  // -------- Survey --------
  {
    moduleId: "survey",
    name: "Survey",
    path: "/survey",
    icon: <Icon as={FaSquarePlus} w="20px" h="20px" />,
  },

  {
    moduleId: "sip",
    name: "Call Logs",
    path: "/sip",
    icon: <Icon as={FaPhone} w="20px" h="20px" />,
    children: [
      {
        name: "Dashboard",
        path: "/sip/dashboard",
      },
      {
        id: "call_history",
        name: "Call History",
        path: "/sip/history",
      },
      {
        id: "user_analytics",
        name: "User Analytics",
        path: "/sip/user-analytics",
      },
      {
        id: "user_settings",
        name: "User Settings",
        path: "/sip/settings",
      },
      {
        id: "shared_recordings",
        name: "Shared Recording",
        path: "/sip/shared-recording",
      },
    ],
  },

  // -------- Reports --------
  {
    moduleId: "reports",
    name: "Reports",
    path: "/reporting-analytics",
    icon: <Icon as={MdInsertChartOutlined} w="20px" h="20px" />,
  },

  {
    moduleId: "whatsapp",
    name: "Whatsapp",
    path: "/whatsapp",
    icon: <Icon as={FaWhatsapp} width="20px" height="20px" color="inherit" />,
    children: [
      {
        id: "whatsapp_chats",
        name: "Chats",
        path: "/whatsapp/chats",
      },
      {
        // id: 'whatsapp_chats',
        name: "Instances",
        version: "Beta",
        path: "/whatsapp/instances",
      },
      {
        id: "whatsapp_bulk_messages",
        name: "Whatsapp Campaigns",
        path: "/whatsapp/bulk-messages",
      },
      {
        id: "whatsapp_settings",
        name: "Settings",
        path: "/whatsapp/settings",
      },
    ],
  },

  // -------- Users --------
  {
    moduleId: "users",
    name: "Users",
    path: "/user",
    icon: <Icon as={HiUsers} w="20px" h="20px" />,
  },

  // -------- System Log --------
  {
    moduleId: "system_log",
    name: "System Log",
    path: "/system-log",
    icon: <Icon as={MdOutlineLaptopMac} w="20px" h="20px" />,
  },
];

export default sidebarRoutes;
