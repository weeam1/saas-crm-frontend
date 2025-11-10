import React from 'react';
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Button,
	Text,
	HStack,
	Box,
} from '@chakra-ui/react';
import { ChevronDownIcon, CheckIcon } from '@chakra-ui/icons';

const DropdownMenu = ({
	options,
	selectedValue,
	onSelect,
	placeholder = 'Select an option',
	isDisabled = false,
	isLoading = false,
	size = 'md',
	variant = 'outline',
	leftIcon,
	rightIcon = <ChevronDownIcon />,
	minWidth = '200px',
	maxWidth,
	buttonProps = {},
	menuListProps = {},
	menuItemProps = {},
}) => {
	// Find selected option
	const selectedOption = options.find(
		(option) => option.value === selectedValue
	);
	const displayText = selectedOption?.label || placeholder;

	// Size configurations
	const sizeConfig = {
		sm: { fontSize: 'xs', py: 1 },
		md: { fontSize: 'sm', py: 2 },
		lg: { fontSize: 'md', py: 3 },
	};

	return (
		<Menu>
			<MenuButton
				as={Button}
				rightIcon={rightIcon}
				leftIcon={leftIcon}
				variant={variant}
				minW={minWidth}
				maxW={maxWidth}
				justifyContent='space-between'
				bg='white'
				size={size}
				fontSize={sizeConfig[size].fontSize}
				fontWeight='medium'
				borderWidth='2px'
				borderRadius='lg'
				borderColor='gray.200'
				_hover={{
					borderColor: 'brand.300',
					boxShadow: '0 0 0 1px brand.200',
				}}
				_focus={{
					borderColor: 'brand.500',
					boxShadow: '0 0 0 2px brand.200',
				}}
				_disabled={{
					opacity: 0.6,
					cursor: 'not-allowed',
				}}
				_expanded={{
					bg: 'brand.50',
					borderColor: 'brand.200',
				}}
				isDisabled={isDisabled || isLoading}
				textAlign='left'
				transition='all 0.2s ease'
				py={sizeConfig[size].py}
				{...buttonProps}
			>
				{displayText}
			</MenuButton>

			<MenuList
				py={2}
				borderColor='gray.200'
				boxShadow='lg'
				minW={minWidth}
				maxW={maxWidth}
				maxH='300px'
				zIndex={2}
				overflowY='auto'
				fontSize={sizeConfig[size].fontSize}
				transition='all 0.15s ease-in-out'
				transformOrigin='top'
				{...menuListProps}
			>
				{options.map((option) => (
					<Box key={option.value}>
						<MenuItem
							onClick={() => !option.disabled && onSelect(option.value)}
							bg={selectedValue === option.value ? 'brand.50' : 'transparent'}
							color={
								selectedValue === option.value
									? 'brand.600'
									: option.disabled
										? 'gray.400'
										: 'gray.700'
							}
							_hover={
								!option.disabled
									? {
											bg: 'brand.50',
											color: 'brand.600',
										}
									: {}
							}
							py={sizeConfig[size].py}
							isDisabled={option.disabled}
							cursor={option.disabled ? 'not-allowed' : 'pointer'}
							opacity={option.disabled ? 0.5 : 1}
							{...menuItemProps}
						>
							<HStack justify='space-between' w='100%'>
								<Text fontWeight='medium' noOfLines={1}>
									{option.label}
								</Text>
								{selectedValue === option.value && (
									<CheckIcon color='brand.500' boxSize={3} />
								)}
							</HStack>
						</MenuItem>
					</Box>
				))}
			</MenuList>
		</Menu>
	);
};

export default DropdownMenu;
