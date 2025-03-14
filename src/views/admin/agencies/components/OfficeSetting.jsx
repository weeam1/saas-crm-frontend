import {
  Box,
  Text,
  Select,
  Checkbox,
  CheckboxGroup,
  Flex,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { RxCountdownTimer } from "react-icons/rx";
import { ReactComponent as ClockIcon } from "../../../../assets/icons/Clock.svg";
import { useState, useEffect } from "react";

const OfficeTiming = ({
  isDisabled,
  inTime,
  setInTime,
  outTime,
  setOutTime,
  timeZone,
  setTimeZone,
  offDays,
  setOffDays,
}) => {
  const fontSize = useBreakpointValue({ base: "14px", md: "17px" });
  const [timeZones, setTimeZones] = useState([]);
  const [loading, setLoading] = useState(true);

  const generateTimes = () => {
    const times = [];
    for (let hour = 1; hour <= 12; hour++) {
      ["00", "30"].forEach((minute) => {
        times.push(`${hour}:${minute} am`);
        times.push(`${hour}:${minute} pm`);
      });
    }
    return times;
  };

  const timeOptions = generateTimes();

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
      py={10}
      w={{ base: "100%", lg: "420px" }}
      bg="white"
      opacity={isDisabled ? 0.5 : 1}
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
          <Menu>
            <MenuButton
              borderRadius="5px"
              as={Button}
              size="sm"
              w="100%"
              isDisabled={isDisabled}
              rightIcon={<RxCountdownTimer />}
            >
              {inTime}
            </MenuButton>
            <MenuList maxH="200px" overflowY="auto">
              {timeOptions.map((time) => (
                <MenuItem key={time} onClick={() => setInTime(time)}>
                  {time}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
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
          <Menu>
            <MenuButton
              borderRadius="5px"
              as={Button}
              size="sm"
              w="100%"
              isDisabled={isDisabled}
              rightIcon={<RxCountdownTimer />}
            >
              {outTime}
            </MenuButton>
            <MenuList maxH="200px" overflowY="auto">
              {timeOptions.map((time) => (
                <MenuItem key={time} onClick={() => setOutTime(time)}>
                  {time}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
      </Flex>

      <Box mb={4}>
        <Text mb={2} fontSize={fontSize}>
          Time zone
        </Text>
        <Select
          value={timeZone}
          onChange={(e) => setTimeZone(e.target.value)}
          size="sm"
          isDisabled={isDisabled || loading} // Disable while loading
          placeholder={loading ? "Loading time zones..." : "Select a time zone"}
        >
          {timeZones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </Select>
      </Box>

      <Box>
        <Text mb={2} fontSize={fontSize}>
          Off days
        </Text>
        <CheckboxGroup
          colorScheme="yellow"
          value={offDays}
          onChange={setOffDays}
        >
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
                fontSize={fontSize}
              >
                {day}
              </Checkbox>
            ))}
          </Flex>
        </CheckboxGroup>
      </Box>
    </Box>
  );
};

export default OfficeTiming;
