'use client';

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
			width={{ base: '260px', md: '320px' }}
			placeholder='Select a Team'
			onChange={handleManager}
			cursor='pointer'
			borderWidth='1px'
			borderRadius='md'
			boxShadow='md'
			isDisabled={isDisabled}
			_selected={{
				bg: 'brand.500',
				color: 'white',
				borderColor: 'brand.500',
			}}
			_focus={{
				boxShadow: 'outline',
			}}
			px={2}
			// py={2}
		>
			{/* <option value="allManagers">All Managers</option> */}
			{managerList.map((manager) => (
				<option key={manager._id} value={manager._id}>
					Team: {manager.name}
				</option>
			))}
		</Select>
	);
};

export default SelectManager;
