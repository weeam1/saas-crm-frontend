import React, { useState } from 'react';
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
import PhoneField from 'components/fields/PhoneField';
import { toCapitalCase } from 'utils/helpers';
import { useSelector } from 'react-redux';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';

const AddLead = ({ isOpen, onClose, refreshData, size }) => {
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
		leadSourceDetails: '',
		leadSourceMedium: '',
		leadCampaign: '',
		pageUrl: '',
		leadAddress: '',
		leadEmail: '',
		attendanceDay: '',
		r_u_in_uae: '',
		leadSourceChannel: '',
		adset: '',
	};

	const { user } = useUserSession();
	const { createUserLog } = useUserActivityLog();

	const countries = useSelector((state) => state.countries.countryNames);

	// Only "name" is required; others are optional.
	const validationSchema = Yup.object({
		leadName: Yup.string().required('Name is required'),
	});

	// Array of field definitions to avoid repeated code.
	const fields = [
		{ name: 'leadName', label: 'Name', type: 'text', required: true },
		{ name: 'leadEmail', label: 'Email', type: 'email' },
		// { name: 'leadWhatsappNumber', label: 'WhatsApp', type: 'text' },
		// { name: 'leadPhoneNumber', label: 'Phone Number', type: 'text' },
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
		{ name: 'attendanceDay', label: 'Attendance Day', type: 'text' },
		{ name: 'r_u_in_uae', label: 'Are you In UAE ?', type: 'text' },
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
	];

	const [createItemMuation, { isLoading }] = useCreateItemMutation();

	// The submit handler is similar to your provided AddData function.
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
			refreshData();

			createUserLog({
				userId: user?._id,
				action: 'CREATE',
				entity: 'Lead',
				entityId: res?._id || null,
				status: 'success',
				message: `${res?.leadName || ''} Lead is created successfully`,
			});
		} catch (error) {
			console.error(error);
			const errorMsg =
				error.data?.message || 'An error occurred while creating the lead.';
			toast.error(errorMsg);
			createUserLog({
				userId: user?._id,
				action: 'CREATE',
				entity: 'Lead',
				status: error?.status === '500' ? 'error' : 'fail',
				message: errorMsg,
			});
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
					{({ values, errors, touched, handleBlur, setFieldValue }) => (
						<Form>
							<DrawerBody>
								<Grid
									templateColumns={{
										base: '1fr',
										md: 'repeat(2, 1fr)',
									}}
									gap={2}
									w='full'
									overflow='scroll'
									height={{ base: '60vh', md: '80vh' }}
									p='4'
								>
									<PhoneField
										name='leadWhatsappNumber'
										label='WhatsApp'
										country='ae'
										value={values.leadWhatsappNumber}
										error={errors.leadWhatsappNumber}
										touched={touched.leadWhatsappNumber}
										onChange={(val) => setFieldValue('leadWhatsappNumber', val)}
										onBlur={handleBlur}
									/>
									<PhoneField
										name='leadPhoneNumber'
										label='Phone Number'
										country='ae'
										value={values.leadPhoneNumber}
										error={errors.leadPhoneNumber}
										touched={touched.leadPhoneNumber}
										onChange={(val) => setFieldValue('leadPhoneNumber', val)}
										onBlur={handleBlur}
									/>
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
