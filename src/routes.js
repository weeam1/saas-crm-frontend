import { Icon } from '@chakra-ui/react';
import { HiUsers } from 'react-icons/hi';
import {
	MdContacts,
	MdHome,
	MdInsertChartOutlined,
	MdLeaderboard,
	MdLock,
	MdPeopleOutline,
} from 'react-icons/md';
// icon
import React from 'react';
import { AiFillFolderOpen, AiOutlineMail } from 'react-icons/ai';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import {
	FaCalendarAlt,
	FaFile,
	FaHistory,
	FaRupeeSign,
	FaTasks,
	FaWpforms,
	FaRegCalendarCheck,
	FaUserCircle,
	FaDollarSign,
	FaUserFriends,
	FaUsers,
} from 'react-icons/fa';
import { LuBuilding2 } from 'react-icons/lu';
import { PiPhoneCallBold } from 'react-icons/pi';
import { FaCreativeCommonsBy } from 'react-icons/fa';
import { SiGooglemeet } from 'react-icons/si';
import { MdCampaign } from 'react-icons/md';

import { ROLE_PATH } from './roles';
import ChangeImage from 'views/admin/image';
import Validation from 'views/admin/validation';
import CustomField from 'views/admin/customField';
import TableField from 'views/admin/tableField';
import { FaClipboardUser } from 'react-icons/fa6';
// import Employees from 'views/admin/attendanceEmp/components/employees';
// import Attendance from 'views/admin/attendanceEmp/components/myAttendance';
// import Records from 'views/admin/attendanceEmp/components/records';

// Admin Imports
const MainDashboard = React.lazy(() => import('views/admin/default'));

// My component
const Contact = React.lazy(() => import('views/admin/contact'));
const ContactView = React.lazy(() => import('views/admin/contact/View'));
const ContactImport = React.lazy(
	() => import('views/admin/contact/components/ContactImport')
);

const User = React.lazy(() => import('views/admin/users'));
const UserView = React.lazy(() => import('views/admin/users/View'));

const Property = React.lazy(() => import('views/admin/property'));
const PropertyView = React.lazy(() => import('views/admin/property/View'));
const PropertyImport = React.lazy(
	() => import('views/admin/property/components/PropertyImport')
);

const Lead = React.lazy(() => import('views/admin/lead'));
const LeadScreen = React.lazy(() => import('views/admin/lead-v2'));
const CallHistory = React.lazy(() => import('views/admin/callHistory'));
const LeadCycle = React.lazy(() => import('views/admin/leadCycle'));
const LeadView = React.lazy(() => import('views/admin/lead/View'));
const LeadImport = React.lazy(
	() => import('views/admin/lead/components/LeadImport')
);
const InvoiceView = React.lazy(() => import('views/admin/invoice'));
const SingleInvoice = React.lazy(() => import('views/admin/invoice/View'));

const Task = React.lazy(() => import('views/admin/task'));
const Developers = React.lazy(() => import('views/admin/developers'));
const BankAccounts = React.lazy(() => import('views/admin/bankAccounts'));
const DailyReport = React.lazy(() => import('views/admin/dailyReport'));
const LeadSetting = React.lazy(() => import('views/admin/leadSetting'));
const Agency = React.lazy(() => import('views/admin/agencies'));
const TaskView = React.lazy(
	() => import('views/admin/task/components/taskView')
);
const Calender = React.lazy(() => import('views/admin/calender'));
const Payments = React.lazy(() => import('views/admin/payments'));
const Role = React.lazy(() => import('views/admin/role'));

const Document = React.lazy(() => import('views/admin/document'));

const EmailHistory = React.lazy(() => import('views/admin/emailHistory'));
const EmailHistoryView = React.lazy(
	() => import('views/admin/emailHistory/View')
);

const Meeting = React.lazy(() => import('views/admin/meeting'));
const MettingView = React.lazy(() => import('views/admin/meeting/View'));

const Hiring = React.lazy(() => import('views/admin/hiring'));
const Positions = React.lazy(() => import('views/admin/hiring/positions'));
const OfferLetter = React.lazy(
	() => import('views/admin/hiring/interviewedCandidates/OfferLetter')
);
const InterviewScreen = React.lazy(
	() => import('views/admin/hiring/interview/InterviewScreen')
);
const InterviewedCandidates = React.lazy(
	() => import('views/admin/hiring/interviewedCandidates')
);
const Candidates = React.lazy(() => import('views/admin/hiring/candidates'));
const ShortListedCandidates = React.lazy(
	() => import('views/admin/hiring/shortListedCandidates')
);

const PhoneCall = React.lazy(() => import('views/admin/phoneCall'));
const PhoneCallView = React.lazy(() => import('views/admin/phoneCall/View'));

const Report = React.lazy(() => import('views/admin/reports'));
// Auth Imports
const SignInCentered = React.lazy(() => import('views/auth/signIn'));
// admin setting
const AdminSetting = React.lazy(() => import('views/admin/adminSetting'));
// const LeadPool = React.lazy(() => import('views/admin/leadpool'));
const LeadPoolAdmin = React.lazy(() => import('views/admin/leadAdmin'));
const HRModule = React.lazy(() => import('views/admin/hrModule'));
const Announcement = React.lazy(() => import('views/admin/announcement'));
const CurrencyPoints = React.lazy(() => import('views/admin/currencypoints'));
// Attendance module
const Attendance = React.lazy(() => import('views/admin/attendance'));
const Employees = React.lazy(
	() => import('views/admin/attendance/components/employees')
);
const Records = React.lazy(
	() => import('views/admin/attendance/components/records')
);
const MyAttendance = React.lazy(
	() => import('views/admin/attendance/components/myAttendance')
);
const AttendanceDashboard = React.lazy(
	() => import('views/admin/attendance/components/dashboard')
);
//leadpool v2
// const LeadPoolVersion2 = React.lazy(() => import("views/admin/leadPool-v2"));

const routes = [
	// ========================== Dashboard ==========================
	{
		name: 'Dashboard',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/default',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
		component: MainDashboard,
	},
	// ========================== Admin Layout ==========================
	// ------------- lead Routes ------------------------
	// {
	//   name: "Lead",
	//   layout: [ROLE_PATH.superAdmin],
	//   path: "/lead",
	//   icon: (
	//     <Icon as={MdLeaderboard} width="20px" height="20px" color="inherit" />
	//   ),
	//   component: Lead,
	// },
	{
		name: 'New Lead',
		layout: [ROLE_PATH.superAdmin],
		path: '/new-lead',
		icon: (
			<Icon as={MdLeaderboard} width='20px' height='20px' color='inherit' />
		),
		component: LeadScreen,
	},
	{
		name: 'Announcement',
		layout: [ROLE_PATH.superAdmin],
		path: '/announcements',
		icon: <Icon as={MdCampaign} width='20px' height='20px' color='inherit' />,
		component: Announcement,
	},
	{
		name: 'Hiring',
		path: '/hiring',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		icon: (
			<Icon as={FaClipboardUser} width='20px' height='20px' color='inherit' />
		),
		component: Hiring,
	},
	{
		name: 'HR Module',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/hrmodule',
		icon: <Icon as={FaUserCircle} width='20px' height='20px' color='inherit' />,
		component: HRModule,
	},

	// Attendance Routes
	{
		name: 'Attendance',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/attendance',
		icon: (
			<Icon
				as={FaRegCalendarCheck}
				width='20px'
				height='20px'
				color='inherit'
			/>
		),
		component: Attendance,
	},
	{
		name: 'Attendance Dashboard',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/attendance/dashboard',
		under: 'employees',
		parentName: 'Attendance',
		component: AttendanceDashboard,
	},
	{
		name: 'Employees',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/attendance/employees',
		under: 'employees',
		parentName: 'Attendance',
		component: Employees,
	},
	{
		name: 'My Records',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/attendance/records',
		under: 'my-records',
		parentName: 'MyRecords',
		component: Records,
	},
	{
		name: 'My Attendance',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/attendance/employees/:id',
		under: 'my-attendance',
		parentName: 'Attendance',
		component: MyAttendance,
	},

	{
		name: 'Leads Pool Admin',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/leadpooladmin',
		icon: (
			<Icon
				as={MdOutlineAdminPanelSettings}
				width='20px'
				height='20px'
				color='inherit'
			/>
		),
		component: LeadPoolAdmin,
	},
	{
		name: 'Leads Pool',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/pool',
		icon: (
			<Icon as={MdPeopleOutline} width='20px' height='20px' color='inherit' />
		),
		component: LeadPoolAdmin,
	},
	{
		name: 'Points',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/points',
		icon: <Icon as={FaDollarSign} width='20px' height='20px' color='inherit' />,
		component: CurrencyPoints,
	},

	{
		name: 'Lead history',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/leadHistory/:lid',
		icon: <Icon as={FaHistory} width='20px' height='20px' color='inherit' />,
		component: CallHistory,
		under: 'lead',
		parentName: 'Lead',
	},
	// {
	//   name: "Lead Cycle",
	//   layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	//   path: "/leadCycle/:lid",
	//   icon: <Icon as={FaHistory} width='20px' height='20px' color='inherit' />,
	//   component: LeadCycle,
	//   under: "lead",
	//   parentName: "Lead",
	// },
	{
		name: 'Lead',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		under: 'lead',
		parentName: 'Lead',
		path: '/leadView/:id',
		component: LeadView,
	},
	{
		name: 'Lead Import',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		under: 'lead',
		parentName: 'Lead',
		path: '/leadImport',
		component: LeadImport,
	},
	// --------------- contact Routes --------------------
	{
		name: 'Contacts',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/contacts',
		icon: <Icon as={MdContacts} width='20px' height='20px' color='inherit' />,
		component: Contact,
	},
	{
		name: 'Contacts',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		under: 'contacts',
		parentName: 'Contacts',
		path: '/contactView/:id',
		component: ContactView,
	},

	{
		name: 'Contact Import',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		both: true,
		under: 'contacts',
		parentName: 'Contacts',
		path: '/contactImport',
		component: ContactImport,
	},
	// ------------- Property Routes ------------------------
	{
		name: 'Property',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/properties',
		icon: <Icon as={LuBuilding2} width='20px' height='20px' color='inherit' />,
		component: Property,
	},
	{
		name: 'Property ',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		parentName: 'Property',
		under: 'properties',
		path: '/propertyView/:id',
		component: PropertyView,
	},
	{
		name: 'Property Import',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		both: true,
		under: 'properties',
		parentName: 'Property',
		path: '/propertyImport',
		component: PropertyImport,
	},
	{
		name: 'Invoice',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		icon: <Icon as={FaFile} width='20px' height='20px' color='inherit' />,
		path: '/invoice',
		component: InvoiceView,
	},
	{
		name: 'Invoice',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		under: 'invoice',
		path: '/invoiceView/:id',
		component: SingleInvoice,
	},
	// -----------------------------Admin setting-------------------------------------
	{
		name: 'Admin Setting',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		parentName: 'admin',
		under: 'admin',
		path: '/admin-setting',
		component: AdminSetting,
	},
	// {
	// 	name: "Announcement",
	// 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.manager],
	// 	parentName: "admin",
	// 	under: "admin",
	// 	path: "/announcements",
	// 	component: Announcement,
	// },
	// // ------------- Communication Integration Routes ------------------------
	// {
	//   name: "Communication Integration",
	//   layout: [ROLE_PATH.admin, ROLE_PATH.user],

	//   path: "/communication-integration",
	//   icon: <Icon as={GiSatelliteCommunication} width='20px' height='20px' color='inherit' />,
	//   component: Communication,
	// },
	// ------------- Task Routes ------------------------
	{
		name: 'Task',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/task',
		icon: <Icon as={FaTasks} width='20px' height='20px' color='inherit' />,
		component: Task,
	},
	{
		name: 'Task ',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		under: 'task',
		parentName: 'Task',
		path: '/view/:id',
		component: TaskView,
	},
	// ------------- Meeting Routes ------------------------
	{
		name: 'Meeting',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/metting',
		icon: <Icon as={SiGooglemeet} width='20px' height='20px' color='inherit' />,
		component: Meeting,
	},
	{
		name: 'Meeting ',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		under: 'metting',
		parentName: 'Meeting',
		path: '/metting/:id',
		component: MettingView,
	},

	// ------------- Hiring Routes -----------------------
	{
		name: 'Candidates',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/hiring/candidates',
		under: 'candidates',
		parentName: 'Hiring',
		component: Candidates,
	},
	{
		name: 'Short Listed',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/hiring/short-listed',
		under: 'shortListed',
		parentName: 'Hiring',
		component: ShortListedCandidates,
	},
	{
		name: 'Interview',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/hiring/interview/:interviewId',
		under: 'interview',
		parentName: 'Hiring',
		component: InterviewScreen,
	},
	{
		name: 'Interviewed Candidates',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/hiring/interviewed-candidates',
		under: 'interviewCandidates',
		parentName: 'Hiring',
		component: InterviewedCandidates,
	},
	{
		name: 'Offer Letter',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/hiring/interviewed-candidates/offer-letter/:id',
		under: 'offerLetter',
		parentName: 'Hiring',
		component: OfferLetter,
	},
	{
		name: 'Positions',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/hiring/settings',
		under: 'positions',
		parentName: 'Hiring',
		component: Positions,
	},
	// ------------- Phone Routes ------------------------
	{
		name: 'Call',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/phone-call',
		icon: (
			<Icon as={PiPhoneCallBold} width='20px' height='20px' color='inherit' />
		),
		component: PhoneCall,
	},

	{
		name: 'Call ',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		under: 'phone-call',
		parentName: 'Call',
		path: '/phone-call/:id',
		component: PhoneCallView,
	},
	// ------------- Email Routes------------------------
	{
		// separator: 'History',
		name: 'Email',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/email',
		icon: (
			<Icon as={AiOutlineMail} width='20px' height='20px' color='inherit' />
		),
		component: EmailHistory,
	},
	{
		name: 'Email ',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		under: 'email',
		parentName: 'Email',
		path: '/Email/:id',
		component: EmailHistoryView,
	},
	// ------------- Calender Routes ------------------------
	{
		name: 'Calender',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/calender',
		icon: (
			<Icon as={FaCalendarAlt} width='20px' height='20px' color='inherit' />
		),
		component: Calender,
	},
	// ------------- Payments Routes ------------------------
	{
		name: 'Payments',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/payments',
		icon: <Icon as={FaRupeeSign} width='20px' height='20px' color='inherit' />,
		component: Payments,
	},

	// ------------- Roles Routes ------------------------
	{
		name: 'Roles',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/role',
		under: 'role',
		icon: (
			<Icon
				as={FaCreativeCommonsBy}
				width='20px'
				height='20px'
				color='inherit'
			/>
		),
		component: Role,
	},
	{
		name: 'Custom Fields',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/custom-Fields',
		under: 'customField',
		icon: <Icon as={FaWpforms} width='20px' height='20px' color='inherit' />,
		component: CustomField,
	},
	{
		name: 'Change Images',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/change-images',
		under: 'image',
		icon: (
			<Icon
				as={FaCreativeCommonsBy}
				width='20px'
				height='20px'
				color='inherit'
			/>
		),
		component: ChangeImage,
	},
	{
		name: 'Validation',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/validations',
		under: 'Validation',
		icon: (
			<Icon
				as={FaCreativeCommonsBy}
				width='20px'
				height='20px'
				color='inherit'
			/>
		),
		component: Validation,
	},
	{
		name: 'Table Fields',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/table-field',
		under: 'tableField',
		icon: <Icon as={FaWpforms} width='20px' height='20px' color='inherit' />,
		component: TableField,
	},
	// // ------------- Text message Routes ------------------------
	// {
	//   name: "Text Msg",
	//   layout: [ROLE_PATH.admin, ROLE_PATH.user],
	//
	//   path: "/text-msg",
	//   icon: <Icon as={MdOutlineMessage} width='20px' height='20px' color='inherit' />,
	//   component: TextMsg,
	// },
	// {
	//   name: "Text Msg View",
	//   layout: [ROLE_PATH.admin, ROLE_PATH.user],
	//
	//   under: "text-msg",
	//   path:  text-msg/:id",
	//   component: TextMsgView,
	// },
	// ------------- Document Routes ------------------------
	{
		name: 'Documents',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/documents',
		icon: (
			<Icon as={AiFillFolderOpen} width='20px' height='20px' color='inherit' />
		),
		component: Document,
	},
	// ----------------- Reporting Layout -----------------
	{
		name: 'Daily Report',
		layout: [ROLE_PATH.user, ROLE_PATH.superAdmin],
		path: '/daily-report',
		icon: (
			<Icon
				as={MdInsertChartOutlined}
				width='20px'
				height='20px'
				color='inherit'
			/>
		),
		component: DailyReport,
	},
	{
		name: 'Reporting and Analytics',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/reporting-analytics',
		icon: (
			<Icon
				as={MdInsertChartOutlined}
				width='20px'
				height='20px'
				color='inherit'
			/>
		),
		component: Report,
	},

	// ------------- user Routes ------------------------
	{
		name: 'Users',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/user',
		under: 'user',
		icon: <Icon as={HiUsers} width='20px' height='20px' color='inherit' />,
		component: User,
	},
	{
		name: 'User View',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		parentName: 'Email',
		under: 'user',
		path: '/userView/:id',
		component: UserView,
	},
	{
		name: 'Developers',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/developers',
		under: 'developers',
		component: Developers,
	},

	{
		name: 'Bank Accounts',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/bank-accounts',
		under: 'bank-accounts',
		component: BankAccounts,
	},
	{
		name: 'Lead Settings',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/lead-settings',
		under: 'lead-settings',
		component: LeadSetting,
	},
	{
		name: 'Agencies',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/agencies',
		under: 'agencies',
		component: Agency,
	},
	// ========================== User layout ==========================

	// ========================== auth layout ==========================
	{
		name: 'Sign In',
		layout: '/auth',
		path: '/sign-in',
		icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
		component: SignInCentered,
	},
];

export default routes;
