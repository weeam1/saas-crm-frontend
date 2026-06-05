import { useFetchItemsQuery } from 'api/apiSlice';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
	Box,
	Flex,
	HStack,
	IconButton,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { FaPlus } from 'react-icons/fa6';
import { buttonStyle } from './components/constants';
import BulkAssignModal from './components/BulkAssignModal';
import ErrorLeadLimitMessage from 'components/Message/ErrorLeadLimitMessage';
import DateFilterButton from './components/DateFilterButton';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setHiddenFields, updateLeads } from '../../../redux/leadsSlice';
import { postApi } from 'services/api';
import { toast } from 'react-toastify';
import ManageColumns from './components/ManageColumns';
import { MdSettings } from 'react-icons/md';
import AllCheckBox from './AllCheckBox';
import useFilteredQueryParams from './useFilteredQueryParams';
import BulkWhatsappModal from './components/whatsapp-message/BulkWhatsappModal';
import ViewToggle from 'components/toggle/ViewToggle';
import { usePermissions } from 'hooks/usePermissions';
import LeadsLayout from './layout/LeadLayout';
import useUserSession from 'hooks/useUserSession';
import { useNavigate } from 'react-router-dom';
import { useWhatsapp } from 'hooks/whatsapp/useWhatsapp';
import { FiDownload } from 'react-icons/fi';
import ExportModal from './components/subComponents/ExportModal';
import CustomTooltip from 'components/shared/CustomTooltip';
import Button from 'components/base/Button';
import RefreshButton from 'components/refresh/RefreshButton';

const Index = () => {
	const { user } = useUserSession();

	const whatsappAccountId = user?.whatsappDetails?.businessId || null;
	const whatsappSessionId = user?.whatsappInstance?.sessionId || null;

	const isWhatsappInstanceActive =
		(whatsappSessionId && user?.whatsappInstance?.isActive) || false;

	const { hasPermission } = usePermissions();
	const navigate = useNavigate();

	const bulkAssingPermissionAllowed =
		hasPermission('leads', 'bulkAssign_all') ||
		hasPermission('leads', 'bulkAssign_team') ||
		hasPermission('leads', 'bulkAssign_agents');

	const [view, setView] = useState(() => {
		return localStorage.getItem('leadView') || 'grid';
	});

	const handleViewChange = (newView) => {
		setView(newView);
		localStorage.setItem('leadView', newView);
	};

	useEffect(() => {
		if (!hasPermission('leads')) return navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// ---------------------------
	// Cleanup on unmount / reload
	// ---------------------------
	const disconnectedRef = useRef(false);
	const { whatsappInitialize, disconnectWhatsapp, getChats, isReady } =
		useWhatsapp();
	const [isOpenExport, setIsOpenExport] = useState(false);
	useEffect(() => {
		if (isWhatsappInstanceActive) {
			const delay = Math.floor(Math.random() * 8000 + 2000);

			setTimeout(async () => {
				whatsappInitialize({
					sessionId: whatsappSessionId,
				});
			}, delay);
		}
	}, [whatsappInitialize, whatsappSessionId, isWhatsappInstanceActive]);

	// ---------------------------
	// 3. Fetch chats when ready (only once per ready state)
	// ---------------------------
	useEffect(() => {
		if (isReady && whatsappSessionId) {
			getChats(whatsappSessionId);
		}
	}, [isReady, whatsappSessionId, getChats]);

	const safeDisconnect = useCallback(() => {
		if (!disconnectedRef.current && whatsappSessionId) {
			disconnectWhatsapp(whatsappSessionId);
			disconnectedRef.current = true;
		}
	}, [disconnectWhatsapp, whatsappSessionId]);

	useEffect(() => {
		return () => safeDisconnect();
	}, [safeDisconnect]);

	useEffect(() => {
		const handleBeforeUnload = () => safeDisconnect();
		window.addEventListener('beforeunload', handleBeforeUnload);
		window.addEventListener('unload', handleBeforeUnload);
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
			window.removeEventListener('unload', handleBeforeUnload);
		};
	}, [safeDisconnect]);

	const {
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		queryParams,
		setQueryParams,
	} = useFilteredQueryParams();

	const {
		isOpen: manageColumnsOpen,
		onOpen: openManageColumns,
		onClose: closeManageColumns,
	} = useDisclosure();

	const [addLead, setAddLead] = useState(false);
	const [selectedValues, setSelectedValues] = useState([]);
	const [selectedLeads, setSelectedLeads] = useState([]);
	const [selectAllChecked, setSelectAllChecked] = useState(false);

	const [bulkAssign, setBulkAssign] = useState(false);
	const [bulkWhatsappMessage, setBulkWhatsappMessage] = useState(false);
	const [errorModal, setErrorModal] = useState(false);
	const [errorLeadData, setErrorLeadData] = useState({});
	const [manageCols, setManageCols] = useState(false);
	const [currentPageSelection, setCurrentPageSelection] = useState({});
	const hiddenFields = JSON.parse(
		localStorage.getItem('userCustomColumns') || '[]',
	);
	const [hiddenCols, setHiddenCols] = useState(hiddenFields || []);

	const totalLeads = useSelector(
		(state) => state.leads?.totalLeads,
		shallowEqual,
	);
	const totalExportLeads = useSelector(
		(state) => state.leads?.doc.length,
		shallowEqual,
	);

	const dispatch = useDispatch();

	const {
		isOpen: dateTimeIsOpen,
		onOpen: dateTimeOnOpen,
		onClose: dateTimeOnClose,
	} = useDisclosure();

	const {
		data: leads,
		isLoading: leadsLoading,
		error: leadsError,
		refetch: leadsRefetch,
		isFetching: leadsRefetching,
	} = useFetchItemsQuery(
		{
			path: '/lead/v2',
			params: queryParams,
		},
		{
			skip: !queryParams,
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true, // Refetch when user comes back to tab
			refetchOnReconnect: true, // Refetch on internet reconnection
		},
	);

	const refreshLeads = useCallback(() => {
		leadsRefetch({
			path: '/lead/v2',
			params: queryParams,
			force: true,
		});
	}, [leadsRefetch, queryParams]);

	useEffect(() => {
		if (leads) {
			dispatch(
				updateLeads({
					leads,
					currentPage,
					pageSize: leads?.length,
				}),
			);
			// setQueryParams({page: currentPage, pageSize: leads?.doc?.length || 32});
		}
	}, [leads, currentPage, pageSize, dispatch]);

	const saveManageCols = async () => {
		try {
			const userHideColsData = {
				userId: user._id,
				columns: hiddenCols,
			};

			await postApi(`api/customColumns`, userHideColsData);

			// Update local storage and state
			dispatch(setHiddenFields(hiddenCols || []));
		} catch (error) {
			console.error('Error saving columns:', error);
			toast.error(error.data.message || 'Manage columns not saving!');
		} finally {
			setManageCols(false);
		}
	};

	const onBulkMessageSuccess = () => {
		setSelectedLeads([]);
		setSelectedValues([]);
		setSelectAllChecked(false);
		setBulkWhatsappMessage(false);
	};

	const openWhatsappModal = () => {
		// if (selectedValues.length > 50) {
		// 	return toast.error(
		// 		'Bulk WhatsApp messages are limited to 50 leads. Please select fewer recipients.'
		// 	);
		// }
		setBulkWhatsappMessage(true);
	};

	return (
<Box py='8' px='4' rounded='md' shadow='sm' bg='bg.surface' width='100%'>
			<Flex
				justifyContent='space-between'
				flexDirection={{ base: 'column', xl: 'row' }}
				mb='4'
			>
<Text color='text.heading' fontSize='22px' fontWeight='600'>
					<span style={{ marginRight: '4px' }}>Leads</span>
					<CountUpComponent targetNumber={totalLeads} />
				</Text>
				{/* Action buttons only for Admins */}
				<HStack
					flexDirection={{ base: 'column', xl: 'row' }}
					gap='2'
					justifyContent='flex-end'
					alignItems='end'
				>
					<Flex wrap='wrap' justifyItems='flex-end' gap='2'>
						<AllCheckBox
							leads={leads}
							selectedValues={selectedValues}
							setSelectedLeads={setSelectedLeads}
							setSelectedValues={setSelectedValues}
							selectAllChecked={selectAllChecked}
							setSelectAllChecked={setSelectAllChecked}
							currentPage={currentPage}
							pageSize={pageSize}
						/>
						{/* Button */}
						<Button
							onClick={openManageColumns}
variant='outline'

						>

							Quick Filter
						</Button>
						{whatsappAccountId && hasPermission('leads', 'bulkWhatsapp') && (
							<Button

								onClick={openWhatsappModal}
								isDisabled={!(selectedValues && selectedValues?.length > 1)}
								variant='brand'
								aria-label='Bulk Whatsapp Message'
							>
								Bulk Whatsapp
								{selectedValues?.length > 0
									? ` (${selectedValues?.length})`
									: null}
							</Button> // count added
						)}
						{bulkAssingPermissionAllowed && (
							<Button

								onClick={() => setBulkAssign(true)}
								isDisabled={!(selectedValues && selectedValues?.length > 1)}
								variant='brand'
								aria-label='Bulk Assign'
							>
								Bulk Assign
								{selectedValues?.length > 0
									? ` (${selectedValues?.length})`
									: null}
							</Button>
						)}
						{hasPermission('leads', 'create') && (
							<Button

								variant='brand'

								leftIcon={<FaPlus active={{ bg: 'brand.600' }} />}
								aria-label='New lead'
								onClick={() => setAddLead(true)}
							>
								New
							</Button>
						)}
						{hasPermission('leads', 'export') && (
							<Button

								leftIcon={<FiDownload />}
								variant='outline'
								transition='all 0.3s ease'
								onClick={() => {
									setIsOpenExport(true);
								}}
							>
								Export
							</Button>
						)}
					</Flex>

					<HStack>
					<CustomTooltip label='Setting' hasArrow>
	<IconButton
		icon={<MdSettings />}
		onClick={() => setManageCols(true)}
		aria-label='Filter Date'
		variant='solid'
		colorScheme='brand'
		size='sm'
		borderRadius='full'
		boxShadow='md'
	/>
</CustomTooltip>

						<DateFilterButton onClick={dateTimeOnOpen} />
						<RefreshButton
							label='Refresh'
							onClick={() => leadsRefetch()}
							isLoading={leadsRefetching}
							isFetching={leadsRefetching}
							size='sm'
							/>

						<ViewToggle
							handleView={handleViewChange}
							view={view}
							moduleView='leadView'
						/>
					</HStack>
				</HStack>
			</Flex>
			<ExportModal
				params={queryParams}
				totalRecords={totalLeads}
				isOpen={isOpenExport}
				onClose={() => setIsOpenExport(false)}
			/>
			<LeadsLayout
				layoutView={view}
				data={leads}
				leadsError={leadsError}
				leadsLoading={leadsLoading}
				leadsRefetching={leadsRefetching}
				refreshLeads={refreshLeads}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				// hanldePage={handlePageChange}
				pageSize={pageSize}
				setPageSize={setPageSize}
				queryParams={queryParams}
				setQueryParams={setQueryParams}
				addLead={addLead}
				setAddLead={setAddLead}
				selectedValues={selectedValues}
				setSelectedValues={setSelectedValues}
				setSelectedLeads={setSelectedLeads}
				setSelectAllChecked={setSelectAllChecked}
				selectAllChecked={selectAllChecked}
				dateTimeIsOpen={dateTimeIsOpen}
				dateTimeOnClose={dateTimeOnClose}
				setCurrentPageSelection={setCurrentPageSelection}
				currentPageSelection={currentPageSelection}
				manageColumnsOpen={manageColumnsOpen}
				openManageColumns={openManageColumns}
				closeManageColumns={closeManageColumns}
			/>

			{bulkAssign && selectedValues?.length && (
				<BulkAssignModal
					refreshData={refreshLeads}
					bulkAssign={bulkAssign}
					setBulkAssign={setBulkAssign}
					setSelectedValues={setSelectedValues}
					setSelectedLeads={setSelectedLeads}
					selectedLeads={selectedLeads}
					selectedValues={selectedValues}
					setSelectAllChecked={setSelectAllChecked}
					setErrorLeadData={setErrorLeadData}
					setErrorModal={setErrorModal}
				/>
			)}

			{bulkWhatsappMessage && selectedValues?.length && (
				<BulkWhatsappModal
					isOpen={bulkWhatsappMessage}
					onClose={() => setBulkWhatsappMessage(false)}
					onSuccess={onBulkMessageSuccess}
					setSelectedLeads={setSelectedLeads}
					selectedLeads={selectedLeads}
					whatsappAccountId={whatsappAccountId}
					setSelectAllChecked={setSelectAllChecked}
				/>
			)}

			{errorModal && !bulkAssign && (
				<ErrorLeadLimitMessage
					isOpen={errorModal}
					onClose={() => setErrorModal(false)}
					errorLeadData={errorLeadData}
				/>
			)}

			{manageCols && (
				<ManageColumns
					setManageCols={setManageCols}
					manageCols={manageCols}
					hiddenCols={hiddenCols}
					setHiddenCols={setHiddenCols}
					saveManageCols={saveManageCols}
				/>
			)}
		</Box>
	);
};

export default Index;
