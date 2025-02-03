import React, { useEffect, useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Image,
	Text,
	CircularProgress,
	Box,
	Heading,
	Flex,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { clearAnnouncement } from './../../../../redux/announcementsSlice';
import AnnouncementSlider from './AnnouncementSlider';

import logo from 'assets/img/app-logo.jpeg';

const AnnouncementsModal = ({ isOpen, onClose }) => {
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
		<CircularProgress size='10' isIndeterminate />
	) : (
		announcements.length > 0 && (
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size='lg'
				isCentered
				closeOnOverlayClick={false}
			>
				<ModalOverlay />
				<ModalContent
					borderRadius='lg'
					boxShadow='2xl'
					maxWidth='900px'
					w='100%'
					textAlign='center'
				>
					{/* Header Section */}
					<ModalHeader
						display='flex'
						alignItems='center'
						justifyContent='center'
						textAlign='center'
						bg='brand.500'
						px={6}
						borderTopRadius='md'
						color='white'
						py={4}
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
							<Text fontSize='2xl' fontWeight='bold' ml={4}>
								Important Announcement
							</Text>
						</Box>
					</ModalHeader>

					{/* Body Section */}
					<ModalBody py={4} overflow='hidden' width='100%'>
						<Box
							width='100%'
							m='0'
							background='brand'
							maxH='400px' // Set max height for the modal body
							overflowY='auto' // Enable vertical scrolling when content exceeds max height
							sx={{
								'&::-webkit-scrollbar': {
									width: '6px', // Custom scrollbar width
								},
								'&::-webkit-scrollbar-thumb': {
									background: 'brand.500', // Custom brand color (adjust according to your theme)
									borderRadius: '8px',
								},
								'&::-webkit-scrollbar-thumb:hover': {
									background: 'brand.600', // Slightly darker on hover
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
