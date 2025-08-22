import { Box, Flex, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import React, { Suspense, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLE_PATH } from 'roles';
import Footer from 'components/footer/FooterAdmin';
import AppNavbar, { NAVBAR_HEIGHT } from 'components/navbar/AppNavbar';
import AppSidebar from 'components/sidebar/AppSidebar';

import routes from 'routes';
import sidebarRoutes from 'sidebarRoutes';
import Loader from 'components/loading/Loader';

const SIDEBAR_W = 260;
const SIDEBAR_W_COLLAPSED = 88;

export default function DashboardLayout({ defaultRoute = '/default' }) {
	const [openSidebar, setOpenSidebar] = React.useState(false);
	const { isOpen: mobileOpen, onOpen, onClose } = useDisclosure();
	const pageBg = useColorModeValue('whiteAlpa.100', 'gray.800');

	const filterRoute = useCallback((r) => {
		if (r.moduleId === 'system_log') return true;
		return true;
	}, []);

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
					routes={sidebarRoutes}
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
					<Box px={{ base: 4, md: 6 }} py={{ base: 2, md: 4 }} mb='6'>
						<Suspense
							fallback={
								<Flex align='center' justify='center' h='100vh'>
									<Loader />
								</Flex>
							}
						>
							<Routes>
								{getRoutes(routes)}
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
