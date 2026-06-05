import { IconButton } from '@chakra-ui/react';
import { MdRefresh } from 'react-icons/md';

import CustomTooltip from 'components/shared/CustomTooltip';
import { FiRefreshCw } from 'react-icons/fi';

const RefreshButton = ({
	label = 'Refresh',
	onClick,
	isLoading = false,
	isFetching = false,
	size = 'sm',
	...rest
}) => {
	const spinning = isFetching ? 'animate-spin' : '';

	return (
		<CustomTooltip label={label}>
			<IconButton
				icon={<FiRefreshCw />}
				aria-label={label}
				onClick={onClick}
				isLoading={isFetching}
				isDisabled={isLoading || isFetching}
					variant='solid'
							colorScheme='brand'
							size='sm'
							borderRadius='full'
							boxShadow='md'
				{...rest}
			/>
		</CustomTooltip>
	);
};

export default RefreshButton;
