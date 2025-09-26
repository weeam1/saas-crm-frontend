import {
	Box,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	useColorModeValue,
	Button,
	Flex,
} from '@chakra-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StepAccountSelect } from './StepAccountSelect';
import { StepTemplateSelect } from './StepTemplateSelect';
import { StepLeadSelect } from './StepLeadSelect';
import FinalSummaryModal from './FinalSummaryModal';
import { toast } from 'react-toastify';
import { useCreateItemMutation } from 'api/apiSlice';
import BulkMessageSummary from 'views/admin/lead-v2/components/whatsapp-message/BulkMessageSummary';

const BulkMessage = () => {
	const tabBg = useColorModeValue('white', 'gray.800');
	// const [step, setStep] = useState(0); // current active step
	const [selectedAccount, setSelectedAccount] = useState(null);
	const [selectedTemplate, setSelectedTemplate] = useState(null);
	// selectedMap stores selected lead objects across pages: { id -> leadObject }
	const [selectedLeadsMap, setSelectedLeadsMap] = useState(() => new Map());
	const [finalSummaryModal, setFinalSummaryModal] = useState(false);
	const [validLeadsList, setValidLeadsList] = useState([]);

	const [tabIndex, setTabIndex] = useState(0);

	const [messageSummary, setMessageSummary] = useState(null);
	const [summaryModal, setSummaryModal] = useState(false);

	// Derive the max allowed step from state
	const maxStep = useMemo(() => {
		if (selectedTemplate) return 2;
		if (selectedAccount) return 1;
		return 0;
	}, [selectedAccount, selectedTemplate]);

	// Auto-forward ONLY if maxStep increased
	const prevMaxStep = useRef(0);

	useEffect(() => {
		if (maxStep > prevMaxStep.current) {
			setTabIndex(maxStep);
		}
		prevMaxStep.current = maxStep;
	}, [maxStep]);

	const goNext = () => setTabIndex((s) => Math.min(s + 1, maxStep));
	const goBack = () => setTabIndex((s) => Math.max(s - 1, 0));

	const [sendBulkMessage, { isLoading }] = useCreateItemMutation();

	const handleSubmitMessage = async () => {
		try {
			if (!selectedAccount?.phoneNumber) {
				return toast.error('User Whatsapp number is required!');
			}

			const body = {
				type: 'template',
				from: selectedAccount?.phoneNumber,
				phoneList: validLeadsList,
				body: selectedTemplate.message,
				templateName: selectedTemplate.templateName,
				languageCode: selectedTemplate.languageCode,
				placeholders: selectedTemplate.placeholders,
			};

			const res = await sendBulkMessage({
				path: '/whatsapp/bulk/messages',
				body,
			}).unwrap();

			setMessageSummary(res?.summary);
			setSummaryModal(true);
			console.log({ body });
		} catch (err) {
			console.error('Error sending bulk message:', err);
			toast.error(err?.data?.message || 'Failed to sending Message.');
		}
	};

	const closeSummary = () => {
		setSummaryModal(false);
		setFinalSummaryModal(false);
		setTabIndex(0);
		setSelectedAccount(null);
		setSelectedTemplate(null);
		setValidLeadsList(null);
		setMessageSummary(null);
		// clear map array
		setSelectedLeadsMap(new Map());
	};

	return (
		<Box mx={8} mt={6} bg={tabBg} rounded='xl' shadow='sm' p={6}>
			<Tabs
				index={tabIndex}
				onChange={setTabIndex}
				isFitted
				isManual
				colorScheme='brand'
			>
				<TabList bg='gray.100' p={2} borderRadius='md' fontWeight='bold'>
					<Tab
						_selected={{ bg: 'brand.300', color: 'white' }}
						_disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
						fontWeight='semibold'
						rounded='md'
					>
						Account
					</Tab>
					<Tab
						isDisabled={!selectedAccount}
						_selected={{ bg: 'brand.300', color: 'white' }}
						_disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
						fontWeight='semibold'
						rounded='md'
					>
						Template
					</Tab>
					<Tab
						isDisabled={!selectedTemplate}
						_selected={{ bg: 'brand.300', color: 'white' }}
						_disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
						fontWeight='semibold'
						rounded='md'
					>
						Leads
					</Tab>
				</TabList>

				<TabPanels>
					{/* Step 1: Account */}
					<TabPanel>
						<StepAccountSelect
							onNext={(accountId) => {
								setSelectedAccount(accountId);
								goNext();
							}}
							selectedAccount={selectedAccount}
						/>
					</TabPanel>

					{/* Step 2: Template */}
					<TabPanel>
						<StepTemplateSelect
							businessId={selectedAccount?.businessId}
							onNext={(template) => {
								setSelectedTemplate(template);
								goNext();
							}}
							onBack={goBack}
							selectedTemplate={selectedTemplate}
						/>
					</TabPanel>

					{/* Step 3: Leads */}
					<TabPanel>
						<StepLeadSelect
							account={selectedAccount}
							template={selectedTemplate}
							selectedLeadsMap={selectedLeadsMap}
							setSelectedLeadsMap={setSelectedLeadsMap}
							onBack={goBack}
							onConfirm={() => setFinalSummaryModal(true)}
						/>
					</TabPanel>
				</TabPanels>
			</Tabs>

			{finalSummaryModal && (
				<FinalSummaryModal
					isOpen={finalSummaryModal}
					onClose={() => setFinalSummaryModal(false)}
					selectedLeadsMap={selectedLeadsMap}
					setValidLeadsList={setValidLeadsList}
					onConfirm={handleSubmitMessage}
					isLoading={isLoading}
				/>
			)}

			{summaryModal && (
				<BulkMessageSummary
					isOpen={summaryModal}
					onClose={closeSummary}
					summary={messageSummary}
				/>
			)}
		</Box>
	);
};

export default BulkMessage;
