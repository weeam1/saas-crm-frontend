import {
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Checkbox,
	Select,
} from '@chakra-ui/react';
import { Field } from 'formik';

const RenderFields = ({ fields }) => {
	return fields?.map((field) => (
		<Field name={field.name} key={field.name}>
			{({ field: formikField, meta }) => (
				<FormControl mb={4} isInvalid={meta.touched && meta.error}>
					{/* For checkboxes and select, render differently */}
					{field.type !== 'checkbox' && (
						<FormLabel htmlFor={field.name}>{field.label}</FormLabel>
					)}

					{field.type === 'textarea' ? (
						<Textarea
							id={field.name}
							{...formikField}
							bg='gray.100'
							borderColor='gray.300'
							_focus={{
								borderColor: '#D99A36',
								boxShadow: '0 0 0 1px #D99A36',
							}}
							placeholder={field.label}
						/>
					) : field.type === 'checkbox' ? (
						<Checkbox
							bg='gray.100'
							borderColor='gray.300'
							_focus={{
								borderColor: '#D99A36',
								boxShadow: '0 0 0 1px #D99A36',
							}}
							id={field.name}
							{...formikField}
							isChecked={formikField.value}
						>
							{field.label}
						</Checkbox>
					) : field.type === 'select' ? (
						<Select
							id={field.name}
							{...formikField}
							bg='gray.100'
							borderColor='gray.300'
							_focus={{
								borderColor: '#D99A36',
								boxShadow: '0 0 0 1px #D99A36',
							}}
							placeholder={field.label}
						>
							{field.options.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</Select>
					) : (
						<Input
							id={field.name}
							type={field.type}
							{...formikField}
							bg='gray.100'
							borderColor='gray.300'
							_focus={{
								borderColor: '#D99A36',
								boxShadow: '0 0 0 1px #D99A36',
							}}
							placeholder={field.label}
						/>
					)}

					{meta.touched && meta.error && (
						<div style={{ color: 'red', fontSize: '0.8em' }}>{meta.error}</div>
					)}
				</FormControl>
			)}
		</Field>
	));
};

export default RenderFields;
