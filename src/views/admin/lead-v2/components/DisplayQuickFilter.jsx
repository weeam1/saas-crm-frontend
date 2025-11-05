import React from "react";
import { Flex, Box } from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";

const DisplayQuickFilter = ({
  selectedStatus,
  selectedMstatus,
  statusOptions,
  mstatusOptions,
  onRemoveStatus,
  onRemoveMstatus,
}) => {
  const getLabel = (value, options) => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  if (selectedStatus.length === 0 && selectedMstatus.length === 0) {
    return null;
  }

  return (
    <Flex gap={2} flexWrap="wrap" mt={2} mb={4} align="center">
      {selectedStatus.length > 0 &&
        selectedStatus.map((status) => (
          <Box
            key={`status-${status}`}
            size="sm"
            bg={"blue.100"}
            color={"blue.800"}
            borderRadius="md"
            fontSize="sm"
            fontWeight="medium"
            px={3}
            py={2}
            border="1px solid"
            borderColor="blue.200"
          >
            {getLabel(status, statusOptions)}{" "}
            <SmallCloseIcon
              boxSize={3}
              onClick={() => onRemoveStatus(status)}
              cursor={"pointer"}
            />
          </Box>
        ))}

      {selectedMstatus.length > 0 &&
        selectedMstatus.map((mstatus) => (
          <Box
            key={`mstatus-${mstatus}`}
            size="sm"
            bg={"brand.100"}
            color={"brand.800"}
            borderRadius="md"
            fontSize="sm"
            fontWeight="medium"
            px={3}
            py={2}
            border="1px solid"
            borderColor="brand.200"
          >
            {getLabel(mstatus, mstatusOptions)}{" "}
            <SmallCloseIcon
              boxSize={3}
              cursor={"pointer"}
              onClick={() => onRemoveMstatus(mstatus)}
            />
          </Box>
        ))}
    </Flex>
  );
};

export default DisplayQuickFilter;
