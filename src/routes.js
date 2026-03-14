import { Icon } from "@chakra-ui/react";
import { HiOutlineDocumentReport, HiUsers } from "react-icons/hi";
import {
  MdHome,
  MdInsertChartOutlined,
  MdLeaderboard,
  MdLock,
  MdOutlineLaptopMac,
  MdPeopleOutline,
} from "react-icons/md";

import React from "react";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import {
  FaTasks,
  FaWpforms,
  FaRegCalendarCheck,
  FaRegCopy,
  FaList,
  FaPhone,
  FaWhatsapp,
  FaHandshake,
  FaFileAlt,
} from "react-icons/fa";
import { FaCreativeCommonsBy } from "react-icons/fa";
import { MdCampaign } from "react-icons/md";
import { FaClipboardUser, FaSquarePlus } from "react-icons/fa6";

import { ROLE_PATH } from "./roles";
import TakeSurvey from "views/admin/survey/TakeSurvey";

// ========================== Lazy Imports ==========================
// Dashboard
const MainDashboard = React.lazy(() => import("views/admin/default"));

// Leads & Deals
const LeadScreen = React.lazy(() => import("views/admin/lead-v2"));
const LeadPoolAdmin = React.lazy(() => import("views/admin/leadAdmin"));
const LeadPoolAgent = React.lazy(() => import("views/admin/leadPool-v2"));
const DealsScreen = React.lazy(() => import("views/admin/deals"));
const SharedDealsScreen = React.lazy(
  () => import("views/admin/deals/SharedDealsScreen"),
);
const LeadsSetting = React.lazy(() => import("views/admin/leadsSetting/index"));
const LeadStatus = React.lazy(
  () => import("views/admin/leadsSetting/components/leadStatus/index"),
);
const LeadInvitation = React.lazy(
  () => import("views/admin/leadsSetting/components/qrCode/index"),
);
const CallFeedback = React.lazy(
  () => import("views/admin/lead-v2/callFeedback/index"),
);
const CloseDealScreen = React.lazy(
  () => import("views/admin/deals/DealsScreen"),
);
const LeadAnalytics = React.lazy(
  () => import("views/admin/lead-v2/leadAnalytics"),
);
const UserProfileDetails = React.lazy(
  () => import("views/admin/users-v2/components/UserProfile"),
);

// Hiring
const Hiring = React.lazy(() => import("views/admin/hiring"));
const HiringDashboard = React.lazy(
  () => import("views/admin/hiring/hiringDashboard"),
);
const Candidates = React.lazy(() => import("views/admin/hiring/candidates"));
const ShortListedCandidates = React.lazy(
  () => import("views/admin/hiring/shortListedCandidates"),
);
const InterviewScreen = React.lazy(
  () => import("views/admin/hiring/interview/InterviewScreen"),
);
const InterviewedCandidates = React.lazy(
  () => import("views/admin/hiring/interviewedCandidates"),
);
const OfferLetter = React.lazy(
  () => import("views/admin/hiring/interviewedCandidates/OfferLetter"),
);
const OfferView = React.lazy(
  () => import("views/admin/hiring/interviewedCandidates/OfferView"),
);
const Positions = React.lazy(() => import("views/admin/hiring/positions"));
const InterviewedRound = React.lazy(
  () => import("views/admin/hiring/interviewedCandidates/Rounds/index"),
);
// Attendance
const AttendanceV2 = React.lazy(
  () => import("views/admin/attendance/AttendenceV2"),
);
const AttendanceDashboard = React.lazy(
  () => import("views/admin/attendance/components/dashboard"),
);
const Employees = React.lazy(
  () => import("views/admin/attendance/components/employees"),
);
const Records = React.lazy(
  () => import("views/admin/attendance/components/records"),
);
const MyAttendance = React.lazy(
  () => import("views/admin/attendance/components/myAttendance"),
);

// Invoice & Expenses
const InvoiceModule = React.lazy(() => import("views/admin/invoice"));
const DeveloperInvoices = React.lazy(
  () => import("views/admin/invoice/developers/DeveloperInvoices"),
);
const SingleInvoice = React.lazy(() => import("views/admin/invoice/View"));
const AddEntry = React.lazy(() => import("views/admin/invoice/AddEntry"));
const PayrollSalariedUsers = React.lazy(
  () => import("views/admin/payroll/SalariedUsers"),
);
const PayrollCommissionUsers = React.lazy(
  () => import("views/admin/payroll/CommissionUsers"),
);
const EmployeePayslip = React.lazy(
  () => import("views/admin/payroll/components/EmployeePayrollDetails"),
);
const CommissionEmployeePayslip = React.lazy(
  () => import("views/admin/payroll/CommissionUsers/EmployeePayrollDetails"),
);

//Evalution
// const Evalution = React.lazy(() => imporviews/admin/evalution/user-evalution/indexdex'));
const UserEvalution = React.lazy(
  () => import("views/admin/evalution/user-evalution/index"),
);
const MyEvaluation = React.lazy(
  () => import("views/admin/evalution/my-evalution/index"),
);
const EvaluationForm = React.lazy(
  () => import("views/admin/evalution/user-evalution/EvaluationForm"),
);
const EditEvaluationForm = React.lazy(
  () => import("views/admin/evalution/user-evalution/EditEvaluationForm"),
);
const EvaluateSettings = React.lazy(
  () => import("views/admin/evalution/settings/index"),
);

// Finance
const IncomingCash = React.lazy(
  () => import("views/admin/finance/incoming-balance/index"),
);
const OutgoingCash = React.lazy(
  () => import("views/admin/finance/outgoing-expense/index"),
);
const FinanceSettings = React.lazy(
  () => import("views/admin/finance/settings/index"),
);
const EmployeeLoans = React.lazy(
  () => import("views/admin/finance/employee-laon/index"),
);
const EmployeeLoanDetails = React.lazy(
  () => import("views/admin/finance/employee-laon/loan-details/index"),
);

const DeveloperDetails = React.lazy(
  () => import("views/admin/developers/components/DeveloperView"),
);

const BankAccount = React.lazy(
  () => import("views/admin/bankAccountsV2/index"),
);

const DeveloperScreen = React.lazy(
  () => import("views/admin/invoice/developers/index"),
);
const ProjectScreen = React.lazy(
  () => import("views/admin/developers/projects/index"),
);

// Listing
const Listing = React.lazy(() => import("views/admin/Listing"));
const ClientListings = React.lazy(
  () => import("views/admin/Listing/client-listings"),
);
const PropertyView = React.lazy(
  () =>
    import(
      "views/admin/Listing/client-listings/_component/details/PropertyView"
    ),
);
const AddListing = React.lazy(
  () => import("views/admin/Listing/Component/AddListing"),
);
const ViewListing = React.lazy(
  () => import("views/admin/Listing/Component/ViewLisitng"),
);
const UpdateListing = React.lazy(
  () => import("views/admin/Listing/Component/UpdateListing"),
);
const SettingPage = React.lazy(
  () => import("views/admin/Listing/Component/settings"),
);

const AllListing = React.lazy(
  () => import("views/admin/Listing/Component/AllListing"),
);
const MyListing = React.lazy(
  () => import("views/admin/Listing/Component/MyListing"),
);
const ViewRequestListing = React.lazy(
  () => import("views/admin/Listing/Component/ViewRequest"),
);
const PendingListing = React.lazy(
  () => import("views/admin/Listing/Component/PendingListings"),
);
const PendingViewRequest = React.lazy(
  () => import("views/admin/Listing/Component/ViewRequest/ViewRequest"),
);
const ApprovedViewRequest = React.lazy(
  () => import("views/admin/Listing/Component/ViewRequest/ApprovedRequest"),
);
const RejectedViewRequest = React.lazy(
  () => import("views/admin/Listing/Component/ViewRequest/RejectRequest"),
);
const SubUnitType = React.lazy(
  () =>
    import(
      "views/admin/Listing/Component/settings/components/ListingUnitType/SubComponent/SubUnitType"
    ),
);

// Survey
const Survey = React.lazy(() => import("views/admin/survey"));
const LeaderBoard = React.lazy(() => import("views/admin/survey/LeaderBoard"));
const CreateSurvey = React.lazy(
  () => import("views/admin/survey/CreateSurvey"),
);
const ViewSurveyResponse = React.lazy(
  () => import("views/admin/survey/ViewSurveyResponse"),
);
const SurveyDashboard = React.lazy(
  () => import("views/admin/survey/Component/SurveyDashboard"),
);
const SurveyManage = React.lazy(
  () => import("views/admin/survey/Component/ManageSurveys"),
);
// Whatsapp
const AdminWhatsapp = React.lazy(
  () => import("views/admin/whatsapp/AdminWhatsapp"),
);

const WhatsappInstances = React.lazy(
  () => import("views/admin/whatsapp-v2/Instances"),
);

const UserWhatsappInstance = React.lazy(
  () => import("views/admin/whatsapp-v2/UserWhatsapp"),
);
const UserWhatsappChat = React.lazy(
  () => import("views/admin/whatsapp/UserWhatsapp"),
);
const WhatsappSettings = React.lazy(
  () => import("views/admin/whatsapp/WhatsappSettings"),
);
const WhatsappTemplates = React.lazy(
  () => import("views/admin/whatsapp/WhatsappSettings/Templates"),
);
const CreateWhatsappTemplate = React.lazy(
  () =>
    import(
      "views/admin/whatsapp/WhatsappSettings/Templates/CreateWhatsappTemplate"
    ),
);

// Reports
const Report = React.lazy(() => import("views/admin/reports-v2"));
const TeamDetailsScreen = React.lazy(
  () =>
    import(
      "views/admin/reports-v2/components/lead-report/Teams/TeamDetailsScreen"
    ),
);

// Settings
const AdminSetting = React.lazy(() => import("views/admin/adminSetting"));
const Role = React.lazy(() => import("views/admin/role"));
const UserPermission = React.lazy(() => import("views/admin/userPermission"));
const CustomField = React.lazy(() => import("views/admin/customField"));
const TableField = React.lazy(() => import("views/admin/tableField"));
const ChangeImage = React.lazy(() => import("views/admin/image"));
const Validation = React.lazy(() => import("views/admin/validation"));
const LeadSetting = React.lazy(() => import("views/admin/leadSetting"));
const Agency = React.lazy(() => import("views/admin/agencies"));
const OfficeSettings = React.lazy(
  () => import("views/admin/agencies/OfficeSetting"),
);
const Configuration = React.lazy(
  () => import("views/admin/adminSetting/secretConfig/index"),
);

// Others
const TaskV2 = React.lazy(() => import("views/admin/taskV2"));
const Sip = React.lazy(() => import("views/admin/sip"));
const SipDashboard = React.lazy(
  () => import("views/admin/sip/component/Dashboard"),
);
const SipHistory = React.lazy(
  () => import("views/admin/sip/component/RecordingHistory/index"),
);
const SipSettings = React.lazy(
  () => import("views/admin/sip/component/UserSetting/index"),
);
const SipUserAnalytics = React.lazy(
  () => import("views/admin/sip/component/Analytics/index"),
);
const SharedSipRecording = React.lazy(
  () => import("views/admin/sip/component/sharedRecording/index"),
);
const Announcement = React.lazy(() => import("views/admin/announcement"));
const CreateAnnouncement = React.lazy(
  () => import("views/admin/announcement/components/v2/CreateAnnouncement"),
);
const AnnouncementHistory = React.lazy(
  () => import("views/admin/announcement/components/History"),
);

const SystemLog = React.lazy(() => import("views/admin/logAction/index"));
const User = React.lazy(() => import("views/admin/users"));
const EditUser = React.lazy(() => import("views/admin/users/EditUser"));
const UserView = React.lazy(() => import("views/admin/users/View"));

// Users V2 (By Arslan)
const UserV2 = React.lazy(() => import("views/admin/users-v2"));
const UserPermissions = React.lazy(
  () => import("views/admin/users-v2/components/UserPermissions"),
);

// Auth
const SignInCentered = React.lazy(() => import("views/auth/signIn"));
const BulkMessage = React.lazy(
  () => import("views/admin/whatsapp/BulkMessage"),
);

const routes = [
  // ========================== Dashboard ==========================
  {
    // moduleId: 'dashboard',
    name: "Dashboard",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/default",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  },
  // ========================== Admin Layout ==========================
  {
    moduleId: "leads",
    name: "Lead",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/lead",
    under: "lead",
    parent: "lead",
    icon: (
      <Icon as={MdLeaderboard} width="20px" height="20px" color="inherit" />
    ),
    component: LeadScreen,
  },
  {
    parent: "leads",
    childId: "lead_analytics",
    name: "Lead",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/lead_analytics",
    component: LeadAnalytics,
  },
  {
    parent: "leads",
    childId: "call_feedbacks",
    name: "Call Feedback",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/call-feedback",
    component: CallFeedback,
  },
  {
    parent: "leads",
    // childId: "leads_setting",
    name: "Leads Setting",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/leads-settings",
    component: LeadsSetting,
  },
  {
    parent: "leads",
    // childId: "qr_settings",
    name: "Lead Invitation",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/leads-settings/lead-invitation",
    component: LeadInvitation,
  },
  {
    parent: "leads",
    // childId: "qr_settings",
    name: "Lead Status",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/leads-settings/lead-status",
    component: LeadStatus,
  },

  {
    moduleId: "leadpool_admin",
    name: "Lead Pool",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/pool",
    icon: (
      <Icon
        as={MdOutlineAdminPanelSettings}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: LeadPoolAdmin,
  },
  {
    moduleId: "leadpool_agents",
    name: "Leads Pool",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/agent_pool",
    icon: (
      <Icon as={MdPeopleOutline} width="20px" height="20px" color="inherit" />
    ),
    component: LeadPoolAgent,
  },
  {
    moduleId: "deal",
    name: "Deals",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/deals",
    icon: <Icon as={FaHandshake} width="20px" height="20px" color="inherit" />,
    component: DealsScreen,
  },
  {
    moduleId: "deal",
    name: "Close Deals",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/deals/close-deal",
    under: "deal",
    parentName: "deal",
    component: CloseDealScreen,
  },
  {
    moduleId: "deal",
    name: "Shared Deals",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/deals/shared-deals",
    under: "deal",
    parentName: "deal",
    component: SharedDealsScreen,
  },
  {
    moduleId: "announcement",
    name: "Announcement",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/announcements",
    icon: <Icon as={MdCampaign} width="20px" height="20px" color="inherit" />,
    component: Announcement,
  },
  {
    moduleId: "announcement",
    name: "Announcement",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/announcement/create",
    under: "announcement",
    parentName: "announcement",
    component: CreateAnnouncement,
  },

  {
    moduleId: "announcement",
    name: "History",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/announcement/history",
    under: "announcement",
    parentName: "announcement",
    component: AnnouncementHistory,
  },
  {
    moduleId: "attendance",
    name: "Employees",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/attendance/employees",
    under: "employees",
    parentName: "Attendance",
    component: Employees,
  },

  // Attendance Routes
  {
    moduleId: "attendance",
    name: "Attendance",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/attendance",
    icon: (
      <Icon
        as={FaRegCalendarCheck}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: AttendanceV2,
  },
  {
    childid: "attendance",
    name: "Attendance Dashboard",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/attendance/dashboard",
    under: "employees",
    parentName: "Attendance",
    component: AttendanceDashboard,
  },
  {
    childid: "attendance",
    name: "Employees",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/attendance/employees",
    under: "employees",
    parentName: "Attendance",
    component: Employees,
  },
  {
    childid: "attendance",
    name: "Attendance Record",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/attendance/record",
    under: "attendance-record",
    parentName: "Attendance",
    component: Records,
  },
  {
    childid: "attendance",
    name: "My Attendance",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/attendance/employees/:id",
    under: "my-attendance",
    parentName: "Attendance",
    component: MyAttendance,
  },
  {
    childid: "attendance",
    name: "My Attendance",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/attendance/my_attendance",
    under: "my-attendance",
    parentName: "Attendance",
    component: MyAttendance,
  },
  {
    moduleId: "invoice",
    name: "Developer Details",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/developer/:id",
    under: "developer",
    parentName: "develoeper",
    component: DeveloperDetails,
  },
  // ------------- Invoice Module Routes ------------------------ //
  {
    moduleId: "invoice",
    name: "Invoice",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    icon: (
      <Icon
        as={HiOutlineDocumentReport}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    path: "/invoice",
    component: InvoiceModule,
  },
  {
    moduleId: "invoice",
    name: "Bank Accounts",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/invoice/bank-account",
    under: "invoice",
    parentName: "invoice",
    component: BankAccount,
  },
  {
    moduleId: "invoice",
    name: "Developer",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/invoice/developer",
    under: "invoice",
    parentName: "invoice",
    component: DeveloperScreen,
  },
  {
    moduleId: "invoice",
    name: "Project",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/invoice/project",
    under: "invoice",
    parentName: "invoice",
    component: ProjectScreen,
  },
  {
    moduleId: "invoice",
    name: "Developer Invoices",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "developer-invoices",
    path: "/invoice/developers/invoices/:id",
    parentName: "Invoice",
    component: DeveloperInvoices,
  },
  {
    moduleId: "invoice",
    name: "Single Invoice",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "single-invoice",
    parentName: "Invoice",
    path: "/invoice/developers/invoices/view/:id",
    component: SingleInvoice,
  },
  {
    moduleId: "invoice",
    name: "Invoice Entries",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "invoice-entries",
    parentName: "Invoice",
    path: "/invoice/developers/invoices/entries/:id",
    component: AddEntry,
  },

  // ********** Payrol routes ************** //
  {
    moduleId: "payroll",
    name: "Payroll",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/payroll/users",
    component: PayrollSalariedUsers,
  },
  {
    moduleId: "payroll",
    name: "Payroll",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/payroll/commission-users",
    component: PayrollCommissionUsers,
  },
  {
    moduleId: "payroll",
    name: "Payroll",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/payroll/users/payslip/:userId",
    component: EmployeePayslip,
  },
  {
    moduleId: "payroll",
    name: "Payroll",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/payroll/commission-users/payslip/:userId",
    component: CommissionEmployeePayslip,
  },

  {
    parent: "evaluation",
    childId: "evaluation_users",
    name: "User Evalution",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "evaluation",
    path: "/evaluation/user-evaluation",
    parentName: "evaluation",
    component: UserEvalution,
  },
  {
    parent: "evaluation",
    childId: "my_evaluations",
    name: "My Evalution",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "evaluation",
    path: "/evaluation/my-evaluation",
    parentName: "evaluation",
    component: MyEvaluation,
  },
  {
    parent: "evaluation",
    childId: "evaluation_users",
    name: "Add Evalution",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "evaluation",
    path: "/evaluation/user-evaluation/role/:roleId/user/:userId",
    parentName: "evaluation",
    component: EvaluationForm,
  },
  {
    parent: "evaluation",
    childId: "evaluation_users",
    name: "Edit Evalution",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "evaluation",
    path: "/evaluation/edit-user-evaluation/role/:roleId/user/:userId",
    parentName: "evaluation",
    component: EditEvaluationForm,
  },
  {
    parent: "evaluation",
    childId: "settings",
    name: "Settings",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "evaluation",
    path: "/evaluation/settings",
    parentName: "evaluation",
    component: EvaluateSettings,
  },

  //****** Finance routes *********//
  {
    parent: "expense",
    childId: "incoming_cash",
    name: "Incoming Cash",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "finance",
    path: "/finance/incoming-cash",
    parentName: "finance",
    component: IncomingCash,
  },
  {
    parent: "expense",
    childId: "outgoing_cash",
    name: "Outgoing Cash",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "finance",
    path: "/finance/outgoing-cash",
    parentName: "finance",
    component: OutgoingCash,
  },
  {
    parent: "expense",
    childId: "employee_loans",
    name: "Employee Loans",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "finance",
    path: "/finance/employee-loans",
    parentName: "finance",
    component: EmployeeLoans,
  },
  {
    parent: "expense",
    childId: "employee_loans",
    name: "Employee Loan Details",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "finance",
    path: "/finance/employee-loans/:id",
    parentName: "finance",
    component: EmployeeLoanDetails,
  },
  {
    parent: "expense",
    childId: "settings",
    name: "Finance Settings",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "finance",
    path: "/finance/settings",
    parentName: "finance",
    component: FinanceSettings,
  },

  // ****** Invoice Routes ******** //
  {
    moduleId: "invoice",
    name: "Developer Invoices",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "developer-invoices",
    path: "/invoice/developers/invoices/:id",
    parentName: "Invoice",
    component: DeveloperInvoices,
  },
  {
    moduleId: "invoice",
    name: "Single Invoice",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "single-invoice",
    parentName: "Invoice",
    path: "/invoice/developers/invoices/view/:id",
    component: SingleInvoice,
  },
  {
    moduleId: "invoice",
    name: "Invoice Entries",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "invoice-entries",
    parentName: "Invoice",
    path: "/invoice/developers/invoices/entries/:id",
    component: AddEntry,
  },

  // -----------------------------Admin setting-------------------------------------
  {
    name: "Admin Setting",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    parentName: "admin",
    under: "admin",
    path: "/admin-setting",
    component: AdminSetting,
  },

  // ------------- Task Routes ------------------------
  {
    moduleId: "task",
    name: "Task",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/task",
    icon: <Icon as={FaTasks} width="20px" height="20px" color="inherit" />,
    component: TaskV2,
  },

  // ------------- Hiring Routes -----------------------

  {
    moduleId: "hiring",
    name: "Hiring",
    path: "/hiring",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    icon: (
      <Icon as={FaClipboardUser} width="20px" height="20px" color="inherit" />
    ),
    component: Hiring,
  },
  {
    moduleId: "hiring",
    name: "Hiring Dashboard",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/hiring/dasboard",
    under: "Hiring",
    parentName: "Hiring",
    component: HiringDashboard,
  },
  {
    moduleId: "hiring",
    name: "Candidates",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/hiring/candidates",
    under: "candidates",
    parentName: "Hiring",
    component: Candidates,
  },
  {
    moduleId: "hiring",
    name: "Short Listed",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/hiring/short-listed",
    under: "shortListed",
    parentName: "Hiring",
    component: ShortListedCandidates,
  },
  {
    moduleId: "hiring",
    name: "Interview",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/hiring/interview/:interviewId",
    under: "interview",
    parentName: "Hiring",
    component: InterviewScreen,
  },
  {
    moduleId: "hiring",
    name: "Interviewed Candidates",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/hiring/interviewed-candidates",
    under: "interviewCandidates",
    parentName: "Hiring",
    component: InterviewedCandidates,
  },
  {
    moduleId: "hiring",
    name: "Multi-Round Candidates",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/hiring/multi-round",
    under: "Hiring",
    parentName: "Hiring",
    component: InterviewedRound,
  },
  {
    moduleId: "hiring",
    name: "Offer Letter",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/hiring/interviewed-candidates/offer-letter/:id",
    under: "offerLetter",
    parentName: "Hiring",
    component: OfferLetter,
  },
  {
    moduleId: "hiring",
    name: "Offer View",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/hiring/interviewed-candidates/offer-letter/view/:id",
    under: "offerView",
    parentName: "Hiring",
    component: OfferView,
  },
  {
    name: "Positions",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/hiring/settings",
    under: "positions",
    parentName: "Hiring",
    component: Positions,
  },

  // ------------- Phone Routes ------------------------
  {
    moduleId: "sip",
    name: "Call Logs",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/sip",
    icon: <Icon as={FaPhone} width="20px" height="20px" color="inherit" />,
    component: Sip,
  },
  {
    // parent: 'sip',
    moduleId: "sip",
    name: "Dashboard",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/sip/dashboard",
    under: "Sip",
    component: SipDashboard,
  },
  {
    parent: "sip",
    childId: "call_history",
    name: "Call history",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/sip/history",
    under: "Sip",
    component: SipHistory,
  },
  {
    childId: "user_settings",
    name: "User settings",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/sip/settings",
    under: "Sip",
    parentName: "Sip",
    component: SipSettings,
  },
  {
    childId: "user_analytics",
    name: "User Settings",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/sip/user-analytics",
    under: "Sip",
    parentName: "Sip",
    component: SipUserAnalytics,
  },
  {
    childId: "shared_recordings",
    name: "Shared Recoding",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/sip/shared-recording",
    under: "Sip",
    parentName: "Sip",
    component: SharedSipRecording,
  },

  // Listing --------------------------------------
  {
    moduleId: "listing",
    name: "Listing",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/listing",
    icon: <Icon as={FaList} width="20px" height="20px" color="inherit" />,
    component: Listing,
  },
  {
    moduleId: "listing",
    name: "Adding Listing",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/listing/my-listings/add-listing",
    under: "listing",
    parentName: "Listing",
    component: AddListing,
  },
  {
    moduleId: "listing",
    name: "View Listing",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/listing/view-listing/:id",
    under: "listing",
    parentName: "Listing",
    component: ViewListing,
  },
  {
    moduleId: "listing",
    name: "Update Listing",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/listing/my-listings/update/:id",
    under: "listing",
    parentName: "Listing",
    component: UpdateListing,
  },
  {
    moduleId: "listing",
    name: "Update Listing",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/listing/all-listings/update/:id",
    under: "listing",
    parentName: "Listing",
    component: UpdateListing,
  },
  {
    moduleId: "listing",
    name: "Listing Setting",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/listing/settings",
    under: "listing",
    parentName: "Listing",
    component: SettingPage,
  },
  {
    moduleId: "listing",
    name: "Sub Unit Types",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/listing/settings/sub-unit-types",
    under: "listing",
    parentName: "Listing",
    component: SubUnitType,
  },
  {
    moduleId: "listing",
    name: "All Listings",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/listing/all-listings",
    under: "listing",
    parentName: "Listing",
    component: AllListing,
  },
  {
    childId: "client_listing",
    parent: "listing",
    name: "Client Listings",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/listing/client-listings",
    under: "listing",
    parentName: "Listing",
    component: ClientListings,
  },
  {
    // moduleId: 'listing',
    name: "View Client Listings",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/listing/client-listings/:id",
    under: "listing",
    parentName: "Listing",
    component: PropertyView,
  },
  {
    moduleId: "listing",
    name: "My Listings",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/listing/my-listings",
    under: "listing",
    parentName: "Listing",
    component: MyListing,
  },
  {
    moduleId: "listing",
    name: "Pendings Listing",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/listing/pending-listing",
    under: "listing",
    parentName: "Listing",
    component: PendingListing,
  },
  {
    moduleId: "listing",
    name: "Pending View Request",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/listing/pending-view-listing",
    under: "listing",
    parentName: "Listing",
    component: PendingViewRequest,
  },
  {
    moduleId: "listing",
    name: "Approved View Request",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/listing/approved-view-listing",
    under: "listing",
    parentName: "Listing",
    component: ApprovedViewRequest,
  },
  {
    moduleId: "listing",
    name: "Rejected View Request",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/listing/reject-view-listing",
    under: "listing",
    parentName: "Listing",
    component: RejectedViewRequest,
  },
  // View Request Listing routes ----------
  {
    moduleId: "listing",
    name: "View Request Listing",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/listing/view-request-listing",
    under: "listing",
    parentName: "Listing",
    icon: <Icon as={FaList} width="20px" height="20px" color="inherit" />,
    component: ViewRequestListing,
  },

  {
    moduleId: "view_request_listing",
    name: "Pending View Request",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/view-request-listing/pending-view-listing",
    under: "view_request_listing",
    parentName: "Listing",
    component: PendingViewRequest,
  },
  {
    moduleId: "view_request_listing",
    name: "Approved View Request",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/view-request-listing/approved-view-listing",
    under: "view_request_listing",
    parentName: "Listing",
    component: ApprovedViewRequest,
  },
  {
    moduleId: "listing",
    name: "Rejected View Request",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/view-request-listing/reject-view-listing",
    under: "view_request_listing",
    parentName: "Listing",
    component: RejectedViewRequest,
  },
  // Survey Routes

  {
    moduleId: "survey",
    name: "Survey",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/survey",
    icon: <Icon as={FaSquarePlus} width="20px" height="20px" color="inherit" />,
    component: Survey,
  },
  {
    moduleId: "survey",
    name: "Dashboard",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/survey/dashboard",
    under: "Survey",
    parentName: "Survey",
    component: SurveyDashboard,
  },
  {
    moduleId: "survey",
    name: "All Surveys",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/survey/all-surveys",
    under: "Survey",
    parentName: "Survey",
    component: SurveyManage,
  },
  {
    moduleId: "survey",
    name: "Survey Board",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/survey/dashboard/survey-leader-board",
    under: "Survey",
    parentName: "Survey",
    component: LeaderBoard,
  },
  {
    moduleId: "survey",
    name: "Create Survey",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/survey/create",
    under: "Survey",
    parentName: "Survey",
    component: CreateSurvey,
  },
  {
    moduleId: "survey",
    name: "view Survey",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/survey/all-surveys/view-survey/:id",
    under: "Survey",
    parentName: "Survey",
    component: ViewSurveyResponse,
  },
  {
    moduleId: "survey",
    name: "Take Survey",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/survey/all-surveys/take-survey/:id",
    under: "Survey",
    parentName: "Survey",
    component: TakeSurvey,
  },
  // {
  // 	name: 'whatsapp chat',
  // 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
  // 	path: '/whatsapp-v2',
  // 	icon: <Icon as={FaWhatsapp} width='20px' height='20px' color='inherit' />,
  // 	component: Whatsapp,
  // },

  // **** Whatsapp **** //
  // V2 routes{
  {
    childId: "whatsapp_beta",
    name: "Whatsapp",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/whatsapp/instances",
    parent: "whatsapp",
    icon: <Icon as={FaWhatsapp} width="20px" height="20px" color="inherit" />,
    component: WhatsappInstances,
  },
  {
    childId: "whatsapp_beta",
    name: "User Whatsapp",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/whatsapp/instances/:id",
    parent: "whatsapp",
    component: UserWhatsappInstance,
  },

  // V1 routes
  {
    childId: "whatsapp_chats",
    name: "Whatsapp",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/whatsapp/chats",
    parent: "whatsapp",
    icon: <Icon as={FaWhatsapp} width="20px" height="20px" color="inherit" />,
    component: AdminWhatsapp,
  },
  {
    // childId: 'whatsapp_chats',
    name: "Whatsapp Chat",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/whatsapp/chats/:id",
    parent: "whatsapp",
    component: UserWhatsappChat,
  },
  {
    // childId: 'whatsapp_chats',
    name: "Whatsapp Chat",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/whatsapp/chat",
    parent: "whatsapp",
    component: UserWhatsappChat,
  },
  {
    // childId: 'whatsapp_chats',
    name: "Whatsapp Instance",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/whatsapp/instance",
    parent: "whatsapp",
    component: UserWhatsappInstance,
  },
  {
    childId: "whatsapp_campaigns",
    name: "Bulk Messages",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/whatsapp/bulk-messages",
    parent: "whatsapp",
    component: BulkMessage,
  },

  {
    childId: "whatsapp_settings",
    name: "Whatsapp Setttings",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/whatsapp/settings",
    parent: "whatsapp",
    component: WhatsappSettings,
  },

  {
    childId: "whatsapp_settings",
    name: "Whatsapp Templates",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/whatsapp/settings/message_templates/:businessId",
    parent: "whatsapp",
    component: WhatsappTemplates,
  },

  {
    childId: "whatsapp_settings",
    name: "Whatsapp Templates",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/whatsapp/settings/message_templates/:businessId/create_template",
    parent: "whatsapp",
    component: CreateWhatsappTemplate,
  },

  // ------------- Roles Routes ------------------------
  {
    moduleId: "admin_settings",
    name: "Roles",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/role",
    under: "role",
    icon: (
      <Icon
        as={FaCreativeCommonsBy}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: Role,
  },
  {
    moduleId: "admin_settings",
    name: "User Permission",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/user-permission/:id",
    under: "role",
    component: UserPermission,
  },
  {
    moduleId: "admin_settings",
    name: "Custom Fields",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/custom-Fields",
    under: "customField",
    icon: <Icon as={FaWpforms} width="20px" height="20px" color="inherit" />,
    component: CustomField,
  },
  {
    moduleId: "admin_settings",
    name: "Change Images",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/change-images",
    under: "image",
    icon: (
      <Icon
        as={FaCreativeCommonsBy}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: ChangeImage,
  },
  {
    moduleId: "admin_settings",
    name: "Validation",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/validations",
    under: "Validation",
    icon: (
      <Icon
        as={FaCreativeCommonsBy}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: Validation,
  },
  {
    moduleId: "admin_settings",
    name: "Table Fields",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/table-field",
    under: "tableField",
    icon: <Icon as={FaWpforms} width="20px" height="20px" color="inherit" />,
    component: TableField,
  },
  // // ------------- Text message Routes ------------------------
  {
    moduleId: "reports",
    name: "Reports",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/reporting-analytics",
    icon: (
      <Icon
        as={MdInsertChartOutlined}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: Report,
  },
  {
    moduleId: "reports",
    name: "Team Details",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/reporting-analytics/team-details/:id",
    parent: "Reports",
    under: "Reports",
    component: TeamDetailsScreen,
  },
  {
    moduleId: "system_log",
    name: "System Log",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/system-log",
    icon: (
      <Icon
        as={MdOutlineLaptopMac}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: SystemLog,
  },
  // ------------- Roles Routes ------------------------
  {
    moduleId: "admin_settings",
    name: "Roles",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/role",
    under: "role",
    icon: (
      <Icon
        as={FaCreativeCommonsBy}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: Role,
  },
  {
    moduleId: "admin_settings",
    name: "User Permission",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/user-permission/:id/:roleName",
    under: "role",
    component: UserPermission,
  },
  {
    moduleId: "admin_settings",
    name: "Custom Fields",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/custom-Fields",
    under: "customField",
    icon: <Icon as={FaWpforms} width="20px" height="20px" color="inherit" />,
    component: CustomField,
  },
  {
    moduleId: "admin_settings",
    name: "Change Images",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/change-images",
    under: "image",
    icon: (
      <Icon
        as={FaCreativeCommonsBy}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: ChangeImage,
  },
  {
    moduleId: "admin_settings",
    name: "Validation",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/validations",
    under: "Validation",
    icon: (
      <Icon
        as={FaCreativeCommonsBy}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: Validation,
  },
  {
    moduleId: "admin_settings",
    name: "Table Fields",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/table-field",
    under: "tableField",
    icon: <Icon as={FaWpforms} width="20px" height="20px" color="inherit" />,
    component: TableField,
  },
  // // ------------- Text message Routes ------------------------
  {
    moduleId: "reports",
    name: "Reports",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/reporting-analytics",
    icon: (
      <Icon
        as={MdInsertChartOutlined}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: Report,
  },
  {
    moduleId: "reports",
    name: "Team Details",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/reporting-analytics/team-details/:id",
    parent: "Reports",
    under: "Reports",
    component: TeamDetailsScreen,
  },
  {
    moduleId: "system_log",
    name: "System Log",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/system-log",
    icon: (
      <Icon
        as={MdOutlineLaptopMac}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: SystemLog,
  },

  // ------------- user Routes ------------------------
  {
    moduleId: "users",
    name: "Users",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/users",
    under: "user",
    icon: <Icon as={HiUsers} width="20px" height="20px" color="inherit" />,
    component: User,
  },
  {
    moduleId: "users",
    name: "Users",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/admin-setting/users",
    under: "user",
    icon: <Icon as={HiUsers} width="20px" height="20px" color="inherit" />,
    // component: User,
    component: UserV2,
  },
  {
    name: "User View",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    parentName: "Email",
    under: "user",
    path: "/users/:id",
    component: UserView,
  },
  {
    name: "User View",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    parentName: "Email",
    under: "user",
    path: "/users/edit/:id",
    component: EditUser,
  },

  // ------------- user v2 Routes ------------------------
  {
    moduleId: "users",
    name: "Users V2",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/users-v2",
    under: "user",
    icon: <Icon as={HiUsers} width="20px" height="20px" color="inherit" />,
    component: UserV2,
  },
  {
    // moduleId: 'users',
    name: "Users V2",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/users-v2/:id",
    under: "user",
    icon: <Icon as={HiUsers} width="20px" height="20px" color="inherit" />,
    component: UserProfileDetails,
  },
  {
    // moduleId: 'users',
    name: "User Permissions",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/users-v2/permissions/:id",
    under: "user",
    icon: <Icon as={HiUsers} width="20px" height="20px" color="inherit" />,
    component: UserPermissions,
  },

  {
    moduleId: "admin_settings",
    name: "Whatsapp Settings",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/admin-setting/whatsapp/settings",
    under: "/admin-setting",
    component: WhatsappSettings,
  },
  {
    moduleId: "admin_settings",
    name: "Lead Settings",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/lead-settings",
    under: "lead-settings",
    component: LeadSetting,
  },
  {
    moduleId: "admin_settings",
    name: "Agencies",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/agencies",
    under: "agencies",
    component: Agency,
  },
  {
    moduleId: "admin_settings",
    name: "Office Settings",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/office-settings/:id",
    under: "office-settings",
    component: OfficeSettings,
  },
  {
    name: "Configuration",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/admin-setting/configuration",
    component: Configuration,
  },
  // ========================== auth layout ==========================
  {
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignInCentered,
  },
];

export default routes;
