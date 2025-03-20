import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React, { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import { useFetchItemsQuery } from "api/apiSlice";
import { useDebounce } from "use-debounce";

function Search({    }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const userId = localStorage.getItem("user");

  const { data, isLoading, error } = useFetchItemsQuery(
    {
      path: debouncedQuery
        ? `/bankAccount/search?search=${debouncedQuery}`
        : `/bankAccount/get`,
    },
    { skip: false }
  );

  // React.useEffect(() => {
  //   if (data) {
  //     onSearchResults(data.data);
  //   }
  // }, [data, onSearchResults]);

  return (
    <InputGroup
      mb={{ base: "5px", md: "0px" }}
      border="1px solid black"
      borderRadius="9999px"
      w={{ base: "200px", md: "300px" }}
      h={{ base: "32px", md: "40px" }}
      bg="white"
      overflow="hidden"
    >
      <InputLeftElement
        pointerEvents="none"
        color="gray.400"
        h="full"
        alignItems="center"
      >
        <SearchIcon />
      </InputLeftElement>
      <Input
        placeholder="Search..."
        fontFamily="DM Sans"
        bg="white"
        border="none"
        _focus={{ boxShadow: "none" }}
        borderRadius="9999px"
        h="full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </InputGroup>
  );
}

export default Search;
