import { IconButton } from '@chakra-ui/react';
import { MdRefresh } from 'react-icons/md';

import CustomTooltip from 'components/shared/CustomTooltip';

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
				icon={<MdRefresh size={20} className={spinning} />}
				aria-label={label}
				onClick={onClick}
				isLoading={isFetching}
				isDisabled={isLoading || isFetching}
				size={size}
				{...rest}
			/>
		</CustomTooltip>
	);
};

export default RefreshButton;
