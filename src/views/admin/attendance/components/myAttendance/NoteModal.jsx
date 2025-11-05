import { useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	Button,
	Textarea,
	FormControl,
	FormLabel,
} from '@chakra-ui/react';
import { buttonStyle } from 'utils/btn';
import { useModalColors } from 'hooks/useModalColors';

const NoteModal = ({ title, isOpen, onClose, onSubmit, isLoading }) => {
	const [note, setNote] = useState('');

	const { headerBg, headerText } = useModalColors();

	const handleSubmit = async () => {
		onSubmit({ note });
		setNote('');
	};

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
				<ModalCloseButton />
				<ModalBody>
					<FormControl>
						<FormLabel>Note (optional)</FormLabel>
						<Textarea
							placeholder='Type Note...'
							value={note}
							onChange={(e) => setNote(e.target.value)}
							focusBorderColor='brand.500'
							height='160px'
							resize='none'
							overflowY='auto'
						/>
					</FormControl>
				</ModalBody>
				<ModalFooter>
					<Button
						{...buttonStyle}
						bg='softGray.100'
						color='gray.700'
						_active='gray.200'
						mr={3}
						onClick={onClose}
					>
						Cancel
					</Button>
					<Button
						{...buttonStyle}
						colorScheme='brand'
						isLoading={isLoading}
						onClick={handleSubmit}
					>
						{isLoading ? 'Loading...' : 'Submit'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default NoteModal;
