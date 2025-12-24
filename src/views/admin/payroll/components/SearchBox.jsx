import React, { useState, useRef } from 'react';
import { InputGroup, Input, Button, Flex, IconButton } from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';

const SearchBox = ({
	searchTerm,
	setSearchTerm,
	onSearchTermChange,
	isLoading = false,
}) => {
	const inputRef = useRef(null);

	// Handle typing
	const handleChange = (e) => {
		const term = e.target.value;
		setSearchTerm(term);
		if (!term.trim()) onSearchTermChange(''); // Reset on clear
	};

	// Handle Enter key
	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			const term = e.target.value.trim();
			onSearchTermChange(term);
		}
	};

	// Handle button click
	const handleSearchClick = () => {
		onSearchTermChange(searchTerm.trim());
	};

	// Clear search bar
	const clearSearch = () => {
		setSearchTerm('');
		onSearchTermChange('');
		inputRef.current?.focus();
	};

	return (
		<InputGroup
			bg='white'
			border='1px solid'
			borderColor='gray.200'
			borderRadius='md'
			width={{ base: '100%', md: '18rem' }}
			overflow='hidden'
			size='sm'
		>
			<Input
				ref={inputRef}
				placeholder='Search...'
				border='none'
				fontSize='sm'
				height='2.5rem'
				value={searchTerm}
				onChange={handleChange}
				onKeyPress={handleKeyPress}
				isDisabled={isLoading}
				_focus={{ boxShadow: 'none' }}
			/>

			{/**/}
			{searchTerm && (
				<IconButton
					aria-label='Clear search'
					icon={<CloseIcon boxSize={2.5} />}
					onClick={clearSearch}
					position='absolute'
					right='5.5rem'
					top='50%'
					transform='translateY(-50%)'
					bg='transparent'
					_hover={{ bg: 'transparent' }}
					size='xs'
				/>
			)}

			{/* Search button */}
			<Button
				bg='gray.100'
				borderLeft='1px solid'
				borderColor='gray.200'
				px={5}
				borderRadius='0'
				fontSize='sm'
				display='flex'
				alignItems='center'
				_hover={{ bg: 'gray.50' }}
				_active={{ bg: 'gray.100' }}
				onClick={handleSearchClick}
				isLoading={isLoading}
				height='100%'
			>
				<Flex align='center' h='2.5rem'>
					Search <SearchIcon fontSize='sm' color='brand.500' ml={1} />
				</Flex>
			</Button>
		</InputGroup>
	);
};

export default SearchBox;
