import { useFetchItemsQuery } from 'api/apiSlice';
import { useEffect, useState } from 'react';
import WhatsappCards from './WhatsappCards';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { Box, Button, Flex, IconButton, Stack, Text } from '@chakra-ui/react';
import { buttonStyle } from 'utils/btn';
import CustomTooltip from 'components/shared/CustomTooltip';
import { Link } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { usePermissions } from 'hooks/usePermissions';

const LIMIT = 10;

const AdminWhatsapp = () => {
	const [instances, setInstances] = useState([]);
	const [page, setPage] = useState(1);
	const { hasPermission } = usePermissions();

	const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
		{
			path: 'whatsapp/instances',
			params: { page, limit: LIMIT },
		},
		{
			refetchOnMountOrArgChange: true,
		}
	);

	useEffect(() => {
		if (data?.doc?.length) {
			setInstances(data?.doc);
		}
	}, [data?.doc]);

	const totalPages = data?.totalPages || 1;

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
				<Flex fontSize='lg' fontWeight='bold' gap='2'>
					<Text>Whatsapp Instances</Text>
					<CountUpComponent
						key={instances?.length}
						targetNumber={instances?.length}
					/>
				</Flex>

				{hasPermission('whatsapp', 'settings') && (
					<CustomTooltip label='Settings'>
						<Link to='/whatsapp/settings'>
							<IconButton
								icon={<FiSettings />}
								aria-label='Settings'
								colorScheme='brand'
								rounded='full'
								size='md'
							/>
						</Link>
					</CustomTooltip>
				)}
			</Flex>

			<WhatsappCards
				data={instances}
				setInstances={setInstances}
				isLoading={isLoading}
				isFetching={isFetching}
				handleNext={handleNext}
				handlePrev={handlePrev}
			/>

			{instances?.length > LIMIT && (
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
			)}
		</Box>
	);
};

export default AdminWhatsapp;
