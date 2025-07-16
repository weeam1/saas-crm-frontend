import { useState } from 'react';
import { toast } from 'react-toastify';
import { useDisclosure } from '@chakra-ui/react';

import DealDetailsModal from './components/DealDetailsModal';
import EditDealModal from './components/EditDealModal';
import DealTable from './components/DealTable';
import { useUpdateItemMutation } from 'api/apiSlice';

const DataView = ({ deals, isLoading, isFetching, refetch }) => {
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

	const [deal, setDeal] = useState(null);

	const [updateDealStatus] = useUpdateItemMutation();

	const viewDealDeatailsHandler = (data) => {
		setDeal(data);
		viewDealOnOpen();
	};

	const editDealDeatailsHandler = (data) => {
		setDeal(data);
		editDealOnOpen();
	};

	const handleCancelled = async (dealId) => {
		try {
			await updateDealStatus({
				path: `/deals/status/${dealId}`,
				body: { status: 'Cancelled' },
			}).unwrap();

			toast.success('Deal closed cancelled successfully');
			refetch();
		} catch (error) {
			console.log(error);
			toast.error(error?.data?.message || 'Error: Deal is not updated!');
		}
	};

	return (
		<>
			{/* {isLoading || isFetching ? (
				<CardShimmer
					count={12}
					height='300px'
					columns={{ base: 1, sm: 1, md: 2, lg: 3, xl: 4, '2xl': 4 }}
				/>
			) : deals?.length > 0 ? (
				<SimpleGrid
					sx={{
						display: 'grid',
						gridTemplateColumns: 'repeat(1, 1fr)',

						'@media screen and (min-width: 640px)': {
							gridTemplateColumns: 'repeat(1, 1fr)', // sm
						},
						'@media screen and (min-width: 768px)': {
							gridTemplateColumns: 'repeat(2, 1fr)', // md
						},
						'@media screen and (min-width: 1024px)': {
							gridTemplateColumns: 'repeat(3, 1fr)', // lg
						},
						'@media screen and (min-width: 1280px)': {
							gridTemplateColumns: 'repeat(3, 1fr)', // xl
						},
						'@media screen and (min-width: 1680px)': {
							gridTemplateColumns: 'repeat(3, 1fr)', // 2xl (custom)
						},
						// >= 1920px (e.g., Full HD+)
						'@media (min-width: 2120px)': {
							gridTemplateColumns: 'repeat(4, 1fr)',
						},
						// >= 2560px (2.5K / QHD)
						'@media (min-width: 2560px)': {
							gridTemplateColumns: 'repeat(5, 1fr)',
						},
						// >= 3840px (4K)
						'@media (min-width: 3840px)': {
							gridTemplateColumns: 'repeat(6, 1fr)',
						},
					}}
					spacing={4}
				>
					{deals.map((item, idx) => (
						<DealCard
							key={item._id + idx}
							deal={item}
							onViewDetails={viewDealDeatailsHandler}
							onEditDeal={editDealDeatailsHandler}
						/>
					))}
				</SimpleGrid>
			) : (
				<NoData label='users' />
			)} */}

			<DealTable
				data={deals}
				isLoading={isLoading}
				isFetching={isFetching}
				refetch={refetch}
				handleEdit={editDealDeatailsHandler}
				hanldeView={viewDealDeatailsHandler}
				handleCancelled={handleCancelled}
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
					onSuccess={refetch}
				/>
			)}
		</>
	);
};

export default DataView;
