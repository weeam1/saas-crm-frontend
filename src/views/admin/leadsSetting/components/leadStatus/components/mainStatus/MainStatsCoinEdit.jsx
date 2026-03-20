// MainStatusCoinEdit.js
import React, { useState } from "react";
import {
  Flex,
  Text,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Portal,
  Badge,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
} from "@chakra-ui/react";
import { useUpdateItemMutation } from "api/apiSlice";
import { FaCoins, FaPencilAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const MainStatusCoinEdit = ({ status, updateData, refetchMainStatuses }) => {
  const [newCoins, setNewCoins] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [updateStatus, { isLoading: isUpdating }] = useUpdateItemMutation();

  const handleSaveCoins = async () => {
    if (newCoins === "" || newCoins === null) {
      toast.error("Please enter a valid coin amount");
      return;
    }

    try {
      const res = await updateStatus({
        path: `/lead/main-status/${status._id}`,
        body: {
          coinCost: Number(newCoins),
        },
      }).unwrap();

      toast.success("Coin cost updated successfully!");

      setNewCoins("");
      setIsOpen(false);
      if (refetchMainStatuses) {
        await refetchMainStatuses();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update coin cost!");
    }
  };

  return (
    <Flex align="center" justify="center" gap={2}>
      {/* Coins Display */}
      <Flex align="center" gap={2}>
        <FaCoins size={14} strokeWidth={1.5} color="#e2a814ff" />
        {status.coinCost !== undefined &&
        status.coinCost !== null &&
        status.coinCost > 0 ? (
          <Badge colorScheme="green" px={2} py={1} borderRadius="full">
            {status.coinCost}
          </Badge>
        ) : (
          <Text fontSize="xs" color="gray.400">
            —
          </Text>
        )}
      </Flex>

      {/* Edit Trigger */}
      <Popover
        placement="bottom-start"
        isLazy
        closeOnBlur={!isUpdating}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <PopoverTrigger>
          <IconButton
            aria-label="Edit coin cost"
            icon={<FaPencilAlt size={12} />}
            variant="ghost"
            size="xs"
            opacity={0.6}
            onClick={() => setIsOpen(true)}
            _hover={{
              opacity: 1,
              bg: "gray.100",
            }}
          />
        </PopoverTrigger>

        <Portal>
          <PopoverContent
            w="280px"
            borderRadius="14px"
            p={3}
            boxShadow="0px 6px 24px rgba(0,0,0,0.12)"
            zIndex={2000}
            border="1px solid"
            borderColor="gray.100"
            bg="white"
          >
            <PopoverArrow />
            <PopoverBody>
              <Flex direction="column" gap={4}>
                <Text fontSize="sm" fontWeight="600" color="gray.700">
                  Update Coin Cost
                </Text>

                <Text fontSize="xs" color="gray.500">
                  Current: {status.coinCost || 0} coins
                </Text>
                <Text fontSize="xs" color="gray.500" mt={-2}>
                  Status: {status.label}
                </Text>

                {/* Number Input */}
                <NumberInput
                  size="sm"
                  value={newCoins}
                  onChange={(valueString) => setNewCoins(valueString)}
                  min={0}
                  step={1}
                >
                  <NumberInputField
                    placeholder="Enter new coin cost"
                    fontSize="sm"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                {/* Action Buttons */}
                <Flex gap={2}>
                  <Button
                    size="sm"
                    flex={1}
                    borderRadius="8px"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    flex={1}
                    borderRadius="8px"
                    bg="green.500"
                    color="white"
                    fontWeight="600"
                    _hover={{
                      bg: "green.600",
                    }}
                    onClick={handleSaveCoins}
                    isLoading={isUpdating}
                    isDisabled={isUpdating}
                  >
                    Save
                  </Button>
                </Flex>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Flex>
  );
};

export default MainStatusCoinEdit;
