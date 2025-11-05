import { useSelector } from 'react-redux';
import { validationLeadSearchSchema } from 'schema/leadSchema';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	Spinner,
	Flex,
} from '@chakra-ui/react';
import { leadLabels } from 'utils/searchLabels';
import { leadStatusLabels } from 'utils/searchLabels';
import { mainLeadStatusLabels } from 'utils/searchLabels';
import { useModalColors } from 'hooks/useModalColors';

const LazyAdvancedSearchForm = React.lazy(() => import('./AdvancedForm'));

const AdvancedSearchModal = ({
	setAdvanceSearch,
	advanceSearch,
	isLoading,
	fetchAdvancedSearch,
	setSearchClear,
	setFormValues,
	isFormReset,
	setIsFormReset,
	pageSize,
	setGetTagValues,
	setDisplaySearchData,
	onClearSearch,
	setQueryData,
}) => {
	const user = JSON.parse(localStorage.getItem('user'));
	const tree = useSelector((state) => state.user.tree);

	const { headerBg, headerText } = useModalColors();

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
		onSubmit: (values) => {
			const { cleanedData, tags } = Object.entries(values).reduce(
				(acc, [key, value]) => {
					if (value !== '' && value !== undefined) {
						acc.cleanedData[key] = value;

						let displayValue = value;
						if (key === 'fromLeadScore' || key === 'toLeadScore') {
							displayValue = `${values.fromLeadScore || 0}-${values.toLeadScore || 'max'}`;
						}
						if (key === 'leadStatus') {
							displayValue =
								value === 'active'
									? 'Interested'
									: value === 'pending'
										? 'Not Interested'
										: leadStatusLabels[value];
						}
						if (key === 'eLeadStatus') {
							displayValue =
								value === '-1' ? 'No E.Status' : mainLeadStatusLabels[value];
						}
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

						acc.tags.push(`${leadLabels[key]}: ${displayValue}`);
					}
					return acc;
				},
				{ cleanedData: {}, tags: [] }
			);

			fetchAdvancedSearch(cleanedData, 1, pageSize);
			setAdvanceSearch(false);
			setGetTagValues(tags);
			setSearchClear(true);
			setFormValues(values);
			setQueryData(cleanedData);
			setDisplaySearchData(true);
		},
	});

	const {
		errors,
		touched,
		values,
		handleBlur,
		handleChange,
		handleSubmit,
		resetForm,
		dirty,
	} = formik;

	const formClearHandler = () => {
		resetForm();
		// onClearSearch();
		// setAdvanceSearch(false);
	};

	useEffect(() => {
		if (isFormReset) {
			resetForm();
			setIsFormReset(false);
		}
	}, [isFormReset, resetForm, setIsFormReset]);

	return (
		<React.Suspense
			fallback={
				<Flex
					position='fixed'
					top='0'
					left='0'
					right='0'
					bottom='0'
					alignItems='center'
					justifyContent='center'
					bg='rgba(0, 0, 0, 0.1)'
					zIndex={9999}
				>
					<Spinner size='xl' color='brand.500' />
				</Flex>
			}
		>
			<Modal
				size='6xl'
				onClose={() => setAdvanceSearch(false)}
				isOpen={advanceSearch}
				isCentered
				motionPreset='slideInBottom'
			>
				<ModalOverlay backdropFilter='blur(2px)' />
				<ModalContent mx='2' borderRadius='xl' boxShadow='xl'>
					<ModalHeader
						display='flex'
						gap='2'
						bg={headerBg}
						color={headerText}
						borderTopRadius='xl'
						py={4}
						alignItems='center'
						w='100%'
					>
						Advanced Search
					</ModalHeader>
					<ModalCloseButton onClick={() => setAdvanceSearch(false)} />
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
							onClick={formClearHandler}
						>
							Clear
						</Button>
						<Button
							colorScheme='brand'
							size='sm'
							onClick={handleSubmit}
							disabled={isLoading || !dirty}
						>
							{isLoading ? 'Searching...' : 'Search'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</React.Suspense>
	);
};

export default AdvancedSearchModal;
