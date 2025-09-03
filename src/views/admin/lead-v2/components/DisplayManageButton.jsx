import React from "react";
import { Flex, Button } from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
const DisplayManageButton = ({
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
          <Button
            key={`status-${status}`}
            size="sm"
            bg={"blue.100"}
            color={"blue.800"}
            borderRadius="md"
            fontSize="sm"
            fontWeight="medium"
            height="32px"
            px={3}
            _hover={{
              bg: "blue.50",
              color: "blue.700",
            }}
            _active={{
              bg: "blue.200",
              color: "blue.900",
            }}
            border="1px solid"
            borderColor="blue.200"
            rightIcon={<SmallCloseIcon boxSize={3} />}
            onClick={() => onRemoveStatus(status)}
          >
            {getLabel(status, statusOptions)}
          </Button>
        ))}

      {selectedMstatus.length > 0 &&
        selectedMstatus.map((mstatus) => (
          <Button
            key={`mstatus-${mstatus}`}
            size="sm"
            bg={"brand.100"}
            color={"brand.800"}
            borderRadius="md"
            fontSize="sm"
            fontWeight="medium"
            height="32px"
            px={3}
            _hover={{
              bg: "brand.50",
              color: "brand.700",
            }}
            _active={{
              bg: "brand.200",
              color: "brand.900",
            }}
            border="1px solid"
            borderColor="brand.200"
            rightIcon={<SmallCloseIcon boxSize={3} />}
            onClick={() => onRemoveMstatus(mstatus)}
          >
            {getLabel(mstatus, mstatusOptions)}
          </Button>
        ))}
    </Flex>
  );
};

export default DisplayManageButton;
