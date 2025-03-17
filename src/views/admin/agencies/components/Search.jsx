import { Box, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React from "react";
import { IoSearchOutline } from "react-icons/io5";

function Search() {
  return (
    <Box mb={{ base: 3, md: 5 }}>
      <InputGroup width={{ base: "100%", md: "215px" }} borderRadius="10px">
        <InputLeftElement pointerEvents="none">
          <IoSearchOutline color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search"
          fontFamily="Poppins"
          fontWeight="400"
          fontSize="12px"
        />
      </InputGroup>
    </Box>
  );
}

export default Search;
