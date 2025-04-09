import { leadSelectInputFontSize } from 'views/admin/lead-v2/components/constants';
import { leadlabelFontSize } from 'views/admin/lead-v2/components/constants';

import {
	FormControl,
	FormLabel,
	Select,
	useColorModeValue,
} from '@chakra-ui/react';

// const SelectInput = ({
// 	name,
// 	options = [],
// 	placeholder = 'Select...',
// 	type = 'dynamic',
// 	selectedValue,
// 	onChange,
// }) => {
// 	const customStyles = () => ({
// 		control: (provided, state) => ({
// 			...provided,
// 			backgroundColor: 'white',
// 			borderColor: state.isFocused ? '#D99A36' : '#d1d5db',
// 			borderRadius: '0.375rem',
// 			padding: '0.1rem 0.2rem',
// 			boxShadow: state.isFocused ? '0 0 0 1px #D99A36' : 'none',
// 			transition: 'all 0.3s ease',
// 			'&:hover': {
// 				borderColor: '#D99A36',
// 			},
// 		}),
// 		menu: (provided) => ({
// 			...provided,
// 			borderRadius: '0.375rem',
// 			boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
// 		}),
// 		option: (provided, state) => ({
// 			...provided,
// 			fontSize: '12px',
// 			backgroundColor: state.isSelected
// 				? '#D99A36'
// 				: state.isFocused
// 					? '#D99A36'
// 					: 'white',
// 			color: state.isSelected || state.isFocused ? 'white' : '#333',
// 			padding: '2px 4px',
// 			borderRadius: '0.375rem',
// 			// Override the default brand active state
// 			':active': {
// 				...provided[':active'],
// 				backgroundColor: '#D99A36',
// 			},
// 		}),
// 		singleValue: (provided) => ({
// 			...provided,
// 			color: '#333',
// 		}),
// 	});

// 	return (
// 		<Select
// 			name={name}
// 			options={options}
// 			styles={customStyles?.()}
// 			placeholder={placeholder}
// 			onChange={(selectedOption) => {
// 				const newValue =
// 					type === 'dynamic' ? selectedOption?._id : selectedOption?.value;
// 				onChange?.(newValue ?? null);
// 			}}
// 			getOptionLabel={(option) => option.label}
// 			getOptionValue={(option) =>
// 				type === 'dynamic' ? option._id : option.value
// 			}
// 			value={
// 				options.find(
// 					(option) =>
// 						(type === 'dynamic' ? option._id : option.value) === selectedValue
// 				) || null
// 			}
// 		/>
// 	);
// };

// const sizeMap = {
// 	xs: {
// 		fontSize: '8px',
// 		padding: '1px 2px',
// 		controlMinHeight: '24px',
// 	},
// 	sm: {
// 		fontSize: '12px',
// 		padding: '2px 4px',
// 		controlMinHeight: '32px',
// 	},
// 	md: {
// 		fontSize: '14px',
// 		padding: '6px 8px',
// 		controlMinHeight: '40px',
// 	},
// 	lg: {
// 		fontSize: '16px',
// 		padding: '10px 12px',
// 		controlMinHeight: '48px',
// 	},
// };

// function createCustomStyles(size = 'md', valueColor = 'softGray.200') {
// 	// Grab the correct style set or default to "md"
// 	const { fontSize, padding, controlMinHeight } = sizeMap[size] || sizeMap.md;

// 	return {
// 		control: (provided, state) => ({
// 			...provided,
// 			backgroundColor: 'white',
// 			borderColor: state.isFocused ? '#D99A36' : '#d1d5db',
// 			borderRadius: '0.375rem',
// 			minHeight: controlMinHeight,
// 			boxShadow: state.isFocused ? '0 0 0 1px #D99A36' : 'none',
// 			transition: 'all 0.3s ease',
// 			'&:hover': {
// 				borderColor: '#D99A36',
// 			},
// 			height: '20px',
// 		}),
// 		valueContainer: (provided, state) => ({
// 			...provided,
// 			height: '30px',
// 			padding: '0 6px',
// 		}),
// 		input: (provided, state) => ({
// 			...provided,
// 			margin: '0px',
// 		}),
// 		indicatorSeparator: (state) => ({
// 			display: 'none',
// 		}),
// 		indicatorsContainer: (provided, state) => ({
// 			...provided,
// 			height: '30px',
// 		}),
// 		menu: (provided) => ({
// 			...provided,
// 			borderRadius: '0.375rem',
// 			boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
// 		}),
// 		option: (provided, state) => ({
// 			...provided,
// 			fontSize,
// 			padding,
// 			backgroundColor: state.isSelected
// 				? '#D99A36'
// 				: state.isFocused
// 					? '#D99A36'
// 					: 'white',
// 			color: state.isSelected || state.isFocused ? 'white' : '#333',
// 			borderRadius: '0.375rem',
// 			':active': {
// 				...provided[':active'],
// 				backgroundColor: '#D99A36',
// 			},
// 		}),
// 		singleValue: (provided) => ({
// 			...provided,
// 			fontSize,
// 			color: valueColor,
// 		}),
// 	};
// }

// const SelectInput = ({
// 	name,
// 	options = [],
// 	placeholder = 'Select...',
// 	type = 'dynamic',
// 	selectedValue,
// 	onChange,
// 	size = 'md', // Accept a size prop ("xs", "sm", "md", "lg")
// 	valueColor = 'softGray.200', // Accept a value color prop with default "softGray.200"
// }) => {
// 	return (
// 		<Select
// 			name={name}
// 			options={options}
// 			styles={createCustomStyles(size, valueColor)}
// 			placeholder={placeholder}
// 			onChange={(selectedOption) => {
// 				const newValue =
// 					type === 'dynamic' ? selectedOption?._id : selectedOption?.value;
// 				onChange?.(newValue ?? null);
// 			}}
// 			getOptionLabel={(option) => option.label}
// 			getOptionValue={(option) =>
// 				type === 'dynamic' ? option._id : option.value
// 			}
// 			value={
// 				options.find(
// 					(option) =>
// 						(type === 'dynamic' ? option._id : option.value) === selectedValue
// 				) || null
// 			}
// 		/>
// 	);
// };

const SelectInput = ({
	label,
	name,
	options = [],
	placeholder = 'Select',
	size = 'md', // "xs", "sm", "md", "lg"
	borderColorCustom,
	textColorCustom,
	bgColorCustom,
	dropdownBgCustom,
	selectedValue,
	loading,
	type = 'static',
	...props
}) => {
	// Move all useColorModeValue calls to the top level to avoid conditional hooks
	const defaultBorderColor = useColorModeValue('gray.300', 'gray.600');
	const defaultFocusBorderColor = useColorModeValue('brand.500', 'brand.300');
	const defaultTextColor = useColorModeValue('black', 'white');
	const defaultBgColor = useColorModeValue('white', 'gray.800');
	const defaultDropdownBg = useColorModeValue('white', 'gray.700');
	const dropdownHoverBg = useColorModeValue('gray.100', 'gray.600');

	// Use custom values if provided, otherwise fallback to defaults
	const borderColor = borderColorCustom || defaultBorderColor;
	const focusBorderColor = defaultFocusBorderColor;
	const textColor = textColorCustom || defaultTextColor;
	const bgColor = bgColorCustom || defaultBgColor;
	const dropdownBg = dropdownBgCustom || defaultDropdownBg;

	const disabledBg = useColorModeValue('#EDF2F7', '#2D3748');
	const disabledColor = useColorModeValue('#A0AEC0', '#718096');

	return (
		<FormControl>
			{label && <FormLabel fontSize={leadlabelFontSize}>{label}</FormLabel>}
			<Select
				size={size}
				name={name}
				value={loading ? '' : (selectedValue ?? '')}
				fontSize={leadSelectInputFontSize}
				borderColor={borderColor}
				focusBorderColor={focusBorderColor}
				color={type === 'static' ? textColor : 'softGray.300'}
				bg={type === 'static' ? bgColor : 'softGray.400'}
				_hover={{ borderColor: focusBorderColor }}
				_focus={{ boxShadow: `0 0 0 1px ${focusBorderColor}` }}
				borderRadius='md'
				sx={{
					option: {
						bg: dropdownBg,
						color: 'gray.800',
						_hover: { bg: dropdownHoverBg },
					},
					'option:disabled': {
						backgroundColor: 'gray.800 !important',
						color: 'gray.500 !important',
					},
				}}
				isDisabled={loading || options.length < 1}
				{...props}
			>
				{loading ? (
					<option value='' disabled>
						Updating...
					</option>
				) : (
					<>
						{/* Placeholder option */}
						<option value='' disabled selected={selectedValue === ''}>
							{placeholder}
						</option>

						{/* "Unassigned" option */}
						{['managerAssigned', 'agentAssigned'].includes(name) && (
							<option value=''>
								Unassigned {name === 'managerAssigned' ? 'Manager' : 'Agent'}
							</option>
						)}

						{/* Dynamic options */}
						{options.map((opt) => (
							<option
								key={type === 'dynamic' ? opt._id : opt.value}
								value={type === 'dynamic' ? opt._id : opt.value}
								disabled={opt.isActive === false}
								style={{
									backgroundColor:
										opt?.isActive === false ? disabledBg : undefined,
									color: opt?.isActive === false ? disabledColor : undefined,
								}}
							>
								{type === 'dynamic'
									? `${opt?.firstName} ${opt?.lastName}`
									: opt.label}
							</option>
						))}
					</>
				)}
			</Select>
		</FormControl>
	);
};

export default SelectInput;
