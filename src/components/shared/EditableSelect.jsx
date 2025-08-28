import {
	Box,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	List,
	ListItem,
	useDisclosure,
} from '@chakra-ui/react';
import { Field } from 'formik';
import { useState } from 'react';

const EditableSelect = ({
	label,
	name,
	defaultValue,
	options = [],
	isInvalid,
	onChange,
	...rest
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [inputValue, setInputValue] = useState(defaultValue || '');

	return (
		<FormControl isInvalid={isInvalid}>
			<FormLabel fontSize='sm'>{label}</FormLabel>

			<Field name={name}>
				{({ field, form }) => {
					const handleSelect = (value) => {
						setInputValue(value);
						form.setFieldValue(name, value);
						onClose();
					};

					return (
						<Box position='relative'>
							<Input
								{...field}
								{...rest}
								value={inputValue || ''}
								onChange={(e) => {
									const value = e.target.value;
									setInputValue(value);
									form.setFieldValue(name, value);
									onChange?.(e); // Optional external handler
									onOpen();
								}}
								onFocus={onOpen}
								onBlur={() => setTimeout(onClose, 100)} // Delay to allow option click
								bg='gray.100'
								borderColor='gray.300'
								fontSize='sm'
								borderRadius='md'
								_focus={{
									borderColor: '#D99A36',
									boxShadow: '0 0 0 1px #D99A36',
								}}
								autoComplete='off'
							/>

							{isOpen && options.length > 0 && (
								<List
									position='absolute'
									zIndex={10}
									bg='white'
									mt='2'
									w='100%'
									border='1px solid'
									borderColor='gray.300'
									borderRadius='md'
									maxH='150px'
									overflowY='auto'
								>
									{options.map((option, index) => (
										<ListItem
											key={`${option.value}-${index}`}
											px='3'
											py='2'
											fontSize='sm'
											_hover={{ bg: 'gray.100', cursor: 'pointer' }}
											onMouseDown={() => handleSelect(option.value)}
										>
											{option.label}
										</ListItem>
									))}
								</List>
							)}
						</Box>
					);
				}}
			</Field>

			<FormErrorMessage>{isInvalid}</FormErrorMessage>
		</FormControl>
	);
};

export default EditableSelect;
