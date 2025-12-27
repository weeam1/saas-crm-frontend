import {
	FormControl,
	FormLabel,
	Input,
	Select,
	Textarea,
	NumberInput,
	NumberInputField,
	InputGroup,
	InputLeftElement,
	FormErrorMessage,
	Flex,
} from '@chakra-ui/react';

const FormField = ({
	label,
	name,
	type = 'text',
	icon,
	formik,
	isRequired = false,
	as = 'input',
	options = [],
	rows = 3,
	...props
}) => {
	const hasError = formik.touched[name] && formik.errors[name];

	const renderField = () => {
		const commonProps = {
			id: name,
			name,
			value: formik.values[name] || '',
			onChange: formik.handleChange,
			onBlur: formik.handleBlur,
			isInvalid: hasError,
			bg: 'white',
			borderColor: 'gray.300',
			_hover: { borderColor: 'gray.400' },
			_focus: {
				borderColor: '#B79045',
				boxShadow: '0 0 0 1px #B79045',
			},
			fontSize: 'sm',
			...props,
		};

		if (as === 'textarea') {
			return <Textarea rows={rows} {...commonProps} />;
		}

		if (as === 'select') {
			return (
				<Select {...commonProps}>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</Select>
			);
		}

		if (type === 'number') {
			return (
				<NumberInput
					value={formik.values[name]}
					onChange={(value) => formik.setFieldValue(name, value)}
					onBlur={formik.handleBlur}
					min={0}
					{...props}
				>
					<NumberInputField {...commonProps} />
				</NumberInput>
			);
		}

		// if (icon) {
		// 	return (
		// 		<InputGroup>
		// 			<InputLeftElement pointerEvents='none' color='gray.400'>
		// 				{icon}
		// 			</InputLeftElement>
		// 			<Input type={type} pl={10} {...commonProps} />
		// 		</InputGroup>
		// 	);
		// }

		return <Input type={type} {...commonProps} />;
	};

	return (
		<FormControl isRequired={isRequired} isInvalid={hasError}>
			<Flex align='center' gap={1} mb={1}>
				<FormLabel fontSize='sm' fontWeight='600' color='gray.600' mb={0}>
					{label}
				</FormLabel>
			</Flex>
			{renderField()}
			{hasError && (
				<FormErrorMessage fontSize='xs'>{formik.errors[name]}</FormErrorMessage>
			)}
		</FormControl>
	);
};

export default FormField;
