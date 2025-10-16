import {
	Box,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Text,
	Flex,
	Button,
	Icon,
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

import { useRef, useState } from 'react';
import useFileAttachment from './useFileAttachment';
import { IoSend } from 'react-icons/io5';
import { whatsappColors } from 'utils/helpers';

// const MediaAttachment = () => {
// 	const fileInputRef = useRef(null);

// 	// Supported file types and their limits
// 	const FILE_CONFIG = {
// 		image: {
// 			types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
// 			maxSize: 100 * 1024 * 1024, // 100MB
// 			icon: FaImage,
// 			color: 'green.500',
// 		},
// 		video: {
// 			types: ['video/mp4', 'video/avi', 'video/mov', 'video/mkv'],
// 			maxSize: 100 * 1024 * 1024,
// 			icon: FaVideo,
// 			color: 'purple.500',
// 		},
// 		document: {
// 			types: [
// 				'application/pdf',
// 				'application/msword',
// 				'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
// 				'application/vnd.ms-excel',
// 				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
// 				'text/plain',
// 			],
// 			maxSize: 100 * 1024 * 1024,
// 			icon: FaFile,
// 			color: 'blue.500',
// 		},
// 	};

// 	const getFileType = (file) => {
// 		for (const [type, config] of Object.entries(FILE_CONFIG)) {
// 			if (config.types.includes(file.type)) {
// 				return type;
// 			}
// 		}
// 		return 'document'; // fallback
// 	};

// 	const validateFile = (file) => {
// 		const fileType = getFileType(file);
// 		const config = FILE_CONFIG[fileType];

// 		if (file.size > config.maxSize) {
// 			throw new Error(`File size must be less than 100MB`);
// 		}

// 		if (!config.types.includes(file.type)) {
// 			throw new Error(`Unsupported file type: ${file.type}`);
// 		}

// 		return { type: fileType, config };
// 	};

// 	const prepareWhatsAppPayload = (file, fileType) => {
// 		const payload = {
// 			type: fileType,
// 			file: {
// 				name: file.name,
// 				size: file.size,
// 				type: file.type,
// 				lastModified: file.lastModified,
// 			},
// 			timestamp: new Date().toISOString(),
// 			metadata: {
// 				mimeType: file.type,
// 				extension: file.name.split('.').pop(),
// 				isImage: fileType === 'image',
// 				isVideo: fileType === 'video',
// 				isDocument: fileType === 'document',
// 			},
// 		};

// 		// Add WhatsApp-specific fields based on file type
// 		if (fileType === 'image') {
// 			payload.mediaType = 'IMAGE';
// 			payload.caption = ''; // Optional caption
// 		} else if (fileType === 'video') {
// 			payload.mediaType = 'VIDEO';
// 			payload.caption = '';
// 		} else if (fileType === 'document') {
// 			payload.mediaType = 'DOCUMENT';
// 			payload.filename = file.name;
// 		}

// 		return payload;
// 	};

// 	const handleFileSelect = (event) => {
// 		const file = event.target.files[0];
// 		if (!file) return;

// 		try {
// 			// Validate file
// 			const { type: fileType, config } = validateFile(file);

// 			// Prepare WhatsApp payload
// 			const payload = prepareWhatsAppPayload(file, fileType);

// 			console.log('File validated:', file);
// 			console.log('WhatsApp payload:', payload);

// 			// Show success message
// 			toast.success('File ready to send');

// 			// Here you would typically:
// 			// 1. Upload file to your server/CDN
// 			// 2. Get file URL
// 			// 3. Send payload to WhatsApp API
// 			// handleSendMessage(payload);
// 		} catch (error) {
// 			toast.error('File upload failed');
// 		}

// 		// Reset file input
// 		event.target.value = '';
// 	};

// 	const handleMenuClick = (fileType) => {
// 		// Trigger file input click
// 		if (fileInputRef.current) {
// 			fileInputRef.current.accept = FILE_CONFIG[fileType].types.join(',');
// 			fileInputRef.current.click();
// 		}
// 	};

// 	return (
// 		<>
// 			{/* Hidden file input */}
// 			<input
// 				type='file'
// 				ref={fileInputRef}
// 				onChange={handleFileSelect}
// 				style={{ display: 'none' }}
// 				accept={Object.values(FILE_CONFIG)
// 					.flatMap((config) => config.types)
// 					.join(',')}
// 			/>

// 			<Menu placement='top-start'>
// 				<MenuButton
// 					as={Box}
// 					cursor='pointer'
// 					p={2}
// 					borderRadius='md'
// 					_hover={{ bg: 'gray.100' }}
// 					_active={{ bg: 'gray.200' }}
// 					transition='all 0.2s'
// 					aria-label='Attach file'
// 				>
// 					<Flex align='center' justify='center'>
// 						<AttachmentIcon
// 							boxSize={5}
// 							color='gray.600'
// 							transform='rotate(-45deg)'
// 						/>
// 					</Flex>
// 				</MenuButton>

// 				<MenuList
// 					p={2}
// 					borderRadius='lg'
// 					boxShadow='lg'
// 					border='1px solid'
// 					borderColor='gray.200'
// 					minW='150px'
// 					mb={2}
// 				>
// 					<MenuItem
// 						onClick={() => handleMenuClick('image')}
// 						borderRadius='md'
// 						_hover={{ bg: 'blue.50' }}
// 					>
// 						<Flex align='center' gap={3}>
// 							<Icon as={FaImage} color='green.500' boxSize={4} />
// 							<Text fontSize='sm'>Photos</Text>
// 						</Flex>
// 					</MenuItem>

// 					<MenuItem
// 						onClick={() => handleMenuClick('video')}
// 						borderRadius='md'
// 						_hover={{ bg: 'blue.50' }}
// 					>
// 						<Flex align='center' gap={3}>
// 							<Icon as={FaVideo} color='purple.500' boxSize={4} />
// 							<Text fontSize='sm'>Videos</Text>
// 						</Flex>
// 					</MenuItem>

// 					<MenuItem
// 						onClick={() => handleMenuClick('document')}
// 						borderRadius='md'
// 						_hover={{ bg: 'blue.50' }}
// 					>
// 						<Flex align='center' gap={3}>
// 							<Icon as={FaFile} color='blue.500' boxSize={4} />
// 							<Text fontSize='sm'>Documents</Text>
// 						</Flex>
// 					</MenuItem>
// 				</MenuList>
// 			</Menu>
// 		</>
// 	);
// };

const MediaAttachment = ({ onSend }) => {
	const fileInputRef = useRef();
	const [caption, setCaption] = useState('');
	const {
		attachedFile,
		uploadProgress,
		isUploading,
		attachFile,
		removeFile,
		sendFile,
		FILE_CONFIG,
	} = useFileAttachment();

	const handleFileSelect = (event) => {
		const file = event.target.files[0];
		if (!file) return;
		attachFile(file, caption);
		event.target.value = '';
	};

	const handleMenuClick = (fileType) => {
		if (fileInputRef.current) {
			fileInputRef.current.accept = FILE_CONFIG[fileType].types.join(',');
			fileInputRef.current.click();
		}
	};

	const handleSend = () => {
		if (onSend) {
			// onSend(attachedFile.payload);
			console.log('file attach: ', attachedFile.payload);
		}
		sendFile();
		setCaption('');
	};

	return (
		<Box>
			{/* Hidden file input */}
			<input
				type='file'
				ref={fileInputRef}
				onChange={handleFileSelect}
				style={{ display: 'none' }}
				accept={Object.values(FILE_CONFIG)
					.flatMap((config) => config.types)
					.join(',')}
			/>

			{/* File Preview Section */}
			{attachedFile && (
				<Box
					p={4}
					borderBottom='1px solid'
					position='relative'
					bottom='5rem'
					left='15rem'
					borderColor='gray.200'
					bg='white'
				>
					<VStack spacing={3} align='start'>
						{/* Preview Header */}
						<Flex justify='space-between' align='center' width='100%'>
							<Text fontSize='sm' fontWeight='medium' color='gray.600'>
								Send {attachedFile.type}
							</Text>
							<IconButton
								icon={<CloseIcon />}
								size='sm'
								variant='ghost'
								onClick={removeFile}
								aria-label='Remove file'
							/>
						</Flex>

						{/* File Preview */}
						<Box width='100%'>{attachedFile.preview}</Box>

						{/* Upload Progress */}
						{isUploading && (
							<Progress
								value={uploadProgress}
								size='sm'
								width='100%'
								colorScheme='blue'
								borderRadius='full'
							/>
						)}

						<HStack spacing={2}>
							{/* Caption Input */}
							<Box flex='1'>
								<Text fontSize='sm' fontWeight='medium' mb={2} color='gray.600'>
									Caption (optional)
								</Text>
								<input
									type='text'
									value={caption}
									onChange={(e) => setCaption(e.target.value)}
									placeholder='Add a caption...'
									style={{
										width: '100%',
										padding: '8px 12px',
										border: '1px solid #E2E8F0',
										borderRadius: '8px',
										fontSize: '14px',
										outline: 'none',
									}}
								/>
							</Box>

							{/* Send Button */}
							<IconButton
								aria-label='Send message'
								icon={<IoSend size={20} />}
								colorScheme='green'
								bg={whatsappColors.primary}
								borderRadius='full'
								size='md'
								onClick={handleSend}
								_hover={{
									bg: '#128C7E',
									transform: 'scale(1.05)',
									transition: 'all 0.2s ease-in-out',
								}}
								_active={{
									transform: 'scale(0.95)',
								}}
							/>
						</HStack>
					</VStack>
				</Box>
			)}

			{/* Attachment Button */}
			<Flex p={3} align='center' gap={2}>
				<Menu placement='top-start'>
					<MenuButton
						as={Box}
						cursor='pointer'
						p={2}
						borderRadius='md'
						_hover={{ bg: 'gray.100' }}
						_active={{ bg: 'gray.200' }}
						transition='all 0.2s'
						aria-label='Attach file'
					>
						<Flex align='center' justify='center'>
							<AttachmentIcon
								boxSize={5}
								color='gray.600'
								transform='rotate(-45deg)'
							/>
						</Flex>
					</MenuButton>

					<MenuList
						p={2}
						borderRadius='lg'
						boxShadow='lg'
						border='1px solid'
						borderColor='gray.200'
						minW='150px'
					>
						<MenuItem
							onClick={() => handleMenuClick('image')}
							borderRadius='md'
							_hover={{ bg: 'blue.50' }}
						>
							<Flex align='center' gap={3}>
								<Icon as={FaImage} color='green.500' boxSize={4} />
								<Text fontSize='sm'>Photos</Text>
							</Flex>
						</MenuItem>

						<MenuItem
							onClick={() => handleMenuClick('video')}
							borderRadius='md'
							_hover={{ bg: 'blue.50' }}
						>
							<Flex align='center' gap={3}>
								<Icon as={FaVideo} color='purple.500' boxSize={4} />
								<Text fontSize='sm'>Videos</Text>
							</Flex>
						</MenuItem>

						<MenuItem
							onClick={() => handleMenuClick('document')}
							borderRadius='md'
							_hover={{ bg: 'blue.50' }}
						>
							<Flex align='center' gap={3}>
								<Icon as={FaFile} color='blue.500' boxSize={4} />
								<Text fontSize='sm'>Documents</Text>
							</Flex>
						</MenuItem>
					</MenuList>
				</Menu>
			</Flex>
		</Box>
	);
};

export default MediaAttachment;
