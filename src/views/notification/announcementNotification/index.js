import React, { useEffect, useState, useMemo, useRef } from 'react';
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
	Flex,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { clearAnnouncement } from '../../../redux/announcementsSlice';
import AnnouncementSlider from '../../admin/announcement/components/AnnouncementSlider';

import logo from 'assets/logo_noname.png';
import { playNotificationSound } from '../utils/notificationSound';
import useUserSession from 'hooks/useUserSession';

const AnnouncementNotification = () => {
	const announcements = useSelector((state) => state.announcements.list || []);
	const dispatch = useDispatch();
const {agencyLogo}=useUserSession()
	const [isOpen, setIsOpen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [loading, setLoading] = useState(false);

	const prevCountRef = useRef(0);

	useEffect(() => {
		const prevCount = prevCountRef.current;
		const currentCount = announcements?.length || 0;

		if (currentCount > prevCount) {
			playNotificationSound();
		}

		prevCountRef.current = currentCount;
	}, [announcements]);

	const hasAnnouncements = useMemo(
		() => Array.isArray(announcements) && announcements.length > 0,
		[announcements],
	);

	/**
	 * Control modal visibility based on redux store
	 */
	useEffect(() => {
		if (hasAnnouncements) {
			setIsOpen(true);
		} else {
			setIsOpen(false);
			setCurrentIndex(0);
		}
	}, [hasAnnouncements]);

	/**
	 * Protect against index overflow when announcements update
	 */
	useEffect(() => {
		if (currentIndex >= announcements.length) {
			setCurrentIndex(0);
		}
	}, [announcements, currentIndex]);

	/**
	 * Acknowledge handler
	 */
	const handleAcknowledge = async (id) => {
		if (!id || loading) return;

		try {
			setLoading(true);

			dispatch(clearAnnouncement(id));

			setCurrentIndex((prev) => {
				if (announcements.length <= 1) return 0;
				return prev + 1 >= announcements.length ? 0 : prev + 1;
			});
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Prevent manual close if announcements exist
	 */
	const handleClose = () => {
		if (!hasAnnouncements) {
			setIsOpen(false);
		}
	};

	if (!isOpen) return null;

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size='lg'
			isCentered
			motionPreset='scale'
			closeOnOverlayClick={false}
			closeOnEsc={false}
		>
			<ModalOverlay backdropFilter='blur(6px)' />

			<ModalContent
				borderRadius='lg'
				boxShadow='2xl'
				maxW='900px'
				w='100%'
				textAlign='center'
			>
				{/* HEADER */}

				<ModalHeader
					bgGradient='linear(to-b, brand.400, brand.600)'
					color='white'
					borderTopRadius='lg'
					borderBottom='1px solid'
					borderColor='whiteAlpha.300'
					py={4}
				>
					<Flex direction='column' align='center' justify='center' gap={2}>
						<Image
							src={agencyLogo}
							alt='Logo'
							boxSize={{ base: '50px', md: '70px', lg: '100px' }}
							objectFit='contain'
							filter='brightness(0) invert(1)'
							opacity={0.9}
							dropShadow='0 2px 6px rgba(0,0,0,0.25)'
						/>

						<Text
							fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
							fontWeight='bold'
						>
							Important Announcement
						</Text>
					</Flex>
				</ModalHeader>

				{/* BODY */}

				<ModalBody py={4} px={6}>
					{loading ? (
						<Flex justify='center' py={10}>
							<CircularProgress
								isIndeterminate
								size='32px'
								thickness='4px'
								color='brand.500'
							/>
						</Flex>
					) : (
						<Box
							maxH='400px'
							overflowY='auto'
							sx={{
								'&::-webkit-scrollbar': {
									width: '6px',
								},
								'&::-webkit-scrollbar-thumb': {
									background: 'brand.500',
									borderRadius: '8px',
								},
								'&::-webkit-scrollbar-thumb:hover': {
									background: 'brand.600',
								},
							}}
						>
							<AnnouncementSlider
								announcements={announcements}
								currentIndex={currentIndex}
								setCurrentIndex={setCurrentIndex}
								onAcknowledge={handleAcknowledge}
							/>
						</Box>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default AnnouncementNotification;
