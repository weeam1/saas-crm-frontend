import { Box, Text, Icon, useDisclosure } from '@chakra-ui/react';
import { FaBell, FaBullhorn } from 'react-icons/fa'; // React icon for announcements
import { format } from 'date-fns'; // For formatting date and time
import NotificationView from './NotificationView';
import { MdEventAvailable } from 'react-icons/md';
import { useEffect, useState } from 'react';

const NotificationBox = ({ notification }) => {
	const { type, message, created_at } = notification;
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [messageType, setMessageType] = useState('notification');

	useEffect(() => {
		if (type === 1) {
			setMessageType('announcement');
		} else if (type === 2) {
			setMessageType('invite');
		}
	}, [type]);

	const getIconProps = () => {
		if (messageType === 'announcement') {
			return { icon: FaBullhorn, bg: 'brand.500', title: 'Announcement' };
		} else if (messageType === 'invite') {
			return {
				icon: MdEventAvailable,
				bg: 'green.500',
				title: 'Interview Invite',
			};
		} else {
			return {
				icon: FaBell,
				bg: 'rgba(40, 167, 69, 0.7)',
				title: 'Notification',
			};
		}
	};

	const { icon, bg, title } = getIconProps();
	// const isNotification = type === 0;
	// const formattedDate = format(new Date(created_at), "PPP p"); // Format: Jan 8, 2025 11:49 AM
	const formattedDate = format(new Date(created_at), 'MMM d, yyyy h:mm a');

	return (
		<>
			<Box
				onClick={onOpen}
				p={2}
				borderRadius='md'
				display='flex'
				alignItems='center'
				gap={3}
				border='none'
				outline='none'
				cursor='pointer'
				transition='background 0.3s ease, box-shadow 0.3s ease' // Smooth transition for hover effects
			>
				{/* Icon */}
				<Box
					bg={bg}
					borderRadius='full'
					p={1}
					boxSize={10}
					display='flex'
					alignItems='center'
					justifyContent='center'
					title={title}
				>
					<Icon as={icon} boxSize={6} color='white' />
				</Box>

				{/* Message Details */}
				<Box flex='1'>
					<Text
						fontSize='sm'
						width={{ sm: '150px', md: '250px' }}
						color='gray.700'
						lineHeight='1.2'
						style={{
							overflow: 'hidden',
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
						}}
					>
						{message}
					</Text>

					<Text fontSize='xs' color='gray.800' mt={1}>
						{formattedDate}
					</Text>
				</Box>
			</Box>

			<NotificationView
				title={title}
				item={notification}
				type={messageType}
				isOpen={isOpen}
				onClose={onClose}
			/>
		</>
	);
};

export default NotificationBox;
