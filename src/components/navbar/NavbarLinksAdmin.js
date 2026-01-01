// Chakra Imports
import {
	Avatar,
	Flex,
	HStack,
	Icon,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
// Custom Components
import { SidebarResponsive } from 'components/sidebar/Sidebar';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
// Assets
import { FaEthereum } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useColorMode } from '@chakra-ui/react';
import { getApi } from 'services/api';
import { toast } from 'react-toastify';
import jwtDecode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDownIcon } from '@chakra-ui/icons';
import webSocketService from 'services/WebSocketService';
import socketService from 'services/socketService';

import NotificationIcon from './notifications/NotificationIcon';
import { constant } from 'constant';
import DigitalClockDropdown from './clock/DigitalClockDropdown;';
import { buildPermissionMap } from 'utils/permissionUtils';
import { setPermissions } from '../../redux/permissionSlice';
import { usePermissions } from 'hooks/usePermissions';
import useUserSession from 'hooks/useUserSession';
import { setUser } from '../../redux/localSlice';
import { useWhatsapp } from 'hooks/whatsapp/useWhatsapp';
import { resetSettings } from '../../redux/webrtc/webrtcSlice';

export default function HeaderLinks(props) {
	const { secondary, setOpenSidebar, openSidebar, routes } = props;
	// Chakra Color Mode
	const navbarIcon = useColorModeValue('gray.400', 'white');
	let menuBg = useColorModeValue('white', 'navy.800');
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const textColorBrand = useColorModeValue('brand.700', 'brand.400');
	const ethColor = useColorModeValue('gray.700', 'white');
	const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
	const ethBg = useColorModeValue('secondaryGray.300', 'navy.900');
	const ethBox = useColorModeValue('white', 'navy.800');
	const shadow = useColorModeValue(
		'14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
		'14px 17px 40px 4px rgba(112, 144, 176, 0.06)'
	);
	// const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');

	const { hasPermission } = usePermissions();

	const { colorMode, toggleColorMode } = useColorMode();

	const navigate = useNavigate();
	const { user } = useUserSession();
	const { logoutWhatsapp, isAuthenticated, qr } = useWhatsapp();

	// const data = typeof userData === 'string' ? JSON.parse(userData) : userData;
	// const user = user?.fullName;
	// const localUser = JSON.parse(localStorage.getItem('user'));

	// const userId = localUser?._id;

	const dispatch = useDispatch();

	const fetchData = async () => {
		try {
			let response = await getApi('api/user/view/', user?._id);

			if (response?.data) {
				// Check role mismatch
				if (
					user?.roles[0]?.roleName !== response.data?.roles[0]?.roleName ||
					!response.data?.isActive
				) {
					logOut();
				}

				const userData = {
					...response.data,
					// roleName:
					// 	response.data?.roles?.[0]?.roleName ||
					// 	response.data?.role ||
					// 	'user',
				};

				// dispatch(setUser(userData));
				localStorage.setItem('user', JSON.stringify(userData));
				// sessionStorage.setItem('user', JSON.stringify(userData));

				// build the permission map and store in redux store
				const permissionMap = buildPermissionMap(userData);

				// console.log({ permissionMap });
				dispatch(setPermissions(permissionMap));
			}
		} catch (error) {
			console.error('Error fetching user:', error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const [isLogoutScheduled, setIsLogoutScheduled] = useState(false);

	const logOut = (message) => {
		localStorage.clear();
		sessionStorage.clear();

		// when user
		if (qr || isAuthenticated) {
			logoutWhatsapp();
		}

		// disconnect the web sockets
		webSocketService.disconnect();
		socketService.disconnect();

		// clear the phone dialer settings
		dispatch(resetSettings());

		navigate('/auth');
		if (message) {
			toast.error(message);
		} else {
			toast.success('Log out Successfully');
		}

		setIsLogoutScheduled(true);
	};

	useEffect(() => {
		const token =
			localStorage.getItem('token') || sessionStorage.getItem('token');

		if (token) {
			try {
				const decodedToken = jwtDecode(token);
				const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
				if (decodedToken.exp < currentTime) {
					if (!isLogoutScheduled) {
						logOut('Token has expired');
					}
				} else {
					// Schedule automatic logout when the token expires
					const timeToExpire = (decodedToken.exp - currentTime) * 1000; // Convert seconds to milliseconds
					setTimeout(() => {
						if (!isLogoutScheduled) {
							logOut('Token has expired');
						}
					}, timeToExpire);
				}
			} catch (error) {
				console.error('Error decoding token:', error);
			}
		}
	}, [isLogoutScheduled]);

	return (
		<Flex
			// w={{ sm: '100%', md: 'auto' }}
			alignItems='center'
			justifyContent={'end'}
			flexDirection='row'
			bg={menuBg}
			flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
			p='6px'
			// borderRadius='30px'
			// boxShadow={shadow}
		>
			{/* <Flex
				bg={ethBg}
				display={secondary ? 'flex' : 'none'}
				borderRadius='30px'
				ms='auto'
				p='6px'
				align='center'
				me='6px'
			>
				<Flex
					align='center'
					justify='center'
					bg={ethBox}
					h='29px'
					w='29px'
					borderRadius='30px'
					me='7px'
				>
					<Icon color={ethColor} w='9px' h='14px' as={FaEthereum} />
				</Flex>
				<Text
					w='max-content'
					color={ethColor}
					fontSize='sm'
					fontWeight='700'
					me='6px'
				>
					1,924
					<Text as='span' display={{ base: 'none', md: 'unset' }}>
						{' '}
						ETH
					</Text>
				</Text>
			</Flex> */}
			{/* 
			<SidebarResponsive
				routes={routes}
				setOpenSidebar={setOpenSidebar}
				openSidebar={openSidebar}
			/> */}

			<HStack gap='2'>
				<NotificationIcon userId={user?._id} />
				{/* <Box
					boxSize={10}
					bg='brand.500'
					pb={1}
					pt={1.5}
					pl={2}
					pr={2}
					sx={{ clipPath: 'circle()' }} // Applying circular clip path
				>
					<TimeIcon boxSize={6} color='white' />
				</Box> */}

				<DigitalClockDropdown />

				<Menu style={{ zIndex: 99999 }} boxShadow={'lg'}>
					<MenuButton
						p='1px'
						_hover={{ backgroundColor: 'gray.100', rounded: 'full' }}
					>
						<HStack spacing='10px' pr='4'>
							<Avatar
								size='sm'
								w='40px'
								h='40px'
								name={user?.firstName || 'User'}
								src={
									user?.profileImage
										? `${constant['baseUrl']}${user.profileImage}`
										: ''
								}
								bg={user?.profileImage ? 'gray.100' : 'brand.500'}
								color={user?.profileImage ? '#333' : 'white'}
								shadow='md'
								_hover={{ cursor: 'pointer' }}
							/>
							{user?.firstName && (
								<>
									<Text
										fontWeight='medium'
										display={{ base: 'none', md: 'block' }}
										isTruncated={true}
										maxWidth='200px'
										color='brand.500'
									>
										👋 Hey, {user?.firstName || 'User'}
									</Text>
									<Icon as={ChevronDownIcon} w={5} h={5} />
								</>
							)}
						</HStack>
					</MenuButton>

					<MenuList
						p='0px'
						mt='10px'
						borderRadius='20px'
						bg={menuBg}
						border='none'
					>
						{/* <Flex w='100%' mb='0px'>
							<Text
								ps='20px'
								pt='16px'
								pb='10px'
								w='100%'
								borderBottom='1px solid'
								borderColor={borderColor}
								fontSize='sm'
								fontWeight='700'
								textTransform={'capitalize'}
								color={textColor}
							>
								👋&nbsp; Hey, {user}
							</Text>
						</Flex> */}

						<Flex
							flexDirection='column'
							p='10px'
							boxShadow={'2xl'}
							borderRadius='20px'
							bg={menuBg}
							border='none'
						>
							<MenuItem
								_hover={{ bg: 'none' }}
								_focus={{ bg: 'none' }}
								borderRadius='8px'
								px='14px'
							>
								<Text fontSize='sm' onClick={() => navigate(`/admin/`)}>
									Home
								</Text>
							</MenuItem>

							{/* Annouoncements allow for admin and managers */}
							{/* {(user?.role === "superAdmin" ||
							user?.roles?.[0]?.roleName === "Manager") && (
							<MenuItem
								_hover={{ bg: "none" }}
								_focus={{ bg: "none" }}
								borderRadius="8px"
								px="14px"
							>
								<Text fontSize="sm" onClick={() => navigate("/announcements")}>
									Announcements
								</Text>
							</MenuItem>
						)} */}

							{hasPermission('admin_settings') && (
								<MenuItem
									_hover={{ bg: 'none' }}
									_focus={{ bg: 'none' }}
									borderRadius='8px'
									px='14px'
								>
									<Text
										fontSize='sm'
										onClick={() => navigate('/admin-setting')}
									>
										Admin Settings
									</Text>
								</MenuItem>
							)}

							<MenuItem
								_hover={{ bg: 'none' }}
								_focus={{ bg: 'none' }}
								borderRadius='8px'
								px='14px'
							>
								<Text
									fontSize='sm'
									onClick={() =>
										// navigate(
										// 	`/users/${JSON.parse(localStorage.getItem('user'))?._id}`
										// )
										navigate(`/users-v2/${user?._id}`)
									}
								>
									Profile Settings
								</Text>
							</MenuItem>
							{/* <MenuItem
								_hover={{ bg: 'none' }}
								_focus={{ bg: 'none' }}
								borderRadius='8px'
								px='14px'
							>
								<Flex
									alignItems={'center'}
									fontSize='sm'
									onClick={() => {
										toggleColorMode();
									}}
								>
									<Text mr={2}>
										Switch to {colorMode === 'dark' ? 'Light' : 'Dark'} Mode
									</Text>
									{colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
								</Flex>
							</MenuItem> */}
							{/*<MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }} borderRadius="8px" px="14px">
							<Text fontSize="sm">Newsletter Settings</Text>
						</MenuItem> */}
							<MenuItem
								_hover={{ bg: 'none' }}
								onClick={logOut}
								_focus={{ bg: 'none' }}
								color='red.400'
								borderRadius='8px'
								px='14px'
							>
								<Text fontSize='sm'>Log out</Text>
							</MenuItem>
						</Flex>
					</MenuList>
				</Menu>
			</HStack>
		</Flex>
	);
}

HeaderLinks.propTypes = {
	variant: PropTypes.string,
	fixed: PropTypes.bool,
	secondary: PropTypes.bool,
	onOpen: PropTypes.func,
};
