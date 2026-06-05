import { useState, useRef, useEffect } from 'react';
import {
	Box,
	Input,
	Flex,
	Text,
	IconButton,
	InputGroup,
	InputRightElement,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useModalColors } from 'hooks/useModalColors';

const SearchUsers = ({
	users = [],
	selectedUserId,
	onSelectUser,
	size = 'md',
}) => {
	const colors = useModalColors();
	const [search, setSearch] = useState('');
	const [selectedUser, setSelectedUser] = useState(null);
	const [open, setOpen] = useState(false);

	const wrapperRef = useRef();

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
		<Box ref={wrapperRef} position='relative' w='100%'>
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
					bg={colors.bgInput}
					borderColor={colors.borderColor}
					color={colors.headingText}
					_placeholder={{ color: colors.mutedText }}
					_hover={{ borderColor: colors.accentGold }}
					_focus={{
						borderColor: colors.accentGold,
						boxShadow: `0 0 0 1px ${colors.accentGold}`
					}}
					transition='all 0.2s ease'
				/>

				{selectedUser && (
					<InputRightElement>
						<IconButton
							size='xs'
							variant='ghost'
							icon={<CloseIcon boxSize='2' />}
							onClick={handleClear}
							aria-label='Clear selection'
							color={colors.bodyText}
							_hover={{
								color: colors.accentGold,
								bg: colors.secondaryBtnHoverBg
							}}
							_focus={{ outline: 'none' }}
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
					bg={colors.bgDeep}
					zIndex={20}
					boxShadow={colors.modalShadow}
					border='1px solid'
					borderColor={colors.borderColor}
					borderRadius='md'
					maxH='260px'
					overflowY='auto'
					mt={1}
					css={{
						'&::-webkit-scrollbar': { width: '6px' },
						'&::-webkit-scrollbar-track': { background: colors.bgInput, borderRadius: '3px' },
						'&::-webkit-scrollbar-thumb': { background: colors.borderColor, borderRadius: '3px', '&:hover': { background: colors.accentGold } },
					}}
				>
					{filtered.map((user) => (
						<Flex
							key={user._id}
							p={2}
							cursor='pointer'
							_hover={{ bg: colors.bgInputHover }}
							onClick={() => handleSelect(user)}
							transition='all 0.2s ease'
						>
							<Text fontSize='sm' fontWeight='medium' color={colors.bodyText}>
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
					bg={colors.bgDeep}
					border='1px solid'
					borderColor={colors.borderColor}
					boxShadow={colors.cardShadow}
					borderRadius='md'
					mt={1}
					p={3}
					zIndex={20}
				>
					<Text fontSize='sm' color={colors.mutedText}>
						No matching users
					</Text>
				</Box>
			)}
		</Box>
	);
};

export default SearchUsers;