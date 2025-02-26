import React from 'react';
import EntityField from './EntityField';
import { Flex, Grid } from '@chakra-ui/react';
import InfoSection from './InfoSection';

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
	return (
		<Flex
			gap={1}
			flexDirection={{ base: 'row', lg: 'column' }}
			// flexDirection='column'
			// flex='1'
			flexGrow='1'
			justifySelf='end'
			justifyContent='space-between'
			align={{ base: 'center', md: 'end' }}
		>
			{/* Lead details */}
			<Grid
				width='100%'
				// minWidth={{ base: '6rem', md: '8rem' }}
				templateColumns={{ base: 'repeat(1, 1fr)', md: '1fr' }}
				gap={2}
				// p='1'
				mt='6'
			>
				<EntityField
					label='Time to Call'
					value='11:40 PM'
					valueProps={{ color: 'green.600' }}
				/>
				<EntityField
					label='Source Content'
					value={lead.leadSourceDetails}
					valueProps={{ color: '#FFBB00' }}
					isInfo={true}
				/>
			</Grid>

			<InfoSection lead={lead} />
		</Flex>
	);
};

export default RightCard;
