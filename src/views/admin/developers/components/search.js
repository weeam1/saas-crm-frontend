import React, { useRef } from "react";
import {
  InputGroup,
  Input,
  InputLeftElement,
  Select,
  Flex,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const CustomSearchInput = ({
  searchbox,
  setSearchbox,
  fetchSearch,
  isLoading = false,
}) => {
  const inputRef = useRef(null);
  const [searchField, setSearchField] = React.useState("developer_name");

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const searchTerm = e.target.value.trim();
      fetchSearch(searchTerm, searchField);
    }
  };

  const handleChange = (e) => {
    setSearchbox(e.target.value);
  };

  return (
    <Flex
      width={{ sm: "100%", md: "60%" }}
      mx={{ sm: 0, md: 3 }}
      my={{ sm: "8px", md: "0" }}
      alignItems="center"
      gap={2}
    >
      <Select
        size="sm"
        width="90px"
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        borderRadius="8px"
        bg="white"
        _focus={{ borderColor: "blue.500" }}
      >
        <option value="developer_name">Name</option>
        <option value="email">Email</option>
        <option value="trn">TRN</option>
      </Select>
      <InputGroup flex={1}>
        <InputLeftElement
          display="flex"
          justifyContent="center"
          alignItems="center"
          size="sm"
          pointerEvents="none"
          height="full" // Ensure it matches the Input height
          width="32px" // Match the pl of Input for consistency
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
          placeholder={`Search...`}
          borderRadius="8px"
          isDisabled={isLoading}
          pl="32px" // Matches InputLeftElement width
          _focus={{ borderColor: "blue.500" }}
          bg="white"
        />
      </InputGroup>
    </Flex>
  );
};

export default CustomSearchInput;
