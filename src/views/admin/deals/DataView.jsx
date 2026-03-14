import { useState } from 'react';
import { toast } from 'react-toastify';
import { Box, useDisclosure } from '@chakra-ui/react';

import DealDetailsModal from './components/DealDetailsModal';
import EditDealModal from './components/EditDealModal';
import DealTable from './components/DealTable';
import DealCards from './DealCards';
import { useUpdateItemMutation, useDeleteItemMutation } from 'api/apiSlice';
import ConfirmationModal from 'components/Message/ConfirmationModal';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import CloseDealModal from '../lead-v2/components/deals/CloseDealModal';

const DataView = ({
	view,
	deals,
	setDeals,
	isLoading,
	isRefetching,
	refetch,
}) => {
	const {
		isOpen: viewDealIsOpen,
		onClose: viewDealOnClose,
		onOpen: viewDealOnOpen,
	} = useDisclosure();

	const {
		isOpen: editDealIsOpen,
		onClose: editDealOnClose,
		onOpen: editDealOnOpen,
	} = useDisclosure();

	const [isCancelledModalOpen, setCancelledModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [deal, setDeal] = useState(null);
	const [dealId, setDealId] = useState();

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	const [updateDealStatus] = useUpdateItemMutation();
	const [deleteDeal] = useDeleteItemMutation();

	const viewDealDeatailsHandler = (data) => {
		setDeal(data);
		viewDealOnOpen();
	};

	const updateDealsData = (deal) => {
		setDeals((prevDeals) =>
			prevDeals.map((item) =>
				item._id === deal._id ? { ...item, ...deal } : item,
			),
		);
	};

	const removeDeal = (dealId) => {
		setDeals((prevDeals) => prevDeals.filter((item) => item._id !== dealId));
	};

	const editDealDeatailsHandler = (data) => {
		setDeal(data);
		editDealOnOpen();
	};

	const handleCancelled = async () => {
		try {
			setCancelledModalOpen(false);

			const res = await updateDealStatus({
				path: `/deals/status/${dealId}`,
				body: { status: 'Cancelled' },
			}).unwrap();

			toast.success('Closed Deal cancelled successfully');
			if (res?.doc) {
				updateDealsData(res.doc);

				createUserLog({
					userId: user?._id,
					action: 'UPDATE',
					entity: 'Deals',
					enityType: 'CloseDeal',
					entityId: dealId || null,
					status: 'success',
					message: `${res?.doc?.lead?.leadName || ''} Deal canncelled by ${user?.fullName}`,
				});
			}
		} catch (error) {
			console.log(error);
			const errorMsg = error?.data?.message || 'Error: Deal is not updated!';
			toast.error(errorMsg);

			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Deals',
				enityType: 'CloseDeal',
				entityId: dealId || null,
				status: error?.status === 500 ? 'error' : 'fail',
				message: errorMsg,
			});
		}
	};
	const handleDeleteDeal = async () => {
		try {
			setDeleteModalOpen(false);

			await deleteDeal({
				path: `/deals/${dealId}`,
			}).unwrap();

			toast.success('Closed Deal deleted successfully');
			removeDeal(dealId);

			createUserLog({
				userId: user?._id,
				action: 'DELETE',
				entity: 'Deals',
				enityType: 'CloseDeal',
				entityId: dealId || null,
				status: 'success',
				message: `Deal deleted by ${user?.fullName}`,
			});
		} catch (error) {
			console.log(error);
			const errorMsg = error?.data?.message || 'Error: Deal is not updated!';
			toast.error(errorMsg);

			createUserLog({
				userId: user?._id,
				action: 'DELETE',
				entity: 'Deals',
				enityType: 'CloseDeal',
				entityId: dealId || null,
				status: error?.status === 500 ? 'error' : 'fail',
				message: errorMsg,
			});
		}
	};

	const openCancelledModal = (_dealId) => {
		setCancelledModalOpen(true);
		setDealId(_dealId);
	};

	const openDeleteModal = (_dealId) => {
		setDeleteModalOpen(true);
		setDealId(_dealId);
	};

	const layoutView =
		view === 'grid' ? (
			<DealCards
				data={deals}
				isLoading={isLoading}
				isRefetching={isRefetching}
				handleEdit={editDealDeatailsHandler}
				handleView={viewDealDeatailsHandler}
				handleCancelled={openCancelledModal}
				handleDelete={openDeleteModal}
			/>
		) : (
			<DealTable
				data={deals}
				isLoading={isLoading}
				isRefetching={isRefetching}
				handleEdit={editDealDeatailsHandler}
				handleView={viewDealDeatailsHandler}
				handleCancelled={openCancelledModal}
				handleDelete={openDeleteModal}
			/>
		);

	return (
		<Box py='2'>
			<Box mt='2'>{layoutView}</Box>

			{/* <DealTable
				data={deals}
				isLoading={isLoading}
				isRefetching={isRefetching}
				refetch={refetch}
				handleEdit={editDealDeatailsHandler}
				hanldeView={viewDealDeatailsHandler}
				handleCancelled={openCancelledModal}
			/> */}

			{/* Deal Cancellation Warning Modal */}
			<ConfirmationModal
				isOpen={isCancelledModalOpen}
				onClose={() => setCancelledModalOpen(false)}
				onConfirm={handleCancelled}
				title='Warning! Cancel This Deal?'
				message="Cancelling will mark this deal as 'Cancelled'. You can manually change the status later if needed."
				confirmText='Cancel Deal'
				cancelText='Keep Active'
				confirmColor='warning'
			/>

			<ConfirmationModal
				isOpen={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onConfirm={handleDeleteDeal}
				title='Delete deal?'
				message='Are you sure you want to permanently delete this deal?'
				confirmText='Delete'
				cancelText='Cancel'
				confirmColor='warning'
			/>

			{viewDealIsOpen && (
				<DealDetailsModal
					isOpen={viewDealIsOpen}
					onClose={() => {
						viewDealOnClose();
						setDeal(null);
					}}
					deal={deal}
				/>
			)}

			{editDealIsOpen && (
				// <EditDealModal
				// 	isOpen={editDealIsOpen}
				// 	onClose={() => {
				// 		editDealOnClose();
				// 		setDeal(null);
				// 	}}
				// 	initialData={deal}
				// 	onSuccess={updateDealsData}
				// />
				<CloseDealModal
					isOpen={editDealIsOpen}
					onClose={() => {
						editDealOnClose();
						setDeal(null);
					}}
					mode='edit'
					initialData={deal}
					onSuccess={updateDealsData}
				/>
			)}
		</Box>
	);
};

export default DataView;
