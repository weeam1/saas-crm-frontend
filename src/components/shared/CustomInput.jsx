import React from 'react';
import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	Textarea,
} from '@chakra-ui/react';
import { Field } from 'formik';

// const CustomInput = ({
// 	label,
// 	name,
// 	isReadOnly,
// 	type = 'input',
// 	isInvalid,
// 	placeholder,
// 	...rest
// }) => (
// 	<FormControl isInvalid={isInvalid}>
// 		<FormLabel fontSize='sm'>{label}</FormLabel>
// 		<Field
// 			as={type === 'textarea' ? Textarea : Input}
// 			name={name}
// 			bg='gray.100'
// 			borderColor='gray.300'
// 			fontSize='sm'
// 			py={1}
// 			isReadOnly={isReadOnly}
// 			placeholder={placeholder}
// 			_focus={{
// 				borderColor: '#D99A36',
// 				boxShadow: '0 0 0 1px #D99A36',
// 			}}
// 			{...rest}
// 		/>
// 		<FormErrorMessage>{isInvalid}</FormErrorMessage>
// 	</FormControl>
// );

// import {
// 	FormControl,
// 	FormLabel,
// 	Input,
// 	Textarea,
// 	FormErrorMessage,
// } from '@chakra-ui/react';
// import { Field } from 'formik';

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
						{label && <FormLabel fontSize='sm'>{label}</FormLabel>}
						<Component
							{...field}
							{...rest}
							value={field.value === undefined ? '' : field.value}
							// Do not pass type prop for textareas.
							type={type !== 'textarea' ? type : undefined}
							bg='gray.100'
							borderColor='gray.300'
							fontSize='sm'
							py={1}
							isReadOnly={isReadOnly}
							placeholder={placeholder}
							onKeyDown={handleKeyDown}
							onInput={handleInput}
							onChange={handleChange}
							_focus={{
								borderColor: !isReadOnly && '#D99A36',
								boxShadow: !isReadOnly && '0 0 0 1px #D99A36',
								outline: 'none',
							}}
						/>
						<FormErrorMessage>{meta.error}</FormErrorMessage>
					</FormControl>
				);
			}}
		</Field>
	);
};

export default CustomInput;
