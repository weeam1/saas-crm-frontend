import React from 'react';
import { Box, Grid, Text } from '@chakra-ui/react';
import LeadCard from '../Leads/LeadCard';
import NoData from 'components/Message/NoData';

const LeadGrid = ({ leads, approveChangeHandler }) => {
	const gridColumns =
		leads.length === 1
			? {
					base: 'minmax(280px, 350px)',
					md: 'minmax(320px, 350px)',
					lg: 'minmax(350px, 350px)',
				}
			: leads.length === 2
				? {
						base: 'repeat(auto-fit, minmax(280px, 1fr))',
						md: 'repeat(2, minmax(320px, 1fr))',
						lg: 'repeat(2, minmax(350px, 350px))',
					}
				: {
						base: 'repeat(auto-fit, minmax(280px, 1fr))',
						md: 'repeat(2, minmax(320px, 1fr))',
						lg: 'repeat(auto-fit, minmax(340px, 1fr))',
					};

	return (
		<Box minH='100vh' overflowX='hidden' w='100%'>
			{leads.length > 0 ? (
				<Grid
					sx={{
						gridTemplateColumns: gridColumns,
						gap: { base: 3, md: 4, lg: 4 },
						p: { base: 2, md: 4 },
						width: '100%',
						maxW: '100%',
						overflowX: 'hidden',
						alignItems: 'start',
						justifyContent: leads.length === 1 ? 'start' : 'start',
					}}
				>
					{leads.map((lead, index) => (
						<Box key={lead._id || index} w='100%' minW='0'>
							<LeadCard {...lead} approveChangeHandler={approveChangeHandler} />
						</Box>
					))}
				</Grid>
			) : (
				<Box textAlign='center'>
					<NoData label='leads' />
				</Box>
			)}
		</Box>
	);
};

export default LeadGrid;
