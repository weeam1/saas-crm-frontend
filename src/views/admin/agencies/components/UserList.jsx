// components/UserList.jsx
import { Box, Flex, Text, IconButton } from "@chakra-ui/react";
import { CiEdit } from "react-icons/ci";

const UserList = ({ users, onEditClick }) => {
  return (
    <Box
      overflowY="scroll" // Enable vertical scrolling
      maxH={{ base: "200px", md: "300px" }} // Adjust height based on screen size
      w="100%" // Full width for responsiveness
      p={2} // Padding inside the scrollable area
      borderRadius="md"
    >
      {users.map((item, index) => (
        <Flex
          key={index}
          align="center"
          justify="space-between"
          p={2}
          borderRadius="md"
          mb={2} // Margin between items
          bg="white" // Background for each item
          boxShadow={{ base: "none", md: "sm" }} // Subtle shadow on larger screens
          flexDirection={{ base: "column", sm: "row" }} // Stack on small screens, row on larger
          gap={{ base: 2, sm: 0 }} // Gap for stacked layout on small screens
        >
          <Box textAlign={{ base: "center", sm: "left" }}>
            <Text
              fontWeight="400"
              fontSize={{ base: "14px", md: "12px" }}
              fontFamily="Poppins"
            >
              {item.name}
            </Text>
            <Text
              fontWeight="400"
              fontSize={{ base: "12px", md: "12px" }}
              fontFamily="Poppins"
              color="#666666"
            >
              {item.email}
            </Text>
          </Box>
          <IconButton
            aria-label="Edit"
            icon={<CiEdit />}
            size="sm"
            color="white"
            variant="ghost"
            borderRadius="100%"
            bg="#EDC270"
            onClick={() => onEditClick(item.email)}
            mt={{ base: 2, sm: 0 }} // Margin-top on small screens when stacked
          />
        </Flex>
      ))}
    </Box>
  );
};

export default UserList;