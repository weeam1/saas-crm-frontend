import React from "react";
import {
  Box,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { ReactComponent as ClockIcon } from "../../../../assets/icons/Clock.svg";
import { useBreakpointValue } from "@chakra-ui/react";
import TimeZoneSelect from "./TimeZone";
import OffDaysCheckbox from "./OffDaysCheckbox";
import EditIcon from "./EditIcon";
import CustomTimePicker from "components/customDatePicker/CustomDatePicker";

const OfficeTiming = ({
  isDisabled,
  checkinTime,
  setCheckinTime,
  checkoutTime,
  setCheckoutTime,
  timezone,
  setTimezone,
  offDays,
  setOffDays,
  gracePeriod,
  setGracePeriod,
}) => {
  const fontSize = useBreakpointValue({ base: "14px", md: "17px" });
  const boxHeight = useBreakpointValue({ base: "fit-content", lg: "560px" });

  const handleGracePeriodChange = (e) => {
    let value = parseInt(e.target.value, 10) || 0;
    if (value > 59) value = 59;
    if (value < 0) value = 0;
    setGracePeriod(value);
  };

  console.log("OfficeTiming offDays:", offDays);

  return (
    <Box
      borderRadius="md"
      p={5}
      py={10}
      w={{ base: "100%", lg: "420px" }}
      height={boxHeight}
      bg="white"
      border="1px solid #cacaca"
      opacity={isDisabled ? 0.5 : 1}
      position="relative"
      pointerEvents={isDisabled ? "none" : "auto"}
    >
      <Flex justify="space-between" align="center" mb={4} flexWrap="wrap">
        <Text
          as="h2"
          display="flex"
          alignItems="center"
          gap={2}
          fontFamily="'DM Sans', sans-serif"
          fontWeight="400"
          fontSize={fontSize}
        >
          <ClockIcon color="blue.400" /> Office Timing
        </Text>
        <EditIcon />
      </Flex>

      <Flex mb={4} flexWrap="wrap" gap={4}>
        <Box flex="1" minW="150px">
          <Text
            mb={2}
            fontFamily="'DM Sans', sans-serif"
            fontWeight="400"
            fontSize={fontSize}
          >
            Check-in Time
          </Text>
          <CustomTimePicker
            value={checkinTime || "09:00 AM"}
            onChange={setCheckinTime}
          />
        </Box>

        <Box flex="1" minW="150px">
          <Text
            mb={2}
            fontFamily="'DM Sans', sans-serif"
            fontWeight="400"
            fontSize={fontSize}
          >
            Check-out Time
          </Text>
          <CustomTimePicker
            value={checkoutTime || "06:00 PM"}
            onChange={setCheckoutTime}
          />
        </Box>
      </Flex>

      <Box mb={4}>
        <FormControl>
          <FormLabel
            mb={2}
            fontFamily="'DM Sans', sans-serif"
            fontWeight="400"
            fontSize={fontSize}
          >
            Grace Period (minutes)
          </FormLabel>
          <Input
            type="number"
            value={gracePeriod}
            onChange={handleGracePeriodChange}
            min="0"
            max="59"
            isDisabled={isDisabled}
            borderRadius="5px"
            size="sm"
            w="100%"
            maxW="150px"
            fontFamily="'DM Sans', sans-serif"
            textAlign="center"
          />
        </FormControl>
      </Box>

      <Box mb={4}>
        <TimeZoneSelect
          isDisabled={isDisabled}
          timezone={timezone}
          setTimezone={setTimezone}
        />
      </Box>

      <OffDaysCheckbox
        isDisabled={isDisabled}
        offDays={offDays}
        setOffDays={setOffDays}
      />
    </Box>
  );
};

export default OfficeTiming;
