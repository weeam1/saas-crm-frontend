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
import { toast } from 'react-toastify';
import { useUpdateItemMutation } from 'api/apiSlice';
import RenderFields from 'components/shared/RenderFields';
import { addOrUpdateLead } from '../../../../redux/leadsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { extractLocationData } from 'utils/helpers';

const EditLead = ({ isOpen, onClose, leadData, size }) => {
	const countries = useSelector((state) => state.countries.countryNames);
	const { ip, city, country } = extractLocationData(leadData?.ip, countries);

	const user = JSON.parse(localStorage.getItem('user'));

	const role =
		user?.role === 'superAdmin'
			? 'superAdmin'
			: (user?.roles?.[0]?.roleName ?? 'unknown');

	// Set initial values for your form using the data object:
	const initialValues = {
		leadName: leadData.leadName || '',
		leadWhatsappNumber: leadData.leadWhatsappNumber || '',
		leadPhoneNumber: leadData.leadPhoneNumber || '',
		nationality: leadData.nationality || '',
		budget: leadData.budget || '',
		ip: ip || '',
		city: city || '',
		country: country || '',
		leadLang: leadData.leadLang || '',
		timetocall: leadData.timetocall || '',
		leadSourceDetails: leadData.leadSourceDetails || '',
		leadSourceChannel: leadData.leadSourceChannel || '',
		leadCampaign: leadData.leadCampaign || '',
		pageUrl: leadData.pageUrl || '',
		leadAddress: leadData.leadAddress || '',
		leadEmail: leadData.leadEmail || '',
		leadSourceMedium: leadData.leadSourceMedium || '',
		r_u_in_uae: leadData.r_u_in_uae || '',
		attendanceDay: leadData.attendanceDay || '',
		lastNote: leadData.lastNote || '',
		adset: leadData.adset || '',
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
		{ name: 'leadAddress', label: 'Address', type: 'text' },
		{ name: 'r_u_in_uae', label: 'Are you In UAE ?', type: 'text' },
		{ name: 'attendanceDay', label: 'Attendance Day', type: 'text' },
		{ name: 'lastNote', label: 'Last Note', type: 'text' },
		{ name: 'adset', label: 'Adset', type: 'text' },
	];

	// role === 'Agent' || role === 'Manager'
	// leadData?.oldPhoneNumber

	const allowedFields = ['Agent', 'Manager'].includes(role)
		? fields.filter((field) => field.name === 'leadName')
		: fields;

	// const allowedFields = (() => {
	// 	if (!['Agent', 'Manager'].includes(role)) {
	// 		return fields; // Return all fields for non-Agent/Manager roles
	// 	}

	// 	const baseFields = fields.filter((field) => field.name === 'leadName');

	// 	// Add phone fields if oldPhoneNumber is null
	// 	const phoneFields = !leadData?.oldPhoneNumber
	// 		? fields.filter(
	// 				(field) =>
	// 					field.name === 'leadWhatsappNumber' ||
	// 					field.name === 'leadPhoneNumber'
	// 			)
	// 		: [];

	// 	// Add name field if leadEStatus is 'show'
	// 	// const nameField =
	// 	// 	leadData?.eLeadStatus === 'show'
	// 	// 		? fields.filter((field) => field.name === 'leadName')
	// 	// 		: [];

	// 	return [...baseFields, ...phoneFields];
	// })();

	const [updateItemMuation, { isLoading }] = useUpdateItemMutation();

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

			const res = await updateItemMuation({
				path: `/lead/edit-lead/${leadData._id}`,
				body: updatedValues,
			}).unwrap();

			toast.success('Lead updated successfully.');
			onClose();
			actions.resetForm();
			dispatch(addOrUpdateLead(res));
		} catch (error) {
			console.error(error);
			toast.error(error.data.message || 'Lead not added');
		}
	};
	return (
		<Drawer
			isOpen={isOpen}
			placement='right'
			onClose={onClose}
			size={allowedFields.length > 3 ? size : 'sm'}
		>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>Edit Lead</DrawerHeader>
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
										md: allowedFields.length > 3 ? 'repeat(3, 1fr)' : '1fr',
									}}
									gap={2}
									w='full'
									overflow='scroll'
									height={{
										base: allowedFields?.length > 3 ? '60vh' : 'fit-content',
										md: allowedFields?.length > 3 ? '80vh' : 'fit-content',
									}}
									p='4'
								>
									<RenderFields fields={allowedFields} />
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
									disabled={isLoading}
								>
									{isLoading ? 'Update...' : 'Update Lead'}
								</Button>
							</DrawerFooter>
						</Form>
					)}
				</Formik>
			</DrawerContent>
		</Drawer>
	);
};

export default EditLead;
