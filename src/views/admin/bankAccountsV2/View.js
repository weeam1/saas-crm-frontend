import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid, Skeleton, Text } from '@chakra-ui/react';
import AccountCard from './components/AccountCard';
import { useUpdateItemMutation, useDeleteItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import useUserSession from 'hooks/useUserSession';
import NoData from 'components/Message/NoData';

const AccountsView = ({
	accounts = [],
	setAccounts,
	refetch,
	isGetting,
	onUpdate,
	onDelete,
	skeletonCount,
	isFetching,
}) => {
	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();
	const [updateItemMutation, { isLoading: isUpdating }] =
		useUpdateItemMutation();
	const [deleteItemMutation, { isLoading: isDeleting }] =
		useDeleteItemMutation();
	const [isDataReady, setIsDataReady] = useState(false);

	useEffect(() => {
		if (!isGetting) {
			const timer = setTimeout(() => {
				setIsDataReady(true);
			}, 100);
			return () => clearTimeout(timer);
		} else {
			setIsDataReady(false);
		}
	}, [isGetting, accounts]);

	const handleUpdate = async (updatedAccount, accountId) => {
		try {
			const response = await updateItemMutation({
				path: `/bankAccount/edit/${accountId}`,
				body: updatedAccount,
			}).unwrap();
			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Bank_Account',
				entityType: 'BankAccount',
				entityId: accountId,
				status: 'success',
				message: `"${user?.fullName}" update bank account "${response?.data?.account_holder_name || 'Untitled'}".`,
			});
			toast.success('The account has been updated successfully.', {
				autoClose: 3000,
			});
			onUpdate(updatedAccount);
			if (refetch) refetch();
		} catch (error) {
			console.error('Failed to update account:', error);
			toast.error(
				error.data?.message ||
					'Failed to update the account. Please try again.',
				{ autoClose: 3000 },
			);
			const errorMsg =
				error?.data?.message ||
				'Failed to update the bank account. Please try again.';
			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Bank_Account',
				entityType: 'BankAccount',
				entityId: accountId || null,
				status: error?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
		} finally {
		}
	};

	const handleDelete = async (accountId) => {
		console.log(accountId, 'accountId');
		try {
			await deleteItemMutation({
				path: `/bankAccount/delete/${accountId}`,
				body: {},
			}).unwrap();
			createUserLog({
				userId: user?._id,
				action: 'DELETE',
				entity: 'Bank_Account',
				entityType: 'BankAccount',
				entityId: accountId,
				status: 'success',
				message: `"${user?.fullName}" deleted bank account.`,
			});
			toast.success('The account has been deleted successfully.', {
				autoClose: 3000,
			});
			onDelete(accountId);
			if (refetch) refetch();
		} catch (error) {
			console.error('Failed to delete account:', error);
			toast.error(
				error.data?.message ||
					'Failed to delete the account. Please try again.',
				{ autoClose: 3000 },
			);
			const errorMsg =
				error?.data?.message ||
				'Failed to delete the account. Please try again.';

			createUserLog({
				userId: user?._id,
				action: 'DELETE',
				entity: 'Bank_Account',
				entityType: 'BankAccount',
				entityId: accountId,
				status: error?.status === 500 ? 'error' : 'fail',
				message: errorMsg,
			});
		}
	};

	const renderSkeletons = () => {
		const count =
			accounts.length > 0
				? Math.min(accounts.length, skeletonCount)
				: skeletonCount;
		return Array.from({ length: count }).map((_, index) => (
			<Skeleton
				key={`skeleton-${index}`}
				height='350px'
				borderRadius='md'
				startColor='gray.100'
				endColor='gray.200'
			/>
		));
	};

	return (
		<Box p={4}>
			{isGetting || !isDataReady || isFetching ? (
				<SimpleGrid
					columns={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
					spacing={{ base: 2 }}
					mt={8}
				>
					{renderSkeletons()}
				</SimpleGrid>
			) : accounts.length === 0 ? (
				<NoData label='bank accounts' />
			) : (
				<SimpleGrid
					columns={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
					spacing={{ base: 2 }}
					mt={2}
				>
					{accounts.map((account) => (
						<AccountCard
							key={account._id}
							account={account}
							onUpdate={handleUpdate}
							onDelete={handleDelete}
							isUpdating={isUpdating}
							isDeleting={isDeleting}
						/>
					))}
				</SimpleGrid>
			)}
		</Box>
	);
};

export default AccountsView;
