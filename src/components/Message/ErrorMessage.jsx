import {
	Box,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from '@chakra-ui/react';

const ErrorMessage = ({ message }) => (
	<Box textAlign='left' mt='4'>
		<Alert
			status='error'
			display='flex'
			alignItems='center'
			gap='2'
			rounded='md'
		>
			<AlertIcon />
			<Box>
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{message}</AlertDescription>
			</Box>
		</Alert>
	</Box>
);

export default ErrorMessage;
