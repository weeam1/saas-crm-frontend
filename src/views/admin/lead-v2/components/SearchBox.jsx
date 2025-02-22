import {
	Input,
	InputGroup,
	InputRightElement,
	Button,
	HStack,
	Box,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

const SearchBox = () => {
	return (
		<Box
			alignSelf='end'
			width='fit-content'
			bg='softGray.50'
			p='2'
			borderRadius='md'
		>
			<HStack spacing={3}>
				{/* Search Input & Button */}
				<InputGroup
					bg='white'
					border='1px solid'
					borderColor='softGray.600'
					borderRadius='md'
					width={{ base: 'fit-content', md: '18rem' }}
					overflow='hidden'
				>
					<Input
						placeholder='name..'
						border='none'
						fontSize='xs'
						height='2.2rem' // 🔽 Reduced height
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
						>
							Search <SearchIcon fontSize='xs' color='brand.500' ml={1} />
						</Button>
					</InputRightElement>
				</InputGroup>

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
					height='2.2rem' // 🔽 Adjusted height for consistency
					_hover={{ bg: 'gray.50' }}
					_active={{ bg: 'gray.100' }}
				>
					Advance Search
				</Button>
			</HStack>
		</Box>
	);
};

export default SearchBox;
