import { Box, Text } from '@chakra-ui/react';

const NotFoundMessage = ({ message }) => (
	<Box textAlign='center' mt='4'>
		<Text fontSize='xl' color='gray.500'>
			{message}
		</Text>
	</Box>
);

export default NotFoundMessage;
