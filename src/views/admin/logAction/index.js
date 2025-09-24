import React, { useState, useEffect } from 'react';
import {
	Box,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Flex,
	Text,
	Badge,
	useColorModeValue,
	Icon,
	IconButton,
	useColorMode,
	Heading,
	Stack,
	Tooltip,
} from '@chakra-ui/react';
import { FiFilter, FiUser, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import TopPagination from 'components/pagination/TopPagination';
import { useFetchItemsQuery } from 'api/apiSlice';
import { toast } from 'react-toastify';
import LogDetailsDrawer from './component/LogDetailsDrawer';
import AdvancedFilter from './component/AdvancedFilter';
import NoData from 'views/admin/lead-v2/components/subComponents/NoData';
import TableLoading from 'components/loading/TableLoading';
import { formatPostDate } from 'utils/helpers';
import { usePermissions } from 'hooks/usePermissions';
import { useNavigate } from 'react-router-dom';
import SearchTags from 'components/search/SearchTags';

const grayColors = {
	primary: '#49505cff',
	light: '#a0aec0ff',
	dark: '#2d3748ff',
	lighter: '#edf2f7ff',
	darkest: '#1a202cff',
	text: '#2d3748ff',
	lightBg: '#f7fafcff',
	darkBg: '#171923ff',
	hoverBg: 'rgba(0, 0, 0, 0.05)',
	hoverText: '#4a5568ff',
};

const levels = {
	VIEW: 1,
	LIST: 2,
	CREATE: 3,
	LOGIN: 4,
	UPDATE: 5,
	APPROVE: 6,
	DELETE: 7,
	BULK_DELETE: 8,
	ASSIGN: 9,
	BULK_ASSIGN: 10,
};

const statusOptions = [
	{ label: 'Success', value: 'success' },
	{ label: 'Fail', value: 'fail' },
	{ label: 'Error', value: 'error' },
];

const entityOptions = [
	{ label: 'Auth', value: 'Auth' },
	{ label: 'Lead', value: 'Lead' },
	{ label: 'Leads Pool', value: 'Lead-pool' },
	{ label: 'Annoucement', value: 'Annoucement' },
	{ label: 'Hiring', value: 'Hiring' },
	{ label: 'Attendence', value: 'Attendence' },
	{ label: 'Invoice', value: 'Invoice' },
	{ label: 'Expense', value: 'Expense' },
	{ label: 'Task', value: 'Task' },
	{ label: 'Call Log', value: 'Call-log' },
	{ label: 'Listing', value: 'Listing' },
	{ label: 'Survey', value: 'Survey' },
	{ label: 'Whatsapp', value: 'Whatsapp' },
	{ label: 'Reports', value: 'Reports' },
];

const actionOptions = Object.keys(levels).map((action) => ({
	label: action.replace(/_/g, ' '),
	value: action,
}));

const levelOptions = Array.from({ length: 8 }, (_, i) => ({
	value: i + 1,
}));

const MotionTr = motion(Tr);

const LogTable = () => {
	const [selectedLog, setSelectedLog] = useState(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);
	const [totalPages, setTotalPages] = useState(0);
	const [totalItems, setTotalItems] = useState(0);
	const [displayCount, setDisplayCount] = useState(0);
	const [searchTags, setSearchTags] = useState(null);

	const [filters, setFilters] = useState({
		userId: '',
		status: '',
		from: '',
		to: '',
		entity: '',
		action: '',
		securityLevel: '',
		entityId: '',
	});

	const { colorMode } = useColorMode();
	const borderColor = useColorModeValue('gray.200', 'gray.600');
	const headerBg = useColorModeValue(grayColors.primary, grayColors.darkest);
	const headerBorderColor = 'gray.800';
	const bodyBorderColor = useColorModeValue('gray.200', 'gray.600');

	const { hasPermission } = usePermissions();
	const navigate = useNavigate();

	useEffect(() => {
		if (!hasPermission('system_log')) return navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const buildQueryParams = () => {
		const params = {
			page: currentPage,
			limit: pageSize,
		};

		if (filters.userId) params.userId = filters.userId;
		if (filters.status) params.status = filters.status;
		if (filters.from)
			params.from = new Date(filters.from).toISOString().split('T')[0];
		if (filters.to)
			params.to = new Date(filters.to).toISOString().split('T')[0];
		if (filters.entity) params.entity = filters.entity;
		if (filters.action) params.action = filters.action;
		if (filters.securityLevel) params.securityLevel = filters.securityLevel;
		if (filters.roleId) params.roleId = filters.roleId;
		if (filters.entityId) params.entityId = filters.entityId;

		return params;
	};

	const { data, isLoading, isFetching, error, refetch } = useFetchItemsQuery(
		{
			path: '/logs/user_activities',
			params: buildQueryParams(),
		},
		{ refetchOnMountOrArgChange: true }
	);

	const { data: usersData } = useFetchItemsQuery(
		{
			path: '/v2/user/search_users',
		},
		{ refetchOnMountOrArgChange: true }
	);

	const { data: roleData } = useFetchItemsQuery(
		{
			path: '/role-access/v2',
		},
		{ refetchOnMountOrArgChange: true }
	);

	useEffect(() => {
		if (data) {
			setTotalPages(data.totalPages || 1);
			setTotalItems(data.total || 0);
			if (data.total !== displayCount) {
				const duration = 1000;
				const start = displayCount;
				const end = data.total;
				const startTime = performance.now();

				const animateCount = (currentTime) => {
					const elapsedTime = currentTime - startTime;
					const progress = Math.min(elapsedTime / duration, 1);
					const currentCount = Math.floor(start + (end - start) * progress);

					setDisplayCount(currentCount);

					if (progress < 1) {
						requestAnimationFrame(animateCount);
					} else {
						setDisplayCount(end);
					}
				};

				requestAnimationFrame(animateCount);
			}
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			toast({
				title: 'Error fetching logs',
				description: error.message || 'Failed to load logs',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	}, [error]);

	const scrollbarStyles = {
		'&::-webkit-scrollbar': {
			height: '6px',
			width: '6px',
		},
		'&::-webkit-scrollbar-track': {
			background: useColorModeValue('#f1f1f1', 'gray.700'),
		},
		'&::-webkit-scrollbar-thumb': {
			background: useColorModeValue('#c1c1c1', 'gray.500'),
			borderRadius: '3px',
		},
		'&::-webkit-scrollbar-thumb:hover': {
			background: useColorModeValue('#a8a8a8', 'gray.400'),
		},
	};

	const getStatusColor = (status) => {
		switch (status?.toLowerCase()) {
			case 'success':
				return 'green';
			case 'fail':
				return 'red';
			case 'pending':
				return 'yellow';
			default:
				return 'gray';
		}
	};

	const renderSecurityLevel = (levelValue) => {
		const maxLevel = 8;
		const boxHeight = '8px';

		const getLevelColor = (level) => {
			if (level >= 6) return 'red.500';
			if (level >= 4) return 'orange.500';
			if (level >= 2) return 'blue.500';
			return 'green.500';
		};

		const levelColor = getLevelColor(levelValue);

		return (
			<Flex
				borderWidth='1px'
				borderColor='gray.300'
				borderRadius='sm'
				p='2px'
				w='80px'
				h={`calc(${boxHeight} + 4px)`}
				alignItems='center'
				bg='white'
			>
				<Flex width='100%' justify='space-between' gap='2px'>
					{Array.from({ length: maxLevel }).map((_, index) => (
						<Box
							key={index}
							flex='1'
							minWidth='0'
							h={boxHeight}
							borderRadius='sm'
							bg={index < levelValue ? levelColor : 'gray.100'}
							borderWidth='1px'
							borderColor={index < levelValue ? levelColor : 'gray.300'}
						/>
					))}
				</Flex>
			</Flex>
		);
	};

	const applyFilters = (newFilters) => {
		setFilters(newFilters);
		setIsFilterOpen(false);
		setCurrentPage(1);
	};

	const resetFilters = () => {
		setFilters({
			userId: '',
			status: '',
			from: '',
			to: '',
			entity: '',
			action: '',
			securityLevel: '',
			entityId: '',
		});
		setCurrentPage(1);
		setSearchTags(null);
	};

	const closeDrawer = () => setIsDrawerOpen(false);

	const handlePageSizeChange = (newPageSize) => {
		setPageSize(newPageSize);
		setCurrentPage(1);
	};

	const transformLogData = (log) => ({
		...log,
		userName: log.user?.fullName || log.user?.username || 'Unknown User',
		// role:
		// 	(log.user.role === 'superAdmin'
		// 		? log.user.role
		// 		: log.user?.roles?.[0]?.roleName) || 'N/A',
		securityLevel: log?.securityLevel || 1,
		metadata: {
			ip: log.metadata?.ip || 'N/A',
			device: log.metadata?.device || 'Unknown Device',
			browser: log.metadata?.browser || 'Unknown Browser',
			os: log.metadata?.os || 'Unknown OS',
			osVersion: log.metadata?.osVersion || 'Unknown OS Version',
			browserVersion: log.metadata?.browserVersion || 'Unknown Browser Version',
			country: log.metadata?.country || 'Unknown Country',
			region: log.metadata?.region || 'Unknown Region',
			city: log.metadata?.city || 'Unknown City',
			timezone: log.metadata?.timezone || 'Unknown Timezone',
			timestamp: log.createdAt,
		},
	});

	return (
		<Box borderRadius='md' mt={'-18px'} mr={'-5px'} bg={'white'} p={2}>
			<Stack
				direction={{ base: 'column', sm: 'row' }}
				justifyContent='space-between'
				alignItems={{ base: 'flex-start', sm: 'center' }}
				mb={4}
				spacing={2}
			>
				<Heading as='h3' size='md' fontWeight='bold' color={grayColors.primary}>
					System Log ({displayCount})
				</Heading>
				<Flex gap={2} align='center'>
					<IconButton
						icon={<FiFilter />}
						variant='ghost'
						onClick={() => setIsFilterOpen(true)}
						aria-label='Filter'
						size='xs'
						ml={2}
					/>
					<IconButton
						icon={<FiRefreshCw />}
						aria-label='Refresh logs'
						onClick={() => refetch()}
						isLoading={isFetching}
						variant='outline'
						size='sm'
					/>
				</Flex>
			</Stack>
			{searchTags && searchTags?.length > 0 && filters && (
				<Flex
					gap={2}
					flexDir={{ base: 'column', sm: 'column', md: 'row' }}
					mb={2}
					justifyContent={'space-between'}
					alignItems={{ base: 'flex-start', sm: 'center' }}
				>
					<SearchTags searchTags={searchTags} />

					<Text
						as='button'
						fontSize='sm'
						color='red.500'
						fontWeight='medium'
						borderColor='red.500'
						borderWidth='1px'
						px={3}
						py={1}
						borderRadius='full'
						_hover={{ bg: 'red.50' }}
						onClick={resetFilters}
					>
						Clear
					</Text>
				</Flex>
			)}
			<Box mb={1}>
				<TopPagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
					totalItems={totalItems}
					itemsPerPage={pageSize}
					setPageSize={setPageSize}
					handlePageSize={handlePageSizeChange}
					refetching={isFetching}
					loading={isLoading}
					sizeMedium={true}
				/>
			</Box>
			<Box
				borderWidth='1px'
				borderRadius='lg'
				borderColor={borderColor}
				overflowX='auto'
				sx={scrollbarStyles}
				bg='white'
				h={'75vh'}
			>
				<Table variant='simple' size='sm' layout='fixed'>
					<Thead
						position='sticky'
						top={0}
						bg={headerBg}
						zIndex={2}
						boxShadow='0px 2px 8px rgba(0, 0, 0, 0.1)'
						height='24px'
					>
						<Tr>
							<Th
								color='white'
								fontSize='xs'
								borderRightWidth='1px'
								borderRightColor={headerBorderColor}
								borderBottomWidth='1px'
								borderBottomColor={headerBorderColor}
								whiteSpace='nowrap'
							>
								<Text fontSize='xs'>User</Text>
							</Th>
							<Th
								color='white'
								fontSize='xs'
								borderRightWidth='1px'
								borderRightColor={headerBorderColor}
								borderBottomWidth='1px'
								borderBottomColor={headerBorderColor}
								textAlign={'center'}
								whiteSpace='nowrap'
							>
								Action
							</Th>
							<Th
								color='white'
								fontSize='xs'
								borderRightWidth='1px'
								borderRightColor={headerBorderColor}
								borderBottomWidth='1px'
								borderBottomColor={headerBorderColor}
								textAlign={'center'}
								whiteSpace='nowrap'
							>
								Status
							</Th>
							<Th
								color='white'
								fontSize='xs'
								borderRightWidth='1px'
								borderRightColor={headerBorderColor}
								borderBottomWidth='1px'
								borderBottomColor={headerBorderColor}
								textAlign={'center'}
								whiteSpace='nowrap'
							>
								Ip Address
							</Th>
							<Th
								color='white'
								fontSize='xs'
								borderRightWidth='1px'
								borderRightColor={headerBorderColor}
								borderBottomWidth='1px'
								borderBottomColor={headerBorderColor}
								textAlign={'center'}
								whiteSpace='nowrap'
							>
								Security Level
							</Th>
							<Th
								color='white'
								fontSize='xs'
								borderRightWidth='1px'
								borderRightColor={headerBorderColor}
								borderBottomWidth='1px'
								borderBottomColor={headerBorderColor}
								textAlign={'center'}
								whiteSpace='nowrap'
							>
								Message
							</Th>
							<Th
								color='white'
								fontSize='xs'
								borderBottomWidth='1px'
								borderBottomColor={headerBorderColor}
								textAlign={'center'}
								whiteSpace='nowrap'
							>
								Timestamp
							</Th>
						</Tr>
					</Thead>
					<Tbody>
						{isLoading || isFetching ? (
							<TableLoading
								columns={[
									'User',
									'Action',
									'Status',
									'Ip Address',
									'Security Level',
									'Message',
									'TimeStamp',
								]}
								length={20}
								py='4'
							/>
						) : data?.doc?.length > 0 ? (
							data?.doc.map((log, index) => {
								const transformedLog = transformLogData(log);
								return (
									<MotionTr
										key={log._id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3, delay: index * 0.05 }}
										_hover={{
											bg: colorMode === 'light' ? 'gray.100' : 'gray.700',
										}}
										onClick={() => {
											setSelectedLog(transformedLog);
											setIsDrawerOpen(true);
										}}
										cursor='pointer'
									>
										<Td
											py={2}
											px={4}
											fontSize='xs'
											borderRightWidth='1px'
											borderRightColor={bodyBorderColor}
											borderBottomWidth='1px'
											borderBottomColor={bodyBorderColor}
											overflow='hidden'
											textOverflow='ellipsis'
											whiteSpace='nowrap'
											textAlign={'center'}
										>
											<Flex align='center'>
												<Icon as={FiUser} mr={2} color={grayColors.primary} />
												<Text fontSize='xs'>{transformedLog.userName}</Text>
											</Flex>
										</Td>
										<Td
											py={2}
											px={4}
											fontSize='xs'
											borderRightWidth='1px'
											borderRightColor={bodyBorderColor}
											borderBottomWidth='1px'
											borderBottomColor={bodyBorderColor}
											overflow='hidden'
											textOverflow='ellipsis'
											whiteSpace='nowrap'
											textAlign={'center'}
										>
											{transformedLog.action.replace(/_/g, ' ')}
										</Td>
										<Td
											py={2}
											px={4}
											fontSize='xs'
											borderRightWidth='1px'
											borderRightColor={bodyBorderColor}
											borderBottomWidth='1px'
											borderBottomColor={bodyBorderColor}
											textAlign={'center'}
										>
											<Badge
												colorScheme={getStatusColor(transformedLog.status)}
												px={2}
												py={0.5}
												borderRadius='full'
												fontSize='xs'
											>
												{transformedLog.status}
											</Badge>
										</Td>
										<Td
											py={2}
											px={4}
											fontSize='xs'
											borderRightWidth='1px'
											borderRightColor={bodyBorderColor}
											borderBottomWidth='1px'
											borderBottomColor={bodyBorderColor}
											overflow='hidden'
											textOverflow='ellipsis'
											whiteSpace='nowrap'
											textAlign={'center'}
										>
											{transformedLog.metadata.ip}
										</Td>
										<Td
											p={0}
											fontSize='xs'
											borderRightWidth='1px'
											borderRightColor={bodyBorderColor}
											borderBottomWidth='1px'
											borderBottomColor={bodyBorderColor}
											textAlign='center'
										>
											<Flex justifyContent='center' width='100%'>
												{renderSecurityLevel(transformedLog.securityLevel)}
											</Flex>
										</Td>
										<Tooltip label={transformedLog.message} hasArrow>
											<Td
												py={2}
												px={4}
												fontSize='xs'
												borderRightWidth='1px'
												borderRightColor={bodyBorderColor}
												borderBottomWidth='1px'
												borderBottomColor={bodyBorderColor}
												maxW='250px'
												overflow='hidden'
												textOverflow='ellipsis'
												whiteSpace='nowrap'
											>
												{transformedLog.message}
											</Td>
										</Tooltip>

										<Td
											py={2}
											px={4}
											fontSize='xs'
											borderBottomWidth='1px'
											borderBottomColor={bodyBorderColor}
											overflow='hidden'
											textOverflow='ellipsis'
											whiteSpace='nowrap'
											textAlign={'center'}
										>
											{formatPostDate(transformedLog.metadata.timestamp)}
										</Td>
									</MotionTr>
								);
							})
						) : (
							<Tr borderColor='gray.200' textAlign='center'>
								<Td
									borderBottom='none'
									colSpan='20'
									fontSize={{ base: '12px', md: '15px' }}
									fontWeight='500'
									color='gray.500'
									textAlign='center'
								>
									<NoData label='log' />
								</Td>
							</Tr>
						)}
					</Tbody>
				</Table>
			</Box>

			<AdvancedFilter
				isOpen={isFilterOpen}
				onClose={() => setIsFilterOpen(false)}
				filters={filters}
				applyFilters={applyFilters}
				resetFilters={resetFilters}
				grayColors={grayColors}
				statusOptions={statusOptions}
				actionOptions={actionOptions}
				levelOptions={levelOptions}
				entityOptions={entityOptions}
				usersData={usersData}
				roleData={roleData}
				setSearchTags={setSearchTags}
			/>

			<LogDetailsDrawer
				isOpen={isDrawerOpen}
				onClose={closeDrawer}
				selectedLog={selectedLog}
				grayColors={grayColors}
				renderSecurityLevel={renderSecurityLevel}
				getStatusColor={getStatusColor}
			/>
		</Box>
	);
};

export default LogTable;
