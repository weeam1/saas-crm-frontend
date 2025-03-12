import { Button } from '@chakra-ui/react';
import { styled } from '@chakra-ui/styled-system';

const AbsentButton = styled(Button, {
	baseStyle: {
		bg: 'red.500',
		color: 'white',
		_hover: {
			bg: 'red.600',
		},
		_active: {
			bg: 'red.700',
		},
	},
});

const CheckInButton = styled(Button, {
	baseStyle: {
		bg: 'green.500',
		color: 'white',
		_hover: {
			bg: 'green.600',
		},
		_active: {
			bg: 'green.700',
		},
	},
});

const CheckOutButton = styled(Button, {
	baseStyle: {
		bg: 'blue.500',
		color: 'white',
		_hover: {
			bg: 'blue.600',
		},
		_active: {
			bg: 'blue.700',
		},
	},
});

export { AbsentButton, CheckInButton, CheckOutButton };
