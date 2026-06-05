import React, { useState, useEffect, useRef } from 'react';
import { Box, VStack, HStack, Text, Divider, Stack, useBreakpointValue, Center, Spinner } from '@chakra-ui/react';
import QRCode from 'react-qr-code';
import { FaWhatsapp } from 'react-icons/fa6';
import AppButton from 'components/shared/AppButton';
import { FaChevronLeft } from 'react-icons/fa';
import useUserSession from 'hooks/useUserSession';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from 'hooks/useIsMobile';

const WhatsAppQRLogin = ({ qr }) => {
	const [qrCode, setQrCode] = useState(qr);
	const [isLoading, setIsLoading] = useState(false);
	const { isSuperAdmin } = useUserSession();
	const navigate = useNavigate();

	const isMobile = useIsMobile();
	const qrSize = useBreakpointValue({ base: 180, sm: 200, md: 220, lg: 256 });

	// useEffect(() => {
	// 	if (qr && qr?.trim !== '') {
	// 		console.log('loadiing flase......');
	// 		setIsLoading(false);
	// 		setQrCode(qr);
	// 	} else {
	// 		setIsLoading(true);
	// 	}
	// }, [qr]);

	return (
		// <Box>
		// 	{isSuperAdmin && (
		// 		<HStack justify='space-between' mb='2'>
		// 			<AppButton
		// 				leftIcon={<FaChevronLeft />}
		// 				onClick={() => navigate('/whatsapp/instances')}
		// 			>
		// 				Back
		// 			</AppButton>
		// 		</HStack>
		// 	)}
		// 	<Box
		// 		w='full'
		// 		maxW='6xl'
		// 		m='auto'
		// 		p='4'
		// 		bg='gray.100'
		// 		boxShadow='xl'
		// 		borderRadius='xl'
		// 	>
		// 		<VStack p='8' spacing={6} gap='2' align='stretch'>
		// 			{/* Header */}
		// 			<VStack spacing={3}>
		// 				<HStack spacing={3}>
		// 					<Box
		// 						w='40px'
		// 						h='40px'
		// 						display='flex'
		// 						alignItems='center'
		// 						justifyContent='center'
		// 						bg='green.500'
		// 						rounded='full'
		// 					>
		// 						<FaWhatsapp size='60%' color='white' />
		// 					</Box>
		// 					<Text fontSize='2xl' fontWeight='bold' color='gray.700'>
		// 						WhatsApp Web
		// 					</Text>
		// 				</HStack>
		// 				<Text color='gray.600' textAlign='center' fontSize='sm'>
		// 					Log in to your WhatsApp account
		// 				</Text>
		// 			</VStack>
		// 			<Stack
		// 				flexDir={{ base: 'column', md: 'row' }}
		// 				alignItems={'center'}
		// 				p='8'
		// 				gap={4}
		// 			>
		// 				{/* Instructions */}
		// 				<VStack spacing={3} flex='1' align='start'>
		// 					<Text fontWeight='semibold' color='gray.700'>
		// 						Steps to log in:
		// 					</Text>
		// 					<VStack spacing={2} align='start' pl={4}>
		// 						<Text fontSize='sm' color='gray.600'>
		// 							1. Open WhatsApp on your phone
		// 						</Text>
		// 						<Text fontSize='sm' color='gray.600'>
		// 							2. Tap <strong>Menu</strong> or <strong>Settings</strong>
		// 						</Text>
		// 						<Text fontSize='sm' color='gray.600'>
		// 							3. Tap <strong>Linked devices</strong>, then{' '}
		// 							<strong>Link device</strong>
		// 						</Text>
		// 						<Text fontSize='sm' color='gray.600'>
		// 							4. Scan the QR code to confirm
		// 						</Text>
		// 					</VStack>
		// 				</VStack>
		// 				{/* QR Code Section */}
		// 				<VStack spacing={4}>
		// 					<Box
		// 						p={{ base: 2, md: 4 }}
		// 						border='2px dashed'
		// 						borderColor='green.200'
		// 						borderRadius='lg'
		// 						position='relative'
		// 					>
		// 						{/* {isLoading ? (
		// 						<Box w='256px' h='256px'>
		// 							<Center h='full'>
		// 								<Spinner size='xl' color='green.500' />
		// 							</Center>
		// 						</Box>
		// 					) : ( */}
		// 						<>
		// 							<QRCode
		// 								value={qrCode}
		// 								size={isMobile ? 150 : 256}
		// 								level='H'
		// 								// marginSize={4}
		// 								// fgColor='#25D366'
		// 							/>

		// 							<Box
		// 								position='absolute'
		// 								top='50%'
		// 								left='50%'
		// 								transform='translate(-50%, -50%)'
		// 								bg='white'
		// 								p={1}
		// 								rounded='full'
		// 							>
		// 								{/* <Spinner size='sm' color='green.500' /> */}
		// 								<FaWhatsapp size='32' />
		// 							</Box>
		// 						</>
		// 						{/* )} */}
		// 					</Box>

		// 					{/* Timer */}
		// 					{/* <HStack spacing={1}>
		// 						<Text fontSize='sm' color='gray.500'>
		// 							Time remaining:
		// 						</Text>
		// 						<Text
		// 							fontSize='sm'
		// 							fontWeight='bold'
		// 							color={timeRemaining < 30 ? 'red.500' : 'green.500'}
		// 						>
		// 							{formatTime(timeRemaining)}
		// 						</Text>
		// 					</HStack> */}
		// 				</VStack>
		// 			</Stack>

		// 			<Divider />

		// 			{/* Footer */}
		// 			<VStack spacing={3}>
		// 				<Text fontSize='xs' color='gray.700' textAlign='center'>
		// 					🔒 Your personal messages are end-to-end encrypted
		// 				</Text>
		// 			</VStack>
		// 		</VStack>
		// 	</Box>
		// </Box>

		<Box w="full" minH="100vh" bg="bg.app" py={{ base: 4, md: 6 }}>
			{isSuperAdmin && (
				<HStack justify="space-between" mb={{ base: 2, md: 4 }} px={{ base: 2, md: 0 }}>
					<AppButton
						leftIcon={<FaChevronLeft />}
						onClick={() => navigate('/whatsapp/instances')}
						variant="ghost"
						size={{ base: 'sm', md: 'md' }}
					>
						Back
					</AppButton>
				</HStack>
			)}

			<Box
				w="full"
				maxW={{ base: '95%', sm: '90%', md: '80%', lg: '6xl' }}
				mx="auto"
				p={{ base: 2, sm: 4, md: 6, lg: 8 }}
				bg="bg.surface"
				boxShadow="card"
				borderRadius="xl"
				border="1px solid"
				borderColor="border.default"
			>
				<VStack spacing={{ base: 4, sm: 5, md: 6 }} align="stretch">
					{/* Header */}
					<VStack spacing={2}>
						<HStack spacing={3}>
							<Box
								w={{ base: '36px', sm: '40px', md: '48px' }}
								h={{ base: '36px', sm: '40px', md: '48px' }}
								display="flex"
								alignItems="center"
								justifyContent="center"
								bg="rgba(72, 187, 120, 0.15)"
								borderRadius="full"
							>
								<FaWhatsapp size="60%" color="#48BB78" />
							</Box>
							<Text
								fontSize={{ base: 'xl', sm: '2xl', md: '3xl' }}
								fontWeight="bold"
								color="text.heading"
							>
								WhatsApp Web
							</Text>
						</HStack>
						<Text
							color="text.muted"
							textAlign="center"
							fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
							px={{ base: 2, sm: 4 }}
						>
							Log in to your WhatsApp account
						</Text>
					</VStack>

					{/* Main content: Instructions + QR */}
					<Stack
						direction={{ base: 'column', md: 'row' }}
						alignItems="center"
						spacing={{ base: 6, md: 8 }}
						py={{ base: 4, sm: 6, md: 8 }}
					>
						{/* Instructions */}
						<VStack spacing={3} flex="1" align={{ base: 'center', md: 'start' }}>
							<Text
								fontWeight="semibold"
								color="text.body"
								fontSize={{ base: 'sm', md: 'md' }}
							>
								Steps to log in:
							</Text>
							<VStack
								spacing={2}
								align={{ base: 'center', md: 'start' }}
								pl={{ base: 0, md: 4 }}
								textAlign={{ base: 'center', md: 'left' }}
							>
								<Text fontSize={{ base: 'xs', sm: 'sm' }} color="text.muted">
									1. Open WhatsApp on your phone
								</Text>
								<Text fontSize={{ base: 'xs', sm: 'sm' }} color="text.muted">
									2. Tap <strong>Menu</strong> or <strong>Settings</strong>
								</Text>
								<Text fontSize={{ base: 'xs', sm: 'sm' }} color="text.muted">
									3. Tap <strong>Linked devices</strong>, then{' '}
									<strong>Link device</strong>
								</Text>
								<Text fontSize={{ base: 'xs', sm: 'sm' }} color="text.muted">
									4. Scan the QR code to confirm
								</Text>
							</VStack>
						</VStack>

						{/* QR Code Section */}
						<VStack spacing={3}>
							<Box
								p={{ base: 2, sm: 3, md: 4 }}
								border="2px dashed"
								borderColor="gold.primary"
								borderRadius="xl"
								position="relative"
								bg="bg.surface"
								transition="all 0.2s"
								_hover={{ borderColor: "gold.light", boxShadow: "goldGlow" }}
							>
								{isLoading ? (
									<Center w={`${qrSize}px`} h={`${qrSize}px`}>
										<Spinner size="xl" color="gold.primary" thickness="3px" />
									</Center>
								) : (
									<QRCode
										value={qrCode}
										size={qrSize}
										level="H"
										fgColor='#25D366'
										bgColor="transparent"
									/>
								)}
								<Box
									position="absolute"
									top="50%"
									left="50%"
									transform="translate(-50%, -50%)"
									bg="bg.surface"
									p={1}
									borderRadius="full"
									boxShadow="sm"
								>
									<FaWhatsapp size={isMobile ? 24 : 32} color="#48BB78" />
								</Box>
							</Box>
							{!isLoading && (
								<Text fontSize="xs" color="text.muted">
									Scan with your phone
								</Text>
							)}
						</VStack>
					</Stack>

					<Divider borderColor="border.subtle" />

					{/* Footer */}
					<VStack spacing={2}>
						<Text fontSize={{ base: '2xs', sm: 'xs' }} color="text.muted" textAlign="center">
							🔒 Your personal messages are end-to-end encrypted
						</Text>
					</VStack>
				</VStack>
			</Box>
		</Box>
	);
};

export default WhatsAppQRLogin;
