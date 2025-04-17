import { Box, GridItem, Text, IconButton } from '@chakra-ui/react';
import ConfirmationModal from 'components/Message/ConfirmationModal';
import { format } from 'date-fns';
import { useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const NoteCard = ({ id, note, onEdit, onDelete }) => {
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

	const user = JSON.parse(localStorage.getItem('user'));

	const handleConfirmRemove = async () => {
		await onDelete(note);
		setDeleteModalOpen(false);
	};

	return (
		<>
			<GridItem key={id} colSpan={{ base: 12, md: 6, lg: 6 }}>
				<Box
					bg='whitesmoke'
					borderRadius='10px'
					p={4}
					m={1}
					h='100%'
					position='relative'
					boxShadow='sm'
					_hover={{ boxShadow: 'md' }}
				>
					{/* Header: Name + Timestamp + Actions */}
					<Box
						display='flex'
						justifyContent='space-between'
						alignItems='flex-start'
						mb={2}
					>
						<Box>
							<Text fontWeight='bold' color='black'>
								{note.addedBy?.firstName + ' ' + note.addedBy?.lastName}
							</Text>
							<Text fontSize='13px' color='gray.600'>
								{format(new Date(note?.createdAt), 'MMM d, yyyy h:mm a')}
							</Text>
						</Box>

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
					</Box>

					{/* Note Body */}
					<Box overflowY='auto' maxH='200px'>
						<Text
							as='pre'
							fontWeight='semibold'
							whiteSpace='pre-wrap'
							overflowWrap='break-word'
							wordBreak='break-word'
							color='black'
						>
							{note?.note}
						</Text>
					</Box>
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
