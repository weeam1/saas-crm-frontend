import React, { useState } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  HStack,
  Box,
<<<<<<< HEAD
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
=======
  Flex,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
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
<<<<<<< HEAD
  setSearchTerm: setParentSearchTerm, // New prop to update Pagination
  setTags, // New prop to pass tags to Pagination
=======
  setSearchTerm: setParentSearchTerm,
  setTags,
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
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
<<<<<<< HEAD
      setParentSearchTerm(searchTerm); // Update parent with search term
      setTags([]); // Clear tags for basic search
=======
      setParentSearchTerm(searchTerm);
      setTags([]);
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
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
<<<<<<< HEAD
    setParentSearchTerm(""); // Clear search term in parent
    setTags([]); // Clear tags in parent
=======
    setParentSearchTerm("");
    setTags([]);
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
    onClearSearch();
  };

  return (
<<<<<<< HEAD
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
=======
    <Flex
      justifyContent={{ base: "center", md: "center" }}
      alignItems="center"
      width="100%"
    >
      <Box
        width={{ base: "100%", md: "fit-content" }}
        bg="softGray.50"
        p="2"
        borderRadius="md"
      >
        <HStack
          spacing={3}
          gap="2"
          flexDirection={{ base: "column", md: "row" }}
          justifyContent="center"
        >
          {/* <InputGroup
            bg="white"
            border="1px solid"
            borderColor="softGray.600"
            borderRadius="md"
            w={{ base: "100%", md: "280px" }}
            pr="30px"
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
              pr="4.5rem"
            />
            <InputRightElement width="auto" height="100%" pr={1}>
              {searchTerm && (
                <CloseIcon
                  fontSize="xs"
                  color="gray.500"
                  cursor="pointer"
                  onClick={handleClear}
                  mr={2}
                />
              )}
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
                isDisabled={isLoading}
              >
                Search
              </Button>
            </InputRightElement>
          </InputGroup> */}
          <InputGroup
            bg="white"
            border="1px solid"
            borderColor="softGray.600"
            borderRadius="md"
            w={{ base: "100%", md: "280px" }}
            pr="0"
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
              pr="4.5rem"
            />
            <InputRightElement width="auto" height="100%">
              {searchTerm && (
                <CloseIcon
                  fontSize="xs"
                  color="gray.500"
                  cursor="pointer"
                  onClick={handleClear}
                  mr={2}
                />
              )}
              <Button
                size="md"
                bg="softGray.700"
                borderLeft="1px solid"
                borderColor="softGray.600"
                px={4}
                borderLeftRadius="0"
                borderRadius="0px"
                fontSize="xs"
                height="100%"
                _hover={{ bg: "gray.50" }}
                _active={{ bg: "gray.100" }}
                onClick={handleSearch}
                isDisabled={isLoading}
              >
                Search
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
              isDisabled={isLoading}
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
            setTags(tags);
            setParentSearchTerm("");
          }}
          setDisplaySearchData={setDisplaySearchData}
          onClearSearch={handleClear}
        />
      </Box>
    </Flex>
  );
};

export default SearchBox;
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
