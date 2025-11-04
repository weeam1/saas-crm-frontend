import React, { useRef } from "react";
import { InputGroup, Input, Button, Flex } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const CustomSearchInput = ({
  fetchData,
  setDisplaySearchData,
  searchTerm,
  setSearchTerm,
  pageIndex,
  pageSize,
  width,
}) => {
  const justARef = useRef();

  const handleInputChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    if (!newSearchTerm) {
      setDisplaySearchData(false);
      fetchData({ pageIndex: 0, pageSize, search: "" });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const newSearchTerm = e.target.value.trim();
      if (newSearchTerm) {
        setDisplaySearchData(true);
        fetchData({ pageIndex: 0, pageSize, search: newSearchTerm });
      }
    }
  };

  const handleSearchClick = () => {
    const newSearchTerm = searchTerm.trim();
    if (newSearchTerm) {
      setDisplaySearchData(true);
      fetchData({ pageIndex: 0, pageSize, search: newSearchTerm });
    }
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
    >
      <Input
        type="text"
        fontSize="sm"
        fontWeight="500"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        ref={justARef}
        placeholder="Search by Developer Name..."
        border="none"
        height="2.5rem"
        _focus={{ boxShadow: "none" }}
      />
      <Button
        bg="gray.100"
        borderLeft="1px solid"
        borderColor="gray.200"
        px={4}
        borderRadius="0"
        fontSize="sm"
        display="flex"
        alignItems="center"
        height="2.5rem"
        _hover={{ bg: "gray.50" }}
        _active={{ bg: "gray.100" }}
        onClick={handleSearchClick}
      >
        <Flex align="center">
          Search <SearchIcon fontSize="sm" color="brand.500" ml={1} />
        </Flex>
      </Button>
    </InputGroup>
  );
};

export default CustomSearchInput;
