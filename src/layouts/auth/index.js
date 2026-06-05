// import { Suspense, useState } from 'react';
// import { Navigate, Route, Routes } from 'react-router-dom';
// import routes from 'routes.js';
// 	import { useLocation } from 'react-router-dom';

// // Chakra imports
// import { Box, Flex, useColorModeValue } from '@chakra-ui/react';

// // Layout components
// import { SidebarContext } from 'contexts/SidebarContext';
// import Spinner from 'components/spinner/Spinner';
// import WeeamLoadingPage from "components/welcome/WeeamLoadingPage";
// import WorkspacePage from 'views/auth/workspace';
// import SignIn from 'views/auth/signIn';

// // Custom Chakra theme
// export default function Auth({ setIsLogin }) {
// const location = useLocation();
// 	// states and functions
// 	const [toggleSidebar, setToggleSidebar] = useState(false);
// 	// functions for changing the states from components
// 	const getRoute = () => {
// 		return window.location.pathname !== '/auth/full-screen-maps';
// 	};
// const getTenantParam = () => {
//   const searchParams = new URLSearchParams(location.search);
//   const tenantId = searchParams.get('tenantId');
//   return tenantId ? `?tenantId=${tenantId}` : '';
// };
// 	const getRoutes = (routes) => {
// 		return routes.map((prop, key) => {
// 			if (prop.layout === '/auth') {
// 				return (
// 					<Route
// 						path={prop.layout + prop.path}
// 						element={<prop.component />}
// 						key={key}
// 					/>
// 				);
// 			}
// 			if (prop.collapse) {
// 				return getRoutes(prop.items);
// 			}
// 			if (prop.category) {
// 				return getRoutes(prop.items);
// 			} else {
// 				return null;
// 			}
// 		});
// 	};

// 	const authBg = useColorModeValue('white', 'navy.900');
// 	document.documentElement.dir = 'ltr';
// 	return (
// 		<Box>
// 			<SidebarContext.Provider
// 				value={{
// 					toggleSidebar,
// 					setToggleSidebar,
// 				}}
// 			>
// 				<Box
// 					bg={authBg}
// 					float='right'
// 					minHeight='100vh'
// 					height='100%'
// 					position='relative'
// 					w='100%'
// 					transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
// 					transitionDuration='.2s, .2s, .35s'
// 					transitionProperty='top, bottom, width'
// 					transitionTimingFunction='linear, linear, ease'
// 				>
// 					{getRoute() ? (
// 						<Box mx='auto' minH='100vh'>
// 							<Suspense
// 								fallback={
// 									<Flex
// 										justifyContent={'center'}
// 										alignItems={'center'}
// 										width='100%'
// 										height={'100vh'}
// 									>
// 										<Spinner color={"brand.500"} size={"md"} />
// 									</Flex>
// 								}
// 							>
// 								{/* <Routes>
// 									{getRoutes(routes)}
// 									<Route path="/auth/workspace" element={<WorkspacePage />} />
// 									<Route path='/*' element={<Navigate to='/auth/sign-in' />} />
// 									<Route path='/*' element={<Navigate to={`/auth/sign-in${getTenantParam()}`} />} />
// 								</Routes> */}
// 								<Routes>
//   {getRoutes(routes)}
//   <Route path="/auth/workspace" element={<WorkspacePage />} />
//   <Route path="/auth/sign-in" element={<SignIn />} />
//   {/* Default route - show workspace page */}
//   <Route path='/*' element={<Navigate to="/auth/workspace" />} />
// </Routes>
// 							</Suspense>
// 						</Box>
// 					) : null}
// 				</Box>
// 			</SidebarContext.Provider>
// 		</Box>
// 	);
// }

import { Suspense, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import routes from 'routes.js';
import { useLocation } from 'react-router-dom';

// Chakra imports
import {
	Box,
	Flex,
	keyframes,
	Spinner as ChakraSpinner,
} from '@chakra-ui/react';

// Layout components
import { SidebarContext } from 'contexts/SidebarContext';
import Spinner from 'components/spinner/Spinner';
import WeeamLoadingPage from 'components/welcome/WeeamLoadingPage';
import WorkspacePage from 'views/auth/workspace';
import SignIn from 'views/auth/signIn';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
	navy900: '#0B1C2C',
	navy800: '#10273A',
	goldPri: '#D4AF37',
	goldLight: '#F5D67B',
	goldDark: '#C9A227',
};

const goldGradient = `linear-gradient(135deg, ${C.goldLight} 0%, ${C.goldPri} 50%, ${C.goldDark} 100%)`;

// ─── Keyframes ────────────────────────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

// Animated background dots pattern overlay
const bgPattern = `radial-gradient(circle at 1px 1px, rgba(212,175,55,0.04) 1px, transparent 0)`;

// ─── Auth Layout ──────────────────────────────────────────────────────────────
export default function Auth({ setIsLogin }) {
	const location = useLocation();
	const [toggleSidebar, setToggleSidebar] = useState(false);

	const getRoute = () => window.location.pathname !== '/auth/full-screen-maps';

	const getTenantParam = () => {
		const searchParams = new URLSearchParams(location.search);
		const tenantId = searchParams.get('tenantId');
		return tenantId ? `?tenantId=${tenantId}` : '';
	};

	const getRoutes = (routes) =>
		routes.map((prop, key) => {
			if (prop.layout === '/auth') {
				return (
					<Route
						path={prop.layout + prop.path}
						element={<prop.component />}
						key={key}
					/>
				);
			}
			if (prop.collapse || prop.category) return getRoutes(prop.items);
			return null;
		});

	document.documentElement.dir = 'ltr';

	return (
		<SidebarContext.Provider value={{ toggleSidebar, setToggleSidebar }}>
			{/* ── Outer shell — always Navy 900 ── */}
			<Box
				position='relative'
				minH='100vh'
				w='100%'
				bg={C.navy900}
				overflow='hidden'
			>
				{/* ── Dot-grid texture overlay ── */}
				<Box
					position='absolute'
					inset={0}
					backgroundImage={bgPattern}
					backgroundSize='28px 28px'
					pointerEvents='none'
					zIndex={0}
				/>

				{/* ── Large ambient glow — top-left ── */}
				<Box
					position='absolute'
					top='-120px'
					left='-120px'
					w='520px'
					h='520px'
					bg={`radial-gradient(circle, rgba(212,175,55,0.045) 0%, transparent 65%)`}
					pointerEvents='none'
					zIndex={0}
				/>

				{/* ── Large ambient glow — bottom-right ── */}
				<Box
					position='absolute'
					bottom='-140px'
					right='-140px'
					w='480px'
					h='480px'
					bg={`radial-gradient(circle, rgba(212,175,55,0.035) 0%, transparent 65%)`}
					pointerEvents='none'
					zIndex={0}
				/>

				{/* ── Thin gold top border ── */}
				<Box
					position='absolute'
					top={0}
					left={0}
					right={0}
					h='2px'
					bg={goldGradient}
					opacity={0.5}
					zIndex={1}
				/>

				{/* ── Content layer ── */}
				<Box
					position='relative'
					zIndex={2}
					float='right'
					minH='100vh'
					h='100%'
					w='100%'
					transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
					transitionDuration='.2s, .2s, .35s'
					transitionProperty='top, bottom, width'
					transitionTimingFunction='linear, linear, ease'
					animation={`${fadeIn} 0.4s ease both`}
				>
					{getRoute() ? (
						<Box mx='auto' minH='100vh'>
							<Suspense
								fallback={
									<Flex
										justify='center'
										align='center'
										w='100%'
										h='100vh'
										bg={C.navy900}
										direction='column'
										gap={4}
									>
										{/* Gold spinner ring */}
										<Box
											w='48px'
											h='48px'
											borderRadius='full'
											border='3px solid'
											borderColor={`rgba(212,175,55,0.15)`}
											borderTopColor={C.goldPri}
											animation='spin 0.8s linear infinite'
											sx={{
												'@keyframes spin': {
													from: { transform: 'rotate(0deg)' },
													to: { transform: 'rotate(360deg)' },
												},
											}}
										/>
										<Box
											fontSize='12px'
											fontWeight='600'
											letterSpacing='1.2px'
											textTransform='uppercase'
											color='rgba(212,175,55,0.6)'
										>
											Loading…
										</Box>
									</Flex>
								}
							>
								<Routes>
									{getRoutes(routes)}
									<Route path='/auth/workspace' element={<WorkspacePage />} />
									<Route path='/auth/sign-in' element={<SignIn />} />
									{/* Default — redirect to workspace selection */}
									<Route
										path='/*'
										element={<Navigate to='/auth/workspace' />}
									/>
								</Routes>
							</Suspense>
						</Box>
					) : null}
				</Box>
			</Box>
		</SidebarContext.Provider>
	);
}
