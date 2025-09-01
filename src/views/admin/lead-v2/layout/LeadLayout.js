import { shallowEqual, useSelector } from 'react-redux';
import { Box, Button, Flex, Grid } from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { HasAccess } from '../../../../redux/accessUtils';
import { BiX } from 'react-icons/bi';
import { DeleteIcon } from '@chakra-ui/icons';
import useFilteredQueryParams from '../useFilteredQueryParams';
import SearchTags from 'components/search/SearchTags';
import ErrorMessage from 'components/Message/ErrorMessage';
import { usePermissions } from 'hooks/usePermissions';
import LeadTableView from './table';
import LeadGridView from './grid';
import { buttonStyle } from 'utils/btn';
import AdvancedSearchModal from '../components/AdvancedSearchModal';
import SearchBox from '../components/SearchBox';
import LeadsModals from '../components/LeadsModals';
import DateFilter from '../components/DateFilter';
import Pagination from '../components/Pagination';

const LeadsLayout = ({
	layoutView,
	data,
	leadsError,
	leadsLoading,
	leadsRefetching,
	refreshLeads,
	addLead,
	setAddLead,
	selectedValues,
	setSelectedValues,
	setSelectedLeads,
	selectAllChecked,
	setSelectAllChecked,
	dateTimeIsOpen,
	dateTimeOnClose,
	setCurrentPageSelection,
	currentPageSelection,
}) => {
	const { hasPermission } = usePermissions();

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

	// useEffect(() => {
	// 	if (leadsRefetching) {
	// 		setRefetchLoading(true);
	// 	} else {
	// 		const timer = setTimeout(() => setRefetchLoading(false), 2000);
	// 		return () => clearTimeout(timer);
	// 	}
	// }, [leadsRefetching, refetchLoading, setRefetchLoading]);

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
			setCurrentPageSelection([]);
			setSearchClear(false);
			return;
		}

		setSearchTags([]);
		searchTermRef.current = '';
		document.getElementById('searchInput').value = '';
		setIsFormReset(true);
		setSearchClear(false);
		setRefetchLoading(true);
		// setSelectedLeads([]);
		// setSelectedValues([]); // commented to retain selected leads on clear
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
		setCurrentPageSelection((prev) => ({
			...prev,
			[currentPage]: {
				selectAllChecked,
				selectedValues: selectedValues.filter((id) =>
					leads?.doc?.some((lead) => lead._id === id)
				),
			},
		}));

		if (currentPageSelection[page]) {
			setSelectAllChecked(currentPageSelection[page].selectAllChecked);
			setSelectedValues((prev) => [
				...new Set([...prev, ...currentPageSelection[page].selectedValues]),
			]);
		} else {
			setSelectAllChecked(false);
		}

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

	console.log({ viewLead, leadDetails });

	const leadDataLayout =
		layoutView === 'grid' ? (
			<LeadGridView
				isLoaded={isLoaded}
				leadsRefetching={leadsRefetching}
				leadsLoading={leadsLoading}
				refreshLeads={refreshLeads}
				setLeadDetails={setLeadDetails}
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
				setIsLeadCycle={setIsLeadCycle}
				leadAddtionalInfo={leadAddtionalInfo}
			/>
		) : (
			<LeadTableView
				isLoaded={isLoaded}
				leadsLoading={leadsLoading}
				leadsRefetching={leadsRefetching}
				refreshLeads={refreshLeads}
				setLeadDetails={setLeadDetails}
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
				setIsLeadCycle={setIsLeadCycle}
				leadAddtionalInfo={leadAddtionalInfo}
			/>
		);

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
						hasPermission('leads', 'bulkDelete') && (
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
			) : (
				leadDataLayout
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

export default LeadsLayout;
