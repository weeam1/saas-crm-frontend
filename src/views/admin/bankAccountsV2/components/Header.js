import React from "react";
import { Flex, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AddAccountModal from "./AddAccount";
import AccountCount from "./Count";

const Header = ({
  accountCount,
  onAdd,
  isAdding,
  searchComponent,
  onClear,
  searchQuery,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/admin-setting");
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      mb={6}
      bg="white"
      p={4}
      borderRadius="md"
      boxShadow="sm"
      direction={{ base: "column", md: "row" }}
      w="100%"
      gap={4}
    >
      <AccountCount count={accountCount} />

      <Flex
        align="center"
        gap={3}
        w={{ base: "100%", md: "auto" }}
         direction={{ base: "column", md: "row" }}
      >
        {searchComponent}
        {searchQuery && (
          <Button size="sm" variant="brand" onClick={onClear}>
            Clear
          </Button>
        )}
        <AddAccountModal onAdd={onAdd} isAdding={isAdding} />
      </Flex>
    </Flex>
  );
};

export default Header;
