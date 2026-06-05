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
import { useModalColors } from 'hooks/useModalColors';

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
	const colors = useModalColors();
	const hasError = formik.touched[name] && formik.errors[name];

	const renderField = () => {
		const commonProps = {
			id: name,
			name,
			value: formik.values[name] || '',
			onChange: formik.handleChange,
			onBlur: formik.handleBlur,
			isInvalid: hasError,
			bg: colors.bgInput,
			borderColor: colors.borderColor,
			_hover: { borderColor: colors.accentGold },
			_focus: {
				borderColor: colors.accentGold,
				boxShadow: `0 0 0 1px ${colors.accentGold}`,
			},
			color: colors.headingText,
			fontSize: 'sm',
			_placeholder: { color: colors.mutedText },
			...props,
		};

		if (as === 'textarea') {
			return <Textarea rows={rows} {...commonProps} />;
		}

		if (as === 'select') {
			return (
				<Select {...commonProps}>
					{options.map((option) => (
						<option
							key={option.value}
							value={option.value}
							style={{ background: colors.bg, color: colors.headingText }}
						>
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

		return <Input type={type} {...commonProps} />;
	};

	return (
		<FormControl isRequired={isRequired} isInvalid={hasError}>
			<Flex align='center' gap={1} mb={1}>
				<FormLabel fontSize='sm' fontWeight='600' color={colors.labelColor} mb={0}>
					{label}
				</FormLabel>
			</Flex>
			{renderField()}
			{hasError && (
				<FormErrorMessage fontSize='xs' color={colors.badgeErrorText}>
					{formik.errors[name]}
				</FormErrorMessage>
			)}
		</FormControl>
	);
};

export default FormField;