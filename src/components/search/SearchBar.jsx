import React, { useState } from 'react';
import {
	InputGroup,
	InputLeftElement,
	Input,
	IconButton,
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';

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

const SearchBar = ({ onSearchTermChange }) => {
	const [searchTerm, setSearchTerm] = useState('');

	// Handle changes in the search input
	const handleInputChange = (e) => {
		const term = e.target.value;
		setSearchTerm(term);
		onSearchTermChange(term);
	};

	// Clear the search bar and reset the search term
	const clearSearch = () => {
		setSearchTerm('');
		onSearchTermChange(''); // Reset search term in the parent component
	};

	return (
		<InputGroup width={{ sm: '100%', md: '50%' }} mx='auto' my={4}>
			<InputLeftElement
				pointerEvents='none'
				children={<SearchIcon color='gray.500' />}
			/>
			<Input
				type='text'
				value={searchTerm}
				onChange={handleInputChange}
				placeholder='Search...'
				rounded='full'
				size='md'
				fontSize='md'
				fontWeight='500'
				bg='white'
				_focus={{ borderColor: '#E0B960' }} // Brand color on focus
			/>
			{searchTerm && (
				<IconButton
					aria-label='Clear search'
					icon={<CloseIcon />}
					onClick={clearSearch}
					size='sm'
					position='absolute'
					right='2'
					top='50%'
					transform='translateY(-50%)'
					bg='transparent'
					_hover={{ bg: 'transparent' }}
				/>
			)}
		</InputGroup>
	);
};

export default SearchBar;
