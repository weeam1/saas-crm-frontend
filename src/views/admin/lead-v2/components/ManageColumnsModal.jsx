import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Checkbox,
  Grid,
  Box,
  Text,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

const ManageColumnsModal = ({
  isOpen,
  onClose,
  statusOptions,
  mstatusOptions,
  selectedStatus,
  selectedMstatus,
  onStatusChange,
  onMstatusChange,
}) => {
  // Handle light/dark mode
  const headerBg = useColorModeValue("brand.500", "brand.400");
  const footerBg = useColorModeValue("brand.50", "brand.900");
  const textColor = useColorModeValue("white", "gray.100");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent mx={4} maxH="75vh" h="75vh" maxW="90vw">
        {/* Header*/}
        <ModalHeader
          pb={2}
          bg={headerBg}
          color={textColor}
          borderTopRadius="md"
        >
          Quick Filter
        </ModalHeader>
        <ModalCloseButton color={textColor} />
        <ModalBody pb={6} overflowY="auto" flex="1">
          {/* Status Section */}
          <Box mb={6}>
            <Text fontWeight="semibold" mb={3}>
              Status
            </Text>
            <Grid
              templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
              gap={3}
            >
              {statusOptions.map((option) => (
                <Checkbox
                  key={option.value}
                  isChecked={selectedStatus.includes(option.value)}
                  onChange={(e) =>
                    onStatusChange(option.value, e.target.checked)
                  }
                  colorScheme="blue"
                  size="lg"
                  p={2}
                >
                  <Text
                    fontWeight={
                      selectedStatus.includes(option.value)
                        ? "medium"
                        : "normal"
                    }
                  >
                    {option.label}
                  </Text>
                </Checkbox>
              ))}
            </Grid>
          </Box>

          {/* MStatus Section */}
          <Box>
            <Text fontWeight="semibold" mb={3}>
              MStatus
            </Text>
            <Grid
              templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
              gap={3}
            >
              {mstatusOptions.map((option) => (
                <Checkbox
                  key={option.value}
                  isChecked={selectedMstatus.includes(option.value)}
                  onChange={(e) =>
                    onMstatusChange(option.value, e.target.checked)
                  }
                  colorScheme="brand"
                  size="lg"
                  p={2}
                >
                  <Text
                    fontWeight={
                      selectedMstatus.includes(option.value)
                        ? "medium"
                        : "normal"
                    }
                  >
                    {option.label}
                  </Text>
                </Checkbox>
              ))}
            </Grid>
          </Box>
        </ModalBody>

        {/* Footer */}
        <ModalFooter bg={footerBg} borderBottomRadius="md">
          <Button colorScheme="brand" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ManageColumnsModal;
