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
  FormLabel,
  Text,
} from "@chakra-ui/react";
import { useFetchItemsQuery } from "api/apiSlice";
import { buttonStyle } from "../../constants";
import { useModalColors } from "hooks/useModalColors";

const AgencyFilter = ({
  isOpen,
  onClose,
  handleApplyFilter,
  selectedAgency,
  setSelectedAgency,
}) => {
  const { data: agencies } = useFetchItemsQuery({ path: "/agencies" });
  const { bg, headerBg, headerText, footerBg, borderColor } = useModalColors();
  const handleChange = (e) => {
    const selectedId = e.target.value;
    setSelectedAgency(
      agencies?.doc?.find((agency) => agency._id === selectedId) || null
    );
  };

  return (
    <>
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
        <ModalContent borderRadius="2xl" overflow="hidden">
          <ModalHeader
            display="flex"
            align="center"
            justify="space-between"
            bg={headerBg}
            color={headerText}
            px={6}
            py={3}
            borderBottom="1px solid"
            borderColor={borderColor}
            position="sticky"
            top="0"
            zIndex="10"
          >
            <Text fontSize="lg" fontWeight="bold">
              Add Invoice
            </Text>
            <ModalCloseButton
              position="absolute"
              right="12px"
              top="10px"
              color={headerText}
              _hover={{ bg: "whiteAlpha.200" }}
            />
          </ModalHeader>
          <ModalBody
            p={5}
            overflowY="auto"
            scrollBehavior="smooth"
            sx={{
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": {
                background: "#c1c1c1",
                borderRadius: "10px",
              },
            }}
          >
            <FormLabel fontSize="md">Select Agency</FormLabel>
            <Select value={selectedAgency?._id ?? ""} onChange={handleChange}>
              <option value="">All</option>
              {agencies?.doc?.map((agency) => (
                <option key={agency._id} value={agency._id}>
                  {agency.name}
                </option>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter
            bg={footerBg}
            borderTop="1px solid"
            borderColor={borderColor}
            position="sticky"
            bottom="0"
            zIndex="10"
            py={3}
            px={5}
            justifyContent="flex-end"
            gap={3}
          >
            <Button
              variant="outline"
              borderRadius="md"
              size="sm"
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              {...buttonStyle}
              variant="solid"
              bg="brand.400"
              size="sm"
              borderRadius="md"
              aria-label="update"
              onClick={() => handleApplyFilter(selectedAgency?._id)}
            >
              Apply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AgencyFilter;
