import { Box, Flex, Text, Icon, Button, VStack } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const WAConnectionSuccess = () => {
	return (
		<Box
			bg='white'
			rounded='lg'
			shadow='sm'
			border='1px solid'
			borderColor='green.200'
			p={8}
			textAlign='center'
			maxW='400px'
			mx='auto'
		>
			<VStack spacing={4}>
				<Icon as={CheckCircleIcon} w={12} h={12} color='green.500' />

				<Text fontSize='2xl' fontWeight='bold' color='gray.800'>
					WhatsApp Connected!
				</Text>

				<Text fontSize='md' color='gray.600' lineHeight='tall'>
					Your WhatsApp is successfully connected and ready to use. You can now
					start managing your chats and messages.
				</Text>

				<Button
					colorScheme='green'
					size='lg'
					mt={4}
					onClick={() => window.location.reload()}
				>
					Refresh Chats
				</Button>
			</VStack>
		</Box>
	);
};

export default WAConnectionSuccess;
