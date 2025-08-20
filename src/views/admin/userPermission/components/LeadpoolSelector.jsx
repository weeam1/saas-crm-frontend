import { Box, Text, Flex, Switch } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

export default function LeadpoolSelector({ modules, setModules }) {
  const leadPoolModules = modules.filter((m) =>
    m.moduleId.toLowerCase().includes("leadpool")
  );

  const handleModuleToggle = (moduleId) => {
    setModules((prev) =>
      prev.map((m) => {
        if (!m.moduleId.toLowerCase().includes("leadpool")) return m;

        if (m.moduleId === moduleId) {
          // if already true, turn it off → allows disabling
          return { ...m, isModuleEnabled: !m.isModuleEnabled };
        }
        // all others off
        return { ...m, isModuleEnabled: false };
      })
    );
  };

  return (
    <Box
      mb="4"
      bg="gray.100"
      rounded="md"
      p="4"
      borderWidth="1px"
      borderRadius="md"
    >
      {/* <Flex align='center' justify='space-between' mb={4}>
				<Text color='gray.600'>Enable Leadpool modules</Text>
				<Switch
					colorScheme='green'
					isChecked={leadpoolEnabled}
					onChange={(e) => toggleLeadpool(e.target.checked)}
				/>
			</Flex> */}

      <>
        <Text color="gray.600" mb={4}>
          Choose one Leadpool module (only one can be active at a time).
        </Text>

        <Flex direction={{ base: "column", md: "row" }} gap="4" w="full">
          {leadPoolModules.map((module) => (
            <Box
              key={module.moduleId}
              borderWidth="1px"
              borderRadius="md"
              w="full"
              p={4}
              // bg={module.isModuleEnabled ? 'green.50' : 'white'}
              // borderColor={module.isModuleEnabled ? 'green.400' : 'gray.200'}
              transition="all 0.2s ease-in-out"
            >
              <Flex align="center" justify="space-between">
                <Text
                  fontSize="md"
                  fontWeight="semibold"
                  color="gray.800"
                  display="flex"
                  gap={2}
                  flexDir="row"
                  align="center"
                >
                  <Icon
                    as={MdOutlineAdminPanelSettings}
                    width="20px"
                    height="20px"
                    color="inherit"
                  />
                  {module.moduleName}
                </Text>
                <Switch
                  colorScheme="green"
                  isChecked={module.isModuleEnabled}
                  onChange={() => handleModuleToggle(module.moduleId)}
                />
              </Flex>
            </Box>
          ))}
        </Flex>
      </>
    </Box>
  );
}
