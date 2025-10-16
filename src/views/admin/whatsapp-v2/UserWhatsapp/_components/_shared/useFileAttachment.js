import React, { useState, useRef, useCallback } from 'react';
import {
	Box,
	Flex,
	Text,
	Icon,
	Button,
	Image,
	Progress,
	IconButton,
	VStack,
	HStack,
} from '@chakra-ui/react';
import { AttachmentIcon, CloseIcon } from '@chakra-ui/icons';
import {
	FaImage,
	FaVideo,
	FaFile,
	FaFilePdf,
	FaFileWord,
	FaFileExcel,
} from 'react-icons/fa';

import { toast } from 'react-toastify';

// Custom hook for file management
const useFileAttachment = () => {
	const [attachedFile, setAttachedFile] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);

	const FILE_CONFIG = {
		image: {
			types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
			maxSize: 100 * 1024 * 1024,
			icon: FaImage,
			color: 'green.500',
			previewComponent: (file) => (
				<Image
					src={URL.createObjectURL(file)}
					alt={file.name}
					maxH='200px'
					maxW='300px'
					objectFit='contain'
					borderRadius='md'
				/>
			),
		},
		video: {
			types: ['video/mp4', 'video/avi', 'video/mov', 'video/mkv'],
			maxSize: 100 * 1024 * 1024,
			icon: FaVideo,
			color: 'purple.500',
			previewComponent: (file) => (
				<video
					src={URL.createObjectURL(file)}
					height='200px'
					width='300px'
					controls
					borderRadius='md'
				/>
			),
		},
		document: {
			types: [
				'application/pdf',
				'application/msword',
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				'application/vnd.ms-excel',
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'text/plain',
			],
			maxSize: 100 * 1024 * 1024,
			icon: FaFile,
			color: 'blue.500',
			previewComponent: (file) => (
				<Flex
					align='center'
					gap={3}
					p={4}
					border='1px solid'
					borderColor='gray.200'
					borderRadius='md'
					bg='gray.50'
				>
					<Icon as={getDocumentIcon(file)} boxSize={8} color='blue.500' />
					<VStack align='start' spacing={0}>
						<Text fontSize='sm' fontWeight='medium' noOfLines={1}>
							{file.name}
						</Text>
						<Text fontSize='xs' color='gray.500'>
							{(file.size / (1024 * 1024)).toFixed(2)} MB
						</Text>
					</VStack>
				</Flex>
			),
		},
	};

	const getDocumentIcon = (file) => {
		if (file.type.includes('pdf')) return FaFilePdf;
		if (file.type.includes('word') || file.type.includes('document'))
			return FaFileWord;
		if (file.type.includes('excel') || file.type.includes('spreadsheet'))
			return FaFileExcel;
		return FaFile;
	};

	const getFileType = useCallback((file) => {
		for (const [type, config] of Object.entries(FILE_CONFIG)) {
			if (config.types.includes(file.type)) {
				return type;
			}
		}
		return 'document';
	}, []);

	const validateFile = useCallback(
		(file) => {
			const fileType = getFileType(file);
			const config = FILE_CONFIG[fileType];

			if (file.size > config.maxSize) {
				throw new Error(`File size must be less than 100MB`);
			}

			if (!config.types.includes(file.type)) {
				throw new Error(`Unsupported file type: ${file.type}`);
			}

			return { type: fileType, config };
		},
		[getFileType]
	);

	const prepareWhatsAppPayload = useCallback((file, fileType, caption = '') => {
		const payload = {
			type: fileType,
			file: {
				name: file.name,
				size: file.size,
				type: file.type,
				lastModified: file.lastModified,
			},
			timestamp: new Date().toISOString(),
			metadata: {
				mimeType: file.type,
				extension: file.name.split('.').pop(),
				isImage: fileType === 'image',
				isVideo: fileType === 'video',
				isDocument: fileType === 'document',
			},
			caption: caption.trim(),
		};

		// Add WhatsApp-specific fields
		if (fileType === 'image') {
			payload.mediaType = 'IMAGE';
		} else if (fileType === 'video') {
			payload.mediaType = 'VIDEO';
		} else if (fileType === 'document') {
			payload.mediaType = 'DOCUMENT';
			payload.filename = file.name;
		}

		return payload;
	}, []);

	const simulateUpload = useCallback(
		(file, onProgress, onComplete, onError) => {
			setIsUploading(true);
			setUploadProgress(0);

			const totalSize = file.size;
			let uploaded = 0;
			const chunkSize = totalSize / 100;

			const uploadInterval = setInterval(() => {
				uploaded += chunkSize;
				const progress = Math.min((uploaded / totalSize) * 100, 100);
				setUploadProgress(progress);
				onProgress(progress);

				if (progress >= 100) {
					clearInterval(uploadInterval);
					setIsUploading(false);
					onComplete(file);
				}
			}, 50);
		},
		[]
	);

	const attachFile = useCallback(
		(file, caption = '') => {
			try {
				const { type: fileType } = validateFile(file);

				simulateUpload(
					file,
					(progress) => {
						// Progress callback
						console.log(`Upload progress: ${progress}%`);
					},
					(uploadedFile) => {
						// Complete callback
						const payload = prepareWhatsAppPayload(
							uploadedFile,
							fileType,
							caption
						);
						setAttachedFile({
							file: uploadedFile,
							type: fileType,
							payload,
							preview: FILE_CONFIG[fileType].previewComponent(uploadedFile),
						});

						toast.success('File ready to send');
					},
					(error) => {
						// Error callback
						// toast({
						// 	title: 'Upload failed',
						// 	description: error.message,
						// 	status: 'error',
						// 	duration: 3000,
						// 	isClosable: true,
						// });
					}
				);
			} catch (error) {
				toast({
					title: 'Invalid file',
					description: error.message,
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			}
		},
		[validateFile, simulateUpload, prepareWhatsAppPayload]
	);

	const removeFile = useCallback(() => {
		if (attachedFile?.file) {
			URL.revokeObjectURL(attachedFile.file);
		}
		setAttachedFile(null);
		setUploadProgress(0);
		setIsUploading(false);
	}, [attachedFile]);

	const sendFile = useCallback(() => {
		if (!attachedFile) return;

		// Here you would send the payload to your backend/WhatsApp API
		console.log('Sending WhatsApp payload:', attachedFile.payload);

		// Simulate API call
		toast({
			title: 'Message sent',
			description: 'File has been sent successfully',
			status: 'success',
			duration: 2000,
			isClosable: true,
		});

		removeFile();
	}, [attachedFile, removeFile]);

	return {
		attachedFile,
		uploadProgress,
		isUploading,
		attachFile,
		removeFile,
		sendFile,
		FILE_CONFIG,
		getFileType,
	};
};

export default useFileAttachment;
