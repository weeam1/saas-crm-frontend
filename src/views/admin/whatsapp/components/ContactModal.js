import React, { useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Button,
	FormControl,
	FormLabel,
	Input,
	VStack,
	HStack,
	Flex,
	Text,
	Avatar,
	IconButton,
	Box,
} from '@chakra-ui/react';
import { FiEdit, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCreateItemMutation, useDeleteItemMutation } from 'api/apiSlice';

import { toast } from 'react-toastify';
import NoData from 'components/Message/NoData';
import { generateRoomId } from './helpers';
import { useDispatch, useSelector } from 'react-redux';
import {
	addContact,
	updateContact,
	deleteContact,
} from '../../../../redux/whatsappSlice';
import { validatePhoneNumber } from 'utils/helpers';
import { normalizePhone } from 'utils/phoneValidation';
import { useModalColors } from 'hooks/useModalColors';

const ContactModal = ({ isOpen, onClose, businessPhone, setContacts }) => {
	const colors = useModalColors();
	const [editingContact, setEditingContact] = useState(null);
	const [name, setName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [isAdding, setIsAdding] = useState(false);

	const contacts = useSelector((state) => state.whatsapp.contacts || []);

	const clearState = () => {
		setName('');
		setPhoneNumber('');
	};

	const [createContactAPI, { isLoading: contactUpdating }] =
		useCreateItemMutation();

	const [deleteContactAPI, { isLoading: contactDeleting }] =
		useDeleteItemMutation();

	const dispatch = useDispatch();

	const handleAddContact = async () => {
		try {
			const validNum = normalizePhone(phoneNumber);

			if (!validNum)
				return toast.error('Please enter a valid WhatsApp number!');

			const newContact = {
				name,
				phoneNumber: validNum,
				ownerId: businessPhone,
			};

			const newUser = await createContactAPI({
				path: '/whatsapp/contacts',
				body: newContact,
			}).unwrap();

			const contact = {
				...newContact,
				_id: newUser?.doc?._id,
				roomId: newUser?.doc?.roomId,
			};

			dispatch(addContact(contact));
			toast.success('Contact added successfully');
			setIsAdding(false);
			clearState();
		} catch (err) {
			console.log(err);
			toast.error(err?.data?.message || 'Contact did not added!');
		}
	};

	const handleUpdateContact = async (data) => {
		try {
			const validNum = normalizePhone(phoneNumber);

			if (!validNum)
				return toast.error('Please enter a valid WhatsApp number!');

			const updateData = { name, phoneNumber: validNum };

			if (data?._id) {
				updateData.id = data?._id;
			}

			const res = await createContactAPI({
				path: '/whatsapp/contacts',
				body: updateData,
			}).unwrap();

			const contact = {
				...updateData,
				roomId: res?.doc?.roomId,
				_id: res?.doc?._id,
			};

			if (data?._id) {
				dispatch(updateContact(contact));
			} else {
				dispatch(addContact(contact));
			}

			toast.success('Contact updated successfully');
			setEditingContact(null);
			clearState();
		} catch (err) {
			console.log(err);
			toast.error(err?.data?.message || 'Contact did not added!');
		}
	};

	const onDeleteContact = async (id) => {
		try {
			await deleteContactAPI({
				path: `/whatsapp/contacts/${id}`,
			}).unwrap();

			dispatch(deleteContact(id));

			toast.success('Contact deleted successfully');
			setEditingContact(null);
			clearState();
		} catch (err) {
			console.log(err);
			toast.error(err?.data?.message || 'Contact did not deleted!');
		}
	};

	const handleEdit = (contact) => {
		setEditingContact(contact);
		setName(contact.name);
		setPhoneNumber(contact.phoneNumber);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='2xl' isCentered>
			<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />
			<ModalContent bg={colors.bg} borderRadius='2xl' boxShadow={colors.modalShadow} border='1px solid' borderColor={colors.borderColor}>
				<ModalHeader bg={colors.headerBg} color={colors.headerText} borderTopRadius='2xl'>
					Manage Contacts
				</ModalHeader>
				<ModalCloseButton color={colors.headerText} _hover={{ bg: colors.closeBtnHoverBg }} />
				<ModalBody pb={6}>
					{isAdding ? (
						<Box>
							<FormControl mb={4}>
								<FormLabel color={colors.labelColor}>Name</FormLabel>
								<Input
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder='Enter name'
									bg={colors.bgInput}
									borderColor={colors.borderColor}
									color={colors.headingText}
									_placeholder={{ color: colors.mutedText }}
									_focus={{
										borderColor: colors.accentGold,
										boxShadow: `0 0 0 1px ${colors.accentGold}`,
									}}
									_hover={{ borderColor: colors.accentGold }}
								/>
							</FormControl>

							<FormControl mb={4}>
								<FormLabel color={colors.labelColor}>Phone Number</FormLabel>
								<Input
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
									placeholder='Enter correct phone number'
									type='tel'
									bg={colors.bgInput}
									borderColor={colors.borderColor}
									color={colors.headingText}
									_placeholder={{ color: colors.mutedText }}
									_focus={{
										borderColor: colors.accentGold,
										boxShadow: `0 0 0 1px ${colors.accentGold}`,
									}}
									_hover={{ borderColor: colors.accentGold }}
								/>
							</FormControl>
							<Flex justify='flex-end'>
								<Button variant='outline' mr={2} onClick={() => setIsAdding(false)}>
									Cancel
								</Button>
								<Button
									variant='brand'
									isDisabled={contactUpdating || !phoneNumber}
									onClick={handleAddContact}
								>
									{contactUpdating ? 'Loading...' : 'Add'}
								</Button>
							</Flex>
						</Box>
					) : editingContact ? (
						<Box>
							<FormControl mb={4}>
								<FormLabel color={colors.labelColor}>Edit Contact Name</FormLabel>
								<Input
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder='Enter new name'
									bg={colors.bgInput}
									borderColor={colors.borderColor}
									color={colors.headingText}
									_placeholder={{ color: colors.mutedText }}
									_focus={{
										borderColor: colors.accentGold,
										boxShadow: `0 0 0 1px ${colors.accentGold}`,
									}}
									_hover={{ borderColor: colors.accentGold }}
								/>
							</FormControl>
							<FormControl mb={4}>
								<FormLabel color={colors.labelColor}>Phone Number</FormLabel>
								<Input
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
									placeholder='Enter phone number'
									type='tel'
									bg={colors.bgInput}
									borderColor={colors.borderColor}
									color={colors.headingText}
									_placeholder={{ color: colors.mutedText }}
									_focus={{
										borderColor: colors.accentGold,
										boxShadow: `0 0 0 1px ${colors.accentGold}`,
									}}
									_hover={{ borderColor: colors.accentGold }}
								/>
							</FormControl>
							<Flex justify='flex-end'>
								<Button variant='outline' mr={2} onClick={() => setEditingContact(null)}>
									Cancel
								</Button>
								<Button
									variant='brand'
									isDisabled={contactUpdating}
									onClick={() => handleUpdateContact(editingContact)}
								>
									{contactUpdating ? 'Loading...' : 'Save'}
								</Button>
							</Flex>
						</Box>
					) : (
						<>
							<Flex justify='flex-end' mb={4}>
								<Button
									leftIcon={<FiPlus />}
									variant='brand'
									onClick={() => setIsAdding(true)}
								>
									Add Contact
								</Button>
							</Flex>
							<VStack
								maxH='50vh'
								overflow='auto'
								p='2'
								spacing={4}
								align='stretch'
							>
								{contacts?.length > 0 ? (
									contacts?.map((contact, i) => (
										<Flex
											key={i || contact.roomId}
											justify='space-between'
											bg={colors.bgInput}
											p='3'
											rounded='lg'
											align='center'
											border='1px solid'
											borderColor={colors.borderColor}
										>
											<Flex align='center'>
												<Avatar src={contact.avatar} size='sm' mr={3} />
												<Box>
													<Text fontWeight='medium' color={colors.headingText}>
														{contact.name}
													</Text>

													{contact.phoneNumber && (
														<Text fontSize='xs' color={colors.mutedText}>
															{contact.phoneNumber}
														</Text>
													)}
												</Box>
											</Flex>
											<HStack>
												<IconButton
													icon={<FiEdit />}
													aria-label='Edit contact'
													size='sm'
													variant='ghost'
													onClick={() => handleEdit(contact)}
													color={colors.bodyText}
													_hover={{ color: colors.accentGold, bg: colors.bgDeep }}
												/>
												{/* <IconButton
													icon={<FiTrash2 />}
													aria-label='Delete contact'
													size='sm'
													colorScheme='red'
													onClick={() => onDeleteContact(contact._id)}
												/> */}
											</HStack>
										</Flex>
									))
								) : (
									<NoData label='contact' />
								)}
							</VStack>
						</>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default ContactModal;