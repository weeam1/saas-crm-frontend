import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { clearAnnouncement } from "./../../../../redux/announcementsSlice";
import AnnouncementSlider from "./AnnouncementSlider";

import logo from "assets/img/app-logo.jpeg";

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

	const handleAcknowledge = () => {
		if (announcements.length > 0) {
			setLoading(true);
			dispatch(clearAnnouncement(currentIndex)); // Clear the current announcement
			setLoading(false);
			if (currentIndex >= announcements.length - 1) {
				setCurrentIndex(0); // Reset index if at the last announcement
			} else {
				setCurrentIndex(currentIndex + 1); // Move to the next announcement
			}
		}
	};

	return loading ? (
		<CircularProgress size="10" isIndeterminate />
	) : (
		announcements.length > 0 && (
			<Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
				<ModalOverlay />
				<ModalContent
					borderRadius="lg"
					boxShadow="2xl"
					maxWidth="900px"
					w="95%"
					textAlign="center"
					p={4}
				>
					{/* Header Section */}
					<ModalHeader
						display="flex"
						alignItems="center"
						justifyContent="center"
						textAlign="center"
						px={6}
						py={4}
					>
						<Box
							display="flex"
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							textAlign="center"
							gap="2"
						>
							<Image src={logo} alt="Logo" boxSize="70px" />
							<Text fontSize="2xl" fontWeight="bold" ml={4}>
								Important Announcement
							</Text>
						</Box>
					</ModalHeader>

					<ModalCloseButton />

					{/* Body Section */}
					<ModalBody px={6} py={4}>
						<AnnouncementSlider
							announcements={announcements}
							onAcknowledge={handleAcknowledge}
						/>
					</ModalBody>
				</ModalContent>
			</Modal>
		)
	);
};

export default AnnouncementsModal;
