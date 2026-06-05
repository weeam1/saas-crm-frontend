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
	const colors = useModalColors();

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='xl'
			isCentered
			motionPreset='slideInBottom'
		>
			<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(2px)' />
			<ModalContent mx='2' borderRadius='xl' boxShadow={colors.modalShadow} bg={colors.viewBg}>
				<ModalHeader
					display='flex'
					gap='2'
					bg={colors.viewHeaderBg}
					color={colors.viewHeaderText}
					borderBottom={`1px solid ${colors.viewHeaderBorder}`}
					borderTopRadius='xl'
					py={4}
					px={6}
					alignItems='center'
					w='100%'
				>
					Announcement Details
				</ModalHeader>
				<ModalBody bg={colors.viewBg} width='100%' p={4}>
					<Flex direction='column' gap={4}>
						{/* Announcement Type */}
						<div>
							<Badge
								bg={`rgba(212, 175, 55, 0.15)`}
								color={colors.accentGold}
								px={2}
								py={1}
								borderRadius='full'
								textTransform='capitalize'
							>
								{item.type}
							</Badge>
						</div>

						{/* Announcement Message */}
						<Box
							bg={colors.bgInput}
							p={3}
							rounded='md'
							width='100%'
							m='0'
							maxH='200px'
							overflowY='auto'
							border="1px solid"
							borderColor={colors.borderColor}
							sx={{
								'&::-webkit-scrollbar': {
									width: '6px',
								},
								'&::-webkit-scrollbar-thumb': {
									background: colors.accentGold,
									borderRadius: '8px',
								},
								'&::-webkit-scrollbar-thumb:hover': {
									background: colors.goldLight,
								},
							}}
						>
							<Text fontSize='md' wordBreak='break-word' color={colors.bodyText}>
								{item.message}
							</Text>
						</Box>

						{/* Read & Pending Counts */}
						<Flex justify='space-between'>
							<Tooltip label='Read by' hasArrow cursor='pointer'>
								<Button
									bg='transparent'
									p={0}
									h='auto'
									_hover={{ bg: 'transparent' }}
									_focus={{ bg: 'transparent' }}
									_active={{ bg: 'transparent' }}
									onClick={handleReadByOpen}
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
								color='gold'
								Icon={MdAllInbox}
								size={16}
							/>
						</Flex>

						{/* Created At */}
						<Text fontSize='sm' color={colors.mutedText}>
							{format(new Date(item.createdAt), 'MMM d, yyyy h:mm a')}
						</Text>
					</Flex>
				</ModalBody>

				<ModalFooter
					bg={colors.viewFooterBg}
					borderTop={`1px solid ${colors.viewFooterBorder}`}
					py={3}
					px={6}
				>
					<Button
						onClick={onClose}
						rounded='md'
						variant='ghost'
						color={colors.bodyText}
						_hover={{
							bg: colors.secondaryBtnHoverBg,
							color: colors.headingText,
						}}
					>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AnnouncementView;