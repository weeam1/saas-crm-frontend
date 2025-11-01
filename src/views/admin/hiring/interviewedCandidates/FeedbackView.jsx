import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	Button,
	Box,
} from '@chakra-ui/react';
import { useModalColors } from 'hooks/useModalColors';

const FeedbackView = ({ title, message, isOpen, onClose }) => {
	const { headerBg, headerText } = useModalColors();

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='2xl' isCentered>
			<ModalOverlay backdropFilter='blur(2px)' />
			<ModalContent mx='2' borderRadius='xl' boxShadow='xl'>
				<ModalHeader
					display='flex'
					gap='2'
					bg={headerBg}
					color={headerText}
					borderTopRadius='xl'
					py={4}
					alignItems='center'
					w='100%'
				>
					{title}
				</ModalHeader>
				<ModalBody>
					<Box
						border='none'
						outline='none'
						bg='softGray.100'
						py='2'
						px='3'
						rounded='md'
						shadow='sm'
						minH='100px' // Set a maximum height for the box
						overflowY='auto' // Enable vertical scrolling
					>
						{message}
					</Box>
				</ModalBody>

				<ModalFooter>
					<Button onClick={onClose} colorScheme='gray' rounded='md'>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default FeedbackView;
