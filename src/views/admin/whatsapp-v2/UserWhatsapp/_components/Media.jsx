import { CloseIcon, DownloadIcon, PhoneIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Center,
	Flex,
	HStack,
	Icon,
	IconButton,
	Image,
	Spinner,
	Text,
	VStack,
} from '@chakra-ui/react';
import { memo } from 'react';
import { formatFileSize } from 'utils/whatsappUtils';
import AudioPlayer from '../../components/Media/AudioPlayer';

export const ImageMedia = memo(
	({ msg, mediaUrl, isDownloading, whatsappMedia, onDownload, onPreview }) => (
		<Box
			position='relative'
			display='inline-block'
			borderRadius='md'
			overflow='hidden'
			w='100%'
			maxW={{ base: '260px', md: '350px' }}
		>
			{mediaUrl && (
				<Image
					src={mediaUrl}
					alt='Shared image'
					w={msg?.width || '300px'}
					maxW='350px'
					maxH={msg?.height || '350px'}
					objectFit='cover'
					borderRadius='lg'
					onClick={onPreview}
				/>
			)}

			{isDownloading ? (
				<Center
					position='absolute'
					top='50%'
					left='50%'
					transform='translate(-50%, -50%)'
					bg='rgba(0,0,0,0.5)'
					borderRadius='full'
					p={3}
				>
					<Spinner size='lg' color='white' thickness='3px' speed='0.6s' />
				</Center>
			) : (
				!whatsappMedia && (
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
				)
			)}

			{msg.caption && (
				<Text mt={2} fontSize='sm'>
					{msg.caption}
				</Text>
			)}
		</Box>
	)
);

export const VideoMedia = memo(
	({ msg, mediaUrl, isDownloading, whatsappMedia, onDownload, onPreview }) => (
		<Box
			position='relative'
			display='inline-block'
			borderRadius='md'
			overflow='hidden'
			bg='black'
			w='100%'
			maxW={{ base: '260px', md: '350px' }}
		>
			{!whatsappMedia ? (
				<>
					<Image
						src={mediaUrl}
						alt='Video preview'
						w={msg?.width || '300px'}
						maxW='350px'
						maxH={msg?.height || '350px'}
						objectFit='cover'
						borderRadius='lg'
					/>

					{isDownloading ? (
						<Center
							position='absolute'
							top='50%'
							left='50%'
							transform='translate(-50%, -50%)'
							bg='rgba(0,0,0,0.5)'
							borderRadius='full'
							p={3}
						>
							<Spinner size='lg' color='white' thickness='3px' speed='0.6s' />
						</Center>
					) : (
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
							onClick={() => onDownload(msg.id?._serialized, 'video')}
						/>
					)}
				</>
			) : (
				<Box
					as='video'
					src={mediaUrl}
					controls
					muted
					borderRadius='lg'
					w={msg?.width || '300px'}
					maxW='350px'
					maxH={msg?.height || '350px'}
					objectFit='cover'
					onClick={onPreview}
				/>
			)}
		</Box>
	)
);

export const AudioMedia = memo(({ msg, mediaUrl }) => (
	<HStack bg='blackAlpha.200' width='100%' p={3} borderRadius='md' spacing={3}>
		{/* <Box
			w='24px'
			h='24px'
			bg='green.500'
			borderRadius='full'
			display='flex'
			maxW={{ base: '100px', md: '350px' }}
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
		</VStack> */}

		<AudioPlayer key={msg.mediaKey} id={msg.mediaKey} audioSrc={mediaUrl} />
	</HStack>
));

export const DocumentMedia = memo(
	({ msg, isDownloading, mimeTypeInfo, onDownload }) => (
		<VStack
			p={1}
			borderRadius='md'
			spacing={3}
			// width='100%'
			// maxW={{ base: '350px' }}
			w={{ base: '260px', md: '300px' }}
			fontSize={{ base: 'xs', md: 'sm' }}
			align='start'
		>
			<Flex align='center' gap={2}>
				<Icon as={mimeTypeInfo.icon} boxSize={6} color={mimeTypeInfo.color} />
				<VStack align='start'>
					<Text
						fontWeight='semibold'
						fontSize='xs'
						maxW={{ base: '220px', md: '260px' }}
						isTruncated
						noOfLines={1}
					>
						{msg?._data?.filename || 'Document'}
					</Text>
					<HStack>
						<Text fontSize='xs' color='gray.500'>
							{formatFileSize(msg?._data?.size)}, {mimeTypeInfo?.label}
						</Text>
						{isDownloading && (
							<Spinner
								size='xs'
								color='whatsapp.500'
								thickness='2px'
								speed='0.6s'
							/>
						)}
					</HStack>
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
				{msg?._data?.mimetype?.startsWith('application/pdf') && (
					<Button
						size='xs'
						flex={1}
						color='gray.600'
						bg='whatsapp.300'
						rounded='md'
						onClick={() => onDownload(msg.id?._serialized, 'open')}
						_hover={{ shadow: 'lg' }}
						isDisabled={isDownloading}
					>
						Open
					</Button>
				)}
				<Button
					size='xs'
					rounded='md'
					color='gray.600'
					bg='whatsapp.300'
					onClick={() => onDownload(msg.id?._serialized, 'download')}
					flex={1}
					_hover={{ shadow: 'lg' }}
					isDisabled={isDownloading}
				>
					Download
				</Button>
			</Flex>
		</VStack>
	)
);

export const NoMediaFound = memo(() => (
	<Box
		bg='red.50'
		border='1px solid'
		borderColor='red.100'
		borderRadius='xl'
		p={4}
		width='100%'
		maxW={{ base: '100px', md: '350px' }}
	>
		<Flex align='center' gap={3}>
			<Box
				w='40px'
				h='40px'
				bg='red.100'
				borderRadius='full'
				display='flex'
				alignItems='center'
				justifyContent='center'
				flexShrink={0}
			>
				<CloseIcon color='red.500' boxSize={3} />
			</Box>
			<Box>
				<Text fontSize='sm' color='red.800' fontWeight='semibold'>
					Unable to load media
				</Text>
				<Text fontSize='xs' color='red.600'>
					The content may have expired or been removed
				</Text>
			</Box>
		</Flex>
	</Box>
));
