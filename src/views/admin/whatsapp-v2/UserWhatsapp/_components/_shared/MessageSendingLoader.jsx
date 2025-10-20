import { Flex, Center, Image, Spinner, Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const MessageSendingLoader = ({ previewURL, type = 'image' }) => {
	return (
		<Flex w='100%' justify='flex-end' mb={2}>
			<Flex
				justify='flex-end'
				align='flex-end'
				w='400px'
				minH='300px'
				// bg={previewURL ? 'transparent' : 'whatsapp.100'}
				rounded='2xl'
				p={2}
				boxShadow='md'
				position='relative'
			>
				<MotionBox
					initial={{ opacity: 0.4, filter: 'blur(6px)' }}
					animate={{ opacity: 1, filter: 'blur(3px)' }}
					transition={{
						duration: 0.8,
						repeat: Infinity,
						repeatType: 'reverse',
					}}
				>
					{previewURL ? (
						<Image
							src={previewURL}
							alt='media preview'
							objectFit='cover'
							w='100%'
							h='100%'
							rounded='2xl'
						/>
					) : (
						<Box
							w='100%'
							h='100%'
							bgGradient='linear(to-br, gray.300, gray.200)'
							rounded='2xl'
						/>
					)}
				</MotionBox>

				<Center
					position='absolute'
					top='50%'
					left='50%'
					transform='translate(-50%, -50%)'
					bg='rgba(0,0,0,0.4)'
					borderRadius='full'
					p={3}
					backdropFilter='blur(4px)'
				>
					<Spinner size='lg' color='white' thickness='3px' speed='0.7s' />
				</Center>
			</Flex>
		</Flex>
	);
};

export default MessageSendingLoader;
