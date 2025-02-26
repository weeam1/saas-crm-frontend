import { useFetchItemsQuery } from 'api/apiSlice';
import ErrorMessage from 'components/Message/ErrorMessage';
import { useEffect, useState } from 'react';
import Leads from './components/Leads';
import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { FaPlus } from 'react-icons/fa6';
import { buttonStyle } from './components/constants';
import BulkAssignModal from './components/BulkAssignModal';
import ErrorLeadLimitMessage from 'components/Message/ErrorLeadLimitMessage';
// import CardsLoading from 'components/loading/CardsLoading';

const LeadScreen = () => {
	const user = JSON.parse(localStorage.getItem('user'));
	const isAdmin = user?.role === 'superAdmin';

	const [currentPage, setCurrentPage] = useState(1);
	const [addLead, setAddLead] = useState(false);
	const [selectedValues, setSelectedValues] = useState([]);
	const [selectAllChecked, setSelectAllChecked] = useState(false);

	const [bulkAssign, setBulkAssign] = useState(false);
	const [errorModal, setErrorModal] = useState(false);
	const [errorLeadData, setErrorLeadData] = useState({});

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
	}, [currentPage]);

	useEffect(() => {
		setQueryParams((prev) => ({
			...prev,
			pageSize, // Update limit when pageSize changes
		}));
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
			bg='softGray.800'
		>
			<Flex
				justifyContent='space-between'
				flexDirection={{ base: 'column', md: 'row' }}
				mb='8'
			>
				<Text color={'gray.900'} fontSize='22px' fontWeight='600'>
					<span style={{ marginRight: '4px' }}>Leads</span>
					<CountUpComponent targetNumber={leads?.totalLeads} />
				</Text>

				{/* Action buttons */}
				<HStack gap='2'>
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
				</HStack>
			</Flex>
			<Leads
				leads={leads}
				leadsLoading={leadsLoading}
				leadsRefetching={leadsRefetching}
				refreshLeads={refreshLeads}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				// hanldePage={handlePageChange}
				pageSize={pageSize}
				setQueryParams={setQueryParams}
				addLead={addLead}
				setAddLead={setAddLead}
				selectedValues={selectedValues}
				setSelectedValues={setSelectedValues}
				setSelectAllChecked={setSelectAllChecked}
				selectAllChecked={selectAllChecked}
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

export default LeadScreen;
