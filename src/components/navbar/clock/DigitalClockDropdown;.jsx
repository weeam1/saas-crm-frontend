import { useState, useEffect } from "react";
import moment from "moment-timezone";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Box,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { TimeIcon } from "@chakra-ui/icons";
import ClockContainer from "./ClockContainer";
import { currentTZ } from "utils/helpers";
// import { useFetchItemsQuery } from 'api/apiSlice';

const DigitalClockDropdown = () => {
  const tz = localStorage.getItem("timezone_cache") || currentTZ;

  const [currentTime, setCurrentTime] = useState(moment.tz(tz));
  // const [timezone, setTimezone] = useState(currentTimezone);

  // Format using moment-timezone
  const formattedDate = currentTime.format("DD MMMM YYYY");
  const formattedTime = currentTime.format("hh:mm:ss A");
  const timezoneAbbr = currentTime.tz(tz).format("z");
  const dayName = currentTime.format("dddd"); // Returns full day name (e.g., "Monday")

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "white");
  const accentColor = useColorModeValue("blue.500", "blue.300");

  return (
    <Menu closeOnSelect={false}>
      {/* <MenuButton
				as={Box}
				bg='brand.500'
				boxSize={10}
				borderRadius='full'
				p='2.8'
				cursor='pointer'
				aria-label='Current time dropdown'
				_hover={{ opacity: 0.9 }}
				display='flex'
				alignItems='center'
				justifyContent='center'
			>
				<TimeIcon boxSize={5} color='white' />
			</MenuButton> */}
      <MenuButton
        as={IconButton}
        icon={<TimeIcon />}
        variant="solid"
        rounded="full"
        colorScheme="brand"
        aria-label="Notifications"
      />
      <MenuList
        minWidth="260px"
        p={4}
        bg={bgColor}
        boxShadow="xl"
        border="none"
        borderRadius="lg"
      >
        <MenuItem
          as={Box}
          _hover={{ bg: "transparent" }}
          _focus={{ bg: "transparent" }}
        >
          <ClockContainer
            formattedDate={formattedDate}
            formattedTime={formattedTime}
            textColor={textColor}
            accentColor={accentColor}
            timezone={tz}
            timezoneAbbr={timezoneAbbr}
            // setTimezone={setTimezone}
            dayName={dayName}
          />
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default DigitalClockDropdown;
