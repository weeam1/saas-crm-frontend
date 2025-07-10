import { useState } from 'react';
import {
	IconButton,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	useDisclosure,
} from '@chakra-ui/react';
import { FiUser, FiMessageCircle } from 'react-icons/fi';
import { FaInfo } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { whatsappColors } from 'utils/helpers';
import MediaLimitsModal from './Media/MediaLimitsModal';
import WhatsappDirectChatModal from './modals/WhatsappDirectChat';
import ContactModal from './ContactModal';
import { useSelector } from 'react-redux';

const MenuOptions = ({ businessPhone }) => {
	const contacts = useSelector((state) => state.whatsapp.contacts || []);

	const {
		isOpen: isMediaLimitOpen,
		onOpen: onMediaLimitOpen,
		onClose: onMediaLimitClose,
	} = useDisclosure();

	const {
		isOpen: isDirectMessageOpen,
		onOpen: onDirectMessageOpen,
		onClose: onDirectMessageClose,
	} = useDisclosure();

	const [isContactModalOpen, setIsContactModalOpen] = useState(false);

	return (
		<>
			<Menu
				placement='bottom-start'
				display={{ base: 'none', sm: 'none', md: 'block' }}
			>
				<MenuButton
					as={IconButton}
					icon={<BsThreeDotsVertical />}
					variant='ghost'
					color={whatsappColors.textSecondary}
					size='sm'
				/>
				<MenuList>
					<MenuItem
						icon={<FiUser />}
						onClick={() => setIsContactModalOpen(true)}
					>
						Manage Contacts
					</MenuItem>
					<MenuItem icon={<FaInfo />} onClick={onMediaLimitOpen}>
						Media Limit
					</MenuItem>
					<MenuItem icon={<FiMessageCircle />} onClick={onDirectMessageOpen}>
						Direct Message
					</MenuItem>
				</MenuList>
			</Menu>

			{isDirectMessageOpen && (
				<WhatsappDirectChatModal
					isOpen={isDirectMessageOpen}
					onClose={onDirectMessageClose}
					businessPhone={businessPhone}
				/>
			)}

			{isMediaLimitOpen && (
				<MediaLimitsModal
					isOpen={isMediaLimitOpen}
					onClose={onMediaLimitClose}
				/>
			)}

			{/* Contact management modal */}
			{isContactModalOpen && (
				<ContactModal
					isOpen={isContactModalOpen}
					onClose={() => setIsContactModalOpen(false)}
					contacts={contacts}
					businessPhone={businessPhone}
				/>
			)}
		</>
	);
};

export default MenuOptions;
