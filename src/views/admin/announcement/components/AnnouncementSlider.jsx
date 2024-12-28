import "./Announcement.css"; // Import custom CSS for styling

import React from "react";
import AwesomeSlider from "react-awesome-slider";
import withAutoplay from "react-awesome-slider/dist/autoplay";
import "react-awesome-slider/dist/styles.css";
import style from "./Slider.module.css";

import { Button, Box, Text } from "@chakra-ui/react";

const AutoplaySlider = withAutoplay(AwesomeSlider);

const AnnouncementSlider = ({ announcements, onAcknowledge }) => {
	// Render slider with effects only if announcements.length > 1
	if (announcements.length > 1) {
		return (
			<AutoplaySlider
				play={true}
				cancelOnInteraction={false}
				interval={6000}
				className={`${style.aws_btn} slider-container`}
			>
				{announcements.map((announcement, index) => (
					<div key={index} className="glass-container">
						<Box className="glass-box">
							<Text className="announcement-message">
								{announcement.message}
							</Text>
						</Box>
						<Button
							className="acknowledge-button"
							colorScheme="brand"
							onClick={() => onAcknowledge(index)}
						>
							Acknowledge
						</Button>
					</div>
				))}
			</AutoplaySlider>
		);
	}

	// Render a single static slide without effects if only one announcement
	return (
		<Box className="glass-container">
			<Box className="glass-box">
				<Text className="announcement-message">
					{announcements[0]?.message}
				</Text>
			</Box>
			<Button
				className="acknowledge-button"
				colorScheme="brand"
				onClick={onAcknowledge}
			>
				Acknowledge
			</Button>
		</Box>
	);
};

export default AnnouncementSlider;
