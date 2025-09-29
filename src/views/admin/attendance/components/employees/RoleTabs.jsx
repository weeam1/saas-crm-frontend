import { useSearchParams } from 'react-router-dom';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button, Flex, Box, IconButton, Skeleton } from '@chakra-ui/react';
import { skipToken } from '@reduxjs/toolkit/query';

function getValidRolesFromStorage() {
	const stored = localStorage.getItem('roles');
	if (!stored) return null;

	try {
		const parsed = JSON.parse(stored);
		if (Date.now() > parsed.expiry) {
			localStorage.removeItem('roles');
			return null;
		}
		return parsed.roles;
	} catch {
		localStorage.removeItem('roles');
		return null;
	}
}

const RoleTabs = ({ updateFilters, key }) => {
	const [searchParams] = useSearchParams();
	const currentRole = searchParams.get('role') || 'All';
	const [localRoles, setLocalRoles] = useState(null);

	const shouldFetch = !localRoles;

	const {
		data: roles,
		isLoading,
		isSuccess,
	} = useFetchItemsQuery(shouldFetch ? { path: '/role-access/v2' } : skipToken);

	// useEffect(() => {
	// 	if (isSuccess && roles) {
	// 		localStorage.setItem('roles', JSON.stringify(roles));
	// 		setLocalRoles(roles);
	// 	}
	// }, [isSuccess, roles]);

	useEffect(() => {
		const validRoles = getValidRolesFromStorage();
		if (validRoles) {
			setLocalRoles(validRoles);
		}
	}, []);

	useEffect(() => {
		if (isSuccess && roles) {
			const expiryTime = Date.now() + 5 * 60 * 1000; // 5 min
			const dataWithExpiry = {
				roles,
				expiry: expiryTime,
			};
			localStorage.setItem('roles', JSON.stringify(dataWithExpiry));
			setLocalRoles(roles);
		}
	}, [isSuccess, roles]);

	const roleData = localRoles || roles || [];

	const containerRef = useRef(null);
	const [showLeft, setShowLeft] = useState(false);
	const [showRight, setShowRight] = useState(false);

	useEffect(() => {
		const checkOverflow = () => {
			if (containerRef.current) {
				const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
				setShowLeft(scrollLeft > 0);
				setShowRight(scrollLeft + clientWidth < scrollWidth);
			}
		};

		checkOverflow();
		window.addEventListener('resize', checkOverflow);
		return () => window.removeEventListener('resize', checkOverflow);
	}, []);

	const scroll = (direction) => {
		if (containerRef.current) {
			const scrollAmount = 200;
			containerRef.current.scrollBy({
				left: direction * scrollAmount,
				behavior: 'smooth',
			});

			setTimeout(() => {
				const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
				setShowLeft(scrollLeft > 0);
				setShowRight(scrollLeft + clientWidth < scrollWidth);
			}, 300);
		}
	};

	const handleRoleChange = (roleName) => {
		const search = searchParams.get('search');

		if (search) {
			document.getElementById('searchInput').value = '';
			updateFilters({ role: roleName, page: 1, search: '' });
		} else updateFilters({ role: roleName, page: 1 });
	};

	return (
		<Flex
			align='center'
			position='relative'
			rounded='md'
			shadow='sm'
			bg='white'
			p={2}
			my='2'
		>
			{/* Left Scroll Button */}
			{showLeft && (
				<IconButton
					aria-label='Scroll Left'
					icon={<ChevronLeftIcon boxSize={6} />}
					position='absolute'
					left='0'
					zIndex='10'
					bg='gray.100'
					rounded='full'
					color='gray.800'
					onClick={() => scroll(-1)}
					_hover={{ bg: 'brand.200', color: 'white' }}
				/>
			)}

			{/* Scrollable Tabs */}
			<Flex
				ref={containerRef}
				overflowX='auto'
				overflowY='hidden'
				whiteSpace='nowrap'
				gap={2}
				px={4}
				flex='1'
				maxWidth='100%'
				css={{
					'&::-webkit-scrollbar': { display: 'none' },
					'-ms-overflow-style': 'none',
					scrollbarWidth: 'none',
				}}
			>
				{isLoading ? (
					[...Array(10)].map((_, index) => (
						<Skeleton
							key={index}
							height='40px'
							width='120px'
							borderRadius='md'
							startColor='gray.100'
							endColor='gray.200'
						/>
					))
				) : (
					<>
						<TabButton
							flex='0 0 auto'
							key={currentRole}
							isActive={currentRole === 'All'}
							onClick={() => handleRoleChange('All')}
						>
							All
						</TabButton>

						{roleData
							?.filter((role) => role.roleName !== 'superAdmin')
							?.map((role) => (
								<TabButton
									key={role._id}
									isActive={currentRole === role.roleName}
									onClick={() => handleRoleChange(role.roleName)}
								>
									{role.roleName}
								</TabButton>
							))}
					</>
				)}
			</Flex>

			{/* Right Scroll Button */}
			{showRight && (
				<IconButton
					aria-label='Scroll Right'
					icon={<ChevronRightIcon boxSize={6} />}
					position='absolute'
					right='0'
					zIndex='10'
					bg='gray.100'
					rounded='full'
					color='gray.800'
					_hover={{ bg: 'brand.200', color: 'white' }}
					onClick={() => scroll(1)}
				/>
			)}
		</Flex>
	);
};

const TabButton = ({ isActive, onClick, children }) => (
	<Button
		onClick={onClick}
		bg={isActive ? 'brand.400' : 'softGray.100'}
		color={isActive ? 'white' : 'gray.800'}
		_hover={{ bg: isActive ? 'brand.500' : 'gray.100' }}
		_focus={{ boxShadow: 'none' }}
		rounded='md'
		shadow='sm'
		fontSize={{ base: 'sm', md: 'lg' }}
		fontWeight='normal'
		px={{ base: 3, md: 4 }}
		py={{ base: 1, md: 2 }}
		transition='all 0.3s ease'
		whiteSpace='nowrap'
		minWidth={{ base: 'fit-content', md: 'auto' }}
	>
		{children}
	</Button>
);

export default RoleTabs;
