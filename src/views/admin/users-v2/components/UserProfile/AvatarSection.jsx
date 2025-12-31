import {
	Box,
	Avatar,
	IconButton,
	Flex,
	Text,
	Badge,
	HStack,
	Image,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	Input,
	ModalFooter,
	Button,
	Spinner,
	ModalBody,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { FiUploadCloud, FiUser } from 'react-icons/fi';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useCreateItemMutation } from 'api/apiSlice';
import { compressImage, resolveInitialImage } from '../../utils/imageUtils';

const LG_IMAGE_BOX_SIZE = '250px';
const SM_IMAGE_BOX_SIZE = '200px';

const StatusBadge = ({ isOnline }) => {
	const color = isOnline ? 'green.500' : 'gray.400';
	const label = isOnline ? 'Online' : 'Offline';

	return (
		<Flex
			align='center'
			gap={2}
			px={3}
			py={1}
			borderRadius='full'
			bg={isOnline ? 'green.50' : 'gray.100'}
			border='1px solid'
			borderColor={isOnline ? 'green.200' : 'gray.300'}
			w='fit-content'
			position='relative'
		>
			{/* Dot */}
			<Box w='8px' h='8px' borderRadius='full' bg={color} position='relative'>
				{isOnline && (
					<Box
						position='absolute'
						inset={0}
						borderRadius='full'
						bg='green.400'
						animation='pulse 1.6s infinite'
						opacity={0.6}
						sx={{
							'@keyframes pulse': {
								'0%': { transform: 'scale(1)', opacity: 0.6 },
								'70%': { transform: 'scale(2)', opacity: 0 },
								'100%': { opacity: 0 },
							},
						}}
					/>
				)}
			</Box>

			<Text fontSize='xs' fontWeight='600' color={color}>
				{label}
			</Text>
		</Flex>
	);
};

const AvatarSection = ({ user, refetchUser }) => {
	const [isOpen, setIsOpen] = useState(false);

	const [previewUrl, setPreviewUrl] = useState(null);

	const hasImage = Boolean(user?.profileImage);

	const onlineUsers = useSelector((state) => state.onlineUsers);

	const isOnline = onlineUsers?.users?.includes(user?._id?.toString());

	useEffect(() => {
		(async () => {
			const url = await resolveInitialImage(user);
			setPreviewUrl(url || null);
		})();
	}, [user]);

	return (
		<Box w='100%' position='relative'>
			<Flex
				w='100%'
				gap={6}
				align='center'
				flexDir={{ base: 'column', md: 'row' }}
			>
				{/* LEFT: Image / Avatar */}
				<Box
					position='relative'
					w={{ base: SM_IMAGE_BOX_SIZE, lg: LG_IMAGE_BOX_SIZE }}
					h={{ base: SM_IMAGE_BOX_SIZE, lg: LG_IMAGE_BOX_SIZE }}
					bg='gray.100'
					overflow='hidden'
					borderRadius='md'
					flexShrink={0}
				>
					{/* Edit Button */}
					<IconButton
						icon={<EditIcon />}
						position='absolute'
						top={3}
						right={3}
						zIndex={2}
						size='sm'
						colorScheme='gray'
						borderRadius='full'
						onClick={() => setIsOpen(true)}
						shadow='md'
						aria-label='Edit profile'
					/>

					{hasImage ? (
						<Image
							src={previewUrl}
							alt={user.fullName}
							w='100%'
							h='100%'
							objectFit='cover'
							fallback={
								<Avatar
									w='100%'
									h='100%'
									name={user.fullName}
									size='lg'
									borderRadius='md'
								/>
							}
						/>
					) : (
						<Avatar
							w='100%'
							h='100%'
							name={user.fullName}
							fontSize='5xl'
							borderRadius='md'
						/>
					)}
				</Box>

				{/* RIGHT: User Info */}
				<Flex flexDir='column' align={{ base: 'center', md: 'start' }} gap={3}>
					<Text
						fontSize={{ base: '2xl', md: '3xl' }}
						fontWeight='bold'
						color='gray.800'
					>
						{user.fullName}
					</Text>

					<Badge
						colorScheme='blue'
						w='fit-content'
						px={3}
						py={1}
						borderRadius='full'
					>
						{user.roles?.[0]?.roleName || 'User'}
					</Badge>

					<Badge
						colorScheme={user?.isActive ? 'green' : 'red'}
						variant='subtle'
						w='fit-content'
						px={3}
						py={1}
						borderRadius='full'
					>
						{user?.isActive ? 'Active' : 'Disabled'}
					</Badge>

					<StatusBadge isOnline={isOnline} />
				</Flex>
			</Flex>

			{isOpen && (
				<EditAvatarModal
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					user={user}
					refetchUser={refetchUser}
					previewUrl={previewUrl}
				/>
			)}
		</Box>
	);
};

const EditAvatarModal = ({
	isOpen,
	onClose,
	user,
	previewUrl,
	refetchUser,
}) => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [localPreviewUrl, setLocalPreviewUrl] = useState(previewUrl || null);
	const [isUploading, setIsUploading] = useState(false);

	const [createItemMutation] = useCreateItemMutation();

	/** cleanup object URLs */
	// useEffect(() => {
	// 	return () => {
	// 		if (selectedFile && previewUrl?.startsWith('blob:')) {
	// 			URL.revokeObjectURL(previewUrl);
	// 		}
	// 	};
	// }, [selectedFile, previewUrl]);

	const handleSelect = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!['image/png', 'image/jpeg'].includes(file.type)) {
			toast.error('Only PNG or JPEG allowed');
			return;
		}

		const objectUrl = URL.createObjectURL(file);

		setSelectedFile(file);
		setLocalPreviewUrl(objectUrl);

		e.target.value = null;
	};

	const handleSave = async () => {
		if (!selectedFile) return;

		try {
			setIsUploading(true);

			const compressedBlob = await compressImage(selectedFile);
			const compressedFile = new File([compressedBlob], selectedFile.name, {
				type: selectedFile.type,
			});

			const formData = new FormData();
			formData.append('userId', user._id);
			formData.append('profileImage', compressedFile);

			await createItemMutation({
				path: '/v3/users/upload/profile-image',
				body: formData,
				formData: true,
			}).unwrap();

			toast.success('Profile image updated');
			refetchUser();
			onClose();
		} catch (e) {
			console.log(e);
			toast.error('Upload failed');
		} finally {
			setIsUploading(false);
		}
	};

	const hasImage = Boolean(localPreviewUrl);

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size='lg'>
			<ModalOverlay backdropFilter='blur(6px)' />
			<ModalContent mx='2' borderRadius='xl' overflow='hidden'>
				<ModalHeader>Update Profile Photo</ModalHeader>

				<ModalBody>
					<Flex direction='column' align='center' gap={6}>
						{/* IMAGE PREVIEW */}
						<Box
							position='relative'
							w='220px'
							h='220px'
							borderRadius='xl'
							overflow='hidden'
							bg='gray.100'
							boxShadow='lg'
						>
							{hasImage ? (
								<Image
									src={localPreviewUrl}
									alt={user.fullName}
									w='100%'
									h='100%'
									objectFit='cover'
									fallback={
										<Flex
											w='100%'
											h='100%'
											align='center'
											justify='center'
											color='gray.400'
										>
											<FiUser size={72} />
										</Flex>
									}
								/>
							) : (
								<Flex
									w='100%'
									h='100%'
									align='center'
									justify='center'
									color='gray.400'
								>
									<FiUser size={72} />
								</Flex>
							)}

							{isUploading && (
								<Flex
									position='absolute'
									inset={0}
									bg='blackAlpha.600'
									align='center'
									justify='center'
								>
									<Spinner color='white' size='xl' thickness='3px' />
								</Flex>
							)}
						</Box>

						<Button
							as='label'
							htmlFor='avatar-upload'
							leftIcon={<FiUploadCloud />}
							bg='blue.50'
							color='blue.600'
							border='1px solid'
							borderColor='blue.100'
							cursor='pointer'
							_hover={{
								bg: 'blue.100',
								borderColor: 'blue.200',
							}}
							_active={{
								bg: 'blue.200',
							}}
							_focusVisible={{
								boxShadow: '0 0 0 2px rgba(66,153,225,0.6)',
							}}
							px={6}
							py={5}
							borderRadius='lg'
							fontWeight='semibold'
						>
							Upload photo
						</Button>

						<Text fontSize='sm' color='gray.500'>
							PNG or JPEG · Max optimized automatically
						</Text>

						<Input
							id='avatar-upload'
							type='file'
							accept='image/png,image/jpeg'
							onChange={handleSelect}
							display='none'
						/>
					</Flex>
				</ModalBody>

				<ModalFooter>
					<Button
						variant='ghost'
						color='gray.600'
						_hover={{ bg: 'gray.100', color: 'gray.800' }}
						_active={{ bg: 'gray.200' }}
						px={5}
						borderRadius='lg'
						onClick={onClose}
					>
						Cancel
					</Button>

					<Button
						ml={3}
						bg='brand.400'
						color='gray.100'
						px={6}
						borderRadius='lg'
						fontWeight='semibold'
						onClick={handleSave}
						isLoading={isUploading}
						isDisabled={!selectedFile}
						_hover={{ bg: 'brand.500' }}
						_disabled={{
							bg: 'brand.200',
							cursor: 'not-allowed',
							_hover: {
								bg: 'brand.200',
							},
							_active: {
								bg: 'brand.200',
							},
						}}
					>
						Save changes
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

AvatarSection.propTypes = {
	user: PropTypes.object.isRequired,
	refetchUser: PropTypes.func.isRequired,
};

export default AvatarSection;
