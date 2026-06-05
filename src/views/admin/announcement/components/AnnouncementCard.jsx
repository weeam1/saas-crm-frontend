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
import { useModalColors } from 'hooks/useModalColors';

const getReadUsers = (users, read_user_list) => {
	const readUserIds = new Set(read_user_list);
	const readUsers = users
		.filter((user) => readUserIds.has(user._id))
		.map((user) => user);

	return readUsers;
};

const AnnouncementCard = ({ users, item, handleCopy }) => {
	const colors = useModalColors();
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
				return 'blue';
			case 'agents':
				return 'white';
			case 'team':
				return 'teal';
			case 'managers':
				return 'yellow';
			default:
				return 'gray';
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
				bg={colors.bgInput}
				borderRadius='md'
				boxShadow='sm'
				border="1px solid"
				borderColor={colors.borderColor}
				_hover={{ bg: colors.bgInputHover, borderColor: colors.accentGold }}
				transition='all 0.2s ease'
			>
				{/* Left Section */}
				<Flex align='center' justifyContent='space-between' gap={4}>
					<Flex flex={1} align='center' gap={2}>
						<Text
							flex='1'
							maxWidth={{ sm: '200px', md: '600px', lg: '800px' }}
							isTruncated
							fontWeight='medium'
							color={colors.headingText}
						>
							{item.message}
						</Text>
					</Flex>

					<Flex align='center' gap={1}>
						<Tooltip label='Copy message' hasArrow>
							<IconButton
								aria-label='Copy message'
								icon={<FiCopy />}
								size='sm'
								variant='ghost'
								onClick={() => handleCopy(item.message)}
								color={colors.bodyText}
								_hover={{
									color: colors.accentGold,
									bg: colors.secondaryBtnHoverBg,
								}}
								transition='all 0.2s ease'
							/>
						</Tooltip>
						<Tooltip label='View message' hasArrow>
							<IconButton
								aria-label='View message'
								icon={<FiEye />}
								size='sm'
								variant='ghost'
								onClick={onOpen}
								color={colors.bodyText}
								_hover={{
									color: colors.accentGold,
									bg: colors.secondaryBtnHoverBg,
								}}
								transition='all 0.2s ease'
							/>
						</Tooltip>
					</Flex>
				</Flex>

				{/* Right Section */}
				<Flex align='center' justifyContent='space-between' wrap='wrap' gap={4}>
					<Flex align='center' gap={4}>
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

					<Text fontSize='sm' color={colors.mutedText}>
						{format(new Date(item.createdAt), 'MMM d, yyyy h:mm a')}
					</Text>
				</Flex>
			</Flex>

			{isOpen && (
				<AnnouncementView
					item={item}
					isOpen={isOpen}
					onClose={onClose}
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