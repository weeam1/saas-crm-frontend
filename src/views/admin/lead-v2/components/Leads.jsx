import { Box, Flex, Grid, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import LeadCard from './LeadCard';
import CardLoader from './CardLoader';
import Pagination from './Pagination';
import SearchBox from './SearchBox';
import DateFilter from './DateFilter';
import NotFoundMessage from 'components/Message/NotFoundMessage';
import LeadsModals from './LeadsModals';

const Leads = ({
	leads,
	leadsLoading,
	leadsRefetching,
	refreshLeads,
	currentPage,
	setCurrentPage,
	hanldePage,
	pageSize,
	setQueryParams,
}) => {
	const {
		isOpen: dateTimeIsOpen,
		onOpen: dateTimeOnOpen,
		onClose: dateTimeOnClose,
	} = useDisclosure();

	console.log('refersh leads: ', typeof refreshLeads);

	const [isLoaded, setIsLoaded] = useState(false);
	const [refetchLoading, setRefetchLoading] = useState(false);

	useEffect(() => {
		setIsLoaded(false); // Reset loading state on page change
		if (!leadsLoading) {
			const timer = setTimeout(() => setIsLoaded(true), 1000);
			return () => clearTimeout(timer);
		}
	}, [leadsLoading, currentPage]); // Reacts to both loading state & page change

	useEffect(() => {
		if (!leadsRefetching) {
			setRefetchLoading(false);
		}
	}, [leadsRefetching]);

	// Modals states
	const [viewLead, setViewLead] = useState({
		isOpen: false,
		lid: null,
	});

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

				<SearchBox dateTimeOnOpen={dateTimeOnOpen} />
			</Flex>

			{/* Date filter */}
			{dateTimeIsOpen && (
				<DateFilter
					isOpen={dateTimeIsOpen}
					onClose={dateTimeOnClose}
					setQueryParams={setQueryParams}
					setRefetchLoading={setRefetchLoading}
					setCurrentPage={setCurrentPage}
				/>
			)}

			{/* divider  */}
			<Box height='2px' my={4} bg='softGray.50' />

			{!isLoaded || leadsLoading || refetchLoading ? (
				<CardLoader count={pageSize} />
			) : leads && leads?.totalLeads > 0 ? (
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
						<LeadCard
							key={lead._id}
							lead={lead}
							refreshLeads={refreshLeads}
							setViewLead={setViewLead}
						/>
					))}
				</Grid>
			) : (
				<NotFoundMessage message={'No leads available at the moment.'} />
			)}

			{/* Modals */}
			<LeadsModals
				refetchData={refreshLeads}
				viewLead={viewLead}
				setViewLead={setViewLead}
			/>
		</Box>
	);
};

export default Leads;
