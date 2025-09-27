import React, { useState, useEffect, useRef } from 'react';
import {
	Box,
	VStack,
	HStack,
	Text,
	Center,
	Divider,
	Spinner,
	Image,
} from '@chakra-ui/react';
import QRCode from 'react-qr-code';
import { FaWhatsapp } from 'react-icons/fa6';

const WhatsAppQRLogin = () => {
	const qr =
		'2@w/iBpi4BQ6s8WVJ4X2VXHZJGCY3WQ3JsiIkyNJGm1LXCkas7SzfpFQR0/JwXSYcm72nhOa0Y6D7WPYR1ir8mQuwMaHwrVSSdO6M=,T2pvQkylg3KH7F5jbcJwA6nnKMz3YDuuXorO2iZiryU=,1O8dpAWb9A9/EbtIVEzqIqFallLUxUQV35ejgwSPmVQ=,V11xJAZgjtfZbsuy58zHaGJ78fpwX0WJ4ajDN3KJ+kM=,1';
	const [qrCode, setQrCode] = useState(qr);
	const [isLoading, setIsLoading] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes
	const socketRef = useRef(null);

	// Timer countdown
	useEffect(() => {
		if (timeRemaining <= 0) {
			handleQRExpired();
			return;
		}

		const timer = setInterval(() => {
			setTimeRemaining((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [timeRemaining]);

	const generateNewQRCode = () => {
		setIsLoading(false);
	};

	const handleQRExpired = () => {
		generateNewQRCode();
	};

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const handlePhoneLogin = () => {
		// Redirect to phone number login flow
		console.log('Redirect to phone login');
	};

	return (
		<Box minH='100vh' maxW='6xl' m='auto' bg='gray.50' p={4}>
			<Box w='full' boxShadow='xl' borderRadius='xl'>
				<VStack p='8' spacing={6} align='stretch'>
					{/* Header */}
					<VStack spacing={3}>
						<HStack spacing={3}>
							<Box w='40px' h='40px'>
								<Image
									src='https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg'
									alt='WhatsApp'
									fallback={
										<Box w='full' h='full' bg='green.500' borderRadius='lg' />
									}
								/>
							</Box>
							<Text fontSize='2xl' fontWeight='bold' color='gray.700'>
								WhatsApp Web
							</Text>
						</HStack>
						<Text color='gray.600' textAlign='center' fontSize='sm'>
							Log in to your WhatsApp account
						</Text>
					</VStack>
					<HStack p='8'>
						{/* Instructions */}
						<VStack spacing={3} flex='1' align='start'>
							<Text fontWeight='semibold' color='gray.700'>
								Steps to log in:
							</Text>
							<VStack spacing={2} align='start' pl={4}>
								<Text fontSize='sm' color='gray.600'>
									1. Open WhatsApp on your phone
								</Text>
								<Text fontSize='sm' color='gray.600'>
									2. Tap <strong>Menu</strong> or <strong>Settings</strong>
								</Text>
								<Text fontSize='sm' color='gray.600'>
									3. Tap <strong>Linked devices</strong>, then{' '}
									<strong>Link device</strong>
								</Text>
								<Text fontSize='sm' color='gray.600'>
									4. Scan the QR code to confirm
								</Text>
							</VStack>
						</VStack>
						{/* QR Code Section */}
						<VStack spacing={4}>
							<Box
								p={4}
								border='2px dashed'
								borderColor='green.200'
								borderRadius='lg'
								position='relative'
							>
								{isLoading ? (
									<Box w='256px' h='256px'>
										<Center h='full'>
											<Spinner size='xl' color='green.500' />
										</Center>
									</Box>
								) : (
									<>
										<QRCode
											value={qrCode}
											size={256}
											level='H'
											marginSize={4}
											// fgColor='#25D366'
										/>

										<Box
											position='absolute'
											top='50%'
											left='50%'
											transform='translate(-50%, -50%)'
											bg='white'
											p={1}
											rounded='full'
										>
											{/* <Spinner size='sm' color='green.500' /> */}
											<FaWhatsapp size='32' />
										</Box>
									</>
								)}
							</Box>

							{/* Timer */}
							{/* <HStack spacing={1}>
								<Text fontSize='sm' color='gray.500'>
									Time remaining:
								</Text>
								<Text
									fontSize='sm'
									fontWeight='bold'
									color={timeRemaining < 30 ? 'red.500' : 'green.500'}
								>
									{formatTime(timeRemaining)}
								</Text>
							</HStack> */}
						</VStack>
					</HStack>

					<Divider />

					{/* Footer */}
					<VStack spacing={3}>
						<Text fontSize='xs' color='green.600' textAlign='center'>
							🔒 Your personal messages are end-to-end encrypted
						</Text>
					</VStack>
				</VStack>
			</Box>
		</Box>
	);
};

export default WhatsAppQRLogin;
