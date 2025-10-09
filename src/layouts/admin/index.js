import {
	Box,
	Flex,
	Icon,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';
import React, { Suspense, useCallback, useState } from 'react';
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
import UserWhatsapp from 'views/admin/whatsapp-v2/UserWhatsapp';
import keys from 'config/keys';
import ServerErrorPage from 'views/admin/error/ServerErrorPage';
import AppLoader from 'components/loading/AppLoader';
import { filterRoutes } from 'components/sidebar/sidebarHelpers';

export default function DashboardLayout({ defaultRoute = '/default' }) {
	const [openSidebar, setOpenSidebar] = useState(false);

	let appRoutes = [...routes];
	let appSidebarRoutes = [...sidebarRoutes];

	const { isOpen: mobileOpen, onOpen, onClose } = useDisclosure();
	const pageBg = useColorModeValue('whiteAlpa.100', 'gray.800');

	const { user, isSuperAdmin, userRoleName } = useUserSession();
	const { hasPermission } = usePermissions();

	// only check for other non super admin user's
	// const { data: whatsappUser } = useFetchItemsQuery(
	// 	{
	// 		path: `whatsapp/instances/user/${user?._id}`,
	// 	},
	// 	{
	// 		skip: !user?._id || isSuperAdmin,
	// 	}
	// );

	// console.log({ whatsappUser });

	const {
		data: ServerStatus,
		error: serverError,
		isError,
		isLoading,
	} = useFetchItemsQuery({
		path: keys.baseLocalUrl,
	});

	// const whatsappActive = whatsappUser?.doc?.isActive;
	const whatsappActive = user?.whatsappInstance?.isActive || false;

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

	if (!isSuperAdmin) {
		// Always start clean: remove any old whatsapp routes
		appRoutes = appRoutes.filter((r) => r.moduleId !== 'whatsapp');
		appSidebarRoutes = appSidebarRoutes.filter(
			(r) => r.moduleId !== 'whatsapp'
		);

		// if user has whatsapp and also enable then show it
		if (whatsappActive) {
			// Always start clean: remove any old whatsapp routes
			// appRoutes = appRoutes.filter((r) => r.moduleId !== 'whatsapp');
			// appSidebarRoutes = appSidebarRoutes.filter(
			// 	(r) => r.moduleId !== 'whatsapp'
			// );
			appSidebarRoutes.push({
				moduleId: 'whatsapp',
				name: 'Whatsapp',
				path: '/whatsapp/instance',
				icon: <Icon as={FaWhatsapp} w='20px' h='20px' />,
			});
			appRoutes.push({
				moduleId: 'whatsapp',
				name: 'Whatsapp',
				layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
				path: `/whatsapp/instance`,
				component: UserWhatsapp,
			});
		}
	}

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
