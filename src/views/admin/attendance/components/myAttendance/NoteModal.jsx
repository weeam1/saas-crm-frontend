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
	const colors = useModalColors();

	const handleSubmit = async () => {
		onSubmit({ note });
		setNote('');
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='2xl' isCentered>
			<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(2px)' />
			<ModalContent mx='2' borderRadius='xl' boxShadow={colors.modalShadow} bg={colors.bg}>
				<ModalHeader
					display='flex'
					gap='2'
					bg={colors.headerBg}
					color={colors.headerText}
					borderTopRadius='xl'
					py={4}
					px={6}
					alignItems='center'
					w='100%'
				>
					{title}
				</ModalHeader>
				<ModalCloseButton
					color={colors.closeBtnColor}
					_hover={{ bg: colors.closeBtnHoverBg }}
				/>
				<ModalBody>
					<FormControl>
						<FormLabel color={colors.labelColor}>Note (optional)</FormLabel>
						<Textarea
							placeholder='Type Note...'
							value={note}
							onChange={(e) => setNote(e.target.value)}
							focusBorderColor={colors.accentGold}
							height='160px'
							resize='none'
							overflowY='auto'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_hover={{ borderColor: colors.accentGold }}
							_placeholder={{ color: colors.mutedText }}
						/>
					</FormControl>
				</ModalBody>
				<ModalFooter
					bg={colors.footerBg}
					borderTop={`1px solid ${colors.borderColor}`}
					gap={3}
					py={4}
				>
					<Button
						variant='ghost'
						mr={3}
						onClick={onClose}

						transition='all 0.2s ease'
					>
						Cancel
					</Button>
					<Button
						variant='brand'
						isLoading={isLoading}
						onClick={handleSubmit}
						transition='all 0.2s ease'
					>
						{isLoading ? 'Loading...' : 'Submit'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default NoteModal;