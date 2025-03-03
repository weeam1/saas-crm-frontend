import React from 'react';
import EntityField from './EntityField';
import { Flex, Grid } from '@chakra-ui/react';
import InfoSection from './InfoSection';
import { useSelector } from 'react-redux';
import { extractLocationData } from 'utils/helpers';

// const RightCard = ({ lead }) => {
// 	return (
// 		<Flex
// 			flexDir='column'
// 			gap={2}
// 			flex='1'
// 			justifySelf='end'
// 			justifyContent='space-between'
// 			align='center'
// 		>
// 			<Grid
// 				width='100%'
// 				minWidth={{ base: '6rem', md: '8rem' }} // Adaptive min width
// 				templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} // Stacks in small screens
// 				gap={2} // Slightly increased gap for better spacing
// 			>
// 				<EntityField
// 					label='Country'
// 					value={lead?.ip?.split('-')[1]}
// 					valueProps={{ color: '#FF0004' }}
// 				/>
// 				<EntityField
// 					label='Budget'
// 					value={lead.budget}
// 					valueProps={{ color: '#FFBB00' }}
// 				/>
// 				<EntityField
// 					label='Nationality'
// 					value={lead.nationality}
// 					valueProps={{ color: '#FF0004' }}
// 				/>
// 				<EntityField
// 					label='Time to Call'
// 					value='11:40 PM'
// 					valueProps={{ color: 'green.600' }}
// 				/>
// 			</Grid>

// 			<Box mt={3}>
// 				<InfoSection lead={lead} />
// 			</Box>

// 			<Text mt={4} fontSize={leadlabelFontSize} color='gray.900'>
// 				<span style={{ color: '#D3D3D3', marginRight: '4px' }}>Lead time</span>

// 				{formattedDate(lead?.createdDate) || 'N/A'}
// 			</Text>
// 		</Flex>
// 	);
// };

const RightCard = ({ lead }) => {
	const countries = useSelector((state) => state.countries.countryNames);

	const { city, country } = extractLocationData(lead?.ip, countries);

	const hiddenFields = JSON.parse(
		localStorage.getItem('userCustomColumns') || '[]'
	);

	console.log({ hiddenFields });

	return (
		<Flex
			// flex='1'
			minWidth={{ base: '100%', md: 'fit-content' }}
			gap={1}
			flexDirection={{ base: 'row', md: 'column' }}
			// flexGrow='1'
			justifySelf='end'
			// bg='red.400'
			justifyContent='space-between'
			// alignItems={{ base: 'center', md: 'flex-start' }}
			align='flex-start'
			px='2'
		>
			{/* Lead details */}
			<Flex
				// width={{ base: '100%', md: '100%' }}
				// templateColumns={{ base: 'repeat(1, 1fr)', md: '1fr' }}
				// display='flex'
				flexDirection='column'
				// alignItems={{ base: 'flex-start', md: 'start' }}
				// justifyContent='center'
				height='100%'
				gap={2}
				mt={6}
			>
				<EntityField
					label='City'
					value={city}
					valueProps={{ color: '#FF0004' }}
				/>
				<EntityField
					label='Country'
					value={country}
					valueProps={{ color: '#FF0004' }}
				/>
			</Flex>

			{/* Info Section with Responsive Width */}
			<Flex
				// width={{ base: '100%', md: '80%' }}
				flexDirection='column'
				// alignItems={{ base: 'center', md: 'flex-end' }}
				gap={2}
				mt={4}
			>
				<InfoSection lead={lead} />
			</Flex>
		</Flex>
	);
};

export default RightCard;
