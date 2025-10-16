import { Box, Flex, Text, Icon, VStack, Spinner } from '@chakra-ui/react';
import { motion } from 'framer-motion';
// import { IoMdSync } from 'react-icons/io';

const MotionBox = motion(Box);

const InitialLoading = () => {
	return (
		<Flex h='80vh' align='center' justify='center'>
			<MotionBox
				bg='gray.100'
				rounded='2xl'
				shadow='lg'
				border='1px solid'
				borderColor={'gray.200'}
				p={8}
				textAlign='center'
				minW={{ base: '80vw', md: '40vw' }}
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.4 }}
			>
				<VStack spacing={6} justifyContent='center' align='center'>
					<>
						<Spinner size='xl' color='green.500' speed='0.9s' thickness='4px' />
						<Text fontSize='2xl' fontWeight='bold' color='gray.800'>
							Connecting to WhatsApp...
						</Text>
						<Text fontSize='md' color='gray.600'>
							Please wait while we establish a secure connection.
						</Text>
					</>
				</VStack>
			</MotionBox>
		</Flex>
	);
};

export default InitialLoading;
