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
import { useMemo } from 'react';
import { toCapitalCase } from 'utils/helpers';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import useUserSession from 'hooks/useUserSession';
import { safeValue } from './../../../../utils/index';

const EditLead = ({ isOpen, onClose, leadData, size }) => {
	const countries = useSelector((state) => state.countries.countryNames);
	const { ip, city, country } = extractLocationData(leadData?.ip, countries);

	// const user = JSON.parse(localStorage.getItem('user'));
	const { user, userRoleName, isSuperAdmin } = useUserSession();

	// Set initial values for your form using the data object:
	const initialValues = {
		leadName: safeValue(leadData?.leadName) || '',
		leadWhatsappNumber: safeValue(leadData?.leadWhatsappNumber, 'result') || '',
		leadPhoneNumber: safeValue(leadData?.leadPhoneNumber, 'result') || '',
		nationality: safeValue(leadData?.nationality) || '',
		budget: safeValue(leadData?.budget) || '',
		ip: safeValue(ip) || '',
		city: safeValue(city) || '',
		country: safeValue(country) || '',
		leadLang: safeValue(leadData?.leadLang) || '',
		timetocall: safeValue(leadData?.timetocall) || '',
		leadSourceDetails: safeValue(leadData?.leadSourceDetails) || '',
		leadSourceChannel: safeValue(leadData?.leadSourceChannel) || '',
		leadCampaign: safeValue(leadData?.leadCampaign) || '',
		pageUrl: safeValue(leadData?.pageUrl) || '',
		leadAddress: safeValue(leadData?.leadAddress) || '',
		leadEmail: safeValue(leadData?.leadEmail) || '',
		leadSourceMedium: safeValue(leadData?.leadSourceMedium) || '',
		r_u_in_uae: safeValue(leadData?.r_u_in_uae) || '',
		attendanceDay: safeValue(leadData?.attendanceDay) || '',
		lastNote: safeValue(leadData?.lastNote) || '',
		adset: safeValue(leadData?.adset) || '',
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
		{
			name: 'country',
			label: 'Country',
			type: 'select',
			options: countries.map((name) => {
				const countryName = toCapitalCase(name);

				return {
					label: countryName,
					value: countryName,
				};
			}),
		},
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

	const allowedFields = useMemo(() => {
		if (isSuperAdmin) {
			return fields;
		}

		// Agent role edit phone number only
		const phoneField =
			userRoleName === 'Agent'
				? fields.filter((field) =>
						['leadPhoneNumber', 'leadWhatsappNumber'].includes(field.name)
					)
				: [];

		// Add name field if leadEStatus is 'show'
		const nameField =
			leadData?.eLeadStatus === 'show'
				? fields.filter((field) => field.name === 'leadName')
				: [];

		return [...nameField, ...phoneField];
	}, []);

	const [updateItemMuation, { isLoading }] = useUpdateItemMutation();

	const { createUserLog } = useUserActivityLog();

	const dispatch = useDispatch();

	const handleSubmit = async (values, actions) => {
		try {
			const formattedIp = [
				values?.ip || '',
				values?.city || '',
				values?.country || '',
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
				path: `/lead/edit-lead/${leadData?._id}`,
				body: updatedValues,
			}).unwrap();

			toast.success('Lead updated successfully.');

			onClose();
			actions.resetForm();
			dispatch(addOrUpdateLead(res));
			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Lead',
				enityType: 'Lead',
				entityId: leadData?._id || null,
				status: 'success',
				message: `${res?.leadName || ''} Lead is updated successfully`,
			});
		} catch (error) {
			console.error(error);
			const errorMsg =
				error.data.message ||
				`Lead ${leadData?.leadName || ''} failed to update.`;
			toast.error(errorMsg);

			createUserLog({
				userId: user?._id,
				action: 'UPDATE',
				entity: 'Lead',
				enityType: 'Lead',
				entityId: leadData?._id,
				status: error?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
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
