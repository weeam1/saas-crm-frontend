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
import { useMemo } from 'react';

const selectFreshLead = (state) => state.freshLead?.leads ?? [];
const selectFreshLeadOpen = (state) => state.freshLead.isOpen;

const NewFreshLeadModal = () => {
	const dispatch = useDispatch();

	const webrtc = useSelector((state) => state.webrtc);
	const userSettings = webrtc?.userSettings;

	const isDialerEnabled = Boolean(
		userSettings?.status?.wss || userSettings?.modes?.wss?.cid,
	);

	const leads = useSelector(selectFreshLead);

	const isOpen = useMemo(() => leads.length > 0, [leads]);

	// const isOpen = useSelector(selectFreshLeadOpen);
	const leadPurchaseStatus = useSelector((state) => state.freshLead.ownedByMe);
	const { user } = useUserSession();

	const [createItem] = useCreateItemMutation();

	const bgColor = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('purple.100', 'purple.700');

	if (!leads || !isOpen) return null;

	const handleBuy = async (leadId) => {
		try {
			await createItem({ path: `/lead/purchase/${leadId}` }).unwrap();

			toast.success('🎉 Lead purchased successfully!');
			dispatch(removeFreshLead(leadId));
		} catch (err) {
			toast.error(err.message || 'Something went wrong');
		}
	};

	if (typeof leadPurchaseStatus === 'boolean') {
		const message = leadPurchaseStatus
			? 'You successfully purchased this lead.'
			: 'Oops! This lead has already been purchased by another user.';

		return toast.info(message);
		// return (
		// 	<LeadPurchaseMessage
		// 		purchaseStatus={leadPurchaseStatus}
		// 		onClose={() => dispatch(clearFreshLead())}
		// 	/>
		// );
	}

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
						<FreshLeadCard
							key={lead._id}
							lead={lead}
							user={user}
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
