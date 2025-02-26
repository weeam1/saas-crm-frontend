import { IconButton, Tooltip } from '@chakra-ui/react';
import { FiFilter } from 'react-icons/fi';

const DateFilterButton = ({ onClick }) => {
	return (
		<Tooltip label='Date Filtered' hasArrow>
			<IconButton
				icon={<FiFilter />}
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
