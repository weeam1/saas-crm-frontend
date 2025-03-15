import {
  Box,
  Text,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { RxCountdownTimer } from "react-icons/rx";
import { ReactComponent as ClockIcon } from "../../../../assets/icons/Clock.svg";
import { useBreakpointValue } from "@chakra-ui/react";
import TimeZoneSelect from "./TimeZone";
import OffDaysCheckbox from "./OffDaysCheckbox";
import EditIcon from "./EditIcon";
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

  // Define responsive height: fit-content on base (mobile), 424px on lg and up
  const boxHeight = useBreakpointValue({ base: "fit-content", lg: "424px" });

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

  return (
    <Box
      borderRadius="md"
      p={5}
      py={10}
      w={{ base: "100%", lg: "420px" }}
      height={boxHeight} // Use responsive height
      bg="white"
      border="1px solid #cacaca"
      opacity={isDisabled ? 0.5 : 1}
      position="relative"
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
              fontFamily="'DM Sans', sans-serif"
            >
              {inTime}
            </MenuButton>
            <MenuList
              maxH="200px"
              overflowY="auto"
              fontFamily="'DM Sans', sans-serif"
            >
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
              fontFamily="'DM Sans', sans-serif"
            >
              {outTime}
            </MenuButton>
            <MenuList
              maxH="200px"
              overflowY="auto"
              fontFamily="'DM Sans', sans-serif"
            >
              {timeOptions.map((time) => (
                <MenuItem key={time} onClick={() => setOutTime(time)}>
                  {time}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
      </Flex>

      <TimeZoneSelect
        isDisabled={isDisabled}
        timeZone={timeZone}
        setTimeZone={setTimeZone}
      />

      <OffDaysCheckbox
        isDisabled={isDisabled}
        offDays={offDays}
        setOffDays={setOffDays}
      />
    </Box>
  );
};

export default OfficeTiming;
