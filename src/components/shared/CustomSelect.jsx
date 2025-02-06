import React from 'react';
import {
	FormControl,
	FormLabel,
	Select,
	FormErrorMessage,
	Box,
} from '@chakra-ui/react';
import { Field } from 'formik';

const CustomSelect = ({
	label,
	name,
	options,
	isReadOnly,
	isInvalid,
	placeholder,
	...rest
}) => (
	<FormControl isInvalid={isInvalid}>
		<FormLabel fontSize='sm'>{label}</FormLabel>
		{!isReadOnly ? (
			<Field
				as={Select}
				name={name}
				bg='gray.100'
				borderColor='gray.300'
				fontSize='sm'
				py={1}
				_focus={{
					borderColor: '#D99A36',
					boxShadow: '0 0 0 1px #D99A36',
				}}
				{...rest}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</Field>
		) : (
			<Box
				border='none'
				outline='none'
				bg='#F2F2F2'
				p='3'
				fontSize='sm'
				rounded='md'
				shadow='sm'
			>
				{placeholder}
			</Box>
		)}
		<FormErrorMessage>{isInvalid}</FormErrorMessage>
	</FormControl>
);

export default CustomSelect;
