import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import SearchUsers from "views/admin/whatsapp/WhatsappSettings/SearchUsers";

const AdvancedSearchModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters,
  usersData,
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const colSpan = useBreakpointValue({ base: 1, sm: 1, md: 2 });

  useEffect(() => {
    if (isOpen) {
      setFilters(initialFilters);
    }
  }, [isOpen, initialFilters]);

  const handleApply = () => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== "" && value !== undefined && value !== null
      )
    );
    onApplyFilters(cleanedFilters);
    onClose();
  };

  const handleClear = () => {
    setFilters({});
  };

  const isFilterUnchanged =
    JSON.stringify(filters) === JSON.stringify(initialFilters);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent
        mx={{ base: 2, sm: 4, md: 8 }}
        w={{ base: "95vw", sm: "90vw", md: "500px" }}
      >
        <ModalHeader>Advanced Search</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} overflow="scroll" height="65vh">
            <FormControl>
              <FormLabel>User</FormLabel>
              <SearchUsers
                selectedUserId={filters.userId || null}
                users={usersData?.doc || []}
                onSelectUser={(user) =>
                  setFilters({ ...filters, userId: user?._id || "" })
                }
              />
            </FormControl>
            <SimpleGrid columns={colSpan} gap={4} w="full">
              <FormControl>
                <FormLabel>SIP ID</FormLabel>
                <Input
                  value={filters.sipId || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, sipId: e.target.value })
                  }
                  placeholder="Search by SIP ID"
                  focusBorderColor="brand.500"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Extension ID</FormLabel>
                <Input
                  value={filters.extensionId || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, extensionId: e.target.value })
                  }
                  placeholder="Search by Extension ID"
                  focusBorderColor="brand.500"
                />
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={colSpan} gap={4} w="full">
              <FormControl>
                <FormLabel>SIP IP</FormLabel>
                <Input
                  value={filters.sipIp || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, sipIp: e.target.value })
                  }
                  placeholder="Search by SIP IP"
                  focusBorderColor="brand.500"
                />
              </FormControl>

              <FormControl>
                <FormLabel>SIP Port</FormLabel>
                <Input
                  value={filters.sipPort || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, sipPort: e.target.value })
                  }
                  placeholder="Search by SIP Port"
                  focusBorderColor="brand.500"
                />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel>SIM Number</FormLabel>
              <Input
                value={filters.sipSimNumber || ""}
                onChange={(e) =>
                  setFilters({ ...filters, sipSimNumber: e.target.value })
                }
                placeholder="Search by SIM Number"
                focusBorderColor="brand.500"
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            mr={3}
            onClick={handleClear}
            isDisabled={Object.keys(filters).length === 0}
          >
            Clear
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleApply}
            isDisabled={isFilterUnchanged}
          >
            Apply Filters
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdvancedSearchModal;
