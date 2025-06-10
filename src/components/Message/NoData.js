import { Box, Image, Text } from '@chakra-ui/react';
import NoDataImg from 'assets/icons/not-found.png';

const NoData = ({ label }) => {
	return (
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			justifyContent='center'
			height='100%'
			textAlign='center'
		>
			<Image src={NoDataImg} alt='No Data' boxSize='150px' mb={4} />
			<Text fontSize={{ base: 'sm', md: 'lg' }} color='gray.500'>
				{`No ${label} available at the moment.`}
			</Text>
		</Box>
	);
};

export default NoData;
