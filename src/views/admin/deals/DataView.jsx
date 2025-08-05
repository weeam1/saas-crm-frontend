import { useState } from 'react';
import { toast } from 'react-toastify';
import { Box, useDisclosure } from '@chakra-ui/react';

import DealDetailsModal from './components/DealDetailsModal';
import EditDealModal from './components/EditDealModal';
import DealTable from './components/DealTable';
import DealCards from './DealCards';
import { useUpdateItemMutation } from 'api/apiSlice';
import ConfirmationModal from 'components/Message/ConfirmationModal';

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
	const [deal, setDeal] = useState(null);
	const [dealId, setDealId] = useState();

	const [updateDealStatus] = useUpdateItemMutation();

	const viewDealDeatailsHandler = (data) => {
		setDeal(data);
		viewDealOnOpen();
	};

	const updateDealsData = (deal) => {
		setDeals((prevDeals) =>
			prevDeals.map((item) =>
				item._id === deal._id ? { ...item, ...deal } : item
			)
		);
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
			}
		} catch (error) {
			console.log(error);
			toast.error(error?.data?.message || 'Error: Deal is not updated!');
		}
	};

	const openCancelledModal = (_dealId) => {
		setCancelledModalOpen(true);
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
			/>
		) : (
			<DealTable
				data={deals}
				isLoading={isLoading}
				isRefetching={isRefetching}
				handleEdit={editDealDeatailsHandler}
				handleView={viewDealDeatailsHandler}
				handleCancelled={openCancelledModal}
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
				<EditDealModal
					isOpen={editDealIsOpen}
					onClose={() => {
						editDealOnClose();
						setDeal(null);
					}}
					initialData={deal}
					onSuccess={updateDealsData}
				/>
			)}
		</Box>
	);
};

export default DataView;
