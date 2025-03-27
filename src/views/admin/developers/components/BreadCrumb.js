import { Flex, Box, Text, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const Breadcrumb = ({ items }) => {
  return (
    <Flex
      alignItems="center"
      fontFamily="DM Sans, sans-serif"
      fontSize={{ base: "sm", md: "md" }}
      fontWeight="medium"
      color="gray.700"
    >
      {items.map((item, index) => (
        <Flex key={item.label} alignItems="center">
          <Box
            bg={index === items.length - 1 ? "#B79045" : "gray.200"}
            px={4}
            py={2}
            position="relative"
            _after={
              index < items.length - 1
                ? {
                    content: '""',
                    position: "absolute",
                    right: "-15px",
                    top: 0,
                    width: "15px",
                    height: "100%",
                    background:
                      index === items.length - 1 ? "#B79045" : "gray.200",
                    clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                    zIndex: 1,
                  }
                : {}
            }
          >
            {item.path ? (
              <Link
                as={RouterLink}
                to={item.path}
                color={index === items.length - 1 ? "white" : "gray.800"}
                fontWeight={index === items.length - 1 ? "bold" : "medium"}
                _hover={{ textDecoration: "underline" }}
              >
                {item.label}
              </Link>
            ) : (
              <Text
                color={index === items.length - 1 ? "white" : "gray.800"}
                fontWeight={index === items.length - 1 ? "bold" : "medium"}
              >
                {item.label}
              </Text>
            )}
          </Box>

          {index < items.length - 1 && (
            <Box
              bg="#B79045"
              position="relative"
              ml="14px"
              _before={{
                content: '""',
                position: "absolute",
                left: "-15px",
                top: 0,
                width: "15px",
                height: "100%",
                background: "white",
                clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                zIndex: 2,
              }}
            />
          )}
        </Flex>
      ))}
    </Flex>
  );
};

export default Breadcrumb;
