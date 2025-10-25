import {
	Box,
	Flex,
	Icon,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';
import React, { Suspense, useCallback, useState, version } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FaRegCalendarCheck, FaWhatsapp } from 'react-icons/fa';

import { ROLE_PATH } from 'roles';
import Footer from 'components/footer/FooterAdmin';
import AppNavbar, { NAVBAR_HEIGHT } from 'components/navbar/AppNavbar';
import AppSidebar from 'components/sidebar/AppSidebar';

import routes from 'routes';
import sidebarRoutes from 'sidebarRoutes';
import Loader from 'components/loading/Loader';
import { useFetchItemsQuery } from 'api/apiSlice';
import useUserSession from 'hooks/useUserSession';
import { useDispatch } from 'react-redux';
import { usePermissions } from 'hooks/usePermissions';
import AttendanceDashboard from 'views/admin/attendance/components/dashboard';
import UserWhatsappInstance from 'views/admin/whatsapp-v2/UserWhatsapp';
import UserWhatsappChat from 'views/admin/whatsapp/UserWhatsapp';
import keys from 'config/keys';
import ServerErrorPage from 'views/admin/error/ServerErrorPage';
import AppLoader from 'components/loading/AppLoader';
import { filterRoutes } from 'components/sidebar/sidebarHelpers';

export default function DashboardLayout({ defaultRoute = '/default' }) {
	const [openSidebar, setOpenSidebar] = useState(false);

	let appRoutes = [...routes];
	let appSidebarRoutes = [...sidebarRoutes];

	const isWhatsappUser =
		JSON.parse(sessionStorage.getItem('isWhatsappUser')) || false;

	const { isOpen: mobileOpen, onOpen, onClose } = useDisclosure();
	const pageBg = useColorModeValue('whiteAlpa.100', 'gray.800');

	const { user, isSuperAdmin, userRoleName } = useUserSession();
	const { hasPermission } = usePermissions();

	// only check for other non super admin user's
	const { data: whatsappInstance } = useFetchItemsQuery(
		{
			path: `whatsapp/instances/user/${user?._id}`,
		},
		{
			skip: !user?._id || isSuperAdmin,
		}
	);

	// console.log({ whatsappUser });

	const {
		data: ServerStatus,
		error: serverError,
		isError,
		isLoading,
	} = useFetchItemsQuery({
		path: keys.baseLocalUrl,
	});

	const whatsappActive = user?.whatsappDetails?.isActive || false;
	const instanceActive = whatsappInstance?.doc?.isActive || false;

	const dispatch = useDispatch();

	// if (userRoleName === 'Attendance') {
	// 	// Define the "Candidates" route
	// 	const filterRoutes = routes.filter(
	// 		(route) => route.moduleId !== 'attendance'
	// 	);

	// 	const filterSidebarRoutes = sidebarRoutes.filter(
	// 		(route) => route.moduleId !== 'attendance'
	// 	);

	// 	if (hasPermission('attendance', 'dashboard')) {
	// 		appSidebarRoutes = [
	// 			...filterSidebarRoutes,
	// 			{
	// 				moduleId: 'attendance',
	// 				name: 'Attendance',
	// 				path: '/attendance/dashboard',
	// 				icon: <Icon as={FaRegCalendarCheck} w='20px' h='20px' />,
	// 			},
	// 		];

	// 		const attendanceRoutes = [
	// 			{
	// 				moduleId: 'attendance',
	// 				name: 'Attendance',
	// 				layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 				path: '/attendance/dashboard',
	// 				component: AttendanceDashboard,
	// 			},
	// 		];

	// 		appRoutes = [...filterRoutes, ...attendanceRoutes];
	// 	}
	// }

	// Always start clean: remove any old whatsapp routes if permission disabled
	// appRoutes = appRoutes.filter((r) => r.moduleId !== 'whatsapp');
	// appSidebarRoutes = appSidebarRoutes.filter(
	// 	(r) => r.moduleId !== 'whatsapp'
	// );

	// if (!isSuperAdmin && hasPermission('whatsapp')) {
	// 	const whatsappSidebarRoutes = appSidebarRoutes.find(
	// 		(r) => r.moduleId === 'whatsapp'
	// 	);

	// 	// Regular users - dynamic based on status and permissions
	// 	const children = [];

	// 	if (whatsappActive && !hasPermission('whatsapp', 'whatsapp_chats')) {
	// 		children.push({
	// 			name: 'Chat',
	// 			path: '/whatsapp/chat',
	// 		});
	// 	}

	// 	// Add instance route only if instance is active
	// 	if (instanceActive && !hasPermission('whatsapp', 'whatsapp_instances')) {
	// 		children.push({
	// 			name: 'Instance',
	// 			path: '/whatsapp/instance',
	// 		});
	// 	}

	// 	console.log({ whatsappSidebarRoutes, children });

	// 	if (children?.length > 0) {
	// 		whatsappSidebarRoutes.children = [
	// 			...whatsappSidebarRoutes.children,
	// 			...children,
	// 		];

	// 		// Add corresponding app routes
	// 		if (whatsappActive) {
	// 			appRoutes.push({
	// 				name: 'Chat',
	// 				layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 				path: `/whatsapp/chat`,
	// 				component: UserWhatsappChat,
	// 			});
	// 		}

	// 		if (instanceActive) {
	// 			appRoutes.push({
	// 				name: 'Instance',
	// 				layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 				path: `/whatsapp/instance`,
	// 				component: UserWhatsappInstance,
	// 			});
	// 		}
	// 	}

	// 	// if user has whatsapp and also enable then show it
	// 	// if (whatsappActive) {
	// 	// 	appSidebarRoutes.push({
	// 	// 		name: 'Instance',
	// 	// 		path: '/whatsapp/instance',
	// 	// 		icon: <Icon as={FaWhatsapp} w='20px' h='20px' />,
	// 	// 	});

	// 	// 	appRoutes.push({
	// 	// 		name: 'Instance',
	// 	// 		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	// 		path: `/whatsapp/instance`,
	// 	// 		component: UserWhatsapp,
	// 	// 	});
	// 	// }

	// 	// if (whatsappActive) {
	// 	// 	appSidebarRoutes.push({
	// 	// 		name: 'Chat',
	// 	// 		path: '/whatsapp/chat',
	// 	// 		icon: <Icon as={FaWhatsapp} w='20px' h='20px' />,
	// 	// 	});

	// 	// 	appRoutes.push({
	// 	// 		name: 'Chat',
	// 	// 		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
	// 	// 		path: `/whatsapp/chat`,
	// 	// 		component: UserWhatsapp,
	// 	// 	});
	// 	// }
	// }

	// const {
	// 	data: userData,
	// 	isLoading,
	// 	isSuccess,
	// } = useFetchItemsQuery({
	// 	path: `/v2/user/${user?._id}`,
	// });

	// useEffect(() => {
	// 	// Check role mismatch
	// 	if (
	// 		isSuccess &&
	// 		(user?.roles[0]?.roleName !== userData?.doc?.roleName ||
	// 			!userData?.doc?.isActive)
	// 	) {
	// 		dispatch(logOutUser());
	// 	} else if (userData?.doc) {
	// 		// build the permission map and store in redux store
	// 		const permissionMap = buildPermissionMap(userData?.doc);
	// 		dispatch(setPermissions(permissionMap));
	// 	}
	// }, [userData?.doc, isSuccess, dispatch, user?.roles]);

	// useEffect(() => {
	// 	let timer;

	// 	// keep loader visible for at least 2s
	// 	timer = setTimeout(() => {
	// 		setAppLoading(false);
	// 	}, 2000);

	// 	return () => clearTimeout(timer);
	// }, []);

	const filterRoute = useCallback((r) => {
		if (r.moduleId === 'system_log') return true;
		return true;
	}, []);

	if (!isSuperAdmin && hasPermission('whatsapp')) {
		const whatsappSidebarRoutes = appSidebarRoutes.find(
			(r) => r.moduleId === 'whatsapp'
		);

		if (!whatsappSidebarRoutes) return null;

		const existingChildren = whatsappSidebarRoutes.children || [];
		const newChildren = [];

		// Add Chat child if active + not already exists + user lacks the full permission
		// !hasPermission('whatsapp', 'whatsapp_chats') &&
		if (
			whatsappActive &&
			!existingChildren.some((c) => c.path === '/whatsapp/chat')
		) {
			newChildren.push({
				name: 'Meta Whatsapp',
				path: '/whatsapp/chat',
			});
		}

		// Add Instance child if active + not already exists + user lacks full instance permission
		if (
			instanceActive &&
			!hasPermission('whatsapp', 'whatsapp_beta') &&
			!existingChildren.some((c) => c.path === '/whatsapp/instance')
		) {
			newChildren.push({
				name: 'Whatsapp',
				version: 'Beta',
				path: '/whatsapp/instance',
			});
		}

		// Only merge once if new children exist
		if (newChildren.length > 0) {
			sessionStorage.setItem('isWhatsappUser', true);

			whatsappSidebarRoutes.children = [...existingChildren, ...newChildren];

			// Remove Chat route if WhatsApp is NOT active
			if (whatsappActive === false) {
				appRoutes = appRoutes.filter((r) => r.path !== '/whatsapp/chat');
			}

			// Remove Instance route if Instance is NOT active
			if (instanceActive === false) {
				appRoutes = appRoutes.filter((r) => r.path !== '/whatsapp/instance');
			}

			// Add corresponding app routes
			// if (!whatsappActive) {
			// 	appRoutes.push({
			// 		name: 'Chat',
			// 		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
			// 		path: `/whatsapp/chat`,
			// 		component: UserWhatsappChat,
			// 	});
			// }

			// if (!instanceActive) {
			// 	appRoutes.push({
			// 		name: 'Instance',
			// 		layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
			// 		path: `/whatsapp/instance`,
			// 		component: UserWhatsappInstance,
			// 	});
			// }
		} else if (!isWhatsappUser) {
			sessionStorage.setItem('isWhatsappUser', false);

			// remove any old whatsapp routes if permission disabled
			appRoutes = appRoutes.filter((r) => r.moduleId !== 'whatsapp');
			appSidebarRoutes = appSidebarRoutes.filter(
				(r) => r.moduleId !== 'whatsapp'
			);
		}
	}

	const getRoutes = (routes) => {
		// filter routes
		const finalRoutes = routes?.filter((route) => {
			// if route has parent/child, check both
			if (route.parent && route.childId) {
				return hasPermission(route.parent, route.childId);
			}

			// if only moduleId (parent module level)
			if (route.moduleId) {
				return hasPermission(route.moduleId);
			}

			// routes without permission binding always allowed
			return true;
		});

		return finalRoutes.map((prop, key) => {
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

	// If server is loading
	if (isLoading) {
		return (
			<Flex align='center' justify='center' h='100vh'>
				<Loader />
			</Flex>
		);
	}

	// If server status is not 2000
	if (serverError.originalStatus !== 200) {
		return <ServerErrorPage />;
	}

	return (
		<>
			{/* Navbar (full width) */}
			<AppNavbar
				openSidebar={openSidebar}
				setOpenSidebar={setOpenSidebar}
				onOpenMobile={onOpen}
			/>

			<Flex>
				{/* Sidebar (desktop fixed, mobile Drawer) */}
				<AppSidebar
					routes={appSidebarRoutes}
					brandName='Weeam CRM'
					filterRoute={filterRoute}
					isMobileOpen={openSidebar}
					onMobileOpenChange={setOpenSidebar}
					mobileOpen={mobileOpen}
					setMobileOpen={(v) => (v ? onOpen() : onClose())}
				/>

				{/* Main content area */}
				<Box
					as='main'
					flex='1'
					overflow={'hidden'}
					scrollBehavior={'smooth'}
					bg={pageBg}
					pt={`${NAVBAR_HEIGHT + 16}px`} // navbar height + spacing
					pl={{
						base: 0,
						// xl: openSidebar ? `${SIDEBAR_W}px` : `${SIDEBAR_W_COLLAPSED}px`,
					}}
					transition='padding-left 220ms cubic-bezier(.4,0,.2,1)'
					minH='100vh'
				>
					<Box
						px={{ base: 4, md: 6 }}
						py={{ base: 2, md: 4 }}
						mb='6'
						minH='85vh'
					>
						<Suspense
							fallback={
								null
								// <Flex align='center' justify='center' h='100vh' w='full'>
								// 	<AppLoader />
								// </Flex>
							}
						>
							<Routes>
								{getRoutes(appRoutes)}
								<Route path='/*' element={<Navigate to={defaultRoute} />} />
							</Routes>
						</Suspense>
					</Box>

					<Footer />
				</Box>
			</Flex>
		</>
	);
}
