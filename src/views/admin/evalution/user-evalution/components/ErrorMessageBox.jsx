import { Box, Flex, Text, Icon, SlideFade } from '@chakra-ui/react';
import { InfoIcon, WarningIcon, CheckCircleIcon } from '@chakra-ui/icons';

const typeMap = {
	info: {
		icon: InfoIcon,
		color: 'blue.500',
		bg: 'blue.50',
	},
	warning: {
		icon: WarningIcon,
		color: 'orange.500',
		bg: 'orange.50',
	},
	success: {
		icon: CheckCircleIcon,
		color: 'green.500',
		bg: 'green.50',
	},
};

const ErrorMessageBox = ({ type = 'info', message }) => {
	const config = typeMap[type] || typeMap.info;

	return (
		<SlideFade in={true} offsetY='10px'>
			<Flex
				w='100%'
				maxW='800px'
				mx='auto'
				mt={6}
				p={6}
				borderRadius='2xl'
				align='center'
				bg={config.bg}
				border='1px solid'
				borderColor={config.color}
				boxShadow='md'
			>
				<Flex
					w='60px'
					h='60px'
					borderRadius='full'
					bg={`${config.color}20`}
					align='center'
					justify='center'
					mr={5}
				>
					<Icon as={config.icon} boxSize={8} color={config.color} />
				</Flex>

				<Box>
					<Text fontSize='lg' fontWeight='semibold' color={config.color}>
						{type === 'info' && 'Heads Up'}
						{type === 'warning' && 'Warning'}
						{type === 'success' && 'Completed'}
					</Text>

					<Text fontSize='md' mt={1} color='gray.700'>
						{message}
					</Text>
				</Box>
			</Flex>
		</SlideFade>
	);
};

export default ErrorMessageBox;
