import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Select,
} from '@chakra-ui/react';
import { buttonStyle } from 'utils/btn';

const ReplaceManager = ({
	managers,
	isOpen,
	onClose,
	setReplacementManager,
	replacementManager,
	handleProceed,
}) => {
	return (
		<Modal isOpen={isOpen} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Select Replacement Manager</ModalHeader>
				<ModalBody>
					<Select
						placeholder='Select a manager'
						value={replacementManager}
						onChange={(e) => setReplacementManager(e.target.value)}
					>
						{managers.map((manager) => (
							<option value={manager?._id}>
								{manager?.firstName + ' ' + manager?.lastName}
							</option>
						))}
					</Select>
				</ModalBody>
				<ModalFooter>
					<Button
						{...buttonStyle}
						variant='solid'
						bg='gray.200'
						color='gray.800'
						_active={{ bg: 'gray.300' }}
						mr='3'
						fontSize='md'
						aria-label='close'
						onClick={onClose}
					>
						Close
					</Button>
					<Button
						{...buttonStyle}
						variant='solid'
						bg='brand.400'
						fontSize='md'
						aria-label='update'
						onClick={onClose}
						isDisabled={!replacementManager}
					>
						Proceed
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ReplaceManager;
