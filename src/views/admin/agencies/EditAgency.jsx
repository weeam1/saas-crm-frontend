import {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
	Grid,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useCreateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import AppButton from 'components/shared/AppButton';
import RenderFields from 'components/shared/RenderFields';
import { useUpdateItemMutation } from 'api/apiSlice';

const EditAgency = ({ isOpen, onClose, refreshData, size, data }) => {
	const initialValues = {
		name: data?.name || '',
		location: data?.location || '',
	};

	const validationSchema = Yup.object({
		name: Yup.string().required('Name is required'),
		location: Yup.string().required('Location is required'),
	});

	const fields = [
		{ name: 'name', label: 'Name', type: 'text', required: true },
		{ name: 'location', label: 'Location', type: 'textarea', required: true },
	];

	const [updateItemMuation, { isLoading }] = useUpdateItemMutation();

	const handleSubmit = async (values, actions) => {
		try {
			await updateItemMuation({
				path: `/agencies/${data._id}`,
				body: values,
			}).unwrap();

			toast.success('Agency updated successfully.');
		} catch (error) {
			console.error(error);
			toast.error(error.data.message || 'agency not updated!');
		} finally {
			actions.resetForm();
			refreshData();
			onClose();
		}
	};

	return (
		<Drawer isOpen={isOpen} placement='right' onClose={onClose} size={size}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>Create New Agency</DrawerHeader>
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
				>
					{() => (
						<Form>
							<DrawerBody>
								<Grid
									templateColumns={{
										base: '1fr',
									}}
									gap={2}
									w='full'
									overflow='scroll'
									// height='50vh'
									p='4'
								>
									<RenderFields fields={fields} />
								</Grid>
							</DrawerBody>
							<DrawerFooter>
								<AppButton mr='2' onClick={onClose}>
									Close
								</AppButton>
								<AppButton
									colorScheme='brand'
									isLoading={isLoading}
									loadingText='Submitting'
									type='submit'
								>
									Submit
								</AppButton>
							</DrawerFooter>
						</Form>
					)}
				</Formik>
			</DrawerContent>
		</Drawer>
	);
};

export default EditAgency;
