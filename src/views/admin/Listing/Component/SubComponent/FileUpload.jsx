import React, { useState } from "react";
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

const FileUpload = ({files, setFiles}) => {
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
        <Box
          border="2px dashed"
          borderColor={isDragging ? "blue.500" : "gray.300"}
          borderRadius="lg"
          p={8}
          textAlign="center"
          width="100%"
          bg={isDragging ? "blue.50" : "gray.50"}
          onDragEnter={(e) => handleDragEvents(e, "enter")}
          onDragLeave={(e) => handleDragEvents(e, "leave")}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <Icon as={FiUpload} boxSize={8} color="gray.500" mb={2} />
          <Text fontSize="lg" fontWeight="semibold" mb={1}>
            Drag and drop files here
          </Text>
          <Text color="gray.500" mb={4}>
            or
          </Text>
          <Button as="label" colorScheme="brand" cursor="pointer" htmlFor="file-upload">
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

        {files.length > 0 && (
          <Box width="100%">
            <Text fontSize="md" fontWeight="semibold" mb={2}>
              Uploaded Files ({files.length})
            </Text>
            <VStack spacing={3} align="stretch">
              {files.map((url) => {
                const name = url.split("/").pop();
                return (
                  <Box key={url} borderWidth="1px" borderRadius="lg" p={3}>
                    <Flex justify="space-between" align="center">
                      <Box flex="1" minW="0">
                        <HStack spacing={2}>
                          <Tooltip label={name} hasArrow>
                            <Text isTruncated fontWeight="medium">
                              {name}
                            </Text>
                          </Tooltip>
                        </HStack>

                        {uploading[name] && (
                          <>
                            <Progress value={80} size="xs" colorScheme="blue" mt={2} mb={1} />
                            <Flex justify="space-between" align="center">
                              <Text fontSize="sm" color="gray.500">
                                Uploading...
                              </Text>
                            </Flex>
                          </>
                        )}

                        {!uploading[name] && (
                          <Flex align="center" gap={2} mt={2}>
                            <Text fontSize="sm" color="green.500">
                              Upload complete
                            </Text>
                            <Icon as={FiCheck} color="green.500" />
                          </Flex>
                        )}
                      </Box>

                      <IconButton
                        icon={<FiTrash2 />}
                        aria-label={`Remove ${name}`}
                        variant="ghost"
                        colorScheme="red"
                        size="sm"
                        ml={2}
                        onClick={() => removeFile(url)}
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
