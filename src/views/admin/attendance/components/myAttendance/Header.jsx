import { Box, Button, Text } from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import { RiEqualizerLine } from 'react-icons/ri';

const Header = () => {
	return (
		<Box
			display='flex'
			justifyContent='space-between'
			alignItems='center'
			mb={4}
			flexDirection={{ base: 'column', md: 'row' }}
			gap={{ base: 4, md: 0 }}
		>
			<Text fontWeight='bold' fontSize={{ base: '18px', md: '20px' }}>
				Attendance Overview
			</Text>
			<Box
				gap={4}
				display='flex'
				flexDirection={{ base: 'column', md: 'row' }}
				w={{ base: '100%', md: 'auto' }}
			>
				<Button
					h='48px'
					leftIcon={<CalendarIcon />}
					bg='#D5D9DD'
					borderRadius='md'
					w={{ base: '100%', md: 'auto' }}
				>
					Jan 2025
				</Button>

				<Button
					h='48px'
					w={{ base: '100%', md: '214px' }}
					leftIcon={<RiEqualizerLine />}
					bgGradient='linear(to-r, #4B74FF, #0043FF)'
					color='white'
					_hover={{ bgGradient: 'linear(to-r, #3A5FCC, #0033CC)' }}
					borderRadius='md'
				>
					Advanced Filters
				</Button>
			</Box>
		</Box>
	);
};

export default Header;
