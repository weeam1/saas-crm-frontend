import React, { useState, useRef } from 'react';
import { InputGroup, Input, Button, Flex, IconButton, Tooltip } from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import { useModalColors } from 'hooks/useModalColors';

const SearchBox = ({
	searchTerm,
	setSearchTerm,
	onSearchTermChange,
	isLoading = false,
}) => {
	const colors = useModalColors();
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
		<Flex
			bg={colors.bgInput}
			border="1px solid"
			borderColor={colors.borderColor}
			borderRadius="md"
			width={{ base: '100%', md: '18rem' }}
			overflow="hidden"
			_focusWithin={{
				borderColor: colors.accentGold,
				boxShadow: colors.goldGlow,
			}}
			transition="all 0.2s ease"
		>
			<InputGroup flex="1">
				<Input
					ref={inputRef}
					placeholder="Search..."
					border="none"
					fontSize="xs"
					height="2.5rem"
					value={searchTerm}
					onChange={handleChange}
					onKeyDown={handleKeyPress}
					isDisabled={isLoading}
					_focus={{ boxShadow: "none" }}
					_placeholder={{
						color: colors.mutedText,
					}}
					color={colors.headingText}
					bg="transparent"
				/>

				{searchTerm && (
					<Tooltip label="Clear search" hasArrow placement="top">
						<IconButton
							icon={<CloseIcon boxSize={2.5} />}
							size="sm"
							variant="ghost"
							onClick={clearSearch}
							aria-label="clear search"
							position="absolute"
							right="0"
							top="50%"
							transform="translateY(-50%)"
							color={colors.mutedText}
							_hover={{
								color: colors.accentGold,
								transform: "translateY(-50%) scale(1.1)",
							}}
							transition="all 0.2s ease"
						/>
					</Tooltip>
				)}
			</InputGroup>

			<Button
				size="md"
				variant="ghost"
				px={4}
				fontSize="xs"
				onClick={handleSearchClick}
				isLoading={isLoading}
				color={colors.bodyText}
				_hover={{
					color: colors.accentGold,
					bg: colors.bgInputHover,
				}}
				transition="all 0.2s ease"
			>
				<Flex align="center" gap={1}>
					Search
					<SearchIcon
						fontSize="xs"
						color={colors.accentGold}
					/>
				</Flex>
			</Button>
		</Flex>
	);
};

export default SearchBox;