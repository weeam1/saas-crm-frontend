import React, { useEffect, useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	Image,
	Text,
	CircularProgress,
	Box,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { clearAnnouncement } from './../../../../redux/announcementsSlice';
import AnnouncementSlider from './AnnouncementSlider';
import { useModalColors } from 'hooks/useModalColors';

import logo from 'assets/img/app-logo.jpeg';

const AnnouncementsModal = ({ isOpen, onClose }) => {
	const colors = useModalColors();
	const announcements = useSelector((state) => state.announcements.list);
	const dispatch = useDispatch();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [loading, setLoading] = useState(false);

	// Close modal automatically if there are no announcements
	useEffect(() => {
		if (announcements.length === 0) {
			onClose();
		}
	}, [announcements, onClose]);

	const handleAcknowledge = (id) => {
		if (announcements.length > 0) {
			setLoading(true);
			dispatch(clearAnnouncement(id)); // Clear the current announcement
			setLoading(false);
			if (currentIndex >= announcements.length - 1) {
				setCurrentIndex(0); // Reset index if at the last announcement
			} else {
				setCurrentIndex(currentIndex + 1); // Move to the next announcement
			}
		}
	};

	return loading ? (
		<CircularProgress size='10' isIndeterminate color={colors.accentGold} />
	) : (
		announcements.length > 0 && (
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size='lg'
				isCentered
				closeOnOverlayClick={false}
			>
				<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />
				<ModalContent
					borderRadius='2xl'
					boxShadow={colors.modalShadow}
					maxWidth='900px'
					w='100%'
					textAlign='center'
					bg={colors.bg}
					border='1px solid'
					borderColor={colors.borderColor}
					overflow='hidden'
				>
					{/* Header Section */}
					<ModalHeader
						display='flex'
						alignItems='center'
						justifyContent='center'
						textAlign='center'
						bg={colors.headerBg}
						px={6}
						borderTopRadius='2xl'
						color={colors.headerText}
						py={4}
						borderBottom='1px solid'
						borderColor={colors.borderColor}
					>
						<Box
							display='flex'
							flexDirection='column'
							alignItems='center'
							justifyContent='center'
							textAlign='center'
							gap='2'
						>
							<Image src={logo} alt='Logo' boxSize='70px' />
							<Text fontSize='2xl' fontWeight='bold'>
								Important Announcement
							</Text>
						</Box>
					</ModalHeader>

					{/* Body Section */}
					<ModalBody py={4} overflow='hidden' width='100%' bg={colors.bg}>
						<Box
							width='100%'
							m='0'
							maxH='400px'
							overflowY='auto'
							sx={{
								'&::-webkit-scrollbar': {
									width: '6px',
								},
								'&::-webkit-scrollbar-track': {
									background: colors.bgInput,
									borderRadius: '8px',
								},
								'&::-webkit-scrollbar-thumb': {
									background: colors.accentGold,
									borderRadius: '8px',
								},
								'&::-webkit-scrollbar-thumb:hover': {
									background: colors.goldDark,
								},
							}}
						>
							<AnnouncementSlider
								announcements={announcements}
								onAcknowledge={handleAcknowledge}
							/>
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		)
	);
};

export default AnnouncementsModal;