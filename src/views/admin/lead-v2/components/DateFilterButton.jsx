import { IconButton, forwardRef } from "@chakra-ui/react";
import CustomTooltip from "components/shared/CustomTooltip";
import { MdDateRange } from "react-icons/md";

const DateFilterButton = forwardRef(({ onClick }, ref) => {
  return (
    <CustomTooltip label="Date Filtered" hasArrow>
      <IconButton
        ref={ref}
        icon={<MdDateRange />}
        aria-label="Filter Date"
        variant="solid"
        colorScheme="brand"
        size="sm"
        borderRadius="full"
        boxShadow="md"
        onClick={onClick}
      />
    </CustomTooltip>
  );
});

export default DateFilterButton;