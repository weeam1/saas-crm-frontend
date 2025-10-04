import { Box, Button, Flex, Icon, Text, useDisclosure } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { useFetchItemsQuery } from 'api/apiSlice';
import UsersTable from './UsersTable';
import AddWhatsappUser from './AddWhatsappUser';
import { buttonStyle } from 'utils/btn';
import CountUpComponent from 'components/countUpComponent/countUpComponent';
import { useEffect, useMemo, useState } from 'react';
import { useCreateItemMutation } from 'api/apiSlice';
import { useUpdateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import AppButton from 'components/shared/AppButton';
import { FaChevronLeft } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDeleteItemMutation } from 'api/apiSlice';
import ConfirmationModal from 'components/Message/ConfirmationModal';
import TopPagination from 'components/pagination/TopPagination';
import { usePermissions } from 'hooks/usePermissions';

const WhatsappSettings = () => {
	const [actionMode, setActionMode] = useState('Add');
	const [userId, setUserId] = useState(null);
	const [users, setUsers] = useState([]);
	const { hasPermission } = usePermissions();

	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
	});

	const queryParams = useMemo(() => {
		return {
			page: pagination.page,
			limit: pagination.limit,
		};
	}, [pagination]);

	const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
		{
			path: 'whatsapp/users',
			params: queryParams,
		},
		{
			refetchOnMountOrArgChange: true,
		}
	);

	useEffect(() => {
		if (data?.doc && data?.doc?.length > 0) {
			setUsers(data?.doc);
		}
	}, [data?.doc]);

	const [createUser, { isLoading: creatingUser }] = useCreateItemMutation();
	const [updateUser, { isLoading: updatingUser }] = useUpdateItemMutation();
	const [deleteUser] = useDeleteItemMutation();

	const [initialValues, setInitalValues] = useState({
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

	const handleSaveUser = async (data) => {
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
	};

	const handleUpdateUser = async (data) => {
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
			} else toast.error('User id is not set!');
		} catch (err) {
			console.error(err);
			toast.error(err?.data?.message || 'User is not updated!');
		}
	};

	const onEdit = (data) => {
		setActionMode('Edit');
		setInitalValues({
			userId: data.user._id,
			phoneNumber: data.phoneNumber,
			businessId: data.businessId,
			isActive: data.isActive,
		});
		addUserOnOpen();
		setUserId(data._id);
	};

	const onAdd = () => {
		setActionMode('Add');
		setInitalValues({
			phoneNumber: '',
			businessId: '',
			isActive: true,
		});
		addUserOnOpen();
	};

	const onDelete = (id) => {
		setDeleteModalOpen(true);
		setUserId(id);
	};

	const handleOnSubmit = (values) => {
		if (actionMode === 'Edit') {
			handleUpdateUser(values);
		} else handleSaveUser(values);
	};

	const handleConfirmRemove = async () => {
		try {
			const res = await deleteUser({
				path: `/whatsapp/users/${userId}`,
			}).unwrap();

			if (res?.statusCode === 200) {
				const updatedUsers = users.filter((item) => item._id !== userId);

				setUsers(updatedUsers);
			}

			toast.success('User deleted successfully');
			addUserOnClose();
			setUserId(null);
		} catch (err) {
			console.error(err);
			toast.error(err?.data?.message || 'Failed to delete User!');
		} finally {
			setDeleteModalOpen(false);
		}
	};
	const handlePageChange = (page) => {
		setPagination((prev) => ({ ...prev, page: Number(page) }));
	};

	const handlePageSize = (limit) => {
		setPagination({ page: 1, limit: Number(limit) });
	};

	const navigate = useNavigate();

	const location = useLocation();
	const pathname = location?.pathname;

	return (
		<>
			{pathname.includes('admin-setting') &&
				hasPermission('admin_settings') && (
					<AppButton
						leftIcon={<FaChevronLeft />}
						onClick={() => navigate('/admin-setting')}
						mb='4'
					>
						Back
					</AppButton>
				)}
			<Box p={6} bg='white' borderRadius='md' boxShadow='sm'>
				<Flex
					justify='space-between'
					align='center'
					mb={4}
					gap={2}
					flexDir={{ base: 'column', sm: 'column', md: 'row' }}
				>
					<Text fontSize='lg' fontWeight='bold'>
						Whatsapp Users (
						<CountUpComponent
							key={users?.length}
							targetNumber={users?.length}
						/>
						)
					</Text>
					<Button
						{...buttonStyle}
						leftIcon={<Icon as={FiPlus} />}
						colorScheme='brand'
						variant='solid'
						size='sm'
						onClick={onAdd}
					>
						Add User
					</Button>
				</Flex>

				{!isLoading && (
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
				)}

				<UsersTable
					data={users}
					tab='whatsapp'
					isLoading={isLoading}
					isFetching={isFetching}
					handleEdit={onEdit}
					handleDelete={onDelete}
				/>

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
					message='Are you sure you want to delete this User?'
					confirmText='Yes, Delete'
					cancelText='Cancel'
				/>
			</Box>
		</>
	);
};

export default WhatsappSettings;
