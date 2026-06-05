import { IconButton } from '@chakra-ui/react';
import { FiFilter } from 'react-icons/fi';
import CustomTooltip from 'components/shared/CustomTooltip';

const FilterButton = ({
	label = 'Filter',
	onClick,
	size = 'sm',
	...rest
}) => {
	return (
		<CustomTooltip label={label} hasArrow>
			<IconButton
				icon={<FiFilter />}
				aria-label={label}
				onClick={onClick}
				variant='solid'
				colorScheme='brand'
				size={size}
				borderRadius='full'
				boxShadow='md'
				{...rest}
			/>
		</CustomTooltip>
	);
};

export default FilterButton;