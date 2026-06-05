// import { useEffect, useState } from 'react';
// import {
// 	Button,
// 	Box,
// 	Flex,
// 	Text,
// 	Table,
// 	Thead,
// 	Tbody,
// 	Tr,
// 	Th,
// 	Td,
// } from '@chakra-ui/react';
// import AppButton from 'components/shared/AppButton';
// import { IoArrowBack } from 'react-icons/io5';
// import { useNavigate } from 'react-router-dom';
// import { useFetchItemsQuery } from 'api/apiSlice';
// import TopPagination from 'components/pagination/TopPagination';
// import CountUpComponent from 'components/countUpComponent/countUpComponent';
// import { AddIcon } from '@chakra-ui/icons';
// import TableLoading from 'components/loading/TableLoading';
// import NoData from 'views/admin/lead-v2/components/subComponents/NoData';
// import AddRole from './Add';

// const Index = () => {
// 	const navigate = useNavigate();
// 	const [currentPage, setCurrentPage] = useState(1);
// 	const [pageSize, setPageSize] = useState(10);
// 	const [totalPages, setTotalPages] = useState(0);
// 	const [totalItems, setTotalItems] = useState(0);
// 	const [action, setAction] = useState(false);

// 	const [addRoleModal, setAddRoleModal] = useState(false);

// 	const columns = ['SR.No', 'Role Name', 'Description', 'action'];

// 	const buildQueryParams = () => {
// 		const params = {
// 			page: currentPage,
// 			limit: pageSize,
// 		};

// 		return params;
// 	};
// 	const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
// 		{ path: `/role-access/v2`, params: buildQueryParams() },
// 		{ refetchOnMountOrArgChange: true }
// 	);

// 	useEffect(() => {
// 		if (data) {
// 			setTotalPages(data.totalPages || 0);
// 			setTotalItems(data.totalRecords || 0);
// 		}
// 	}, [data]);

// 	const handlePageSizeChange = (newPageSize) => {
// 		setPageSize(newPageSize);
// 		setCurrentPage(1);
// 	};

// 	return (
// 		<div>
// 			<AppButton
// 				ml='2'
// 				leftIcon={<IoArrowBack />}
// 				onClick={() => navigate(-1)}
// 				mb={4}
// 			>
// 				Back
// 			</AppButton>
// 			<Box bg='white' px={2}>
// 				<Flex
// 					justifyContent='space-between'
// 					p={3}
// 					alignItems={'center'}
// 					flexDir={{ base: 'column', sm: 'column', md: 'row' }}
// 				>
// 					<Text fontSize='20px' fontWeight='bold' color='black' p={3}>
// 						Roles (
// 						<CountUpComponent
// 							key={data?.totalRecords}
// 							targetNumber={data?.totalRecords}
// 						/>
// 						)
// 					</Text>

// 					<Button
// 						leftIcon={<AddIcon />}
// 						colorScheme='brand'
// 						size='sm'
// 						borderRadius='md'
// 						py={3}
// 						px={6}
// 						onClick={() => setAddRoleModal(true)}
// 					>
// 						Add Role
// 					</Button>
// 				</Flex>

// 				<Box my={2}>
// 					<TopPagination
// 						currentPage={currentPage}
// 						totalPages={totalPages}
// 						onPageChange={setCurrentPage}
// 						totalItems={totalItems}
// 						itemsPerPage={pageSize}
// 						setPageSize={setPageSize}
// 						handlePageSize={handlePageSizeChange}
// 						refetching={isLoading}
// 						loading={isLoading}
// 					/>
// 				</Box>

// 				<Box
// 					borderRadius='4px'
// 					boxShadow='sm'
// 					borderWidth='1px'
// 					overflow='hidden'
// 				>
// 					<Box position='relative' maxH='120vh' overflowY='auto'>
// 						<Table variant='striped' size='lg'>
// 							<Thead
// 								position='sticky'
// 								top={0}
// 								bg='white'
// 								zIndex={2}
// 								boxShadow='0px 2px 8px rgba(0, 0, 0, 0.1)'
// 								fontSize={'16px'}
// 								borderRadius='lg'
// 							>
// 								<Tr>
// 									{columns.map((header, index) => (
// 										<Th
// 											key={index}
// 											bg='brand.200'
// 											whiteSpace='nowrap'
// 											py={4}
// 											textAlign='center'
// 										>
// 											<Text
// 												fontSize='14px'
// 												fontWeight='600'
// 												color='gray.700'
// 												textTransform='capitalize'
// 											>
// 												{header}
// 											</Text>
// 										</Th>
// 									))}
// 								</Tr>
// 							</Thead>

// 							{isLoading || isFetching ? (
// 								<TableLoading columns={columns} length={7} py='4' />
// 							) : (
// 								<Tbody>
// 									{data && data?.data?.length > 0 ? (
// 										data?.data.map((role, index) => (
// 											<Tr key={index}>
// 												<Td
// 													py={4}
// 													fontSize={{ base: '12px', md: '14px' }}
// 													fontWeight='400'
// 													minWidth='100px'
// 													textAlign={'center'}
// 												>
// 													{role.serialNumber}
// 												</Td>
// 												<Td
// 													whiteSpace='nowrap'
// 													minWidth='200px'
// 													overflow='hidden'
// 													textOverflow='ellipsis'
// 												>
// 													{role.roleName}
// 												</Td>
// 												<Td textAlign='center'>{role.description || 'N/A'}</Td>
// 												<Td textAlign='center'>
// 													<Button
// 														size='sm'
// 														borderRadius={'md'}
// 														colorScheme='brand'
// 														onClick={() =>
// 															navigate(`/user-permission/${role?._id}`)
// 														}
// 													>
// 														View Permission
// 													</Button>
// 												</Td>
// 											</Tr>
// 										))
// 									) : (
// 										<Tr borderColor='gray.200' textAlign='center'>
// 											<Td
// 												borderBottom='none'
// 												colSpan='13'
// 												fontSize={{ base: '12px', md: '15px' }}
// 												fontWeight='500'
// 												color='gray.500'
// 												textAlign='center'
// 											>
// 												<NoData label='listing' />
// 											</Td>
// 										</Tr>
// 									)}
// 								</Tbody>
// 							)}
// 						</Table>
// 					</Box>
// 				</Box>
// 			</Box>
// 			<AddRole
// 				isOpen={addRoleModal}
// 				size={'sm'}
// 				setAction={setAction}
// 				onClose={setAddRoleModal}
// 				fetchData={() => refetch()}
// 			/>
// 		</div>
// 	);
// };

// export default Index;

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
	Button,
	Box,
	Flex,
	Text,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Icon,
	HStack,
	Badge,
	Tooltip,
} from '@chakra-ui/react';
import AppButton from 'components/shared/AppButton';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useFetchItemsQuery } from 'api/apiSlice';
import TopPagination from 'components/pagination/TopPagination';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { AddIcon, ViewIcon } from '@chakra-ui/icons';
import { FiShield, FiFileText } from 'react-icons/fi';
import TableLoading from 'components/loading/TableLoading';
import NoData from 'views/admin/lead-v2/components/subComponents/NoData';
import AddRole from './Add';

const Index = () => {
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [totalPages, setTotalPages] = useState(0);
	const [totalItems, setTotalItems] = useState(0);
	const [addRoleModal, setAddRoleModal] = useState(false);

	const columns = [
		{ key: 'sno', label: 'S.No', width: '70px' },
		{ key: 'role', label: 'Role Name' },
		{ key: 'description', label: 'Description' },
		{ key: 'action', label: 'Action', width: '140px', align: 'center' },
	];

	const buildQueryParams = useCallback(() => {
		return { page: currentPage, limit: pageSize };
	}, [currentPage, pageSize]);

	const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
		{ path: `/role-access/v2`, params: buildQueryParams() },
		{ refetchOnMountOrArgChange: true },
	);

	useEffect(() => {
		if (data) {
			setTotalPages(data.totalPages || 0);
			setTotalItems(data.totalRecords || 0);
		}
	}, [data]);

	const handlePageSizeChange = useCallback((newPageSize) => {
		setPageSize(newPageSize);
		setCurrentPage(1);
	}, []);

	const handleAddRole = useCallback(() => setAddRoleModal(true), []);
	const handleCloseModal = useCallback(() => setAddRoleModal(false), []);
	const handleRefresh = useCallback(() => refetch(), [refetch]);

	return (
		<Box>
			{/* Back Button */}
			<AppButton
				leftIcon={<IoArrowBack />}
				onClick={() => navigate(-1)}
				mb={4}
				size='sm'
				variant='ghost'
			>
				Back
			</AppButton>

			{/* Main Container */}
			<Box
				bg='bg.surface'
				borderRadius='xl'
				borderWidth='1px'
				borderColor='border.default'
				overflow='hidden'
			>
				{/* Header Section */}
				<Flex
					justifyContent='space-between'
					alignItems='center'
					flexDir={{ base: 'column', sm: 'row' }}
					gap={{ base: 3, sm: 0 }}
					p={4}
					borderBottomWidth='1px'
					borderBottomColor='border.default'
				>
					<HStack spacing={2}>
						<Text fontSize='lg' fontWeight='bold' color='text.heading'>
							Roles
						</Text>
						{data?.totalRecords?.length && (
							<CountUpComponent
								key={data?.totalRecords}
								targetNumber={data?.totalRecords || 0}
							/>
						)}
					</HStack>

					<Button
						leftIcon={<AddIcon />}
						variant='brand'
						size='sm'
						borderRadius='lg'
						onClick={handleAddRole}
					>
						Add Role
					</Button>
				</Flex>

				{/* Pagination */}
				<Box px={4} pt={4}>
					<TopPagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
						totalItems={totalItems}
						itemsPerPage={pageSize}
						setPageSize={setPageSize}
						handlePageSize={handlePageSizeChange}
						refetching={isLoading}
						loading={isLoading}
					/>
				</Box>

				{/* Table Section */}
				<Box overflowX='auto' minH='60vh' p={4} pt={2}>
					<Table variant='simple' size='md'>
						<Thead>
							<Tr bg='bg.elevated'>
								{columns?.map((col) => (
									<Th
										key={col.key}
										color='gold.primary'
										fontSize='xs'
										fontWeight='semibold'
										letterSpacing='wide'
										textTransform='uppercase'
										whiteSpace='nowrap'
										textAlign={col.align || 'left'}
									>
										<HStack spacing={2}>
											{col.icon && <Icon as={col.icon} boxSize={3.5} />}
											<Text>{col.label}</Text>
										</HStack>
									</Th>
								))}
							</Tr>
						</Thead>

						{isLoading || isFetching ? (
							<TableLoading columns={columns} length={7} py='4' />
						) : (
							<Tbody>
								{data?.data?.length > 0 ? (
									data.data.map((role, index) => (
										<Tr
											key={role._id || index}
											_hover={{ bg: 'bg.elevated' }}
											transition='background 0.2s'
										>
											<Td color='text.muted' fontWeight='medium'>
												{role.serialNumber || index + 1}
											</Td>
											<Td>
												<Text fontWeight='semibold' color='text.heading'>
													{role.roleName}
												</Text>
											</Td>
											<Td>
												<Text color='text.body' fontSize='sm' noOfLines={1}>
													{role.description || '—'}
												</Text>
											</Td>
											<Td>
												<Button
													size='sm'
													variant='outline'
													leftIcon={<ViewIcon />}
													borderRadius='lg'
													onClick={() =>
														navigate(`/user-permission/${role._id}`)
													}
													_hover={{
														bg: 'rgba(212, 175, 55, 0.1)',
														borderColor: 'gold.primary',
														color: 'gold.primary',
													}}
												>
													View Permissions
												</Button>
											</Td>
										</Tr>
									))
								) : (
									<Tr>
										<Td colSpan={columns.length} py={12}>
											<NoData label='roles' />
										</Td>
									</Tr>
								)}
							</Tbody>
						)}
					</Table>
				</Box>
			</Box>

			{/* Add Role Modal */}
			<AddRole
				isOpen={addRoleModal}
				size='sm'
				onClose={handleCloseModal}
				fetchData={handleRefresh}
			/>
		</Box>
	);
};

export default Index;
