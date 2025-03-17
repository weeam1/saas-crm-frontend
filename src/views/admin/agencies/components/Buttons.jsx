import { Button, Flex } from "@chakra-ui/react";

const Buttons = ({ onCancel, onSave }) => {
  return (
    <Flex
      justify={{ base: "center", md: "flex-end" }}
      mt={{ base: 3, md: 5 }}
      direction={{ base: "column", md: "row" }}
      alignItems={{ base: "center", md: "flex-end" }}
      gap={{ base: 2, md: 3 }}
    >
      <Button
        variant="outline"
        onClick={onCancel}
        w={{ base: "100%", md: "159px" }}
        maxW={{ base: "150px", md: "159px" }}
        bg="#D9D9D9"
        _hover={{ bg: "#D9D9D9" }}
        borderRadius="5px"
        fontFamily="'DM Sans', sans-serif"
        fontSize="16px"
        fontWeight="400"
      >
        Cancel
      </Button>
      <Button
        w={{ base: "100%", md: "159px" }}
        maxW={{ base: "150px", md: "159px" }}
        bg="#EDC270"
        _hover={{ bg: "#EDC270" }}
        onClick={onSave}
        borderRadius="5px"
        fontFamily="'DM Sans', sans-serif"
        fontSize="16px"
        fontWeight="400"
      >
        Save
      </Button>
    </Flex>
  );
};

export default Buttons;
