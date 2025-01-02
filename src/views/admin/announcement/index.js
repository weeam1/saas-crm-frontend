import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { MdCampaign } from "react-icons/md";
import CreateAnnouncement from "./components/CreateAnnouncement";
import History from "./components/History";

const Announcements = () => {
	const user = JSON.parse(localStorage.getItem("user"));

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
			<CreateAnnouncement user={user} />
			<Box padding="6" my="4" boxShadow="lg" rounded="md">
				<Text fontSize="2xl" color="brand.500" mb="4" fontWeight="bold">
					Announcements History
				</Text>
				<History user={user} />
			</Box>
		</Box>
	);
};

export default Announcements;
