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
import { useModalColors } from 'hooks/useModalColors';

function Search({ searchTermRef, handleSearch, searchClear, handleClear }) {
	const colors = useModalColors();

	const handleInputChange = (event) => {
		searchTermRef.current = event.target.value;
	};

	return (
		<Box mb={{ base: 3, md: 5 }} display='flex' alignItems='center' gap='2' flexWrap='wrap'>
			{/* Search Input & Button */}
			<Flex
				bg={colors.bg}
				border='1px solid'
				borderColor={colors.borderColor}
				borderRadius='md'
				width={{ base: '100%', md: '18rem' }}
				overflow='hidden'
				alignItems='stretch'
			>
				<Input
					id='searchInput'
					placeholder='Search'
					border='none'
					fontSize='xs'
					height='2.5rem'
					flex='1'
					color={colors.headingText}
					_placeholder={{ color: colors.mutedText }}
					onChange={handleInputChange}
					onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
					_focus={{ boxShadow: 'none', outline: 'none' }}
					bg={colors.bg}
				/>
				<Button
					size='md'
					bg={colors.bgInput}
					borderLeft='1px solid'
					borderColor={colors.borderColor}
					px={4}
					borderRadius='0'
					fontSize='xs'
					display='flex'
					alignItems='center'
					justifyContent='center'
					color={colors.bodyText}
					_hover={{ bg: colors.bgDeep, color: colors.accentGold }}
					_active={{ bg: colors.bgDeep }}
					onClick={handleSearch}
					height='2.5rem'
				>
					<Flex align='center' gap={1}>
						Search <SearchIcon fontSize='xs' color={colors.accentGold} />
					</Flex>
				</Button>
			</Flex>

			{searchClear && (
				<Button
					variant='ghost'
					w='fit-content'
					color={colors.badgeErrorText}
					leftIcon={<BiX />}
					aria-label='Clear'
					onClick={handleClear}
					_hover={{ bg: colors.badgeErrorBg, color: colors.badgeErrorText }}
					height='2.5rem'
				>
					Clear
				</Button>
			)}
		</Box>
	);
}

export default Search;