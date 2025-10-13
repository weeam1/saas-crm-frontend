import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	Image,
	Box,
} from '@chakra-ui/react';

function MediaPreviewModal({ isOpen, onClose, media }) {
	if (!media) return null;

	const isVideo = media?.mimetype?.startsWith('video');
	const isImage = media?.mimetype?.startsWith('image');

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='full' motionPreset='scale'>
			<ModalOverlay bg='blackAlpha.900' />
			<ModalContent
				bg='black'
				display='flex'
				alignItems='center'
				justifyContent='center'
			>
				<ModalCloseButton
					color='white'
					zIndex='1000'
					size='lg'
					_hover={{ bg: 'whiteAlpha.200' }}
				/>
				<ModalBody
					display='flex'
					alignItems='center'
					justifyContent='center'
					p={0}
					h='100vh'
					w='100vw'
				>
					{isImage && (
						<Image
							src={media.url || `data:${media.mimetype};base64,${media.data}`}
							maxH='100vh'
							maxW='100vw'
							objectFit='contain'
							alt={media.filename || 'Image'}
						/>
					)}

					{isVideo && (
						<Box
							as='video'
							src={media.url || `data:${media.mimetype};base64,${media.data}`}
							controls
							autoPlay
							maxH='100vh'
							maxW='100vw'
							objectFit='contain'
						/>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}

export default MediaPreviewModal;
