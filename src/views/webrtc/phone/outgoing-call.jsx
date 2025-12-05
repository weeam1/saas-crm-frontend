import { Button, Icon, Text, VStack } from '@chakra-ui/react';
import { FaPhone } from 'react-icons/fa';
import { formatPhoneNumber } from 'utils/webrtc';

export const OutGoingCall = ({ number, cancelCall }) => {
	return (
		<VStack alignItems='center' spacing={4} mt='130px' w='full'>
			<Icon as={FaPhone} color='brand.500' width='60px' height='60px' />
			<Text fontSize='15px'>Dialing</Text>
			<Text fontSize='24px' fontWeight='bold'>
				{formatPhoneNumber(number)}
			</Text>

			<Button w='full' colorScheme='brand' onClick={cancelCall}>
				Cancel
			</Button>
		</VStack>
	);
};

export default OutGoingCall;
