import { Checkbox } from '@chakra-ui/react';
import React from 'react';

const AllCheckBox = ({
	leads,
	selectedValues,
	setSelectedValues,
	setSelectAllChecked,
}) => {
	const Ids = leads?.doc?.map((lead) => lead._id) || [];

	const handleChecked = () => {
		setSelectAllChecked(true);
		setSelectedValues(selectedValues.length === Ids.length ? [] : Ids);
	};

	return (
		<Checkbox
			isChecked={selectedValues.length === Ids.length && Ids.length > 0}
			onChange={handleChecked}
			colorScheme='brand'
		>
			All
		</Checkbox>
	);
};

export default AllCheckBox;
