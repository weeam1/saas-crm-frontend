// import {
// 	Box,
// 	Flex,
// 	Text,
// 	Stack,
// 	Button,
// 	Divider,
// 	FormControl,
// 	FormLabel,
// 	Switch,
// 	Menu,
// 	MenuButton,
// 	MenuList,
// 	MenuItem,
// 	useColorModeValue,
// 	IconButton,
// 	useDisclosure,
// 	Tooltip,
// 	HStack,
// } from '@chakra-ui/react';
// import {
// 	FaUser,
// 	FaUserTie,
// 	FaCalendarAlt,
// 	FaWhatsapp,
// 	FaEllipsisV,
// 	FaEdit,
// 	FaTrash,
// } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import UserAvatar from 'components/shared/UserAvatar';
// import { formatPostDate } from 'utils/helpers';
// import { useUpdateItemMutation, useDeleteItemMutation } from 'api/apiSlice';
// import { toast } from 'react-toastify';
// import CreateInstance from './CreateInstance';
// import ConfirmationModal from 'components/Message/ConfirmationModal';
// import { useState } from 'react';

// const WhatsappUserCard = ({ data, updateInstances, removeInstance }) => {
// 	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

// 	const navigate = useNavigate();
// 	const { user, instanceName, isActive, createdAt } = data || {};

// 	// Color values
// 	const cardBg = useColorModeValue('#dcf8c6', 'gray.800');
// 	const whatsappGreen = useColorModeValue('#25D366', '#128C7E');
// 	const borderColor = useColorModeValue('gray.200', 'gray.700');
// 	const hoverBorderColor = useColorModeValue('#25D366', '#128C7E');
// 	const textColor = useColorModeValue('gray.700', 'gray.300');
// 	const secondaryTextColor = useColorModeValue('gray.500', 'gray.400');

// 	const [updateInstance, { isLoading: isUpdating }] = useUpdateItemMutation();
// 	const [deleteInstance, { isLoading: isDeleting }] = useDeleteItemMutation();

// 	const { isOpen, onOpen, onClose } = useDisclosure();

// 	// Handle instance status toggle
// 	const updateInstanceStatus = async (val) => {
// 		try {
// 			await updateInstance({
// 				path: `/whatsapp/instances/status/${data?._id}`,
// 				body: { isActive: val },
// 			}).unwrap();

// 			toast.success(`Instance ${val ? 'enabled' : 'disabled'} successfully`);
// 			updateInstances(data?._id, { isActive: val });
// 		} catch (error) {
// 			toast.error(error?.data?.message || 'Failed to update instance status');
// 		}
// 	};

// 	// Handle delete instance
// 	const handleConfirmRemove = async () => {
// 		try {
// 			await deleteInstance({
// 				path: `/whatsapp/instances/${data?._id}`,
// 			}).unwrap();
// 			toast.success('Instance deleted successfully');
// 			removeInstance(data?._id);
// 		} catch (error) {
// 			toast.error(error?.data?.message || 'Failed to delete instance');
// 		} finally {
// 			setDeleteModalOpen(false);
// 		}
// 	};

// 	return (
// 		<Box
// 			bg={cardBg}
// 			rounded='lg'
// 			p={4}
// 			borderWidth='1px'
// 			borderColor={borderColor}
// 			transition='all 0.3s ease'
// 			_hover={{
// 				transform: 'translateY(-2px)',
// 				shadow: 'lg',
// 				borderColor: hoverBorderColor,
// 			}}
// 			shadow='md'
// 			position='relative'
// 			overflow='hidden'
// 		>
// 			{/* WhatsApp accent line */}
// 			<Box
// 				position='absolute'
// 				top={0}
// 				left={0}
// 				h='full'
// 				w='4px'
// 				bg={whatsappGreen}
// 			/>

// 			{/* Header */}
// 			<Flex justify='space-between' align='center' mb={4}>
// 				<Flex gap={2} align='center' flex='1'>
// 					<UserAvatar name={instanceName} size='sm' />
// 					<Box flex='1' maxW='150px' minW={0}>
// 						<Text
// 							fontWeight='bold'
// 							fontSize={{ base: 'xs', md: 'sm' }}
// 							noOfLines={1}
// 							isTruncated
// 							color={textColor}
// 						>
// 							{instanceName}
// 						</Text>
// 					</Box>
// 				</Flex>

// 				{/* Toggle Button (Top Right) */}
// 				<FormControl display='flex' alignItems='center' w='auto'>
// 					<FormLabel
// 						htmlFor={`status-${data?._id}`}
// 						mb='0'
// 						fontSize={{ base: 'xs', md: 'sm' }}
// 						color={secondaryTextColor}
// 					>
// 						{isActive ? 'Active' : 'Disabled'}
// 					</FormLabel>
// 					<Switch
// 						id={`status-${data?._id}`}
// 						isChecked={isActive}
// 						onChange={(e) => updateInstanceStatus(e.target.checked)}
// 						colorScheme='whatsapp'
// 						size='sm'
// 						isDisabled={isUpdating}
// 						transition='all 0.2s ease'
// 					/>
// 				</FormControl>
// 			</Flex>

// 			<Divider borderColor={borderColor} my={3} />

// 			{/* Details */}
// 			<Stack
// 				spacing={3}
// 				fontSize={{ base: 'xs', md: 'sm' }}
// 				color={textColor}
// 				mb={4}
// 			>
// 				<Flex align='center' gap={2} color={secondaryTextColor} mt={1}>
// 					<FaUser size='1em' />
// 					<Text>{user?.fullName}</Text>
// 				</Flex>
// 				<Flex align='center' gap={3}>
// 					<Box color={secondaryTextColor}>
// 						<FaUserTie size='1em' />
// 					</Box>
// 					<Text>
// 						<Text as='span' color={secondaryTextColor}>
// 							Role:{' '}
// 						</Text>
// 						{user?.roles?.[0]?.roleName || user?.role}
// 					</Text>
// 				</Flex>
// 				<Flex align='center' gap={3}>
// 					<Box color={secondaryTextColor}>
// 						<FaCalendarAlt size='1em' />
// 					</Box>
// 					<Text>
// 						<Text as='span' color={secondaryTextColor}>
// 							Created on:{' '}
// 						</Text>
// 						{formatPostDate(createdAt)}
// 					</Text>
// 				</Flex>
// 			</Stack>

// 			{/* Footer: Edit/Delete bottom-left, Chat bottom-right */}
// 			<Flex justify='space-between' align='center'>
// 				<Flex gap={2}>
// 					<IconButton
// 						icon={<FaEdit />}
// 						size='sm'
// 						colorScheme='brand'
// 						variant='solid'
// 						aria-label='Edit'
// 						onClick={onOpen}
// 					/>

// 					<IconButton
// 						icon={<FaTrash />}
// 						size='sm'
// 						colorScheme='red'
// 						variant='solid'
// 						aria-label='Delete'
// 						onClick={() => setDeleteModalOpen(true)}
// 						isDisabled={isDeleting}
// 					/>
// 				</Flex>

// 				<Button
// 					leftIcon={<FaWhatsapp size='1.2em' />}
// 					colorScheme='whatsapp'
// 					bg={whatsappGreen}
// 					_hover={{ bg: whatsappGreen, transform: 'scale(1.02)' }}
// 					_active={{ bg: whatsappGreen }}
// 					rounded='full'
// 					fontSize={{ base: 'sm' }}
// 					px={4}
// 					py={1}
// 					size='sm'
// 					onClick={() => navigate(`/whatsapp/instances/${data?.sessionId}`)}
// 					shadow='md'
// 				>
// 					Chat
// 				</Button>
// 			</Flex>

// 			{/* Optional edit modal */}
// 			{isOpen && (
// 				<CreateInstance
// 					isOpen={isOpen}
// 					onClose={onClose}
// 					instance={data}
// 					updateInstances={updateInstances}
// 					mode='Edit'
// 				/>
// 			)}

// 			{/* Delete Confirmation Modal */}
// 			<ConfirmationModal
// 				isOpen={isDeleteModalOpen}
// 				onClose={() => setDeleteModalOpen(false)}
// 				onConfirm={handleConfirmRemove}
// 				title='Delete Instance'
// 				message={`Are you sure you want to delete '${data?.instanceName}' instance?`}
// 				confirmText='Yes, Delete'
// 				cancelText='Cancel'
// 			/>
// 		</Box>
// 	);
// };

// // const WhatsappUserCard = ({ data, updateInstances }) => {
// // 	const navigate = useNavigate();
// // 	const { user, instanceName, isActive, createdAt } = data || {};

// // 	// Color values based on color mode
// // 	const cardBg = useColorModeValue('#dcf8c6', 'gray.800');
// // 	const whatsappGreen = useColorModeValue('#25D366', '#128C7E');
// // 	const borderColor = useColorModeValue('gray.200', 'gray.700');
// // 	const hoverBorderColor = useColorModeValue('#25D366', '#128C7E');
// // 	const textColor = useColorModeValue('gray.700', 'gray.300');
// // 	const secondaryTextColor = useColorModeValue('gray.500', 'gray.400');

// // 	const [updateInstance, { isLoading }] = useUpdateItemMutation();

// // 	const updateInstanceStatus = async (val) => {
// // 		try {
// // 			await updateInstance({
// // 				path: `/whatsapp/instances/status/${data?._id}`,
// // 				body: { isActive: val },
// // 			}).unwrap();

// // 			toast.success(`Instance ${val ? 'enabled' : 'disabled'} successfully`);

// // 			updateInstances(data?._id, { isActive: val });
// // 		} catch (error) {
// // 			toast.error('Failed to update instance status');
// // 		}
// // 	};

// // 	return (
// // 		<Box
// // 			bg={cardBg}
// // 			rounded='lg'
// // 			p={5}
// // 			borderWidth='1px'
// // 			borderColor={borderColor}
// // 			transition='all 0.3s ease'
// // 			_hover={{
// // 				transform: 'translateY(-2px)',
// // 				shadow: 'lg',
// // 				borderColor: hoverBorderColor,
// // 			}}
// // 			shadow='md'
// // 			position='relative'
// // 			overflow='hidden'
// // 		>
// // 			{/* WhatsApp-themed accent */}
// // 			<Box
// // 				position='absolute'
// // 				top={0}
// // 				left={0}
// // 				h='full'
// // 				w='4px'
// // 				bg={whatsappGreen}
// // 			/>

// // 			{/* Header with instance info + status toggle */}
// // 			<Flex justify='space-between' align='flex-start' mb={4}>
// // 				<Flex gap={4} align='center' flex='1'>
// // 					<UserAvatar name={instanceName} size='md' />
// // 					<Box flex='1' minW={0}>
// // 						<Text
// // 							fontWeight='bold'
// // 							fontSize='xl'
// // 							noOfLines={1}
// // 							color={textColor}
// // 						>
// // 							{instanceName}
// // 						</Text>
// // 						<Flex
// // 							align='center'
// // 							gap={2}
// // 							fontSize='sm'
// // 							color={secondaryTextColor}
// // 							mt={1}
// // 						>
// // 							<FaUser size='1em' />
// // 							<Text>{user?.fullName}</Text>
// // 						</Flex>
// // 					</Box>
// // 				</Flex>

// // 				{/* Status Toggle */}
// // 				<FormControl display='flex' alignItems='center' w='auto'>
// // 					<FormLabel
// // 						htmlFor={`status-${data?._id}`}
// // 						mb='0'
// // 						fontSize='sm'
// // 						color={secondaryTextColor}
// // 					>
// // 						{isActive ? 'Active' : 'Disabled'}
// // 					</FormLabel>
// // 					<Switch
// // 						id={`status-${data?._id}`}
// // 						isChecked={isActive}
// // 						onChange={(e) => updateInstanceStatus(e.target.checked)}
// // 						colorScheme='whatsapp'
// // 						size='md'
// // 						isDisabled={isLoading}
// // 						transition='all 0.2s ease'
// // 					/>
// // 				</FormControl>
// // 			</Flex>

// // 			<Divider borderColor={borderColor} my={3} />

// // 			{/* Details */}
// // 			<Stack spacing={3} fontSize='sm' color={textColor} mb={4}>
// // 				<Flex align='center' gap={3}>
// // 					<Box color={secondaryTextColor}>
// // 						<FaUserTie size='1em' />
// // 					</Box>
// // 					<Text>
// // 						<Text as='span' color={secondaryTextColor}>
// // 							Role:{' '}
// // 						</Text>
// // 						{user?.roles?.[0]?.roleName || user?.role}
// // 					</Text>
// // 				</Flex>
// // 				<Flex align='center' gap={3}>
// // 					<Box color={secondaryTextColor}>
// // 						<FaCalendarAlt size='1em' />
// // 					</Box>
// // 					<Text>
// // 						<Text as='span' color={secondaryTextColor}>
// // 							Member since:{' '}
// // 						</Text>
// // 						{formatPostDate(createdAt)}
// // 					</Text>
// // 				</Flex>
// // 			</Stack>

// // 			{/* Action Button */}
// // 			<Flex justify='flex-end' align='center'>
// // 				<Button
// // 					leftIcon={<FaWhatsapp size='1.2em' />}
// // 					colorScheme='whatsapp'
// // 					bg={whatsappGreen}
// // 					_hover={{ bg: whatsappGreen, transform: 'scale(1.02)' }}
// // 					_active={{ bg: whatsappGreen }}
// // 					size='sm'
// // 					rounded='full'
// // 					px={4}
// // 					onClick={() => navigate(`/whatsapp/${data?.sessionId}`)}
// // 					shadow='md'
// // 				>
// // 					Chat
// // 				</Button>
// // 			</Flex>
// // 		</Box>
// // 	);
// // };

// export default WhatsappUserCard;

import {
	Box,
	Flex,
	Text,
	Stack,
	Button,
	Divider,
	FormControl,
	FormLabel,
	Switch,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	IconButton,
	useDisclosure,
	Tooltip,
	HStack,
	Badge,
} from '@chakra-ui/react';
import {
	FaUser,
	FaUserTie,
	FaCalendarAlt,
	FaWhatsapp,
	FaEllipsisV,
	FaEdit,
	FaTrash,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import UserAvatar from 'components/shared/UserAvatar';
import { formatPostDate } from 'utils/helpers';
import { useUpdateItemMutation, useDeleteItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import CreateInstance from './CreateInstance';
import ConfirmationModal from 'components/Message/ConfirmationModal';
import { useState } from 'react';
import { useModalColors } from 'hooks/useModalColors';

const WhatsappUserCard = ({ data, updateInstances, removeInstance }) => {
	const colors = useModalColors();
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

	const navigate = useNavigate();
	const { user, instanceName, isActive, createdAt } = data || {};

	// WhatsApp brand colors (keeping original)
	const whatsappGreen = '#25D366';
	const whatsappDark = '#128C7E';

	const [updateInstance, { isLoading: isUpdating }] = useUpdateItemMutation();
	const [deleteInstance, { isLoading: isDeleting }] = useDeleteItemMutation();

	const { isOpen, onOpen, onClose } = useDisclosure();

	// Handle instance status toggle
	const updateInstanceStatus = async (val) => {
		try {
			await updateInstance({
				path: `/whatsapp/instances/status/${data?._id}`,
				body: { isActive: val },
			}).unwrap();

			toast.success(`Instance ${val ? 'enabled' : 'disabled'} successfully`);
			updateInstances(data?._id, { isActive: val });
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to update instance status');
		}
	};

	// Handle delete instance
	const handleConfirmRemove = async () => {
		try {
			await deleteInstance({
				path: `/whatsapp/instances/${data?._id}`,
			}).unwrap();
			toast.success('Instance deleted successfully');
			removeInstance(data?._id);
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to delete instance');
		} finally {
			setDeleteModalOpen(false);
		}
	};

	return (
		<Box
			bg={colors.bg}
			rounded='xl'
			p={4}
			borderWidth='1px'
			borderColor={colors.borderColor}
			transition='all 0.3s ease'
			_hover={{
				transform: 'translateY(-4px)',
				boxShadow: colors.modalShadow,
				borderColor: colors.accentGold,
			}}
			boxShadow={colors.cardShadow}
			position='relative'
			overflow='hidden'
		>
			{/* Top accent bar */}
			<Box
				position='absolute'
				top={0}
				left={0}
				right={0}
				h='4px'
				bgGradient={`linear(to-r, ${colors.accentGold}, ${colors.goldLight})`}
			/>

			{/* Status Badge */}
			<Flex justify='flex-end' mb={2}>
				<Badge
					bg={isActive ? colors.badgeSuccessBg : colors.badgeErrorBg}
					color={isActive ? colors.badgeSuccessText : colors.badgeErrorText}
					borderRadius='full'
					px={3}
					py={1}
					fontSize='xs'
				>
					{isActive ? 'Active' : 'Disabled'}
				</Badge>
			</Flex>

			{/* Header */}
			<Flex justify='space-between' align='center' mb={4}>
				<Flex gap={3} align='center' flex='1'>
					<UserAvatar name={instanceName} size='md' />
					<Box flex='1' minW={0}>
						<Text
							fontWeight='bold'
							fontSize={{ base: 'md', md: 'lg' }}
							noOfLines={1}
							isTruncated
							color={colors.headingText}
						>
							{instanceName}
						</Text>
						<Text fontSize='xs' color={colors.mutedText} mt={1}>
							ID: {data?._id?.slice(-8)}
						</Text>
					</Box>
				</Flex>

				{/* Toggle Switch */}
				<FormControl display='flex' alignItems='center' w='auto'>
					<Switch
						id={`status-${data?._id}`}
						isChecked={isActive}
						onChange={(e) => updateInstanceStatus(e.target.checked)}
						colorScheme='yellow'
						size='md'
						isDisabled={isUpdating}
						transition='all 0.2s ease'
					/>
				</FormControl>
			</Flex>

			<Divider borderColor={colors.borderColor} my={3} />

			{/* Details */}
			<Stack spacing={3} fontSize='sm' color={colors.bodyText} mb={4}>
				<Flex align='center' gap={2}>
					<Box boxSize='20px' color={colors.accentGold}>
						<FaUser size='0.9em' />
					</Box>
					<Text>
						<Text as='span' color={colors.mutedText} fontSize='xs'>
							User:{' '}
						</Text>
						{user?.fullName}
					</Text>
				</Flex>
				<Flex align='center' gap={2}>
					<Box boxSize='20px' color={colors.accentGold}>
						<FaUserTie size='0.9em' />
					</Box>
					<Text>
						<Text as='span' color={colors.mutedText} fontSize='xs'>
							Role:{' '}
						</Text>
						{user?.roles?.[0]?.roleName || user?.role}
					</Text>
				</Flex>
				<Flex align='center' gap={2}>
					<Box boxSize='20px' color={colors.accentGold}>
						<FaCalendarAlt size='0.9em' />
					</Box>
					<Text>
						<Text as='span' color={colors.mutedText} fontSize='xs'>
							Created:{' '}
						</Text>
						{formatPostDate(createdAt)}
					</Text>
				</Flex>
			</Stack>

			<Divider borderColor={colors.borderColor} my={3} />

			{/* Footer: Actions */}
			<Flex justify='space-between' align='center' gap={3}>
				<HStack spacing={2}>
					<Tooltip label='Edit Instance' hasArrow>
						<IconButton
							icon={<FaEdit />}
							size='sm'
							variant='ghost'
							aria-label='Edit'
							onClick={onOpen}
							color={colors.bodyText}
							_hover={{ color: colors.accentGold, bg: colors.bgDeep }}
						/>
					</Tooltip>

					<Tooltip label='Delete Instance' hasArrow>
						<IconButton
							icon={<FaTrash />}
							size='sm'
							variant='ghost'
							aria-label='Delete'
							onClick={() => setDeleteModalOpen(true)}
							isDisabled={isDeleting}
							color={colors.badgeErrorText}
							_hover={{ bg: colors.badgeErrorBg, color: colors.badgeErrorText }}
						/>
					</Tooltip>
				</HStack>

				<Button
					leftIcon={<FaWhatsapp size='1.2em' />}
					bg={whatsappGreen}
					color='white'
					_hover={{ bg: whatsappDark, transform: 'scale(1.02)' }}
					_active={{ bg: whatsappDark }}
					rounded='full'
					fontSize='sm'
					px={5}
					py={2}
					size='sm'
					onClick={() => navigate(`/whatsapp/instances/${data?.sessionId}`)}
					boxShadow='sm'
				>
					Chat
				</Button>
			</Flex>

			{/* Optional edit modal */}
			{isOpen && (
				<CreateInstance
					isOpen={isOpen}
					onClose={onClose}
					instance={data}
					updateInstances={updateInstances}
					mode='Edit'
				/>
			)}

			{/* Delete Confirmation Modal */}
			<ConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onConfirm={handleConfirmRemove}
				title='Delete Instance'
				message={`Are you sure you want to delete '${data?.instanceName}' instance?`}
				confirmText='Yes, Delete'
				cancelText='Cancel'
			/>
		</Box>
	);
};

export default WhatsappUserCard;