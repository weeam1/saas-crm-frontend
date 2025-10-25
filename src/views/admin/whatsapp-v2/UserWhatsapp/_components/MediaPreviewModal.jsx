import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	Image,
	Box,
} from '@chakra-ui/react';

function MediaPreviewModal({ isOpen, onClose, media, mediaUrl }) {
	if (!media) return null;

	const isVideo = media?.mimeType?.startsWith('video');
	const isImage = media?.mimeType?.startsWith('image');

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='full'
			motionPreset='scale'
			closeOnOverlayClick={true}
		>
			<ModalOverlay bg='blackAlpha.900' onClick={onClose} />
			<ModalContent
				bg='black'
				display='flex'
				alignItems='center'
				justifyContent='center'
				onClick={onClose}
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
					h='80vh'
					w='100vw'
				>
					{/* stop click propagation INSIDE content */}
					<Box onClick={(e) => e.stopPropagation()}>
						{isImage && (
							<Image
								src={mediaUrl}
								maxH='80vh'
								maxW='80vw'
								objectFit='contain'
								alt={media.filename || 'Image'}
							/>
						)}

						{isVideo && (
							<Box
								as='video'
								src={mediaUrl}
								controls
								autoPlay
								maxH='100vh'
								maxW='100vw'
								objectFit='contain'
							/>
						)}
					</Box>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}

export default MediaPreviewModal;
