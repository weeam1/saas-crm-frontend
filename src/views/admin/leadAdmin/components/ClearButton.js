import React from "react";
import { Button, Flex } from "@chakra-ui/react";
import { BiX } from "react-icons/bi";

const ClearAdvancedSearchButton = ({ clearAdvancedSearch, loading }) => {
  const handleClear = () => {
    clearAdvancedSearch();
  };

  return (
    <Flex width="100%" justifyContent="flex-end">
      <Button
        border="1px solid"
        mt="4px"
        borderColor="softGray.600"
        bg="white"
        borderRadius="md"
        p={4}
        fontSize="xs"
        w="100px"
        minW="max-content"
        height="2.2rem"
        onClick={handleClear}
        _hover={{ bg: "gray.50" }}
        _active={{ bg: "gray.100" }}
        isDisabled={loading}
        leftIcon={<BiX />}
      >
        Clear
      </Button>
    </Flex>
  );
};

export default ClearAdvancedSearchButton;
