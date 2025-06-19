import React from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  Badge,
  Divider,
} from "@chakra-ui/react";

const UserList = ({ users, activeChat, setActiveChat, isMobile, onClose, sidebarBg }) => {
  return (
    <Box
      overflowY="auto"
      h="calc(100% - 120px)"
      bg={sidebarBg}
      css={{
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#008069",
          borderRadius: "3px",
        },
      }}
    >
      {users.map((user) => (
        <React.Fragment key={user.id}>
          <Flex
            p={3}
            align="center"
            cursor="pointer"
            bg={activeChat === user.id ? "rgba(0, 0, 0, 0.08)" : "transparent"}
            _hover={{ bg: "rgba(0, 0, 0, 0.05)" }}
            onClick={() => {
              setActiveChat(user.id);
              if (isMobile) onClose();
            }}
            transition="background 0.2s ease"
          >
            <Box position="relative">
              <Avatar src={user.avatar} size="md" mr={3} />
              {user.status === "online" && (
                <Box
                  position="absolute"
                  bottom="0"
                  right="3"
                  w="12px"
                  h="12px"
                  bg="green.500"
                  borderRadius="full"
                  border="2px solid"
                  borderColor={sidebarBg}
                />
              )}
            </Box>
            <Box flex="1" overflow="hidden">
              <Flex justify="space-between">
                <Text fontWeight="bold" color="#111B21">
                  {user.name}
                </Text>
                <Text fontSize="xs" color="#667781">
                  {user.time}
                </Text>
              </Flex>
              <Flex justify="space-between" mt={1}>
                <Text
                  fontSize="sm"
                  color="#667781"
                  isTruncated
                  maxW="180px"
                >
                  {user.lastMessage}
                </Text>
                {user.unread > 0 && (
                  <Badge
                    colorScheme="green"
                    borderRadius="full"
                    px={2}
                    bg="#008069"
                    color="white"
                  >
                    {user.unread}
                  </Badge>
                )}
              </Flex>
            </Box>
          </Flex>
          <Divider borderColor="gray.300" />
        </React.Fragment>
      ))}
    </Box>
  );
};

export default UserList;