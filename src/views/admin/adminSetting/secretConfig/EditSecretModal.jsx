import { EditIcon, LockIcon, RepeatIcon } from '@chakra-ui/icons';
import {
	Box,
	Text,
	Button,
	Badge,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	FormControl,
	FormLabel,
	Textarea,
	HStack,
	VStack,
} from '@chakra-ui/react';
import { getEnvironmentBadge } from './secretUtils';

const EditSecretModal = ({
	isOpen,
	onClose,
	selectedSecret,
	setSelectedSecret,
	handleSave,
	isUpdating,
}) => {
	const handleClearValue = () => {
		if (!selectedSecret) return;

		setSelectedSecret({
			...selectedSecret,
			newValue: '',
		});
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='xl' isCentered>
			<ModalOverlay backdropFilter='blur(10px)' />
			<ModalContent>
				<ModalHeader borderBottomWidth='1px' pb={3}>
					<HStack spacing={2}>
						<EditIcon color='brand.500' />
						<Text>
							{selectedSecret ? 'Update Secret Value' : 'Create New Secret'}
						</Text>
					</HStack>
				</ModalHeader>
				<ModalCloseButton />

				<ModalBody py={6}>
					{selectedSecret && (
						<VStack spacing={5} align='stretch'>
							<Box
								bg='brand.50'
								p={4}
								borderRadius='md'
								borderLeftWidth='4px'
								borderLeftColor='brand.500'
							>
								<Text fontSize='sm' color='brand.800' fontWeight='500' mb={1}>
									Updating Secret
								</Text>
								<Text fontWeight='600'>{selectedSecret.key}</Text>
								<HStack spacing={2} mt={2}>
									<Badge colorScheme='purple'>{selectedSecret.service}</Badge>
									<Badge
										colorScheme={
											getEnvironmentBadge(selectedSecret.environment).color
										}
									>
										{selectedSecret.environment}
									</Badge>
								</HStack>
							</Box>

							<FormControl isRequired>
								<FormLabel fontWeight='600'>Secret Value</FormLabel>
								<Textarea
									placeholder='Enter the secret value...'
									value={selectedSecret.newValue || ''}
									onChange={(e) =>
										setSelectedSecret({
											...selectedSecret,
											newValue: e.target.value,
										})
									}
									minH='120px'
									fontFamily='mono'
									bg='gray.50'
									borderColor='gray.200'
									_hover={{ borderColor: 'brand.300' }}
									_focus={{
										borderColor: 'brand.500',
										boxShadow: 'outline',
									}}
								/>
								<HStack justify='space-between' mt={2}>
									<Text fontSize='xs' color='gray.500'>
										This value will be encrypted before storage
									</Text>

									<Button
										size='xs'
										variant='ghost'
										colorScheme='cyan'
										leftIcon={<RepeatIcon />}
										onClick={handleClearValue}
										isDisabled={!selectedSecret?.newValue}
									>
										Clear
									</Button>
								</HStack>
							</FormControl>

							{/* {selectedSecret.isEnabled !== undefined && (
								<FormControl display='flex' alignItems='center'>
									<FormLabel mb='0' fontWeight='600'>
										Secret Status
									</FormLabel>
									<HStack>
										<Box
											w='10px'
											h='10px'
											borderRadius='full'
											bg={selectedSecret.isEnabled ? 'green.500' : 'red.500'}
										/>
										<Text>
											{selectedSecret.isEnabled ? 'Active' : 'Inactive'}
										</Text>
									</HStack>
								</FormControl>
							)} */}
						</VStack>
					)}
				</ModalBody>

				<ModalFooter borderTopWidth='1px'>
					<Button variant='ghost' mr={3} onClick={onClose}>
						Cancel
					</Button>
					<Button
						variant='brand'
						onClick={handleSave}
						isLoading={isUpdating}
						loadingText='Updating...'
						leftIcon={<LockIcon />}
					>
						Update Secret
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default EditSecretModal;
