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

const NoteModal = ({ title, isOpen, onClose, onSubmit, isLoading }) => {
	const [note, setNote] = useState('');

	const handleSubmit = async () => {
		onSubmit({ note });
		setNote('');
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='2xl' isCentered>
			<ModalOverlay />
			<ModalContent mx='4'>
				<ModalHeader>{title}</ModalHeader>
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
