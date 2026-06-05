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
import useUserSession from 'hooks/useUserSession';
import { useModalColors } from 'hooks/useModalColors';

const AttendanceQRCode = () => {
	const { agencyLogo } = useUserSession();
	const colors = useModalColors();
	const { data, isLoading, isError, refetch } = useFetchItemsQuery(
		{ path: '/attendance/qr/generate-key' },
		{ refetchOnMountOrArgChange: true }
	);
	const [isFullScreen, setIsFullScreen] = useState(false);

	const qrSize = useBreakpointValue(
		{
			base: 200,
			sm: 300,
			md: 400,
			lg: 500,
			xl: 600,
		},
		{ fallback: 200 }
	);

	useEffect(() => {
		const interval = setInterval(() => {
			refetch();
		}, 10000);

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

	// Smaller QR code render function
	const renderQRCode = (size = 80) => (
		<>
			<QRCode value={qrValue} size={size} level='H' marginSize={2} />
			{/* Logo Overlay */}
			<Box
				position='absolute'
				top='50%'
				left='50%'
				transform='translate(-50%, -50%)'
				bg={colors.bg}
				p={0.5}
				borderRadius='md'
			>
				<Image
					src={agencyLogo || LOGO}
					boxSize={`${Math.max(size / 10, 12)}px`}
					objectFit='contain'
					alt='Logo'
				/>
			</Box>
		</>
	);

	return (
		<>
			<VStack spacing={1}>
				<Button
					{...buttonStyle}
					variant='ghost'
					color={colors.bodyText}
					aria-label='View full screen'
					leftIcon={<FaExpand />}
					justifySelf='flex-end'
					onClick={() => setIsFullScreen(true)}
					size='xs'
					height='24px'
					fontSize='11px'
					_hover={{
						color: colors.accentGold,
						bg: colors.secondaryBtnHoverBg,
					}}
					transition='all 0.2s ease'
				>
					View
				</Button>
				<Box
					position='relative'
					p={1}
					bg={colors.accentGold}
					borderRadius='md'
					boxShadow={colors.cardShadow}
					width='fit-content'
				>
					{renderQRCode(60)}
				</Box>
			</VStack>

			{/* Full Screen Modal */}
			<Modal
				isOpen={isFullScreen}
				onClose={() => setIsFullScreen(false)}
				size='3xl'
				isCentered
			>
				<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(2px)' />
				<ModalContent mx='2' borderRadius='xl' boxShadow={colors.modalShadow} bg={colors.bg}>
					<ModalHeader
						bg={colors.viewHeaderBg}
						color={colors.viewHeaderText}
						borderBottom={`1px solid ${colors.viewHeaderBorder}`}
						borderTopRadius='xl'
						py={4}
						px={6}
					>
						Attendance QR Code
					</ModalHeader>
					<ModalCloseButton
						color={colors.bodyText}
						_hover={{ color: colors.accentGold, bg: colors.secondaryBtnHoverBg }}
					/>
					<ModalBody>
						<Center flexDirection='column'>
							<Box position='relative'>{renderQRCode(qrSize)}</Box>
							<Text mt={4} fontSize='sm' color={colors.mutedText}>
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