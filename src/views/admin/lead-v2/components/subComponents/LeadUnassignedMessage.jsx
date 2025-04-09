import { Box, Text, Icon } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

const LeadUnassignedMessage = () => {
	return (
		<Box
			display='flex'
			alignItems='center'
			justifyContent='center'
			bg='yellow.100'
			border='1px solid'
			borderColor='yellow.300'
			color='yellow.700'
			p={4}
			borderRadius='md'
			width='100%'
		>
			<Icon as={InfoIcon} boxSize={5} mr={2} />
			<Text fontSize='md' fontWeight='medium'>
				This lead is assigned to another user.
			</Text>
		</Box>
	);
};

export default LeadUnassignedMessage;
