import { useFetchItemsQuery } from 'api/apiSlice';
import ErrorMessage from 'components/Message/ErrorMessage';
import { useEffect, useState } from 'react';
import useFetchUserHierarchy from 'hooks/useFetchUserHierarchy';
import Leads from './components/Leads';
import {
	Box,
	Button,
	Flex,
	HStack,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { FaPlus } from 'react-icons/fa6';
// import CardsLoading from 'components/loading/CardsLoading';

const LeadScreen = () => {
	const user = JSON.parse(localStorage.getItem('user'));
	const isAdmin = user?.role === 'superAdmin';

	const [currentPage, setCurrentPage] = useState(1);
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

	// Handle page changes
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	if (leadsError) {
		return (
			<ErrorMessage
				message={leadsError?.data?.message || 'Something went wrong!'}
			/>
		);
	}

	const buttonStyle = {
		size: 'sm',
		borderRadius: 'md',
		_hover: { shadow: 'sm', transition: 'all 0.2s ease-in-out' },
		_active: { bg: 'brand.500' },
		color: 'white',
		fontWeight: 'medium',
		sx: {
			svg: { fill: 'white', bg: 'green.600', borderRadius: 'full', p: '.5px' },
		}, // ✅ Only changes icon color
	};

	return (
		<Box
			py='8'
			px='4'
			rounded='md'
			shadow='sm'
			fontFamily="'DM Sans', sans-serif"
			bg='softGray.800'
		>
			<Flex justifyContent='space-between' mb='8'>
				<Text color={'gray.900'} fontSize='22px' fontWeight='600'>
					<span style={{ marginRight: '4px' }}>Leads</span>
					<CountUpComponent targetNumber={leads?.totalLeads} />
				</Text>

				{/* Action buttons */}
				<HStack gap='2'>
					<Button
						{...buttonStyle}
						// onClick={handleFirst}
						isDisabled={true}
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
					>
						New
					</Button>
				</HStack>
			</Flex>
			<Leads
				leads={leads}
				leadsLoading={leadsLoading}
				currentPage={currentPage}
				hanldePage={handlePageChange}
				pageSize={pageSize}
			/>
		</Box>
	);
};

export default LeadScreen;
