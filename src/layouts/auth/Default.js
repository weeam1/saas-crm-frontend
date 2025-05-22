// Chakra imports
import { Box, Button, Flex, Image, Link } from '@chakra-ui/react';

import Footer from 'components/footer/FooterAuth';
import FixedPlugin from 'components/fixedPlugin/FixedPlugin';
// import { Link } from 'react-router-dom';
// Custom components
// AssetFoo

import AppleStoreLogo from 'assets/icons/App_Store.png';
import GoogleStoreLogo from 'assets/icons/Google_Play-Logo.wine.png';
import { useFetchItemsQuery } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { constant } from 'constant';

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

function AuthIllustration(props) {
	const { children, illustrationBackground } = props;

	const { data, isLoading } = useFetchItemsQuery(
		{
			path: `/upload/apk`,
		},
		{ refetchOnMountOrArgChange: true }
	);

	const handleDownloadApk = async () => {
		try {
			const apkPath = data?.url;

			if (!apkPath) {
				toast.error('APK file not available');
				return;
			}

			const apkURL = `${constant['baseUrl']}${apkPath}`;

			// Check file existence with HEAD request
			const response = await fetch(apkURL, { method: 'HEAD' });

			if (!response.ok) {
				toast.error('APK file not found on server');
				return;
			}

			// Trigger download
			const link = document.createElement('a');
			link.href = apkURL;
			link.download = apkURL.split('/').pop(); // gets file name
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast.success('Download started');
		} catch (error) {
			console.error('Error downloading APK:', error);
			toast.error('Failed to download APK');
		}
	};

	console.log(data);

	return (
		<Flex h='max-content'>
			<Flex
				h={{
					sm: 'initial',
					md: 'unset',
					lg: '100vh',
					xl: '97vh',
				}}
				className='auth-form'
				pt={{ sm: '50px', md: '0px' }}
				px={{ lg: '30px', xl: '0px' }}
				ps={{ xl: '70px' }}
				alignItems={'center'}
				justifyContent='center'
				direction='column'
			>
				{children}

				{/* App Download Buttons */}
				<Flex gap={4} my={2} _hover>
					<Link onClick={handleDownloadApk}>
						<Image
							src='https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg'
							alt='Google Play'
							height='40px'
						/>
					</Link>

					<Link
						href='https://apps.apple.com/pk/app/weeam-crm/id6744808346'
						isExternal
					>
						<Image
							src='https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg'
							alt='App Store'
							height='40px'
						/>
					</Link>
				</Flex>

				<Footer />
			</Flex>

			<Box
				className='auth-image'
				backgroundSize={'cover'}
				backgroundPosition={'center'}
				height={'100vh'}
				backgroundImage={
					'url(https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'
				}
				width={'50%'}
			></Box>
		</Flex>
	);
}

export default AuthIllustration;
