import React from 'react';
import EntityField from './EntityField';
import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import InfoSection from './InfoSection';
import { formattedDate } from 'utils/helpers';

const RightCard = ({ lead }) => {
	return (
		<Flex
			flexDir='column'
			gap='1'
			flex='1'
			alignSelf='center'
			justifyContent='center'
			alignItems='center'
			width='fit-content'
		>
			<Grid width='fit-content' templateColumns='1fr 1fr' gap='1'>
				<EntityField
					label='Country'
					value={lead?.ip?.split('-')[1]}
					valueProps={{ color: 'red.600' }}
				/>
				<EntityField
					label='Budget'
					value={lead.budget}
					valueProps={{ color: 'orange.500' }}
				/>
				<EntityField
					label='Nationality'
					value={lead.nationality}
					valueProps={{ color: 'red.600' }}
				/>
				<EntityField
					label='Time to Call'
					value='11: 40 PM'
					valueProps={{ color: 'green.400' }}
				/>
			</Grid>

			<Box alignSelf='center'>
				<InfoSection lead={lead} />
			</Box>
			<Text mt={4} fontSize='7px' color='gray.500'>
				Lead time {formattedDate(lead?.createdDate) || 'N/A'}
			</Text>
		</Flex>
	);
};

export default RightCard;
