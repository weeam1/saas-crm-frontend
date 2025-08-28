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

const InterviewNoteModal = ({ isOpen, onClose, onSubmit }) => {
	const [note, setNote] = useState('');

	const handleSubmit = async (type) => {
		if (type === 'skip') {
			onSubmit({ note: '' });
		} else onSubmit({ note });

		setNote('');
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='2xl' isCentered>
			<ModalOverlay backdropFilter='blur(2px)' />

			<ModalContent mx='4'>
				<ModalHeader>Interview Note</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<FormControl>
						<FormLabel>Note (optional)</FormLabel>
						<Textarea
							placeholder='Write candidate interview note...'
							value={note}
							onChange={(e) => setNote(e.target.value)}
							focusBorderColor='brand.500'
							height='200px'
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
						onClick={() => handleSubmit('skip')}
					>
						Skip
					</Button>
					<Button
						{...buttonStyle}
						colorScheme='brand'
						// isDisabled={note.trim() === ''}
						onClick={() => handleSubmit('submit')}
					>
						Submit
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default InterviewNoteModal;
