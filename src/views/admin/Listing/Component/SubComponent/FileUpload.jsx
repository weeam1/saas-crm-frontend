import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Icon,
  Progress,
  VStack,
  IconButton,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import { FiUpload, FiCheck, FiTrash2 } from "react-icons/fi";
import { useDeleteItemMutation, useCreateItemMutation } from "api/apiSlice";
import { toast } from "react-toastify";
import { useModalColors } from 'hooks/useModalColors';

const FileUpload = ({files, setFiles}) => {
  const colors = useModalColors();
  const [uploading, setUploading] = useState({});
  const [isDragging, setIsDragging] = useState(false);

  const [uploadDocument] = useCreateItemMutation();
  const [deleteItemMutation] = useDeleteItemMutation();

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("document", file);

      const response = await uploadDocument({
        path: `/listing/secondary/upload-documents`,
        body: formData,
        formData: true,
      }).unwrap();

      return response.url;
    } catch (error) {
      toast.error(error?.data?.message || "Upload failed");
      throw error;
    }
  };

  const deleteFileFromServer = async (fileUrl) => {
    try {
      await deleteItemMutation({
        path: `/listing/secondary/remove-documents`,
        body: { fileUrls: [fileUrl] },
      }).unwrap();
      return true;
    } catch (error) {
      toast.error(error?.data?.message || "Deletion failed");
      return false;
    }
  };

  const handleFiles = async (newFiles) => {
    for (const file of newFiles) {
      const fileName = file.name;

      if (uploading[fileName]) {
        toast.warn("File is currently being uploaded");
        continue;
      }

      setUploading((prev) => ({ ...prev, [fileName]: true }));

      try {
        const uploadedUrl = await uploadFile(file);
        setFiles((prev) => [...prev, uploadedUrl]);
      } catch (error) {
        // Do nothing, error already toasts
      } finally {
        setUploading((prev) => {
          const updated = { ...prev };
          delete updated[fileName];
          return updated;
        });
      }
    }
  };

  const removeFile = async (url) => {
    const success = await deleteFileFromServer(url);
    if (success) {
      setFiles((prev) => prev.filter((f) => f !== url));
    }
  };

  const handleDragEvents = (e, type) => {
    e.preventDefault();
    if (type === "enter") setIsDragging(true);
    if (type === "leave") setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e) => {
    handleFiles(Array.from(e.target.files));
    e.target.value = null;
  };

  return (
    <Box width="100%" maxW="600px" mx="auto" p={4}>
      <VStack spacing={4}>
        {/* Drop Zone */}
        <Box
          border="2px dashed"
          borderColor={isDragging ? colors.accentGold : colors.borderColor}
          borderRadius="lg"
          p={8}
          textAlign="center"
          width="100%"
          bg={isDragging ? colors.bgDeep : colors.bgInput}
          transition="all 0.2s ease"
          onDragEnter={(e) => handleDragEvents(e, "enter")}
          onDragLeave={(e) => handleDragEvents(e, "leave")}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <Icon as={FiUpload} boxSize={8} color={colors.mutedText} mb={2} />
          <Text fontSize="lg" fontWeight="semibold" mb={1} color={colors.headingText}>
            Drag and drop files here
          </Text>
          <Text color={colors.mutedText} mb={4}>
            or
          </Text>
          <Button
            as="label"
            variant="brand"
            cursor="pointer"
            htmlFor="file-upload"
          >
            Browse Files
            <input
              type="file"
              id="file-upload"
              hidden
              onChange={handleFileInput}
              multiple
            />
          </Button>
        </Box>

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <Box width="100%">
            <Text fontSize="md" fontWeight="semibold" mb={2} color={colors.headingText}>
              Uploaded Files ({files.length})
            </Text>
            <VStack spacing={3} align="stretch">
              {files.map((url) => {
                const name = url.split("/").pop();
                return (
                  <Box
                    key={url}
                    borderWidth="1px"
                    borderColor={colors.borderColor}
                    borderRadius="lg"
                    p={3}
                    bg={colors.bg}
                  >
                    <Flex justify="space-between" align="center">
                      <Box flex="1" minW="0">
                        <HStack spacing={2}>
                          <Tooltip label={name} hasArrow>
                            <Text isTruncated fontWeight="medium" color={colors.headingText}>
                              {name}
                            </Text>
                          </Tooltip>
                        </HStack>

                        {uploading[name] && (
                          <>
                            <Progress
                              value={80}
                              size="xs"
                              colorScheme="yellow"
                              mt={2}
                              mb={1}
                            />
                            <Flex justify="space-between" align="center">
                              <Text fontSize="sm" color={colors.mutedText}>
                                Uploading...
                              </Text>
                            </Flex>
                          </>
                        )}

                        {!uploading[name] && (
                          <Flex align="center" gap={2} mt={2}>
                            <Text fontSize="sm" color={colors.badgeSuccessText}>
                              Upload complete
                            </Text>
                            <Icon as={FiCheck} color={colors.badgeSuccessText} />
                          </Flex>
                        )}
                      </Box>

                      <IconButton
                        icon={<FiTrash2 />}
                        aria-label={`Remove ${name}`}
                        variant="ghost"
                        size="sm"
                        ml={2}
                        onClick={() => removeFile(url)}
                        color={colors.badgeErrorText}
                        _hover={{ bg: colors.badgeErrorBg, color: colors.badgeErrorText }}
                      />
                    </Flex>
                  </Box>
                );
              })}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default FileUpload;