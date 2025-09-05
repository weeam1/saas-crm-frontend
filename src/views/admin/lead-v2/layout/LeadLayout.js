import React, {
	lazy,
	memo,
	Suspense,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

import { shallowEqual, useSelector } from 'react-redux';
import {
	Box,
	Button,
	Flex,
	Grid,
	VStack,
	useDisclosure,
} from '@chakra-ui/react';
import { HasAccess } from '../../../../redux/accessUtils';
import { BiX } from 'react-icons/bi';
import { DeleteIcon } from '@chakra-ui/icons';
import useFilteredQueryParams from '../useFilteredQueryParams';
import SearchTags from 'components/search/SearchTags';
import ErrorMessage from 'components/Message/ErrorMessage';
import { usePermissions } from 'hooks/usePermissions';

import { buttonStyle } from 'utils/btn';
import AdvancedSearchModal from '../components/AdvancedSearchModal';
import SearchBox from '../components/SearchBox';
import LeadsModals from '../components/LeadsModals';
import DateFilter from '../components/DateFilter';
import Pagination from '../components/Pagination';
import QuickFilterModal from '../components/QuickFilterModal';
import DisplayQuickFilter from '../components/DisplayQuickFilter';
import Loader from 'components/loading/Loader';

const LeadTableView = lazy(() => import('./table'));
const LeadGridView = lazy(() => import('./grid'));

const LeadsLayout = memo(
	({
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
		manageColumnsOpen,
		openManageColumns,
		closeManageColumns,
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

		const [selectedStatus, setSelectedStatus] = useState([]);
		const [selectedMstatus, setSelectedMstatus] = useState([]);

		const statusOptions = [
			{ value: 'active', label: 'Interested' },
			{ value: 'sold', label: 'Sold' },
			{ value: 'not_interested', label: 'Not Interested' },
			{ value: 'reassigned', label: 'Reassigned' },
			{ value: 'new', label: 'New' },
			{ value: 'no_answer', label: 'No Answer' },
			{ value: 'unreachable', label: 'Unreachable' },
			{ value: 'callback', label: 'Callback' },
			{ value: 'voice_mail', label: 'Voice Mail' },
			{ value: 'wrong_number', label: 'Wrong Number' },
			{ value: 'waiting', label: 'Waiting' },
			{ value: 'follow_up', label: 'Follow Up' },
			{ value: 'meeting', label: 'Meeting' },
			{ value: 'follow_up_after_meeting', label: 'Follow Up After Meeting' },
			{ value: 'deal', label: 'Deal' },
			{ value: 'deal_out', label: 'Deal Out' },
			{ value: 'whatsapp_send', label: 'Whatsapp Send' },
			{ value: 'whatsapp_rec', label: 'Whatsapp Rec' },
			{ value: 'will_attend_the_show', label: 'Will Attend the Show' },
			{ value: 'attended_the_show', label: 'Attended the Show' },
			{ value: 'junk', label: 'Junk' },
			{ value: 'shift_project', label: 'Shift Project' },
			{ value: 'broker', label: 'Broker' },
			{ value: 'request', label: 'Request' },
		];

		const mstatusOptions = [
			{ value: 'interested', label: 'Interested' },
			{ value: 'not_interested', label: 'Not Interested' },
			{ value: 'no_response', label: 'No Response' },
			{ value: 'interested_seller', label: 'Interested Seller' },
			{ value: 'interested_buyer', label: 'Interested Buyer' },
			{ value: 'hot', label: 'Hot' },
			{ value: 'secondary_request', label: 'Secondary request' },
			{ value: 'show', label: 'Show' },
			{ value: 'junk', label: 'Junk' },
			{ value: 'deal', label: 'Deal' },
			{ value: 'change_agent', label: 'Change Agent' },
		];
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

		useEffect(() => {
			if (queryParams?.statusFilters) {
				let parsedFilters;
				try {
					parsedFilters =
						typeof queryParams.statusFilters === 'string'
							? JSON.parse(queryParams.statusFilters)
							: queryParams.statusFilters;
				} catch (err) {
					console.error('Invalid statusFilters JSON:', err);
					return;
				}

				const { mainStatuses, statuses } = parsedFilters;

				if (Array.isArray(statuses)) {
					setSelectedStatus(statuses);
				}
				if (Array.isArray(mainStatuses)) {
					setSelectedMstatus(mainStatuses);
				}
			}
		}, [queryParams]);

		// build clean filters
		const buildFilters = (statusesArr, mStatusesArr) => {
			const filters = {};
			if (statusesArr.length > 0) filters.statuses = statusesArr;
			if (mStatusesArr.length > 0) filters.mainStatuses = mStatusesArr;
			return filters;
		};

		// Status handler
		const handleStatusChange = (value, isChecked) => {
			setSelectedStatus((prev) => {
				const updated = isChecked
					? [...prev, value]
					: prev.filter((item) => item !== value);

				setQueryParams({
					page: 1,
					statusFilters: buildFilters(updated, selectedMstatus),
				});

				setRefetchLoading(true);
				return updated;
			});
		};

		//  MStatus handler
		const handleMstatusChange = (value, isChecked) => {
			setSelectedMstatus((prev) => {
				const updated = isChecked
					? [...prev, value]
					: prev.filter((item) => item !== value);

				setQueryParams({
					page: 1,
					statusFilters: buildFilters(selectedStatus, updated),
				});

				setRefetchLoading(true);
				return updated;
			});
		};

		//  Remove Status
		const handleRemoveStatus = (status) => {
			setSelectedStatus((prev) => {
				const updated = prev.filter((item) => item !== status);

				setQueryParams({
					page: 1,
					statusFilters: buildFilters(updated, selectedMstatus),
				});

				setRefetchLoading(true);
				return updated;
			});
		};

		// Remove MStatus
		const handleRemoveMstatus = (mstatus) => {
			setSelectedMstatus((prev) => {
				const updated = prev.filter((item) => item !== mstatus);

				setQueryParams({
					page: 1,
					statusFilters: buildFilters(selectedStatus, updated),
				});

				setRefetchLoading(true);
				return updated;
			});
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

		const commonProps = {
			isLoaded,
			leadsRefetching,
			leadsLoading,
			refreshLeads,
			setLeadDetails,
			setViewLead,
			queryParams,
			setEditLead,
			setAddLead,
			setSendEmail,
			selectedValues,
			setSelectedValues,
			setSelectedLeads,
			setDeleteLead,
			setSelectAllChecked,
			selectAllChecked,
			setViewPhoneHistory,
			setLeadAddtionalInfo,
			setIsLeadCycle,
			leadAddtionalInfo,
		};

		const leadDataLayout = (
			<Suspense
				fallback={
					<VStack h='80vh' justifyContent='center'>
						<Loader />
					</VStack>
				}
			>
				{layoutView === 'grid' ? (
					<LeadGridView {...commonProps} />
				) : (
					<LeadTableView {...commonProps} />
				)}
			</Suspense>
		);

		return (
			<Box>
				{/* Manage Columns Button */}
				<Flex
					gap={2}
					flexDir={{ base: 'column', md: 'row' }}
					alignItems={{ base: 'stretch', md: 'normal' }}
				>
					{/* Display selected status/mstatus buttons */}
					{(selectedStatus.length > 0 || selectedMstatus.length > 0) && (
						<DisplayQuickFilter
							selectedStatus={selectedStatus}
							selectedMstatus={selectedMstatus}
							statusOptions={statusOptions}
							mstatusOptions={mstatusOptions}
							onRemoveStatus={handleRemoveStatus}
							onRemoveMstatus={handleRemoveMstatus}
						/>
					)}
				</Flex>
				<Flex
					width='full'
					justifyContent='space-between'
					alignItems='center'
					gap='2'
					flexDirection={{ base: 'column', lg: 'row' }}
				>
					{/* Pagination */}
					<Pagination
						currentPage={data?.currentPage ?? currentPage}
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
				{/* Manage Columns Modal */}
				<QuickFilterModal
					isOpen={manageColumnsOpen}
					onClose={closeManageColumns}
					statusOptions={statusOptions}
					mstatusOptions={mstatusOptions}
					selectedStatus={selectedStatus}
					selectedMstatus={selectedMstatus}
					onStatusChange={handleStatusChange}
					onMstatusChange={handleMstatusChange}
					setQueryParams={setQueryParams}
					setRefetchLoading={setRefetchLoading}
					setSelectedStatus={setSelectedStatus}
					setSelectedMstatus={setSelectedMstatus}
				/>
			</Box>
		);
	}
);

LeadsLayout.displayName = 'LeadsLayout';

export default LeadsLayout;
