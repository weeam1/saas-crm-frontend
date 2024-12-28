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
			console.log("loading");
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
			<Modal isOpen={isOpen} onClose={onClose} size="lg">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader display="flex" alignItems="center">
						<Image src={logo} alt="Logo" boxSize="60px" />
						<Text fontSize="xl" fontWeight="bold" ml={4}>
							Announcement
							<>
								{announcements.length > 1 && (
									<span
										style={{
											color: "#111",
											padding: "0 5px",
											fontWeight: "400",
										}}
									>
										({announcements.length})
									</span>
								)}
							</>
						</Text>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
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
