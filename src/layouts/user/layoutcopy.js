import React, { Suspense, useEffect, useState } from "react";

import { Portal, Box, useDisclosure, Flex, Icon } from "@chakra-ui/react";
import Footer from "components/footer/FooterAdmin.js";
import Navbar from "components/navbar/NavbarAdmin.js";
import Sidebar from "components/sidebar/Sidebar.js";
import { SidebarContext } from "contexts/SidebarContext";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROLE_PATH } from "../../roles";
import configRoutes from "routes.js";
import {
  MdCampaign,
  MdHome,
  MdInsertChartOutlined,
  MdLeaderboard,
  MdLock,
  MdPeopleOutline,
} from "react-icons/md";
import {
  FaUserCircle,
  FaDollarSign,
  FaRegCalendarCheck,
  FaRegCopy,
  FaList,
  FaWhatsapp,
  FaTasks,
  FaHandshake,
} from "react-icons/fa";

import Spinner from "components/spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchImage } from "../../redux/imageSlice";
import { HiOutlineDocumentReport, HiUsers } from "react-icons/hi";
import Report from "views/admin/reports";
import DailyReport from "views/admin/dailyReport";
import Announcements from "views/admin/announcement";
import Hiring from "views/admin/hiring";
import { FaClipboardUser, FaSquarePlus } from "react-icons/fa6";
import ShortListedCandidates from "views/admin/hiring/shortListedCandidates";
import Candidates from "views/admin/hiring/candidates";
import InterviewScreen from "views/admin/hiring/interview/InterviewScreen";
import InterviewedCandidates from "views/admin/hiring/interviewedCandidates";
import OfferLetter from "views/admin/hiring/interviewedCandidates/OfferLetter";
import OfficeSettings from "views/admin/agencies/OfficeSetting";
import Expenses from "views/admin/expenses";
import AddListing from "views/admin/Listing/Component/AddListing";
import ViewListing from "views/admin/Listing/Component/ViewLisitng";
import UpdateListing from "views/admin/Listing/Component/UpdateListing";
import SettingPage from "views/admin/Listing/Component/settings/index";
import OfferView from "views/admin/hiring/interviewedCandidates/OfferView";
import TakeSurvey from "views/admin/survey/TakeSurvey";
import LeaderBoard from "views/admin/survey/LeaderBoard";
import UserWhatsapp from "views/admin/whatsapp/UserWhatsapp";
import { useFetchItemsQuery } from "api/apiSlice";
import useUserSession from "hooks/useUserSession";

import { usePermissions } from "hooks/usePermissions";

const TaskV2 = React.lazy(() => import("views/admin/taskV2"));
const MainDashboard = React.lazy(() => import("views/admin/default"));
const SignInCentered = React.lazy(() => import("views/auth/signIn"));
const UserPage = React.lazy(() => import("views/admin/users"));
// const LeadPool = React.lazy(() => import('views/admin/leadpool'));
const LeadPoolAgent = React.lazy(() => import("views/admin/leadPool-v2"));
const HRModule = React.lazy(() => import("views/admin/hrModule"));
// const Lead = React.lazy(() => import('views/admin/lead'));
const LeadScreen = React.lazy(() => import("views/admin/lead-v2"));

const LeadPoolVersion2 = React.lazy(() => import("views/admin/leadPool-v2"));
const CurrencyPoints = React.lazy(() => import("views/admin/currencypoints"));

const Attendance = React.lazy(() => import("views/admin/attendance"));
const AttendenceV2 = React.lazy(
  () => import("views/admin/attendance/AttendenceV2"),
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
const AttendanceDashboard = React.lazy(
  () => import("views/admin/attendance/components/dashboard"),
);

const UserView = React.lazy(() => import("views/admin/users/View"));

const InvoiceModule = React.lazy(() => import("views/admin/invoice"));
const BankAccounts = React.lazy(() => import("views/admin/bankAccountsV2"));
const SingleInvoice = React.lazy(() => import("views/admin/invoice/View"));
const AddEntry = React.lazy(() => import("views/admin/invoice/AddEntry"));
const InvoiceDevelopers = React.lazy(
  () => import("views/admin/invoice/developers"),
);

const DeveloperInvoices = React.lazy(
  () => import("views/admin/invoice/developers/DeveloperInvoices"),
);
const Listing = React.lazy(() => import("views/admin/Listing"));
const Survey = React.lazy(() => import("views/admin/survey"));
const DealsScreen = React.lazy(() => import("views/admin/deals"));

export default function User(props) {
  const { ...rest } = props;
  // states and functions
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(true);
  // const user = JSON.parse(localStorage.getItem('user'));
  // console.log({ user });

  const { user, isSuperAdmin, userRoleName, agencyName } = useUserSession();
  const { hasPermission } = usePermissions();

  const { data: whatsappUser } = useFetchItemsQuery(
    {
      path: `whatsapp/users/${user?._id}`,
    },
    {
      skip: !user?._id || isSuperAdmin,
    },
  );

  const whatsappActive = whatsappUser?.doc?.isActive;

  const getRoute = () => {
    return window.location.pathname !== "/admin/full-screen-maps";
  };

  // const filterAccess = (rolesData) => {
  // 	return rolesData?.map((role) => {
  // 		role.access = role?.access?.filter(
  // 			(access) =>
  // 				access.create || access.update || access.delete || access.view
  // 		);
  // 		return role;
  // 	});
  // };
  // const filterAccess = (rolesData = []) => {
  // 	return rolesData.map((role) => ({
  // 		...role,
  // 		access:
  // 			role?.access?.filter(
  // 				(a) => a.create || a.update || a.delete || a.view
  // 			) || [],
  // 	}));
  // };

  // Example usage:
  // const updatedRolesData = filterAccess(user?.roles);
  // let access = [];
  // updatedRolesData?.map((item) =>
  // 	item?.access?.map((data) => access.push(data))
  // );

  // let mergedPermissions = {};

  // access?.forEach((permission) => {
  // 	const { title, ...rest } = permission;

  // 	if (!mergedPermissions[title]) {
  // 		mergedPermissions[title] = { ...rest };
  // 	} else {
  // 		// Merge with priority to true values
  // 		Object.keys(rest).forEach((key) => {
  // 			if (mergedPermissions[title][key] !== true) {
  // 				mergedPermissions[title][key] = rest[key];
  // 			}
  // 		});
  // 	}
  // });

  let routes = [
    ...configRoutes,
    {
      moduleId: "survey",
      name: "Take Survey",
      layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
      path: "/survey/take-survey/:id",
      under: "Survey",
      parentName: "Survey",
      component: TakeSurvey,
    },
  ];

  // insert "Lead Pool" at index 3 (after Leads)
  routes.splice(3, 0, {
    name: "Leads Pool",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/pool",
    icon: (
      <Icon as={MdPeopleOutline} width="20px" height="20px" color="inherit" />
    ),
    component: LeadPoolAgent,
    moduleId: "leadpool_agents",
  });

  // if (userRoleName === 'Manager') {
  // 	routes.push();
  // 	// Remove the "Leads Pool" route
  // }

  // if (userRoleName === 'Manager') {
  // 	// Define the new routes to be inserted
  // 	const newRoutes = [];
  // 	// Insert the new routes at index 3 and 4
  // 	// routes = routes.filter((route) => route.name !== 'Leads Pool');
  // 	routes.splice(3, 0, ...newRoutes);
  // }

  // if (userRoleName === 'Manager') {
  // 	routes.push({
  // 		name: 'Adding Listing',
  // 		layout: [ROLE_PATH.user],
  // 		path: '/listing/add-listing',
  // 		under: 'listing',
  // 		parentName: 'Listing',
  // 		component: AddListing,
  // 	});
  // 	// Remove the "Adding Listing" route
  // 	routes = routes.filter((route) => route.name !== 'Adding Listing');
  // }
  // if (userRoleName === 'Manager') {
  // 	routes.push({
  // 		name: 'Update Listing',
  // 		layout: [ROLE_PATH.user],
  // 		path: '/listing/update/:id',
  // 		under: 'listing',
  // 		parentName: 'Listing',
  // 		component: UpdateListing,
  // 	});
  // 	// Remove the "Updating Listing" route
  // 	routes = routes.filter((route) => route.name !== 'Update Listing');
  // }

  // if (userRoleName === 'HR') {
  // 	// Define the "Candidates" route
  // 	const hiringRoutes = [
  // 		{
  // 			moduleId: 'attendance',
  // 			name: 'Attendance',
  // 			layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
  // 			path: '/attendance',
  // 			icon: (
  // 				<Icon
  // 					as={FaRegCalendarCheck}
  // 					width='20px'
  // 					height='20px'
  // 					color='inherit'
  // 				/>
  // 			),
  // 			component: Attendance,
  // 		},
  // 	];

  // 	// 	// Only show the "Hiring" route for HR role
  // 	routes = [...routes, ...hiringRoutes];
  // }

  // if (userRoleName === 'Developer') {
  // 	const developerRoutes = [
  // 		{
  // 			moduleId: 'attendance',
  // 			name: 'Attendance',
  // 			layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
  // 			path: '/attendance',
  // 			icon: (
  // 				<Icon
  // 					as={FaRegCalendarCheck}
  // 					width='20px'
  // 					height='20px'
  // 					color='inherit'
  // 				/>
  // 			),
  // 			component: MyAttendance,
  // 		},
  // 	];

  // 	routes = [...routes, ...developerRoutes];
  // }

  if (userRoleName === "Attendance") {
    // Define the "Candidates" route
    const filterRoutes = routes.filter(
      (route) => route.moduleId !== "attendance",
    );

    const attendanceRoutes = [
      {
        moduleId: "attendance",
        name: "Attendance",
        layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
        path: "/attendance/dashboard",
        icon: (
          <Icon
            as={FaRegCalendarCheck}
            width="20px"
            height="20px"
            color="inherit"
          />
        ),
        component: AttendanceDashboard,
      },
    ];

    routes = [...filterRoutes, ...attendanceRoutes];
  }

  // if (userRoleName === 'accountant') {
  // 	const accountantRoutes = [
  // 		// ------------- Invoice Module Routes ------------------------ //
  // 	];

  // 	routes = accountantRoutes;
  // }

  // if user has whatsapp and also enable then show it
  if (whatsappActive) {
    routes.push({
      moduleId: "whatsapp",
      name: "Whatsapp",
      layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
      path: "/whatsapp/chat",
      icon: <Icon as={FaWhatsapp} width="20px" height="20px" color="inherit" />,
      component: UserWhatsapp,
    });
  }

  // filter the only allowed routes (modules)
  const finalRoutes = routes?.filter((route) => {
    if (!route.moduleId) return true;
    return hasPermission(route.moduleId);
  });

  console.log({ initialRoutes: routes, finalRoutes });

  const defaultRoute =
    finalRoutes.filter(
      (route) => route.layout !== "/auth" || route.under !== "users",
    )[0]?.path || "/default";

  // const accessRoute = newRoute?.filter((item) =>
  // 	Object.keys(mergedPermissions)?.find(
  // 		(data) =>
  // 			data?.toLowerCase() === item?.name?.toLowerCase() ||
  // 			data?.toLowerCase() === item.parentName?.toLowerCase()
  // 	)
  // );

  // routes.push(...accessRoute);

  const getActiveRoute = (routes) => {
    if (!Array.isArray(routes)) {
      // Ensure routes is an array
      return "";
    }

    let activeRoute = "";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].items || []);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else if (routes[i].category) {
        let categoryActiveRoute = getActiveRoute(routes[i].items || []);
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute;
        }
      } else {
        if (
          routes[i].path && // Ensure path is defined
          window.location.href.indexOf(routes[i].path.replace("/:id", "")) !==
            -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };

  // const getActiveRoute = (routes) => {
  // 	let activeRoute = '';
  // 	for (let i = 0; i < routes.length; i++) {
  // 		if (routes[i].collapse) {
  // 			let collapseActiveRoute = getActiveRoute(routes[i].items);
  // 			if (collapseActiveRoute !== activeRoute) {
  // 				return collapseActiveRoute;
  // 			}
  // 		} else if (routes[i].category) {
  // 			let categoryActiveRoute = getActiveRoute(routes[i].items);
  // 			if (categoryActiveRoute !== activeRoute) {
  // 				return categoryActiveRoute;
  // 			}
  // 		} else {
  // 			if (
  // 				window.location.href.indexOf(routes[i].path.replace('/:id', '')) !==
  // 				-1
  // 			) {
  // 				return routes[i].name;
  // 			}
  // 		}
  // 	}
  // 	return activeRoute;
  // };
  const under = (routes) => {
    let activeRoute = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].items);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else if (routes[i].category) {
        let categoryActiveRoute = getActiveRoute(routes[i].items);
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].path.replace("/:id", "")) !==
          -1
        ) {
          return routes[i];
        }
      }
    }
    return activeRoute;
  };

  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveNavbar = getActiveNavbar(routes[i].items);
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar;
        }
      } else if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbar(routes[i].items);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (window.location.href.indexOf(routes[i].path) !== -1) {
          return routes[i].secondary;
        }
      }
    }
    return activeNavbar;
  };
  const getActiveNavbarText = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveNavbar = getActiveNavbarText(routes[i].items);
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar;
        }
      } else if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbarText(routes[i].items);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (window.location.href.indexOf(routes[i].path) !== -1) {
          return routes[i].messageNavbar;
        }
      }
    }
    return activeNavbar;
  };

  // const getRoutes = (routes) => {
  // 	return routes.map((prop, key) => {
  // 		// if (!prop.under && prop.layout === '/admin') {
  // 		if (!prop.under && prop.layout !== '/auth') {
  // 			return (
  // 				<Route path={prop.path} element={<prop.component />} key={key} />
  // 			);
  // 		} else if (prop.under) {
  // 			return (
  // 				<Route path={prop.path} element={<prop.component />} key={key} />
  // 			);
  // 		}
  // 		if (prop.collapse) {
  // 			return getRoutes(prop.items);
  // 		}
  // 		if (prop.category) {
  // 			return getRoutes(prop.items);
  // 		} else {
  // 			return null;
  // 		}
  // 	});
  // };
  const getRoutes = (routes) => {
    return routes.flatMap((prop, key) => {
      // Handle main routes that are not "under" and not part of authentication layout
      if (!prop.under && prop.layout !== "/auth") {
        return (
          <Route path={prop.path} element={<prop.component />} key={key} />
        );
      }

      // Handle routes with "under" property
      if (prop.under) {
        return (
          <Route path={prop.path} element={<prop.component />} key={key} />
        );
      }

      // Handle routes with "collapse" property recursively
      if (prop.collapse) {
        return getRoutes(prop.items);
      }

      // Handle routes with "category" property recursively
      if (prop.category) {
        return getRoutes(prop.items);
      }

      // Return empty array instead of `null` to avoid React rendering issues
      return [];
    });
  };

  document.documentElement.dir = "ltr";
  const { onOpen } = useDisclosure();
  document.documentElement.dir = "ltr";

  const dispatch = useDispatch();

  // useEffect(() => {
  //   // Dispatch the fetchRoles action on component mount
  //   dispatch(fetchImage());
  // }, [dispatch]);

  const largeLogo = useSelector((state) =>
    state?.images?.image?.filter((item) => item.isActive === true),
  );

  return (
    <Box>
      <Box>
        <SidebarContext.Provider
          value={{
            toggleSidebar,
            setToggleSidebar,
          }}
        >
          <Sidebar
            routes={finalRoutes}
            display="none"
            {...rest}
            openSidebar={openSidebar}
            setOpenSidebar={setOpenSidebar}
          />
          <Box
            float="right"
            minHeight="100vh"
            height="100%"
            overflow="auto"
            position="relative"
            maxHeight="100%"
            // w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
            w={{
              base: "100%",
              xl:
                openSidebar === true
                  ? "calc( 100% - 240px )"
                  : "calc( 100% - 88px )",
            }}
            maxWidth={{
              base: "100%",
              xl:
                openSidebar === true
                  ? "calc( 100% - 240px )"
                  : "calc( 100% - 88px )",
            }}
            transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
            transitionDuration=".2s, .2s, .35s"
            transitionProperty="top, bottom, width"
            transitionTimingFunction="linear, linear, ease"
          >
            <Portal>
              <Box className="header">
                <Navbar
                  onOpen={onOpen}
                  logoText={agencyName ? `${agencyName} CRM` : "Weam CRM"}
                  brandText={getActiveRoute(finalRoutes)}
                  secondary={getActiveNavbar(finalRoutes)}
                  message={getActiveNavbarText(finalRoutes)}
                  fixed={fixed}
                  routes={finalRoutes}
                  under={under(finalRoutes)}
                  largeLogo={largeLogo}
                  openSidebar={openSidebar}
                  setOpenSidebar={setOpenSidebar}
                  {...rest}
                />
              </Box>
            </Portal>
            <Box pt={{ base: "150px", md: "95px", xl: "95px" }}>
              {getRoute() ? (
                <Box
                  mx="auto"
                  pe="20px"
                  minH="84vh"
                  pt="50px"
                  style={{
                    padding: openSidebar ? "8px 20px 8px 20px" : "8px 20px",
                  }}
                >
                  <Suspense
                    fallback={
                      <Flex
                        justifyContent={"center"}
                        alignItems={"center"}
                        width="100%"
                      >
                        <Spinner />
                      </Flex>
                    }
                  >
                    <Routes>
                      {getRoutes(routes)}

                      <Route
                        path="/*"
                        element={<Navigate to={defaultRoute} />}
                      />
                    </Routes>
                  </Suspense>
                </Box>
              ) : null}
            </Box>
            <Box>
              <Footer />
            </Box>
          </Box>
        </SidebarContext.Provider>
      </Box>
    </Box>
  );
}

// {
// 	userRoleName === 'HR' ? (
// 		<>
// 			<Route path='/*' element={<Navigate to={defaultRoute} />} />
// 			{/* <Route path='hiring'>
// 												<Route path='candidates' element={<Candidates />} />
// 												<Route
// 													path='interview-candidates'
// 													element={<interviewCandidates />}
// 												/>
// 												<Route
// 													path='short-listed'
// 													element={<ShortListedCandidates />}
// 												/>
// 												<Route
// 													path='interview/:interviewId'
// 													element={<InterviewScreen />}
// 												/>
// 												<Route
// 													path='interviewed-candidates'
// 													element={<InterviewedCandidates />}
// 												/>
// 												<Route
// 													path='interviewed-candidates/offer-letter/:id'
// 													element={<OfferLetter />}
// 												/>
// 												<Route
// 													path='interviewed-candidates/offer-letter/veiw/:id'
// 													element={<OfferView />}
// 												/>
// 											</Route> */}
// 		</>
// 	) : userRoleName === 'Attendance' ? (
// 		<>
// 			<Route path='/*' element={<Navigate to='/attendance/dashboard' />} />
// 		</>
// 	) : userRoleName === 'Developer' ? (
// 		<>
// 			<Route path='/*' element={<Navigate to='/attendance' />} />
// 		</>
// 	) : (
// 		<Route path='/*' element={<Navigate to={defaultRoute} />} />
// 	);
// }
