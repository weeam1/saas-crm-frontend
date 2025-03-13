import { Portal, Box, useDisclosure, Flex, Icon } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import React, { Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ROLE_PATH } from '../../roles';
import newRoute from 'routes.js';
import {
	MdCampaign,
	MdHome,
	MdInsertChartOutlined,
	MdLeaderboard,
	MdLock,
	MdPeopleOutline,
} from 'react-icons/md';
import { FaUserCircle, FaDollarSign } from 'react-icons/fa';
import Spinner from 'components/spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { fetchImage } from '../../redux/imageSlice';
import { HiUsers } from 'react-icons/hi';
import Report from 'views/admin/reports';
import DailyReport from 'views/admin/dailyReport';
import Announcements from 'views/admin/announcement';
import Hiring from 'views/admin/hiring';
import { FaClipboardUser } from 'react-icons/fa6';
import ShortListedCandidates from 'views/admin/hiring/shortListedCandidates';
import Candidates from 'views/admin/hiring/candidates';
import InterviewScreen from 'views/admin/hiring/interview/InterviewScreen';
import InterviewedCandidates from 'views/admin/hiring/interviewedCandidates';
import OfferLetter from 'views/admin/hiring/interviewedCandidates/OfferLetter';

const MainDashboard = React.lazy(() => import('views/admin/default'));
const SignInCentered = React.lazy(() => import('views/auth/signIn'));
const UserPage = React.lazy(() => import('views/admin/users'));
// const LeadPool = React.lazy(() => import('views/admin/leadpool'));
const LeadPoolAgent = React.lazy(() => import('views/admin/leadPool-v2'));
const HRModule = React.lazy(() => import('views/admin/hrModule'));
const Lead = React.lazy(() => import('views/admin/lead'));
const LeadScreen = React.lazy(() => import('views/admin/lead-v2'));
const CurrencyPoints = React.lazy(() => import('views/admin/currencypoints'));

export default function User(props) {
	const { ...rest } = props;
	// states and functions
	const [fixed] = useState(false);
	const [toggleSidebar, setToggleSidebar] = useState(false);
	const [openSidebar, setOpenSidebar] = useState(true);
	const user = JSON.parse(localStorage.getItem('user'));
	// functions for changing the states from components
	const getRoute = () => {
		return window.location.pathname !== '/admin/full-screen-maps';
	};

	const filterAccess = (rolesData) => {
		return rolesData?.map((role) => {
			role.access = role?.access?.filter(
				(access) =>
					access.create || access.update || access.delete || access.view
			);
			return role;
		});
	};

	// Example usage:
	const updatedRolesData = filterAccess(user?.roles);
	let access = [];
	updatedRolesData?.map((item) => {
		item?.access?.map((data) => access.push(data));
	});

	let mergedPermissions = {};

	access.forEach((permission) => {
		const { title, ...rest } = permission;

		if (!mergedPermissions[title]) {
			mergedPermissions[title] = { ...rest };
		} else {
			// Merge with priority to true values
			Object.keys(rest).forEach((key) => {
				if (mergedPermissions[title][key] !== true) {
					mergedPermissions[title][key] = rest[key];
				}
			});
		}
	});

	let routes = [
		{
			name: 'Dashboard',
			layout: [ROLE_PATH.user],
			path: '/default',
			icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
			component: MainDashboard,
		},
		// {
		// 	name: 'Lead',
		// 	layout: [ROLE_PATH.user],
		// 	path: '/lead',
		// 	icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
		// 	component: Lead,
		// },
		{
			name: 'Lead',
			layout: [ROLE_PATH.user],
			path: '/lead',
			icon: (
				<Icon as={MdLeaderboard} width='20px' height='20px' color='inherit' />
			),
			component: LeadScreen,
		},
		{
			name: 'HR Module',
			layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
			path: '/hrmodule',
			icon: (
				<Icon as={FaUserCircle} width='20px' height='20px' color='inherit' />
			),
			component: HRModule,
		},
		{
			name: 'Leads Pool',
			layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
			path: '/pool',
			icon: (
				<Icon as={MdPeopleOutline} width='20px' height='20px' color='inherit' />
			),
			component: LeadPoolAgent,
		},
		{
			name: 'Sign In',
			layout: '/auth',
			path: '/sign-in',
			icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
			component: SignInCentered,
		},
		{
			name: 'Points',
			layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
			path: '/points',
			icon: (
				<Icon as={FaDollarSign} width='20px' height='20px' color='inherit' />
			),
			component: CurrencyPoints,
		},
	];

	if (user?.roles[0]?.roleName === 'Manager') {
		routes.push({
			name: 'Users',
			layout: [ROLE_PATH.user],
			path: '/user',
			icon: <Icon as={HiUsers} width='20px' height='20px' color='inherit' />,
			component: UserPage,
		});
		// Remove the "Leads Pool" route
		routes = routes.filter((route) => route.name !== 'Leads Pool');
	}

	if (user?.roles[0]?.roleName === 'HR') {
		// Define the "Candidates" route
		const hiringRoutes = [
			{
				name: 'Hiring',
				layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
				path: '/hiring',
				icon: (
					<Icon
						as={FaClipboardUser}
						width='20px'
						height='20px'
						color='inherit'
					/>
				),
				component: Hiring,
			},
		];

		// 	// Only show the "Hiring" route for HR role
		routes = hiringRoutes;
	}

	const accessRoute = newRoute?.filter((item) =>
		Object.keys(mergedPermissions)?.find(
			(data) =>
				data?.toLowerCase() === item?.name?.toLowerCase() ||
				data?.toLowerCase() === item.parentName?.toLowerCase()
		)
	);

	routes.push(...accessRoute);

	// if (user?.roles[0]?.roleName === 'Manager') {
	// 	routes.push(
	// 		...[
	// 			{
	// 				name: 'Hiring',
	// 				path: '/hiring',
	// 				layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 				icon: (
	// 					<Icon
	// 						as={FaClipboardUser}
	// 						width='20px'
	// 						height='20px'
	// 						color='inherit'
	// 					/>
	// 				),
	// 				component: Hiring,
	// 			},
	// 			{
	// 				name: 'Short Listed',
	// 				layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 				path: '/hiring/short-listed',
	// 				under: 'shortListed',
	// 				parentName: 'Hiring',
	// 				component: ShortListedCandidates,
	// 			},
	// 			{
	// 				name: 'Interview',
	// 				layout: [ROLE_PATH.user, ROLE_PATH.superAdmin],
	// 				path: '/hiring/interview/:interviewId',
	// 				under: 'interview',
	// 				parentName: 'Hiring',
	// 				component: InterviewScreen,
	// 			},
	// 			{
	// 				name: 'Announcement',
	// 				layout: [ROLE_PATH.user, ROLE_PATH.superAdmin],
	// 				path: '/announcements',
	// 				icon: (
	// 					<Icon as={MdCampaign} width='20px' height='20px' color='inherit' />
	// 				),
	// 				component: Announcements,
	// 			},

	// 			{
	// 				name: 'Daily Report',
	// 				layout: [ROLE_PATH.user, ROLE_PATH.superAdmin],
	// 				path: '/daily-report',
	// 				icon: (
	// 					<Icon
	// 						as={MdInsertChartOutlined}
	// 						width='20px'
	// 						height='20px'
	// 						color='inherit'
	// 					/>
	// 				),
	// 				component: DailyReport,
	// 			},
	// 			{
	// 				name: 'Reporting and Analytics',
	// 				layout: [ROLE_PATH.user],
	// 				path: '/reporting-analytics',
	// 				icon: (
	// 					<Icon
	// 						as={MdInsertChartOutlined}
	// 						width='20px'
	// 						height='20px'
	// 						color='inherit'
	// 					/>
	// 				),
	// 				component: Report,
	// 			},
	// 		]
	// 	);
	// }

	if (user?.roles[0]?.roleName === 'Manager') {
		// Define the new routes to be inserted
		const newRoutes = [
			{
				name: 'Announcement',
				layout: [ROLE_PATH.user, ROLE_PATH.superAdmin],
				path: '/announcements',
				icon: (
					<Icon as={MdCampaign} width='20px' height='20px' color='inherit' />
				),
				component: Announcements,
			},
			{
				name: 'Hiring',
				path: '/hiring',
				layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
				icon: (
					<Icon
						as={FaClipboardUser}
						width='20px'
						height='20px'
						color='inherit'
					/>
				),
				component: Hiring,
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
				layout: [ROLE_PATH.user, ROLE_PATH.superAdmin],
				path: '/hiring/interview/:interviewId',
				under: 'interview',
				parentName: 'Hiring',
				component: InterviewScreen,
			},
		];

		// Insert the new routes at index 3 and 4
		routes.splice(3, 0, ...newRoutes);

		// Add other routes (e.g., Daily Report, Reporting and Analytics)
		routes.push(
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
				layout: [ROLE_PATH.user],
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
			}
		);
	}

	const getActiveRoute = (routes) => {
		if (!Array.isArray(routes)) {
			// Ensure routes is an array
			return '';
		}

		let activeRoute = '';
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
					window.location.href.indexOf(routes[i].path.replace('/:id', '')) !==
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
					window.location.href.indexOf(routes[i].path.replace('/:id', '')) !==
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
			if (!prop.under && prop.layout !== '/auth') {
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

	document.documentElement.dir = 'ltr';
	const { onOpen } = useDisclosure();
	document.documentElement.dir = 'ltr';

	const dispatch = useDispatch();

	useEffect(() => {
		// Dispatch the fetchRoles action on component mount
		dispatch(fetchImage());
	}, [dispatch]);

	const largeLogo = useSelector((state) =>
		state?.images?.image?.filter((item) => item.isActive === true)
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
						routes={routes}
						display='none'
						{...rest}
						openSidebar={openSidebar}
						setOpenSidebar={setOpenSidebar}
					/>
					<Box
						float='right'
						minHeight='100vh'
						height='100%'
						overflow='auto'
						position='relative'
						maxHeight='100%'
						// w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
						w={{
							base: '100%',
							xl:
								openSidebar === true
									? 'calc( 100% - 240px )'
									: 'calc( 100% - 88px )',
						}}
						maxWidth={{
							base: '100%',
							xl:
								openSidebar === true
									? 'calc( 100% - 240px )'
									: 'calc( 100% - 88px )',
						}}
						transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
						transitionDuration='.2s, .2s, .35s'
						transitionProperty='top, bottom, width'
						transitionTimingFunction='linear, linear, ease'
					>
						<Portal>
							<Box className='header'>
								<Navbar
									onOpen={onOpen}
									logoText={'Horizon UI Dashboard PRO'}
									brandText={getActiveRoute(routes)}
									secondary={getActiveNavbar(routes)}
									message={getActiveNavbarText(routes)}
									fixed={fixed}
									routes={routes}
									under={under(routes)}
									largeLogo={largeLogo}
									openSidebar={openSidebar}
									setOpenSidebar={setOpenSidebar}
									{...rest}
								/>
							</Box>
						</Portal>
						<Box pt={{ base: '150px', md: '95px', xl: '95px' }}>
							{getRoute() ? (
								<Box
									mx='auto'
									pe='20px'
									minH='84vh'
									pt='50px'
									style={{
										padding: openSidebar ? '8px 20px 8px 20px' : '8px 20px',
									}}
								>
									<Suspense
										fallback={
											<Flex
												justifyContent={'center'}
												alignItems={'center'}
												width='100%'
											>
												<Spinner />
											</Flex>
										}
									>
										<Routes>
											{getRoutes(routes)}

											{user?.roles[0]?.roleName === 'HR' ? (
												<>
													<Route
														path='/*'
														element={<Navigate to='/hiring' />}
													/>
													<Route path='hiring'>
														<Route path='candidates' element={<Candidates />} />
														<Route
															path='interview-candidates'
															element={<interviewCandidates />}
														/>
														<Route
															path='short-listed'
															element={<ShortListedCandidates />}
														/>
														<Route
															path='interview/:interviewId'
															element={<InterviewScreen />}
														/>
														<Route
															path='interviewed-candidates'
															element={<InterviewedCandidates />}
														/>
														<Route
															path='interviewed-candidates/offer-letter/:id'
															element={<OfferLetter />}
														/>
													</Route>
												</>
											) : (
												<Route path='/*' element={<Navigate to='/default' />} />
											)}
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
