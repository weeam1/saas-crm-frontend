import React from "react";
import { Flex, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AddAccountModal from "./AddAccount";
import AccountCount from "./Count";
import Search from "./Search";

const Header = ({
  accountCount,
  onAdd,
  isAdding,
  onSearchResults,
  onQueryChange,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/admin-setting");
  };

  return (
    <Flex
      justify="space-between"
      align={{ base: "flex-start", md: "center" }}
      mb={6}
      bg="white"
      p={4}
      borderRadius="md"
      boxShadow="sm"
      direction={{ base: "column", md: "row" }}
    >
      <Flex
        align="center"
        gap={3}
        justify={{ base: "flex-start", sm: "space-between", md: "flex-start" }}
        w={{ base: "100%", sm: "100%", md: "auto" }}
      >
        <AccountCount count={accountCount} />
        <Search
          onSearchResults={onSearchResults}
          onQueryChange={onQueryChange}
        />
      </Flex>

      <Flex
        gap={3}
        align="center"
        direction={{ base: "row", md: "row" }}
        justify={{ base: "space-between", md: "flex-end" }}
        w={{ base: "100%", md: "auto" }}
      >
        <AddAccountModal onAdd={onAdd} isAdding={isAdding} />
        <Button
          bg="#B79045"
          color="white"
          fontFamily="DM Sans"
          px={6}
          borderRadius="8px"
          w={{ base: "auto", md: "auto" }}
          onClick={handleBack}
          _hover={{ bg: "#9E7A3B" }}
        >
          Back
        </Button>
      </Flex>
    </Flex>
  );
};

export default Header;
