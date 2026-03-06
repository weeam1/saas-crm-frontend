// import React from 'react';
// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalCloseButton,
// 	ModalBody,
// 	ModalFooter,
// 	Button,
// 	Text,
// 	Icon,
// 	Flex,
// 	Box,
// } from '@chakra-ui/react';
// import { MdCheckCircle } from 'react-icons/md';
// import { FaCircle } from 'react-icons/fa';

// const MessageSuccessModal = ({
// 	isOpen,
// 	onClose,
// 	onlineUsers,
// 	offlineUsers,
// 	totalReceivers,
// }) => {
// 	return (
// 		<Modal isOpen={isOpen} onClose={onClose} isCentered>
// 			<ModalOverlay />
// 			<ModalContent>
// 				<ModalHeader alignContent='center'>
// 					<Flex align='center' px={4} py={2}>
// 						<Icon
// 							as={MdCheckCircle}
// 							width='10'
// 							height='10'
// 							color='green.500'
// 							mr={2}
// 						/>
// 						<Text fontSize='2xl' fontWeight='bold'>
// 							Announcement Sent
// 						</Text>
// 					</Flex>
// 				</ModalHeader>
// 				<ModalBody textAlign='center' p={6}>
// 					<Text fontSize='lg' color='green.600' mb={4}>
// 						Announcement successfully sent to all users!
// 					</Text>
// 					<Box
// 						display='flex'
// 						justifyContent='center'
// 						alignItems='center'
// 						gap={4}
// 					>
// 						{/* Online Status Box */}
// 						{onlineUsers > 0 && (
// 							<Box
// 								display='flex'
// 								alignItems='center'
// 								justifyContent='center'
// 								p={3}
// 								borderWidth={1}
// 								borderRadius='md'
// 								borderColor='green.300'
// 								bg='green.50'
// 								boxShadow='sm'
// 								minW='120px'
// 							>
// 								<FaCircle color='green' size='1em' />
// 								<Text ml={2} color='green.600' fontWeight='medium'>
// 									{onlineUsers} Online
// 								</Text>
// 							</Box>
// 						)}

// 						{/* Offline Status Box */}
// 						{offlineUsers > 0 && (
// 							<Box
// 								display='flex'
// 								alignItems='center'
// 								justifyContent='center'
// 								p={3}
// 								borderWidth={1}
// 								borderRadius='md'
// 								borderColor='red.300'
// 								bg='red.50'
// 								boxShadow='sm'
// 								minW='120px'
// 							>
// 								<FaCircle color='red' size='1em' />
// 								<Text ml={2} color='red.600' fontWeight='medium'>
// 									{offlineUsers} Offline
// 								</Text>
// 							</Box>
// 						)}
// 					</Box>
// 				</ModalBody>
// 				<ModalFooter>
// 					<Button colorScheme='green' width='100px' onClick={onClose}>
// 						OK
// 					</Button>
// 				</ModalFooter>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

// export default MessageSuccessModal;

import React from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	Button,
	Text,
	Icon,
	Flex,
	Box,
	VStack,
	HStack,
	Divider,
} from '@chakra-ui/react';
import { MdCheckCircle, MdPeople, MdWifi, MdWifiOff } from 'react-icons/md';

const MessageSuccessModal = ({
	isOpen,
	onClose,
	onlineUsers,
	offlineUsers,
	totalReceivers,
}) => {
	const hasOnlineUsers = onlineUsers > 0;
	const hasOfflineUsers = offlineUsers > 0;

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size='md'>
			<ModalOverlay backdropFilter='blur(4px)' />
			<ModalContent borderRadius='xl' p={2}>
				{/* Success Icon */}
				<Flex direction='column' align='center' pt={8} pb={4}>
					<Box bg='green.50' borderRadius='full' p={3} mb={3}>
						<Icon as={MdCheckCircle} boxSize={12} color='green.500' />
					</Box>

					<Text fontSize='2xl' fontWeight='bold' color='gray.800'>
						Announcement Sent!
					</Text>

					<Text fontSize='md' color='gray.500' mt={1}>
						Your message has been delivered successfully
					</Text>
				</Flex>

				<Divider borderColor='gray.100' />

				<ModalBody py={6} px={4}>
					{/* Summary Card */}
					<Box bg='gray.50' borderRadius='lg' p={4} mb={4}>
						<HStack spacing={2} mb={3}>
							<Icon as={MdPeople} color='gray.500' />
							<Text fontSize='sm' fontWeight='semibold' color='gray.600'>
								Delivery Summary
							</Text>
						</HStack>

						<VStack spacing={3} align='stretch'>
							{hasOnlineUsers && (
								<Flex justify='space-between' align='center'>
									<HStack spacing={2}>
										<Icon as={MdWifi} color='green.500' boxSize={4} />
										<Text color='gray.700'>Online Users</Text>
									</HStack>
									<Text fontWeight='semibold' color='green.600'>
										{onlineUsers}
									</Text>
								</Flex>
							)}

							{hasOfflineUsers && (
								<Flex justify='space-between' align='center'>
									<HStack spacing={2}>
										<Icon as={MdWifiOff} color='orange.500' boxSize={4} />
										<Text color='gray.700'>Offline Users</Text>
									</HStack>
									<Text fontWeight='semibold' color='orange.600'>
										{offlineUsers}
									</Text>
								</Flex>
							)}

							<Flex
								justify='space-between'
								align='center'
								pt={2}
								borderTop='1px dashed'
								borderColor='gray.200'
							>
								<Text fontWeight='medium' color='gray.700'>
									Total Recipients
								</Text>
								<Text fontWeight='bold' color='gray.900' fontSize='lg'>
									{totalReceivers}
								</Text>
							</Flex>
						</VStack>
					</Box>

					{/* Status Message */}
					<Text fontSize='sm' color='gray.500' textAlign='center'>
						{hasOfflineUsers
							? 'Offline users will receive the announcement when they come online'
							: 'All users are online and have received the announcement'}
					</Text>
				</ModalBody>

				{/* Footer with single action button */}
				<Box px={6} pb={6}>
					<Button
						colorScheme='green'
						size='lg'
						width='full'
						onClick={onClose}
						borderRadius='lg'
						fontWeight='medium'
					>
						Done
					</Button>
				</Box>
			</ModalContent>
		</Modal>
	);
};

export default MessageSuccessModal;
