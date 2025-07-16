import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './custom-phone.css';
import { Box, FormLabel } from '@chakra-ui/react';

const PhoneField = ({
	name,
	label = 'Phone Number',
	country = 'ae',
	placeholder = 'Enter phone number',
	value,
	error,
	onChange,
	onBlur,
	touched,
	disabled = false,
}) => {
	return (
		<Box className='custom-phone-input'>
			{label && (
				<FormLabel
					htmlFor={name}
					fontSize='sm'
					fontWeight='semibold'
					color='gray.600'
				>
					{label}
				</FormLabel>
			)}

			<PhoneInput
				inputProps={{
					name,
					required: true,
					onBlur,
					disabled,
				}}
				country={country}
				value={value}
				onChange={(val) => {
					const formatted = val.startsWith('+') ? val : `+${val}`;
					onChange(formatted);
				}}
				placeholder={placeholder}
				inputClass={`phone-input-field ${error && touched ? 'input-error' : ''}`}
			/>

			{error && touched && <p className='text-sm text-red-500 mt-1'>{error}</p>}
		</Box>
	);
};

export default PhoneField;
