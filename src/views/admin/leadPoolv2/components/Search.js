import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  HStack,
  Box,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { BiX } from "react-icons/bi";

const SearchBox = () => {
  return (
    <Box
      width={{ base: "100%", md: "auto" }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      h={{ base: "auto", md: "40px" }}
      bg="softGray.50"
      p={{ base: 2, md: 3 }}
      borderRadius="md"
      boxShadow="sm"
    >
      <HStack
        spacing={{ base: 2, md: 3 }}
        flexDirection={{ base: "column", sm: "row" }}
        gap={{ base: 2, md: 3 }}
        width="100%"
      >
        <InputGroup
          bg="white"
          border="1px solid"
          borderColor="softGray.600"
          borderRadius="md"
          width={{ base: "100%", sm: "20rem", md: "24rem", lg: "28rem" }}
          overflow="hidden"
        >
          <Input
            placeholder="Search by name..."
            border="none"
            fontSize={{ base: "sm", md: "xs" }}
            height={{ base: "2.5rem", md: "2.2rem" }}
            _focus={{ boxShadow: "none" }}
            _placeholder={{ color: "softGray.600" }}
            width="100%"
          />
          <InputRightElement width="auto" height="100%">
            <Button
              size="sm"
              bg="#F7FAFC"
              borderLeft="1px solid"
              borderColor="softGray.600"
              px={{ base: 3, md: 4 }}
              borderRadius="0 md 0 md"
              fontSize={{ base: "sm", md: "xs" }}
              _hover={{ bg: "gray.50" }}
              _active={{ bg: "gray.100" }}
            >
              Search <SearchIcon ml={1} boxSize={3} color="brand.500" />
            </Button>
          </InputRightElement>
        </InputGroup>
        <Button
          border="1px solid"
          borderColor="softGray.600"
          bg="white"
          borderRadius="md"
          px={{ base: 3, md: 6 }}
          fontSize={{ base: "sm", md: "xs" }}
          height={{ base: "2.5rem", md: "2.2rem" }}
          _hover={{ bg: "gray.50" }}
          _active={{ bg: "gray.100" }}
        >
          Advanced Search
        </Button>
      </HStack>
    </Box>
  );
};

export default SearchBox;
