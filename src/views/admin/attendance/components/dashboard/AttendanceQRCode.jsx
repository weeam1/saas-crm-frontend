import { useEffect, useState } from 'react';
import {
	Box,
	Text,
	Center,
	Image,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	IconButton,
	ModalCloseButton,
	VStack,
	useBreakpointValue,
} from '@chakra-ui/react';
import QRCode from 'react-qr-code';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';

import LOGO from 'assets/logo/logo.png';
import { FaExpand } from 'react-icons/fa';
import { buttonStyle } from 'utils/btn';

// const AttendanceQRCode = () => {
// 	const { data, isLoading, isError, refetch } = useFetchItemsQuery(
// 		{ path: '/attendance/qr/generate-key' },
// 		{ refetchOnMountOrArgChange: true }
// 	);

// 	useEffect(() => {
// 		const interval = setInterval(() => {
// 			refetch();
// 		}, 5000); // 5 seconds

// 		return () => clearInterval(interval);
// 	}, [refetch]);

// 	const qrValue = data?.doc?.code;

// 	if (isLoading) {
// 		return (
// 			<Center>
// 				<Loader />
// 			</Center>
// 		);
// 	}

// 	if (isError || !qrValue) {
// 		return (
// 			<Center>
// 				<Text color='red.500'>Failed to load QR Code.</Text>
// 			</Center>
// 		);
// 	}

// 	return (
// 		<Box
// 			position='relative'
// 			p={2}
// 			bg='brand.400'
// 			borderRadius='md'
// 			boxShadow='md'
// 			width='fit-content'
// 		>
// 			<QRCode value={qrValue} size={160} level='H' marginSize={4} />

// 			{/* Logo Overlay */}
// 			<Box
// 				position='absolute'
// 				top='50%'
// 				left='50%'
// 				transform='translate(-50%, -50%)'
// 				bg='white'
// 				p={1}
// 				borderRadius='md'
// 			>
// 				<Image src={LOGO} boxSize='26px' objectFit='contain' alt='Logo' />
// 			</Box>

// 			<Text mt={2} fontSize='xs' color='gray.100' textAlign='center'>
// 				Scan to mark attendance
// 			</Text>
// 		</Box>
// 	);
// };

const AttendanceQRCode = () => {
	const { data, isLoading, isError, refetch } = useFetchItemsQuery(
		{ path: '/attendance/qr/generate-key' },
		{ refetchOnMountOrArgChange: true }
	);
	const [isFullScreen, setIsFullScreen] = useState(false);

	const qrSize = useBreakpointValue({
		base: 200, // Mobile (0px+)
		sm: 300, // Small devices (480px+)
		md: 400, // Medium devices (768px+)
		lg: 500, // Large devices (992px+)
		xl: 600, // Extra large (1280px+)
	});

	useEffect(() => {
		const interval = setInterval(() => {
			refetch();
		}, 5000); // 5 seconds

		return () => clearInterval(interval);
	}, [refetch]);

	const qrValue = data?.doc?.code;

	if (isLoading) {
		return (
			<Center>
				<Loader />
			</Center>
		);
	}

	if (isError || !qrValue) {
		return null;
	}

	const renderQRCode = (size = 160) => (
		<>
			<QRCode value={qrValue} size={size} level='H' marginSize={4} />
			{/* Logo Overlay */}
			<Box
				position='absolute'
				top='50%'
				left='50%'
				transform='translate(-50%, -50%)'
				bg='white'
				p={1}
				borderRadius='md'
			>
				<Image
					src={LOGO}
					boxSize={`${size / 8}px`}
					objectFit='contain'
					alt='Logo'
				/>
			</Box>
		</>
	);

	return (
		<>
			<VStack>
				{/* <IconButton
					icon={<FaExpand />}
					aria-label='View full screen'
					size='sm'
					color='brand.300'
					variant='ghost'
					_hover={{ bg: 'rgba(255,255,255,0.1)' }}
					onClick={() => setIsFullScreen(true)}
					textAlign='right'
				/> */}

				<Button
					{...buttonStyle}
					variant='solid'
					bg='spftGray.200'
					color='gray.600'
					aria-label='View full screen'
					leftIcon={<FaExpand />}
					justifySelf='flex-end'
					onClick={() => setIsFullScreen(true)}
					display={{ base: 'none', md: 'flex' }}
				>
					View
				</Button>
				<Box
					position='relative'
					p={2}
					bg='brand.400'
					borderRadius='md'
					boxShadow='md'
					width='fit-content'
				>
					{renderQRCode()}

					<Text mt={2} fontSize='xs' color='gray.100' textAlign='center'>
						Scan to mark attendance
					</Text>
				</Box>
			</VStack>

			{/* Full Screen Modal */}
			<Modal
				isOpen={isFullScreen}
				onClose={() => setIsFullScreen(false)}
				size='3xl'
				isCentered
			>
				<ModalOverlay />
				<ModalContent mx='2'>
					<ModalHeader>Attendance QR Code</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Center flexDirection='column'>
							<Box position='relative'>{renderQRCode(qrSize)}</Box>

							{/* <Box position='relative'>{renderQRCode(600)}</Box> */}
							<Text mt={4} fontSize='sm' color='gray.500'>
								Scan this QR code to mark attendance
							</Text>
						</Center>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default AttendanceQRCode;
