import React from 'react';
import { Box, Grid, Text } from '@chakra-ui/react';
import LeadCard from '../Leads/LeadCard';
import NoData from 'components/Message/NoData';

const LeadGrid = ({ leads, approveChangeHandler }) => {
	// const gridColumns =
	// 	leads.length === 1
	// 		? {
	// 				base: 'minmax(280px, 350px)',
	// 				md: 'minmax(320px, 350px)',
	// 				lg: 'minmax(350px, 350px)',
	// 			}
	// 		: leads.length === 2
	// 			? {
	// 					base: 'repeat(auto-fit, minmax(280px, 1fr))',
	// 					md: 'repeat(2, minmax(320px, 1fr))',
	// 					lg: 'repeat(2, minmax(350px, 350px))',
	// 				}
	// 			: {
	// 					base: 'repeat(auto-fit, minmax(280px, 1fr))',
	// 					md: 'repeat(2, minmax(320px, 1fr))',
	// 					lg: 'repeat(auto-fit, minmax(340px, 1fr))',
	// 				};
	const gridColumns = {
		// >= 0px
		'@media (min-width: 0px)': {
			gridTemplateColumns: '1fr',
		},
		// // >= 812px
		// '@media (min-width: 812px)': {
		// 	gridTemplateColumns: '1fr',
		// },
		// >= 992px
		'@media (min-width: 700px)': {
			gridTemplateColumns: 'repeat(2, 1fr)',
		},
		// >= 1280px
		'@media (min-width: 1180px)': {
			gridTemplateColumns: 'repeat(3, 1fr)',
		},
		// >= 1664px
		'@media (min-width: 1664px)': {
			gridTemplateColumns: 'repeat(4, 1fr)',
		},
		// >= 1920px (e.g., Full HD+)
		'@media (min-width: 2120px)': {
			gridTemplateColumns: 'repeat(5, 1fr)',
		},
		// >= 2560px (2.5K / QHD)
		'@media (min-width: 2560px)': {
			gridTemplateColumns: 'repeat(6, 1fr)',
		},
		// >= 3840px (4K)
		'@media (min-width: 3840px)': {
			gridTemplateColumns: 'repeat(7, 1fr)',
		},
		// >= 7680px (8K)
		'@media (min-width: 7680px)': {
			gridTemplateColumns: 'repeat(8, 1fr)',
		},
	};

	return (
		<Box minH='100vh' overflowX='hidden' w='100%'>
			{leads.length > 0 ? (
				<Grid
					sx={{
						// >= 0px
						'@media (min-width: 0px)': {
							gridTemplateColumns: '1fr',
						},
						// // >= 812px
						// '@media (min-width: 812px)': {
						// 	gridTemplateColumns: '1fr',
						// },
						// >= 992px
						'@media (min-width: 700px)': {
							gridTemplateColumns: 'repeat(2, 1fr)',
						},
						// >= 1280px
						'@media (min-width: 1180px)': {
							gridTemplateColumns: 'repeat(3, 1fr)',
						},
						// >= 1664px
						'@media (min-width: 1664px)': {
							gridTemplateColumns: 'repeat(4, 1fr)',
						},
						// >= 1920px (e.g., Full HD+)
						'@media (min-width: 2120px)': {
							gridTemplateColumns: 'repeat(5, 1fr)',
						},
						// >= 2560px (2.5K / QHD)
						'@media (min-width: 2560px)': {
							gridTemplateColumns: 'repeat(6, 1fr)',
						},
						// >= 3840px (4K)
						'@media (min-width: 3840px)': {
							gridTemplateColumns: 'repeat(7, 1fr)',
						},
						// >= 7680px (8K)
						'@media (min-width: 7680px)': {
							gridTemplateColumns: 'repeat(8, 1fr)',
						},
						gap: '2',
						// gap: { base: 3, md: 4, lg: 4 },
						p: { base: 1, md: 2, lg: 4 },
						// width: '100%',
						// maxW: '100%',
						// overflowX: 'hidden',
						// alignItems: 'start',
						// justifyContent: leads.length === 1 ? 'start' : 'start',
					}}
				>
					{leads.map((lead, index) => (
						// <Box key={lead._id || index}>
						<LeadCard
							key={lead?._id}
							{...lead}
							approveChangeHandler={approveChangeHandler}
						/>
						// </Box>
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
