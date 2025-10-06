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
	useColorModeValue,
} from '@chakra-ui/react';
import {
	FaFileAudio,
	FaFileAlt,
	FaImage,
	FaStickerMule,
	FaVideo,
} from 'react-icons/fa';

const mediaLimits = [
	{ type: 'Audio', size: '16 MB', icon: FaFileAudio, color: 'blue.400' },
	{ type: 'Document', size: '100 MB', icon: FaFileAlt, color: 'orange.400' },
	{ type: 'Image', size: '5 MB', icon: FaImage, color: 'teal.400' },
	{ type: 'Sticker', size: '100 KB', icon: FaStickerMule, color: 'pink.400' },
	{ type: 'Video', size: '16 MB', icon: FaVideo, color: 'green.400' },
];

const MediaLimitsModal = ({ isOpen, onClose }) => {
	const cardBg = useColorModeValue('white', 'gray.800');
	const cardBorder = useColorModeValue('gray.200', 'gray.600');

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='lg'
			isCentered
			motionPreset='scale'
		>
			<ModalOverlay />
			<ModalContent borderRadius='xl' m='2'>
				<ModalHeader>WhatsApp Media Upload Size Limits</ModalHeader>
				<ModalCloseButton _focus={{ outline: 'none' }} />
				<ModalBody pb={6}>
					<Text fontSize='sm' color='gray.500' mb={4}>
						These limits apply after compression and encryption.
					</Text>

					<SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
						{mediaLimits.map(({ type, size, icon, color }) => (
							<Flex
								key={type}
								direction='column'
								align='center'
								bg={cardBg}
								border='1px solid'
								borderColor={cardBorder}
								borderRadius='xl'
								p={5}
								textAlign='center'
								boxShadow='sm'
								_hover={{ boxShadow: 'md' }}
							>
								<Icon as={icon} boxSize={8} color={color} mb={3} />
								<Text fontWeight='semibold' color='green.500'>
									{type}
								</Text>
								<Text fontSize='sm' color='gray.500'>
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
