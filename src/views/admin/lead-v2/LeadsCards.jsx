import { useFetchItemsQuery } from 'api/apiSlice';
import ErrorMessage from 'components/Message/ErrorMessage';
import { useEffect, useState } from 'react';
import Leads from './components/Leads';
import {
	Box,
	Button,
	Flex,
	HStack,
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
// import CardsLoading from 'components/loading/CardsLoading';

const LeadsCards = () => {
	const user = JSON.parse(localStorage.getItem('user'));
	const role =
		user?.role === 'superAdmin'
			? 'superAdmin'
			: (user?.roles?.[0]?.roleName ?? 'unknown');

	const [currentPage, setCurrentPage] = useState(1);
	const [addLead, setAddLead] = useState(false);
	const [selectedValues, setSelectedValues] = useState([]);
	const [selectAllChecked, setSelectAllChecked] = useState(false);

	const [bulkAssign, setBulkAssign] = useState(false);
	const [errorModal, setErrorModal] = useState(false);
	const [errorLeadData, setErrorLeadData] = useState({});

	const dispatch = useDispatch();

	const {
		isOpen: dateTimeIsOpen,
		onOpen: dateTimeOnOpen,
		onClose: dateTimeOnClose,
	} = useDisclosure();

	const [pageSize, setPageSize] = useState(32);
	const [queryParams, setQueryParams] = useState({
		page: currentPage,
		pageSize,
	});

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
		{ refetchOnMountOrArgChange: true }
	);

	// Update queryParams only when necessary
	useEffect(() => {
		setQueryParams((prev) => ({
			...prev,
			page: currentPage, // Keep page in sync
		}));

		setCurrentPage(currentPage);
	}, [currentPage]);

	useEffect(() => {
		setQueryParams((prev) => ({
			...prev,
			pageSize, // Update limit when pageSize changes
		}));
		setPageSize(pageSize);
	}, [pageSize]);

	// Automatically refetch when queryParams change
	useEffect(() => {
		leadsRefetch({
			path: '/lead/v2',
			params: queryParams,
		});
	}, [queryParams, leadsRefetch]);

	// Refresh data
	const refreshLeads = () => {
		leadsRefetch({
			path: '/lead/v2',
			params: queryParams,
		});
	};

	useEffect(() => {
		if (leads?.doc) {
			dispatch(
				updateLeads({
					leads: leads,
					currentPage,
					pageSize,
				})
			);
		}
	}, [currentPage, dispatch, leads, leadsRefetch, pageSize]);

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
			// bg='softGray.800'
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
				<HStack gap='2'>
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
						</Button>
					)}

					{role === 'superAdmin' && (
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

					<DateFilterButton onClick={dateTimeOnOpen} />
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
		</Box>
	);
};

export default LeadsCards;
