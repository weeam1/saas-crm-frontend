import { Box, Flex, Grid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import LeadCard from './LeadCard';
import CardLoader from './CardLoader';
import Pagination from './Pagination';
import ErrorMessage from 'components/Message/ErrorMessage';
import SearchBox from './SearchBox';

const Leads = ({ leads, leadsLoading, currentPage, hanldePage, pageSize }) => {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		setIsLoaded(false); // Reset loading state on page change
		if (!leadsLoading) {
			const timer = setTimeout(() => setIsLoaded(true), 1000);
			return () => clearTimeout(timer);
		}
	}, [leadsLoading, currentPage]); // Reacts to both loading state & page change

	return (
		<Box>
			<Flex
				width='full'
				justifyContent='space-between'
				alignItems='center'
				gap='2'
				flexDirection={{ base: 'column', md: 'row' }}
			>
				{/* Pagination */}
				<Pagination
					currentPage={currentPage}
					totalPages={leads?.totalPages ?? ''}
					onPageChange={hanldePage}
					totalItems={leads?.totalLeads ?? ''}
					itemsPerPage={pageSize}
				/>

				<SearchBox />
			</Flex>

			{/* Leads  */}
			<Box height='2px' my={4} bg='softGray.50' />

			{!isLoaded || leadsLoading ? (
				<CardLoader count={pageSize} />
			) : leads ? (
				<Grid
					templateColumns={{
						base: '1fr',
						md: 'repeat(2, 1fr)',
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
			) : (
				<ErrorMessage
					message={'Sorry, leads not found, Please try again later.'}
				/>
			)}
		</Box>
	);
};

export default Leads;
