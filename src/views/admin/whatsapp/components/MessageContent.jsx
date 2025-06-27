import {
	Box,
	Button,
	Flex,
	Text,
	CircularProgress,
	VStack,
} from '@chakra-ui/react';
import {
	FiDownload,
	FiExternalLink,
	FiFile,
	FiFileText,
	FiImage,
	FiMusic,
	FiVideo,
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useMediaDownloader } from 'hooks/useMediaDownloader';
const MotionBox = motion(Box);

const MEDIA_TYPES = ['image', 'document', 'video', 'audio'];

export const MessageContent = ({ message, isSelf }) => {
	const mediaUrls = useSelector((state) => state.whatsapp.mediaUrls || {});

	const isMedia = MEDIA_TYPES.includes(message.type);
	const mediaId = message.media?.id;

	const { downloadMedia, isLoading } = useMediaDownloader();

	const onDownload = () => {
		downloadMedia(mediaId);
	};

	// Text message
	if (message.type === 'text') {
		return message.content;
	} else if (message.type === 'unsupported') {
		return (
			<Text fontSize='xs' color='red.400' fontWeight='semibold'>
				Not supported!
			</Text>
		);
	}

	const mediaUrl = mediaUrls[mediaId];

	// Media message placeholder
	return (
		<VStack align='center' mb='1'>
			{!mediaUrl ? (
				<>
					<MotionBox
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.25 }}
					>
						{isLoading ? (
							<Box position='relative' display='inline-flex'>
								<CircularProgress
									isIndeterminate
									color='whatsapp.500'
									size='60px'
									thickness='4px'
								/>
								<Box
									position='absolute'
									top='50%'
									left='50%'
									transform='translate(-50%, -50%)'
								>
									<MediaIcon type={message.type} size={32} />
								</Box>
							</Box>
						) : (
							<VStack>
								<MediaIcon type={message.type} size={50} />
								<Button
									size='xs'
									rounded='md'
									colorScheme='whatsapp'
									leftIcon={<FiDownload />}
									mt={2}
									px='6'
									onClick={() => onDownload(mediaId)}
								>
									Download
								</Button>
							</VStack>
						)}
					</MotionBox>
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
