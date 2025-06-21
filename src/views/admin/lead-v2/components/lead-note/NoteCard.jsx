import {
	Box,
	GridItem,
	Text,
	IconButton,
	Avatar,
	HStack,
	Flex,
	Divider,
} from '@chakra-ui/react';
import ConfirmationModal from 'components/Message/ConfirmationModal';
import { constant } from 'constant';
import { useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { formatPostDate } from 'utils/helpers';
import NoteBody from './NoteBody';
import CustomTooltip from 'components/shared/CustomTooltip';

const NoteCard = ({ id, note, onEdit, onDelete }) => {
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

	const user = JSON.parse(localStorage.getItem('user'));

	const handleConfirmRemove = async () => {
		await onDelete(note);
		setDeleteModalOpen(false);
	};

	return (
		<>
			<GridItem key={id}>
				<Box
					bg='whitesmoke'
					borderRadius='lg'
					p={{ base: 2, md: 4 }}
					// h='100%'
					shadow='sm'
				>
					{/* Header */}
					<Flex justify='space-between' align='flex-start' mb={2}>
						<HStack align='center'>
							<Avatar
								src={
									note.addedBy?.profileImage
										? `${constant.baseUrl}${note.addedBy.profileImage}`
										: undefined
								}
								name={note.addedBy?.fullName ?? 'User'}
								boxSize={{ base: '40px', md: '50px' }}
								bg='brand.200'
								color='gray.800'
								imgProps={{
									loading: 'lazy',
									referrerPolicy: 'no-referrer',
									style: {
										objectFit: 'cover',
										imageRendering: 'auto',
									},
								}}
							/>
							<Box>
								<Text
									fontWeight='semibold'
									fontSize={{ base: 'sm', md: 'md' }}
									noOfLines={1}
								>
									{note.addedBy?.fullName}
								</Text>
								<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500'>
									{formatPostDate(new Date(note?.createdAt))}
								</Text>
							</Box>
						</HStack>
						{user?.role === 'superAdmin' && (
							<Box display='flex' gap={1}>
								<IconButton
									aria-label='Edit Note'
									icon={<FiEdit />}
									size='sm'
									variant='ghost'
									onClick={() => onEdit(note)}
								/>

								<IconButton
									aria-label='Delete Note'
									icon={<FiTrash2 />}
									size='sm'
									variant='ghost'
									onClick={() => setDeleteModalOpen(true)}
								/>
							</Box>
						)}
					</Flex>

					{/* Note Body */}
					{/* <Box overflowY='auto' maxH='200px' p='1'>
						<Text
							as='pre'
							// fontWeight='semibold'
							whiteSpace='pre-wrap'
							overflowWrap='break-word'
							wordBreak='break-word'
							color='gray.600'
							fontFamily='DM Sans, sans-serif'
						>
							{note?.note}
						</Text>
					</Box> */}

					<Divider color='gray.600' />
					<NoteBody text={note?.note} />
				</Box>
			</GridItem>

			{isDeleteModalOpen && (
				<ConfirmationModal
					isOpen={isDeleteModalOpen}
					onClose={() => {
						setDeleteModalOpen(false);
					}}
					onConfirm={handleConfirmRemove}
					title='Remove Lead Note'
					message='Are you sure you want to remove the lead note?'
					confirmText='Yes, Remove'
					cancelText='Cancel'
				/>
			)}
		</>
	);
};

export default NoteCard;
