import { useFetchItemsQuery } from 'api/apiSlice';
import React, { useState } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import CandidateCard from '../candidates/components/CandidateCard';

const SelectInterviewers = () => {
	const { interviewId } = useParams();

	const { data: interview, isLoading: interviewLoading } = useFetchItemsQuery({
		path: `/interviews/${interviewId}`,
	});

	const { data: allUsers, isLoading: usersLoading } = useFetchItemsQuery({
		path: `/v2/user/hierarchy/new`,
		params: { type: 'all' },
	});

	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem('user'));
	const userRole = user?.roles[0]?.roleName || user?.role;

	const [selectedIds, setSelectedIds] = useState([]);

	const handleCheckboxChange = (id) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
		);
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
						key={user.id}
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

	const handleSendInvite = async (selectedIds) => {
		try {
			if (selectedIds.length > 0) {
				const sender_name = `${user.firstName} ${user.lastName}`;
				const interviewData = {
					sender_id: user._id,
					sender_name,
					sender_role: userRole,
					receiver_ids: selectedIds,
					interview_id: interviewId,
					candidate_name: interview?.doc?.candidate?.name,
					candidate_job_type: interview?.doc?.candidate?.position,
				};

				console.log({ interviewData });

				const { data } = await axios.post(
					`${keys.socketUrl}/interview_invite`,
					interviewData
				);

				console.log(data);
				toast.success('Interview invite sent successfully.');
				navigate(`/hiring/interview/${interviewId}/hiring-info`);
			} else {
				toast.error('Please select the recivers again.');
			}
		} catch (err) {
			console.log(err);
			toast.error('Failed to send announcement.');
		} finally {
			// setLoading(false);
		}
	};

	return usersLoading || interviewLoading ? (
		<Loader />
	) : (
		<Box p={{ base: 4, md: 8 }} width={{ base: '100%', md: '700px' }} mx='auto'>
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
					{['Admin', 'Manager', 'HR'].map((tabName) => (
						<Tab
							key={tabName}
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
				fontSize={{ base: 'xs', md: 'sm' }}
				fontWeight='normal'
				shadow='sm'
				rounded='md'
				_hover={{ bg: '#E0B960' }}
				_active={{ bg: '#D4AC50' }}
				w='full'
				mt={6}
				onClick={() => handleSendInvite(selectedIds)}
				isDisabled={selectedIds.length === 0}
			>
				Send Invite ({selectedIds.length})
			</Button>
		</Box>
	);
};

export default SelectInterviewers;
