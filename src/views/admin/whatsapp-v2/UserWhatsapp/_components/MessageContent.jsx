import {
	Box,
	Text,
	Image,
	Button,
	Icon,
	HStack,
	VStack,
	Flex,
	IconButton,
} from '@chakra-ui/react';
import { DownloadIcon, PhoneIcon } from '@chakra-ui/icons';
import { FaFilePdf } from 'react-icons/fa';
import { formatFileSize } from 'utils/whatsappUtils';
import { useState } from 'react';
import MediaPreviewModal from './MediaPreviewModal';

const MessageContent = ({ msg, onDownload }) => {
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);

	const whastappMedia =
		JSON.parse(localStorage.getItem('whatsapp_media')) || {};

	const mediaUrl =
		msg?.type === 'image'
			? `data:${msg?._data?.mimeType};base64,${whastappMedia[msg.mediaKey] || msg?._data?.body}`
			: null;

	// if (isPreviewOpen) {
	// 	return (
	// 		<MediaPreviewModal
	// 			isOpen={isPreviewOpen}
	// 			onClose={() => setIsPreviewOpen(false)}
	// 			media={msg?._data || null}
	// 		/>
	// 	);
	// }

	switch (msg.type) {
		case 'image':
			return (
				<Box
					position='relative'
					display='inline-block'
					borderRadius='md'
					overflow='hidden'
				>
					<Image
						src={mediaUrl}
						alt='Shared image'
						w={msg?.width || '300px'}
						maxW={'400px'}
						maxH={msg?.height || '400px'}
						objectFit='cover'
						borderRadius='lg'
						fallbackSrc={`data:image/jpeg;base64,${msg?._data?.body}`}
					/>
					{msg.caption && (
						<Text mt={2} fontSize='sm'>
							{msg.caption}
						</Text>
					)}

					{/* Download Button Overlay */}
					{!whastappMedia[msg.mediaKey] && (
						<IconButton
							aria-label='Download'
							icon={<DownloadIcon />}
							position='absolute'
							top='50%'
							left='50%'
							transform='translate(-50%, -50%)'
							borderRadius='full'
							size='lg'
							bg='rgba(0,0,0,0.5)'
							color='white'
							_hover={{ bg: 'rgba(0,0,0,0.7)' }}
							onClick={() => onDownload(msg.id?._serialized)}
						/>
					)}

					{msg.body && <Text whiteSpace='pre-wrap'>{msg.body}</Text>}
				</Box>
			);

		case 'audio':
			return (
				<HStack bg='blackAlpha.200' p={3} borderRadius='md' spacing={3}>
					<Box
						w='24px'
						h='24px'
						bg='green.500'
						borderRadius='full'
						display='flex'
						alignItems='center'
						justifyContent='center'
					>
						<PhoneIcon color='white' w='12px' h='12px' />
					</Box>
					<VStack align='start' spacing={0}>
						<Text fontSize='sm' fontWeight='bold'>
							Audio
						</Text>
						<Text fontSize='xs' color='gray.600'>
							{msg.duration || '0:00'}
						</Text>
					</VStack>
					{msg.body && <Text whiteSpace='pre-wrap'>{msg.body}</Text>}
				</HStack>
			);

		case 'document':
			return (
				<VStack
					p={2}
					fontSize={{ base: 'xs', md: 'md' }}
					borderRadius='md'
					spacing={3}
				>
					<Flex align='center' minW='300px' gap={3}>
						<Icon as={FaFilePdf} boxSize={10} color='red.400' />
						<VStack align='start' spacing={0}>
							<Text fontWeight='semibold' noOfLines={1}>
								{msg?._data?.filename || 'Document.pdf'}
							</Text>
							<Text fontSize='sm' color='gray.500'>
								{formatFileSize(msg?._data?.size)},{' '}
								{msg?._data?.mimeType || 'PDF Document'}
							</Text>
						</VStack>
					</Flex>

					<Flex
						w='100%'
						borderTop='1px'
						borderColor='gray.200'
						justify='space-between'
						gap={2}
						pt={2}
					>
						<Button
							size='sm'
							w='100%'
							rounded='md'
							colorScheme='whatsapp'
							_hover={{ bg: 'whatsapp.600' }}
						>
							Open
						</Button>
						<Button
							size='sm'
							w='100%'
							rounded='md'
							colorScheme='whatsapp'
							_hover={{ bg: 'whatsapp.600' }}
							// onClick={() => onDownload(msg.id?._serialized)}
						>
							Download
						</Button>
					</Flex>
				</VStack>
			);
		case 'chat':
			return <Text whiteSpace='pre-wrap'>{msg.body}</Text>;
		default:
			return null;
	}
};

export default MessageContent;
