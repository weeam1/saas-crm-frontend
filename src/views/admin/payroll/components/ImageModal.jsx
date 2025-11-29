import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalCloseButton,
	Image,
} from '@chakra-ui/react';

export const ImageModal = ({ isOpen, onClose, imageSrc, alt }) => (
	<Modal isOpen={isOpen} onClose={onClose} size='6xl' isCentered>
		<ModalOverlay bg='blackAlpha.800' />
		<ModalContent bg='transparent' boxShadow='none'>
			<ModalCloseButton
				color='white'
				bg='blackAlpha.600'
				_hover={{ bg: 'blackAlpha.800' }}
				// zIndex={10}
			/>
			<Image
				src={imageSrc}
				alt={alt}
				objectFit='contain'
				maxH='90vh'
				maxW='90vw'
				borderRadius='lg'
				margin='auto'
				rounded='md'
				border='2px solid #dba554ff'
			/>
		</ModalContent>
	</Modal>
);
