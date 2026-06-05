import {
    FiUsers,
    FiPhoneCall,
    FiBriefcase,
    FiDollarSign,
    FiClipboard,
    FiTrendingUp,
    FiFileText,
    FiPieChart,
    FiLayers,
    FiBell,
    FiBarChart2,
    FiCheckSquare,
    FiShield,
    FiActivity,
    FiUserCheck,
    FiCreditCard,
    FiCalendar,
    FiSettings,
} from 'react-icons/fi';

import {
    MdLeaderboard,
    MdOutlineWorkHistory,
    MdOutlineInventory2,
    MdOutlineCall,
} from 'react-icons/md';

import {
    HiOutlineUserGroup,
    HiOutlineClipboardDocumentList,
} from 'react-icons/hi2';

import {
    BsCashStack,
    BsGraphUpArrow,
    BsBank,
} from 'react-icons/bs';

import {
    LuLayoutDashboard,
    LuFileSpreadsheet,
    LuScrollText,
} from 'react-icons/lu';

export const moduleIcons = {
    // CRM / Leads
    leads: <FiUsers size={24} />,
    leadpool_admin: <HiOutlineUserGroup size={24} />,
    leadpool_agents: <HiOutlineUserGroup size={24} />,

    // Deals / Sales
    deal: <FiTrendingUp size={24} />,

    // Hiring / HR
    hiring: <FiBriefcase size={24} />,
    attendance: <FiCalendar size={24} />,
    payroll: <FiDollarSign size={24} />,
    employee_loans: <BsCashStack size={24} />,

    // Invoice / Finance
    invoice: <FiCreditCard size={24} />,
    expense: <BsBank size={24} />,

    // Productivity
    task: <FiCheckSquare size={24} />,

    // Listing / Inventory
    listing: <MdOutlineInventory2 size={24} />,

    // Calls / SIP
    sip: <MdOutlineCall size={24} />,

    // Communication
    announcement: <FiBell size={24} />,

    // Analytics
    reports: <FiBarChart2 size={24} />,
    survey: <LuFileSpreadsheet size={24} />,
    evaluation: <FiClipboard size={24} />,

    // Users / Security
    users: <FiUserCheck size={24} />,
    system_log: <FiActivity size={24} />,
};