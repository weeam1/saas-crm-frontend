import { BellIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Flex,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
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
		// <Popover placement="bottom-end" isLazy isOpen>
		// 	<PopoverTrigger>
		// 		<Box></Box>
		// 	</PopoverTrigger>
		// 	<PopoverContent
		// 		w={{ base: "90%", md: "400px" }} // Responsive width
		// 		minW="300px" // Consistent minimum width
		// 		maxH="500px"
		// 		overflowY="auto"
		// 		outline="none"
		// 		shadow="lg"
		// 		rounded="md"
		// 		border="none"
		// 		_focus={{
		// 			outline: "none",
		// 		}}
		// 		sx={{
		// 			// Custom scrollbar
		// 			"&::-webkit-scrollbar": {
		// 				width: "8px",
		// 				opacity: 0, // Hide scrollbar initially
		// 				transition: "opacity 0.3s", // Smooth transition
		// 			},
		// 			"&:hover::-webkit-scrollbar": {
		// 				opacity: 1, // Show scrollbar on hover
		// 			},
		// 			"&::-webkit-scrollbar-thumb": {
		// 				backgroundColor: "gray.200", // Your brand color
		// 				borderRadius: "4px",
		// 			},
		// 			"&::-webkit-scrollbar-track": {
		// 				backgroundColor: "transparent",
		// 			},
		// 		}}
		// 	>
		// 		<PopoverArrow />
		// 		<PopoverHeader
		// 			fontWeight="bold"
		// 			position="sticky"
		// 			top={0}
		// 			zIndex="dropdown"
		// 			bg="white"
		// 			color="brand.700"
		// 			boxShadow="sm"
		// 			p={2}
		// 		>
		// 			Notifications
		// 		</PopoverHeader>
		// 		<PopoverBody>
		// 			{notificationList.length > 0 ? (
		// 				<Flex direction="column" gap="2">
		// 					{notificationList.map((notification, index) => (
		// 						<NotificationBox key={index} notification={notification} />
		// 					))}
		// 				</Flex>
		// 			) : (
		// 				<Text color="gray.800" textAlign="center">
		// 					No notifications
		// 				</Text>
		// 			)}
		// 		</PopoverBody>
		// 		<PopoverFooter display="flex" justifyContent="center" p={2}>
		// 			{loading ? (
		// 				<Spinner color="brand.400" />
		// 			) : (
		// 				notificationList.length > 0 &&
		// 				!hideLoadMoreBtn && (
		// 					<Button
		// 						size="sm"
		// 						backgroundColor="gray.100"
		// 						color="gray.600"
		// 						onClick={loadMoreNotifications}
		// 						_hover={{
		// 							backgroundColor: "gray.200",
		// 							color: "gray.800",
		// 							boxShadow: "sm",
		// 						}}
		// 						_active={{
		// 							backgroundColor: "gray.300",
		// 						}}
		// 						display={{ base: "block", md: "inline-block" }} // Ensure visibility on small screens
		// 					>
		// 						Load More
		// 					</Button>
		// 				)
		// 			)}
		// 		</PopoverFooter>
		// 	</PopoverContent>
		// </Popover>
		<MenuList
			w={{ base: "80%", md: "350px" }}
			minW="250px"
			maxH="450px"
			overflowY="auto"
			sx={{
				"&::-webkit-scrollbar": {
					width: "8px",
					transition: "opacity 0.3s",
				},
				"&:hover::-webkit-scrollbar": {
					opacity: 1,
				},
				"&::-webkit-scrollbar-thumb": {
					backgroundColor: "gray.200",
					borderRadius: "4px",
				},
			}}
		>
			{/* Header */}
			<Box
				fontWeight="bold"
				bg="white"
				color="brand.700"
				p={2}
				borderBottom="1px solid"
				borderColor="gray.200"
			>
				Notifications
			</Box>

			{/* Notification List */}
			<Box p={2}>
				{notificationList.length > 0 ? (
					<Flex direction="column" gap="1">
						{notificationList.map((notification, index) => (
							<MenuItem key={index} p={3} rounded="md">
								<NotificationBox notification={notification} />
							</MenuItem>
						))}
					</Flex>
				) : (
					<Text color="gray.800" textAlign="center">
						No notifications
					</Text>
				)}
			</Box>

			{/* Footer */}
			<Box
				p={2}
				textAlign="center"
				borderTop="1px solid"
				borderColor="gray.200"
			>
				{loading ? (
					<Spinner color="brand.400" />
				) : (
					notificationList.length > 0 &&
					!hideLoadMoreBtn && (
						<Button
							size="sm"
							colorScheme="gray"
							onClick={loadMoreNotifications}
						>
							Load More
						</Button>
					)
				)}
			</Box>
		</MenuList>
	);
};

export default NotificationDropDown;
