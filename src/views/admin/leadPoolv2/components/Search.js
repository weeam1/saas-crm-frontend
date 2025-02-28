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
        width={{ base: "100%", md: "auto" }} // Full width on small screens, auto on larger
        bg="softGray.50" // Original color preserved
        p={{ base: 2, md: 3 }} // Responsive padding
        borderRadius="md"
        boxShadow="sm" // Subtle shadow for professionalism
      >
        <HStack
          spacing={{ base: 2, md: 3 }} // Responsive spacing
          flexDirection={{ base: "column", sm: "row" }} // Stack on very small screens, row on small+
          gap={{ base: 2, md: 3 }} // Consistent gap
        >
          {/* Search Input & Button */}
          <InputGroup
            bg="white"
            border="1px solid"
            borderColor="softGray.600" // Original color preserved
            borderRadius="md"
            width={{ base: "100%", sm: "16rem", md: "18rem" }} // Responsive width
            overflow="hidden"
          >
            <Input
              placeholder="Search by name..."
              border="none"
              fontSize={{ base: "sm", md: "xs" }} // Responsive font size
              height={{ base: "2.5rem", md: "2.2rem" }} // Taller on mobile
              _focus={{ boxShadow: "none" }} // No shadow on focus
              _placeholder={{ color: "softGray.600" }} // Match border color
            />
            <InputRightElement width="auto" height="100%">
              <Button
                size="sm"
                bg="softGray.700" // Original color preserved
                borderLeft="1px solid"
                borderColor="softGray.600" // Original color preserved
                px={{ base: 3, md: 4 }} // Responsive padding
                borderRadius="0 md 0 md" // Rounded only on right
                fontSize={{ base: "sm", md: "xs" }}
                _hover={{ bg: "gray.50" }} // Original hover preserved
                _active={{ bg: "gray.100" }} // Original active preserved
              >
                Search <SearchIcon ml={1} boxSize={3} color="brand.500" />
              </Button>
            </InputRightElement>
          </InputGroup>
  
          {/* Advance Search Button */}
          <Button
            border="1px solid"
            borderColor="softGray.600" // Original color preserved
            bg="white"
            borderRadius="md"
            px={{ base: 3, md: 4 }} // Responsive padding
            fontSize={{ base: "sm", md: "xs" }}
            height={{ base: "2.5rem", md: "2.2rem" }} // Match input height
            _hover={{ bg: "gray.50" }} // Original hover preserved
            _active={{ bg: "gray.100" }} // Original active preserved
          >
            Advanced Search
          </Button>
        </HStack>
      </Box>
    );
  };
  
  export default SearchBox;