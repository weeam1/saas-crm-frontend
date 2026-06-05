import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './custom-phone.css';
import { Box, FormLabel, useTheme } from '@chakra-ui/react';

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
	const theme = useTheme();

	// Theme colors
	const bgInput = '#24496E'; // navy.500
	const borderDefault = '#1E3D5C'; // navy.600
	const borderFocus = '#D4AF37'; // gold.primary
	const textBody = '#FFFFFF'; // gray.300
	const textMuted = '#808080'; // gray.500
	const errorColor = '#E53E3E'; // red.500
	const goldColor = '#D4AF37'; // gold.primary
	const goldLight = '#F5D67B'; // gold.light

	return (
		<Box className='custom-phone-input'>
			{label && (
				<FormLabel
					htmlFor={name}
					fontSize='sm'
					fontWeight='semibold'
					color='text.body'
					mb='1'
				>
					{label}
				</FormLabel>
			)}

			<style jsx>{`
				.phone-input-field {
					width: 100% !important;
					height: 42px !important;
					background-color: ${bgInput} !important;
					border: 1px solid ${borderDefault} !important;
					border-radius: 8px !important;
					color: ${textBody} !important;
					font-size: 14px !important;
					padding-left: 50px !important;
					transition: all 0.2s ease !important;
				}
				.phone-input-field:focus {
					border-color: ${borderFocus} !important;
					box-shadow: 0 0 0 1px ${borderFocus} !important;
					outline: none !important;
				}
				.phone-input-field:hover {
					border-color: ${borderFocus} !important;
				}
				.phone-input-field::placeholder {
					color: ${textMuted} !important;
				}
				.phone-input-field.input-error {
					border-color: ${errorColor} !important;
				}
				.phone-input-field.input-error:focus {
					border-color: ${errorColor} !important;
					box-shadow: 0 0 0 1px ${errorColor} !important;
				}
				/* Country dropdown styling */
				.react-tel-input .flag-dropdown {
					background-color: ${bgInput} !important;
					border: 1px solid ${borderDefault} !important;
					border-radius: 8px 0 0 8px !important;
					border-right: none !important;
				}
				.react-tel-input .flag-dropdown:hover {
					background-color: ${bgInput} !important;
				}
				.react-tel-input .selected-flag {
					border-radius: 8px 0 0 8px !important;
				}
				/* Dropdown arrow icon - make it gold */
				.react-tel-input .selected-flag .arrow {
					border-top-color: ${goldColor} !important;
					transition: all 0.2s ease !important;
				}
				.react-tel-input .selected-flag .arrow.up {
					border-bottom-color: ${goldColor} !important;
					border-top-color: transparent !important;
				}
				.react-tel-input .flag-dropdown.open .selected-flag .arrow {
					border-bottom-color: ${goldColor} !important;
					border-top-color: transparent !important;
				}
				/* Dropdown arrow on hover */
				.react-tel-input .selected-flag:hover .arrow {
					border-top-color: ${goldLight} !important;
				}
				.react-tel-input .flag-dropdown.open .selected-flag:hover .arrow {
					border-bottom-color: ${goldLight} !important;
				}
				/* Country list styling */
				.react-tel-input .country-list {
					background-color: ${bgInput} !important;
					border: 1px solid ${borderDefault} !important;
					border-radius: 8px !important;
				}
				.react-tel-input .country-list .country {
					color: ${textBody} !important;
				}
				.react-tel-input .country-list .country:hover {
					background-color: #1A3550 !important; /* navy.700 */
				}
				.react-tel-input .country-list .country.highlight {
					background-color: ${borderFocus} !important;
					color: #000000 !important;
				}
				/* Search input in dropdown */
				.react-tel-input .country-list .search {
					background-color: ${bgInput} !important;
					border-bottom: 1px solid ${borderDefault} !important;
				}
				.react-tel-input .country-list .search-box {
					background-color: ${bgInput} !important;
					border: 1px solid ${borderDefault} !important;
					color: ${textBody} !important;
				}
				.react-tel-input .country-list .search-box::placeholder {
					color: ${textMuted} !important;
				}
				.react-tel-input .country-list .search-box:focus {
					border-color: ${borderFocus} !important;
					box-shadow: 0 0 0 1px ${borderFocus} !important;
				}
			`}</style>

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

			{error && touched && (
				<Box color='red.500' fontSize='xs' mt={1}>
					{error}
				</Box>
			)}
		</Box>
	);
};

export default PhoneField;