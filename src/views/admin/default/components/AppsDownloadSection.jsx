// import { Box, Flex, Image, Text, Link } from "@chakra-ui/react";
// import { useFetchItemsQuery } from "api/apiSlice";
// import { constant } from "constant";
// import useUserSession from "hooks/useUserSession";
// import React from "react";
// import { toast } from "react-toastify";
// // import AppDownloadNotificationBar from './AppDownloadNotificationBar';

// const AppsDownloadSection = () => {
//   const { data } = useFetchItemsQuery(
//     { path: `/upload/apk` },
//     { refetchOnMountOrArgChange: true },
//   );
// const {agencyName} = useUserSession()
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
//     <>
//       {/* <AppDownloadNotificationBar onDownloadApk={handleDownloadApk} /> */}
//       <Flex
//         // bg='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//         bg="linear-gradient(135deg, #F5ECCB 0%, #B79045 100%)"
//         p="6"
//         rounded="xl"
//         alignItems="center"
//         justifyContent="center"
//         flexDirection="column"
//         shadow="xl"
//         // border='1px solid'
//         // borderColor='whiteAlpha.300'
//         position="relative"
//         overflow="hidden"
//       >
//         {/* Background elements */}
//         <Box
//           position="absolute"
//           top="-50px"
//           right="-50px"
//           w={{ base: "120px", md: "200px" }}
//           h={{ base: "120px", md: "200px" }}
//           bg="whiteAlpha.200"
//           rounded="full"
//         />
//         <Box
//           position="absolute"
//           bottom="-30px"
//           left="-30px"
//           w={{ base: "80px", md: "150px" }}
//           h={{ base: "80px", md: "150px" }}
//           bg="whiteAlpha.200"
//           rounded="full"
//         />

//         <Box
//           display="flex"
//           flexDirection={{ base: "column", md: "row" }}
//           justifyContent="space-evenly"
//           align="center"
//           width="full"
//         >
//           <Box>
//             {/* Main content */}
//             <Text
//               fontSize="xl"
//               fontWeight="bold"
//               color="gray.800"
//               mb={3}
//               textAlign="center"
//               zIndex="1"
//             >
//              Get {agencyName ? `${agencyName} Mobile App` : "Weam Mobile App"}
//             </Text>

//             <Text
//               fontSize="sm"
//               color="gray.700"
//               mb={7}
//               textAlign="center"
//               maxW="400px"
//               lineHeight="1.6"
//               zIndex="1"
//             >
//               Streamline your workflow with our powerful mobile CRM solution.
//               Available on both platforms.
//             </Text>
//           </Box>

//           {/* App badges */}
//           <Flex
//             gap={5}
//             my={2}
//             alignItems="center"
//             // zIndex='1'
//             flexWrap="wrap"
//             justifyContent="center"
//           >
//             {data?.url && (
//               <Link
//                 onClick={handleDownloadApk}
//                 _hover={{
//                   transform: "translateY(-2px)",
//                   transition: "all 0.3s",
//                 }}
//                 transition="all 0.3s ease-in-out"
//                 flexShrink={0}
//               >
//                 <Image
//                   src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
//                   alt="Get it on Google Play"
//                   height="40px"
//                   filter="drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25))"
//                   _hover={{
//                     filter: "drop-shadow(0 6px 16px rgba(0, 0, 0, 0.35))",
//                   }}
//                 />
//               </Link>
//             )}
//             <Link
//               href="https://apps.apple.com/pk/app/weeam-crm/id6744808346"
//               isExternal
//               _hover={{ transform: "translateY(-2px)", transition: "all 0.3s" }}
//               transition="all 0.3s ease-in-out"
//               flexShrink={0}
//             >
//               <Image
//                 src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
//                 alt="Download on the App Store"
//                 height="40px"
//                 filter="drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25))"
//                 _hover={{
//                   filter: "drop-shadow(0 6px 16px rgba(0, 0, 0, 0.35))",
//                 }}
//               />
//             </Link>
//           </Flex>
//         </Box>
//       </Flex>
//     </>
//   );
// };

// export default AppsDownloadSection;

import {
	Box,
	Flex,
	Image,
	Text,
	Link,
	Button,
	keyframes,
} from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import { constant } from 'constant';
import useUserSession from 'hooks/useUserSession';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaAndroid, FaApple, FaDownload, FaQrcode } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const AppsDownloadSection = () => {
	const { data } = useFetchItemsQuery(
		{ path: `/upload/apk` },
		{ refetchOnMountOrArgChange: true },
	);
	const { agencyName } = useUserSession();
	const [isQrVisible, setIsQrVisible] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);

	const handleDownloadApk = async () => {
		try {
			setIsDownloading(true);
			const apkPath = data?.url;
			if (!apkPath) {
				toast.error('APK file not available');
				return;
			}
			const apkURL = `${constant['baseUrl']}${apkPath}`;
			const response = await fetch(apkURL, { method: 'HEAD' });
			if (!response.ok) {
				toast.error('APK file not found on server');
				return;
			}
			const link = document.createElement('a');
			link.href = apkURL;
			link.download = apkURL.split('/').pop();
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			toast.success('Download started successfully!');
		} catch (error) {
			console.error('Error downloading APK:', error);
			toast.error('Failed to download APK');
		} finally {
			setIsDownloading(false);
		}
	};

	const appStoreUrl = 'https://apps.apple.com/pk/app/weeam-crm/id6744808346';

	return (
		<Box
			bg='bg.surface'
			p={{ base: 5, sm: 6, md: 8 }}
			rounded='xl'
			borderWidth='1px'
			borderColor='border.default'
			position='relative'
			overflow='hidden'
			mb={6}
			transition='all 0.3s ease'
			_hover={{
				borderColor: 'gold.primary',
				boxShadow: 'goldGlow',
			}}
		>
			{/* Animated gradient background */}
			<Box
				position='absolute'
				top='0'
				left='0'
				right='0'
				bottom='0'
				bg='radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.03) 0%, transparent 50%)'
				pointerEvents='none'
			/>

			{/* Animated decorative elements */}
			<Box
				position='absolute'
				top='-60px'
				right='-60px'
				w={{ base: '150px', md: '250px' }}
				h={{ base: '150px', md: '250px' }}
				bg='radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)'
				rounded='full'
				pointerEvents='none'
				animation={`${pulse} 4s ease-in-out infinite`}
			/>
			<Box
				position='absolute'
				bottom='-40px'
				left='-40px'
				w={{ base: '100px', md: '180px' }}
				h={{ base: '100px', md: '180px' }}
				bg='radial-gradient(circle, rgba(212, 175, 55, 0.07) 0%, transparent 70%)'
				rounded='full'
				pointerEvents='none'
				animation={`${pulse} 4s ease-in-out infinite reverse`}
			/>

			{/* Gold accent elements */}
			<Box
				position='absolute'
				top='0'
				left='0'
				right='0'
				h='3px'
				bgGradient='linear-gradient(90deg, transparent, #D4AF37, #F5D67B, #D4AF37, transparent)'
				animation={`${shimmer} 3s ease-in-out infinite`}
				backgroundSize='200% 100%'
			/>

			<Box
				position='absolute'
				bottom='0'
				left='0'
				right='0'
				h='1px'
				bg='radial-gradient(circle, #D4AF37 0%, transparent 100%)'
				opacity='0.3'
			/>

			{/* Dots pattern decoration */}
			<Box
				position='absolute'
				top='20px'
				left='20px'
				opacity='0.05'
				pointerEvents='none'
			>
				<svg width='60' height='60' viewBox='0 0 20 20'>
					<circle cx='2' cy='2' r='1' fill='#D4AF37' />
					<circle cx='8' cy='2' r='1' fill='#D4AF37' />
					<circle cx='14' cy='2' r='1' fill='#D4AF37' />
					<circle cx='2' cy='8' r='1' fill='#D4AF37' />
					<circle cx='8' cy='8' r='1' fill='#D4AF37' />
					<circle cx='14' cy='8' r='1' fill='#D4AF37' />
					<circle cx='2' cy='14' r='1' fill='#D4AF37' />
					<circle cx='8' cy='14' r='1' fill='#D4AF37' />
					<circle cx='14' cy='14' r='1' fill='#D4AF37' />
				</svg>
			</Box>

			<Flex
				direction={{ base: 'column', lg: 'row' }}
				justify='space-between'
				align='center'
				gap={{ base: 6, md: 8 }}
				position='relative'
				zIndex={1}
			>
				{/* Left side - Icon with animation */}
				<Flex
					align='center'
					justify='center'
					position='relative'
					flexShrink={0}
				>
					{/* Outer ring */}
					<Box
						position='absolute'
						w={{ base: '80px', md: '100px' }}
						h={{ base: '80px', md: '100px' }}
						borderRadius='full'
						border='2px solid'
						borderColor='gold.primary'
						opacity='0.2'
						animation={`${pulse} 2s ease-in-out infinite`}
					/>

					{/* Middle ring */}
					<Box
						position='absolute'
						w={{ base: '90px', md: '110px' }}
						h={{ base: '90px', md: '110px' }}
						borderRadius='full'
						border='1px solid'
						borderColor='gold.primary'
						opacity='0.3'
						animation={`${pulse} 2s ease-in-out infinite 0.5s`}
					/>

					{/* Icon container */}
					<Flex
						align='center'
						justify='center'
						w={{ base: '70px', md: '90px' }}
						h={{ base: '70px', md: '90px' }}
						bg='rgba(212, 175, 55, 0.1)'
						borderRadius='2xl'
						borderWidth='1px'
						borderColor='gold.primary'
						animation={`${float} 3s ease-in-out infinite`}
					>
						<Box
							as='span'
							fontSize={{ base: '36px', md: '48px' }}
							role='img'
							aria-label='mobile'
						>
							📱
						</Box>
					</Flex>
				</Flex>

				{/* Center - Text Content */}
				<Box textAlign={{ base: 'center', lg: 'left' }} flex='1'>
					{/* Badge */}
					<Box
						display='inline-flex'
						alignItems='center'
						gap={2}
						bg='rgba(212, 175, 55, 0.1)'
						px={3}
						py={1}
						borderRadius='full'
						mb={3}
					>
						<Box w='6px' h='6px' bg='gold.primary' borderRadius='full' />
						<Text fontSize='xs' color='text.accent' fontWeight='medium'>
							AVAILABLE ON MOBILE
						</Text>
					</Box>

					<Text
						fontSize={{ base: 'xl', sm: '2xl', md: '3xl' }}
						fontWeight='bold'
						lineHeight='1.2'
						mb={3}
					>
						Get CRM Mobile App

						{/* <span className='gold-text' style={{ textTransform: 'capitalize' }}>
							{agencyName ? `${agencyName}` : 'Weam'}
						</span>{' '} */}
					</Text>

					<Text
						fontSize={{ base: 'sm', md: 'md' }}
						color='text.muted'
						mb={4}
						maxW={{ base: '100%', lg: '500px' }}
						lineHeight='1.6'
					>
						Access your CRM on the go. Manage leads, track performance, and stay
						connected with your team from anywhere, anytime.
					</Text>

					{/* Features list */}
					<Flex
						gap={{ base: 3, md: 4 }}
						flexWrap='wrap'
						justifyContent={{ base: 'center', lg: 'flex-start' }}
						mb={4}
					>
						<Flex align='center' gap={2}>
							<Box w='6px' h='6px' bg='gold.primary' borderRadius='full' />
							<Text fontSize='xs' color='text.body'>
								Real-time sync
							</Text>
						</Flex>
						<Flex align='center' gap={2}>
							<Box w='6px' h='6px' bg='gold.primary' borderRadius='full' />
							<Text fontSize='xs' color='text.body'>
								Push notifications
							</Text>
						</Flex>
						<Flex align='center' gap={2}>
							<Box w='6px' h='6px' bg='gold.primary' borderRadius='full' />
							<Text fontSize='xs' color='text.body'>
								Offline mode
							</Text>
						</Flex>
						<Flex align='center' gap={2}>
							<Box w='6px' h='6px' bg='gold.primary' borderRadius='full' />
							<Text fontSize='xs' color='text.body'>
								Secure access
							</Text>
						</Flex>
					</Flex>
				</Box>

				{/* Right side - Download Options */}
				<Flex direction='column' gap={4} align='center' flexShrink={0}>
					{/* QR Code Button */}
					{/* <Button
						variant='outline'
						leftIcon={<FaQrcode />}
						onClick={() => setIsQrVisible(!isQrVisible)}
						size='sm'
						borderRadius='full'
					>
						{isQrVisible ? 'Hide QR Code' : 'Show QR Code'}
					</Button> */}

					{/* QR Code */}
					{/* {isQrVisible && (
						<Box
							bg='white'
							p={3}
							borderRadius='lg'
							animation='fadeIn 0.3s ease'
						>
							<Image
								src='https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://weeam.com/download'
								alt='Download QR Code'
								boxSize='100px'
							/>
						</Box>
					)} */}

					{/* Download Buttons */}
					<Flex
						gap={{ base: 3, sm: 4 }}
						flexWrap='wrap'
						justifyContent='center'
					>
						{/* Android Button */}
						{data?.url && (
							<Button
								onClick={handleDownloadApk}
								isLoading={isDownloading}
								loadingText='Downloading'
								variant='brand'
								leftIcon={<FaAndroid />}
								size={{ base: 'sm', md: 'md' }}
								borderRadius='full'
								px={{ base: 4, md: 6 }}
								_hover={{
									transform: 'translateY(-2px)',
									boxShadow: 'goldGlow',
								}}
							>
								Android App
							</Button>
						)}

						{/* iOS Button */}
						<Button
							as='a'
							href={appStoreUrl}
							target='_blank'
							rel='noopener noreferrer'
							variant='outline'
							leftIcon={<FaApple />}
							size={{ base: 'sm', md: 'md' }}
							borderRadius='full'
							px={{ base: 4, md: 6 }}
							_hover={{
								transform: 'translateY(-2px)',
								bg: 'rgba(212, 175, 55, 0.1)',
								borderColor: 'gold.primary',
							}}
						>
							App Store
						</Button>
					</Flex>

					{/* Store badges alternative */}
					{/* <Flex
						gap={3}
						flexWrap='wrap'
						justifyContent='center'
						display={{ base: 'flex', md: 'none' }}
					>
						{data?.url && (
							<Link
								onClick={handleDownloadApk}
								_hover={{ transform: 'translateY(-2px)' }}
								transition='all 0.3s'
							>
								<Image
									src='https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg'
									alt='Google Play'
									height='35px'
								/>
							</Link>
						)}
						<Link
							href={appStoreUrl}
							isExternal
							_hover={{ transform: 'translateY(-2px)' }}
							transition='all 0.3s'
						>
							<Image
								src='https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg'
								alt='App Store'
								height='35px'
							/>
						</Link>
					</Flex> */}
				</Flex>
			</Flex>

			{/* Close/dismiss button (optional) */}
			{/* <Button
				position='absolute'
				top={2}
				right={2}
				variant='ghost'
				size='xs'
				borderRadius='full'
				opacity='0.5'
				_hover={{ opacity: 1, bg: 'rgba(212, 175, 55, 0.1)' }}
				aria-label='Close'
			>
				<MdClose />
			</Button> */}
		</Box>
	);
};

const tokens = {
	gold: {
		gradient: 'linear-gradient(135deg, #F5D67B 0%, #D4AF37 50%, #C9A227 100%)',
	},
};

// Add global animation styles
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
	const styleSheet = document.createElement('style');
	styleSheet.textContent = styles;
	document.head.appendChild(styleSheet);
}

export default AppsDownloadSection;
