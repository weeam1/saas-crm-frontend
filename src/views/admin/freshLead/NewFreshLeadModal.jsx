import { removeFreshLead } from '../../../redux/freshLeadSlice';
import { toast } from 'react-toastify';
import useUserSession from 'hooks/useUserSession';

import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	VStack,
	HStack,
	Text,
	Badge,
	Progress,
	Button,
	Box,
	Icon,
	Flex,
	Heading,
	useColorModeValue,
	CloseButton,
} from '@chakra-ui/react';
import {
	FiClock,
	FiAward,
	FiDollarSign,
	FiTarget,
	FiGlobe,
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

import { useCreateItemMutation } from 'api/apiSlice';
import FreshLeadCard from './FreshLeadCard';
import { useEffect, useMemo, useRef, useState } from 'react';
import soundPlayer from 'utils/sound/soundUtil';

// import notificationFile from 'assets/sounds/new-notification.mp3';
import { playNewLeadNotification } from './leadNotificationUtil';

const selectFreshLead = (state) => state.freshLead?.leads ?? [];

const NewFreshLeadModal = () => {
	const dispatch = useDispatch();

	const webrtc = useSelector((state) => state.webrtc);
	const userSettings = webrtc?.userSettings;

	const isDialerEnabled = Boolean(
		userSettings?.status?.wss || userSettings?.modes?.wss?.cid,
	);

	const leads = useSelector(selectFreshLead);
	const isOpen = useMemo(() => leads.length > 0, [leads]);
	const prevCountRef = useRef(leads.length);

	useEffect(() => {
		// Only play if length actually increased
		if (leads.length > prevCountRef.current) {
			playNewLeadNotification();
		}
		prevCountRef.current = leads.length;
	}, [leads.length]);

	// const isOpen = useSelector(selectFreshLeadOpen);
	const { user } = useUserSession();

	const [createItem, { isLoading: isSubmitting }] = useCreateItemMutation();

	const bgColor = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('purple.100', 'purple.700');

	if (!leads || !isOpen) return null;

	const handleBuy = async (leadId) => {
		try {
			await createItem({ path: `/lead/purchase/${leadId}` }).unwrap();

			toast.success('🎉 Lead purchased successfully!');
			dispatch(removeFreshLead(leadId));
		} catch (err) {
			toast.error(err?.data?.message || 'Something went wrong');
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
							<Text color='brand.400'>Exclusive Lead!</Text>
						</HStack>
					</HStack>
				</ModalHeader>

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
						<FreshLeadCard
							key={lead._id}
							lead={lead}
							user={user}
							isSubmitting={isSubmitting}
							handleBuy={handleBuy}
							isDialerEnabled={isDialerEnabled}
						/>
					))}
				</ModalBody>

				{/* <ModalFooter flexDirection='column' spacing={3}></ModalFooter> */}
			</ModalContent>
		</Modal>
	);
};

export default NewFreshLeadModal;
