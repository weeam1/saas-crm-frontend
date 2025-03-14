import { useState, useEffect } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  HStack,
  Box,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import AdvancedSearchModal from "./AdvancedModal";

const SearchBox = ({
  onSearch,
  searchQuery,
  fetchAdvancedSearch,
  setSearchClear,
  setFormValues,
  isFormReset,
  setIsFormReset,
  pageSize,
  setGetTagValues,
  loading,
  clearAdvancedSearch,
  formValues = {},
}) => {
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery || "");

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const toggleAdvanceSearch = () => {
    setIsAdvanceOpen((prev) => !prev);
  };

  const handleSearch = () => {
    onSearch(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (!e.target.value) {
      onSearch("");
    }
  };

  const handleClearSearch = () => {
    setInputValue("");
    onSearch("");
  };

  const isAdvancedSearchActive =
    formValues && Object.keys(formValues).length > 0;
  return (
    <Flex
      display="flex"
      height={{ base: "80px", md: "30px" }}
      justifyContent={{ base: "center", md: "center" }}
      alignItems="center"
      width="100%"
    >
      <Box width={{ base: "100%", md: "fit-content" }} p="2" borderRadius="md">
        <HStack
          spacing={1}
          flexDirection={{ base: "column", md: "row" }}
          justifyContent="center"
        >
          <InputGroup
            bg="white"
            border="1px solid"
            borderColor="softGray.600"
            borderRadius="md"
            w={{ base: "100%", md: "280px", lg: "310px" }}
            pr="0"
            overflow="hidden"
          >
            <Input
              placeholder="Search by lead name..."
              border="none"
              fontSize="xs"
              height="2.5rem"
              _focus={{ boxShadow: "none" }}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              pr="4.5rem"
              fontFamily="'DM Sans', sans-serif"
            />
            <InputRightElement width="auto" height="100%" alignItems="center">
              {inputValue && (
                <CloseIcon
                  fontSize="xs"
                  color="gray.500"
                  cursor="pointer"
                  onClick={handleClearSearch}
                  mr={2}
                />
              )}
              <Button
                size="sm"
                w="80px"
                bg="softGray.700"
                borderLeft="1px solid"
                borderColor="softGray.600"
                px={4}
                borderRadius="0"
                fontSize="xs"
                display="flex"
                alignItems="center"
                height="100%"
                _hover={{ bg: "gray.50" }}
                _active={{ bg: "gray.100" }}
                onClick={handleSearch}
                isDisabled={loading}
                fontFamily="'DM Sans', sans-serif"
              >
                <Flex align="center" display="inline-flex" alignItems="center">
                  Search <SearchIcon fontSize="xs" color="brand.500" ml={1} />
                </Flex>
              </Button>
            </InputRightElement>
          </InputGroup>
          <HStack>
            <Button
              border="1px solid"
              borderColor="softGray.600"
              bg="white"
              borderRadius="md"
              px={4}
              fontSize="xs"
              w="auto"
              minW="max-content"
              height="2.2rem"
              _hover={{ bg: "gray.50" }}
              _active={{ bg: "gray.100" }}
              onClick={toggleAdvanceSearch}
              isDisabled={loading}
              fontFamily="'DM Sans', sans-serif"
            >
              Advance Search
            </Button>
          </HStack>
        </HStack>

        <AdvancedSearchModal
          setAdvaceSearch={setIsAdvanceOpen}
          advaceSearch={isAdvanceOpen}
          isLoading={loading}
          fetchAdvancedSearch={fetchAdvancedSearch}
          setSearchClear={setSearchClear}
          setFormValues={setFormValues}
          isFormReset={isFormReset}
          setIsFormReset={setIsFormReset}
          pageSize={pageSize}
          setGetTagValues={setGetTagValues}
        />
      </Box>
    </Flex>
  );
};

export default SearchBox;
