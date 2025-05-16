import { useEffect } from 'react';
import { Box, Text, Center, Image } from '@chakra-ui/react';
import QRCode from 'react-qr-code';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';

import LOGO from 'assets/logo/logo.png';

const AttendanceQRCode = () => {
	const { data, isLoading, isError, refetch } = useFetchItemsQuery(
		{ path: '/attendance/qr/generate-key' },
		{ refetchOnMountOrArgChange: true }
	);

	useEffect(() => {
		const interval = setInterval(() => {
			refetch();
		}, 60000); // 1 min

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
		return (
			<Center>
				<Text color='red.500'>Failed to load QR Code.</Text>
			</Center>
		);
	}

	return (
		<Box
			position='relative'
			p={2}
			bg='brand.400'
			borderRadius='md'
			boxShadow='md'
			width='fit-content'
		>
			<QRCode value={qrValue} size={160} level='H' marginSize={4} />

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
				<Image src={LOGO} boxSize='26px' objectFit='contain' alt='Logo' />
			</Box>

			<Text mt={2} fontSize='xs' color='gray.100' textAlign='center'>
				Scan to mark attendance
			</Text>
		</Box>
	);
};

export default AttendanceQRCode;
