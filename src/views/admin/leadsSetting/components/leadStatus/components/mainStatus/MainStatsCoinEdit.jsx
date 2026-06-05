import React, { useState, useEffect } from "react";
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
import { useModalColors } from "hooks/useModalColors";

const MainStatusCoinEdit = ({ status, updateData, refetchMainStatuses }) => {
  const colors = useModalColors();
  const [newCoins, setNewCoins] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [updateStatus, { isLoading: isUpdating }] = useUpdateItemMutation();

  // Set the current coin value when popover opens
  useEffect(() => {
    if (isOpen && status.coinCost !== undefined && status.coinCost !== null) {
      setNewCoins(String(status.coinCost));
    }
  }, [isOpen, status.coinCost]);

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
        <FaCoins size={14} strokeWidth={1.5} color={colors.accentGold} />
        {status.coinCost !== undefined &&
        status.coinCost !== null &&
        status.coinCost > 0 ? (
          <Badge
            bg={`rgba(212, 175, 55, 0.15)`}
            color={colors.accentGold}
            px={2}
            py={1}
            borderRadius="full"
            fontSize="xs"
            fontWeight="medium"
          >
            {status.coinCost}
          </Badge>
        ) : (
          <Text fontSize="xs" color={colors.mutedText}>
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
        onClose={() => {
          setIsOpen(false);
          setNewCoins("");
        }}
      >
        <PopoverTrigger>
          <IconButton
            aria-label="Edit coin cost"
            icon={<FaPencilAlt size={12} />}
            variant="ghost"
            size="xs"
            opacity={0.6}
            onClick={() => setIsOpen(true)}
            color={colors.bodyText}
            _hover={{
              opacity: 1,
              bg: colors.bgInput,
              color: colors.accentGold,
              transform: "scale(1.05)",
            }}
            transition="all 0.2s ease"
          />
        </PopoverTrigger>

        <Portal>
          <PopoverContent
            w="280px"
            borderRadius="14px"
            p={3}
            boxShadow={colors.modalShadow}
            zIndex={2000}
            border="1px solid"
            borderColor={colors.borderColor}
            bg={colors.bg}
          >
            <PopoverArrow bg={colors.bg} borderColor={colors.borderColor} />
            <PopoverBody>
              <Flex direction="column" gap={4}>
                <Text fontSize="sm" fontWeight="600" color={colors.headingText}>
                  Update Coin Cost
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
                    bg={colors.bgInput}
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _hover={{
                      borderColor: colors.accentGold,
                    }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper
                      borderColor={colors.borderColor}
                      color={colors.bodyText}
                      _hover={{ bg: colors.bgInputHover }}
                    />
                    <NumberDecrementStepper
                      borderColor={colors.borderColor}
                      color={colors.bodyText}
                      _hover={{ bg: colors.bgInputHover }}
                    />
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
                    color={colors.bodyText}
                    _hover={{
                      bg: colors.bgInput,
                      color: colors.headingText,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    flex={1}
                    borderRadius="8px"
                    bg={colors.accentGold}
                    color={colors.headerText}
                    fontWeight="600"
                    _hover={{
                      bg: colors.goldLight,
                      transform: "translateY(-1px)",
                      boxShadow: colors.goldGlow,
                    }}
                    _active={{
                      bg: colors.goldDark,
                      transform: "translateY(0)",
                    }}
                    onClick={handleSaveCoins}
                    isLoading={isUpdating}
                    isDisabled={isUpdating}
                    transition="all 0.2s ease"
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