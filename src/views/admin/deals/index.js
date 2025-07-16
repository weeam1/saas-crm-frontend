import { useEffect, useState } from 'react';
import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';

import { buttonStyle } from 'utils/btn';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
// import EditDealModal from './components/EditDealModal';
import DataView from './DataView';

const LIMIT = 10;

const DealsScreen = () => {
	const [deals, setDeals] = useState([]);
	const [page, setPage] = useState(1);

	const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
		{
			path: 'deals',
			params: { page, limit: LIMIT },
		},
		{
			refetchOnMountOrArgChange: true,
		}
	);

	useEffect(() => {
		if (data?.doc?.length) {
			setDeals(data?.doc);
		}
	}, [data?.doc]);

	const totalPages = data?.meta?.totalPages || 1;

	useEffect(() => {
		refetch();
	}, [page, refetch]);

	useEffect(() => {
		refetch();
	}, [page, refetch]);

	const handleNext = () => {
		if (page < totalPages) setPage((prev) => prev + 1);
	};

	const handlePrev = () => {
		if (page > 1) setPage((prev) => prev - 1);
	};

	return (
		<Box p={6} bg='white' borderRadius='md' boxShadow='sm'>
			<Flex justify='space-between' align='center' mb={4}>
				<HStack gap='1' fontWeight='bold'>
					<Text fontSize='lg'>Close Deals</Text>
					<CountUpComponent
						key={data?.meta?.results}
						targetNumber={data?.meta?.results}
					/>
				</HStack>
			</Flex>

			{/* <DealCards
				deals={deals}
				isLoading={isLoading}
				isFetching={isFetching}
				handleNext={handleNext}
				handlePrev={handlePrev}
				refetch={refetch}
			/> */}

			<DataView
				deals={deals}
				isLoading={isLoading}
				isFetching={isFetching}
				handleNext={handleNext}
				handlePrev={handlePrev}
				refetch={refetch}
			/>

			<Flex
				justify='center'
				align='center'
				mt={6}
				maxWidth={{ base: 'full', md: '50%', lg: '25%', xl: '20%' }}
				mx='auto'
			>
				<Button
					{...buttonStyle}
					bg='softGray.100'
					color='gray.800'
					_active={{ bg: 'gray.200' }}
					onClick={handlePrev}
					px={{ base: 2, md: 4, lg: 6 }}
					isDisabled={page === 1 || isFetching}
				>
					Previous
				</Button>
				<Text
					px={{ base: 2, md: 4, lg: 6 }}
					align='center'
					fontSize='sm'
					flex={1}
				>
					Page {page} of {totalPages}
				</Text>
				<Button
					{...buttonStyle}
					bg='softGray.100'
					color='gray.800'
					_active={{ bg: 'gray.200' }}
					shadow='sm'
					px={{ base: 2, md: 4, lg: 6 }}
					onClick={handleNext}
					isDisabled={page === totalPages || isFetching}
				>
					Next
				</Button>
			</Flex>
		</Box>
	);
};

export default DealsScreen;
