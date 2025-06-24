import { IconButton, Tooltip } from '@chakra-ui/react';
import { MdDateRange } from 'react-icons/md';

const DateFilterButton = ({ onClick, isForceOpen }) => {
  return (
    <Tooltip
      label="Date Filtered"
      hasArrow
      openDelay={300}
      closeDelay={100}
      isOpen={isForceOpen ? true : undefined} 
    >
      <IconButton
        icon={<MdDateRange />}
        aria-label="Filter Date"
        colorScheme="brand"
        variant="solid"
        size="sm"
        borderRadius="full"
        boxShadow="md"
        onClick={onClick}
      />
    </Tooltip>
  );
};

export default DateFilterButton;
