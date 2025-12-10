import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
	Box,
	Input,
	Button,
	FormControl,
	FormLabel,
	FormErrorMessage,
	VStack,
	HStack,
} from '@chakra-ui/react';
import { useUpdateItemMutation } from 'api/apiSlice';
import useUserSession from 'hooks/useUserSession';
import { useDispatch } from 'react-redux';
import { saveUserDialerSettings } from '../../../redux/webrtc/webrtcSlice';
import { useEffect } from 'react';

// Validation schema
const modeValidationSchema = Yup.object().shape({
	cid: Yup.string()
		.required('CID is required')
		.matches(/^[1-9]\d{2,}$/, 'Must be 3 digits or more starting from 100')
		.test('min-value', 'Must be ≥ 100', (v) => parseInt(v) >= 100),

	username: Yup.string()
		.required('Username is required')
		.matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscore'),

	password: Yup.string()
		.required('Password is required')
		.min(6, 'Minimum 6 characters'),

	domain: Yup.string()
		.required('Domain is required')
		.matches(/^[a-zA-Z0-9][a-zA-Z0-9-.]+\.[a-zA-Z]{2,}$/, 'Invalid domain'),

	port: Yup.number().required('Port is required').min(1).max(65535),
});

const SettingsForm = ({ userSettings }) => {
	const initialData = userSettings?.modes?.wss || {};
	const {
		register,
		handleSubmit,
		reset,
		formState: { isDirty, errors },
	} = useForm({
		resolver: yupResolver(modeValidationSchema),
		defaultValues: initialData,
	});

	const [updateSetting, { isLoading: isUpdating }] = useUpdateItemMutation();

	const { user } = useUserSession();
	const dispatch = useDispatch();

	useEffect(() => {
		reset(initialData);
	}, [initialData]);

	const onSubmit = async (values) => {
		const payload = {
			modes: {
				wss: values,
			},
		};

		const res = await updateSetting({
			path: `/sipSetting/${userSettings._id}`,
			body: payload,
		}).unwrap();

		if (user?._id === res?.user) {
			dispatch(saveUserDialerSettings(res));
		}
	};

	return (
		<Box>
			<form onSubmit={handleSubmit(onSubmit)}>
				<VStack spacing={3} align='stretch'>
					{/* CID */}
					<FormControl isInvalid={errors.cid}>
						<FormLabel fontSize='sm'>Caller ID</FormLabel>
						<Input
							size='sm'
							fontSize='sm'
							placeholder='Enter Caller ID'
							borderColor='gray.300'
							focusBorderColor='greenish.400'
							borderRadius='md'
							_hover={{ borderColor: 'greenish.400' }}
							{...register('cid')}
						/>
						<FormErrorMessage fontSize='xs'>
							{errors.cid?.message}
						</FormErrorMessage>
					</FormControl>

					{/* Username */}
					<FormControl isInvalid={errors.username}>
						<FormLabel fontSize='sm'>Username</FormLabel>
						<Input
							borderRadius='md'
							size='sm'
							fontSize='sm'
							placeholder='Enter username'
							borderColor='gray.300'
							focusBorderColor='greenish.400'
							_hover={{ borderColor: 'greenish.400' }}
							{...register('username')}
						/>
						<FormErrorMessage fontSize='xs'>
							{errors.username?.message}
						</FormErrorMessage>
					</FormControl>

					{/* Password */}
					<FormControl isInvalid={errors.password}>
						<FormLabel fontSize='sm'>Password</FormLabel>
						<Input
							borderRadius='md'
							size='sm'
							fontSize='sm'
							placeholder='Enter password'
							borderColor='gray.300'
							focusBorderColor='greenish.400'
							_hover={{ borderColor: 'greenish.400' }}
							{...register('password')}
						/>
						<FormErrorMessage fontSize='xs'>
							{errors.password?.message}
						</FormErrorMessage>
					</FormControl>

					{/* Domain */}
					<FormControl isInvalid={errors.domain}>
						<FormLabel fontSize='sm'>Domain</FormLabel>
						<Input
							borderRadius='md'
							size='sm'
							fontSize='sm'
							placeholder='sip.example.com'
							borderColor='gray.300'
							focusBorderColor='greenish.400'
							_hover={{ borderColor: 'greenish.400' }}
							{...register('domain')}
						/>
						<FormErrorMessage fontSize='xs'>
							{errors.domain?.message}
						</FormErrorMessage>
					</FormControl>

					{/* Port */}
					<FormControl isInvalid={errors.port}>
						<FormLabel fontSize='sm'>Port</FormLabel>
						<Input
							borderRadius='md'
							size='sm'
							fontSize='sm'
							type='number'
							placeholder='5060'
							borderColor='gray.300'
							focusBorderColor='greenish.400'
							_hover={{ borderColor: 'greenish.400' }}
							{...register('port')}
						/>
						<FormErrorMessage fontSize='xs'>
							{errors.port?.message}
						</FormErrorMessage>
					</FormControl>

					{/* Actions */}
					<HStack justify='flex-end' pt={2}>
						<Button
							size='sm'
							colorScheme='greenish'
							type='submit'
							px={6}
							isLoading={isUpdating}
							isDisabled={!isDirty}
						>
							Save
						</Button>
					</HStack>
				</VStack>
			</form>
		</Box>
	);
};

export default SettingsForm;
