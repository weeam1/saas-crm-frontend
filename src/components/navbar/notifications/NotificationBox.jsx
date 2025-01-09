import { Box, Text, Icon } from "@chakra-ui/react";
import { FaBell, FaBullhorn } from "react-icons/fa"; // React icon for announcements
import { format } from "date-fns"; // For formatting date and time

const NotificationBox = ({ notification }) => {
	const { type, message, created_at } = notification;
	// Check if the message is an announcement (type 1)
	const isAnnouncement = type === 1;
	// Convert and format the date
	// const formattedDate = format(new Date(created_at), "PPP p"); // Format: Jan 8, 2025 11:49 AM
	const formattedDate = format(new Date(created_at), "MMM d, yyyy h:mm a");
	return (
		<Box
			p={2}
			borderRadius="md"
			bg={
				isAnnouncement ? "rgba(255, 255, 255, 0.8)" : "rgba(240, 240, 240, 0.8)"
			} // Glass effect colors
			_hover={{
				bg: isAnnouncement
					? "rgba(255, 255, 255, 1)"
					: "rgba(230, 230, 230, 1)",
				boxShadow: "md", // Add shadow on hover
			}}
			display="flex"
			alignItems="center"
			gap={3}
			border="none"
			outline="none"
			cursor="pointer"
			transition="background 0.3s ease, box-shadow 0.3s ease" // Smooth transition for hover effects
		>
			{/* Icon */}
			{isAnnouncement ? (
				<Box
					bg="rgba(0, 123, 255, 0.7)" // Glass effect background for announcement icon
					borderRadius="full"
					p={1}
					boxSize={10} // Increase size for better visibility
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<Icon as={FaBullhorn} boxSize={6} color="white" />
				</Box>
			) : (
				<Box
					bg="rgba(40, 167, 69, 0.7)" // Glass effect background for notification icon
					borderRadius="full"
					p={1}
					boxSize={10} // Increase size for better visibility
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<Icon as={FaBell} boxSize={6} color="white" />{" "}
					{/* Use a different icon for notifications */}
				</Box>
			)}

			{/* Message Details */}
			<Box flex="1" width="80%">
				<Text fontSize="sm" color="gray.700" isTruncated>
					{message}
				</Text>
				<Text fontSize="xs" color="gray.800" mt={1}>
					{formattedDate}
				</Text>
			</Box>
		</Box>
	);
};

export default NotificationBox;
