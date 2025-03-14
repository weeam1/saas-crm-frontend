import { useSearchParams } from 'react-router-dom';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button, Flex, Box, IconButton } from '@chakra-ui/react';
import { skipToken } from '@reduxjs/toolkit/query';

const RoleTabs = ({ updateFilters }) => {
	const [searchParams] = useSearchParams();
	const currentRole = searchParams.get('role') || 'All';
	const [localRoles, setLocalRoles] = useState(() => {
		return JSON.parse(localStorage.getItem('roles')) || null;
	});

	const shouldFetch = !localRoles; // Only fetch if localRoles is not found

	const { data: roles, isSuccess } = useFetchItemsQuery(
		shouldFetch ? { path: '/role-access/v2' } : skipToken
	);

	// Update localStorage and state when API fetch is successful
	useEffect(() => {
		if (isSuccess && roles) {
			localStorage.setItem('roles', JSON.stringify(roles));
			setLocalRoles(roles); // Update state with fetched data
		}
	}, [isSuccess, roles]);

	// Use localRoles in your component
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
		<Flex align='center' position='relative' bg='white' p={2}>
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
					'scrollbar-width': 'none',
				}}
			>
				<TabButton
					flex='0 0 auto'
					key={currentRole}
					isActive={currentRole === 'All'}
					onClick={() => handleRoleChange('All')}
				>
					All
				</TabButton>
				{roleData
					?.filter((role) => role.roleName !== 'sadmin')
					?.map((role) => (
						<TabButton
							key={role._id}
							isActive={currentRole === role.roleName}
							onClick={() => handleRoleChange(role.roleName)}
						>
							{role.roleName}
						</TabButton>
					))}
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
