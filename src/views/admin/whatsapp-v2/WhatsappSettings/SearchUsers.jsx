import NoData from 'components/Message/NoData';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
	Box,
	Input,
	Flex,
	Text,
	IconButton,
	InputGroup,
	InputRightElement,
	useColorModeValue,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

const SearchUsers = ({ selectedUserId, users, onSelectUser, size = 'md' }) => {
	const [search, setSearch] = useState('');
	const [selectedUser, setSelectedUser] = useState(null);
	const [showDropdown, setShowDropdown] = useState(false);
	const containerRef = useRef();

	useEffect(() => {
		if (selectedUserId && users?.length > 0) {
			const user = users.find((user) => user._id === selectedUserId);
			setSelectedUser(user);
		}
	}, [selectedUserId, users]);

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
	};

	// useEffect(() => {
	// 	if (selectedUserId === null && selectedUser !== null) {
	// 		handleClear();
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [selectedUserId]);

	const filteredUsers =
		search && !selectedUser
			? users.filter(
					(user) =>
						user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
						user.username?.toLowerCase().includes(search.toLowerCase()) ||
						user.name?.toLowerCase().includes(search.toLowerCase())
				)
			: [];

	const bg = useColorModeValue('gray.100', 'gray.700');

	return (
		<Box position='relative' ref={containerRef}>
			<InputGroup>
				<Input
					placeholder='Search users...'
					bg='gray.100'
					borderColor='gray.300'
					fontSize='sm'
					py={1}
					{...(size === 'sm' ? { size: 'sm' } : {})}
					borderRadius='md'
					_focus={{
						borderColor: '#D99A36',
						boxShadow: '0 0 0 1px #D99A36',
						outline: 'none',
					}}
					value={
						selectedUser ? selectedUser.fullName || selectedUser.name : search
					}
					onChange={(e) => {
						setSearch(e.target.value);
						setShowDropdown(true);
					}}
					isReadOnly={!!selectedUser}
					onFocus={() => {
						if (!selectedUser) setShowDropdown(true);
					}}
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
						/>
					</InputRightElement>
				)}
			</InputGroup>

			{showDropdown && filteredUsers.length > 0 && (
				<Box
					position='absolute'
					width='100%'
					bg='white'
					shadow='md'
					borderRadius='md'
					mt={2}
					zIndex={50}
					maxH='300px'
					overflowY='auto'
				>
					{filteredUsers.map((user, index) => (
						<Flex
							key={`${index}-${user?._id}`}
							p={3}
							bg={bg}
							rounded='md'
							cursor='pointer'
							_hover={{ bg: 'brand.100' }}
							onClick={() => handleSelect(user)}
							align='center'
							justify='space-between'
						>
							<Box>
								<Text fontSize='md'>{user.fullName || user.name}</Text>
								<Text fontSize='sm' color='gray.500'>
									{user.username}
								</Text>
							</Box>
						</Flex>
					))}
				</Box>
			)}

			{showDropdown && search && filteredUsers.length === 0 && (
				<Box
					position='absolute'
					width='100%'
					bg='white'
					shadow='md'
					borderRadius='md'
					mt={2}
					zIndex={50}
				>
					<NoData label='user' />
				</Box>
			)}
		</Box>
	);
};

export default SearchUsers;
