import {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
	Button,
	Grid,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useCreateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { mainLeadStatus } from 'utils/options';
import { leadStatus } from 'utils/options';
import RenderFields from 'components/shared/RenderFields';
import { useDispatch } from 'react-redux';
import { addOrUpdateLead } from '../../../../redux/leadsSlice';

const AddLead = ({ isOpen, onClose, refreshData, size }) => {
	// Initial values for Formik
	const initialValues = {
		leadName: '',
		leadWhatsappNumber: '',
		leadPhoneNumber: '',
		nationality: '',
		timetocall: '',
		budget: '',
		ip: '',
		eLeadStatus: '',
		leadStatus: '',
		leadLang: '',
		// lastNote: '',
		leadCountry: '',
		leadSourceDetails: '',
		leadSourceMedium: '',
		leadCampaign: '',
		pageUrl: '',
		leadAddress: '',
		leadEmail: '',
		r_u_in_uae: '',
	};

	// Only "name" is required; others are optional.
	const validationSchema = Yup.object({
		leadName: Yup.string().required('Name is required'),
	});

	// Array of field definitions to avoid repeated code.
	const fields = [
		{ name: 'leadName', label: 'Name', type: 'text', required: true },
		{ name: 'leadEmail', label: 'Email', type: 'email' },
		{ name: 'leadWhatsappNumber', label: 'WhatsApp', type: 'text' },
		{ name: 'leadPhoneNumber', label: 'Phone Number', type: 'text' },
		{ name: 'nationality', label: 'Nationality', type: 'text' },
		{ name: 'timetocall', label: 'Time to Call', type: 'text' },
		{ name: 'budget', label: 'Budget', type: 'text' },
		{ name: 'ip', label: 'Country', type: 'text' },
		{ name: 'leadLang', label: 'Language', type: 'text' },
		{ name: 'leadSourceDetails', label: 'Source Details', type: 'text' },
		{ name: 'leadCampaign', label: 'Campaign', type: 'text' },
		{ name: 'pageUrl', label: 'Page URL', type: 'url' },
		{ name: 'leadSourceMedium', label: 'Source Medium', type: 'text' },
		{ name: 'leadAddress', label: 'Address', type: 'text' },
		{ name: 'r_u_in_uae', label: 'Are you In UAE ?', type: 'text' },
		// Adding the new 'status' field with select type
		{
			name: 'eLeadStatus',
			label: 'Select Main Status',
			type: 'select',
			options: mainLeadStatus,
		},
		{
			name: 'leadStatus',
			label: 'Select Lead Status',
			type: 'select',
			options: leadStatus,
		},
	];

	const [createItemMuation, { isLoading }] = useCreateItemMutation();

	const dispatch = useDispatch();

	// The submit handler is similar to your provided AddData function.
	const handleSubmit = async (values, actions) => {
		try {
			// Call the API – adjust the endpoint/path as needed.
			const res = await createItemMuation({
				path: '/lead/add-lead',
				body: values,
			}).unwrap();

			toast.success('Lead added successfully.');
			onClose();
			actions.resetForm();
			dispatch(addOrUpdateLead(res));
			// refreshData();
		} catch (error) {
			console.error(error);
			toast.error(error.data.message || 'Lead not added');
		}
	};

	// Helper to render each field using Chakra UI and Formik's Field.
	// const renderField = (field) => (
	// 	<Field name={field.name} key={field.name}>
	// 		{({ field: formikField, meta }) => (
	// 			<FormControl mb={4} isInvalid={meta.touched && meta.error}>
	// 				{/* For checkboxes and select, render differently */}
	// 				{field.type !== 'checkbox' && (
	// 					<FormLabel htmlFor={field.name}>{field.label}</FormLabel>
	// 				)}

	// 				{field.type === 'textarea' ? (
	// 					<Textarea
	// 						id={field.name}
	// 						{...formikField}
	// 						bg='gray.100'
	// 						borderColor='gray.300'
	// 						_focus={{
	// 							borderColor: '#D99A36',
	// 							boxShadow: '0 0 0 1px #D99A36',
	// 						}}
	// 						placeholder={field.label}
	// 					/>
	// 				) : field.type === 'checkbox' ? (
	// 					<Checkbox
	// 						bg='gray.100'
	// 						borderColor='gray.300'
	// 						_focus={{
	// 							borderColor: '#D99A36',
	// 							boxShadow: '0 0 0 1px #D99A36',
	// 						}}
	// 						id={field.name}
	// 						{...formikField}
	// 						isChecked={formikField.value}
	// 					>
	// 						{field.label}
	// 					</Checkbox>
	// 				) : field.type === 'select' ? (
	// 					<Select
	// 						id={field.name}
	// 						{...formikField}
	// 						bg='gray.100'
	// 						borderColor='gray.300'
	// 						_focus={{
	// 							borderColor: '#D99A36',
	// 							boxShadow: '0 0 0 1px #D99A36',
	// 						}}
	// 						placeholder={field.label}
	// 					>
	// 						{field.options.map((option) => (
	// 							<option key={option.value} value={option.value}>
	// 								{option.label}
	// 							</option>
	// 						))}
	// 					</Select>
	// 				) : (
	// 					<Input
	// 						id={field.name}
	// 						type={field.type}
	// 						{...formikField}
	// 						bg='gray.100'
	// 						borderColor='gray.300'
	// 						_focus={{
	// 							borderColor: '#D99A36',
	// 							boxShadow: '0 0 0 1px #D99A36',
	// 						}}
	// 						placeholder={field.label}
	// 					/>
	// 				)}

	// 				{meta.touched && meta.error && (
	// 					<div style={{ color: 'red', fontSize: '0.8em' }}>{meta.error}</div>
	// 				)}
	// 			</FormControl>
	// 		)}
	// 	</Field>
	// );

	return (
		<Drawer isOpen={isOpen} placement='right' onClose={onClose} size={size}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>Add New Lead</DrawerHeader>
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
										md: 'repeat(3, 1fr)',
									}}
									gap={2}
									w='full'
									overflow='scroll'
									height='70vh'
									p='4'
								>
									<RenderFields fields={fields} />
								</Grid>
							</DrawerBody>
							<DrawerFooter>
								<Button
									sx={{ marginLeft: 2, textTransform: 'capitalize' }}
									variant='outline'
									colorScheme='gray'
									size='sm'
									mr='2'
									onClick={onClose}
								>
									Close
								</Button>
								<Button
									size='sm'
									colorScheme='brand'
									type='submit'
									// disabled={isLoading}
								>
									{isLoading ? 'Adding...' : 'Add Lead'}
								</Button>
							</DrawerFooter>
						</Form>
					)}
				</Formik>
			</DrawerContent>
		</Drawer>
	);
};

export default AddLead;
