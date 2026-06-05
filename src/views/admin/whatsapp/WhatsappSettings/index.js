
import {
	Box,
	Button,
	Flex,
	Icon,
	Text,
	useDisclosure,
	IconButton,
	HStack,
	Tooltip,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { useFetchItemsQuery } from 'api/apiSlice';
import UsersTable from './UsersTable';
import AddWhatsappUser from './AddWhatsappUser';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { useEffect, useMemo, useState, useCallback } from 'react';
import {
	useCreateItemMutation,
	useUpdateItemMutation,
	useDeleteItemMutation,
} from 'api/apiSlice';
import { toast } from 'react-toastify';
import AppButton from 'components/shared/AppButton';
import { FaChevronLeft, FaWhatsapp } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmationModal from 'components/Message/ConfirmationModal';
import TopPagination from 'components/pagination/TopPagination';
import { usePermissions } from 'hooks/usePermissions';
import RefreshButton from 'components/refresh/RefreshButton';

const WhatsappSettings = () => {
	const [actionMode, setActionMode] = useState('Add');
	const [userId, setUserId] = useState(null);
	const [users, setUsers] = useState([]);
	const { hasPermission } = usePermissions();
	const navigate = useNavigate();
	const location = useLocation();
	const pathname = location?.pathname;

	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
	});

	const queryParams = useMemo(
		() => ({
			page: pagination.page,
			limit: pagination.limit,
		}),
		[pagination],
	);

	const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
		{ path: 'whatsapp/users', params: queryParams },
		{ refetchOnMountOrArgChange: true },
	);

	const [createUser, { isLoading: creatingUser }] = useCreateItemMutation();
	const [updateUser, { isLoading: updatingUser }] = useUpdateItemMutation();
	const [deleteUser] = useDeleteItemMutation();

	const [initialValues, setInitialValues] = useState({
		userId: null,
		phoneNumber: '',
		businessId: '',
		isActive: true,
	});

	const {
		isOpen: addUserIsOpen,
		onClose: addUserOnClose,
		onOpen: addUserOnOpen,
	} = useDisclosure();

	// Permission check
	useEffect(() => {
		if (!hasPermission('whatsapp', 'whatsapp_settings'))
			return navigate('/default');
	}, [hasPermission, navigate]);

	// Update users when data changes
	useEffect(() => {
		if (data?.doc?.length > 0) {
			setUsers(data.doc);
		}
	}, [data?.doc]);

	const handleSaveUser = useCallback(
		async (data) => {
			try {
				const res = await createUser({
					path: '/whatsapp/users',
					body: data,
				}).unwrap();

				if (res?.statusCode === 201) {
					setUsers((prev) => [res?.doc, ...prev]);
				}

				toast.success('User saved successfully');
				addUserOnClose();
			} catch (err) {
				console.error(err);
				toast.error(err?.data?.message || 'User is not saved!');
			}
		},
		[createUser, addUserOnClose],
	);

	const handleUpdateUser = useCallback(
		async (data) => {
			try {
				if (userId) {
					const res = await updateUser({
						path: `/whatsapp/users/${userId}`,
						body: data,
					}).unwrap();

					if (res?.statusCode === 200) {
						const updatedUsers = users.map((item) => {
							if (item._id === userId) {
								return {
									...item,
									user: res?.doc?.user,
									phoneNumber: res?.doc?.phoneNumber,
									businessId: res?.doc?.businessId,
									isActive: res?.doc?.isActive,
								};
							}
							return item;
						});
						setUsers(updatedUsers);
					}

					toast.success('User updated successfully');
					addUserOnClose();
					setUserId(null);
				} else {
					toast.error('User id is not set!');
				}
			} catch (err) {
				console.error(err);
				toast.error(err?.data?.message || 'User is not updated!');
			}
		},
		[updateUser, userId, users, addUserOnClose],
	);

	const onEdit = useCallback(
		(data) => {
			setActionMode('Edit');
			setInitialValues({
				userId: data.user._id,
				phoneNumber: data.phoneNumber,
				businessId: data.businessId,
				isActive: data.isActive,
			});
			addUserOnOpen();
			setUserId(data._id);
		},
		[addUserOnOpen],
	);

	const onAdd = useCallback(() => {
		setActionMode('Add');
		setInitialValues({
			phoneNumber: '',
			businessId: '',
			isActive: true,
		});
		addUserOnOpen();
	}, [addUserOnOpen]);

	const onDelete = useCallback((id) => {
		setDeleteModalOpen(true);
		setUserId(id);
	}, []);

	const handleOnSubmit = useCallback(
		(values) => {
			if (actionMode === 'Edit') {
				handleUpdateUser(values);
			} else {
				handleSaveUser(values);
			}
		},
		[actionMode, handleUpdateUser, handleSaveUser],
	);

	const handleConfirmRemove = useCallback(async () => {
		try {
			const res = await deleteUser({
				path: `/whatsapp/users/${userId}`,
			}).unwrap();

			if (res?.statusCode === 200) {
				const updatedUsers = users.filter((item) => item._id !== userId);
				setUsers(updatedUsers);
			}

			toast.success('User deleted successfully');
			setUserId(null);
		} catch (err) {
			console.error(err);
			toast.error(err?.data?.message || 'Failed to delete User!');
		} finally {
			setDeleteModalOpen(false);
		}
	}, [deleteUser, userId, users]);

	const handlePageChange = useCallback((page) => {
		setPagination((prev) => ({ ...prev, page: Number(page) }));
	}, []);

	const handlePageSize = useCallback((limit) => {
		setPagination({ page: 1, limit: Number(limit) });
	}, []);

	const handleRefresh = useCallback(() => {
		refetch();
	}, [refetch]);

	return (
		<>
			{/* Back Button */}
			{pathname.includes('admin-setting') &&
				hasPermission('admin_settings') && (
					<AppButton
						leftIcon={<FaChevronLeft />}
						onClick={() => navigate('/admin-setting')}
						mb={4}
						variant='ghost'
						size='sm'
					>
						Back
					</AppButton>
				)}

			{/* Main Container */}
			<Box
				bg='bg.surface'
				border='1px solid'
				borderColor='border.default'
				borderRadius='xl'
				overflow='hidden'
				boxShadow='card'
			>
				{/* Header Section */}
				<Flex
					justify='space-between'
					align='center'
					gap={4}
					flexDir={{ base: 'column', sm: 'row' }}
					p={5}
					borderBottom='1px solid'
					borderBottomColor='border.default'
				>
					<HStack spacing={2}>
						<Text fontSize='lg' fontWeight='bold' color='text.heading'>
							Whatsapp Users
						</Text>

						<CountUpComponent
							key={users?.length}
							targetNumber={users?.length}
						/>
					</HStack>

					<HStack spacing={2}>
						<RefreshButton
	label="Refresh"
	onClick={handleRefresh}
	isLoading={isLoading}
	isFetching={isFetching}
	size="sm"
/>

						<Tooltip label='Add Whatsapp User' placement='top' hasArrow>
							<Button
								leftIcon={<FiPlus />}
								variant='brand'
								size='sm'
								borderRadius='lg'
								onClick={onAdd}
							>
								Add User
							</Button>
						</Tooltip>
					</HStack>
				</Flex>

				{/* Pagination */}
				{!isLoading && (
					<Box px={5} pt={4}>
						<TopPagination
							currentPage={queryParams.page}
							totalPages={data?.totalPages}
							onPageChange={handlePageChange}
							totalItems={data?.totalItems}
							itemsPerPage={queryParams.limit}
							refetching={isFetching}
							loading={isLoading}
							handlePageSize={handlePageSize}
						/>
					</Box>
				)}

				{/* Table */}
				<Box px={5} pb={5} py={2}>
					<UsersTable
						data={users}
						tab='whatsapp'
						isLoading={isLoading}
						isFetching={isFetching}
						handleEdit={onEdit}
						handleDelete={onDelete}
					/>
				</Box>
			</Box>

			{/* Add/Edit User Modal */}
			{addUserIsOpen && (
				<AddWhatsappUser
					isOpen={addUserIsOpen}
					onClose={() => addUserOnClose(false)}
					initialValues={initialValues}
					onSubmit={handleOnSubmit}
					mode={actionMode}
					isLoading={creatingUser || updatingUser}
				/>
			)}

			{/* Delete Confirmation Modal */}
			<ConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onConfirm={handleConfirmRemove}
				title='Delete User'
				message='Are you sure you want to delete this user?'
				confirmText='Yes, Delete'
				cancelText='Cancel'
			/>
		</>
	);
};

export default WhatsappSettings;
