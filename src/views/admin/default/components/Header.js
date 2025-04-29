import {
	Box,
	Heading,
	Image,
	Text,
	useBreakpointValue,
} from '@chakra-ui/react';
// import DashboardHeader from '../../../../assets/img/dashboard-header.jpeg';

import logo from '../../../../assets/img/logo-crm.png';

const Header = () => {
	// Dynamically adjust text alignment based on screen size
	const textAlign = useBreakpointValue({ base: 'center', md: 'left' });
	return (
		// <>
		// 	<Box
		// 		mb={8}
		// 		style={{
		// 			// backgroundImage: `url(${DashboardHeader})`,
		// 			backgroundSize: 'cover',
		// 			backgroundPosition: 'center',
		// 			backgroundColor: 'white',
		// 			backgroundBlendMode: 'overlay',
		// 			display: 'flex',
		// 			width: '100%',
		// 		}}
		// 		mt={'-15px'}
		// 		h={270}
		// 		w={'100%'}
		// 		px={10}
		// 		py={2}
		// 		fontSize={42}
		// 		flexDir={'column'}
		// 		justifyContent='center'
		// 		color={'white'}
		// 		fontWeight={'bold'}
		// 	>
		// 		<img src={logo} alt='CRM' />
		// 		<Heading size='2xl' color='brand.500' fontWeight='semibold'>
		// 			Weeam Real Estate CRM
		// 		</Heading>
		// 		<Text fontSize='md' color='gray.700' fontWeight='normal'>
		// 			Welcome to the future of real state
		// 		</Text>
		// 	</Box>
		// </>
		<Box
			mb={8}
			mt='-15px'
			// h={{ base: 'auto', md: '270px' }}
			w='100%'
			px={{ base: 6, md: 10 }}
			py={6}
			bg='white'
			backgroundSize='cover'
			backgroundPosition='center'
			backgroundBlendMode='overlay'
			display='flex'
			flexDir='column'
			justifyContent='center'
			alignItems={{ base: 'center', md: 'flex-start' }}
			textAlign={textAlign} // Apply responsive text alignment
		>
			{/* Logo at the top */}
			<Image
				src={logo}
				alt='CRM'
				boxSize={{ base: '50px', md: '80px' }}
				objectFit='contain'
				mb={2}
			/>

			{/* Main Heading */}
			<Heading
				fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }}
				color='brand.500'
				fontWeight='semibold'
			>
				Weeam Real Estate CRM
			</Heading>

			{/* Subtext */}
			<Text
				fontSize={{ base: 'sm', md: 'md' }}
				color='gray.500'
				ml='2'
				fontWeight='normal'
			>
				Welcome to the future of real estate
			</Text>
		</Box>
	);
};

export default Header;
