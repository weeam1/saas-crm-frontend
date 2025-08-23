import React from "react";
import {
  Box,
  Flex,
  Text,
  Switch,
  Checkbox,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";
import PermissionIcon from "./PermissionIcon";

const PermissionCard = ({
  module,
  moduleIndex,
  borderColor,
  disabledBorderColor,
  disabledTextColor,
  handleModuleToggle,
  handleSelectAll,
  handleActionToggle,
}) => {
  const cleanModuleName = module.moduleName.replace(/^[\s,]+/, "").trim();

  return (
    <Box
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      bg="white"
      w="full"
      p={4}
      boxShadow="base"
    >
      {/* Module title and Check All */}
      <Flex
        justify="space-between"
        align="center"
        mb={2}
        flexWrap="wrap"
        gap={2}
      >
        <Box
          fontWeight="bold"
          fontSize={{ base: "sm", md: "md", lg: "lg" }}
          display="flex"
          gap={2}
          alignItems="center"
          color="brand.600"
        >
          <PermissionIcon moduleName={cleanModuleName} />

          <Text>{cleanModuleName}</Text>
        </Box>
        <Switch
          colorScheme="brand"
          size="md"
          isChecked={module.isModuleEnabled}
          onChange={(e) => handleModuleToggle(moduleIndex, e.target.checked)}
          _focus={{ boxShadow: "none" }}
          _active={{ boxShadow: "none" }}
        />
      </Flex>
      {module?.actions.length > 0 && <Divider my={3} color={"brand.500"} />}

      <Flex justify="flex-end" mb={2} mt={"-2px"}>
        {module?.actions.length > 0 && (
          <Checkbox
            size="md"
            colorScheme="brand"
            borderColor={
              module.isModuleEnabled ? "brand.300" : disabledBorderColor
            }
            _focus={{ boxShadow: "none" }}
            _active={{ boxShadow: "none" }}
            _hover={{
              borderColor: module.isModuleEnabled
                ? "brand.300"
                : disabledBorderColor,
            }}
            isChecked={
              module?.actions.length > 0
                ? module.actions.every((a) => a.isAllowed)
                : false
            }
            onChange={(e) => handleSelectAll(moduleIndex, e.target.checked)}
            isDisabled={!module.isModuleEnabled}
            sx={{
              "& .chakra-checkbox__control": {
                borderColor: !module.isModuleEnabled
                  ? disabledBorderColor
                  : "gray.400",
				   outline: "none",
              },
              ".chakra-checkbox__control": {
                _focus: {
                  boxShadow: "0 0 0 2px",
                  borderColor: "brand.300",
				   outline: "none",
                },
              },
            }}
          >
            <Text
              color={!module.isModuleEnabled ? disabledTextColor : "inherit"}
            >
              Check All
            </Text>
          </Checkbox>
        )}
      </Flex>

      {/* Actions Grid */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} flex="1">
        {module.actions.map((action, actionIndex) => (
          <Checkbox
            key={action.actionKey}
            size="lg"
            colorScheme="brand"
            borderColor={
              module.isModuleEnabled ? "brand.300" : disabledBorderColor
            }
            _focus={{ boxShadow: "none" }}
            _active={{ boxShadow: "none" }}
            _hover={{
              borderColor: module.isModuleEnabled
                ? "brand.300"
                : disabledBorderColor,
            }}
            isChecked={action.isAllowed}
            onChange={() => handleActionToggle(moduleIndex, actionIndex)}
            isDisabled={!module.isModuleEnabled}
            sx={{
              "& .chakra-checkbox__control": {
                borderColor: !module.isModuleEnabled
                  ? disabledBorderColor
                  : "gray.400",
                outline: "none",
              },
              ".chakra-checkbox__control": {
                _focus: {
                  boxShadow: "0 0 0 2px",
                  borderColor: "brand.300",
                  outline: "none",
                },
              },
            }}
          >
            <Text
              color={!module.isModuleEnabled ? disabledTextColor : "inherit"}
            >
              {action.name}
            </Text>
          </Checkbox>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PermissionCard;
