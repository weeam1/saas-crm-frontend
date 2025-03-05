import { useSelector } from 'react-redux';
import { Box, Button, Flex, Grid } from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import LeadCard from './LeadCard';
import CardLoader from './CardLoader';
import Pagination from './Pagination';
import SearchBox from './SearchBox';
import DateFilter from './DateFilter';
import LeadsModals from './LeadsModals';
import { HasAccess } from './../../../../redux/accessUtils';
import AdvancedSearchModal from './AdvancedSearchModal';
import SearchTags from './SearchTags';
import { buttonStyle } from './constants';
import { BiX } from 'react-icons/bi';
import NoData from './subComponents/NoData';
// import VirtualLeads from './VirtualLeads';

const Leads = ({
	data,
	leadsLoading,
	leadsRefetching,
	refreshLeads,
	currentPage,
	setCurrentPage,
	pageSize,
	setPageSize,
	setQueryParams,
	addLead,
	setAddLead,
	selectedValues,
	setSelectedValues,
	selectAllChecked,
	setSelectAllChecked,
	dateTimeIsOpen,
	dateTimeOnClose,
	queryParams,
}) => {
	const [permission, emailAccess, callAccess] = HasAccess([
		'Lead',
		'Email',
		'Call',
	]);

	const leads = useSelector(
		(state) => state.leads,
		(prev, next) => prev === next
	);

	const [isLoaded, setIsLoaded] = useState(false);
	const [refetchLoading, setRefetchLoading] = useState(false);

	useEffect(() => {
		if (leadsLoading) {
			setIsLoaded(false);
		} else {
			const timer = setTimeout(() => setIsLoaded(true), 700);
			return () => clearTimeout(timer);
		}
	}, [leadsLoading, currentPage]);

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
	// const [searchTerm, setSearchTerm] = useState('');

	const searchTermRef = useRef('');

	const handleClear = () => {
		setSearchTags([]);
		searchTermRef.current = '';
		document.getElementById('searchInput').value = '';
		setIsFormReset(true);
		setSearchClear(false);
		setRefetchLoading(true);
		setQueryParams((prev) => {
			const { data, dateTime, name, ...rest } = prev;

			// Only remove keys if they exist
			const updatedParams = { ...rest, page: 1 };

			return updatedParams;
		});
	};

	const handleSearchByName = useCallback(() => {
		const term = searchTermRef.current.trim();
		if (!term) return;

		setSearchClear(true);
		setSearchTags([`leadName: ${term}`]);

		setQueryParams((prev) => ({
			...prev,
			page: 1,
			name: term,
		}));

		setRefetchLoading(true);
	}, [setQueryParams, setRefetchLoading]);

	// Handle page changes
	const handlePageChange = (page) => {
		setCurrentPage((prevPage) => {
			if (prevPage === page) return prevPage;
			setRefetchLoading(true);
			return page;
		});
	};

	const handlePageSize = (e) => {
		setPageSize(Number(e.target.value));
		setRefetchLoading(true);
	};

	return (
		<Box>
			<Flex
				width='full'
				justifyContent='space-between'
				alignItems='center'
				gap='2'
				flexDirection={{ base: 'column', lg: 'row' }}
			>
				{/* Pagination */}
				<Pagination
					currentPage={currentPage}
					totalPages={data?.totalPages ?? ''}
					onPageChange={handlePageChange}
					totalItems={data?.totalLeads ?? ''}
					itemsPerPage={pageSize}
					setPageSize={setPageSize}
					refetching={leadsRefetching}
					loading={leadsLoading}
					handlePageSize={handlePageSize}
				/>

				{/* Search Box */}
				<SearchBox
					setQueryParams={setQueryParams}
					setAdvanceSearch={setAdvanceSearch}
					handleSearchByName={handleSearchByName}
					searchTermRef={searchTermRef}
				/>
			</Flex>

			{/* Search tags */}
			{searchClear && searchTags && (
				<Flex
					flexDirection={{ base: 'row', lg: 'row' }}
					justifyContent='space-between'
					alignItems='center'
					flexWrap='wrap'
					py='2'
				>
					<SearchTags searchTags={searchTags} />

					{searchClear && (
						<Button
							{...buttonStyle}
							variant='solid'
							bg='red.400'
							w='fit-content'
							color='white'
							sx={{
								svg: {
									fill: 'white',
								},
							}}
							leftIcon={<BiX />}
							aria-label='Clear'
							onClick={handleClear}
						>
							Clear
						</Button>
					)}
				</Flex>
			)}

			{/* divider  */}
			<Box height='2px' my={4} bg='softGray.50' />

			{!isLoaded || leadsLoading || refetchLoading ? (
				<CardLoader count={pageSize} />
			) : leads && leads?.totalLeads ? (
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
							queryParams={queryParams}
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
				// <VirtualLeads
				// 	leads={leads}
				// 	refreshLeads={refreshLeads}
				// 	emailAccess={emailAccess}
				// 	permission={permission}
				// 	setLeadDetails={setLeadDetails}
				// 	callAccess={callAccess}
				// 	setViewLead={setViewLead}
				// 	queryParams={queryParams}
				// 	setEditLead={setEditLead}
				// 	setAddLead={setAddLead}
				// 	setSendEmail={setSendEmail}
				// 	selectedValues={selectedValues}
				// 	setSelectedValues={setSelectedValues}
				// 	setDeleteLead={setDeleteLead}
				// 	setSelectAllChecked={setSelectAllChecked}
				// 	selectAllChecked={selectAllChecked}
				// />
				<NoData />
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
			{dateTimeIsOpen && (
				<DateFilter
					setQueryParams={setQueryParams}
					setRefetchLoading={setRefetchLoading}
					setCurrentPage={setCurrentPage}
					onClose={dateTimeOnClose}
					isOpen={dateTimeIsOpen}
					setSearchClear={setSearchClear}
					setSearchTags={setSearchTags}
				/>
			)}

			{/* Advance filter */}
			{advanceSearch && (
				<AdvancedSearchModal
					advanceSearch={advanceSearch}
					setAdvanceSearch={setAdvanceSearch}
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
