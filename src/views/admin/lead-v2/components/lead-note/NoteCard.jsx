import {
  Box,
  GridItem,
  Text,
  IconButton,
  Avatar,
  HStack,
  Flex,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import ConfirmationModal from "components/Message/ConfirmationModal";
import { constant } from "constant";
import { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { formatPostDate } from "utils/helpers";
import NoteBody from "./NoteBody";

const NoteCard = ({ id, note, onEdit, onDelete }) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleConfirmRemove = async () => {
    await onDelete(note);
    setDeleteModalOpen(false);
  };

  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("whitesmoke", "gray.800");

  return (
    <>
      <GridItem
        key={id}
        w="full"
        colSpan={{ base: 12, md: 6, lg: 4 }}
        display="flex"
      >
        <Box
          bg={bgColor}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          p={{ base: 3, md: 4 }}
          shadow="md"
          w="full"
          transition="all 0.2s ease-in-out"
          _hover={{ shadow: "lg", transform: "scale(1.01)" }}
        >
          {/* Header */}
          <Flex justify="space-between" align="center" mb={2}>
            <HStack spacing={2} align="center">
              <Avatar
                src={
                  note.addedBy?.profileImage
                    ? `${constant.baseUrl}${note.addedBy.profileImage}`
                    : undefined
                }
                name={note.addedBy?.fullName ?? "User"}
                boxSize={{ base: "28px", md: "34px" }}
                bg="brand.200"
                color="gray.800"
                imgProps={{
                  loading: "lazy",
                  referrerPolicy: "no-referrer",
                  style: {
                    objectFit: "cover",
                    imageRendering: "auto",
                  },
                }}
              />
              <Box lineHeight="1">
                <Text
                  fontWeight="600"
                  fontSize="clamp(0.7rem, 1.5vw, 0.9rem)"
                  color="gray.800"
                >
                  {note.addedBy?.fullName || "Unknown User"}
                </Text>
                <Text fontSize="clamp(0.65rem, 1.2vw, 0.8rem)" color="gray.500">
                  {formatPostDate(new Date(note?.createdAt))}
                </Text>
              </Box>
            </HStack>

            {user?.role === "superAdmin" && (
              <HStack spacing={1}>
                <IconButton
                  aria-label="Edit Note"
                  icon={<FiEdit />}
                  size="xs"
                  variant="ghost"
                  colorScheme="gray"
                  onClick={() => onEdit(note)}
                />
                <IconButton
                  aria-label="Delete Note"
                  icon={<FiTrash2 />}
                  size="xs"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => setDeleteModalOpen(true)}
                />
              </HStack>
            )}
          </Flex>

          <Divider mb={3} />

          {/* Note Body */}
          {/* <Box overflowY='auto' maxH='200px' p='1'>
						<Text
							as='pre'
							// fontWeight='semibold'
							whiteSpace='pre-wrap'
							overflowWrap='break-word'
							wordBreak='break-word'
							color='gray.600'
							fontFamily='DM Sans, sans-serif'
						>
							{note?.note}
						</Text>
					</Box> */}
          <NoteBody text={note?.note} />
        </Box>
      </GridItem>

      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
          }}
          onConfirm={handleConfirmRemove}
          title="Remove Lead Note"
          message="Are you sure you want to remove the lead note?"
          confirmText="Yes, Remove"
          cancelText="Cancel"
        />
      )}
    </>
  );
};

export default NoteCard;
