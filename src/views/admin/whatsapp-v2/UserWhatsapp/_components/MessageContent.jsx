import { Box, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MediaPreviewModal from './MediaPreviewModal';
import { getMediaTypeInfo } from '../../utils/mimeTypes';
import { useSelector } from 'react-redux';
import { getMediaSrc } from '../../utils/mediaSelector';
import {
	AudioMedia,
	DocumentMedia,
	ImageMedia,
	NoMediaFound,
	VideoMedia,
} from './Media';

const MessageContent = ({ msg, onDownload }) => {
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);

	// const downloadedMedia = useSelector(
	// 	(state) => state.whatsappWeb.downloaded_media
	// );

	const whatsappMedia = useSelector(
		(s) => s.whatsappWeb.downloaded_media[msg?.mediaKey],
		(a, b) => a === b
	);

	const [isDownloading, setIsDownloading] = useState(false);

	useEffect(() => {
		if (whatsappMedia) {
			setIsDownloading(false);
		}
	}, [whatsappMedia]);

	const mediaUrl = useMemo(() => {
		if (!msg?.hasMedia) return null;

		// Prefer downloaded media (Redux)
		if (whatsappMedia?.data) {
			return whatsappMedia.data;
		}

		//  Fallback to inline media
		const inlineBody = msg?._data?.body;
		if (inlineBody) {
			return getMediaSrc({
				data: inlineBody,
				mimeType: msg?._data?.mimetype,
			});
		}

		// No usable media
		return null;
	}, [
		msg?.hasMedia,
		msg?._data?.body,
		msg?._data?.mimetype,
		whatsappMedia?.data,
	]);

	const mimeTypeInfo = getMediaTypeInfo(msg?._data?.mimetype);

	const openPreview = () => {
		if (whatsappMedia) {
			setIsPreviewOpen(true);
		}
	};

	const handleDownload = useCallback(
		(messageId, action = 'download') => {
			setIsDownloading(true);
			onDownload(messageId, action);
		},
		[onDownload]
	);

	useEffect(() => {
		if (msg?.type === 'ptt' && msg?.id?._serialized) {
			handleDownload(msg?.id?._serialized);
		}
	}, [handleDownload, msg?.id?._serialized, msg?.type]);

	if (isPreviewOpen) {
		return (
			<MediaPreviewModal
				isOpen={isPreviewOpen}
				onClose={() => setIsPreviewOpen(false)}
				media={whatsappMedia}
				mediaUrl={mediaUrl}
			/>
		);
	}

	if (
		msg?.hasMedia &&
		['image', 'video'].includes(msg?.type) &&
		mediaUrl === null
	) {
		return <NoMediaFound />;
	}

	const renderMedia = () => {
		switch (msg.type) {
			case 'image':
				return (
					<ImageMedia
						mediaUrl={mediaUrl}
						msg={msg}
						isDownloading={isDownloading}
						whatsappMedia={whatsappMedia}
						onDownload={handleDownload}
						onPreview={openPreview}
					/>
				);

			case 'video':
				return (
					<VideoMedia
						mediaUrl={mediaUrl}
						msg={msg}
						isDownloading={isDownloading}
						whatsappMedia={whatsappMedia}
						onDownload={handleDownload}
						onPreview={openPreview}
					/>
				);

			// case 'audio':
			case 'ptt':
				return <AudioMedia msg={msg} mediaUrl={mediaUrl} />;

			case 'document':
				return (
					<DocumentMedia
						msg={msg}
						isDownloading={isDownloading}
						mimeTypeInfo={mimeTypeInfo}
						onDownload={handleDownload}
					/>
				);

			default:
				return <Text whiteSpace='pre-wrap'>{msg.body}</Text>;
		}
	};

	return (
		<Box>
			{renderMedia()}
			{msg?._data?.caption && msg?._data?.caption !== msg?._data?.filename && (
				<Text maxW={{ base: '260px', md: '300px' }} whiteSpace='pre-wrap'>
					{msg?._data?.caption}
				</Text>
			)}
		</Box>
	);

	// switch (msg.type) {
	// 	case 'image':
	// 		return (
	// 			<Box
	// 				position='relative'
	// 				display='inline-block'
	// 				borderRadius='md'
	// 				overflow='hidden'
	// 			>
	// 				{mediaUrl && (
	// 					<Image
	// 						src={mediaUrl}
	// 						alt='Shared image'
	// 						w={msg?.width || '300px'}
	// 						maxW={'350px'}
	// 						maxH={msg?.height || '350px'}
	// 						objectFit='cover'
	// 						borderRadius='lg'
	// 						onClick={openPreview}
	// 						// fallbackSrc={`data:image/jpeg;base64,${msg?._data?.body}`}
	// 					/>
	// 				)}
	// 				{msg.caption && (
	// 					<Text mt={2} fontSize='sm'>
	// 						{msg.caption}
	// 					</Text>
	// 				)}

	// 				{/* Download Button Overlay */}
	// 				{isDownloading ? (
	// 					<Center
	// 						position='absolute'
	// 						top='50%'
	// 						left='50%'
	// 						transform='translate(-50%, -50%)'
	// 						bg='rgba(0,0,0,0.5)'
	// 						borderRadius='full'
	// 						p={3}
	// 					>
	// 						<Spinner size='lg' color='white' thickness='3px' speed='0.6s' />
	// 					</Center>
	// 				) : (
	// 					!whatsappMedia && (
	// 						<IconButton
	// 							aria-label='Download'
	// 							icon={<DownloadIcon />}
	// 							position='absolute'
	// 							top='50%'
	// 							left='50%'
	// 							transform='translate(-50%, -50%)'
	// 							borderRadius='full'
	// 							size='lg'
	// 							bg='rgba(0,0,0,0.5)'
	// 							color='white'
	// 							_hover={{ bg: 'rgba(0,0,0,0.7)' }}
	// 							onClick={() => handleDownload(msg.id?._serialized)}
	// 						/>
	// 					)
	// 				)}

	// 				{msg.body && <Text whiteSpace='pre-wrap'>{msg.body}</Text>}
	// 			</Box>
	// 		);

	// 	case 'video':
	// 		return (
	// 			<Box
	// 				position='relative'
	// 				display='inline-block'
	// 				borderRadius='md'
	// 				overflow='hidden'
	// 				bg='black'
	// 			>
	// 				{!whatsappMedia ? (
	// 					<>
	// 						<Image
	// 							src={mediaUrl}
	// 							alt='Shared image'
	// 							w={msg?.width || '300px'}
	// 							maxW={'350px'}
	// 							maxH={msg?.height || '350px'}
	// 							objectFit='cover'
	// 							borderRadius='lg'
	// 							// fallbackSrc={`data:image/jpeg;base64,${msg?._data?.body}`}
	// 						/>

	// 						{isDownloading ? (
	// 							<Center
	// 								position='absolute'
	// 								top='50%'
	// 								left='50%'
	// 								transform='translate(-50%, -50%)'
	// 								bg='rgba(0,0,0,0.5)'
	// 								borderRadius='full'
	// 								p={3}
	// 							>
	// 								<Spinner
	// 									size='lg'
	// 									color='white'
	// 									thickness='3px'
	// 									speed='0.6s'
	// 								/>
	// 							</Center>
	// 						) : (
	// 							<IconButton
	// 								aria-label='Download'
	// 								icon={<DownloadIcon />}
	// 								position='absolute'
	// 								top='50%'
	// 								left='50%'
	// 								transform='translate(-50%, -50%)'
	// 								borderRadius='full'
	// 								size='lg'
	// 								bg='rgba(0,0,0,0.5)'
	// 								color='white'
	// 								_hover={{ bg: 'rgba(0,0,0,0.7)' }}
	// 								onClick={() => handleDownload(msg.id?._serialized, 'video')}
	// 							/>
	// 						)}
	// 					</>
	// 				) : (
	// 					<Box
	// 						as='video'
	// 						src={mediaUrl}
	// 						controls
	// 						muted
	// 						borderRadius='lg'
	// 						w={msg?.width || '300px'}
	// 						maxW='350px'
	// 						maxH={msg?.height || '350px'}
	// 						objectFit='cover'
	// 						onClick={openPreview}
	// 					/>
	// 				)}

	// 				{/* Play overlay (only show if not playing and no controls yet) */}

	// 				{/* Caption below video */}
	// 				{msg.caption && (
	// 					<Text mt={2} fontSize='sm'>
	// 						{msg.caption}
	// 					</Text>
	// 				)}
	// 			</Box>
	// 		);

	// 	case 'audio':
	// 		return (
	// 			<HStack bg='blackAlpha.200' p={3} borderRadius='md' spacing={3}>
	// 				<Box
	// 					w='24px'
	// 					h='24px'
	// 					bg='green.500'
	// 					borderRadius='full'
	// 					display='flex'
	// 					alignItems='center'
	// 					justifyContent='center'
	// 				>
	// 					<PhoneIcon color='white' w='12px' h='12px' />
	// 				</Box>
	// 				<VStack align='start' spacing={0}>
	// 					<Text fontSize='sm' fontWeight='bold'>
	// 						Audio
	// 					</Text>
	// 					<Text fontSize='xs' color='gray.600'>
	// 						{msg.duration || '0:00'}
	// 					</Text>
	// 				</VStack>
	// 				{msg.body && <Text whiteSpace='pre-wrap'>{msg.body}</Text>}
	// 			</HStack>
	// 		);

	// 	case 'document':
	// 		return (
	// 			<VStack
	// 				p={1}
	// 				fontSize={{ base: 'xs', md: 'md' }}
	// 				borderRadius='md'
	// 				spacing={3}
	// 			>
	// 				<Flex align='center' minW='300px' gap={2}>
	// 					<Icon
	// 						as={mimeTypeInfo.icon}
	// 						boxSize={6}
	// 						color={mimeTypeInfo.color}
	// 					/>
	// 					<VStack align='start'>
	// 						<Text
	// 							fontWeight='semibold'
	// 							fontSize={{ base: 'xs', md: 'sm' }}
	// 							noOfLines={1}
	// 							maxW='300px'
	// 							isTruncated
	// 						>
	// 							{msg?._data?.filename || 'Document'}
	// 						</Text>
	// 						<HStack>
	// 							<Text fontSize='xs' color='gray.500'>
	// 								{formatFileSize(msg?._data?.size)}, {mimeTypeInfo?.label}
	// 							</Text>
	// 							{isDownloading && (
	// 								<Spinner
	// 									size='xs'
	// 									color='whatsapp.500'
	// 									thickness='2px'
	// 									speed='0.6s'
	// 								/>
	// 							)}
	// 						</HStack>
	// 					</VStack>
	// 				</Flex>

	// 				<Flex
	// 					w='100%'
	// 					borderTop='1px'
	// 					borderColor='gray.200'
	// 					justify='space-between'
	// 					gap={2}
	// 					pt={2}
	// 				>
	// 					{msg?._data?.mimetype?.startsWith('application/pdf') && (
	// 						<Button
	// 							size='xs'
	// 							flex={1}
	// 							fontSize='xs'
	// 							color='gray.600'
	// 							bg='whatsapp.300'
	// 							rounded='md'
	// 							onClick={() => handleDownload(msg.id?._serialized, 'open')}
	// 							_hover={{ shadow: 'lg' }}
	// 							transition='all 0.2s ease'
	// 							isDisabled={isDownloading}
	// 						>
	// 							Open
	// 						</Button>
	// 					)}
	// 					<Button
	// 						size='xs'
	// 						rounded='md'
	// 						fontSize='xs'
	// 						color='gray.600'
	// 						bg='whatsapp.300'
	// 						onClick={() => handleDownload(msg.id?._serialized, 'download')}
	// 						flex={1}
	// 						_hover={{ shadow: 'lg' }}
	// 						transition='all 0.2s ease'
	// 						isDisabled={isDownloading}
	// 					>
	// 						Download
	// 					</Button>
	// 				</Flex>
	// 			</VStack>
	// 		);
	// 	case 'chat':
	// 		return <Text whiteSpace='pre-wrap'>{msg.body}</Text>;
	// 	default:
	// 		return null;
	// }
};

export default MessageContent;
