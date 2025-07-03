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
import { useEffect, useState } from 'react';
import MediaIcon from './placeholder/MediaIcon';
import MediaLoadingEffect from './placeholder/MediaLoadingPlaceholder';
import MediaPreview from './Media/MediaPreview';

const MotionBox = motion(Box);

const MEDIA_TYPES = ['image', 'video', 'audio'];

export const MessageContent = ({ message, isSelf }) => {
	const mediaUrls = useSelector((state) => state.whatsapp.mediaUrls || {});

	const [progress, setProgress] = useState(0);

	const isMedia = MEDIA_TYPES.includes(message.type);
	const mediaId = message?.media?.id;

	const { downloadMedia, isLoading } = useMediaDownloader();

	useEffect(() => {
		if (mediaId) {
			downloadMedia(mediaId);
		}
	}, [mediaId]);

	const onDownload = () => {
		downloadMedia(mediaId);
	};

	useEffect(() => {
		let interval;
		let timeout;

		if (isLoading) {
			// Simulate progress during loading
			setProgress(0);

			interval = setInterval(() => {
				setProgress((prev) => {
					// Simulate uneven progress for realism
					const increment = 1 + Math.random() * 4;
					return Math.min(prev + increment, 90); // Stop at 90% for realistic effect
				});
			}, 200);
		} else if (progress < 100) {
			// When loading stops, animate to 100%
			const remaining = 100 - progress;
			const steps = Math.min(remaining, 10); // Complete in max 10 steps

			interval = setInterval(() => {
				setProgress((prev) => {
					const newProgress = prev + remaining / steps;
					if (newProgress >= 100) {
						clearInterval(interval);
						return 100;
					}
					return newProgress;
				});
			}, 50);
		}

		return () => {
			clearInterval(interval);
			clearTimeout(timeout);
		};
	}, [isLoading, progress]);

	// Text message
	if (['text', 'template'].includes(message.type)) {
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
			<MotionBox
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.25 }}
			>
				{isLoading ? (
					<MediaLoadingEffect type={message.type} progress={progress} />
				) : !mediaUrl ? (
					<VStack justify='space-between' gap='4' w='300px'>
						<MediaIcon type={message.type} size={100} />
						<Text fontSize='sm' color='red.400'>
							Error file not found!
						</Text>
						{/* <Button
							size='xs'
							rounded='md'
							colorScheme='whatsapp'
							leftIcon={<FiDownload />}
							mt={2}
							py='4'
							px='12'
							onClick={() => onDownload(mediaId)}
						>
							Download
						</Button> */}
					</VStack>
				) : (
					<MediaPreview message={message} url={mediaUrl} />
				)}
			</MotionBox>
		</VStack>
	);
};

// const MediaPreview = ({ type, url }) => {
// 	switch (type) {
// 		case 'image':
// 			return (
// 				<img
// 					src={url}
// 					alt='shared'
// 					style={{
// 						maxWidth: '100%',
// 						maxHeight: '300px',
// 						borderRadius: '8px',
// 						objectFit: 'contain',
// 					}}
// 				/>
// 			);
// 		case 'video':
// 			return (
// 				<video
// 					controls
// 					src={url}
// 					style={{ width: '100%', maxHeight: '300px' }}
// 				/>
// 			);
// 		case 'audio':
// 			return <audio controls src={url} />;
// 		case 'document':
// 			return (
// 				<Flex direction='column' align='flex-start' gap={2}>
// 					<Flex
// 						align='center'
// 						bg='gray.100'
// 						px={3}
// 						py={2}
// 						borderRadius='md'
// 						w='100%'
// 						boxShadow='sm'
// 						gap={2}
// 					>
// 						<FiFileText size={24} />
// 						<Box>
// 							<Text fontSize='sm' fontWeight='semibold'>
// 								Document File
// 							</Text>
// 						</Box>
// 					</Flex>

// 					<Flex gap={2}>
// 						<Button
// 							size='sm'
// 							variant='outline'
// 							leftIcon={<FiDownload />}
// 							as='a'
// 							href={url}
// 							download
// 						>
// 							Download
// 						</Button>

// 						<Button
// 							size='sm'
// 							variant='outline'
// 							leftIcon={<FiExternalLink />}
// 							onClick={() => window.open(url, '_blank')}
// 						>
// 							Open
// 						</Button>
// 					</Flex>
// 				</Flex>
// 			);

// 		default:
// 			return <Text>Unsupported media type</Text>;
// 	}
// };

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
