import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import {
	FiDownload,
	FiExternalLink,
	FiFile,
	FiFileText,
	FiImage,
	FiMusic,
	FiVideo,
} from 'react-icons/fi';

const MEDIA_TYPES = ['image', 'document', 'video', 'audio'];

export const renderMessageContent = ({
	message,
	mediaUrls,
	onDownloadMedia,
	isSelf,
}) => {
	const isMedia = MEDIA_TYPES.includes(message.type);
	const mediaId = message.media?.id;

	// Text message
	if (!isMedia) {
		return message.content;
	}

	const mediaUrl = mediaUrls[mediaId];

	// Media message placeholder
	return (
		<VStack textAlign='center' mb='1' minW='400px'>
			{!mediaUrl ? (
				<>
					<MediaIcon type={message.type} size={50} />
					<Button
						size='xs'
						rounded='md'
						colorScheme='whatsapp'
						leftIcon={<FiDownload />}
						mt={2}
						onClick={() => onDownloadMedia(mediaId)}
					>
						Download
					</Button>
				</>
			) : (
				<MediaPreview type={message.type} url={mediaUrl} />
			)}
		</VStack>
	);
};

const MediaPreview = ({ type, url }) => {
	switch (type) {
		case 'image':
			return (
				<img
					src={url}
					alt='shared'
					style={{
						maxWidth: '100%',
						maxHeight: '300px',
						borderRadius: '8px',
						objectFit: 'contain',
					}}
				/>
			);
		case 'video':
			return (
				<video
					controls
					src={url}
					style={{ width: '100%', maxHeight: '300px' }}
				/>
			);
		case 'audio':
			return <audio controls src={url} />;
		case 'document':
			return (
				<Flex direction='column' align='flex-start' gap={2}>
					<Flex
						align='center'
						bg='gray.100'
						px={3}
						py={2}
						borderRadius='md'
						w='100%'
						boxShadow='sm'
						gap={2}
					>
						<FiFileText size={24} />
						<Box>
							<Text fontSize='sm' fontWeight='semibold'>
								Document File
							</Text>
						</Box>
					</Flex>

					<Flex gap={2}>
						<Button
							size='sm'
							variant='outline'
							leftIcon={<FiDownload />}
							as='a'
							href={url}
							download
						>
							Download
						</Button>

						<Button
							size='sm'
							variant='outline'
							leftIcon={<FiExternalLink />}
							onClick={() => window.open(url, '_blank')}
						>
							Open
						</Button>
					</Flex>
				</Flex>
			);

		default:
			return <Text>Unsupported media type</Text>;
	}
};

const MediaIcon = ({ type, size = 24 }) => {
	const styleConfig = {
		image: { icon: FiImage, bg: 'blue.50', color: 'blue.500' },
		video: { icon: FiVideo, bg: 'purple.50', color: 'purple.500' },
		audio: { icon: FiMusic, bg: 'green.50', color: 'green.500' },
		document: { icon: FiFileText, bg: 'orange.50', color: 'orange.500' },
		default: { icon: FiFile, bg: 'gray.50', color: 'gray.500' },
	};

	const { icon: Icon, bg, color } = styleConfig[type] || styleConfig.default;

	return (
		<Box
			as='span'
			display='inline-flex'
			alignItems='center'
			justifyContent='center'
			borderRadius='md'
			bg={bg}
			w={`calc(${size}px + 16px)`}
			h={`calc(${size}px + 16px)`}
		>
			<Icon size={size} color={color} />
		</Box>
	);
};

// switch (type) {
// 	case 'image':
// 		return <FiImage size={size} />;
// 	case 'video':
// 		return <FiVideo size={size} />;
// 	case 'audio':
// 		return <FiMusic size={size} />;
// 	case 'document':
// 		return <FiFileText size={size} />;
// 	default:
// 		return <FiFile size={size} />;
// }
