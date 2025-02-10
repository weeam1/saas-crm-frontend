import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	List,
	ListItem,
	Avatar,
	Text,
	Flex,
	useColorModeValue,
	VStack,
	Box,
} from '@chakra-ui/react';

const ReadByModal = ({ isOpen, onClose, readByUsers }) => {
	const hoverBg = useColorModeValue('gray.100', 'gray.700');
	const emptyStateColor = useColorModeValue('gray.500', 'gray.400');

	console.log(readByUsers);
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='md'
			isCentered
			motionPreset='scale'
		>
			<ModalOverlay />
			<ModalContent borderRadius='xl'>
				<ModalHeader fontSize='lg' fontWeight='600' px={6} pt={6} pb={2}>
					Read By
				</ModalHeader>
				<ModalCloseButton mt={2} />

				<ModalBody
					width='100%'
					background='gray.100'
					maxH='400px' // Set max height for the modal body
					overflowY='auto' // Enable vertical scrolling when content exceeds max height
					sx={{
						'&::-webkit-scrollbar': {
							width: '6px', // Custom scrollbar width
						},
						'&::-webkit-scrollbar-thumb': {
							background: 'gray.200', // Custom brand color (adjust according to your theme)
							borderRadius: '8px',
						},
						'&::-webkit-scrollbar-thumb:hover': {
							background: 'gray.300', // Slightly darker on hover
						},
					}}
					p='6'
					mb='6'
				>
					{readByUsers?.length > 0 ? (
						<List spacing={3}>
							{readByUsers.map((user) => (
								<ListItem
									key={user._id}
									p={2}
									borderRadius='md'
									_hover={{ bg: hoverBg }}
									transition='background-color 0.2s'
								>
									<Flex align='center'>
										<Avatar
											name={user.name}
											size='sm'
											mr={3}
											bg='brand.500'
											color='white'
										/>
										<Box>
											<Text fontSize='md' fontWeight='500'>
												{user.name}
											</Text>
											<Text fontSize='md' color='gray.500' fontWeight='500'>
												{user.email}
											</Text>
										</Box>
									</Flex>
								</ListItem>
							))}
						</List>
					) : (
						<Flex align='center' justify='center' minH='100px'>
							<Text color={emptyStateColor} fontSize='md'>
								No readers yet
							</Text>
						</Flex>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default ReadByModal;
