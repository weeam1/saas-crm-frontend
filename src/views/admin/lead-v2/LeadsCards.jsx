import { useFetchItemsQuery } from 'api/apiSlice';
import ErrorMessage from 'components/Message/ErrorMessage';
import { useCallback, useEffect, useState } from 'react';
import Leads from './components/Leads';
import {
	Box,
	Button,
	Flex,
	Grid,
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
import { useDispatch } from 'react-redux';
import { updateLeads } from '../../../redux/leadsSlice';
import { postApi } from 'services/api';
import { toast } from 'react-toastify';
import ManageColumns from './components/ManageColumns';
import { MdSettings } from 'react-icons/md';
import AllCheckBox from './AllCheckBox';
import useFilteredQueryParams from './useFilteredQueryParams';
import { HasAccess } from './../../../redux/accessUtils';

const LeadsCards = () => {
	const user = JSON.parse(localStorage.getItem('user'));
	const role =
		user?.role === 'superAdmin'
			? 'superAdmin'
			: (user?.roles?.[0]?.roleName ?? 'unknown');

	const [permission] = HasAccess(['Lead']);

	const {
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		queryParams,
		setQueryParams,
	} = useFilteredQueryParams();

	const [addLead, setAddLead] = useState(false);
	const [selectedValues, setSelectedValues] = useState([]);
	const [selectedLeads, setSelectedLeads] = useState([]);
	const [selectAllChecked, setSelectAllChecked] = useState(false);

	const [bulkAssign, setBulkAssign] = useState(false);
	const [errorModal, setErrorModal] = useState(false);
	const [errorLeadData, setErrorLeadData] = useState({});
	const [manageCols, setManageCols] = useState(false);

	const hiddenFields = JSON.parse(
		localStorage.getItem('userCustomColumns') || '[]'
	);
	const [hiddenCols, setHiddenCols] = useState(hiddenFields || []);

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
		}
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
					pageSize,
				})
			);
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
			localStorage.setItem('userCustomColumns', JSON.stringify(hiddenCols));
		} catch (error) {
			console.error('Error saving columns:', error);
			toast.error(error.data.message || 'Manage columns not saving!');
		} finally {
			setManageCols(false);
		}
	};

	if (leadsError) {
		return (
			<ErrorMessage
				message={leadsError?.data?.message || 'Something went wrong!'}
			/>
		);
	}

	return (
		<Box
			py='8'
			px='4'
			rounded='md'
			shadow='sm'
			fontFamily="'DM Sans', sans-serif"
			bg='white'
			width='100%'
		>
			<Flex
				justifyContent='space-between'
				flexDirection={{ base: 'column', md: 'row' }}
				mb='4'
			>
				<Text color={'gray.900'} fontSize='22px' fontWeight='600'>
					<span style={{ marginRight: '4px' }}>Leads</span>
					<CountUpComponent targetNumber={leads?.totalLeads} />
				</Text>

				{/* Action buttons only for Admins */}
				<HStack
					flexDirection={{ base: 'column', md: 'row' }}
					gap='2'
					justifyItems='flex-end'
					alignItems='end'
				>
					<HStack>
						<AllCheckBox
							leads={leads}
							setSelectAllChecked={setSelectAllChecked}
							selectedValues={selectedValues}
							setSelectedValues={setSelectedValues}
						/>

						{['superAdmin', 'Manager'].includes(role) && (
							<Button
								{...buttonStyle}
								onClick={() => setBulkAssign(true)}
								isDisabled={!(selectedValues && selectedValues?.length > 1)}
								variant='solid'
								bg='brand.400'
								py='2'
								px='5'
								aria-label='Bulk Assign'
							>
								Bulk Assign
								{selectedValues?.length > 0
									? ` (${selectedValues?.length})`
									: null}
							</Button>
						)}
						{(permission?.create || role === 'superAdmin') && (
							<Button
								{...buttonStyle}
								variant='solid'
								bg='brand.400'
								py='2'
								px='5'
								leftIcon={<FaPlus />}
								aria-label='New lead'
								onClick={() => setAddLead(true)}
							>
								New
							</Button>
						)}
					</HStack>

					<HStack>
						<IconButton
							icon={<MdSettings />}
							onClick={() => setManageCols(true)}
							aria-label='Filter Date'
							colorScheme='brand'
							variant='solid'
							size='sm'
							borderRadius='full'
							boxShadow='md'
						/>

						<DateFilterButton onClick={dateTimeOnOpen} />
					</HStack>
				</HStack>
			</Flex>

			<Leads
				data={leads}
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

export default LeadsCards;
