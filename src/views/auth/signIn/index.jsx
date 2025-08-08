import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	Heading,
	Icon,
	Image,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { EmailIcon, LockIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';
import { postApi } from 'services/api';
import { loginSchema } from 'schema';
import Spinner from 'components/spinner/Spinner';
import AddAgent from './AddAgent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchImage } from '../../../redux/imageSlice';
import { setUser } from '../../../redux/localSlice';
import webSocketService from 'services/WebSocketService';
import { getSmartTimezone } from 'hooks/useTimezone';
import Logo_CRM from 'assets/logo-crm.png';
import DefaultAuth from 'layouts/auth/Default';
import { useUserActivityLog } from 'hooks/useUserActivityLog';

function SignIn() {
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [addAgentModal, setAddAgentModal] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { createUserLog } = useUserActivityLog();

	const {
		values,
		errors,
		touched,
		handleChange,
		handleBlur,
		handleSubmit,
		resetForm,
	} = useFormik({
		initialValues: { username: '', password: '' },
		validationSchema: loginSchema,
		onSubmit: () => login(),
	});

	useEffect(() => {
		dispatch(fetchImage('?isActive=true'));
	}, [dispatch]);

	useEffect(() => {
		getSmartTimezone();
	}, []);

	// const login = async () => {
	// 	try {
	// 		setIsLoding(true);
	// 		let response = await postApi("api/user/login", values, true);
	// 		if (response && response.status === 200) {
	// 			toast.success("Login Successfully!");
	// 			// wss://pystage.weeam.info/ws/user_id

	// 			resetForm();
	// 			dispatch(setUser(response?.data?.user));
	// 			navigate("/superAdmin");
	// 		} else {
	// 			toast.error(response.response.data?.error);
	// 		}
	// 	} catch (e) {
	// 		console.log(e);
	// 	} finally {
	// 		setIsLoding(false);
	// 	}
	// };

	const login = async () => {
		try {
			setIsLoading(true);
			const response = await postApi(
				'api/user/login',
				{
					username: values?.username?.trim().toLowerCase(),
					password: values.password,
				},
				true
			);

			if (response?.status === 200) {
				if (!response.data.user?.isActive) {
					toast.error('Your account is not active. Please contact support.');
					return;
				}
				toast.success('Login Successfully!');
				resetForm();
				dispatch(setUser(response.data.user));
				webSocketService.connect(response.data.user._id);
				navigate('/superAdmin');

				// create a user login log
				createUserLog({
					userId: response?.data?.user?._id,
					action: 'LOGIN',
					entity: 'Auth',
					status: 'success',
					message: `User logged in as ${values.username || ''}`,
				});
			} else {
				toast.error(response?.response?.data?.error);

				createUserLog({
					action: 'LOGIN',
					entity: 'Auth',
					status: 'fail',
					message:
						response?.response?.data?.error ||
						`User Login failed for ${values.username}`,
				});
			}
		} catch (e) {
			console.log(e);

			const errorMsg =
				e?.response?.data?.message || `Login failed as ${values.username}`;
			toast.error(errorMsg);

			createUserLog({
				action: 'LOGIN_FAIL',
				entity: 'Auth',
				status: 'fail',
				message: errorMsg,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<DefaultAuth>
			<Flex w='100%' maxW='md' p={10} direction='column' align='center'>
				<Heading fontSize='3xl' color='#b79045' mb={4} display='flex' gap={2}>
					<Image src={Logo_CRM} alt='Weeam Logo' w='40px' h='40px' />
					Weeam
				</Heading>

				<Text fontSize='2xl' fontWeight='semibold' color='gray.800' mb={2}>
					Sign In Access
				</Text>
				<Text fontSize='sm' color='gray.500' maxW='md' mb={6}>
					You must become a member to login and access the entire site.
				</Text>

				<form onSubmit={handleSubmit} style={{ width: '100%' }}>
					<FormControl isInvalid={errors.username && touched.username} mb={4}>
						<InputGroup>
							<InputLeftElement>
								<EmailIcon color='gray.400' />
							</InputLeftElement>
							<Input
								name='username'
								placeholder='Enter email address'
								value={values.username}
								onChange={handleChange}
								onBlur={handleBlur}
								_focus={{ borderColor: 'brand.500' }}
							/>
						</InputGroup>
						<FormErrorMessage>{errors.username}</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.password && touched.password} mb={4}>
						<InputGroup>
							<InputLeftElement>
								<LockIcon color='gray.400' />
							</InputLeftElement>
							<Input
								name='password'
								type={showPassword ? 'text' : 'password'}
								placeholder='Enter password'
								value={values.password}
								onChange={handleChange}
								onBlur={handleBlur}
								_focus={{ borderColor: 'brand.500' }}
							/>
							<InputRightElement>
								<Icon
									as={showPassword ? ViewOffIcon : ViewIcon}
									onClick={() => setShowPassword(!showPassword)}
									_hover={{ cursor: 'pointer' }}
									color='gray.500'
								/>
							</InputRightElement>
						</InputGroup>
						<FormErrorMessage>{errors.password}</FormErrorMessage>
					</FormControl>

					<Button
						type='submit'
						w='full'
						colorScheme='brand'
						isDisabled={isLoading}
						color='white'
						borderRadius='md'
						mb={2}
					>
						{isLoading ? <Spinner /> : 'SIGN IN'}
					</Button>
				</form>

				<Text mt={2} fontSize='sm' color='gray.500'>
					OR
				</Text>

				<Button
					onClick={() => setAddAgentModal(true)}
					variant='ghost'
					fontSize='sm'
					fontWeight='500'
					mt={2}
				>
					Signup as an agent
				</Button>

				{addAgentModal && (
					<AddAgent
						onClose={() => setAddAgentModal(false)}
						isOpen={addAgentModal}
					/>
				)}
			</Flex>
		</DefaultAuth>
	);
}

export default SignIn;
