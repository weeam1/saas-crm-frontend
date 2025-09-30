import { useState, useEffect } from 'react';
import {
	Box,
	Flex,
	Text,
	IconButton,
	useBreakpointValue,
	Image,
	Link,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

const AppDownloadNotificationBar = ({ onDownloadApk }) => {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const isClosed = localStorage.getItem('appNotificationClosed');
		if (isClosed === 'true') {
			setIsVisible(false);
		}
	}, []);

	const handleClose = () => {
		setIsVisible(false);
		localStorage.setItem('appNotificationClosed', 'true');
	};

	const direction = useBreakpointValue({ base: 'column', sm: 'row' });

	if (!isVisible) return null;

	return (
		<Box
			bg='linear-gradient(135deg, #FAF7E7 0%, #B79045 100%)'
			borderBottom='1px solid'
			borderColor='gray.200'
			px={4}
			py={3}
			position='sticky'
			top='0'
			zIndex='1000'
			shadow='md'
		>
			<Flex
				maxW='1200px'
				mx='auto'
				alignItems='center'
				justifyContent='space-between'
				gap={4}
				flexDirection={direction}
			>
				{/* Notification Text */}
				<Flex alignItems='center' gap={3} flex='1'>
					<Text
						fontSize={{ base: 'sm', md: 'md' }}
						fontWeight='semibold'
						color='gray.800'
					>
						🚀 Get Weeam Mobile App
					</Text>
					<Text
						fontSize='sm'
						color='gray.600'
						display={{ base: 'none', md: 'block' }}
					>
						Manage your CRM on the go
					</Text>
				</Flex>

				{/* App Store Buttons */}
				<Flex gap={3} alignItems='center'>
					<Flex gap={3} alignItems='center'>
						{/* Google Play Button */}
						<Link
							onClick={onDownloadApk}
							_hover={{ transform: 'translateY(-2px)', transition: 'all 0.3s' }}
							transition='all 0.3s'
							cursor='pointer'
						>
							<Image
								src='https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg'
								alt='Get it on Google Play'
								height='35px'
								minHeight='35px'
								filter='drop-shadow(0 2px 6px rgba(0, 0, 0, 0.2))'
								_hover={{
									filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
								}}
							/>
						</Link>

						{/* App Store Button */}
						<Link
							href='https://apps.apple.com/pk/app/weeam-crm/id6744808346'
							isExternal
							// onClick={handleAppStoreClick}
							_hover={{ transform: 'translateY(-2px)', transition: 'all 0.3s' }}
							transition='all 0.3s'
						>
							<Image
								src='https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg'
								alt='Download on the App Store'
								height='35px'
								minHeight='35px'
								filter='drop-shadow(0 2px 6px rgba(0, 0, 0, 0.2))'
								_hover={{
									filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
								}}
							/>
						</Link>
					</Flex>

					{/* Close Button */}
					<IconButton
						size='sm'
						variant='ghost'
						icon={<CloseIcon />}
						onClick={handleClose}
						aria-label='Close notification'
						color='gray.600'
						_hover={{ bg: 'gray.100', color: 'gray.800' }}
						ml={2}
					/>
				</Flex>
			</Flex>
		</Box>
	);
};

export default AppDownloadNotificationBar;
