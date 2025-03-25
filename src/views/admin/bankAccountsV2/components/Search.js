import React, { useRef } from "react";
import { InputGroup, Input, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const CustomSearchInput = ({
  searchbox,
  setSearchbox,
  onSearch,
  isLoading = false,
}) => {
  const inputRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const searchTerm = e.target.value.trim();
      onSearch(searchTerm);
    }
  };

  const handleChange = (e) => {
    setSearchbox(e.target.value);
  };

  return (
    <InputGroup
      width={{ base: "100%", md: "40%" }}
      mx={{ base: 0, md: 3 }}
      my={{ base: "8px", md: "0" }}
    >
      <InputLeftElement
        pointerEvents="none"
        children={<SearchIcon color="gray.300" />}
      />
      <Input
        type="text"
        size="sm"
        fontSize="sm"
        value={searchbox}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        ref={inputRef}
        placeholder="Search by bank name... (Press Enter to search)"
        borderRadius="16px"
        isDisabled={isLoading}
        _focus={{ borderColor: "blue.500" }}
      />
    </InputGroup>
  );
};

export default CustomSearchInput;
