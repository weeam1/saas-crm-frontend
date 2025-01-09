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
				<Box></Box>
			</PopoverTrigger>
			<PopoverContent
				w={{ base: "90%", md: "400px" }} // Responsive width
				minW="300px" // Consistent minimum width
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
					position="sticky"
					top={0}
					zIndex="dropdown"
					bg="white"
					color="brand.700"
					boxShadow="sm"
					p={2}
				>
					Notifications
				</PopoverHeader>
				<PopoverBody>
					{notificationList.length > 0 ? (
						<Flex direction="column" gap="2">
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
				<PopoverFooter display="flex" justifyContent="center" p={2}>
					{loading ? (
						<Spinner color="brand.400" />
					) : (
						notificationList.length > 0 &&
						!hideLoadMoreBtn && (
							<Button
								size="sm"
								backgroundColor="gray.100"
								color="gray.600"
								onClick={loadMoreNotifications}
								_hover={{
									backgroundColor: "gray.200",
									color: "gray.800",
									boxShadow: "sm",
								}}
								_active={{
									backgroundColor: "gray.300",
								}}
								display={{ base: "block", md: "inline-block" }} // Ensure visibility on small screens
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
