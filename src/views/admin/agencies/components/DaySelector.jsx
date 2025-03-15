import { Box, Text, Checkbox, CheckboxGroup, Flex } from "@chakra-ui/react";

const DaySelector = ({ label, value, onChange, isDisabled }) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <Box>
      <Text
        mb={2}
        fontFamily="'DM Sans', sans-serif"
        fontWeight="400"
        fontSize="22px"
      >
        {label}
      </Text>
      <CheckboxGroup colorScheme="yellow" value={value} onChange={onChange}>
        <Flex wrap="wrap" gap={2}>
          {days.map((day) => (
            <Checkbox
              key={day.toLowerCase()}
              value={day.toLowerCase()}
              isDisabled={isDisabled}
              fontFamily="'DM Sans', sans-serif"
              fontWeight="400"
              fontSize="12px"
            >
              {day}
            </Checkbox>
          ))}
        </Flex>
      </CheckboxGroup>
    </Box>
  );
};

export default DaySelector;