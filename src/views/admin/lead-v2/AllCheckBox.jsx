import { Checkbox } from '@chakra-ui/react';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

const AllCheckBox = ({
  selectedValues,
  setSelectedLeads,
  setSelectedValues,
  setSelectAllChecked,
  selectAllChecked,
  currentPage,
  pageSize,
  leads
}) => {
  const currentPageLeads = leads?.doc || [];
  const currentPageIds = currentPageLeads.map((lead) => lead._id) || [];

  const handleChecked = () => {
    const newSelectAllChecked = !selectAllChecked;
    setSelectAllChecked(newSelectAllChecked);

    if (newSelectAllChecked) {
      const newSelectedValues = [...new Set([...selectedValues, ...currentPageIds])];
      setSelectedValues(newSelectedValues);
      setSelectedLeads((prev) => {
        const currentPageLeadsSet = new Set(currentPageIds);
        const filteredPrev = prev.filter(lead => !currentPageLeadsSet.has(lead._id));
        return [...filteredPrev, ...currentPageLeads];
      });
    } else {
   
      const currentPageIdsSet = new Set(currentPageIds);
      const newSelectedValues = selectedValues.filter(id => !currentPageIdsSet.has(id));
      setSelectedValues(newSelectedValues);
      setSelectedLeads((prev) => prev.filter(lead => !currentPageIdsSet.has(lead._id)));
    }
  };

  const isCurrentPageFullySelected = currentPageIds.length > 0 && 
    currentPageIds.every(id => selectedValues.includes(id));

  return (
    <Checkbox
      isChecked={isCurrentPageFullySelected}
      isIndeterminate={!isCurrentPageFullySelected && currentPageIds.some(id => selectedValues.includes(id))}
      onChange={handleChecked}
      colorScheme="brand"
      sx={{ ".chakra-checkbox__control": { _focus: { boxShadow: "none" } } }}
    >
      All
    </Checkbox>
  );
};

export default AllCheckBox;