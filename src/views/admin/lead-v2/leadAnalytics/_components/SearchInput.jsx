import { useRef, useEffect, useCallback, useState, memo } from 'react';
import { Input, InputGroup, InputLeftElement, Box } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { MdClear } from 'react-icons/md';

const SearchInput = memo(({ onSearch, isLoading }) => {
	const inputRef = useRef(null);
	const rafId = useRef(null);

	useEffect(() => {
		const handleInput = () => {
			// Cancel previous frame if still pending
			if (rafId.current) cancelAnimationFrame(rafId.current);

			// Schedule new search in next frame
			rafId.current = requestAnimationFrame(() => {
				onSearch(inputRef.current.value.trim());
			});
		};

		const inputEl = inputRef.current;
		inputEl.addEventListener('input', handleInput);

		return () => {
			inputEl.removeEventListener('input', handleInput);
			cancelAnimationFrame(rafId.current);
		};
	}, [onSearch]);

	// useEffect(() => {
	// 	const handleEnter = (e) => {
	// 		if (e.key === 'Enter' && inputRef.current) {
	// 			onSearch(inputRef.current.value.trim());
	// 		}
	// 	};
	// 	const ref = inputRef.current;
	// 	ref?.addEventListener('keydown', handleEnter);
	// 	return () => ref?.removeEventListener('keydown', handleEnter);
	// }, [onSearch]);

	const clearSearch = () => {
		if (inputRef.current) {
			inputRef.current.value = '';
			onSearch('');
		}
	};

	return (
		<InputGroup minW='280px' position='relative'>
			<InputLeftElement pointerEvents='none' height='44px'>
				<SearchIcon color='brand.400' />
			</InputLeftElement>

			<Input
				ref={inputRef}
				type='text'
				placeholder='Search...'
				// onChange={handleChange}
				bg='white'
				borderColor='softGray.400'
				borderWidth='2px'
				borderRadius='lg'
				pl={10}
				fontSize='sm'
				transition='all 0.15s ease'
				_placeholder={{
					color: 'gray.500',
					fontSize: 'sm',
				}}
				_hover={{
					borderColor: 'brand.300',
					boxShadow: `0 0 0 1px brand.200`,
				}}
				_focus={{
					borderColor: 'brand.500',
					boxShadow: `0 0 0 2px brand.200`,
					bg: 'white',
				}}
				_disabled={{
					opacity: 0.6,
					cursor: 'not-allowed',
				}}
				isDisabled={isLoading}
			/>

			{inputRef?.current?.value && (
				<Box
					position='absolute'
					right='12px'
					top='50%'
					transform='translateY(-50%)'
					cursor='pointer'
					onClick={clearSearch}
					color='gray.400'
					_hover={{ color: 'brand.500' }}
					zIndex={2}
				>
					<MdClear />
				</Box>
			)}
		</InputGroup>
	);
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;
