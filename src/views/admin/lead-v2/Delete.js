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
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import useUserSession from 'hooks/useUserSession';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteLead } from '../../../redux/leadsSlice';
import { deleteApi, deleteManyApi } from 'services/api';

const Delete = (props) => {
	const [isLoding, setIsLoding] = useState(false);
	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	const dispatch = useDispatch();

	const handleDeleteClick = async () => {
		if (props.method === 'one') {
			try {
				setIsLoding(true);
				const response = await deleteApi(props.url, props.id);
				if (response.status === 200) {
					createUserLog({
						userId: user?._id,
						action: 'DELETE',
						entity: 'Lead',
						enityType: 'Lead',
						entityId: props?.id || null,
						status: 'success',
						message: `Lead deleted successfully`,
					});
				}
			} catch (error) {
				console.log(error);
				const errorMsg =
					error?.data?.message || `Lead deleted operation failed.`;

				toast.error(errorMsg);

				createUserLog({
					userId: user?._id,
					action: 'DELETE',
					entity: 'Lead',
					enityType: 'Lead',
					entityId: props.id || null,
					status: error?.status === 500 ? 'error' : 'fail',
					message: errorMsg,
				});
			} finally {
				setIsLoding(false);
				// props.refetchData();
				dispatch(deleteLead([props.id]));
				props.onClose(false);
				// props.setAction((pre) => !pre);
				props.setSelectedValues([]);
			}
		} else if (props.method === 'many') {
			try {
				setIsLoding(true);
				let response = await deleteManyApi(props.url, props.data);
				if (response.status === 200) {
					props.onClose(false);
					// props.setAction((pre) => !pre);
					props.setSelectedValues([]);
					// props.setSelectAllChecked(false);

					createUserLog({
						userId: user?._id,
						action: 'BULK_DELETE',
						entity: 'Lead',
						enityType: 'Lead',
						status: 'success',
						message: 'Bulk lead deletion operation successfully`.',
					});
				}
			} catch (error) {
				console.log(error);
				toast.error(
					error?.data?.message || 'Bulk lead deletion operation failed.'
				);
				createUserLog({
					userId: user?._id,
					action: 'BULK_DELETE',
					entity: 'Lead',
					enityType: 'Lead',
					status: error?.status === 500 ? 'error' : 'fail',
					message:
						error?.data?.message || 'Bulk lead deletion operation failed.',
				});
			} finally {
				setIsLoding(false);
				// dispatch(deleteLead(props.data));
				props.refetchData();
			}
		}
	};

	const handleClose = () => {
		props.onClose(false);
	};

	return (
		<div>
			<Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						Delete Lead{props.method === 'one' ? '' : 's'}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						Are You Sure To Delete selected Lead
						{props.method === 'one' ? '' : 's'} ?
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme='red'
							size='sm'
							mr={2}
							onClick={handleDeleteClick}
							disabled={isLoding ? true : false}
						>
							{isLoding ? <Spinner /> : 'Yes'}
						</Button>
						<Button variant='outline' size='sm' onClick={handleClose}>
							No
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
};

export default Delete;
