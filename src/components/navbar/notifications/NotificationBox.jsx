import { Box, Text, Icon, useDisclosure } from '@chakra-ui/react';
import { FaBell, FaBullhorn } from 'react-icons/fa'; // React icon for announcements
import { format } from 'date-fns'; // For formatting date and time
import NotificationView from './NotificationView';
import { MdEventAvailable } from 'react-icons/md';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readLeadNotification } from 'api';
import { useDispatch } from 'react-redux';
import { newNotifyItem } from './../../../redux/webSocketReducer';

const NotificationBox = ({ notification, users }) => {
	const { type, created_at } = notification;
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [messageType, setMessageType] = useState('notification');
	const [message, setMessage] = useState('');

	let i = 1;
	const getSender = useCallback(
		(sender_id) => {
			console.log('call: ', i++, sender_id);
			return users.find((user) => user._id === sender_id);
		},
		[users]
	);

	useEffect(() => {
		let messageType = '';
		let message = '';

		switch (type) {
			case 1:
				messageType = 'announcement';
				message = notification?.message;
				break;

			case 2:
				messageType = 'invite';
				message = notification?.message;
				break;

			case 0:
				const sender_id = notification?.sender_id;
				const sender = getSender(sender_id);

				messageType = 'notification';
				message = `The lead '${notification?.lead_name}' has been assigned ${
					sender?.fullName ? `by the ${sender.fullName}` : ''
				}.`;
				break;

			default:
				return;
		}

		setMessageType(messageType);
		setMessage(message);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		type,
		notification?.sender_id,
		notification?.lead_name,
		notification?.message,
	]);

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
	const formattedDate = format(new Date(created_at), ' h:mm a MMM d, yyyy');

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleNotificationOpen = () => {
		if (type === 1 || type === 2) {
			return onOpen();
		}

		if (type === 0) {
			if (!notification) return;

			const { id, sent, lead_id } = notification;

			if (sent === 0) {
				readLeadNotification(id);
				// fetchNotifications();
				dispatch(newNotifyItem({ type: messageType, message }));
			}

			navigate(`/lead?page=1&pageSize=1&lead=${lead_id}`);
			console.log(notification, sent === 0);
		}
	};

	return (
		<>
			<Box
				onClick={handleNotificationOpen}
				p={2}
				borderRadius='md'
				display='flex'
				alignItems='center'
				gap={3}
				bg={type === 0 && notification?.sent === 0 && 'green.100'}
				border='none'
				outline='none'
				cursor='pointer'
				transition='background 0.3s ease, box-shadow 0.3s ease'
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

			{isOpen && (
				<NotificationView
					title={title}
					item={notification}
					type={messageType}
					isOpen={isOpen}
					onClose={onClose}
				/>
			)}
		</>
	);
};

export default NotificationBox;
