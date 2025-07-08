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

const ContactModal = ({ isOpen, onClose, businessPhone, setContacts }) => {
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
			const validNum = validatePhoneNumber(phoneNumber);

			if (!validNum)
				return toast.error('Please enter a valid WhatsApp number!');

			const roomId = generateRoomId(validNum, businessPhone);

			const newContact = {
				name,
				phoneNumber: validNum,
				roomId,
				ownerId: businessPhone,
			};

			const newUser = await createContactAPI({
				path: '/whatsapp/contacts',
				body: newContact,
			}).unwrap();

			const contact = {
				...newContact,
				_id: newUser?.doc?._id,
				roomId,
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
			const validNum = validatePhoneNumber(phoneNumber);

			if (!validNum)
				return toast.error('Please enter a valid WhatsApp number!');

			const updateData = { name, phoneNumber: validNum };
			const roomId = generateRoomId(validNum, businessPhone);

			if (data?._id) {
				updateData.id = data?._id;
			} else {
				updateData.roomId = roomId;
			}

			const res = await createContactAPI({
				path: '/whatsapp/contacts',
				body: updateData,
			}).unwrap();

			const contact = {
				...updateData,
				roomId,
				_id: res?.doc?._id,
			};

			console.log({ contact });

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
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Manage Contacts</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					{isAdding ? (
						<Box>
							<FormControl mb={4}>
								<FormLabel>Name</FormLabel>
								<Input
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder='Enter name'
								/>
							</FormControl>

							<FormControl mb={4}>
								<FormLabel>Phone Number</FormLabel>
								<Input
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
									placeholder='Enter correct phone number'
									type='tel'
								/>
								{/* <Text fontSize='xs' color='gray.700'>
									Enter a valid phone number with country code (digits only, no
									+ or spaces). Example: 923001234567.
								</Text> */}
							</FormControl>
							<Flex justify='flex-end'>
								<Button mr={2} onClick={() => setIsAdding(false)}>
									Cancel
								</Button>
								<Button
									colorScheme='whatsapp'
									disabled={contactUpdating || !phoneNumber}
									onClick={handleAddContact}
								>
									{contactUpdating ? 'Loading...' : 'Add'}
								</Button>
							</Flex>
						</Box>
					) : editingContact ? (
						<Box>
							<FormControl mb={4}>
								<FormLabel>Edit Contact Name</FormLabel>
								<Input
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder='Enter new name'
								/>
							</FormControl>
							{/* <FormControl mb={4}>
								<FormLabel>Email</FormLabel>
								<Input
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder='Enter email'
									type='email'
								/>
							</FormControl> */}
							<FormControl mb={4}>
								<FormLabel>Phone Number</FormLabel>
								<Input
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
									placeholder='Enter phone number'
									type='tel'
								/>
							</FormControl>
							<Flex justify='flex-end'>
								<Button mr={2} onClick={() => setEditingContact(null)}>
									Cancel
								</Button>
								<Button
									colorScheme='whatsapp'
									disabled={contactUpdating}
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
									colorScheme='whatsapp'
									onClick={() => setIsAdding(true)}
								>
									Add Contact
								</Button>
							</Flex>
							<VStack
								maxH='50vh'
								overflow='scroll'
								p='2'
								spacing={4}
								align='stretch'
							>
								{contacts?.length > 0 ? (
									contacts?.map((contact, i) => (
										<Flex
											key={i || contact.roomId}
											justify='space-between'
											bg='gray.100'
											p='2'
											rounded='md'
											align='center'
										>
											<Flex align='center'>
												<Avatar src={contact.avatar} size='sm' mr={3} />
												<Box>
													<Text fontWeight='medium'>{contact.name}</Text>

													{contact.phoneNumber && (
														<Text fontSize='xs' color='gray.500'>
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
													onClick={() => handleEdit(contact)}
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
