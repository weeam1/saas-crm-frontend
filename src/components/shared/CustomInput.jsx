import React from 'react';
import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	Textarea,
} from '@chakra-ui/react';
import { Field } from 'formik';
import { useModalColors } from 'hooks/useModalColors';

const CustomInput = ({
	label,
	name,
	isReadOnly,
	type = 'input',
	placeholder,
	onChange: onChangeProp,
	onKeyDown: onKeyDownProp,
	onInput: onInputProp,
	...rest
}) => {
	const colors = useModalColors();
	// Determine which component to render based on type.
	const Component = type === 'textarea' ? Textarea : Input;

	return (
		<Field name={name}>
			{({ field, meta }) => {
				// Merge default number-specific behavior with any passed handlers.
				const handleKeyDown = (e) => {
					if (type === 'number' && ['e', 'E', '+', '-'].includes(e.key)) {
						e.preventDefault();
					}
					if (onKeyDownProp) onKeyDownProp(e);
				};

				const handleInput = (e) => {
					if (type === 'number') {
						e.target.value = e.target.value.replace(/[^0-9]/g, '');
					}
					if (onInputProp) onInputProp(e);
				};

				const handleChange = (e) => {
					field.onChange(e);
					if (onChangeProp) onChangeProp(e);
				};

				return (
					<FormControl isInvalid={meta.touched && !!meta.error}>
						{label && <FormLabel fontSize='sm' color={colors.labelColor}>{label}</FormLabel>}
						<Component
							{...field}
							{...rest}
							value={field.value === undefined ? '' : field.value}
							// Do not pass type prop for textareas.
							type={type !== 'textarea' ? type : undefined}
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							fontSize='sm'
							py={1}
							isReadOnly={isReadOnly}
							placeholder={placeholder}
							onKeyDown={handleKeyDown}
							// onInput={handleInput}
							onChange={handleChange}
							_hover={{
								borderColor: !isReadOnly && colors.accentGold,
							}}
							_focus={{
								borderColor: !isReadOnly && colors.accentGold,
								boxShadow: !isReadOnly && `0 0 0 1px ${colors.accentGold}`,
								outline: 'none',
							}}
							_placeholder={{
								color: colors.mutedText,
							}}
						/>
						<FormErrorMessage color={colors.badgeErrorText}>{meta.error}</FormErrorMessage>
					</FormControl>
				);
			}}
		</Field>
	);
};

export default CustomInput;