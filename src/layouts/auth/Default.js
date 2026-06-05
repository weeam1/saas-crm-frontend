// import React from "react";
// import { Box, Flex, Image, Link } from "@chakra-ui/react";
// import Footer from "components/footer/FooterAuth";
// import { useFetchItemsQuery } from "api/apiSlice";
// // import { Link } from 'react-router-dom';

// import AppleStoreLogo from 'assets/icons/App_StoreV2.png';
// import GoogleStoreLogo from 'assets/icons/Google_Play-Logo.wineV2.png';
// import { toast } from "react-toastify";
// import { constant } from "constant";

// function AuthIllustration(props) {
// 	const { children, illustrationBackground } = props;
// 	// Chakra color mode
// 	return (
// 		<Flex h='max-content'>
// 			<Flex
// 				h={{
// 					sm: 'initial',
// 					md: 'unset',
// 					lg: '100vh',
// 					xl: '97vh',
// 				}}
// 				className='auth-form'
// 				pt={{ sm: '50px', md: '0px' }}
// 				px={{ lg: '30px', xl: '0px' }}
// 				ps={{ xl: '70px' }}
// 				alignItems={'center'}
// 				justifyContent='center'
// 				direction='column'
// 			>
// 				{children}
// 				<Footer />
// 			</Flex>

// 			<Box
// 				className='auth-image'
// 				backgroundSize={'cover'}
// 				backgroundPosition={'center'}
// 				height={'100vh'}
// 				backgroundImage={
// 					'url(https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'
// 				}
// 				width={'50%'}
// 			></Box>
// 		</Flex>
// 	);
// }




import React from 'react';
import {
	Box,
	Flex,
	Image,
	Link,
	Text,
	VStack,
	HStack,
	Icon,
	keyframes,
	chakra,
} from '@chakra-ui/react';
import Footer from 'components/footer/FooterAuth';
import { useFetchItemsQuery } from 'api/apiSlice';
import AppleStoreLogo from 'assets/icons/App_StoreV2.png';
import GoogleStoreLogo from 'assets/icons/Google_Play-Logo.wineV2.png';
import { toast } from 'react-toastify';
import { constant } from 'constant';
import { FaStar, FaShieldAlt, FaChartLine } from 'react-icons/fa';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
	navy900: '#0B1C2C',
	navy800: '#10273A',
	goldPri: '#D4AF37',
	goldLight: '#F5D67B',
	goldDark: '#C9A227',
	black: '#000000',
	white: '#FFFFFF',
	gray300: '#B0B0B0',
	gray500: '#808080',
};

const goldGradient = `linear-gradient(135deg, ${C.goldLight} 0%, ${C.goldPri} 50%, ${C.goldDark} 100%)`;
const overlayDark = 'rgba(0,0,0,0.58)';

// ─── Keyframes ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity:0; transform:translateY(14px); }
  to   { opacity:1; transform:translateY(0);    }
`;

const shimmer = keyframes`
  0%   { background-position:-200% center; }
  100% { background-position: 200% center; }
`;

const pulseBar = keyframes`
  0%,100% { opacity:0.5; transform:scaleX(1);    }
  50%      { opacity:1;   transform:scaleX(1.15); }
`;

// ─── Feature Pill ─────────────────────────────────────────────────────────────
const FeaturePill = ({ icon, label, delay = '0s' }) => (
	<HStack
		spacing={3}
		px='14px'
		py='9px'
		bg='rgba(11,28,44,0.72)'
		border='1px solid rgba(212,175,55,0.22)'
		borderRadius='full'
		backdropFilter='blur(10px)'
		animation={`${fadeUp} 0.55s ${delay} ease both`}
		_hover={{
			bg: 'rgba(212,175,55,0.1)',
			borderColor: 'rgba(212,175,55,0.45)',
		}}
		transition='all 0.2s'
		w='fit-content'
	>
		<Flex
			w='26px'
			h='26px'
			borderRadius='full'
			bg={goldGradient}
			align='center'
			justify='center'
			flexShrink={0}
		>
			<Icon as={icon} color={C.black} fontSize='11px' />
		</Flex>
		<Text fontSize='12px' fontWeight='600' color={C.gray300}>
			{label}
		</Text>
	</HStack>
);

// ─── Store Badge ──────────────────────────────────────────────────────────────
const StoreBadge = ({ src, alt, onClick, href, isExternal }) => {
	const inner = (
		<Box
			borderRadius='8px'
			overflow='hidden'
			border='1px solid rgba(212,175,55,0.18)'
			transition='all 0.2s'
			_hover={{
				borderColor: 'rgba(212,175,55,0.5)',
				boxShadow: '0 0 12px rgba(212,175,55,0.22)',
				transform: 'translateY(-2px)',
			}}
		>
			<Image src={src} alt={alt} h='36px' w='auto' display='block' />
		</Box>
	);
	if (onClick)
		return (
			<Link onClick={onClick} _hover={{ textDecoration: 'none' }}>
				{inner}
			</Link>
		);
	return (
		<Link href={href} isExternal _hover={{ textDecoration: 'none' }}>
			{inner}
		</Link>
	);
};

// ─── Main Layout ──────────────────────────────────────────────────────────────
function AuthIllustration({ children }) {
	const { data } = useFetchItemsQuery(
		{ path: `/upload/apk` },
		{ refetchOnMountOrArgChange: true },
	);

	const handleDownloadApk = async () => {
		try {
			const apkPath = data?.url;
			if (!apkPath) {
				toast.error('APK file not available');
				return;
			}
			const apkURL = `${constant['baseUrl']}${apkPath}`;
			const res = await fetch(apkURL, { method: 'HEAD' });
			if (!res.ok) {
				toast.error('APK file not found on server');
				return;
			}
			const link = document.createElement('a');
			link.href = apkURL;
			link.download = apkURL.split('/').pop();
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			toast.success('Download started');
		} catch (err) {
			console.error(err);
			toast.error('Failed to download APK');
		}
	};

	return (
		/**
		 * ROOT — locks to the full viewport, no scrollbars on the shell.
		 * position:fixed so it always fills 100% regardless of parent height.
		 */
		<Box position='fixed' inset='0' bg={C.navy900} overflow='hidden' zIndex={0}>
			{/* ── Decorative ambient blobs ── */}
			<Box
				position='absolute'
				top='-180px'
				left='-180px'
				w='520px'
				h='520px'
				bg='radial-gradient(circle, rgba(212,175,55,0.055) 0%, transparent 65%)'
				pointerEvents='none'
				zIndex={0}
			/>
			<Box
				position='absolute'
				bottom='-180px'
				right='-180px'
				w='500px'
				h='500px'
				bg='radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 65%)'
				pointerEvents='none'
				zIndex={0}
			/>

			{/* ── Dot-grid texture ── */}
			<Box
				position='absolute'
				inset={0}
				backgroundImage='radial-gradient(circle at 1px 1px, rgba(212,175,55,0.03) 1px, transparent 0)'
				backgroundSize='28px 28px'
				pointerEvents='none'
				zIndex={0}
			/>

			{/* ── Gold top border ── */}
			<Box
				position='absolute'
				top={0}
				left={0}
				right={0}
				h='2px'
				bg={goldGradient}
				opacity={0.55}
				zIndex={2}
			/>

			{/* ════════════════════════════════════════════════
          INNER FLEX — fills 100% height, side by side
          ════════════════════════════════════════════════ */}
			<Flex
				w='100%'
				h='100%'
				direction={{ base: 'column', lg: 'row' }}
				position='relative'
				zIndex={1}
			>
				{/* ══════════════════════════════
            LEFT PANEL  (desktop only)
            ══════════════════════════════ */}
				<Box
					display={{ base: 'none', lg: 'flex' }}
					w={{ lg: '42%', xl: '45%' }}
					h='100%'
					position='relative'
					overflow='hidden'
					flexShrink={0}
					flexDirection='column'
				>
					{/* Background image */}
					<Box
						position='absolute'
						inset={0}
						bgImage="url('/image/Login_Page.png')"
						bgSize='cover'
						bgPos='center'
					/>

					{/* Overlays */}
					<Box position='absolute' inset={0} bg={overlayDark} />
					<Box
						position='absolute'
						inset={0}
						bg={`linear-gradient(160deg, rgba(11,28,44,0.3) 0%, rgba(11,28,44,0.7) 100%)`}
					/>
					{/* Bottom fade into navy */}
					<Box
						position='absolute'
						bottom={0}
						left={0}
						right={0}
						h='40%'
						bg={`linear-gradient(to top, ${C.navy900} 0%, transparent 100%)`}
					/>

					{/* Right-side gold divider */}
					<Box
						position='absolute'
						top='6%'
						bottom='6%'
						right={0}
						w='1px'
						bg='linear-gradient(to bottom, transparent, rgba(212,175,55,0.35), transparent)'
					/>

					{/* Panel content */}
					<Flex
						position='relative'
						zIndex={1}
						direction='column'
						justify='space-between'
						h='100%'
						p={{ lg: 10, xl: 14 }}
					>
						{/* Top label */}
						<chakra.span
							fontSize='11px'
							fontWeight='700'
							letterSpacing='3.5px'
							textTransform='uppercase'
							bg={goldGradient}
							bgClip='text'
							backgroundSize='200% auto'
							animation={`${shimmer} 5s linear infinite`}
						>
							Enterprise CRM
						</chakra.span>

						{/* Centre headline */}
						<VStack align='flex-start' spacing={4}>
							<Box
								w='44px'
								h='3px'
								bg={goldGradient}
								borderRadius='full'
								transformOrigin='left'
								animation={`${pulseBar} 2.8s ease-in-out infinite`}
							/>
							<Text
								fontSize={{ lg: '28px', xl: '34px' }}
								fontWeight='800'
								color={C.white}
								lineHeight='1.22'
								maxW='360px'
							>
								Manage your business{' '}
								<chakra.span
									bg={goldGradient}
									bgClip='text'
									backgroundSize='200% auto'
									animation={`${shimmer} 4s linear infinite`}
								>
									smarter
								</chakra.span>
								,{'\n'}not harder.
							</Text>
							<Text
								fontSize='13px'
								color={C.gray300}
								lineHeight='1.75'
								maxW='310px'
							>
								All-in-one workspace for teams that move fast — CRM, tasks,
								analytics and more, unified.
							</Text>
						</VStack>

						{/* Feature pills */}
						<VStack align='flex-start' spacing='10px'>
							<FeaturePill
								icon={FaChartLine}
								label='Real-time analytics'
								delay='0s'
							/>
							<FeaturePill
								icon={FaShieldAlt}
								label='Enterprise security'
								delay='0.07s'
							/>
							<FeaturePill
								icon={FaStar}
								label='5-star rated by teams'
								delay='0.14s'
							/>
						</VStack>
					</Flex>
				</Box>

				{/* ══════════════════════════════════════
            RIGHT PANEL — form + badges + footer
            ══════════════════════════════════════ */}
				<Flex
					flex={1}
					h='100%'
					direction='column'
					align='center'
					justify='center'
					overflowY='auto'
					bg={{ base: C.navy900, lg: 'transparent' }}
					px={{ base: 4, sm: 6, md: 8 }}
					py={{ base: 8, md: 6 }}
					position='relative'
					/* Custom scrollbar styling */
					sx={{
						'&::-webkit-scrollbar': { width: '4px' },
						'&::-webkit-scrollbar-track': { background: 'transparent' },
						'&::-webkit-scrollbar-thumb': {
							background: 'rgba(212,175,55,0.25)',
							borderRadius: '4px',
						},
						'&::-webkit-scrollbar-thumb:hover': {
							background: 'rgba(212,175,55,0.5)',
						},
					}}
				>
					{/* ── Auth form children ── */}
					<Box
						w='100%'
						maxW={{ base: '100%', sm: '440px' }}
						mx='auto'
						animation={`${fadeUp} 0.45s ease both`}
					>
						{children}
					</Box>

					{/* ── Store badges ── */}
					<HStack
						spacing={3}
						mt={6}
						flexWrap='wrap'
						justify='center'
						animation={`${fadeUp} 0.55s 0.1s ease both`}
					>
						{data?.url && (
							<StoreBadge
								src={AppleStoreLogo}
								alt='Download APK'
								onClick={handleDownloadApk}
							/>
						)}
						<StoreBadge
							src={GoogleStoreLogo}
							alt='App Store'
							href='https://apps.apple.com/pk/app/weeam-crm/id6744808346'
							isExternal
						/>
					</HStack>

					{/* ── Footer ── */}
					<Box mt={5} w='100%' maxW={{ base: '100%', sm: '440px' }} mx='auto'>
						<Box
							h='1px'
							bg='linear-gradient(90deg, transparent, rgba(212,175,55,0.18), transparent)'
							mb={4}
						/>
						<Footer />
					</Box>
				</Flex>
			</Flex>
		</Box>
	);
}

export default AuthIllustration;



// function AuthIllustration({ children }) {
//   const { data } = useFetchItemsQuery(
//     { path: `/upload/apk` },
//     { refetchOnMountOrArgChange: true },
//   );

//   const handleDownloadApk = async () => {
//     try {
//       const apkPath = data?.url;
//       if (!apkPath) {
//         toast.error("APK file not available");
//         return;
//       }
//       const apkURL = `${constant["baseUrl"]}${apkPath}`;
//       const response = await fetch(apkURL, { method: "HEAD" });
//       if (!response.ok) {
//         toast.error("APK file not found on server");
//         return;
//       }
//       const link = document.createElement("a");
//       link.href = apkURL;
//       link.download = apkURL.split("/").pop();
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       toast.success("Download started");
//     } catch (error) {
//       console.error("Error downloading APK:", error);
//       toast.error("Failed to download APK");
//     }
//   };

//   return (
//     <Flex
//       w="100vw"
//       h="100vh"
//       bg="#f5f5f5"
//       align="center"
//       justify="center"
//       px={4}
//     >
//       <Flex
//         w="100%"
//         maxW="7xl"
//         h={{ base: "auto", md: "85vh" }}
//         bg="white"
//         borderRadius="xl"
//         overflow="hidden"
//         boxShadow="md"
//         direction={{ base: "column", md: "row" }}
//       >
//         <Box
//           display={{ base: "none", md: "block" }}
//           w={{ md: "40%", lg: "50%" }}
//           h="100%"
//           bgImage="url('/image/Login_Page.png')"
//           bgSize="fill"
//           bgRepeat="no-repeat"
//           bgPos="center"
//           sx={{
//             "@media (max-width: 988px)": {
//               display: "none",
//             },
//           }}
//         />
//         <Flex
//           h={{ sm: "initial", md: "unset", lg: "100vh", xl: "97vh" }}
//           className="auth-form"
//           pt={{ sm: "40px", md: "0px" }}
//           px={{ lg: "30px", xl: "0px" }}
//           ps={{ xl: "70px" }}
//           alignItems="center"
//           justifyContent="center"
//           direction="column"
//           w={{ base: "100%", lg: "50%" }}
//         >
//           {children}

//           <Flex gap={4} my={1}>
//             {data?.url && (
//               <Link onClick={handleDownloadApk}>
//                 <Image
//                 src={AppleStoreLogo}
//                   // src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
//                   alt="Google Play"
//                   width="160px"
//                 />
//               </Link>
//             )}
//             <Link
//               href="https://apps.apple.com/pk/app/weeam-crm/id6744808346"
//               isExternal
//             >
//               <Image
//               src={GoogleStoreLogo}
//                 // src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
//                 alt="App Store"
//                 width="160px"
//               />
//             </Link>
//           </Flex>
//           <Footer />
//         </Flex>
//       </Flex>
//     </Flex>
//   );
// }

// export default AuthIllustration;
