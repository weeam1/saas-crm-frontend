// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   Box,
//   Text,
//   Flex,
//   Avatar,
//   Divider,
//   useColorModeValue,
// } from "@chakra-ui/react";

// const capitalizeFirstLetter = (str) => {
//   if (!str) return "N/A";
//   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// };

// const ContactDetailsModal = ({
//   isOpen,
//   onClose,
//   contacts,
//   developerName,
//   developerImageUrl,
// }) => {
//   const textColor = useColorModeValue("gray.600", "gray.200");

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
//       <ModalOverlay />
//       <ModalContent maxH="80vh" overflow="hidden">
//         <ModalHeader>
//           <Flex align="center" gap={4} mt={1}>
//             <Avatar
//               size="md"
//               name={capitalizeFirstLetter(developerName)}
//               src={developerImageUrl || ""}
//             />
//             <Text
//               fontWeight="bold"
//               fontSize={{ base: "md", md: "lg" }}
//               isTruncated
//               maxW="70%"
//             >
//               {capitalizeFirstLetter(developerName)}
//             </Text>
//           </Flex>
//         </ModalHeader>
//         <ModalCloseButton />
//         <ModalBody overflowY="auto">
//           {contacts?.length > 0 ? (
//             contacts.map((contact, index) => (
//               <Box key={contact._id || index} mb={4}>
//                 <Flex align="center" gap={3}>
//                   <Box>
//                     <Text fontSize="xs" color={textColor}>
//                       {capitalizeFirstLetter(contact.role)}
//                     </Text>
//                     <Text fontWeight="bold" fontSize="md">
//                       {capitalizeFirstLetter(contact.name)}
//                     </Text>
//                     <Text fontSize="md" color={textColor}>
//                       {contact.phoneNumber}
//                     </Text>
//                     {contact.email && (
//                       <Text fontSize="sm" color={textColor}>
//                         {contact.email.toLowerCase()}
//                       </Text>
//                     )}
//                   </Box>
//                 </Flex>
//                 {index < contacts.length - 1 && <Divider my={3} />}
//               </Box>
//             ))
//           ) : (
//             <Text>No contact details available</Text>
//           )}
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default ContactDetailsModal;

import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	Box,
	Text,
	Flex,
	Avatar,
	Divider,
	Icon,
	VStack,
	Badge,
} from '@chakra-ui/react';
import {
	FiUser,
	FiPhone,
	FiMail,
	FiBriefcase,
	FiUsers,
	FiUserX,
} from 'react-icons/fi';
import { useModalColors } from 'hooks/useModalColors';

const capitalizeFirstLetter = (str) => {
	if (!str) return 'N/A';
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const ContactDetailsModal = ({
	isOpen,
	onClose,
	contacts,
	developerName,
	developerImageUrl,
}) => {
	const mc = useModalColors();

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='md' isCentered>
			<ModalOverlay backdropFilter='blur(3px)' bg={mc.overlayBg} />
			<ModalContent
				maxH='80vh'
				overflow='hidden'
				borderRadius='2xl'
				boxShadow={mc.modalShadow}
				bg={mc.bg}
				border='1px solid'
				borderColor={mc.borderColor}
				display='flex'
				flexDirection='column'
			>
				{/* Header — Gold Gradient */}
				<ModalHeader p={0}>
					<Flex
						align='center'
						background={mc.headerBg}
						color={mc.headerText}
						px={6}
						py={4}
						boxShadow='0 2px 10px rgba(0,0,0,0.15)'
					>
						<Icon as={FiUsers} color='inherit' boxSize={5} mr={3} />
						<Text fontWeight='bold' color='inherit' fontSize='lg'>
							Contact Details
						</Text>
						<ModalCloseButton
							position='absolute'
							right='14px'
							top='14px'
							bg={mc.closeBtnBg}
							color={mc.closeBtnColor}
							borderRadius='full'
							_hover={{ bg: mc.closeBtnHoverBg }}
							_focus={{ boxShadow: 'none' }}
						/>
					</Flex>
				</ModalHeader>

				{/* Developer Profile Summary */}
				<Box
					px={6}
					pt={5}
					pb={4}
					borderBottom='1px solid'
					borderColor='rgba(212, 175, 55, 0.15)'
				>
					<Flex align='center' gap={4}>
						<Avatar
							size='lg'
							name={capitalizeFirstLetter(developerName)}
							src={developerImageUrl || ''}
							border='3px solid'
							borderColor='rgba(212, 175, 55, 0.3)'
						/>
						<Box flex={1}>
							<Text
								fontSize='xs'
								color={mc.labelColor}
								fontWeight='medium'
								textTransform='uppercase'
								letterSpacing='wider'
								mb={1}
							>
								Developer
							</Text>
							<Text
								fontWeight='bold'
								fontSize='xl'
								color={mc.headingText}
								isTruncated
							>
								{capitalizeFirstLetter(developerName)}
							</Text>
							{contacts?.length > 0 && (
								<Badge variant='gold' mt={1} fontSize='xs'>
									{contacts.length}{' '}
									{contacts.length === 1 ? 'Contact' : 'Contacts'}
								</Badge>
							)}
						</Box>
					</Flex>
				</Box>

				{/* Body — Contact List */}
				<ModalBody
					overflowY='auto'
					p={6}
					sx={{
						'&::-webkit-scrollbar': {
							width: '6px',
						},
						'&::-webkit-scrollbar-track': {
							background: mc.bgDeep,
							borderRadius: '3px',
						},
						'&::-webkit-scrollbar-thumb': {
							background: mc.borderColor,
							borderRadius: '3px',
							_hover: { background: mc.borderFocus },
						},
					}}
				>
					{contacts?.length > 0 ? (
						<VStack spacing={3} align='stretch'>
							{contacts.map((contact, index) => (
								<Box
									key={contact._id || index}
									bg={mc.bgDeep}
									border='1px solid'
									borderColor='rgba(212, 175, 55, 0.15)'
									borderRadius='xl'
									p={4}
									transition='all 0.2s'
									_hover={{
										borderColor: 'rgba(212, 175, 55, 0.35)',
										boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
										transform: 'translateY(-1px)',
									}}
								>
									{/* Contact Header — Name & Role */}
									<Flex align='center' gap={3} mb={3}>
										<Flex
											align='center'
											justify='center'
											bg='rgba(212, 175, 55, 0.1)'
											borderRadius='full'
											w='40px'
											h='40px'
											flexShrink={0}
										>
											<Icon as={FiUser} color='accent.gold' boxSize={5} />
										</Flex>
										<Box flex={1}>
											<Text
												fontWeight='bold'
												fontSize='md'
												color={mc.headingText}
											>
												{capitalizeFirstLetter(contact.name)}
											</Text>
											<Badge variant='gold' fontSize='xs'>
												<Icon as={FiBriefcase} mr={1} boxSize={2.5} />
												{capitalizeFirstLetter(contact.role)}
											</Badge>
										</Box>
									</Flex>

									{/* Contact Details */}
									<VStack spacing={2} align='stretch' ml='52px'>
										{/* Phone */}
										<Flex
											align='center'
											gap={2}
											bg='rgba(255, 255, 255, 0.02)'
											borderRadius='md'
											p={2}
										>
											<Icon
												as={FiPhone}
												color={mc.labelColor}
												boxSize={4}
												flexShrink={0}
											/>
											<Text fontSize='sm' color={mc.bodyText}>
												{contact.phoneNumber || 'N/A'}
											</Text>
										</Flex>

										{/* Email */}
										{contact.email && (
											<Flex
												align='center'
												gap={2}
												bg='rgba(255, 255, 255, 0.02)'
												borderRadius='md'
												p={2}
											>
												<Icon
													as={FiMail}
													color={mc.labelColor}
													boxSize={4}
													flexShrink={0}
												/>
												<Text fontSize='sm' color={mc.bodyText}>
													{contact.email.toLowerCase()}
												</Text>
											</Flex>
										)}
									</VStack>
								</Box>
							))}
						</VStack>
					) : (
						/* Empty State */
						<Flex
							direction='column'
							align='center'
							justify='center'
							py={12}
							px={4}
						>
							<Flex
								align='center'
								justify='center'
								bg='rgba(212, 175, 55, 0.08)'
								borderRadius='full'
								w='80px'
								h='80px'
								mb={4}
							>
								<Icon as={FiUserX} color={mc.labelColor} boxSize={10} />
							</Flex>
							<Text
								fontSize='lg'
								fontWeight='semibold'
								color={mc.headingText}
								mb={2}
							>
								No Contacts Available
							</Text>
							<Text fontSize='sm' color={mc.mutedText} textAlign='center'>
								There are no contact details associated with this developer yet.
							</Text>
						</Flex>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default ContactDetailsModal;
