import { Checkbox } from '@chakra-ui/react';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

const AllCheckBox = ({
	// leads,
	selectedValues,
	setSelectedLeads,
	setSelectedValues,
	setSelectAllChecked,
}) => {
	const leads = useSelector((state) => state.leads, shallowEqual);

	const Ids = leads?.doc?.map((lead) => lead._id) || [];

	const handleChecked = () => {
		setSelectAllChecked(true);
		setSelectedValues(selectedValues.length === Ids.length ? [] : Ids);
		setSelectedLeads(leads?.doc);
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
