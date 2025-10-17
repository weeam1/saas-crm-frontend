import React, { useState, useCallback } from 'react';
import { Flex, Text, Icon, Image, VStack } from '@chakra-ui/react';
import {
	FaImage,
	FaVideo,
	FaFile,
	FaFilePdf,
	FaFileWord,
	FaFileExcel,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { formatFileSize } from 'utils/whatsappUtils';

const useFileAttachment = () => {
	const [attachedFile, setAttachedFile] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);

	// ---- File Type Config ----
	const FILE_CONFIG = {
		image: {
			types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
			maxSize: 100 * 1024 * 1024,
			icon: FaImage,
			color: 'green.500',
			previewComponent: (file, previewURL) => (
				<Image
					src={previewURL}
					alt={file.name}
					// maxH='200px'
					w='100%'
					maxH={{ base: '450px' }}
					objectFit='contain'
				/>
			),
		},
		video: {
			types: ['video/mp4', 'video/avi', 'video/mov', 'video/mkv'],
			maxSize: 100 * 1024 * 1024,
			icon: FaVideo,
			color: 'purple.500',
			previewComponent: (file, previewURL) => (
				<video
					src={previewURL}
					// height='200px'
					// width='300px'
					w='100%'
					maxH='450px'
					// maxH={{ base: '30vh', md: '40vh', lg: '50vh' }}
					controls
					style={{ objectFit: 'contain' }}
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
						<Text bg='red.200' fontSize='sm' fontWeight='medium' noOfLines={1}>
							{file.name}
						</Text>
						<Text fontSize='xs' color='gray.500'>
							{formatFileSize(file.size)}
						</Text>
					</VStack>
				</Flex>
			),
		},
	};

	// ---- Helpers ----
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
			if (config.types.includes(file.type)) return type;
		}
		return 'document';
	}, []);

	const validateFile = useCallback(
		(file) => {
			const fileType = getFileType(file);
			const config = FILE_CONFIG[fileType];

			if (file.size > config.maxSize)
				throw new Error('File size must be less than 100MB');

			if (!config.types.includes(file.type))
				throw new Error(`Unsupported file type: ${file.type}`);

			return { fileType, config };
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

		if (fileType === 'image') payload.mediaType = 'IMAGE';
		else if (fileType === 'video') payload.mediaType = 'VIDEO';
		else if (fileType === 'document') {
			payload.mediaType = 'DOCUMENT';
			payload.filename = file.name;
		}

		return payload;
	}, []);

	// ---- Fast Simulated Upload ----
	const simulateUpload = useCallback((file, onProgress, onComplete) => {
		setIsUploading(true);
		setUploadProgress(0);
		let progress = 0;

		const step = () => {
			progress += 20; // increments in 20%
			setUploadProgress(progress);
			onProgress(progress);

			if (progress >= 100) {
				setIsUploading(false);
				onComplete(file);
			} else {
				setTimeout(step, 100); // ~0.5s total
			}
		};
		step();
	}, []);

	// ---- Attach File ----
	const attachFile = useCallback(
		(file, caption = '') => {
			try {
				const { fileType } = validateFile(file);

				// Revoke old URL before creating a new one
				if (attachedFile?.file?.previewURL)
					URL.revokeObjectURL(attachedFile.file.previewURL);

				const previewURL = URL.createObjectURL(file);

				simulateUpload(
					file,
					(progress) => console.log(`Upload progress: ${progress}%`),
					(uploadedFile) => {
						const payload = prepareWhatsAppPayload(
							uploadedFile,
							fileType,
							caption
						);
						setAttachedFile({
							file: { ...uploadedFile, previewURL },
							type: fileType,
							payload,
							preview: FILE_CONFIG[fileType].previewComponent(
								uploadedFile,
								previewURL
							),
						});
						toast.success('File ready to send');
					}
				);
			} catch (error) {
				toast.error(error.message);
			}
		},
		[attachedFile, validateFile, simulateUpload, prepareWhatsAppPayload]
	);

	// ---- Remove File ----
	const removeFile = useCallback(() => {
		if (attachedFile?.file?.previewURL) {
			URL.revokeObjectURL(attachedFile.file.previewURL);
		}
		setAttachedFile(null);
		setUploadProgress(0);
		setIsUploading(false);
	}, [attachedFile]);

	// ---- Send File ----
	const sendFile = useCallback(() => {
		if (!attachedFile) return;
		console.log('Sending WhatsApp payload:', attachedFile.payload);
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
