import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";

const AnalyticsCard = ({ item }) => {
  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      _hover={{ transform: "scale(1.03)", shadow: "lg" }}
      transition="all 0.2s"
    >
      <Heading size="md" color="goldenrod" mb={2}>
        Extension: {item.extension}
      </Heading>
      <Text fontWeight="bold" color="gray.800">
        Total Calls: Today {item.total_calls.today} | Month {item.total_calls.month}
      </Text>
      <Text color="green.600">
        Answered: Today {item.answered.today} | Month {item.answered.month}
      </Text>
      <Text color="red.500">
        Unanswered: Today {item.unanswered.today} | Month {item.unanswered.month}
      </Text>
      <Text mt={2} fontSize="sm" color="gray.600">
        Duration: Today {item.duration.today_hours}h ({item.duration.today_seconds}s)
      </Text>
      <Text fontSize="sm" color="gray.600">
        Duration: Month {item.duration.month_hours}h ({item.duration.month_seconds}s)
      </Text>
    </Box>
  );
};

export default AnalyticsCard;
