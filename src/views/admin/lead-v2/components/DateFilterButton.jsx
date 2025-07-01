import { IconButton } from '@chakra-ui/react';
import CustomTooltip from 'components/shared/CustomTooltip';
import { MdDateRange } from 'react-icons/md';

const DateFilterButton = ({ onClick }) => {
	return (
		<CustomTooltip label='Date Filtered' hasArrow>
			<IconButton
				icon={<MdDateRange />}
				aria-label='Filter Date'
				colorScheme='brand'
				variant='solid'
				size='sm'
				borderRadius='full'
				boxShadow='md'
				onClick={onClick}
			/>
		</CustomTooltip>
	);
};

export default DateFilterButton;
