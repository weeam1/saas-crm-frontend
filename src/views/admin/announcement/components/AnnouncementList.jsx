import React from "react";
import { format } from "date-fns";
import { FiCopy } from "react-icons/fi";
import {
	Box,
	Text,
	Flex,
	Badge,
	IconButton,
	Button,
	Stack,
	Spinner,
} from "@chakra-ui/react";

const getBadgeColor = (type) => {
	switch (type) {
		case "all":
			return "blue"; // Neutral color for "all"
		case "agents":
			return "orange"; // Blue for "agents"
		case "team":
			return "green"; // Green for "team"
		case "managers":
			return "purple"; // Purple for "managers"
		default:
			return "gray"; // Default color
	}
};

const AnnouncementList = ({ list, loading, handleCopy, handleViewMore }) => {
	return (
		<Box
			height="420px"
			overflowY="auto"
			border="1px solid"
			borderColor="gray.200"
			borderRadius="md"
			padding={2}
		>
			{loading && list.length === 0 ? ( // Loading spinner when no data has been loaded yet
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					height="full"
				>
					<Spinner color="brand.500" />
				</Box>
			) : list?.length > 0 ? (
				<Box>
					{list.map((item) => (
						<Flex
							key={item.id}
							align="center"
							justify="space-between"
							p={4}
							mb={2}
							bg="gray.50"
							borderRadius="md"
							boxShadow="sm"
							_hover={{ bg: "gray.100" }}
						>
							<Flex
								align="center"
								alignItems="center"
								justify="space-between"
								gap="2"
							>
								{/* Clipboard Copy Icon */}
								<IconButton
									aria-label="Copy message"
									icon={<FiCopy />}
									size="sm"
									colorScheme="teal"
									variant="ghost"
									onClick={() => handleCopy(item.message)}
								/>

								{/* Announcement Type with Dynamic Badge Color */}
								<Badge colorScheme={getBadgeColor(item.type)} mr={4}>
									{item.type}
								</Badge>

								{/* Truncated Message */}
								<Text
									flex="1"
									maxWidth={{ sm: "200px", md: "400px", lg: "600px" }}
									isTruncated
									fontWeight="medium"
									mr={4}
								>
									{item.message}
								</Text>
							</Flex>

							{/* Formatted Date */}
							<Text fontSize="sm" color="gray.500">
								{format(new Date(item.created_at), "PPPpp")}{" "}
								{/* Example: Jan 1, 2025, 12:55 PM */}
							</Text>
						</Flex>
					))}
				</Box>
			) : (
				<Text color="gray.500" textAlign="center" padding="10">
					No Announcements found!
				</Text>
			)}
			{loading && list.length > 0 ? ( // Show loading only if data is already available
				<Box display="flex" justifyContent="center" mt={2} py={2} mb={2}>
					<Spinner color="brand.500" />
				</Box>
			) : (
				<Box display="flex" justifyContent="center" mt={4} py={2} mb={2}>
					{/* View More Button */}
					<Button
						color="brand.500" // Background color
						size="sm"
						onClick={handleViewMore}
						isDisabled={loading}
					>
						View More
					</Button>
				</Box>
			)}
		</Box>
	);
};

export default AnnouncementList;
