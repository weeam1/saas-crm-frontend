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
	Badge,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';

import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
// import AddSipSettingModal from './components/AddSipSettingModal';
// import EditSipSettingModal from './components/EditSipSettingModal';
import { useFetchItemsQuery, useDeleteItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import TopPagination from 'components/pagination/TopPagination';
import NoData from 'views/admin/lead-v2/components/subComponents/NoData';
import TableLoading from 'components/loading/TableLoading';
import AdvancedSearchModal from './components/AdvancedSearchModal';
import ActiveFiltersDisplay from './components/ActiveFiltersDisplay';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import useUserSession from 'hooks/useUserSession';
import ManageCallSetting from './components/ManageCallSetting';
import ConfirmationModal from 'components/Message/ConfirmationModal';
import { resetSettings } from '../../../../../redux/webrtc/webrtcSlice';
import { MODES } from './components/useModeForms';

const UserSetting = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [filters, setFilters] = useState({});
	const [selectedSip, setSelectedSip] = useState(null);
	const [filterChanged, setFilterChanged] = useState(false);

	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

	const {
		isOpen: isAddOpen,
		onOpen: onAddOpen,
		onClose: onAddClose,
	} = useDisclosure();

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();
	const dispatch = useDispatch();

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

	const { data, isLoading, refetch, isFetching } = useFetchItemsQuery(
		{
			path: '/sipSetting',
			params: {
				page: currentPage,
				limit: pageSize,
				...filters,
			},
		},
		{ refetchOnMountOrArgChange: true },
	);

	const { data: usersData } = useFetchItemsQuery(
		{
			path: '/v2/user/search_users',
		},
		{
			refetchOnMountOrArgChange: false,
			refetchOnFocus: true,
		},
	);

	const [deleteSipSetting, { isLoading: isDeleting }] = useDeleteItemMutation();

	const columns = [
		'S.No',
		'User',
		'Agency',
		'Username',
		'SIM Number',
		'Feedback',
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

	const handleDelete = (item) => {
		setSelectedSip(item);
		setDeleteModalOpen(true);
	};

	const handleConfirmRemove = async () => {
		try {
			await deleteSipSetting({
				path: `/sipSetting/${selectedSip._id}`,
				body: {},
			}).unwrap();
			toast.success('Call Setting deleted successfully');
			createUserLog({
				userId: user?._id,
				action: 'DELETE',
				entity: 'Call_Logs',
				entityType: 'SipSetting',
				entityId: selectedSip._id,
				status: 'success',
				message: `${user?.fullName} deleted the call setting.`,
			});
			refetch();

			// if current user settings deleted update in redux store
			if (user?._id === selectedSip?.user?._id) {
				dispatch(resetSettings());
			}
		} catch (error) {
			const errorMsg =
				error?.data?.message ||
				'Failed to delete call Setting. Please try again.';
			createUserLog({
				userId: user?._id,
				action: 'DELETE',
				entity: 'Call_Logs',
				entityType: 'SipSetting',
				entityId: selectedSip._id,
				status: error?.status === 500 ? 'error' : 'fail',
				message: errorMsg,
			});
			toast.error(error.data?.message || 'Failed to delete call Setting');
		} finally {
			setDeleteModalOpen(false);
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
					Call Settings
				</Text>
				<Box
					gap={2}
					display='flex'
					alignItems='center'
					flexDir={{ base: 'column', sm: 'column', md: 'row' }}
					justifyContent={{ base: 'center', sm: 'center', md: 'normal' }}
				>
					<IconButton
						icon={<FiRefreshCw />}
						aria-label='Refresh Analytics'
						onClick={() => refetch()}
						isLoading={isLoading || isFetching}
						variant='outline'
						size='sm'
					/>
					<Button
						colorScheme='brand'
						leftIcon={<AddIcon />}
						onClick={onAddOpen}
						size='sm'
						borderRadius={'md'}
					>
						Add Setting
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
						<Button
							colorScheme='brand'
							onClick={onFilterOpen}
							size='sm'
							borderRadius={'md'}
						>
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
				totalItems={data?.totalDocs || 0}
				itemsPerPage={pageSize}
				setPageSize={setPageSize}
				handlePageSize={handlePageSizeChange}
			/>

			<Box
				borderRadius='lg'
				boxShadow='sm'
				bg='white'
				minH='60vh'
				maxH='70vh'
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
									textTransform='capitalize'
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
					{isLoading || isFetching ? (
						<TableLoading columns={columns} length={20} py='4' />
					) : (
						<Tbody>
							{data?.doc?.length > 0 ? (
								data.doc.map((sip, index) => (
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
											{sip.user?.fullName || 'N/A'}
										</Td>
										<Td
											textAlign='center'
											fontSize={{ base: '12px', md: '14px' }}
										>
											{sip.user?.agency?.name || 'N/A'}
										</Td>

										<Td
											py={4}
											fontSize={{ base: '14px', md: '16px' }}
											fontWeight='400'
											minWidth='220px'
											textAlign='center'
										>
											{sip?.modes ? (
												<Flex wrap='wrap' gap={2} justifyContent='center'>
													{MODES.map((mode) => {
														const modeData = sip.modes?.[mode];

														if (!modeData?.username) return null;

														return (
															<Badge
																key={mode}
																variant='subtle'
																colorScheme='brand'
																borderRadius='md'
																px={2}
																py={1}
															>
																<Box
																	as='span'
																	letterSpacing='0.5px'
																	textTransform='uppercase'
																	fontWeight='600'
																>
																	{mode}
																</Box>
																:
																<Box as='span' ml={1} textTransform='none'>
																	{modeData.username}
																</Box>
															</Badge>
														);
													})}
												</Flex>
											) : (
												'N/A'
											)}
										</Td>

										<Td
											py={4}
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
											minWidth='200px'
											textAlign={'center'}
										>
											{sip.simNumber || 'N/A'}
										</Td>

										<Td py={4} minWidth='100px' textAlign={'center'}>
											<Badge
												colorScheme={sip.isFeedback ? 'green' : 'red'}
												variant='subtle'
												px={2}
												py={1}
												borderRadius='full'
												fontSize={{ base: 'xs' }}
											>
												{sip?.isFeedback ? 'Enabled' : 'Disabled'}
											</Badge>
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
													onClick={() => handleDelete(sip)}
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
										<NoData label='call settings' />
									</Td>
								</Tr>
							)}
						</Tbody>
					)}
				</Table>
			</Box>

			{/* <AddSipSettingModal
				isOpen={isAddOpen}
				onClose={onAddClose}
				onSuccess={refetch}
				existingSettings={data?.sipSettings || []}
				usersData={usersData}
			/> */}
			{isAddOpen && (
				<ManageCallSetting
					isOpen={isAddOpen}
					onClose={onAddClose}
					onSuccess={refetch}
					usersData={usersData}
				/>
			)}
			{isEditOpen && (
				<ManageCallSetting
					isOpen={isEditOpen}
					onClose={onEditClose}
					onSuccess={refetch}
					usersData={usersData}
					initialData={selectedSip}
					modeType='edit'
				/>
			)}

			{/* Delete Confirmation Modal */}
			{isDeleteModalOpen && (
				<ConfirmationModal
					isOpen={isDeleteModalOpen}
					onClose={() => setDeleteModalOpen(false)}
					onConfirm={handleConfirmRemove}
					title='Delete'
					message={`Are you sure you want to delete this setting?`}
					confirmText='Yes, Delete'
					cancelText='Cancel'
					isLoading={isDeleting}
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
