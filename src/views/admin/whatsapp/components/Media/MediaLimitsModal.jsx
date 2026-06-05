import {
	Box,
	Text,
	SimpleGrid,
	Flex,
	Icon,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
} from '@chakra-ui/react';
import {
	FaFileAudio,
	FaFileAlt,
	FaImage,
	FaStickerMule,
	FaVideo,
} from 'react-icons/fa';
import { useModalColors } from 'hooks/useModalColors';

const mediaLimits = [
	{ type: 'Audio', size: '16 MB', icon: FaFileAudio, color: 'blue.400' },
	{ type: 'Document', size: '100 MB', icon: FaFileAlt, color: 'orange.400' },
	{ type: 'Image', size: '5 MB', icon: FaImage, color: 'teal.400' },
	{ type: 'Sticker', size: '100 KB', icon: FaStickerMule, color: 'pink.400' },
	{ type: 'Video', size: '16 MB', icon: FaVideo, color: 'green.400' },
];

const MediaLimitsModal = ({ isOpen, onClose }) => {
	const colors = useModalColors();

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='lg'
			isCentered
			motionPreset='scale'
		>
			<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />
			<ModalContent
				borderRadius='2xl'
				m='2'
				bg={colors.bg}
				boxShadow={colors.modalShadow}
				border='1px solid'
				borderColor={colors.borderColor}
				overflow='hidden'
			>
				<ModalHeader
					bg={colors.headerBg}
					color={colors.headerText}
					borderBottom='1px solid'
					borderColor={colors.borderColor}
				>
					WhatsApp Media Upload Size Limits
				</ModalHeader>
				<ModalCloseButton
					color={colors.headerText}
					_hover={{ bg: colors.closeBtnHoverBg }}
					_focus={{ outline: 'none' }}
				/>
				<ModalBody pb={6}>
					<Text fontSize='sm' color={colors.mutedText} mb={4}>
						These limits apply after compression and encryption.
					</Text>

					<SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
						{mediaLimits.map(({ type, size, icon, color }) => (
							<Flex
								key={type}
								direction='column'
								align='center'
								bg={colors.bgInput}
								border='1px solid'
								borderColor={colors.borderColor}
								borderRadius='xl'
								p={5}
								textAlign='center'
								boxShadow={colors.cardShadow}
								_hover={{ boxShadow: colors.modalShadow }}
							>
								<Icon as={icon} boxSize={8} color={color} mb={3} />
								<Text fontWeight='semibold' color={colors.accentGold}>
									{type}
								</Text>
								<Text fontSize='sm' color={colors.mutedText}>
									Max: {size}
								</Text>
							</Flex>
						))}
					</SimpleGrid>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default MediaLimitsModal;