import React from 'react';

const {
	Text,
	Select,
	FormControl,
	FormLabel,
	Input,
} = require('@chakra-ui/react');

// Reusable Form Components
export const FormInput = ({
	label,
	name,
	register,
	errors = {},
	type = 'text',
	isRequired = false,
	...props
}) => (
	<FormControl w='100%' isInvalid={!!errors?.[name]} isRequired={isRequired}>
		<FormLabel fontSize='sm' fontWeight='semibold' color='gray.200'>
			{label}
		</FormLabel>
		<Input
			type={type}
			{...(register?.(name) || {})}
			focusBorderColor='brand.500'
			errorBorderColor='red.500'
			size='sm'
			borderRadius='md'
			{...props}
		/>
		{errors?.[name] && (
			<Text fontSize='xs' color='red.500' mt={1}>
				{errors[name].message}
			</Text>
		)}
	</FormControl>
);

export const FormSelect = ({
	label,
	name,
	register,
	errors = {},
	options = [],
	isRequired = false,
	...props
}) => (
	<FormControl isInvalid={!!errors?.[name]} isRequired={isRequired}>
		<FormLabel fontSize='sm' fontWeight='semibold' color='gray.200'>
			{label}
		</FormLabel>
		<Select
			w='100%'
			{...(register?.(name) || {})}
			focusBorderColor='brand.500'
			errorBorderColor='red.500'
			size='sm'
			borderRadius='md'
			{...props}
		>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</Select>
		{errors?.[name] && (
			<Text fontSize='xs' color='red.500' mt={1}>
				{errors[name].message}
			</Text>
		)}
	</FormControl>
);
