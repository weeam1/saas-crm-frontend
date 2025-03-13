import { Box, Button, Flex, Text, Select, Input } from "@chakra-ui/react";

const RulesSection = ({ rules, setRules }) => {
  const handleRuleChange = (index, field, value) => {
    const updatedRules = [...rules];
    updatedRules[index] = { ...updatedRules[index], [field]: value };
    setRules(updatedRules);
  };

  return (
    <Box p={5} borderRadius="lg" w="437px">
      <Text fontFamily="Poppins" fontWeight="300" fontSize="20px" mb={4}>
        Rules
      </Text>

      <Button
        bg="#EDC270"
        w="156px"
        fontFamily="Poppins"
        fontWeight="300"
        fontSize="20px"
        mb={4}
        borderRadius="8px"
        _hover={{ bg: "#EDC270" }}
      >
        Agent
      </Button>

      <Box borderWidth="1px" borderRadius="lg" bg="white" p={4}>
        {rules.map((rule, index) => (
          <Flex
            key={index}
            align="center"
            gap={2} // Reduced for tighter alignment
            mb={4}
          >
            {/* Rule Name */}
            <Text minW="130px" fontWeight="500" isTruncated>
              {rule.label}
            </Text>

            {/* Action (Plus/Minus) */}
            <Select
              size="sm"
              value={rule.action}
              onChange={(e) =>
                handleRuleChange(index, "action", e.target.value)
              }
              maxW="80px"
              bg="#EEEEEE"
            >
              <option value="Plus">Plus</option>
              <option value="Minus">Minus</option>
            </Select>

            {/* Coins Input */}
            <Box>
              <Text fontSize="12px">Coins</Text>
              <Input
                size="sm"
                value={rule.coins}
                onChange={(e) =>
                  handleRuleChange(index, "coins", Number(e.target.value))
                }
                maxW="60px"
                type="number"
              />
            </Box>

            {/* Per Min Input (only for Late Check In) */}
            <Box
              visibility={rule.label === "Late Check In" ? "visible" : "hidden"}
            >
              <Text fontSize="12px">Per Min</Text>
              <Input
                size="sm"
                value={rule.label === "Late Check In" ? rule.perMin || "" : ""}
                onChange={(e) =>
                  handleRuleChange(index, "perMin", Number(e.target.value))
                }
                maxW="60px"
                type="number"
                isDisabled={rule.label !== "Late Check In"}
              />
            </Box>
          </Flex>
        ))}
      </Box>
    </Box>
  );
};

export default RulesSection;
