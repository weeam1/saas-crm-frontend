import { Button } from '@chakra-ui/react';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { Link as RouterLink } from 'react-router-dom';

const ButtonLink = ({
	icon = <FaArrowUpRightFromSquare />,
	to,
	label,
	...props
}) => {
	return (
		<Button
			as={RouterLink}
			to={to}
			leftIcon={icon}
			variant='solid'
			colorScheme='teal'
			{...props}
		>
			{label}
		</Button>
	);
};

export default ButtonLink;
