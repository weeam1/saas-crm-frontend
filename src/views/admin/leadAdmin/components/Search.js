import { useState } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  HStack,
  Box,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import AdvancedSearchModal from "./AdvancedModal";
// import ClearAdvancedSearchButton from "./ClearButton";

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
  const isAdvancedSearchActive =
    formValues && Object.keys(formValues).length > 0;

  return (
    <Box
      width={{ base: "100%", lg: "fit-content" }}
      bg="softGray.50"
      borderRadius="md"
      display="flex"
      flexDirection="column"
      alignItems="center"
      position="relative" // Ensure SearchBox is a positioning context
      zIndex="1" // Lower than navbar (assuming navbar has higher z-index, e.g., 1000)
    >
      <HStack spacing={1} flexDirection={{ base: "column", md: "row" }}>
        <InputGroup
          bg="white"
          border="1px solid"
          borderColor="softGray.600"
          borderRadius="md"
          w={{ base: "100%", md: "280px" }} 
          overflow="hidden"
          position="relative"
        >
          <Input
            placeholder="Search by lead name..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            border="none"
            w="100%"
            fontSize="xs"
            height="2.2rem"
            textOverflow="ellipsis"
            _focus={{ boxShadow: "none" }}
          />
          <InputRightElement
            width="auto"
            height="100%"
            display="flex"
            alignItems="center"
            position="absolute"
            right="0"
            top="0"
            zIndex="2"
          >
            <Button
              size="md"
              bg="softGray.700"
              borderLeft="1px solid"
              borderColor="softGray.600"
              px={4}
              borderRadius="0"
              fontSize="xs"
              height="100%"
              _hover={{ bg: "gray.50" }}
              _active={{ bg: "gray.100" }}
              onClick={handleSearch}
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
            onClick={toggleAdvanceSearch}
            _hover={{ bg: "gray.50" }}
            _active={{ bg: "gray.100" }}
            isDisabled={loading}
          >
            Advanced Search
          </Button>
          {/* {isAdvancedSearchActive && (
            <ClearAdvancedSearchButton
              clearAdvancedSearch={clearAdvancedSearch}
              loading={loading}
            />
          )} */}
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
  );
};

export default SearchBox;
