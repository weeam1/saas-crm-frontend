import {
	Input,
	InputGroup,
	InputRightElement,
	Button,
	HStack,
	Box,
	Flex,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
// import DateFilterButton from './DateFilterButton';

const SearchBox = ({
	dateTimeOnOpen,
	setAdvanceSearch,
	handleSearchByName,
	searchTermRef,
}) => {
	const handleInputChange = (event) => {
		searchTermRef.current = event.target.value;
	};

	return (
		<Box
			// alignSelf='end'
			width={{ base: '100%', lg: 'fit-content' }}
			bg='softGray.50'
			p='1'
			borderRadius='md'
		>
			<HStack
				spacing={3}
				gap='2'
				display='flex'
				justifyContent={{ base: 'center' }}
				flexDirection={{ base: 'column', md: 'row' }}
			>
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
						placeholder='search..'
						border='none'
						fontSize='xs'
						height='2.2rem'
						onChange={handleInputChange}
						onKeyDown={(e) => e.key === 'Enter' && handleSearchByName()}
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
						onClick={handleSearchByName}
					>
						<Flex align='center'>
							Search <SearchIcon fontSize='xs' color='brand.500' ml={1} />
						</Flex>
					</Button>
				</InputGroup>

				<HStack gap='2'>
					{/* Advance Search Button */}
					<Button
						border='1px solid'
						borderColor='softGray.600'
						bg='white'
						borderRadius='md'
						px={4}
						fontSize='xs'
						w='auto'
						minW='max-content'
						height='2.2rem'
						_hover={{ bg: 'gray.50' }}
						_active={{ bg: 'gray.100' }}
						onClick={() => setAdvanceSearch(true)}
					>
						Advance Search
					</Button>
				</HStack>
			</HStack>
		</Box>
	);
};

export default SearchBox;
