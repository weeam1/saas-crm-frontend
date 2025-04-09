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
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useCreateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { mainLeadStatus } from 'utils/options';
import { leadStatus } from 'utils/options';
import RenderFields from 'components/shared/RenderFields';
import { useDispatch } from 'react-redux';
import { addOrUpdateLead } from '../../../../redux/leadsSlice';

const AddLead = ({ isOpen, onClose, size }) => {
	// Initial values for Formik
	const initialValues = {
		leadName: '',
		leadWhatsappNumber: '',
		leadPhoneNumber: '',
		nationality: '',
		timetocall: '',
		budget: '',
		ip: '0.0.0.0',
		city: '',
		country: '',
		eLeadStatus: '',
		leadStatus: '',
		leadLang: '',
		lastNote: '',
		leadSourceDetails: '',
		leadSourceChannel: '',
		leadSourceMedium: '',
		leadCampaign: '',
		pageUrl: '',
		leadAddress: '',
		leadEmail: '',
		r_u_in_uae: '',
		attendanceDay: '',
		adset: '',
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
		{ name: 'ip', label: 'IP', type: 'text' },
		{ name: 'city', label: 'City', type: 'text' },
		{ name: 'country', label: 'Country', type: 'text' },
		{ name: 'leadLang', label: 'Language', type: 'text' },
		{ name: 'leadSourceDetails', label: 'Source Content', type: 'text' },
		{ name: 'leadSourceChannel', label: 'Lead Source Channel', type: 'text' },
		{ name: 'leadCampaign', label: 'Campaign', type: 'text' },
		{ name: 'pageUrl', label: 'Page URL', type: 'url' },
		{ name: 'leadSourceMedium', label: 'Source Medium', type: 'text' },
		{ name: 'r_u_in_uae', label: 'Are you In UAE ?', type: 'text' },
		{ name: 'leadAddress', label: 'Address', type: 'text' },
		{ name: 'attendanceDay', label: 'Attendance Day', type: 'text' },
		{ name: 'adset', label: 'Adset', type: 'text' },
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
		{ name: 'lastNote', label: 'Last Note', type: 'text' },
	];

	const [createItemMuation, { isLoading }] = useCreateItemMutation();

	const dispatch = useDispatch();

	const handleSubmit = async (values, actions) => {
		try {
			const formattedIp = [
				values.ip || '',
				values.city || '',
				values.country || '',
			]
				.join('-')
				.trim();

			const updatedValues = {
				...values,
				ip: formattedIp,
			};
			delete updatedValues.city;
			delete updatedValues.country;

			const res = await createItemMuation({
				path: '/lead/add-lead',
				body: updatedValues,
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
									height={{ base: '60vh', md: '75vh' }}
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
