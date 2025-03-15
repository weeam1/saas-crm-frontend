import { Box, Text, Select } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useBreakpointValue } from "@chakra-ui/react";

const TimeZoneSelect = ({ isDisabled, timeZone, setTimeZone }) => {
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
    <Box mb={4}>
      <Text mb={2} fontSize={fontSize}>
        Time zone
      </Text>
      <Select
        value={timeZone}
        onChange={(e) => setTimeZone(e.target.value)}
        size="sm"
        isDisabled={isDisabled || loading}
        placeholder={loading ? "Loading time zones..." : "Select a time zone"}
      >
        {timeZones.map((tz) => (
          <option key={tz} value={tz}>
            {tz}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default TimeZoneSelect;