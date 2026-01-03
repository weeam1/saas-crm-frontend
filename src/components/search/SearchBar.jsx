import React, { useState, useRef } from 'react';
import { InputGroup, Input, Button, Flex, IconButton } from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';

const SearchBar = ({ onSearchTermChange, isLoading = false }) => {
	const [searchTerm, setSearchTerm] = useState('');
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

export default SearchBar;

// const SearchBar = ({ data, onFilteredData }) => {
// 	const [searchTerm, setSearchTerm] = useState('');

// 	// Handle changes in the search input
// 	const handleInputChange = (e) => {
// 		setSearchTerm(e.target.value);
// 	};

// 	// Handle key up for extra actions like filtering
// 	const handleKeyUp = () => {
// 		filterData(searchTerm);
// 	};

// 	// Function to filter the data based on search input
// 	const filterData = (term) => {
// 		if (!term) {
// 			onFilteredData(data); // If search is empty, show all data
// 			return;
// 		}

// 		const filteredData = data?.filter((item) =>
// 			item.name.toLowerCase().includes(term.toLowerCase())
// 		);

// 		onFilteredData(filteredData);
// 	};

// 	// Clear the search bar and show all data again
// 	const clearSearch = () => {
// 		setSearchTerm('');
// 		onFilteredData(data); // Reset to original data
// 	};

// 	return (
// 		<InputGroup width={{ sm: '100%', md: '50%' }} mx='auto' my={4}>
// 			<InputLeftElement
// 				pointerEvents='none'
// 				children={<SearchIcon color='gray.500' />}
// 			/>
// 			<Input
// 				type='text'
// 				value={searchTerm}
// 				onChange={handleInputChange}
// 				onKeyUp={handleKeyUp}
// 				placeholder='Search...'
// 				rounded='full'
// 				size='md'
// 				fontSize='md'
// 				fontWeight='500'
// 				bg='white'
// 				_focus={{ borderColor: '#E0B960' }} // Brand color on focus
// 			/>
// 			{searchTerm && (
// 				<IconButton
// 					aria-label='Clear search'
// 					icon={<CloseIcon />}
// 					onClick={clearSearch}
// 					size='sm'
// 					position='absolute'
// 					right='2'
// 					top='50%'
// 					transform='translateY(-50%)'
// 					bg='transparent'
// 					_hover={{ bg: 'transparent' }}
// 				/>
// 			)}
// 		</InputGroup>
// 	);
// };
