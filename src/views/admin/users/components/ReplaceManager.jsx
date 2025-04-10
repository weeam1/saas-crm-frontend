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
	type = '',
}) => {
	return (
		<Modal isOpen={isOpen} isCentered size='2xl'>
			<ModalOverlay />
			<ModalContent fontFamily="'DM Sans', sans-serif">
				<ModalHeader>Select Replacement Manager</ModalHeader>
				<ModalBody>
					<Box
						bg='yellow.50'
						border='1px solid'
						borderColor='yellow.200'
						p={4}
						mb='4'
						borderRadius='md'
					>
						<Flex align='start' gap={2}>
							<Icon
								as={AiOutlineInfoCircle}
								color='yellow.600'
								boxSize={5}
								mt={1}
							/>
							<Box>
								<Text fontSize='md' color='yellow.800' fontWeight='medium'>
									{type === 'userStatus'
										? 'This manager has been disabled. Please review the following actions:'
										: 'You’ve changed the user’s role from Manager. Please review the following actions:'}
								</Text>
								<Box as='ul' pl={4} mt={2} color='yellow.800' fontSize='md'>
									<li>
										You must assign a <strong>replacement manager</strong> to
										continue.
									</li>
									<li>
										All <strong>agents</strong> under this manager will be
										reassigned to the new manager.
									</li>
									<li>
										All <strong>leads</strong> previously assigned will also be
										transferred.
									</li>
								</Box>
							</Box>
						</Flex>
					</Box>

					<Select
						placeholder='Select a manager'
						value={replacementManager}
						onChange={(e) => setReplacementManager(e.target.value)}
					>
						{managers.map((manager) => (
							<option value={manager?._id} key={manager?._id}>
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
						onClick={handleProceed}
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
