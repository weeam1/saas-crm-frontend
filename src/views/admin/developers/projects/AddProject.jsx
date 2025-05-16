import {
	Box,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
} from '@chakra-ui/react';
import ProjectForm from './ProjectFormModal';
import { useFetchItemsQuery, useCreateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import Loader from 'components/loading/Loader';
import { buttonStyle } from 'utils/btn';
import ProjectFormModal from './ProjectFormModal';

const AddProject = ({ isOpen, onClose, refetch }) => {
	const { data: devData, isLoading: developersLoading } = useFetchItemsQuery({
		path: '/developer/get',
	});

	const [createItemMutation, { isLoading: isCreating }] =
		useCreateItemMutation();

	const developers = devData?.doc || [];

	const handleSubmit = async (values) => {
		try {
			await createItemMutation({
				path: `/developer/projects`,
				body: values,
			}).unwrap();

			toast.success('Project created successfully');

			onClose();
			refetch();
		} catch (err) {
			toast.error(err?.data?.message || 'Project creating fail!');
		}
	};

	return (
		<Box p={4}>
			<ProjectFormModal
				isOpen={isOpen}
				onClose={onClose}
				onSubmit={handleSubmit}
				developers={developers}
				isSubmitting={isCreating}
				isLoading={developersLoading}
				title='Create Project'
			/>
		</Box>
	);
};

export default AddProject;
