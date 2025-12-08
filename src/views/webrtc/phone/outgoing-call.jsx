import {
	Button, Icon, Text, VStack, Flex, Box, Avatar, 
  useColorModeValue,
	HStack,
	
 } from '@chakra-ui/react';
import { FaPhone } from 'react-icons/fa';
import { PhoneIcon } from '@chakra-ui/icons';

import { useSelector } from 'react-redux';
import { formatPhoneNumber, maskFormattedNumber } from 'utils/webrtc';

// export const OutGoingCall = ({ number, cancelCall }) => {

// 	const leadDetails = useSelector((state) => state.webrtc.activeCall);
	
// const maskFormattedNumber = (formatted = "") => {
//   return formatted.replace(/(\d{5})$/, "*****");
// };

// const displayContact = leadDetails?.leadName
//   ? leadDetails.leadName
//   : number
//   ? maskFormattedNumber(formatPhoneNumber(number))
//   : "Unknown";
	
// 	return (
// 		<VStack alignItems='center' spacing={4} mt='130px' w='full'>
// 			<Icon as={FaPhone} color='greenish.500' width='60px' height='60px' />
// 			<Text fontSize='15px'>Dialing</Text>
// 			<Text fontSize='20px' fontWeight='bold'>
// 				{displayContact}
// 			</Text>

// 			<Button w='full' colorScheme='red' onClick={cancelCall}>
// 				Cancel
// 			</Button>
// 		</VStack>
// 	);
// };

export const OutGoingCall = ({ number, cancelCall }) => {
  const leadDetails = useSelector((state) => state.webrtc.activeCall);

  const displayContact = leadDetails?.leadName
    ? leadDetails.leadName
    : number
    ? maskFormattedNumber(formatPhoneNumber(number))
			: "Unknown";
	
	const avatarName =   leadDetails?.leadName
    ? leadDetails.leadName
    : number
    ? formatPhoneNumber(number)
			: "Unknown";

  const iconBg = useColorModeValue("green.100", "green.900");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const labelColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Flex
      direction="column"
      align="center"
			justify="space-around"
			
			px={4}
			py={4}
			mt={20}
      textAlign="center"
    >
  
			
			  <Text fontSize="18px" color={labelColor}>
          Calling…
        </Text>

      <VStack spacing={2} mt={6} >
				<Avatar
          size="lg"
          name={avatarName}
        
        />

        <Text fontSize="26px" fontWeight="bold" isTruncated={true} maxW='250px' color={textColor}>
          {displayContact}
        </Text>
      </VStack>

      <Button
        mt={10}
        w="180px"
        h="50px"
        colorScheme="red"
        borderRadius="full"
        fontSize="18px"
        onClick={cancelCall}
        shadow="md"
			>
				<HStack spacing={4}>

				 <Icon as={FaPhone} color="white" w="28px" h="28px"
        style={{ transform: "rotate(225deg)" }} 
					/>
					<Text>

			Cancel
					</Text>
				</HStack>
      </Button>
    </Flex>
  );
};


export default OutGoingCall;
