import React, { memo } from "react";
import { HStack, Text, Icon, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { FaEye, FaHistory } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";

const CardHeader = memo(({ id, onViewLeadCycle }) => (
  <HStack justifyContent="space-between" w="100%" mb={1}>
    <HStack>
      <Icon as={FaEye} color="#C1C1C1" boxSize={3} />
      <Text color="#BEBEBE" fontSize="12px" fontFamily="DM Sans">
        {id || "N/A"}
      </Text>
    </HStack>
    <Menu>
      <MenuButton>
        <Icon as={CiMenuKebab} color="#C1C1C1" cursor="pointer" boxSize={4} />
      </MenuButton>
      <MenuList>
        <MenuItem icon={<FaHistory fontSize={15} />} onClick={onViewLeadCycle}>
          View Lead Cycle
        </MenuItem>
      </MenuList>
    </Menu>
  </HStack>
));

export default CardHeader;