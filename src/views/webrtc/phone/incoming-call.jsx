import {
	Button,
	VStack,
	Text,
	Icon,
	HStack,
	Spacer,
	useColorModeValue,
} from '@chakra-ui/react';
import { FaPhone } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { formatPhoneNumber, maskPhoneNumber } from 'utils/webrtc';
import CallAvatar from './CallAvatar';

export const IncommingCall = ({ number, answer, decline }) => {
	const leadDetails = useSelector((state) => state.webrtc.activeCall);

	const formattedNumber = formatPhoneNumber(number);

	const displayContact = leadDetails?.leadName
		? leadDetails.leadName
		: number
			? maskPhoneNumber(formattedNumber)
			: 'Unknown';

	const textColor = useColorModeValue('gray.700', 'gray.200');
	const labelColor = useColorModeValue('gray.500', 'gray.400');

	return (
		<VStack
			direction='column'
			align='center'
			justify='space-around'
			gap={4}
			px={4}
			py={4}
			mt={18}
			w='full'
		>
			{/* <Icon as={FaPhone} color='brand.500' width='30px' height='30px' /> */}

			<Text fontSize='18px' color={labelColor}>
				Incoming Call
			</Text>
			{/* <Text fontSize='24px' fontWeight='bold'>
				{formatPhoneNumber(number)}
			</Text>
 */}

			<VStack spacing={2}>
				<CallAvatar
					leadDetails={leadDetails}
					number={number}
					variant='incoming'
					size='lg'
				/>

				<Text
					fontSize={{ base: 'sm', md: 'md', xl: 'lg' }}
					fontWeight='bold'
					isTruncated={true}
					maxW='250px'
					color={textColor}
				>
					{displayContact}
				</Text>
			</VStack>

			<HStack w='full'>
				<Button
					w='full'
					h='50px'
					borderRadius='full'
					fontSize='18px'
					shadow='md'
					onClick={decline}
					colorScheme='red'
				>
					<HStack spacing={4}>
						<Icon
							as={FaPhone}
							color='white'
							w='28px'
							h='28px'
							style={{ transform: 'rotate(225deg)' }}
						/>
						<Text>Decline</Text>
					</HStack>
				</Button>

				<Spacer />
				<Button
					w='full'
					h='50px'
					borderRadius='full'
					fontSize='18px'
					shadow='md'
					onClick={answer}
					colorScheme='green'
				>
					<HStack spacing={4}>
						<Icon
							as={FaPhone}
							color='white'
							w='28px'
							h='28px'
							style={{ transform: 'rotate(90deg)' }}
						/>
						<Text>Answer</Text>
					</HStack>
				</Button>
			</HStack>
		</VStack>
	);
};

export default IncommingCall;
