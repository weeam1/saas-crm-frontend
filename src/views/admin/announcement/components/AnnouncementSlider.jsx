import "./Announcement.css"; // Import custom CSS for styling

import AwesomeSlider from "react-awesome-slider";
import withAutoplay from "react-awesome-slider/dist/autoplay";
import "react-awesome-slider/dist/styles.css";
import style from "./Slider.module.css";
import {
	Box,
	Button,
	Text,
	Flex,
	IconButton,
	useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";

const AutoplaySlider = withAutoplay(AwesomeSlider);

// const AnnouncementSlider = ({ announcements, onAcknowledge }) => {
// 	// Render slider with effects only if announcements.length > 1
// 	if (announcements.length > 1) {
// 		return (
// 			<AutoplaySlider
// 				play={true}
// 				cancelOnInteraction={false}
// 				interval={6000}
// 				className={`${style.aws_btn} slider-container`}
// 			>
// 				{announcements.map((announcement, index) => (
// 					<div key={index} className="glass-container">
// 						<Box className="glass-box">
// 							<Text className="announcement-message">
// 								{announcement.message}
// 							</Text>
// 						</Box>
// 						<Button
// 							className="acknowledge-button"
// 							colorScheme="brand"
// 							onClick={() => onAcknowledge(index)}
// 						>
// 							Acknowledge
// 						</Button>
// 					</div>
// 				))}
// 			</AutoplaySlider>
// 		);
// 	}

// 	// Render a single static slide without effects if only one announcement
// 	return (
// 		<Box className="glass-container">
// 			<Box className="glass-box">
// 				<Text className="announcement-message">
// 					{announcements[0]?.message}
// 				</Text>
// 			</Box>
// 			<Button
// 				className="acknowledge-button"
// 				colorScheme="brand"
// 				onClick={onAcknowledge}
// 			>
// 				Acknowledge
// 			</Button>
// 		</Box>
// 	);
// };

const AnnouncementSlider = ({ announcements, onAcknowledge }) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % announcements.length);
	};

	const handlePrev = () => {
		setCurrentIndex((prev) =>
			prev === 0 ? announcements.length - 1 : prev - 1
		);
	};

	return (
		<Box textAlign="center" position="relative">
			{/* Announcement Content */}
			<Box>
				<Text fontSize="md" mb={4}>
					{announcements[currentIndex]?.message}
				</Text>
			</Box>

			{/* Navigation Buttons */}
			{announcements.length > 1 && (
				<Flex justify="space-between" align="center" mt={4}>
					<IconButton
						icon={<ChevronLeftIcon />}
						onClick={handlePrev}
						aria-label="Previous"
						variant="outline"
						colorScheme="brand"
					/>
					<Text fontSize="sm">
						{currentIndex + 1} / {announcements.length}
					</Text>
					<IconButton
						icon={<ChevronRightIcon />}
						onClick={handleNext}
						aria-label="Next"
						variant="outline"
						colorScheme="brand"
					/>
				</Flex>
			)}

			{/* Acknowledge Button */}
			<Button
				mt={4}
				w="auto"
				py="4"
				px="8"
				colorScheme="brand"
				onClick={() => {
					onAcknowledge(currentIndex);
				}}
			>
				Acknowledge
			</Button>
		</Box>
	);
};

export default AnnouncementSlider;
