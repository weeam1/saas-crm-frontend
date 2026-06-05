// import { Box, Flex, Text, Icon, useColorModeValue } from '@chakra-ui/react';

// const SecretStatCard = ({ label, value, subtext, icon, color = 'blue' }) => {
// 	const border = useColorModeValue('gray.100', 'gray.700');
// 	const bgColor = useColorModeValue(`${color}.50`, `${color}.900`);

// 	return (
// 		<Box
// 			bg={bgColor}
// 			border='1px solid'
// 			borderColor={border}
// 			borderRadius='xl'
// 			p={{ base: 3, md: 4 }}
// 			transition='all 0.2s ease'
// 			_hover={{
// 				transform: 'translateY(-2px)',
// 				boxShadow: 'lg',
// 			}}
// 			w='100%'
// 		>
// 			<Flex align='center' gap={3}>
// 				<Box
// 					p={2}
// 					borderRadius='lg'
// 					bgGradient={`linear(to-br, ${color}.400, ${color}.600)`}
// 					flexShrink={0}
// 				>
// 					<Icon as={icon} boxSize={{ base: 4, md: 5 }} color='white' />
// 				</Box>

// 				<Box flex='1' minW={0}>
// 					<Text fontSize='xs' color='gray.500' letterSpacing='wide' isTruncated>
// 						{label}
// 					</Text>

// 					<Text
// 						fontSize={{ base: 'lg', md: 'xl' }}
// 						fontWeight='semibold'
// 						lineHeight='short'
// 						isTruncated
// 					>
// 						{value}
// 					</Text>

// 					{subtext && (
// 						<Text fontSize='xs' color='gray.400' mt={1} isTruncated>
// 							{subtext}
// 						</Text>
// 					)}
// 				</Box>
// 			</Flex>
// 		</Box>
// 	);
// };

// export default SecretStatCard;

import { Box, Flex, Text, Icon } from '@chakra-ui/react';

const SecretStatCard = ({ label, value, subtext, icon }) => {
	return (
		<Box
			bg='bg.surface'
			border='1px solid'
			borderColor='border.default'
			borderRadius='xl'
			p={{ base: 4, md: 5 }}
			transition='all 0.2s ease'
			_hover={{
				transform: 'translateY(-2px)',
				boxShadow: 'goldGlow',
				borderColor: 'gold.primary',
			}}
			w='100%'
		>
			<Flex align='center' gap={4}>
				{/* Icon Container with Gold Gradient */}
				<Box
					p={2.5}
					borderRadius='lg'
					bgGradient='linear-gradient(135deg, #F5D67B 0%, #D4AF37 50%, #C9A227 100%)'
					flexShrink={0}
					boxShadow='sm'
				>
					<Icon as={icon} boxSize={{ base: 5, md: 6 }} color='#000000' />
				</Box>

				<Box flex='1' minW={0}>
					<Text
						fontSize='xs'
						color='text.muted'
						letterSpacing='wide'
						fontWeight='medium'
						isTruncated
					>
						{label}
					</Text>

					<Text
						fontSize={{ base: 'xl', md: '2xl' }}
						fontWeight='bold'
						lineHeight='short'
						color='text.heading'
						isTruncated
					>
						{value}
					</Text>

					{subtext && (
						<Text fontSize='xs' color='text.muted' mt={1} isTruncated>
							{subtext}
						</Text>
					)}
				</Box>
			</Flex>
		</Box>
	);
};

export default SecretStatCard;
