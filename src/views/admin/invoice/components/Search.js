import React, { useRef } from "react";
import { InputGroup, Input, InputLeftElement } from "@chakra-ui/react";
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
      const newSearchTerm = e.target.value;
      if (newSearchTerm) {
        setDisplaySearchData(true);
        fetchData({ pageIndex: 0, pageSize, search: newSearchTerm });
      }
    }
  };

  return (
    <InputGroup
      width={width}
      mx={{ base: 0, md: 3 }}
      my={{ base: "8px", md: "0" }}
    >
      <InputLeftElement
        size="sm"
        top="-3px"
        pointerEvents="none"
        zIndex="0"
        children={<SearchIcon color="gray.300" borderRadius="16px" />}
      />
      <Input
        type="text"
        size="sm"
        fontSize="sm"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        fontWeight="500"
        ref={justARef}
        placeholder="Search by Developer Name... (Press Enter to search)"
        borderRadius="16px"
      />
    </InputGroup>
  );
};

export default CustomSearchInput;
