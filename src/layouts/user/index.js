import React, { Suspense, useEffect, useState } from 'react';

import { Portal, Box, useDisclosure, Flex, Icon } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ROLE_PATH } from '../../roles';
import configRoutes from 'routes.js';
import { MdPeopleOutline } from 'react-icons/md';
import { FaRegCalendarCheck, FaWhatsapp } from 'react-icons/fa';

import { useFetchItemsQuery } from 'api/apiSlice';
import useUserSession from 'hooks/useUserSession';
import { usePermissions } from 'hooks/usePermissions';

import Spinner from 'components/spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { fetchImage } from '../../redux/imageSlice';
import TakeSurvey from 'views/admin/survey/TakeSurvey';
import UserWhatsapp from 'views/admin/whatsapp/UserWhatsapp';

const LeadPoolAgent = React.lazy(() => import('views/admin/leadPool-v2'));

const AttendanceDashboard = React.lazy(
	() => import('views/admin/attendance/components/dashboard')
);

export default function User(props) {
	const { ...rest } = props;
	// states and functions
	const [fixed] = useState(false);
	const [toggleSidebar, setToggleSidebar] = useState(false);
	const [openSidebar, setOpenSidebar] = useState(true);
	// const user = JSON.parse(localStorage.getItem('user'));
	// console.log({ user });

	const { user, isSuperAdmin, userRoleName } = useUserSession();
	const { hasPermission } = usePermissions();

	const { data: whatsappUser } = useFetchItemsQuery(
		{
			path: `whatsapp/users/${user?._id}`,
		},
		{
			skip: !user?._id || isSuperAdmin,
		}
	);

	const whatsappActive = whatsappUser?.doc?.isActive;

	const getRoute = () => {
		return window.location.pathname !== '/admin/full-screen-maps';
	};

	let routes = [
		...configRoutes,
		// {
		// 	moduleId: 'leadpool_agents',
		// 	name: 'Leads Pool',
		// 	layout: [ROLE_PATH.user],
		// 	path: '/pool',
		// 	icon: (
		// 		<Icon as={MdPeopleOutline} width='20px' height='20px' color='inherit' />
		// 	),
		// 	component: LeadPoolAgent,
		// },
		{
			moduleId: 'survey',
			name: 'Take Survey',
			layout: [ROLE_PATH.user],
			path: '/survey/take-survey/:id',
			under: 'Survey',
			parentName: 'Survey',
			component: TakeSurvey,
		},
	];

	// insert "Lead Pool" at index 3 (after Leads)
	// routes.splice(3, 0, {
	// 	name: 'Leads Pool',
	// 	layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	path: '/pool',
	// 	icon: (
	// 		<Icon as={MdPeopleOutline} width='20px' height='20px' color='inherit' />
	// 	),
	// 	component: LeadPoolAgent,
	// 	moduleId: 'leadpool_agents',
	// });

	if (userRoleName === 'Attendance') {
		// Define the "Candidates" route
		const filterRoutes = routes.filter(
			(route) => route.moduleId !== 'attendance'
		);

		const attendanceRoutes = [
			{
				moduleId: 'attendance',
				name: 'Attendance',
				layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
				path: '/attendance/dashboard',
				icon: (
					<Icon
						as={FaRegCalendarCheck}
						width='20px'
						height='20px'
						color='inherit'
					/>
				),
				component: AttendanceDashboard,
			},
		];

		routes = [...filterRoutes, ...attendanceRoutes];
	}

	// if user has whatsapp and also enable then show it
	if (whatsappActive) {
		routes.push({
			moduleId: 'whatsapp',
			name: 'Whatsapp',
			layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
			path: '/whatsapp/chat',
			icon: <Icon as={FaWhatsapp} width='20px' height='20px' color='inherit' />,
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
			(route) => route.layout !== '/auth' || route.under !== 'users'
		)[0]?.path || '/default';

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
						routes={finalRoutes}
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
									logoText={'Weeam CRM'}
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

											<Route
												path='/*'
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
