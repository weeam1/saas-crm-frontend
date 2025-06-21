import { Select } from '@chakra-ui/react';

const SelectManager = ({
	selectedManager,
	handleManager,
	managerList,
	isDisabled,
}) => {
	if (isDisabled) return null;

	return (
		<Select
			size='md'
			value={selectedManager}
			width={{ base: 'full', md: '320px' }}
			placeholder='Select a Team'
			onChange={handleManager}
			cursor='pointer'
			bg='brand.200'
			color='gray.800'
			outline='none'
			isDisabled={isDisabled}
			_focus={{
				outline: 'none',
			}}
			fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}
			// px={2}
		>
			{managerList.map((manager) => (
				<option key={manager._id} value={manager._id}>
					Team: {manager.name}
				</option>
			))}
		</Select>
	);
};

export default SelectManager;
