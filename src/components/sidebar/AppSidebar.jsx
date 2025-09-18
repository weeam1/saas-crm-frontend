import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	Box,
	Flex,
	IconButton,
	Text,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	DrawerBody,
	useDisclosure,
	Tooltip,
	VStack,
	HStack,
	Spacer,
	useColorModeValue,
	chakra,
	Divider,
	Avatar,
	Badge,
	Image,
	Collapse,
	Icon,
} from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiMenu } from 'react-icons/fi';
import BrandLogo from 'assets/logo/logo.png';
import { usePermissions } from 'hooks/usePermissions';
import { useIsMobile } from 'hooks/useIsMobile';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { filterRoutes } from './sidebarHelpers';

// Storage keys
const COLLAPSE_KEY = 'app:sidebar:collapsed';

const safeStorage = {
	get(key) {
		try {
			if (typeof window === 'undefined') return null;
			return window.localStorage.getItem(key);
		} catch {
			return null;
		}
	},
	set(key, value) {
		try {
			if (typeof window === 'undefined') return;
			window.localStorage.setItem(key, value);
		} catch {}
	},
};

// const SidebarItem = React.memo(function SidebarItem({
// 	route,
// 	active,
// 	collapsed,
// 	onClick,
// 	isMobile,
// }) {
// 	const activeBg = useColorModeValue('brand.100', 'brand.300');
// 	const activeColor = useColorModeValue('brand.500', 'gray.200');
// 	const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

// 	const content = (
// 		<HStack
// 			as={NavLink}
// 			to={route.path}
// 			onClick={onClick}
// 			align='center'
// 			spacing={3}
// 			px={3}
// 			py={2.5}
// 			borderRadius='lg'
// 			_hover={{ bg: active ? activeBg : hoverBg }}
// 			bg={active ? activeBg : 'transparent'}
// 			aria-current={active ? 'page' : undefined}
// 			role='link'
// 			data-testid={`sidebar-link-${route.moduleId}`}
// 			transition='background 200ms ease'
// 			alignItems={'center'}
// 		>
// 			<Box
// 				as='span'
// 				fontSize='lg'
// 				color={active ? activeColor : 'inherit'}
// 				display='inline-flex'
// 				alignItems='center'
// 				justifyContent='center'
// 				w='32px'
// 			>
// 				{route.icon}
// 			</Box>
// 			{(!collapsed || isMobile) && (
// 				<Text
// 					noOfLines={1}
// 					fontWeight={'500'}
// 					color={active ? activeColor : 'inherit'}
// 					fontSize='sm'
// 				>
// 					{route.name}
// 				</Text>
// 			)}
// 		</HStack>
// 	);

// 	if (collapsed) {
// 		return (
// 			<Tooltip label={route.name} placement='right' openDelay={300} hasArrow>
// 				<Box>{content}</Box>
// 			</Tooltip>
// 		);
// 	}
// 	return content;
// });

const SidebarItem = React.memo(function SidebarItem({
	route,
	active,
	collapsed,
	onClick,
	isMobile,
	setCollapsed,
}) {
	const [open, setOpen] = useState(false);

	const activeBg = useColorModeValue('brand.100', 'brand.300');
	const activeColor = useColorModeValue('brand.500', 'gray.200');
	const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

	const hasChildren =
		Array.isArray(route.children) && route.children.length > 0;

	const handleSidebarItemClick = () => {
		if (hasChildren) {
			// if collapsed, first expand the sidebar
			if (collapsed && !isMobile) {
				setCollapsed(false);
				setOpen(true);
			} else {
				setOpen((prev) => !prev);
			}
		}
		if (onClick && !hasChildren) onClick(); // only navigate if leaf
	};

	const content = (
		<HStack
			as={hasChildren ? 'div' : NavLink}
			to={hasChildren ? undefined : route.path}
			onClick={handleSidebarItemClick}
			align='center'
			spacing={3}
			px={3}
			py={2.5}
			borderRadius='lg'
			_hover={{ bg: active ? activeBg : hoverBg }}
			bg={active ? activeBg : 'transparent'}
			aria-current={active ? 'page' : undefined}
			role='link'
			data-testid={`sidebar-link-${route.moduleId}`}
			transition='background 200ms ease'
			cursor='pointer'
		>
			<Box
				as='span'
				fontSize='sm'
				color={active ? activeColor : 'inherit'}
				display='inline-flex'
				alignItems='center'
				justifyContent='center'
				w='32px'
			>
				{route.icon}
			</Box>
			{(!collapsed || isMobile) && (
				<Box
					as='span'
					noOfLines={1}
					fontWeight='600'
					color={active ? activeColor : 'inherit'}
					fontSize='xs'
					p={0}
					m='0'
					flex='1'
					h='fit-content'
				>
					{route.name}
				</Box>
			)}
			{hasChildren && !collapsed && (
				<Icon
					as={open ? MdExpandLess : MdExpandMore}
					boxSize={4}
					color='gray.400'
				/>
			)}
		</HStack>
	);

	if (collapsed) {
		return (
			<Tooltip label={route.name} placement='right' openDelay={300} hasArrow>
				<Box>{content}</Box>
			</Tooltip>
		);
	}

	return (
		<Box>
			{content}
			{hasChildren && (
				<Collapse in={open} animateOpacity>
					<VStack align='start' pl={10} spacing={1} mt={1}>
						{route.children.map((child, index) => (
							<NavLink
								key={child.id + index}
								to={child.path}
								onClick={onClick}
								style={{ width: '100%' }}
							>
								{({ isActive }) => (
									<Text
										px={2}
										py={1.5}
										fontSize='sm'
										borderRadius='md'
										color={isActive ? activeColor : 'gray.600'}
										_hover={{ bg: hoverBg }}
									>
										{child.name}
									</Text>
								)}
							</NavLink>
						))}
					</VStack>
				</Collapse>
			)}
		</Box>
	);
});

export default function AppSidebar({
	routes,
	brandName = 'Dashboard',
	onNavigate,
	isMobileOpen: externalMobileOpen,
	onMobileOpenChange,
}) {
	const location = useLocation();

	const isMobile = useIsMobile(1024);

	const [collapsed, setCollapsed] = useState(() => {
		const stored = safeStorage.get(COLLAPSE_KEY);
		return stored === '1';
	});

	useEffect(() => {
		safeStorage.set(COLLAPSE_KEY, collapsed ? '1' : '0');
	}, [collapsed]);

	const { isOpen: internalOpen, onOpen, onClose } = useDisclosure();
	const mobileOpen = externalMobileOpen ?? internalOpen;
	const setMobileOpen = useCallback(
		(open) => {
			if (onMobileOpenChange) onMobileOpenChange(open);
			else open ? onOpen() : onClose();
		},
		[onMobileOpenChange, onOpen, onClose]
	);

	const brandBg = useColorModeValue('brand.600', 'brand.500');
	const brandFg = useColorModeValue('white', 'white');
	const surface = useColorModeValue('white', 'gray.900');
	const border = useColorModeValue('gray.200', 'whiteAlpha.200');

	const EXPANDED_W = 300;
	const COLLAPSED_W = 80;

	const { hasPermission } = usePermissions();

	// filter the only allowed routes (modules)
	// const visibleRoutes = useMemo(() => {
	// 	return routes?.filter((route) => {
	// 		if (!route.moduleId) return true; // routes without moduleId always visible
	// 		return hasPermission(route.moduleId);
	// 	});
	// }, [routes, hasPermission]);

	// const visibleRoutes = useMemo(() => {
	// 	return routes?.filter((route) => {
	// 		// always keep routes without moduleId
	// 		if (!route.moduleId) {
	// 			return true;
	// 		}
	// 		// keep only routes with permission
	// 		return hasPermission(route.moduleId);
	// 	});

	// 	// also filter children routes with this mehtod hasPermission(route.moduleId, route.children.id) for every  children check if route.children avlaiable then check other permission nested
	// }, [routes, hasPermission]);

	const visibleRoutes = useMemo(() => {
		return filterRoutes(routes || [], hasPermission);
	}, [routes, hasPermission]);

	const handleNavigate = useCallback(() => {
		// if (onNavigate) onNavigate();
		if (isMobile) setMobileOpen(false);
	}, [isMobile, setMobileOpen]);

	// const isActive = useCallback(
	// 	(path) => {
	// 		return (
	// 			location.pathname === path || location.pathname.startsWith(path + '/')
	// 		);
	// 	},
	// 	[location.pathname]
	// );

	const isActive = useCallback(
		(path) => {
			const currentPath = location.pathname.replace(/\/+$/, '');
			const targetPath = path.replace(/\/+$/, '');

			if (currentPath === targetPath) return true;

			// match only if next char after targetPath is "/"
			return currentPath.startsWith(targetPath + '/');
		},
		[location.pathname]
	);

	useEffect(() => {
		const onKey = (e) => {
			if (e.key === '[' && !isMobile) {
				e.preventDefault();
				setCollapsed((c) => !c);
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [isMobile]);

	const Brand = (
		<Flex
			align='center'
			minH='64px'
			px={6}
			borderBottomWidth='1px'
			borderColor={border}
		>
			{BrandLogo ? (
				<Image
					src={BrandLogo}
					alt='Logo'
					h='24px'
					objectFit='contain'
					userSelect='none'
				/>
			) : (
				<Flex
					bg={brandBg}
					color={brandFg}
					w={8}
					h={8}
					align='center'
					justify='center'
					borderRadius='md'
					flexShrink={0}
					aria-label='Brand mark'
				>
					<chakra.span fontWeight='bold'>W</chakra.span>
				</Flex>
			)}

			{!collapsed && (
				<HStack ml={3} spacing={2} minW={0}>
					<Text fontWeight='bold' noOfLines={1}>
						{brandName}
					</Text>
					{/* <Badge colorScheme='green'>PRO</Badge> */}
				</HStack>
			)}
			<Spacer />
			{!isMobile && (
				<IconButton
					aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
					variant='ghost'
					size='sm'
					icon={collapsed ? <FiChevronRight /> : <FiChevronLeft />}
					onClick={() => setCollapsed((c) => !c)}
				/>
			)}
			{/* {isMobile && (
				<IconButton
					aria-label='Close sidebar'
					variant='ghost'
					size='sm'
					icon={<FiChevronLeft />}
					onClick={() => setMobileOpen(false)}
				/>
			)} */}
		</Flex>
	);

	const SidebarContent = (
		<Flex direction='column' h='100%'>
			{Brand}
			<Box
				as='nav'
				role='navigation'
				aria-label='Main'
				p={2}
				w={'100%'}
				overflowY='auto'
				sx={{
					'&::-webkit-scrollbar': {
						width: '6px',
					},
					'&::-webkit-scrollbar-thumb': {
						background: 'gray.200',
						borderRadius: '10px',
					},
					'&::-webkit-scrollbar-thumb:hover': {
						background: 'gray.300',
					},
					'&::-webkit-scrollbar-track': {
						background: 'transparent',
					},
				}}
			>
				<VStack align='stretch' spacing={1}>
					{visibleRoutes.map((r) => (
						<SidebarItem
							key={r.path}
							route={r}
							collapsed={collapsed}
							active={isActive(r.path)}
							onClick={handleNavigate}
							isMobile={isMobile}
							setCollapsed={setCollapsed}
						/>
					))}
				</VStack>
			</Box>
			{/* <Divider /> */}
			{/* <Flex align='center' p={3}>
				<Avatar size='sm' name='You' mr={collapsed ? 0 : 3} />
				{!collapsed && (
					<Box minW={0}>
						<Text fontSize='sm' noOfLines={1} fontWeight='600'>
							Naimat Ullah
						</Text>
						<Text fontSize='xs' color='gray.500' noOfLines={1}>
							MERN Developer
						</Text>
					</Box>
				)}
			</Flex> */}
		</Flex>
	);
	// Mobile view
	const MobileOpenButton = (
		<IconButton
			aria-label='Open menu'
			icon={<FiMenu />}
			variant='ghost'
			onClick={() => setMobileOpen(true)}
		/>
	);

	if (isMobile) {
		return (
			<>
				{/* {MobileOpenButton} */}
				<Drawer
					isOpen={mobileOpen}
					placement='left'
					onClose={() => setMobileOpen(false)}
					size='xs'
				>
					<DrawerOverlay />
					<DrawerContent bg={surface}>
						<DrawerCloseButton />
						<DrawerBody p={0}>{SidebarContent}</DrawerBody>
					</DrawerContent>
				</Drawer>
			</>
		);
	}

	return (
		<Box
			display={{ base: 'none', lg: 'block' }}
			as='aside'
			bg={surface}
			borderRightWidth='1px'
			borderRightColor={border}
			position='sticky'
			top='0'
			h='100vh'
			// top='56px'
			// h='calc(100dvh - 56px)'
			w={collapsed ? `${COLLAPSED_W}px` : `${EXPANDED_W}px`}
			transition='width 220ms cubic-bezier(.4,0,.2,1)'
			willChange='width'
			zIndex={20}
		>
			{SidebarContent}
		</Box>
	);
}
