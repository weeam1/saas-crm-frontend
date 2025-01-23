import {
	Box,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from '@chakra-ui/react';

const ErrorMessage = ({ message }) => (
	<Box textAlign='center' mt='4'>
		<Alert status='error' rounded='md'>
			<AlertIcon />
			<Box>
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{message}</AlertDescription>
			</Box>
		</Alert>
	</Box>
);

export default ErrorMessage;
