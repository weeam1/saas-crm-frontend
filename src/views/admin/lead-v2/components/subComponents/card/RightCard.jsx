import React from 'react';
import EntityField from './EntityField';
import { Box, Grid, Text } from '@chakra-ui/react';
import InfoSection from './InfoSection';

const RightCard = () => {
	return (
		<Box
			display='flex'
			flexDir='column'
			gap='1'
			flex='1'
			alignSelf='end'
			width='fit-content'
		>
			<Grid width='fit-content' templateColumns='1fr 1fr' gap='1'>
				<EntityField
					label='Country'
					value='Pakistan'
					valueProps={{ color: 'red.600' }}
				/>
				<EntityField
					label='Budget'
					value='14 Million'
					valueProps={{ color: 'orange.500' }}
				/>
				<EntityField
					label='Nationality'
					value='Pak'
					valueProps={{ color: 'red.600' }}
				/>
				<EntityField
					label='Time to Call'
					value='11: 40 PM'
					valueProps={{ color: 'green.400' }}
				/>
			</Grid>

			<Box>
				<InfoSection />
			</Box>
			<Text mt={4} fontSize='7px' color='gray.500'>
				Lead time Thu, Feb 13, 2025
			</Text>
		</Box>
	);
};

export default RightCard;
