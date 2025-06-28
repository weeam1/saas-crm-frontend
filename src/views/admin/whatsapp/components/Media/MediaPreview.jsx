import React, { useState } from 'react';
import {
	Flex,
	Box,
	Text,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalCloseButton,
	useDisclosure,
	Spinner,
	IconButton,
} from '@chakra-ui/react';
import {
	FiFileText,
	FiDownload,
	FiExternalLink,
	FiMaximize,
	FiX,
} from 'react-icons/fi';

const MediaPreview = ({ type, url, isLoading }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isFullscreenLoading, setIsFullscreenLoading] = useState(false);

	const handleFullscreenOpen = () => {
		if (type === 'image' || type === 'video') {
			setIsFullscreenLoading(true);
			onOpen();
		}
	};

	const handleMediaLoaded = () => {
		setIsFullscreenLoading(false);
	};

	const handleClose = () => {
		setIsFullscreenLoading(false);
		onClose();
	};

	const renderMedia = (fullscreen = false) => {
		switch (type) {
			case 'image':
				return (
					<img
						src={url}
						alt='shared'
						style={{
							maxWidth: '100%',
							maxHeight: fullscreen ? '70vh' : '300px',
							borderRadius: fullscreen ? 0 : '8px',
							objectFit: 'contain',
							display: 'block',
						}}
						onLoad={handleMediaLoaded}
					/>
				);
			case 'video':
				return (
					<video
						controls
						src={url}
						style={{
							width: '100%',
							maxHeight: fullscreen ? '75vh' : '300px',
							borderRadius: fullscreen ? 0 : '8px',
						}}
						onCanPlayThrough={handleMediaLoaded}
					/>
				);
			case 'audio':
				return <audio controls src={url} />;
			case 'document':
				return (
					<Flex direction='column' align='flex-start' gap={2} width='100%'>
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

	return (
		<>
			<Box position='relative' width='100%'>
				{renderMedia()}

				{(type === 'image' || type === 'video') && (
					<IconButton
						aria-label='View fullscreen'
						icon={<FiMaximize />}
						size='sm'
						position='absolute'
						bottom={2}
						right={2}
						bg='rgba(0,0,0,0.5)'
						color='white'
						_hover={{ bg: 'rgba(0,0,0,0.7)' }}
						onClick={handleFullscreenOpen}
					/>
				)}
			</Box>

			{isOpen && (
				<Modal isOpen={isOpen} onClose={handleClose} size='6xl' isCentered>
					<ModalOverlay />
					<ModalContent bg='gray.800' boxShadow='none' m='2'>
						<ModalCloseButton
							color='white'
							// bg='rgba(0,0,0,0.5)'
							bg='gray.800'
							_hover={{ bg: 'gray.700' }}
							size='lg'
							onClick={handleClose}
						/>

						<Flex
							justify='center'
							align='center'
							height='80vh'
							// position='relative'
						>
							{isFullscreenLoading && (
								<Spinner size='xl' color='white' position='absolute' />
							)}
							{renderMedia(true)}
						</Flex>
					</ModalContent>
				</Modal>
			)}
		</>
	);
};

export default MediaPreview;
