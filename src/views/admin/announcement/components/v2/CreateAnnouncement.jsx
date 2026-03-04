import {
	Box,
	Text,
	Textarea,
	Button,
	useRadioGroup,
	HStack,
	Icon,
	Flex,
	Alert,
	AlertIcon,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import keys from 'config/keys';

import RadioCard from './RadioCard';
import { MdAnnouncement, MdSend } from 'react-icons/md';
import MessageSuccessModal from './MessageSuccessModal';
import SelectManager from './SelectManager';
import { buttonStyle } from 'utils/btn';
import { HiSpeakerphone } from 'react-icons/hi';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import { usePermissions } from 'hooks/usePermissions';
import useUserSession from 'hooks/useUserSession';
import { useRoles } from 'hooks/user/userRoles';

const CreateAnnouncement = () => {
	const { user } = useUserSession();

	const { team } = useTeamStructure();
	const { roles } = useRoles();

	const { createUserLog } = useUserActivityLog();
	const { hasPermission } = usePermissions();

	// Set roles
	const isManager = user?.roles[0]?.roleName === 'Manager';
	const isSuperAdmin = user.role === 'superAdmin';

	const [message, setMessage] = useState('');
	const [selectedRole, setSelectedRole] = useState('');
	const [receiverIds, setReceiverIds] = useState([]);

	const [selectedManager, setSelectedManager] = useState(null);
	const [loading, setLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [onlineUsers, setOnlineUsers] = useState(0);
	const [offlineUsers, setOfflineUsers] = useState(0);

	const handleRoleChange = (selectedRole) => {
		try {
			setSelectedRole(selectedRole);
			setSelectedManager(null);

			let newReceiverIds = [];

			switch (selectedRole) {
				case 'managers':
					newReceiverIds = managers.map((manager) => manager._id); // Extract manager IDs
					break;

				case 'agents':
					newReceiverIds = agents.map((agent) => agent._id); // Extract agent IDs
					break;

				case 'all':
					newReceiverIds = allUsers
						.filter((userItem) => user._id !== userItem._id) // Exclude the current user
						.map((userItem) => userItem._id); // Extract all user IDs
					break;

				default:
					return;
			}

			setReceiverIds(newReceiverIds); // Update state with new receiver IDs
		} catch (error) {
			console.error('Failed to handle role change:', error);
			toast.error('An error occurred while processing the role change.');
		}
	};

	const handleManager = async (e) => {
		const selectedValue = e.target.value;
		setSelectedManager(selectedValue);
		setSelectedRole('team');

		// Reset receiverIds to an empty array before making any updates
		setReceiverIds([]);
		fetchMangerAgents(selectedValue);
		const managerReceiverIds = managers?.map((manager) => manager._id);

		setReceiverIds(managerReceiverIds); // Set all manager IDs
	};

	const handleSend = async (e) => {
		e.preventDefault();
		if (message.trim()) {
			try {
				setLoading(true);
				setOnlineUsers(0);
				setOfflineUsers(0);

				if (receiverIds.length > 0 || isManager) {
					const announcementData = {
						message,
						receiver_ids: receiverIds,
						user_id: user._id,
						type: selectedRole,
					};

					const { data } = await axios.post(
						`${keys.socketUrl}/announcements`,
						announcementData,
					);

					if (data) {
						setOfflineUsers(data?.disconnected_users?.length || 0);
						const online =
							receiverIds.length - data?.disconnected_users?.length || 0;
						setOnlineUsers(online);
						setIsModalOpen(true); // Open the success modal
						setSelectedManager(null); // Clear specific manager selection
						setSelectedRole(''); // Reset checkboxes
						setMessage(''); // Clear the input field after sending

						createUserLog({
							userId: user?._id,
							action: 'CREATE',
							entity: 'Announcement',
							status: 'success',
							message: `${user?.fullName || ''} created an announcement`,
						});
					}
				} else {
					toast.error('Please select the recivers again.');
				}
			} catch (err) {
				console.log(err);
				toast.error('Failed to send announcement.');

				createUserLog({
					userId: user?._id,
					action: 'CREATE',
					entity: 'Announcement',
					status: 'fail',
					message: `Failed to send announcement.`,
				});
			} finally {
				setLoading(false);
			}
		} else {
			toast.error('Please fill in the message and select at least one role.');
		}
	};

	const options = ['all', 'managers', 'agents', 'team'];
	const { getRootProps, getRadioProps } = useRadioGroup({
		name: 'roles',
		value: selectedRole,
		onChange: handleRoleChange,
	});

	const group = getRootProps();

	return (
		<Box
			p={{ base: 4, md: 8, lg: 10 }}
			shadow='md'
			rounded='md'
			background='white'
		>
			<HStack
				mb={4}
				spacing={3}
				bg='brand.200'
				px='4'
				py='4'
				rounded='md'
				shadow='sm'
			>
				<Flex rounded='full' p={{ base: 2, md: 4 }} bg='brand.100'>
					<Icon as={HiSpeakerphone} boxSize={8} color='brand.500' />
				</Flex>
				<Box color='gray.700'>
					<Text
						fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
						fontWeight='extrabold'
					>
						Announcement
					</Text>
					<Text fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}>
						Broadcast important messages to your team or the entire platform.
					</Text>
				</Box>
			</HStack>
			<Box maxWidth={{ base: 'full', md: '1200px' }} mx='auto'>
				<form onSubmit={handleSend}>
					{(hasPermission('announcement', 'all_users') || isManager) && (
						<Textarea
							placeholder='Type your message...'
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							mb={{ base: 2, md: 4 }}
							size='lg'
							fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
							height='60'
							resize='none'
							overflowY='auto'
							focusBorderColor='brand.200'
							backgroundColor='gray.100'
						/>
					)}

					{hasPermission('announcement', 'all_users') ? (
						<>
							<Text fontWeight='bold' mb={{ base: 1, md: 2 }}>
								Send to:
							</Text>
							<HStack
								{...group}
								spacing={{ base: 2, md: 4 }}
								mb={{ base: 2, md: 4 }}
								wrap='wrap'
								gap='2'
							>
								{options.map((value) => {
									const radio = getRadioProps({ value });
									return (
										<RadioCard key={value} {...radio}>
											{value.charAt(0).toUpperCase() + value.slice(1)}
										</RadioCard>
									);
								})}
								<SelectManager
									// selectedRole={selectedRole}
									selectedManager={selectedManager}
									managerList={managers}
									handleManager={handleManager}
									isDisabled={selectedRole !== 'team'}
								/>
							</HStack>
						</>
					) : !isManager ? (
						<Alert status='warning' variant='subtle' borderRadius='md'>
							<AlertIcon />
							You don't have permission to create an announcement.
						</Alert>
					) : null}

					{isManager && !hasPermission('announcement', 'all_users') && (
						<Text mb={{ base: 1, md: 3 }} color='gray.500'>
							Note: Announcement will be sent all agents under you.
						</Text>
					)}

					{(isManager || hasPermission('announcement', 'all_users')) && (
						<Flex justifyContent='flex-end'>
							<Button
								{...buttonStyle}
								colorScheme='brand'
								w={{ base: 'full', md: 'auto' }}
								px={{ base: 6, md: 12 }}
								py={{ base: 3, md: 5 }}
								type='submit'
								isDisabled={
									!message.trim() ||
									(!isManager && !selectedRole) ||
									(selectedRole === 'team' && !selectedManager)
								}
								leftIcon={<Icon as={MdSend} />}
							>
								{loading ? 'Sending...' : 'Send'}
							</Button>
						</Flex>
					)}
				</form>
			</Box>

			{/* Success Modal */}
			<MessageSuccessModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onlineUsers={onlineUsers}
				offlineUsers={offlineUsers}
			/>
		</Box>
	);
};

export default CreateAnnouncement;
