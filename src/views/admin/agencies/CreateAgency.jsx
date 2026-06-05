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
	Button,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useCreateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import AppButton from 'components/shared/AppButton';
import RenderFields from 'components/shared/RenderFields';
import Loader from 'components/loading/Loader';
import useCurrency from 'hooks/currrency/useCurrency';
import CurrencySelect from './components/CurrencySelect';

const CreateAgency = ({ isOpen, onClose, refreshData, size }) => {
	const initialValues = {
		name: '',
		email: '',
		website: '',
		location: '',
		locationLink: '',
		TRN: '',
		contactNumberPrimary: '',
		contactNumberAlternate: '',
		currency: '',
	};

	const { currencies, isLoading: currencyLoading } = useCurrency();

	const validationSchema = Yup.object({
		name: Yup.string().required('Name is required'),
		email: Yup.string().required('Email is required'),
		location: Yup.string().required('Location is required'),
	});

	const fields = [
		{ name: 'name', label: 'Name', type: 'text', required: true },
		{ name: 'email', label: 'Email', type: 'text', required: true },
		{ name: 'location', label: 'Location', type: 'textarea', required: true },
		{ name: 'locationLink', label: 'Location Link', type: 'text' },
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
		{ name: 'website', label: 'Website', type: 'text' },
		// {
		// 	name: 'currency',
		// 	label: 'Currency',
		// 	type: 'text',
		// },
	];

	const [createItemMuation, { isLoading }] = useCreateItemMutation();

	const handleSubmit = async (values, actions) => {
		try {
			await createItemMuation({
				path: '/agencies',
				body: values,
			}).unwrap();

			toast.success('Agency added successfully.');
		} catch (error) {
			console.error(error);
			toast.error(error.data.message || 'Lead not added');
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
							<DrawerBody h={'80vh'} overflowY={'scroll'}>
								{currencyLoading ? (
									<Loader />
								) : (
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
								)}
							</DrawerBody>
							<DrawerFooter>
								<Button variant='ghost' mr='2' onClick={onClose}>
									Close
								</Button>
								<Button
									variant='brand'
									isLoading={isLoading}
									loadingText='Loading'
									type='submit'
								>
									Submit
								</Button>
							</DrawerFooter>
						</Form>
					)}
				</Formik>
			</DrawerContent>
		</Drawer>
	);
};

export default CreateAgency;
