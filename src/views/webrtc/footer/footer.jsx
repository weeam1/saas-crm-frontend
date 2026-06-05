import { HStack, Image, Box, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import weeamLogo from 'assets/logo-crm.png';
import SIPSwitch from 'components/switch';
import './styles.css';
import { useDispatch } from 'react-redux';
import { updateSipStatus } from './../../../redux/webrtc/webrtcSlice';
import useUserSession from 'hooks/useUserSession';

function Footer({
	status,
	setStatus,
	sipServerAddress,
	sipUsername,
	sipDomain,
	sipPassword,
	sipDisplayName,
	isSwitchingUserStatus,
	setIsSwitchingUserStatus,
	isOnline,
	setIsOnline,
	onHandleGoOffline,
}) {
	const [isConfigured, setIsConfigured] = useState(false);
	const dispatch = useDispatch();
const {agencyLogo}=useUserSession()
	// **** Add user status in redux store **** //
	useEffect(() => {
		if (status === 'registered' || status === 'disconnected') {
			setIsSwitchingUserStatus(false);
			setIsOnline(status === 'registered');
			dispatch(updateSipStatus(status));
		}
	}, [status, setIsSwitchingUserStatus, setIsOnline, dispatch]);

	useEffect(() => {
		if (sipDomain && sipUsername && sipPassword && sipServerAddress) {
			setIsConfigured(true);
		} else {
			setIsConfigured(false);
		}
	}, [sipDomain, sipUsername, sipPassword, sipServerAddress]);

	return (
		// <HStack
		// 	padding={'15px'}
		// 	justifyContent={'space-between'}
		// 	alignItems={'center'}
		// 	bg={'grey.75'}
		// >
		// 	{isConfigured ? (
		// 		<HStack alignItems={'center'} flexWrap={'nowrap'} className='xs'>
		// 			<SIPSwitch
		// 				isDisabled={isSwitchingUserStatus}
		// 				checked={[isOnline, setIsOnline]}
		// 				onChange={(v) => {
		// 					setIsSwitchingUserStatus(true);
		// 					onHandleGoOffline(v ? 'registered' : 'unregistered');
		// 				}}
		// 			/>
		// 			<Text>You are {isOnline ? 'online' : 'offline'}</Text>
		// 		</HStack>
		// 	) : (
		// 		<span></span>
		// 	)}
		// 	<HStack
		// 		spacing={1}
		// 		alignItems={'start'}
		// 		justify={'flex-end'}
		// 		flexWrap={'wrap'}
		// 		align={'center'}
		// 	>
		// 		<Text fontSize='14px'>Powered by</Text>
		// 		<Image
		// 			src={weeamLogo}
		// 			alt='weeam Logo'
		// 			w='40px'
		// 			h='40px'
		// 			objectFit='contain'
		// 		/>
		// 	</HStack>
		// </HStack>
		<HStack
			px='12px'
			py='10px'
			justifyContent='space-between'
			alignItems='center'
			bg='softGray.100'
			borderBottom='1px solid'
			borderColor='softGray.600'
			spacing={3}
		>
			{/* Left Side — Online Status */}
			{isConfigured ? (
				<HStack spacing={2} alignItems='center' whiteSpace='nowrap'>
					<SIPSwitch
						isDisabled={isSwitchingUserStatus}
						checked={[isOnline, setIsOnline]}
						onChange={(v) => {
							setIsSwitchingUserStatus(true);
							onHandleGoOffline(v ? 'registered' : 'unregistered');
						}}
						size='sm'
					/>

					<Text fontSize='13px' fontWeight='medium' color='gray.700'>
						{isOnline ? 'Online' : 'Offline'}
					</Text>
				</HStack>
			) : (
				<Box w='1px' />
			)}

			{/* Right Side — Powered By */}
			<HStack spacing={1.5} alignItems='center'>
				<Text fontSize='12px' color='gray.800' opacity={0.9}>
					Powered by
				</Text>

				<Image
					src={agencyLogo}
					alt='weam Logo'
					w='32px'
					h='32px'
					objectFit='contain'
					opacity={0.95}
				/>
			</HStack>
		</HStack>
	);
}

export default Footer;
