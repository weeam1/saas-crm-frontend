import {
  Flex,
  Text,
  Stat,
  StatNumber,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
// Custom icons
import React from "react";
import { formattedValue } from "utils/helpers";

export default function MiniStatistics(props) {
  const { startContent, name, value, growth, active, onClick } = props;

  const formatValue = formattedValue(value);
  const cardBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");
  const brandColor = useColorModeValue("brand.500", "brand.300");

  return (
    <Card
      onClick={onClick}
      cursor="pointer"
      borderRadius="xl"
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      shadow="sm"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-4px)",
        shadow: "xl",
        bg: hoverBg,
      }}
      p={6}
    >
      <Flex direction="column" align="flex-start" justify="center" h="100%">
        <Flex align="center" gap={3}>
          {startContent}
          <Text
            fontSize="lg"
            fontWeight="600"
            color={textColor}
            _hover={{ color: brandColor }}
          >
            {name}
          </Text>
        </Flex>

        {value && (
          <Stat mt={4}>
            <StatNumber fontSize="2xl" color={textColor}>
              <CountUpComponent targetNumber={formatValue} />
            </StatNumber>
          </Stat>
        )}

        {growth && (
          <Box mt={2}>
            <Text fontSize="xs" color="green.500" fontWeight="600">
              {growth} since last month
            </Text>
          </Box>
        )}
      </Flex>
    </Card>
  );
}
