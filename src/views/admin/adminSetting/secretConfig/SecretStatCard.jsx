import { Box, Flex, Text, Icon, useColorModeValue } from '@chakra-ui/react';

const SecretStatCard = ({ label, value, subtext, icon, color = 'blue' }) => {
	const border = useColorModeValue('gray.100', 'gray.700');
	const bgColor = useColorModeValue(`${color}.50`, `${color}.900/20`);

	return (
		<Box
			bg={bgColor}
			border='1px solid'
			borderColor={border}
			borderRadius='2xl'
			p={6}
			transition='all 0.2s ease'
			_hover={{
				transform: 'translateY(-2px)',
				boxShadow: '0 12px 24px -12px rgba(0,0,0,0.2)',
				borderColor: 'transparent',
			}}
		>
			<Flex direction='column' gap={3}>
				<Box
					p={2.5}
					w='fit-content'
					borderRadius='xl'
					bgGradient={`linear(to-br, ${color}.400, ${color}.600)`}
					boxShadow={`0 4px 10px -4px var(--chakra-colors-${color}-400)`}
				>
					<Icon as={icon} boxSize={5} color='white' />
				</Box>

				<Box>
					<Text fontSize='sm' color='gray.500' letterSpacing='wide' mb={0.5}>
						{label}
					</Text>
					<Text fontSize='3xl' fontWeight='bold' lineHeight='1.2'>
						{value}
					</Text>
					{subtext && (
						<Text fontSize='sm' color='gray.400' mt={2}>
							{subtext}
						</Text>
					)}
				</Box>
			</Flex>
		</Box>
	);
};

export default SecretStatCard;
