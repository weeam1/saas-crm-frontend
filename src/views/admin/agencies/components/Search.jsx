import { SearchIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Flex,
	Input,
	InputGroup,
	InputLeftElement,
} from '@chakra-ui/react';
import React from 'react';
import { BiX } from 'react-icons/bi';
import { IoSearchOutline } from 'react-icons/io5';
import { buttonStyle } from 'views/admin/attendance/constants';

function Search({ searchTermRef, handleSearch, searchClear, handleClear }) {
	const handleInputChange = (event) => {
		searchTermRef.current = event.target.value;
	};
	return (
		<Box mb={{ base: 3, md: 5 }} display='flex' alignItems='center' gap='2'>
			{/* Search Input & Button */}
			<InputGroup
				bg='white'
				border='1px solid'
				borderColor='softGray.600'
				borderRadius='md'
				width={{ base: '100%', md: '18rem' }}
				overflow='hidden'
			>
				<Input
					id='searchInput'
					placeholder='Search'
					border='none'
					fontSize='xs'
					height='2.2rem'
					onChange={handleInputChange}
					onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
					_focus={{ boxShadow: 'none' }}
				/>
				<Button
					size='md'
					bg='softGray.700'
					borderLeft='1px solid'
					borderColor='softGray.600'
					px={4}
					borderRadius='0'
					fontSize='xs'
					display='flex'
					alignItems='center'
					_hover={{ bg: 'gray.50' }}
					_active={{ bg: 'gray.100' }}
					onClick={handleSearch}
				>
					<Flex align='center'>
						Search <SearchIcon fontSize='xs' color='brand.500' ml={1} />
					</Flex>
				</Button>
			</InputGroup>

			{searchClear && (
				<Button
					{...buttonStyle}
					variant='solid'
					bg='red.400'
					w='fit-content'
					color='white'
					sx={{
						svg: {
							fill: 'white',
						},
					}}
					leftIcon={<BiX />}
					aria-label='Clear'
					onClick={handleClear}
				>
					Clear
				</Button>
			)}
		</Box>
	);
}

export default Search;
