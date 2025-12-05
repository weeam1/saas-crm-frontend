import { Button, VStack, Text, Icon, HStack, Spacer } from '@chakra-ui/react';
import { FaPhone } from 'react-icons/fa';
import { formatPhoneNumber } from 'utils/webrtc';

export const IncommingCall = ({ number, answer, decline }) => {
	return (
		<VStack alignItems='center' spacing={4} mt='130px' w='full'>
			<Icon as={FaPhone} color='brand.500' width='30px' height='30px' />
			<Text fontSize='15px'>Incoming call from</Text>
			<Text fontSize='24px' fontWeight='bold'>
				{formatPhoneNumber(number)}
			</Text>

			<HStack w='full'>
				<Button w='full' colorScheme='brand' onClick={decline}>
					Decline
				</Button>

				<Spacer />
				<Button w='full' colorScheme='green' onClick={answer}>
					Answer
				</Button>
			</HStack>
		</VStack>
	);
};

export default IncommingCall;
