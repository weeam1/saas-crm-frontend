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

	const clearSearch = () => {
		if (inputRef.current) {
			inputRef.current.value = '';
			onSearch('');
		}
	};

	return (
		<InputGroup
			minW={{ base: '100%', md: '240px' }}
			position='relative'
		>
			<InputLeftElement pointerEvents='none' height='44px'>
				<SearchIcon color='text.accent' />
			</InputLeftElement>

			<Input
				ref={inputRef}
				type='text'
				placeholder='Search...'
				bg='bg.input'
				borderColor='border.default'
				borderWidth='2px'
				borderRadius='lg'
				color='text.heading'
				pl={10}
				fontSize='sm'
				transition='all 0.15s ease'
				_placeholder={{
					color: 'text.muted',
					fontSize: 'sm',
				}}
				_hover={{
					borderColor: 'border.gold',
					boxShadow: 'goldGlow',
				}}
				_focus={{
					borderColor: 'border.focus',
					boxShadow: 'goldGlow',
					bg: 'bg.surface',
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
					color='text.muted'
					_hover={{ color: 'text.accent' }}
					zIndex={2}
					transition='all 0.2s ease'
				>
					<MdClear />
				</Box>
			)}
		</InputGroup>
	);
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;