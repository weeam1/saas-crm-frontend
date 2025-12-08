import { Button, VStack, Text, Icon, HStack, Spacer, useColorModeValue, Avatar } from '@chakra-ui/react';
import { FaPhone } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { formatPhoneNumber, maskFormattedNumber } from 'utils/webrtc';

export const IncommingCall = ({ number, answer, decline }) => {

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
	
		const textColor = useColorModeValue("gray.700", "gray.200");
	const labelColor = useColorModeValue("gray.500", "gray.400");
	
	return (
		<VStack
				direction="column"
						align="center"
						justify="space-around"
						px={4}
						py={4}
						mt={20}
						textAlign="center"
		w='full'>
			{/* <Icon as={FaPhone} color='brand.500' width='30px' height='30px' /> */}

				
							<Text fontSize="18px" color={labelColor}>
							Incoming Call
							</Text>
			{/* <Text fontSize='24px' fontWeight='bold'>
				{formatPhoneNumber(number)}
			</Text>
 */}

			
						<VStack spacing={2} mt={6} >
							<Avatar
								size="lg"
								name={avatarName}
							
							/>
			
							<Text fontSize="26px" fontWeight="bold" isTruncated={true} maxW='250px' color={textColor}>
								{displayContact}
							</Text>
						</VStack>


			<HStack w='full'>
												<Button w='full'
													 h="50px"
												borderRadius="full"
												fontSize="18px"
					shadow="md"
					onClick={decline}
													colorScheme='red' >
														<HStack spacing={4}>
													
																	 <Icon as={FaPhone} color="white" w="28px" h="28px"
																	style={{ transform: "rotate(135deg)" }} 
																		/>
																		<Text>
													
																Decline
																		</Text>
																	</HStack>
													
												</Button>
								
												<Spacer />
												<Button w='full'
												h="50px"
												borderRadius="full"
												fontSize="18px"
					shadow="md"
					 onClick={answer}
													colorScheme='green'>
														<HStack spacing={4}>
													
																	 <Icon as={FaPhone} color="white" w="28px" h="28px"
																	style={{ transform: "rotate(10deg)" }} 
																		/>
																		<Text>
																					Answer
																		</Text>
																	</HStack>
												</Button>
											</HStack>

		</VStack>
	);
};

export default IncommingCall;
