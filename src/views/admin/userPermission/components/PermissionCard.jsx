import React from 'react';
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
  const cleanModuleName = module.moduleName.replace(/^[\s,]+/, '').trim();
  
  return (
    <Box
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      bg="gray.100"
      w="full"
      p={4}
    >
      {/* Module title and Check All */}
      <Flex
        justify="space-between"
        align="center"
        mb={2}
        flexWrap="wrap"
        gap={2}
      >
        <Text
          fontWeight="bold"
          fontSize={{ base: "sm", md: "md" }}
          display="flex"
          gap={2}
          flexDir="row"
          align="center"
        >
          <PermissionIcon moduleName={cleanModuleName} />
          {cleanModuleName}
        </Text>
        <Switch
          colorScheme="green"
          size="md"
          isChecked={module.isModuleEnabled}
          onChange={(e) => handleModuleToggle(moduleIndex, e.target.checked)}
          _focus={{ boxShadow: "none" }}
          _active={{ boxShadow: "none" }}
        />
      </Flex>

      <Flex justify="flex-end" mb={2} mt={"-2px"}>
        {module?.actions.length > 0 && (
          <Checkbox
            size="md"
            colorScheme="green"
            borderColor={
              module.isModuleEnabled ? "green.300" : disabledBorderColor
            }
            _focus={{ boxShadow: "none" }}
            _active={{ boxShadow: "none" }}
            _hover={{
              borderColor: module.isModuleEnabled
                ? "green.300"
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
              },
              ".chakra-checkbox__control": {
                _focus: {
                  boxShadow: "0 0 0 2px",
                  borderColor: "green.300",
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

      {module?.actions.length > 0 && <Divider my={3} />}

			{/* Actions Grid */}
			<SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} flex='1'>
				{module.actions.map((action, actionIndex) => (
					<Checkbox
						key={action.actionKey}
						size='md'
						colorScheme='green'
						borderColor={
							module.isModuleEnabled ? 'green.300' : disabledBorderColor
						}
						_focus={{ boxShadow: 'none' }}
						_active={{ boxShadow: 'none' }}
						_hover={{
							borderColor: module.isModuleEnabled
								? 'green.300'
								: disabledBorderColor,
						}}
						isChecked={action.isAllowed}
						onChange={() => handleActionToggle(moduleIndex, actionIndex)}
						isDisabled={!module.isModuleEnabled}
						sx={{
							'& .chakra-checkbox__control': {
								borderColor: !module.isModuleEnabled
									? disabledBorderColor
									: 'gray.400',
							},
							'.chakra-checkbox__control': {
								_focus: {
									boxShadow: '0 0 0 2px',
									borderColor: 'green.300',
								},
							},
						}}
					>
						<Text
							color={!module.isModuleEnabled ? disabledTextColor : 'inherit'}
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
