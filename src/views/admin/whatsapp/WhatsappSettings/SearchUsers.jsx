import NoData from 'components/Message/NoData';
import { useState, useRef, useEffect } from 'react';
import {
	Box,
	Input,
	Flex,
	Text,
	IconButton,
	InputGroup,
	InputRightElement,
	useColorModeValue,
	Portal,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

const SearchUsers = ({ selectedUserId, users, onSelectUser, size = 'md' }) => {
	const [search, setSearch] = useState('');
	const [selectedUser, setSelectedUser] = useState(null);
	const [showDropdown, setShowDropdown] = useState(false);
	const [dropdownPosition, setDropdownPosition] = useState({
		top: 0,
		left: 0,
		width: 0,
	});
	const containerRef = useRef();
	const inputRef = useRef();
	const dropdownRef = useRef();

	useEffect(() => {
		if (selectedUserId && users?.length > 0) {
			const user = users.find((user) => user._id === selectedUserId);
			setSelectedUser(user);
		}
	}, [selectedUserId, users]);

	useEffect(() => {
		if (showDropdown && inputRef.current) {
			const rect = inputRef.current.getBoundingClientRect();
			setDropdownPosition({
				top: rect.bottom + window.scrollY,
				left: rect.left + window.scrollX,
				width: rect.width,
			});
		}
	}, [showDropdown, search, selectedUser]);

	const handleSelect = (user) => {
		setSelectedUser(user);
		setSearch('');
		setShowDropdown(false);
		onSelectUser(user);
	};

	const handleClear = () => {
		setSelectedUser(null);
		setSearch('');
		onSelectUser(null);
		setShowDropdown(false);
	};

	// useEffect(() => {
	// 	if (selectedUserId === null && selectedUser !== null) {
	// 		handleClear();
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [selectedUserId]);

	const filteredUsers =
		search && !selectedUser
			? users?.filter(
					(user) =>
						user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
						user.username?.toLowerCase().includes(search.toLowerCase()),
				)
			: users || [];

	const bg = useColorModeValue('gray.100', 'gray.700');
	const dropdownBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');
	const hoverBg = useColorModeValue('brand.100', 'brand.700');

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target) &&
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setShowDropdown(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleInputChange = (e) => {
		setSearch(e.target.value);
		setShowDropdown(true);
	};

	const handleInputFocus = () => {
		if (!selectedUser) {
			setShowDropdown(true);
		}
	};

	const handleUserClick = (user) => {
		setTimeout(() => {
			handleSelect(user);
		}, 0);
	};

	return (
		// <Box position='relative' ref={containerRef}>
		// 	<InputGroup>
		// 		<Input
		// 			ref={inputRef}
		// 			placeholder='Search users...'
		// 			bg='gray.100'
		// 			borderColor='gray.300'
		// 			fontSize='sm'
		// 			py={1}
		// 			{...(size === 'sm' ? { size: 'sm' } : {})}
		// 			borderRadius='md'
		// 			_focus={{
		// 				borderColor: '#D99A36',
		// 				boxShadow: '0 0 0 1px #D99A36',
		// 				outline: 'none',
		// 			}}
		// 			value={
		// 				selectedUser ? selectedUser.fullName || selectedUser.name : search
		// 			}
		// 			onChange={handleInputChange}
		// 			isReadOnly={!!selectedUser}
		// 			onFocus={handleInputFocus}
		// 			onClick={handleInputFocus}
		// 		/>
		// 		{selectedUser && (
		// 			<InputRightElement>
		// 				<IconButton
		// 					icon={<CloseIcon fontSize='xs' />}
		// 					variant='ghost'
		// 					size='sm'
		// 					onClick={handleClear}
		// 					aria-label='Clear selection'
		// 					top={size === 'sm' ? '-4px' : '0px'}
		// 				/>
		// 			</InputRightElement>
		// 		)}
		// 	</InputGroup>

		// 	{showDropdown && filteredUsers.length > 0 && (
		// 		<Portal>
		// 			<Box
		// 				ref={dropdownRef}
		// 				position='fixed'
		// 				top={`${dropdownPosition.top}px`}
		// 				left={`${dropdownPosition.left}px`}
		// 				width={`${dropdownPosition.width}px`}
		// 				bg={dropdownBg}
		// 				shadow='lg'
		// 				borderRadius='md'
		// 				border='1px solid'
		// 				borderColor={borderColor}
		// 				zIndex={9999}
		// 				maxH='300px'
		// 				overflowY='auto'
		// 				mt={1}
		// 			>
		// 				{filteredUsers.map((user, index) => (
		// 					<Flex
		// 						key={`${index}-${user?._id}`}
		// 						p={3}
		// 						bg='transparent'
		// 						rounded='md'
		// 						cursor='pointer'
		// 						_hover={{ bg: hoverBg }}
		// 						onClick={() => handleUserClick(user)}
		// 						align='center'
		// 						justify='space-between'
		// 						m={1}
		// 						borderBottom='1px solid'
		// 						borderColor={borderColor}
		// 						_last={{ borderBottom: 'none' }}
		// 					>
		// 						<Box>
		// 							<Text fontSize='md' fontWeight='medium'>
		// 								{user.fullName || user.name}
		// 							</Text>
		// 							{user.username && (
		// 								<Text fontSize='sm' color='gray.500'>
		// 									{user.username}
		// 								</Text>
		// 							)}
		// 						</Box>
		// 					</Flex>
		// 				))}
		// 			</Box>
		// 		</Portal>
		// 	)}

		// 	{showDropdown && search && filteredUsers.length === 0 && (
		// 		<Portal>
		// 			<Box
		// 				ref={dropdownRef}
		// 				position='fixed'
		// 				top={`${dropdownPosition.top}px`}
		// 				left={`${dropdownPosition.left}px`}
		// 				width={`${dropdownPosition.width}px`}
		// 				bg={dropdownBg}
		// 				shadow='lg'
		// 				borderRadius='md'
		// 				border='1px solid'
		// 				borderColor={borderColor}
		// 				zIndex={9999}
		// 				mt={1}
		// 				p={3}
		// 			>
		// 				<NoData label='user' />
		// 			</Box>
		// 		</Portal>
		// 	)}
		// </Box>

		<Box position='relative' ref={containerRef}>
			<InputGroup>
				<Input
					ref={inputRef}
					placeholder='Search users...'
					bg='bg.input'
					borderColor='border.default'
					color='text.body'
					fontSize='sm'
					py={1}
					{...(size === 'sm' ? { size: 'sm' } : {})}
					borderRadius='lg'
					_hover={{
						borderColor: 'gold.dark',
					}}
					_focus={{
						borderColor: 'gold.primary',
						boxShadow: '0 0 0 1px #D4AF37',
						outline: 'none',
					}}
					_placeholder={{
						color: 'text.muted',
					}}
					value={
						selectedUser ? selectedUser.fullName || selectedUser.name : search
					}
					onChange={handleInputChange}
					isReadOnly={!!selectedUser}
					onFocus={handleInputFocus}
					onClick={handleInputFocus}
				/>
				{selectedUser && (
					<InputRightElement>
						<IconButton
							icon={<CloseIcon fontSize='xs' />}
							variant='ghost'
							size='sm'
							onClick={handleClear}
							aria-label='Clear selection'
							top={size === 'sm' ? '-4px' : '0px'}
							color='text.muted'
							_hover={{ color: 'gold.primary', transform: 'scale(1.1)' }}
							transition='all 0.2s'
						/>
					</InputRightElement>
				)}
			</InputGroup>

			{showDropdown && filteredUsers.length > 0 && (
				<Portal>
					<Box
						ref={dropdownRef}
						position='fixed'
						top={`${dropdownPosition.top}px`}
						left={`${dropdownPosition.left}px`}
						width={`${dropdownPosition.width}px`}
						bg='bg.surface'
						boxShadow='card'
						borderRadius='lg'
						border='1px solid'
						borderColor='border.default'
						zIndex={9999}
						maxH='300px'
						overflowY='auto'
						mt={1}
						css={{
							'&::-webkit-scrollbar': { width: '6px' },
							'&::-webkit-scrollbar-track': {
								background: 'navy.900',
								borderRadius: '3px',
							},
							'&::-webkit-scrollbar-thumb': {
								background: 'navy.600',
								borderRadius: '3px',
							},
							'&::-webkit-scrollbar-thumb:hover': { background: 'gold.dark' },
						}}
					>
						{filteredUsers.map((user, index) => (
							<Flex
								key={`${index}-${user?._id}`}
								p={3}
								bg='transparent'
								rounded='md'
								cursor='pointer'
								_hover={{ bg: 'bg.elevated' }}
								onClick={() => handleUserClick(user)}
								align='center'
								justify='space-between'
								m={1}
								borderBottom='1px solid'
								borderColor='border.subtle'
								_last={{ borderBottom: 'none' }}
								transition='background 0.15s'
							>
								<Box>
									<Text fontSize='md' fontWeight='medium' color='text.heading'>
										{user.fullName || user.name}
									</Text>
									{user.username && (
										<Text fontSize='sm' color='text.muted'>
											{user.username}
										</Text>
									)}
								</Box>
								{/* Optional: Add avatar or badge here if needed */}
							</Flex>
						))}
					</Box>
				</Portal>
			)}

			{showDropdown && search && filteredUsers.length === 0 && (
				<Portal>
					<Box
						ref={dropdownRef}
						position='fixed'
						top={`${dropdownPosition.top}px`}
						left={`${dropdownPosition.left}px`}
						width={`${dropdownPosition.width}px`}
						bg='bg.surface'
						boxShadow='card'
						borderRadius='lg'
						border='1px solid'
						borderColor='border.default'
						zIndex={9999}
						mt={1}
						p={4}
					>
						<NoData label='user' />
					</Box>
				</Portal>
			)}
		</Box>
	);
};

export default SearchUsers;
