import React from "react";
import { Flex, Button } from "@chakra-ui/react";

const DisplayManageButton = ({
  selectedStatus,
  selectedMstatus,
  statusOptions,
  mstatusOptions,
  setChoiceSelectedStatus,
  setChoiceSelectedMstatus,
  choiceSelectedStatus,
  choiceSelectedMstatus,
}) => {
  const getLabel = (value, options) => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  if (selectedStatus.length === 0 && selectedMstatus.length === 0) {
    return null;
  }

  const handleStatusClick = (status) => {
    if (choiceSelectedStatus.includes(status)) {
      setChoiceSelectedStatus(choiceSelectedStatus.filter((s) => s !== status));
    } else {
      setChoiceSelectedStatus([...choiceSelectedStatus, status]);
    }
  };

  const handleMstatusClick = (mstatus) => {
    if (choiceSelectedMstatus.includes(mstatus)) {
      setChoiceSelectedMstatus(
        choiceSelectedMstatus.filter((m) => m !== mstatus)
      );
    } else {
      setChoiceSelectedMstatus([...choiceSelectedMstatus, mstatus]);
    }
  };

  return (
    <Flex gap={2} flexWrap="wrap" mt={2} mb={4} align="center">
      {selectedStatus.length > 0 &&
        selectedStatus.map((status) => (
          <Button
            key={`status-${status}`}
            size="sm"
            bg={choiceSelectedStatus.includes(status) ? "gray.300" : "blue.100"}
            color={
              choiceSelectedStatus.includes(status) ? "gray.500" : "blue.800"
            }
            borderRadius="md"
            fontSize="sm"
            fontWeight="medium"
            height="32px"
            px={3}
            _hover={{ bg: "gray.400" }}
            _active={{ bg: "gray.500" }}
            border="1px solid"
            borderColor="blue.200"
            onClick={() => handleStatusClick(status)}
          >
            {getLabel(status, statusOptions)}
          </Button>
        ))}

      {selectedMstatus.length > 0 &&
        selectedMstatus.map((mstatus) => (
          <Button
            key={`mstatus-${mstatus}`}
            size="sm"
            bg={
              choiceSelectedMstatus.includes(mstatus) ? "gray.300" : "brand.100"
            }
            color={
              choiceSelectedMstatus.includes(mstatus) ? "gray.500" : "brand.800"
            }
            borderRadius="md"
            fontSize="sm"
            fontWeight="medium"
            height="32px"
            px={3}
            _hover={{ bg: "gray.400" }}
            _active={{ bg: "gray.500" }}
            border="1px solid"
            borderColor="brand.200"
            onClick={() => handleMstatusClick(mstatus)}
          >
            {getLabel(mstatus, mstatusOptions)}
          </Button>
        ))}
    </Flex>
  );
};

export default DisplayManageButton;
