import { Box, Text } from '@chakra-ui/react';
import DateFilter from '../DateFilter';

const Header = ({ onFilterChange }) => {
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
			<DateFilter onFilterChange={onFilterChange} />
		</Box>
	);
};

export default Header;
