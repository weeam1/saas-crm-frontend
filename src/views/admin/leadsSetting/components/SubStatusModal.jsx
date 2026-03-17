// import React from "react";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   ModalCloseButton,
//   FormControl,
//   FormLabel,
//   Input,
//   Select,
//   FormErrorMessage,
//   Button,
//   Flex,
//   Box,
//   Text,
// } from "@chakra-ui/react";
// import { FaPalette } from "react-icons/fa";

// const SubStatusModal = ({
//   isOpen,
//   onClose,
//   editingItem,
//   formData,
//   setFormData,
//   formErrors,
//   setFormErrors,
//   onSubmit,
//   getRandomColor,
//   generateBgColor,
//   mainStatuses = [],
//   metaStatuses = [],
// }) => {
//   const handleClose = () => {
//     setFormErrors({});
//     onClose();
//   };

//   const handleColorChange = (color) => {
//     setFormData({
//       ...formData,
//       color: color,
//     });
//   };

//   const handleRandomColor = () => {
//     const randomColor = getRandomColor("sub");
//     setFormData({
//       ...formData,
//       color: randomColor,
//     });
//   };

//   // Preview color (for display only)
//   const previewBgColor = formData.color + "20";
//   const previewTextColor = formData.color;

//   return (
//     <Modal isOpen={isOpen} onClose={handleClose} size="lg">
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>
//           {editingItem ? "Edit Sub Status" : "Add New Sub Status"}
//         </ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>
//           {/* Parent Status Selection */}
//           <FormControl isInvalid={formErrors.parentId} mb={4} isRequired>
//             <FormLabel>
//               Parent Main Status <span style={{ color: "red" }}>*</span>
//             </FormLabel>
//             <Select
//               size="sm"
//               value={formData.parentId || ""}
//               onChange={(e) =>
//                 setFormData({ ...formData, parentId: e.target.value })
//               }
//               placeholder="Select parent main status"
//             >
//               {mainStatuses.map((status) => (
//                 <option key={status._id} value={status._id}>
//                   {status.label} {status.meta_id ? `(${status.meta_id})` : ""}
//                 </option>
//               ))}
//             </Select>
//             <FormErrorMessage>{formErrors.parentId}</FormErrorMessage>
//           </FormControl>

//           {/* Label */}
//           <FormControl isInvalid={formErrors.label} mb={4} isRequired>
//             <FormLabel>
//               Label <span style={{ color: "red" }}>*</span>
//             </FormLabel>
//             <Input
//               size="sm"
//               value={formData.label}
//               onChange={(e) =>
//                 setFormData({ ...formData, label: e.target.value })
//               }
//               placeholder="Enter display label (e.g., Contacted)"
//             />
//             <FormErrorMessage>{formErrors.label}</FormErrorMessage>
//           </FormControl>

//           {/* Color */}
//           <FormControl mb={4}>
//             <FormLabel>Color</FormLabel>
//             <Flex gap={4} align="center">
//               <Input
//                 type="color"
//                 value={formData.color || "#6366F1"}
//                 onChange={(e) => handleColorChange(e.target.value)}
//                 w="100px"
//                 h="35px"
//                 p={1}
//               />
//               <Button
//                 size="sm"
//                 leftIcon={<FaPalette />}
//                 onClick={handleRandomColor}
//               >
//                 Random
//               </Button>
//             </Flex>

//             {/* Color Preview */}
//             {formData.color && (
//               <Box mt={2} p={2} bg="gray.50" borderRadius="md">
//                 <Text fontSize="sm" mb={1}>
//                   Preview:
//                 </Text>
//                 <Flex align="center" gap={2}>
//                   <Box
//                     w="30px"
//                     h="30px"
//                     borderRadius="md"
//                     bg={formData.color}
//                   />
//                   <Box
//                     w="30px"
//                     h="30px"
//                     borderRadius="md"
//                     bg={previewBgColor}
//                   />
//                   <Text fontSize="xs" color="gray.600">
//                     Selected: {formData.color}
//                   </Text>
//                 </Flex>
//               </Box>
//             )}
//           </FormControl>

//           {/* Meta ID Selection */}
//           <FormControl mb={4}>
//             <FormLabel>Meta ID</FormLabel>
//             <Select
//               size="sm"
//               value={formData.meta_id || ""}
//               onChange={(e) =>
//                 setFormData({ ...formData, meta_id: e.target.value })
//               }
//               placeholder="Select meta ID (optional)"
//             >
//               {metaStatuses.map((status) => (
//                 <option key={status._id} value={status._id}>
//                   {status.label} {status.meta_id ? `(${status.meta_id})` : ""}
//                 </option>
//               ))}
//             </Select>
//             <Text fontSize="xs" color="gray.500" mt={1}>
//               Link to a meta ID for additional categorization
//             </Text>
//           </FormControl>
//         </ModalBody>

//         <ModalFooter>
//           <Button variant="ghost" size="sm" mr={3} onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button colorScheme="purple" size="sm" onClick={onSubmit}>
//             {editingItem ? "Update" : "Save"}
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default SubStatusModal;

import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
  Button,
  Flex,
  Box,
  Text,
} from "@chakra-ui/react";
import { FaPalette } from "react-icons/fa";

const SubStatusModal = ({
  isOpen,
  onClose,
  editingItem,
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  onSubmit,
  getRandomColor,
  generateBgColor,
  mainStatuses = [],
  metaStatuses = [],
}) => {
  const handleClose = () => {
    setFormErrors({});
    onClose();
  };

  const handleColorChange = (color) => {
    // Generate bgColor and textColor from the selected color
    setFormData({
      ...formData,
      color: color,
      bgColor: generateBgColor(color),
      textColor: color,
    });
  };

  const handleRandomColor = () => {
    const randomColor = getRandomColor("sub");
    setFormData({
      ...formData,
      color: randomColor,
      bgColor: generateBgColor(randomColor),
      textColor: randomColor,
    });
  };

  // Preview color (for display only)
  const previewBgColor = formData.color + "20";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editingItem ? "Edit Sub Status" : "Add New Sub Status"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Parent Main Status - Required */}
          <FormControl isInvalid={formErrors.mainStatus} mb={4} isRequired>
            <FormLabel>
              Parent Main Status <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Select
              size="sm"
              value={formData.mainStatus || ""}
              onChange={(e) =>
                setFormData({ ...formData, mainStatus: e.target.value })
              }
              placeholder="Select parent main status"
            >
              {mainStatuses.map((status) => (
                <option key={status._id} value={status._id}>
                  {status.label} {status.meta_id ? `(${status.meta_id})` : ""}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{formErrors.mainStatus}</FormErrorMessage>
          </FormControl>

          {/* Label - Required */}
          <FormControl isInvalid={formErrors.label} mb={4} isRequired>
            <FormLabel>
              Label <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Input
              size="sm"
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
              placeholder="Enter display label (e.g., Contacted)"
            />
            <FormErrorMessage>{formErrors.label}</FormErrorMessage>
          </FormControl>

          {/* Value - Required */}
          <FormControl isInvalid={formErrors.value} mb={4} isRequired>
            <FormLabel>
              Value <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Input
              size="sm"
              value={formData.value || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  value: e.target.value.toLowerCase().replace(/\s+/g, "_"),
                })
              }
              placeholder="e.g., contacted (auto-generated from label if empty)"
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              Unique identifier. Will be auto-generated from label if empty.
            </Text>
            <FormErrorMessage>{formErrors.value}</FormErrorMessage>
          </FormControl>

          {/* Color */}
          <FormControl mb={4}>
            <FormLabel>Color</FormLabel>
            <Flex gap={4} align="center">
              <Input
                type="color"
                value={formData.color || "#6366F1"}
                onChange={(e) => handleColorChange(e.target.value)}
                w="100px"
                h="35px"
                p={1}
              />
              <Button
                size="sm"
                leftIcon={<FaPalette />}
                onClick={handleRandomColor}
              >
                Random
              </Button>
            </Flex>

            {/* Color Preview */}
            {formData.color && (
              <Box mt={2} p={2} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" mb={1}>
                  Preview:
                </Text>
                <Flex align="center" gap={2}>
                  <Box
                    w="30px"
                    h="30px"
                    borderRadius="md"
                    bg={formData.color}
                  />
                  <Box
                    w="30px"
                    h="30px"
                    borderRadius="md"
                    bg={formData.bgColor || previewBgColor}
                  />
                  <Text fontSize="xs" color="gray.600">
                    Selected: {formData.color}
                  </Text>
                </Flex>
              </Box>
            )}
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Meta Status (Optional)</FormLabel>
            <Select
              size="sm"
              value={formData.metaStatus || ""}
              onChange={(e) =>
                setFormData({ ...formData, metaStatus: e.target.value || null })
              }
              placeholder="Select meta status (optional)"
            >
              <option value="">None</option>
              {metaStatuses.map((status) => (
                <option key={status._id} value={status._id}>
                  {status.label} {status.key ? `(${status.key})` : ""}
                </option>
              ))}
            </Select>
            <Text fontSize="xs" color="gray.500" mt={1}>
              Link to a meta status for additional categorization
            </Text>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" size="sm" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button colorScheme="purple" size="sm" onClick={onSubmit}>
            {editingItem ? "Update" : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SubStatusModal;
