// import {
//   Box,
//   Avatar,
//   IconButton,
//   Flex,
//   Text,
//   Badge,
//   HStack,
//   Image as ChakraImage,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   Input,
//   ModalFooter,
//   Button,
//   Spinner,
//   ModalBody,
//   Select,
// } from "@chakra-ui/react";
// import { EditIcon, LockIcon, UnlockIcon } from "@chakra-ui/icons";
// import { FiUploadCloud, FiUser } from "react-icons/fi";

// import PropTypes from "prop-types";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { useEffect, useState, useRef } from "react";
// import { useCreateItemMutation } from "api/apiSlice";
// import { compressImage, resolveInitialImage } from "../../utils/imageUtils";

// const LG_IMAGE_BOX_SIZE = "250px";
// const SM_IMAGE_BOX_SIZE = "200px";

// const StatusBadge = ({ isOnline }) => {
//   const color = isOnline ? "green.500" : "gray.400";
//   const label = isOnline ? "Online" : "Offline";

//   return (
//     <Flex
//       align="center"
//       gap={2}
//       px={3}
//       py={1}
//       borderRadius="full"
//       bg={isOnline ? "green.50" : "gray.100"}
//       border="1px solid"
//       borderColor={isOnline ? "green.200" : "gray.300"}
//       w="fit-content"
//       position="relative"
//     >
//       {/* Dot */}
//       <Box w="8px" h="8px" borderRadius="full" bg={color} position="relative">
//         {isOnline && (
//           <Box
//             position="absolute"
//             inset={0}
//             borderRadius="full"
//             bg="green.400"
//             animation="pulse 1.6s infinite"
//             opacity={0.6}
//             sx={{
//               "@keyframes pulse": {
//                 "0%": { transform: "scale(1)", opacity: 0.6 },
//                 "70%": { transform: "scale(2)", opacity: 0 },
//                 "100%": { opacity: 0 },
//               },
//             }}
//           />
//         )}
//       </Box>

//       <Text fontSize="xs" fontWeight="600" color={color}>
//         {label}
//       </Text>
//     </Flex>
//   );
// };

// const AvatarSection = ({ user, refetchUser }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const [previewUrl, setPreviewUrl] = useState(null);

//   const hasImage = Boolean(user?.profileImage);

//   const onlineUsers = useSelector((state) => state.onlineUsers);

//   const isOnline = onlineUsers?.users?.includes(user?._id?.toString());

//   useEffect(() => {
//     (async () => {
//       const url = await resolveInitialImage(user);
//       setPreviewUrl(url || null);
//     })();
//   }, [user]);

//   return (
//     <Box w="100%" position="relative">
//       <Flex
//         w="100%"
//         gap={6}
//         align="center"
//         flexDir={{ base: "column", md: "row" }}
//       >
//         {/* LEFT: Image / Avatar */}
//         <Box
//           position="relative"
//           w={{ base: SM_IMAGE_BOX_SIZE, lg: LG_IMAGE_BOX_SIZE }}
//           h={{ base: SM_IMAGE_BOX_SIZE, lg: LG_IMAGE_BOX_SIZE }}
//           bg="gray.100"
//           overflow="hidden"
//           borderRadius="md"
//           flexShrink={0}
//         >
//           {/* Edit Button */}
//           <IconButton
//             icon={<EditIcon />}
//             position="absolute"
//             top={3}
//             right={3}
//             zIndex={2}
//             size="sm"
//             colorScheme="gray"
//             borderRadius="full"
//             onClick={() => setIsOpen(true)}
//             shadow="md"
//             aria-label="Edit profile"
//           />

//           {hasImage ? (
//             <ChakraImage
//               src={previewUrl}
//               alt={user.fullName}
//               w="100%"
//               h="100%"
//               objectFit="cover"
//               fallback={
//                 <Avatar
//                   w="100%"
//                   h="100%"
//                   name={user.fullName}
//                   size="lg"
//                   borderRadius="md"
//                 />
//               }
//             />
//           ) : (
//             <Avatar
//               w="100%"
//               h="100%"
//               name={user.fullName}
//               fontSize="5xl"
//               borderRadius="md"
//             />
//           )}
//         </Box>

//         {/* RIGHT: User Info */}
//         <Flex flexDir="column" align={{ base: "center", md: "start" }} gap={3}>
//           <Text
//             fontSize={{ base: "2xl", md: "3xl" }}
//             fontWeight="bold"
//             color="gray.800"
//           >
//             {user.fullName}
//           </Text>

//           <Badge
//             colorScheme="blue"
//             w="fit-content"
//             px={3}
//             py={1}
//             borderRadius="full"
//           >
//             {user.roles?.[0]?.roleName || "User"}
//           </Badge>

//           <Badge
//             colorScheme={user?.isActive ? "green" : "red"}
//             variant="subtle"
//             w="fit-content"
//             px={3}
//             py={1}
//             borderRadius="full"
//           >
//             {user?.isActive ? "Active" : "Inactive"}
//           </Badge>

//           <StatusBadge isOnline={isOnline} />
//         </Flex>
//       </Flex>

//       {isOpen && (
//         <EditAvatarModal
//           isOpen={isOpen}
//           onClose={() => setIsOpen(false)}
//           user={user}
//           refetchUser={refetchUser}
//           previewUrl={previewUrl}
//         />
//       )}
//     </Box>
//   );
// };

// // Image cropper component with aspect ratio locking
// const ImageCropper = ({
//   imageSrc,
//   onCropComplete,
//   onCancel,
//   initialCrop = null,
// }) => {
//   const [image, setImage] = useState(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0, width: 200, height: 200 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragType, setDragType] = useState(null);
//   const [startPos, setStartPos] = useState({ x: 0, y: 0 });
//   const [startCrop, setStartCrop] = useState({
//     x: 0,
//     y: 0,
//     width: 200,
//     height: 200,
//   });
//   const [lockAspectRatio, setLockAspectRatio] = useState(true);
//   const [selectedRatio, setSelectedRatio] = useState("1:1");
//   const containerRef = useRef(null);

//   // Predefined aspect ratios
//   const aspectRatios = {
//     "1:1": 1,
//     "4:3": 4 / 3,
//     "16:9": 16 / 9,
//     "3:4": 3 / 4,
//     "9:16": 9 / 16,
//   };

//   const getCurrentAspectRatio = () => {
//     if (!lockAspectRatio) return null;
//     return aspectRatios[selectedRatio];
//   };

//   useEffect(() => {
//     const img = new window.Image();
//     img.onload = () => {
//       setImage(img);

//       if (initialCrop && initialCrop.width && initialCrop.height) {
//         setCrop({
//           x: initialCrop.x,
//           y: initialCrop.y,
//           width: initialCrop.width,
//           height: initialCrop.height,
//         });
//       } else {
//         const aspectRatio = getCurrentAspectRatio();
//         let width, height;

//         if (aspectRatio && lockAspectRatio) {
//           if (aspectRatio >= 1) {
//             width = Math.min(img.width, img.height) * 0.6;
//             height = width / aspectRatio;
//           } else {
//             height = Math.min(img.width, img.height) * 0.6;
//             width = height * aspectRatio;
//           }

//           setCrop({
//             x: (img.width - width) / 2,
//             y: (img.height - height) / 2,
//             width: width,
//             height: height,
//           });
//         } else {
//           const size = Math.min(img.width, img.height) * 0.6;
//           setCrop({
//             x: (img.width - size) / 2,
//             y: (img.height - size) / 2,
//             width: size,
//             height: size,
//           });
//         }
//       }
//     };
//     img.src = imageSrc;
//   }, [imageSrc, initialCrop, lockAspectRatio, selectedRatio]);

//   const getMousePos = (e) => {
//     const rect = containerRef.current.getBoundingClientRect();
//     const scaleX = image.width / rect.width;
//     const scaleY = image.height / rect.height;

//     let clientX, clientY;

//     if (e.touches) {
//       clientX = e.touches[0].clientX;
//       clientY = e.touches[0].clientY;
//     } else {
//       clientX = e.clientX;
//       clientY = e.clientY;
//     }

//     const x = (clientX - rect.left) * scaleX;
//     const y = (clientY - rect.top) * scaleY;

//     return {
//       x: Math.max(0, Math.min(x, image.width)),
//       y: Math.max(0, Math.min(y, image.height)),
//     };
//   };

//   const handleMouseDown = (e, type) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!image) return;

//     setIsDragging(true);
//     setDragType(type);
//     setStartPos(getMousePos(e));
//     setStartCrop({ ...crop });
//   };

//   const handleMouseMove = (e) => {
//     if (!isDragging || !image) return;

//     const currentPos = getMousePos(e);
//     const deltaX = currentPos.x - startPos.x;
//     const deltaY = currentPos.y - startPos.y;

//     let newCrop = { ...startCrop };
//     const aspectRatio = getCurrentAspectRatio();

//     switch (dragType) {
//       case "move":
//         newCrop.x = Math.max(
//           0,
//           Math.min(startCrop.x + deltaX, image.width - startCrop.width),
//         );
//         newCrop.y = Math.max(
//           0,
//           Math.min(startCrop.y + deltaY, image.height - startCrop.height),
//         );
//         break;
//       case "se":
//         if (lockAspectRatio && aspectRatio) {
//           let newWidth = Math.max(50, startCrop.width + deltaX);
//           let newHeight = newWidth / aspectRatio;

//           if (startCrop.y + newHeight > image.height) {
//             newHeight = image.height - startCrop.y;
//             newWidth = newHeight * aspectRatio;
//           }
//           if (startCrop.x + newWidth > image.width) {
//             newWidth = image.width - startCrop.x;
//             newHeight = newWidth / aspectRatio;
//           }

//           newCrop.width = newWidth;
//           newCrop.height = newHeight;
//         } else {
//           newCrop.width = Math.max(
//             50,
//             Math.min(startCrop.width + deltaX, image.width - startCrop.x),
//           );
//           newCrop.height = Math.max(
//             50,
//             Math.min(startCrop.height + deltaY, image.height - startCrop.y),
//           );
//         }
//         break;
//       case "sw":
//         if (lockAspectRatio && aspectRatio) {
//           let newWidth = Math.max(50, startCrop.width - deltaX);
//           let newHeight = newWidth / aspectRatio;
//           let newX = startCrop.x + deltaX;

//           if (newX < 0) {
//             newX = 0;
//             newWidth = startCrop.width + startCrop.x;
//             newHeight = newWidth / aspectRatio;
//           }
//           if (newX + newWidth > image.width) {
//             newWidth = image.width - newX;
//             newHeight = newWidth / aspectRatio;
//           }
//           if (startCrop.y + newHeight > image.height) {
//             newHeight = image.height - startCrop.y;
//             newWidth = newHeight * aspectRatio;
//             newX = startCrop.x + startCrop.width - newWidth;
//           }

//           newCrop.width = newWidth;
//           newCrop.height = newHeight;
//           newCrop.x = newX;
//         } else {
//           newCrop.width = Math.max(
//             50,
//             Math.min(startCrop.width - deltaX, startCrop.x + startCrop.width),
//           );
//           newCrop.x = Math.max(
//             0,
//             Math.min(startCrop.x + deltaX, startCrop.x + startCrop.width - 50),
//           );
//           newCrop.height = Math.max(
//             50,
//             Math.min(startCrop.height + deltaY, image.height - startCrop.y),
//           );
//         }
//         break;
//       case "ne":
//         if (lockAspectRatio && aspectRatio) {
//           let newHeight = Math.max(50, startCrop.height - deltaY);
//           let newWidth = newHeight * aspectRatio;
//           let newY = startCrop.y + deltaY;

//           if (newY < 0) {
//             newY = 0;
//             newHeight = startCrop.height + startCrop.y;
//             newWidth = newHeight * aspectRatio;
//           }
//           if (newY + newHeight > image.height) {
//             newHeight = image.height - newY;
//             newWidth = newHeight * aspectRatio;
//           }
//           if (startCrop.x + newWidth > image.width) {
//             newWidth = image.width - startCrop.x;
//             newHeight = newWidth / aspectRatio;
//             newY = startCrop.y + startCrop.height - newHeight;
//           }

//           newCrop.height = newHeight;
//           newCrop.width = newWidth;
//           newCrop.y = newY;
//         } else {
//           newCrop.width = Math.max(
//             50,
//             Math.min(startCrop.width + deltaX, image.width - startCrop.x),
//           );
//           newCrop.height = Math.max(
//             50,
//             Math.min(startCrop.height - deltaY, startCrop.y + startCrop.height),
//           );
//           newCrop.y = Math.max(
//             0,
//             Math.min(startCrop.y + deltaY, startCrop.y + startCrop.height - 50),
//           );
//         }
//         break;
//       case "nw":
//         if (lockAspectRatio && aspectRatio) {
//           let newWidth = Math.max(50, startCrop.width - deltaX);
//           let newHeight = newWidth / aspectRatio;
//           let newX = startCrop.x + deltaX;
//           let newY = startCrop.y + deltaY;

//           if (newX < 0) {
//             newX = 0;
//             newWidth = startCrop.width + startCrop.x;
//             newHeight = newWidth / aspectRatio;
//           }
//           if (newY < 0) {
//             newY = 0;
//             newHeight = startCrop.height + startCrop.y;
//             newWidth = newHeight * aspectRatio;
//           }
//           if (newX + newWidth > image.width) {
//             newWidth = image.width - newX;
//             newHeight = newWidth / aspectRatio;
//           }
//           if (newY + newHeight > image.height) {
//             newHeight = image.height - newY;
//             newWidth = newHeight * aspectRatio;
//           }

//           newCrop.width = newWidth;
//           newCrop.height = newHeight;
//           newCrop.x = newX;
//           newCrop.y = newY;
//         } else {
//           newCrop.width = Math.max(
//             50,
//             Math.min(startCrop.width - deltaX, startCrop.x + startCrop.width),
//           );
//           newCrop.x = Math.max(
//             0,
//             Math.min(startCrop.x + deltaX, startCrop.x + startCrop.width - 50),
//           );
//           newCrop.height = Math.max(
//             50,
//             Math.min(startCrop.height - deltaY, startCrop.y + startCrop.height),
//           );
//           newCrop.y = Math.max(
//             0,
//             Math.min(startCrop.y + deltaY, startCrop.y + startCrop.height - 50),
//           );
//         }
//         break;
//       default:
//         break;
//     }

//     setCrop(newCrop);
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//     setDragType(null);
//   };

//   useEffect(() => {
//     if (isDragging) {
//       window.addEventListener("mousemove", handleMouseMove);
//       window.addEventListener("mouseup", handleMouseUp);
//       return () => {
//         window.removeEventListener("mousemove", handleMouseMove);
//         window.removeEventListener("mouseup", handleMouseUp);
//       };
//     }
//   }, [isDragging, handleMouseMove]);

//   const applyCrop = () => {
//     if (!image) return;

//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     canvas.width = crop.width;
//     canvas.height = crop.height;

//     ctx.drawImage(
//       image,
//       crop.x,
//       crop.y,
//       crop.width,
//       crop.height,
//       0,
//       0,
//       crop.width,
//       crop.height,
//     );

//     canvas.toBlob(
//       (blob) => {
//         onCropComplete(blob, crop);
//       },
//       "image/jpeg",
//       0.95,
//     );
//   };

//   if (!image) {
//     return (
//       <Flex justify="center" align="center" h="400px">
//         <Spinner size="xl" />
//       </Flex>
//     );
//   }

//   const containerWidth = 500;
//   const containerHeight = 400;
//   const scaleX = containerWidth / image.width;
//   const scaleY = containerHeight / image.height;
//   const scale = Math.min(scaleX, scaleY);

//   const displayWidth = image.width * scale;
//   const displayHeight = image.height * scale;
//   const offsetX = (containerWidth - displayWidth) / 2;
//   const offsetY = (containerHeight - displayHeight) / 2;

//   const cropStyle = {
//     left: offsetX + crop.x * scale,
//     top: offsetY + crop.y * scale,
//     width: crop.width * scale,
//     height: crop.height * scale,
//   };

//   return (
//     <Box>
//       <Flex justify="space-between" align="center" mb={4}>
//         <HStack spacing={2}>
//           <IconButton
//             icon={lockAspectRatio ? <LockIcon /> : <UnlockIcon />}
//             onClick={() => setLockAspectRatio(!lockAspectRatio)}
//             size="sm"
//             aria-label="Toggle aspect ratio lock"
//             colorScheme={lockAspectRatio ? "blue" : "gray"}
//             variant="outline"
//           />
//           <Select
//             value={selectedRatio}
//             onChange={(e) => setSelectedRatio(e.target.value)}
//             size="sm"
//             width="110px"
//             isDisabled={!lockAspectRatio}
//           >
//             <option value="1:1">Square (1:1)</option>
//             <option value="4:3">Standard (4:3)</option>
//             <option value="16:9">Widescreen (16:9)</option>
//             <option value="3:4">Portrait (3:4)</option>
//             <option value="9:16">Vertical (9:16)</option>
//           </Select>
//         </HStack>
//         <Text fontSize="sm" color="gray.500">
//           {Math.round(crop.width)} x {Math.round(crop.height)}
//         </Text>
//       </Flex>

//       <Flex justify="center" mb={4}>
//         <Box
//           ref={containerRef}
//           position="relative"
//           width={`${containerWidth}px`}
//           height={`${containerHeight}px`}
//           bg="gray.100"
//           borderRadius="lg"
//           overflow="hidden"
//           cursor="default"
//         >
//           <img
//             src={imageSrc}
//             alt="Crop preview"
//             style={{
//               position: "absolute",
//               left: offsetX,
//               top: offsetY,
//               width: displayWidth,
//               height: displayHeight,
//               userSelect: "none",
//               pointerEvents: "none",
//             }}
//           />

//           {/* Dark overlay */}
//           <Box
//             position="absolute"
//             top={0}
//             left={0}
//             right={0}
//             bottom={0}
//             bg="blackAlpha.600"
//             pointerEvents="none"
//           />

//           {/* Crop area (clear) */}
//           <Box
//             position="absolute"
//             left={cropStyle.left}
//             top={cropStyle.top}
//             width={cropStyle.width}
//             height={cropStyle.height}
//             border="2px solid white"
//             boxShadow="0 0 0 9999px rgba(0, 0, 0, 0.5)"
//             cursor="move"
//             onMouseDown={(e) => handleMouseDown(e, "move")}
//           >
//             {/* Resize handles */}
//             <Box
//               position="absolute"
//               bottom="-6px"
//               right="-6px"
//               width="12px"
//               height="12px"
//               bg="white"
//               border="2px solid #3182ce"
//               borderRadius="full"
//               cursor="se-resize"
//               onMouseDown={(e) => {
//                 e.stopPropagation();
//                 handleMouseDown(e, "se");
//               }}
//             />
//             <Box
//               position="absolute"
//               bottom="-6px"
//               left="-6px"
//               width="12px"
//               height="12px"
//               bg="white"
//               border="2px solid #3182ce"
//               borderRadius="full"
//               cursor="sw-resize"
//               onMouseDown={(e) => {
//                 e.stopPropagation();
//                 handleMouseDown(e, "sw");
//               }}
//             />
//             <Box
//               position="absolute"
//               top="-6px"
//               right="-6px"
//               width="12px"
//               height="12px"
//               bg="white"
//               border="2px solid #3182ce"
//               borderRadius="full"
//               cursor="ne-resize"
//               onMouseDown={(e) => {
//                 e.stopPropagation();
//                 handleMouseDown(e, "ne");
//               }}
//             />
//             <Box
//               position="absolute"
//               top="-6px"
//               left="-6px"
//               width="12px"
//               height="12px"
//               bg="white"
//               border="2px solid #3182ce"
//               borderRadius="full"
//               cursor="nw-resize"
//               onMouseDown={(e) => {
//                 e.stopPropagation();
//                 handleMouseDown(e, "nw");
//               }}
//             />
//           </Box>
//         </Box>
//       </Flex>

//       <Flex gap={3} mt={4}>
//         <Button onClick={onCancel} flex={1} variant="outline">
//           Cancel
//         </Button>
//         <Button onClick={applyCrop} flex={1} colorScheme="blue">
//           Apply Crop
//         </Button>
//       </Flex>
//     </Box>
//   );
// };

// const EditAvatarModal = ({
//   isOpen,
//   onClose,
//   user,
//   previewUrl,
//   refetchUser,
// }) => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [localPreviewUrl, setLocalPreviewUrl] = useState(previewUrl || null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [showCropper, setShowCropper] = useState(false);
//   const [tempImageUrl, setTempImageUrl] = useState(null);
//   const [croppedBlob, setCroppedBlob] = useState(null);
//   const [cropData, setCropData] = useState(null);

//   const [createItemMutation] = useCreateItemMutation();

//   const handleSelect = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!["image/png", "image/jpeg"].includes(file.type)) {
//       toast.error("Only PNG or JPEG allowed");
//       return;
//     }

//     const objectUrl = URL.createObjectURL(file);
//     setTempImageUrl(objectUrl);
//     setShowCropper(true);
//     setSelectedFile(file);
//     setCropData(null);
//     e.target.value = null;
//   };

//   const handleCropComplete = (blob, crop) => {
//     const objectUrl = URL.createObjectURL(blob);
//     setLocalPreviewUrl(objectUrl);
//     setCroppedBlob(blob);
//     setCropData(crop);
//     setShowCropper(false);

//     if (tempImageUrl) {
//       URL.revokeObjectURL(tempImageUrl);
//       setTempImageUrl(null);
//     }
//   };

//   const handleCancelCrop = () => {
//     setShowCropper(false);
//     if (tempImageUrl) {
//       URL.revokeObjectURL(tempImageUrl);
//       setTempImageUrl(null);
//     }
//     if (!croppedBlob && !selectedFile) {
//       setSelectedFile(null);
//     }
//   };

//   const handleSave = async () => {
//     if (!croppedBlob && !selectedFile) return;

//     try {
//       setIsUploading(true);

//       let finalBlob = croppedBlob;

//       if (!finalBlob && selectedFile) {
//         finalBlob = await compressImage(selectedFile);
//       } else if (finalBlob) {
//         const compressedBlob = await compressImage(
//           new File([finalBlob], "cropped.jpg", { type: "image/jpeg" }),
//         );
//         finalBlob = compressedBlob;
//       }

//       const finalFile = new File([finalBlob], "profile.jpg", {
//         type: "image/jpeg",
//       });

//       const formData = new FormData();
//       formData.append("userId", user._id);
//       formData.append("profileImage", finalFile);

//       await createItemMutation({
//         path: "/v3/users/upload/profile-image",
//         body: formData,
//         formData: true,
//       }).unwrap();

//       toast.success("Profile image updated");
//       refetchUser();
//       handleClose();
//     } catch (e) {
//       console.log(e);
//       toast.error("Upload failed");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleClose = () => {
//     onClose();
//     setShowCropper(false);
//     if (tempImageUrl) {
//       URL.revokeObjectURL(tempImageUrl);
//     }
//     if (localPreviewUrl && localPreviewUrl !== previewUrl) {
//       URL.revokeObjectURL(localPreviewUrl);
//     }
//     setSelectedFile(null);
//     setCroppedBlob(null);
//     setCropData(null);
//   };

//   const hasImage = Boolean(localPreviewUrl);

//   return (
//     <Modal isOpen={isOpen} onClose={handleClose} isCentered size="lg">
//       <ModalOverlay backdropFilter="blur(6px)" />
//       <ModalContent mx="2" borderRadius="xl" overflow="hidden">
//         <ModalHeader>
//           {showCropper ? "Crop Image" : "Update Profile Photo"}
//         </ModalHeader>

//         <ModalBody>
//           {showCropper ? (
//             <ImageCropper
//               imageSrc={tempImageUrl}
//               onCropComplete={handleCropComplete}
//               onCancel={handleCancelCrop}
//               initialCrop={cropData}
//             />
//           ) : (
//             <Flex direction="column" align="center" gap={6}>
//               {/* IMAGE PREVIEW */}
//               <Box
//                 position="relative"
//                 w="220px"
//                 h="220px"
//                 borderRadius="xl"
//                 overflow="hidden"
//                 bg="gray.100"
//                 boxShadow="lg"
//               >
//                 {hasImage ? (
//                   <ChakraImage
//                     src={localPreviewUrl}
//                     alt={user.fullName}
//                     w="100%"
//                     h="100%"
//                     objectFit="cover"
//                     fallback={
//                       <Flex
//                         w="100%"
//                         h="100%"
//                         align="center"
//                         justify="center"
//                         color="gray.400"
//                       >
//                         <FiUser size={72} />
//                       </Flex>
//                     }
//                   />
//                 ) : (
//                   <Flex
//                     w="100%"
//                     h="100%"
//                     align="center"
//                     justify="center"
//                     color="gray.400"
//                   >
//                     <FiUser size={72} />
//                   </Flex>
//                 )}

//                 {isUploading && (
//                   <Flex
//                     position="absolute"
//                     inset={0}
//                     bg="blackAlpha.600"
//                     align="center"
//                     justify="center"
//                   >
//                     <Spinner color="white" size="xl" thickness="3px" />
//                   </Flex>
//                 )}
//               </Box>

//               <Button
//                 as="label"
//                 htmlFor="avatar-upload"
//                 leftIcon={<FiUploadCloud />}
//                 bg="blue.50"
//                 color="blue.600"
//                 border="1px solid"
//                 borderColor="blue.100"
//                 cursor="pointer"
//                 _hover={{
//                   bg: "blue.100",
//                   borderColor: "blue.200",
//                 }}
//                 _active={{
//                   bg: "blue.200",
//                 }}
//                 _focusVisible={{
//                   boxShadow: "0 0 0 2px rgba(66,153,225,0.6)",
//                 }}
//                 px={6}
//                 py={5}
//                 borderRadius="lg"
//                 fontWeight="semibold"
//               >
//                 Upload photo
//               </Button>

//               <Text fontSize="sm" color="gray.500">
//                 PNG or JPEG · Max optimized automatically
//               </Text>

//               <Input
//                 id="avatar-upload"
//                 type="file"
//                 accept="image/png,image/jpeg"
//                 onChange={handleSelect}
//                 display="none"
//               />
//             </Flex>
//           )}
//         </ModalBody>

//         {!showCropper && (
//           <ModalFooter>
//             <Button
//               variant="ghost"
//               color="gray.600"
//               _hover={{ bg: "gray.100", color: "gray.800" }}
//               _active={{ bg: "gray.200" }}
//               px={5}
//               borderRadius="lg"
//               onClick={handleClose}
//             >
//               Cancel
//             </Button>

//             <Button
//               ml={3}
//               bg="brand.400"
//               color="gray.100"
//               px={6}
//               borderRadius="lg"
//               fontWeight="semibold"
//               onClick={handleSave}
//               isLoading={isUploading}
//               isDisabled={!selectedFile && !croppedBlob}
//               _hover={{ bg: "brand.500" }}
//               _disabled={{
//                 bg: "brand.200",
//                 cursor: "not-allowed",
//                 _hover: {
//                   bg: "brand.200",
//                 },
//                 _active: {
//                   bg: "brand.200",
//                 },
//               }}
//             >
//               Save changes
//             </Button>
//           </ModalFooter>
//         )}
//       </ModalContent>
//     </Modal>
//   );
// };

// AvatarSection.propTypes = {
//   user: PropTypes.object.isRequired,
//   refetchUser: PropTypes.func.isRequired,
// };

// export default AvatarSection;

import {
  Box,
  Avatar,
  IconButton,
  Flex,
  Text,
  Badge,
  HStack,
  Image as ChakraImage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Input,
  ModalFooter,
  Button,
  Spinner,
  ModalBody,
  Select,
} from "@chakra-ui/react";
import { EditIcon, LockIcon, UnlockIcon } from "@chakra-ui/icons";
import { FiUploadCloud, FiUser } from "react-icons/fi";

import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";
import { useCreateItemMutation } from "api/apiSlice";
import { compressImage, resolveInitialImage } from "../../utils/imageUtils";
import { useModalColors } from "hooks/useModalColors";

const LG_IMAGE_BOX_SIZE = "250px";
const SM_IMAGE_BOX_SIZE = "200px";

const StatusBadge = ({ isOnline }) => {
  const colors = useModalColors();
  const color = isOnline ? colors.accentGold : colors.mutedText;
  const label = isOnline ? "Online" : "Offline";

  return (
    <Flex
      align="center"
      gap={2}
      px={3}
      py={1}
      borderRadius="full"
      bg={isOnline ? `${colors.accentGold}15` : colors.bgInput}
      border="1px solid"
      borderColor={isOnline ? colors.accentGold : colors.borderColor}
      w="fit-content"
      position="relative"
    >
      <Box w="8px" h="8px" borderRadius="full" bg={color} position="relative">
        {isOnline && (
          <Box
            position="absolute"
            inset={0}
            borderRadius="full"
            bg={colors.accentGold}
            animation="pulse 1.6s infinite"
            opacity={0.6}
            sx={{
              "@keyframes pulse": {
                "0%": { transform: "scale(1)", opacity: 0.6 },
                "70%": { transform: "scale(2)", opacity: 0 },
                "100%": { opacity: 0 },
              },
            }}
          />
        )}
      </Box>

      <Text fontSize="xs" fontWeight="600" color={color}>
        {label}
      </Text>
    </Flex>
  );
};

const AvatarSection = ({ user, refetchUser }) => {
  const colors = useModalColors();
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const hasImage = Boolean(user?.profileImage);
  const onlineUsers = useSelector((state) => state.onlineUsers);
  const isOnline = onlineUsers?.users?.includes(user?._id?.toString());

  useEffect(() => {
    (async () => {
      const url = await resolveInitialImage(user);
      setPreviewUrl(url || null);
    })();
  }, [user]);

  return (
    <Box w="100%" position="relative">
      <Flex
        w="100%"
        gap={6}
        align="center"
        flexDir={{ base: "column", md: "row" }}
      >
        {/* LEFT: Image / Avatar */}
        <Box
          position="relative"
          w={{ base: SM_IMAGE_BOX_SIZE, lg: LG_IMAGE_BOX_SIZE }}
          h={{ base: SM_IMAGE_BOX_SIZE, lg: LG_IMAGE_BOX_SIZE }}
          bg={colors.bgInput}
          overflow="hidden"
          borderRadius="md"
          flexShrink={0}
          border="1px solid"
          borderColor={colors.borderColor}
        >
          {/* Edit Button */}
          <IconButton
            icon={<EditIcon />}
            position="absolute"
            top={3}
            right={3}
            zIndex={2}
            size="sm"
            variant="brand"
            borderRadius="full"
            onClick={() => setIsOpen(true)}
            shadow="md"
            aria-label="Edit profile"

          />

          {hasImage ? (
            <ChakraImage
              src={previewUrl}
              alt={user.fullName}
              w="100%"
              h="100%"
              objectFit="cover"
              fallback={
                <Avatar
                  w="100%"
                  h="100%"
                  name={user.fullName}
                  size="lg"
                  borderRadius="md"
                />
              }
            />
          ) : (
            <Avatar
              w="100%"
              h="100%"
              name={user.fullName}
              fontSize="5xl"
              borderRadius="md"
            />
          )}
        </Box>

        {/* RIGHT: User Info */}
        <Flex flexDir="column" align={{ base: "center", md: "start" }} gap={3}>
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            color={colors.headingText}
          >
            {user.fullName}
          </Text>

          <Badge
            bg={`${colors.accentGold}15`}
            color={colors.accentGold}
            w="fit-content"
            px={3}
            py={1}
            borderRadius="full"
          >
            {user.roles?.[0]?.roleName || "User"}
          </Badge>

          <Badge
            bg={user?.isActive ? `${colors.accentGold}15` : `${colors.badgeErrorText}15`}
            color={user?.isActive ? colors.accentGold : colors.badgeErrorText}
            w="fit-content"
            px={3}
            py={1}
            borderRadius="full"
          >
            {user?.isActive ? "Active" : "Inactive"}
          </Badge>

          <StatusBadge isOnline={isOnline} />
        </Flex>
      </Flex>

      {isOpen && (
        <EditAvatarModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          user={user}
          refetchUser={refetchUser}
          previewUrl={previewUrl}
        />
      )}
    </Box>
  );
};

// Image cropper component with aspect ratio locking
const ImageCropper = ({
  imageSrc,
  onCropComplete,
  onCancel,
  initialCrop = null,
}) => {
  const colors = useModalColors();
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startCrop, setStartCrop] = useState({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
  });
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [selectedRatio, setSelectedRatio] = useState("1:1");
  const containerRef = useRef(null);

  // Predefined aspect ratios
  const aspectRatios = {
    "1:1": 1,
    "4:3": 4 / 3,
    "16:9": 16 / 9,
    "3:4": 3 / 4,
    "9:16": 9 / 16,
  };

  const getCurrentAspectRatio = () => {
    if (!lockAspectRatio) return null;
    return aspectRatios[selectedRatio];
  };

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setImage(img);

      if (initialCrop && initialCrop.width && initialCrop.height) {
        setCrop({
          x: initialCrop.x,
          y: initialCrop.y,
          width: initialCrop.width,
          height: initialCrop.height,
        });
      } else {
        const aspectRatio = getCurrentAspectRatio();
        let width, height;

        if (aspectRatio && lockAspectRatio) {
          if (aspectRatio >= 1) {
            width = Math.min(img.width, img.height) * 0.6;
            height = width / aspectRatio;
          } else {
            height = Math.min(img.width, img.height) * 0.6;
            width = height * aspectRatio;
          }

          setCrop({
            x: (img.width - width) / 2,
            y: (img.height - height) / 2,
            width: width,
            height: height,
          });
        } else {
          const size = Math.min(img.width, img.height) * 0.6;
          setCrop({
            x: (img.width - size) / 2,
            y: (img.height - size) / 2,
            width: size,
            height: size,
          });
        }
      }
    };
    img.src = imageSrc;
  }, [imageSrc, initialCrop, lockAspectRatio, selectedRatio]);

  const getMousePos = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = image.width / rect.width;
    const scaleY = image.height / rect.height;

    let clientX, clientY;

    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    return {
      x: Math.max(0, Math.min(x, image.width)),
      y: Math.max(0, Math.min(y, image.height)),
    };
  };

  const handleMouseDown = (e, type) => {
    e.preventDefault();
    e.stopPropagation();

    if (!image) return;

    setIsDragging(true);
    setDragType(type);
    setStartPos(getMousePos(e));
    setStartCrop({ ...crop });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !image) return;

    const currentPos = getMousePos(e);
    const deltaX = currentPos.x - startPos.x;
    const deltaY = currentPos.y - startPos.y;

    let newCrop = { ...startCrop };
    const aspectRatio = getCurrentAspectRatio();

    switch (dragType) {
      case "move":
        newCrop.x = Math.max(
          0,
          Math.min(startCrop.x + deltaX, image.width - startCrop.width),
        );
        newCrop.y = Math.max(
          0,
          Math.min(startCrop.y + deltaY, image.height - startCrop.height),
        );
        break;
      case "se":
        if (lockAspectRatio && aspectRatio) {
          let newWidth = Math.max(50, startCrop.width + deltaX);
          let newHeight = newWidth / aspectRatio;

          if (startCrop.y + newHeight > image.height) {
            newHeight = image.height - startCrop.y;
            newWidth = newHeight * aspectRatio;
          }
          if (startCrop.x + newWidth > image.width) {
            newWidth = image.width - startCrop.x;
            newHeight = newWidth / aspectRatio;
          }

          newCrop.width = newWidth;
          newCrop.height = newHeight;
        } else {
          newCrop.width = Math.max(
            50,
            Math.min(startCrop.width + deltaX, image.width - startCrop.x),
          );
          newCrop.height = Math.max(
            50,
            Math.min(startCrop.height + deltaY, image.height - startCrop.y),
          );
        }
        break;
      case "sw":
        if (lockAspectRatio && aspectRatio) {
          let newWidth = Math.max(50, startCrop.width - deltaX);
          let newHeight = newWidth / aspectRatio;
          let newX = startCrop.x + deltaX;

          if (newX < 0) {
            newX = 0;
            newWidth = startCrop.width + startCrop.x;
            newHeight = newWidth / aspectRatio;
          }
          if (newX + newWidth > image.width) {
            newWidth = image.width - newX;
            newHeight = newWidth / aspectRatio;
          }
          if (startCrop.y + newHeight > image.height) {
            newHeight = image.height - startCrop.y;
            newWidth = newHeight * aspectRatio;
            newX = startCrop.x + startCrop.width - newWidth;
          }

          newCrop.width = newWidth;
          newCrop.height = newHeight;
          newCrop.x = newX;
        } else {
          newCrop.width = Math.max(
            50,
            Math.min(startCrop.width - deltaX, startCrop.x + startCrop.width),
          );
          newCrop.x = Math.max(
            0,
            Math.min(startCrop.x + deltaX, startCrop.x + startCrop.width - 50),
          );
          newCrop.height = Math.max(
            50,
            Math.min(startCrop.height + deltaY, image.height - startCrop.y),
          );
        }
        break;
      case "ne":
        if (lockAspectRatio && aspectRatio) {
          let newHeight = Math.max(50, startCrop.height - deltaY);
          let newWidth = newHeight * aspectRatio;
          let newY = startCrop.y + deltaY;

          if (newY < 0) {
            newY = 0;
            newHeight = startCrop.height + startCrop.y;
            newWidth = newHeight * aspectRatio;
          }
          if (newY + newHeight > image.height) {
            newHeight = image.height - newY;
            newWidth = newHeight * aspectRatio;
          }
          if (startCrop.x + newWidth > image.width) {
            newWidth = image.width - startCrop.x;
            newHeight = newWidth / aspectRatio;
            newY = startCrop.y + startCrop.height - newHeight;
          }

          newCrop.height = newHeight;
          newCrop.width = newWidth;
          newCrop.y = newY;
        } else {
          newCrop.width = Math.max(
            50,
            Math.min(startCrop.width + deltaX, image.width - startCrop.x),
          );
          newCrop.height = Math.max(
            50,
            Math.min(startCrop.height - deltaY, startCrop.y + startCrop.height),
          );
          newCrop.y = Math.max(
            0,
            Math.min(startCrop.y + deltaY, startCrop.y + startCrop.height - 50),
          );
        }
        break;
      case "nw":
        if (lockAspectRatio && aspectRatio) {
          let newWidth = Math.max(50, startCrop.width - deltaX);
          let newHeight = newWidth / aspectRatio;
          let newX = startCrop.x + deltaX;
          let newY = startCrop.y + deltaY;

          if (newX < 0) {
            newX = 0;
            newWidth = startCrop.width + startCrop.x;
            newHeight = newWidth / aspectRatio;
          }
          if (newY < 0) {
            newY = 0;
            newHeight = startCrop.height + startCrop.y;
            newWidth = newHeight * aspectRatio;
          }
          if (newX + newWidth > image.width) {
            newWidth = image.width - newX;
            newHeight = newWidth / aspectRatio;
          }
          if (newY + newHeight > image.height) {
            newHeight = image.height - newY;
            newWidth = newHeight * aspectRatio;
          }

          newCrop.width = newWidth;
          newCrop.height = newHeight;
          newCrop.x = newX;
          newCrop.y = newY;
        } else {
          newCrop.width = Math.max(
            50,
            Math.min(startCrop.width - deltaX, startCrop.x + startCrop.width),
          );
          newCrop.x = Math.max(
            0,
            Math.min(startCrop.x + deltaX, startCrop.x + startCrop.width - 50),
          );
          newCrop.height = Math.max(
            50,
            Math.min(startCrop.height - deltaY, startCrop.y + startCrop.height),
          );
          newCrop.y = Math.max(
            0,
            Math.min(startCrop.y + deltaY, startCrop.y + startCrop.height - 50),
          );
        }
        break;
      default:
        break;
    }

    setCrop(newCrop);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragType(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove]);

  const applyCrop = () => {
    if (!image) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height,
    );

    canvas.toBlob(
      (blob) => {
        onCropComplete(blob, crop);
      },
      "image/jpeg",
      0.95,
    );
  };

  if (!image) {
    return (
      <Flex justify="center" align="center" h="400px">
        <Spinner size="xl" color={colors.accentGold} />
      </Flex>
    );
  }

  const containerWidth = 500;
  const containerHeight = 400;
  const scaleX = containerWidth / image.width;
  const scaleY = containerHeight / image.height;
  const scale = Math.min(scaleX, scaleY);

  const displayWidth = image.width * scale;
  const displayHeight = image.height * scale;
  const offsetX = (containerWidth - displayWidth) / 2;
  const offsetY = (containerHeight - displayHeight) / 2;

  const cropStyle = {
    left: offsetX + crop.x * scale,
    top: offsetY + crop.y * scale,
    width: crop.width * scale,
    height: crop.height * scale,
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <HStack spacing={2}>
          <IconButton
            icon={lockAspectRatio ? <LockIcon /> : <UnlockIcon />}
            onClick={() => setLockAspectRatio(!lockAspectRatio)}
            size="sm"
            aria-label="Toggle aspect ratio lock"
            variant="ghost"
            color={colors.bodyText}
            _hover={{
              color: colors.accentGold,
              bg: colors.secondaryBtnHoverBg,
            }}
          />
          <Select
            value={selectedRatio}
            onChange={(e) => setSelectedRatio(e.target.value)}
            size="sm"
            width="110px"
            isDisabled={!lockAspectRatio}
            bg={colors.bgInput}
            borderColor={colors.borderColor}
            color={colors.headingText}
            _hover={{ borderColor: colors.accentGold }}
            _focus={{
              borderColor: colors.accentGold,
              boxShadow: `0 0 0 1px ${colors.accentGold}`,
            }}
          >
            <option value="1:1">Square (1:1)</option>
            <option value="4:3">Standard (4:3)</option>
            <option value="16:9">Widescreen (16:9)</option>
            <option value="3:4">Portrait (3:4)</option>
            <option value="9:16">Vertical (9:16)</option>
          </Select>
        </HStack>
        <Text fontSize="sm" color={colors.mutedText}>
          {Math.round(crop.width)} x {Math.round(crop.height)}
        </Text>
      </Flex>

      <Flex justify="center" mb={4}>
        <Box
          ref={containerRef}
          position="relative"
          width={`${containerWidth}px`}
          height={`${containerHeight}px`}
          bg={colors.bgInput}
          borderRadius="lg"
          overflow="hidden"
          cursor="default"
          border="1px solid"
          borderColor={colors.borderColor}
        >
          <img
            src={imageSrc}
            alt="Crop preview"
            style={{
              position: "absolute",
              left: offsetX,
              top: offsetY,
              width: displayWidth,
              height: displayHeight,
              userSelect: "none",
              pointerEvents: "none",
            }}
          />

          {/* Dark overlay */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.600"
            pointerEvents="none"
          />

          {/* Crop area (clear) */}
          <Box
            position="absolute"
            left={cropStyle.left}
            top={cropStyle.top}
            width={cropStyle.width}
            height={cropStyle.height}
            border="2px solid white"
            boxShadow="0 0 0 9999px rgba(0, 0, 0, 0.5)"
            cursor="move"
            onMouseDown={(e) => handleMouseDown(e, "move")}
          >
            {/* Resize handles */}
            <Box
              position="absolute"
              bottom="-6px"
              right="-6px"
              width="12px"
              height="12px"
              bg="white"
              border="2px solid"
              borderColor={colors.accentGold}
              borderRadius="full"
              cursor="se-resize"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(e, "se");
              }}
            />
            <Box
              position="absolute"
              bottom="-6px"
              left="-6px"
              width="12px"
              height="12px"
              bg="white"
              border="2px solid"
              borderColor={colors.accentGold}
              borderRadius="full"
              cursor="sw-resize"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(e, "sw");
              }}
            />
            <Box
              position="absolute"
              top="-6px"
              right="-6px"
              width="12px"
              height="12px"
              bg="white"
              border="2px solid"
              borderColor={colors.accentGold}
              borderRadius="full"
              cursor="ne-resize"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(e, "ne");
              }}
            />
            <Box
              position="absolute"
              top="-6px"
              left="-6px"
              width="12px"
              height="12px"
              bg="white"
              border="2px solid"
              borderColor={colors.accentGold}
              borderRadius="full"
              cursor="nw-resize"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(e, "nw");
              }}
            />
          </Box>
        </Box>
      </Flex>

      <Flex gap={3} mt={4}>
        <Button onClick={onCancel} flex={1} variant="ghost" color={colors.bodyText} _hover={{ bg: colors.secondaryBtnHoverBg, color: colors.headingText }}>
          Cancel
        </Button>
        <Button onClick={applyCrop} flex={1} bg={colors.accentGold} color={colors.headerText} _hover={{ bg: colors.goldLight }}>
          Apply Crop
        </Button>
      </Flex>
    </Box>
  );
};

const EditAvatarModal = ({
  isOpen,
  onClose,
  user,
  previewUrl,
  refetchUser,
}) => {
  const colors = useModalColors();
  const [selectedFile, setSelectedFile] = useState(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState(previewUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState(null);
  const [croppedBlob, setCroppedBlob] = useState(null);
  const [cropData, setCropData] = useState(null);

  const [createItemMutation] = useCreateItemMutation();

  const handleSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      toast.error("Only PNG or JPEG allowed");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setTempImageUrl(objectUrl);
    setShowCropper(true);
    setSelectedFile(file);
    setCropData(null);
    e.target.value = null;
  };

  const handleCropComplete = (blob, crop) => {
    const objectUrl = URL.createObjectURL(blob);
    setLocalPreviewUrl(objectUrl);
    setCroppedBlob(blob);
    setCropData(crop);
    setShowCropper(false);

    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
      setTempImageUrl(null);
    }
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
      setTempImageUrl(null);
    }
    if (!croppedBlob && !selectedFile) {
      setSelectedFile(null);
    }
  };

  const handleSave = async () => {
    if (!croppedBlob && !selectedFile) return;

    try {
      setIsUploading(true);

      let finalBlob = croppedBlob;

      if (!finalBlob && selectedFile) {
        finalBlob = await compressImage(selectedFile);
      } else if (finalBlob) {
        const compressedBlob = await compressImage(
          new File([finalBlob], "cropped.jpg", { type: "image/jpeg" }),
        );
        finalBlob = compressedBlob;
      }

      const finalFile = new File([finalBlob], "profile.jpg", {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("profileImage", finalFile);

      await createItemMutation({
        path: "/v3/users/upload/profile-image",
        body: formData,
        formData: true,
      }).unwrap();

      toast.success("Profile image updated");
      refetchUser();
      handleClose();
    } catch (e) {
      console.log(e);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setShowCropper(false);
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
    }
    if (localPreviewUrl && localPreviewUrl !== previewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    setSelectedFile(null);
    setCroppedBlob(null);
    setCropData(null);
  };

  const hasImage = Boolean(localPreviewUrl);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="lg">
      <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(6px)" />
      <ModalContent mx="2" borderRadius="xl" overflow="hidden" bg={colors.bg}>
        <ModalHeader
          bg={colors.headerBg}
          color={colors.headerText}
          borderBottom="1px solid"
          borderColor={colors.borderColor}
        >
          {showCropper ? "Crop Image" : "Update Profile Photo"}
        </ModalHeader>

        <ModalBody>
          {showCropper ? (
            <ImageCropper
              imageSrc={tempImageUrl}
              onCropComplete={handleCropComplete}
              onCancel={handleCancelCrop}
              initialCrop={cropData}
            />
          ) : (
            <Flex direction="column" align="center" gap={6}>
              <Box
                position="relative"
                w="220px"
                h="220px"
                borderRadius="xl"
                overflow="hidden"
                bg={colors.bgInput}
                boxShadow={colors.cardShadow}
                border="1px solid"
                borderColor={colors.borderColor}
              >
                {hasImage ? (
                  <ChakraImage
                    src={localPreviewUrl}
                    alt={user.fullName}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    fallback={
                      <Flex
                        w="100%"
                        h="100%"
                        align="center"
                        justify="center"
                        color={colors.mutedText}
                      >
                        <FiUser size={72} />
                      </Flex>
                    }
                  />
                ) : (
                  <Flex
                    w="100%"
                    h="100%"
                    align="center"
                    justify="center"
                    color={colors.mutedText}
                  >
                    <FiUser size={72} />
                  </Flex>
                )}

                {isUploading && (
                  <Flex
                    position="absolute"
                    inset={0}
                    bg="blackAlpha.600"
                    align="center"
                    justify="center"
                  >
                    <Spinner color="white" size="xl" thickness="3px" />
                  </Flex>
                )}
              </Box>

              <Button
                as="label"
                htmlFor="avatar-upload"
                leftIcon={<FiUploadCloud />}
                bg={colors.bgInput}
                color={colors.accentGold}
                border="1px solid"
                borderColor={colors.borderColor}
                cursor="pointer"
                _hover={{
                  bg: colors.bgInputHover,
                  borderColor: colors.accentGold,
                }}
                _active={{
                  bg: colors.bgInput,
                }}
                px={6}
                py={5}
                borderRadius="lg"
                fontWeight="semibold"
              >
                Upload photo
              </Button>

              <Text fontSize="sm" color={colors.mutedText}>
                PNG or JPEG · Max optimized automatically
              </Text>

              <Input
                id="avatar-upload"
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleSelect}
                display="none"
              />
            </Flex>
          )}
        </ModalBody>

        {!showCropper && (
          <ModalFooter
            bg={colors.footerBg}
            borderTop="1px solid"
            borderColor={colors.borderColor}
          >
            <Button
              variant="ghost"
              onClick={handleClose}
              px={5}
              borderRadius="lg"
              color={colors.bodyText}
              _hover={{
                bg: colors.secondaryBtnHoverBg,
                color: colors.headingText,
              }}
            >
              Cancel
            </Button>

            <Button
              ml={3}
              bg={colors.accentGold}
              color={colors.headerText}
              px={6}
              borderRadius="lg"
              fontWeight="semibold"
              onClick={handleSave}
              isLoading={isUploading}
              isDisabled={!selectedFile && !croppedBlob}
              _hover={{
                bg: colors.goldLight,
                transform: "translateY(-1px)",
                boxShadow: colors.goldGlow,
              }}
              _active={{ bg: colors.goldDark }}
              _disabled={{
                bg: colors.mutedText,
                cursor: "not-allowed",
              }}
              transition="all 0.2s ease"
            >
              Save changes
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

AvatarSection.propTypes = {
  user: PropTypes.object.isRequired,
  refetchUser: PropTypes.func.isRequired,
};

export default AvatarSection;