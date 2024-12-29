import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { MdCampaign } from "react-icons/md";
import CreateAnnouncement from "./components/CreateAnnouncement";

const Announcements = () => {
	return (
		<Box>
			{/* Header Section */}
			<Flex
				align="center"
				bg="brand.500"
				color="white"
				px={5}
				py={10}
				mb={4}
				borderRadius="md"
			>
				<Icon as={MdCampaign} w={10} h={10} mr={2} />
				<Text fontSize="2xl" fontWeight="bold">
					Announcements
				</Text>
			</Flex>

			{/* Content Section */}
			<CreateAnnouncement />
		</Box>
	);
};

export default Announcements;
