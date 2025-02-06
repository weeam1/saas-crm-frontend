import React from 'react';
import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	Box,
} from '@chakra-ui/react';
import { Field } from 'formik';

const CustomInput = ({
	label,
	name,
	isReadOnly,
	isInvalid,
	placeholder,
	...rest
}) => (
	<FormControl isInvalid={isInvalid}>
		<FormLabel fontSize='sm'>{label}</FormLabel>
		{!isReadOnly ? (
			<Field
				as={Input}
				name={name}
				bg='gray.100'
				borderColor='gray.300'
				fontSize='sm'
				py={1}
				isReadOnly={isReadOnly}
				placeholder={placeholder}
				_focus={{
					borderColor: '#D99A36',
					boxShadow: '0 0 0 1px #D99A36',
				}}
				{...rest}
			/>
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

export default CustomInput;
