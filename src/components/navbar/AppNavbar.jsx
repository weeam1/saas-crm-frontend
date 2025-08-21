// AppNavbar.js
import {
	Box,
	Flex,
	IconButton,
	Image,
	Heading,
	useColorModeValue,
} from '@chakra-ui/react';
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from 'react-icons/ai';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import BrandLogo from 'assets/logo/logo.png';
import { buildPermissionMap } from 'utils/permissionUtils';
import { setPermissions } from './../../redux/permissionSlice';
import { useEffect } from 'react';
import { getApi } from 'services/api';
import useUserSession from 'hooks/useUserSession';
import { useDispatch } from 'react-redux';
import AdminNavbarLinks from './NavbarLinksAdmin';

const NAVBAR_H = 64;
const EXPANDED_W = 264;
const COLLAPSED_W = 76;

export default function AppNavbar({
	brandText,
	openSidebar,
	setOpenSidebar,
	onOpenMobile,
}) {
	const bg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

	const { user } = useUserSession();

	return (
		<Box
			as='header'
			position='fixed'
			top='0'
			left='0'
			// left={{
			// 	base: 0, // mobile: always full width
			// 	// xl: openSidebar ? '264px' : '76px', // desktop: offset by sidebar
			// }}
			right='0'
			height={`${NAVBAR_H}px`}
			bg={bg}
			borderBottom='1px solid'
			borderColor={borderColor}
			transition='all 0.3s ease'
			zIndex='10'
			px='6'
		>
			<Flex align='center' justify='flex-end' h='100%'>
				{/* Sidebar Toggle (desktop only) */}
				<IconButton
					aria-label='Toggle sidebar'
					icon={openSidebar ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
					display={{ base: 'flex', lg: 'none' }}
					onClick={onOpenMobile}
					variant='ghost'
					fontSize='20px'
				/>

				{/* Brand / Logo */}
				{/* <Flex
					as={RouterLink}
					to='/'
					align='center'
					_hover={{ textDecoration: 'none' }}
					gap='2'
				>
					{BrandLogo ? (
						<Image
							src={BrandLogo}
							alt='Logo'
							h='36px'
							objectFit='contain'
							userSelect='none'
						/>
					) : (
						<Heading fontSize='lg'>{brandText || 'CRM'}</Heading>
					)}
				</Flex> */}

				{/* Right Slot – user actions (extend as needed) */}
				<Flex align='center' gap='4'>
					<AdminNavbarLinks />
				</Flex>
			</Flex>
		</Box>
	);
}

AppNavbar.propTypes = {
	brandText: PropTypes.string,
	openSidebar: PropTypes.bool.isRequired,
	setOpenSidebar: PropTypes.func.isRequired,
};

export const NAVBAR_HEIGHT = NAVBAR_H;
