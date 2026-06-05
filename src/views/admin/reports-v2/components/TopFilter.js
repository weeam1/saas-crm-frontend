import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { useModalColors } from 'hooks/useModalColors';

const TopFilter = ({ view, setView, options }) => {
	const colors = useModalColors();

	return (
		<Menu>
			<MenuButton
				as={Button}
				rightIcon={<FiChevronDown />}
				variant='ghost'
				rounded='md'
				size='sm'
				bg={colors.bgInput}
				color={colors.bodyText}
				border="1px solid"
				borderColor={colors.borderColor}
				_hover={{
					bg: colors.bgInputHover,
					color: colors.accentGold,
					borderColor: colors.accentGold,
				}}
				transition='all 0.2s ease'
			>
				{options.find((item) => item.value === view)?.label || 'Select View'}
			</MenuButton>
			<MenuList
				bg={colors.bg}
				borderColor={colors.borderColor}
				boxShadow={colors.cardShadow}
			>
				{options.map((item) => (
					<MenuItem
						key={item.value}
						onClick={() => setView(item.value)}
						bg={colors.bg}
						color={colors.bodyText}
						_hover={{
							bg: colors.bgInputHover,
							color: colors.accentGold,
						}}
						transition='all 0.2s ease'
					>
						{item.label}
					</MenuItem>
				))}
			</MenuList>
		</Menu>
	);
};

export default TopFilter;