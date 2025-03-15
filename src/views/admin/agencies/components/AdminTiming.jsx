import { Box, Text, Flex, useBreakpointValue } from "@chakra-ui/react";
import { ReactComponent as ClockIcon } from "../../../../assets/icons/Clock.svg";
import { useState, useEffect } from "react";
import OffDaysCheckbox from "./OffDaysCheckbox";
import TimeZoneSelect from "./TimeZone";
import CustomTimePicker from "components/customDatePicker/CustomDatePicker";

const AdminSetting = ({
  isDisabled,
  inTime,
  setInTime,
  outTime,
  setOutTime,
  timezone,
  setTimezone,
  offDays,
  setOffDays,
}) => {
  const fontSize = useBreakpointValue({ base: "14px", md: "17px" });
  const [timeZones, setTimeZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeZones = async () => {
      try {
        const response = await fetch(
          "https://timeapi.io/api/timezone/availabletimezones"
        );
        const data = await response.json();
        setTimeZones(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching time zones:", error);
        setTimeZones([
          "United Arab Emirates (GMT+4)",
          "India (GMT+5:30)",
          "United States (GMT-5)",
        ]);
        setLoading(false);
      }
    };

    fetchTimeZones();
  }, []);

  return (
    <Box
      borderRadius="lg"
      p={5}
      maxW={{ base: "100%", md: "500px" }}
      bg="white"
      opacity={isDisabled ? 0.5 : 1}
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
          <ClockIcon color="blue.400" /> Admin Timing
        </Text>
      </Flex>
      <Flex justify="space-between" mb={4} flexWrap="wrap" gap={4}>
        <Box flex="1" minW="150px">
          <Text
            mb={2}
            fontFamily="'DM Sans', sans-serif"
            fontWeight="400"
            fontSize={fontSize}
          >
            In timing
          </Text>
          <CustomTimePicker value={inTime || "09:00 AM"} onChange={setInTime} />
        </Box>

        <Box flex="1" minW="150px">
          <Text
            mb={2}
            fontFamily="'DM Sans', sans-serif"
            fontWeight="400"
            fontSize={fontSize}
          >
            Out timing
          </Text>
          <CustomTimePicker
            value={outTime || "05:00 PM"}
            onChange={setOutTime}
          />
        </Box>
      </Flex>

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

export default AdminSetting;
