import { BellIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Flex,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverContent,
	PopoverFooter,
	PopoverHeader,
	PopoverTrigger,
	Spinner,
	Text,
} from "@chakra-ui/react";
import React from "react";
import NotificationBox from "./NotificationBox";

const NotificationDropDown = ({
	unreadCount,
	loading,
	notificationList,
	loadMoreNotifications,
	hideLoadMoreBtn,
}) => {
	return (
		<Popover placement="bottom-end" isLazy isOpen>
			<PopoverTrigger>
				{/* Empty Box to align dropdown */}
				<Box></Box>
			</PopoverTrigger>
			<PopoverContent
				w={{ base: "90%", md: "400px" }} // Responsive width
				maxH="500px"
				overflowY="auto" // Allow scrolling
				outline="none"
				shadow="lg"
				rounded="md"
				border="none"
				_focus={{
					outline: "none",
				}}
				sx={{
					// Custom scrollbar
					"&::-webkit-scrollbar": {
						width: "8px",
						opacity: 0, // Hide scrollbar initially
						transition: "opacity 0.3s", // Smooth transition
					},
					"&:hover::-webkit-scrollbar": {
						opacity: 1, // Show scrollbar on hover
					},
					"&::-webkit-scrollbar-thumb": {
						backgroundColor: "gray.200", // Your brand color
						borderRadius: "4px",
					},
					"&::-webkit-scrollbar-track": {
						backgroundColor: "transparent",
					},
				}}
			>
				<PopoverArrow />
				<PopoverHeader
					fontWeight="bold"
					position="sticky" // Change to sticky
					top={0} // Position at the top of the viewport
					zIndex="dropdown" // Ensure it stays above other content
					bg="white"
					color="brand.700"
					boxShadow="sm" // Optional: Add a subtle shadow for depth
					p={2} // Optional: Add padding for better spacing
				>
					Notifications
				</PopoverHeader>
				<PopoverBody>
					{notificationList.length > 0 ? (
						<Flex direction="column" gap="1">
							{notificationList.map((notification, index) => (
								<NotificationBox key={index} notification={notification} />
							))}
						</Flex>
					) : (
						<Text color="gray.800" textAlign="center">
							No notifications
						</Text>
					)}
				</PopoverBody>
				<PopoverFooter display="flex" justifyContent="center">
					{loading ? (
						<Spinner color="brand.400" />
					) : (
						notificationList.length > 0 &&
						!hideLoadMoreBtn && (
							<Button
								size="xs"
								backgroundColor="gray.100"
								color="gray.600"
								onClick={loadMoreNotifications}
								_hover={{
									backgroundColor: "gray.200", // Lighter gray on hover
									color: "gray.800", // Darker text color on hover
									boxShadow: "sm", // Subtle shadow for depth
								}}
								_active={{
									backgroundColor: "gray.300", // Slightly darker gray when clicked
								}}
							>
								Load More
							</Button>
						)
					)}
				</PopoverFooter>
			</PopoverContent>
		</Popover>
	);
};

export default NotificationDropDown;
