// import React, { useState } from 'react';
// import {
// 	Box,
// 	Flex,
// 	VStack,
// 	IconButton,
// 	Text,
// 	Divider,
// 	Tooltip,
// } from '@chakra-ui/react';
// import DeleteIconSvg from '../../../../assets/img/bankaccount/Vector.png';
// import EditIconSvg from '../../../../assets/img/bankaccount/ic_baseline-edit.png';
// import EditAccountModal from './EditModal';
// import DeleteConfirmationModal from './DeletePopup';

// const AccountCard = ({
// 	account,
// 	onUpdate,
// 	onDelete,
// 	isUpdating,
// 	isDeleting,
// }) => {
// 	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

// 	const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);
// 	const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

// 	const handleConfirmDelete = async () => {
// 		await onDelete(account._id);
// 		handleCloseDeleteModal();
// 	};

// 	return (
// 		<Box
// 			w='100%'
// 			minH={{ base: 'auto', md: '320px' }}
// 			p={{ base: 4, md: 6 }}
// 			borderWidth='1px'
// 			borderColor='#E2E8F0'
// 			borderRadius='16px'
// 			boxShadow='md'
// 			position='relative'
// 			bg='white'
// 			transition='transform 0.2s'
// 			_hover={{ boxShadow: 'lg' }}
// 			overflow='hidden'
// 		>
// 			<Flex position='absolute' top={4} right={4} alignItems='center' gap={2}>
// 				<EditAccountModal
// 					account={account}
// 					onUpdate={onUpdate}
// 					isUpdating={isUpdating}
// 				>
// 					<Tooltip label='Edit' hasArrow>
// 						<IconButton
// 							icon={
// 								<img
// 									src={EditIconSvg}
// 									alt='Edit'
// 									style={{ width: 22, height: 22 }}
// 								/>
// 							}
// 							size='md'
// 							variant='ghost'
// 							aria-label='Edit account'
// 							isDisabled={isUpdating || isDeleting}
// 						/>
// 					</Tooltip>
// 				</EditAccountModal>

// 				<Tooltip label='Delete' hasArrow>
// 					<IconButton
// 						icon={
// 							<img
// 								src={DeleteIconSvg}
// 								color='#B79045'
// 								alt='Delete'
// 								style={{ width: 22, height: 22 }}
// 							/>
// 						}
// 						size='md'
// 						variant='ghost'
// 						onClick={handleOpenDeleteModal}
// 						aria-label='Delete account'
// 						isDisabled={isUpdating || isDeleting}
// 					/>
// 				</Tooltip>
// 			</Flex>

// 			<VStack align='start' w='100%' spacing={{ base: 3, md: 4 }}>
// 				<Box>
// 					<Text
// 						fontWeight='medium'
// 						color='#605F5F'
// 						fontSize={{ base: '12px', md: '14px' }}
// 						fontFamily='DM Sans'
// 					>
// 						Account Name
// 					</Text>
// 					<Text
// 						color='#B79045'
// 						fontSize={{ base: '16px', md: '20px' }}
// 						fontWeight='bold'
// 						fontFamily='DM Sans'
// 					>
// 						{account.account_holder_name || 'N/A'}
// 					</Text>
// 				</Box>

// 				<Divider borderColor='#D8D8D8' borderWidth='1px' />

// 				<Flex
// 					w='100%'
// 					gap={{ base: 4, md: 6 }}
// 					direction={{ base: 'column', md: 'row', lg: 'row' }}
// 				>
// 					<Flex flex='1' direction='column'>
// 						<Text
// 							fontWeight='medium'
// 							color='#464646'
// 							fontSize={{ base: '12px', md: '14px' }}
// 							fontFamily='DM Sans'
// 						>
// 							Account Number
// 						</Text>
// 						<Text
// 							color='#000'
// 							fontSize={{ base: '14px', md: '16px' }}
// 							fontWeight='bold'
// 							fontFamily='DM Sans'
// 							wordBreak='break-all'
// 						>
// 							{account.account_number || 'N/A'}
// 						</Text>
// 					</Flex>

// 					<Flex flex='1' direction='column'>
// 						<Text
// 							fontWeight='medium'
// 							color='#464646'
// 							fontSize={{ base: '12px', md: '14px' }}
// 							fontFamily='DM Sans'
// 						>
// 							IBAN
// 						</Text>
// 						<Text
// 							color='#000'
// 							fontSize={{ base: '14px', md: '16px' }}
// 							fontWeight='bold'
// 							fontFamily='DM Sans'
// 							wordBreak='break-all'
// 						>
// 							{account.iban || 'N/A'}
// 						</Text>
// 					</Flex>
// 				</Flex>

// 				<Flex
// 					w='100%'
// 					gap={{ base: 4, md: 6 }}
// 					direction={{ base: 'column', md: 'row', lg: 'row' }}
// 				>
// 					<Flex flex='1' direction='column'>
// 						<Text
// 							fontWeight='medium'
// 							color='#464646'
// 							fontSize={{ base: '12px', md: '14px' }}
// 							fontFamily='DM Sans'
// 						>
// 							Swift Code
// 						</Text>
// 						<Text
// 							color='#000'
// 							fontSize={{ base: '14px', md: '16px' }}
// 							fontWeight='bold'
// 							fontFamily='DM Sans'
// 							wordBreak='break-all'
// 						>
// 							{account.swift_code || 'N/A'}
// 						</Text>
// 					</Flex>

// 					<Flex flex='1' direction='column'>
// 						<Text
// 							fontWeight='medium'
// 							color='#464646'
// 							fontSize={{ base: '12px', md: '14px' }}
// 							fontFamily='DM Sans'
// 						>
// 							Bank
// 						</Text>
// 						<Text
// 							color='#000'
// 							fontSize={{ base: '14px', md: '16px' }}
// 							fontWeight='bold'
// 							fontFamily='DM Sans'
// 						>
// 							{account.bank_name || 'N/A'}
// 						</Text>
// 					</Flex>
// 				</Flex>

// 				<Flex direction='column' w='100%'>
// 					<Text
// 						fontWeight='medium'
// 						color='#464646'
// 						fontSize={{ base: '12px', md: '14px' }}
// 						fontFamily='DM Sans'
// 					>
// 						Bank Address
// 					</Text>
// 					<Text
// 						color='#000'
// 						fontSize={{ base: '14px', md: '16px' }}
// 						fontWeight='bold'
// 						fontFamily='DM Sans'
// 						wordBreak='break-word'
// 					>
// 						{account.branch_address || 'N/A'}
// 					</Text>
// 				</Flex>
// 				{/* <Flex flex="1" direction="column">
//           <Text
//             fontWeight="medium"
//             color="#464646"
//             fontSize={{ base: "12px", md: "14px" }}
//             fontFamily="DM Sans"
//           >
//             Developer email
//           </Text>
//           <Text
//             color="#000"
//             fontSize={{ base: "14px", md: "16px" }}
//             fontWeight="bold"
//             fontFamily="DM Sans"
//           >
//             {account.developer_id?.email || "N/A"}
//           </Text>
//         </Flex> */}
// 			</VStack>

// 			<DeleteConfirmationModal
// 				isOpen={isDeleteModalOpen}
// 				onClose={handleCloseDeleteModal}
// 				onConfirm={handleConfirmDelete}
// 				itemName={account.account_holder_name}
// 				isDeleting={isDeleting}
// 			/>
// 		</Box>
// 	);
// };

// export default AccountCard;

import React, { useState } from 'react';
import {
	Box,
	Flex,
	VStack,
	IconButton,
	Text,
	Divider,
	Tooltip,
	Badge,
	HStack,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import EditAccountModal from './EditModal';
import DeleteConfirmationModal from './DeletePopup';

const AccountCard = ({
	account,
	onUpdate,
	onDelete,
	isUpdating,
	isDeleting,
}) => {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);
	const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

	const handleConfirmDelete = async () => {
		await onDelete(account._id);
		handleCloseDeleteModal();
	};

	// Get bank initial for avatar
	const getBankInitial = () => {
		return account.bank_name?.charAt(0)?.toUpperCase() || 'B';
	};

	return (
		<Box
			w='100%'
			minH={{ base: 'auto', md: '320px' }}
			p={{ base: 4, md: 5 }}
			borderWidth='1px'
			borderColor='border.default'
			borderRadius='xl'
			boxShadow='card'
			position='relative'
			bg='bg.surface'
			transition='all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
			_hover={{
				boxShadow: 'goldGlow',
				borderColor: 'gold.primary',
				transform: 'translateY(-4px)',
			}}
			overflow='hidden'
		>
			{/* Decorative gradient bar at top */}
			<Box
				position='absolute'
				top='0'
				left='0'
				right='0'
				h='3px'
				bgGradient='linear-gradient(90deg, #D4AF37, #F5D67B, #D4AF37)'
			/>

			{/* Action Buttons */}
			<Flex position='absolute' top={4} right={4} alignItems='center' gap={2}>
				<EditAccountModal
					account={account}
					onUpdate={onUpdate}
					isUpdating={isUpdating}
				>
					<Tooltip label='Edit Account' placement='top' hasArrow>
						<IconButton
							icon={<EditIcon />}
							size='sm'
							variant='ghost'
							aria-label='Edit account'
							isDisabled={isUpdating || isDeleting}
							color='text.accent'
							_hover={{
								color: 'gold.primary',
								bg: 'rgba(212, 175, 55, 0.1)',
								transform: 'scale(1.05)',
							}}
							transition='all 0.2s'
						/>
					</Tooltip>
				</EditAccountModal>

				<Tooltip label='Delete Account' placement='top' hasArrow>
					<IconButton
						icon={<DeleteIcon />}
						size='sm'
						variant='ghost'
						onClick={handleOpenDeleteModal}
						aria-label='Delete account'
						isDisabled={isUpdating || isDeleting}
						color='red.400'
						_hover={{
							color: 'red.300',
							bg: 'rgba(245, 101, 101, 0.1)',
							transform: 'scale(1.05)',
						}}
						transition='all 0.2s'
					/>
				</Tooltip>
			</Flex>

			<VStack align='stretch' w='100%' spacing={{ base: 4, md: 5 }}>
				{/* Bank Header with Icon */}
				<Flex align='center' gap={3}>
					<Flex
						w='48px'
						h='48px'
						bg='rgba(58, 223, 36, 0.3)'
						borderRadius='xl'
						align='center'
						justify='center'
						border='1px solid'
						borderColor='rgba(58, 223, 36, 0.4)'
					>
						<Text fontSize='20px' fontWeight='bold' color='gold.primary'>
							{getBankInitial()}
						</Text>
					</Flex>

					<Box flex='1'>
						<Text
							fontSize='xs'
							color='text.muted'
							fontWeight='medium'
							textTransform='uppercase'
							letterSpacing='wide'
							mb={0.5}
						>
							Account Holder
						</Text>
						<Text
							fontSize={{ base: 'lg', md: 'xl' }}
							fontWeight='bold'
							color='text.heading'
							lineHeight='1.3'
						>
							{account.account_holder_name || 'N/A'}
						</Text>
					</Box>
				</Flex>

				<Divider borderColor='border.subtle' />

				{/* Account Details Grid */}
				<Flex
					w='100%'
					gap={{ base: 4, md: 6 }}
					direction={{ base: 'column', sm: 'row' }}
				>
					<Flex flex='1' direction='column'>
						<Text
							fontSize='xs'
							color='text.muted'
							fontWeight='medium'
							textTransform='uppercase'
							letterSpacing='wide'
							mb={1}
						>
							Account Number
						</Text>
						<Text
							color='text.white'
							fontSize={{ base: 'sm', md: 'md' }}
							fontWeight='semibold'
							fontFamily='mono'
							wordBreak='break-all'
						>
							{account.account_number || 'N/A'}
						</Text>
					</Flex>

					<Flex flex='1' direction='column'>
						<Text
							fontSize='xs'
							color='text.muted'
							fontWeight='medium'
							textTransform='uppercase'
							letterSpacing='wide'
							mb={1}
						>
							IBAN
						</Text>
						<Text
							color='text.white'
							fontSize={{ base: 'sm', md: 'md' }}
							fontWeight='semibold'
							fontFamily='mono'
							wordBreak='break-all'
						>
							{account.iban || 'N/A'}
						</Text>
					</Flex>
				</Flex>

				<Flex
					w='100%'
					gap={{ base: 4, md: 6 }}
					direction={{ base: 'column', sm: 'row' }}
				>
					<Flex flex='1' direction='column'>
						<Text
							fontSize='xs'
							color='text.muted'
							fontWeight='medium'
							textTransform='uppercase'
							letterSpacing='wide'
							mb={1}
						>
							Swift Code
						</Text>
						<Text
							color='text.white'
							fontSize={{ base: 'sm', md: 'md' }}
							fontWeight='semibold'
							fontFamily='mono'
							wordBreak='break-all'
						>
							{account.swift_code || 'N/A'}
						</Text>
					</Flex>

					<Flex flex='1' direction='column'>
						<Text
							fontSize='xs'
							color='text.muted'
							fontWeight='medium'
							textTransform='uppercase'
							letterSpacing='wide'
							mb={1}
						>
							Bank Name
						</Text>
						<HStack spacing={2}>
							<Text
								color='text.accent'
								fontSize={{ base: 'sm', md: 'md' }}
								fontWeight='semibold'
							>
								{account.bank_name || 'N/A'}
							</Text>
							{account.is_primary && (
								<Badge
									variant='gold'
									fontSize='9px'
									px={2}
									py={0.5}
									borderRadius='full'
								>
									Primary
								</Badge>
							)}
						</HStack>
					</Flex>
				</Flex>

				{/* Bank Address */}
				<Flex direction='column'>
					<Text
						fontSize='xs'
						color='text.muted'
						fontWeight='medium'
						textTransform='uppercase'
						letterSpacing='wide'
						mb={1}
					>
						Bank Address
					</Text>
					<Text
						color='text.white'
						fontSize={{ base: 'sm', md: 'md' }}
						noOfLines={2}
					>
						{account.branch_address || 'N/A'}
					</Text>
				</Flex>

				{/* Created Date */}
				{account.createdAt && (
					<Text fontSize='sm' color='text.white' pt={1}>
						Added on {new Date(account.createdAt).toLocaleDateString()}
					</Text>
				)}
			</VStack>

			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={handleCloseDeleteModal}
				onConfirm={handleConfirmDelete}
				itemName={account.account_holder_name}
				isDeleting={isDeleting}
			/>
		</Box>
	);
};

export default AccountCard;
