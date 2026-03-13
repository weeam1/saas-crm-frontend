import {
	Box,
	Flex,
	Grid,
	GridItem,
	HStack,
	Icon,
	IconButton,
	Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useUserSession from 'hooks/useUserSession';
import { toast } from 'react-toastify';

import { FaPhone, FaWhatsapp } from 'react-icons/fa';
import CustomTooltip from 'components/shared/CustomTooltip';
import { usePermissions } from 'hooks/usePermissions';
import { normalizePhone, formatWebRTCPhone } from 'utils/phoneValidation';
import { generateRoomId } from 'views/admin/whatsapp/components/helpers';

import DirectWhatsappMessage from '../../whatsapp-message/DirectWhatsappMessage';
import { setActiveChat } from '../../../../../../redux/whatsappSlice';
import { setAutoDialLead } from '../../../../../../redux/webrtc/webrtcSlice';
import { useNavigate } from 'react-router-dom';

const ContactBox = ({ lead }) => {
	const [directMessageModal, setDirectMessageModal] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { hasPermission } = usePermissions();
	const { user, isSuperAdmin } = useUserSession();

	const webrtc = useSelector((state) => state.webrtc);
	const userSettings = webrtc?.userSettings;

	const isWssEnabled = Boolean(
		userSettings?.status?.wss || userSettings?.modes?.wss?.cid,
	);

	const whatsappInstance =
		(user?.whatsappInstance?.sessionId && user?.whatsappInstance?.isActive) ||
		false;

	const businessPhone = user?.whatsappDetails?.phoneNumber;

	const IS_WHATSAPP_ENABLED =
		hasPermission('whatsapp') && (businessPhone || whatsappInstance);

	const IS_DIALER_ENABLED = isWssEnabled && hasPermission('call_dialer');

	const handleOpenWhatsapp = () => {
		const validNum = normalizePhone(lead?.leadWhatsappNumber);

		if (!validNum) return toast.error('Not valid WhatsApp number!');

		const roomId = generateRoomId(validNum, businessPhone);

		const newContact = {
			phoneNumber: validNum,
			roomId,
			ownerId: businessPhone,
		};

		dispatch(setActiveChat(newContact));

		const redirectUrl = isSuperAdmin
			? `/whatsapp/chats/${user._id}`
			: `/whatsapp/chats`;

		navigate(redirectUrl);
	};

	const handleDirectCall = () => {
		const validNum = formatWebRTCPhone(lead?.leadPhoneNumber);

		if (validNum) {
			dispatch(
				setAutoDialLead({
					phoneNumber: validNum,
					leadName: lead?.leadName,
					id: lead?.leadId,
				}),
			);
		} else
			toast.warning(
				'Lead phone number is invalid for calling. Please check the format.',
			);
	};

	const handleWhatsappChat = () => {
		if (hasPermission('whatsapp') && whatsappInstance) {
			setDirectMessageModal(true);
			return;
		} else if (businessPhone && hasPermission('whatsapp')) {
			handleOpenWhatsapp();

			return;
		} else {
			toast.error(
				isSuperAdmin
					? 'Please first setup our whatsapp!'
					: 'Your WhatsApp is not setup, please contact with super Admin.',
			);
			return;
		}
	};

	return (
		<>
			<GridItem colSpan={2} display='flex' justifyContent='flex-start'>
				<HStack spacing={3}>
					{/* Phone */}
					{IS_DIALER_ENABLED && (
						<CustomTooltip label='Direct call'>
							<IconButton
								icon={
									<FaPhone
										style={{
											transform: 'scaleX(-1)',
										}}
									/>
								}
								onClick={handleDirectCall}
								aria-label='Direct call'
								size='sm'
								colorScheme='greenish'
								variant='solid'
								bg='greenish.50'
								color='greenish.600'
								_hover={{
									bg: 'greenish.100',
									transform: 'scale(1.05)',
								}}
								_active={{
									bg: 'greenish.200',
								}}
								borderRadius='lg'
								boxShadow='sm'
								transition='all 0.2s'
							/>
						</CustomTooltip>
					)}

					{/* WhatsApp */}
					{IS_WHATSAPP_ENABLED && (
						<CustomTooltip label='Open WhatsApp chat'>
							<IconButton
								onClick={handleWhatsappChat}
								icon={<FaWhatsapp />}
								aria-label='Open WhatsApp chat'
								size='sm'
								colorScheme='green'
								variant='solid'
								bg='green.50'
								color='green.600'
								_hover={{
									bg: 'green.100',
									transform: 'scale(1.05)',
								}}
								_active={{
									bg: 'green.200',
								}}
								borderRadius='lg' // Not fully rounded, just large corners
								boxShadow='sm'
								transition='all 0.2s'
							/>
						</CustomTooltip>
					)}
				</HStack>
			</GridItem>

			{directMessageModal && (
				<DirectWhatsappMessage
					isOpen={directMessageModal}
					onClose={() => setDirectMessageModal(false)}
					user={user}
					number={lead?.leadWhatsappNumber}
				/>
			)}
		</>
	);
};

export default ContactBox;
