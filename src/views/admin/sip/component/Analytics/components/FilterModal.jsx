import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Select,
  Button,
} from "@chakra-ui/react";
import moment from "moment";
import React from "react";

const FilterModal = ({
  isOpen,
  onClose,
  tempMonth,
  setTempMonth,
  tempYear,
  setTempYear,
  handleDateFilter,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Month and Year</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <Select
              placeholder="Select Month"
              value={tempMonth}
              onChange={(e) => setTempMonth(e.target.value)}
              focusBorderColor="goldenrod"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {moment().month(i).format("MMMM")}
                </option>
              ))}
            </Select>

            <Select
              placeholder="Select Year"
              value={tempYear}
              onChange={(e) => setTempYear(e.target.value)}
              focusBorderColor="goldenrod"
            >
              {Array.from({ length: 10 }, (_, i) => {
                const year = moment().year() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </Select>

            <Button
              bg="goldenrod"
              color="white"
              w="100%"
              _hover={{ bg: "goldenrod", opacity: 0.9 }}
              onClick={handleDateFilter}
            >
              Apply
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FilterModal;
