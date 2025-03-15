import { Box, Text, Checkbox, CheckboxGroup, Flex } from "@chakra-ui/react";

const OffDaysCheckbox = ({ isDisabled, offDays, setOffDays }) => {
  return (
    <Box>
      <Text
        mb={2}
        fontSize="22px"
        fontFamily="'DM Sans', sans-serif"
        fontWeight="400"
      >
        Off days
      </Text>
      <CheckboxGroup value={offDays} onChange={setOffDays}>
        <Flex wrap="wrap" gap={2}>
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <Checkbox
              key={day.toLowerCase()}
              value={day.toLowerCase()}
              isDisabled={isDisabled}
              fontSize="12px"
              fontFamily="'DM Sans', sans-serif"
              fontWeight="400"
              colorScheme="custom"
              sx={{
                ".chakra-checkbox__control": {
                  background: "transparent",
                  borderColor: "gray.300",
                  borderRadius: "3px",
                },
                ".chakra-checkbox__control[data-checked]": {
                  background: "#A07723",
                  borderColor: "#EDC270",
                  "& svg": {
                    display: "none",
                  },
                },
                ".chakra-checkbox__control[data-focus]": {
                  boxShadow: "none",
                  borderColor: "gray.300",
                },
                ".chakra-checkbox__control[data-checked][data-focus]": {
                  boxShadow: "none",
                  borderColor: "#EDC270",
                },
                ".chakra-checkbox__control[data-disabled]": {
                  opacity: 0.4,
                },
              }}
            >
              {day}
            </Checkbox>
          ))}
        </Flex>
      </CheckboxGroup>
    </Box>
  );
};

export default OffDaysCheckbox;
