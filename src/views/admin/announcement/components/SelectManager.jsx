import { Select } from '@chakra-ui/react';
import { useModalColors } from 'hooks/useModalColors';

const SelectManager = ({
	selectedManager,
	handleManager,
	managerList,
	isDisabled,
}) => {
	const colors = useModalColors();

	if (isDisabled) return null;

	return (
		<Select
			size='md'
			value={selectedManager}
			width={{ base: 'full', md: '320px' }}
			placeholder='Select a Team'
			onChange={handleManager}
			cursor='pointer'
			bg={colors.bgInput}
			borderColor={colors.borderColor}
			color={colors.headingText}
			outline='none'
			isDisabled={isDisabled}
			_hover={{
				borderColor: colors.accentGold,
			}}
			_focus={{
				borderColor: colors.accentGold,
				boxShadow: `0 0 0 1px ${colors.accentGold}`,
				outline: 'none',
			}}
			fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}
		>
			{managerList.map((manager) => (
				<option
					key={manager._id}
					value={manager._id}
					style={{ background: colors.bg, color: colors.headingText }}
				>
					Team: {manager.name}
				</option>
			))}
		</Select>
	);
};

export default SelectManager;