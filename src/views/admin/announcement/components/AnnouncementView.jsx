import React from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	Button,
	Flex,
	Badge,
	Text,
	Box,
	Tooltip,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import StatusBadge from 'components/shared/StatusBadge';
import { MdAllInbox, MdMarkEmailRead, MdMarkEmailUnread } from 'react-icons/md';
import { useModalColors } from 'hooks/useModalColors';

const AnnouncementView = ({
	item,
	isOpen,
	onClose,
	getBadgeColor,
	handleReadByOpen,
}) => {
	const { headerBg, headerText } = useModalColors();
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='xl'
			isCentered
			motionPreset='slideInBottom'
		>
			<ModalOverlay backdropFilter='blur(2px)' />
			<ModalContent mx='2' borderRadius='xl' boxShadow='xl'>
				<ModalHeader
					display='flex'
					gap='2'
					bg={headerBg}
					color={headerText}
					borderTopRadius='xl'
					py={4}
					alignItems='center'
					w='100%'
				>
					Announcement Details
				</ModalHeader>
				<ModalBody>
					<Flex direction='column' gap={4}>
						{/* Announcement Type */}
						<div>
							<Badge colorScheme={getBadgeColor(item.type)}>{item.type}</Badge>
						</div>

						{/* Announcement Message */}
						<Box
							backgroundColor='gray.100'
							p={3}
							rounded='md'
							width='100%'
							m='0'
							background='brand'
							maxH='200px' // Set max height for the modal body
							overflowY='auto' // Enable vertical scrolling when content exceeds max height
							sx={{
								'&::-webkit-scrollbar': {
									width: '6px', // Custom scrollbar width
								},
								'&::-webkit-scrollbar-thumb': {
									background: 'gray.200', // Custom brand color (adjust according to your theme)
									borderRadius: '8px',
								},
								'&::-webkit-scrollbar-thumb:hover': {
									background: 'gray.300', // Slightly darker on hover
								},
							}}
						>
							<Text fontSize='md' wordBreak='break-word'>
								{item.message}
							</Text>
						</Box>

						{/* Read & Pending Counts */}
						<Flex justify='space-between'>
							<Tooltip label='Read by' hasArrow cursor='pointer'>
								<Button
									bg='transparent'
									_hover='transparent'
									_focus='transparent'
									_active='transparent'
									onClick={handleReadByOpen} // This should set `isOpen` to true for the drawer.
								>
									<StatusBadge
										status={`${item.read_count} Read`}
										color='green'
										Icon={MdMarkEmailRead}
										size={16}
									/>
								</Button>
							</Tooltip>

							<StatusBadge
								status={`${item.unread_count} Pending`}
								color='orange'
								Icon={MdMarkEmailUnread}
								size={16}
							/>
							<StatusBadge
								status={`${item.total_count} Total`}
								color='purple'
								Icon={MdAllInbox}
								size={16}
							/>
						</Flex>

						{/* Created At */}
						<Text fontSize='sm' color='gray.500'>
							{format(new Date(item.createdAt), 'MMM d, yyyy h:mm a')}
						</Text>
					</Flex>
				</ModalBody>

				<ModalFooter>
					<Button onClick={onClose} colorScheme='gray' rounded='md'>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AnnouncementView;
