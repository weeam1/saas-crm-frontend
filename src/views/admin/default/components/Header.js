import { Box, Heading, Text } from '@chakra-ui/react';
import DashboardHeader from '../../../../assets/img/dashboard-header.jpeg';

const Header = () => {
	return (
		<>
			<Box
				mb={8}
				style={{
					// backgroundImage: `url(${DashboardHeader})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundColor: 'white',
					backgroundBlendMode: 'overlay',
					display: 'flex',
					width: '100%',
				}}
				mt={'-15px'}
				h={270}
				w={'100%'}
				px={10}
				py={2}
				fontSize={42}
				flexDir={'column'}
				justifyContent='center'
				color={'white'}
				fontWeight={'bold'}
			>
				<Heading size='2xl' color='brand.500' fontWeight='semibold'>
					Weeam Real Estate CRM
				</Heading>
			</Box>
		</>
	);
};

export default Header;
