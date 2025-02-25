import { Box, Flex, Grid, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import LeadCard from './LeadCard';
import CardLoader from './CardLoader';
import Pagination from './Pagination';
import SearchBox from './SearchBox';
import DateFilter from './DateFilter';
import NotFoundMessage from 'components/Message/NotFoundMessage';
import LeadsModals from './LeadsModals';
import { HasAccess } from './../../../../redux/accessUtils';
import AdvancedSearchModal from './AdvancedSearchModal';
import SearchTags from './SearchTags';

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
	addLead,
	setAddLead,
	selectedValues,
	setSelectedValues,
	selectAllChecked,
	setSelectAllChecked,
	refetchLoading,
	setRefetchLoading,
}) => {
	const {
		isOpen: dateTimeIsOpen,
		onOpen: dateTimeOnOpen,
		onClose: dateTimeOnClose,
	} = useDisclosure();

	const [permission, emailAccess, callAccess] = HasAccess([
		'Lead',
		'Email',
		'Call',
	]);

	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		setIsLoaded(false); // Reset loading state on page change
		if (!leadsLoading) {
			const timer = setTimeout(() => setIsLoaded(true), 1500);
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
	const [editLead, setEditLead] = useState(false);
	const [leadDetails, setLeadDetails] = useState(null);
	const [sendEmail, setSendEmail] = useState(false);
	const [deleteLead, setDeleteLead] = useState(false);

	const [advanceSearch, setAdvanceSearch] = useState(false);

	// const [formValues, setFormValues] = useState([]);
	const [isFormReset, setIsFormReset] = useState(false);
	const [searchTags, setSearchTags] = useState([]);
	const [searchClear, setSearchClear] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	const handleClear = () => {
		setSearchTags([]);
		setSearchTerm('');
		setIsFormReset(true);
		setSearchClear(false);
		setRefetchLoading(true);
		setQueryParams((prev) => {
			const { data, dateTime, ...rest } = prev; // Remove 'data' key
			return {
				...rest,
				page: 1,
			};
		});
	};

	const handleSearchByName = () => {
		if (!searchTerm) {
			return;
		}

		const searchKey = [`leadName: ${searchTerm}`];

		setSearchClear(true);
		setSearchTags(searchKey);

		setQueryParams((prev) => ({
			...prev,
			page: 1, // Reset to first page on new search
			data: JSON.stringify({ leadName: searchTerm }),
		}));

		setRefetchLoading(true);
	};

	return (
		<Box>
			<Flex
				width='full'
				// justifyContent='space-between'
				// alignItems='center'
				gap='2'
				// flexDirection={{ base: 'column', lg: 'row' }}
				flexDirection='column'
			>
				{/* Pagination */}
				<Pagination
					currentPage={currentPage}
					totalPages={leads?.totalPages ?? ''}
					onPageChange={hanldePage}
					totalItems={leads?.totalLeads ?? ''}
					itemsPerPage={pageSize}
					leadsRefetching={leadsRefetching}
				/>

				<SearchBox
					dateTimeOnOpen={dateTimeOnOpen}
					setQueryParams={setQueryParams}
					setAdvanceSearch={setAdvanceSearch}
					handleClear={handleClear}
					searchClear={searchClear}
					handleSearchByName={handleSearchByName}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
				/>
			</Flex>

			{/* Search tags */}
			<SearchTags searchTags={searchTags} />

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
							emailAccess={emailAccess}
							permission={permission}
							setLeadDetails={setLeadDetails}
							callAccess={callAccess}
							setViewLead={setViewLead}
							setEditLead={setEditLead}
							setAddLead={setAddLead}
							setSendEmail={setSendEmail}
							selectedValues={selectedValues}
							setSelectedValues={setSelectedValues}
							setDeleteLead={setDeleteLead}
							setSelectAllChecked={setSelectAllChecked}
							selectAllChecked={selectAllChecked}
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
				editLead={editLead}
				setEditLead={setEditLead}
				lead={leadDetails}
				addLead={addLead}
				setAddLead={setAddLead}
				sendEmail={sendEmail}
				setSendEmail={setSendEmail}
				selectedValues={selectedValues}
				setSelectedValues={setSelectedValues}
				deleteLead={deleteLead}
				setDeleteLead={setDeleteLead}
			/>

			{/* Date time filter */}
			<DateFilter
				setQueryParams={setQueryParams}
				setRefetchLoading={setRefetchLoading}
				setCurrentPage={setCurrentPage}
				onClose={dateTimeOnClose}
				isOpen={dateTimeIsOpen}
				setSearchClear={setSearchClear}
				setSearchTags={setSearchTags}
			/>

			{/* Advance filter */}
			{advanceSearch && (
				<AdvancedSearchModal
					advanceSearch={advanceSearch}
					setAdvanceSearch={setAdvanceSearch}
					// setFormValues={setFormValues}
					setQueryParams={setQueryParams}
					setGetTagValues={setSearchTags}
					setSearchClear={setSearchClear}
					handleClear={handleClear}
					isFormReset={isFormReset}
					setIsFormReset={setIsFormReset}
					setRefetchLoading={setRefetchLoading}
				/>
			)}
		</Box>
	);
};

export default Leads;
