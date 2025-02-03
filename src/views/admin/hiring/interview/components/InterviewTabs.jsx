import {
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Box,
	HStack,
	Text,
} from '@chakra-ui/react';
import { LuUsers, LuFileText, LuCheckSquare } from 'react-icons/lu';
import SelectInterviewers from './SelectInterviewers';
import HiringInfo from './HiringInfo';
import EvaluationPoints from './EvaluationPoints';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useUpdateItemMutation } from 'api/apiSlice';
import { useNavigate } from 'react-router-dom';

const InterviewTabs = ({
	handleTabChange,
	interview,
	user,
	activeTabIndex,
	isLeadInterviewer,
}) => {
	const [hiringData, setHiringData] = useState();
	const [updateItemMutation, { isLoading }] = useUpdateItemMutation();

	const navigate = useNavigate();

	const handleHiringInfoSubmit = async (data) => {
		setHiringData(data);
		handleTabChange(2);
	};

	const handleSubmit = async (data) => {
		try {
			let interviewData = {};
			if (isLeadInterviewer) {
				// check hiring information is filled or not
				if (!hiringData) {
					return toast.error('Please fill hiring info first');
				}

				interviewData = {
					hiringData,
					evaluationData: data,
				};
			} else {
				interviewData = { evaluationData: data };
			}

			await updateItemMutation({
				path: `/interviews/${interview._id}`,
				body: interviewData,
			}).unwrap();

			toast.success('Interview data updated successfully');

			// Redirect to the appropriate page based on the interviewer
			const redirectUrl = isLeadInterviewer
				? '/hiring/interviewed-candidates'
				: '/hiring';

			navigate(redirectUrl);
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to update interview data');
		}
	};

	return (
		<Box
			display='flex'
			justifyContent='center'
			width='full'
			alignItems='center'
		>
			{isLeadInterviewer ? (
				<Tabs
					colorScheme='brand'
					variant='enclosed'
					onChange={handleTabChange}
					index={activeTabIndex}
					width={{ base: 'full', md: '700px' }}
				>
					{/* Tab List */}
					<TabList
						bg='softGray.100'
						width='full'
						mx='auto'
						py='2'
						px='4'
						rounded='md'
						shadow='sm'
					>
						{[
							{ label: 'Select Interviewers', icon: LuUsers },
							{ label: 'Hiring Info', icon: LuFileText },
							{ label: 'Evaluation Points', icon: LuCheckSquare },
						].map((tab, index) => (
							<Tab
								key={index}
								_selected={{ bg: 'brand.400', color: 'white' }}
								_focus={{ boxShadow: 'none' }} // Removes focus outline
								rounded='md'
								width='full'
							>
								<HStack>
									{<tab.icon />}
									<Text>{tab.label}</Text>
								</HStack>
							</Tab>
						))}
					</TabList>

					{/* Tab Panels */}
					<TabPanels
						p={{ base: 4, md: 8 }}
						width={{ base: '100%', md: '700px' }}
						mx='auto'
					>
						<TabPanel p={{ base: 4, md: 8 }}>
							<SelectInterviewers
								user={user}
								interview={interview}
								handleTabChange={handleTabChange}
							/>
						</TabPanel>
						<TabPanel bg='softGray.100' p={{ base: 4, md: 8 }} rounded='md'>
							<HiringInfo
								hiringData={hiringData}
								setHiringData={setHiringData}
								onSubmit={handleHiringInfoSubmit}
							/>
						</TabPanel>

						<TabPanel bg='softGray.100' p={{ base: 4, md: 8 }} rounded='md'>
							<EvaluationPoints onSubmit={handleSubmit} />
						</TabPanel>
					</TabPanels>
				</Tabs>
			) : (
				<Box
					width={{ base: '100%', md: '700px' }}
					bg='softGray.100'
					p={{ base: 4, md: 8 }}
					mx='auto'
					rounded='md'
				>
					<EvaluationPoints onSubmit={handleSubmit} />
				</Box>
			)}
		</Box>
	);
};

export default InterviewTabs;
