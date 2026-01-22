import React, { useState, useRef } from "react";
import { InputGroup, Input, Button, Flex, IconButton } from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

export const SearchBarV2 = ({
  onSearchTermChange,
  onClear,
  isLoading = false,
  width,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  // Handle typing
  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term.trim()) onSearchTermChange(""); // Reset parent when cleared
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearchTermChange(searchTerm.trim()); // ✅ Use state, not e.target.value
    }
  };

  // Handle Search button click
  const handleSearchClick = () => {
    onSearchTermChange(searchTerm.trim());
  };

  // Clear search
  const handleClear = () => {
    setSearchTerm("");
    onSearchTermChange("");
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <InputGroup
      width={"100%"}
      position="relative"
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      overflow="hidden"
      size="sm"
    >
      <Input
        ref={inputRef}
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        isDisabled={isLoading}
        border="none"
        fontSize="sm"
        height="2.5rem"
        _focus={{ boxShadow: "none" }}
      />

      {searchTerm && (
        <IconButton
          aria-label="Clear search"
          icon={<CloseIcon boxSize={2.5} />}
          onClick={handleClear}
          position="absolute"
          right="7rem"
          top="50%"
          transform="translateY(-50%)"
          bg="transparent"
          _hover={{ bg: "transparent" }}
          size="xs"
        />
      )}

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
