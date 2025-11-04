import React, { useRef } from "react";
import {
  InputGroup,
  Input,
  Button,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

const CustomSearchInput = ({
  allData = [],
  setSearchbox,
  fetchSearch,
  isPaginated = false,
  setDisplaySearchData,
  searchbox,
  dataColumn = [],
  onSearch,
  isLoading = false,
}) => {
  const inputRef = useRef(null);

  // Handle typing
  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchbox(searchTerm);

    if (!isPaginated) {
      const results = allData.filter((item) =>
        dataColumn.some((column) => {
          const columnValue = item[column.accessor];
          if (typeof columnValue === "string") {
            return columnValue.toLowerCase().includes(searchTerm.toLowerCase());
          } else if (typeof columnValue === "number") {
            return columnValue.toString().includes(searchTerm);
          }
          return false;
        })
      );

      setDisplaySearchData(searchTerm !== "");
      onSearch(results);
    }
  };

  // Handle Enter key
  const handleKeyUp = async (e) => {
    if (e.key === "Enter" && isPaginated) {
      fetchSearch();
    }
  };

  // Handle Search button click
  const handleSearchClick = () => {
    if (isPaginated) {
      fetchSearch();
    } else {
      const results = allData.filter((item) =>
        dataColumn.some((column) => {
          const columnValue = item[column.accessor];
          if (typeof columnValue === "string") {
            return columnValue
              .toLowerCase()
              .includes(searchbox.toLowerCase());
          } else if (typeof columnValue === "number") {
            return columnValue.toString().includes(searchbox);
          }
          return false;
        })
      );
      onSearch(results);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchbox("");
    setDisplaySearchData(false);
    onSearch(allData);
    inputRef.current?.focus();
  };

  return (
    <InputGroup
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      width={{ base: "100%", md: "18rem" }}
      overflow="hidden"
      size="sm"
      position="relative"
    >
      {/* Input field */}
      <Input
        ref={inputRef}
        placeholder="Search..."
        border="none"
        fontSize="sm"
        height="2.5rem"
        value={searchbox}
        onChange={handleInputChange}
        onKeyUp={handleKeyUp}
        isDisabled={isLoading}
        _focus={{ boxShadow: "none" }}
      />

      {/* Clear icon */}
      {searchbox && (
        <IconButton
          aria-label="Clear search"
          icon={<CloseIcon boxSize={2.5} />}
          onClick={clearSearch}
          position="absolute"
          right="5.5rem"
          top="50%"
          transform="translateY(-50%)"
          bg="transparent"
          _hover={{ bg: "transparent" }}
          size="xs"
        />
      )}

      {/* Search button */}
      <Button
        bg="gray.100"
        borderLeft="1px solid"
        borderColor="gray.200"
        px={5}
        borderRadius="0"
        fontSize="sm"
        display="flex"
        alignItems="center"
        _hover={{ bg: "gray.50" }}
        _active={{ bg: "gray.100" }}
        onClick={handleSearchClick}
        isLoading={isLoading}
        height="100%"
      >
        <Flex align="center" h="2.5rem">
          Search <SearchIcon fontSize="sm" color="brand.500" ml={1} />
        </Flex>
      </Button>
    </InputGroup>
  );
};

export default CustomSearchInput;
