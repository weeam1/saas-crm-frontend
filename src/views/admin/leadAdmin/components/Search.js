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
      width={{ base: "100%", lg: "fit-content" }}
      bg="softGray.50"
      borderRadius="md"
      display="flex"
      justifyContent={{ base: "center", md: "center", lg: "end" }}
    >
      <HStack spacing={1} flexDirection={{ base: "column", md: "row" }}>
        {/* Search Input & Button */}
        <InputGroup
          bg="white"
          border="1px solid"
          borderColor="softGray.600"
          borderRadius="md"
          w={{ base: "100%", md: "300px" }}
          overflow="hidden"
        >
          <Input
            placeholder="name.."
            border="none"
            fontSize="xs"
            height="2.2rem"
            _focus={{ boxShadow: "none" }}
          />
          <InputRightElement width="auto">
            <Button
              size="md"
              bg="softGray.700"
              borderLeft="1px solid"
              borderColor="softGray.600"
              px={4}
              borderRadius="0"
              fontSize="xs"
              _hover={{ bg: "gray.50" }}
              _active={{ bg: "gray.100" }}
            >
              Search <SearchIcon fontSize="xs" color="brand.500" ml={1} />
            </Button>
          </InputRightElement>
        </InputGroup>

        <HStack gap="1">
          <Button
            border="1px solid"
            borderColor="softGray.600"
            bg="white"
            borderRadius="md"
            p={4}
            fontSize="xs"
            w="150px"
            minW="max-content"
            height="2.2rem"
            _hover={{ bg: "gray.50" }}
            _active={{ bg: "gray.100" }}
          >
            Advance Search
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
};

export default SearchBox;
