import {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerCloseButton,
	DrawerBody,
	DrawerFooter,
	Button,
	Grid,
	Text,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';

import {
	useFetchItemsQuery,
	useUpdateItemMutation,
	useCreateItemMutation,
} from 'api/apiSlice';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import RenderFields from 'components/shared/RenderFields';
import { buttonStyle } from './../../../leadPool-v2/components/constants';
import Loader from 'components/loading/Loader';

const LeadAdditionalInfoModal = ({ isOpen, onClose, leadId }) => {
	const { data: existingInfo, isLoading: fetching } = useFetchItemsQuery(
		{
			path: `/lead/additional_info/${leadId}`,
		},
		{
			skip: !leadId,
			refetchOnMountOrArgChange: true,
		}
	);

	const user = JSON.parse(localStorage.getItem('user'));

	const role = user?.roles?.[0]?.roleName || user?.role;

	const editMode = useMemo(() => existingInfo?.doc, [existingInfo?.doc]);

	const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();
	const [createItem, { isLoading: isCreating }] = useCreateItemMutation();

	const initialValues = useMemo(() => {
		const obj = {};
		leadAdditionalFields.forEach(
			(f) =>
				(obj[f.name] =
					existingInfo?.doc?.[f.name] || (f.type === 'multiCheckbox' ? [] : ''))
		);
		return obj;
	}, [existingInfo?.doc]);

	const validationSchema = Yup.object().shape(
		Object.fromEntries(
			leadAdditionalFields.map((f) => [
				f.name,
				f.required ? Yup.string().required('Required') : Yup.string(),
			])
		)
	);

	const handleSubmit = async (values, actions) => {
		try {
			if (!editMode) {
				await createItem({
					path: `/lead/additional_info`,
					body: { leadId, ...values },
				}).unwrap();
			} else
				await updateItem({
					path: `/lead/additional_info/${leadId}`,
					body: values,
				}).unwrap();

			toast.success('Lead Info Updated');
			onClose();
			actions.resetForm();
		} catch (err) {
			toast.error(err?.data?.message || 'Update failed');
		}
	};

	return (
		<Drawer isOpen={isOpen} onClose={onClose} placement='right' size='lg'>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>Lead Additional Info</DrawerHeader>

				{fetching ? (
					<Loader />
				) : (
					<Formik
						enableReinitialize
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={handleSubmit}
					>
						{() => (
							<Form>
								<DrawerBody>
									{role === 'superAdmin' && editMode && (
										<Text
											fontWeight='medium'
											mb='4'
											fontSize={{ base: 'sm', md: 'md' }}
											color='brand.400'
										>
											Add by: {existingInfo?.doc?.createdBy?.fullName}
										</Text>
									)}

									<Grid
										height={{ base: '60vh', md: '80vh' }}
										overflow='scroll'
										scrollBehavior='smoth'
										templateColumns={{ base: '1fr', md: 'repeat(1, 1fr)' }}
										gap={2}
										p='2'
									>
										<RenderFields fields={leadAdditionalFields} />
									</Grid>
								</DrawerBody>

								<DrawerFooter>
									<Button
										{...buttonStyle}
										bg='softGray.100'
										color='gray.800'
										_active={{ bg: 'gray.100' }}
										mr={3}
										onClick={onClose}
									>
										Close
									</Button>
									<Button
										{...buttonStyle}
										colorScheme='brand'
										type='submit'
										isLoading={isUpdating || isCreating}
									>
										Save
									</Button>
								</DrawerFooter>
							</Form>
						)}
					</Formik>
				)}
			</DrawerContent>
		</Drawer>
	);
};

const leadAdditionalFields = [
	{
		name: 'clientOccupation',
		label: 'Client Occupation',
		type: 'text',
		required: true,
	},
	{
		name: 'actualBudget',
		label: 'Budget',
		type: 'number',
		required: true,
	},
	{
		name: 'preferredPropertyType',
		label: 'Property Type',
		type: 'select',
		required: true,
		options: [
			{ label: 'Investment', value: 'investment' },
			{ label: 'End Use', value: 'end_use' },
		],
	},

	{
		name: 'readinessToPurchase',
		label: 'Readiness',
		type: 'select',
		required: true,
		options: [
			{ label: 'Immediate', value: 'immediate' },
			{ label: 'Few Months', value: 'few_months' },
			{ label: 'Long Term', value: 'long_term' },
		],
	},
	{
		name: 'preferredCommunicationMethod',
		label: 'Communication Method',
		type: 'select',
		required: true,
		options: [
			{ label: 'Phone', value: 'phone' },
			{ label: 'Email', value: 'email' },
			{ label: 'WhatsApp', value: 'whatsapp' },
		],
	},
	{
		name: 'specificNeeds',
		label: 'Specific Needs',
		type: 'textarea',
		required: true,
	},
	{
		name: 'followUpSchedule',
		label: 'Follow-up Schedule',
		type: 'text',
		required: true,
	},
	{
		name: 'clientPriorityLevel',
		label: 'Priority',
		type: 'select',
		required: true,
		options: [
			{ label: 'Hot', value: 'hot' },
			{ label: 'Warm', value: 'warm' },
			{ label: 'Cold', value: 'cold' },
		],
	},
	{
		name: 'additionalNotes',
		label: 'Additional Notes',
		type: 'textarea',
		required: true,
	},
];

export default LeadAdditionalInfoModal;
