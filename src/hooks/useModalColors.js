import { useColorModeValue } from '@chakra-ui/react';

export const useModalColors = () => ({
	bg: useColorModeValue('white', 'gray.800'),
	headerBg: useColorModeValue('brand.300', 'brand.100'),
	primaryBtnBg: useColorModeValue('brand.500', 'brand.300'),
	secondaryBtnBg: useColorModeValue('gray.100', 'gray.300'),
	headerText: useColorModeValue('brand.800', 'brand.900'),
	closeBtnColor: useColorModeValue('brand.700', 'brand.900'),
});
