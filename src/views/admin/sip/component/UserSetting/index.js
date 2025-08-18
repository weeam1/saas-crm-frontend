import React, { useState } from 'react';
import {
	Box,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Text,
	Button,
	Flex,
	IconButton,
	useDisclosure,
	useBreakpointValue,
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import AddSipSettingModal from './components/AddSipSettingModal';
import EditSipSettingModal from './components/EditSipSettingModal';
import { useFetchItemsQuery, useDeleteItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import TopPagination from 'components/pagination/TopPagination';
import NoData from 'views/admin/lead-v2/components/subComponents/NoData';
import TableLoading from 'components/loading/TableLoading';
import AdvancedSearchModal from './components/AdvancedSearchModal';
import ActiveFiltersDisplay from './components/ActiveFiltersDisplay';
import { useUserActivityLog } from 'hooks/useUserActivityLog';

const UserSetting = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [filters, setFilters] = useState({});
	const [selectedSip, setSelectedSip] = useState(null);
	const [filterChanged, setFilterChanged] = useState(false);

	const user = JSON.parse(localStorage.getItem('user'));
	const { createUserLog } = useUserActivityLog();
	const {
		isOpen: isAddOpen,
		onOpen: onAddOpen,
		onClose: onAddClose,
	} = useDisclosure();

	const {
		isOpen: isEditOpen,
		onOpen: onEditOpen,
		onClose: onEditClose,
	} = useDisclosure();

	const {
		isOpen: isFilterOpen,
		onOpen: onFilterOpen,
		onClose: onFilterClose,
	} = useDisclosure();

	const isMobile = useBreakpointValue({ base: true, sm: true, md: false });

	const { data, isLoading, refetch } = useFetchItemsQuery(
		{
			path: 'sipSetting',
			params: {
				page: currentPage,
				limit: pageSize,
				...filters,
			},
		},
		{ refetchOnMountOrArgChange: true }
	);

	const { data: usersData } = useFetchItemsQuery(
		{
			path: '/v2/user/search_users',
		},
		{ refetchOnMountOrArgChange: true }
	);

	const [deleteSipSetting] = useDeleteItemMutation();

	const columns = [
		'SR.No',
		'User',
		'SIP ID',
		'Extension ID',
		'SIP IP',
		'SIP Port',
		'SIM Number',
		'Actions',
	];

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	const handlePageSizeChange = (newSize) => {
		setPageSize(newSize);
		setCurrentPage(1);
	};

	const handleApplyFilters = (newFilters) => {
		setFilters(newFilters);
		setCurrentPage(1);
		setFilterChanged(true);
	};

	const handleClearFilters = (filterKey) => {
		if (filterKey) {
			const newFilters = { ...filters };
			delete newFilters[filterKey];
			setFilters(newFilters);
		} else {
			setFilters({});
		}
		setCurrentPage(1);
		setFilterChanged(true);
	};

	const handleDelete = async (id) => {
		try {
			await deleteSipSetting({
				path: `/sipSetting/${id}`,
				body: {},
			}).unwrap();
			toast.success('SIP Setting deleted successfully');
			createUserLog({
				userId: user?._id,
				action: 'DELETE',
				entity: 'Sip_Setting',
				entityType: 'SipSetting',
				entityId: id,
				status: 'success',
				message: `${user?.fullName} deleted the sip setting.`,
			});
			refetch();
		} catch (error) {
			const errorMsg =
				error?.data?.message ||
				'Failed to delete SIP Setting. Please try again.';
			createUserLog({
				userId: user?._id,
				action: 'DELETE',
				entity: 'Sip_Setting',
				entityType: 'SipSetting',
				entityId: id,
				status: error?.status === 500 ? 'error' : 'fail',
				message: errorMsg,
			});
			toast.error(error.data?.message || 'Failed to delete SIP Setting');
		}
	};

	const handleEdit = (sipSetting) => {
		setSelectedSip(sipSetting);
		onEditOpen();
	};

	return (
		<Box boxShadow='sm' bg='white' px={2} py={4}>
			<Flex
				justifyContent='space-between'
				alignItems={{ base: 'normal', sm: 'normal', md: 'center' }}
				p={3}
				flexDir={{ base: 'column', sm: 'column', md: 'row' }}
			>
				<Text fontSize='20px' fontWeight='bold' color='black' p={3}>
					SIP Settings Management
				</Text>
				<Box
					gap={2}
					display='flex'
					alignItems='center'
					flexDir={{ base: 'column', sm: 'column', md: 'row' }}
					justifyContent={{ base: 'center', sm: 'center', md: 'normal' }}
				>
					<Button
						colorScheme='brand'
						leftIcon={<AddIcon />}
						onClick={onAddOpen}
					>
						Add SIP Setting
					</Button>
					{isMobile ? (
						<IconButton
							icon={<FiSearch />}
							onClick={onFilterOpen}
							aria-label='Search SIP Settings'
							colorScheme='brand'
							variant='solid'
							size='sm'
							borderRadius='full'
							boxShadow='md'
						/>
					) : (
						<Button colorScheme='brand' onClick={onFilterOpen}>
							Advanced Search
						</Button>
					)}
				</Box>
			</Flex>

			<ActiveFiltersDisplay
				filters={filters}
				onClearFilters={handleClearFilters}
				usersData={usersData?.doc || []}
			/>

			<TopPagination
				currentPage={currentPage}
				totalPages={data?.totalPages || 0}
				onPageChange={handlePageChange}
				totalItems={data?.count || 0}
				itemsPerPage={pageSize}
				setPageSize={setPageSize}
				handlePageSize={handlePageSizeChange}
			/>

			<Box
				borderRadius='lg'
				boxShadow='sm'
				bg='white'
				maxH='85vh'
				overflowY='auto'
			>
				<Table variant='striped' size='lg' bg='white'>
					<Thead
						position='sticky'
						top={0}
						bg='white'
						zIndex={2}
						boxShadow='0px 2px 8px rgba(0, 0, 0, 0.1)'
					>
						<Tr>
							{columns.map((header, index) => (
								<Th
									key={index}
									bg='brand.200'
									whiteSpace='nowrap'
									py={4}
									textAlign='center'
								>
									<Text
										fontSize={{ base: '12px', md: '14px' }}
										fontWeight='600'
										color='gray.700'
									>
										{header}
									</Text>
								</Th>
							))}
						</Tr>
					</Thead>
					{isLoading ? (
						<TableLoading columns={columns} length={7} py='4' />
					) : (
						<Tbody>
							{data?.sipSettings?.length > 0 ? (
								data.sipSettings.map((sip, index) => (
									<Tr key={sip._id}>
										<Td textAlign='center'>
											{(currentPage - 1) * pageSize + index + 1}
										</Td>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
											minWidth='200px'
											textAlign={'center'}
										>
											{sip.userId?.fullName || 'N/A'}
										</Td>
										<Td
											textAlign='center'
											fontSize={{ base: '12px', md: '14px' }}
										>
											{sip.sipId}
										</Td>
										<Td
											textAlign='center'
											fontSize={{ base: '12px', md: '14px' }}
										>
											{sip.extensionId}
										</Td>
										<Td
											textAlign='center'
											fontSize={{ base: '12px', md: '14px' }}
										>
											{sip.sipIp}
										</Td>
										<Td
											textAlign='center'
											fontSize={{ base: '12px', md: '14px' }}
										>
											{sip.sipPort}
										</Td>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
											minWidth='200px'
											textAlign={'center'}
										>
											{sip.sipSimNumber || 'N/A'}
										</Td>
										<Td textAlign='center'>
											<Flex justifyContent='center' gap={2}>
												<IconButton
													aria-label='Edit'
													icon={<EditIcon />}
													size='sm'
													onClick={() => handleEdit(sip)}
													color={'#c09f5f'}
													_hover={{
														backgroundColor: '#c09f5f',
														color: 'white',
													}}
												/>
												<IconButton
													aria-label='Delete'
													icon={<DeleteIcon />}
													size='sm'
													color={'#c09f5f'}
													_hover={{
														backgroundColor: '#c09f5f',
														color: 'white',
													}}
													onClick={() => handleDelete(sip._id)}
												/>
											</Flex>
										</Td>
									</Tr>
								))
							) : (
								<Tr>
									<Td
										colSpan={columns.length}
										textAlign='center'
										color='gray.500'
									>
										<NoData label='SIP settings' />
									</Td>
								</Tr>
							)}
						</Tbody>
					)}
				</Table>
			</Box>

			<AddSipSettingModal
				isOpen={isAddOpen}
				onClose={onAddClose}
				onSuccess={refetch}
				existingSettings={data?.sipSettings || []}
				usersData={usersData}
			/>

			{selectedSip && (
				<EditSipSettingModal
					isOpen={isEditOpen}
					onClose={onEditClose}
					onSuccess={refetch}
					sipSetting={selectedSip}
					existingSettings={data?.sipSettings || []}
					usersData={usersData}
				/>
			)}

			<AdvancedSearchModal
				isOpen={isFilterOpen}
				onClose={onFilterClose}
				onApplyFilters={handleApplyFilters}
				initialFilters={filters}
				clearFilter={filterChanged}
				usersData={usersData}
			/>
		</Box>
	);
};

export default UserSetting;
