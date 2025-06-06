import { Box } from '@chakra-ui/react';
import { useFetchItemsQuery, useUpdateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import ProjectFormModal from './ProjectFormModal';

const EditProject = ({ isOpen, onClose, refetch, data }) => {
	const { data: devData, isLoading: developersLoading } = useFetchItemsQuery({
		path: '/developer/get',
	});

	const [updateItemMutation, { isLoading: isUpdate }] = useUpdateItemMutation();

	const developers = devData?.doc || [];

	const handleSubmit = async (values) => {
		try {
			await updateItemMutation({
				path: `/developer/projects/${data?._id}`,
				body: values,
			}).unwrap();

			toast.success('Project updated successfully');

			onClose();
			refetch();
		} catch (err) {
			toast.error(err?.data?.message || 'Project Update fail!');
		}
	};

	return (
		<Box p={4}>
			<ProjectFormModal
				initialData={data}
				isOpen={isOpen}
				onClose={onClose}
				onSubmit={handleSubmit}
				developers={developers}
				isSubmitting={isUpdate}
				isLoading={developersLoading}
				title='Update Project'
			/>
		</Box>
	);
};

export default EditProject;
