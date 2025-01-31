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

const InterviewScreen = () => {
	const { data: allUsers, isLoading } = useFetchItemsQuery({
		path: `/v2/user/hierarchy/new`,
		params: { type: 'all' },
	});

	const [selectedIds, setSelectedIds] = useState([]);

	console.log({ admins: allUsers?.doc });

	const handleCheckboxChange = (id) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
		);
	};

	const renderUserList = (users) => {
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
				{users?.map((user) => (
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

	if (isLoading) return <Text>Loading...</Text>;

	return (
		<Box p={8} width='700px' mx='auto'>
			<Text fontSize='2xl' fontWeight='bold' mb={4} textAlign='center'>
				Select Interviewers
			</Text>
			<Tabs variant='subtle'>
				<TabList justifyContent='space-between' gap='2' mb={4}>
					{['Admin', 'Manager', 'HR'].map((tabName) => (
						<Tab
							key={tabName}
							flex='1'
							bg='softGray.100'
							border='none'
							borderRadius='10px'
							fontWeight={'normal'}
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
				fontSize='sm'
				fontWeight='normal'
				shadow='sm'
				rounded='md'
				_hover={{ bg: '#E0B960' }}
				_active={{ bg: '#D4AC50' }}
				w='full'
				mt={6}
				onClick={() => console.log(selectedIds)}
				isDisabled={selectedIds.length === 0}
			>
				Send Invite ({selectedIds.length})
			</Button>
		</Box>
	);
};

export default InterviewScreen;
