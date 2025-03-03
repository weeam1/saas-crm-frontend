import { IconButton, Tooltip } from "@chakra-ui/react";
import { RiCalendar2Line } from "react-icons/ri";

const DateFilterButton = () => {
  return (
    <Tooltip label="Date Time Filtered" hasArrow>
      <IconButton
        icon={<RiCalendar2Line />}
        aria-label="Filter Date"
        colorScheme="brand"
        variant="solid"
        size="md"
        borderRadius="full"
        boxShadow="md"
      />
    </Tooltip>
  );
};

export default DateFilterButton;
