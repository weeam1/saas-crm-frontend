import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	HStack,
	Text,
	Icon,
	useColorModeValue,
} from '@chakra-ui/react';
import { FiAward } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { playNewLeadNotification } from '../leadNotificationUtil';
import FreshApprovedLeadCard from './FreshApprovedLeadCard';
import { formatWebRTCPhone } from 'utils/phoneValidation';
import { setAutoDialLead } from '../../../../redux/webrtc/webrtcSlice';
import { toast } from 'react-toastify';

const sampleLead = {
	_id: '67da7a08edd295dbba99baaf',
	managerAssigned: '676e5a6a44f974166590fe6a',
	agentAssigned: '676e5abb44f974166590fef0',
	leadStatus: 'reassigned',
	eLeadStatus: 'deal',
	attendanceDay: 'Friday 11 april',
	intID: 13720,
	leadLang: 'Arabic',
	createdDate: '2025-03-19T08:02:16.011Z',
	isReleased: false,
	createBy: null,
	leadCampaign: '',
	leadSourceChannel: '',
	leadSource: '',
	leadSourceDetails: '',
	leadSourceMedium: '',
	leadSourceReferral: null,
	leadSourceCampaign: null,
	leadCreationDate: null,
	leadFollowUpDate: null,
	leadFollowUpStatus: null,
	leadConversionDate: null,
	leadCommunicationPreferences: null,
	leadOwner: null,
	leadAssignedAgent: null,
	leadName: 'Hammad',
	leadEmail: 'hammadarain326@gmail.com',
	leadPhoneNumber: '+923495580124',
	leadAddress: '',
	leadScore: null,
	leadNurturingWorkflow: null,
	leadEngagementLevel: null,
	leadConversionRate: null,
	leadNurturingStage: null,
	leadNextAction: null,
	project2: null,
	nationality: 'pak',
	interest: null,
	leadWhatsappNumber: '+923041349020',
	r_u_in_uae: '',
	timetocall: '',
	ip: '59.103.119.44-Mansehra-Pakistan',
	pageUrl: 'https://aqarybay.com/show-test-page',
	adset: '',
	updatedDate: '2025-03-19T08:02:16.021Z',
	__v: 0,
	agentAssignedDate: '2025-12-16T06:08:18.887Z',
	leadType: null,
	managerAssignedDate: '2025-12-01T13:07:00.917Z',
	budget: '32',
	lastNote: 'manager here ',
	mStatusDate: '2025-07-11T12:35:50.415Z',
	isClosedDeal: false,
	statusOrder: 9,
	totalNotes: 6,
	teamLeadAssigned: '693bfaa563a79360beb59684',
	teamLeadAssignedDate: '2025-12-13T05:13:55.522Z',
	isQualification: false,
	teamLeadDetails: {
		_id: '693bfaa563a79360beb59684',
		username: 'teamleader2@gmail.com',
		agency: {
			_id: '67b32a0c4b324a4423b86a21',
			name: 'Dubai',
		},
		commissionType: 'DEAL_COMMISSION',
		commission: 5,
		fullName: 'Teamleader 2',
	},
	agentDetails: {
		_id: '676e5abb44f974166590fef0',
		username: 'testagent@gmail.com',
		fullName: 'Test Hammad',
		agency: {
			_id: '67b33ca776be2ae78bc7eaa4',
			name: 'Egypt',
		},
		commission: 4,
		commissionType: 'DEAL_COMMISSION',
	},
	managerDetails: {
		_id: '676e5a6a44f974166590fe6a',
		username: 'testmanager@gmail.com',
		fullName: 'Test Manager',
		agency: {
			_id: '67b32a0c4b324a4423b86a21',
			name: 'Dubai',
		},
		commission: 5,
		commissionType: 'COMPANY_COMMISSION',
	},
	latestNote: {
		_id: '6849135a913876cbbce14017',
		leadID: '67da7a08edd295dbba99baaf',
		note: 'manager here',
		addedBy: {
			_id: '676e5a6a44f974166590fe6a',
			fullName: 'Test Manager',
			agency: {
				_id: '67b32a0c4b324a4423b86a21',
				name: 'Dubai',
			},
		},
		createdAt: '2025-06-11T05:25:46.755Z',
	},
};

const selectApprovalLead = (state) => state.freshLead?.approvalLeads ?? [];

const FreshApprovedLeadModal = () => {
	const dispatch = useDispatch();

	const leads = useSelector(selectApprovalLead);

	const isOpen = useMemo(() => leads.length > 0 || true, [leads]);

	const webrtc = useSelector((state) => state.webrtc);
	const userSettings = webrtc?.userSettings;

	const isDialerEnabled = Boolean(
		userSettings?.status?.wss || userSettings?.modes?.wss?.cid,
	);

	const bgColor = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('purple.100', 'purple.700');

	const prevCountRef = useRef(leads.length);

	useEffect(() => {
		// Only play if length actually increased
		if (leads.length > prevCountRef.current) {
			playNewLeadNotification();
		}
		prevCountRef.current = leads.length;
	}, [leads.length]);

	if (!isOpen) return null;

	const handleDirectCall = (lead) => {
		const validNum = formatWebRTCPhone(lead?.leadPhoneNumber);

		if (validNum) {
			dispatch(
				setAutoDialLead({
					phoneNumber: validNum,
					leadName: lead?.leadName,
					id: lead?._id,
				}),
			);
		} else
			toast.warning(
				'Lead phone number is invalid for calling. Please check the format.',
			);
	};

	return (
		<Modal
			isOpen={isOpen}
			isCentered
			size='xl'
			motionPreset='scale'
			closeOnOverlayClick={false}
		>
			<ModalOverlay backdropFilter='blur(10px)' bg='blackAlpha.700' />
			<ModalContent
				borderRadius='3xl'
				bg={bgColor}
				borderWidth='2px'
				borderColor={borderColor}
				boxShadow='2xl'
				overflow='hidden'
			>
				{/* Header with Timer */}
				<ModalHeader fontSize='xl' fontWeight='bold' pb={0}>
					<HStack justify='space-between' align='center'>
						<HStack>
							<Icon as={FiAward} color='brand.500' w={6} h={6} />
							<Text color='brand.400'>
								Approve Leads ({leads?.length || 1})
							</Text>
						</HStack>
					</HStack>
				</ModalHeader>
				{/* <ModalCloseButton top={4} right={4} /> */}

				<ModalBody
					py={6}
					px={4}
					maxH={{ base: '50vh', md: '60vh', lg: '70vh' }}
					overflowY='auto'
					sx={{
						scrollBehavior: 'smooth',
					}}
				>
					{leads?.map((lead) => (
						<FreshApprovedLeadCard
							key={lead._id}
							lead={lead}
							handleCall={handleDirectCall}
							isDialerEnabled={isDialerEnabled}
						/>
					))}
					{/* <FreshApprovedLeadCard
						lead={sampleLead}
						handleCall={handleDirectCall}
						isDialerEnabled={isDialerEnabled}
					/> */}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default FreshApprovedLeadModal;
