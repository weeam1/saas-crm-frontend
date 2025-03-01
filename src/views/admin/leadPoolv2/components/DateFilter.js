import { IconButton, Tooltip } from '@chakra-ui/react';
import { CalendarIcon } from "@chakra-ui/icons";

const DateFilterButton = () => {
    return (
        <Tooltip label='Date Time Filtered' hasArrow>
            <IconButton
                icon={<CalendarIcon />}
                aria-label='Filter Date'
                colorScheme='brand'
                variant='solid'
                size='sm'
                borderRadius='full'
                boxShadow='md'
            />
        </Tooltip>
    );
};

export default DateFilterButton;
