import { memo, useState } from 'react';
import {
	Box,
	Button,
	Icon,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from '@chakra-ui/react';
import InvitedData from './InvitedData';
import ShortListedData from './ShortListedData';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { useFetchItemsQuery } from 'api/apiSlice';

import Loader from 'components/loading/Loader';
import MeetingSection from './components/MeetingSection';
import PendingInvitedData from './PendingInvitedData';

const ShortListedCandidates = memo(() => {
	const [activeTab, setActiveTab] = useState(0);

	const {
		data: invitedCandidates,
		isLoading: invitedCandidatesLoading,
		refetch: invitedRefetch,
	} = useFetchItemsQuery({
		path: `/applications/invited-candidates`,
		params: {
			sort: 'interviewDate',
			limit: 4,
		},
	});

	const navigate = useNavigate();

	const tabData = [
		{
			title: 'Short Listed',
			component: <ShortListedData invitedRefetch={invitedRefetch} />,
		},
		{ title: 'Invited Candidates', component: <InvitedData /> },
		{
			title: 'Old Pending Interviews',
			component: <PendingInvitedData invitedRefetch={invitedRefetch} />,
		},
	];

	return invitedCandidatesLoading ? (
		<Loader />
	) : (
		<Box>
			<Button
				colorScheme='gray'
				borderRadius='5px'
				size={{ base: 'sm', md: 'md' }}
				px={{ base: 4, md: 6 }}
				py={{ base: 2, md: 3 }}
				fontSize={{ base: 'sm', md: 'md' }}
				leftIcon={<Icon as={IoArrowBack} boxSize={4} />}
				onClick={() => navigate('/hiring')}
				mb={4}
			>
				Back
			</Button>

			<MeetingSection
				invitedCandidates={invitedCandidates}
				refetch={invitedRefetch}
				setActiveTab={setActiveTab}
			/>

			{/* <Box>
				<Box display='flex' mb={2}>
					<Button
						onClick={() => handleTabChange(0)}
						colorScheme={activeTab === 0 ? 'brand' : 'gray'}
						bg={activeTab === 0 ? 'brand.500' : 'white'}
						color={activeTab === 0 ? 'white' : 'gray.800'}
						_focus={{ outline: 'none' }}
						mr={4}
						transition='background-color 0.1s ease, color 0.1s ease'
						borderRadius='5px'
						_hover={{
							bg: activeTab === 0 ? 'brand.600' : 'gray.100',
							color: activeTab === 0 ? 'white' : 'gray.800',
						}}
						fontWeight='normal'
					>
						Short Listed
					</Button>
					<Button
						onClick={() => handleTabChange(1)}
						colorScheme={activeTab === 1 ? 'brand' : 'gray'}
						bg={activeTab === 1 ? 'brand.500' : 'white'}
						color={activeTab === 1 ? 'white' : 'gray.800'}
						_focus={{ outline: 'none' }}
						borderRadius='5px'
						transition='background-color 0.1s ease, color 0.1s ease'
						_hover={{
							bg: activeTab === 1 ? 'brand.600' : 'gray.100',
							color: activeTab === 1 ? 'white' : 'gray.800',
						}}
						fontWeight='normal'
					>
						Invited Candidates
					</Button>
					<Button
						onClick={() => handleTabChange(3)}
						colorScheme={activeTab === 1 ? 'brand' : 'gray'}
						bg={activeTab === 1 ? 'brand.500' : 'white'}
						color={activeTab === 1 ? 'white' : 'gray.800'}
						_focus={{ outline: 'none' }}
						borderRadius='5px'
						transition='background-color 0.1s ease, color 0.1s ease'
						_hover={{
							bg: activeTab === 1 ? 'brand.600' : 'gray.100',
							color: activeTab === 1 ? 'white' : 'gray.800',
						}}
						fontWeight='normal'
					>
						Pending Invited Candidates
					</Button>
				</Box>

				
				{activeTab === 0 ? (
					<ShortListedData invitedRefetch={invitedRefetch} />
				) : activeTab === 1 ? (
					<InvitedData />
				) : (
					<PendingInvitedData />
				)}
			</Box> */}

			<Tabs
				// bg='transparent'
				index={activeTab}
				onChange={setActiveTab}
				variant='soft-rounded'
			>
				<TabList width='fit-content' px='4' gap='2'>
					{tabData.map((tab, index) => (
						<Tab
							key={index}
							bg={activeTab !== index && 'white'}
							color={activeTab !== index && 'gray.800'}
							_selected={{ bg: 'brand.400', color: 'white' }}
							_focus={{ boxShadow: 'none' }}
							rounded='md'
							shadow='sm'
							fontSize='lg'
							fontWeight='normal'
						>
							{tab.title}
						</Tab>
					))}
				</TabList>

				<TabPanels>
					{tabData.map((tab, index) => (
						<TabPanel key={index}>{tab.component}</TabPanel>
					))}
				</TabPanels>
			</Tabs>
		</Box>
	);
});

export default ShortListedCandidates;
