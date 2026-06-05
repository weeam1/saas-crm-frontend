import React from 'react';
import { Box, useRadio } from '@chakra-ui/react';
import { useModalColors } from 'hooks/useModalColors';

const RadioCard = (props) => {
	const colors = useModalColors();
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
				boxShadow='sm'
				bg={colors.bgInput}
				borderColor={colors.borderColor}
				color={colors.bodyText}
				_checked={{
					bg: colors.accentGold,
					color: colors.headerText,
					borderColor: colors.accentGold,
				}}
				_focus={{
					outline: 'none',
				}}
				_hover={{
					borderColor: colors.accentGold,
				}}
				transition='all 0.2s ease'
				fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}
				px={{ base: 2, md: 4, lg: 6 }}
				py={2}
				textAlign='center'
			>
				{props.children}
			</Box>
		</Box>
	);
};

export default RadioCard;