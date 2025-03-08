import React, { useState } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  HStack,
  Box,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import AdvancedSearchModal from "./AdvancedSearchModal";

const SearchBox = ({
  fetchSearchedData,
  fetchAdvancedSearch,
  pageSize,
  setData,
  setTotalPages,
  setTotalLeads,
  setIsLoading,
  setDisplaySearchData,
  onClearSearch,
  isLoading,
  setSearchTerm: setParentSearchTerm, // New prop to update Pagination
  setTags, // New prop to pass tags to Pagination
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchClear, setSearchClear] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [isFormReset, setIsFormReset] = useState(false);
  const [getTagValues, setGetTagValues] = useState([]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchSearchedData(searchTerm, 1, pageSize);
      setSearchClear(true);
      setParentSearchTerm(searchTerm); // Update parent with search term
      setTags([]); // Clear tags for basic search
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setSearchClear(false);
    setGetTagValues([]);
    setFormValues({});
    setDisplaySearchData(false);
    setParentSearchTerm(""); // Clear search term in parent
    setTags([]); // Clear tags in parent
    onClearSearch();
  };

  return (
    <Box
      width={{ base: "100%", lg: "fit-content" }}
      bg="softGray.50"
      p="2"
      borderRadius="md"
    >
      <HStack spacing={3} gap="2" flexDirection={{ base: "column", md: "row" }}>
        <InputGroup
          bg="white"
          border="1px solid"
          borderColor="softGray.600"
          borderRadius="md"
          w="250px"
          overflow="hidden"
        >
          <Input
            placeholder="name.."
            border="none"
            fontSize="xs"
            height="2.2rem"
            _focus={{ boxShadow: "none" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
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
              onClick={handleSearch}
            >
              Search <SearchIcon fontSize="xs" color="brand.500" ml={1} />
            </Button>
          </InputRightElement>
        </InputGroup>

        <HStack gap="2">
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
            onClick={() => setIsModalOpen(true)}
          >
            Advance Search
          </Button>
        </HStack>
      </HStack>

      <AdvancedSearchModal
        setAdvanceSearch={setIsModalOpen}
        advanceSearch={isModalOpen}
        isLoading={isLoading}
        fetchAdvancedSearch={fetchAdvancedSearch}
        setSearchClear={setSearchClear}
        setFormValues={setFormValues}
        isFormReset={isFormReset}
        setIsFormReset={setIsFormReset}
        pageSize={pageSize}
        setGetTagValues={(tags) => {
          setGetTagValues(tags);
          setTags(tags); // Pass tags to parent
          setParentSearchTerm(""); // Clear basic search term for advanced search
        }}
        setDisplaySearchData={setDisplaySearchData}
        onClearSearch={handleClear}
      />
    </Box>
  );
};

export default SearchBox;