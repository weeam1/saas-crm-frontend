import React, { useState, useRef } from 'react';
import {
	Input,
	InputGroup,
	InputRightElement,
	Button,
	HStack,
	Box,
	Flex,
	IconButton,
	Tooltip,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { BiX } from 'react-icons/bi';
import { useModalColors } from 'hooks/useModalColors';

const SearchBar = ({ onSearchTermChange, isLoading = false, onClear }) => {
	const colors = useModalColors();
	const [inputValue, setInputValue] = useState('');
	const inputRef = useRef(null);

	const handleInputChange = (event) => {
		const value = event.target.value;
		setInputValue(value);
		if (!value.trim()) onSearchTermChange('');
	};

	const handleClearInput = () => {
		setInputValue('');
		onSearchTermChange('');
		if (onClear) onClear();
		inputRef.current?.focus();
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			const term = inputValue.trim();
			onSearchTermChange(term);
		}
	};

	const handleSearchClick = () => {
		onSearchTermChange(inputValue.trim());
	};

	return (
		<Flex
			bg={colors.bgInput}
			border='1px solid'
			borderColor={colors.borderColor}
			borderRadius='md'
			width={{ base: '100%', xl: '18rem' }}
			overflow='hidden'
			_focusWithin={{
				borderColor: colors.accentGold,
				boxShadow: colors.goldGlow,
			}}
		>
			<InputGroup flex='1'>
				<Input
					ref={inputRef}
					id='searchInput'
					placeholder='Search...'
					border='none'
					fontSize='xs'
					height='2.5rem'
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyPress}
					_focus={{ boxShadow: 'none' }}
					_placeholder={{
						color: colors.mutedText,
					}}
					color={colors.headingText}
					bg='transparent'
				/>

				{inputValue && (
					<InputRightElement height='100%'>
						<Tooltip label='Clear search' hasArrow placement='top'>
							<IconButton
								icon={<BiX />}
								size='sm'
								variant='ghost'
								onClick={handleClearInput}
								aria-label='clear search'
								color={colors.mutedText}
								_hover={{
									color: colors.accentGold,
									transform: 'scale(1.1)',
								}}
								transition='all 0.2s ease'
							/>
						</Tooltip>
					</InputRightElement>
				)}
			</InputGroup>

			<Button
				size='md'
				variant='ghost'
				px={4}
				fontSize='xs'
				onClick={handleSearchClick}
				isLoading={isLoading}
				color={colors.bodyText}
				_hover={{
					color: colors.accentGold,
					bg: colors.secondaryBtnHoverBg,
				}}
			>
				<Flex align='center' gap={1}>
					Search
					<SearchIcon fontSize='xs' color={colors.accentGold} />
				</Flex>
			</Button>
		</Flex>
	);
};

export default SearchBar;