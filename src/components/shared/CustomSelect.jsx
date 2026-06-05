import React from 'react';
import {
	FormControl,
	FormLabel,
	Select,
	FormErrorMessage,
	Box,
	Input,
} from '@chakra-ui/react';
import { Field } from 'formik';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useModalColors } from 'hooks/useModalColors';

const CustomSelect = ({
	label,
	name,
	options,
	isReadOnly,
	isInvalid,
	placeholder,
	...rest
}) => {
	const colors = useModalColors();

	return (
		<FormControl isInvalid={isInvalid}>
			<FormLabel fontSize='sm' color={colors.labelColor}>{label}</FormLabel>
			{!isReadOnly ? (
				<Field name={name}>
					{({ field, meta }) => (
						<Select
							{...field}
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							fontSize='sm'
							borderRadius='md'
							_hover={{
								borderColor: colors.accentGold,
							}}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
							}}
							icon={<ChevronDownIcon color={colors.mutedText} />}
							// Override the native appearance of select elements
							sx={{
								appearance: 'none',
								WebkitAppearance: 'none',
								MozAppearance: 'none',
							}}
							{...rest}
						>
							{options.map((option, index) => (
								<option
									key={`${option.value}-${index}`}
									value={option.value}
									style={{ background: colors.bg, color: colors.headingText }}
								>
									{option.label}
								</option>
							))}
						</Select>
					)}
				</Field>
			) : (
				<Field
					as={Input}
					bg={colors.bgInput}
					borderColor={colors.borderColor}
					color={colors.headingText}
					fontSize='sm'
					value={placeholder}
					_focus={{ outline: 'none' }}
					isReadOnly={isReadOnly}
					_placeholder={{ color: colors.mutedText }}
				/>
			)}
			<FormErrorMessage color={colors.badgeErrorText}>{isInvalid}</FormErrorMessage>
		</FormControl>
	);
};

export default CustomSelect;