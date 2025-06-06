// InterviewerModal.jsx
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Box,
	Text,
	Checkbox,
	Button,
} from '@chakra-ui/react';
import { buttonStyle } from 'utils/btn';

const SelectInterviewOwner = ({
	isOpen,
	onClose,
	users = [],
	selectedId,
	onSelect,
	onConfirm,
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size='md'>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Choose Interview Administrator </ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Box
						h={users?.length > 4 ? { base: '30vh', md: '40vh' } : 'fit-content'}
						scrollBehavior='smooth'
						overflowY='scroll'
						p='2'
					>
						{users.length === 0 ? (
							<Text>No users available.</Text>
						) : (
							users.map((user) => (
								<Box
									key={user._id}
									display='flex'
									alignItems='center'
									justifyContent='space-between'
									p={2}
									borderWidth='1px'
									borderRadius='md'
									mb={2}
									bg='#F8FAFC'
								>
									<Checkbox
										isChecked={selectedId === user._id}
										onChange={() => onSelect(user._id)}
										colorScheme='brand'
										size='lg'
										_focus={{ boxShadow: 'none' }}
									>
										<Box>
											<Text fontSize='md'>{user.name}</Text>
											<Text fontSize='sm' color='gray.500'>
												{user.email}
											</Text>
										</Box>
									</Checkbox>
								</Box>
							))
						)}
					</Box>
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
					<Button {...buttonStyle} colorScheme='brand' onClick={onConfirm}>
						Confirm
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default SelectInterviewOwner;
