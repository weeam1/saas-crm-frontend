import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import CustomTooltip from 'components/shared/CustomTooltip';

const RefButton = ({
	label,
	to,
	icon = <FaArrowUpRightFromSquare size='16' />,
}) => {
	return (
		<CustomTooltip label={label} placement='top' hasArrow>
			<IconButton
				as={RouterLink}
				to={to}
				icon={icon}
				rounded='full'
				aria-label={label}
			/>
		</CustomTooltip>
	);
};

export default RefButton;
