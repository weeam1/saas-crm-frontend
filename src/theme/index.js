import { extendTheme } from '@chakra-ui/react';
import foundations from './foundations';

const direction = 'ltr';

const config = {
	useSystemColorMode: false,
	initialColorMode: 'dark',
	cssVarPrefix: 'chakra',
};

export const theme = extendTheme({
	direction,
	...foundations,
	config,
});

export default theme;
