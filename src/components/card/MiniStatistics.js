import {
  Flex,
  Text,
  Stat,
  StatNumber,
  Box,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
// Custom icons
import React from "react";
import { formattedValue } from "utils/helpers";
import { useModalColors } from "hooks/useModalColors";

export default function MiniStatistics(props) {
  const { startContent, name, value, growth, active, onClick } = props;
  const colors = useModalColors();

  const formatValue = formattedValue(value);

  return (
    <Card
      onClick={onClick}
      cursor="pointer"
      borderRadius="xl"
      bg={colors.bg}
      borderWidth="1px"
      borderColor={colors.borderColor}
      shadow="sm"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-4px)",
        shadow: colors.cardShadow,
        bg: colors.bgInputHover,
        borderColor: colors.accentGold,
      }}
      p={6}
    >
      <Flex direction="column" align="flex-start" justify="center" h="100%">
        <Flex align="center" gap={3}>
          <Box flexShrink={0}>
            {startContent}
          </Box>
          <Text
            fontSize="lg"
            fontWeight="600"
            color={colors.headingText}
            _hover={{ color: colors.accentGold }}
          >
            {name}
          </Text>
        </Flex>

        {value && (
          <Stat mt={4}>
            <StatNumber fontSize="2xl" color={colors.headingText}>
              <CountUpComponent targetNumber={formatValue} />
            </StatNumber>
          </Stat>
        )}

        {growth && (
          <Box mt={2}>
            <Text fontSize="xs" color={colors.accentGold} fontWeight="600">
              {growth} since last month
            </Text>
          </Box>
        )}
      </Flex>
    </Card>
  );
}