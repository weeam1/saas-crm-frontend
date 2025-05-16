import { Icon } from '@chakra-ui/react';
import { HiOutlineDocumentReport, HiUsers } from 'react-icons/hi';
import {
	MdHome,
	MdInsertChartOutlined,
	MdLeaderboard,
	MdLock,
	MdPeopleOutline,
} from 'react-icons/md';

import React from 'react';
import { AiFillFolderOpen, AiOutlineMail } from 'react-icons/ai';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import {
	FaCalendarAlt,
	FaFile,
	FaRupeeSign,
	FaTasks,
	FaWpforms,
	FaRegCalendarCheck,
	FaUserCircle,
	FaDollarSign,
	FaRegCopy,
	FaList 
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
import DeveloperDetails from 'views/admin/developers/components/DeveloperView';

import Employees from 'views/admin/attendance/components/employees';
import Records from 'views/admin/attendance/components/records';
import MyAttendance from 'views/admin/attendance/components/myAttendance';
import AttendanceDashboard from 'views/admin/attendance/components/dashboard';
import SipDashboard from 'views/admin/sip/component/Dashboard';
import SipHistory from 'views/admin/sip/component/History';
import SettingPage from 'views/admin/Listing/Component/settings/index'
import AddListing from "views/admin/Listing/Component/AddListing"
import ViewListing from 'views/admin/Listing/Component/ViewLisitng';
import UpdateListing from 'views/admin/Listing/Component/UpdateListing';
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

const InvoiceModule = React.lazy(() => import('views/admin/invoice'));
const BankAccounts = React.lazy(() => import('views/admin/bankAccountsV2'));
const SingleInvoice = React.lazy(() => import('views/admin/invoice/View'));
const AddEntry = React.lazy(() => import('views/admin/invoice/AddEntry'));
const InvoiceDevelopers = React.lazy(
	() => import('views/admin/invoice/developers')
);

const DeveloperInvoices = React.lazy(
	() => import('views/admin/invoice/developers/DeveloperInvoices')
);

const Task = React.lazy(() => import('views/admin/task'));
const DailyReport = React.lazy(() => import('views/admin/dailyReport'));
const LeadSetting = React.lazy(() => import('views/admin/leadSetting'));
const Agency = React.lazy(() => import('views/admin/agencies'));
const OfficeSettings = React.lazy(
	() => import('views/admin/agencies/OfficeSetting')
);

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

const Sip = React.lazy(() => import('views/admin/sip'));
const Expenses = React.lazy(() => import('views/admin/expenses'));
const Listing = React.lazy(() => import('views/admin/Listing'))

// const Employees = React.lazy(
// 	() => import('views/admin/attendance/components/employees')
// );
// const Records = React.lazy(
// 	() => import('views/admin/attendance/components/records')
// );
// const MyAttendance = React.lazy(
// 	() => import('views/admin/attendance/components/myAttendance')
// );
// const AttendanceDashboard = React.lazy(
// 	() => import('views/admin/attendance/components/dashboard')
// );

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
		name: 'Lead',
		layout: [ROLE_PATH.superAdmin],
		path: '/lead',
		icon: (
			<Icon as={MdLeaderboard} width='20px' height='20px' color='inherit' />
		),
		component: LeadScreen,
	},
	{
		name: 'Expenses',
		layout: [ROLE_PATH.superAdmin],
		path: '/expenses',
		icon: <Icon as={FaRegCopy} width='20px' height='20px' color='inherit' />,
		component: Expenses,
	},
	{
		name: 'Listing',
		layout: [ROLE_PATH.superAdmin],
		path: '/listing',
		icon: <Icon as={FaList} width='20px' height='20px' color='inherit' />,
		component: Listing,
	},
	{
		name: 'Adding Listing',
		layout: [ROLE_PATH.superAdmin],
		path: '/listing/add-listing',
		under: 'listing',
		parentName: 'Listing',
		component: AddListing,
	},
	{
		name: 'View Listing',
		layout: [ROLE_PATH.superAdmin],
		path: '/listing/view-listing/:id',
		under: 'listing',
		parentName: 'Listing',
		component: ViewListing,
	},
	{
		name: 'Update Listing',
		layout: [ROLE_PATH.superAdmin],
		path: '/listing/update/:id',
		under: 'listing',
		parentName: 'Listing',
		component: UpdateListing,
	},
	{
		name: 'Listing Setting',
		layout: [ROLE_PATH.superAdmin],
		path: '/listing/settings',
		under: 'listing',
		parentName: 'Listing',
		component: SettingPage,
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
	// {
	// 	name: 'HR Module',
	// 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	path: '/hrmodule',
	// 	icon: <Icon as={FaUserCircle} width='20px' height='20px' color='inherit' />,
	// 	component: HRModule,
	// },

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
		name: 'Attendance Record',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/attendance/record',
		under: 'attendance-record',
		parentName: 'Attendance',
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
		name: 'Developer Details',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/developer/:id',
		under: 'developer',
		parentName: 'develoeper',
		component: DeveloperDetails,
	},
	{
		name: 'Leads Pool',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/pool',
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

	// {
	// 	name: 'Points',
	// 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	path: '/points',
	// 	icon: <Icon as={FaDollarSign} width='20px' height='20px' color='inherit' />,
	// 	component: CurrencyPoints,
	// },
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
	// {
	// 	name: 'Property',
	// 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	path: '/properties',
	// 	icon: <Icon as={LuBuilding2} width='20px' height='20px' color='inherit' />,
	// 	component: Property,
	// },
	// {
	// 	name: 'Property ',
	// 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	parentName: 'Property',
	// 	under: 'properties',
	// 	path: '/propertyView/:id',
	// 	component: PropertyView,
	// },
	// {
	// 	name: 'Property Import',
	// 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	both: true,
	// 	under: 'properties',
	// 	parentName: 'Property',
	// 	path: '/propertyImport',
	// 	component: PropertyImport,
	// },

	// ------------- Invoice Module Routes ------------------------ //
	{
		name: 'Invoice',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		icon: (
			<Icon
				as={HiOutlineDocumentReport}
				width='20px'
				height='20px'
				color='inherit'
			/>
		),
		path: '/invoice',
		component: InvoiceModule,
	},
	{
		name: 'Developer Invoices',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		under: 'developer-invoices',
		path: '/invoice/developers/invoices/:id',
		parentName: 'Invoice',
		component: DeveloperInvoices,
	},
	{
		name: 'Single Invoice',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		under: 'single-invoice',
		parentName: 'Invoice',
		path: '/invoice/developers/invoices/view/:id',
		component: SingleInvoice,
	},
	{
		name: 'Invoice Entries',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		under: 'invoice-entries',
		parentName: 'Invoice',
		path: '/invoice/developers/invoices/entries/:id',
		component: AddEntry,
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
	// {
	// 	name: 'Task',
	// 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	path: '/task',
	// 	icon: <Icon as={FaTasks} width='20px' height='20px' color='inherit' />,
	// 	component: Task,
	// },
	// {
	// 	name: 'Task ',
	// 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	under: 'task',
	// 	parentName: 'Task',
	// 	path: '/view/:id',
	// 	component: TaskView,
	// },
	// // ------------- Meeting Routes ------------------------
	// {
	// 	name: 'Meeting',
	// 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	path: '/metting',
	// 	icon: <Icon as={SiGooglemeet} width='20px' height='20px' color='inherit' />,
	// 	component: Meeting,
	// },
	// {
	// 	name: 'Meeting ',
	// 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	under: 'metting',
	// 	parentName: 'Meeting',
	// 	path: '/metting/:id',
	// 	component: MettingView,
	// },

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
	// {
	// 	name: 'Call',
	// 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	path: '/phone-call',
	// 	icon: (
	// 		<Icon as={PiPhoneCallBold} width='20px' height='20px' color='inherit' />
	// 	),
	// 	component: PhoneCall,
	// },

	// {
	// 	name: 'Call ',
	// 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	under: 'phone-call',
	// 	parentName: 'Call',
	// 	path: '/phone-call/:id',
	// 	component: PhoneCallView,
	// },
	// ------------- Email Routes------------------------
	// {
	// 	// separator: 'History',
	// 	name: 'Email',
	// 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	path: '/email',
	// 	icon: (
	// 		<Icon as={AiOutlineMail} width='20px' height='20px' color='inherit' />
	// 	),
	// 	component: EmailHistory,
	// },
	// {
	// 	name: 'Email ',
	// 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	under: 'email',
	// 	parentName: 'Email',
	// 	path: '/Email/:id',
	// 	component: EmailHistoryView,
	// },
	// // ------------- Calender Routes ------------------------
	// {
	// 	name: 'Calender',
	// 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	path: '/calender',
	// 	icon: (
	// 		<Icon as={FaCalendarAlt} width='20px' height='20px' color='inherit' />
	// 	),
	// 	component: Calender,
	// },
	// // ------------- Payments Routes ------------------------
	// {
	// 	name: 'Payments',
	// 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	path: '/payments',
	// 	icon: <Icon as={FaRupeeSign} width='20px' height='20px' color='inherit' />,
	// 	component: Payments,
	// },

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
	// {
	// 	name: 'Documents',
	// 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	path: '/documents',
	// 	icon: (
	// 		<Icon as={AiFillFolderOpen} width='20px' height='20px' color='inherit' />
	// 	),
	// 	component: Document,
	// },
	// ----------------- Reporting Layout -----------------
	// {
	// 	name: 'Daily Report',
	// 	layout: [ROLE_PATH.user, ROLE_PATH.superAdmin],
	// 	path: '/daily-report',
	// 	icon: (
	// 		<Icon
	// 			as={MdInsertChartOutlined}
	// 			width='20px'
	// 			height='20px'
	// 			color='inherit'
	// 		/>
	// 	),
	// 	component: DailyReport,
	// },
	// {
	// 	name: 'Reporting and Analytics',
	// 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	path: '/reporting-analytics',
	// 	icon: (
	// 		<Icon
	// 			as={MdInsertChartOutlined}
	// 			width='20px'
	// 			height='20px'
	// 			color='inherit'
	// 		/>
	// 	),
	// 	component: Report,
	// },

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
	{
		name: 'Office Settings',
		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
		path: '/office-settings/:id',
		under: 'office-settings',
		component: OfficeSettings,
	},
	// ========================== auth layout ==========================
	{
		name: 'Sign In',
		layout: '/auth',
		path: '/sign-in',
		icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
		component: SignInCentered,
	},

	// ========================= sip layout ============================
	{
		name: 'Sip',
		layout: [ROLE_PATH.superAdmin],
		path: '/sip',
		icon: (
			<Icon
				as={FaRegCalendarCheck}
				width='20px'
				height='20px'
				color='inherit'
			/>
		),
		component: Sip,
	},
	{
		name: 'Sip Dashboard',
		layout: [ROLE_PATH.superAdmin],
		path: '/sip/dashboard',
		under: 'Sip',
		parentName: 'Sip',
		component: SipDashboard,
	},
	{
		name: 'Sip history',
		layout: [ROLE_PATH.superAdmin],
		path: '/sip/history',
		under: 'Sip',
		parentName: 'Sip',
		component: SipHistory,
	},
];

export default routes;
