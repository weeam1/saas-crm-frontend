import { Box, Flex, Text, Icon, useColorModeValue } from '@chakra-ui/react';

const SecretStatCard = ({ label, value, subtext, icon, color = 'blue' }) => {
	const border = useColorModeValue('gray.100', 'gray.700');
	const bgColor = useColorModeValue(`${color}.50`, `${color}.900`);

	return (
		<Box
			bg={bgColor}
			border='1px solid'
			borderColor={border}
			borderRadius='xl'
			p={{ base: 3, md: 4 }}
			transition='all 0.2s ease'
			_hover={{
				transform: 'translateY(-2px)',
				boxShadow: 'lg',
			}}
			w='100%'
		>
			<Flex align='center' gap={3}>
				<Box
					p={2}
					borderRadius='lg'
					bgGradient={`linear(to-br, ${color}.400, ${color}.600)`}
					flexShrink={0}
				>
					<Icon as={icon} boxSize={{ base: 4, md: 5 }} color='white' />
				</Box>

				<Box flex='1' minW={0}>
					<Text fontSize='xs' color='gray.500' letterSpacing='wide' isTruncated>
						{label}
					</Text>

					<Text
						fontSize={{ base: 'lg', md: 'xl' }}
						fontWeight='semibold'
						lineHeight='short'
						isTruncated
					>
						{value}
					</Text>

					{subtext && (
						<Text fontSize='xs' color='gray.400' mt={1} isTruncated>
							{subtext}
						</Text>
					)}
				</Box>
			</Flex>
		</Box>
	);
};

export default SecretStatCard;
