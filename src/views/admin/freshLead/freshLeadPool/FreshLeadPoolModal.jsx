import { removeFreshLeadPool } from '../../../../redux/freshLeadPoolSlice';
import { toast } from 'react-toastify';
import useUserSession from 'hooks/useUserSession';

import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	HStack,
	Text,
	Badge,
	Progress,
	Button,
	Box,
	Icon,
	useColorModeValue,
} from '@chakra-ui/react';
import { FiAward } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useRef } from 'react';

import { useCreateItemMutation } from 'api/apiSlice';
import FreshLeadPoolCard from './FreshLeadPoolCard';
import { playNewLeadNotification } from '../leadNotificationUtil';

const sampleLead = {
	leadName: 'Abdul Qudos',
	leadId: '69954ca67f933eec1cee84ac',
	agentName: 'Test Hammad',
	agentId: '676e5abb44f974166590fef0',
	mangerName: 'Test Manager',
	managerId: '676e5a6a44f974166590fe6a',
	approvalStatus: 'pending',
	leadPhoneNumber: '+923243432433',
	leadEmail: 'qu3ul569@gmail.com',
	nationality: 'Albania',
	interest: null,
	leadStatus: 'fresh_lead',
	eLeadStatus: 'new',
	createdDate: '2026-02-18T05:22:46.106Z',
	_id: '69954cb67f933eec1cee84be',
	createdAt: '2026-02-18T05:23:02.997Z',
	updatedAt: '2026-02-18T05:23:02.997Z',
	__v: 0,
	id: '69954cb67f933eec1cee84be',
	expiresAt: 1771392244984,
};

const selectFreshLead = (state) => state.freshLeadPool?.leads ?? [];

const NewFreshLeadPoolModal = () => {
	const dispatch = useDispatch();

	const leads = useSelector(selectFreshLead);

	const isOpen = useMemo(() => leads.length > 0, [leads]);

	const { user } = useUserSession();

	const [createItem, { isLoading: isSubmitting }] = useCreateItemMutation();

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

	if (!leads?.length || !isOpen) return null;

	const handleSubmit = async (leadId, type) => {
		try {
			await createItem({
				path: `/adminApproval/real-time/response/${leadId}`,
				body: { type },
			}).unwrap();

			toast.success(`Lead ${type} successfully!`);
			// dispatch(removeFreshLeadPool(leadId));
		} catch (err) {
			toast.error(err?.data?.message || 'Something went wrong');
		} finally {
			dispatch(removeFreshLeadPool(leadId));
		}
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
								Fresh Lead Request ({leads?.length || 1})
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
						<FreshLeadPoolCard
							key={lead._id}
							lead={lead}
							isSubmitting={isSubmitting}
							handleSubmit={handleSubmit}
						/>
					))}
					{/* <FreshLeadPoolCard
						lead={sampleLead}
						isSubmitting={isSubmitting}
						handleSubmit={handleSubmit}
					/> */}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default NewFreshLeadPoolModal;
