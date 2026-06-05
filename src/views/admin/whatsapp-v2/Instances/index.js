
import { useFetchItemsQuery } from 'api/apiSlice';
import { useEffect, useState } from 'react';
import WhatsappCards from './WhatsappCards';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import {
	Badge,
	Box,
	Button,
	Flex,
	IconButton,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { usePermissions } from 'hooks/usePermissions';
import CreateInstance from './CreateInstance';
import { whatsappColors } from 'utils/helpers';
import { FaPlus } from 'react-icons/fa';
import CustomTooltip from 'components/shared/CustomTooltip';
import TopPagination from 'components/pagination/TopPagination';
import { useModalColors } from 'hooks/useModalColors';
import RefreshButton from 'components/refresh/RefreshButton';

const AdminWhatsapp = () => {
	const colors = useModalColors();
	const [instances, setInstances] = useState([]);
	const [selectedInstance, setSelectedInstance] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const { hasPermission } = usePermissions();
	const navigate = useNavigate();

	useEffect(() => {
		if (!hasPermission('whatsapp', 'whatsapp_beta'))
			return navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const {
		isOpen: createInstanceIsOpen,
		onClose: createInstanceOnClose,
		onOpen: createInstanceOpen,
	} = useDisclosure();

	const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
		{
			path: 'whatsapp/instances',
			params: { page: currentPage, limit: pageSize },
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

	const updateInstances = (id, updated) => {
		setInstances((prev) => {
			const exists = prev.some((item) => item._id === id);
			if (exists) {
				return prev.map((item) =>
					item._id === id ? { ...item, ...updated } : item
				);
			}
			return [{ ...updated }, ...prev];
		});
	};

	const removeInstance = (id) => {
		setInstances((prev) => prev.filter((item) => item._id !== id));
	};

	// Handle refresh
	const handleRefresh = () => {
		refetch();
	};

	return (
		<Box p={6} bg={colors.bg} borderRadius='lg' boxShadow={colors.cardShadow} border='1px solid' borderColor={colors.borderColor}>
			<Flex
				flexDir={{ base: 'column', md: 'row' }}
				justify='space-between'
				align='center'
				mb={4}
				gap={4}
			>
				<Flex alignSelf='flex-start' fontSize='lg' fontWeight='bold' gap='2'>
					<Flex align='center' gap={2}>
						<Text color={colors.headingText}>Whatsapp Chats</Text>
						<Badge
							bg={colors.badgeSuccessBg}
							color={colors.badgeSuccessText}
							variant='subtle'
							fontSize='0.7em'
							px={2}
							py={1}
							borderRadius='full'
						>
							Beta
						</Badge>
					</Flex>
					<CountUpComponent
						key={instances?.length}
						targetNumber={totalItems || 0}
					/>
				</Flex>

				<Flex gap={2} align='center'>
					<Button
						leftIcon={<FaPlus size='1em' />}
						bg={whatsappColors.primary}
						color='white'
						_hover={{ bg: whatsappColors.primary }}
						_active={{ bg: whatsappColors.primary }}
						size='sm'
						rounded='md'
						px={4}
						shadow='md'
						onClick={createInstanceOpen}
					>
						Create Chat
					</Button>
					<RefreshButton
	label="Refresh"
	onClick={handleRefresh}
	isLoading={isLoading}
	isFetching={isFetching}
	size="sm"
/>
				</Flex>
			</Flex>

			{/* Top Pagination */}
			<Box display="flex" flexDirection="column" gap="2">
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

				<WhatsappCards
					data={instances}
					updateInstances={updateInstances}
					removeInstance={removeInstance}
					isLoading={isLoading}
					isFetching={isFetching}
				/>
			</Box>

			{/* Show message when no data */}
			{!isLoading && instances?.length === 0 && (
				<Box mt={8} textAlign='center'>
					<Text color={colors.mutedText}>No WhatsApp instances found</Text>
					<Button
						mt={4}
						leftIcon={<FaPlus />}
						bg={whatsappColors.primary}
						color='white'
						_hover={{ bg: whatsappColors.primary }}
						size='sm'
						onClick={createInstanceOpen}
					>
						Create your first chat
					</Button>
				</Box>
			)}

			{createInstanceIsOpen && (
				<CreateInstance
					isOpen={createInstanceIsOpen}
					onClose={createInstanceOnClose}
					instance={selectedInstance}
					updateInstances={updateInstances}
					mode='Add'
				/>
			)}
		</Box>
	);
};

export default AdminWhatsapp;