import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/react';
import Spinner from 'components/spinner/Spinner';
import { useState } from 'react';
import { useDeleteItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Delete = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [deleteItem, { isLoading: deleteLoading }] = useDeleteItemMutation();
	const navigate = useNavigate();

	const handleDeleteClick = async () => {
		try {
			setIsLoading(true);

			if (props.method === 'one' && props.id) {
				// Step 1: Delete the entry first
				await deleteItem({
					path: `/invoices/entries/${props.id}`,
					method: 'DELETE',
				}).unwrap();

				// Step 2: Reduce doc length before checking
				const remainingEntriesCount = props.docLength - 1;

				// Step 3: If no entries remain, delete the invoice
				if (remainingEntriesCount === 0) {
					await deleteItem({
						path: `/invoices/${props.invoiceId}`,
						method: 'DELETE',
					}).unwrap();

					toast.success('Invoice deleted successfully!');
					navigate(`/invoices/${props?.developerId}`);
				} else {
					toast.success('Entry deleted successfully!');
				}
			} else {
				console.error('Invalid delete props:', props);
				throw new Error('No valid data provided for deletion');
			}

			// Step 4: Fetch updated data after deletion
			if (props.fetchData) {
				// Ensure fetchData is available before calling
				try {
					props.fetchData({
						pageIndex: props.pageIndex,
						pageSize: props.pageSize,
					});
				} catch (fetchError) {
					console.error('Error during data fetch after deletion:', fetchError);
				}
			}

			if (props.setAction) props.setAction((prev) => !prev);
			props.onClose();
		} catch (error) {
			console.error('Error during deletion:', error);
			const errorMessage =
				error?.data?.message ||
				error?.message ||
				'An unexpected error occurred during deletion';
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		props.onClose();
	};

	return (
		<Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Delete Invoice</ModalHeader>
				<ModalCloseButton />
				<ModalBody>Are you sure you want to delete this entry?</ModalBody>
				<ModalFooter>
					<Button
						colorScheme='red'
						size='sm'
						mr={2}
						borderRadius='6px'
						onClick={handleDeleteClick}
						disabled={isLoading || deleteLoading}
					>
						{isLoading || deleteLoading ? <Spinner /> : 'Yes'}
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={handleClose}
						borderRadius='6px'
					>
						No
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default Delete;
