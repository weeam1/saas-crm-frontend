// import React, { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useFormik } from "formik";
// import {
//   Box,
//   Button,
//   Flex,
//   FormControl,
//   FormErrorMessage,
//   Heading,
//   Icon,
//   Image,
//   Input,
//   InputGroup,
//   InputLeftElement,
//   InputRightElement,
//   Text,
//   useColorModeValue,
// } from "@chakra-ui/react";
// import { EmailIcon, LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
// import { toast } from "react-toastify";
// import { postApi } from "services/api";
// import { loginSchema } from "schema";
// import Spinner from "components/spinner/Spinner";
// import AddAgent from "./AddAgent";
// import { useDispatch, useSelector } from "react-redux";
// // import { fetchImage } from "../../../redux/imageSlice";
// import { setUser } from "../../../redux/localSlice";
// import webSocketService from "services/WebSocketService";
// import { getSmartTimezone } from "hooks/useTimezone";
// import Logo_CRM from "assets/logo-crm.png";
// import DefaultAuth from "layouts/auth/Default";
// import { useUserActivityLog } from "hooks/useUserActivityLog";
// import { setPermissions } from "../../../redux/permissionSlice";
// import { buildPermissionMap } from "utils/permissionUtils";
// import socketService from "services/socketService";
// import useUserSession from "hooks/useUserSession";

// function SignIn() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [addAgentModal, setAddAgentModal] = useState(false);
  
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   console.log("workspace",localStorage.getItem("workspace"));
//   const { createUserLog } = useUserActivityLog();
  
// useEffect(() => {
//   const cameFromWorkspace = sessionStorage.getItem("cameFromWorkspace");
  
//   // If not coming from workspace, redirect to workspace
//   if (!cameFromWorkspace) {
//     navigate("/auth/workspace");
//   }
  
//   // Clear the flag after checking
//   sessionStorage.removeItem("cameFromWorkspace");
// }, [navigate]);
//     const [searchParams] = useSearchParams();
//   const {
//     values,
//     errors,
//     touched,
//     handleChange,
//     handleBlur,
//     handleSubmit,
//     resetForm,
//   } = useFormik({
//     initialValues: { username: "", password: "" },
//     validationSchema: loginSchema,
//     onSubmit: () => login(),
//   });

//   // useEffect(() => {
//   //   dispatch(fetchImage("?isActive=true"));
//   // }, [dispatch]);

//   useEffect(() => {
//     getSmartTimezone();
//   }, []);

//   // const login = async () => {
//   // 	try {
//   // 		setIsLoding(true);
//   // 		let response = await postApi("api/user/login", values, true);
//   // 		if (response && response.status === 200) {
//   // 			toast.success("Login Successfully!");
//   // 			// wss://pystage.weeam.info/ws/user_id

//   // 			resetForm();
//   // 			dispatch(setUser(response?.data?.user));
//   // 			navigate("/superAdmin");
//   // 		} else {
//   // 			toast.error(response.response.data?.error);
//   // 		}
//   // 	} catch (e) {
//   // 		console.log(e);
//   // 	} finally {
//   // 		setIsLoding(false);
//   // 	}
//   // };

//   // const login = async () => {
//   //   try {
//   //     setIsLoading(true);
//   //     const response = await postApi(
//   //       "api/user/login",
//   //       {
//   //         username: values?.username?.trim().toLowerCase(),
//   //         password: values.password,
//   //       },
//   //       true,
//   //     );


// // const login = async () => {
// //   try {
// //     setIsLoading(true);
// //     const tenantId = searchParams.get("tenantId") || localStorage.getItem("tenantId");
// //     console.log("Tenant ID from URL:", tenantId);
    
// //     const requestBody = {
// //       username: values?.username?.trim().toLowerCase(),
// //       password: values.password,
// //     };
    
// //     // Append tenantId to URL if it exists
// //     let apiEndpoint = "api/user/login";
// //     if (tenantId) {
// //       apiEndpoint = `api/user/login?tenantId=${tenantId}`;
// //     }
    
// //     const response = await postApi(
// //       apiEndpoint,
// //       requestBody,
// //       true,
// //     );
// //       if (response?.status === 200) {
// //         if (!response.data.user?.isActive) {
// //           toast.error("Your account is not active. Please contact support.");
// //           return;
// //         }
// //         localStorage.setItem("tenantId", tenantId || "");
// //         toast.success("Login Successfully!");
// //         resetForm();

// //         const userData = {
// //           ...response.data.user,
// //           roleName:
// //             response.data?.user?.roles?.[0]?.roleName ||
// //             response.data?.user?.role ||
// //             "user",
// //         };

// //         // build the permission map and store in redux store
// //         const permissionMap = buildPermissionMap(userData);
// //         dispatch(setPermissions(permissionMap));
// //         dispatch(setUser(userData));

// //         // notification and announcments socket (python sockets)
// //         webSocketService.connect(userData._id);
// //         await socketService.connect();
// //         // connect web scoket.io (node js sockets)
// //         socketService.registerUser({
// // 					userId: userData?._id || '',
// // 					tenantId: tenantId || '',
// // 				});

// //         const redirectPath = localStorage.getItem("redirectInvite");

// //         if (redirectPath) {
// //           localStorage.removeItem("redirectInvite");
// //         }

// //         navigate(redirectPath || "/");

// //         // create a user login log
// //         createUserLog({
// //           userId: userData?._id,
// //           action: "LOGIN",
// //           entity: "Auth",
// //           status: "success",
// //           message: `User logged in as ${values.username || ""}`,
// //         });
// //       } else {
// //         toast.error(response?.response?.data?.error);

// //         createUserLog({
// //           action: "LOGIN",
// //           entity: "Auth",
// //           status: "fail",
// //           message:
// //             response?.response?.data?.error ||
// //             `User Login failed for ${values.username}`,
// //         });
// //       }
// //     } catch (e) {
// //       console.log(e);

// //       const errorMsg =
// //         e?.response?.data?.message || `Login failed as ${values.username}`;
// //       toast.error(errorMsg);

// //       createUserLog({
// //         action: "LOGIN_FAIL",
// //         entity: "Auth",
// //         status: "fail",
// //         message: errorMsg,
// //       });
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// const login = async () => {
//   try {
//     setIsLoading(true);
//     const currentWorkspace = localStorage.getItem("currentWorkspace");
    
//     if (!currentWorkspace) {
//       toast.error("Please select a workspace first");
//       navigate("/auth/workspace");
//       return;
//     }
    
//     const requestBody = {
//       username: values?.username?.trim().toLowerCase(),
//       password: values.password,
//       workspace: currentWorkspace, // Send workspace in payload
//     };
    
//     const response = await postApi("api/auth/workspace/login", requestBody, true, "productBaseUrl");
    
//     if (response?.status === 200) {
//       if (!response.data.user?.isActive) {
//         toast.error("Your account is not active. Please contact support.");
//         return;
//       }
//          const tenantId = response.data.user?.tenant?.tenantId || response.data.user?.tenantId;
//       if (tenantId) {
//         localStorage.setItem("tenantId", tenantId);
//       }
//       toast.success("Login Successfully!");
//       resetForm();

//       const userData = {
//         ...response.data.user,
//         roleName:
//           response.data?.user?.roles?.[0]?.roleName ||
//           response.data?.user?.role ||
//           "user",
//       };

//       // build the permission map and store in redux store
//       const permissionMap = buildPermissionMap(userData);
//       dispatch(setPermissions(permissionMap));
//       dispatch(setUser(userData));

//       // notification and announcements socket (python sockets)
//       webSocketService.connect(userData._id);
//       await socketService.connect();
//       // connect web socket.io (node js sockets)
//       socketService.registerUser({
//         userId: userData?._id || '',
//         tenantId: currentWorkspace || '',
//       });

//       const redirectPath = localStorage.getItem("redirectInvite");

//       if (redirectPath) {
//         localStorage.removeItem("redirectInvite");
//       }

//       navigate(redirectPath || "/");

//       // create a user login log
//       createUserLog({
//         userId: userData?._id,
//         action: "LOGIN",
//         entity: "Auth",
//         status: "success",
//         message: `User logged in as ${values.username || ""}`,
//       });
//     } else {
//       toast.error(response?.response?.data?.error);

//       createUserLog({
//         action: "LOGIN",
//         entity: "Auth",
//         status: "fail",
//         message:
//           response?.response?.data?.error ||
//           `User Login failed for ${values.username}`,
//       });
//     }
//   } catch (e) {
//     console.log(e);

//     const errorMsg =
//       e?.response?.data?.message || `Login failed as ${values.username}`;
//     toast.error(errorMsg);

//     createUserLog({
//       action: "LOGIN_FAIL",
//       entity: "Auth",
//       status: "fail",
//       message: errorMsg,
//     });
//   } finally {
//     setIsLoading(false);
//   }
// };

// const [currentWorkspace, setCurrentWorkspace] = useState("");

// useEffect(() => {
//   const workspace = localStorage.getItem("currentWorkspace");
//   if (workspace) {
//     setCurrentWorkspace(workspace);
//   }
// }, []);
// const [workspaceAgencyName, setWorkspaceAgencyName] = useState("");

// useEffect(() => {
//   // Get the stored agency name from localStorage
//   const storedAgencyName = localStorage.getItem("workspaceAgencyName");
//   if (storedAgencyName) {
//     setWorkspaceAgencyName(storedAgencyName);
//   }
// }, []);

// const {agencyName}=useUserSession()
//   return (
//     <DefaultAuth>
//       <Flex w="100%" maxW="md" p={10} direction="column" align="center">
//         <Heading fontSize="3xl" color="#b79045" mb={4} display="flex" gap={2}>
//           <Image src={Logo_CRM} alt={agencyName ? `${agencyName} Logo` : "Weam Logo"} w="40px" h="40px" />
          
//           {workspaceAgencyName || agencyName || "Weam"}
//         </Heading>
// {currentWorkspace && (
//   <Box mb={3} textAlign="center">
//     <Text fontSize="sm" color="brand.500" fontWeight="semibold">
//       Workspace: {currentWorkspace}
//     </Text>
//   </Box>
// )}
//         <Text fontSize="2xl" fontWeight="semibold" color="gray.800" mb={2}>
//           Sign In Access
//         </Text>
//         <Text fontSize="sm" color="gray.500" maxW="md" mb={6}>
//           You must become a member to login and access the entire site.
//         </Text>

//         <form onSubmit={handleSubmit} style={{ width: "100%" }}>
//           <FormControl isInvalid={errors.username && touched.username} mb={4}>
//             <InputGroup>
//               <InputLeftElement>
//                 <EmailIcon color="gray.400" />
//               </InputLeftElement>
//               <Input
//                 name="username"
//                 placeholder="Enter email address"
//                 value={values.username}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 _focus={{ borderColor: "brand.500" }}
//               />
//             </InputGroup>
//             <FormErrorMessage>{errors.username}</FormErrorMessage>
//           </FormControl>

//           <FormControl isInvalid={errors.password && touched.password} mb={4}>
//             <InputGroup>
//               <InputLeftElement>
//                 <LockIcon color="gray.400" />
//               </InputLeftElement>
//               <Input
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter password"
//                 value={values.password}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 _focus={{ borderColor: "brand.500" }}
//               />
//               <InputRightElement>
//                 <Icon
//                   as={showPassword ? ViewOffIcon : ViewIcon}
//                   onClick={() => setShowPassword(!showPassword)}
//                   _hover={{ cursor: "pointer" }}
//                   color="gray.500"
//                 />
//               </InputRightElement>
//             </InputGroup>
//             <FormErrorMessage>{errors.password}</FormErrorMessage>
//           </FormControl>

//           <Button
//             type="submit"
//             w="full"
//             colorScheme="brand"
//             isDisabled={isLoading}
//             color="white"
//             borderRadius="md"
//             mb={2}
//           >
//             {isLoading ? <Spinner /> : "SIGN IN"}
//           </Button>
//         </form>

//         <Text mt={2} fontSize="sm" color="gray.500">
//           OR
//         </Text>

//         <Button
//           onClick={() => setAddAgentModal(true)}
//           variant="ghost"
//           fontSize="sm"
//           fontWeight="500"
//           mt={2}
//         >
//           Signup as an agent
//         </Button>

//         {addAgentModal && (
//           <AddAgent
//             onClose={() => setAddAgentModal(false)}
//             isOpen={addAgentModal}
//           />
//         )}
//       </Flex>
//     </DefaultAuth>
//   );
// }

// export default SignIn;

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
	VStack,
	HStack,
	chakra,
	keyframes,
} from '@chakra-ui/react';
import { EmailIcon, LockIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaArrowRight, FaBuilding } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { postApi } from 'services/api';
import { loginSchema } from 'schema';
import Spinner from 'components/spinner/Spinner';
import AddAgent from './AddAgent';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../redux/localSlice';
import webSocketService from 'services/WebSocketService';
import { getSmartTimezone } from 'hooks/useTimezone';
import Logo_CRM from 'assets/logo-crm.png';
import DefaultAuth from 'layouts/auth/Default';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import { setPermissions } from '../../../redux/permissionSlice';
import { buildPermissionMap } from 'utils/permissionUtils';
import socketService from 'services/socketService';
import useUserSession from 'hooks/useUserSession';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
	navy900: '#0B1C2C',
	navy800: '#10273A',
	black: '#000000',
	goldPri: '#D4AF37',
	goldLight: '#F5D67B',
	goldDark: '#C9A227',
	white: '#FFFFFF',
	gray300: '#B0B0B0',
	gray500: '#808080',
};

const goldGradient = `linear-gradient(135deg, ${C.goldLight} 0%, ${C.goldPri} 50%, ${C.goldDark} 100%)`;
const goldGlow = '0 0 20px rgba(212, 175, 55, 0.5)';
const cardShadow = '0px 10px 30px rgba(0,0,0,0.4)';

// ─── Keyframes ────────────────────────────────────────────────────────────────
const pulseGold = keyframes`
  0%,100% { box-shadow: 0 0 0px  rgba(212,175,55,0);    }
  50%      { box-shadow: 0 0 22px rgba(212,175,55,0.55); }
`;

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(16px); }
  to   { opacity:1; transform:translateY(0);    }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

// ─── Sub-components ───────────────────────────────────────────────────────────
const GoldRule = () => (
	<Box
		h='1px'
		w='100%'
		bg='linear-gradient(90deg, transparent, #D4AF37, transparent)'
		opacity={0.35}
		my={1}
	/>
);

const CornerMark = ({ right }) => (
	<Box
		position='absolute'
		top='0'
		{...(right ? { right: 0, transform: 'scaleX(-1)' } : { left: 0 })}
		opacity={0.15}
		pointerEvents='none'
	>
		<svg width='60' height='60' viewBox='0 0 60 60' fill='none'>
			<path
				d='M4 4 L4 28 M4 4 L28 4'
				stroke='#D4AF37'
				strokeWidth='2'
				strokeLinecap='round'
			/>
			<circle cx='4' cy='4' r='3' fill='#D4AF37' />
		</svg>
	</Box>
);

// Gold-styled input wrapper
const GoldInput = ({ icon, rightIcon, error, touched, ...props }) => {
	const [focused, setFocused] = useState(false);
	return (
		<InputGroup size='lg'>
			<InputLeftElement h='52px' pl={1}>
				<Icon
					as={icon}
					color={focused ? C.goldPri : C.gray500}
					fontSize='15px'
					transition='color 0.2s'
				/>
			</InputLeftElement>

			<Input
				h='52px'
				fontSize='15px'
				bg={C.navy900}
				border='1px solid'
				borderColor={
					error && touched
						? 'rgba(220,53,69,0.7)'
						: focused
							? C.goldPri
							: 'rgba(176,176,176,0.13)'
				}
				borderRadius='12px'
				color={C.white}
				_placeholder={{ color: C.gray500 }}
				_hover={{ borderColor: 'rgba(212,175,55,0.38)' }}
				_focus={{
					borderColor: C.goldPri,
					boxShadow: '0 0 0 2px rgba(212,175,55,0.15)',
					bg: C.navy900,
				}}
				_disabled={{ opacity: 0.45 }}
				transition='all 0.2s'
				onFocus={() => setFocused(true)}
				onBlur={(e) => {
					setFocused(false);
					props.onBlur?.(e);
				}}
				{...props}
			/>

			{rightIcon && <InputRightElement h='52px'>{rightIcon}</InputRightElement>}
		</InputGroup>
	);
};

// ─── Main Component ───────────────────────────────────────────────────────────
function SignIn() {
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [addAgentModal, setAddAgentModal] = useState(false);
	const [currentWorkspace, setCurrentWorkspace] = useState('');
	const [workspaceAgencyName, setWorkspaceAgencyName] = useState('');

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { createUserLog } = useUserActivityLog();
	const { agencyName,agencyLogo } = useUserSession();

	// Guard — must come from workspace page
	useEffect(() => {
		const came = sessionStorage.getItem('cameFromWorkspace');
		if (!came) navigate('/auth/workspace');
		sessionStorage.removeItem('cameFromWorkspace');
	}, [navigate]);

	useEffect(() => {
		getSmartTimezone();
	}, []);

	useEffect(() => {
		const ws = localStorage.getItem('currentWorkspace');
		if (ws) setCurrentWorkspace(ws);
	}, []);

	useEffect(() => {
		const name = localStorage.getItem('workspaceAgencyName');
		if (name) setWorkspaceAgencyName(name);
	}, []);

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

	const login = async () => {
		try {
			setIsLoading(true);
			if (!currentWorkspace) {
				toast.error('Please select a workspace first');
				navigate('/auth/workspace');
				return;
			}

			const requestBody = {
				username: values?.username?.trim().toLowerCase(),
				password: values.password,
				workspace: currentWorkspace,
			};

			const response = await postApi(
				'api/auth/workspace/login',
				requestBody,
				true,
				'productBaseUrl',
			);

			if (response?.status === 200) {
				if (!response.data.user?.isActive) {
					toast.error('Your account is not active. Please contact support.');
					return;
				}

			

				toast.success('Login Successfully!');
				resetForm();

				const userData = {
					...response.data.user,
					roleName:
						response.data?.user?.roles?.[0]?.roleName ||
						response.data?.user?.role ||
						'user',
				};

				const permissionMap = buildPermissionMap(userData);
				dispatch(setPermissions(permissionMap));
				dispatch(setUser(userData));

				webSocketService.connect(userData._id);
				await socketService.connect();
				socketService.registerUser({
					userId: userData?._id || '',
					tenantId: currentWorkspace || '',
				});

				const redirectPath = localStorage.getItem('redirectInvite');
				if (redirectPath) localStorage.removeItem('redirectInvite');
				navigate(redirectPath || '/');

				createUserLog({
					userId: userData?._id,
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

	const displayName = workspaceAgencyName || agencyName || 'Weam';

	return (
		<DefaultAuth>
			{/* Card — DefaultAuth handles full-screen backdrop */}

			{/* ── Card ── */}
			<Box
				w='100%'
				maxW='460px'
				bg={C.navy800}
				borderRadius='20px'
				border='1px solid rgba(212,175,55,0.18)'
				boxShadow={cardShadow}
				px={{ base: 6, md: 10 }}
				py={10}
				position='relative'
				overflow='hidden'
				animation={`${fadeUp} 0.5s ease both`}
			>
				{/* Corner ornaments */}
				<CornerMark />
				<CornerMark right />

				{/* Top accent bar */}
				<Box
					position='absolute'
					top={0}
					left='12%'
					right='12%'
					h='2px'
					bg={goldGradient}
					borderRadius='0 0 4px 4px'
				/>

				{/* ── Header ── */}
				<VStack spacing={3} mb={7} align='center'>
					{/* Logo ring */}
					<Box
						p='3px'
						borderRadius='full'
						bg={goldGradient}
						animation={`${pulseGold} 3.2s ease-in-out infinite`}
					>
						<Flex
							w='52px'
							h='52px'
							bg={C.navy900}
							borderRadius='full'
							align='center'
							justify='center'
						>
							<Image
								src={agencyLogo}
								alt={`${displayName} Logo`}
								w='30px'
								h='30px'
							/>
						</Flex>
					</Box>

					{/* Agency / workspace name */}
					<Heading
						fontSize={{ base: '21px', md: '25px' }}
						fontWeight='700'
						color={C.white}
						textAlign='center'
						letterSpacing='-0.3px'
						lineHeight='1.3'
					>
						<chakra.span
							bg={goldGradient}
							bgClip='text'
							backgroundSize='200% auto'
							animation={`${shimmer} 4.5s linear infinite`}
						>
							{displayName}
						</chakra.span>
					</Heading>

					<Text
						fontSize='13px'
						color={C.gray300}
						textAlign='center'
						lineHeight='1.65'
					>
						Sign in to access your workspace
					</Text>

					{/* Workspace badge */}
					{currentWorkspace && (
						<HStack
							spacing={2}
							px='12px'
							py='6px'
							bg='rgba(212,175,55,0.08)'
							border='1px solid rgba(212,175,55,0.2)'
							borderRadius='full'
						>
							<Icon as={FaBuilding} color={C.goldPri} fontSize='11px' />
							<Text
								fontSize='12px'
								fontWeight='600'
								color={C.goldDark}
								letterSpacing='0.3px'
							>
								{currentWorkspace}
							</Text>
						</HStack>
					)}
				</VStack>

				<GoldRule />

				{/* ── Form ── */}
				<form onSubmit={handleSubmit} style={{ width: '100%' }}>
					<VStack spacing='14px' mt={6}>
						{/* Email */}
						<FormControl isInvalid={!!(errors.username && touched.username)}>
							<GoldInput
								icon={EmailIcon}
								name='username'
								placeholder='Enter email address'
								value={values.username}
								onChange={handleChange}
								onBlur={handleBlur}
								error={errors.username}
								touched={touched.username}
								autoComplete='username'
							/>
							<FormErrorMessage
								fontSize='12px'
								color='rgba(220,80,80,0.9)'
								mt='6px'
							>
								{errors.username}
							</FormErrorMessage>
						</FormControl>

						{/* Password */}
						<FormControl isInvalid={!!(errors.password && touched.password)}>
							<GoldInput
								icon={LockIcon}
								name='password'
								type={showPassword ? 'text' : 'password'}
								placeholder='Enter password'
								value={values.password}
								onChange={handleChange}
								onBlur={handleBlur}
								error={errors.password}
								touched={touched.password}
								autoComplete='current-password'
								rightIcon={
									<Icon
										as={showPassword ? ViewOffIcon : ViewIcon}
										onClick={() => setShowPassword((p) => !p)}
										color={C.gray500}
										cursor='pointer'
										fontSize='16px'
										_hover={{ color: C.goldPri }}
										transition='color 0.2s'
									/>
								}
							/>
							<FormErrorMessage
								fontSize='12px'
								color='rgba(220,80,80,0.9)'
								mt='6px'
							>
								{errors.password}
							</FormErrorMessage>
						</FormControl>

						{/* CTA */}
						<Button
							type='submit'
							w='100%'
							h='52px'
							mt={1}
							bg={goldGradient}
							color={C.black}
							fontSize='15px'
							fontWeight='700'
							borderRadius='12px'
							letterSpacing='0.4px'
							isDisabled={isLoading}
							rightIcon={
								isLoading ? undefined : (
									<Icon as={FaArrowRight} fontSize='13px' />
								)
							}
							_hover={{
								boxShadow: goldGlow,
								transform: 'translateY(-1px)',
							}}
							_active={{ transform: 'translateY(0)', opacity: 0.92 }}
							_disabled={{
								opacity: 0.3,
								cursor: 'not-allowed',
								boxShadow: 'none',
								transform: 'none',
							}}
							transition='all 0.2s'
						>
							{isLoading ? (
								<HStack spacing={2}>
									<Spinner size='sm' />
									<Text fontWeight='700' color={C.black}>
										Signing in…
									</Text>
								</HStack>
							) : (
								'SIGN IN'
							)}
						</Button>
					</VStack>
				</form>

				{/* ── Divider + Agent signup ── */}
				<VStack spacing={3} mt={7}>
					<HStack w='100%' spacing={3} align='center'>
						<Box flex={1} h='1px' bg='rgba(176,176,176,0.12)' />
						<Text
							fontSize='11px'
							color={C.gray500}
							letterSpacing='0.6px'
							textTransform='uppercase'
						>
							or
						</Text>
						<Box flex={1} h='1px' bg='rgba(176,176,176,0.12)' />
					</HStack>

					{/* Secondary — Signup as agent */}
					<Button
						onClick={() => setAddAgentModal(true)}
						variant='unstyled'
						h='44px'
						w='100%'
						fontSize='13px'
						fontWeight='600'
						color={C.gray300}
						border='1px solid rgba(176,176,176,0.13)'
						borderRadius='12px'
						_hover={{
							borderColor: 'rgba(212,175,55,0.35)',
							color: C.goldPri,
							bg: 'rgba(212,175,55,0.05)',
						}}
						transition='all 0.2s'
					>
						Signup as an Agent
					</Button>
				</VStack>

				{/* ── Back to workspace ── */}
				<Flex justify='center' mt={5}>
					<Text
						fontSize='12px'
						color={C.gray500}
						cursor='pointer'
						_hover={{ color: C.goldPri }}
						transition='color 0.2s'
						onClick={() => navigate('/auth/workspace')}
					>
						← Switch workspace
					</Text>
				</Flex>

				{/* Bottom accent line */}
				<Box
					position='absolute'
					bottom={0}
					left='28%'
					right='28%'
					h='1px'
					bg={goldGradient}
					opacity={0.28}
				/>
			</Box>

			{addAgentModal && (
				<AddAgent
					onClose={() => setAddAgentModal(false)}
					isOpen={addAgentModal}
				/>
			)}
		</DefaultAuth>
	);
}

export default SignIn;
