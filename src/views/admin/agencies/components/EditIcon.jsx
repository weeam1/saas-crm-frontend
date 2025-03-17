import { IconButton } from "@chakra-ui/react";
import { CiEdit } from "react-icons/ci";
export default function EditIcon() {
  return (
    <IconButton
      aria-label="Edit office timing"
      icon={<CiEdit />}
      size="sm"
      w="41px"
      bg="#EDC270"
      color="white"
      borderRadius="3px"
      position="absolute"
      top={4}
      right={4}
      _hover={{ bg: "#E5B668" }}
    />
  );
}
