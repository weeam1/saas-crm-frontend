import { shallowEqual, useSelector } from 'react-redux';
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
import { buttonStyle } from './constants';
import { BiX } from 'react-icons/bi';
import NoData from './subComponents/NoData';
import { DeleteIcon } from '@chakra-ui/icons';
import useFilteredQueryParams from '../useFilteredQueryParams';
import LeadUnassignedMessage from './subComponents/LeadUnassignedMessage';
import SearchTags from 'components/search/SearchTags';
import ErrorMessage from 'components/Message/ErrorMessage';

const Leads = ({
	data,
	leadsError,
	leadsLoading,
	leadsRefetching,
	refreshLeads,
	// currentPage,
	// setCurrentPage,
	// pageSize,
	// setPageSize,
	// setQueryParams,
	addLead,
	setAddLead,
	selectedValues,
	setSelectedValues,
	setSelectedLeads,
	selectAllChecked,
	setSelectAllChecked,
	dateTimeIsOpen,
	dateTimeOnClose,
	// queryParams,
}) => {
	const [permission, emailAccess, callAccess] = HasAccess([
		'Lead',
		'Email',
		'Call',
	]);

	const {
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		queryParams,
		setQueryParams,
		setSearchQueryParams,
		searchTags,
		setSearchTags,
		searchClear,
		setSearchClear,
		clearSearchParams,
		refetchLoading,
		setRefetchLoading,
	} = useFilteredQueryParams();

	// const leads = useSelector(
	// 	(state) => state.leads,
	// 	(prev, next) => prev === next
	// );

	const leads = useSelector((state) => state.leads, shallowEqual);

	const [isLoaded, setIsLoaded] = useState(false);
	// const [refetchLoading, setRefetchLoading] = useState(false);

	useEffect(() => {
		if (leadsLoading) {
			setIsLoaded(false);
		} else {
			const timer = setTimeout(() => setIsLoaded(true), 700);
			return () => clearTimeout(timer);
		}
	}, [leadsLoading, currentPage]);

	useEffect(() => {
		if (leadsRefetching) {
			setRefetchLoading(true);
		} else {
			const timer = setTimeout(() => setRefetchLoading(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [leadsRefetching, refetchLoading, setRefetchLoading]);

	const [viewLead, setViewLead] = useState({
		isOpen: false,
		lid: null,
	});
	const [editLead, setEditLead] = useState(false);
	const [viewPhoneHistory, setViewPhoneHistory] = useState({
		modal: false,
		leadId: null,
	});
	const [leadDetails, setLeadDetails] = useState(null);
	const [sendEmail, setSendEmail] = useState(false);
	const [isLeadCycle, setIsLeadCycle] = useState(null);
	const [deleteLead, setDeleteLead] = useState(false);
	const [leadAddtionalInfo, setLeadAddtionalInfo] = useState(false);

	const [advanceSearch, setAdvanceSearch] = useState(false);

	// const [formValues, setFormValues] = useState([]);
	const [isFormReset, setIsFormReset] = useState(false);
	// const [searchTags, setSearchTags] = useState([]);
	// const [searchClear, setSearchClear] = useState(false);
	// const [searchTerm, setSearchTerm] = useState('');

	const searchTermRef = useRef('');

	const handleClear = () => {
		// for selected leads
		if (searchTags?.length === 0) {
			setSelectedLeads([]);
			setSelectedValues([]);
			setSearchClear(false);
			return;
		}

		setSearchTags([]);
		searchTermRef.current = '';
		document.getElementById('searchInput').value = '';
		setIsFormReset(true);
		setSearchClear(false);
		setRefetchLoading(true);
		setSelectedLeads([]);
		setSelectedValues([]);
		clearSearchParams();
	};

	const handleSearchByName = useCallback(() => {
		// const term = searchTermRef.current.trim();
		const term = searchTermRef.current.trim().replace(/^\+/, '');

		if (!term) return;

		setSearchClear(true);
		// setSearchTags([`search: ${term}`]);

		setSearchQueryParams({ search: term });

		// setQueryParams((prev) => ({
		// 	...prev,
		// 	page: 1,
		// 	search: term,
		// }));

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
		const newSize = Number(e.target.value);
		if (newSize !== pageSize) {
			setPageSize(newSize);
			setCurrentPage(1);
			setRefetchLoading(true);
		}
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
				</Flex>
			)}

			{/* Clear and Delete button  */}
			{(selectedValues.length > 0 || searchClear) && (
				<Flex
					flexDirection={{ base: 'row', lg: 'row' }}
					justifyContent='space-between'
					alignItems='center'
					py='2'
				>
					{searchTags?.length === 0 &&
						selectedValues.length > 0 &&
						permission?.delete && (
							<Button
								{...buttonStyle}
								variant='solid'
								bg='red.400'
								w='fit-content'
								color='white'
								my='2'
								sx={{
									svg: {
										fill: 'white',
									},
								}}
								leftIcon={<DeleteIcon />}
								aria-label='Delete'
								onClick={() => setDeleteLead(true)}
							>
								Delete
							</Button>
						)}

					<Button
						{...buttonStyle}
						variant='solid'
						bg='softGray.100'
						w='fit-content'
						color='gray.800'
						sx={{
							svg: {
								fill: 'gray.800',
							},
						}}
						_active={{ bg: 'gray.100' }}
						leftIcon={<BiX />}
						aria-label='Clear'
						onClick={handleClear}
					>
						Clear
					</Button>
				</Flex>
			)}

			{/* divider  */}
			<Box height='2px' my={4} bg='softGray.50' />

			{leadsError ? (
				<ErrorMessage
					message={leadsError?.data?.message || 'Something went wrong!'}
				/>
			) : !isLoaded || leadsLoading || refetchLoading ? (
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
							setSelectedLeads={setSelectedLeads}
							setDeleteLead={setDeleteLead}
							setSelectAllChecked={setSelectAllChecked}
							selectAllChecked={selectAllChecked}
							setViewPhoneHistory={setViewPhoneHistory}
							setLeadAddtionalInfo={setLeadAddtionalInfo}
							leadAddtionalInfo={leadAddtionalInfo}
							setIsLeadCycle={setIsLeadCycle}
						/>
					))}
				</Grid>
			) : queryParams?.lead ? (
				<LeadUnassignedMessage />
			) : (
				<NoData label='leads' />
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
				viewPhoneHistory={viewPhoneHistory}
				setViewPhoneHistory={setViewPhoneHistory}
				setLeadAddtionalInfo={setLeadAddtionalInfo}
				leadAddtionalInfo={leadAddtionalInfo}
				isLeadCycle={isLeadCycle}
				setIsLeadCycle={setIsLeadCycle}
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
					setSearchQueryParams={setSearchQueryParams}
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
					setSearchQueryParams={setSearchQueryParams}
				/>
			)}
		</Box>
	);
};

export default Leads;
