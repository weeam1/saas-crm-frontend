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
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

const SearchUsers = ({
	users = [],
	selectedUserId,
	onSelectUser,
	size = 'md',
}) => {
	const [search, setSearch] = useState('');
	const [selectedUser, setSelectedUser] = useState(null);
	const [open, setOpen] = useState(false);

	const wrapperRef = useRef();
	const bg = useColorModeValue('white', 'gray.800');
	const hoverBg = useColorModeValue('gray.100', 'gray.700');
	const borderColor = useColorModeValue('gray.300', 'gray.600');

	// ---- Pre Select User
	useEffect(() => {
		if (selectedUserId) {
			setSelectedUser(users.find((u) => u._id === selectedUserId) || null);
		} else {
			setSelectedUser(null);
		}
	}, [selectedUserId, users]);

	// ---- Outside Click
	useEffect(() => {
		const handler = (e) => {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target))
				setOpen(false);
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);

	// ---- Filter Logic
	const filtered = users.filter((u) =>
		(u.fullName || u.name || '').toLowerCase().includes(search.toLowerCase())
	);

	const handleSelect = (u) => {
		setSelectedUser(u);
		setSearch('');
		setOpen(false);
		onSelectUser(u);
	};

	const handleClear = () => {
		setSelectedUser(null);
		setSearch('');
		onSelectUser(null);
	};

	return (
		<Box ref={wrapperRef} position='relative'>
			<InputGroup>
				<Input
					size={size}
					placeholder='Search users...'
					value={
						selectedUser ? selectedUser.fullName || selectedUser.name : search
					}
					onChange={(e) => {
						if (selectedUser) setSelectedUser(null);
						setSearch(e.target.value);
						setOpen(true);
					}}
					onFocus={() => setOpen(true)}
					bg='gray.100'
					borderColor='gray.300'
					_focus={{ borderColor: '#D99A36', boxShadow: '0 0 0 1px #D99A36' }}
				/>

				{selectedUser && (
					<InputRightElement>
						<IconButton
							size='xs'
							variant='ghost'
							icon={<CloseIcon boxSize='2' />}
							onClick={handleClear}
						/>
					</InputRightElement>
				)}
			</InputGroup>

			{open && filtered.length > 0 && (
				<Box
					position='absolute'
					top='100%'
					left={0}
					width='100%'
					bg={bg}
					zIndex={20}
					shadow='lg'
					border='1px solid'
					borderColor={borderColor}
					borderRadius='md'
					maxH='260px'
					overflowY='auto'
					mt={1}
				>
					{filtered.map((user) => (
						<Flex
							key={user._id}
							p={2}
							cursor='pointer'
							_hover={{ bg: hoverBg }}
							onClick={() => handleSelect(user)}
						>
							<Text fontSize='sm' fontWeight='medium'>
								{user.fullName || user.name}
							</Text>
						</Flex>
					))}
				</Box>
			)}

			{open && filtered.length === 0 && (
				<Box
					position='absolute'
					top='100%'
					left={0}
					width='100%'
					bg={bg}
					border='1px solid'
					borderColor={borderColor}
					shadow='lg'
					borderRadius='md'
					mt={1}
					p={3}
					zIndex={20}
				>
					<Text fontSize='sm' color='gray.500'>
						No matching users
					</Text>
				</Box>
			)}
		</Box>
	);
};

export default SearchUsers;
