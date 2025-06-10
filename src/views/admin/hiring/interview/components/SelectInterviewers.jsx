import { useFetchItemsQuery } from 'api/apiSlice';
import React, { useEffect, useMemo, useState } from 'react';
import {
	Box,
	Button,
	Checkbox,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	VStack,
} from '@chakra-ui/react';
import Loader from 'components/loading/Loader';
import axios from 'axios';
import keys from 'config/keys';
import { toast } from 'react-toastify';
import { useUpdateItemMutation } from 'api/apiSlice';
import { useNavigate } from 'react-router-dom';
import SelectInterviewOwner from './SelectInterviewOwner';

const SelectInterviewers = ({
	interview,
	user,
	handleTabChange,
	interviewRefetch,
	isInvitedInterviewer,
}) => {
	const { data: allUsers, isLoading: usersLoading } = useFetchItemsQuery({
		path: `/v2/user/hierarchy/new`,
		params: { type: 'all' },
	});

	const navigate = useNavigate();

	useEffect(() => {
		if (isInvitedInterviewer && interview?._id) {
			navigate(`/hiring/interview/${interview._id}?phase=evaluation-points`);
		}
	}, [interview._id, isInvitedInterviewer, navigate]);

	const [updateItemMutation, { isLoading: updatingInterview }] =
		useUpdateItemMutation();

	const userRole = user?.roles[0]?.roleName || user?.role;

	const [selectedIds, setSelectedIds] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [isModalOpen, setModalOpen] = useState(false);
	const [selectedInterviewer, setSelectedInterviewer] = useState(null);

	const handleSelectOwner = (id) => setSelectedInterviewer(id);

	const combinedUsers = useMemo(() => {
		const userGroups = [
			allUsers?.doc?.managers,
			allUsers?.doc?.admins,
			allUsers?.doc?.hrStaff,
		];
		return userGroups.flat().filter(Boolean);
	}, [allUsers]);

	const handleSelectUser = (id) => {
		const selectedUser = combinedUsers.find((u) => u?._id === id);
		if (!selectedUser) {
			console.warn(`User with id ${id} not found in combinedUsers`);
			return;
		}

		setSelectedUsers((prev) => {
			// Prevent duplicates
			const exists = prev.some((u) => u._id === id);
			if (exists) return prev;

			// Add user at the top
			return [selectedUser, ...prev];
		});
	};

	const handleCheckboxChange = (id) => {
		setSelectedIds((prev) => {
			const isSelected = prev.includes(id);
			if (isSelected) {
				// ✅ user is unchecked → remove from selectedUsers
				setSelectedUsers((users) => users.filter((u) => u._id !== id));
				return prev.filter((item) => item !== id);
			} else {
				// ✅ user is checked → add to selectedUsers
				handleSelectUser(id);
				return [...prev, id];
			}
		});
	};

	// console.log(selectedUsers);

	const handleSelectInterviewerClose = () => {
		setModalOpen(false);
		setSelectedInterviewer(null);
	};

	const renderUserList = (users) => {
		const filteredUsers = users.filter((item) => item._id !== user._id);
		return (
			<VStack
				// spacing={4}
				px={2}
				align='stretch'
				scrollBehavior='smooth'
				maxHeight='500px' // Set a custom height for the container
				overflowY='auto' // Enable vertical scrolling
				sx={{
					'&::-webkit-scrollbar': {
						width: '6px', // Custom scrollbar width
					},
					'&::-webkit-scrollbar-thumb': {
						background: 'brand.300', // Custom brand color (adjust according to your theme)
						borderRadius: '8px',
					},
					'&::-webkit-scrollbar-thumb:hover': {
						background: 'brand.400', // Slightly darker on hover
					},
				}}
			>
				{filteredUsers?.map((user) => (
					<Box
						key={user._id}
						display='flex'
						alignItems='center'
						justifyContent='space-between'
						p={2}
						borderWidth='1px'
						borderRadius='md'
						boxShadow='sm'
						bg='#F8FAFC'
					>
						<Checkbox
							isChecked={selectedIds.includes(user._id)}
							onChange={() => handleCheckboxChange(user._id)}
							colorScheme='brand'
							size='lg' // Increased size
							_focus={{
								boxShadow: 'none', // Removed focus outline
							}}
						>
							<Box>
								<Text fontSize='md'>{user.name}</Text>
								<Text fontSize='sm' color='gray.500'>
									{user.email}
								</Text>
							</Box>
						</Checkbox>
					</Box>
				))}
			</VStack>
		);
	};

	// console.log({ selectedIds, selectedInterviewer });

	// const getSenderName = (id) => {
	// 	return combinedUsers.find((user) => user._id === id)?.name;
	// };

	const handleSendInvite = async (selectedIds) => {
		try {
			if (selectedIds.length > 0) {
				if (!selectedInterviewer) {
					handleSelectUser(user._id);
					setSelectedInterviewer(user._id);
					return setModalOpen(true);
				} else setModalOpen(false);

				const receiverIds =
					selectedInterviewer !== user._id
						? [...selectedIds, user._id]
						: selectedIds;

				const sender_name = user?.fullName;

				const interviewData = {
					sender_id: selectedInterviewer,
					sender_name,
					sender_role: userRole,
					receiver_ids: receiverIds,
					interview_id: interview._id,
					candidate_name: interview?.candidate?.name,
					candidate_job_type: interview?.candidate?.position.name,
				};

				const { data } = await axios.post(
					`${keys.socketUrl}/interview_invite`,
					interviewData
				);

				await updateItemMutation({
					path: `/interviews/${interview._id}`,
					body: {
						interviewers: receiverIds,
						leadInterviewer: selectedInterviewer,
					},
				}).unwrap();

				toast.success('Interview invite sent successfully.');

				// if selected interviewer is another user then redirect to default page
				if (selectedInterviewer !== user._id) {
					return navigate('/hiring');
				}
				// Else if user is own owner of interview then move to next tab
				else handleTabChange(1);
			} else {
				await updateItemMutation({
					path: `/interviews/${interview._id}`,
					body: { interviewers: [user._id], leadInterviewer: user._id },
				}).unwrap();
				handleTabChange(1);
			}

			// Refetch the interview data
			interviewRefetch();
		} catch (err) {
			console.log(err);
			toast.error('Failed to send announcement.');
		}
	};

	return usersLoading ? (
		<Loader />
	) : (
		<Box>
			<Text
				fontSize={{ base: 'xl', md: '2xl' }}
				fontWeight='bold'
				mb={4}
				textAlign='center'
			>
				Select Interviewers
			</Text>

			<Tabs variant='subtle'>
				<TabList justifyContent='space-between' gap={2} mb={4}>
					{['Admin', 'Manager', 'HR'].map((tabName, index) => (
						<Tab
							key={index}
							flex='1'
							bg='softGray.100'
							border='none'
							borderRadius='10px'
							fontWeight='normal'
							_selected={{
								bg: 'brand.300',
								color: 'gray.800',
								borderRadius: '10px',
							}}
							_focus={{
								boxShadow: 'none', // Removes the focus ring
							}}
						>
							{tabName}
						</Tab>
					))}
				</TabList>
				<TabPanels bg='softGray.100' p={4} rounded='md'>
					<TabPanel>{renderUserList(allUsers?.doc?.admins)}</TabPanel>
					<TabPanel>{renderUserList(allUsers?.doc?.managers)}</TabPanel>
					<TabPanel>{renderUserList(allUsers?.doc?.hrStaff)}</TabPanel>
				</TabPanels>
			</Tabs>

			<Button
				bg='#EDC270'
				color='gray.800'
				fontSize={{ base: 'sm', md: 'md' }}
				fontWeight='normal'
				shadow='sm'
				rounded='md'
				_hover={{ bg: '#E0B960' }}
				_active={{ bg: '#D4AC50' }}
				w='full'
				mt={6}
				onClick={() => handleSendInvite(selectedIds)}
			>
				{updatingInterview
					? 'Updating...'
					: selectedIds.length === 0
						? 'Skip'
						: `Send Invite (${selectedIds.length})`}
			</Button>

			{isModalOpen && (
				<SelectInterviewOwner
					isOpen={isModalOpen}
					onClose={handleSelectInterviewerClose}
					users={selectedUsers}
					selectedId={selectedInterviewer}
					onSelect={handleSelectOwner}
					onConfirm={() => handleSendInvite(selectedIds)}
				/>
			)}
		</Box>
	);
};

export default SelectInterviewers;
