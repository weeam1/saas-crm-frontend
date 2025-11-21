import {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
	Grid,
	Select,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import AppButton from 'components/shared/AppButton';
import RenderFields from 'components/shared/RenderFields';
import { useUpdateItemMutation } from 'api/apiSlice';
import useCurrency from 'hooks/currrency/useCurrency';
import CurrencySelect from './components/CurrencySelect';

const EditAgency = ({ isOpen, onClose, refreshData, size, data }) => {
	const initialValues = {
		name: data?.name || '',
		email: data?.email || '',
		location: data?.location || '',
		TRN: data?.TRN || '',
		contactNumberPrimary: data?.contactNumberPrimary || '',
		contactNumberAlternate: data?.contactNumberAlternate || '',
		currency: data?.currency || '',
	};

	const validationSchema = Yup.object({
		name: Yup.string().required('Name is required'),
		email: Yup.string().required('Email is required'),
		location: Yup.string().required('Location is required'),
	});

	const { currencies, isLoading: currencyLoading } = useCurrency();

	const fields = [
		{ name: 'name', label: 'Name', type: 'text', required: true },
		{ name: 'email', label: 'Email', type: 'text', required: true },
		{ name: 'location', label: 'Location', type: 'textarea', required: true },
		{ name: 'TRN', label: 'TRN', type: 'text' },
		{
			name: 'contactNumberPrimary',
			label: 'Contact',
			type: 'text',
		},
		{
			name: 'contactNumberAlternate',
			label: 'Alternate Contact',
			type: 'text',
		},
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
				<DrawerHeader>Edit Agency</DrawerHeader>
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
					values
				>
					{() => (
						<Form>
							<DrawerBody h={'80vh'} overflowY={'scroll'}>
								<Grid
									templateColumns={{
										base: '1fr',
									}}
									gap={2}
									w='full'
									overflow='scroll'
									overflowY={'scroll'}
									// height='50vh'
									p='4'
								>
									<RenderFields fields={fields} />
									<CurrencySelect currencies={currencies} />
								</Grid>
							</DrawerBody>
							<DrawerFooter>
								<AppButton mr='2' onClick={onClose}>
									Close
								</AppButton>
								<AppButton
									colorScheme='brand'
									isLoading={isLoading}
									loadingText='Updating'
									type='submit'
								>
									Update
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
