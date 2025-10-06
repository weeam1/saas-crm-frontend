import { Box, Flex, Text, Icon, VStack, Progress } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MotionBox = motion(Box);

const WAConnectionSuccess = ({ loadingChats }) => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		let interval;

		if (loadingChats) {
			setProgress(0);
			interval = setInterval(() => {
				setProgress((prev) => {
					if (prev >= 95) return 95; // stop at 95% until loading finishes
					return prev + 5;
				});
			}, 300);
		} else {
			// once finished → jump to 100
			setProgress(100);
			const timeout = setTimeout(() => setProgress(0), 500); // reset after short delay
			return () => clearTimeout(timeout);
		}

		return () => clearInterval(interval);
	}, [loadingChats]);

	// useEffect(() => {
	// 	let interval;

	// 	if (loadingChats) {
	// 		setProgress(0);
	// 		interval = setInterval(() => {
	// 			setProgress((prev) => (prev >= 100 ? 100 : prev + 10));
	// 		}, 300);
	// 	}

	// 	return () => clearInterval(interval);
	// }, [loadingChats]);

	return (
		<Flex h='80vh' align='center' justify='center'>
			<MotionBox
				bg='gray.100'
				rounded='2xl'
				shadow='lg'
				border='1px solid'
				borderColor='gray.200'
				p={8}
				textAlign='center'
				minW='800px'
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.4 }}
			>
				<VStack spacing={6}>
					<Icon as={CheckCircleIcon} w={14} h={14} color='green.500' />

					<Text fontSize='2xl' fontWeight='bold' color='gray.800'>
						WhatsApp Connected!
					</Text>

					<Text fontSize='md' color='gray.600' lineHeight='tall'>
						{loadingChats
							? 'Syncing your chats and messages...'
							: 'Your chats are now ready to view and manage.'}
					</Text>

					{loadingChats && (
						<Box w='100%'>
							<Progress
								value={progress}
								size='sm'
								colorScheme='green'
								rounded='full'
								hasStripe
								isAnimated
								width='full'
							/>
							<Text fontSize='sm' color='gray.500' mt={2}>
								{progress}% loaded...
							</Text>
						</Box>
					)}
				</VStack>
			</MotionBox>
		</Flex>
	);
};

export default WAConnectionSuccess;
