import {
	Input,
	InputGroup,
	InputRightElement,
	Button,
	HStack,
	Box,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import DateFilterButton from './DateFilterButton';
import { buttonStyle } from './constants';
import { BiX } from 'react-icons/bi';

const SearchBox = ({
	dateTimeOnOpen,
	setAdvanceSearch,
	searchClear,
	handleClear,
	handleSearchByName,
	searchTerm,
	setSearchTerm,
}) => {
	const handleInputChange = (e) => {
		setSearchTerm(e.target.value);
	};

	return (
		<Box
			// alignSelf='end'
			width={{ base: '100%', lg: 'fit-content' }}
			bg='softGray.50'
			p='2'
			borderRadius='md'
		>
			<HStack spacing={3} gap='2' flexDirection={{ base: 'column', md: 'row' }}>
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
						placeholder='name..'
						border='none'
						fontSize='xs'
						height='2.2rem'
						value={searchTerm}
						onChange={handleInputChange}
						onKeyDown={(e) => e.key === 'Enter' && handleSearchByName()}
						_focus={{ boxShadow: 'none' }}
					/>
					<InputRightElement width='auto'>
						<Button
							size='md'
							bg='softGray.700'
							borderLeft='1px solid'
							borderColor='softGray.600'
							px={4}
							borderRadius='0'
							fontSize='xs'
							_hover={{ bg: 'gray.50' }}
							_active={{ bg: 'gray.100' }}
							onClick={handleSearchByName}
						>
							Search <SearchIcon fontSize='xs' color='brand.500' ml={1} />
						</Button>
					</InputRightElement>
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

					<DateFilterButton onClick={dateTimeOnOpen} />

					{searchClear && (
						<Button
							{...buttonStyle}
							variant='solid'
							bg='red.400'
							color='white'
							py='2'
							px='5'
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
				</HStack>
			</HStack>
		</Box>
	);
};

export default SearchBox;
