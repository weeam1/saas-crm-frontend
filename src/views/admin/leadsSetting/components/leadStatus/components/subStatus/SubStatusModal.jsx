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
//   isSubmitting,
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
//     // Generate bgColor and textColor from the selected color
//     setFormData({
//       ...formData,
//       color: color,
//       bgColor: generateBgColor(color),
//       textColor: color,
//     });
//   };

//   const handleRandomColor = () => {
//     const randomColor = getRandomColor("sub");
//     setFormData({
//       ...formData,
//       color: randomColor,
//       bgColor: generateBgColor(randomColor),
//       textColor: randomColor,
//     });
//   };

//   // Preview color (for display only)
//   const previewBgColor = formData.color + "20";

//   return (
//     <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>
//           {editingItem ? "Edit Sub Status" : "Add Sub Status"}
//         </ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>
//           {/* Parent Main Status - Required */}
//           <FormControl isInvalid={formErrors.mainStatus} mb={4} isRequired>
//             <FormLabel>Main Status</FormLabel>
//             <Select
//               size="sm"
//               value={formData.mainStatus || ""}
//               onChange={(e) =>
//                 setFormData({ ...formData, mainStatus: e.target.value })
//               }
//               placeholder="Select main status"
//             >
//               {mainStatuses.map((status) => (
//                 <option key={status._id} value={status._id}>
//                   {status.label} {status.meta_id ? `(${status.meta_id})` : ""}
//                 </option>
//               ))}
//             </Select>
//             <FormErrorMessage>{formErrors.mainStatus}</FormErrorMessage>
//           </FormControl>

//           {/* Label - Required */}
//           <FormControl isInvalid={formErrors.label} mb={4} isRequired>
//             <FormLabel>Name</FormLabel>
//             <Input
//               size="sm"
//               value={formData.label}
//               onChange={(e) =>
//                 setFormData({ ...formData, label: e.target.value })
//               }
//               placeholder="Enter Name"
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
//                     bg={formData.bgColor || previewBgColor}
//                   />
//                   <Text fontSize="xs" color="gray.600">
//                     Selected: {formData.color}
//                   </Text>
//                 </Flex>
//               </Box>
//             )}
//           </FormControl>

//           <FormControl mb={4}>
//             <FormLabel>Meta Status (Optional)</FormLabel>
//             <Select
//               size="sm"
//               value={formData.metaStatus || ""}
//               onChange={(e) =>
//                 setFormData({ ...formData, metaStatus: e.target.value || null })
//               }
//               placeholder="Select meta status"
//             >
//               <option value="">None</option>
//               {metaStatuses.map((status) => (
//                 <option key={status._id} value={status._id}>
//                   {status.label}
//                 </option>
//               ))}
//             </Select>
//             <Text fontSize="xs" color="gray.500" mt={1}>
//               Link this lead status to a Meta Pixel event for better tracking
//               and categorization.
//             </Text>
//           </FormControl>
//         </ModalBody>

//         <ModalFooter>
//           <Button variant="ghost" size="sm" mr={3} onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button
//             colorScheme="brand"
//             size="sm"
//             onClick={onSubmit}
//             isLoading={isSubmitting}
//             loadingText={editingItem ? "Updating..." : "Saving..."}
//           >
//             {editingItem ? "Update" : "Save"}
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default SubStatusModal;

import React, { useState, useEffect, useRef } from "react";
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
  FormErrorMessage,
  Button,
  Flex,
  Box,
  Text,
} from "@chakra-ui/react";
import { FaPalette } from "react-icons/fa";
import Select from "react-select";
import { useFetchItemsQuery } from "api/apiSlice";

const SubStatusModal = ({
  isOpen,
  onClose,
  editingItem,
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  onSubmit,
  isSubmitting,
  getRandomColor,
  generateBgColor,
  mainStatuses: initialMainStatuses = [],
  metaStatuses: initialMetaStatuses = [],
}) => {
  const [mainStatusSearchTerm, setMainStatusSearchTerm] = useState("");
  const [metaStatusSearchTerm, setMetaStatusSearchTerm] = useState("");
  const [selectedMainStatus, setSelectedMainStatus] = useState(null);
  const [selectedMetaStatus, setSelectedMetaStatus] = useState(null);

  const mainStatusTimeoutRef = useRef(null);
  const metaStatusTimeoutRef = useRef(null);

  // Fetch main statuses with search
  const {
    data: mainStatusData,
    isLoading: isLoadingMainStatuses,
    isFetching: isFetchingMainStatuses,
  } = useFetchItemsQuery(
    {
      path: "/lead/main-status",
      params: {
        ...(mainStatusSearchTerm && { search: mainStatusSearchTerm }),
        limit: 20,
      },
    },
    {
      skip: !isOpen,
      refetchOnMountOrArgChange: true,
    },
  );

  // Fetch meta statuses with search
  const {
    data: metaStatusData,
    isLoading: isLoadingMetaStatuses,
    isFetching: isFetchingMetaStatuses,
  } = useFetchItemsQuery(
    {
      path: "/lead/meta-status",
      params: {
        ...(metaStatusSearchTerm && { search: metaStatusSearchTerm }),
        limit: 20,
      },
    },
    {
      skip: !isOpen,
      refetchOnMountOrArgChange: true,
    },
  );

  // Prepare options from API data
  const mainStatusOptions = mainStatusData?.doc
    ? mainStatusData.doc.map((status) => ({
        value: status._id,
        label: status.label,
      }))
    : [];

  const metaStatusOptions = metaStatusData?.doc
    ? metaStatusData.doc.map((status) => ({
        value: status._id,
        label: status.label || status.key,
      }))
    : [];

  // Handle main status input change with debounce
  const handleMainStatusInputChange = (inputValue) => {
    if (mainStatusTimeoutRef.current) {
      clearTimeout(mainStatusTimeoutRef.current);
    }

    mainStatusTimeoutRef.current = setTimeout(() => {
      setMainStatusSearchTerm(inputValue);
    }, 500);
  };

  // Handle meta status input change with debounce
  const handleMetaStatusInputChange = (inputValue) => {
    if (metaStatusTimeoutRef.current) {
      clearTimeout(metaStatusTimeoutRef.current);
    }

    metaStatusTimeoutRef.current = setTimeout(() => {
      setMetaStatusSearchTerm(inputValue);
    }, 500);
  };

  // Set initial selected options when editing
  useEffect(() => {
    if (editingItem) {
      // Set main status
      if (editingItem.mainStatusId || editingItem.mainStatus) {
        const mainStatusId = editingItem.mainStatusId || editingItem.mainStatus;
        // Try to find in initial data first
        const mainStatus = initialMainStatuses.find(
          (ms) => ms._id === mainStatusId,
        );

        if (mainStatus) {
          setSelectedMainStatus({
            value: mainStatus._id,
            label: mainStatus.label,
          });
        }
      }

      // Set meta status
      if (editingItem.metaStatusId || editingItem.metaStatus) {
        const metaStatusId = editingItem.metaStatusId || editingItem.metaStatus;
        const metaStatus = initialMetaStatuses.find(
          (ms) => ms._id === metaStatusId,
        );

        if (metaStatus) {
          setSelectedMetaStatus({
            value: metaStatus._id,
            label: metaStatus.label || metaStatus.key,
          });
        }
      }
    } else {
      // Reset on new
      setSelectedMainStatus(null);
      setSelectedMetaStatus(null);
      setMainStatusSearchTerm("");
      setMetaStatusSearchTerm("");
    }
  }, [editingItem, initialMainStatuses, initialMetaStatuses]);

  // Update formData when main status changes
  const handleMainStatusChange = (option) => {
    setSelectedMainStatus(option);
    setFormData({
      ...formData,
      mainStatus: option ? option.value : "",
    });
  };

  // Update formData when meta status changes
  const handleMetaStatusChange = (option) => {
    setSelectedMetaStatus(option);
    setFormData({
      ...formData,
      metaStatus: option ? option.value : null,
    });
  };

  const handleClose = () => {
    setFormErrors({});
    setMainStatusSearchTerm("");
    setMetaStatusSearchTerm("");
    setSelectedMainStatus(null);
    setSelectedMetaStatus(null);

    // Clear timeouts
    if (mainStatusTimeoutRef.current) {
      clearTimeout(mainStatusTimeoutRef.current);
    }
    if (metaStatusTimeoutRef.current) {
      clearTimeout(metaStatusTimeoutRef.current);
    }

    onClose();
  };

  const handleColorChange = (color) => {
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

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#3182CE" : "#E2E8F0",
      boxShadow: state.isFocused ? "0 0 0 1px #3182CE" : "none",
      minHeight: "32px",
      fontSize: "14px",
      "&:hover": {
        borderColor: "#CBD5E0",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3182CE"
        : state.isFocused
          ? "#EBF8FF"
          : "white",
      color: state.isSelected ? "white" : "#1A202C",
      fontSize: "14px",
      cursor: "pointer",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#A0AEC0",
      fontSize: "14px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#1A202C",
      fontSize: "14px",
    }),
    input: (provided) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

  // Preview color
  const previewBgColor = formData.color + "20";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editingItem ? "Edit Sub Status" : "Add Sub Status"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Parent Main Status - Required */}
          <FormControl isInvalid={formErrors.mainStatus} mb={4} isRequired>
            <FormLabel>Main Status</FormLabel>
            <Select
              options={mainStatusOptions}
              value={selectedMainStatus}
              onChange={handleMainStatusChange}
              onInputChange={handleMainStatusInputChange}
              isLoading={isFetchingMainStatuses || isLoadingMainStatuses}
              placeholder="Search main status..."
              isClearable={false}
              styles={customStyles}
              noOptionsMessage={({ inputValue }) =>
                inputValue ? "No results found" : "Start typing to search"
              }
              loadingMessage={() => "Searching..."}
            />
            <FormErrorMessage>{formErrors.mainStatus}</FormErrorMessage>
          </FormControl>

          {/* Label - Required */}
          <FormControl isInvalid={formErrors.label} mb={4} isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              size="sm"
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
              placeholder="Enter Name"
            />
            <FormErrorMessage>{formErrors.label}</FormErrorMessage>
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

          {/* Meta Status - Optional */}
          <FormControl mb={4}>
            <FormLabel>Meta Status (Optional)</FormLabel>
            <Select
              options={metaStatusOptions}
              value={selectedMetaStatus}
              onChange={handleMetaStatusChange}
              onInputChange={handleMetaStatusInputChange}
              isLoading={isFetchingMetaStatuses || isLoadingMetaStatuses}
              placeholder="Search meta status..."
              isClearable
              styles={customStyles}
              noOptionsMessage={({ inputValue }) =>
                inputValue ? "No results found" : "Start typing to search"
              }
              loadingMessage={() => "Searching..."}
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              Link this lead status to a Meta Pixel event for better tracking
              and categorization.
            </Text>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" size="sm" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            size="sm"
            onClick={onSubmit}
            isLoading={isSubmitting}
            loadingText={editingItem ? "Updating..." : "Saving..."}
          >
            {editingItem ? "Update" : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SubStatusModal;
