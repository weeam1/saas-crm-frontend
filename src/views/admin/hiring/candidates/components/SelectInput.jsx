import React from 'react';
import Select from 'react-select';
import { useField } from 'formik';

const SelectInput = ({
	name,
	options,
	placeholder = 'Select an option',
	error,
}) => {
	const [field, meta, helpers] = useField(name); // Use Formik's useField hook

	const customStyles = (error) => ({
		control: (provided, state) => ({
			...provided,
			backgroundColor: 'white',
			borderColor: error ? 'red' : state.isFocused ? '#D99A36' : '#d1d5db', // Error border if there's an error
			borderRadius: '0.375rem', // Rounded corners (rounded-md in Tailwind)
			padding: '0.1rem 0.2rem',
			boxShadow: error
				? '0 0 0 1px red'
				: state.isFocused
					? '0 0 0 1px #D99A36'
					: 'none', // Red shadow if error
			'&:hover': {
				borderColor: error ? 'red' : '#D99A36', // Red border on hover if error
			},
			transition: 'all 0.3s ease',
		}),
		menu: (provided) => ({
			...provided,
			borderRadius: '0.375rem',
			boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
		}),
		option: (provided, state) => ({
			...provided,
			backgroundColor: state.isSelected
				? '#D99A36'
				: state.isFocused
					? '#f3f4f6'
					: 'white',
			color: state.isSelected ? 'white' : '#333',
			padding: '4px 8px',
			borderRadius: '0.375rem',
		}),
		singleValue: (provided) => ({
			...provided,
			color: '#333',
		}),
	});

	return (
		<div className='flex-1'>
			<Select
				options={options}
				styles={customStyles(meta.touched && meta.error)}
				placeholder={placeholder}
				classNamePrefix='react-select'
				className={
					meta.touched && meta.error ? 'border-red-500' : 'border-gray-200'
				}
				value={options.find((option) => option.value === field.value) || null} // Match current form value
				onChange={(selectedOption) => helpers.setValue(selectedOption?.value)} // Update Formik's value
				onBlur={() => helpers.setTouched(true)} // Set touched state on blur
			/>
			{/* Show error if exists */}
			{meta.touched && meta.error && (
				<p className='text-sm text-red-500 mt-1'>{meta.error}</p>
			)}
		</div>
	);
};

export default SelectInput;
