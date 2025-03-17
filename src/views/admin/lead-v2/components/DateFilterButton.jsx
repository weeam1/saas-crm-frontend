import { IconButton, Tooltip } from '@chakra-ui/react';
import { MdDateRange } from 'react-icons/md';

const DateFilterButton = ({ onClick }) => {
	return (
		<Tooltip label='Date Filtered' hasArrow>
			<IconButton
				icon={<MdDateRange />}
				onClick={onClick}
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
