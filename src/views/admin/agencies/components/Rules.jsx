import { Box, Button, Flex, Text, Select, Input } from "@chakra-ui/react";

const RulesSection = ({ rules, setRules }) => {
  const handleRuleChange = (index, field, value) => {
    const updatedRules = [...rules];
    updatedRules[index] = { ...updatedRules[index], [field]: value };
    setRules(updatedRules);
  };

  return (
    <Box p={5} borderRadius="lg" w={{ base: "100%", md: "460px" }}>
      <Text
        fontFamily="Poppins"
        fontWeight="300"
        fontSize={{ base: "18px", md: "20px" }}
        mb={4}
      >
        Rules
      </Text>

      <Button
        bg="#EDC270"
        w={{ base: "100%", md: "156px" }}
        fontFamily="Poppins"
        fontWeight="300"
        fontSize={{ base: "18px", md: "20px" }}
        mb={4}
        borderRadius="8px"
        _hover={{ bg: "#EDC270" }}
      >
        Agent
      </Button>

      <Box
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        p={4}
        border="1px solid #cacaca"
        h={{ base: "auto", lg: "320px" }}
        pr="5px"
      >
        {rules.map((rule, index) => (
          <Flex
            key={index}
            align={{ base: "flex-start", md: "center" }}
            direction={{ base: "column", md: "row" }}
            gap={{ base: 2, md: 4 }}
            mb={4}
            justify="flex-start"
          >
            <Text
              minW={{ base: "100%", md: "130px" }}
              maxW={{ base: "100%", md: "130px" }}
              fontWeight="500"
              isTruncated
              fontFamily="'DM Sans', sans-serif"
              fontSize="16px"
            >
              {rule.label}
            </Text>
            <Select
              size="sm"
              value={rule.action}
              onChange={(e) =>
                handleRuleChange(index, "action", e.target.value)
              }
              w={{ base: "100%", md: "100px" }}
              minW={{ base: "100%", md: "100px" }}
              maxW={{ base: "100%", md: "100px" }}
              bg="#EEEEEE"
              mt={{ base: 0, md: "18px" }}
              fontFamily="'DM Sans', sans-serif"
              fontSize="16px"
              fontWeight="400"
              borderRadius="5px"
            >
              <option value="Plus">Plus</option>
              <option value="Minus">Minus</option>
            </Select>
            <Box flexShrink={0}>
              <Text
                fontFamily="'DM Sans', sans-serif"
                fontSize="16px"
                fontWeight="400"
              >
                Coins
              </Text>
              <Input
                size="sm"
                value={rule.coins}
                onChange={(e) =>
                  handleRuleChange(index, "coins", Number(e.target.value))
                }
                w={{ base: "100%", md: "60px" }}
                minW={{ base: "100%", md: "60px" }}
                maxW={{ base: "100%", md: "60px" }}
                type="number"
                fontFamily="'DM Sans', sans-serif"
                fontSize="16px"
                fontWeight="400"
                borderRadius="5px"
              />
            </Box>
            <Box
              display={rule.label === "Late Check In" ? "block" : "none"}
              flexShrink={0}
            >
              <Text
                fontFamily="'DM Sans', sans-serif"
                fontSize="16px"
                fontWeight="400"
              >
                Per Min
              </Text>
              <Input
                size="sm"
                value={rule.label === "Late Check In" ? rule.perMin || "" : ""}
                onChange={(e) =>
                  handleRuleChange(index, "perMin", Number(e.target.value))
                }
                w={{ base: "100%", md: "60px" }}
                minW={{ base: "100%", md: "60px" }}
                maxW={{ base: "100%", md: "60px" }}
                type="number"
                isDisabled={rule.label !== "Late Check In"}
                fontFamily="'DM Sans', sans-serif"
                fontSize="16px"
                fontWeight="400"
                borderRadius="5px"
              />
            </Box>
          </Flex>
        ))}
      </Box>
    </Box>
  );
};

export default RulesSection;
