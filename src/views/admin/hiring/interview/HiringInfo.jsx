import { Box, Button, Heading } from '@chakra-ui/react';
import React from 'react';

const HiringInfo = () => {
	return (
		<Box bg='softGray.100' p={4}>
			<Heading size='md' color='gray.800'>
				Hiring Information
			</Heading>
			<Button
				bg='#EDC270'
				color='gray.800'
				fontSize='sm'
				fontWeight='normal'
				shadow='sm'
				rounded='md'
				_hover={{ bg: '#E0B960' }}
				_active={{ bg: '#D4AC50' }}
				w='full'
				mt={6}
				// onClick={() => handleSendInvite(selectedIds)}
				// isDisabled={selectedIds.length === 0}
			>
				Next
			</Button>
		</Box>
	);
};

export default HiringInfo;
