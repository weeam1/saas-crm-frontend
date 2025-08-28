import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from 'react-icons/ai';
import PropTypes from 'prop-types';
import useUserSession from 'hooks/useUserSession';
import AdminNavbarLinks from './NavbarLinksAdmin';
import { useIsMobile } from 'hooks/useIsMobile';

const NAVBAR_H = 64;
const EXPANDED_W = 264;
const COLLAPSED_W = 76;

export default function AppNavbar({
	brandText,
	openSidebar,
	setOpenSidebar,
	onOpenMobile,
}) {
	const isMobile = useIsMobile(1024);

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
			<Flex align='center' justify='space-between' h='100%'>
				{/* Sidebar Toggle (desktop only) */}
				<Box
					as='button'
					onClick={() => setOpenSidebar(!openSidebar)}
					display={isMobile ? 'flex' : 'hidden'}
					alignItems='center'
					justifyContent='center'
					fontSize='20px'
					bg='transparent'
					p='0'
					m='0'
					border='none'
					outline='none'
					_hover={{ bg: 'transparent' }}
					_active={{ bg: 'transparent', transform: 'none' }}
					_focus={{ boxShadow: 'none' }}
					cursor='pointer'
				>
					{openSidebar ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
				</Box>

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
				<Flex align='center' gap='4' alignSelf='flex-end' bg='red.200'>
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
