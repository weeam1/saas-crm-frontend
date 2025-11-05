// Chakra imports
import { Portal, Box, useDisclosure, Flex } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import Spinner from 'components/spinner/Spinner';
import { SidebarContext } from 'contexts/SidebarContext';
import { Suspense, useCallback, useEffect } from 'react';
import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ROLE_PATH } from '../../roles';
import routes from 'routes.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchImage } from '../../redux/imageSlice';
import { usePermissions } from 'hooks/usePermissions';
import AppSidebar from 'components/sidebar/AppSidebar';
import sidebarRoutes from 'sidebarRoutes';
import WeeamLoadingPage from 'components/welcome/WeeamLoadingPage';

// Custom Chakra theme
export default function Dashboard(props) {
	const { ...rest } = props;
	// states and functions
	const [fixed] = useState(false);
	const [toggleSidebar, setToggleSidebar] = useState(false);
	const [openSidebar, setOpenSidebar] = useState(false);
	const user = JSON.parse(localStorage.getItem('user'));

	const { hasPermission } = usePermissions();

	// if (hasPermission('whatsapp')) {
	//   const whatsappSidebarRoutes = appSidebarRoutes.find(
	//     (r) => r.moduleId === 'whatsapp'
	//   );

	//   if (!whatsappSidebarRoutes) return null;

	//   const existingChildren = whatsappSidebarRoutes.children || [];
	//   const newChildren = [];

	//   // Add Chat child if active + not already exists + user lacks the full permission
	//   // !hasPermission('whatsapp', 'whatsapp_chats') &&
	//   if (
	//     !hasPermission('whatsapp', 'whatsapp_chats') &&
	//     whatsappActive &&
	//     !existingChildren.some((c) => c.path === '/whatsapp/chat')
	//   ) {
	//     newChildren.push({
	//       name: 'Meta Whatsapp',
	//       path: '/whatsapp/chat',
	//     });
	//   }

	//   // Add Instance child if active + not already exists + user lacks full instance permission
	//   if (
	//     instanceActive &&
	//     !hasPermission('whatsapp', 'whatsapp_beta') &&
	//     !existingChildren.some((c) => c.path === '/whatsapp/instance')
	//   ) {
	//     newChildren.push({
	//       name: 'Whatsapp',
	//       version: 'Beta',
	//       path: '/whatsapp/instance',
	//     });
	//   }

	//   // Only merge once if new children exist
	//   if (newChildren.length > 0) {
	//     sessionStorage.setItem('isWhatsappUser', true);

	//     whatsappSidebarRoutes.children = [...existingChildren, ...newChildren];

	//     // Remove Chat route if WhatsApp is NOT active
	//     // if (whatsappActive === false) {
	//     // 	appRoutes = appRoutes.filter((r) => r.path !== '/whatsapp/chat');
	//     // }

	//     // // Remove Instance route if Instance is NOT active
	//     // if (instanceActive === false) {
	//     // 	appRoutes = appRoutes.filter((r) => r.path !== '/whatsapp/instance');
	//     // }

	//     // Add corresponding app routes
	//     // if (!whatsappActive) {
	//     // 	appRoutes.push({
	//     // 		name: 'Chat',
	//     // 		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	//     // 		path: `/whatsapp/chat`,
	//     // 		component: UserWhatsappChat,
	//     // 	});
	//     // }

	//     // if (!instanceActive) {
	//     // 	appRoutes.push({
	//     // 		name: 'Instance',
	//     // 		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	//     // 		path: `/whatsapp/instance`,
	//     // 		component: UserWhatsappInstance,
	//     // 	});
	//     // }
	//   }

	//   // else if (!isWhatsappUser) {
	//   // 	sessionStorage.setItem('isWhatsappUser', false);

	//   // 	// remove any old whatsapp routes if permission disabled
	//   // 	appRoutes = appRoutes.filter((r) => r.moduleId !== 'whatsapp');
	//   // 	appSidebarRoutes = appSidebarRoutes.filter(
	//   // 		(r) => r.moduleId !== 'whatsapp'
	//   // 	);
	//   // }
	// }

	// filter the only allowed routes (modules)
	const finalRoutes = routes?.filter((route) => {
		if (!route.moduleId) return true;
		return hasPermission(route.moduleId);
	});

	const defaultRoute =
		finalRoutes.filter(
			(route) => route.layout !== '/auth' || route.under !== 'users'
		)[0]?.path || '/default';

	// functions for changing the states from components
	const getRoute = () => {
		return window.location.pathname !== '/admin/full-screen-maps';
	};
	const getActiveRoute = (routes) => {
		let activeRoute = 'Prolink';
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
					return routes[i].name;
				}
			}
		}
		return activeRoute;
	};

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchImage());
	}, [dispatch]);

	const largeLogo = useSelector((state) =>
		state?.images?.image?.filter((item) => item.isActive === true)
	);

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

	const getRoutes = (routes) => {
		return routes.map((prop, key) => {
			// if (!prop.under && prop.layout === '/superAdmin') {
			if (!prop.under && prop.layout?.includes(ROLE_PATH.superAdmin)) {
				return (
					<Route path={prop.path} element={<prop.component />} key={key} />
				);
			} else if (prop.under) {
				return (
					<Route path={prop.path} element={<prop.component />} key={key} />
				);
			}
			if (prop.collapse) {
				return getRoutes(prop.items);
			}
			if (prop.category) {
				return getRoutes(prop.items);
			} else {
				return null;
			}
		});
	};
	document.documentElement.dir = 'ltr';
	const { onOpen } = useDisclosure();
	document.documentElement.dir = 'ltr';

	const filterRoute = useCallback((r) => {
		if (r.moduleId === 'system_log') return true;
		return true;
	}, []);

	return (
		<Box>
			<Box>
				<SidebarContext.Provider
					value={{
						toggleSidebar,
						setToggleSidebar,
					}}
				>
					{/* <Sidebar
						routes={finalRoutes}
						largeLogo={largeLogo}
						display='none'
						{...rest}
						openSidebar={openSidebar}
						setOpenSidebar={setOpenSidebar}
					/> */}

					<AppSidebar
						routes={sidebarRoutes}
						brandName='Weeam CRM'
						filterRoute={filterRoute}
						isMobileOpen={openSidebar}
						onMobileOpenChange={setOpenSidebar}
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
									? 'calc( 100% - 260px )'
									: 'calc( 100% - 88px )',
						}}
						maxWidth={{
							base: '100%',
							xl:
								openSidebar === true
									? 'calc( 100% - 260px )'
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
									routes={finalRoutes}
									logoText={'CRM Dashboard'}
									brandText={getActiveRoute(finalRoutes)}
									secondary={getActiveNavbar(finalRoutes)}
									message={getActiveNavbarText(finalRoutes)}
									fixed={fixed}
									under={under(finalRoutes)}
									largeLogo={largeLogo}
									openSidebar={openSidebar}
									setOpenSidebar={setOpenSidebar}
									{...rest}
								/>
							</Box>
						</Portal>
						<Box pt={{ base: '120px', md: '95px', xl: '95px' }}>
							{getRoute() ? (
								<Box
									mx='auto'
									pe='20px'
									minH='84vh'
									pt='50px'
									style={{
										padding: openSidebar ? '8px 20px 8px 0px' : '8px 20px',
									}}
								>
									<Suspense
										fallback={
											<Flex
												justifyContent={'center'}
												alignItems={'center'}
												width='100%'
											>
												<Spinner color={'brand.500'} size={'md'} />
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
