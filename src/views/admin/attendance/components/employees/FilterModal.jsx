import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Select,
  FormControl,
  FormLabel,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useFetchItemsQuery } from "api/apiSlice";
import { buttonStyle, getLocalAttendanceFilter } from "../../constants";
import { useSearchParams } from "react-router-dom";

const FilterModal = ({ isOpen, onClose, updateFilters, setSearchClear }) => {
  const { data: agencies } = useFetchItemsQuery({ path: "/agencies" });
  const [searchParams] = useSearchParams();

  const currentAgency =
    searchParams.get("agency") || getLocalAttendanceFilter() || "";

  const [selectedAgency, setSelectedAgency] = useState(currentAgency);

  // Update local state when modal opens
  useEffect(() => {
    if (isOpen) setSelectedAgency(currentAgency);
  }, [isOpen, currentAgency]);

  const handleApplyFilters = () => {
    updateFilters({ agency: selectedAgency, page: 1 });
    if (selectedAgency !== "") setSearchClear(true);

    localStorage.setItem("attendanceAgencyFilter", selectedAgency);
    onClose();
  };

  const bgColor = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("brand.300", "brand.100");
  const headerText = useColorModeValue("brand.700", "brand.900");
  const footerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const isFilterUnchanged = selectedAgency === currentAgency;

  return (
    <Modal
      fontFamily="'DM Sans', sans-serif"
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      isCentered
      scrollBehavior="inside"
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent
        bg={bgColor}
        borderRadius="2xl"
        shadow="2xl"
        maxW={{ base: "full", sm: "90vw", md: "500px" }}
        overflow="hidden"
        mx={{ base: 3, md: 0 }}
      >
        {/* Header */}
        <ModalHeader p={0} borderBottom="1px solid" borderColor={borderColor}>
          <Flex
            bg={headerBg}
            color={headerText}
            px={6}
            py={3}
            position="sticky"
            top="0"
            zIndex="10"
            boxShadow="md"
          >
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
              Agency Filter
            </Text>
            <ModalCloseButton
              position="absolute"
              right="12px"
              top="10px"
              color={headerText}
              _hover={{ bg: "whiteAlpha.200" }}
            />
          </Flex>
        </ModalHeader>

        {/* Body */}
        <ModalBody p={5} borderBottom="1px solid" borderColor={borderColor}>
          <FormControl>
            <FormLabel fontWeight="semibold">Select Agency</FormLabel>
            <Select
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
              placeholder="All"
              focusBorderColor="brand.500"
            >
              <option value="">All</option>
              {agencies?.doc?.map((agency) => (
                <option key={agency._id} value={agency.name}>
                  {agency.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>

        {/* Footer */}
        <ModalFooter
          position="sticky"
          bottom="0"
          bg={footerBg}
          borderTop="1px solid"
          borderColor={borderColor}
          py={3}
          px={5}
          zIndex="10"
          justifyContent="flex-end"
          gap={3}
        >
          <Button
            variant="outline"
            colorScheme="gray"
            size="sm"
            borderRadius="md"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            colorScheme="brand"
            size="sm"
            borderRadius="md"
            onClick={handleApplyFilters}
            isDisabled={isFilterUnchanged}
          >
            Apply
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FilterModal;
