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
import { memo, useCallback, useMemo, useState } from 'react';
import { useUpdateItemMutation } from 'api/apiSlice';
import { useNavigate } from 'react-router-dom';

const InterviewTabs = memo(
	({
		handleTabChange,
		interview,
		user,
		activeTabIndex,
		isLeadInterviewer,
		interviewRefetch,
		setInterviewersSelected,
	}) => {
		const [hiringData, setHiringData] = useState();
		const [updateItemMutation, { isLoading }] = useUpdateItemMutation();

		// Memoize computed values
		const isInvitedInterviewer = useMemo(
			() => interview?.totalInterviewers > 0,
			[interview?.totalInterviewers]
		);

		// Memoize functions
		const handleHiringInfoSubmit = useCallback(
			async (data) => {
				setHiringData(data);
				handleTabChange(2);
			},
			[handleTabChange]
		);

		const navigate = useNavigate();

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
					: '/';

				navigate(redirectUrl);
			} catch (error) {
				toast.error(error?.data?.message || 'Failed to update interview data');
			}
		};

		return (
			<Box
				display='flex'
				bg='white'
				p={{ base: 4, lg: 8 }}
				rounded='md'
				shadow='sm'
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
							{/* Conditionally render the "Select Interviewers" tab separately if not invited */}
							<Tab
								isDisabled={isInvitedInterviewer}
								_selected={{ bg: 'brand.400', color: 'white' }}
								_focus={{ boxShadow: 'none' }} // Removes focus outline
								rounded='md'
								color={isInvitedInterviewer ? 'gray.500' : 'gray.800'}
								width='full'
							>
								<HStack>
									<LuUsers />
									<Text>Select Interviewers</Text>
								</HStack>
							</Tab>

							{/* Other tabs */}
							{[
								{ label: 'Hiring Info', icon: LuFileText },
								{ label: 'Evaluation Points', icon: LuCheckSquare },
							].map((tab, index) => (
								<Tab
									key={index}
									isDisabled={!isInvitedInterviewer} // Disable all tabs if not invited
									_selected={{ bg: 'brand.400', color: 'white' }}
									_focus={{ boxShadow: 'none' }} // Removes focus outline
									rounded='md'
									width='full'
								>
									<HStack>
										<tab.icon />
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
									interviewRefetch={interviewRefetch}
									setInterviewersSelected={setInterviewersSelected}
									handleTabChange={handleTabChange}
								/>
							</TabPanel>
							<TabPanel bg='softGray.100' p={{ base: 4, md: 8 }} rounded='md'>
								<HiringInfo
									interview={interview}
									hiringData={hiringData}
									setHiringData={setHiringData}
									onSubmit={handleHiringInfoSubmit}
								/>
							</TabPanel>

							<TabPanel bg='softGray.100' p={{ base: 4, md: 8 }} rounded='md'>
								<EvaluationPoints
									onSubmit={handleSubmit}
									isLeadInterviewer={isLeadInterviewer}
								/>
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
	}
);

export default InterviewTabs;
