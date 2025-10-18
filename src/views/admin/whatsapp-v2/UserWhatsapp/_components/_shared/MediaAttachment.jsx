import { useRef, useState } from 'react';
import {
	Box,
	Flex,
	Icon,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalFooter,
	Input,
	Button,
	Progress,
	Image,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { AttachmentIcon } from '@chakra-ui/icons';
import { FaImage, FaVideo, FaFile, FaWhatsapp } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';

import useFileAttachment from './useFileAttachment';
import { whatsappColors } from 'utils/helpers';

const MediaAttachment = ({ onSend }) => {
	const fileInputRef = useRef(null);
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
	const { isOpen, onOpen, onClose } = useDisclosure();

	console.log({ uploadProgress, isUploading });

	// when file is selected
	const handleFileSelect = (event) => {
		const file = event.target.files[0];
		if (!file) return;
		attachFile(file, caption); // start upload immediately
		onOpen(); // open modal instantly
		event.target.value = ''; // reset input
	};

	// file type selection menu
	const handleMenuClick = (type) => {
		if (fileInputRef.current) {
			fileInputRef.current.accept = FILE_CONFIG[type].types.join(',');
			fileInputRef.current.click();
		}
	};

	// send button
	const handleSend = () => {
		sendFile();
		setCaption('');
		onClose();
		if (onSend && attachedFile) onSend(attachedFile.payload);
	};

	return (
		<>
			{/* Hidden file input */}
			<input
				type='file'
				ref={fileInputRef}
				onChange={handleFileSelect}
				style={{ display: 'none' }}
			/>

			{/* Attach icon */}
			<Flex align='center' justify='center'>
				<Menu placement='top-start'>
					<MenuButton
						as={Box}
						cursor='pointer'
						p={2}
						borderRadius='md'
						_hover={{ bg: 'gray.100' }}
						_active={{ bg: 'gray.200' }}
					>
						<AttachmentIcon
							boxSize={5}
							color='gray.600'
							transform='rotate(-45deg)'
						/>
					</MenuButton>

					<MenuList>
						<MenuItem onClick={() => handleMenuClick('image')}>
							<Icon as={FaImage} color='green.500' mr={2} /> Photos
						</MenuItem>
						<MenuItem onClick={() => handleMenuClick('video')}>
							<Icon as={FaVideo} color='purple.500' mr={2} /> Videos
						</MenuItem>
						<MenuItem onClick={() => handleMenuClick('document')}>
							<Icon as={FaFile} color='blue.500' mr={2} /> Documents
						</MenuItem>
					</MenuList>
				</Menu>
			</Flex>

			{/* Modal */}
			<Modal isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent
					position='absolute'
					bottom='10px'
					minW='350px'
					maxW={{ base: '350px', lg: '450px' }}
					// maxW={{ base: '80vw', md: '60vw', lg: '40vw' }}
					borderRadius='2xl'
					overflow='hidden'
					my='8'
					mx='4'
				>
					<ModalBody textAlign='center' p='0'>
						{/* Progress bar if uploading */}
						{isUploading && (
							<Progress
								value={uploadProgress}
								size='md'
								w='100%'
								borderRadius='full'
								colorScheme='green'
								hasStripe
								isAnimated
								mb={2}
							/>
						)}

						{attachedFile ? (
							<>
								{/* Preview */}
								<Box>{attachedFile.preview}</Box>

								{/* Caption input */}
								<Input
									value={caption}
									onChange={(e) => setCaption(e.target.value)}
									placeholder='Caption (optional)'
									size='md'
									bg='white'
									w='100%'
									px='2'
									border='1px solid #e0e0e0'
									_focus={{
										// borderColor: whatsappColors.primary,
										boxShadow: 'none',
									}}
								/>
							</>
						) : (
							!isUploading && <Text color='gray.500'>No media selected</Text>
						)}
					</ModalBody>

					<ModalFooter justifyContent='space-between' p={3}>
						<Button
							size='sm'
							onClick={() => {
								removeFile();
								onClose();
							}}
						>
							Cancel
						</Button>
						{/* <IconButton
							icon={<FaWhatsapp />}
							colorScheme='whatsapp'
							size='md'
							onClick={handleSend}
							isDisabled={!attachedFile || isUploading}
							borderRadius='full'
							aria-label='Send media'
						/> */}
						<IconButton
							icon={<IoSend size={16} />}
							colorScheme='green'
							aria-label='Send media'
							bg={whatsappColors.primary}
							borderRadius='full'
							size='md'
							onClick={handleSend}
							isDisabled={!attachedFile || isUploading}
							_hover={{
								bg: '#128C7E',
								transform: 'scale(1.05)',
								transition: 'all 0.2s ease-in-out',
							}}
							_active={{
								transform: 'scale(0.95)',
							}}
						/>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default MediaAttachment;
