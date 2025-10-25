import {
	Box,
	FormControl,
	FormLabel,
	Textarea,
	Input,
	Text,
	Flex,
	FormErrorMessage,
	Alert,
	AlertIcon,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const VARIABLE_LIMIT = 2;
const VARIABLE_REGEX = /{{\d+}}/g;

const TemplateMessageBody = () => {
	const {
		register,
		watch,
		setValue,
		formState: { errors },
	} = useForm();

	const body = watch('body') || '';
	const [variables, setVariables] = useState([]);
	const [tooManyVariables, setTooManyVariables] = useState(false);

	// Extract variables from body content
	useEffect(() => {
		const matches = [...new Set(body.match(VARIABLE_REGEX))] || [];
		setVariables(matches);
		setTooManyVariables(matches.length > VARIABLE_LIMIT);
	}, [body]);

	return (
		<Box>
			{/* Body */}
			<FormControl isInvalid={errors.body || tooManyVariables}>
				<FormLabel fontSize='sm' fontWeight='medium' color='gray.700'>
					Body
				</FormLabel>
				<Textarea
					placeholder='Enter your message content'
					rows={6}
					{...register('body', {
						required: 'Body content is required',
						maxLength: {
							value: 1024,
							message: 'Body cannot exceed 1024 characters',
						},
					})}
					borderColor='gray.300'
					_hover={{ borderColor: 'gray.400' }}
					focusBorderColor='brand.500'
					resize='vertical'
				/>
				<Flex justify='space-between' mt={1}>
					<FormErrorMessage>{errors.body?.message}</FormErrorMessage>
					<Text fontSize='sm' color='gray.500'>
						{body.length}/1024
					</Text>
				</Flex>

				{tooManyVariables && (
					<Alert status='warning' mt={2}>
						<AlertIcon />
						Too many variables used. Only up to {VARIABLE_LIMIT} allowed.
					</Alert>
				)}
			</FormControl>

			{/* Samples for Variables */}
			{variables.length > 0 && (
				<Box mt={4}>
					<Text fontWeight='medium' mb={2}>
						Samples for Body Content
					</Text>
					{variables.map((v, i) => (
						<FormControl key={v} mb={2}>
							<FormLabel fontSize='sm' color='gray.600'>
								{v}
							</FormLabel>
							<Input
								placeholder={`Example for ${v}`}
								{...register(`variables.${v}`, {
									required: 'Sample value required',
								})}
							/>
						</FormControl>
					))}
				</Box>
			)}
		</Box>
	);
};

export default TemplateMessageBody;
