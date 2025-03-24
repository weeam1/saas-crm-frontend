import { Box, Flex, Text, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const Breadcrumb = () => {
  return (
    <Flex
      alignItems="center"
      fontFamily="DM Sans, sans-serif"
      fontSize={{ base: "sm", md: "md" }}
      mb={4}
    >
      <Box
        bg="gray.200"
        px={4}
        py={2}
        position="relative"
        _after={{
          content: '""',
          position: "absolute",
          right: "-15px",
          top: 0,
          width: "15px",
          height: "100%",
          background: "gray.200",
          clipPath: "polygon(0 0, 100% 50%, 0 100%)",
          zIndex: 1,
        }}
      >
        <Link
          as={RouterLink}
          to="/"
          color="black"
          fontWeight="medium"
          _hover={{ textDecoration: "underline" }}
        >
          Home
        </Link>
      </Box>

      <Box
        bg="#B79045"
        px={4}
        py={2}
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
        _after={{
          content: '""',
          position: "absolute",
          right: "-15px",
          top: 0,
          width: "15px",
          height: "100%",
          background: "#B79045",
          clipPath: "polygon(0 0, 100% 50%, 0 100%)",
          zIndex: 1,
        }}
      >
        <Text color="white" fontWeight="bold">
          Invoices
        </Text>
      </Box>
    </Flex>
  );
};

export default Breadcrumb;
