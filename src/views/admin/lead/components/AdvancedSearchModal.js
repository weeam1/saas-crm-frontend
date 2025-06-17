import { useSelector } from 'react-redux';
import { validationLeadSearchSchema } from 'schema/leadSchema';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { leadStatusLabels } from 'utils/searchLabels';
import { mainLeadStatusLabels } from 'utils/searchLabels';
import { leadLabels } from 'utils/searchLabels';

const LazyAdvancedSearchForm = React.lazy(() => import('./AdvancedSearchForm'));

const {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	Spinner,
} = require('@chakra-ui/react');

const AdvancedSearchModal = ({
	setAdvaceSearch,
	advaceSearch,
	isLoading,
	fetchAdvancedSearch,
	setSearchClear,
	setFormValues,
	isFormReset,
	setIsFormReset,
	pageSize,
	setGetTagValues,
}) => {
	const user = JSON.parse(localStorage.getItem('user'));
	const tree = useSelector((state) => state.user.tree);

	const formClearHanlder = () => {
		// handleClear();
		formikResetForm();
	};

	const initialValues = {
		intID: '',
		leadName: '',
		leadStatus: '',
		eLeadStatus: '',
		leadEmail: '',
		leadPhoneNumber: '',
		managerAssigned: '',
		agentAssigned: '',
		leadWhatsappNumber: '',
		nationality: '',
		ip: '',
		leadAddress: '',
		leadCampaign: '',
		leadSourceDetails: '',
		leadSourceMedium: '',
		pageUrl: '',
		r_u_in_uae: '',
		timetocall: '',
		leadLang: '',
		lastNote: '',
		budget: '',
	};

	const formik = useFormik({
		initialValues,
		validationSchema: validationLeadSearchSchema,
		onSubmit: (values, { formikResetForm }) => {
			// Initialize cleanedData and tags
			const { cleanedData, tags } = Object.entries(values).reduce(
				(acc, [key, value]) => {
					if (value !== '' && value !== undefined) {
						// Add raw value to cleanedData for API
						acc.cleanedData[key] = value;

						let displayValue = value;

						// Special formatting rules for score range
						if (key === 'fromLeadScore' || key === 'toLeadScore') {
							displayValue = `${values.fromLeadScore || 0}-${
								values.toLeadScore || 'max'
							}`;
						}

						// Special formatting for leadStatus
						if (key === 'leadStatus') {
							displayValue =
								value === 'active'
									? 'Interested'
									: value === 'pending'
										? 'Not Interested'
										: leadStatusLabels[value];
						}

						// Special formatting for leadStatus
						if (key === 'eLeadStatus') {
							displayValue =
								value === '-1' ? 'No E.Status' : mainLeadStatusLabels[value];
						}

						// Handle agentAssigned
						if (key === 'agentAssigned') {
							const agentsArray = Object.values(tree.agents).flatMap(
								(managerArray) => managerArray
							);
							const assignedAgent = agentsArray.find(
								(agent) => agent?._id?.toString() === value
							);

							displayValue = assignedAgent
								? `${assignedAgent.firstName} ${assignedAgent.lastName}`
								: value === '-1'
									? 'No Agent'
									: value;
						}

						// Handle managerAssigned
						if (key === 'managerAssigned') {
							const assignedManager = tree.managers.find(
								(user) => user?._id?.toString() === value
							);

							displayValue = assignedManager
								? `${assignedManager.firstName} ${assignedManager.lastName}`
								: value === '-1'
									? 'No Manager'
									: value;
						}

						// if (key === 'intID') key = 'Lead ID';

						// Add formatted value to tags for UI
						acc.tags.push(`${leadLabels[key]}: ${displayValue}`);
					}

					return acc;
				},
				{ cleanedData: {}, tags: [] }
			);

			// Call API with cleaned data
			fetchAdvancedSearch(cleanedData, 1, pageSize);
			setAdvaceSearch(false);

			// Update UI with tags
			setGetTagValues(tags);
			setSearchClear(true);
			setFormValues(values);
		},
	});

	const {
		errors,
		touched,
		values,
		handleBlur,
		handleChange,
		handleSubmit,
		resetForm: formikResetForm,
		dirty,
	} = formik;

	// Send the reset function to the parent
	useEffect(() => {
		if (isFormReset) {
			formikResetForm();
			setIsFormReset(false);
		}
	}, [isFormReset, formikResetForm, setIsFormReset]);

	return (
		<React.Suspense fallback={<Spinner />}>
			<Modal
				size='6xl'
				onClose={() => {
					setAdvaceSearch(false);
					// formikResetForm();
				}}
				isOpen={advaceSearch}
				isCentered
				motionPreset='slideInBottom'
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Advance Search</ModalHeader>
					<ModalCloseButton
						onClick={() => {
							setAdvaceSearch(false);
							formikResetForm();
						}}
					/>
					<ModalBody width='100%'>
						<LazyAdvancedSearchForm
							values={values}
							errors={errors}
							touched={touched}
							handleChange={handleChange}
							handleBlur={handleBlur}
							user={user}
							tree={tree}
						/>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme='red'
							variant='outline'
							size='sm'
							mr={2}
							onClick={formClearHanlder}
						>
							Clear
						</Button>
						<Button
							colorScheme='brand'
							size='sm'
							onClick={handleSubmit}
							disabled={isLoading || !dirty ? true : false}
						>
							{isLoading ? <Spinner /> : 'Search'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</React.Suspense>
	);
};
export default AdvancedSearchModal;
