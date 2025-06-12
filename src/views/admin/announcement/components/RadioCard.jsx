import React from 'react';
import { Box, useRadio } from '@chakra-ui/react';

const RadioCard = (props) => {
	const { getInputProps, getCheckboxProps } = useRadio(props);

	const input = getInputProps();
	const checkbox = getCheckboxProps();

	return (
		<Box as='label'>
			<input {...input} />
			<Box
				{...checkbox}
				cursor='pointer'
				borderWidth='1px'
				borderRadius='md'
				boxShadow='md'
				bg='softGray.100'
				_checked={{
					bg: 'brand.500',
					color: 'white',
					borderColor: 'brand.500',
				}}
				_focus={{
					// boxShadow: 'outline',
					outline: 'none',
				}}
				px={{ base: 3, md: 6 }}
				py={2}
				textAlign='center'
			>
				{props.children}
			</Box>
		</Box>
	);
};

export default RadioCard;
