
import { useFetchItemsQuery } from 'api/apiSlice';
import { useEffect, useState } from 'react';
import WhatsappCards from './WhatsappCards';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { Box, Button, Flex, IconButton, Stack, Text } from '@chakra-ui/react';
import CustomTooltip from 'components/shared/CustomTooltip';
import { Link } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { usePermissions } from 'hooks/usePermissions';
import TopPagination from 'components/pagination/TopPagination';
import { useModalColors } from 'hooks/useModalColors';
import RefreshButton from 'components/refresh/RefreshButton';

const AdminWhatsapp = () => {
	const colors = useModalColors();
	const [users, setUsers] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const { hasPermission } = usePermissions();

	const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
		{
			path: 'whatsapp/users',
			params: { page: currentPage, limit: pageSize },
		},
		{
			refetchOnMountOrArgChange: true,
		}
	);

	useEffect(() => {
		if (data?.doc?.length) {
			setUsers(data?.doc);
		}
	}, [data?.doc]);

	const totalPages = data?.totalPages || 1;
	const totalItems = data?.totalItems || 0;

	// Handle page change
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	// Handle page size change
	const handlePageSizeChange = (newSize) => {
		setPageSize(newSize);
		setCurrentPage(1);
	};

	// Refetch when page or pageSize changes
	useEffect(() => {
		refetch();
	}, [currentPage, pageSize, refetch]);

	return (
		<Box
			p={6}
			bg={colors.bg}
			gap="2"
			display={"flex"}
			flexDirection={"column"}
			borderRadius='lg'
			boxShadow={colors.cardShadow}
			border="1px solid"
			borderColor={colors.borderColor}
		>
			<Flex justify='space-between' align='center' mb={4} flexWrap='wrap' gap={4}>
				<Flex fontSize='lg' fontWeight='bold' gap='2' align='center'>
					<Text color={colors.headingText}>Whatsapp Users</Text>
					<CountUpComponent key={users?.length} targetNumber={totalItems || 0} />
				</Flex>

				<Flex gap={2} align='center'>
					{hasPermission('whatsapp', 'settings') && (
						<CustomTooltip label='Settings'>
							<Link to='/whatsapp/settings'>
								<IconButton
									icon={<FiSettings />}
									aria-label='Settings'
									variant="ghost"
									size="md"
								/>
							</Link>
						</CustomTooltip>
					)}
					<RefreshButton
	label="Refresh"
	onClick={refetch}
	isLoading={isLoading}
	isFetching={isFetching}
	size="sm"
/>
				</Flex>
			</Flex>

			{/* Top Pagination */}
			<Box mt={6}>
				<TopPagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
					totalItems={totalItems}
					itemsPerPage={pageSize}
					handlePageSize={handlePageSizeChange}
					refetching={isFetching}
					loading={isLoading}
					pageLimit={true}
				/>
			</Box>

			<WhatsappCards
				data={users}
				isLoading={isLoading}
				isFetching={isFetching}
			/>

			{/* Show message when no data */}
			{!isLoading && users?.length === 0 && (
				<Box mt={8} textAlign='center'>
					<Text color={colors.mutedText}>No WhatsApp users found</Text>
				</Box>
			)}
		</Box>
	);
};

export default AdminWhatsapp;