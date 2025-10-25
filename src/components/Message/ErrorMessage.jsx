// import {
// 	Box,
// 	Alert,
// 	AlertIcon,
// 	AlertTitle,
// 	AlertDescription,
// } from '@chakra-ui/react';

// const ErrorMessage = ({ message }) => (
// 	<Box textAlign='left' mt='4'>
// 		<Alert
// 			status='error'
// 			display='flex'
// 			alignItems='center'
// 			gap='2'
// 			rounded='md'
// 		>
// 			<AlertIcon />
// 			<Box>
// 				<AlertTitle>Error</AlertTitle>
// 				<AlertDescription>{message}</AlertDescription>
// 			</Box>
// 		</Alert>
// 	</Box>
// );

// export default ErrorMessage;

import React from 'react';
import {
	Box,
	Flex,
	Text,
	Icon,
	Button,
	useColorModeValue,
} from '@chakra-ui/react';
import {
	MdErrorOutline,
	MdWarningAmber,
	MdInfoOutline,
	MdCheckCircleOutline,
} from 'react-icons/md';

const formatError = (msg = '') => {
	if (!msg) return 'Something went wrong. Please try again.';

	const lower = msg.toLowerCase();

	if (lower.includes('network'))
		return 'Network error — please check your internet connection.';
	if (lower.includes('timeout'))
		return 'Request timed out. Please try again later.';
	if (lower.includes('unauthorized') || lower.includes('token'))
		return 'Your session expired. Please log in again.';
	if (lower.includes('not found'))
		return 'The requested resource could not be found.';

	if (lower.includes('server'))
		return 'Server error — please try again shortly.';

	return msg.charAt(0).toUpperCase() + msg.slice(1);
};

const ICONS = {
	error: MdErrorOutline,
	warning: MdWarningAmber,
	info: MdInfoOutline,
	success: MdCheckCircleOutline,
};

const COLORS = {
	error: 'red.500',
	warning: 'yellow.500',
	info: 'blue.500',
	success: 'green.500',
};

const ErrorMessage = ({
	message,
	type = 'error',
	title,
	actionText,
	onAction,
}) => {
	const IconType = ICONS[type];
	const color = COLORS[type];

	const bg = useColorModeValue('gray.50', 'gray.800');
	const boxShadow = useColorModeValue('lg', 'dark-lg');

	return (
		<Flex align='center' justify='center' minH='80vh' bg={bg} px={6} py={10}>
			<Box
				maxW='md'
				w='full'
				textAlign='center'
				bg={useColorModeValue('white', 'gray.900')}
				p={8}
				rounded='2xl'
				boxShadow={boxShadow}
				borderWidth='1px'
				borderColor={useColorModeValue('gray.200', 'gray.700')}
			>
				<Flex justify='center' mb={4}>
					<Icon as={IconType} boxSize={16} color={color} />
				</Flex>

				{title && (
					<Text fontSize='2xl' fontWeight='bold' mb={2} color={color}>
						{title}
					</Text>
				)}

				<Text
					fontSize={{ base: 'md', lg: 'lg' }}
					color={useColorModeValue('gray.600', 'gray.300')}
					mb={6}
				>
					{formatError(message)}
				</Text>

				{actionText && (
					<Button
						size='md'
						colorScheme={type === 'error' ? 'red' : 'blue'}
						onClick={onAction}
						borderRadius='full'
						px={6}
					>
						{actionText}
					</Button>
				)}
			</Box>
		</Flex>
	);
};

export default ErrorMessage;
