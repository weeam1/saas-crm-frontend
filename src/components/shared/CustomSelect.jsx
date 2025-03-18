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

const CustomSelect = ({
	label,
	name,
	options,
	isReadOnly,
	isInvalid,
	placeholder,
	...rest
}) => (
	// <FormControl isInvalid={isInvalid}>
	// 	<FormLabel fontSize='sm'>{label}</FormLabel>
	// 	{!isReadOnly ? (
	// 		<Field
	// 			as={Select}
	// 			name={name}
	// 			bg='gray.100'
	// 			borderColor='gray.300'
	// 			fontSize='sm'
	// 			py={1}
	// 			_focus={{
	// 				borderColor: '#D99A36',
	// 				boxShadow: '0 0 0 1px #D99A36',
	// 			}}
	// 			{...rest}
	// 		>
	// 			{options.map((option, index) => (
	// 				<option key={`${option.value + index}`} value={option.value}>
	// 					{option.label}
	// 				</option>
	// 			))}
	// 		</Field>
	// 	) : (
	// 		<Field
	// 			as={Input}
	// 			bg='gray.100'
	// 			borderColor='gray.300'
	// 			fontSize='sm'
	// 			py={1}
	// 			value={placeholder}
	// 			_focus={{ outline: 'none' }}
	// 			isReadOnly={isReadOnly}
	// 		/>
	// 	)}
	// 	<FormErrorMessage>{isInvalid}</FormErrorMessage>
	// </FormControl>

	<FormControl isInvalid={isInvalid}>
		<FormLabel fontSize='sm'>{label}</FormLabel>
		{!isReadOnly ? (
			<Field name={name}>
				{({ field, meta }) => (
					<Select
						{...field}
						bg='gray.100'
						borderColor='gray.300'
						fontSize='sm'
						borderRadius='md'
						_focus={{
							borderColor: '#D99A36',
							boxShadow: '0 0 0 1px #D99A36',
						}}
						icon={<ChevronDownIcon color='gray.500' />}
						// Override the native appearance of select elements
						sx={{
							appearance: 'none',
							WebkitAppearance: 'none',
							MozAppearance: 'none',
						}}
						{...rest}
					>
						{options.map((option, index) => (
							<option key={`${option.value}-${index}`} value={option.value}>
								{option.label}
							</option>
						))}
					</Select>
				)}
			</Field>
		) : (
			<Field
				as={Input}
				bg='gray.100'
				borderColor='gray.300'
				fontSize='sm'
				value={placeholder}
				_focus={{ outline: 'none' }}
				isReadOnly={isReadOnly}
			/>
		)}
		<FormErrorMessage>{isInvalid}</FormErrorMessage>
	</FormControl>
);

export default CustomSelect;
