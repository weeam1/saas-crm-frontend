import { Box, VStack, Text, Icon, useColorModeValue } from '@chakra-ui/react';

const StatCard = ({ title, total, icon, bgColor = 'brand.500' }) => {
	const cardBg = useColorModeValue('white', 'gray.700');
	const iconBg = useColorModeValue('gray.100', 'gray.600');
	const textColor = useColorModeValue('gray.800', 'white');

	return (
		<Box
			bg={cardBg}
			borderRadius='lg'
			p={6}
			shadow='md'
			w='100%'
			maxW='250px'
			textAlign='center'
			_hover={{ transform: 'scale(1.05)', transition: '0.3s ease-in-out' }}
		>
			{/* Icon */}
			<Box
				bg={iconBg}
				borderRadius='full'
				p={4}
				display='inline-flex'
				alignItems='center'
				justifyContent='center'
				mb={4}
			>
				<Icon as={icon} boxSize={10} color={bgColor} />
			</Box>

			{/* Total */}
			<Text fontSize='2xl' fontWeight='bold' color={textColor}>
				{total}
			</Text>

			{/* Title */}
			<Text fontSize='lg' fontWeight='medium' color='gray.500'>
				{title}
			</Text>
		</Box>
	);
};

export default StatCard;
