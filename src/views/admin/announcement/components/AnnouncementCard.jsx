import React, { useState } from 'react';
import {
	Flex,
	IconButton,
	Badge,
	Text,
	useColorModeValue,
	useDisclosure,
	Button,
	Tooltip,
} from '@chakra-ui/react';
import { FiCopy, FiEye } from 'react-icons/fi';
import { MdMarkEmailUnread, MdMarkEmailRead, MdAllInbox } from 'react-icons/md';
import { format } from 'date-fns';
import AnnouncementView from './AnnouncementView';
import StatusBadge from 'components/shared/StatusBadge';
import ReadByModal from './ReadByModal';

const getReadUsers = (users, read_user_list) => {
	const readUserIds = new Set(read_user_list);
	const readUsers = users
		.filter((user) => readUserIds.has(user._id))
		.map((user) => user);

	return readUsers;
};

const AnnouncementCard = ({ users, item, handleCopy }) => {
	const [readByUsers, setByReadUsers] = useState([]);

	const { isOpen, onOpen, onClose } = useDisclosure();

	const {
		isOpen: isReadOpen,
		onOpen: readOnOpen,
		onClose: readOnClose,
	} = useDisclosure();

	const getBadgeColor = (type) => {
		switch (type) {
			case 'all':
				return 'blue'; // Neutral color for "all"
			case 'agents':
				return 'white'; // Blue for "agents"
			case 'team':
				return 'teal'; // Green for "team"
			case 'managers':
				return 'yellow'; // Purple for "managers"
			default:
				return 'gray'; // Default color
		}
	};

	const handleReadByOpen = () => {
		setByReadUsers(getReadUsers(users, item.read_user_list));

		readOnOpen();
	};

	return (
		<>
			<Flex
				justify='space-between'
				flexDirection='column'
				wrap='wrap'
				gap='2'
				p={4}
				mb={2}
				bg={useColorModeValue('gray.100', 'gray.700')}
				borderRadius='md'
				boxShadow='sm'
				_hover={{ bg: useColorModeValue('gray.50', 'gray.600') }}
			>
				{/* Left Section */}
				<Flex align='center' justifyContent='space-between' gap={4}>
					<Flex flex={1} align='center' gap={2}>
						<Badge colorScheme={getBadgeColor(item.type)}>{item.type}</Badge>

						<Text
							flex='1'
							maxWidth={{ sm: '200px', md: '600px', lg: '800px' }}
							isTruncated
							fontWeight='medium'
						>
							{item.message}
						</Text>
					</Flex>

					<Flex align='center' gap={1}>
						<IconButton
							aria-label='Copy message'
							icon={<FiCopy />}
							size='sm'
							color='teal.500'
							_hover={{ color: 'teal.600', bg: 'teal.50' }}
							variant='ghost'
							onClick={() => handleCopy(item.message)}
						/>
						<IconButton
							aria-label='View message'
							icon={<FiEye />}
							size='sm'
							color='blue.500'
							_hover={{ color: 'blue.600', bg: 'blue.50' }}
							variant='ghost'
							onClick={onOpen}
						/>
					</Flex>
				</Flex>

				{/* Right Section */}
				<Flex align='center' justifyContent='space-between' wrap='wrap' gap={4}>
					<Flex align='center' gap={4}>
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
							status={`${item.pending_count} Pending`}
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

					{/* Formatted Date */}
					<Text fontSize='sm' color='gray.500'>
						{format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}
						{/* {format(new Date(item.created_at), "PPPpp")} */}
					</Text>
				</Flex>
			</Flex>

			{isOpen && (
				<AnnouncementView
					item={item}
					isOpen={isOpen}
					onClose={onClose}
					// isReadOpen={isReadOpen}
					// readOnClose={readOnClose}
					handleReadByOpen={handleReadByOpen}
					getBadgeColor={getBadgeColor}
				/>
			)}

			{isReadOpen && readByUsers && (
				<ReadByModal
					isOpen={isReadOpen}
					onClose={readOnClose}
					readByUsers={readByUsers}
				/>
			)}
		</>
	);
};

export default AnnouncementCard;
