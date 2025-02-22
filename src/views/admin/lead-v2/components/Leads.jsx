import { Flex, Grid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import LeadCard from './LeadCard';
import CardLoader from './CardLoader';

const Leads = ({ leads, leadsLoading }) => {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		if (leadsLoading) {
			setIsLoaded(false);
		} else {
			const timer = setTimeout(() => setIsLoaded(true), 1000);
			return () => clearTimeout(timer);
		}
	}, [leadsLoading]);

	return !isLoaded || leadsLoading ? (
		<CardLoader count={12} />
	) : (
		<Grid
			templateColumns={{
				base: '1fr',
				md: 'repeat(1, 1fr)',
				lg: 'repeat(3, 1fr)',
				xl: 'repeat(4, 1fr)',
				'2xl': 'repeat(5, 1fr',
			}}
			gap='2'
		>
			{leads?.doc?.map((lead) => (
				<LeadCard key={lead.id} lead={lead} />
			))}
		</Grid>
	);
};

export default Leads;
