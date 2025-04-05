import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Select,
	Flex,
	Icon,
	Text,
	Box,
} from '@chakra-ui/react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
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
		<Modal isOpen={isOpen} isCentered size='lg'>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Select Replacement Manager</ModalHeader>
				<ModalBody>
					<Box
						bg='blue.50'
						border='1px solid'
						borderColor='blue.200'
						p={4}
						mb='4'
						borderRadius='md'
					>
						<Flex align='center' gap={2}>
							<Icon as={AiOutlineInfoCircle} color='blue.500' boxSize={5} />
							<Text fontSize='sm' color='blue.800'>
								You’ve changed the user’s role from <strong>Manager</strong> to
								another role. Please select a replacement manager to proceed
								with reassigning their leads.
							</Text>
						</Flex>
					</Box>
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
