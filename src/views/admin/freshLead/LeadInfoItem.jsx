import {
	Box,
	HStack,
	VStack,
	Text,
	Tooltip,
	Icon,
	useColorModeValue,
} from '@chakra-ui/react';

export default function LeadInfoItem({
	icon,
	label,
	value,
	color = 'gray',
	tooltip,
}) {
	const bg = useColorModeValue('white', 'gray.800');
	const border = useColorModeValue('gray.100', 'gray.700');

	return (
		<Box
			w='full'
			bg={bg}
			p={{ base: 3, md: 4 }}
			borderRadius='xl'
			border='1px solid'
			borderColor={border}
			_hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
			transition='all 0.2s ease'
		>
			<HStack spacing={2} align='start'>
				<Icon as={icon} color={`${color}.500`} boxSize={4} mt={1} />

				<VStack align='start' spacing={1} w='full'>
					<Text
						fontSize={{ base: 'xs', md: 'sm' }}
						color='gray.500'
						fontWeight='medium'
						letterSpacing='wide'
					>
						{label}
					</Text>

					<Tooltip label={tooltip || value} isDisabled={!tooltip}>
						<Text
							fontSize={{ base: 'sm', md: 'md' }}
							fontWeight='semibold'
							color={`${color}.600`}
							noOfLines={1}
							w='full'
						>
							{value || 'N/A'}
						</Text>
					</Tooltip>
				</VStack>
			</HStack>
		</Box>
	);
}
