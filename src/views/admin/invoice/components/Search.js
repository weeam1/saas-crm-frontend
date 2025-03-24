import React, { useRef } from "react";
import { InputGroup, Input, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const CustomSearchInput = ({
  allData,
  setSearchbox,
  isPaginated = false,
  setDisplaySearchData,
  searchbox,
  dataColumn,
  onSearch,
}) => {
  const handleInputChange = (e) => {
    if (!isPaginated) {
      const searchTerm = e.target.value;

      // Filter allData based on developer_id.developer_name
      const results = allData.filter((item) => {
        const developerName = item.developer_id?.developer_name || ""; // Fallback to empty string if undefined
        return developerName.toLowerCase().includes(searchTerm.toLowerCase());
      });

      setSearchbox(searchTerm ? searchTerm : "");
      setDisplaySearchData(searchTerm === "" ? false : true);
      onSearch(results);
    }
  };

  const justARef = useRef();

  const extraProps = {};

  if (!isPaginated) {
    extraProps.value = searchbox;
  }

  return (
    <InputGroup
      width={{ sm: "100%", md: "40%" }}
      mx={{ sm: 0, md: 3 }}
      my={{ sm: "8px", md: "0" }}
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
        {...extraProps}
        onChange={handleInputChange}
        fontWeight="500"
        ref={isPaginated ? searchbox : justARef}
        placeholder="Search by Developer Name..."
        borderRadius="16px"
      />
    </InputGroup>
  );
};

export default CustomSearchInput;
