import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  Flex,
  Button,
  Image,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { FiUser, FiUploadCloud } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useCreateItemMutation } from 'api/apiSlice';
import { compressImage } from '../../utils/imageUtils';
import { constant } from 'constant';

const ProfilePictureModal = ({
  isOpen,
  onClose,
  user,
  previewUrl,
  refetchUser,
  mode = 'add', // 'add' or 'edit'
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState(previewUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  const [uploadImage] = useCreateItemMutation();

  useEffect(() => {
    setLocalPreviewUrl(previewUrl || null);
    setSelectedFile(null);
  }, [previewUrl, user]);

  const handleSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      toast.error('Only PNG or JPEG files are allowed.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setLocalPreviewUrl(objectUrl);
    e.target.value = null;
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);

      const compressedBlob = await compressImage(selectedFile);
      const compressedFile = new File([compressedBlob], selectedFile.name, {
        type: selectedFile.type,
      });

      const formData = new FormData();
      formData.append('userId', user._id);
      formData.append('profileImage', compressedFile);

      await uploadImage({
        path: '/v3/users/upload/profile-image',
        body: formData,
        formData: true,
      }).unwrap();

      toast.success('Profile picture uploaded successfully!');
      refetchUser?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const headerText =
    mode === 'edit'
      ? 'Do you want to update your profile picture?'
      : 'Do you want to upload a profile picture?';

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent mx="2" borderRadius="xl" overflow="hidden">
        <ModalHeader textAlign="center" fontSize="lg" fontWeight="bold">
          {headerText}
        </ModalHeader>

        <ModalBody>
          <Flex direction="column" align="center" gap={6}>
            {/* Image preview */}
            <Box
              position="relative"
              w="220px"
              h="220px"
              borderRadius="xl"
              overflow="hidden"
              bg="gray.100"
              boxShadow="lg"
            >
              {localPreviewUrl ? (
                <Image
                 src={
    localPreviewUrl?.startsWith('blob:') 
      ? localPreviewUrl 
      : `${constant.baseUrl}${localPreviewUrl}`
  }
                  alt={user.fullName || 'User'}
                  width={220}
                  height={220}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              ) : (
                <Flex w="100%" h="100%" align="center" justify="center" color="gray.400">
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

            {/* Upload button */}
            <Button
              as="label"
              htmlFor="avatar-upload"
              leftIcon={<FiUploadCloud />}
              bg="blue.50"
              color="blue.600"
              border="1px solid"
              borderColor="blue.100"
              cursor="pointer"
              _hover={{ bg: 'blue.100', borderColor: 'blue.200' }}
              px={6}
              py={5}
              borderRadius="lg"
              fontWeight="semibold"
            >
              Select Photo
            </Button>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleSelect}
              display="none"
            />
            <Text fontSize="sm" color="gray.500">
              PNG or JPEG · Optimized automatically
            </Text>
          </Flex>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          {/* Skip */}
          <Button
            variant="ghost"
            color="gray.600"
            _hover={{ bg: 'gray.100', color: 'gray.800' }}
            onClick={onClose}
            borderRadius="lg"
          >
            Skip
          </Button>

          {/* Upload */}
          <Button
            ml={3}
            bg="brand.400"
            color="gray.100"
            px={6}
            borderRadius="lg"
            fontWeight="semibold"
            onClick={handleUpload}
            isLoading={isUploading}
            isDisabled={!selectedFile}
            _hover={{ bg: 'brand.500' }}
          >
            Upload
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfilePictureModal;
