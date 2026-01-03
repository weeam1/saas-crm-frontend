import React, { useEffect, useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	Input,
	Textarea,
	IconButton,
	VStack,
	HStack,
	Text,
	Flex,
	Box,
	useBreakpointValue,
	Badge,
	Grid,
} from '@chakra-ui/react';
import {
	FiEdit2,
	FiTrash2,
	FiPlus,
	FiFileText,
	FiTag,
	FiList,
	FiCheckCircle,
} from 'react-icons/fi';
import { useModalColors } from 'hooks/useModalColors';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const schema = yup.object().shape({
	name: yup.string().required('Name is required').min(2).max(50),
	description: yup.string().max(200, 'Max 200 characters'),
});

const TemplateModal = ({ isOpen, onClose, role, onSave, mode }) => {
	const { bg, headerBg, headerText, footerBg, borderColor } = useModalColors();
	const [attributes, setAttributes] = useState([]);
	const [newAttr, setNewAttr] = useState({
		name: '',
		description: '',
		maxScore: '',
	});
	const [newErrors, setNewErrors] = useState({});
	const [editingIndex, setEditingIndex] = useState(null);
	const [editItem, setEditItem] = useState({
		name: '',
		description: '',
		maxScore: '',
	});
	const [editErrors, setEditErrors] = useState({});

	const hasTemplate = Boolean(role?.template?.attributes?.length);

	const isView = mode === 'view';
	const isEdit = mode === 'edit';
	const isAdd = mode === 'add';

	useEffect(() => {
		if (isOpen) {
			setAttributes(role?.template?.attributes || []);
			setNewAttr({ name: '', description: '' });
			setNewErrors({});
			setEditingIndex(null);
			setEditItem({ name: '', description: '' });
			setEditErrors({});
		}
	}, [isOpen, role]);

	const handleClose = () => {
		setAttributes([]);
		setNewAttr({ name: '', description: '', maxScore: '' });
		setNewErrors({});
		setEditingIndex(null);
		setEditItem({ name: '', description: '', maxScore: '' });
		setEditErrors({});
		onClose();
	};

	const handleAdd = async () => {
		try {
			await schema.validate(newAttr, { abortEarly: false });
			setAttributes([...attributes, { ...newAttr }]);
			setNewAttr({ name: '', description: '', maxScore: '' });
			setNewErrors({});
		} catch (err) {
			const errors = {};
			err.inner.forEach((e) => (errors[e.path] = e.message));
			setNewErrors(errors);
		}
	};

	const handleDelete = (index) => {
		setAttributes(attributes.filter((_, i) => i !== index));
	};

	const handleEdit = (index) => {
		setEditingIndex(index);
		setEditItem({ ...attributes[index] });
		setEditErrors({});
	};

	const handleSaveEdit = async () => {
		try {
			await schema.validate(editItem, { abortEarly: false });
			const updated = [...attributes];
			updated[editingIndex] = { ...editItem };
			setAttributes(updated);
			setEditingIndex(null);
			setEditItem({ name: '', description: '', maxScore: '' });
			setEditErrors({});
		} catch (err) {
			const errors = {};
			err.inner.forEach((e) => (errors[e.path] = e.message));
			setEditErrors(errors);
		}
	};

	const handleSaveTemplate = () => {
		if (!role?._id) return toast.error('Role not found.');
		if (attributes.length === 0)
			return toast.error('Add at least one attribute.');

		onSave({
			role: role._id,
			attributes: attributes.map((a) => ({
				name: a.name.trim(),
				description: a.description.trim(),
				maxScore: a.maxScore,
			})),
		});

		toast.success(hasTemplate ? 'Template Updated!' : 'Template Added!');
		handleClose();
	};

	const modalSize = useBreakpointValue({ base: 'lg', md: '5xl' });

	const handleMaxScoreChange = (e, mode = 'add') => {
		const val = e.target.value;

		// Allow empty (user deleting)
		if (val === '') {
			if (mode === 'add') setNewAttr((prev) => ({ ...prev, maxScore: '' }));
			else setEditItem((prev) => ({ ...prev, maxScore: '' }));
			return;
		}

		// Allow digits only
		if (!/^\d+$/.test(val)) return;

		const num = parseInt(val, 10);

		console.log({ changeNum: num });

		// Prevent zero and negative values
		if (num < 1) return;

		if (mode === 'add') setNewAttr((prev) => ({ ...prev, maxScore: num }));
		else setEditItem((prev) => ({ ...prev, maxScore: num }));

		// setNewAttr((prev) => ({ ...prev, maxScore: num }));
	};

	const handleMaxScoreBlur = (mode = 'add') => {
		const val = newAttr.maxScore;

		// Empty -> default to 1
		if (val === '' || val == null) {
			if (mode === 'add') setNewAttr((prev) => ({ ...prev, maxScore: 1 }));
			else setEditItem((prev) => ({ ...prev, maxScore: 1 }));
			return;
		}

		const num = parseInt(val, 10);

		console.log({ blurNum: num });

		// Force minimum 1
		if (num < 1) {
			if (mode === 'add') setNewAttr((prev) => ({ ...prev, maxScore: 1 }));
			else setEditItem((prev) => ({ ...prev, maxScore: 1 }));
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} isCentered size={modalSize}>
			<ModalOverlay backdropFilter='blur(8px)' />

			<ModalContent
				mx={{ base: 3, md: 8 }}
				boxShadow='0 12px 45px rgba(0,0,0,0.25)'
				borderRadius='2xl'
				bg={bg}
				overflow='hidden'
				h='85vh'
				display='flex'
				flexDirection='column'
			>
				<Flex
					align='center'
					justify='space-between'
					bg={headerBg}
					color={headerText}
					px={{ base: 6, md: 8 }}
					py={4}
					borderBottom='1px solid'
					borderColor={borderColor}
				>
					<HStack spacing={3}>
						<FiList size={22} />
						<Text fontSize='lg' fontWeight='700'>
							Role Attributes — {role?.roleName || 'N/A'}
						</Text>
					</HStack>
					<ModalCloseButton position='static' />
				</Flex>

				<ModalBody
					overflowY='auto'
					px={{ base: 6, md: 8 }}
					py={5}
					flex='1'
					sx={{
						'&::-webkit-scrollbar': { width: '6px' },
						'&::-webkit-scrollbar-thumb': {
							background: 'gray.400',
							borderRadius: '12px',
						},
					}}
				>
					<VStack align='stretch' spacing={6}>
						{!isView && (
							<Box
								p={5}
								borderRadius='xl'
								border='1px solid'
								borderColor='gray.200'
								bg='white'
								shadow='sm'
								transition='0.3s'
								_hover={{ shadow: 'md' }}
							>
								<HStack mb={3} spacing={2}>
									<FiTag size={18} color='#3b82f6' />
									<Text fontWeight='600' fontSize='md'>
										Add New Attribute
									</Text>
								</HStack>

								<Grid templateColumns={'1fr'} gap={4}>
									<Box>
										<Input
											placeholder='E.g. Performance, Communication, Leadership'
											value={newAttr.name}
											onChange={(e) => {
												const value = e.target.value;
												if (value.length <= 50) {
													setNewAttr({ ...newAttr, name: value });
												}
											}}
											size='md'
											focusBorderColor='brand.500'
											borderRadius='md'
											_placeholder={{ color: 'gray.400' }}
											isDisabled={isView}
										/>
										<Text fontSize='xs' color='gray.500'>
											{newAttr.name.length}/50
										</Text>
										{newErrors.name && (
											<Text fontSize='xs' color='red.500'>
												{newErrors.name}
											</Text>
										)}
									</Box>

									<Box>
										<Textarea
											placeholder='E.g. Evaluate how the employee performs under pressure.'
											value={newAttr.description}
											onChange={(e) => {
												const value = e.target.value;
												if (value.length <= 200) {
													setNewAttr({ ...newAttr, description: value });
												}
											}}
											size='md'
											focusBorderColor='brand.500'
											borderRadius='md'
											resize='none'
											_placeholder={{ color: 'gray.400' }}
											isDisabled={isView}
										/>
										<Text fontSize='xs' color='gray.500'>
											{newAttr.description.length}/200
										</Text>
										{newErrors.description && (
											<Text fontSize='xs' color='red.500'>
												{newErrors.description}
											</Text>
										)}
									</Box>
									<Box>
										<Text
											fontSize={{ base: 'sm', md: 'md' }}
											fontWeight={600}
											color='gray.800'
											mb={2}
										>
											Maximum Score
										</Text>

										<Input
											value={newAttr.maxScore}
											onChange={(e) => handleMaxScoreChange(e, 'add')}
											onBlur={() => handleMaxScoreBlur('add')}
											inputMode='numeric'
											pattern='\d*'
											// textAlign='center'
											fontSize='sm'
											border='1px solid'
											borderColor='gray.200'
											borderRadius='md'
											bg='white'
											onFocus={(e) => e.target.select()}
											_hover={{ borderColor: 'brand.300' }}
											_focus={{
												borderColor: 'brand.500',
												boxShadow: '0 0 0 3px rgba(216, 201, 114, 0.15)',
											}}
											placeholder='Enter a max value of 1 or higher'
										/>
									</Box>
								</Grid>

								{!isView && (
									<Button
										leftIcon={<FiPlus />}
										mt={4}
										colorScheme='brand'
										borderRadius='md'
										onClick={handleAdd}
									>
										Add Attribute
									</Button>
								)}
							</Box>
						)}

						<Box>
							<HStack mb={3}>
								<FiFileText size={18} color='#10b981' />
								<Text fontWeight='600' fontSize='md'>
									Attributes ({attributes.length})
								</Text>
							</HStack>

							{attributes.length === 0 ? (
								<Text fontSize='sm' color='gray.500'>
									No attributes added yet.
								</Text>
							) : (
								<VStack spacing={4} align='stretch'>
									{attributes.map((item, index) => (
										<Box
											key={index}
											p={4}
											borderRadius='xl'
											shadow='md'
											bg='white'
											position='relative'
											borderLeft='5px solid'
											borderColor='brand.500'
											transition='0.3s'
											_hover={{
												shadow: !isView ? 'xl' : 'md',
												transform: !isView ? 'translateY(-2px)' : 'none',
											}}
										>
											{editingIndex === index && !isView ? (
												<VStack spacing={3} align='stretch'>
													<Input
														value={editItem.name}
														onChange={(e) => {
															const value = e.target.value;
															if (value.length <= 50) {
																setEditItem({
																	...editItem,
																	name: e.target.value,
																});
															}
														}}
														maxLength={50}
													/>
													<Text fontSize='xs' color='gray.500'>
														{editItem.name.length}/50
													</Text>

													<Textarea
														value={editItem.description}
														onChange={(e) => {
															const value = e.target.value;
															if (value.length <= 200) {
																setEditItem({
																	...editItem,
																	description: e.target.value,
																});
															}
														}}
														maxLength={200}
														resize='none'
													/>
													<Text fontSize='xs' color='gray.500'>
														{editItem.description.length}/200
													</Text>

													<Box>
														<Input
															value={editItem.maxScore}
															onChange={(e) => handleMaxScoreChange(e, 'edit')}
															// onBlur={() => handleMaxScoreBlur('edit')}
															inputMode='numeric'
															pattern='\d*'
															// textAlign='center'
															fontSize='sm'
															border='1px solid'
															borderColor='gray.200'
															borderRadius='md'
															bg='white'
															onFocus={(e) => e.target.select()}
															_hover={{ borderColor: 'brand.300' }}
															_focus={{
																borderColor: 'brand.500',
																boxShadow:
																	'0 0 0 3px rgba(216, 201, 114, 0.15)',
															}}
															placeholder='Enter a max value of 1 or higher'
														/>
													</Box>

													<Button
														size='sm'
														leftIcon={<FiCheckCircle />}
														colorScheme='brand'
														borderRadius='md'
														onClick={handleSaveEdit}
													>
														Save
													</Button>
												</VStack>
											) : (
												<HStack justify='space-between' align='start'>
													<VStack align='start' spacing={1}>
														<HStack spacing={2}>
															<Badge colorScheme='brand' variant='subtle'>
																#{index + 1}
															</Badge>
															<Text fontWeight='600' fontSize='md'>
																{item.name}
															</Text>
														</HStack>
														<Text fontSize='sm' color='gray.600'>
															{item.description}
														</Text>
														<Text>Max Score: {item.maxScore || 10}</Text>
													</VStack>

													{!isView && (
														<HStack spacing={2}>
															<IconButton
																icon={<FiEdit2 />}
																size='sm'
																variant='ghost'
																borderRadius='md'
																onClick={() => handleEdit(index)}
															/>
															<IconButton
																icon={<FiTrash2 />}
																size='sm'
																colorScheme='red'
																variant='ghost'
																borderRadius='md'
																onClick={() => handleDelete(index)}
															/>
														</HStack>
													)}
												</HStack>
											)}
										</Box>
									))}
								</VStack>
							)}
						</Box>
					</VStack>
				</ModalBody>

				<ModalFooter
					bg={footerBg}
					borderTop='1px solid'
					borderColor={borderColor}
					py={4}
					px={{ base: 6, md: 8 }}
					justifyContent='flex-end'
				>
					<HStack spacing={3}>
						<Button
							size='sm'
							variant='outline'
							borderRadius='md'
							onClick={handleClose}
						>
							Cancel
						</Button>

						{!isView && (
							<Button
								size='sm'
								colorScheme='brand'
								borderRadius='md'
								onClick={handleSaveTemplate}
							>
								{isAdd ? 'Add Template' : 'Update Template'}
							</Button>
						)}
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default TemplateModal;
